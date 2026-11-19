import { readFile } from "fs/promises";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFImage, type PDFPage, type RGB } from "pdf-lib";
import type { Reservation } from "./booking";
import { getVehicleBySlug } from "./data";
import { applyPercent } from "./coupon-math";
import { EXTRA_OPTIONS, IST_DROP_FEE, dropFeeFor, extraAmount, extraCodesFromNotes, includedKm, rentalDays, sanitizeExtraCodes } from "./extras";
import { specLabel } from "./i18n";
import { docLocale, fillDoc, reservationDoc, type DocLocale, type ReservationDoc } from "./reservation-copy";
import { SITE } from "./constants";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 40;
const RED = rgb(227 / 255, 6 / 255, 19 / 255);
const INK = rgb(0.1, 0.12, 0.16);
const MUTED = rgb(0.42, 0.45, 0.5);
const LINE = rgb(0.86, 0.88, 0.91);
const SOFT = rgb(0.96, 0.97, 0.98);
const GREEN = rgb(0.08, 0.52, 0.3);
const GREEN_BG = rgb(0.88, 0.96, 0.91);
const WHITE = rgb(1, 1, 1);
const HEADER = rgb(0.1, 0.12, 0.16);

export type ReservationPdfInput = {
  reservation: Reservation;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    birthDate?: string;
  };
  modelSlug: string;
  extraCodes?: string[];
  coupon?: { code: string; percent: number };
  issuedAt?: Date;
  locale?: DocLocale;
};

type Field = { label: string; value: string; color?: RGB; bold?: boolean };
type PriceLine = { desc: string; duration: string; daily: string; total: string };

export async function buildReservationPdf(input: ReservationPdfInput): Promise<Uint8Array> {
  const locale = docLocale(input.locale);
  const copy = reservationDoc(locale);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fontFile = locale === "ar" ? "NotoNaskhArabic" : "NotoSans";
  const [regularBytes, boldBytes] = await Promise.all([
    readFile(path.join(process.cwd(), "src/fonts", `${fontFile}-Regular.ttf`)),
    readFile(path.join(process.cwd(), "src/fonts", `${fontFile}-Bold.ttf`)),
  ]);
  const embedded = {
    font: await pdf.embedFont(regularBytes, { subset: true }),
    bold: await pdf.embedFont(boldBytes, { subset: true }),
  };
  const font = locale === "ar" ? arabicFont(embedded.font) : embedded.font;
  const bold = locale === "ar" ? arabicFont(embedded.bold) : embedded.bold;
  const logoBytes = await readFile(path.join(process.cwd(), "public/assets/zakcar/logo-header.png"));
  const logo = await pdf.embedPng(logoBytes);
  const page = pdf.addPage([PAGE_W, PAGE_H]);

  const issued = istanbulParts(input.issuedAt ?? new Date(), copy.intl);
  const start = istanbulParts(new Date(input.reservation.startAt), copy.intl);
  const end = istanbulParts(new Date(input.reservation.endAt), copy.intl);
  const vehicle = getVehicleBySlug(input.modelSlug);
  const shortName = (input.reservation.vehicleName || vehicle?.name || "Araç").replace(
    /\s+Araç Kiralama$/i,
    "",
  );
  const spec = `${specLabel(locale, vehicle?.transmission || "—")} / ${specLabel(locale, vehicle?.fuel || "—")}`;
  const customerName = `${titleCase(input.customer.firstName, copy.intl)} ${input.customer.lastName.toLocaleUpperCase(copy.intl)}`.trim();
  const contentW = PAGE_W - M * 2;

  let top = 34;
  const pageOut = locale === "ar" ? arabicPage(page) : page;
  top = drawHeader(pageOut, font, bold, logo, input.reservation.pnr, issued.date, top, copy);
  top += 10;
  pageOut.drawRectangle({ x: M, y: PAGE_H - top, width: contentW, height: 2.2, color: RED });
  top += 16;
  top = drawGreeting(pageOut, font, bold, customerName, M, top, contentW, copy);
  top += 18;
  top = drawSection(pageOut, bold, copy.pdfCustomerSection, top);
  top += 8;
  top = drawInfoCards(pageOut, font, bold, input, customerName, shortName, spec, top, contentW, copy);
  top += 16;
  top = drawSection(pageOut, bold, copy.pdfDeliverySection, top);
  top += 8;
  top = drawDelivery(pageOut, font, bold, input.reservation, start, end, top, contentW, copy);
  top += 16;
  top = drawSection(pageOut, bold, copy.pdfPriceSection, top);
  top += 8;
  top = drawPrices(pageOut, font, bold, input, shortName, end.weekday, top, contentW, copy);
  top += 16;
  const days = rentalDays(input.reservation.startAt, input.reservation.endAt);
  const kmLine = fillDoc(copy.pdfKm, { days, km: includedKm(days).toLocaleString(copy.intl) });
  drawReminders(pageOut, font, bold, top, contentW, kmLine, copy);
  drawFooter(page, font, issued.year);

  return pdf.save();
}

