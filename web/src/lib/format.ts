import { getTryPer } from "@/lib/exchange-rates";

/** "€25,00" → "925 TL" */
export function euroToTry(price: string): string {
  const match = price.match(/([\d.,]+)/);
  if (!match) return price.replace(/€/g, "₺").replace(/EUR/gi, "TL");
  const num = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (Number.isNaN(num)) return price;
  const tl = Math.round(num * getTryPer().EUR);
  return `${tl.toLocaleString("tr-TR")} TL`;
}

export function formatTryAmount(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${safe.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`;
}

/** Araç fiyatını gösterim için formatla (zaten TL ise olduğu gibi) */
export function formatPrice(price: string): string {
  if (/€/.test(price) || /EUR/i.test(price)) return euroToTry(price);
  if (/TL|₺/i.test(price)) return price;
  return `${price} TL`;
}
