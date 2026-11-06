import { readFile } from "fs/promises";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import type { Reservation } from "./booking";
import { getVehicleBySlug } from "./data";
import { EXTRA_OPTIONS, extraAmount, sanitizeExtraCodes } from "./extras";

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

const EXTRA_TR: Record<string, string> = {
  driver: "Ek Sürücü",
  young: "Genç Sürücü Paketi",
  hgs: "HGS",
  child: "Çocuk Koltuğu",
  winter: "Kış Lastiği",
};

const REMINDERS = [
  "Araç teslim alma sırasında T.C. kimlik belgenizi ve sürücü ehliyetinizi yanınızda bulundurmanız gerekmektedir.",
  "Kiralama süresince oluşabilecek HGS / otoyol geçiş ücretleri ve trafik cezaları sürücü sorumluluğundadır.",
  "Rezervasyon güncellemeleri veya sorularınız için 7/24 müşteri hizmetlerimizle iletişime geçebilirsiniz.",
];

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
};

type Field = { label: string; value: string; color?: RGB; bold?: boolean };
type PriceLine = { desc: string; duration: string; daily: string; total: string };

export async function buildReservationPdf(input: ReservationPdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const [regularBytes, boldBytes] = await Promise.all([
    readFile(path.join(process.cwd(), "src/fonts/NotoSans-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/fonts/NotoSans-Bold.ttf")),
  ]);
  const font = await pdf.embedFont(regularBytes, { subset: true });
  const bold = await pdf.embedFont(boldBytes, { subset: true });
  const page = pdf.addPage([PAGE_W, PAGE_H]);

  const issued = istanbulParts(input.issuedAt ?? new Date());
  const start = istanbulParts(new Date(input.reservation.startAt));
  const end = istanbulParts(new Date(input.reservation.endAt));
  const vehicle = getVehicleBySlug(input.modelSlug);
  const shortName = (input.reservation.vehicleName || vehicle?.name || "Araç").replace(
    /\s+Araç Kiralama$/i,
    "",
  );
  const spec = `${vehicle?.transmission || "—"} / ${vehicle?.fuel || "—"}`;
  const customerName = `${titleTr(input.customer.firstName)} ${input.customer.lastName.toLocaleUpperCase("tr-TR")}`.trim();
  const contentW = PAGE_W - M * 2;

  let top = 34;
  top = drawHeader(page, font, bold, input.reservation.pnr, issued.date, top);
  top += 10;
  page.drawRectangle({ x: M, y: PAGE_H - top, width: contentW, height: 2.2, color: RED });
  top += 16;
  top = drawGreeting(page, font, bold, customerName, M, top, contentW);
  top += 18;
  top = drawSection(page, bold, "MÜŞTERİ VE ARAÇ BİLGİLERİ", top);
  top += 8;
  top = drawInfoCards(page, font, bold, input, customerName, shortName, spec, top, contentW);
  top += 16;
  top = drawSection(page, bold, "TESLİMAT VE İADE BİLGİLERİ", top);
  top += 8;
  top = drawDelivery(page, font, bold, input.reservation, start, end, top, contentW);
  top += 16;
  top = drawSection(page, bold, "FİYATLANDIRMA ÖZETİ", top);
  top += 8;
  top = drawPrices(page, font, bold, input, shortName, end.weekday, top, contentW);
  top += 16;
  drawReminders(page, font, bold, top, contentW);
  drawFooter(page, font, issued.year);

  return pdf.save();
}

function drawHeader(page: PDFPage, font: PDFFont, bold: PDFFont, pnr: string, date: string, top: number) {
  const brandY = PAGE_H - top - 22;
  page.drawText("ZAKCAR", { x: M, y: brandY, size: 22, font: bold, color: RED });
  drawSpaced(page, "RENT A CAR", M, brandY - 12, font, 6.5, INK, 1.35);

  const right = PAGE_W - M;
  drawRight(page, "REZERVASYON ONAYI", right, brandY + 2, bold, 13, INK);
  drawRight(page, `No: #${pnr}`, right, brandY - 14, bold, 10, RED);
  drawRight(page, `Tarih: ${date}`, right, brandY - 26, font, 8, MUTED);
  return top + 48;
}

