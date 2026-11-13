import type { MessageKey } from "@/lib/i18n";

export type AirportCard = {
  id: string;
  href: string;
  imageUrl: string;
  title: string;
  text: string;
  detail: string;
  titleKey: MessageKey;
  textKey: MessageKey;
  position: string;
};

export const AIRPORT_CARDS: AirportCard[] = [
  {
    id: "saw",
    href: "/sabiha-gokcen-havalimani-arac-kiralama",
    imageUrl: "/assets/hero/saw.jpg",
    title: "Sabiha Gökçen Havalimanı (SAW)",
    text: "Gece gündüz teslim. Karşılama ve evrak birkaç dakika sürer.",
    detail: "",
    titleKey: "home.airportSawTitle",
    textKey: "home.airportSawText",
    position: "",
  },
  {
    id: "iga",
    href: "/istanbul-3-havalimani-arac-kiralama",
    imageUrl: "/assets/hero/iga.jpg",
    title: "İstanbul Havalimanı (IGA)",
    text: "Aracınız sizi bekler. Teslim ücretsizdir, ödeme araç başında yapılır.",
    detail: "",
    titleKey: "home.airportIgaTitle",
    textKey: "home.airportIgaText",
    position: "",
  },
  {
    id: "saw-card",
    href: "/sabiha-gokcen-havalimani-kredi-kartsiz-arac-kiralama",
    imageUrl: "/assets/hero/saw.jpg",
    title: "Sabiha Gökçen Havalimanı Kredi Kartsız Araç Kiralama",
    text: "Kredi kartı ve Findeks yok. Ödeme teslimde nakit veya banka kartıyla yapılır.",
    detail: "",
    titleKey: "home.airportSawCardTitle",
    textKey: "home.airportSawCardText",
    position: "object-left",
  },
  {
    id: "iga-card",
    href: "/iga-havalimani-kredi-kartsiz-arac-kiralama",
    imageUrl: "/assets/hero/iga.jpg",
    title: "IGA Havalimanı Kredi Kartsız Araç Kiralama",
    text: "Kart limiti bloke edilmez. Ödeme araç başında, teslim ücretsizdir.",
    detail: "",
    titleKey: "home.airportIgaCardTitle",
    textKey: "home.airportIgaCardText",
    position: "object-right",
  },
];

export type AirportCardRow = {
  id: string;
  image_url?: string | null;
  title?: string | null;
  summary?: string | null;
  detail?: string | null;
  href?: string | null;
};

export function mergeAirportCards(saved: AirportCardRow[]): AirportCard[] {
  return AIRPORT_CARDS.map((base) => {
    const row = saved.find((item) => item.id === base.id);
    if (!row) return base;
    return {
      ...base,
      imageUrl: row.image_url?.trim() || base.imageUrl,
      title: row.title?.trim() || base.title,
      text: row.summary?.trim() || base.text,
      detail: row.detail?.trim() || "",
    };
  });
}

const STOCK_TITLES: Record<string, readonly string[]> = {
  saw: ["Sabiha Gökçen Havalimanı", "Sabiha Gökçen Havalimanı (SAW)"],
  iga: ["İstanbul Havalimanı", "İstanbul Havalimanı (IGA)"],
};

export function isStockAirportTitle(id: string, title: string): boolean {
  return (STOCK_TITLES[id] ?? []).includes(title.trim());
}

export function airportCardCopy(
  card: AirportCard,
  translate: (key: MessageKey) => string,
): { title: string; text: string } {
  const base = AIRPORT_CARDS.find((item) => item.id === card.id);
  return {
    title: base && isStockAirportTitle(card.id, card.title) ? translate(card.titleKey) : card.title,
    text: base && card.text === base.text ? translate(card.textKey) : card.text,
  };
}
