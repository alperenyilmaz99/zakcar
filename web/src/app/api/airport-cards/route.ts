import { NextResponse } from "next/server";
import { AIRPORT_CARDS, type AirportCard } from "@/lib/airport-cards";
import { readAirportFile, writeAirportFile } from "@/lib/airport-file-store";
import { loadAirportCards } from "@/lib/airport-store";
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

export async function GET() {
  const loaded = await loadAirportCards();
  return NextResponse.json(loaded);
}

export async function PUT(req: Request) {
  if (!(await isStaff(req))) {
    return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<AirportCard>;
    const base = AIRPORT_CARDS.find((item) => item.id === body.id);
    if (!base) return NextResponse.json({ error: "Kart bulunamadı" }, { status: 400 });
    const title = (body.title || "").trim().slice(0, 180);
    const text = (body.text || "").trim().slice(0, 400);
    const detail = (body.detail || "").trim().slice(0, 20000);
    const imageUrl = (body.imageUrl || "").trim();
    if (!title || !text || !imageUrl) {
      return NextResponse.json({ error: "Görsel, başlık ve metin gerekli" }, { status: 400 });
    }
    const current = readAirportFile();
    const next = current.map((item) =>
      item.id === base.id ? { ...item, title, text, detail, imageUrl } : item,
    );
    writeAirportFile(next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Yazılamadı";
    return NextResponse.json(
      { error: `${message}. Canlı kayıt için supabase/airport-cards.sql dosyasını çalıştırın.` },
      { status: 500 },
    );
  }
}
