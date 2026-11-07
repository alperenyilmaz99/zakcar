import { NextResponse } from "next/server";
import { saveAirportUpload } from "@/lib/airport-file-store";
import { bearerToken, createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function isStaff(req: Request): Promise<boolean> {
  const token = bearerToken(req);
  if (!token) return false;
  const supabase = createServerSupabase(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return false;
  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .maybeSingle();
  return Boolean(staff?.is_active);
}

export async function POST(req: Request) {
  if (!(await isStaff(req))) {
    return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Dosya seçin" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Görsel 5 MB’dan büyük olamaz" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    return NextResponse.json({ url: saveAirportUpload(file, buffer) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Yüklenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
