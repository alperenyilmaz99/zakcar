"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { AirportCard } from "@/lib/airport-cards";
import { createClient } from "@/lib/supabase/client";

type Loaded = { items: AirportCard[]; source: "supabase" | "file" };

async function staffToken(): Promise<string> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
  return token;
}

export default function AirportCardsPanelPage() {
  const [items, setItems] = useState<AirportCard[]>([]);
  const [source, setSource] = useState<"supabase" | "file">("file");
  const [drafts, setDrafts] = useState<Record<string, AirportCard>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState("");

  const load = async () => {
    const res = await fetch("/api/airport-cards", { cache: "no-store" });
    const data = (await res.json()) as Loaded;
    if (!res.ok || !Array.isArray(data.items)) throw new Error("Kartlar okunamadı");
    setItems(data.items);
    setSource(data.source);
    setDrafts(Object.fromEntries(data.items.map((item) => [item.id, item])));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Yüklenemedi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = (id: string, next: Partial<AirportCard>) => {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...next } }));
  };

  const upload = async (file: File): Promise<string> => {
    if (source === "file") {
      const token = await staffToken();
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/airport-cards/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "Görsel yüklenemedi");
      return json.url;
    }

    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `airport-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("promo-covers").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });
    if (uploadError) throw uploadError;
    return supabase.storage.from("promo-covers").getPublicUrl(path).data.publicUrl;
  };

  const save = async (card: AirportCard, file: File | null) => {
    setBusyId(card.id);
    setError("");
    setSavedId("");
    try {
      const imageUrl = file ? await upload(file) : card.imageUrl;
      const next = { ...card, imageUrl };
      if (source === "supabase") {
        const supabase = createClient();
        const { error: saveError } = await supabase.from("airport_cards").upsert({
          id: next.id,
          image_url: next.imageUrl,
          href: next.href,
          title: next.title.trim(),
          summary: next.text.trim(),
          detail: next.detail.trim(),
          sort_order: items.findIndex((item) => item.id === next.id),
          updated_at: new Date().toISOString(),
        });
        if (saveError) {
          if (/airport_cards|schema cache/i.test(saveError.message)) {
            throw new Error("Kalıcı kayıt için Supabase SQL Editor’da airport-cards.sql dosyasını çalıştırın.");
          }
          throw saveError;
        }
      } else {
        const token = await staffToken();
        const res = await fetch("/api/airport-cards", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(json.error || "Kaydedilemedi");
      }
      await load();
      setSavedId(card.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-sm text-ink-muted">Yükleniyor…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Havalimanı kartları</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Ana sayfadaki dört kartın görselini, başlığını ve metnini buradan değiştirin. Detay yazısı boşsa hazır sayfa metni durur.
      </p>
      <p className="mt-3 text-xs text-ink-muted">{source === "supabase" ? "Supabase" : "Yerel kayıt"}</p>

      {source === "file" && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Kalıcı kayıt için Supabase SQL Editor’da <code className="font-mono">web/supabase/airport-cards.sql</code> dosyasını
          çalıştırın.
        </div>
      )}
      {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="mt-8 space-y-8">
        {items.map((item) => {
          const draft = drafts[item.id] || item;
          return (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
              <div className="grid gap-5 p-4 lg:grid-cols-[280px_1fr]">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-soft">
                    <Image src={draft.imageUrl} alt={draft.title} fill className="object-cover" sizes="280px" />
                  </div>
                  <label className="btn-outline mt-3 inline-flex cursor-pointer text-xs">
                    Görseli değiştir
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        e.target.value = "";
                        if (file) void save(draft, file);
                      }}
                    />
                  </label>
                </div>
                <div className="grid gap-3">
                  <label className="block text-sm font-medium text-ink">
                    Başlık
                    <input
                      value={draft.title}
                      onChange={(e) => patch(item.id, { title: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-surface-border bg-surface-soft px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Kart metni
                    <textarea
                      value={draft.text}
                      rows={3}
                      onChange={(e) => patch(item.id, { text: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-surface-border bg-surface-soft px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Detay sayfası yazısı
                    <textarea
                      value={draft.detail}
                      rows={6}
                      placeholder="Boş bırakılırsa hazır detay yazısı gösterilir. Doluysa bu metin Detaylar sayfasında görünür."
                      onChange={(e) => patch(item.id, { detail: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-surface-border bg-surface-soft px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="btn-primary text-xs"
                      disabled={busyId === item.id}
                      onClick={() => void save(draft, null)}
                    >
                      Kaydet
                    </button>
                    {savedId === item.id && <span className="text-sm text-ink-muted">Kaydedildi</span>}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
