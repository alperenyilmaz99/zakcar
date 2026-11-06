import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogBlock } from "@/lib/blog-types";
import type { SiteReview, StoredPost } from "@/lib/content-types";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

export type { SiteReview, StoredPost };

type Store = {
  posts: StoredPost[];
  reviews: SiteReview[];
  hiddenPostSlugs: string[];
  hiddenReviewIds: string[];
};

const COVER_IMAGES = [
  "/assets/blog/kredi-kartsiz-arac-kiralama.png",
  "/assets/blog/aileler-icin-en-iyi-araclar.jpeg",
  "/assets/blog/arac-kiralama-sartlari.png",
  "/assets/blog/arac-kiralamada-depozito-ucreti.png",
  "/assets/blog/arac-kiralamanin-faydalari.png",
  "/assets/blog/2026-kopru-ve-otoyol-ucretleri.png",
];

function storePath(): string {
  const candidates = [
    path.join(process.cwd(), "src", "data", "generated-content.json"),
    path.join(process.cwd(), "web", "src", "data", "generated-content.json"),
  ];
  return candidates.find((item) => fs.existsSync(item)) || candidates[0];
}

function emptyStore(): Store {
  return { posts: [], reviews: [], hiddenPostSlugs: [], hiddenReviewIds: [] };
}

export function readContentFile(): Store {
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath(), "utf8")) as Partial<Store>;
    return {
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      hiddenPostSlugs: Array.isArray(parsed.hiddenPostSlugs) ? parsed.hiddenPostSlugs.filter((item) => typeof item === "string") : [],
      hiddenReviewIds: Array.isArray(parsed.hiddenReviewIds) ? parsed.hiddenReviewIds.filter((item) => typeof item === "string") : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeContentFile(store: Store): boolean {
  try {
    const file = storePath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(store, null, 2) + "\n", "utf8");
    return true;
  } catch {
    return false;
  }
}

function missingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = error.message || "";
  return error.code === "42P01" || error.code === "PGRST205" || /schema cache|does not exist|could not find the table/i.test(message);
}

function mapPost(row: {
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  blocks: BlogBlock[];
  created_at: string;
}): StoredPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    image: row.image || "",
    blocks: Array.isArray(row.blocks) ? row.blocks : [],
    createdAt: row.created_at,
  };
}

function mapReview(row: {
  id: string;
  author: string;
  location: string;
  rating: number;
  body: string;
  created_at: string;
}): SiteReview {
  return {
    id: row.id,
    author: row.author,
    location: row.location,
    rating: Number(row.rating) || 5,
    body: row.body,
    createdAt: row.created_at,
  };
}

async function remotePosts(): Promise<StoredPost[]> {
  if (!hasServerSupabase()) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("site_posts").select("*").order("created_at", { ascending: false });
  if (error) {
    if (missingTable(error)) return [];
    throw new Error(error.message);
  }
  return ((data || []) as Parameters<typeof mapPost>[0][]).map(mapPost);
}

async function remoteReviews(): Promise<SiteReview[]> {
  if (!hasServerSupabase()) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("site_reviews").select("*").order("created_at", { ascending: false });
  if (error) {
    if (missingTable(error)) return [];
    throw new Error(error.message);
  }
  return ((data || []) as Parameters<typeof mapReview>[0][]).map(mapReview);
}

export async function listGeneratedPosts(): Promise<StoredPost[]> {
  const file = readContentFile().posts;
  const remote = await remotePosts();
  const seen = new Set<string>();
  const merged: StoredPost[] = [];
  for (const post of [...remote, ...file].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    if (seen.has(post.slug)) continue;
    seen.add(post.slug);
    merged.push(post);
  }
  return merged;
}

export async function listReviews(): Promise<SiteReview[]> {
  const file = readContentFile().reviews;
  const remote = await remoteReviews();
  const seen = new Set<string>();
  const merged: SiteReview[] = [];
  for (const review of [...remote, ...file].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    if (seen.has(review.id)) continue;
    seen.add(review.id);
    merged.push(review);
  }
  return merged;
}

export function coverForSlug(slug: string): string {
  let hash = 0;
  for (const char of slug) hash = (hash + char.charCodeAt(0)) % COVER_IMAGES.length;
  return COVER_IMAGES[hash] || COVER_IMAGES[0];
}

export async function saveGeneratedPost(
  post: StoredPost,
  staff?: SupabaseClient | null,
): Promise<"both" | "file" | "supabase"> {
  const store = readContentFile();
  store.posts = [post, ...store.posts.filter((item) => item.slug !== post.slug)];
  store.hiddenPostSlugs = store.hiddenPostSlugs.filter((item) => item !== post.slug);
  const wroteFile = writeContentFile(store);

  let wroteRemote = false;
  if (staff) {
    const { error } = await staff.from("site_posts").upsert({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      blocks: post.blocks,
      created_at: post.createdAt,
    });
    if (error && !missingTable(error)) throw new Error(error.message);
    wroteRemote = !error;
    const unhide = await staff.from("site_hidden_content").delete().eq("kind", "post").eq("key", post.slug);
    if (unhide.error && !missingTable(unhide.error)) throw new Error(unhide.error.message);
  }

  if (!wroteFile && !wroteRemote) {
    throw new Error("Yazı kaydedilemedi. supabase/content.sql dosyasını SQL Editor’da çalıştırın.");
  }
  if (wroteFile && wroteRemote) return "both";
  return wroteRemote ? "supabase" : "file";
}