function drawGreeting(page: PDFPage, font: PDFFont, bold: PDFFont, name: string, x: number, top: number, width: number) {
  const h = 38;
  const y = PAGE_H - top - h;
  drawRound(page, x, y, width, h, 6, { borderColor: LINE, borderWidth: 1, color: WHITE });
  page.drawRectangle({ x: x + 1, y: y + 8, width: 3, height: h - 16, color: RED });

  const badge = "REZERVASYON ONAYLANDI";
  const badgeSize = 7;
  const badgeW = bold.widthOfTextAtSize(badge, badgeSize) + 16;
  const badgeH = 16;
  const badgeX = x + width - 12 - badgeW;
  const badgeY = y + (h - badgeH) / 2;
  drawRound(page, badgeX, badgeY, badgeW, badgeH, 4, { color: GREEN_BG });
  page.drawText(badge, { x: badgeX + 8, y: badgeY + 4.5, size: badgeSize, font: bold, color: GREEN });

  const greeting = `Sayın ${name}, araç rezervasyon talebiniz başarıyla oluşturulmuştur.`;
  const max = badgeX - x - 22;
  const size = fitSize(greeting, font, 8.5, max);
  page.drawText(greeting, { x: x + 14, y: y + 15, size, font, color: INK });
  return top + h;
}

