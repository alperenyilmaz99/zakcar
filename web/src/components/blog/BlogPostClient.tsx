"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { BlogBlock, BlogPost } from "@/lib/blog-types";

function Blocks({ blocks }: { blocks: BlogBlock[] }) {
  const nodes: React.ReactNode[] = [];
  let listBuf: string[] = [];

  const flushList = () => {
    if (listBuf.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="my-4 list-disc space-y-2 ps-5">
        {listBuf.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>,
    );
    listBuf = [];
  };

  for (const block of blocks) {
    if (block.type === "listItem") {
      listBuf.push(block.text);
      continue;
    }
    flushList();
    if (block.type === "heading") {
      const Tag = (`h${Math.min(Math.max(block.level, 2), 4)}` as "h2" | "h3" | "h4");
      const cls =
        Tag === "h2"
          ? "mt-8 font-display text-xl font-bold text-ink sm:text-2xl"
          : Tag === "h3"
            ? "mt-6 font-display text-lg font-semibold text-ink"
            : "mt-4 text-base font-semibold text-ink";
      nodes.push(
        <Tag key={`h-${nodes.length}`} className={cls}>
          {block.text}
        </Tag>,
      );
    } else {
      nodes.push(
        <p key={`p-${nodes.length}`} className="mt-4 leading-relaxed">
          {block.text}
        </p>,
      );
    }
  }
  flushList();
  return <>{nodes}</>;
}

export function BlogPostClient({ post }: { post: BlogPost }) {
  const { t, locale } = usePrefs();
  const [shown, setShown] = useState(post);

  useEffect(() => {
    if (locale === "tr") {
      setShown(post);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/blog/${post.slug}?locale=${locale}`, { cache: "no-store" });
        const data = (await res.json()) as BlogPost;
        if (!cancelled && data && Array.isArray(data.blocks)) setShown(data);
      } catch {
        if (!cancelled) setShown(post);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale, post]);

  return (
    <article className="container-page max-w-3xl py-10 lg:py-14">
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/" className="hover:text-brand">
          {t("nav.home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-brand">
          {t("nav.blog")}
        </Link>
      </nav>

      <h1 className="section-title">{shown.title}</h1>

      {shown.image ? (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={shown.image}
            alt={shown.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="mt-8 text-base text-ink-muted">
        <Blocks blocks={shown.blocks} />
      </div>

      <div className="mt-12 border-t border-surface-border pt-8">
        <Link href="/blog" className="btn-outline">
          {t("home.allPosts")}
        </Link>
      </div>
    </article>
  );
}
