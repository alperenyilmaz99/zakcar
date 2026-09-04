import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { VehicleCatalog } from "@/components/vehicles/VehicleCatalog";
import {
  filterVehicles,
  getAllSeoSlugs,
  getVehicleBySlug,
  resolveSeoPage,
} from "@/lib/data";

export async function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (vehicle) return { title: vehicle.name, description: vehicle.summary };
  const seo = resolveSeoPage(slug);
  if (seo) return { title: seo.title, description: seo.description };
  return { title: slug };
}

export default async function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const vehicle = getVehicleBySlug(slug);
  if (vehicle) redirect(`/arac/${vehicle.slug}`);

  const seo = resolveSeoPage(slug);
  if (!seo) notFound();

  const showCatalog = seo.type === "group" || seo.type === "brand";
  const vehicles = showCatalog
    ? filterVehicles({ group: seo.filterGroup, brand: seo.filterBrand })
    : [];

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">{seo.title}</h1>
      <p className="section-sub">{seo.description}</p>

      <div className="my-8">
        <SearchBar
          defaultPickup={seo.defaultPickup}
          defaultGroup={seo.filterGroup}
          compact
        />
      </div>

      {showCatalog ? (
        <VehicleCatalog
          vehicles={vehicles}
          initialGroup={seo.filterGroup}
        />
      ) : (
        <div className="card p-8 text-center">
          <p className="text-ink-muted">
            ZakCar Rent A Car ile güvenilir araç kiralama deneyimi yaşayın.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/arac-modelleri" className="btn-primary">
              Tüm Araçları İncele
            </Link>
            <Link href="/iletisim" className="btn-outline">
              Bize Ulaşın
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
