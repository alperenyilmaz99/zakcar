import fs from "fs";
import path from "path";
import type { District } from "@/lib/districts";

function filePath(): string {
  const candidates = [
    path.join(process.cwd(), "src", "data", "extra-districts.json"),
    path.join(process.cwd(), "web", "src", "data", "extra-districts.json"),
  ];
  return candidates.find((item) => fs.existsSync(path.dirname(item))) || candidates[0];
}

export function readExtraDistricts(): District[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath(), "utf8")) as District[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeExtraDistricts(items: District[]): void {
  const file = filePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(items, null, 2) + "\n", "utf8");
}
