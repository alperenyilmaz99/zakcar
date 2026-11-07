import { createClient } from "@supabase/supabase-js";
import { mergeAirportCards, type AirportCard, type AirportCardRow } from "@/lib/airport-cards";
import { readAirportFile } from "@/lib/airport-file-store";

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function missingTable(error: { message?: string; code?: string } | null): boolean {
  const text = `${error?.message || ""} ${error?.code || ""}`.toLowerCase();
  return text.includes("airport_cards") || text.includes("42p01") || text.includes("schema cache");
}

export async function loadAirportCards(): Promise<{ items: AirportCard[]; source: "supabase" | "file" }> {
  const supabase = anonClient();
  if (supabase) {
    const { data, error } = await supabase.from("airport_cards").select("*").order("sort_order", { ascending: true });
    if (!error) {
      return { items: mergeAirportCards((data as AirportCardRow[]) || []), source: "supabase" };
    }
    if (!missingTable(error)) {
      return { items: readAirportFile(), source: "file" };
    }
  }
  return { items: readAirportFile(), source: "file" };
}
