import { notFound, redirect } from "next/navigation";
import { AirportArticle, AirportHeading } from "@/components/content/AirportArticle";
import { DistrictArticle, DistrictHeading, IstanbulDistrictIndex } from "@/components/content/DistrictArticle";
import { LandingFallback, LandingHeading } from "@/components/content/LandingHeading";
import { ServiceArticle, ServiceHeading } from "@/components/content/ServiceArticle";
import { airportArticleId, airportArticleTitle } from "@/lib/airport-slugs";
import { isServiceArticle } from "@/lib/service-slugs";
import { SearchBar } from "@/components/search/SearchBar";
import { VehicleCatalog } from "@/components/vehicles/VehicleCatalog";
import { AIRPORT_CARDS, isStockAirportTitle } from "@/lib/airport-cards";
import { loadAirportCards } from "@/lib/airport-store";
import { loadDistricts } from "@/lib/district-store";
import {
  getAllSeoSlugs,
  resolveSeoPage,
  seoForDistrict,
} from "@/lib/data";
import { FooterServicePage } from "@/components/content/FooterServicePage";
import { footerServicePage } from "@/lib/generated-content";
import { filterPublicVehicles, findPublicVehicle, loadPublicVehicles } from "@/lib/public-vehicles";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = findPublicVehicle(await loadPublicVehicles(), slug);
  if (vehicle) return { title: vehicle.name, description: vehicle.summary };
  const articleTitle = airportArticleTitle(slug);
  if (articleTitle) {
    const { items } = await loadAirportCards();
    const saved = items.find((item) => item.href === `/${slug}`);
    const card = AIRPORT_CARDS.find((item) => item.href === `/${slug}`);
    const savedTitle = saved?.title?.trim() || "";
    const title = (
      savedTitle && !(card && isStockAirportTitle(card.id, savedTitle)) ? savedTitle : articleTitle
    ).replaceAll("IGA", "IST");
    return { title, description: (saved?.text || title).replaceAll("IGA", "IST") };
  }
  const seo = resolveSeoPage(slug);
  if (seo) return { title: seo.title, description: seo.description };
  const extra = (await loadDistricts()).items.find((item) => item.slug === slug);
  if (extra) {
    const page = seoForDistrict(extra);
    return { title: page.title, description: page.description };
  }
  const service = await footerServicePage(slug);
  if (service) return { title: service.label, description: service.body.replace(/\s+/g, " ").slice(0, 180) };
  return { title: slug };
}

export default async function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const vehicles = await loadPublicVehicles();
  const vehicle = findPublicVehicle(vehicles, slug);
  if (vehicle) redirect(`/arac/${vehicle.slug}`);

  const district = (await loadDistricts()).items.find((item) => item.slug === slug) ?? null;
  const seo = resolveSeoPage(slug) ?? (district ? seoForDistrict(district) : null);
  if (!seo) {
    const service = await footerServicePage(slug);
    if (!service) notFound();
    return <FooterServicePage title={service.label} body={service.body} />;
  }
  const article = airportArticleId(slug);
  const saved = article
    ? (await loadAirportCards()).items.find((item) => item.href === `/${slug}`)
    : undefined;

  const showCatalog = seo.type === "group" || seo.type === "brand";
  const catalog = showCatalog
    ? filterPublicVehicles(vehicles, { group: seo.filterGroup, brand: seo.filterBrand })
    : [];

  return (
    <div className="container-page py-10 lg:py-14">
      {isServiceArticle(slug) ? (
        <ServiceHeading slug={slug} />
      ) : article ? (
        <AirportHeading slug={slug} savedTitle={saved?.title?.replaceAll("IGA", "IST")} />
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
          vehicles={catalog}
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
