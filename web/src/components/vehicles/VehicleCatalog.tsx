"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/lib/types";

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  initialGroup?: string;
  initialBrand?: string;
  groups: string[];
  brands: string[];
}

export function VehicleCatalog({
  vehicles,
  initialGroup,
  initialBrand,
  groups,
  brands,
}: VehicleCatalogProps) {
  const router = useRouter();
  const [group, setGroup] = useState(initialGroup ?? "");
  const [brand, setBrand] = useState(initialBrand ?? "");

  const filtered = useMemo(() => {
    let list = vehicles;
    if (group) list = list.filter((v) => v.group === group);
    if (brand) list = list.filter((v) => v.brand === brand);
    return list;
  }, [vehicles, group, brand]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">Tüm Gruplar</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          className="rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Tüm Markalar</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <span className="self-center text-sm text-ink-muted">{filtered.length} araç</span>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-surface-border bg-white p-8 text-center text-ink-muted">
          Seçtiğiniz filtrelere uygun araç bulunamadı.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
            <VehicleCard
              key={v.slug}
              vehicle={v}
              onSelect={(slug) => router.push(`/rezervasyon?vehicle=${slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
