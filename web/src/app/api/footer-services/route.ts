import { NextResponse } from "next/server";
import { listFooterServices } from "@/lib/generated-content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await listFooterServices();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hizmetler okunamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
