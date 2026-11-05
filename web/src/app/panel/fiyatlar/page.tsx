"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PriceRow = {
  id: string;
  slug: string;
  name: string;
  vehicle_group: string;
  daily_price_try: number | null;
  deposit_try: number | null;
};

type Draft = { daily: string; deposit: string };

function asInput(value: number | null): string {
  if (value === null || Number.isNaN(Number(value))) return "0";
  return String(value);
}

function parseAmount(value: string): number {
  const amount = Number(value.trim().replace(",", "."));
  if (!Number.isFinite(amount) || amount < 0) throw new Error("Tutar 0 veya daha büyük bir sayı olmalı.");
  return Math.round(amount * 100) / 100;
}

export default function PricesPage() {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("vehicle_models")
      .select("id,slug,name,vehicle_group,daily_price_try,deposit_try")
      .eq("is_active", true)
      .order("vehicle_group")
      .order("name");
    if (queryError) throw queryError;
    const list = (data || []) as PriceRow[];
    setRows(list);
    setDrafts(
      Object.fromEntries(
        list.map((row) => [row.id, { daily: asInput(row.daily_price_try), deposit: asInput(row.deposit_try) }]),
      ),
    );
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Fiyatlar okunamadı");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateDraft = (id: string, field: keyof Draft, value: string) => {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  };

  const save = async (row: PriceRow) => {
    const draft = drafts[row.id];
    setBusyId(row.id);
    setError("");
    setNote("");
    try {
      const daily = parseAmount(draft?.daily ?? "0");
      const deposit = parseAmount(draft?.deposit ?? "0");
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("vehicle_models")
        .update({ daily_price_try: daily, deposit_try: deposit })
        .eq("id", row.id);
      if (updateError) throw updateError;
      setNote(`${row.name} kaydedildi.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setBusyId(null);
    }
  };

  const zeroAll = async () => {
    if (!window.confirm("Listedeki bütün günlük fiyatlar ve depozitolar 0 TL yapılsın mı?")) return;
    setBusyId("all");
    setError("");
    setNote("");
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("vehicle_models")
        .update({ daily_price_try: 0, deposit_try: 0 })
        .not("slug", "is", null);
      if (updateError) throw updateError;
      setNote("Bütün fiyatlar 0 TL yapıldı.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sıfırlanamadı");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Fiyatlar</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Günlük kiralama ve depozito tutarları. Kaydettikten sonra sitedeki kartlar ve rezervasyon bu tutarı kullanır.
          </p>
        </div>
        <button type="button" className="btn-outline" onClick={zeroAll} disabled={loading || busyId !== null}>
          Tümünü sıfırla
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-brand">{error}</p>}
      {note && <p className="mt-4 text-sm text-ink-muted">{note}</p>}

      {loading ? (
        <p className="mt-8 text-sm text-ink-muted">Yükleniyor...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-3">Model</th>
                <th className="px-3">Grup</th>
                <th className="px-3">Günlük TL</th>
                <th className="px-3">Depozito TL</th>
                <th className="px-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="card">
                  <td className="rounded-l-2xl px-3 py-3 font-medium text-ink">{row.name}</td>
                  <td className="px-3 py-3 text-ink-muted">{row.vehicle_group}</td>
                  <td className="px-3 py-3">
                    <input
                      inputMode="decimal"
                      value={drafts[row.id]?.daily ?? "0"}
                      onChange={(event) => updateDraft(row.id, "daily", event.target.value)}
                      className="h-10 w-28 rounded-lg border border-surface-border px-3"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      inputMode="decimal"
                      value={drafts[row.id]?.deposit ?? "0"}
                      onChange={(event) => updateDraft(row.id, "deposit", event.target.value)}
                      className="h-10 w-28 rounded-lg border border-surface-border px-3"
                    />
                  </td>
                  <td className="rounded-r-2xl px-3 py-3 text-right">
                    <button
                      type="button"
                      className="btn-primary px-4 py-2"
                      disabled={busyId !== null}
                      onClick={() => save(row)}
                    >
                      {busyId === row.id ? "Kaydediliyor" : "Kaydet"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="mt-4 text-sm text-ink-muted">Kayıtlı model bulunamadı.</p>}
        </div>
      )}
    </div>
  );
}
