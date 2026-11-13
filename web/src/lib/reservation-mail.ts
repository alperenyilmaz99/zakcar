import nodemailer from "nodemailer";
import { SITE } from "./constants";
import { buildReservationPdf, type ReservationPdfInput } from "./reservation-pdf";

const OFFICE = SITE.email;
const VERIFIED_FROM = `ZakCar <${SITE.email}>`;
const COPIES = ["dkaya258008@gmail.com", "kayaomerkaya2104@gmail.com", OFFICE];

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

function when(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("tr-TR", {
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
    const pdf = await buildReservationPdf(input);
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
    const pickupWhen = when(input.reservation.startAt);
    const dropoffWhen = when(input.reservation.endAt);
    const lines = [
      "Tebrikler, rezervasyonunuz oluştu.",
      "",
      `Sayın ${name},`,
      "",
      "ZakCar rezervasyonunuz başarıyla oluşturuldu. Onay belgeniz bu e-postanın ekinde.",
      "",
      `PNR: ${pnr}`,
      `Araç: ${vehicle}`,
      `Alış: ${input.reservation.pickup} — ${pickupWhen}`,
      `Bırakış: ${input.reservation.dropoff} — ${dropoffWhen}`,
      `Telefon: ${input.customer.phone}`,
      "",
      "Teslimde kimliğinizi ve sürücü belgenizi yanınızda bulundurun. Ödeme araç tesliminde alınır.",
      "",
      "ZakCar Rent a Car",
      SITE.phone,
      OFFICE,
    ];
    const html = `<div style="font-family:Arial,sans-serif;color:#1a1d24;line-height:1.5">
<p style="font-size:22px;font-weight:700;margin:0 0 12px">Tebrikler, rezervasyonunuz oluştu.</p>
<p>Sayın ${escapeHtml(name)},</p>
<p>ZakCar rezervasyonunuz başarıyla oluşturuldu. Onay belgeniz bu e-postanın ekinde.</p>
<p><strong>PNR:</strong> ${escapeHtml(pnr)}<br>
<strong>Araç:</strong> ${escapeHtml(vehicle)}<br>
<strong>Alış:</strong> ${escapeHtml(input.reservation.pickup)} — ${escapeHtml(pickupWhen)}<br>
<strong>Bırakış:</strong> ${escapeHtml(input.reservation.dropoff)} — ${escapeHtml(dropoffWhen)}<br>
<strong>Telefon:</strong> ${escapeHtml(input.customer.phone)}</p>
<p>Teslimde kimliğinizi ve sürücü belgenizi yanınızda bulundurun. Ödeme araç tesliminde alınır.</p>
<p>ZakCar Rent a Car<br>${escapeHtml(SITE.phone)}<br>${escapeHtml(OFFICE)}</p>
</div>`;
    await transporter.sendMail({
      from,
      to,
      bcc: notifyCopies(to),
      replyTo: OFFICE,
      subject: `Tebrikler, rezervasyonunuz oluştu — ${pnr}`,
      text: lines.join("\n"),
      html,
      attachments: [
        {
          filename: `ZakCar Rezervasyon Onayi ${pnr}.pdf`,
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
