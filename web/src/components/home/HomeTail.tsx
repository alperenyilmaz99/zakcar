"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { HOME_REVIEW_CARDS } from "@/lib/home-reviews";
import { defaultPromos, localizedPromo, type PromoCover } from "@/lib/promo";

export type HomePost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
};

export function HomeTail({
  posts,
  savedReviews,
  hiddenReviewIds,
}: {
  posts: HomePost[];
  savedReviews: { id: string; author: string; location: string; body: string }[];
  hiddenReviewIds: string[];
}) {
  const { t, locale } = usePrefs();
  const [promos, setPromos] = useState<PromoCover[]>(() => defaultPromos("campaigns"));
  const [shownPosts, setShownPosts] = useState(posts);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/promos?slot=campaigns", { cache: "no-store" });
        const data = (await res.json()) as PromoCover[];
        if (!cancelled && Array.isArray(data)) {
          const active = data.filter((item) => item.isActive !== false && item.imageUrl);
          setPromos(active.length ? active : defaultPromos("campaigns"));
        }
      } catch {
        if (!cancelled) setPromos(defaultPromos("campaigns"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (locale === "tr") {
      setShownPosts(posts);
      return;
    }
    let cancelled = false;
    const slugs = posts.map((post) => post.slug).join(",");
    (async () => {
      try {
        const res = await fetch(`/api/blog?locale=${locale}&slugs=${encodeURIComponent(slugs)}`, { cache: "no-store" });
        const data = (await res.json()) as HomePost[];
        if (!cancelled && Array.isArray(data) && data.length > 0) setShownPosts(data);
      } catch {
        if (!cancelled) setShownPosts(posts);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale, posts]);

  return (
    <>
      <section className="bg-[#121926] py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-wide text-brand">{t("home.reviewsKicker")}</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("home.reviews")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#9aa4b2]">{t("home.reviewsSub")}</p>
          </div>
          <ReviewMarquee
            items={[
              ...savedReviews.map((review) => ({
                id: review.id,
                title: t("home.reviewCard"),
                body: review.body,
                author: review.author,
                place: review.location,
              })),
              ...HOME_REVIEW_CARDS.filter((review) => !hiddenReviewIds.includes(review.id)).map((review) => {
                const copy = review.copy[locale];
                return {
                  id: review.id,
                  title: copy.title,
                  body: copy.body,
                  author: review.author,
                  place: copy.place,
                  masked: true,
                };
              }),
            ]}
          />
        </div>
      </section>

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
            {promos.slice(0, 4).map((item) => {
              const promo = localizedPromo(item, t);
              return (
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
              );
            })}
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
            {shownPosts.map((post) => (
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

function ReviewMarquee({
  items,
}: {
  items: { id: string; title: string; body: string; author: string; place: string; masked?: boolean }[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0 });
  const over = useRef(false);
  const paused = useRef(false);
  const resumeAt = useRef(0);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || items.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = performance.now();
    let resumeTimer = 0;

    const wrap = () => {
      const half = node.scrollWidth / 2;
      if (half < 2) return;
      if (node.scrollLeft >= half) node.scrollLeft -= half;
      else if (node.scrollLeft < 0) node.scrollLeft += half;
    };

    const tick = (now: number) => {
      const dt = Math.min(34, now - last);
      last = now;
      const half = node.scrollWidth / 2;
      if (!reduce && !paused.current && now >= resumeAt.current && half > 1) {
        node.scrollLeft += (half / 42000) * dt;
      }
      wrap();
      frame = window.requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      paused.current = true;
      node.scrollLeft += event.deltaX;
      wrap();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        if (over.current || drag.current.active) return;
        paused.current = false;
        resumeAt.current = performance.now() + 700;
      }, 80);
    };

    frame = window.requestAnimationFrame(tick);
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      node.removeEventListener("wheel", onWheel);
    };
  }, [items.length]);

  if (items.length === 0) return null;
  const loop = items.length === 1 ? [...items, ...items, ...items, ...items] : items;

  const hold = () => {
    paused.current = true;
    resumeAt.current = Number.POSITIVE_INFINITY;
  };

  const release = () => {
    paused.current = false;
    resumeAt.current = performance.now() + 900;
  };

  return (
    <div
      ref={scrollerRef}
      className="review-marquee relative mt-10"
      onPointerEnter={() => {
        over.current = true;
        hold();
      }}
      onPointerLeave={() => {
        over.current = false;
        if (!drag.current.active) release();
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        const node = scrollerRef.current;
        if (!node) return;
        drag.current = { active: true, x: event.clientX };
        hold();
        node.setPointerCapture(event.pointerId);
        node.classList.add("is-dragging");
      }}
      onPointerMove={(event) => {
        const node = scrollerRef.current;
        if (!node || !drag.current.active) return;
        node.scrollLeft -= event.clientX - drag.current.x;
        drag.current.x = event.clientX;
      }}
      onPointerUp={(event) => {
        const node = scrollerRef.current;
        drag.current.active = false;
        node?.classList.remove("is-dragging");
        if (node?.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
        if (over.current) hold();
        else release();
      }}
      onPointerCancel={() => {
        drag.current.active = false;
        scrollerRef.current?.classList.remove("is-dragging");
        release();
      }}
    >
      <div className="flex w-max items-stretch">
        {[0, 1].map((copy) =>
          loop.map((review, index) => (
            <div key={`${copy}-${review.id}-${index}`} className="flex w-[min(78vw,22rem)] shrink-0 pe-4" aria-hidden={copy === 1}>
              <ReviewCard title={review.title} body={review.body} author={review.author} place={review.place} masked={review.masked} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  body,
  author,
  place,
  masked,
}: {
  title: string;
  body: string;
  author: string;
  place: string;
  masked?: boolean;
}) {
  const initials = author
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2);
  return (
    <article className="flex h-full flex-col rounded-xl bg-white/[0.04] p-8">
      <h3 className="mb-3 text-sm font-normal uppercase tracking-[1px] text-[#697586]">{title}</h3>
      <p className="flex-1 text-base leading-6 tracking-tight text-[#e3e8ef]">{body}</p>
      <div className="mt-12 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
          {initials}
        </span>
        <div>
          <p className="text-lg font-medium leading-none text-white">
            {author}
            {masked ? <span className="ms-0.5 tracking-tight text-[#9aa4b2]">●●●●</span> : null}
          </p>
          <p className="mt-1 text-sm text-[#697586]">{place}</p>
        </div>
      </div>
    </article>
  );
}
