import https from "https";
import { URL } from "url";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "src", "data", "blog-posts.json");
const imgDir = path.join(__dirname, "..", "public", "assets", "blog");

const SLUG_MAP = {
  "enuygun-vs-direkt-rezervasyon-arac-kiralamada-hangisi-avantagejli": null,
  "enuygun-vs-direkt-rezervasyon-arac-kiralamada-hangisi-avantajli":
    "enuygun-vs-direkt-rezervasyon-arac-kiralamada-hangisi-avantajli",
  "gurbetci-rehberi-arac-kiralama-2026": "gurbetci-rehberi-arac-kiralama-2026",
  "havalimani-arac-teslim-rehberi-2026": "havalimani-arac-teslim-rehberi-2026",
  "sixt-istanbul-vs-zakcar-premium-arac-kiralama-karsilastirmasi-2026":
    "sixt-istanbul-vs-saw-rent-a-car-premium-arac-kiralama-karsilastirmasi-2026",
  "yolcu360-vs-zakcar-hangisi-daha-avantajli-2026-karsilastirma":
    "yolcu360-vs-saw-rent-a-car-hangisi-daha-avantajli-2026-karsilastirma",
};

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ZakCarBot/1.0)" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetch(new URL(res.headers.location, url).href).then(resolve).catch(reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
      })
      .on("error", reject);
  });
}

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 30000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          return download(res.headers.location, dest).then(resolve);
        }
        if (res.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          return resolve(false);
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      })
      .on("error", () => {
        try { fs.unlinkSync(dest); } catch {}
        resolve(false);
      });
  });
}

function extractByClass(html, className) {
  const re = new RegExp(`<div[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "i");
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

function findImages(html, detail) {
  const found = [];
  const sources = [detail, html];
  for (const src of sources) {
    const re = /(?:src|content)=["']([^"']+\.(?:png|jpe?g|webp|gif)[^"']*)["']/gi;
    let m;
    while ((m = re.exec(src))) {
      let u = m[1];
      if (u.includes("getDummy") || u.includes("opengraph") || u.includes("logo") || u.includes("flag") || u.includes("icon")) continue;
      if (u.startsWith("//")) u = "https:" + u;
      if (u.startsWith("/")) u = "https://www.sawrentacar.com" + u;
      if (!u.startsWith("http")) continue;
      if (!found.includes(u)) found.push(u);
    }
  }
  // Prefer /dosya/ or /blog/ paths
  found.sort((a, b) => {
    const score = (u) => (/\/dosya\/|\/blog\//.test(u) ? 0 : 1);
    return score(a) - score(b);
  });
  return found;
}

async function main() {
  fs.mkdirSync(imgDir, { recursive: true });
  const posts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const missing = posts.filter((p) => !p.image);

  console.log(`Missing images: ${missing.length}\n`);

  for (const post of missing) {
    const remoteSlug = SLUG_MAP[post.slug] || post.slug;
    const url = `https://www.sawrentacar.com/blog/${remoteSlug}`;
    console.log(`→ ${post.slug}`);
    console.log(`  fetch ${url}`);

    try {
      const { status, body } = await fetch(url);
      console.log(`  status ${status}`);
      const detail = extractByClass(body, "blog_detail_img") || extractByClass(body, "blog_detail_content") || extractByClass(body, "blog_detail");
      const imgs = findImages(body, detail);
      console.log(`  candidates: ${imgs.length}`);
      imgs.slice(0, 5).forEach((u) => console.log(`    ${u}`));

      let saved = false;
      for (const imgUrl of imgs) {
        const ext = path.extname(new URL(imgUrl).pathname) || ".jpg";
        const localName = `${post.slug}${ext}`;
        const dest = path.join(imgDir, localName);
        const ok = await download(imgUrl, dest);
        if (ok && fs.statSync(dest).size > 2000) {
          post.image = `/assets/blog/${localName}`;
          console.log(`  ✓ saved ${localName} (${fs.statSync(dest).size} bytes)`);
          saved = true;
          break;
        }
        try { fs.unlinkSync(dest); } catch {}
      }
      if (!saved) console.log(`  ✗ no usable image`);
    } catch (e) {
      console.log(`  err ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), "utf8");
  const still = posts.filter((p) => !p.image);
  console.log(`\nDone. Still missing: ${still.length}`);
  still.forEach((p) => console.log(" -", p.slug));
}

main();
