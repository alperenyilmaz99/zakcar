import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");
const publicDir = path.join(webRoot, "public");

const COPY_DIRS = [
  [path.join(repoRoot, "assets", "images", "vehicles"), "assets/images/vehicles"],
  [path.join(repoRoot, "assets", "images", "cdn"), "assets/images/cdn"],
  [path.join(webRoot, "public", "assets", "zakcar"), "assets/zakcar"],
  [path.join(repoRoot, "legacy", "static-site", "assets", "zakcar"), "assets/zakcar"],
  [path.join(repoRoot, "site", "assets", "zakcar"), "assets/zakcar"],
];

const COPY_FILES = [
  [path.join(repoRoot, "legacy", "static-site", "favicon.ico"), "favicon.ico"],
  [path.join(repoRoot, "site", "favicon.ico"), "favicon.ico"],
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
  return true;
}

console.log("Syncing assets → web/public/ ...");
let copied = 0;

for (const [src, rel] of COPY_DIRS) {
  if (copyRecursive(src, path.join(publicDir, rel))) {
    console.log(`  ✓ ${rel}`);
    copied++;
  }
}

for (const [src, rel] of COPY_FILES) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(publicDir, { recursive: true });
    fs.copyFileSync(src, path.join(publicDir, rel));
    console.log(`  ✓ ${rel}`);
    copied++;
  }
}

// ZakCar logo fallback download path
const logoPath = path.join(publicDir, "assets/zakcar/logo-wordmark.png");
if (!fs.existsSync(logoPath)) {
  console.warn("  ⚠ logo-wordmark.png missing — add ZakCar brand assets");
}

console.log(copied ? "Done." : "No sources found (public/ may already be populated).");
