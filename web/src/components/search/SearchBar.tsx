"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOffices } from "@/lib/data";
import { formatDate, formatTime, useSearch } from "@/hooks/useSearch";
import type { Office } from "@/lib/types";

interface SearchBarProps {
  defaultPickup?: string;
  defaultGroup?: string;
  defaultBrand?: string;
  compact?: boolean;
}

export function SearchBar({
  defaultPickup,
  defaultGroup,
  defaultBrand,
  compact,
}: SearchBarProps) {
  const router = useRouter();
  const { search, update } = useSearch();
  const [offices, setOffices] = useState<Office[]>([]);
  const [pickupOpen, setPickupOpen] = useState(false);

  useEffect(() => {
    setOffices(getOffices());
    if (defaultPickup && !search.pickup) update({ pickup: defaultPickup });
    if (defaultGroup) update({ group: defaultGroup });
    if (defaultBrand) update({ brand: defaultBrand });
  }, [defaultPickup, defaultGroup, defaultBrand, search.pickup, update]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (search.pickup) params.set("pickup", search.pickup);
    if (search.group || defaultGroup) params.set("group", search.group || defaultGroup || "");
    if (search.brand || defaultBrand) params.set("brand", search.brand || defaultBrand || "");
    if (search.from) params.set("from", search.from);
    if (search.to) params.set("to", search.to);
    router.push(`/arac-modelleri?${params.toString()}`);
  }

  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/95 shadow-search backdrop-blur-sm ${
        compact ? "p-4" : "p-4 sm:p-5 lg:p-6"
      }`}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <Field label="Alış / Dönüş Yeri">
          <div className="relative">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-3 text-left text-sm"
              onClick={() => setPickupOpen((v) => !v)}
            >
              <span className="text-brand">📍</span>
              <span className={search.pickup ? "text-ink" : "text-ink-muted"}>
                {search.pickup || "Lütfen Seçiniz"}
              </span>
            </button>
            {pickupOpen && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-surface-border bg-white py-1 shadow-search">
                {offices.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-brand-light"
                      onClick={() => {
                        update({ pickup: o.name, drop: o.name });
                        setPickupOpen(false);
                      }}
                    >
                      {o.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>

        <Field label="Alış Tarihi">
          <DateInput
            value={search.from}
            onChange={(iso) => update({ from: iso })}
          />
        </Field>

        <Field label="Dönüş Tarihi">
          <DateInput
            value={search.to}
            onChange={(iso) => update({ to: iso })}
          />
        </Field>

        <button type="button" className="btn-primary h-[46px] w-full lg:w-auto" onClick={handleSearch}>
          Ara
        </button>
      </div>

      {!compact && (
        <p className="mt-3 text-xs text-ink-muted">
          Alış: {formatDate(search.from)} {formatTime(search.from)} · Dönüş:{" "}
          {formatDate(search.to)} {formatTime(search.to)}
        </p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const local = value ? new Date(value).toISOString().slice(0, 16) : "";

  return (
    <input
      type="datetime-local"
      className="w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm"
      value={local}
      onChange={(e) => onChange(new Date(e.target.value).toISOString())}
    />
  );
}
