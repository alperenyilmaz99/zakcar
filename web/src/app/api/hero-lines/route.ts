import { NextResponse } from "next/server";
import { listHeroLines } from "@/lib/generated-content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const lines = await listHeroLines();
    return NextResponse.json({ lines });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cümleler okunamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
