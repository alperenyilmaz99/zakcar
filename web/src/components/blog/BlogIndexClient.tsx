"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { BlogPost } from "@/lib/blog-types";

type Card = Pick<BlogPost, "slug" | "title" | "excerpt" | "image">;

export function BlogIndexClient({ posts }: { posts: Card[] }) {
  const { t, locale } = usePrefs();
  const [shown, setShown] = useState(posts);

  useEffect(() => {
    if (locale === "tr") {
      setShown(posts);
      return;
    }
    let cancelled = false;
    const slugs = posts.map((post) => post.slug).join(",");
    (async () => {
      try {
        const res = await fetch(`/api/blog?locale=${locale}&slugs=${encodeURIComponent(slugs)}`, { cache: "no-store" });
        const data = (await res.json()) as Card[];
        if (!cancelled && Array.isArray(data) && data.length > 0) setShown(data);
      } catch {
        if (!cancelled) setShown(posts);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale, posts]);

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">{t("nav.blog")}</h1>
      <p className="section-sub">{t("home.blogSub")}</p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => (
          <article key={post.slug} className="group flex flex-col">
            <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl bg-surface-soft">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand/15 to-surface-border text-sm font-medium text-ink-muted">
                    Zakcar Blog
                  </div>
                )}
              </div>
            </Link>
            <h2 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">
              <Link href={`/blog/${post.slug}`} className="transition hover:text-brand">
                {post.title}
              </Link>
            </h2>
            {post.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p> : null}
            <Link href={`/blog/${post.slug}`} className="mt-3 text-sm font-semibold text-brand transition hover:underline">
              {t("blog.read")}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
