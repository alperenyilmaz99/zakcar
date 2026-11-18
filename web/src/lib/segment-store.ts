import type { SupabaseClient } from "@supabase/supabase-js";
import { readSegmentOverrides, writeSegmentOverrides, type SegmentOverrides } from "@/lib/segment-file-store";
import { SEGMENTS, isSegmentId, type SegmentId } from "@/lib/segments";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

export type SegmentImage = {
  id: SegmentId;
  imageUrl: string;
  custom: boolean;
};

export type SegmentLoad = {
  items: SegmentImage[];
  source: "supabase" | "file";
};

function missingTable(error: { message?: string; code?: string } | null): boolean {
  const text = `${error?.message || ""} ${error?.code || ""}`.toLowerCase();
  return text.includes("site_segments") || text.includes("42p01") || text.includes("pgrst205") || text.includes("schema cache");
}

function apply(overrides: SegmentOverrides): SegmentImage[] {
  return SEGMENTS.map((item) => {
    const custom = (overrides[item.id] || "").trim();
    return { id: item.id, imageUrl: custom || item.image, custom: Boolean(custom) };
  });
}

async function readSupabase(client: SupabaseClient): Promise<SegmentOverrides | null> {
  const { data, error } = await client.from("site_segments").select("id,image_url");
  if (error) {
    if (missingTable(error)) return null;
    throw new Error(error.message);
  }
  const overrides: SegmentOverrides = {};
  for (const row of (data || []) as { id: string; image_url: string }[]) {
    if (!isSegmentId(row.id) || !row.image_url?.trim()) continue;
    overrides[row.id] = row.image_url.trim();
  }
  return overrides;
}

export async function loadSegmentImages(): Promise<SegmentLoad> {
  if (hasServerSupabase()) {
    try {
      const remote = await readSupabase(createServerSupabase());
      if (remote) return { items: apply(remote), source: "supabase" };
    } catch {
      /* dosya yedeği */
    }
  }
  return { items: apply(readSegmentOverrides()), source: "file" };
}

export function cleanSegmentImage(value: string): string {
  const image = value.trim();
  if (!image) return "";
  if (image.startsWith("/assets/") || image.startsWith("/uploads/")) {
    if (image.includes("..")) throw new Error("Görsel adresi geçersiz.");
    return image;
  }
  let url: URL;
  try {
    url = new URL(image);
  } catch {
    throw new Error("Görsel adresi geçersiz.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Görsel adresi geçersiz.");
  return url.toString();
}

export async function saveSegmentImage(id: string, imageUrl: string, staff: SupabaseClient): Promise<SegmentLoad> {
  if (!isSegmentId(id)) throw new Error("Segment bulunamadı.");
  const image = cleanSegmentImage(imageUrl);
  const remote = await readSupabase(staff);
  if (remote) {
    if (!image) {
      const { error } = await staff.from("site_segments").delete().eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await staff.from("site_segments").upsert({
        id,
        image_url: image,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
    }
    const next = await readSupabase(staff);
    return { items: apply(next || {}), source: "supabase" };
  }

  const file = readSegmentOverrides();
  if (!image) delete file[id];
  else file[id] = image;
  try {
    writeSegmentOverrides(file);
  } catch {
    throw new Error("Kalıcı kayıt için Supabase SQL Editor’da web/supabase/segments.sql dosyasını çalıştırın.");
  }
  return { items: apply(file), source: "file" };
}