function drawHeader(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  logo: PDFImage,
  pnr: string,
  date: string,
  top: number,
  copy: ReservationDoc,
) {
  const logoH = 52;
  const logoW = (logo.width / logo.height) * logoH;
  const logoY = PAGE_H - top - logoH;
  page.drawImage(logo, { x: M, y: logoY, width: logoW, height: logoH });

  const right = PAGE_W - M;
  const titleY = logoY + logoH - 16;
  drawRight(page, copy.pdfTitle, right, titleY, bold, 13, INK);
  drawRight(page, `${copy.pdfNo}: #${pnr}`, right, titleY - 16, bold, 10, RED);
  drawRight(page, `${copy.pdfDate}: ${date}`, right, titleY - 30, font, 8, MUTED);
  return top + logoH + 4;
}

function drawGreeting(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  name: string,
  x: number,
  top: number,
  width: number,
  copy: ReservationDoc,
) {
  const h = 38;
  const y = PAGE_H - top - h;
  drawRound(page, x, y, width, h, 6, { borderColor: LINE, borderWidth: 1, color: WHITE });
  page.drawRectangle({ x: x + 1, y: y + 8, width: 3, height: h - 16, color: RED });

  const badge = copy.pdfBadge;
  const badgeSize = 7;
  const badgeW = bold.widthOfTextAtSize(badge, badgeSize) + 16;
  const badgeH = 16;
  const badgeX = x + width - 12 - badgeW;
  const badgeY = y + (h - badgeH) / 2;
  drawRound(page, badgeX, badgeY, badgeW, badgeH, 4, { color: GREEN_BG });
  page.drawText(badge, { x: badgeX + 8, y: badgeY + 4.5, size: badgeSize, font: bold, color: GREEN });

  const greeting = fillDoc(copy.pdfGreeting, { name });
  const max = badgeX - x - 22;
  const size = fitSize(greeting, font, 8.5, max);
  page.drawText(greeting, { x: x + 14, y: y + 15, size, font, color: INK });
  return top + h;
}

function flightFields(value: string | null | undefined, copy: ReservationDoc): Field[] {
  const raw = (value || "").trim();
  if (!raw) return [];
  const parts = raw.split(" | ").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 1 && !parts[0].includes(":")) return [{ label: copy.pdfFlight, value: raw }];
  return parts.map((part) => {
    const split = part.indexOf(":");
    if (split < 0) return { label: copy.pdfFlight, value: part };
    const key = part.slice(0, split).trim().toLocaleLowerCase("tr");
    const text = part.slice(split + 1).trim() || "—";
    const pretty = key.startsWith("geli")
      ? copy.pdfArrival
      : key.startsWith("dön") || key.startsWith("don")
        ? copy.pdfReturn
        : key === "not"
          ? copy.pdfNote
          : key.startsWith("ehliyet")
            ? copy.pdfLicense
            : part.slice(0, split).trim();
    return { label: `${pretty}:`, value: text };
  });
}

