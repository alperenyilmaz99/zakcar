import type { Vehicle } from "@/lib/types";
import { formatTryAmount } from "@/lib/format";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

export type ModelPrice = { daily: number; deposit: number };

type PriceRow = {
  slug: string;
  daily_price_try: number | null;
  deposit_try: number | null;
};

export async function fetchModelPrices(): Promise<Record<string, ModelPrice>> {
  if (!hasServerSupabase()) return {};
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("vehicle_models")
      .select("slug,daily_price_try,deposit_try")
      .eq("is_active", true);
    if (error || !data) return {};
    const prices: Record<string, ModelPrice> = {};
    for (const row of data as PriceRow[]) {
      prices[row.slug] = {
        daily: Number(row.daily_price_try ?? 0),
        deposit: Number(row.deposit_try ?? 0),
      };
    }
    return prices;
  } catch {
    return {};
  }
}

export async function withLivePrices(vehicles: Vehicle[]): Promise<Vehicle[]> {
  const prices = await fetchModelPrices();
  if (!Object.keys(prices).length) return vehicles;
  return vehicles.map((vehicle) => {
    const price = prices[vehicle.slug];
    if (!price) return vehicle;
    return {
      ...vehicle,
      price: formatTryAmount(price.daily),
      deposit: formatTryAmount(price.deposit),
    };
  });
}
