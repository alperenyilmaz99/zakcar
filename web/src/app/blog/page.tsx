import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Araç kiralama rehberi, seyahat ipuçları ve Zakcar blog yazıları.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">Blog</h1>
      <p className="section-sub">Araç kiralama rehberi ve seyahat ipuçları.</p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
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
            {post.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 text-sm font-semibold text-brand transition hover:underline"
            >
              İncele
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
