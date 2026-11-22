export type FooterService = {
  id: string;
  href: string;
  label: string;
  body: string;
  labelKey: "nav.noCard" | "nav.findeks" | "nav.longTerm" | "nav.corporate" | "";
};

export const DEFAULT_FOOTER_SERVICES: FooterService[] = [
  { id: "noCard", href: "/kredi-kartsiz-arac-kiralama", label: "Kredi Kartsız", body: "", labelKey: "nav.noCard" },
  { id: "findeks", href: "/findeks-sorgusuz-arac-kiralama", label: "Findeks Sorgusuz", body: "", labelKey: "nav.findeks" },
  { id: "longTerm", href: "/uzun-donem-arac-kiralama", label: "Uzun Dönem", body: "", labelKey: "nav.longTerm" },
  { id: "corporate", href: "/kurumsal-arac-kiralama", label: "Kurumsal", body: "", labelKey: "nav.corporate" },
];

export function isFooterService(value: unknown): value is FooterService {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<FooterService>;
  return typeof item.id === "string" && typeof item.href === "string" && typeof item.label === "string";
}
