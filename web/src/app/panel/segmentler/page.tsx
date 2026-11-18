"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SEGMENTS } from "@/lib/segments";
import type { SegmentImage, SegmentLoad } from "@/lib/segment-store";
import { createClient } from "@/lib/supabase/client";

async function staffToken(): Promise<string> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
  return token;
}

async function uploadSegmentFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Yalnızca görsel yükleyin.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Görsel 5 MB'dan küçük olmalı.");
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `segments/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("promo-covers").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return supabase.storage.from("promo-covers").getPublicUrl(path).data.publicUrl;
}

export default function SegmentsPanelPage() {
  const [items, setItems] = useState<SegmentImage[]>([]);
  const [source, setSource] = useState<SegmentLoad["source"]>("file");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");

  const load = async () => {
    const res = await fetch("/api/segments", { cache: "no-store" });
    const data = (await res.json()) as SegmentLoad & { error?: string };
    if (!res.ok || !Array.isArray(data.items)) throw new Error(data.error || "Segmentler okunamadı");
    setItems(data.items);
    setSource(data.source);
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

  const save = async (id: string, imageUrl: string) => {
    setBusyId(id);
    setError("");
    setSavedId("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/segments", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id, imageUrl }),
      });
      const data = (await res.json()) as SegmentLoad & { error?: string };
      if (!res.ok || !Array.isArray(data.items)) throw new Error(data.error || "Kaydedilemedi");
      setItems(data.items);
      setSource(data.source);
      setSavedId(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-sm text-ink-muted">Yükleniyor…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Segment görselleri</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Ana sayfadaki İhtiyacına Göre Araç Segmentleri bölümünün fotoğrafları. Yeni dosya seçince sitedeki görsel değişir.
      </p>
      {source === "file" && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Kalıcı kayıt için Supabase SQL Editor’da <code className="font-mono">web/supabase/segments.sql</code> dosyasını
          çalıştırın.
        </div>
      )}
      {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {SEGMENTS.map((segment) => {
          const item = items.find((row) => row.id === segment.id);
          const src = item?.imageUrl || segment.image;
          const busy = busyId === segment.id;
          return (
            <article key={segment.id} className="rounded-2xl border border-surface-border bg-white p-4 shadow-card">
              <div className="relative h-36 rounded-xl bg-surface-soft">
                <Image src={src} alt={segment.label} fill className="object-contain p-3" sizes="320px" />
              </div>
              <h2 className="mt-3 font-display text-lg font-semibold text-ink">{segment.label}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="btn-primary cursor-pointer text-sm">
                  {busy ? "Kaydediliyor…" : "Görseli değiştir"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      void (async () => {
                        setBusyId(segment.id);
                        setError("");
                        try {
                          const url = await uploadSegmentFile(file);
                          await save(segment.id, url);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Görsel yüklenemedi");
                          setBusyId(null);
                        }
                      })();
                    }}
                  />
                </label>
                {item?.custom ? (
                  <button type="button" className="btn-outline text-sm" disabled={busy} onClick={() => void save(segment.id, "")}>
                    Varsayılana dön
                  </button>
                ) : null}
                {savedId === segment.id ? <span className="text-xs text-ink-muted">Kaydedildi</span> : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
