"use client";

import { useCallback, useEffect, useState } from "react";
import type { SearchState } from "@/lib/types";
import { resolveOfficeId } from "@/lib/offices";

const STORAGE_KEY = "zakcar_search";

function defaultDates() {
  const from = new Date();
  from.setDate(from.getDate() + 1);
  from.setHours(10, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 3);
  to.setHours(10, 0, 0, 0);
  return { from: from.toISOString(), to: to.toISOString() };
}

function readStoredSearch(): SearchState {
  const d = defaultDates();
  const empty: SearchState = { pickup: "", drop: "", from: d.from, to: d.to, differentDrop: false };
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const storedFrom = parsed.from ? new Date(parsed.from) : null;
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const stale = !storedFrom || Number.isNaN(storedFrom.getTime()) || storedFrom < startToday;
    return {
      pickup: resolveOfficeId(parsed.pickup ?? "") ?? parsed.pickup ?? "",
      drop: resolveOfficeId(parsed.drop ?? "") ?? parsed.drop ?? "",
      from: stale ? d.from : parsed.from,
      to: stale ? d.to : (parsed.to ?? d.to),
      differentDrop: Boolean(parsed.differentDrop),
      group: parsed.group,
      brand: parsed.brand,
    };
  } catch {
    return empty;
  }
}

export function useSearch() {
  const [search, setSearch] = useState<SearchState>(() => {
    const dates = defaultDates();
    return { pickup: "", drop: "", from: dates.from, to: dates.to, differentDrop: false };
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = readStoredSearch();
      setSearch((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    sync();
    setHydrated(true);
    window.addEventListener("zakcar-search", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("zakcar-search", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const serialized = JSON.stringify(search);
    if (localStorage.getItem(STORAGE_KEY) === serialized) return;
    localStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event("zakcar-search"));
  }, [search, hydrated]);

  const update = useCallback((patch: Partial<SearchState>) => {
    setSearch((prev) => ({ ...prev, ...patch }));
  }, []);

  return { search, update, setSearch };
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  if (!iso) return "10:00";
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
