import { NextResponse } from "next/server";
import { loadSegmentImages, saveSegmentImage } from "@/lib/segment-store";
import { bearerToken, createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function staffClient(req: Request) {
  const token = bearerToken(req);
  if (!token) return null;
  const supabase = createServerSupabase(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .maybeSingle();
  return staff?.is_active ? supabase : null;
}

export async function GET() {
  const loaded = await loadSegmentImages();
  return NextResponse.json(loaded);
}

export async function PUT(req: Request) {
  const writer = await staffClient(req);
  if (!writer) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  try {
    const body = (await req.json()) as { id?: string; imageUrl?: string };
    const saved = await saveSegmentImage(body.id || "", body.imageUrl || "", writer);
    return NextResponse.json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Görsel kaydedilemedi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
