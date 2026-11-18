export type RateCode = "TRY" | "EUR" | "USD" | "GBP";
export type TryPer = Record<RateCode, number>;

/** Google Finance okunamazsa kullanılan son bilinen kur. 1 birim döviz = kaç TL. */
export const FALLBACK_TRY_PER: TryPer = {
  TRY: 1,
  EUR: 55.4,
  USD: 50.44,
  GBP: 66.32,
};

let current: TryPer = FALLBACK_TRY_PER;

export function getTryPer(): TryPer {
  return current;
}

export function setTryPer(next: TryPer) {
  current = next;
}

const BOUNDS: Record<Exclude<RateCode, "TRY">, [number, number]> = {
  EUR: [20, 200],
  USD: [20, 200],
  GBP: [20, 250],
};

export function ratesFromUnknown(input: Partial<TryPer> | null | undefined): TryPer | null {
  if (!input) return null;
  const next = { ...FALLBACK_TRY_PER };
  for (const code of ["EUR", "USD", "GBP"] as const) {
    const value = Number(input[code]);
    const [min, max] = BOUNDS[code];
    if (!Number.isFinite(value) || value < min || value > max) return null;
    next[code] = value;
  }
  next.TRY = 1;
  return next;
}
