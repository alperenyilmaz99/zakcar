"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PanelPost = { slug: string; title: string; excerpt: string; image: string; source: "panel" | "site" };
type PanelReview = {
  id: string;
  author: string;
  location: string;
  rating: number;
  body: string;
  source: "panel" | "site";
};
type PanelHeroLine = {
  id: string;
  before: string;
  accent: string;
  after: string;
  sub: string;
  tag: string;
  pill: boolean;
};
type PanelFooterService = { id: string; href: string; label: string; body?: string };
type ContentResponse = {
  posts: PanelPost[];
  reviews: PanelReview[];
  heroLines?: PanelHeroLine[];
  footerServices?: PanelFooterService[];
  error?: string;
};
type GenerateResponse = { error?: string; stored?: "file" | "supabase" | "both" };

const STORE_NOTE: Record<string, string> = {
  file: "Yerel dosyaya yazıldı. Canlı sitede kalması için supabase/content.sql dosyasını SQL Editor’da çalıştırın.",
  supabase: "Veritabanına yazıldı.",
  both: "Siteye ve veritabanına yazıldı.",
};

const PLACES = ["Sabiha Gökçen", "İstanbul Havalimanı", "Merkez Ofis"];

async function uploadBlogCover(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Yalnızca görsel yükleyin.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Görsel 5 MB'dan küçük olmalı.");
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `blog/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("promo-covers").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("promo-covers").getPublicUrl(path).data.publicUrl;
}

async function staffToken(): Promise<string> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
  return token;
}

export default function PanelContentPage() {
  const [posts, setPosts] = useState<PanelPost[]>([]);
  const [reviews, setReviews] = useState<PanelReview[]>([]);
  const [heroLines, setHeroLines] = useState<PanelHeroLine[]>([]);
  const [heroId, setHeroId] = useState("");
  const [heroBefore, setHeroBefore] = useState("");
  const [heroAccent, setHeroAccent] = useState("");
  const [heroSub, setHeroSub] = useState("");
  const [footerServices, setFooterServices] = useState<PanelFooterService[]>([]);
  const [serviceLabel, setServiceLabel] = useState("");
  const [serviceHref, setServiceHref] = useState("");
  const [serviceBody, setServiceBody] = useState("");
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
  const [blogCover, setBlogCover] = useState<File | null>(null);
  const [blogCoverPreview, setBlogCoverPreview] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);

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
    setHeroLines(data.heroLines || []);
    setFooterServices(data.footerServices || []);
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

  const resetHero = () => {
    setHeroId("");
    setHeroBefore("");
    setHeroAccent("");
    setHeroSub("");
  };

  const saveHero = async () => {
    setBusy("save-hero");
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          kind: "hero",
          id: heroId || undefined,
          before: heroBefore,
          accent: heroAccent,
          sub: heroSub,
        }),
      });
      const payload = (await res.json()) as GenerateResponse;
      if (!res.ok) throw new Error(payload.error || "Cümle kaydedilemedi");
      const editing = Boolean(heroId);
      resetHero();
      setNote(editing ? "Cümle güncellendi." : "Cümle eklendi ve anasayfada görünür.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cümle kaydedilemedi");
    } finally {
      setBusy(null);
    }
  };

  const editHero = (line: PanelHeroLine) => {
    setHeroId(line.id);
    setHeroBefore(line.before);
    setHeroAccent(line.accent);
    setHeroSub(line.sub);
    setError("");
    setNote("");
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
      const image = blogCover ? await uploadBlogCover(blogCover) : "";
      const res = await fetch("/api/panel/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          kind: "blog",
          title: blogTitle,
          excerpt: blogExcerpt,
          body: blogBody,
          image,
        }),
      });
      const payload = (await res.json()) as GenerateResponse;
      if (!res.ok) throw new Error(payload.error || "Yazı kaydedilemedi");
      setBlogTitle("");
      setBlogExcerpt("");
      setBlogBody("");
      setBlogCover(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      setBlogCoverPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return "";
      });
      setNote("Yazı eklendi ve blog listesinde görünür.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yazı kaydedilemedi");
    } finally {
      setBusy(null);
    }
  };

  const changeCover = async (slug: string, file: File | null) => {
    if (!file) return;
    setBusy(`cover-${slug}`);
    setError("");
    setNote("");
    try {
      const image = await uploadBlogCover(file);
      const token = await staffToken();
      const res = await fetch("/api/panel/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kind: "blog-cover", slug, image }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error || "Kapak kaydedilemedi");
      setNote("Kapak görseli güncellendi.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kapak kaydedilemedi");
    } finally {
      setBusy(null);
    }
  };

  const saveService = async () => {
    setBusy("save-service");
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kind: "footer-service", title: serviceLabel, href: serviceHref, excerpt: serviceBody }),
      });
      const payload = (await res.json()) as GenerateResponse;
      if (!res.ok) throw new Error(payload.error || "Hizmet eklenemedi");
      setServiceLabel("");
      setServiceHref("");
      setServiceBody("");
      setNote(
        payload.stored === "file"
          ? "Footer’a eklendi. Canlı sitede kalması için supabase/footer-services.sql dosyasını SQL Editor’da bir kez çalıştırın."
          : "Hizmet footer’a eklendi.",
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hizmet eklenemedi");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (kind: "blog" | "review" | "hero" | "footer-service", key: string, label: string) => {
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
      setNote(
        kind === "blog"
          ? "Yazı siteden kaldırıldı."
          : kind === "hero"
            ? "Cümle siteden kaldırıldı."
            : kind === "footer-service"
              ? "Hizmet footer’dan kaldırıldı. Üst menü aynı kaldı."
              : "Yorum siteden kaldırıldı.",
      );
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
        Anasayfa cümleleri, footer hizmetleri, yorum ve blog buradan eklenir. Üst menüdeki Hizmetler listesi burada değişmez.
      </p>

      <form
        className="card mt-8 grid gap-3 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void saveHero();
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">Ana sayfa cümlesi</h2>
          {heroId ? (
            <button type="button" className="text-sm text-ink-muted" onClick={resetHero}>
              Yeni cümle
            </button>
          ) : null}
        </div>
        <p className="text-sm text-ink-muted">Başlığın kırmızı kısmı vurgu alanına yazılır. Cümle, hazır yazıların ardından döner.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink-muted">Başlık</span>
            <input required value={heroBefore} onChange={(event) => setHeroBefore(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3" placeholder="Sabiha Gökçen'de" />
          </label>
          <label className="block text-sm">
            <span className="text-ink-muted">Kırmızı vurgu</span>
            <input value={heroAccent} onChange={(event) => setHeroAccent(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3" placeholder="7/24 teslim" />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-ink-muted">Alt cümle</span>
          <input required value={heroSub} onChange={(event) => setHeroSub(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3" placeholder="Uçağınız iner inmez aracınız hazır." />
        </label>
        <button type="submit" className="btn-primary w-fit" disabled={busy !== null}>
          {busy === "save-hero" ? "Kaydediliyor…" : heroId ? "Cümleyi güncelle" : "Cümle ekle"}
        </button>
        {heroLines.length ? (
          <ul className="mt-2 divide-y divide-surface-border border-t border-surface-border">
            {heroLines.map((line) => (
              <li key={line.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-ink">
                    {line.before} {line.accent ? <span className="text-brand">{line.accent}</span> : null}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{line.sub}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-outline text-sm" disabled={busy !== null} onClick={() => editHero(line)}>
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="btn-outline text-sm"
                    disabled={busy !== null}
                    onClick={() => remove("hero", line.id, "Bu cümle")}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted">Henüz ek cümle yok. Sitedeki hazır cümleler duruyor.</p>
        )}
      </form>

      <form
        className="card mt-6 grid gap-3 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void saveService();
        }}
      >
        <h2 className="font-display text-lg font-semibold text-ink">Footer hizmetleri</h2>
        <p className="text-sm text-ink-muted">
          Buradaki liste yalnızca sayfanın altındaki Hizmetler sütununu değiştirir. Üst menüdeki dört hizmet aynı kalır. Sayfa metni yazarsanız, bağlantıdaki yeni adres o metni açar. Örnek adres: /havaalani-transfer. Metin her dilde yazdığınız gibi görünür.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink-muted">Hizmet adı</span>
            <input
              required
              value={serviceLabel}
              onChange={(event) => setServiceLabel(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3"
              placeholder="Kampanyalar"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-muted">Bağlantı</span>
            <input
              required
              value={serviceHref}
              onChange={(event) => setServiceHref(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3"
              placeholder="/kampanyalar"
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-ink-muted">Sayfa metni</span>
          <textarea
            value={serviceBody}
            onChange={(event) => setServiceBody(event.target.value)}
            rows={6}
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
            placeholder="Bu hizmete tıklanınca açılacak yazı."
          />
        </label>
        <button type="submit" className="btn-primary w-fit" disabled={busy !== null}>
          {busy === "save-service" ? "Ekleniyor…" : "Hizmet ekle"}
        </button>
        <ul className="mt-2 divide-y divide-surface-border border-t border-surface-border">
          {footerServices.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-ink">{item.label}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.href}</p>
                {item.body ? <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.body}</p> : null}
              </div>
              <button
                type="button"
                className="btn-outline text-sm"
                disabled={busy !== null}
                onClick={() => remove("footer-service", item.id, item.label)}
              >
                Kaldır
              </button>
            </li>
          ))}
        </ul>
      </form>

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
          <label className="block text-sm">
            <span className="text-ink-muted">Kapak görseli</span>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="mt-1 block w-full text-sm text-ink-muted file:me-3 file:rounded-lg file:border-0 file:bg-surface-soft file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setBlogCover(file);
                setBlogCoverPreview((current) => {
                  if (current) URL.revokeObjectURL(current);
                  return file ? URL.createObjectURL(file) : "";
                });
              }}
            />
          </label>
          {blogCoverPreview ? (
            <img src={blogCoverPreview} alt="" className="h-28 w-full rounded-lg object-cover" />
          ) : null}
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
                    <div className="flex items-start gap-3">
                      {post.image ? (
                        <img src={post.image} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                      ) : null}
                      <div className="min-w-0 flex-1">
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
                        {post.source === "panel" ? (
                          <label className="mt-2 block text-xs text-ink-muted">
                            Kapak görseli
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              disabled={busy !== null}
                              className="mt-1 block w-full text-xs file:me-2 file:rounded-md file:border-0 file:bg-surface-soft file:px-2 file:py-1 file:font-semibold file:text-ink"
                              onChange={(event) => {
                                const file = event.target.files?.[0] || null;
                                event.target.value = "";
                                void changeCover(post.slug, file);
                              }}
                            />
                          </label>
                        ) : null}
                      </div>
                    </div>
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
