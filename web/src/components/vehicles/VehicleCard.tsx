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
  const shortName = vehicle.name.replace(" Araç Kiralama", "");

  return (
    <article className="card flex flex-col overflow-hidden transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-2 border-b border-surface-border p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{vehicle.brand}</p>
          <h3 className="font-display text-lg font-bold text-ink">{shortName}</h3>
        </div>
        <Link
          href={`/arac/${vehicle.slug}`}
          className="shrink-0 rounded-lg bg-surface-soft px-2 py-1 text-xs font-medium text-ink-muted hover:text-brand"
        >
          Detay
        </Link>
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-ink-muted">
          <Tag>{vehicle.fuel}</Tag>
          <Tag>{vehicle.transmission}</Tag>
          <Tag>{vehicle.capacity} Kişi</Tag>
          <Tag>{vehicle.group}</Tag>
        </div>

        <div className="relative mx-auto mb-4 aspect-[16/10] w-full max-w-[260px]">
          <Image
            src={vehicleImagePath(vehicle.image)}
            alt={vehicle.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 260px"
          />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-surface-border pt-4">
          <div>
            <p className="font-display text-xl font-bold text-ink">{formatPrice(vehicle.price)}</p>
            <p className="text-xs text-ink-muted">Günlük · başlayan fiyatlarla</p>
          </div>
          {onSelect ? (
            <button type="button" className="btn-primary !px-4 !py-2.5" onClick={() => onSelect(vehicle.slug)}>
              Seç
            </button>
          ) : (
            <Link href={`/rezervasyon?vehicle=${vehicle.slug}`} className="btn-primary !px-4 !py-2.5">
              Seç
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-soft px-2.5 py-1 font-medium">{children}</span>
  );
}
