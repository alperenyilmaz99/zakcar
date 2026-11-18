import fs from "fs";
import path from "path";
import type { BlogPost } from "../src/lib/blog-types";
import { localizePosts } from "../src/lib/blog-translate.ts";

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

const root = path.join(process.cwd(), "src", "data");
const staticPosts = readJson<BlogPost[]>(path.join(root, "blog-posts.json"), []);
const generated = readJson<{ posts?: BlogPost[] }>(path.join(root, "generated-content.json"), {}).posts ?? [];
const hidden = new Set(readJson<{ hiddenPostSlugs?: string[] }>(path.join(root, "generated-content.json"), {}).hiddenPostSlugs ?? []);
const seen = new Set<string>();
const posts = [...generated, ...staticPosts].filter((post) => {
  if (hidden.has(post.slug) || seen.has(post.slug)) return false;
  seen.add(post.slug);
  return true;
});

async function main() {
  const locales = ["en", "de", "ar", "ru"] as const;
  for (const locale of locales) {
    console.log(`\n${locale}: ${posts.length} yazı`);
    for (const post of posts) {
      const [localized] = await localizePosts([post], locale);
      const changed = localized.title !== post.title;
      console.log(`${changed ? "ok" : "tr"} ${locale} ${post.slug}`);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
