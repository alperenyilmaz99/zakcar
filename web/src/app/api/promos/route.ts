import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isMissingPromoTable, mapPromoRow, type PromoCover, type PromoRow } from "@/lib/promo";
import { readPromoFile, removePromoUpload, writePromoFile } from "@/lib/promo-file-store";

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all") === "1";
  const supabase = anonClient();
  if (supabase) {
    let query = supabase.from("promo_covers").select("*").order("sort_order", { ascending: true });
    if (!all) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (!error) {
      return NextResponse.json(((data as PromoRow[]) || []).map(mapPromoRow));
    }
    if (!isMissingPromoTable(error)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const items = readPromoFile();
  return NextResponse.json(all ? items : items.filter((p) => p.isActive));
}

export async function PUT(req: Request) {
  try {
    const items = (await req.json()) as PromoCover[];
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }
    writePromoFile(items);
    return NextResponse.json(items);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Yazılamadı";
    return NextResponse.json(
      { error: `${message}. Vercel’de kalıcı kayıt için supabase/promo-covers.sql dosyasını çalıştırın.` },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  const items = readPromoFile();
  const found = items.find((p) => p.id === id);
  if (found) removePromoUpload(found.imageUrl);
  writePromoFile(items.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
