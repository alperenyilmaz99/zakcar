import nodemailer from "nodemailer";
import { SITE } from "./constants";
import { buildReservationPdf, type ReservationPdfInput } from "./reservation-pdf";

const OFFICE = "info@zakcar.com";

export async function sendReservationConfirmation(input: ReservationPdfInput & { email: string }): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;

  try {
    const pdf = await buildReservationPdf(input);
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const from = process.env.SMTP_FROM?.trim() || `ZakCar <${OFFICE}>`;
    const to = input.email.trim();
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    const name = `${input.customer.firstName} ${input.customer.lastName}`.trim();
    const pnr = input.reservation.pnr;
    await transporter.sendMail({
      from,
      to,
      bcc: to.toLowerCase() === OFFICE ? undefined : OFFICE,
      replyTo: OFFICE,
      subject: `ZakCar Rezervasyon Onayı ${pnr}`,
      text: [
        `Sayın ${name},`,
        "",
        "Rezervasyon talebiniz oluşturuldu. Onay belgesi ektedir.",
        `PNR: ${pnr}`,
        "",
        "ZakCar Rent a Car",
        SITE.phone,
        OFFICE,
      ].join("\n"),
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
