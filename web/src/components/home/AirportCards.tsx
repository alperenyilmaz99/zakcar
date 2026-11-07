"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { AIRPORT_CARDS, airportCardCopy, type AirportCard } from "@/lib/airport-cards";

export function AirportCards() {
  const { t } = usePrefs();
  const [cards, setCards] = useState<AirportCard[]>(AIRPORT_CARDS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/airport-cards", { cache: "no-store" });
        const data = (await res.json()) as { items?: AirportCard[] };
        if (!cancelled && Array.isArray(data.items) && data.items.length) setCards(data.items);
      } catch {
        if (!cancelled) setCards(AIRPORT_CARDS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            {t("home.airportsKicker")}
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">{t("home.airportsTitle")}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">{t("home.airportsLead")}</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
          {cards.map((card) => {
            const copy = airportCardCopy(card, t);
            return (
              <article key={card.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
                <div className="relative aspect-[16/10] bg-surface-soft">
                  <Image
                    src={card.imageUrl}
                    alt={copy.title}
                    fill
                    className={`object-cover ${card.position}`}
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold text-ink">{copy.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{copy.text}</p>
                  <Link href={card.href} className="btn-outline mt-5 w-full">
                    {t("home.airportDetails")}
                    <span aria-hidden> →</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
