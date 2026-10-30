import type { MessageKey } from "@/lib/i18n";

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

export function sanitizeExtraCodes(codes: unknown): ExtraId[] {
  if (!Array.isArray(codes)) return [];
  const picked = new Set<ExtraId>();
  for (const code of codes) {
    if (typeof code === "string" && EXTRA_IDS.has(code)) picked.add(code as ExtraId);
  }
  return EXTRA_OPTIONS.map((item) => item.id).filter((id) => picked.has(id));
}

export function extraAmount(ids: readonly string[], days: number): number {
  const safeDays = Math.max(1, days);
  return EXTRA_OPTIONS.filter((item) => ids.includes(item.id)).reduce(
    (sum, item) => sum + item.dailyTry * safeDays,
    0,
  );
}