function drawInfoCards(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  input: ReservationPdfInput,
  customerName: string,
  shortName: string,
  spec: string,
  top: number,
  contentW: number,
  copy: ReservationDoc,
) {
  const left: Field[] = [
    { label: copy.pdfCustomer, value: customerName, bold: true },
    { label: copy.pdfPhone, value: input.customer.phone },
  ];
  const birth = birthLabel(input.customer.birthDate);
  if (birth) left.push({ label: copy.pdfBirth, value: birth });
  for (const field of flightFields(input.reservation.flightNumber, copy)) left.push(field);
  const right: Field[] = [
    { label: copy.pdfVehicle, value: shortName, color: RED, bold: true },
    { label: copy.pdfSpec, value: spec },
  ];
  return drawPair(page, font, bold, left, right, top, contentW);
}

function drawDelivery(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  reservation: Reservation,
  start: IstanbulStamp,
  end: IstanbulStamp,
  top: number,
  contentW: number,
  copy: ReservationDoc,
) {
  const left: Field[] = [
    { label: copy.pdfPickupWhen, value: `${start.date} - ${start.time}`, bold: true },
    { label: copy.pdfPickupWhere, value: reservation.pickup || "—" },
  ];
  const right: Field[] = [
    { label: copy.pdfReturnWhen, value: `${end.date} - ${end.time}`, bold: true },
    { label: copy.pdfReturnWhere, value: reservation.dropoff || reservation.pickup || "—" },
  ];
  return drawPair(page, font, bold, left, right, top, contentW);
}

function drawPair(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  left: Field[],
  right: Field[],
  top: number,
  contentW: number,
) {
  const gap = 12;
  const cardW = (contentW - gap) / 2;
  const h = Math.max(left.length, right.length) * 20 + 16;
  const y = PAGE_H - top - h;
  drawFields(page, font, bold, M, y, cardW, h, left);
  drawFields(page, font, bold, M + cardW + gap, y, cardW, h, right);
  return top + h;
}

function drawFields(page: PDFPage, font: PDFFont, bold: PDFFont, x: number, y: number, w: number, h: number, fields: Field[]) {
  drawRound(page, x, y, w, h, 6, { borderColor: LINE, borderWidth: 1, color: WHITE });
  fields.forEach((field, index) => {
    const baseline = y + h - 20 - index * 20;
    page.drawText(field.label, { x: x + 12, y: baseline, size: 8, font, color: MUTED });
    const valueFont = field.bold ? bold : font;
    const max = w * 0.52;
    const size = fitSize(field.value, valueFont, field.bold ? 9.5 : 8.5, max);
    const textW = valueFont.widthOfTextAtSize(field.value, size);
    page.drawText(field.value, {
      x: x + w - 12 - textW,
      y: baseline,
      size,
      font: valueFont,
      color: field.color || INK,
    });
  });
}

