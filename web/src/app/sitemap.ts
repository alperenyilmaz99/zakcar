import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/blog";
import { getAllSeoSlugs, getAllVehicleSlugs } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zakcar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "arac-modelleri",
    "arac-gruplari",
    "arac-markalari",
    "rezervasyon",
    "rezervasyon-sorgulama",
    "hakkimizda",
    "iletisim",
    "ofisler",
    "blog",
    "site-haritasi",
    "kiralama-kosullari",
    "gizlilik-politikasi",
    "kisisel-verilerin-korunmasi",
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${BASE}/${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  for (const slug of getAllVehicleSlugs()) {
    entries.push({
      url: `${BASE}/arac/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const slug of getAllBlogSlugs()) {
    entries.push({
      url: `${BASE}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const slug of getAllSeoSlugs()) {
    entries.push({
      url: `${BASE}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
