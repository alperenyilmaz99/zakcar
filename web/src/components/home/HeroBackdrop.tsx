"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO_BACKDROP, type PromoCover } from "@/lib/promo";

export function HeroBackdrop() {
  const [src, setSrc] = useState(HERO_BACKDROP);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/promos?slot=backdrop", { cache: "no-store" });
        const data = (await res.json()) as PromoCover[];
        const next = Array.isArray(data) ? data.find((item) => item.isActive !== false && item.imageUrl) : undefined;
        if (!cancelled && next?.imageUrl) setSrc(next.imageUrl);
      } catch {
        /* varsayılan görsel kalsın */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image src={src} alt="" fill priority sizes="100vw" className="object-cover object-[center_62%]" />
    </div>
  );
}
