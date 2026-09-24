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
  },
  {
    id: "default-air",
    imageUrl: "/assets/promo/havalimani.png",
    href: "/sabiha-gokcen-havalimani-arac-kiralama",
    title: "Havalimanı teslim",
    highlight: "SAW & IGA",
    sub: "Sabiha Gökçen ve İstanbul Havalimanı ofisleri",
    badge: "7/24 teslim",
    sortOrder: 2,
    isActive: true,
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
  },
];

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
};

export function mapPromoRow(row: PromoRow): PromoCover {
  return {
    id: row.id,
    imageUrl: row.image_url,
    href: row.href || "/arac-modelleri",
    title: row.title || "",
    highlight: row.highlight || "",
    sub: row.subtitle || "",
    badge: row.badge || "",
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active !== false,
  };
}

export function isMissingPromoTable(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  const msg = `${error.code || ""} ${error.message || ""}`.toLowerCase();
  return msg.includes("promo_covers") && (msg.includes("does not exist") || msg.includes("42p01") || msg.includes("schema cache"));
}
