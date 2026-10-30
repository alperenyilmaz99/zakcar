import posts from "@/data/blog-posts.json";
import type { BlogPost } from "@/lib/blog-types";
import { listGeneratedPosts, readContentFile } from "@/lib/generated-content";

export type { BlogPost } from "@/lib/blog-types";

export function getAllBlogPosts(): BlogPost[] {
  return posts as BlogPost[];
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return (posts as BlogPost[]).find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  const generated = readContentFile().posts.map((post) => post.slug);
  return [...new Set([...generated, ...(posts as BlogPost[]).map((p) => p.slug)])];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const generated = await listGeneratedPosts();
  const seen = new Set(generated.map((post) => post.slug));
  return [...generated, ...(posts as BlogPost[]).filter((post) => !seen.has(post.slug))];
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | undefined> {
  const generated = (await listGeneratedPosts()).find((post) => post.slug === slug);
  return generated || getBlogPost(slug);
}
