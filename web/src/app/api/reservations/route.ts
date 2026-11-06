import { NextResponse } from "next/server";
import { composeFlightNumber, rpcFailure, validateReservationInput, type Reservation, type ReservationInput } from "@/lib/booking";
import { normalizeCouponCode } from "@/lib/coupon-math";
import { resolveCouponPercent } from "@/lib/coupons";
import { sanitizeExtraCodes } from "@/lib/extras";
import { sendReservationConfirmation } from "@/lib/reservation-mail";
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

  const couponCode = body.couponCode ? normalizeCouponCode(body.couponCode) : "";
  let couponPercent = 0;
  if (couponCode) {
    const coupon = await resolveCouponPercent(couponCode);
    if (coupon.percent < 1) {
      return NextResponse.json({ error: "Kupon kodu geçersiz." }, { status: 400 });
    }
    if (!coupon.persisted) {
      return NextResponse.json(
        {
          error:
            "Kupon henüz rezervasyon kaydına yazılamıyor. Supabase SQL Editor’da web/supabase/coupons.sql dosyasını bir kez çalıştırın.",
        },
        { status: 503 },
      );
    }
    couponPercent = coupon.percent;
  }

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
    p_flight_number: composeFlightNumber(body) || null,
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

  let reservation = data as Reservation;
  if (couponPercent > 0 && reservation?.pnr) {
    const applied = await supabase.rpc("apply_reservation_coupon", {
      p_pnr: reservation.pnr,
      p_phone: body.phone.trim(),
      p_code: couponCode,
    });
    if (applied.error) {
      const failure = rpcFailure(applied.error);
      return NextResponse.json(
        {
          error: `${failure.error} Rezervasyon ${reservation.pnr} oluştu; kupon fiyata yazılamadı.`,
        },
        { status: failure.status },
      );
    }
    const patch = applied.data as { totalPrice?: number; notes?: string | null } | null;
    if (patch) {
      reservation = {
        ...reservation,
        totalPrice: patch.totalPrice ?? reservation.totalPrice,
        notes: patch.notes ?? reservation.notes,
      };
    }
  }

  const mailSent = await sendReservationConfirmation({
    reservation,
    email: body.email.trim(),
    customer: {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone: body.phone.trim(),
      birthDate: body.birthDate,
    },
    modelSlug: body.modelSlug,
    extraCodes: extras,
    coupon: couponPercent > 0 ? { code: couponCode, percent: couponPercent } : undefined,
  });

  return NextResponse.json({ ...reservation, mailSent });
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
