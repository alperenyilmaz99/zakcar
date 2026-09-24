import { NextResponse } from "next/server";
import { savePromoUpload } from "@/lib/promo-file-store";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Dosya seçin" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Görsel 5 MB’dan büyük olamaz" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = savePromoUpload(file, buffer);
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Yüklenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
