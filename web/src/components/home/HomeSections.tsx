"use client";

import Link from "next/link";
import { AirportCards } from "@/components/home/AirportCards";
import { PopularSlider } from "@/components/home/PopularSlider";
import { PromoBanners } from "@/components/home/PromoBanners";
import { SegmentSection } from "@/components/home/SegmentSection";
import { HomeFaq } from "@/components/faq/HomeFaq";
import { HomeTail, type HomePost } from "@/components/home/HomeTail";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { Vehicle } from "@/lib/types";

export function HomeSections({
  vehicles,
  brands,
  groupCount,
  posts,
  savedReviews,
  hiddenReviewIds,
}: {
  vehicles: Vehicle[];
  brands: string[];
  groupCount: number;
  posts: HomePost[];
  savedReviews: { id: string; author: string; location: string; body: string }[];
  hiddenReviewIds: string[];
}) {
  const { t } = usePrefs();

  const features = [
    { title: "feat.nocard.title", desc: "feat.nocard.desc", tone: "bg-[#e7f8ef]", icon: "card" },
    { title: "feat.support.title", desc: "feat.support.desc", tone: "bg-[#e8f3fc]", icon: "headset" },
    { title: "feat.price.title", desc: "feat.price.desc", tone: "bg-[#fdeeee]", icon: "shield" },
    { title: "feat.booking.title", desc: "feat.booking.desc", tone: "bg-[#f3eefe]", icon: "calendar" },
  ] as const;

  return (
    <>
      <section className="relative z-10 bg-white py-14 sm:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-[#e8eefc] px-3.5 py-1 text-xs font-semibold tracking-wide text-[#3d5ad6]">
              {t("feat.kicker")}
            </span>
            <h2 className="section-title mt-4">{t("feat.heading")}</h2>
            <p className="section-sub mx-auto">{t("feat.sub")}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((item) => (
              <article key={item.title} className={`flex h-full flex-col items-center rounded-2xl px-6 py-8 text-center shadow-card ${item.tone}`}>
                <FeatureIcon name={item.icon} />
                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(item.desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PopularSlider vehicles={vehicles} />

      <AirportCards />

      <SegmentSection />

      <PromoBanners slot="mid" />

      <HomeFaq />

      <section className="border-t border-surface-border bg-white py-14">
        <div className="container-page text-center">
          <h2 className="section-title">{t("home.brands")}</h2>
          <p className="section-sub mx-auto">{t("home.brandsSub", { brands: brands.length, groups: groupCount })}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {brands.slice(0, 12).map((b) => (
              <Link
                key={b}
                href={`/${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-arac-kiralama`}
                className="rounded-full border border-surface-border bg-surface-soft px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"
              >
                {b}
              </Link>
            ))}
          </div>
          <Link href="/arac-markalari" className="btn-primary mt-8">
            {t("home.allBrands")}
          </Link>
        </div>
      </section>

      <HomeTail posts={posts} savedReviews={savedReviews} hiddenReviewIds={hiddenReviewIds} />
    </>
  );
}

function FeatureIcon({ name }: { name: "card" | "headset" | "shield" | "calendar" }) {
  const common = "h-8 w-8 text-ink";
  if (name === "card") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="2.5" />
        <path d="M3 10h18" strokeLinecap="round" />
        <path d="M7 15h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "headset") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M4 13a8 8 0 0 1 16 0" strokeLinecap="round" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" />
        <path d="M21 16v1.5a3.5 3.5 0 0 1-3.5 3.5H13" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 7.2-7 8.8-4.2-1.6-7-4.6-7-8.8V6.5L12 3.5Z" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M8 3.5v3M16 3.5v3M4 10h16" strokeLinecap="round" />
      <path d="m9 15 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
