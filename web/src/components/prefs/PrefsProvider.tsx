"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  type Currency,
  type Locale,
  type MessageKey,
  LOCALES,
  formatPriceIn,
  translate,
} from "@/lib/i18n";

const STORAGE_KEY = "zakcar_prefs";

type Prefs = {
  locale: Locale;
  currency: Currency;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  formatPrice: (price: string) => string;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
};

const PrefsContext = createContext<Prefs | null>(null);

function readStored(): { locale: Locale; currency: Currency } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { locale: "tr", currency: "TRY" };
    const parsed = JSON.parse(raw) as Partial<{ locale: Locale; currency: Currency }>;
    const locale = LOCALES.some((l) => l.code === parsed.locale) ? (parsed.locale as Locale) : "tr";
    const currency = ["TRY", "EUR", "USD", "GBP"].includes(parsed.currency ?? "")
      ? (parsed.currency as Currency)
      : "TRY";
    return { locale, currency };
  } catch {
    return { locale: "tr", currency: "TRY" };
  }
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");
  const [currency, setCurrencyState] = useState<Currency>("TRY");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored();
    setLocaleState(stored.locale);
    setCurrencyState(stored.currency);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ locale, currency }));
    const meta = LOCALES.find((l) => l.code === locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = meta?.dir ?? "ltr";
    document.documentElement.classList.toggle("font-arabic", locale === "ar");
  }, [locale, currency, ready]);

  const value = useMemo<Prefs>(
    () => ({
      locale,
      currency,
      t: (key, vars) => translate(locale, key, vars),
      formatPrice: (price) => formatPriceIn(price, currency, locale),
      setLocale: setLocaleState,
      setCurrency: setCurrencyState,
    }),
    [locale, currency],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error("usePrefs must be used within PrefsProvider");
  }
  return ctx;
}
