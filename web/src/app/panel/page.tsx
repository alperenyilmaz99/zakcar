import Link from "next/link";
import {
  getFleet,
  getPanelStats,
  getRentals,
} from "@/lib/panel-data";
import {
  FleetStatusBadge,
  RentalStatusBadge,
  formatDateTime,
  formatRelative,
} from "@/components/panel/Badges";

export default function PanelDashboardPage() {
  const stats = getPanelStats();
  const fleet = getFleet();
  const rentals = getRentals().filter((r) => r.status === "aktif" || r.status === "bekliyor");
  const recent = [...fleet].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
  );

  const cards = [
    { label: "Toplam filo", value: stats.total, href: "/panel/araclar" },
    { label: "Müsait", value: stats.musait, href: "/panel/araclar?durum=musait" },
    { label: "Kirada", value: stats.kirada, href: "/panel/araclar?durum=kirada" },
    { label: "Aktif kiralama", value: stats.aktifKiralama, href: "/panel/kiralamalar?durum=aktif" },
    { label: "Bugün teslim", value: stats.bugunTeslim, href: "/panel/kiralamalar" },
    { label: "Bakımda", value: stats.bakimda, href: "/panel/araclar?durum=bakimda" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Operasyon özeti
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Canlı filo durumu, aktif kiralamalar ve güncel hareketler.
          </p>
        </div>
        <Link href="/panel/konumlar" className="btn-primary text-sm">
          Haritada gör
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-surface-border bg-white px-4 py-4 transition hover:border-brand hover:shadow-card"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-ink">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Aktif / bekleyen kiralamalar</h2>
            <Link href="/panel/kiralamalar" className="text-sm font-medium text-brand hover:underline">
              Tümü
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
            <ul className="divide-y divide-surface-border">
              {rentals.slice(0, 6).map((r) => (
                <li key={r.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        {r.customer.name}{" "}
                        <span className="font-normal text-ink-muted">· {r.pnr}</span>
                      </p>
                      <p className="mt-0.5 truncate text-sm text-ink-muted">
                        {r.vehicleName} · {r.plate}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {formatDateTime(r.startAt)} → {formatDateTime(r.endAt)}
                      </p>
                    </div>
                    <RentalStatusBadge status={r.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Son konum güncellemeleri</h2>
            <Link href="/panel/araclar" className="text-sm font-medium text-brand hover:underline">
              Filo
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
            <ul className="divide-y divide-surface-border">
              {recent.slice(0, 6).map((v) => (
                <li key={v.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">
                      {v.name}{" "}
                      <span className="font-normal text-ink-muted">· {v.plate}</span>
                    </p>
                    <p className="mt-0.5 truncate text-sm text-ink-muted">{v.locationLabel}</p>
                    <p className="mt-1 text-xs text-ink-muted">{formatRelative(v.lastUpdated)}</p>
                  </div>
                  <FleetStatusBadge status={v.status} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
