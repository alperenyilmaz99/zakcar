"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const { locale } = usePrefs();
  const loc = INTL[locale];
  const rootRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const timeListRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number; right: number; width: number } | null>(null);
  const selected = value ? new Date(value) : new Date();
  const [view, setView] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const [panel, setPanel] = useState<"date" | "time">("date");

  useEffect(() => {
    if (!open) return;
    const floor = min ? new Date(min) : new Date();
    const focus = selected < startOfDay(floor) ? floor : selected;
    setView(new Date(focus.getFullYear(), focus.getMonth(), 1));
  }, [open, value, min]);

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      setBox({ top: rect.bottom + 4, left: rect.left, right: window.innerWidth - rect.right, width: rect.width });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, panel]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || popRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open || panel !== "time") return;
    timeListRef.current?.querySelector<HTMLElement>("[data-selected='true']")?.scrollIntoView({ block: "center" });
  }, [open, panel, box]);

  const minDate = min ? startOfDay(new Date(min)) : startOfDay(new Date());
  const days = useMemo(() => monthCells(view), [view]);
  const today = startOfDay(new Date());
  const labels = weekdayLabels(loc);
  const timeValue = `${String(selected.getHours()).padStart(2, "0")}:00`;

  function apply(day: Date, hour: number) {
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0, 0, 0);
    onChange(next.toISOString());
  }

  function openPanel(next: "date" | "time") {
    if (open && panel === next) {
      onOpenChange(false);
      return;
    }
    setPanel(next);
    onOpenChange(true);
  }

  return (
    <div className="relative" ref={rootRef}>
      <div className="flex h-[52px] w-full items-center overflow-hidden rounded-xl border border-surface-border bg-white text-sm text-[#111] transition hover:border-brand">
        <button
          type="button"
          className="flex h-full min-w-0 flex-1 items-center gap-2 px-4 text-left"
          aria-expanded={open && panel === "date"}
          onClick={() => openPanel("date")}
        >
          <span className="text-brand" aria-hidden>
            <CalendarIcon />
          </span>
          <span className="min-w-0 flex-1 truncate font-medium">
            {selected.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </button>
        <button
          type="button"
          className="me-2 inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#FFF1F2] px-2 text-xs font-semibold text-brand"
          aria-expanded={open && panel === "time"}
          onClick={() => openPanel("time")}
        >
          <ClockIcon />
          {selected.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", hour12: false })}
        </button>
      </div>

      {open && panel === "date" && box &&
        createPortal(
        <div
          ref={popRef}
          className="fixed z-40 min-w-[272px] rounded-2xl border border-surface-border bg-white p-3 text-[#111] shadow-search sm:w-[300px]"
          style={{ top: box.top, left: box.left, width: Math.max(box.width, 272) }}
        >
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
                  onClick={() => {
                    apply(day, selected.getHours());
                    onOpenChange(false);
                  }}
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

        </div>,
        document.body,
        )}

      {open && panel === "time" && box &&
        createPortal(
        <div
          ref={(node) => {
            popRef.current = node;
            timeListRef.current = node;
          }}
          className="fixed z-40 max-h-64 w-36 overflow-auto rounded-2xl border border-surface-border bg-white p-1.5 text-[#111] shadow-search"
          style={{ top: box.top, right: box.right }}
        >
          {HOURS.map((hour) => {
            const active = hour === timeValue;
            return (
              <button
                key={hour}
                type="button"
                data-selected={active ? "true" : "false"}
                onClick={() => {
                  apply(selected, Number(hour.slice(0, 2)));
                  onOpenChange(false);
                }}
                className={`flex h-9 w-full items-center rounded-lg px-3 text-sm ${
                  active ? "bg-brand font-semibold text-white" : "text-[#111] hover:bg-[#FFF1F2] hover:text-brand"
                }`}
              >
                {hour}
              </button>
            );
          })}
        </div>,
        document.body,
        )}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4.5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
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
