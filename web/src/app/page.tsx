import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { getPublishedBlogPosts } from "@/lib/blog";
import { listReviews } from "@/lib/generated-content";
import { getBrands, getGroups, getVehicles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vehicles = getVehicles().slice(0, 12);
  const groups = getGroups();
  const brands = getBrands();
  const [published, reviews] = await Promise.all([getPublishedBlogPosts(), listReviews()]);
  const posts = published
    .slice(0, 3)
    .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, image: post.image }));

  return (
    <>
      <Hero />
      <HomeSections vehicles={vehicles} brands={brands} groupCount={groups.length} posts={posts} reviews={reviews.slice(0, 6)} />
    </>
  );
}
