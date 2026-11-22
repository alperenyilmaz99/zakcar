"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SITE } from "@/lib/constants";
import { defaultPromos, localizedPromo, type PromoCover, type PromoSlot } from "@/lib/promo";

export function PromoBanners({ slot = "hero" }: { slot?: PromoSlot }) {
  const { t } = usePrefs();
  const [promos, setPromos] = useState<PromoCover[]>(() => defaultPromos(slot));
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(3);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/promos?slot=${slot}`, { cache: "no-store" });
        const data = (await res.json()) as PromoCover[];
        if (!cancelled && Array.isArray(data)) {
          const next = data.filter((p) => p.isActive !== false && p.imageUrl);
          setPromos(next.length > 0 ? next : defaultPromos(slot));
          setActive(0);
        }
      } catch {
        if (!cancelled) setPromos(defaultPromos(slot));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slot]);

  useEffect(() => {
    if (slot !== "mid") return;
    const update = () => setPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [slot]);

  const cardMax = Math.max(0, promos.length - perView);

  useEffect(() => {
    if (slot !== "mid") return;
    setActive((index) => Math.min(index, cardMax));
  }, [slot, cardMax]);

  useEffect(() => {
    if (promos.length < 2 || paused || slot === "mid") return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % promos.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [tick, paused, promos.length, slot]);

  useEffect(() => {
    if (slot !== "mid" || cardMax < 1 || paused) return;
    const id = window.setInterval(() => {
      setActive((index) => (index >= cardMax ? 0 : index + 1));
    }, 4500);
    return () => window.clearInterval(id);
  }, [slot, cardMax, paused, tick]);

  function go(index: number) {
    setActive((index + promos.length) % promos.length);
    setTick((n) => n + 1);
  }

  function slideCards(delta: number) {
    setActive((index) => {
      const next = index + delta;
      if (next > cardMax) return 0;
      if (next < 0) return cardMax;
      return next;
    });
    setTick((n) => n + 1);
  }

  if (slot === "mid") {
    const pages = cardMax + 1;
    return (
      <section
        className="bg-white py-12 sm:py-16"
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
          if (dx > 48) slideCards(-1);
          else if (dx < -48) slideCards(1);
        }}
      >
        <div className="container-page">
          <div className="overflow-hidden" dir="ltr">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * (100 / perView)}%)` }}
            >
              {promos.map((item) => {
                const promo = localizedPromo(item, t);
                const title = [promo.title, promo.highlight].filter(Boolean).join(" ");
                return (
                  <div key={promo.id} className="shrink-0 px-2 sm:px-3" style={{ width: `${100 / perView}%` }}>
                    <Link
                      href={promo.href || "/kampanyalar"}
                      className="block h-full overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card"
                    >
                      <div className="relative aspect-[16/9] bg-surface-soft">
                        <Image src={promo.imageUrl} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                      </div>
                      <h3 className="px-4 py-4 text-center font-display text-base font-bold leading-snug text-ink sm:text-lg">{title}</h3>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          {pages > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setActive(index);
                    setTick((n) => n + 1);
                  }}
                  className={`h-1.5 rounded-full transition ${index === active ? "w-7 bg-ink" : "w-4 bg-ink/20 hover:bg-ink/40"}`}
                  aria-label={`${index + 1}`}
                  aria-pressed={index === active}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#070b16] ${slot === "hero" ? "mt-8 lg:mt-0" : "mt-8"}`}
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
        {promos.map((item, i) => {
          const promo = localizedPromo(item, t);
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
                className="object-cover object-right rtl:-scale-x-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070b16] from-[18%] via-[#070b16]/75 via-[48%] to-transparent rtl:bg-gradient-to-l rtl:from-[42%] rtl:via-[72%]" />
              <div className="relative flex h-full flex-col justify-center px-5 py-8 sm:px-12 lg:px-16">
                <div className="max-w-xl">
                  <h2 className="font-display text-[1.65rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                    {promo.title}
                    {promo.highlight ? <span className="mt-1 block text-brand">{promo.highlight}</span> : null}
                  </h2>
                  {promo.sub ? <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">{promo.sub}</p> : null}
                  <div className="mt-3 flex w-fit max-w-[12.5rem] flex-col items-start gap-1.5 sm:mt-5 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-3">
                    {promo.badge ? (
                      <Link
                        href={promo.href || "/arac-modelleri"}
                        tabIndex={i === active ? 0 : -1}
                        className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold leading-tight text-white shadow-md transition hover:bg-brand-dark sm:px-5 sm:py-2.5 sm:text-sm sm:font-bold"
                      >
                        {promo.badge}
                      </Link>
                    ) : null}
                    <Link
                      href={promo.href || "/arac-modelleri"}
                      tabIndex={i === active ? 0 : -1}
                      className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold leading-tight text-white shadow-md transition hover:bg-brand-dark sm:px-5 sm:py-2.5 sm:text-sm sm:font-bold"
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
            className="absolute start-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-2xl leading-none text-white transition hover:bg-black/70 sm:flex sm:start-5 rtl:-scale-x-100"
            aria-label={t("banner.prev")}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            className="absolute end-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-2xl leading-none text-white transition hover:bg-black/70 sm:flex sm:end-5 rtl:-scale-x-100"
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
