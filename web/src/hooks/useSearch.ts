"use client";

import { useCallback, useEffect, useState } from "react";
import type { SearchState } from "@/lib/types";

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

export function useSearch() {
  const [search, setSearch] = useState<SearchState>(() => {
    if (typeof window === "undefined") {
      const d = defaultDates();
      return { pickup: "", drop: "", from: d.from, to: d.to, differentDrop: false };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const d = defaultDates();
      const storedFrom = parsed.from ? new Date(parsed.from) : null;
      const startToday = new Date();
      startToday.setHours(0, 0, 0, 0);
      const stale = !storedFrom || Number.isNaN(storedFrom.getTime()) || storedFrom < startToday;
      return {
        pickup: parsed.pickup ?? "",
        drop: parsed.drop ?? "",
        from: stale ? d.from : parsed.from,
        to: stale ? d.to : (parsed.to ?? d.to),
        differentDrop: parsed.differentDrop ?? false,
        group: parsed.group,
        brand: parsed.brand,
      };
    } catch {
      const d = defaultDates();
      return { pickup: "", drop: "", from: d.from, to: d.to, differentDrop: false };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(search));
  }, [search]);

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

export function genPnr(): string {
  return "ZK" + Date.now().toString(36).toUpperCase().slice(-8);
}
