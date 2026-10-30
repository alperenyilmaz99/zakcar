import type { BlogPost } from "@/lib/blog-types";

export type SiteReview = {
  id: string;
  author: string;
  location: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type StoredPost = BlogPost & { createdAt: string };
