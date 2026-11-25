import { NextResponse } from "next/server";
import { listHeroLines, listHeroOrder } from "@/lib/generated-content";
import { heroSlideOrder } from "@/lib/hero-order";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const lines = await listHeroLines();
    const order = heroSlideOrder(
      lines.map((line) => line.id),
      await listHeroOrder(),
    );
    return NextResponse.json({ lines, order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cümleler okunamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
