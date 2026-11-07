"use client";

import Link from "next/link";
import type { Vehicle } from "@/lib/types";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { specLabel } from "@/lib/i18n";
import { depositForDays, rentalDays } from "@/lib/extras";
import { formatTryAmount } from "@/lib/format";
import { useSearch } from "@/hooks/useSearch";

export function VehicleDetailInfo({ vehicle }: { vehicle: Vehicle }) {
  const { t, formatPrice, locale } = usePrefs();
  const { search } = useSearch();
  const days = search.from && search.to ? rentalDays(search.from, search.to) : 1;

  const rows = [
    [t("vehicle.group"), specLabel(locale, vehicle.group)],
    [t("vehicle.fuel"), specLabel(locale, vehicle.fuel)],
    [t("vehicle.gear"), specLabel(locale, vehicle.transmission)],
    [t("vehicle.capacity"), `${vehicle.capacity} ${t("card.person")}`],
    [t("vehicle.price"), `${formatPrice(vehicle.price)} ${t("vehicle.perDay")}`],
    [t("card.deposit"), formatPrice(formatTryAmount(depositForDays(days)))],
  ];

  return (
    <>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-surface-soft px-4 py-3">
            <dt className="text-xs text-ink-muted">{k}</dt>
            <dd className="font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <Link href={`/rezervasyon?vehicle=${vehicle.slug}`} className="btn-primary mt-8 w-full sm:w-auto">
        {t("vehicle.rent")}
      </Link>
    </>
  );
}
