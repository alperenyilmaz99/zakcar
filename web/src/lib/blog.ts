import posts from "@/data/blog-posts.json";
import type { BlogPost } from "@/lib/blog-types";

export type { BlogPost } from "@/lib/blog-types";

export function getAllBlogPosts(): BlogPost[] {
  return posts as BlogPost[];
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return (posts as BlogPost[]).find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return (posts as BlogPost[]).map((p) => p.slug);
}
