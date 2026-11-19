import { NextResponse } from "next/server";
import type { Reservation } from "@/lib/booking";
import { rentalDays } from "@/lib/extras";
import { localeFromNotes, reservationDoc } from "@/lib/reservation-copy";
import { buildReservationPdf } from "@/lib/reservation-pdf";
import { bearerToken, createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUSES = new Set<Reservation["status"]>(["aktif", "bekliyor", "tamamlandi", "iptal"]);

type NameRow = { name: string | null };
type CustomerRow = { full_name: string | null; phone: string | null; birth_date: string | null };
type ModelRow = { name: string | null; slug: string | null };
type FleetRow = { plate: string | null; vehicle_models: ModelRow | ModelRow[] | null };
type RentalPdfRow = {
  pnr: string;
  status: string;
  start_at: string;
  end_at: string;
  daily_price_try: number | string | null;
  deposit_try: number | string | null;
  total_price_try: number | string | null;
  flight_number: string | null;
  notes: string | null;
  created_at: string;
  customers: CustomerRow | CustomerRow[] | null;
  pickup: NameRow | NameRow[] | null;
  dropoff: NameRow | NameRow[] | null;
  fleet_vehicles: FleetRow | FleetRow[] | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function money(value: number | string | null | undefined): number {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] || "Müşteri", lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

export async function GET(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  const supabase = createServerSupabase(token);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });
  }
  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("id, is_active")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (!staff?.is_active) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });

  const pnr = new URL(req.url).searchParams.get("pnr")?.trim().toUpperCase() || "";
  if (!/^[A-Z0-9]{4,16}$/.test(pnr)) {
    return NextResponse.json({ error: "Geçerli bir PNR girin." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `pnr, status, start_at, end_at, daily_price_try, deposit_try, total_price_try, flight_number, notes, created_at,
       customers (full_name, phone, birth_date),
       pickup:offices!pickup_office_id (name),
       dropoff:offices!dropoff_office_id (name),
       fleet_vehicles (plate, vehicle_models (name, slug))`,
    )
    .eq("pnr", pnr)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Rezervasyon bulunamadı." }, { status: 404 });

  const row = data as RentalPdfRow;
  const customer = one(row.customers);
  const fleet = one(row.fleet_vehicles);
  const model = one(fleet?.vehicle_models);
  const names = splitName(customer?.full_name || "");
  const status = STATUSES.has(row.status as Reservation["status"])
    ? (row.status as Reservation["status"])
    : "bekliyor";
  const birth = customer?.birth_date?.slice(0, 10);
  const reservation: Reservation = {
    pnr: row.pnr,
    status,
    vehicleName: model?.name || "Araç",
    plate: fleet?.plate || "",
    pickup: one(row.pickup)?.name || "—",
    dropoff: one(row.dropoff)?.name || "—",
    startAt: row.start_at,
    endAt: row.end_at,
    dailyPrice: money(row.daily_price_try),
    deposit: money(row.deposit_try),
    totalPrice: money(row.total_price_try),
    days: rentalDays(row.start_at, row.end_at),
    flightNumber: row.flight_number,
    notes: row.notes,
  };

  try {
    const locale = localeFromNotes(row.notes);
    const pdf = await buildReservationPdf({
      reservation,
      customer: {
        firstName: names.firstName,
        lastName: names.lastName,
        phone: customer?.phone || "",
        birthDate: birth && /^\d{4}-\d{2}-\d{2}$/.test(birth) ? birth : undefined,
      },
      modelSlug: model?.slug || "",
      issuedAt: new Date(row.created_at),
      locale,
    });
    const filename = `${reservationDoc(locale).fileName} ${row.pnr}.pdf`;
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF hazırlanamadı." }, { status: 500 });
  }
}
