import type { SupabaseClient } from "@supabase/supabase-js";
import { DISTRICTS, type District, type DistrictSide } from "@/lib/districts";
import { readExtraDistricts, writeExtraDistricts } from "@/lib/district-file-store";
import { getAllSeoSlugs, getAllVehicleSlugs } from "@/lib/data";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

type DistrictRow = {
  slug: string;
  name: string;
  side: DistrictSide;
  pickup: "saw" | "iga";
  area: string;
  around: string;
  drive: string;
};

export type DistrictInput = {
  name: string;
  side: DistrictSide;
  pickup: "saw" | "iga";
  area?: string;
  around?: string;
  drive?: string;
};

function missingTable(error: { message?: string; code?: string } | null): boolean {
  const text = `${error?.message || ""} ${error?.code || ""}`.toLowerCase();
  return text.includes("site_districts") || text.includes("42p01") || text.includes("pgrst205") || text.includes("schema cache");
}

function mapRow(row: DistrictRow): District {
  return {
    slug: row.slug,
    name: row.name,
    side: row.side,
    pickup: row.pickup,
    area: row.area,
    around: row.around,
    drive: row.drive,
  };
}

export function mergeDistricts(extras: District[]): District[] {
  const seen = new Set(DISTRICTS.map((item) => item.slug));
  return [...DISTRICTS, ...extras.filter((item) => item.slug && !seen.has(item.slug))];
}

export function slugForDistrict(name: string): string {
  const letters: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    â: "a",
    î: "i",
    û: "u",
  };
  const ascii = name
    .trim()
    .toLocaleLowerCase("tr")
    .split("")
    .map((char) => letters[char] ?? char)
    .join("");
  const base = ascii.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base}-arac-kiralama`;
}

export function districtCopy(name: string, side: DistrictSide, pickup: "saw" | "iga"): Pick<District, "area" | "around" | "drive"> {
  const shore = side === "anadolu" ? "Anadolu" : "Avrupa";
  const airport = pickup === "saw" ? "Sabiha Gökçen" : "İstanbul Havalimanı";
  return {
    area: `${name}, İstanbul’un ${shore} yakasında araç bıraktığımız semtlerdendir.`,
    around: `${name} için alış noktası ${airport} ofisidir. Havalimanı teslimi ücretsizdir ve ofis 7/24 açıktır.`,
    drive: `${name} içinde cadde kenarında uzun süre yer aramak teslim saatini uzatabilir. Aracı otoparka bırakmak daha rahattır. HGS araçtadır; geçiş ücreti kiralama sonunda yansır.`,
  };
}

async function readSupabaseExtras(client: SupabaseClient): Promise<District[] | null> {
  const { data, error } = await client.from("site_districts").select("slug,name,side,pickup,area,around,drive").order("name");
  if (error) {
    if (missingTable(error)) return null;
    throw error;
  }
  return ((data || []) as DistrictRow[]).map(mapRow);
}

export async function loadDistricts(): Promise<{ items: District[]; source: "supabase" | "file" }> {
  if (hasServerSupabase()) {
    try {
      const extras = await readSupabaseExtras(createServerSupabase());
      if (extras) return { items: mergeDistricts(extras), source: "supabase" };
    } catch {
      /* dosyadaki listeye düş */
    }
  }
  return { items: mergeDistricts(readExtraDistricts()), source: "file" };
}

export async function addDistrict(
  input: DistrictInput,
  writer: SupabaseClient | null,
): Promise<{ district: District; source: "supabase" | "file" }> {
  const name = input.name.trim().replace(/\s+/g, " ");
  if (name.length < 2) throw new Error("Semt adını yazın.");
  if (input.side !== "avrupa" && input.side !== "anadolu") throw new Error("Yakayı seçin.");
  if (input.pickup !== "saw" && input.pickup !== "iga") throw new Error("Teslim noktasını seçin.");
  const slug = slugForDistrict(name);
  if (!slug || slug === "-arac-kiralama") throw new Error("Semt adından sayfa adresi çıkarılamadı.");
  const { items } = await loadDistricts();
  const taken = new Set([...getAllSeoSlugs(), ...getAllVehicleSlugs(), ...items.map((item) => item.slug)]);
  if (taken.has(slug) || items.some((item) => item.name.toLocaleLowerCase("tr") === name.toLocaleLowerCase("tr"))) {
    throw new Error("Bu semt zaten listede.");
  }
  const copy = districtCopy(name, input.side, input.pickup);
  const district: District = {
    slug,
    name,
    side: input.side,
    pickup: input.pickup,
    area: input.area?.trim() || copy.area,
    around: input.around?.trim() || copy.around,
    drive: input.drive?.trim() || copy.drive,
  };

  if (writer) {
    const { error } = await writer.from("site_districts").insert(district);
    if (!error) return { district, source: "supabase" };
    if (!missingTable(error)) throw new Error(error.message);
  }

  writeExtraDistricts([...readExtraDistricts().filter((item) => item.slug !== slug), district]);
  return { district, source: "file" };
}

export async function removeDistrict(slug: string, writer: SupabaseClient | null): Promise<"supabase" | "file"> {
  if (DISTRICTS.some((item) => item.slug === slug)) {
    throw new Error("Hazır semtler silinemez.");
  }
  if (writer) {
    const { error } = await writer.from("site_districts").delete().eq("slug", slug);
    if (!error) return "supabase";
    if (!missingTable(error)) throw new Error(error.message);
  }
  writeExtraDistricts(readExtraDistricts().filter((item) => item.slug !== slug));
  return "file";
}
