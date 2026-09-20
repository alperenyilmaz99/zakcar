import { createClient } from "@/lib/supabase/client";
import type { FleetStatus, FleetVehicle, PanelStats, Rental, RentalStatus } from "@/lib/panel-types";

type FleetRow = {
  id: string;
  fleet_code: string;
  plate: string;
  status: FleetStatus;
  fuel_level: number;
  odometer_km: number;
  last_status_at: string;
  model_slug: string;
  model_name: string;
  brand: string;
  vehicle_group: string;
  image_url: string | null;
  office_name: string | null;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  location_updated_at: string | null;
};

type RentalRow = {
  id: string;
  pnr: string;
  status: RentalStatus;
  start_at: string;
  end_at: string;
  daily_price_try: number | null;
  deposit_try: number | null;
  notes: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_license_no: string | null;
  plate: string;
  fleet_code: string;
  vehicle_name: string;
  pickup_office: string | null;
  dropoff_office: string | null;
};

type StatsRow = {
  total: number;
  musait: number;
  kirada: number;
  rezerveli: number;
  bakimda: number;
  aktif_kiralama: number;
  bugun_teslim: number;
  bugun_iade: number;
};

function money(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${Number(n).toLocaleString("tr-TR")} TL`;
}

function mapFleet(row: FleetRow): FleetVehicle {
  return {
    id: row.fleet_code || row.id,
    plate: row.plate,
    vehicleSlug: row.model_slug,
    name: row.model_name,
    brand: row.brand,
    group: row.vehicle_group,
    image: row.image_url || "",
    status: row.status,
    office: row.office_name || "—",
    lat: row.lat ?? 40.8986,
    lng: row.lng ?? 29.3092,
    locationLabel: row.location_label || row.office_name || "Konum yok",
    fuelLevel: row.fuel_level ?? 0,
    km: row.odometer_km ?? 0,
    lastUpdated: row.location_updated_at || row.last_status_at,
  };
}

function mapRental(row: RentalRow): Rental {
  return {
    id: row.id,
    pnr: row.pnr,
    vehicleId: row.fleet_code,
    vehicleName: row.vehicle_name,
    plate: row.plate,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email || "",
      licenseNo: row.customer_license_no || "",
    },
    pickup: row.pickup_office || "—",
    dropoff: row.dropoff_office || "—",
    startAt: row.start_at,
    endAt: row.end_at,
    status: row.status,
    dailyPrice: money(row.daily_price_try),
    deposit: money(row.deposit_try),
    notes: row.notes || undefined,
  };
}

export async function fetchFleet(): Promise<FleetVehicle[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("v_fleet_board").select("*").order("fleet_code");
  if (error) throw error;
  return ((data as FleetRow[]) || []).map(mapFleet);
}

export async function fetchRentals(): Promise<Rental[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_rentals_board")
    .select("*")
    .order("start_at", { ascending: false });
  if (error) throw error;
  return ((data as RentalRow[]) || []).map(mapRental);
}

export async function fetchPanelStats(): Promise<PanelStats> {
  const supabase = createClient();
  const { data, error } = await supabase.from("v_panel_stats").select("*").maybeSingle();
  if (error) throw error;
  const row = data as StatsRow | null;
  return {
    total: Number(row?.total ?? 0),
    musait: Number(row?.musait ?? 0),
    kirada: Number(row?.kirada ?? 0),
    rezerveli: Number(row?.rezerveli ?? 0),
    bakimda: Number(row?.bakimda ?? 0),
    aktifKiralama: Number(row?.aktif_kiralama ?? 0),
    bugunTeslim: Number(row?.bugun_teslim ?? 0),
    bugunIade: Number(row?.bugun_iade ?? 0),
  };
}

export async function ensureStaffSession(): Promise<{ ok: boolean; reason?: string }> {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return { ok: false, reason: "Oturum yok" };

  const { data: staff, error } = await supabase
    .from("staff_profiles")
    .select("id, is_active, role, full_name")
    .eq("id", sessionData.session.user.id)
    .maybeSingle();

  if (error) return { ok: false, reason: error.message };
  if (!staff) return { ok: false, reason: "Bu hesap personel listesinde değil (staff_profiles)." };
  if (!staff.is_active) return { ok: false, reason: "Personel hesabı pasif." };
  return { ok: true };
}

export async function signInStaff(email: string, password: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const check = await ensureStaffSession();
  if (!check.ok) {
    await supabase.auth.signOut();
    throw new Error(check.reason || "Personel yetkisi yok");
  }
}

export async function signOutStaff(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