function drawPrices(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  input: ReservationPdfInput,
  shortName: string,
  returnWeekday: string,
  top: number,
  contentW: number,
  copy: ReservationDoc,
) {
  const reservation = input.reservation;
  const days = Math.max(1, reservation.days || 1);
  const daily = Number(reservation.dailyPrice || 0);
  const picked = sanitizeExtraCodes(input.extraCodes);
  const extras = picked.length ? picked : extraCodesFromNotes(reservation.notes);
  const rentalTotal = daily * days;
  const gross = rentalTotal + extraAmount(extras, days);
  const istDrop = dropFeeFor(reservation.pickup, reservation.dropoff);
  const payable = Number(reservation.totalPrice ?? gross + istDrop);
  const discounted = input.coupon?.percent ? applyPercent(gross, input.coupon.percent).total : gross;
  const includeDrop =
    istDrop > 0 && Math.abs(payable - (discounted + istDrop)) <= Math.abs(payable - discounted);
  const dropFee = includeDrop ? IST_DROP_FEE : 0;
  const discount = Math.max(0, Math.round((gross + dropFee) * 100) - Math.round(payable * 100)) / 100;
  const duration = fillDoc(copy.pdfDuration, { days, weekday: returnWeekday });
  const lines: PriceLine[] = [
    {
      desc: fillDoc(copy.pdfRental, { name: shortName }),
      duration,
      daily: money(daily, copy),
      total: money(rentalTotal, copy),
    },
  ];
  for (const id of extras) {
    const option = EXTRA_OPTIONS.find((item) => item.id === id);
    if (!option) continue;
    lines.push({
      desc: copy.extras[id] || id,
      duration,
      daily: money(option.dailyTry, copy),
      total: money(option.dailyTry * days, copy),
    });
  }
  if (dropFee > 0) {
    lines.push({ desc: copy.pdfDrop, duration: "", daily: "", total: money(dropFee, copy) });
  }
  if (discount > 0) {
    const coupon = input.coupon ? ` (${input.coupon.code} %${input.coupon.percent})` : "";
    lines.push({ desc: `${copy.pdfDiscount}${coupon}`, duration: "", daily: "", total: money(-discount, copy) });
  }

  const cols = [contentW * 0.4, contentW * 0.24, contentW * 0.18, contentW * 0.18];
  const headerH = 24;
  let y = PAGE_H - top - headerH;
  drawRound(page, M, y, contentW, headerH, 4, { color: HEADER });
  const headers = [copy.pdfColDesc, copy.pdfColDuration, copy.pdfColDaily, copy.pdfColTotal];
  let hx = M;
  headers.forEach((label, index) => {
    const size = 7;
    const textW = bold.widthOfTextAtSize(label, size);
    const cellX = index === 0 ? hx + 10 : hx + cols[index] - 10 - textW;
    page.drawText(label, { x: cellX, y: y + 8, size, font: bold, color: WHITE });
    hx += cols[index];
  });
  top += headerH + 4;

  for (const line of lines) {
    const rowH = 22;
    y = PAGE_H - top - rowH;
    drawPriceRow(page, font, line, y, cols, rowH);
    top += rowH;
  }

  const totalH = 26;
  y = PAGE_H - top - totalH;
  drawRound(page, M, y, contentW, totalH, 4, { color: SOFT });
  page.drawText(copy.pdfPayable, { x: M + 10, y: y + 9, size: 9, font: bold, color: INK });
  const totalText = money(payable, copy);
  const totalW = bold.widthOfTextAtSize(totalText, 11);
  page.drawText(totalText, { x: PAGE_W - M - 10 - totalW, y: y + 8, size: 11, font: bold, color: RED });
  top += totalH;

  const deposit = Number(reservation.deposit || 0);
  if (deposit > 0) {
    top += 8;
    page.drawText(`${copy.pdfDeposit}: ${money(deposit, copy)}`, {
      x: M,
      y: PAGE_H - top - 10,
      size: 8,
      font,
      color: MUTED,
    });
    top += 14;
  }
  return top;
}

function drawPriceRow(page: PDFPage, font: PDFFont, line: PriceLine, y: number, cols: number[], h: number) {
  const values = [line.desc, line.duration, line.daily, line.total];
  let x = M;
  values.forEach((value, index) => {
    const size = fitSize(value, font, 8, cols[index] - 16);
    const textW = font.widthOfTextAtSize(value, size);
    const cellX = index === 0 ? x + 10 : x + cols[index] - 10 - textW;
    page.drawText(value, { x: cellX, y: y + (h - size) / 2, size, font, color: rgb(0.2, 0.22, 0.26) });
    x += cols[index];
  });
}

function drawReminders(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  top: number,
  contentW: number,
  kmLine: string,
  copy: ReservationDoc,
) {
  top = drawSection(page, bold, copy.pdfSectionReminders, top);
  top += 6;
  const innerW = contentW - 28;
  const lines = [kmLine, ...copy.pdfReminders].flatMap((item) => wrap(`•  ${item}`, font, 8, innerW));
  const h = lines.length * 12 + 16;
  const y = PAGE_H - top - h;
  drawRound(page, M, y, contentW, h, 6, { borderColor: LINE, borderWidth: 1, color: WHITE });
  lines.forEach((line, index) => {
    page.drawText(line, { x: M + 14, y: y + h - 18 - index * 12, size: 8, font, color: MUTED });
  });
  const farewell = copy.pdfFarewell;
  const size = 10;
  const textW = bold.widthOfTextAtSize(farewell, size);
  page.drawText(farewell, {
    x: (PAGE_W - textW) / 2,
    y: y - 28,
    size,
    font: bold,
    color: RED,
  });
}

