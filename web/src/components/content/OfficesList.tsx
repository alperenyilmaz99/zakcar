"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Office } from "@/lib/types";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

const OFFICE_COPY: Record<string, { name: MessageKey; address: MessageKey; lat: number; lng: number }> = {
  saw: { name: "loc.saw.full", address: "loc.saw.address", lat: 40.8986, lng: 29.3092 },
  iga: { name: "loc.iga.full", address: "loc.iga.address", lat: 41.2753, lng: 28.7519 },
  merkez: { name: "loc.merkez.full", address: "loc.merkez.address", lat: 40.929, lng: 29.3092 },
};

const ALL_PINS = "loc:40.8986,29.3092|loc:41.2753,28.7519|loc:40.929,29.3092";

function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function googleEmbed(selectedId: string | null) {
  if (selectedId && OFFICE_COPY[selectedId]) {
    const pin = OFFICE_COPY[selectedId];
    return `https://maps.google.com/maps?hl=tr&q=${pin.lat},${pin.lng}&z=15&output=embed`;
  }
  return `https://maps.google.com/maps?hl=tr&ll=39,35&z=6&q=${ALL_PINS}&output=embed`;
}

export function OfficesList({ offices }: { offices: Office[] }) {
  const { t } = usePrefs();
  const listed = offices.filter((office) => OFFICE_COPY[office.id]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (OFFICE_COPY[id]) setSelectedId(id);
  }, []);

  const selected = listed.find((office) => office.id === selectedId) ?? null;
  const contact = selected ?? listed[0];
  if (!contact) return null;
  const pin = selected ? OFFICE_COPY[selected.id] : null;

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
              <a
                href={pin ? mapsUrl(pin.lat, pin.lng) : "https://www.google.com/maps/@39,35,6z"}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                {t("offices.map")}
              </a>
              <Link href="/arac-modelleri" className="btn-primary">
                {t("offices.reserve")}
              </Link>
            </div>
          </div>
        </div>

        <div className="card relative z-0 h-[28rem] overflow-hidden lg:sticky lg:top-24 lg:h-[40rem]">
          <iframe
            key={selectedId ?? "all"}
            title={pin ? t(pin.name) : t("offices.title")}
            src={googleEmbed(selectedId)}
            className="h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
