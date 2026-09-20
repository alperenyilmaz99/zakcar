import { getCatalog } from "@/lib/data";
import type { FleetStatus, FleetVehicle, PanelStats, Rental } from "@/lib/panel-types";

const OFFICES = [
  { name: "Sabiha Gökçen Havalimanı (SAW)", lat: 40.8986, lng: 29.3092 },
  { name: "İstanbul Havalimanı (IST)", lat: 41.2753, lng: 28.7519 },
  { name: "Kadıköy Ofis", lat: 40.9901, lng: 29.029 },
  { name: "Beşiktaş Ofis", lat: 41.0422, lng: 29.0067 },
  { name: "Pendik Şube", lat: 40.878, lng: 29.257 },
] as const;

const CUSTOMERS = [
  { name: "Ahmet Yılmaz", phone: "0532 111 22 33", email: "ahmet.yilmaz@email.com", licenseNo: "34ABC12345" },
  { name: "Elif Demir", phone: "0533 222 33 44", email: "elif.demir@email.com", licenseNo: "06DEF67890" },
  { name: "Mehmet Kaya", phone: "0542 333 44 55", email: "mehmet.kaya@email.com", licenseNo: "35GHI11223" },
  { name: "Zeynep Arslan", phone: "0555 444 55 66", email: "zeynep.arslan@email.com", licenseNo: "16JKL44556" },
  { name: "Can Öztürk", phone: "0536 555 66 77", email: "can.ozturk@email.com", licenseNo: "41MNO77889" },
  { name: "Selin Aksoy", phone: "0544 666 77 88", email: "selin.aksoy@email.com", licenseNo: "07PQR99001" },
  { name: "Burak Çelik", phone: "0530 777 88 99", email: "burak.celik@email.com", licenseNo: "34STU22334" },
  { name: "Ayşe Kara", phone: "0537 888 99 00", email: "ayse.kara@email.com", licenseNo: "26VWX55667" },
];

const STATUSES: FleetStatus[] = ["musait", "kirada", "rezerveli", "bakimda"];

function plateFor(i: number): string {
  const series = ["ABC", "DEF", "GHI", "JKL", "MNO", "PRS", "STU", "VYZ"][i % 8];
  const num = String(100 + (i * 37) % 900).padStart(3, "0");
  return `34 ${series} ${num}`;
}

