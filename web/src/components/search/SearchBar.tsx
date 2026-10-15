"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate, formatTime, useSearch } from "@/hooks/useSearch";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { DateTimeField } from "@/components/search/DateTimeField";
import { OFFICES, resolveOfficeId } from "@/lib/offices";
import type { MessageKey } from "@/lib/i18n";

function locationLabel(value: string, t: (key: MessageKey) => string) {
  const id = resolveOfficeId(value);
  if (id) return t(OFFICES.find((office) => office.id === id)!.nameKey);
  return value;
}

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
  const { t } = usePrefs();
  const [openMenu, setOpenMenu] = useState<"pickup" | "drop" | "from" | "to" | null>(null);
  const different = search.differentDrop;

  useEffect(() => {
    if (defaultPickup && !search.pickup) {
      const id = resolveOfficeId(defaultPickup) ?? defaultPickup;
      update({ pickup: id, drop: search.drop || id });
    }
    if (defaultGroup) update({ group: defaultGroup });
    if (defaultBrand) update({ brand: defaultBrand });
  }, [defaultPickup, defaultGroup, defaultBrand, search.pickup, search.drop, update]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (search.pickup) params.set("pickup", search.pickup);
    if (different && search.drop) params.set("drop", search.drop);
    if (search.group || defaultGroup) params.set("group", search.group || defaultGroup || "");
    if (search.brand || defaultBrand) params.set("brand", search.brand || defaultBrand || "");
    if (search.from) params.set("from", search.from);
    if (search.to) params.set("to", search.to);
    router.push(`/arac-modelleri?${params.toString()}`);
  }

  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/95 text-ink shadow-search backdrop-blur-sm ${
        compact ? "p-4" : "p-4 sm:p-5 lg:p-6"
      }`}
    >
      <div
        className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:items-end ${
          different
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
        }`}
      >
        <Field label={different ? t("search.pickupOnly") : t("search.pickup")}>
          <LocationSelect
            value={search.pickup}
            open={openMenu === "pickup"}
            onToggle={() => setOpenMenu((v) => (v === "pickup" ? null : "pickup"))}
            onSelect={(id) => {
              update(different ? { pickup: id } : { pickup: id, drop: id });
              setOpenMenu(null);
            }}
            t={t}
          />
        </Field>

        {different && (
          <Field label={t("search.dropoff")}>
            <LocationSelect
              value={search.drop}
              open={openMenu === "drop"}
              onToggle={() => setOpenMenu((v) => (v === "drop" ? null : "drop"))}
              onSelect={(id) => {
                update({ drop: id });
                setOpenMenu(null);
              }}
              t={t}
            />
          </Field>
        )}

        <Field label={t("search.from")}>
          <DateTimeField
            value={search.from}
            open={openMenu === "from"}
            onOpenChange={(open) => setOpenMenu(open ? "from" : null)}
            onChange={(iso) => {
              const next: { from: string; to?: string } = { from: iso };
              if (new Date(iso) >= new Date(search.to)) {
                const bump = new Date(iso);
                bump.setDate(bump.getDate() + 1);
                next.to = bump.toISOString();
              }
              update(next);
            }}
          />
        </Field>

        <Field label={t("search.to")}>
          <DateTimeField
            value={search.to}
            min={search.from}
            open={openMenu === "to"}
            onOpenChange={(open) => setOpenMenu(open ? "to" : null)}
            onChange={(iso) => update({ to: iso })}
          />
        </Field>

        <button type="button" className="btn-primary h-[52px] w-full lg:w-auto" onClick={handleSearch}>
          {t("search.action")}
        </button>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={different}
          onChange={(e) => {
            const on = e.target.checked;
            update({
              differentDrop: on,
              drop: on ? "" : search.pickup,
            });
            setOpenMenu(on ? "drop" : null);
          }}
          className="h-4 w-4 shrink-0 rounded border-surface-border accent-brand"
        />
        <span>{t("search.differentDrop")}</span>
      </label>

      {!compact && (
        <p className="mt-3 text-xs text-ink-muted">
          {t("search.summary", {
            from: `${formatDate(search.from)} ${formatTime(search.from)}`,
            to: `${formatDate(search.to)} ${formatTime(search.to)}`,
          })}
        </p>
      )}
    </div>
  );
}

function LocationSelect({
  value,
  open,
  onToggle,
  onSelect,
  t,
}: {
  value: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  t: (key: MessageKey) => string;
}) {
  const label = locationLabel(value, t);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-[52px] w-full items-center gap-2 overflow-hidden rounded-xl border border-surface-border bg-white px-4 text-left text-sm"
        onClick={onToggle}
      >
        <span className="shrink-0 text-brand">📍</span>
        <span className={`min-w-0 flex-1 truncate ${label ? "text-ink" : "text-ink-muted"}`}>
          {label || t("search.placeholder")}
        </span>
      </button>
      {open && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-surface-border bg-white py-1 text-[#111] shadow-search">
          {OFFICES.map((o) => (
            <li key={o.id}>
              {!o.bookable ? (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-[#5A5A5A]">
                  <span>{t(o.nameKey)}</span>
                  <span className="rounded-full bg-[#F7F7F7] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
                    {t("search.soon")}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm text-[#111] hover:bg-[#FFF1F2]"
                  onClick={() => onSelect(o.id)}
                >
                  {t(o.nameKey)}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block min-w-0">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </div>
  );
}
