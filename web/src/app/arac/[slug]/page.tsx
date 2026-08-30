import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { getVehicleBySlug, vehicleImagePath } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const { getAllVehicleSlugs } = await import("@/lib/data");
  return getAllVehicleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return { title: "Araç Bulunamadı" };
  return { title: vehicle.name.replace(" Araç Kiralama", ""), description: vehicle.summary };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card overflow-hidden p-6">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={vehicleImagePath(vehicle.image)}
              alt={vehicle.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{vehicle.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">
            {vehicle.name.replace(" Araç Kiralama", "")}
          </h1>
          <p className="mt-4 text-ink-muted">{vehicle.summary}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Grup", vehicle.group],
              ["Yakıt", vehicle.fuel],
              ["Vites", vehicle.transmission],
              ["Kapasite", `${vehicle.capacity} Kişi`],
              ["Fiyat", `${formatPrice(vehicle.price)} / gün`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-surface-soft px-4 py-3">
                <dt className="text-xs text-ink-muted">{k}</dt>
                <dd className="font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <Link href={`/rezervasyon?vehicle=${vehicle.slug}`} className="btn-primary mt-8 w-full sm:w-auto">
            Bu Aracı Kirala
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <SearchBar compact />
      </div>
    </div>
  );
}
