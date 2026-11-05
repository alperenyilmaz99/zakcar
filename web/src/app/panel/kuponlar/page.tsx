"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeCouponCode, type Coupon } from "@/lib/coupon-math";

async function staffToken(): Promise<string> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Personel oturumu gerekli.");
  return token;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [needsSql, setNeedsSql] = useState(false);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("10");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setError("");
    const token = await staffToken();
    const res = await fetch("/api/panel/coupons", {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as { coupons?: Coupon[]; needsSql?: boolean; error?: string };
    if (!res.ok) throw new Error(json.error || "Kuponlar okunamadı.");
    setCoupons(json.coupons || []);
    setNeedsSql(Boolean(json.needsSql));
  }, []);

  useEffect(() => {
    load()
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Kuponlar okunamadı."))
      .finally(() => setLoading(false));
  }, [load]);

  async function addCoupon() {
    setBusy(true);
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code, percent: Number(percent) }),
      });
      const json = (await res.json()) as { error?: string; needsSql?: boolean };
      if (!res.ok) throw new Error(json.error || "Kupon kaydedilemedi.");
      setCode("");
      setNote("Kupon kaydedildi.");
      if (json.needsSql) setNeedsSql(true);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Kupon kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(coupon: Coupon) {
    setBusy(true);
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Kupon güncellenemedi.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Kupon güncellenemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(coupon: Coupon) {
    if (!window.confirm(`${coupon.code} kuponu silinsin mi?`)) return;
    setBusy(true);
    setError("");
    setNote("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: coupon.id }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Kupon silinemedi.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Kupon silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">İndirim kuponları</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        Kupon kodu ve indirim yüzdesi. Müşteri rezervasyonda kodu uygulayınca kiralama tutarından düşülür. Depozito değişmez.
      </p>

      {needsSql && (
        <p className="mt-4 rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-ink">
          Kuponun rezervasyon kaydındaki fiyata yazılması için Supabase SQL Editor’da{" "}
          <span className="font-semibold">web/supabase/coupons.sql</span> dosyasını bir kez çalıştırın.
        </p>
      )}
      {error && <p className="mt-4 text-sm text-brand">{error}</p>}
      {note && <p className="mt-4 text-sm text-ink-muted">{note}</p>}

      <div className="card mt-6 grid gap-3 p-4 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
        <label className="block text-sm">
          <span className="text-ink-muted">Kupon kodu</span>
          <input
            value={code}
            onChange={(event) => setCode(normalizeCouponCode(event.target.value))}
            placeholder="YAZ10"
            className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3 uppercase"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-muted">Yüzde</span>
          <input
            inputMode="numeric"
            value={percent}
            onChange={(event) => setPercent(event.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-surface-border px-3"
          />
        </label>
        <button type="button" className="btn-primary h-10 px-4" disabled={busy} onClick={addCoupon}>
          {busy ? "Kaydediliyor" : "Kupon ekle"}
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-muted">Yükleniyor...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-3">Kod</th>
                <th className="px-3">Yüzde</th>
                <th className="px-3">Durum</th>
                <th className="px-3" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="card">
                  <td className="rounded-l-2xl px-3 py-3 font-semibold text-ink">{coupon.code}</td>
                  <td className="px-3 py-3">%{coupon.percent}</td>
                  <td className="px-3 py-3 text-ink-muted">{coupon.active ? "Aktif" : "Kapalı"}</td>
                  <td className="rounded-r-2xl px-3 py-3 text-right">
                    <button
                      type="button"
                      className="btn-outline mr-2 px-3 py-2"
                      disabled={busy}
                      onClick={() => toggle(coupon)}
                    >
                      {coupon.active ? "Kapat" : "Aç"}
                    </button>
                    <button type="button" className="btn-outline px-3 py-2" disabled={busy} onClick={() => remove(coupon)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <p className="mt-4 text-sm text-ink-muted">Henüz kupon yok.</p>}
        </div>
      )}
    </div>
  );
}
