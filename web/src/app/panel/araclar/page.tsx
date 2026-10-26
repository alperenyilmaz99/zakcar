"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  createFleetVehicle,
  deleteFleetVehicle,
  fetchFleet,
  fetchFleetFormOptions,
  fetchRentals,
  releaseFleetVehicle,
  updateFleetUnit,
  updateFleetVehicle,
  uploadVehicleImage,
  type FleetModelOption,
  type FleetOfficeOption,
} from "@/lib/panel-api";
import { STATUS_LABEL } from "@/lib/panel-data";
import type { FleetStatus, FleetVehicle, Rental } from "@/lib/panel-types";
import { FleetStatusBadge, RentalStatusBadge, formatDateTime, formatRelative } from "@/components/panel/Badges";

const FILTERS: Array<FleetStatus | "hepsi"> = ["hepsi", "musait", "kirada", "rezerveli", "bakimda"];

function VehiclesInner() {
  const params = useSearchParams();
  const initial = (params.get("durum") as FleetStatus | null) ?? "hepsi";
  const [filter, setFilter] = useState<FleetStatus | "hepsi">(
    FILTERS.includes(initial) ? initial : "hepsi",
  );
  const [q, setQ] = useState("");
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [fuel, setFuel] = useState(100);
  const [km, setKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [models, setModels] = useState<FleetModelOption[]>([]);
  const [offices, setOffices] = useState<FleetOfficeOption[]>([]);
  const [newModelId, setNewModelId] = useState("");
  const [newOfficeId, setNewOfficeId] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newFuel, setNewFuel] = useState(100);
  const [newKm, setNewKm] = useState(0);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editPlate, setEditPlate] = useState("");
  const [editModelId, setEditModelId] = useState("");
  const [editOfficeId, setEditOfficeId] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [data, bookings, options] = await Promise.all([
          fetchFleet(),
          fetchRentals(),
          fetchFleetFormOptions(),
        ]);
        if (!cancelled) {
          setFleet(data);
          setRentals(bookings);
          setModels(options.models);
          setOffices(options.offices);
          setNewModelId((current) => current || options.models[0]?.id || "");
          setNewOfficeId((current) => current || options.offices[0]?.id || "");
        }
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

  const openByVehicle = useMemo(() => {
    const grouped = new Map<string, Rental[]>();
    for (const rental of rentals) {
      if (rental.status !== "aktif" && rental.status !== "bekliyor") continue;
      const listForVehicle = grouped.get(rental.vehicleId) ?? [];
      listForVehicle.push(rental);
      grouped.set(rental.vehicleId, listForVehicle);
    }
    for (const items of grouped.values()) {
      items.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    }
    return grouped;
  }, [rentals]);

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
          v.office.toLowerCase().includes(s) ||
          (openByVehicle.get(v.id) ?? []).some(
            (rental) =>
              rental.customer.name.toLowerCase().includes(s) ||
              rental.pnr.toLowerCase().includes(s) ||
              rental.customer.phone.includes(s),
          ),
      );
    }
    return items;
  }, [fleet, filter, q, openByVehicle]);

  const active = list.find((v) => v.id === selected) ?? null;

  useEffect(() => {
    if (!active) return;
    setFuel(active.fuelLevel);
    setKm(active.km);
    setEditPlate(active.plate);
    setEditModelId(models.find((model) => model.slug === active.vehicleSlug)?.id || models[0]?.id || "");
    setEditOfficeId(offices.find((office) => office.name === active.office)?.id || offices[0]?.id || "");
    setEditImage(null);
  }, [active, models, offices]);

  async function reload() {
    const [data, bookings] = await Promise.all([fetchFleet(), fetchRentals()]);
    setFleet(data);
    setRentals(bookings);
  }

  async function addVehicle() {
    if (saving) return;
    setSaving(true);
    setActionError("");
    try {
      const imageUrl = newImage ? await uploadVehicleImage(newImage) : undefined;
      await createFleetVehicle({
        modelId: newModelId,
        officeId: newOfficeId,
        plate: newPlate,
        fuelLevel: newFuel,
        km: newKm,
        imageUrl,
      });
      setNewPlate("");
      setNewImage(null);
      setAdding(false);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Araç eklenemedi");
    } finally {
      setSaving(false);
    }
  }

  async function removeVehicle() {
    if (!active || saving) return;
    const open = openByVehicle.get(active.id) ?? [];
    if (open.length > 0) {
      setActionError("Açık kiralaması veya rezervasyonu olan araç silinemez.");
      return;
    }
    if (!window.confirm(`${active.plate} plakalı araç silinsin mi?`)) return;
    setSaving(true);
    setActionError("");
    try {
      await deleteFleetVehicle(active.recordId);
      setSelected(null);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Araç silinemedi");
    } finally {
      setSaving(false);
    }
  }

  async function saveVehicle() {
    if (!active || saving) return;
    setSaving(true);
    setActionError("");
    try {
      const imageUrl = editImage ? await uploadVehicleImage(editImage) : undefined;
      await updateFleetVehicle({
        recordId: active.recordId,
        modelId: editModelId,
        officeId: editOfficeId,
        plate: editPlate,
        fuelLevel: fuel,
        km,
        imageUrl,
      });
      setEditImage(null);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
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
          <p className="mt-1 text-sm text-ink-muted">Filo durumu, kiracı, süre, yakıt ve son konum.</p>
        </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-ink-muted">{list.length} kayıt</p>
            <button type="button" className="btn-primary text-sm" onClick={() => setAdding((open) => !open)}>
              {adding ? "Formu kapat" : "Araç ekle"}
            </button>
          </div>
        </div>

        {adding && (
          <form
            className="mt-6 rounded-2xl border border-surface-border bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              void addVehicle();
            }}
          >
            <h2 className="font-display text-lg font-bold text-ink">Yeni araç</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-sm text-ink-muted">
                Model
                <select
                  value={newModelId}
                  onChange={(e) => setNewModelId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-ink"
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-ink-muted">
                Ofis
                <select
                  value={newOfficeId}
                  onChange={(e) => setNewOfficeId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-ink"
                >
                  {offices.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-ink-muted">
                Plaka
                <input
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  placeholder="34 ABC 123"
                  className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2 text-ink"
                />
              </label>
              <label className="text-sm text-ink-muted">
                Yakıt %
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newFuel}
                  onChange={(e) => setNewFuel(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2 text-ink"
                />
              </label>
              <label className="text-sm text-ink-muted">
                Kilometre
                <input
                  type="number"
                  min={0}
                  value={newKm}
                  onChange={(e) => setNewKm(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2 text-ink"
                />
              </label>
              <label className="text-sm text-ink-muted">
                Görsel
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="mt-1 w-full text-sm text-ink"
                />
              </label>
            </div>
            <button type="submit" className="btn-primary mt-4 text-sm" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Filoya ekle"}
            </button>
            {actionError && <p className="mt-2 text-sm text-rose-600">{actionError}</p>}
          </form>
        )}

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
              <th className="px-4 py-3 font-medium">Kiracı ve süre</th>
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
                        <img src={photoSrc(v.image)} alt="" className="h-full w-full object-contain p-0.5" />
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
                <td className="max-w-[260px] px-4 py-3">
                  <RentalSummary rentals={openByVehicle.get(v.id) ?? []} />
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
            void saveVehicle();
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm text-ink-muted">
              Model
              <select
                value={editModelId}
                onChange={(e) => setEditModelId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-ink"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-ink-muted">
              Ofis
              <select
                value={editOfficeId}
                onChange={(e) => setEditOfficeId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-ink"
              >
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-ink-muted">
              Plaka
              <input
                value={editPlate}
                onChange={(e) => setEditPlate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2 text-ink"
              />
            </label>
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
            <label className="text-sm text-ink-muted">
              Görsel
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                className="mt-1 w-full text-sm text-ink"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            Görsel, seçili modele aittir. Aynı modeldeki diğer plakalar da bu fotoğrafı kullanır.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" className="btn-primary text-sm" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
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
            <button
              type="button"
              className="btn-outline text-sm text-rose-700"
              disabled={saving}
              onClick={() => void removeVehicle()}
            >
              Aracı sil
            </button>
          </div>
          <RentalDetails rentals={openByVehicle.get(active.id) ?? []} />
          <p className="mt-3 text-xs text-ink-muted">
            Kirada ve rezerveli durum kiralama kaydından gelir. Bakım elle kapatılır.
          </p>
          {actionError && <p className="mt-2 text-sm text-rose-600">{actionError}</p>}
        </form>
      )}
    </div>
  );
}

function photoSrc(src: string): string {
  if (src.startsWith("http") || src.startsWith("blob:") || src.startsWith("/")) return src;
  return `/${src}`;
}

function RentalSummary({ rentals }: { rentals: Rental[] }) {
  const first = rentals[0];
  if (!first) return <span className="text-ink-muted">—</span>;
  return (
    <div>
      <p className="font-medium text-ink">{first.customer.name}</p>
      <p className="text-xs text-ink-muted">
        {formatDateTime(first.startAt)} → {formatDateTime(first.endAt)}
      </p>
      <p className="font-mono text-xs text-ink-muted">
        {first.pnr}
        {rentals.length > 1 ? ` · +${rentals.length - 1}` : ""}
      </p>
    </div>
  );
}

function RentalDetails({ rentals }: { rentals: Rental[] }) {
  if (rentals.length === 0) {
    return <p className="mt-4 text-sm text-ink-muted">Bu araçta açık kiralama veya rezervasyon yok.</p>;
  }
  return (
    <div className="mt-5 space-y-3">
      <h3 className="text-sm font-semibold text-ink">Kim kullanıyor</h3>
      {rentals.map((rental) => (
        <div key={rental.id} className="rounded-xl border border-surface-border bg-surface-soft/50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">{rental.customer.name}</p>
              <p className="font-mono text-xs text-ink-muted">{rental.pnr}</p>
            </div>
            <RentalStatusBadge status={rental.status} />
          </div>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-muted">Süre</dt>
              <dd className="font-medium text-ink">
                {formatDateTime(rental.startAt)}
                <br />
                {formatDateTime(rental.endAt)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Alış / bırakış</dt>
              <dd className="font-medium text-ink">
                {rental.pickup}
                <br />
                {rental.dropoff}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Telefon</dt>
              <dd className="font-medium text-ink">
                <a href={`tel:${rental.customer.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                  {rental.customer.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">E-posta</dt>
              <dd className="break-all font-medium text-ink">{rental.customer.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Toplam / depozito</dt>
              <dd className="font-medium text-ink">
                {rental.totalPrice} · {rental.deposit}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Uçuş</dt>
              <dd className="font-medium text-ink">{rental.flightNumber || "—"}</dd>
            </div>
          </dl>
          <Link
            href={`/panel/kiralamalar?pnr=${encodeURIComponent(rental.pnr)}`}
            className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
          >
            Kiralama kaydını aç
          </Link>
        </div>
      ))}
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
