import fs from "fs";
import path from "path";
import type { SegmentId } from "@/lib/segments";

export type SegmentOverrides = Partial<Record<SegmentId, string>>;

function filePath(): string {
  const candidates = [
    path.join(process.cwd(), "src", "data", "segment-images.json"),
    path.join(process.cwd(), "web", "src", "data", "segment-images.json"),
  ];
  return candidates.find((item) => fs.existsSync(path.dirname(item))) || candidates[0];
}

export function readSegmentOverrides(): SegmentOverrides {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath(), "utf8")) as SegmentOverrides;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeSegmentOverrides(items: SegmentOverrides): void {
  const file = filePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(items, null, 2) + "\n", "utf8");
}
