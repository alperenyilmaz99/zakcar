const SAW_SLUGS = new Set([
  "sabiha-gokcen-havalimani-arac-kiralama",
  "sabiha-gokcen-havalimani-kredi-kartsiz-arac-kiralama",
]);
const IGA_SLUGS = new Set([
  "istanbul-3-havalimani-arac-kiralama",
  "iga-havalimani-kredi-kartsiz-arac-kiralama",
]);

export type AirportId = "saw" | "iga";

export function airportArticleId(slug: string): AirportId | null {
  if (SAW_SLUGS.has(slug)) return "saw";
  if (IGA_SLUGS.has(slug)) return "iga";
  return null;
}

/** Turkish title for search engines. The visible heading follows the selected language. */
export function airportArticleTitle(slug: string): string | null {
  if (slug === "sabiha-gokcen-havalimani-kredi-kartsiz-arac-kiralama") {
    return "Sabiha Gökçen Havalimanı Kredi Kartsız Araç Kiralama";
  }
  if (slug === "iga-havalimani-kredi-kartsiz-arac-kiralama") {
    return "IGA Havalimanı Kredi Kartsız Araç Kiralama";
  }
  if (SAW_SLUGS.has(slug)) return "Sabiha Gökçen'de Kredi Kartsız Araç Kiralama";
  if (IGA_SLUGS.has(slug)) return "İstanbul Havalimanı'nda Kredi Kartsız Araç Kiralama";
  return null;
}
