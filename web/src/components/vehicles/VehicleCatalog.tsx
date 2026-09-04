"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/lib/types";

const GROUPS = ["Ekonomik", "SUV", "Minibüs", "Lüks"] as const;
const FUELS = ["Elektrik", "Dizel", "Benzin", "Hibrit"] as const;
const TRANSMISSIONS = ["Otomatik", "Manuel"] as const;

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  initialGroup?: string;
  groups?: string[];
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function VehicleCatalog({ vehicles, initialGroup }: VehicleCatalogProps) {
  const router = useRouter();
  const [groups, setGroups] = useState<string[]>(initialGroup ? [initialGroup] : []);
  const [fuels, setFuels] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = vehicles;
    if (groups.length) list = list.filter((v) => groups.includes(v.group));
    if (fuels.length) list = list.filter((v) => fuels.includes(v.fuel));
    if (transmissions.length) {
      list = list.filter((v) => transmissions.includes(v.transmission));
    }
    return list;
  }, [vehicles, groups, fuels, transmissions]);

  return (
    <div>
      <div className="mb-4 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm text-[#1e3a8a]">
        10 günlük rezervasyon, 3000 km yol hakkınız bulunmaktadır.
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Elitcar-style sidebar filters — no brand */}
        <aside className="space-y-3">
          <h2 className="text-sm font-semibold text-ink">Araçlar</h2>

          <FilterBox title="Grup">
            {GROUPS.map((g) => (
              <CheckRow
                key={g}
                label={g}
                checked={groups.includes(g)}
                onChange={() => setGroups((prev) => toggleValue(prev, g))}
              />
            ))}
          </FilterBox>

          <FilterBox title="Yakıt Tipi">
            {FUELS.map((f) => (
              <CheckRow
                key={f}
                label={f}
                checked={fuels.includes(f)}
                onChange={() => setFuels((prev) => toggleValue(prev, f))}
              />
            ))}
          </FilterBox>

          <FilterBox title="Vites Tipi">
            {TRANSMISSIONS.map((t) => (
              <CheckRow
                key={t}
                label={t}
                checked={transmissions.includes(t)}
                onChange={() => setTransmissions((prev) => toggleValue(prev, t))}
              />
            ))}
          </FilterBox>
        </aside>

        <div>
          <p className="mb-4 text-sm text-ink-muted">{filtered.length} araç</p>

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
      </div>
    </div>
  );
}

function FilterBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
      <div className="border-b border-surface-border bg-surface-soft px-3.5 py-2.5 text-sm font-semibold text-ink">
        {title}
      </div>
      <div className="space-y-1 px-3.5 py-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-ink hover:bg-surface-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-surface-border text-brand focus:ring-brand"
      />
      {label}
    </label>
  );
}
