import posts from "@/data/blog-posts.json";
import type { BlogPost } from "@/lib/blog-types";
import { listGeneratedPosts, listHiddenKeys, readContentFile } from "@/lib/generated-content";

export type { BlogPost } from "@/lib/blog-types";

export function getAllBlogPosts(): BlogPost[] {
  return posts as BlogPost[];
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return (posts as BlogPost[]).find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  const file = readContentFile();
  const hidden = new Set(file.hiddenPostSlugs);
  const generated = file.posts.map((post) => post.slug);
  return [...new Set([...generated, ...(posts as BlogPost[]).map((p) => p.slug)])].filter((slug) => !hidden.has(slug));
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const [generated, hiddenList] = await Promise.all([listGeneratedPosts(), listHiddenKeys("post")]);
  const hidden = new Set(hiddenList);
  const seen = new Set(generated.map((post) => post.slug));
  return [...generated, ...(posts as BlogPost[]).filter((post) => !seen.has(post.slug))].filter((post) => !hidden.has(post.slug));
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | undefined> {
  if ((await listHiddenKeys("post")).includes(slug)) return undefined;
  const generated = (await listGeneratedPosts()).find((post) => post.slug === slug);
  return generated || getBlogPost(slug);
}
