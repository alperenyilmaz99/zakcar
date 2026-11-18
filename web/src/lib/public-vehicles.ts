import { getVehicles } from "@/lib/data";
import { formatTryAmount } from "@/lib/format";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";
import { ELITCAR_ORDER, GROUP_RANK } from "@/lib/sort-order";
import type { Vehicle } from "@/lib/types";

type ModelRow = {
  slug: string;
  name: string | null;
  brand: string | null;
  brand_slug: string | null;
  vehicle_group: string | null;
  fuel: string | null;
  transmission: string | null;
  capacity: string | null;
  daily_price_try: number | null;
  deposit_try: number | null;
  image_url: string | null;
  banner_url: string | null;
  summary: string | null;
};

function sortVehicles(list: Vehicle[]): Vehicle[] {
  const rank = new Map(ELITCAR_ORDER.map((slug, index) => [slug, index]));
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

function toVehicle(row: ModelRow, stock?: Vehicle): Vehicle {
  const rawName = (row.name || "").trim() || stock?.name || row.slug;
  const name = /araç kiralama/i.test(rawName) ? rawName : `${rawName} Araç Kiralama`;
  return {
    slug: row.slug,
    name,
    summary: (row.summary || "").trim() || stock?.summary || "",
    route: stock?.route || `${row.slug}-arac-kiralama.html`,
    brand: (row.brand || "").trim() || stock?.brand || "",
    brandSlug: (row.brand_slug || "").trim() || stock?.brandSlug || "",
    fuel: (row.fuel || "").trim() || stock?.fuel || "Benzin",
    transmission: (row.transmission || "").trim() || stock?.transmission || "Manuel",
    capacity: (row.capacity || "").trim() || stock?.capacity || "5",
    group: (row.vehicle_group || "").trim() || stock?.group || "Ekonomik",
    price: formatTryAmount(Number(row.daily_price_try ?? 0)),
    image: (row.image_url || "").trim() || stock?.image || "",
    banner: (row.banner_url || "").trim() || stock?.banner || "",
    deposit: formatTryAmount(Number(row.deposit_try ?? 0)),
  };
}

export async function loadPublicVehicles(): Promise<Vehicle[]> {
  const stock = new Map(getVehicles().map((vehicle) => [vehicle.slug, vehicle]));
  if (!hasServerSupabase()) return getVehicles();
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("vehicle_models")
      .select("slug,name,brand,brand_slug,vehicle_group,fuel,transmission,capacity,daily_price_try,deposit_try,image_url,banner_url,summary")
      .eq("is_active", true);
    if (error || !data) return getVehicles();
    return sortVehicles((data as ModelRow[]).filter((row) => row.slug).map((row) => toVehicle(row, stock.get(row.slug))));
  } catch {
    return getVehicles();
  }
}

export function findPublicVehicle(vehicles: Vehicle[], slug: string): Vehicle | undefined {
  const normalized = slug.replace(/-arac-kiralama$/, "");
  return vehicles.find((vehicle) => vehicle.slug === normalized || vehicle.slug === slug);
}

export function filterPublicVehicles(
  vehicles: Vehicle[],
  opts: { group?: string; brand?: string; brandSlug?: string },
): Vehicle[] {
  return vehicles.filter((vehicle) => {
    if (opts.group && vehicle.group !== opts.group) return false;
    if (opts.brand && vehicle.brand !== opts.brand) return false;
    if (opts.brandSlug && vehicle.brandSlug !== opts.brandSlug) return false;
    return true;
  });
}
