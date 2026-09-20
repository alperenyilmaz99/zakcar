"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getRentals, RENTAL_STATUS_LABEL } from "@/lib/panel-data";
import { RentalStatusBadge, formatDateTime } from "@/components/panel/Badges";

const FILTERS = ["hepsi", "aktif", "bekliyor", "tamamlandi", "iptal"] as const;

function RentalsInner() {
  const params = useSearchParams();
  const initial = params.get("durum") ?? "hepsi";
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(
    FILTERS.includes(initial as (typeof FILTERS)[number])
      ? (initial as (typeof FILTERS)[number])
      : "hepsi",
  );
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const list = useMemo(() => {
    let items = getRentals();
    if (filter !== "hepsi") items = items.filter((r) => r.status === filter);
    if (q.trim()) {
      const s = q.toLowerCase();
      items = items.filter(
        (r) =>
          r.customer.name.toLowerCase().includes(s) ||
          r.pnr.toLowerCase().includes(s) ||
          r.plate.toLowerCase().includes(s) ||
          r.customer.phone.includes(s),
      );
    }
    return items;
  }, [filter, q]);

  const detail = list.find((r) => r.id === selected) ?? list[0] ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Kiralamalar
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Kiracı bilgileri, PNR, teslim / iade ve depozito detayları.
          </p>
        </div>
        <p className="text-sm text-ink-muted">{list.length} kayıt</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="İsim, PNR, plaka veya telefon…"
          className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "bg-brand text-white"
                  : "border border-surface-border bg-white text-ink-muted hover:text-ink"
              }`}
            >
              {f === "hepsi" ? "Hepsi" : RENTAL_STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-white lg:col-span-3">
          <ul className="divide-y divide-surface-border">
            {list.map((r) => {
              const active = (selected ?? list[0]?.id) === r.id;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(r.id)}
                    className={`flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition ${
                      active ? "bg-brand-light" : "hover:bg-surface-soft/80"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">
                        {r.customer.name}{" "}
                        <span className="font-mono text-xs font-normal text-ink-muted">{r.pnr}</span>
                      </p>
                      <p className="mt-0.5 truncate text-sm text-ink-muted">
                        {r.vehicleName} · {r.plate}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {formatDateTime(r.startAt)} → {formatDateTime(r.endAt)}
                      </p>
                    </div>
                    <RentalStatusBadge status={r.status} />
                  </button>
                </li>
              );
            })}
            {list.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-ink-muted">Kayıt bulunamadı.</li>
            )}
          </ul>
        </div>

        <aside className="rounded-2xl border border-surface-border bg-white p-5 lg:col-span-2">
          {detail ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Detay</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">{detail.customer.name}</h2>
                  <p className="font-mono text-sm text-ink-muted">{detail.pnr}</p>
                </div>
                <RentalStatusBadge status={detail.status} />
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-ink-muted">Telefon</dt>
                  <dd className="font-medium text-ink">
                    <a href={`tel:${detail.customer.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                      {detail.customer.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">E-posta</dt>
                  <dd className="font-medium text-ink break-all">{detail.customer.email}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Ehliyet no</dt>
                  <dd className="font-medium text-ink">{detail.customer.licenseNo}</dd>
                </div>
                <div className="border-t border-surface-border pt-3">
                  <dt className="text-ink-muted">Araç</dt>
                  <dd className="font-medium text-ink">
                    {detail.vehicleName} · {detail.plate}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Alış</dt>
                  <dd className="font-medium text-ink">{detail.pickup}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Bırakış</dt>
                  <dd className="font-medium text-ink">{detail.dropoff}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Tarih aralığı</dt>
                  <dd className="font-medium text-ink">
                    {formatDateTime(detail.startAt)}
                    <br />
                    {formatDateTime(detail.endAt)}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-surface-border pt-3">
                  <div>
                    <dt className="text-ink-muted">Günlük</dt>
                    <dd className="font-semibold text-ink">{detail.dailyPrice}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Depozito</dt>
                    <dd className="font-semibold text-ink">{detail.deposit}</dd>
                  </div>
                </div>
                {detail.notes && (
                  <div className="rounded-xl bg-surface-soft px-3 py-2 text-ink-muted">
                    {detail.notes}
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Detay için bir kiralama seçin.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function PanelRentalsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-muted">Yükleniyor…</p>}>
      <RentalsInner />
    </Suspense>
  );
}
