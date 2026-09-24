"use client";

import Image from "next/image";
import Link from "next/link";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

const SEGMENTS: {
  href: string;
  title: MessageKey;
  desc: MessageKey;
  image: string;
  alt: string;
}[] = [
  {
    href: "/ekonomik-arac-kiralama",
    title: "seg.eco.title",
    desc: "seg.eco.desc",
    image: "/assets/images/vehicles/png/renault-clio-hb.png",
    alt: "Ekonomik araç",
  },
  {
    href: "/sedan-arac-kiralama",
    title: "seg.sedan.title",
    desc: "seg.sedan.desc",
    image: "/assets/images/vehicles/png/fiat-yeni-egea-sedan.png",
    alt: "Sedan araç",
  },
  {
    href: "/4x4-suv-arac-kiralama",
    title: "seg.suv.title",
    desc: "seg.suv.desc",
    image: "/assets/images/vehicles/png/hyundai-tucson.png",
    alt: "SUV araç",
  },
  {
    href: "/4x4-suv-arac-kiralama",
    title: "seg.offroad.title",
    desc: "seg.offroad.desc",
    image: "/assets/images/vehicles/png/dacia-duster.png",
    alt: "4x4 araç",
  },
  {
    href: "/7-10-kisilik-arac-kiralama",
    title: "seg.van.title",
    desc: "seg.van.desc",
    image: "/assets/images/vehicles/png/citroen-jumpy-8-1.png",
    alt: "Minibüs",
  },
];

export function SegmentSection() {
  const { t } = usePrefs();

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            {t("seg.lead")} <span className="text-brand">{t("seg.title")}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-muted sm:text-base">{t("seg.sub")}</p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {SEGMENTS.map((seg) => (
            <div key={seg.title} className="flex flex-col items-center text-center">
              <div className="relative mb-5 h-[120px] w-full max-w-[220px]">
                <Image
                  src={seg.image}
                  alt={seg.alt}
                  fill
                  className="object-contain object-center"
                  sizes="220px"
                />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{t(seg.title)}</h3>
              <p className="mt-1.5 min-h-[40px] max-w-[220px] text-sm leading-snug text-ink-muted">
                {t(seg.desc)}
              </p>
              <Link
                href={seg.href}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                {t("seg.cta")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
