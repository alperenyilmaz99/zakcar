"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/hooks/useSearch";
import { useCustomer } from "@/hooks/useCustomer";
import type { Reservation } from "@/lib/booking";
import { reservationStatusLabel } from "@/lib/reservation-label";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export default function RezervasyonSorgulamaPage() {
  const params = useSearchParams();
  const { t } = usePrefs();
  const { user, ready, accessToken } = useCustomer();
  const [pnr, setPnr] = useState(params.get("pnr") || "");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Reservation | null>(null);
  const [mine, setMine] = useState<Reservation[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready || !user) {
      setMine([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const token = await accessToken();
      if (!token) return;
      const res = await fetch("/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok || cancelled) return;
      const json = (await res.json()) as Reservation[];
      if (!cancelled && Array.isArray(json)) setMine(json);
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user, accessToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const query = new URLSearchParams({ pnr: pnr.trim(), phone: phone.trim() });
      const res = await fetch(`/api/reservations/lookup?${query.toString()}`);
      const json = (await res.json()) as Reservation & { error?: string };
      if (!res.ok) throw new Error(json.error || t("book.notFound"));
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("book.notFound"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page max-w-lg py-10 lg:py-14">
      <h1 className="section-title">{t("nav.lookup")}</h1>
      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">PNR</span>
          <input
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            placeholder="ZK..."
            required
            className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm uppercase"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">{t("book.lookupPhone")}</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm"
          />
        </label>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? t("book.saving") : t("nav.lookup")}
        </button>
      </form>
      {result && <ReservationCard item={result} />}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {user && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-ink">{t("book.mine")}</h2>
          {mine.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">
              <Link href="/arac-modelleri" className="font-semibold text-brand">
                {t("book.pickCar")}
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {mine.map((item) => (
                <li key={item.pnr}>
                  <ReservationCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {!user && ready && (
        <p className="mt-6 text-center text-sm text-ink-muted">
          <Link href="/giris" className="font-semibold text-brand">
            {t("nav.loginOrJoin")}
          </Link>
        </p>
      )}
    </div>
  );
}

function ReservationCard({ item }: { item: Reservation }) {
  const { t, formatPrice } = usePrefs();
  return (
    <div className="card mt-4 space-y-1 p-4 text-sm">
      <p className="font-display text-lg font-bold text-brand">{item.pnr}</p>
      <p className="font-medium text-ink">
        {item.vehicleName} · {item.plate}
      </p>
      <p className="text-ink-muted">
        {formatDate(item.startAt)} — {formatDate(item.endAt)}
      </p>
      <p className="text-ink-muted">
        {item.pickup}
        {item.dropoff && item.dropoff !== item.pickup ? ` → ${item.dropoff}` : ""}
      </p>
      <p className="font-medium text-ink">
        {t("book.total")}: {formatPrice(`${Number(item.totalPrice || 0)} TL`)}
      </p>
      <p className="text-ink">{reservationStatusLabel(item.status, t)}</p>
    </div>
  );
}
