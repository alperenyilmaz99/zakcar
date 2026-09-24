"use client";

import Link from "next/link";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { SegmentSection } from "@/components/home/SegmentSection";
import { NAV } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { Vehicle } from "@/lib/types";

export function HomeSections({
  vehicles,
  brands,
  groupCount,
}: {
  vehicles: Vehicle[];
  brands: string[];
  groupCount: number;
}) {
  const { t } = usePrefs();

  return (
    <>
      <section className="container-page relative z-10 -mt-6 grid gap-4 sm:grid-cols-3">
        {(
          [
            ["feat.price.title", "feat.price.desc"],
            ["feat.support.title", "feat.support.desc"],
            ["feat.trust.title", "feat.trust.desc"],
          ] as const
        ).map(([title, desc]) => (
          <div key={title} className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink">{t(title)}</h2>
            <p className="mt-2 text-sm text-ink-muted">{t(desc)}</p>
          </div>
        ))}
      </section>

      <section className="container-page py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t("home.popular")}</h2>
            <p className="section-sub">{t("home.popularSub")}</p>
          </div>
          <Link href="/arac-modelleri" className="btn-outline">
            {t("home.allCars")}
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      </section>

      <SegmentSection />

      <section className="container-page py-14">
        <h2 className="section-title">{t("home.cities")}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {NAV.cities.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-2xl border border-surface-border bg-white px-4 py-5 text-center font-semibold transition hover:border-brand hover:text-brand"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-surface-border bg-white py-14">
        <div className="container-page text-center">
          <h2 className="section-title">{t("home.brands")}</h2>
          <p className="section-sub mx-auto">{t("home.brandsSub", { brands: brands.length, groups: groupCount })}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {brands.slice(0, 12).map((b) => (
              <Link
                key={b}
                href={`/${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-arac-kiralama`}
                className="rounded-full border border-surface-border bg-surface-soft px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"
              >
                {b}
              </Link>
            ))}
          </div>
          <Link href="/arac-markalari" className="btn-primary mt-8">
            {t("home.allBrands")}
          </Link>
        </div>
      </section>
    </>
  );
}
