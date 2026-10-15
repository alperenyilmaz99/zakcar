import type { MessageKey } from "@/lib/i18n";
import type { Reservation } from "@/lib/booking";

const STATUS_KEY: Record<Reservation["status"], MessageKey> = {
  bekliyor: "book.stBekliyor",
  aktif: "book.stAktif",
  tamamlandi: "book.stDone",
  iptal: "book.stCancel",
};

export function reservationStatusLabel(status: string, t: (key: MessageKey) => string): string {
  return status in STATUS_KEY ? t(STATUS_KEY[status as Reservation["status"]]) : status;
}
