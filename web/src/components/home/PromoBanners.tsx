"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PromoCover } from "@/lib/promo";

export function PromoBanners() {
  const [promos, setPromos] = useState<PromoCover[]>([]);
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/promos", { cache: "no-store" });
        const data = (await res.json()) as PromoCover[];
        if (!cancelled && Array.isArray(data)) {
          setPromos(data.filter((p) => p.isActive !== false && p.imageUrl));
          setActive(0);
        }
      } catch {
        if (!cancelled) setPromos([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (promos.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % promos.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [tick, promos.length]);

  if (promos.length === 0) return null;

  return (
    <section className="container-page py-10 lg:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-ink shadow-card">
        <div className="relative aspect-[16/9] sm:aspect-[2.2/1] lg:aspect-[2.6/1]">
          {promos.map((promo, i) => (
            <Link
              key={promo.id}
              href={promo.href || "/arac-modelleri"}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
            >
              <Image
                src={promo.imageUrl}
                alt={promo.title || "Kampanya"}
                fill
                priority={i === 0}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent sm:from-black/85 sm:via-black/45" />
              <div className="relative flex h-full flex-col justify-center px-6 py-8 sm:px-10 lg:px-14">
                <Image
                  src="/assets/zakcar/logo-wordmark-light.png"
                  alt="ZakCar"
                  width={200}
                  height={73}
                  className="h-8 w-[140px] object-contain object-left sm:h-10 sm:w-[176px]"
                />
                {(promo.title || promo.highlight) && (
                  <h2 className="mt-5 max-w-xl font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {promo.title}
                    {promo.highlight ? <span className="mt-1 block text-brand">{promo.highlight}</span> : null}
                  </h2>
                )}
                {promo.sub ? <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">{promo.sub}</p> : null}
                {promo.badge ? (
                  <span className="mt-5 inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white sm:text-sm">
                    {promo.badge}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        {promos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {promos.map((promo, i) => (
              <button
                key={promo.id}
                type="button"
                onClick={() => {
                  setActive(i);
                  setTick((n) => n + 1);
                }}
                className={`h-2 rounded-full transition ${
                  i === active ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={promo.badge || promo.title || `Kapak ${i + 1}`}
                aria-pressed={i === active}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
