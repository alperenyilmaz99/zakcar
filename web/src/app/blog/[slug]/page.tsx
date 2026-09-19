import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import type { BlogBlock } from "@/lib/blog-types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}

function Blocks({ blocks }: { blocks: BlogBlock[] }) {
  const nodes: React.ReactNode[] = [];
  let listBuf: string[] = [];

  const flushList = () => {
    if (listBuf.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="my-4 list-disc space-y-2 pl-5">
        {listBuf.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
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
        </Tag>
      );
    } else {
      nodes.push(
        <p key={`p-${nodes.length}`} className="mt-4 leading-relaxed">
          {block.text}
        </p>
      );
    }
  }
  flushList();
  return <>{nodes}</>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="container-page max-w-3xl py-10 lg:py-14">
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/" className="hover:text-brand">
          Anasayfa
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-brand">
          Blog
        </Link>
      </nav>

      <h1 className="section-title">{post.title}</h1>

      {post.image && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div className="mt-8 text-base text-ink-muted">
        <Blocks blocks={post.blocks} />
      </div>

      <div className="mt-12 border-t border-surface-border pt-8">
        <Link href="/blog" className="btn-outline">
          Tüm Yazılar
        </Link>
      </div>
    </article>
  );
}
