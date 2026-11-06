"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PanelPost = { slug: string; title: string; excerpt: string; source: "panel" | "site" };
type PanelReview = {
  id: string;
  author: string;
  location: string;
  rating: number;
  body: string;
  source: "panel" | "site";
};
type ContentResponse = { posts: PanelPost[]; reviews: PanelReview[]; error?: string };
type GenerateResponse = { error?: string; stored?: "file" | "supabase" | "both" };

const STORE_NOTE: Record<string, string> = {
  file: "Yerel dosyaya yazıldı. Canlı sitede kalması için supabase/content.sql dosyasını SQL Editor’da çalıştırın.",
  supabase: "Veritabanına yazıldı.",
  both: "Siteye ve veritabanına yazıldı.",
};

const PLACES = ["Sabiha Gökçen", "İstanbul Havalimanı", "Merkez Ofis"];

async function staffToken(): Promise<string> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
  return token;
}

export default function PanelContentPage() {
  const [posts, setPosts] = useState<PanelPost[]>([]);
  const [reviews, setReviews] = useState<PanelReview[]>([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewPlace, setReviewPlace] = useState(PLACES[0]);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewBody, setReviewBody] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogBody, setBlogBody] = useState("");

  const load = useCallback(async () => {
    const token = await staffToken();
    const res = await fetch("/api/panel/content", {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await res.json()) as ContentResponse;
    if (!res.ok) throw new Error(data.error || "İçerik okunamadı");
    setPosts(data.posts);
    setReviews(data.reviews);
  }, []);

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
  }, [load]);

  const generate = async (kind: "blog" | "review") => {
    setBusy(kind);
    setError("");
    setNote("");
    try {
      const token = await staffToken();
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

  const saveReview = async () => {
    setBusy("save-review");
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          kind: "review",
          author: reviewAuthor,
          location: reviewPlace,
          rating: Number(reviewRating),
          body: reviewBody,
        }),
      });
      const payload = (await res.json()) as GenerateResponse;
      if (!res.ok) throw new Error(payload.error || "Yorum kaydedilemedi");
      setReviewAuthor("");
      setReviewBody("");
      setNote("Yorum eklendi ve anasayfada görünür.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yorum kaydedilemedi");
    } finally {
      setBusy(null);
    }
  };

  const saveBlog = async () => {
    setBusy("save-blog");
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          kind: "blog",
          title: blogTitle,
          excerpt: blogExcerpt,
          body: blogBody,
        }),
      });
      const payload = (await res.json()) as GenerateResponse;
      if (!res.ok) throw new Error(payload.error || "Yazı kaydedilemedi");
      setBlogTitle("");
      setBlogExcerpt("");
      setBlogBody("");
      setNote("Yazı eklendi ve blog listesinde görünür.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yazı kaydedilemedi");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (kind: "blog" | "review", key: string, label: string) => {
    if (!window.confirm(`${label} silinsin mi? Siteden de kalkar.`)) return;
    setBusy(`delete-${kind}-${key}`);
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(kind === "blog" ? { kind, slug: key } : { kind, id: key }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error || "Silinemedi");
      setNote(kind === "blog" ? "Yazı siteden kaldırıldı." : "Yorum siteden kaldırıldı.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silinemedi");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">İçerik</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        Yorum ve blog buradan eklenebilir veya silinebilir. Silinen kayıt anasayfa ve blog listesinden de kalkar.
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form
          className="card grid gap-3 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void saveReview();
          }}
        >
          <h2 className="font-display text-lg font-semibold text-ink">Yorum ekle</h2>
          <label className="block text-sm">
            <span className="text-ink-muted">Yazar</span>
            <input value={reviewAuthor} onChange={(event) => setReviewAuthor(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-ink-muted">Ofis</span>
              <select value={reviewPlace} onChange={(event) => setReviewPlace(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border bg-white px-3">
                {PLACES.map((place) => (
                  <option key={place}>{place}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted">Yıldız</span>
              <select value={reviewRating} onChange={(event) => setReviewRating(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border bg-white px-3">
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-ink-muted">Yorum</span>
            <textarea value={reviewBody} onChange={(event) => setReviewBody(event.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2" />
          </label>
          <button type="submit" className="btn-primary w-fit" disabled={busy !== null}>
            {busy === "save-review" ? "Kaydediliyor…" : "Yorumu ekle"}
          </button>
        </form>

        <form
          className="card grid gap-3 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void saveBlog();
          }}
        >
          <h2 className="font-display text-lg font-semibold text-ink">Blog ekle</h2>
          <label className="block text-sm">
            <span className="text-ink-muted">Başlık</span>
            <input value={blogTitle} onChange={(event) => setBlogTitle(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3" />
          </label>
          <label className="block text-sm">
            <span className="text-ink-muted">Özet</span>
            <input value={blogExcerpt} onChange={(event) => setBlogExcerpt(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3" />
          </label>
          <label className="block text-sm">
            <span className="text-ink-muted">Metin</span>
            <textarea value={blogBody} onChange={(event) => setBlogBody(event.target.value)} rows={5} className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2" />
          </label>
          <button type="submit" className="btn-outline w-fit" disabled={busy !== null}>
            {busy === "save-blog" ? "Kaydediliyor…" : "Yazıyı ekle"}
          </button>
        </form>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Yorumlar</h2>
          <div className="mt-4 max-h-[32rem] overflow-y-auto rounded-2xl border border-surface-border bg-white">
            {reviews.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">Henüz yorum yok.</p>
            ) : (
              <ul className="divide-y divide-surface-border">
                {reviews.map((review) => (
                  <li key={review.id} className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">
                        {review.author} <span className="font-normal text-ink-muted">· {review.location}</span>
                      </p>
                      <button
                        type="button"
                        className="shrink-0 text-sm font-semibold text-brand hover:underline"
                        disabled={busy !== null}
                        onClick={() => void remove("review", review.id, review.author)}
                      >
                        Sil
                      </button>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{review.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Yazılar</h2>
          <div className="mt-4 max-h-[32rem] overflow-y-auto rounded-2xl border border-surface-border bg-white">
            {posts.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">Henüz yazı yok.</p>
            ) : (
              <ul className="divide-y divide-surface-border">
                {posts.map((post) => (
                  <li key={post.slug} className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/blog/${post.slug}`} className="font-semibold text-ink hover:text-brand">
                        {post.title}
                      </Link>
                      <button
                        type="button"
                        className="shrink-0 text-sm font-semibold text-brand hover:underline"
                        disabled={busy !== null}
                        onClick={() => void remove("blog", post.slug, post.title)}
                      >
                        Sil
                      </button>
                    </div>
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
