import Image from "next/image";
import { notFound } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { getVehicleBySlug, vehicleImagePath } from "@/lib/data";
import { VehicleDetailInfo } from "@/components/vehicles/VehicleDetailInfo";

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

          <VehicleDetailInfo vehicle={vehicle} />
        </div>
      </div>

      <div className="mt-12">
        <SearchBar compact />
      </div>
    </div>
  );
}
