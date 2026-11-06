import { isCouponCode, normalizeCouponCode } from "@/lib/coupon-math";

export type Reservation = {
  pnr: string;
  status: "aktif" | "bekliyor" | "tamamlandi" | "iptal";
  vehicleName: string;
  plate: string;
  pickup: string;
  dropoff: string;
  startAt: string;
  endAt: string;
  dailyPrice: number;
  deposit: number | null;
  totalPrice: number | null;
  days: number;
  flightNumber: string | null;
  notes?: string | null;
};

export type ReservationInput = {
  modelSlug: string;
  pickupCode: string;
  dropoffCode: string;
  startAt: string;
  endAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  flightNumber?: string;
  arrivalFlight?: string;
  returnFlight?: string;
  customerNote?: string;
  birthDate?: string;
  extraCodes?: string[];
  couponCode?: string;
};

const BOOKABLE = new Set(["saw", "iga", "merkez"]);
const FLIGHT = /^[A-Za-z0-9 -]{2,12}$/;

function flightError(value?: string) {
  const flight = (value || "").trim();
  return flight.length > 0 && !FLIGHT.test(flight);
}

export function composeFlightNumber(body: Pick<ReservationInput, "arrivalFlight" | "returnFlight" | "customerNote" | "flightNumber">) {
  const arrival = (body.arrivalFlight || "").trim();
  const returning = (body.returnFlight || "").trim();
  const note = (body.customerNote || "").trim().replace(/\s+/g, " ").slice(0, 400);
  const parts: string[] = [];
  if (arrival) parts.push(`Geliş: ${arrival}`);
  if (returning) parts.push(`Dönüş: ${returning}`);
  if (note) parts.push(`Not: ${note}`);
  if (parts.length) return parts.join(" | ");
  const legacy = (body.flightNumber || "").trim();
  return legacy || undefined;
}

export function rpcFailure(error: { message?: string; code?: string }): { status: number; error: string } {
  const message = error.message || "İşlem başarısız";
  if (/fetch failed|failed to fetch|network/i.test(message)) {
    return { status: 503, error: "Rezervasyon servisine şu an ulaşılamıyor. Biraz sonra tekrar deneyin." };
  }
  const missing =
    error.code === "PGRST202" ||
    /could not find the function/i.test(message) ||
    /schema cache/i.test(message);
  if (missing) {
    return {
      status: 503,
      error:
        "Rezervasyon servisi kurulu değil. Supabase SQL Editor’da web/supabase/booking.sql dosyasını çalıştırın.",
    };
  }
  return { status: 400, error: message };
}

export function validateReservationInput(body: ReservationInput): string | null {
  if (!/^[a-z0-9-]{2,80}$/.test(body.modelSlug || "")) return "Geçersiz araç.";
  if (!BOOKABLE.has(body.pickupCode) || !BOOKABLE.has(body.dropoffCode)) {
    return "Seçtiğiniz ofis henüz rezervasyona açık değil.";
  }
  if ((body.firstName || "").trim().length < 2 || (body.lastName || "").trim().length < 2) {
    return "Ad ve soyad gerekli.";
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email || "")) return "Geçerli bir e-posta girin.";
  if ((body.phone || "").replace(/\D/g, "").length < 10) return "Geçerli bir telefon girin.";
  const start = new Date(body.startAt);
  const end = new Date(body.endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return "Bırakış, alıştan sonra olmalı.";
  }
  if (flightError(body.arrivalFlight) || flightError(body.returnFlight) || flightError(body.flightNumber)) {
    return "Uçuş numarası geçersiz.";
  }
  if ((body.customerNote || "").trim().length > 400) {
    return "Not en fazla 400 karakter olabilir.";
  }
  if (body.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.birthDate)) {
    return "Doğum tarihi geçersiz.";
  }
  if (body.couponCode && !isCouponCode(normalizeCouponCode(body.couponCode))) {
    return "Kupon kodu geçersiz.";
  }
  return null;
}
