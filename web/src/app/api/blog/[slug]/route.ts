import { NextResponse } from "next/server";
import { getPublishedBlogPost } from "@/lib/blog";
import { localizePosts } from "@/lib/blog-translate";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(req: Request, { params }: Params) {
  const { slug } = await params;
  const locale = new URL(req.url).searchParams.get("locale") || "tr";
  const post = await getPublishedBlogPost(slug);
  if (!post) return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
  const [localized] = await localizePosts([post], locale);
  return NextResponse.json(localized);
}
