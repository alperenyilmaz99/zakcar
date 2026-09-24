"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate, formatTime, useSearch } from "@/hooks/useSearch";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { DateTimeField } from "@/components/search/DateTimeField";
import { DICTS, LOCALES, type MessageKey } from "@/lib/i18n";

const PICKUP_OPTIONS = [
  { id: "saw", nameKey: "loc.saw.full", soon: false },
  { id: "iga", nameKey: "loc.iga.full", soon: false },
  { id: "merkez", nameKey: "loc.merkez.full", soon: false },
  { id: "esenboga", nameKey: "loc.esenboga.full", soon: true },
  { id: "antalya", nameKey: "loc.antalya.full", soon: true },
  { id: "izmir", nameKey: "loc.izmir.full", soon: true },
  { id: "bodrum", nameKey: "loc.bodrum.full", soon: true },
] as const;

function resolvePickupId(value: string): (typeof PICKUP_OPTIONS)[number]["id"] | undefined {
  if (!value) return undefined;
  const byId = PICKUP_OPTIONS.find((o) => o.id === value);
  if (byId) return byId.id;
  for (const o of PICKUP_OPTIONS) {
    if (LOCALES.some((loc) => DICTS[loc.code][o.nameKey as MessageKey] === value)) return o.id;
  }
  return undefined;
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
  const [openMenu, setOpenMenu] = useState<"pickup" | "from" | "to" | null>(null);
  const selectedPickup = resolvePickupId(search.pickup);
  const pickupLabel = selectedPickup
    ? t(PICKUP_OPTIONS.find((o) => o.id === selectedPickup)!.nameKey)
    : search.pickup;

  useEffect(() => {
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
      className={`rounded-2xl border border-white/60 bg-white/95 text-ink shadow-search backdrop-blur-sm ${
        compact ? "p-4" : "p-4 sm:p-5 lg:p-6"
      }`}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <Field label={t("search.pickup")}>
          <div className="relative">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-3 text-left text-sm"
              onClick={() => setOpenMenu((v) => (v === "pickup" ? null : "pickup"))}
            >
              <span className="text-brand">📍</span>
              <span className={pickupLabel ? "text-ink" : "text-ink-muted"}>
                {pickupLabel || t("search.placeholder")}
              </span>
            </button>
            {openMenu === "pickup" && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-surface-border bg-white py-1 text-[#111] shadow-search">
                {PICKUP_OPTIONS.map((o) => (
                  <li key={o.id}>
                    {o.soon ? (
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
                        onClick={() => {
                          const name = t(o.nameKey);
                          update({ pickup: name, drop: name });
                          setOpenMenu(null);
                        }}
                      >
                        {t(o.nameKey)}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>

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

        <button type="button" className="btn-primary h-[46px] w-full lg:w-auto" onClick={handleSearch}>
          {t("search.action")}
        </button>
      </div>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </div>
  );
}
