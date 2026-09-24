"use client";

import { Content } from "@/components/content/ContentPage";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export function ContactBody({
  site,
}: {
  site: { phone: string; phoneTel: string; email: string; address: string; whatsapp: string; whatsappDisplay: string };
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
        <strong>{t("contact.address")}:</strong> {site.address}
      </p>
    </Content>
  );
}
