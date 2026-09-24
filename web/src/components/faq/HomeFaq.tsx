"use client";

import Link from "next/link";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { homeFaqForLocale } from "@/lib/faq";

export function HomeFaq() {
  const { locale, t } = usePrefs();
  const items = homeFaqForLocale(locale);

  return (
    <section className="container-page py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t("faq.title")}</h2>
            <p className="section-sub">{t("faq.sub")}</p>
          </div>
          <Link href="/sik-sorulan-sorular" className="btn-outline">
            {t("faq.more")}
          </Link>
        </div>
        <div className="mt-8">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
