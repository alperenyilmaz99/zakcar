"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SITE } from "@/lib/constants";
import { faqForLocale } from "@/lib/faq";

export function FaqPage() {
  const { locale, t } = usePrefs();
  const categories = useMemo(() => faqForLocale(locale), [locale]);
  const [active, setActive] = useState("all");
  const shown = active === "all" ? categories : categories.filter((c) => c.id === active);

  return (
    <div className="container-page max-w-3xl py-10 lg:py-14">
      <h1 className="section-title">{t("faq.title")}</h1>
      <p className="section-sub">{t("faq.sub")}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
            active === "all" ? "bg-brand text-white" : "bg-white text-ink ring-1 ring-surface-border hover:text-brand"
          }`}
        >
          {t("faq.all")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              active === cat.id ? "bg-brand text-white" : "bg-white text-ink ring-1 ring-surface-border hover:text-brand"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {shown.map((cat) => (
          <section key={cat.id} id={cat.id}>
            <h2 className="mb-4 font-display text-xl font-bold text-ink">{cat.title}</h2>
            <FaqAccordion items={cat.items} />
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink-muted">
        {t("faq.contact")}{" "}
        <a href={`tel:${SITE.phoneTel}`} className="font-semibold text-brand">
          {SITE.phone}
        </a>
        {" · "}
        <a href={`https://wa.me/${SITE.whatsapp}`} className="font-semibold text-brand">
          WhatsApp {SITE.whatsappDisplay}
        </a>
        {" · "}
        <Link href="/kiralama-kosullari" className="font-semibold text-brand">
          {t("nav.terms")}
        </Link>
      </p>
    </div>
  );
}