export async function saveGeneratedReview(
  review: SiteReview,
  staff?: SupabaseClient | null,
): Promise<"both" | "file" | "supabase"> {
  const store = readContentFile();
  store.reviews = [review, ...store.reviews.filter((item) => item.id !== review.id)];
  const wroteFile = writeContentFile(store);

  let wroteRemote = false;
  if (staff) {
    const { error } = await staff.from("site_reviews").insert({
      id: review.id,
      author: review.author,
      location: review.location,
      rating: review.rating,
      body: review.body,
      created_at: review.createdAt,
    });
    if (error && !missingTable(error)) throw new Error(error.message);
    wroteRemote = !error;
  }

  if (!wroteFile && !wroteRemote) {
    throw new Error("Yorum kaydedilemedi. supabase/content.sql dosyasını SQL Editor’da çalıştırın.");
  }
  if (wroteFile && wroteRemote) return "both";
  return wroteRemote ? "supabase" : "file";
}

async function remoteHidden(kind: "post" | "review"): Promise<string[]> {
  if (!hasServerSupabase()) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("site_hidden_content").select("key").eq("kind", kind);
  if (error) {
    if (missingTable(error)) return [];
    throw new Error(error.message);
  }
  return ((data || []) as { key: string }[]).map((row) => row.key).filter(Boolean);
}

export async function listHiddenKeys(kind: "post" | "review"): Promise<string[]> {
  const file = readContentFile();
  const local = kind === "post" ? file.hiddenPostSlugs : file.hiddenReviewIds;
  const remote = await remoteHidden(kind);
  return [...new Set([...local, ...remote])];
}

async function hideKey(kind: "post" | "review", key: string, staff?: SupabaseClient | null): Promise<void> {
  const store = readContentFile();
  const list = kind === "post" ? store.hiddenPostSlugs : store.hiddenReviewIds;
  if (!list.includes(key)) list.push(key);
  const wroteFile = writeContentFile(store);
  let wroteRemote = false;
  if (staff) {
    const { error } = await staff.from("site_hidden_content").upsert({ kind, key });
    if (error && !missingTable(error)) throw new Error(error.message);
    wroteRemote = !error;
  }
  if (!wroteFile && !wroteRemote) {
    throw new Error("Silinemedi. Supabase SQL Editor’da web/supabase/content.sql dosyasını bir kez çalıştırın.");
  }
}

export async function deleteManagedPost(slug: string, staff: SupabaseClient | null, mustHide: boolean): Promise<void> {
  const store = readContentFile();
  store.posts = store.posts.filter((item) => item.slug !== slug);
  if (mustHide && !store.hiddenPostSlugs.includes(slug)) store.hiddenPostSlugs.push(slug);
  const wroteFile = writeContentFile(store);

  let removedRemote = false;
  let hidRemote = false;
  if (staff) {
    const removed = await staff.from("site_posts").delete().eq("slug", slug);
    if (removed.error && !missingTable(removed.error)) throw new Error(removed.error.message);
    removedRemote = !removed.error;
    if (mustHide) {
      const hidden = await staff.from("site_hidden_content").upsert({ kind: "post", key: slug });
      if (hidden.error && !missingTable(hidden.error)) throw new Error(hidden.error.message);
      hidRemote = !hidden.error;
    }
  }

  if (mustHide && !wroteFile && !hidRemote) {
    throw new Error("Yazı siteden kaldırılamadı. Supabase SQL Editor’da web/supabase/content.sql dosyasını bir kez çalıştırın.");
  }
  if (!mustHide && !wroteFile && !removedRemote) {
    throw new Error("Yazı silinemedi. Supabase SQL Editor’da web/supabase/content.sql dosyasını bir kez çalıştırın.");
  }
}

export async function deleteManagedReview(id: string, staff: SupabaseClient | null, builtin: boolean): Promise<void> {
  if (builtin) {
    await hideKey("review", id, staff);
    return;
  }

  const store = readContentFile();
  store.reviews = store.reviews.filter((item) => item.id !== id);
  const wroteFile = writeContentFile(store);
  let wroteRemote = false;
  if (staff) {
    const { error } = await staff.from("site_reviews").delete().eq("id", id);
    if (error && !missingTable(error)) throw new Error(error.message);
    wroteRemote = !error;
  }
  if (!wroteFile && !wroteRemote) {
    throw new Error("Yorum silinemedi. Supabase SQL Editor’da web/supabase/content.sql dosyasını bir kez çalıştırın.");
  }
}
