"use client";

import Image from "next/image";
import Link from "next/link";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

const CARDS: { href: string; image: string; title: MessageKey; text: MessageKey }[] = [
  {
    href: "/sabiha-gokcen-havalimani-arac-kiralama",
    image: "/assets/hero/saw.jpg",
    title: "home.airportSawTitle",
    text: "home.airportSawText",
  },
  {
    href: "/istanbul-3-havalimani-arac-kiralama",
    image: "/assets/hero/iga.jpg",
    title: "home.airportIgaTitle",
    text: "home.airportIgaText",
  },
];

export function AirportCards() {
  const { t } = usePrefs();

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
          {CARDS.map((card) => (
            <article key={card.href} className="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
              <div className="relative aspect-[16/10] bg-surface-soft">
                <Image src={card.image} alt={t(card.title)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-bold text-ink">{t(card.title)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{t(card.text)}</p>
                <Link href={card.href} className="btn-outline mt-5 w-full">
                  {t("home.airportDetails")}
                  <span aria-hidden> →</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
