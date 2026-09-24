"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  createPromoCover,
  deletePromoCover,
  fetchPromoCovers,
  reorderPromoCovers,
  savePromoCover,
} from "@/lib/panel-api";
import type { PromoCover } from "@/lib/promo";

export default function PromoCoversPage() {
  const [items, setItems] = useState<PromoCover[]>([]);
  const [source, setSource] = useState<"supabase" | "file">("file");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PromoCover | null>(null);
  const addRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setError("");
    const data = await fetchPromoCovers();
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

  const run = async (id: string, fn: () => Promise<void>) => {
    setBusyId(id);
    setError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "İşlem başarısız");
    } finally {
      setBusyId(null);
    }
  };

  const onAdd = async (file: File | null) => {
    if (!file) return;
    await run("new", async () => {
      await createPromoCover(file, source);
    });
  };

  const onReplaceImage = async (cover: PromoCover, file: File | null) => {
    if (!file) return;
    await run(cover.id, async () => {
      await savePromoCover(cover, file, source);
    });
  };

  const onSaveEdit = async (cover: PromoCover) => {
    await run(cover.id, async () => {
      await savePromoCover(cover, null, source);
      setEditing(null);
    });
  };

  const onDelete = async (cover: PromoCover) => {
    if (!window.confirm(`“${cover.title || "Bu kapak"}” kaldırılsın mı?`)) return;
    await run(cover.id, async () => {
      await deletePromoCover(cover, source);
    });
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    const [row] = copy.splice(index, 1);
    copy.splice(next, 0, row);
    setItems(copy);
    await run("sort", async () => {
      await reorderPromoCovers(copy, source);
    });
  };

  if (loading) return <p className="text-sm text-ink-muted">Yükleniyor…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Kapak görselleri
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Ana sayfa kampanya kapaklarını ekleyin, değiştirin veya kaldırın.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-ink-muted">
            {source === "supabase" ? "Supabase" : "Yerel kayıt"} · {items.length} kapak
          </p>
          <input
            ref={addRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              e.target.value = "";
              void onAdd(file);
            }}
          />
          <button type="button" className="btn-primary text-sm" onClick={() => addRef.current?.click()}>
            Görsel ekle
          </button>
        </div>
      </div>

      {source === "file" && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Kalıcı kayıt için Supabase SQL Editor’da <code className="font-mono">web/supabase/promo-covers.sql</code>{" "}
          dosyasını çalıştırın. Şimdilik değişiklikler bu sunucudaki dosyaya yazılıyor.
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {items.map((cover, index) => (
          <article key={cover.id} className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
            <div className="relative aspect-[16/7] bg-ink">
              {cover.imageUrl ? (
                <Image src={cover.imageUrl} alt={cover.title} fill className="object-cover" sizes="640px" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/60">Görsel yok</div>
              )}
            </div>
            <div className="space-y-3 p-4">
              {editing?.id === cover.id ? (
                <EditForm
                  cover={editing}
                  busy={busyId === cover.id}
                  onChange={setEditing}
                  onCancel={() => setEditing(null)}
                  onSave={() => void onSaveEdit(editing)}
                />
              ) : (
                <>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">
                      {cover.title} <span className="text-brand">{cover.highlight}</span>
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">{cover.sub || "—"}</p>
                    <p className="mt-2 text-xs text-ink-muted">
                      {cover.badge || "Rozet yok"} · {cover.href}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="btn-outline cursor-pointer text-xs">
                      Görseli değiştir
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          e.target.value = "";
                          void onReplaceImage(cover, file);
                        }}
                      />
                    </label>
                    <button type="button" className="btn-outline text-xs" onClick={() => setEditing(cover)}>
                      Metni düzenle
                    </button>
                    <button
                      type="button"
                      className="btn-outline text-xs"
                      disabled={index === 0}
                      onClick={() => void move(index, -1)}
                    >
                      Yukarı
                    </button>
                    <button
                      type="button"
                      className="btn-outline text-xs"
                      disabled={index === items.length - 1}
                      onClick={() => void move(index, 1)}
                    >
                      Aşağı
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-rose-200 px-5 py-3 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      onClick={() => void onDelete(cover)}
                    >
                      Kaldır
                    </button>
                  </div>
                </>
              )}
              {busyId === cover.id && <p className="text-xs text-ink-muted">Kaydediliyor…</p>}
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-muted">Henüz kapak yok. “Görsel ekle” ile yükleyin.</p>
      )}
    </div>
  );
}

function EditForm({
  cover,
  busy,
  onChange,
  onCancel,
  onSave,
}: {
  cover: PromoCover;
  busy: boolean;
  onChange: (cover: PromoCover) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const set = (patch: Partial<PromoCover>) => onChange({ ...cover, ...patch });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Başlık" value={cover.title} onChange={(v) => set({ title: v })} />
      <Field label="Vurgu" value={cover.highlight} onChange={(v) => set({ highlight: v })} />
      <Field label="Açıklama" value={cover.sub} onChange={(v) => set({ sub: v })} className="sm:col-span-2" />
      <Field label="Rozet" value={cover.badge} onChange={(v) => set({ badge: v })} />
      <Field label="Bağlantı" value={cover.href} onChange={(v) => set({ href: v })} />
      <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
        <input
          type="checkbox"
          checked={cover.isActive}
          onChange={(e) => set({ isActive: e.target.checked })}
        />
        Ana sayfada göster
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <button type="button" className="btn-primary text-xs" disabled={busy} onClick={onSave}>
          Kaydet
        </button>
        <button type="button" className="btn-outline text-xs" onClick={onCancel}>
          Vazgeç
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium text-ink ${className}`}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-surface-border bg-surface-soft px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
