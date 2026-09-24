"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { genPnr, formatDate, useSearch } from "@/hooks/useSearch";
import { getVehicleBySlug, vehicleImagePath } from "@/lib/data";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export default function RezervasyonClient() {
  const params = useSearchParams();
  const slug = params.get("vehicle") ?? "";
  const vehicle = useMemo(() => (slug ? getVehicleBySlug(slug) : undefined), [slug]);
  const { search } = useSearch();
  const { t, formatPrice } = usePrefs();
  const [done, setDone] = useState(false);
  const [pnr, setPnr] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const code = genPnr();
    localStorage.setItem(
      "zakcar_last_booking",
      JSON.stringify({
        pnr: code,
        vehicle: vehicle?.name ?? slug,
        customer: Object.fromEntries(fd.entries()),
        search,
        createdAt: new Date().toISOString(),
      }),
    );
    setPnr(code);
    setDone(true);
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
          <p className="mt-3 font-display text-3xl font-bold text-brand">{pnr}</p>
          <Link href="/" className="btn-primary mt-8">
            {t("book.home")}
          </Link>
        </div>
      </div>
    );
  }

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
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-3">
          <Input name="firstName" label={t("book.firstName")} required />
          <Input name="lastName" label={t("book.lastName")} required />
          <Input name="email" label={t("book.email")} type="email" required />
          <Input name="phone" label={t("book.phone")} required />
          <button type="submit" className="btn-primary w-full">
            {t("book.complete")}
          </button>
        </form>
      </div>
    </div>
  );
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
