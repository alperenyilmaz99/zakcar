import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { getPublishedBlogPosts } from "@/lib/blog";
import { listHiddenKeys, listReviews } from "@/lib/generated-content";
import { getBrands, getGroups, getVehicles } from "@/lib/data";
import { withLivePrices } from "@/lib/model-prices";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vehicles = (await withLivePrices(getVehicles())).slice(0, 12);
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
      <Hero />
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
