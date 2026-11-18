"use client";

import { useEffect, useState } from "react";
import { DISTRICTS, type District } from "@/lib/districts";

export function useDistricts(): District[] {
  const [items, setItems] = useState<District[]>(DISTRICTS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/districts", { cache: "no-store" });
        const data = (await res.json()) as { items?: District[] };
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) setItems(data.items);
      } catch {
        /* hazır liste kalsın */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