function drawFooter(page: PDFPage, font: PDFFont, year: string) {
  const y = 36;
  page.drawRectangle({ x: M, y: y + 16, width: PAGE_W - M * 2, height: 0.6, color: LINE });
  const left = `Zak Rent a Car © ${year}`;
  const mid = `zakrentacar.com | ${SITE.email}`;
  page.drawText(left, { x: M, y, size: 8, font, color: INK });
  const midW = font.widthOfTextAtSize(mid, 8);
  page.drawText(mid, { x: (PAGE_W - midW) / 2, y, size: 8, font, color: MUTED });
}

function drawSection(page: PDFPage, bold: PDFFont, title: string, top: number) {
  const y = PAGE_H - top - 11;
  page.drawRectangle({ x: M, y, width: 4, height: 11, color: RED });
  page.drawText(title, { x: M + 12, y: y + 1, size: 9.5, font: bold, color: INK });
  return top + 14;
}

function drawRound(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  _r: number,
  opts: { color?: RGB; borderColor?: RGB; borderWidth?: number },
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color: opts.color,
    borderColor: opts.borderColor,
    borderWidth: opts.borderWidth,
  });
}

function drawRight(page: PDFPage, text: string, right: number, y: number, font: PDFFont, size: number, color: RGB) {
  page.drawText(text, { x: right - font.widthOfTextAtSize(text, size), y, size, font, color });
}

function fitSize(text: string, font: PDFFont, size: number, max: number) {
  let next = size;
  while (next > 6.5 && font.widthOfTextAtSize(text, next) > max) next -= 0.25;
  return next;
}

function wrap(text: string, font: PDFFont, size: number, max: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function visualArabic(input: string): string {
  const runs: { ar: boolean; text: string }[] = [];
  for (const ch of input) {
    const ar = /[\u0600-\u06FF\u0750-\u077F]/.test(ch);
    const last = runs[runs.length - 1];
    if (!last || last.ar !== ar) runs.push({ ar, text: ch });
    else last.text += ch;
  }
  return runs
    .reverse()
    .map((run) => (run.ar ? [...run.text].reverse().join("") : run.text))
    .join("");
}

function arabicPage(page: PDFPage): PDFPage {
  return new Proxy(page, {
    get(target, prop, receiver) {
      if (prop === "drawText") {
        return (text: string, options: Parameters<PDFPage["drawText"]>[1]) =>
          target.drawText(visualArabic(text), options);
      }
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });
}

function arabicFont(font: PDFFont): PDFFont {
  return new Proxy(font, {
    get(target, prop, receiver) {
      if (prop === "widthOfTextAtSize") {
        return (text: string, size: number) => target.widthOfTextAtSize(visualArabic(text), size);
      }
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });
}

function money(value: number, copy: ReservationDoc) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded).toLocaleString(copy.intl)} TL`;
}

function titleCase(value: string, intl: string) {
  const text = value.trim();
  if (!text) return "";
  return text.charAt(0).toLocaleUpperCase(intl) + text.slice(1);
}

function birthLabel(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

type IstanbulStamp = { date: string; time: string; weekday: string; year: string };

function istanbulParts(date: Date, intl: string): IstanbulStamp {
  const map: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat(intl, {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hourCycle: "h23",
  }).formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  const weekday = map.weekday || "";
  return {
    date: `${map.day}/${map.month}/${map.year}`,
    time: `${map.hour}:${map.minute}`,
    weekday: weekday ? weekday.charAt(0).toLocaleUpperCase(intl) + weekday.slice(1) : "",
    year: map.year || String(date.getFullYear()),
  };
}
