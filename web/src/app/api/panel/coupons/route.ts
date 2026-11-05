import { NextResponse } from "next/server";
import { createCoupon, deleteCoupon, listCoupons, setCouponActive } from "@/lib/coupons";
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
  if (!staff?.is_active) return null;
  return supabase;
}

export async function GET(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  try {
    return NextResponse.json(await listCoupons(staff));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kuponlar okunamadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  try {
    const body = (await req.json()) as { code?: string; percent?: number };
    const saved = await createCoupon(staff, body.code || "", Number(body.percent));
    return NextResponse.json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kupon kaydedilemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  try {
    const body = (await req.json()) as { id?: string; active?: boolean };
    if (!body.id || typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }
    return NextResponse.json(await setCouponActive(staff, body.id, body.active));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kupon güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  try {
    const body = (await req.json()) as { id?: string };
    if (!body.id) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    return NextResponse.json(await deleteCoupon(staff, body.id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kupon silinemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
