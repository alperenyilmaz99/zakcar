import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/types";
import { vehicleImagePath } from "@/lib/data";
import { formatPrice } from "@/lib/format";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (slug: string) => void;
}

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const shortName = vehicle.name
    .replace(" Araç Kiralama", "")
    .replace(new RegExp(`^${vehicle.brand}\\s*`, "i"), "")
    .trim();

  const selectBtn = onSelect ? (
    <button type="button" className="btn-primary !rounded-lg !px-5 !py-2.5" onClick={() => onSelect(vehicle.slug)}>
      Aracı Seç
    </button>
  ) : (
    <Link href={`/rezervasyon?vehicle=${vehicle.slug}`} className="btn-primary !rounded-lg !px-5 !py-2.5">
      Aracı Seç
    </Link>
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm transition hover:shadow-md">
      {/* Elitcar-style header */}
      <div className="flex items-center justify-between gap-2 bg-[#eef4ff] px-4 py-3">
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
          <span aria-hidden>+</span> Detay
        </Link>
      </div>

      {/* Specs row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-surface-border px-4 py-2.5 text-xs text-ink-muted">
        <span>{vehicle.fuel}</span>
        <span>{vehicle.transmission}</span>
        <span>{vehicle.capacity} Kişi</span>
      </div>

      {/* Image + badges */}
      <div className="relative px-4 pb-2 pt-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-xs text-ink-muted">
            Depozito: <span className="font-medium text-ink">{vehicle.deposit ?? "15.540 TL"}</span>
          </p>
          <span className="rounded bg-[#fef5ec] px-2 py-0.5 text-[11px] font-semibold text-[#9a3412]">
            {vehicle.group}
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

      {/* Price + CTA */}
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-surface-border px-4 py-3.5">
        <div>
          <p className="font-display text-lg font-bold text-ink">
            {formatPrice(vehicle.price)}{" "}
            <span className="text-sm font-medium text-ink-muted">Günlük</span>
          </p>
          <p className="text-xs text-ink-muted">Başlayan fiyatlarla</p>
        </div>
        {selectBtn}
      </div>
    </article>
  );
}
