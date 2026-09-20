export type FleetStatus = "musait" | "kirada" | "rezerveli" | "bakimda";

export type FleetVehicle = {
  id: string;
  plate: string;
  vehicleSlug: string;
  name: string;
  brand: string;
  group: string;
  image: string;
  status: FleetStatus;
  office: string;
  lat: number;
  lng: number;
  locationLabel: string;
  fuelLevel: number;
  km: number;
  lastUpdated: string;
};

export type RentalStatus = "aktif" | "bekliyor" | "tamamlandi" | "iptal";

export type Rental = {
  id: string;
  pnr: string;
  vehicleId: string;
  vehicleName: string;
  plate: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    licenseNo: string;
  };
  pickup: string;
  dropoff: string;
  startAt: string;
  endAt: string;
  status: RentalStatus;
  dailyPrice: string;
  deposit: string;
  notes?: string;
};

export type PanelStats = {
  total: number;
  musait: number;
  kirada: number;
  rezerveli: number;
  bakimda: number;
  aktifKiralama: number;
  bugunTeslim: number;
  bugunIade: number;
};
