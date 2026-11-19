import { NextResponse } from "next/server";
import { normalizePromoSlot, type PromoCover } from "@/lib/promo";
import { listPublicPromos, readPromoFile, removePromoUpload, writePromoFile } from "@/lib/promo-file-store";

function bySlot(items: PromoCover[], slot: string | null, all: boolean): PromoCover[] {
  const visible = all ? items : items.filter((item) => item.isActive);
  if (slot === "backdrop") return visible.filter((item) => normalizePromoSlot(item.slot) === "backdrop");
  if (slot !== "hero" && slot !== "mid" && slot !== "campaigns") return visible;
  const matched = visible.filter((item) => normalizePromoSlot(item.slot) === slot);
  const split = items.some((item) => normalizePromoSlot(item.slot) !== "hero");
  if (matched.length === 0 && !split) {
    return visible.filter((item) => normalizePromoSlot(item.slot) === "hero");
  }
  return matched;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  const slot = url.searchParams.get("slot");
  const result = await listPublicPromos();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json(bySlot(result.items, slot, all));
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
