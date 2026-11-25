import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { getPublishedBlogPosts } from "@/lib/blog";
import { listHeroLines, listHeroOrder, listHiddenKeys, listReviews } from "@/lib/generated-content";
import { heroSlideOrder } from "@/lib/hero-order";
import { getBrands, getGroups } from "@/lib/data";
import { loadBackdropImage } from "@/lib/promo-file-store";
import { loadPublicVehicles } from "@/lib/public-vehicles";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [vehicles, backdrop, heroLines, heroOrder] = await Promise.all([
    loadPublicVehicles().then((items) => items.slice(0, 12)),
    loadBackdropImage(),
    listHeroLines(),
    listHeroOrder(),
  ]);
  const groups = getGroups();
  const brands = getBrands();
  const [published, savedReviews, hiddenReviewIds] = await Promise.all([
    getPublishedBlogPosts(),
    listReviews(),
    listHiddenKeys("review"),
  ]);
  const posts = published
    .slice(0, 3)
    .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, image: post.image }));

  return (
    <>
      <Hero backdrop={backdrop} lines={heroLines} order={heroSlideOrder(heroLines.map((line) => line.id), heroOrder)} />
      <HomeSections
        vehicles={vehicles}
        brands={brands}
        groupCount={groups.length}
        posts={posts}
        savedReviews={savedReviews.map((review) => ({
          id: review.id,
          author: review.author,
          location: review.location,
          body: review.body,
        }))}
        hiddenReviewIds={hiddenReviewIds}
      />
    </>
  );
}
