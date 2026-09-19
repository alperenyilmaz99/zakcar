import https from "https";
import { URL } from "url";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ZakCarBot/1.0)" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetch(new URL(res.headers.location, url).href).then(resolve).catch(reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h([1-6])>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function rebrand(text) {
  return text
    .replace(/SAW Rent A Car/gi, "Zakcar")
    .replace(/SAW Rent a Car/gi, "Zakcar")
    .replace(/Saw Rent A Car/gi, "Zakcar")
    .replace(/Saw Rent a Car/gi, "Zakcar")
    .replace(/SAW Rentacar/gi, "Zakcar")
    .replace(/Saw Rentacar/gi, "Zakcar")
    .replace(/SAW RC/gi, "Zakcar")
    .replace(/\bSAW Rent\b/gi, "Zakcar")
    .replace(/www\.sawrentacar\.com/gi, "zakcar.com")
    .replace(/sawrentacar\.com/gi, "zakcar.com");
}

function meta(html, prop) {
  const re1 = new RegExp(
    `<meta[^>]*(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const re2 = new RegExp(
    `content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`,
    "i"
  );
  return decodeEntities((html.match(re1) || html.match(re2) || [])[1] || "");
}

/** Extract inner HTML of first element matching class token */
function extractByClass(html, className) {
  const re = new RegExp(
    `<div[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`,
    "i"
  );
  const m = re.exec(html);
  if (!m) return "";
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return html.slice(m.index + m[0].length, nextClose);
      i = nextClose + 6;
    }
  }
  return "";
}

function cleanTitle(raw) {
  return rebrand(
    raw
      .replace(/\s*[-|–]\s*(Saw|SAW).*$/i, "")
      .replace(/\s*[-|–]\s*Zakcar.*$/i, "")
      .trim()
  );
}

function htmlToBlocks(bodyHtml) {
  const blocks = [];
  const re = /<(h[2-4]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(bodyHtml))) {
    const tag = m[1].toLowerCase();
    const text = stripTags(m[2]).trim();
    if (!text || text.length < 8) continue;
    if (/^(Anasayfa|Blog|İncele|Paylaş)$/i.test(text)) continue;
    if (tag.startsWith("h")) {
      blocks.push({ type: "heading", level: Number(tag[1]), text: rebrand(text) });
    } else if (tag === "li") {
      blocks.push({ type: "listItem", text: rebrand(text) });
    } else {
      blocks.push({ type: "paragraph", text: rebrand(text) });
    }
  }
  return blocks;
}

function extractImage(detailHtml, pageHtml) {
  const img =
    detailHtml.match(/<img[^>]+src=["']([^"']+)["']/i) ||
    pageHtml.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    pageHtml.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (!img) return "";
  let src = img[1];
  if (src.includes("getDummy") || src.includes("opengraph")) {
    // Prefer real blog image from detail
    const real = detailHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (real) src = real[1];
  }
  if (!src || src.includes("getDummy")) return "";
  if (src.startsWith("//")) return "https:" + src;
  if (src.startsWith("/")) return "https://www.sawrentacar.com" + src;
  return src;
}

async function collectSlugs() {
  const all = new Set();
  for (let p = 1; p <= 10; p++) {
    const url = p === 1 ? "https://www.sawrentacar.com/blog" : `https://www.sawrentacar.com/blog/${p}`;
    const html = await fetch(url);
    const re = /href="(\/blog\/[a-z0-9-]+)"/g;
    let m;
    let found = 0;
    while ((m = re.exec(html))) {
      if (!/^\/blog\/\d+$/.test(m[1])) {
        all.add(m[1]);
        found++;
      }
    }
    console.log(`listing ${p}: +${found} (unique ${all.size})`);
    if (found === 0 && p > 1) break;
  }
  return [...all];
}

async function scrapePost(slugPath) {
  const url = `https://www.sawrentacar.com${slugPath}`;
  const html = await fetch(url);
  const detail = extractByClass(html, "blog_detail_content") || extractByClass(html, "blog_detail");
  const title =
    cleanTitle(meta(html, "og:title")) ||
    cleanTitle((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");

  const blocks = htmlToBlocks(detail);
  const image = extractImage(detail, html);
  const excerpt = rebrand(
    meta(html, "description") ||
      meta(html, "og:description") ||
      (blocks.find((b) => b.type === "paragraph")?.text.slice(0, 180) || "")
  );

  return {
    slug: slugPath.replace(/^\/blog\//, ""),
    title,
    excerpt: excerpt.slice(0, 220),
    image,
    blocks,
  };
}

async function main() {
  const slugs = await collectSlugs();
  console.log(`\nScraping ${slugs.length} posts...\n`);

  const posts = [];
  for (const s of slugs) {
    try {
      const post = await scrapePost(s);
      const ok = post.blocks.length > 0 && post.title.length > 3;
      console.log(`${ok ? "✓" : "✗"} ${post.slug} — ${post.blocks.length} blocks — ${post.title}`);
      if (ok) posts.push(post);
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      console.error(`✗ ${s}:`, e.message);
    }
  }

  posts.sort((a, b) => a.title.localeCompare(b.title, "tr"));

  const outDir = path.join(__dirname, "..", "src", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "blog-posts.json");
  fs.writeFileSync(outPath, JSON.stringify(posts, null, 2), "utf8");
  console.log(`\nWrote ${posts.length} posts → ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
