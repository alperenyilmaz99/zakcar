import { createClient } from "@/lib/supabase/client";
import type { FleetStatus, FleetVehicle, PanelStats, Rental, RentalStatus } from "@/lib/panel-types";
import {
  DEFAULT_PROMOS,
  isMissingPromoTable,
  mapPromoRow,
  type PromoCover,
  type PromoRow,
  type PromoSlot,
} from "@/lib/promo";

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
  total_price_try: number | null;
  deposit_try: number | null;
  flight_number: string | null;
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
    recordId: row.id,
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
    totalPrice: money(row.total_price_try),
    deposit: money(row.deposit_try),
    flightNumber: row.flight_number || "",
    notes: row.notes || undefined,
  };
}

export type FleetModelOption = {
  id: string;
  name: string;
  slug: string;
  fuel: string | null;
  transmission: string | null;
  group: string;
};

export async function fetchFleetFormOptions(): Promise<{ models: FleetModelOption[] }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vehicle_models")
    .select("id,name,slug,fuel,transmission,vehicle_group")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  return {
    models: ((data || []) as Array<{
      id: string;
      name: string;
      slug: string;
      fuel: string | null;
      transmission: string | null;
      vehicle_group: string;
    }>).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      fuel: row.fuel,
      transmission: row.transmission,
      group: row.vehicle_group,
    })),
  };
}

