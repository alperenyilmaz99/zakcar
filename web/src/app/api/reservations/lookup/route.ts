import { NextResponse } from "next/server";
import { rpcFailure, type Reservation } from "@/lib/booking";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  if (!hasServerSupabase()) {
    return NextResponse.json({ error: "Supabase ayarları eksik." }, { status: 503 });
  }

  const url = new URL(req.url);
  const pnr = (url.searchParams.get("pnr") || "").trim().toUpperCase();
  const phone = (url.searchParams.get("phone") || "").trim();
  if (!pnr || !phone) {
    return NextResponse.json({ error: "PNR ve telefon gerekli." }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase.rpc("lookup_reservation", {
    p_pnr: pnr,
    p_phone: phone,
  });

  if (error) {
    const failure = rpcFailure(error);
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }
  if (!data) return NextResponse.json({ error: "Rezervasyon bulunamadı." }, { status: 404 });
  return NextResponse.json(data as Reservation);
}
