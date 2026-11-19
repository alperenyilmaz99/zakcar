"use client";

import { useEffect, useState } from "react";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { PromoBanners } from "@/components/home/PromoBanners";
import { SearchBar } from "@/components/search/SearchBar";
import { SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { HeroLine } from "@/lib/content-types";
import type { MessageKey } from "@/lib/i18n";

const MOTTOS = [
  {
    a: "hero.m1.a",
    b: "hero.m1.b",
    c: "hero.m1.c",
    sub: "hero.m1.sub",
    tag: "hero.m1.tag",
    accent: "#E30613",
    pill: true,
  },
  {
    a: "hero.m2.a",
    b: "hero.m2.b",
    c: "hero.m2.c",
    sub: "hero.m2.sub",
    tag: "hero.m2.tag",
    accent: "#E30613",
    pill: true,
  },
  {
    a: "hero.m3.a",
    b: "hero.m3.b",
    c: "hero.m3.c",
    sub: "hero.m3.sub",
    tag: "hero.m3.tag",
    accent: "#E30613",
    pill: false,
  },
  {
    a: "hero.m4.a",
    b: "hero.m4.b",
    c: "hero.m4.c",
    sub: "hero.m4.sub",
    tag: "hero.m4.tag",
    accent: "#E30613",
    pill: false,
  },
  {
    a: "hero.m5.a",
    b: "hero.m5.b",
    c: "hero.m5.c",
    sub: "hero.m5.sub",
    tag: "hero.m5.tag",
    accent: "#111111",
    pill: true,
  },
] as const satisfies readonly {
  a: MessageKey;
  b: MessageKey;
  c: MessageKey;
  sub: MessageKey;
  tag: MessageKey;
  accent: string;
  pill: boolean;
}[];

type Slide = {
  id: string;
  a: string;
  b: string;
  c: string;
  sub: string;
  tag: string;
  accent: string;
  pill: boolean;
};

export function Hero({ backdrop }: { backdrop: string }) {
  const [active, setActive] = useState(0);
  const [extra, setExtra] = useState<HeroLine[]>([]);
  const { t } = usePrefs();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/hero-lines")
      .then((res) => (res.ok ? res.json() : { lines: [] }))
      .then((data: { lines?: HeroLine[] }) => {
        if (!cancelled && Array.isArray(data.lines)) setExtra(data.lines);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const slides: Slide[] = [
    ...MOTTOS.map((item) => ({
      id: item.a,
      a: t(item.a),
      b: t(item.b),
      c: t(item.c),
      sub: t(item.sub),
      tag: t(item.tag),
      accent: item.accent,
      pill: item.pill,
    })),
    ...extra.map((line) => ({
      id: line.id,
      a: line.before,
      b: line.accent,
      c: line.after,
      sub: line.sub,
      tag: line.tag,
      accent: "#E30613",
      pill: Boolean(line.pill && line.tag),
    })),
  ];
  const index = active % slides.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative text-ink">
      <div className="container-page relative flex flex-col justify-center pb-2 pt-14 lg:pt-16">
        <div className="mx-auto grid max-w-3xl text-center">
          {slides.map((item, i) => {
            const isActive = i === index;
            const Title = isActive ? "h1" : "div";
            return (
              <div
                key={item.id}
                className={`col-start-1 row-start-1 ${isActive ? "animate-hero-copy" : "invisible"}`}
                aria-hidden={!isActive}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted sm:text-sm">
                  {SITE.shortName} Rent A Car
                </p>
                <Title className="mt-4 font-display text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                  {item.a}
                  {item.b ? (
                    <>
                      {" "}
                      <span style={{ color: item.accent }}>{item.b}</span>
                    </>
                  ) : null}
                  {item.c ? ` ${item.c}` : ""}
                </Title>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base lg:text-lg">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
          {slides.map((item, i) =>
            item.pill ? (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  i === index ? "shadow-md" : "border border-surface-border bg-white text-ink-muted hover:border-brand hover:text-brand"
                }`}
                style={
                  i === index
                    ? { backgroundColor: item.accent, color: "#fff" }
                    : undefined
                }
                aria-pressed={i === index}
              >
                {item.tag}
              </button>
            ) : null
          )}
        </div>

      </div>
      <div className="relative mt-8 w-full lg:mt-10">
        <HeroBackdrop src={backdrop} />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-36 pt-6 sm:pb-44 sm:pt-8 lg:pb-52">
          <SearchBar />
        </div>
      </div>
      <PromoBanners slot="hero" />
    </section>
  );
}
