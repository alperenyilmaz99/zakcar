import { NextResponse } from "next/server";
import { composeFlightNumber, pickupHourIsPast, type Reservation } from "@/lib/booking";
import { depositForDays, extraAmount, rentalDays, sanitizeExtraCodes } from "@/lib/extras";
import { sendReservationConfirmation } from "@/lib/reservation-mail";
import { bearerToken, createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const OFFICES = new Set(["saw", "iga", "merkez"]);

type OfficeRow = { id: string; code: string; name: string };
type ModelRow = { id: string; name: string; slug: string; daily_price_try: number | null };
type FleetRow = {
  id: string;
  plate: string;
  status: string;
  model_id: string;
  home_office_id: string | null;
};

async function staffClient(req: Request) {
  const token = bearerToken(req);
  if (!token) return null;
  const supabase = createServerSupabase(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!staff?.is_active) return null;
  return { supabase, staffId: data.user.id };
}

function phoneKey(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : null;
}

function makePnr() {
  return `ZK${String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0")}`;
}

export async function GET(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });

  const [{ data: fleet, error: fleetError }, { data: models, error: modelError }, { data: offices, error: officeError }] =
    await Promise.all([
      staff.supabase.from("fleet_vehicles").select("id, status, model_id, home_office_id"),
      staff.supabase.from("vehicle_models").select("id, name, slug, daily_price_try"),
      staff.supabase.from("offices").select("id, code, name").in("code", ["saw", "iga", "merkez"]),
    ]);
  if (fleetError) return NextResponse.json({ error: fleetError.message }, { status: 400 });
  if (modelError) return NextResponse.json({ error: modelError.message }, { status: 400 });
  if (officeError) return NextResponse.json({ error: officeError.message }, { status: 400 });

  const modelById = new Map(((models || []) as ModelRow[]).map((model) => [model.id, model]));
  const officeById = new Map((offices as OfficeRow[] | null)?.map((office) => [office.id, office]) ?? []);
  const vehicles = ((fleet || []) as FleetRow[])
    .filter((row) => row.status !== "bakimda")
    .map((row) => {
      const model = modelById.get(row.model_id);
      const office = row.home_office_id ? officeById.get(row.home_office_id) : undefined;
      return {
        id: row.id,
        name: model?.name || "Araç",
        slug: model?.slug || "",
        status: row.status,
        dailyPrice: Number(model?.daily_price_try ?? 0),
        officeCode: office && OFFICES.has(office.code) ? office.code : "saw",
        officeName: office?.name || "",
      };
    });

  return NextResponse.json({
    vehicles,
    offices: ((offices || []) as OfficeRow[])
      .filter((office) => OFFICES.has(office.code))
      .map((office) => ({ code: office.code, name: (office.name || "").replaceAll("IGA", "IST") })),
  });
}

type ManualBody = {
  fleetVehicleId?: string;
  pickupCode?: string;
  dropoffCode?: string;
  startAt?: string;
  endAt?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  dailyPrice?: number | string;
  arrivalFlight?: string;
  returnFlight?: string;
  customerNote?: string;
  extraCodes?: string[];
};

const EXTRA_NOTE: Record<string, string> = {
  driver: "Ek sürücü",
  young: "Genç sürücü paketi",
  hgs: "HGS",
  child: "Çocuk koltuğu",
  winter: "Kış lastiği",
};

