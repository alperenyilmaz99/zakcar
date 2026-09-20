"use client";

import { useMemo, useState } from "react";
import { getFleet, STATUS_LABEL } from "@/lib/panel-data";
import type { FleetStatus, FleetVehicle } from "@/lib/panel-types";
import { FleetStatusBadge, formatRelative } from "@/components/panel/Badges";

/** Rough bounds covering Istanbul metro area */
const BOUNDS = {
  minLat: 40.82,
  maxLat: 41.35,
  minLng: 28.55,
  maxLng: 29.45,
};

function toPercent(v: FleetVehicle) {
  const x = ((v.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = (1 - (v.lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return {
    left: Math.min(96, Math.max(4, x)),
    top: Math.min(94, Math.max(6, y)),
  };
}

const DOT: Record<FleetStatus, string> = {
  musait: "bg-emerald-500",
  kirada: "bg-sky-500",
  rezerveli: "bg-amber-500",
  bakimda: "bg-rose-500",
};

export default function PanelLocationsPage() {
  const fleet = getFleet();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<FleetStatus | "hepsi">("hepsi");

  const visible = useMemo(
    () => (filter === "hepsi" ? fleet : fleet.filter((v) => v.status === filter)),
    [fleet, filter],
  );

  const active = visible.find((v) => v.id === selected) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Konumlar
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Filo araçlarının anlık konum haritası (demo koordinatlar).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["hepsi", "musait", "kirada", "rezerveli", "bakimda"] as const).map((f) => (
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
              {f === "hepsi" ? "Hepsi" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-white lg:col-span-2">
          {/* Map plane */}
          <div
            className="relative aspect-[4/3] w-full sm:aspect-[16/10]"
            style={{
              background:
                "linear-gradient(160deg, #dbeafe 0%, #e0f2fe 35%, #ecfdf5 70%, #f0f9ff 100%)",
            }}
          >
            {/* soft grid */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(18,25,38,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(18,25,38,0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* water / land suggestion blobs */}
            <div className="absolute left-[18%] top-[28%] h-24 w-40 rounded-full bg-sky-300/30 blur-2xl" />
            <div className="absolute bottom-[20%] right-[15%] h-32 w-48 rounded-full bg-emerald-300/25 blur-2xl" />

            <p className="absolute left-4 top-4 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-ink-muted shadow-sm">
              İstanbul bölgesi · {visible.length} araç
            </p>

            {visible.map((v) => {
              const { left, top } = toPercent(v);
              const isSel = active?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  title={`${v.name} · ${v.plate}`}
                  onClick={() => setSelected(v.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition ${
                    isSel ? "z-20 scale-125" : "z-10 hover:scale-110"
                  }`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <span
                    className={`block h-3.5 w-3.5 rounded-full ring-2 ring-white shadow ${DOT[v.status]} ${
                      v.status === "kirada" ? "animate-pulse" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 border-t border-surface-border px-4 py-3 text-xs text-ink-muted">
            {(Object.keys(STATUS_LABEL) as FleetStatus[]).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${DOT[s]}`} />
                {STATUS_LABEL[s]}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-surface-border bg-white p-5">
          {active ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Seçili araç</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">{active.name}</h2>
                  <p className="font-mono text-sm text-ink">{active.plate}</p>
                </div>
                <FleetStatusBadge status={active.status} />
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-ink-muted">Konum</dt>
                  <dd className="font-medium text-ink">{active.locationLabel}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Koordinat</dt>
                  <dd className="font-mono text-ink">
                    {active.lat.toFixed(5)}, {active.lng.toFixed(5)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Bağlı ofis</dt>
                  <dd className="font-medium text-ink">{active.office}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Yakıt / Km</dt>
                  <dd className="font-medium text-ink">
                    %{active.fuelLevel} · {active.km.toLocaleString("tr-TR")} km
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Son sinyal</dt>
                  <dd className="font-medium text-ink">{formatRelative(active.lastUpdated)}</dd>
                </div>
              </dl>
              <a
                href={`https://www.google.com/maps?q=${active.lat},${active.lng}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full text-sm"
              >
                Google Maps’te aç
              </a>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-ink-muted">
              Haritadaki bir noktaya tıklayarak araç detayını ve koordinatları görün. Kiradaki araçlar
              nabız animasyonuyla işaretlenir.
            </p>
          )}

          <div className="mt-6 max-h-64 space-y-2 overflow-y-auto border-t border-surface-border pt-4">
            {visible.slice(0, 12).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelected(v.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-surface-soft ${
                  active?.id === v.id ? "bg-brand-light" : ""
                }`}
              >
                <span className="truncate font-medium text-ink">
                  {v.plate} · {v.name}
                </span>
                <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[v.status]}`} />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
