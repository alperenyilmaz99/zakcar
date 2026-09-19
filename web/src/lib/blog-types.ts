export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: number; text: string }
  | { type: "listItem"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  blocks: BlogBlock[];
};
