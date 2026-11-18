"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DISTRICTS, type District, type DistrictSide } from "@/lib/districts";
import { createClient } from "@/lib/supabase/client";

const builtin = new Set(DISTRICTS.map((item) => item.slug));

async function staffToken(): Promise<string> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
  return token;
}

export default function DistrictsPanelPage() {
  const [items, setItems] = useState<District[]>([]);
  const [source, setSource] = useState<"supabase" | "file">("file");
  const [name, setName] = useState("");
  const [side, setSide] = useState<DistrictSide>("avrupa");
  const [pickup, setPickup] = useState<"saw" | "iga">("iga");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch("/api/districts", { cache: "no-store" });
    const data = (await res.json()) as { items?: District[]; source?: "supabase" | "file"; error?: string };
    if (!res.ok || !Array.isArray(data.items)) throw new Error(data.error || "Semtler okunamadı");
    setItems(data.items);
    setSource(data.source || "file");
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

  const add = async () => {
    setSaving(true);
    setError("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/districts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name, side, pickup }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Eklenemedi");
      setName("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eklenemedi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (district: District) => {
    if (!window.confirm(`${district.name} listeden kaldırılsın mı?`)) return;
    setSaving(true);
    setError("");
    try {
      const token = await staffToken();
      const res = await fetch(`/api/districts?slug=${encodeURIComponent(district.slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silinemedi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-muted">Yükleniyor…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Semtler</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Eklenen semt menüde, footer’da ve kendi sayfasında görünür. Kayıt: {source === "supabase" ? "Supabase" : "yerel dosya"}.
      </p>

      {source === "file" && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Kalıcı kayıt için Supabase SQL Editor’da <code className="font-mono">web/supabase/districts.sql</code> dosyasını çalıştırın.
        </p>
      )}

      <form
        className="mt-6 rounded-2xl border border-surface-border bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          void add();
        }}
      >
        <h2 className="font-display text-lg font-bold text-ink">Semt ekle</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-ink-muted">
            Semt adı
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn. Beşiktaş"
              className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2 text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Yaka
            <select
              value={side}
              onChange={(event) => {
                const next = event.target.value as DistrictSide;
                setSide(next);
                setPickup(next === "anadolu" ? "saw" : "iga");
              }}
              className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-ink"
            >
              <option value="avrupa">Avrupa</option>
              <option value="anadolu">Anadolu</option>
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            Teslim noktası
            <select
              value={pickup}
              onChange={(event) => setPickup(event.target.value as "saw" | "iga")}
              className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-ink"
            >
              <option value="saw">Sabiha Gökçen</option>
              <option value="iga">İstanbul Havalimanı</option>
            </select>
          </label>
        </div>
        <button type="submit" className="btn-primary mt-4 text-sm" disabled={saving || name.trim().length < 2}>
          {saving ? "Kaydediliyor…" : "Semti ekle"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <ul className="mt-6 divide-y divide-surface-border overflow-hidden rounded-2xl border border-surface-border bg-white">
        {items.map((district) => (
          <li key={district.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium text-ink">{district.name} Araç Kiralama</p>
              <p className="text-xs text-ink-muted">
                {district.side === "anadolu" ? "Anadolu" : "Avrupa"} · {district.pickup === "saw" ? "Sabiha Gökçen" : "İstanbul Havalimanı"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/${district.slug}`} className="text-sm font-medium text-brand hover:underline" target="_blank">
                Sayfayı aç
              </Link>
              {builtin.has(district.slug) ? (
                <span className="text-xs text-ink-muted">Hazır</span>
              ) : (
                <button type="button" className="text-sm font-medium text-rose-700" disabled={saving} onClick={() => void remove(district)}>
                  Kaldır
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
