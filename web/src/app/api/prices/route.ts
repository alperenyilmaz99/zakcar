import { NextResponse } from "next/server";
import { fetchModelPrices } from "@/lib/model-prices";

export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await fetchModelPrices();
  return NextResponse.json(prices);
}
