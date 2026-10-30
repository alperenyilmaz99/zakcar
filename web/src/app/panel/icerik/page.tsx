"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteReview, StoredPost } from "@/lib/content-types";

type ContentResponse = { posts: StoredPost[]; reviews: SiteReview[]; error?: string };
type GenerateResponse = {
  error?: string;
  stored?: "file" | "supabase" | "both";
  post?: StoredPost;
  review?: SiteReview;
};

const STORE_NOTE: Record<string, string> = {
  file: "Yerel dosyaya yazıldı. Canlı sitede kalması için supabase/content.sql dosyasını SQL Editor’da çalıştırın.",
  supabase: "Veritabanına yazıldı.",
  both: "Siteye ve veritabanına yazıldı.",
};

export default function PanelContentPage() {
  const [posts, setPosts] = useState<StoredPost[]>([]);
  const [reviews, setReviews] = useState<SiteReview[]>([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<"blog" | "review" | null>(null);

  const load = async () => {
    const res = await fetch("/api/content", { cache: "no-store" });
    const data = (await res.json()) as ContentResponse;
    if (!res.ok) throw new Error(data.error || "İçerik okunamadı");
    setPosts(data.posts);
    setReviews(data.reviews);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "İçerik okunamadı");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const generate = async (kind: "blog" | "review") => {
    setBusy(kind);
    setError("");
    setNote("");
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
      const res = await fetch("/api/panel/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kind }),
      });
      const payload = (await res.json()) as GenerateResponse;
      if (!res.ok) throw new Error(payload.error || "Üretilemedi");
      setNote(STORE_NOTE[payload.stored || "file"] || "");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Üretilemedi");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">İçerik</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        Blog yazısı mevcut rehberlerin blok düzenine, yorum da teslim ve ödeme anlatımına göre üretilir.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" disabled={busy !== null} onClick={() => generate("review")}>
          {busy === "review" ? "Yorum yazılıyor…" : "Yorum üret"}
        </button>
        <button type="button" className="btn-outline" disabled={busy !== null} onClick={() => generate("blog")}>
          {busy === "blog" ? "Blog yazılıyor…" : "Blog üret"}
        </button>
      </div>

      {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {note ? <p className="mt-4 rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-ink">{note}</p> : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Üretilen yorumlar</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-surface-border bg-white">
            {reviews.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">Henüz yorum yok.</p>
            ) : (
              <ul className="divide-y divide-surface-border">
                {reviews.map((review) => (
                  <li key={review.id} className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-ink">
                      {review.author} <span className="font-normal text-ink-muted">· {review.location}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{review.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Üretilen yazılar</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-surface-border bg-white">
            {posts.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">Henüz üretilmiş yazı yok.</p>
            ) : (
              <ul className="divide-y divide-surface-border">
                {posts.map((post) => (
                  <li key={post.slug} className="px-4 py-3.5">
                    <Link href={`/blog/${post.slug}`} className="font-semibold text-ink hover:text-brand">
                      {post.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{post.excerpt}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
