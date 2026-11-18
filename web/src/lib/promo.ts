import type { MessageKey } from "@/lib/i18n";

const PROMO_COPY: Record<string, { title: MessageKey; highlight: MessageKey; sub: MessageKey; badge: MessageKey }> = {
  first: {
    title: "promo.first.title",
    highlight: "promo.first.highlight",
    sub: "promo.first.sub",
    badge: "promo.first.badge",
  },
  card: {
    title: "promo.card.title",
    highlight: "promo.card.highlight",
    sub: "promo.card.sub",
    badge: "promo.card.badge",
  },
  air: {
    title: "promo.air.title",
    highlight: "promo.air.highlight",
    sub: "promo.air.sub",
    badge: "promo.air.badge",
  },
  suv: {
    title: "promo.suv.title",
    highlight: "promo.suv.highlight",
    sub: "promo.suv.sub",
    badge: "promo.suv.badge",
  },
};

const PROMO_STEM: Record<string, keyof typeof PROMO_COPY> = {
  "default-ilk": "first",
  "default-card": "card",
  "default-air": "air",
  "default-suv": "suv",
  "İlk araç kiralamanızda": "first",
  "Kredi kartı olmadan": "card",
  "Havalimanı teslim": "air",
  "SUV ve 4x4": "suv",
};

export function localizedPromo(promo: PromoCover, t: (key: MessageKey) => string): PromoCover {
  const stem = PROMO_STEM[promo.id] || PROMO_STEM[promo.title.trim()];
  const copy = stem ? PROMO_COPY[stem] : undefined;
  if (!copy) return promo;
  return {
    ...promo,
    title: t(copy.title),
    highlight: t(copy.highlight),
    sub: t(copy.sub),
    badge: t(copy.badge),
  };
}

export type PromoSlot = "hero" | "mid" | "campaigns" | "backdrop";

export const HERO_BACKDROP = "/assets/zakcar/hero-bg.jpg";

export function normalizePromoSlot(value: unknown): PromoSlot {
  if (value === "mid" || value === "campaigns" || value === "backdrop") return value;
  return "hero";
}

export type PromoCover = {
  id: string;
  imageUrl: string;
  href: string;
  title: string;
  highlight: string;
  sub: string;
  badge: string;
  sortOrder: number;
  isActive: boolean;
  slot: PromoSlot;
};

export const DEFAULT_PROMOS: PromoCover[] = [
  {
    id: "default-ilk",
    imageUrl: "/assets/promo/ilk-kiralama.png",
    href: "/ekonomik-arac-kiralama",
    title: "İlk araç kiralamanızda",
    highlight: "%10 indirim",
    sub: "Standart ve SUV grubundaki tüm araçlarda geçerli",
    badge: "İlk kiralamaya özel",
    sortOrder: 0,
    isActive: true,
    slot: "hero",
  },
  {
    id: "default-card",
    imageUrl: "/assets/promo/kredi-kartsiz.png",
    href: "/kredi-kartsiz-arac-kiralama",
    title: "Kredi kartı olmadan",
    highlight: "kiralayın",
    sub: "Nakit ve banka kartı ile rezervasyon imkânı",
    badge: "Kredi kartsız",
    sortOrder: 1,
    isActive: true,
    slot: "hero",
  },
  {
    id: "default-air",
    imageUrl: "/assets/promo/havalimani.png",
    href: "/sabiha-gokcen-havalimani-arac-kiralama",
    title: "Havalimanı teslim",
    highlight: "SAW & IST",
    sub: "Sabiha Gökçen ve İstanbul Havalimanı ofisleri",
    badge: "7/24 teslim",
    sortOrder: 2,
    isActive: true,
    slot: "hero",
  },
  {
    id: "default-suv",
    imageUrl: "/assets/promo/suv.png",
    href: "/4x4-suv-arac-kiralama",
    title: "SUV ve 4x4",
    highlight: "geniş filo",
    sub: "Uzun yol ve aile seyahatleri için güçlü seçenekler",
    badge: "SUV & arazi",
    sortOrder: 3,
    isActive: true,
    slot: "hero",
  },
];

export function defaultPromos(slot: PromoSlot): PromoCover[] {
  return DEFAULT_PROMOS.map((item, index) => ({
    ...item,
    id: slot === "hero" ? item.id : `${item.id}-${slot}`,
    slot,
    sortOrder: index,
  }));
}

export type PromoRow = {
  id: string;
  image_url: string;
  href: string;
  title: string;
  highlight: string;
  subtitle: string;
  badge: string;
  sort_order: number;
  is_active: boolean;
  slot?: string | null;
};

export function mapPromoRow(row: PromoRow): PromoCover {
  return {
    id: row.id,
    imageUrl: row.image_url,
    href: row.href || "/arac-modelleri",
    title: (row.title || "").replaceAll("IGA", "IST"),
    highlight: (row.highlight || "").replaceAll("IGA", "IST"),
    sub: (row.subtitle || "").replaceAll("IGA", "IST"),
    badge: (row.badge || "").replaceAll("IGA", "IST"),
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active !== false,
    slot: normalizePromoSlot(row.slot),
  };
}

export function isMissingPromoTable(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  const msg = `${error.code || ""} ${error.message || ""}`.toLowerCase();
  return msg.includes("promo_covers") && (msg.includes("does not exist") || msg.includes("42p01") || msg.includes("schema cache"));
}
