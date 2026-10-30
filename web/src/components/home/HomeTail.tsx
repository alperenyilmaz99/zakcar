"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { DEFAULT_PROMOS, type PromoCover } from "@/lib/promo";

export type HomePost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
};

export function HomeTail({ posts }: { posts: HomePost[] }) {
  const { t } = usePrefs();
  const [promos, setPromos] = useState<PromoCover[]>(DEFAULT_PROMOS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/promos", { cache: "no-store" });
        const data = (await res.json()) as PromoCover[];
        if (!cancelled && Array.isArray(data)) {
          const active = data.filter((item) => item.isActive !== false && item.imageUrl);
          if (active.length) setPromos(active);
        }
      } catch {
        if (!cancelled) setPromos(DEFAULT_PROMOS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="border-t border-surface-border bg-white py-14">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">{t("nav.campaigns")}</h2>
              <p className="section-sub">{t("kamp.sub")}</p>
            </div>
            <Link href="/kampanyalar" className="btn-outline">
              {t("home.allCampaigns")}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {promos.slice(0, 4).map((promo) => (
              <article key={promo.id} className="card group overflow-hidden">
                <Link href={promo.href || "/kampanyalar"} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-soft">
                    <Image
                      src={promo.imageUrl}
                      alt={promo.title || t("kamp.title")}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    {promo.badge ? (
                      <span className="absolute start-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                        {promo.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold leading-snug text-ink">
                      {promo.title}
                      {promo.highlight ? <span className="text-brand"> {promo.highlight}</span> : null}
                    </h3>
                    {promo.sub ? <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{promo.sub}</p> : null}
                    <span className="mt-4 inline-block text-sm font-semibold text-brand">{t("kamp.cta")}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-soft py-14">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">{t("nav.blog")}</h2>
              <p className="section-sub">{t("home.blogSub")}</p>
            </div>
            <Link href="/blog" className="btn-outline">
              {t("home.allPosts")}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="card group flex flex-col overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-soft">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold leading-snug text-ink">{post.title}</h3>
                    {post.excerpt ? (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                    ) : null}
                    <span className="mt-4 text-sm font-semibold text-brand">{t("home.explore")}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
