import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "src", "data", "blog-posts.json");
const imgDir = path.join(__dirname, "..", "public", "assets", "blog");

const NAMED = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  lt: "<",
  gt: ">",
  aacute: "á",
  eacute: "é",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  agrave: "à",
  egrave: "è",
  igrave: "ì",
  ograve: "ò",
  ugrave: "ù",
  acirc: "â",
  ecirc: "ê",
  icirc: "î",
  ocirc: "ô",
  ucirc: "û",
  auml: "ä",
  euml: "ë",
  iuml: "ï",
  ouml: "ö",
  uuml: "ü",
  Auml: "Ä",
  Ouml: "Ö",
  Uuml: "Ü",
  ccedil: "ç",
  Ccedil: "Ç",
  szlig: "ß",
  ndash: "–",
  mdash: "—",
  lsquo: "'",
  rsquo: "'",
  ldquo: '"',
  rdquo: '"',
  hellip: "…",
  trade: "™",
  copy: "©",
  reg: "®",
  deg: "°",
  times: "×",
  divide: "÷",
  euro: "€",
  pound: "£",
};

function decodeEntities(text) {
  return text
    .replace(/&([a-zA-Z]+);/g, (m, name) => (NAMED[name] !== undefined ? NAMED[name] : m))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function rebrand(text) {
  return decodeEntities(text)
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

function cleanTitle(title) {
  return rebrand(title)
    .replace(/\s*Sabiha Gökçen Havalimanı Araç Kiralama\s*I\s*İstanbul Havalimanı Araç Kiralama\s*/gi, "")
    .replace(/\s*[-|–]\s*Zakcar\s*$/i, "")
    .trim();
}

function download(url, dest) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith("http")) return resolve(false);
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
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

function walkRebrand(value) {
  if (typeof value === "string") return rebrand(value);
  if (Array.isArray(value)) return value.map(walkRebrand);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = walkRebrand(v);
    return out;
  }
  return value;
}

async function main() {
  fs.mkdirSync(imgDir, { recursive: true });
  let posts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  posts = walkRebrand(posts);

  for (const post of posts) {
    post.title = cleanTitle(post.title);
    post.excerpt = cleanTitle(post.excerpt || "");
    if (post.blocks) {
      post.blocks = post.blocks
        .map((b) => ({ ...b, text: rebrand(b.text || "") }))
        .filter((b) => {
          const t = b.text;
          // drop nav/footer noise
          if (/ÇAĞRI MERKEZİ|Uygun araçlar yükleniyor|Çerez Tercihleri/i.test(t)) return false;
          if (t.length < 5) return false;
          return true;
        });
    }

    if (post.image && post.image.includes("sawrentacar.com")) {
      const ext = path.extname(new URL(post.image).pathname) || ".jpg";
      const localName = `${post.slug}${ext}`;
      const dest = path.join(imgDir, localName);
      if (!fs.existsSync(dest)) {
        const ok = await download(post.image, dest);
        console.log(ok ? `img ✓ ${localName}` : `img ✗ ${post.slug}`);
        if (ok) post.image = `/assets/blog/${localName}`;
        else post.image = "";
      } else {
        post.image = `/assets/blog/${localName}`;
      }
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), "utf8");

  const saw = posts.filter((p) => /SAW Rent|Saw Rent|sawrentacar/i.test(JSON.stringify(p)));
  console.log(`\nCleaned ${posts.length} posts`);
  console.log(`Still mentioning SAW brand: ${saw.length}`);
  console.log("Titles sample:");
  posts.slice(0, 8).forEach((p) => console.log(" -", p.title));
}

main();
