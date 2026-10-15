"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { fetchFleet, releaseFleetVehicle, updateFleetUnit } from "@/lib/panel-api";
import { STATUS_LABEL } from "@/lib/panel-data";
import type { FleetStatus, FleetVehicle } from "@/lib/panel-types";
import { FleetStatusBadge, formatRelative } from "@/components/panel/Badges";

const FILTERS: Array<FleetStatus | "hepsi"> = ["hepsi", "musait", "kirada", "rezerveli", "bakimda"];

function VehiclesInner() {
  const params = useSearchParams();
  const initial = (params.get("durum") as FleetStatus | null) ?? "hepsi";
  const [filter, setFilter] = useState<FleetStatus | "hepsi">(
    FILTERS.includes(initial) ? initial : "hepsi",
  );
  const [q, setQ] = useState("");
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [fuel, setFuel] = useState(100);
  const [km, setKm] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchFleet();
        if (!cancelled) setFleet(data);
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

  const list = useMemo(() => {
    let items = fleet;
    if (filter !== "hepsi") items = items.filter((v) => v.status === filter);
    if (q.trim()) {
      const s = q.toLowerCase();
      items = items.filter(
        (v) =>
          v.name.toLowerCase().includes(s) ||
          v.plate.toLowerCase().includes(s) ||
          v.id.toLowerCase().includes(s) ||
          v.office.toLowerCase().includes(s),
      );
    }
    return items;
  }, [fleet, filter, q]);

  const active = list.find((v) => v.id === selected) ?? null;

  useEffect(() => {
    if (!active) return;
    setFuel(active.fuelLevel);
    setKm(active.km);
  }, [active]);

  async function reload() {
    setFleet(await fetchFleet());
  }

  async function saveUnit(patch: { status?: FleetVehicle["status"]; fuelLevel?: number; km?: number }) {
    if (!active || saving) return;
    setSaving(true);
    setActionError("");
    try {
      if (patch.status === "musait" && active.status === "bakimda") {
        await releaseFleetVehicle(active.recordId);
        if (patch.fuelLevel != null || patch.km != null) {
          await updateFleetUnit(active.recordId, { fuelLevel: patch.fuelLevel, km: patch.km });
        }
      } else {
        await updateFleetUnit(active.recordId, patch);
      }
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-muted">Yükleniyor…</p>;
  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Araçlar</h1>
          <p className="mt-1 text-sm text-ink-muted">Filo durumu, plaka, yakıt ve son konum.</p>
        </div>
        <p className="text-sm text-ink-muted">{list.length} kayıt</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Plaka, model veya ofis ara…"
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
              {f === "hepsi" ? "Hepsi" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-surface-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-surface-border bg-surface-soft text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Araç</th>
              <th className="px-4 py-3 font-medium">Plaka</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Konum</th>
              <th className="px-4 py-3 font-medium">Yakıt</th>
              <th className="px-4 py-3 font-medium">Km</th>
              <th className="px-4 py-3 font-medium">Güncelleme</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {list.map((v) => (
              <tr
                key={v.id}
                onClick={() => setSelected(v.id)}
                className={`cursor-pointer hover:bg-surface-soft/60 ${active?.id === v.id ? "bg-brand-light" : ""}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                      {v.image && (
                        <Image src={v.image} alt="" fill className="object-contain p-0.5" sizes="56px" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{v.name}</p>
                      <p className="text-xs text-ink-muted">
                        {v.id} · {v.group}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-ink">{v.plate}</td>
                <td className="px-4 py-3">
                  <FleetStatusBadge status={v.status} />
                </td>
                <td className="max-w-[220px] truncate px-4 py-3 text-ink-muted">{v.locationLabel}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-border">
                      <div
                        className={`h-full rounded-full ${v.fuelLevel < 30 ? "bg-rose-500" : "bg-brand"}`}
                        style={{ width: `${v.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-xs text-ink-muted">%{v.fuelLevel}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{v.km.toLocaleString("tr-TR")}</td>
                <td className="px-4 py-3 text-ink-muted">{formatRelative(v.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">Kayıt bulunamadı.</p>
        )}
      </div>

      {active && (
        <form
          className="mt-6 rounded-2xl border border-surface-border bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void saveUnit({ fuelLevel: fuel, km });
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">{active.name}</h2>
              <p className="font-mono text-sm text-ink-muted">
                {active.plate} · {active.id}
              </p>
            </div>
            <FleetStatusBadge status={active.status} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-ink-muted">
              Yakıt %
              <input
                type="number"
                min={0}
                max={100}
                value={fuel}
                onChange={(e) => setFuel(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2 text-ink"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Kilometre
              <input
                type="number"
                min={0}
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2 text-ink"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" className="btn-primary text-sm" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Yakıt ve km kaydet"}
            </button>
            {active.status === "bakimda" ? (
              <button
                type="button"
                className="btn-outline text-sm"
                disabled={saving}
                onClick={() => void saveUnit({ status: "musait", fuelLevel: fuel, km })}
              >
                Bakımdan çıkar
              </button>
            ) : (
              <button
                type="button"
                className="btn-outline text-sm"
                disabled={saving}
                onClick={() => void saveUnit({ status: "bakimda" })}
              >
                Bakıma al
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Kirada ve rezerveli durum kiralama kaydından gelir. Bakım elle kapatılır.
          </p>
          {actionError && <p className="mt-2 text-sm text-rose-600">{actionError}</p>}
        </form>
      )}
    </div>
  );
}

export default function PanelVehiclesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-muted">Yükleniyor…</p>}>
      <VehiclesInner />
    </Suspense>
  );
}
