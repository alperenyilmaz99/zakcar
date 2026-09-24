"use client";

import type { Office } from "@/lib/types";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

const OFFICE_COPY: Record<string, { name: MessageKey; address: MessageKey }> = {
  saw: { name: "loc.saw.full", address: "loc.saw.address" },
  iga: { name: "loc.iga.full", address: "loc.iga.address" },
  merkez: { name: "loc.merkez.full", address: "loc.merkez.address" },
};

export function OfficesList({ offices }: { offices: Office[] }) {
  const { t } = usePrefs();

  return (
    <div className="space-y-4">
      {offices.map((o) => {
        const copy = OFFICE_COPY[o.id];
        return (
          <div key={o.id} id={o.id} className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink">{copy ? t(copy.name) : o.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{copy ? t(copy.address) : o.address}</p>
            <p className="mt-2 text-sm">
              Tel:{" "}
              <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="text-brand">
                {o.phone}
              </a>
              {" · "}
              {o.hours}
            </p>
          </div>
        );
      })}
    </div>
  );
}
