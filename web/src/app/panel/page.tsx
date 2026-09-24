"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFleet, fetchPanelStats, fetchRentals } from "@/lib/panel-api";
import type { FleetVehicle, PanelStats, Rental } from "@/lib/panel-types";
import {
  FleetStatusBadge,
  RentalStatusBadge,
  formatDateTime,
  formatRelative,
} from "@/components/panel/Badges";

export default function PanelDashboardPage() {
  const [stats, setStats] = useState<PanelStats | null>(null);
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, f, r] = await Promise.all([fetchPanelStats(), fetchFleet(), fetchRentals()]);
        if (cancelled) return;
        setStats(s);
        setFleet(f);
        setRentals(r.filter((x) => x.status === "aktif" || x.status === "bekliyor"));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Veri yüklenemedi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-ink-muted">Veriler yükleniyor…</p>;
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error || "İstatistik alınamadı"}
        <p className="mt-2 text-rose-600/80">
          grants.sql ve seed-fleet.sql dosyalarını Supabase’te çalıştırdığınızdan emin olun.
        </p>
      </div>
    );
  }

  const recent = [...fleet].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
  );

  const cards = [
    { label: "Toplam filo", value: stats.total, href: "/panel/araclar" },
    { label: "Müsait", value: stats.musait, href: "/panel/araclar?durum=musait" },
    { label: "Kirada", value: stats.kirada, href: "/panel/araclar?durum=kirada" },
    { label: "Aktif kiralama", value: stats.aktifKiralama, href: "/panel/kiralamalar?durum=aktif" },
    { label: "Bugün teslim", value: stats.bugunTeslim, href: "/panel/kiralamalar" },
    { label: "Bakımda", value: stats.bakimda, href: "/panel/araclar?durum=bakimda" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Operasyon özeti
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Supabase canlı veri — filo, kiralama ve konum.
          </p>
        </div>
        <Link href="/panel/kapaklar" className="btn-outline text-sm">
          Kapaklar
        </Link>
        <Link href="/panel/konumlar" className="btn-primary text-sm">
          Haritada gör
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-surface-border bg-white px-4 py-4 transition hover:border-brand hover:shadow-card"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-ink">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Aktif / bekleyen kiralamalar</h2>
            <Link href="/panel/kiralamalar" className="text-sm font-medium text-brand hover:underline">
              Tümü
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
            {rentals.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">Henüz kiralama yok.</p>
            ) : (
              <ul className="divide-y divide-surface-border">
                {rentals.slice(0, 6).map((r) => (
                  <li key={r.id} className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          {r.customer.name}{" "}
                          <span className="font-normal text-ink-muted">· {r.pnr}</span>
                        </p>
                        <p className="mt-0.5 truncate text-sm text-ink-muted">
                          {r.vehicleName} · {r.plate}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {formatDateTime(r.startAt)} → {formatDateTime(r.endAt)}
                        </p>
                      </div>
                      <RentalStatusBadge status={r.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Son konum güncellemeleri</h2>
            <Link href="/panel/araclar" className="text-sm font-medium text-brand hover:underline">
              Filo
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
            {recent.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">Filo kaydı yok — seed çalıştırın.</p>
            ) : (
              <ul className="divide-y divide-surface-border">
                {recent.slice(0, 6).map((v) => (
                  <li key={v.id} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">
                        {v.name}{" "}
                        <span className="font-normal text-ink-muted">· {v.plate}</span>
                      </p>
                      <p className="mt-0.5 truncate text-sm text-ink-muted">{v.locationLabel}</p>
                      <p className="mt-1 text-xs text-ink-muted">{formatRelative(v.lastUpdated)}</p>
                    </div>
                    <FleetStatusBadge status={v.status} />
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
