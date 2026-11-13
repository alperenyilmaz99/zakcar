"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SITE } from "@/lib/constants";
import type { MessageKey } from "@/lib/i18n";

const GROUP_KEY: Record<string, MessageKey> = {
  Ekonomik: "val.Ekonomik",
  SUV: "val.SUV",
  Minibüs: "val.Minibüs",
  Lüks: "val.Lüks",
};

const CITY: Record<string, Partial<Record<"en" | "de" | "ar" | "ru", string>>> = {
  İstanbul: { en: "Istanbul", de: "Istanbul", ar: "إسطنبول", ru: "Стамбул" },
  İzmir: { en: "Izmir", de: "Izmir", ar: "إزمير", ru: "Измир" },
  Ankara: { en: "Ankara", de: "Ankara", ar: "أنقرة", ru: "Анкара" },
  Antalya: { en: "Antalya", de: "Antalya", ar: "أنطاليا", ru: "Анталья" },
  Kayseri: { en: "Kayseri", de: "Kayseri", ar: "قيصري", ru: "Кайсери" },
  Adana: { en: "Adana", de: "Adana", ar: "أضنة", ru: "Адана" },
};

export function LandingHeading({
  slug,
  title,
  description,
  group,
  brand,
}: {
  slug: string;
  title: string;
  description: string;
  group?: string;
  brand?: string;
}) {
  const { locale, t } = usePrefs();
  let heading = title;
  let sub = description;

  if (locale !== "tr") {
    if (slug === "sedan-arac-kiralama") {
      heading = t("seo.sedanTitle");
      sub = t("seo.sedanSub");
    } else if (group && GROUP_KEY[group]) {
      const name = t(GROUP_KEY[group]);
      heading = t("seo.rentalOf", { name });
      sub = t("seo.groupSub", { name });
    } else if (brand) {
      heading = t("seo.rentalOf", { name: brand });
      sub = t("seo.brandSub", { name: brand });
    } else {
      const raw = title.replace(/ Araç Kiralama$/, "");
      const names = CITY[raw];
      if (names) {
        const name = names[locale] || raw;
        heading = t("seo.rentalOf", { name });
        sub = slug === "istanbul-arac-kiralama" ? t("seo.istanbulSub") : t("seo.citySub", { name });
      }
    }
  }

  useEffect(() => {
    document.title = `${heading} | ${SITE.shortName}`;
  }, [heading]);

  return (
    <>
      <h1 className="section-title">{heading}</h1>
      {sub ? <p className="section-sub">{sub}</p> : null}
    </>
  );
}

export function LandingFallback() {
  const { t } = usePrefs();
  return (
    <div className="card p-8 text-center">
      <p className="text-ink-muted">{t("seo.fallback")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/arac-modelleri" className="btn-primary">
          {t("seo.browseCars")}
        </Link>
        <Link href="/iletisim" className="btn-outline">
          {t("seo.reachUs")}
        </Link>
      </div>
    </div>
  );
}
