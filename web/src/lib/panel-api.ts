import { createClient } from "@/lib/supabase/client";
import type { FleetStatus, FleetVehicle, PanelStats, Rental, RentalStatus } from "@/lib/panel-types";
import { DEFAULT_PROMOS, isMissingPromoTable, mapPromoRow, type PromoCover, type PromoRow } from "@/lib/promo";

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

const PROMO_BUCKET = "promo-covers";

export async function fetchPromoCovers(): Promise<{ items: PromoCover[]; source: "supabase" | "file" }> {
  const supabase = createClient();
  const { data, error } = await supabase.from("promo_covers").select("*").order("sort_order");
  if (!error) {
    return { items: ((data as PromoRow[]) || []).map(mapPromoRow), source: "supabase" };
  }
  if (!isMissingPromoTable(error)) throw error;

  const res = await fetch("/api/promos?all=1", { cache: "no-store" });
  const items = (await res.json()) as PromoCover[];
  return { items: Array.isArray(items) ? items : DEFAULT_PROMOS, source: "file" };
}

async function uploadPromoFile(file: File, source: "supabase" | "file"): Promise<string> {
  if (source === "file") {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/promos/upload", { method: "POST", body });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !json.url) throw new Error(json.error || "Görsel yüklenemedi");
    return json.url;
  }

  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PROMO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PROMO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function storagePathFromUrl(url: string): string | null {
  const marker = `/object/public/${PROMO_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

export async function savePromoCover(
  cover: PromoCover,
  file: File | null,
  source: "supabase" | "file",
): Promise<PromoCover> {
  const imageUrl = file ? await uploadPromoFile(file, source) : cover.imageUrl;
  if (!imageUrl) throw new Error("Kapak görseli gerekli");

  const next: PromoCover = { ...cover, imageUrl };

  if (source === "file") {
    const res = await fetch("/api/promos?all=1", { cache: "no-store" });
    const items = ((await res.json()) as PromoCover[]) || [];
    const idx = items.findIndex((p) => p.id === next.id);
    const list = idx === -1 ? [...items, next] : items.map((p) => (p.id === next.id ? next : p));
    const put = await fetch("/api/promos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    if (!put.ok) {
      const err = (await put.json()) as { error?: string };
      throw new Error(err.error || "Kaydedilemedi");
    }
    return next;
  }

  const supabase = createClient();
  const row = {
    image_url: next.imageUrl,
    href: next.href,
    title: next.title,
    highlight: next.highlight,
    subtitle: next.sub,
    badge: next.badge,
    sort_order: next.sortOrder,
    is_active: next.isActive,
    updated_at: new Date().toISOString(),
  };

  const persisted = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(next.id);
  if (!persisted) {
    const { data, error } = await supabase.from("promo_covers").insert(row).select("*").single();
    if (error) throw error;
    return mapPromoRow(data as PromoRow);
  }

  const { data, error } = await supabase.from("promo_covers").update(row).eq("id", next.id).select("*").single();
  if (error) throw error;
  return mapPromoRow(data as PromoRow);
}

export async function createPromoCover(file: File, source: "supabase" | "file"): Promise<PromoCover> {
  const imageUrl = await uploadPromoFile(file, source);
  const draft: PromoCover = {
    id: `new-${Date.now()}`,
    imageUrl,
    href: "/arac-modelleri",
    title: "Yeni kampanya",
    highlight: "",
    sub: "",
    badge: "Kampanya",
    sortOrder: Date.now(),
    isActive: true,
  };
  return savePromoCover(draft, null, source);
}

export async function deletePromoCover(cover: PromoCover, source: "supabase" | "file"): Promise<void> {
  if (source === "file") {
    const res = await fetch(`/api/promos?id=${encodeURIComponent(cover.id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Silinemedi");
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.from("promo_covers").delete().eq("id", cover.id);
  if (error) throw error;
  const storagePath = storagePathFromUrl(cover.imageUrl);
  if (storagePath) {
    await supabase.storage.from(PROMO_BUCKET).remove([storagePath]);
  }
}

export async function reorderPromoCovers(items: PromoCover[], source: "supabase" | "file"): Promise<void> {
  const ordered = items.map((p, i) => ({ ...p, sortOrder: i }));
  if (source === "file") {
    const put = await fetch("/api/promos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ordered),
    });
    if (!put.ok) throw new Error("Sıra kaydedilemedi");
    return;
  }

  const supabase = createClient();
  await Promise.all(
    ordered.map((p) =>
      supabase.from("promo_covers").update({ sort_order: p.sortOrder, updated_at: new Date().toISOString() }).eq("id", p.id),
    ),
  );
}
