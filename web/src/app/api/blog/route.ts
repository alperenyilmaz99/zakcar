import { NextResponse } from "next/server";
import { getPublishedBlogPosts } from "@/lib/blog";
import { localizePosts } from "@/lib/blog-translate";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") || "tr";
  const wanted = new Set(
    (url.searchParams.get("slugs") || "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean),
  );
  let posts = await getPublishedBlogPosts();
  if (wanted.size > 0) posts = posts.filter((post) => wanted.has(post.slug));
  const localized = await localizePosts(posts, locale);
  return NextResponse.json(
    localized.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
    })),
  );
}
