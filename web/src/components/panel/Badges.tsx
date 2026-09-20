import type { FleetStatus } from "@/lib/panel-types";
import { STATUS_LABEL, RENTAL_STATUS_LABEL } from "@/lib/panel-data";

const FLEET_COLORS: Record<FleetStatus, string> = {
  musait: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  kirada: "bg-sky-50 text-sky-700 ring-sky-600/20",
  rezerveli: "bg-amber-50 text-amber-800 ring-amber-600/20",
  bakimda: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const RENTAL_COLORS: Record<string, string> = {
  aktif: "bg-sky-50 text-sky-700 ring-sky-600/20",
  bekliyor: "bg-amber-50 text-amber-800 ring-amber-600/20",
  tamamlandi: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  iptal: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function FleetStatusBadge({ status }: { status: FleetStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${FLEET_COLORS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function RentalStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${RENTAL_COLORS[status] ?? "bg-surface-soft text-ink-muted ring-surface-border"}`}
    >
      {RENTAL_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.round(hours / 24)} gün önce`;
}
