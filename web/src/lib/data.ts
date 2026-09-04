import type { VehicleCatalog, Vehicle, Office, SeoPage } from "./types";
import vehiclesData from "@/data/vehicles.json";
import officesData from "@/data/offices.json";
import {
  ELITCAR_ORDER,
  ELITCAR_PRICES,
  GROUP_OVERRIDES,
  GROUP_RANK,
  META_OVERRIDES,
} from "./sort-order";

const catalog = vehiclesData as VehicleCatalog;

function enrich(v: Vehicle): Vehicle {
  const meta = META_OVERRIDES[v.slug];
  const group = GROUP_OVERRIDES[v.slug] ?? v.group;
  return {
    ...v,
    group,
    price: ELITCAR_PRICES[v.slug] ?? v.price,
    fuel: meta?.fuel ?? v.fuel,
    transmission: meta?.transmission ?? v.transmission,
    capacity: meta?.capacity ?? v.capacity,
    deposit: meta?.deposit ?? (group === "SUV" || group === "Lüks" ? "18.500 TL" : "15.540 TL"),
  };
}

function sortVehicles(list: Vehicle[]): Vehicle[] {
  const rank = new Map(ELITCAR_ORDER.map((slug, i) => [slug, i]));
  return [...list].sort((a, b) => {
    const ga = GROUP_RANK[a.group] ?? 99;
    const gb = GROUP_RANK[b.group] ?? 99;
    if (ga !== gb) return ga - gb;
    const oa = rank.get(a.slug) ?? 10_000;
    const ob = rank.get(b.slug) ?? 10_000;
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name, "tr");
  });
}

const vehiclesSorted = sortVehicles(catalog.vehicles.map(enrich));

export function getCatalog(): VehicleCatalog {
  return {
    ...catalog,
    vehicles: vehiclesSorted,
    groups: ["Ekonomik", "SUV", "Minibüs", "Lüks"],
  };
}

export function getVehicles(): Vehicle[] {
  return vehiclesSorted;
}

export function getGroups(): string[] {
  return ["Ekonomik", "SUV", "Minibüs", "Lüks"];
}

export function getBrands(): string[] {
  return catalog.brands;
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  const normalized = slug.replace(/-arac-kiralama$/, "");
  return vehiclesSorted.find(
    (v) => v.slug === normalized || v.slug === slug,
  );
}

export function getOffices(): Office[] {
  return (officesData as { offices: Office[] }).offices;
}

export function filterVehicles(opts: {
  group?: string;
  brand?: string;
  brandSlug?: string;
}): Vehicle[] {
  let list = vehiclesSorted;
  if (opts.group) list = list.filter((v) => v.group === opts.group);
  if (opts.brand) list = list.filter((v) => v.brand === opts.brand);
  if (opts.brandSlug)
    list = list.filter((v) => v.brandSlug === opts.brandSlug);
  return list;
}

export function brandSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const GROUP_PAGES: Record<string, string> = {
  "4x4-suv-arac-kiralama": "SUV",
  "ekonomik-arac-kiralama": "Ekonomik",
  "luks-arac-kiralama": "Lüks",
  "7-10-kisilik-arac-kiralama": "Minibüs",
};

const CITY_PAGES: Record<string, string> = {
  istanbul: "İstanbul",
  izmir: "İzmir",
  ankara: "Ankara",
  antalya: "Antalya",
  kayseri: "Kayseri",
  adana: "Adana",
};

const SERVICE_PAGES: Record<string, { title: string; desc: string }> = {
  "uzun-donem-arac-kiralama": {
    title: "Uzun Dönem Araç Kiralama",
    desc: "Aylık ve uzun dönem filo çözümleri.",
  },
  "kredi-kartsiz-arac-kiralama": {
    title: "Kredi Kartsız Araç Kiralama",
    desc: "Kredi kartı olmadan kiralama imkânı.",
  },
  "kurumsal-arac-kiralama": {
    title: "Kurumsal Araç Kiralama",
    desc: "Şirketiniz için özel filo teklifleri.",
  },
  "havalimani-arac-kiralama": {
    title: "Havalimanı Araç Kiralama",
    desc: "Tüm havalimanlarında hızlı teslim.",
  },
};

export function resolveSeoPage(slug: string): SeoPage | null {
  const base = slug.replace(/-arac-kiralama$/, "").replace(/-kiralama$/, "");

  if (GROUP_PAGES[slug]) {
    return {
      slug,
      title: `${GROUP_PAGES[slug]} Araç Kiralama`,
      description: `${GROUP_PAGES[slug]} araç modellerimizi inceleyin.`,
      type: "group",
      filterGroup: GROUP_PAGES[slug],
    };
  }

  const brand = catalog.brands.find((b) => brandSlug(b) === base);
  if (brand && slug.endsWith("-arac-kiralama")) {
    return {
      slug,
      title: `${brand} Araç Kiralama`,
      description: `${brand} marka araç kiralama seçenekleri.`,
      type: "brand",
      filterBrand: brand,
    };
  }

  if (CITY_PAGES[base]) {
    return {
      slug,
      title: `${CITY_PAGES[base]} Araç Kiralama`,
      description: `${CITY_PAGES[base]} ve çevresinde araç kiralama.`,
      type: "city",
      defaultPickup: CITY_PAGES[base],
    };
  }

  if (base.includes("havalimani") && slug.endsWith("-arac-kiralama")) {
    const title = base
      .replace(/-/g, " ")
      .replace(/\bhavalimani\b/i, "Havalimanı")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      slug,
      title: `${title} Araç Kiralama`,
      description: `${title} için hızlı araç teslimi.`,
      type: "airport",
      defaultPickup: title,
    };
  }

  const service = SERVICE_PAGES[slug] ?? SERVICE_PAGES[base];
  if (service) {
    return {
      slug,
      title: service.title,
      description: service.desc,
      type: "service",
    };
  }

  return null;
}

export function getAllVehicleSlugs(): string[] {
  return catalog.vehicles.map((v) => v.slug);
}

export function getAllSeoSlugs(): string[] {
  const slugs = new Set<string>([
    ...Object.keys(GROUP_PAGES),
    ...Object.keys(SERVICE_PAGES),
    ...catalog.brands.map((b) => `${brandSlug(b)}-arac-kiralama`),
    ...Object.keys(CITY_PAGES).map((c) => `${c}-arac-kiralama`),
    "sabiha-gokcen-havalimani-arac-kiralama",
    "istanbul-3-havalimani-arac-kiralama",
    "antalya-havalimani-arac-kiralama",
    "adnan-menderes-havalimani-arac-kiralama",
    "esenboga-havalimani-arac-kiralama",
  ]);
  return [...slugs];
}

export function vehicleImagePath(image: string): string {
  return image.startsWith("/") ? image : `/${image}`;
}
