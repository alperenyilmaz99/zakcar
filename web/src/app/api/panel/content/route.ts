import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";
import type { BlogBlock } from "@/lib/blog-types";
import {
  coverForSlug,
  deleteManagedPost,
  deleteManagedReview,
  listGeneratedPosts,
  listHiddenKeys,
  listReviews,
  saveGeneratedPost,
  saveGeneratedReview,
} from "@/lib/generated-content";
import { HOME_REVIEW_CARDS } from "@/lib/home-reviews";
import { bearerToken, createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PLACES = ["Sabiha Gökçen", "İstanbul Havalimanı", "Merkez Ofis"] as const;

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

function slugify(title: string): string {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", i̇: "i", ö: "o", ş: "s", ü: "u" };
  return title
    .toLocaleLowerCase("tr")
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function blocksFromBody(body: string): BlogBlock[] {
  const parts = body
    .split(/\n{2,}/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return parts.map((text) => ({ type: "paragraph", text: text.slice(0, 2000) }));
}

export async function GET(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  try {
    const [generated, reviews, hiddenPosts, hiddenReviews] = await Promise.all([
      listGeneratedPosts(),
      listReviews(),
      listHiddenKeys("post"),
      listHiddenKeys("review"),
    ]);
    const hiddenPostSet = new Set(hiddenPosts);
    const hiddenReviewSet = new Set(hiddenReviews);
    const generatedSlugs = new Set(generated.map((post) => post.slug));
    const posts = [
      ...generated
        .filter((post) => !hiddenPostSet.has(post.slug))
        .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, source: "panel" as const })),
      ...getAllBlogPosts()
        .filter((post) => !generatedSlugs.has(post.slug) && !hiddenPostSet.has(post.slug))
        .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, source: "site" as const })),
    ];
    const reviewRows = [
      ...reviews.map((review) => ({ ...review, source: "panel" as const })),
      ...HOME_REVIEW_CARDS.filter((card) => !hiddenReviewSet.has(card.id)).map((card) => ({
        id: card.id,
        author: card.author,
        location: card.copy.tr.place,
        rating: 5,
        body: card.copy.tr.body,
        createdAt: "",
        source: "site" as const,
      })),
    ];
    return NextResponse.json({ posts, reviews: reviewRows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "İçerik okunamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });

  let body: {
    kind?: string;
    title?: string;
    excerpt?: string;
    body?: string;
    author?: string;
    location?: string;
    rating?: number;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  try {
    if (body.kind === "blog") {
      const title = (body.title || "").replace(/\s+/g, " ").trim();
      const excerpt = (body.excerpt || "").replace(/\s+/g, " ").trim();
      const blocks = blocksFromBody(body.body || "");
      if (title.length < 8) return NextResponse.json({ error: "Başlık en az 8 karakter olmalı." }, { status: 400 });
      if (excerpt.length < 20) return NextResponse.json({ error: "Özet en az 20 karakter olmalı." }, { status: 400 });
      if (!blocks.length || blocks.reduce((sum, block) => sum + block.text.length, 0) < 40) {
        return NextResponse.json({ error: "Yazı metni çok kısa." }, { status: 400 });
      }
      const used = new Set([...getAllBlogPosts().map((post) => post.slug), ...(await listGeneratedPosts()).map((post) => post.slug)]);
      let slug = slugify(title);
      if (!slug) return NextResponse.json({ error: "Yazı adresi üretilemedi." }, { status: 400 });
      let n = 2;
      while (used.has(slug)) {
        slug = `${slugify(title).slice(0, 68)}-${n}`;
        n += 1;
      }
      const stored = await saveGeneratedPost(
        {
          slug,
          title: title.slice(0, 120),
          excerpt: excerpt.slice(0, 220),
          image: coverForSlug(slug),
          blocks,
          createdAt: new Date().toISOString(),
        },
        staff,
      );
      return NextResponse.json({ stored });
    }

    if (body.kind === "review") {
      const author = (body.author || "").replace(/\s+/g, " ").trim();
      const text = (body.body || "").replace(/\s+/g, " ").trim();
      const location = PLACES.find((place) => place === (body.location || "").trim()) || "";
      const rating = Number(body.rating);
      if (!/^[A-Za-zÇĞİÖŞÜçğıöşü][A-Za-zÇĞİÖŞÜçğıöşü.'\- ]{1,40}$/.test(author)) {
        return NextResponse.json({ error: "Yazar adı geçersiz." }, { status: 400 });
      }
      if (!location) return NextResponse.json({ error: "Ofis seçin." }, { status: 400 });
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Yıldız 1 ile 5 arasında olmalı." }, { status: 400 });
      }
      if (text.length < 20) return NextResponse.json({ error: "Yorum en az 20 karakter olmalı." }, { status: 400 });
      const stored = await saveGeneratedReview(
        {
          id: randomUUID(),
          author: author.slice(0, 40),
          location,
          rating,
          body: text.slice(0, 800),
          createdAt: new Date().toISOString(),
        },
        staff,
      );
      return NextResponse.json({ stored });
    }

    return NextResponse.json({ error: "Kayıt türü geçersiz." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kaydedilemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });

  let body: { kind?: string; slug?: string; id?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  try {
    if (body.kind === "blog") {
      const slug = (body.slug || "").trim();
      if (!/^[a-z0-9-]{2,80}$/.test(slug)) return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 400 });
      const onSite = getAllBlogPosts().some((post) => post.slug === slug);
      await deleteManagedPost(slug, staff, onSite);
      return NextResponse.json({ ok: true });
    }
    if (body.kind === "review") {
      const id = (body.id || "").trim();
      if (!id) return NextResponse.json({ error: "Yorum bulunamadı." }, { status: 400 });
      await deleteManagedReview(id, staff, id.startsWith("builtin-"));
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Kayıt türü geçersiz." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silinemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
