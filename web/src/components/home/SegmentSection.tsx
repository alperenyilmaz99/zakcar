"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SEGMENTS, type SegmentId } from "@/lib/segments";
import type { SegmentImage } from "@/lib/segment-store";

export function SegmentSection() {
  const { t } = usePrefs();
  const [images, setImages] = useState<Partial<Record<SegmentId, string>>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/segments", { cache: "no-store" });
        const data = (await res.json()) as { items?: SegmentImage[] };
        if (cancelled || !Array.isArray(data.items)) return;
        setImages(Object.fromEntries(data.items.map((item) => [item.id, item.imageUrl])));
      } catch {
        /* hazır görseller kalsın */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            {t("seg.lead")} <span className="text-brand">{t("seg.title")}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-muted sm:text-base">{t("seg.sub")}</p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-6">
          {SEGMENTS.map((seg) => (
            <div key={seg.id} className="flex flex-col items-center text-center">
              <div className="relative mb-5 h-[120px] w-full max-w-[220px]">
                <Image
                  src={images[seg.id] || seg.image}
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
