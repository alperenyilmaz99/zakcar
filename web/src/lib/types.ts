export interface Vehicle {
  slug: string;
  name: string;
  summary: string;
  route: string;
  brand: string;
  brandSlug: string;
  fuel: string;
  transmission: string;
  capacity: string;
  group: string;
  price: string;
  image: string;
  banner: string;
  deposit?: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface VehicleCatalog {
  vehicles: Vehicle[];
  groups: string[];
  brands: string[];
}

export interface SearchState {
  pickup: string;
  drop: string;
  from: string;
  to: string;
  differentDrop: boolean;
  group?: string;
  brand?: string;
}

export interface BookingRecord {
  pnr: string;
  vehicle: string;
  customer: Record<string, string>;
  search: Partial<SearchState>;
  createdAt: string;
}

export type SeoPageType = "city" | "airport" | "brand" | "group" | "service";

export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  type: SeoPageType;
  filterGroup?: string;
  filterBrand?: string;
  defaultPickup?: string;
}
