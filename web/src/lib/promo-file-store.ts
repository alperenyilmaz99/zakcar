import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { DEFAULT_PROMOS, type PromoCover } from "@/lib/promo";

function firstExisting(paths: string[], fallback: string): string {
  return paths.find((p) => fs.existsSync(p)) || fallback;
}

const dataPath = firstExisting(
  [
    path.join(process.cwd(), "src", "data", "promo-covers.json"),
    path.join(process.cwd(), "web", "src", "data", "promo-covers.json"),
  ],
  path.join(process.cwd(), "src", "data", "promo-covers.json"),
);

const uploadDir = firstExisting(
  [
    path.join(process.cwd(), "public", "assets", "promo", "uploads"),
    path.join(process.cwd(), "web", "public", "assets", "promo", "uploads"),
  ],
  path.join(process.cwd(), "public", "assets", "promo", "uploads"),
);

export function readPromoFile(): PromoCover[] {
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed = JSON.parse(raw) as PromoCover[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PROMOS;
    return parsed;
  } catch {
    return DEFAULT_PROMOS;
  }
}

export function writePromoFile(items: PromoCover[]): void {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2) + "\n", "utf8");
}

export function savePromoUpload(file: File, buffer: Buffer): string {
  fs.mkdirSync(uploadDir, { recursive: true });
  const ext = path.extname(file.name || "").toLowerCase() || guessExt(file.type);
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  fs.writeFileSync(path.join(uploadDir, name), buffer);
  return `/assets/promo/uploads/${name}`;
}

export function removePromoUpload(imageUrl: string): void {
  if (!imageUrl.startsWith("/assets/promo/uploads/")) return;
  const rel = imageUrl.replace(/^\//, "");
  for (const file of [path.join(process.cwd(), "public", rel), path.join(process.cwd(), "web", "public", rel)]) {
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch {
      // ignore
    }
  }
}

function guessExt(type: string): string {
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("gif")) return ".gif";
  return ".jpg";
}