function flightFields(value: string | null | undefined): Field[] {
  const raw = (value || "").trim();
  if (!raw) return [];
  const parts = raw.split(" | ").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 1 && !parts[0].includes(":")) return [{ label: "Uçuş No:", value: raw }];
  return parts.map((part) => {
    const split = part.indexOf(":");
    if (split < 0) return { label: "Uçuş No:", value: part };
    const key = part.slice(0, split).trim().toLocaleLowerCase("tr");
    const text = part.slice(split + 1).trim() || "—";
    const pretty = key.startsWith("geli")
      ? "Geliş Uçuş No"
      : key.startsWith("dön") || key.startsWith("don")
        ? "Dönüş Uçuş No"
        : key === "not"
          ? "Not"
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
) {
  const left: Field[] = [
    { label: "Müşteri Adı Soyadı:", value: customerName, bold: true },
    { label: "Telefon:", value: input.customer.phone },
  ];
  const birth = birthLabel(input.customer.birthDate);
  if (birth) left.push({ label: "Doğum Tarihi:", value: birth });
  for (const field of flightFields(input.reservation.flightNumber)) left.push(field);
  const right: Field[] = [
    { label: "Kiralanan Araç:", value: shortName, color: RED, bold: true },
    { label: "Plaka:", value: input.reservation.plate || "—" },
    { label: "Vites / Yakıt:", value: spec },
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
) {
  const left: Field[] = [
    { label: "Alış Tarihi & Saati:", value: `${start.date} - ${start.time}`, bold: true },
    { label: "Alış Lokasyonu:", value: reservation.pickup || "—" },
  ];
  const right: Field[] = [
    { label: "İade Tarihi & Saati:", value: `${end.date} - ${end.time}`, bold: true },
    { label: "İade Lokasyonu:", value: reservation.dropoff || reservation.pickup || "—" },
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
) {
  const reservation = input.reservation;
  const days = Math.max(1, reservation.days || 1);
  const daily = Number(reservation.dailyPrice || 0);
  const extras = sanitizeExtraCodes(input.extraCodes);
  const rentalTotal = daily * days;
  const gross = rentalTotal + extraAmount(extras, days);
  const payable = Number(reservation.totalPrice ?? gross);
  const discount = Math.max(0, Math.round(gross) - Math.round(payable));
  const duration = `${days} Gün (${returnWeekday} iade)`;
  const lines: PriceLine[] = [
    {
      desc: `${shortName} Araç Kiralama Bedeli`,
      duration,
      daily: money(daily),
      total: money(rentalTotal),
    },
  ];
  for (const id of extras) {
    const option = EXTRA_OPTIONS.find((item) => item.id === id);
    if (!option) continue;
    lines.push({
      desc: EXTRA_TR[id] || id,
      duration,
      daily: money(option.dailyTry),
      total: money(option.dailyTry * days),
    });
  }
  if (discount > 0) {
    const coupon = input.coupon ? ` (${input.coupon.code} %${input.coupon.percent})` : "";
    lines.push({ desc: `İndirim${coupon}`, duration: "", daily: "", total: money(-discount) });
  }

  const cols = [contentW * 0.4, contentW * 0.24, contentW * 0.18, contentW * 0.18];
  const headerH = 24;
  let y = PAGE_H - top - headerH;
  drawRound(page, M, y, contentW, headerH, 4, { color: HEADER });
  const headers = ["AÇIKLAMA", "SÜRE", "GÜNLÜK FİYAT", "TOPLAM TUTAR"];
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
  page.drawText("Ödenecek Toplam Tutar", { x: M + 10, y: y + 9, size: 9, font: bold, color: INK });
  const totalText = money(payable);
  const totalW = bold.widthOfTextAtSize(totalText, 11);
  page.drawText(totalText, { x: PAGE_W - M - 10 - totalW, y: y + 8, size: 11, font: bold, color: RED });
  top += totalH;

  const deposit = Number(reservation.deposit || 0);
  if (deposit > 0) {
    top += 8;
    page.drawText(`Depozito teslimatta tahsil edilir: ${money(deposit)}`, {
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

function drawReminders(page: PDFPage, font: PDFFont, bold: PDFFont, top: number, contentW: number) {
  top = drawSection(page, bold, "ÖNEMLİ HATIRLATMALAR", top);
  top += 6;
  const innerW = contentW - 28;
  const lines = REMINDERS.flatMap((item) => wrap(`•  ${item}`, font, 8, innerW));
  const h = lines.length * 12 + 16;
  const y = PAGE_H - top - h;
  drawRound(page, M, y, contentW, h, 6, { borderColor: LINE, borderWidth: 1, color: WHITE });
  lines.forEach((line, index) => {
    page.drawText(line, { x: M + 14, y: y + h - 18 - index * 12, size: 8, font, color: MUTED });
  });
  const farewell = "ZAKCAR Rent a Car ailesi olarak iyi yolculuklar dileriz!";
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
  const left = `ZAKCAR Rent a Car © ${year}`;
  const mid = "www.zakcar.com | info@zakcar.com";
  const right = "Sayfa 1 / 1";
  page.drawText(left, { x: M, y, size: 8, font, color: INK });
  const midW = font.widthOfTextAtSize(mid, 8);
  page.drawText(mid, { x: (PAGE_W - midW) / 2, y, size: 8, font, color: MUTED });
  drawRight(page, right, PAGE_W - M, y, font, 8, MUTED);
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

function drawSpaced(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color: RGB, extra: number) {
  let cursor = x;
  for (const ch of text) {
    page.drawText(ch, { x: cursor, y, size, font, color });
    cursor += font.widthOfTextAtSize(ch, size) + extra;
  }
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

function money(value: number) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded).toLocaleString("tr-TR")} TL`;
}

function titleTr(value: string) {
  const text = value.trim();
  if (!text) return "";
  return text.charAt(0).toLocaleUpperCase("tr-TR") + text.slice(1);
}

function birthLabel(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

type IstanbulStamp = { date: string; time: string; weekday: string; year: string };

function istanbulParts(date: Date): IstanbulStamp {
  const map: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("tr-TR", {
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
    weekday: weekday ? weekday.charAt(0).toLocaleUpperCase("tr-TR") + weekday.slice(1) : "",
    year: map.year || String(date.getFullYear()),
  };
}
