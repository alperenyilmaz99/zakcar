"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SITE } from "@/lib/constants";
import { DEFAULT_PROMOS, type PromoCover } from "@/lib/promo";

export function PromoBanners() {
  const { t } = usePrefs();
  const [promos, setPromos] = useState<PromoCover[]>(DEFAULT_PROMOS);
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/promos", { cache: "no-store" });
        const data = (await res.json()) as PromoCover[];
        if (!cancelled && Array.isArray(data)) {
          const next = data.filter((p) => p.isActive !== false && p.imageUrl);
          if (next.length > 0) {
            setPromos(next);
            setActive(0);
          }
        }
      } catch {
        if (!cancelled) setPromos(DEFAULT_PROMOS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (promos.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % promos.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [tick, paused, promos.length]);

  function go(index: number) {
    setActive((index + promos.length) % promos.length);
    setTick((n) => n + 1);
  }

  return (
    <section
      className="relative mt-8 w-full overflow-hidden bg-[#070b16]"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchX.current == null) return;
        const dx = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        touchX.current = null;
        if (dx > 48) go(active - 1);
        else if (dx < -48) go(active + 1);
      }}
    >
      <div className="relative h-[300px] sm:h-[360px] lg:h-[420px]">
        {promos.map((promo, i) => {
          const offset = i - active;
          return (
            <article
              key={promo.id}
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{ transform: `translateX(${offset * 100}%)` }}
              aria-hidden={i !== active}
            >
              <Image
                src={promo.imageUrl}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070b16] from-[18%] via-[#070b16]/75 via-[48%] to-transparent" />
              <div className="relative flex h-full flex-col justify-center px-5 py-8 sm:px-12 lg:px-16">
                <div className="max-w-xl">
                  <h2 className="font-display text-[1.65rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                    {promo.title}
                    {promo.highlight ? <span className="mt-1 block text-brand">{promo.highlight}</span> : null}
                  </h2>
                  {promo.sub ? <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">{promo.sub}</p> : null}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {promo.badge ? (
                      <Link
                        href={promo.href || "/arac-modelleri"}
                        tabIndex={i === active ? 0 : -1}
                        className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark"
                      >
                        {promo.badge}
                      </Link>
                    ) : null}
                    <Link
                      href={promo.href || "/arac-modelleri"}
                      tabIndex={i === active ? 0 : -1}
                      className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark"
                    >
                      {t("banner.see")}
                    </Link>
                  </div>
                </div>
                <p className="mt-6 text-sm text-white/90">
                  <span className="font-semibold">{t("banner.info")}</span>
                  <a href={`tel:${SITE.phoneTel}`} className="mt-1 block text-lg font-bold tracking-tight text-white hover:text-brand">
                    {SITE.phone}
                  </a>
                  <a href={`mailto:${SITE.email}`} className="text-sm text-white/80 hover:text-brand">
                    {SITE.email}
                  </a>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {promos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(active - 1)}
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-2xl leading-none text-white transition hover:bg-black/70 sm:flex sm:left-5"
            aria-label={t("banner.prev")}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-2xl leading-none text-white transition hover:bg-black/70 sm:flex sm:right-5"
            aria-label={t("banner.next")}
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {promos.map((promo, i) => (
              <button
                key={promo.id}
                type="button"
                onClick={() => go(i)}
                className={`h-1 rounded-full transition ${i === active ? "w-8 bg-white" : "w-5 bg-white/40 hover:bg-white/70"}`}
                aria-label={promo.badge || promo.title || `${i + 1}`}
                aria-pressed={i === active}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
