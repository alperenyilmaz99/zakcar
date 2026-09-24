"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { Locale } from "@/lib/i18n";

const INTL: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE",
  ru: "ru-RU",
  ar: "ar-SA",
};

const HOURS = Array.from({ length: 24 }, (_, h) =>
  `${String(h).padStart(2, "0")}:00`,
);

function startOfDay(d: Date) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function weekdayLabels(locale: string) {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)));
}

function monthCells(view: Date) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function DateTimeField({
  value,
  onChange,
  min,
  open,
  onOpenChange,
}: {
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale, t } = usePrefs();
  const loc = INTL[locale];
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = value ? new Date(value) : new Date();
  const [view, setView] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));

  useEffect(() => {
    if (!open) return;
    const floor = min ? new Date(min) : new Date();
    const focus = selected < startOfDay(floor) ? floor : selected;
    setView(new Date(focus.getFullYear(), focus.getMonth(), 1));
  }, [open, value, min]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, onOpenChange]);

  const minDate = min ? startOfDay(new Date(min)) : startOfDay(new Date());
  const days = useMemo(() => monthCells(view), [view]);
  const today = startOfDay(new Date());
  const labels = weekdayLabels(loc);
  const timeValue = `${String(selected.getHours()).padStart(2, "0")}:00`;

  function apply(day: Date, hour: number) {
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0, 0, 0);
    onChange(next.toISOString());
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-3 text-left text-sm text-[#111] transition hover:border-brand"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <span className="text-brand" aria-hidden>
          <CalendarIcon />
        </span>
        <span className="min-w-0 flex-1 truncate font-medium">
          {selected.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="rounded-lg bg-[#FFF1F2] px-2 py-0.5 text-xs font-semibold text-brand">
          {selected.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", hour12: false })}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-1 min-w-[272px] rounded-2xl border border-surface-border bg-white p-3 text-[#111] shadow-search sm:right-auto sm:w-[300px]">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-lg text-ink hover:bg-[#FFF1F2] hover:text-brand"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              aria-label="Prev"
            >
              ‹
            </button>
            <p className="text-sm font-semibold capitalize">
              {view.toLocaleDateString(loc, { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-lg text-ink hover:bg-[#FFF1F2] hover:text-brand"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              aria-label="Next"
            >
              ›
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[11px] font-medium text-ink-muted">
            {labels.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const disabled = startOfDay(day) < minDate;
              const isSelected = sameDay(day, selected);
              const isToday = sameDay(day, today);
              const outside = day.getMonth() !== view.getMonth();
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => apply(day, selected.getHours())}
                  className={`h-9 rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-brand font-semibold text-white"
                      : disabled
                        ? "cursor-not-allowed text-[#C4C4C4]"
                        : outside
                          ? "text-[#B0B0B0] hover:bg-[#FFF1F2] hover:text-brand"
                          : isToday
                            ? "bg-[#FFF1F2] font-semibold text-brand hover:bg-brand hover:text-white"
                            : "text-[#111] hover:bg-[#FFF1F2] hover:text-brand"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <label className="mt-3 flex items-center gap-2 border-t border-surface-border pt-3">
            <span className="text-xs font-medium text-ink-muted">{t("search.time")}</span>
            <select
              className="h-9 flex-1 rounded-lg border border-surface-border bg-white px-2 text-sm text-[#111] focus:border-brand focus:outline-none"
              value={timeValue}
              onChange={(e) => apply(selected, Number(e.target.value.slice(0, 2)))}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
