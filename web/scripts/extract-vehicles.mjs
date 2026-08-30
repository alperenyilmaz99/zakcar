/**
 * Extract vehicles.json + offices.json from pages/*.html (replaces Python extract_data.py)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");
const pagesDir = path.join(repoRoot, "data", "vehicle-pages");
const outDir = path.join(webRoot, "src", "data");
const pngDir = path.join(repoRoot, "assets", "images", "vehicles", "png");
const pngManifest = path.join(pngDir, "manifest.txt");

function slugFromFile(name) {
  return name.replace("-arac-kiralama.html", "");
}

function findPng(slug) {
  if (!fs.existsSync(pngManifest)) return null;
  for (const line of fs.readFileSync(pngManifest, "utf-8").split("\n")) {
    const file = line.split("\t")[0]?.trim();
    if (file && file.replace(".png", "").includes(slug)) {
      return `/assets/images/vehicles/png/${file}`;
    }
  }
  const direct = path.join(pngDir, `${slug}.png`);
  if (fs.existsSync(direct)) return `/assets/images/vehicles/png/${slug}.png`;
  return null;
}

function toTry(euroPrice) {
  const EUR_TO_TRY = 37;
  const match = String(euroPrice).match(/([\d.,]+)/);
  if (!match) return "925 TL";
  const num = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  const tl = Math.round(num * EUR_TO_TRY);
  return `${tl.toLocaleString("tr-TR")} TL`;
}

function parsePage(filePath) {
  const html = fs.readFileSync(filePath, "utf-8");
  const name = path.basename(filePath);
  const slug = slugFromFile(name);

  const pick = (re) => html.match(re)?.[1]?.trim();
  const brandSlug = pick(/brand-(\w+) ec-brands/) ?? slug.split("-")[0];

  const image = findPng(slug) ?? "/assets/images/placeholder.svg";

  return {
    slug,
    name: pick(/class="heading-title">([^<]+)/) ?? slug,
    summary: pick(/class="heading-description">([^<]+)/) ?? "",
    route: `${slug}-arac-kiralama.html`,
    brand: brandSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    brandSlug,
    fuel: pick(/ec-gas-station-fill[^>]*><\/i><span>([^<]+)<\/span>/) ?? "Benzin",
    transmission: pick(/ec-steering-2-fill[^>]*><\/i><span>([^<]+)<\/span>/) ?? "Manuel",
    capacity: pick(/ec-user-3-fill[^>]*><\/i><span>([^<]+)<\/span>/) ?? "5",
    group: pick(/v-vehicle-card-group" style="[^"]*">([^<]+)<\/div>/) ?? "Ekonomik",
    price: toTry(pick(/daily-price">([^<]+)/) ?? "€25,00"),
    image,
    banner: "",
  };
}

const offices = {
  offices: [
    {
      id: "saw",
      name: "İstanbul Sabiha Gökçen Havalimanı (SAW)",
      address: "Sabiha Gökçen Havalimanı, Pendik / İstanbul",
      phone: "0532 388 29 96",
      email: "info@zakcar.com",
      hours: "7/24",
    },
    {
      id: "merkez",
      name: "ZakCar Merkez Ofis",
      address: "İstanbul Sabiha Gökçen Havalimanı Karşısı",
      phone: "0532 388 29 96",
      email: "info@zakcar.com",
      hours: "08:00 - 22:00",
    },
  ],
};

if (!fs.existsSync(pagesDir)) {
  console.warn("data/vehicle-pages/ not found — keeping existing src/data JSON");
  process.exit(0);
}

const vehicles = fs
  .readdirSync(pagesDir)
  .filter((f) => f.endsWith(".html"))
  .sort()
  .map((f) => parsePage(path.join(pagesDir, f)));

const groups = [...new Set(vehicles.map((v) => v.group))].sort();
const brands = [...new Set(vehicles.map((v) => v.brand))].sort();

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "vehicles.json"),
  JSON.stringify({ vehicles, groups, brands }, null, 2),
);
fs.writeFileSync(path.join(outDir, "offices.json"), JSON.stringify(offices, null, 2));

console.log(`Extracted ${vehicles.length} vehicles → src/data/`);
