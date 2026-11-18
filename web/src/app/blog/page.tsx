import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getPublishedBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Araç kiralama rehberi, seyahat ipuçları ve Zakcar blog yazıları.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return <BlogIndexClient posts={posts.map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, image: post.image }))} />;
}