function nextFleetCode(codes: string[]): string {
  let max = 0;
  for (const code of codes) {
    const match = /^FLT-(\d+)$/.exec(code);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `FLT-${String(max + 1).padStart(3, "0")}`;
}

export async function uploadVehicleImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Yalnızca görsel yükleyin.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Görsel 5 MB'dan küçük olmalı.");
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `vehicles/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("promo-covers").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  const { data } = supabase.storage.from("promo-covers").getPublicUrl(path);
  return data.publicUrl;
}

export async function createFleetVehicle(input: {
  modelId: string;
  km: number;
  imageUrl?: string;
  fuel: string;
  transmission: string;
  group: string;
}): Promise<void> {
  if (!input.modelId) throw new Error("Araç modeli seçin.");
  const km = Math.max(0, Math.round(input.km));

  const supabase = createClient();
  const { data: existing, error: listError } = await supabase.from("fleet_vehicles").select("fleet_code");
  if (listError) throw listError;
  const fleetCode = nextFleetCode((existing || []).map((row) => row.fleet_code as string));

  const { error } = await supabase.from("fleet_vehicles").insert({
    fleet_code: fleetCode,
    plate: fleetCode,
    model_id: input.modelId,
    status: "musait",
    fuel_level: 100,
    odometer_km: km,
  });
  if (error) throw error;
  await updateModelDetails(input.modelId, input);
  await syncModelActive(input.modelId);
}

async function updateModelDetails(
  modelId: string,
  input: { imageUrl?: string; fuel: string; transmission: string; group: string },
): Promise<void> {
  const supabase = createClient();
  const row: { fuel: string; transmission: string; vehicle_group: string; image_url?: string; is_active: boolean } = {
    fuel: input.fuel,
    transmission: input.transmission,
    vehicle_group: input.group,
    is_active: true,
  };
  if (input.imageUrl) row.image_url = input.imageUrl;
  const { error } = await supabase.from("vehicle_models").update(row).eq("id", modelId);
  if (error) throw error;
}

export async function updateFleetVehicle(input: {
  recordId: string;
  modelId: string;
  km: number;
  imageUrl?: string;
  fuel: string;
  transmission: string;
  group: string;
}): Promise<void> {
  if (!input.modelId) throw new Error("Araç modeli seçin.");
  const supabase = createClient();
  const { data: current, error: readError } = await supabase
    .from("fleet_vehicles")
    .select("model_id")
    .eq("id", input.recordId)
    .maybeSingle();
  if (readError) throw readError;
  const { error } = await supabase
    .from("fleet_vehicles")
    .update({
      model_id: input.modelId,
      odometer_km: Math.max(0, Math.round(input.km)),
    })
    .eq("id", input.recordId);
  if (error) throw error;
  await updateModelDetails(input.modelId, input);
  await syncModelActive(input.modelId);
  const previous = current?.model_id as string | undefined;
  if (previous && previous !== input.modelId) await syncModelActive(previous);
}

async function syncModelActive(modelId: string): Promise<void> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("fleet_vehicles")
    .select("id", { count: "exact", head: true })
    .eq("model_id", modelId);
  if (error) throw error;
  const { error: updateError } = await supabase
    .from("vehicle_models")
    .update({ is_active: (count ?? 0) > 0 })
    .eq("id", modelId);
  if (updateError) throw updateError;
}

export async function deleteFleetVehicle(recordId: string): Promise<void> {
  const supabase = createClient();
  const { data: current, error: readError } = await supabase
    .from("fleet_vehicles")
    .select("model_id")
    .eq("id", recordId)
    .maybeSingle();
  if (readError) throw readError;
  const { count, error: countError } = await supabase
    .from("rentals")
    .select("id", { count: "exact", head: true })
    .eq("fleet_vehicle_id", recordId);
  if (countError) throw countError;
  if ((count ?? 0) > 0) {
    throw new Error("Bu aracın kiralama kaydı var. Geçmişi duran araç silinemez.");
  }

  const { error } = await supabase.from("fleet_vehicles").delete().eq("id", recordId);
  if (error) {
    if (/foreign key|rentals/i.test(error.message)) {
      throw new Error("Bu aracın kiralama kaydı var. Geçmişi duran araç silinemez.");
    }
    throw error;
  }
  const modelId = current?.model_id as string | undefined;
  if (modelId) await syncModelActive(modelId);
}

export async function fetchFleet(): Promise<FleetVehicle[]> {
  const supabase = createClient();
  await alignModelsWithFleet();
  const { data, error } = await supabase.from("v_fleet_board").select("*").order("fleet_code");
  if (error) throw error;
  return ((data as FleetRow[]) || []).map(mapFleet);
}

async function alignModelsWithFleet(): Promise<void> {
  const supabase = createClient();
  const [{ data: models, error: modelError }, { data: fleet, error: fleetError }] = await Promise.all([
    supabase.from("vehicle_models").select("id,is_active"),
    supabase.from("fleet_vehicles").select("model_id"),
  ]);
  if (modelError || fleetError) return;
  const used = new Set((fleet || []).map((row) => row.model_id as string));
  await Promise.all(
    ((models || []) as { id: string; is_active: boolean }[])
      .filter((model) => model.is_active !== used.has(model.id))
      .map((model) => supabase.from("vehicle_models").update({ is_active: used.has(model.id) }).eq("id", model.id)),
  );
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
const SORT_MAX = 2_147_483_647;

function nextSortOrder(current: number[]) {
  const max = current.reduce((highest, value) => (Number.isFinite(value) && value > highest ? value : highest), -1);
  return Math.min(max + 1, SORT_MAX);
}

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
    sort_order: Math.max(0, Math.min(Math.round(Number(next.sortOrder)) || 0, SORT_MAX)),
    is_active: next.isActive,
    slot: next.slot || "hero",
    updated_at: new Date().toISOString(),
  };

  const persisted = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(next.id);
  if (!persisted) {
    const { data, error } = await supabase.from("promo_covers").insert(row).select("*").single();
    if (error) throw slotColumnError(error);
    return mapPromoRow(data as PromoRow);
  }

  const { data, error } = await supabase.from("promo_covers").update(row).eq("id", next.id).select("*").single();
  if (error) throw slotColumnError(error);
  return mapPromoRow(data as PromoRow);
}

function slotColumnError(error: { message: string }): Error {
  if (/slot/i.test(error.message)) {
    return new Error("Arka plan görselini kaydetmek için Supabase SQL Editor’da promo-covers.sql dosyasını yeniden çalıştırın.");
  }
  return new Error(error.message);
}

export async function createPromoCover(
  file: File,
  source: "supabase" | "file",
  slot: PromoSlot,
): Promise<PromoCover> {
  const imageUrl = await uploadPromoFile(file, source);
  let sortOrder = 0;
  if (source === "file") {
    const res = await fetch("/api/promos?all=1", { cache: "no-store" });
    const items = (await res.json()) as PromoCover[];
    sortOrder = nextSortOrder((Array.isArray(items) ? items : []).map((item) => item.sortOrder));
  } else {
    const supabase = createClient();
    const { data, error } = await supabase.from("promo_covers").select("sort_order");
    if (error) throw error;
    sortOrder = nextSortOrder(((data || []) as { sort_order: number | null }[]).map((row) => Number(row.sort_order)));
  }
  const draft: PromoCover = {
    id: `new-${crypto.randomUUID()}`,
    imageUrl,
    title: slot === "backdrop" ? "Ana sayfa arka planı" : "Yeni kampanya",
    highlight: "",
    sub: "",
    badge: slot === "backdrop" ? "" : "Kampanya",
    href: slot === "backdrop" ? "/" : "/arac-modelleri",
    sortOrder,
    isActive: true,
    slot,
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

export async function updateRentalStatus(id: string, status: RentalStatus): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("rentals").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function downloadReservationPdf(pnr: string): Promise<void> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
  const res = await fetch(`/api/panel/reservations/pdf?pnr=${encodeURIComponent(pnr)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = "PDF indirilemedi.";
    try {
      const json = (await res.json()) as { error?: string };
      if (json.error) message = json.error;
    } catch {
      /* yanıt PDF değilse metin de olmayabilir */
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ZakCar Rezervasyon Onayi ${pnr}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function updateFleetUnit(
  recordId: string,
  patch: { status?: FleetStatus; fuelLevel?: number; km?: number },
): Promise<void> {
  const supabase = createClient();
  const row: Record<string, string | number> = {};
  if (patch.status) {
    row.status = patch.status;
    row.last_status_at = new Date().toISOString();
  }
  if (patch.fuelLevel != null) row.fuel_level = patch.fuelLevel;
  if (patch.km != null) row.odometer_km = patch.km;
  const { error } = await supabase.from("fleet_vehicles").update(row).eq("id", recordId);
  if (error) throw error;
}

export async function releaseFleetVehicle(recordId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("staff_release_vehicle", { p_vehicle: recordId });
  if (error && /could not find the function/i.test(error.message)) {
    await updateFleetUnit(recordId, { status: "musait" });
    return;
  }
  if (error) throw error;
}

export async function saveFleetLocation(
  recordId: string,
  lat: number,
  lng: number,
  label: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("vehicle_locations").upsert(
    {
      fleet_vehicle_id: recordId,
      lat,
      lng,
      location_label: label,
      recorded_at: new Date().toISOString(),
    },
    { onConflict: "fleet_vehicle_id" },
  );
  if (error) throw error;
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
