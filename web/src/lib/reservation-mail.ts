import nodemailer from "nodemailer";
import { SITE } from "./constants";
import { docLocale, fillDoc, reservationDoc } from "./reservation-copy";
import { buildReservationPdf, type ReservationPdfInput } from "./reservation-pdf";

const OFFICE = SITE.email;
const VERIFIED_FROM = `ZakCar <${SITE.email}>`;
const COPIES = ["dkaya258008@gmail.com", "kayaomerkaya2104@gmail.com", "alperenylmz1071@gmail.com", OFFICE];

function notifyCopies(customerEmail: string) {
  const skip = customerEmail.trim().toLowerCase();
  const seen = new Set<string>();
  const list: string[] = [];
  for (const address of COPIES) {
    const value = address.trim();
    const key = value.toLowerCase();
    if (!key || key === skip || seen.has(key)) continue;
    seen.add(key);
    list.push(value);
  }
  return list;
}

function when(iso: string, intl: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(intl, {
    timeZone: "Europe/Istanbul",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function senderFrom() {
  const configured = process.env.SMTP_FROM?.trim();
  const domain = SITE.email.split("@")[1]?.toLowerCase();
  if (domain && configured?.toLowerCase().includes(`@${domain}`)) return configured;
  return VERIFIED_FROM;
}

export async function sendReservationConfirmation(input: ReservationPdfInput & { email: string }): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;

  try {
    const locale = docLocale(input.locale);
    const copy = reservationDoc(locale);
    const pdf = await buildReservationPdf({ ...input, locale });
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const from = senderFrom();
    const to = input.email.trim();
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    const name = `${input.customer.firstName} ${input.customer.lastName}`.trim();
    const pnr = input.reservation.pnr;
    const vehicle = input.reservation.vehicleName.replace(/\s+Araç Kiralama$/i, "");
    const pickupWhen = when(input.reservation.startAt, copy.intl);
    const dropoffWhen = when(input.reservation.endAt, copy.intl);
    const dear = fillDoc(copy.mailDear, { name });
    const lines = [
      copy.mailHeadline,
      "",
      dear,
      "",
      copy.mailBody,
      "",
      `${copy.mailPnr}: ${pnr}`,
      `${copy.mailVehicle}: ${vehicle}`,
      `${copy.mailPickup}: ${input.reservation.pickup} — ${pickupWhen}`,
      `${copy.mailDropoff}: ${input.reservation.dropoff} — ${dropoffWhen}`,
      `${copy.mailPhone}: ${input.customer.phone}`,
      "",
      copy.mailHandover,
      "",
      "ZakCar Rent a Car",
      SITE.phone,
      OFFICE,
    ];
    const htmlDir = locale === "ar" ? "rtl" : "ltr";
    const html = `<div dir="${htmlDir}" style="font-family:Arial,sans-serif;color:#1a1d24;line-height:1.5">
<p style="font-size:22px;font-weight:700;margin:0 0 12px">${escapeHtml(copy.mailHeadline)}</p>
<p>${escapeHtml(dear)}</p>
<p>${escapeHtml(copy.mailBody)}</p>
<p><strong>${escapeHtml(copy.mailPnr)}:</strong> ${escapeHtml(pnr)}<br>
<strong>${escapeHtml(copy.mailVehicle)}:</strong> ${escapeHtml(vehicle)}<br>
<strong>${escapeHtml(copy.mailPickup)}:</strong> ${escapeHtml(input.reservation.pickup)} — ${escapeHtml(pickupWhen)}<br>
<strong>${escapeHtml(copy.mailDropoff)}:</strong> ${escapeHtml(input.reservation.dropoff)} — ${escapeHtml(dropoffWhen)}<br>
<strong>${escapeHtml(copy.mailPhone)}:</strong> ${escapeHtml(input.customer.phone)}</p>
<p>${escapeHtml(copy.mailHandover)}</p>
<p>ZakCar Rent a Car<br>${escapeHtml(SITE.phone)}<br>${escapeHtml(OFFICE)}</p>
</div>`;
    await transporter.sendMail({
      from,
      to,
      bcc: notifyCopies(to),
      replyTo: OFFICE,
      subject: `${copy.mailSubject} — ${pnr}`,
      text: lines.join("\n"),
      html,
      attachments: [
        {
          filename: `${copy.fileName} ${pnr}.pdf`,
          content: Buffer.from(pdf),
          contentType: "application/pdf",
        },
      ],
    });
    return true;
  } catch {
    console.error("Rezervasyon onay e-postası gönderilemedi.");
    return false;
  }
}
