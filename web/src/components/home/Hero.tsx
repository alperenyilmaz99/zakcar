"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";

const SLIDES = [
  {
    src: "/assets/hero/saw.jpg",
    label: "Sabiha Gökçen Havalimanı",
    short: "SAW",
  },
  {
    src: "/assets/hero/iga.jpg",
    label: "İstanbul Havalimanı",
    short: "IGA",
  },
] as const;

export function Hero() {
  const [active, setActive] = useState(0);
  const { t } = usePrefs();
  const slides = [
    { src: "/assets/hero/saw.jpg", label: t("hero.saw"), short: "SAW" },
    { src: "/assets/hero/iga.jpg", label: t("hero.iga"), short: "IGA" },
  ];

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[min(88vh,820px)] bg-ink text-white">
      {/* Full-bleed airport slides */}
      <div className="absolute inset-0 overflow-hidden">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${
                i === active ? "animate-hero-zoom" : "scale-105"
              }`}
            />
          </div>
        ))}

        {/* Elitcar-style dark wash for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/35" />
      </div>

      <div className="container-page relative flex min-h-[min(88vh,820px)] flex-col justify-center pb-16 pt-16 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-sm">
            {SITE.shortName} Rent A Car
          </p>
          <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            {t("hero.titleBefore")}{" "}
            <span className="text-brand">{t("hero.comfort")}</span>
            {t("hero.titleAfter") ? ` ${t("hero.titleAfter")}` : ""}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="relative z-[60] mx-auto mt-10 w-full max-w-5xl lg:mt-12">
          <SearchBar />
        </div>

        {/* Airport indicator — Elitcar-like location cue */}
        <div className="mx-auto mt-8 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.short}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                i === active
                  ? "bg-white text-ink shadow-md"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
              aria-pressed={i === active}
            >
              {slide.short}
              <span className="ml-1.5 hidden font-normal opacity-80 sm:inline">
                {slide.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
