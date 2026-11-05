import { NextResponse } from "next/server";
import { isCouponCode, normalizeCouponCode } from "@/lib/coupon-math";
import { resolveCouponPercent } from "@/lib/coupons";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let raw = "";
  try {
    const body = (await req.json()) as { code?: string };
    raw = body.code || "";
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const code = normalizeCouponCode(raw);
  if (!isCouponCode(code)) {
    return NextResponse.json({ error: "Kupon kodu geçersiz." }, { status: 400 });
  }

  const found = await resolveCouponPercent(code);
  if (found.percent < 1) {
    return NextResponse.json({ error: "Kupon kodu geçersiz." }, { status: 400 });
  }

  return NextResponse.json({ code, percent: found.percent, persisted: found.persisted });
}
