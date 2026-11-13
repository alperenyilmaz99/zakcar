export const SERVICE_SLUGS = [
  "kredi-kartsiz-arac-kiralama",
  "findeks-sorgusuz-arac-kiralama",
  "uzun-donem-arac-kiralama",
  "kurumsal-arac-kiralama",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isServiceArticle(slug: string): slug is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(slug);
}
