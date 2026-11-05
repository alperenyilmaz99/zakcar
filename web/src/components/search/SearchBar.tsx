"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { formatDate, formatTime, useSearch } from "@/hooks/useSearch";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { DateTimeField } from "@/components/search/DateTimeField";
import { OFFICES, resolveOfficeId } from "@/lib/offices";
import { SITE } from "@/lib/constants";
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
  const [seeking, setSeeking] = useState(false);
  const seekTimer = useRef<number | null>(null);
  const different = search.differentDrop;

  useEffect(() => {
    if (defaultPickup && !search.pickup) {
      const id = resolveOfficeId(defaultPickup) ?? defaultPickup;
      update({ pickup: id, drop: search.drop || id });
    }
    if (defaultGroup) update({ group: defaultGroup });
    if (defaultBrand) update({ brand: defaultBrand });
  }, [defaultPickup, defaultGroup, defaultBrand, search.pickup, search.drop, update]);

  useEffect(() => {
    return () => {
      if (seekTimer.current) window.clearTimeout(seekTimer.current);
    };
  }, []);

  function handleSearch() {
    if (seeking) return;
    const params = new URLSearchParams();
    if (search.pickup) params.set("pickup", search.pickup);
    if (different && search.drop) params.set("drop", search.drop);
    if (search.group || defaultGroup) params.set("group", search.group || defaultGroup || "");
    if (search.brand || defaultBrand) params.set("brand", search.brand || defaultBrand || "");
    if (search.from) params.set("from", search.from);
    if (search.to) params.set("to", search.to);
    const href = `/arac-modelleri?${params.toString()}`;
    setSeeking(true);
    seekTimer.current = window.setTimeout(() => {
      router.push(href);
    }, 1500);
  }

  return (
    <div
      className={`relative z-30 rounded-2xl border border-white/60 bg-white/95 text-ink shadow-search backdrop-blur-sm ${
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
      {seeking &&
        createPortal(
          <SearchSeeking
            pickup={locationLabel(search.pickup, t) || t("search.placeholder")}
            drop={locationLabel(different ? search.drop : search.pickup, t) || t("search.placeholder")}
            from={search.from}
            to={search.to}
            loading={t("search.loading")}
            pickupLabel={t("search.pickupOnly")}
            dropLabel={t("search.dropoff")}
            fromLabel={t("search.from")}
            toLabel={t("search.to")}
            fromTimeLabel={t("search.fromTime")}
            toTimeLabel={t("search.toTime")}
          />,
          document.body,
        )}
    </div>
  );
}

function SearchSeeking({
  pickup,
  drop,
  from,
  to,
  loading,
  pickupLabel,
  dropLabel,
  fromLabel,
  toLabel,
  fromTimeLabel,
  toTimeLabel,
}: {
  pickup: string;
  drop: string;
  from: string;
  to: string;
  loading: string;
  pickupLabel: string;
  dropLabel: string;
  fromLabel: string;
  toLabel: string;
  fromTimeLabel: string;
  toTimeLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/45 p-4">
      <div className="w-full max-w-md space-y-3">
        <div className="card px-6 py-8 text-center">
          <Image
            src={SITE.logo}
            alt={SITE.name}
            width={920}
            height={352}
            className="mx-auto h-14 w-auto object-contain"
            priority
          />
          <p className="mt-5 text-sm font-medium text-brand">{loading}</p>
        </div>
        <div className="card divide-y divide-surface-border px-4 py-1 text-sm">
          <SeekRow icon="pin" label={pickupLabel} value={pickup} />
          <SeekRow icon="pin" label={dropLabel} value={drop} />
          <div className="grid grid-cols-2">
            <SeekRow icon="calendar" label={fromLabel} value={formatDate(from)} />
            <SeekRow icon="clock" label={fromTimeLabel} value={formatTime(from)} />
          </div>
          <div className="grid grid-cols-2">
            <SeekRow icon="calendar" label={toLabel} value={formatDate(to)} />
            <SeekRow icon="clock" label={toTimeLabel} value={formatTime(to)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SeekRow({
  icon,
  label,
  value,
}: {
  icon: "pin" | "calendar" | "clock";
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <SeekIcon name={icon} />
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="truncate font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

function SeekIcon({ name }: { name: "pin" | "calendar" | "clock" }) {
  const common = "mt-0.5 h-5 w-5 shrink-0 text-brand";
  if (name === "pin") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M3.5 10h17" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
