/** EUR → TRY (yaklaşık kur, günlük kiralama fiyatları için) */
const EUR_TO_TRY = 37;

/** "€25,00" → "925 TL" */
export function euroToTry(price: string): string {
  const match = price.match(/([\d.,]+)/);
  if (!match) return price.replace(/€/g, "₺").replace(/EUR/gi, "TL");
  const num = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (Number.isNaN(num)) return price;
  const tl = Math.round(num * EUR_TO_TRY);
  return `${tl.toLocaleString("tr-TR")} TL`;
}

/** Araç fiyatını gösterim için formatla (zaten TL ise olduğu gibi) */
export function formatPrice(price: string): string {
  if (/€/.test(price) || /EUR/i.test(price)) return euroToTry(price);
  if (/TL|₺/i.test(price)) return price;
  return `${price} TL`;
}
