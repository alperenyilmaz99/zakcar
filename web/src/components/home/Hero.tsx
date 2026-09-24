"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

const BACKGROUNDS = ["/assets/hero/saw.jpg", "/assets/hero/iga.jpg"] as const;

const MOTTOS = [
  {
    a: "hero.m1.a",
    b: "hero.m1.b",
    c: "hero.m1.c",
    sub: "hero.m1.sub",
    tag: "hero.m1.tag",
    bg: 0,
    accent: "#E30613",
    pill: true,
  },
  {
    a: "hero.m2.a",
    b: "hero.m2.b",
    c: "hero.m2.c",
    sub: "hero.m2.sub",
    tag: "hero.m2.tag",
    bg: 1,
    accent: "#FFFFFF",
    pill: true,
  },
  {
    a: "hero.m3.a",
    b: "hero.m3.b",
    c: "hero.m3.c",
    sub: "hero.m3.sub",
    tag: "hero.m3.tag",
    bg: 0,
    accent: "#FF6B7A",
    pill: false,
  },
  {
    a: "hero.m4.a",
    b: "hero.m4.b",
    c: "hero.m4.c",
    sub: "hero.m4.sub",
    tag: "hero.m4.tag",
    bg: 1,
    accent: "#FFE566",
    pill: false,
  },
  {
    a: "hero.m5.a",
    b: "hero.m5.b",
    c: "hero.m5.c",
    sub: "hero.m5.sub",
    tag: "hero.m5.tag",
    bg: 0,
    accent: "#FFFFFF",
    pill: true,
  },
] as const satisfies readonly {
  a: MessageKey;
  b: MessageKey;
  c: MessageKey;
  sub: MessageKey;
  tag: MessageKey;
  bg: number;
  accent: string;
  pill: boolean;
}[];

export function Hero() {
  const [active, setActive] = useState(0);
  const { t } = usePrefs();
  const motto = MOTTOS[active];
  const after = t(motto.c);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % MOTTOS.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <section className="relative min-h-[min(88vh,820px)] bg-ink text-white">
      <div className="absolute inset-0 overflow-hidden">
        {BACKGROUNDS.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
              i === motto.bg ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== motto.bg}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${i === motto.bg ? "animate-hero-zoom" : "scale-105"}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/35" />
      </div>

      <div className="container-page relative flex min-h-[min(88vh,820px)] flex-col justify-center pb-16 pt-16 lg:pb-24 lg:pt-20">
        <div key={active} className="animate-hero-copy mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-sm">
            {SITE.shortName} Rent A Car
          </p>
          <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            {t(motto.a)}{" "}
            <span style={{ color: motto.accent }}>{t(motto.b)}</span>
            {after ? ` ${after}` : ""}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
            {t(motto.sub)}
          </p>
        </div>

        <div className="relative z-[60] mx-auto mt-10 w-full max-w-5xl lg:mt-12">
          <SearchBar />
        </div>

        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2">
          {MOTTOS.map((item, i) =>
            item.pill ? (
              <button
                key={item.tag}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  i === active ? "shadow-md" : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
                style={
                  i === active
                    ? { backgroundColor: item.accent, color: item.accent === "#FFFFFF" ? "#111" : "#fff" }
                    : undefined
                }
                aria-pressed={i === active}
              >
                {t(item.tag)}
              </button>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
