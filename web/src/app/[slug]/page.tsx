import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AirportArticle, AirportDetailText, airportArticleId, airportArticleTitle } from "@/components/content/AirportArticle";
import { DistrictArticle, IstanbulDistrictIndex } from "@/components/content/DistrictArticle";
import { ServiceArticle, ServiceHeading } from "@/components/content/ServiceArticle";
import { isServiceArticle } from "@/lib/service-slugs";
import { districtBySlug } from "@/lib/districts";
import { SearchBar } from "@/components/search/SearchBar";
import { VehicleCatalog } from "@/components/vehicles/VehicleCatalog";
import { loadAirportCards } from "@/lib/airport-store";
import {
  filterVehicles,
  getAllSeoSlugs,
  getVehicleBySlug,
  resolveSeoPage,
} from "@/lib/data";
import { withLivePrices } from "@/lib/model-prices";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (vehicle) return { title: vehicle.name, description: vehicle.summary };
  const articleTitle = airportArticleTitle(slug);
  if (articleTitle) {
    const { items } = await loadAirportCards();
    const saved = items.find((item) => item.href === `/${slug}`);
    const title = saved?.title || articleTitle;
    return { title, description: saved?.text || title };
  }
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
  const article = airportArticleId(slug);
  const saved = article
    ? (await loadAirportCards()).items.find((item) => item.href === `/${slug}`)
    : undefined;
  const heading = saved?.title || (article ? airportArticleTitle(slug) : seo.title);

  const showCatalog = seo.type === "group" || seo.type === "brand";
  const vehicles = showCatalog
    ? await withLivePrices(filterVehicles({ group: seo.filterGroup, brand: seo.filterBrand }))
    : [];

  return (
    <div className="container-page py-10 lg:py-14">
      {isServiceArticle(slug) ? (
        <ServiceHeading slug={slug} />
      ) : (
        <>
          <h1 className="section-title">{heading ?? seo.title}</h1>
          {article ? null : <p className="section-sub">{seo.description}</p>}
        </>
      )}

      <div className="my-8">
        <SearchBar
          defaultPickup={article === "saw" ? "saw" : article === "iga" ? "iga" : seo.defaultPickup}
          defaultGroup={seo.filterGroup}
          compact
        />
      </div>

      {showCatalog ? (
        <VehicleCatalog
          vehicles={vehicles}
          initialGroup={seo.filterGroup}
        />
      ) : article && saved?.detail ? (
        <AirportDetailText text={saved.detail} />
      ) : article ? (
        <AirportArticle airport={article} />
      ) : isServiceArticle(slug) ? (
        <ServiceArticle slug={slug} />
      ) : districtBySlug(slug) ? (
        <DistrictArticle district={districtBySlug(slug)!} />
      ) : slug === "istanbul-arac-kiralama" ? (
        <IstanbulDistrictIndex />
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
