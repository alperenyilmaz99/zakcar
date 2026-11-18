import { NextResponse } from "next/server";
import { addDistrict, loadDistricts, removeDistrict, type DistrictInput } from "@/lib/district-store";
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
  const loaded = await loadDistricts();
  return NextResponse.json(loaded);
}

export async function POST(req: Request) {
  const writer = await staffClient(req);
  if (!writer) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  try {
    const body = (await req.json()) as DistrictInput;
    const saved = await addDistrict(body, writer);
    return NextResponse.json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Semt eklenemedi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const writer = await staffClient(req);
  if (!writer) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  const slug = new URL(req.url).searchParams.get("slug") || "";
  try {
    const source = await removeDistrict(slug, writer);
    return NextResponse.json({ ok: true, source });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Semt silinemedi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
