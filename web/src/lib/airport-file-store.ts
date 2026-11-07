import fs from "fs";
import path from "path";
import { AIRPORT_CARDS, mergeAirportCards, type AirportCard, type AirportCardRow } from "@/lib/airport-cards";

function firstExisting(paths: string[], fallback: string): string {
  return paths.find((item) => fs.existsSync(item)) || fallback;
}

const dataPath = firstExisting(
  [
    path.join(process.cwd(), "src", "data", "airport-cards.json"),
    path.join(process.cwd(), "web", "src", "data", "airport-cards.json"),
  ],
  path.join(process.cwd(), "src", "data", "airport-cards.json"),
);

const uploadDir = firstExisting(
  [
    path.join(process.cwd(), "public", "assets", "airport", "uploads"),
    path.join(process.cwd(), "web", "public", "assets", "airport", "uploads"),
  ],
  path.join(process.cwd(), "public", "assets", "airport", "uploads"),
);

export function readAirportFile(): AirportCard[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(dataPath, "utf8")) as AirportCardRow[];
    if (!Array.isArray(parsed)) return AIRPORT_CARDS;
    return mergeAirportCards(parsed);
  } catch {
    return AIRPORT_CARDS;
  }
}

export function writeAirportFile(items: AirportCard[]): void {
  const rows: AirportCardRow[] = mergeAirportCards(
    items.map((item) => ({
      id: item.id,
      image_url: item.imageUrl,
      title: item.title,
      summary: item.text,
      detail: item.detail,
    })),
  ).map((item) => ({
    id: item.id,
    image_url: item.imageUrl,
    title: item.title,
    summary: item.text,
    detail: item.detail,
    href: item.href,
  }));
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(rows, null, 2) + "\n", "utf8");
}

export function saveAirportUpload(file: File, buffer: Buffer): string {
  fs.mkdirSync(uploadDir, { recursive: true });
  const ext = path.extname(file.name || "").toLowerCase() || ".jpg";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
  const name = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}${safeExt}`;
  fs.writeFileSync(path.join(uploadDir, name), buffer);
  return `/assets/airport/uploads/${name}`;
}