export async function POST(req: Request) {
  const staff = await staffClient(req);
  if (!staff) return NextResponse.json({ error: "Personel oturumu gerekli." }, { status: 401 });

  let body: ManualBody;
  try {
    body = (await req.json()) as ManualBody;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const key = phoneKey(phone);
  const pickupCode = (body.pickupCode || "").trim();
  const dropoffCode = (body.dropoffCode || "").trim();
  const start = new Date(body.startAt || "");
  const end = new Date(body.endAt || "");
  const birthDate = (body.birthDate || "").trim();
  const dailyInput = Number(String(body.dailyPrice ?? "").replace(",", "."));

  if (firstName.length < 2 || lastName.length < 2) {
    return NextResponse.json({ error: "Ad ve soyad gerekli." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 });
  }
  if (!key) return NextResponse.json({ error: "Geçerli bir telefon girin." }, { status: 400 });
  if (!OFFICES.has(pickupCode) || !OFFICES.has(dropoffCode)) {
    return NextResponse.json({ error: "Alış ve bırakış ofisini seçin." }, { status: 400 });
  }
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: "Bırakış, alıştan sonra olmalı." }, { status: 400 });
  }
  if (pickupHourIsPast(start)) {
    return NextResponse.json({ error: "Alış saati geçmişte kalamaz." }, { status: 400 });
  }
  if (end.getTime() - start.getTime() > 90 * 86_400_000) {
    return NextResponse.json({ error: "Tek seferde en fazla 90 gün kiralanabilir." }, { status: 400 });
  }
  if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return NextResponse.json({ error: "Doğum tarihi geçersiz." }, { status: 400 });
  }
  if (!Number.isFinite(dailyInput) || dailyInput < 0) {
    return NextResponse.json({ error: "Günlük fiyat 0 veya daha büyük olmalı." }, { status: 400 });
  }
  const flight = composeFlightNumber({
    arrivalFlight: body.arrivalFlight,
    returnFlight: body.returnFlight,
    customerNote: body.customerNote,
  });
  if ((body.customerNote || "").trim().length > 400) {
    return NextResponse.json({ error: "Not en fazla 400 karakter olabilir." }, { status: 400 });
  }

  const { data: fleet, error: fleetError } = await staff.supabase
    .from("fleet_vehicles")
    .select("id, plate, status, model_id, home_office_id")
    .eq("id", body.fleetVehicleId || "")
    .maybeSingle();
  if (fleetError) return NextResponse.json({ error: fleetError.message }, { status: 400 });
  const vehicle = fleet as FleetRow | null;
  const { data: modelRow } = vehicle
    ? await staff.supabase
        .from("vehicle_models")
        .select("id, name, slug, daily_price_try")
        .eq("id", vehicle.model_id)
        .maybeSingle()
    : { data: null };
  const model = modelRow as ModelRow | null;
  if (!vehicle || !model?.slug) {
    return NextResponse.json({ error: "Aracı listeden seçin." }, { status: 400 });
  }
  if (vehicle.status === "bakimda") {
    return NextResponse.json({ error: "Bu araç bakımdadır." }, { status: 400 });
  }

  const { data: clash } = await staff.supabase
    .from("rentals")
    .select("id")
    .eq("fleet_vehicle_id", vehicle.id)
    .in("status", ["aktif", "bekliyor"])
    .lt("start_at", end.toISOString())
    .gt("end_at", start.toISOString())
    .limit(1);
  if (clash && clash.length > 0) {
    return NextResponse.json({ error: "Bu araç seçilen tarihte başka bir kiralamada." }, { status: 400 });
  }

  const { data: officeRows, error: officeError } = await staff.supabase
    .from("offices")
    .select("id, code, name")
    .in("code", [pickupCode, dropoffCode]);
  if (officeError) return NextResponse.json({ error: officeError.message }, { status: 400 });
  const officeList = (officeRows || []) as OfficeRow[];
  const pickup = officeList.find((office) => office.code === pickupCode);
  const dropoff = officeList.find((office) => office.code === dropoffCode);
  if (!pickup || !dropoff) {
    return NextResponse.json({ error: "Ofis kaydı bulunamadı." }, { status: 400 });
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const { data: existing, error: customerReadError } = await staff.supabase
    .from("customers")
    .select("id")
    .eq("phone_key", key)
    .limit(1)
    .maybeSingle();
  if (customerReadError) return NextResponse.json({ error: customerReadError.message }, { status: 400 });

  let customerId = existing?.id as string | undefined;
  const customerPatch = {
    full_name: fullName,
    phone,
    email,
    phone_key: key,
    birth_date: birthDate || null,
  };
  if (customerId) {
    const { error: updateError } = await staff.supabase.from("customers").update(customerPatch).eq("id", customerId);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  } else {
    const { data: created, error: insertCustomerError } = await staff.supabase
      .from("customers")
      .insert(customerPatch)
      .select("id")
      .single();
    if (insertCustomerError || !created) {
      return NextResponse.json({ error: insertCustomerError?.message || "Müşteri kaydı açılamadı." }, { status: 400 });
    }
    customerId = created.id as string;
  }

  const days = rentalDays(start.toISOString(), end.toISOString());
  const daily = Math.round(dailyInput * 100) / 100;
  const deposit = depositForDays(days);
  const extras = sanitizeExtraCodes(body.extraCodes);
  const total = Math.round((daily * days + extraAmount(extras, days)) * 100) / 100;
  const notes = ["Panelden oluşturuldu", ...extras.map((id) => EXTRA_NOTE[id])].filter(Boolean).join(" · ");
  const rentalBase = {
    fleet_vehicle_id: vehicle.id,
    customer_id: customerId,
    pickup_office_id: pickup.id,
    dropoff_office_id: dropoff.id,
    start_at: start.toISOString(),
    end_at: end.toISOString(),
    status: "bekliyor",
    daily_price_try: daily,
    deposit_try: deposit,
    total_price_try: total,
    flight_number: flight || null,
    notes,
    created_by: staff.staffId,
  };

  let rental: { pnr: string } | null = null;
  let rentalError = "Rezervasyon kaydı açılamadı.";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await staff.supabase
      .from("rentals")
      .insert({ ...rentalBase, pnr: makePnr() })
      .select("pnr")
      .single();
    if (!error && data?.pnr) {
      rental = { pnr: data.pnr as string };
      break;
    }
    rentalError = error?.message || rentalError;
    if (error?.code !== "23505") break;
  }
  if (!rental) return NextResponse.json({ error: rentalError }, { status: 400 });

  const reservation: Reservation = {
    pnr: rental.pnr,
    status: "bekliyor",
    vehicleName: model.name,
    plate: vehicle.plate,
    pickup: pickup.name,
    dropoff: dropoff.name,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    dailyPrice: daily,
    deposit,
    totalPrice: total,
    days,
    flightNumber: flight || null,
    notes,
  };
  const mailSent = await sendReservationConfirmation({
    reservation,
    email,
    customer: { firstName, lastName, phone, birthDate: birthDate || undefined },
    modelSlug: model.slug,
    extraCodes: extras,
  });

  return NextResponse.json({ ...reservation, mailSent });
}