function jitter(base: number, seed: number, amount = 0.04): number {
  const n = ((seed * 9301 + 49297) % 233280) / 233280;
  return base + (n - 0.5) * amount;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function daysFromNow(d: number, hour = 10): string {
  const t = new Date();
  t.setDate(t.getDate() + d);
  t.setHours(hour, 0, 0, 0);
  return t.toISOString();
}

let fleetCache: FleetVehicle[] | null = null;
let rentalsCache: Rental[] | null = null;

export function getFleet(): FleetVehicle[] {
  if (fleetCache) return fleetCache;
  const vehicles = getCatalog().vehicles.slice(0, 36);

  fleetCache = vehicles.map((v, i) => {
    const status = STATUSES[i % 4 === 3 && i % 7 === 0 ? 3 : i % 3 === 0 ? 1 : i % 5 === 0 ? 2 : 0];
    const office = OFFICES[i % OFFICES.length];
    const onRoad = status === "kirada";
    const lat = onRoad ? jitter(office.lat, i + 11, 0.12) : office.lat + jitter(0, i, 0.008);
    const lng = onRoad ? jitter(office.lng, i + 29, 0.16) : office.lng + jitter(0, i + 3, 0.01);

    return {
      id: `FLT-${String(i + 1).padStart(3, "0")}`,
      plate: plateFor(i),
      vehicleSlug: v.slug,
      name: v.name.replace(/\s*Araç Kiralama\s*$/i, ""),
      brand: v.brand,
      group: v.group,
      image: v.image,
      status,
      office: office.name,
      lat,
      lng,
      locationLabel: onRoad
        ? `${office.name.split("(")[0].trim()} civarı · hareket halinde`
        : office.name,
      fuelLevel: 35 + ((i * 17) % 60),
      km: 12_000 + i * 1843,
      lastUpdated: hoursAgo((i % 8) + 0.2),
    };
  });

  return fleetCache;
}

export function getRentals(): Rental[] {
  if (rentalsCache) return rentalsCache;
  const fleet = getFleet();
  const rented = fleet.filter((f) => f.status === "kirada" || f.status === "rezerveli");

  rentalsCache = rented.map((f, i) => {
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const isActive = f.status === "kirada";
    return {
      id: `RNT-${String(i + 1).padStart(3, "0")}`,
      pnr: `ZK${String(2400 + i * 13).padStart(6, "0")}`,
      vehicleId: f.id,
      vehicleName: f.name,
      plate: f.plate,
      customer,
      pickup: f.office,
      dropoff: OFFICES[(i + 2) % OFFICES.length].name,
      startAt: isActive ? daysFromNow(-2, 9) : daysFromNow(1, 11),
      endAt: isActive ? daysFromNow(2, 18) : daysFromNow(4, 18),
      status: isActive ? "aktif" : "bekliyor",
      dailyPrice: `${(1200 + (i % 5) * 350).toLocaleString("tr-TR")} TL`,
      deposit: i % 2 === 0 ? "15.540 TL" : "18.500 TL",
      notes: i % 4 === 0 ? "Uçuş SAWxxx — terminal karşılama" : undefined,
    };
  });

  // A few completed ones
  rentalsCache.push(
    {
      id: "RNT-901",
      pnr: "ZK002180",
      vehicleId: fleet[0]?.id ?? "FLT-001",
      vehicleName: fleet[0]?.name ?? "Fiat Egea",
      plate: fleet[0]?.plate ?? "34 ABC 100",
      customer: CUSTOMERS[0],
      pickup: OFFICES[0].name,
      dropoff: OFFICES[0].name,
      startAt: daysFromNow(-8, 10),
      endAt: daysFromNow(-5, 16),
      status: "tamamlandi",
      dailyPrice: "1.450 TL",
      deposit: "15.540 TL",
    },
    {
      id: "RNT-902",
      pnr: "ZK002201",
      vehicleId: fleet[2]?.id ?? "FLT-003",
      vehicleName: fleet[2]?.name ?? "Renault Clio",
      plate: fleet[2]?.plate ?? "34 DEF 200",
      customer: CUSTOMERS[3],
      pickup: OFFICES[1].name,
      dropoff: OFFICES[2].name,
      startAt: daysFromNow(-3, 12),
      endAt: daysFromNow(-3, 14),
      status: "iptal",
      dailyPrice: "1.200 TL",
      deposit: "15.540 TL",
      notes: "Müşteri iptali — 24 saat kala",
    },
  );

  return rentalsCache;
}

export function getPanelStats(): PanelStats {
  const fleet = getFleet();
  const rentals = getRentals();
  const today = new Date().toDateString();

  return {
    total: fleet.length,
    musait: fleet.filter((f) => f.status === "musait").length,
    kirada: fleet.filter((f) => f.status === "kirada").length,
    rezerveli: fleet.filter((f) => f.status === "rezerveli").length,
    bakimda: fleet.filter((f) => f.status === "bakimda").length,
    aktifKiralama: rentals.filter((r) => r.status === "aktif").length,
    bugunTeslim: rentals.filter((r) => new Date(r.startAt).toDateString() === today).length,
    bugunIade: rentals.filter((r) => new Date(r.endAt).toDateString() === today).length,
  };
}

export function getFleetById(id: string): FleetVehicle | undefined {
  return getFleet().find((f) => f.id === id);
}

export function getRentalById(id: string): Rental | undefined {
  return getRentals().find((r) => r.id === id);
}

export const STATUS_LABEL: Record<FleetStatus, string> = {
  musait: "Müsait",
  kirada: "Kirada",
  rezerveli: "Rezerveli",
  bakimda: "Bakımda",
};

export const RENTAL_STATUS_LABEL: Record<string, string> = {
  aktif: "Aktif",
  bekliyor: "Bekliyor",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};
