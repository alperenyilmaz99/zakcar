import { DICTS, LOCALES, type MessageKey } from "@/lib/i18n";

export const OFFICES = [
  { id: "saw", nameKey: "loc.saw.full", bookable: true },
  { id: "iga", nameKey: "loc.iga.full", bookable: true },
  { id: "merkez", nameKey: "loc.merkez.full", bookable: true },
  { id: "esenboga", nameKey: "loc.esenboga.full", bookable: false },
  { id: "antalya", nameKey: "loc.antalya.full", bookable: false },
  { id: "izmir", nameKey: "loc.izmir.full", bookable: false },
  { id: "bodrum", nameKey: "loc.bodrum.full", bookable: false },
] as const satisfies ReadonlyArray<{ id: string; nameKey: MessageKey; bookable: boolean }>;

export type OfficeId = (typeof OFFICES)[number]["id"];

export function resolveOfficeId(value: string): OfficeId | undefined {
  if (!value) return undefined;
  const byId = OFFICES.find((office) => office.id === value);
  if (byId) return byId.id;
  for (const office of OFFICES) {
    if (LOCALES.some((locale) => DICTS[locale.code][office.nameKey] === value)) return office.id;
  }
  return undefined;
}

export function isBookableOffice(value: string): boolean {
  const id = resolveOfficeId(value);
  return Boolean(id && OFFICES.find((office) => office.id === id)?.bookable);
}
