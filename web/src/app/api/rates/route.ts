import { NextResponse } from "next/server";
import { FALLBACK_TRY_PER, ratesFromUnknown, type TryPer } from "@/lib/exchange-rates";

export const dynamic = "force-dynamic";

const SOURCE = "https://www.google.com/finance/quote/EUR-TRY";
const FRESH_MS = 30 * 60 * 1000;

let cached: { rates: TryPer; at: number } | null = null;

function parseGoogle(html: string): TryPer | null {
  const found: Partial<TryPer> = {};
  for (const match of html.matchAll(/"([A-Z]{3}) \/ TRY",\d+,null,\[([0-9.]+)/g)) {
    const code = match[1];
    if ((code === "EUR" || code === "USD" || code === "GBP") && found[code] == null) {
      const value = Number(match[2]);
      if (Number.isFinite(value)) found[code] = value;
    }
  }
  return ratesFromUnknown({ TRY: 1, EUR: found.EUR, USD: found.USD, GBP: found.GBP });
}

async function loadRates(): Promise<{ rates: TryPer; source: "google" | "fallback" }> {
  if (cached && Date.now() - cached.at < FRESH_MS) {
    return { rates: cached.rates, source: "google" };
  }
  try {
    const res = await fetch(SOURCE, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const rates = parseGoogle(await res.text());
    if (!rates) throw new Error("parse");
    cached = { rates, at: Date.now() };
    return { rates, source: "google" };
  } catch {
    if (cached) return { rates: cached.rates, source: "google" };
    return { rates: FALLBACK_TRY_PER, source: "fallback" };
  }
}

export async function GET() {
  const loaded = await loadRates();
  return NextResponse.json(
    { ...loaded.rates, source: loaded.source },
    { headers: { "Cache-Control": "public, max-age=900" } },
  );
}
