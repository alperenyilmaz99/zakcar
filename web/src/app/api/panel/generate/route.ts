import { NextResponse } from "next/server";
import { generateBlogPost, generateReview } from "@/lib/claude-content";
import { getAllBlogPosts } from "@/lib/blog";
import {
  listGeneratedPosts,
  listReviews,
  saveGeneratedPost,
  saveGeneratedReview,
} from "@/lib/generated-content";
import { bearerToken, createServerSupabase } from "@/lib/supabase/server";

async function staffClient(req: Request) {
  const token = bearerToken(req);
  if (!token) return null;
  const supabase = createServerSupabase(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!staff?.is_active) return null;
  return supabase;
}

export async function POST(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });

  let kind = "";
  try {
    const body = (await req.json()) as { kind?: string };
    kind = body.kind || "";
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  try {
    if (kind === "blog") {
      const generated = await listGeneratedPosts();
      const existing = [...generated, ...getAllBlogPosts()];
      const post = await generateBlogPost(
        existing,
        existing.map((item) => item.title),
      );
      const stored = await saveGeneratedPost(post, staff);
      return NextResponse.json({ kind, stored, post });
    }
    if (kind === "review") {
      const reviews = await listReviews();
      const review = await generateReview(reviews);
      const stored = await saveGeneratedReview(review, staff);
      return NextResponse.json({ kind, stored, review });
    }
    return NextResponse.json({ error: "Üretim türü geçersiz." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Üretilemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
