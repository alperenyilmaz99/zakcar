"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { CURRENCIES, LOCALES } from "@/lib/i18n";

export function LocaleCurrencySwitch({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <LangMenu compact={compact} />
      <CurrencyMenu compact={compact} />
    </div>
  );
}

function LangMenu({ compact }: { compact?: boolean }) {
  const { locale, setLocale, t } = usePrefs();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <Drop
      label={
        <span className="flex items-center gap-1.5">
          <Image src={current.flag} alt="" width={18} height={18} className="h-[14px] w-[18px] rounded-[2px] object-cover" />
          {!compact && <span>{current.label}</span>}
        </span>
      }
      ariaLabel={t("prefs.language")}
    >
      {LOCALES.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLocale(item.code)}
          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-brand-light hover:text-brand ${
            item.code === locale ? "font-semibold text-brand" : "text-ink"
          }`}
        >
          <Image src={item.flag} alt="" width={18} height={18} className="h-[14px] w-[18px] rounded-[2px] object-cover" />
          {item.name}
        </button>
      ))}
    </Drop>
  );
}

function CurrencyMenu({ compact }: { compact?: boolean }) {
  const { currency, setCurrency, t } = usePrefs();
  const current = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <Drop
      label={<span>{compact ? current.symbol : `${current.symbol} ${current.label}`}</span>}
      ariaLabel={t("prefs.currency")}
    >
      {CURRENCIES.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setCurrency(item.code)}
          className={`flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-sm hover:bg-brand-light hover:text-brand ${
            item.code === currency ? "font-semibold text-brand" : "text-ink"
          }`}
        >
          <span>
            {item.symbol} {item.label}
          </span>
          <span className="text-xs text-ink-muted">{item.code}</span>
        </button>
      ))}
    </Drop>
  );
}

function Drop({
  label,
  ariaLabel,
  children,
}: {
  label: React.ReactNode;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-surface-border px-2 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
      >
        {label}
        <span aria-hidden className="text-[10px] opacity-60">
          ▾
        </span>
      </button>
      {open && (
        <div className="absolute end-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-surface-border bg-white py-1 shadow-search">
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}
