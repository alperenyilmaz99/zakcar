import { NextResponse } from "next/server";
import { findPublicVehicle, loadPublicVehicles } from "@/lib/public-vehicles";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") || "";
  const vehicles = await loadPublicVehicles();
  if (!slug) return NextResponse.json(vehicles);
  const vehicle = findPublicVehicle(vehicles, slug);
  if (!vehicle) return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
  return NextResponse.json(vehicle);
}
