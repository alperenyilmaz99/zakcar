import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { getAllBlogPosts } from "@/lib/blog";
import { getBrands, getGroups, getVehicles } from "@/lib/data";

export default function HomePage() {
  const vehicles = getVehicles().slice(0, 12);
  const groups = getGroups();
  const brands = getBrands();
  const posts = getAllBlogPosts()
    .slice(0, 3)
    .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, image: post.image }));

  return (
    <>
      <Hero />
      <HomeSections vehicles={vehicles} brands={brands} groupCount={groups.length} posts={posts} />
    </>
  );
}
