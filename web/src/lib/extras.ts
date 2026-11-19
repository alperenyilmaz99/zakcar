import type { MessageKey } from "@/lib/i18n";
import { resolveOfficeId } from "@/lib/offices";

/** Günlük ek ücretler. booking.sql içindeki tutarlarla aynı kalmalı. */
export const EXTRA_OPTIONS = [
  { id: "driver", dailyTry: 56, title: "book.extra.driver", desc: "book.extra.driverDesc" },
  { id: "young", dailyTry: 335, title: "book.extra.young", desc: "book.extra.youngDesc" },
  { id: "hgs", dailyTry: 140, title: "book.extra.hgs", desc: "book.extra.hgsDesc" },
  { id: "child", dailyTry: 167, title: "book.extra.child", desc: "book.extra.childDesc" },
  { id: "winter", dailyTry: 279, title: "book.extra.winter", desc: "book.extra.winterDesc" },
] as const satisfies readonly {
  id: string;
  dailyTry: number;
  title: MessageKey;
  desc: MessageKey;
}[];

export type ExtraId = (typeof EXTRA_OPTIONS)[number]["id"];

const EXTRA_IDS = new Set<string>(EXTRA_OPTIONS.map((item) => item.id));

export function rentalDays(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 1;
  return Math.max(1, Math.ceil((end - start) / 86_400_000));
}

const DAILY_KM = 300;
const TEN_DAY_KM = 2200;
const MONTHLY_KM = 3800;

/** 10 günden kısa: 300 km/gün, 2.200 km’yi aşmaz. 10–29 gün: 2.200 km’den aylık 3.800 km’ye eşit artar. 30 gün ve üzeri bütün süre aylık 3.800 km üzerinden hesaplanır. */
export function includedKm(days: number): number {
  const total = Math.max(1, Math.floor(days));
  if (total >= 30) return Math.round((total * MONTHLY_KM) / 30);
  return includedKmWithinMonth(total);
}

function includedKmWithinMonth(days: number): number {
  if (days <= 0) return 0;
  if (days < 10) return Math.min(days * DAILY_KM, TEN_DAY_KM);
  return TEN_DAY_KM + Math.round(((days - 10) * (MONTHLY_KM - TEN_DAY_KM)) / 20);
}

/** 1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL. */
export function depositForDays(days: number): number {
  const total = Math.max(1, Math.floor(days));
  if (total <= 3) return 5_000;
  if (total <= 10) return 10_000;
  return 20_000;
}

/** İstanbul Havalimanı (IST) bırakış ücreti. Depozitodan ayrıdır. */
export const IST_DROP_FEE = 4_000;

export function officeIsIst(value: string | null | undefined): boolean {
  if (!value) return false;
  const id = resolveOfficeId(value);
  if (id) return id === "iga";
  const text = value.toLocaleUpperCase("tr-TR");
  return text.includes("(IST)") || text.includes(" IGA") || text.startsWith("IGA") || text.includes("İSTANBUL HAVALİMANI") || text.includes("ISTANBUL HAVALIMANI");
}

/** IST alış veya bırakışta en az 5 gün. Diğer yerlerde en az 3 gün. */
export function minimumRentalDays(pickup?: string | null, dropoff?: string | null): number {
  return officeIsIst(pickup) || officeIsIst(dropoff) ? 5 : 3;
}

export function dropFeeFor(pickup?: string | null, dropoff?: string | null): number {
  return officeIsIst(pickup) || officeIsIst(dropoff) ? IST_DROP_FEE : 0;
}

export function sanitizeExtraCodes(codes: unknown): ExtraId[] {
  if (!Array.isArray(codes)) return [];
  const picked = new Set<ExtraId>();
  for (const code of codes) {
    if (typeof code === "string" && EXTRA_IDS.has(code)) picked.add(code as ExtraId);
  }
  return EXTRA_OPTIONS.map((item) => item.id).filter((id) => picked.has(id));
}

const NOTE_MARKERS: { id: ExtraId; marker: string }[] = [
  { id: "young", marker: "genç sürücü" },
  { id: "driver", marker: "ek sürücü" },
  { id: "child", marker: "çocuk koltuğu" },
  { id: "winter", marker: "kış lastiği" },
  { id: "hgs", marker: "hgs" },
];

/** Rezervasyon notundaki ek adlarından kodları çıkarır. PDF yeniden indirilirken satırlar buradan gelir. */
export function extraCodesFromNotes(notes: string | null | undefined): ExtraId[] {
  const text = (notes || "").toLocaleLowerCase("tr-TR");
  const found = new Set<ExtraId>();
  for (const item of NOTE_MARKERS) {
    if (item.id === "hgs") {
      if (/(^|[^a-zçğıöşü])hgs([^a-zçğıöşü]|$)/i.test(text)) found.add("hgs");
      continue;
    }
    if (text.includes(item.marker)) found.add(item.id);
  }
  return EXTRA_OPTIONS.map((item) => item.id).filter((id) => found.has(id));
}

export function extraAmount(ids: readonly string[], days: number): number {
  const safeDays = Math.max(1, days);
  return EXTRA_OPTIONS.filter((item) => ids.includes(item.id)).reduce(
    (sum, item) => sum + item.dailyTry * safeDays,
    0,
  );
}
