"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate, useSearch } from "@/hooks/useSearch";
import { useCustomer } from "@/hooks/useCustomer";
import { getVehicleBySlug, vehicleImagePath } from "@/lib/data";
import { isBookableOffice, resolveOfficeId } from "@/lib/offices";
import type { Reservation } from "@/lib/booking";
import { reservationStatusLabel } from "@/lib/reservation-label";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

export default function RezervasyonClient() {
  const params = useSearchParams();
  const slug = params.get("vehicle") ?? "";
  const vehicle = useMemo(() => (slug ? getVehicleBySlug(slug) : undefined), [slug]);
  const { search } = useSearch();
  const { user, accessToken } = useCustomer();
  const { t, formatPrice } = usePrefs();
  const [done, setDone] = useState<Reservation | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const pickupId = resolveOfficeId(search.pickup);
  const dropId = search.differentDrop ? resolveOfficeId(search.drop) : pickupId;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vehicle || saving) return;
    setError("");

    if (!pickupId || !dropId || !isBookableOffice(pickupId) || !isBookableOffice(dropId)) {
      setError(t("book.needOffice"));
      return;
    }

    const fd = new FormData(e.currentTarget);
    const token = await accessToken();
    setSaving(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          modelSlug: vehicle.slug,
          pickupCode: pickupId,
          dropoffCode: dropId,
          startAt: search.from,
          endAt: search.to,
          firstName: String(fd.get("firstName") || ""),
          lastName: String(fd.get("lastName") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          flightNumber: String(fd.get("flight") || ""),
        }),
      });
      const json = (await res.json()) as Reservation & { error?: string };
      if (!res.ok) throw new Error(json.error || t("book.notFound"));
      setDone(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("book.notFound"));
    } finally {
      setSaving(false);
    }
  }

  if (!vehicle) {
    return (
      <div className="container-page py-14 text-center">
        <h1 className="section-title">{t("book.title")}</h1>
        <p className="mt-4 text-ink-muted">{t("book.pickFirst")}</p>
        <Link href="/arac-modelleri" className="btn-primary mt-6">
          {t("book.pickCar")}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container-page max-w-lg py-14 text-center">
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold">{t("book.success")}</h1>
          <p className="mt-3 font-display text-3xl font-bold text-brand">{done.pnr}</p>
          <p className="mt-3 text-sm text-ink-muted">
            {done.vehicleName} · {done.plate}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {formatDate(done.startAt)} — {formatDate(done.endAt)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {done.pickup}
            {done.dropoff && done.dropoff !== done.pickup ? ` → ${done.dropoff}` : ""}
          </p>
          <p className="mt-4 font-display text-xl font-bold text-ink">
            {t("book.total")}: {formatPrice(`${Number(done.totalPrice || 0)} TL`)}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">{reservationStatusLabel(done.status, t)}</p>
          <p className="mt-4 text-sm text-ink-muted">{t("book.payLater")}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={`/rezervasyon-sorgulama?pnr=${encodeURIComponent(done.pnr)}`} className="btn-outline w-full">
              {t("nav.lookup")}
            </Link>
            <Link href="/" className="btn-primary w-full">
              {t("book.home")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [first, ...rest] = (user?.name || "").split(" ");

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">{t("book.title")}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="card p-6 lg:col-span-2">
          <div className="relative mx-auto aspect-[16/10] max-w-xs">
            <Image src={vehicleImagePath(vehicle.image)} alt={vehicle.name} fill className="object-contain" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold">{vehicle.name.replace(" Araç Kiralama", "")}</h2>
          <p className="mt-3 font-display text-2xl font-bold text-brand">{formatPrice(vehicle.price)}</p>
          <p className="mt-2 text-sm text-ink-muted">
            {formatDate(search.from)} — {formatDate(search.to)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {pickupId ? t(officeKey(pickupId)) : t("book.needOffice")}
            {search.differentDrop && dropId && dropId !== pickupId ? ` → ${t(officeKey(dropId))}` : ""}
          </p>
        </div>
        <form key={user?.id || "guest"} onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-3">
          <Input name="firstName" label={t("book.firstName")} required defaultValue={first || ""} />
          <Input name="lastName" label={t("book.lastName")} required defaultValue={rest.join(" ")} />
          <Input name="email" label={t("book.email")} type="email" required defaultValue={user?.email || ""} />
          <Input name="phone" label={t("book.phone")} required autoComplete="tel" />
          <Input name="flight" label={t("book.flight")} autoComplete="off" />
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? t("book.saving") : t("book.complete")}
          </button>
          <p className="text-xs text-ink-muted">{t("book.payLater")}</p>
        </form>
      </div>
    </div>
  );
}

function officeKey(id: string): MessageKey {
  if (id === "iga") return "loc.iga.full";
  if (id === "merkez") return "loc.merkez.full";
  return "loc.saw.full";
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-muted">{label}</span>
      <input {...rest} className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm" />
    </label>
  );
}
