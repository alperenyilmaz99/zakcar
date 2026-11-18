import fs from "fs";
import path from "path";
import type { BlogPost } from "./blog-types";

const TARGETS = ["en", "de", "ar", "ru"] as const;
type TargetLocale = (typeof TARGETS)[number];

type Entry = {
  title: string;
  excerpt: string;
  blocks?: { text: string }[];
};

const memory = new Map<TargetLocale, Record<string, Entry>>();
const loadedAt = new Map<TargetLocale, number>();

function cacheFile(locale: TargetLocale): string {
  const candidates = [
    path.join(process.cwd(), "src", "data", "blog-translations"),
    path.join(process.cwd(), "web", "src", "data", "blog-translations"),
  ];
  const dir = candidates.find((item) => fs.existsSync(item)) || candidates[0];
  return path.join(dir, `${locale}.json`);
}

function readCache(locale: TargetLocale): Record<string, Entry> {
  const file = cacheFile(locale);
  let mtime = 0;
  try {
    mtime = fs.statSync(file).mtimeMs;
  } catch {
    return memory.get(locale) ?? {};
  }
  const cached = memory.get(locale);
  if (cached && loadedAt.get(locale) === mtime) return cached;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, Entry>;
    memory.set(locale, parsed);
    loadedAt.set(locale, mtime);
    return parsed;
  } catch {
    return cached ?? {};
  }
}

function isTarget(locale: string): locale is TargetLocale {
  return (TARGETS as readonly string[]).includes(locale);
}

function show(text: string): string {
  return text.replaceAll("IGA", "IST");
}

export async function localizePosts<T extends BlogPost>(posts: T[], locale: string): Promise<T[]> {
  if (!isTarget(locale)) return posts;
  const cache = readCache(locale);
  return posts.map((post) => {
    const entry = cache[post.slug];
    if (!entry?.title) return post;
    return {
      ...post,
      title: show(entry.title),
      excerpt: show(entry.excerpt || post.excerpt),
      blocks: post.blocks.map((block, index) => ({
        ...block,
        text: show(entry.blocks?.[index]?.text || block.text),
      })),
    };
  });
}
