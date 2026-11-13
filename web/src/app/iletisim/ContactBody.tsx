"use client";

import Link from "next/link";
import { Content } from "@/components/content/ContentPage";
import { GOOGLE_PLACE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export function ContactBody({
  site,
}: {
  site: {
    phone: string;
    phoneTel: string;
    email: string;
    address: string;
    whatsapp: string;
    whatsappDisplay: string;
    facebook: string;
    instagram: string;
  };
}) {
  const { t } = usePrefs();

  return (
    <Content title={t("nav.contact")}>
      <p>
        <strong>{t("contact.phone")}:</strong>{" "}
        <a href={`tel:${site.phoneTel}`} className="text-brand">
          {site.phone}
        </a>
      </p>
      <p>
        <strong>{t("contact.whatsapp")}:</strong>{" "}
        <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-brand">
          {site.whatsappDisplay}
        </a>
      </p>
      <p>
        <strong>{t("contact.email")}:</strong>{" "}
        <a href={`mailto:${site.email}`} className="text-brand">
          {site.email}
        </a>
      </p>
      <p>
        <strong>{t("contact.facebook")}:</strong>{" "}
        <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="text-brand">
          {t("contact.facebook")}
        </a>
      </p>
      <p>
        <strong>{t("contact.instagram")}:</strong>{" "}
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-brand">
          @zakcarrentall
        </a>
      </p>
      <p>
        <strong>{t("contact.address")}:</strong> {t("loc.site.address")}
      </p>
      <p>
        <Link href="/sik-sorulan-sorular">{t("nav.faq")}</Link>
      </p>
      <div className="not-prose overflow-hidden rounded-2xl border border-surface-border bg-white">
        <iframe
          title={GOOGLE_PLACE.name}
          src={GOOGLE_PLACE.embed}
          className="h-80 w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-sm text-ink-muted">{t("offices.googleNote")}</p>
          <a href={GOOGLE_PLACE.href} target="_blank" rel="noopener noreferrer" className="btn-primary !text-white no-underline hover:!text-white">
            {t("offices.google")}
          </a>
        </div>
      </div>
    </Content>
  );
}
