import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "src", "data", "blog-posts.json");
const imgDir = path.join(__dirname, "..", "public", "assets", "blog");

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 20000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          return download(res.headers.location, dest).then(resolve);
        }
        if (res.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          console.log("fail", res.statusCode, url);
          return resolve(false);
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      })
      .on("error", (e) => {
        try { fs.unlinkSync(dest); } catch {}
        console.log("err", e.message, url);
        resolve(false);
      });
  });
}

async function main() {
  fs.mkdirSync(imgDir, { recursive: true });
  const posts = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  for (const post of posts) {
    if (!post.image) continue;
    // Fix wrongly rebranded image host
    let url = post.image
      .replace("https://zakcar.com/", "https://www.sawrentacar.com/")
      .replace("https://www.zakcar.com/", "https://www.sawrentacar.com/");

    if (!url.includes("sawrentacar.com")) continue;

    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname) || ".jpg";
    const localName = `${post.slug}${ext}`;
    const dest = path.join(imgDir, localName);

    if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
      const ok = await download(url, dest);
      console.log(ok ? `✓ ${localName}` : `✗ ${post.slug}`);
      if (ok) post.image = `/assets/blog/${localName}`;
      else post.image = "";
    } else {
      post.image = `/assets/blog/${localName}`;
      console.log(`= ${localName}`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), "utf8");
  console.log("done");
}

main();
