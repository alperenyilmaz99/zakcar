import { NextResponse } from "next/server";
import { rpcFailure } from "@/lib/booking";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  if (!hasServerSupabase()) {
    return NextResponse.json({ error: "Supabase ayarları eksik." }, { status: 503 });
  }

  const url = new URL(req.url);
  const start = url.searchParams.get("from") || "";
  const end = url.searchParams.get("to") || "";
  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to <= from) {
    return NextResponse.json({ error: "Geçersiz tarih aralığı." }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase.rpc("availability_by_model", {
    p_start_at: from.toISOString(),
    p_end_at: to.toISOString(),
  });

  if (error) {
    const failure = rpcFailure(error);
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }

  const counts: Record<string, number> = {};
  for (const row of (data || []) as Array<{ slug: string; available: number }>) {
    counts[row.slug] = Number(row.available) || 0;
  }
  return NextResponse.json(counts);
}
