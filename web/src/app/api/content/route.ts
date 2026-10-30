import { NextResponse } from "next/server";
import { listGeneratedPosts, listReviews } from "@/lib/generated-content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [posts, reviews] = await Promise.all([listGeneratedPosts(), listReviews()]);
    return NextResponse.json({ posts, reviews });
  } catch (error) {
    const message = error instanceof Error ? error.message : "İçerik okunamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
