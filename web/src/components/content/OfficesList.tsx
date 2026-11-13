"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Office } from "@/lib/types";
import { GOOGLE_PLACE, SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

const SAW_MAP = "https://www.google.com/maps/search/?api=1&query=İstanbul+Sabiha+Gökçen+Havalimanı";

const OFFICE_COPY: Record<string, { name: MessageKey; address: MessageKey; lat: number; lng: number }> = {
  saw: { name: "loc.saw.full", address: "loc.saw.address", lat: 40.8986, lng: 29.3092 },
  iga: { name: "loc.iga.full", address: "loc.iga.address", lat: 41.2753, lng: 28.7519 },
  merkez: { name: "loc.merkez.full", address: "loc.merkez.address", lat: 40.9290708, lng: 29.3066005 },
};

function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function googleEmbed(selectedId: string | null) {
  if (selectedId === "saw") {
    return "https://maps.google.com/maps?hl=tr&q=İstanbul+Sabiha+Gökçen+Havalimanı&z=14&output=embed";
  }
  if (!selectedId || selectedId === "merkez") return GOOGLE_PLACE.embed;
  const pin = OFFICE_COPY[selectedId];
  if (!pin) return GOOGLE_PLACE.embed;
  return `https://maps.google.com/maps?hl=tr&q=${pin.lat},${pin.lng}&z=15&output=embed`;
}

export function OfficesList({ offices }: { offices: Office[] }) {
  const { t } = usePrefs();
  const listed = (["saw", "iga", "merkez"] as const).map((id) => {
    return (
      offices.find((office) => office.id === id) ?? {
        id,
        name: "",
        address: "",
        phone: "0532 388 29 96",
        email: SITE.email,
        hours: "7/24",
      }
    );
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (OFFICE_COPY[id]) setSelectedId(id);
  }, []);

  const selected = listed.find((office) => office.id === selectedId) ?? null;
  const contact = selected ?? listed[0];
  if (!contact) return null;
  const pin = selected ? OFFICE_COPY[selected.id] : null;
  const showsOffice = !selectedId || selectedId === "merkez";
  const mapHref = selectedId === "saw" ? SAW_MAP : pin ? mapsUrl(pin.lat, pin.lng) : GOOGLE_PLACE.href;

  function choose(id: string) {
    if (selectedId === id) {
      setSelectedId(null);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    setSelectedId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div>
      <h1 className="section-title">{t("offices.title")}</h1>
      <p className="section-sub">{t("offices.sub")}</p>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <div className="space-y-3">
          {listed.map((office) => {
            const copy = OFFICE_COPY[office.id];
            const active = office.id === selectedId;
            return (
              <button
                key={office.id}
                id={office.id}
                type="button"
                onClick={() => choose(office.id)}
                className={`card w-full p-5 text-start transition ${
                  active ? "border-brand ring-1 ring-brand" : "hover:border-brand/40"
                }`}
              >
                <h2 className="font-display text-lg font-bold text-ink">{t(copy.name)}</h2>
                <p className="mt-1 text-sm text-ink-muted">{t(copy.address)}</p>
              </button>
            );
          })}

          <div className="card space-y-3 p-5 text-sm">
            <p>
              <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("offices.phone")}
              </span>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-brand">
                {contact.phone}
              </a>
            </p>
            <p>
              <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("offices.email")}
              </span>
              <a href={`mailto:${contact.email}`} className="text-brand">
                {contact.email}
              </a>
            </p>
            <p>
              <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {t("offices.hours")}
              </span>
              {contact.hours}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href={mapHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
                {showsOffice ? t("offices.google") : t("offices.map")}
              </a>
              <Link href="/arac-modelleri" className="btn-outline">
                {t("offices.reserve")}
              </Link>
            </div>
            {showsOffice ? <p className="text-xs text-ink-muted">{t("offices.googleNote")}</p> : null}
          </div>
        </div>

        <div className="card relative z-0 overflow-hidden lg:sticky lg:top-24">
          <iframe
            key={selectedId ?? "saw"}
            title={pin ? t(pin.name) : GOOGLE_PLACE.name}
            src={googleEmbed(selectedId)}
            className="h-[28rem] w-full border-0 lg:h-[36rem]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border px-4 py-3">
            <p className="text-sm text-ink-muted">{showsOffice ? t("offices.googleNote") : t(pin?.name ?? "loc.saw.full")}</p>
            <a href={mapHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {showsOffice ? t("offices.google") : t("offices.map")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
