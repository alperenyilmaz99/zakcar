import { notFound, redirect } from "next/navigation";
import { AirportArticle, AirportHeading } from "@/components/content/AirportArticle";
import { DistrictArticle, DistrictHeading, IstanbulDistrictIndex } from "@/components/content/DistrictArticle";
import { LandingFallback, LandingHeading } from "@/components/content/LandingHeading";
import { ServiceArticle, ServiceHeading } from "@/components/content/ServiceArticle";
import { airportArticleId, airportArticleTitle } from "@/lib/airport-slugs";
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
  const district = districtBySlug(slug);
  const saved = article
    ? (await loadAirportCards()).items.find((item) => item.href === `/${slug}`)
    : undefined;

  const showCatalog = seo.type === "group" || seo.type === "brand";
  const vehicles = showCatalog
    ? await withLivePrices(filterVehicles({ group: seo.filterGroup, brand: seo.filterBrand }))
    : [];

  return (
    <div className="container-page py-10 lg:py-14">
      {isServiceArticle(slug) ? (
        <ServiceHeading slug={slug} />
      ) : article ? (
        <AirportHeading slug={slug} savedTitle={saved?.title} />
      ) : district ? (
        <DistrictHeading district={district} />
      ) : (
        <LandingHeading
          slug={slug}
          title={seo.title}
          description={seo.description}
          group={seo.filterGroup}
          brand={seo.filterBrand}
        />
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
      ) : article ? (
        <AirportArticle airport={article} customDetail={saved?.detail} />
      ) : isServiceArticle(slug) ? (
        <ServiceArticle slug={slug} />
      ) : district ? (
        <DistrictArticle district={district} />
      ) : slug === "istanbul-arac-kiralama" ? (
        <IstanbulDistrictIndex />
      ) : (
        <LandingFallback />
      )}
    </div>
  );
}
