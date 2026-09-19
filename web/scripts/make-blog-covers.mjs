import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "src", "data", "blog-posts.json");
const imgDir = path.join(__dirname, "..", "public", "assets", "blog");

const COVERS = [
  {
    slug: "enuygun-vs-direkt-rezervasyon-arac-kiralamada-hangisi-avantajli",
    lines: ["Enuygun vs Direkt", "Rezervasyon"],
    accent: "#0ea5e9",
  },
  {
    slug: "gurbetci-rehberi-arac-kiralama-2026",
    lines: ["Gurbetçi Araç", "Kiralama Rehberi", "2026"],
    accent: "#2563eb",
  },
  {
    slug: "havalimani-arac-teslim-rehberi-2026",
    lines: ["Havalimanı Araç", "Teslim Rehberi", "2026"],
    accent: "#1d4ed8",
  },
  {
    slug: "sixt-istanbul-vs-zakcar-premium-arac-kiralama-karsilastirmasi-2026",
    lines: ["Sixt İstanbul", "vs Zakcar"],
    accent: "#1e40af",
  },
  {
    slug: "yolcu360-vs-zakcar-hangisi-daha-avantajli-2026-karsilastirma",
    lines: ["Yolcu360", "vs Zakcar"],
    accent: "#0369a1",
  },
];

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeSvg({ lines, accent }) {
  const titleYs = lines.map((_, i) => 210 + i * 52);
  const titleTspans = lines
    .map(
      (line, i) =>
        `<text x="80" y="${titleYs[i]}" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="700">${escapeXml(line)}</text>`
    )
    .join("\n  ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <path d="M0 0 L520 0 L280 675 L0 675 Z" fill="url(#shine)"/>
  <circle cx="980" cy="120" r="180" fill="#ffffff" fill-opacity="0.06"/>
  <circle cx="1080" cy="520" r="220" fill="#ffffff" fill-opacity="0.05"/>
  <text x="80" y="120" fill="#ffffff" fill-opacity="0.9" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" letter-spacing="3">ZAKCAR BLOG</text>
  <rect x="80" y="140" width="64" height="4" fill="#ffffff" fill-opacity="0.85"/>
  ${titleTspans}
  <text x="80" y="600" fill="#ffffff" fill-opacity="0.7" font-family="Arial, Helvetica, sans-serif" font-size="18">Araç kiralama rehberi</text>
</svg>
`;
}

const posts = JSON.parse(fs.readFileSync(dataPath, "utf8"));

for (const cover of COVERS) {
  // remove wrong identical png if present
  for (const ext of [".png", ".jpeg", ".jpg", ".webp"]) {
    const bad = path.join(imgDir, cover.slug + ext);
    if (fs.existsSync(bad)) fs.unlinkSync(bad);
  }

  const file = `${cover.slug}.svg`;
  fs.writeFileSync(path.join(imgDir, file), makeSvg(cover), "utf8");

  const post = posts.find((p) => p.slug === cover.slug);
  if (post) {
    post.image = `/assets/blog/${file}`;
    console.log("✓", cover.slug);
  } else {
    console.log("✗ post not found", cover.slug);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), "utf8");

const missing = posts.filter((p) => !p.image || !fs.existsSync(path.join("public", p.image)));
console.log("\nStill missing:", missing.length);
missing.forEach((p) => console.log(" -", p.slug, p.image));
console.log("All posts with images:", posts.filter((p) => p.image).length, "/", posts.length);
