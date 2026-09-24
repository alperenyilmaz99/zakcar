"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/lib/types";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { specLabel } from "@/lib/i18n";

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
  const { t, locale } = usePrefs();
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
      <div className="mb-4 rounded-xl border border-brand/20 bg-brand-light px-4 py-3 text-sm text-brand-dark">
        {t("catalog.notice")}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Elitcar-style sidebar filters — no brand */}
        <aside className="space-y-3">
          <h2 className="text-sm font-semibold text-ink">{t("catalog.sidebar")}</h2>

          <FilterBox title={t("catalog.group")}>
            {GROUPS.map((g) => (
              <CheckRow
                key={g}
                label={specLabel(locale, g)}
                checked={groups.includes(g)}
                onChange={() => setGroups((prev) => toggleValue(prev, g))}
              />
            ))}
          </FilterBox>

          <FilterBox title={t("catalog.fuel")}>
            {FUELS.map((f) => (
              <CheckRow
                key={f}
                label={specLabel(locale, f)}
                checked={fuels.includes(f)}
                onChange={() => setFuels((prev) => toggleValue(prev, f))}
              />
            ))}
          </FilterBox>

          <FilterBox title={t("catalog.gear")}>
            {TRANSMISSIONS.map((tr) => (
              <CheckRow
                key={tr}
                label={specLabel(locale, tr)}
                checked={transmissions.includes(tr)}
                onChange={() => setTransmissions((prev) => toggleValue(prev, tr))}
              />
            ))}
          </FilterBox>
        </aside>

        <div>
          <p className="mb-4 text-sm text-ink-muted">{t("catalog.count", { n: filtered.length })}</p>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-surface-border bg-white p-8 text-center text-ink-muted">
              {t("catalog.empty")}
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
