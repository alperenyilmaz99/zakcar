import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { FEATURES, NAV, SITE } from "@/lib/constants";
import { getBrands, getGroups, getVehicles } from "@/lib/data";

export default function HomePage() {
  const vehicles = getVehicles().slice(0, 6);
  const groups = getGroups();
  const brands = getBrands();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-[#0f172a] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="container-page relative py-14 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
              Güvenilir Araç Kiralama
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Araç Kiralama, Burada Konfor Var
            </h1>
            <p className="mt-4 text-base text-white/85 sm:text-lg">
              {SITE.name} olarak İstanbul Sabiha Gökçen Havalimanı başta olmak üzere
              güvenilir ve uygun fiyatlı araç kiralama hizmeti sunuyoruz.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container-page -mt-8 grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink">{f.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="container-page py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Popüler Araçlar</h2>
            <p className="section-sub">Geniş filomuzdan size uygun aracı seçin.</p>
          </div>
          <Link href="/arac-modelleri" className="btn-outline">
            Tüm Araçlar
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <h2 className="section-title">Araç Grupları</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NAV.vehicles.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="card group p-6 transition hover:border-brand hover:shadow-lg"
              >
                <h3 className="font-display text-xl font-bold group-hover:text-brand">{g.label}</h3>
                <p className="mt-2 text-sm text-ink-muted">Hemen incele →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="section-title">Popüler Şehirler</h2>
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
          <h2 className="section-title">Markalar</h2>
          <p className="section-sub mx-auto">{brands.length} farklı marka · {groups.length} araç grubu</p>
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
            Tüm Markalar
          </Link>
        </div>
      </section>
    </>
  );
}
