"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { PromoCover } from "@/lib/promo";

export function CampaignsGrid() {
  const { t } = usePrefs();
  const [promos, setPromos] = useState<PromoCover[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/promos", { cache: "no-store" });
        const data = (await res.json()) as PromoCover[];
        if (!cancelled && Array.isArray(data)) {
          setPromos(data.filter((p) => p.isActive !== false && p.imageUrl));
        } else if (!cancelled) {
          setPromos([]);
        }
      } catch {
        if (!cancelled) setPromos([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (promos === null) {
    return <div className="mt-10 h-64 animate-pulse rounded-2xl bg-surface-soft" />;
  }

  if (promos.length === 0) {
    return <p className="mt-10 text-ink-muted">{t("kamp.empty")}</p>;
  }

  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2">
      {promos.map((promo) => (
        <article key={promo.id} className="card group overflow-hidden">
          <Link href={promo.href || "/arac-modelleri"} className="block">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-soft">
              <Image
                src={promo.imageUrl}
                alt={promo.title || t("kamp.title")}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              {promo.badge ? (
                <span className="absolute start-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {promo.badge}
                </span>
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-bold leading-snug text-ink">
                {promo.title}
                {promo.highlight ? <span className="text-brand"> {promo.highlight}</span> : null}
              </h2>
              {promo.sub ? <p className="mt-2 text-sm leading-relaxed text-ink-muted">{promo.sub}</p> : null}
              <span className="mt-4 inline-block text-sm font-semibold text-brand transition group-hover:underline">
                {t("kamp.cta")}
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
