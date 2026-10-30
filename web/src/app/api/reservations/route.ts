import { NextResponse } from "next/server";
import { rpcFailure, validateReservationInput, type Reservation, type ReservationInput } from "@/lib/booking";
import { sanitizeExtraCodes } from "@/lib/extras";
import { bearerToken, createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  if (!hasServerSupabase()) {
    return NextResponse.json({ error: "Supabase ayarları eksik." }, { status: 503 });
  }

  let body: ReservationInput;
  try {
    body = (await req.json()) as ReservationInput;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const invalid = validateReservationInput(body);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const supabase = createServerSupabase(bearerToken(req));
  const base = {
    p_model_slug: body.modelSlug,
    p_pickup_code: body.pickupCode,
    p_dropoff_code: body.dropoffCode,
    p_start_at: body.startAt,
    p_end_at: body.endAt,
    p_first_name: body.firstName.trim(),
    p_last_name: body.lastName.trim(),
    p_email: body.email.trim(),
    p_phone: body.phone.trim(),
    p_flight_number: body.flightNumber?.trim() || null,
  };
  const extras = sanitizeExtraCodes(body.extraCodes);
  let { data, error } = await supabase.rpc("create_public_reservation", {
    ...base,
    p_birth_date: body.birthDate || null,
    p_extra_codes: extras.length ? extras.join(",") : null,
  });
  if (error && isOldReservationFunction(error)) {
    ({ data, error } = await supabase.rpc("create_public_reservation", base));
  }

  if (error) {
    const failure = rpcFailure(error);
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }

  return NextResponse.json(data as Reservation);
}

function isOldReservationFunction(error: { message?: string; code?: string }) {
  const message = error.message || "";
  return (
    error.code === "PGRST202" ||
    /could not find the function/i.test(message) ||
    /schema cache/i.test(message)
  );
}

export async function GET(req: Request) {
  if (!hasServerSupabase()) {
    return NextResponse.json({ error: "Supabase ayarları eksik." }, { status: 503 });
  }

  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  const supabase = createServerSupabase(token);
  const { data, error } = await supabase.rpc("list_my_reservations");
  if (error) {
    const failure = rpcFailure(error);
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }

  return NextResponse.json(Array.isArray(data) ? data : []);
}
