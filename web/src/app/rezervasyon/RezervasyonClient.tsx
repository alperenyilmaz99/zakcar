"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate, formatTime, useSearch } from "@/hooks/useSearch";
import { useCustomer } from "@/hooks/useCustomer";
import { getVehicleBySlug, vehicleImagePath } from "@/lib/data";
import { EXTRA_OPTIONS, extraAmount, rentalDays, type ExtraId } from "@/lib/extras";
import { parseTryAmount } from "@/lib/i18n";
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
  const [extras, setExtras] = useState<ExtraId[]>([]);
  const [flight, setFlight] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");

  const pickupId = resolveOfficeId(search.pickup);
  const dropId = search.differentDrop ? resolveOfficeId(search.drop) : pickupId;
  const days = rentalDays(search.from, search.to);
  const daily = vehicle ? parseTryAmount(vehicle.price) : 0;
  const deposit = vehicle?.deposit ? parseTryAmount(vehicle.deposit) : 0;
  const extrasTotal = extraAmount(extras, days);
  const total = daily * days + extrasTotal;
  const km = days * 300;

  function toggleExtra(id: ExtraId) {
    setExtras((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vehicle || saving) return;
    setError("");

    if (!pickupId || !dropId || !isBookableOffice(pickupId) || !isBookableOffice(dropId)) {
      setError(t("book.needOffice"));
      return;
    }

    const fd = new FormData(e.currentTarget);
    const birth = String(fd.get("birth") || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || new Date(birth).getTime() > Date.now()) {
      setError(t("book.birthInvalid"));
      return;
    }

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
          birthDate: birth,
          flightNumber: flight,
          extraCodes: extras,
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
          {done.notes ? <p className="mt-3 text-sm text-ink">{done.notes}</p> : null}
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
  const modelName = vehicle.name.replace(/ Araç Kiralama$/i, "");
  const modelOnly = modelName.toLowerCase().startsWith(vehicle.brand.toLowerCase())
    ? modelName.slice(vehicle.brand.length).trim()
    : modelName;
  const pickupLabel = pickupId ? t(officeKey(pickupId)) : t("book.needOffice");
  const dropLabel = dropId ? t(officeKey(dropId)) : pickupLabel;

  return (
    <div className="bg-surface-soft">
      <form key={user?.id || "guest"} onSubmit={handleSubmit} className="container-page py-8 lg:py-10">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {t("book.kmNotice", { days, km: km.toLocaleString("tr-TR") })}
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-surface-border bg-white p-4 shadow-card sm:p-5">
              <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center">
                <div className="relative mx-auto aspect-[16/10] w-full max-w-[9rem]">
                  <Image src={vehicleImagePath(vehicle.image)} alt={modelName} fill className="object-contain" />
                </div>
                <div>
                  <span className="inline-flex rounded-full bg-surface-soft px-2.5 py-1 text-xs font-semibold text-ink">
                    {vehicle.group}
                  </span>
                  <p className="mt-2 font-display text-lg font-bold text-ink">
                    {vehicle.brand} <span className="font-medium text-ink-muted">+ {modelOnly || modelName}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-muted">
                    <span className="rounded-full border border-surface-border px-2 py-1">{vehicle.fuel}</span>
                    <span className="rounded-full border border-surface-border px-2 py-1">{vehicle.transmission}</span>
                    <span className="rounded-full border border-surface-border px-2 py-1">
                      {vehicle.capacity} {t("card.person")}
                    </span>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-sm text-ink-muted">
                    {formatPrice(`${daily} TL`)} {t("book.daily")}
                  </p>
                  <p className="font-display text-2xl font-bold text-ink">{formatPrice(`${daily * days} TL`)}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {t("card.deposit")}: {formatPrice(`${deposit} TL`)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 border-t border-surface-border pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div>
                  <p className="text-xs text-ink-muted">{t("search.from")}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {formatDate(search.from)} {formatTime(search.from)}
                  </p>
                  <p className="text-sm text-ink-muted">{pickupLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">{t("search.to")}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {formatDate(search.to)} {formatTime(search.to)}
                  </p>
                  <p className="text-sm text-ink-muted">{dropLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCode((open) => !open)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-surface-border px-4 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
                >
                  {t("book.discount")}
                </button>
              </div>
              {showCode && (
                <div className="mt-3">
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder={t("book.discount")}
                    className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm sm:max-w-xs"
                  />
                  {code.trim() ? <p className="mt-2 text-xs text-ink-muted">{t("book.discountHint")}</p> : null}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">{t("book.extras")}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {EXTRA_OPTIONS.map((item) => {
                  const checked = extras.includes(item.id);
                  const amount = item.dailyTry * days;
                  return (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer gap-3 rounded-2xl border bg-white p-4 shadow-card ${
                        checked ? "border-brand" : "border-surface-border"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{t(item.title)}</span>
                        <span className="mt-1 block font-display text-lg font-bold text-brand">
                          + {formatPrice(`${amount} TL`)}
                        </span>
                        <span className="mt-2 block text-xs leading-relaxed text-ink-muted">{t(item.desc)}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleExtra(item.id)}
                        className="mt-1 h-5 w-5 shrink-0 accent-brand"
                      />
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
              <h2 className="font-display text-xl font-bold text-ink">{t("book.yourInfo")}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field name="firstName" label={t("book.firstName")} required defaultValue={first || ""} placeholder="Örn: Ahmet" />
                <Field name="lastName" label={t("book.lastName")} required defaultValue={rest.join(" ")} placeholder="Örn: Yılmaz" />
                <Field name="email" label={t("book.email")} type="email" required defaultValue={user?.email || ""} />
                <Field name="birth" label={t("book.birth")} type="date" required />
                <Field name="phone" label={t("book.phone")} required autoComplete="tel" className="sm:col-span-2" />
              </div>
            </section>
          </div>

          <aside className="rounded-2xl border border-surface-border bg-white p-5 shadow-card lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold text-ink">{t("book.summary")}</h2>
            <SummaryBlock title={t("book.pickupInfo")}>
              <p>{pickupLabel}</p>
              <p>
                {formatDate(search.from)} {formatTime(search.from)}
              </p>
              <label className="mt-2 block text-xs font-medium text-ink-muted">
                {t("book.flightNo")}
                <input
                  value={flight}
                  onChange={(event) => setFlight(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm text-ink"
                  autoComplete="off"
                />
              </label>
              {!flight.trim() ? <p className="text-ink-muted">{t("book.notSet")}</p> : null}
            </SummaryBlock>
            <SummaryBlock title={t("book.dropInfo")}>
              <p>{dropLabel}</p>
              <p>
                {formatDate(search.to)} {formatTime(search.to)}
              </p>
            </SummaryBlock>
            <SummaryBlock title={t("book.vehicleInfo")}>
              <div className="flex items-start justify-between gap-3">
                <p>
                  {modelName}
                  <span className="mt-0.5 block text-ink-muted">
                    {vehicle.group} · {vehicle.fuel} · {vehicle.transmission}
                  </span>
                </p>
                <p className="shrink-0 font-semibold">{formatPrice(`${daily * days} TL`)}</p>
              </div>
              {extras.map((id) => {
                const item = EXTRA_OPTIONS.find((option) => option.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="mt-2 flex items-start justify-between gap-3">
                    <p>{t(item.title)}</p>
                    <p className="shrink-0 font-semibold">{formatPrice(`${item.dailyTry * days} TL`)}</p>
                  </div>
                );
              })}
              <div className="mt-2 flex items-start justify-between gap-3">
                <p>{t("card.deposit")}</p>
                <p className="shrink-0 font-semibold">{formatPrice(`${deposit} TL`)}</p>
              </div>
            </SummaryBlock>
            <SummaryBlock title={t("book.payType")}>
              <p className="font-semibold text-ink">{t("book.payAtPickup")}</p>
            </SummaryBlock>
            <SummaryBlock title={t("book.cover")}>
              <p className="font-semibold text-ink">{t("book.standardCover")}</p>
              <p>{t("book.standardCoverDesc")}</p>
            </SummaryBlock>
            <SummaryBlock title={t("book.included")}>
              <p className="font-semibold text-ink">{t("book.standardCover")}</p>
              <p>{t("book.includedCover")}</p>
              <p className="mt-2 font-semibold text-ink">{t("feat.support.title")}</p>
              <p>{t("book.includedAssist")}</p>
              <p className="mt-2 font-semibold text-ink">{t("book.includedAirport")}</p>
            </SummaryBlock>

            <div className="mt-4 flex items-end justify-between border-t border-dashed border-surface-border pt-4">
              <p className="text-sm font-semibold text-ink">{t("book.totalPrice")}</p>
              <p className="font-display text-2xl font-bold text-ink">{formatPrice(`${total} TL`)}</p>
            </div>
            {error && <p className="mt-3 text-sm text-brand">{error}</p>}
            <button type="submit" className="btn-primary mt-4 w-full" disabled={saving}>
              {saving ? t("book.saving") : t("book.submit")}
            </button>
            <p className="mt-3 text-xs text-ink-muted">{t("book.payLater")}</p>
          </aside>
        </div>
      </form>
    </div>
  );
}

function officeKey(id: string): MessageKey {
  if (id === "iga") return "loc.iga.full";
  if (id === "merkez") return "loc.merkez.full";
  return "loc.saw.full";
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string },
) {
  const { label, className, ...rest } = props;
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input {...rest} className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm" />
    </label>
  );
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 border-t border-dashed border-surface-border pt-4 text-sm text-ink-muted">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink">{title}</p>
      {children}
    </div>
  );
}
