"use client";

import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/types";
import { vehicleImagePath } from "@/lib/data";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { specLabel } from "@/lib/i18n";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (slug: string) => void;
}

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const { t, formatPrice, locale } = usePrefs();
  const shortName = vehicle.name
    .replace(" Araç Kiralama", "")
    .replace(new RegExp(`^${vehicle.brand}\\s*`, "i"), "")
    .trim();

  const selectBtn = onSelect ? (
    <button type="button" className="btn-primary !rounded-lg !px-5 !py-2.5" onClick={() => onSelect(vehicle.slug)}>
      {t("card.select")}
    </button>
  ) : (
    <Link href={`/rezervasyon?vehicle=${vehicle.slug}`} className="btn-primary !rounded-lg !px-5 !py-2.5">
      {t("card.select")}
    </Link>
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-2 bg-brand-light px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            <span className="text-brand">{vehicle.brand}</span>{" "}
            <span>{shortName || vehicle.brand}</span>
          </p>
        </div>
        <Link
          href={`/arac/${vehicle.slug}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-brand px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-dark"
        >
          <span aria-hidden>+</span> {t("card.detail")}
        </Link>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-surface-border px-4 py-2.5 text-xs text-ink-muted">
        <span>{specLabel(locale, vehicle.fuel)}</span>
        <span>{specLabel(locale, vehicle.transmission)}</span>
        <span>
          {vehicle.capacity} {t("card.person")}
        </span>
      </div>

      <div className="relative px-4 pb-2 pt-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-xs text-ink-muted">
            {t("card.deposit")}:{" "}
            <span className="font-medium text-ink">{formatPrice(vehicle.deposit ?? "15.540 TL")}</span>
          </p>
          <span className="rounded bg-brand-light px-2 py-0.5 text-[11px] font-semibold text-brand-dark">
            {specLabel(locale, vehicle.group)}
          </span>
        </div>
        <div className="relative mx-auto aspect-[16/9] w-full max-w-[280px]">
          <Image
            src={vehicleImagePath(vehicle.image)}
            alt={vehicle.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 280px"
          />
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-surface-border px-4 py-3.5">
        <div>
          <p className="font-display text-lg font-bold text-ink">
            {formatPrice(vehicle.price)}{" "}
            <span className="text-sm font-medium text-ink-muted">{t("card.daily")}</span>
          </p>
          <p className="text-xs text-ink-muted">{t("card.fromPrices")}</p>
        </div>
        {selectBtn}
      </div>
    </article>
  );
}
