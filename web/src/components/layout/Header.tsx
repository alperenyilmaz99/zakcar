"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV, SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { LocaleCurrencySwitch } from "@/components/layout/LocaleCurrencySwitch";
import { useCustomer } from "@/hooks/useCustomer";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = usePrefs();
  const { user, logout } = useCustomer();

  const top = [
    { href: "/hakkimizda", label: t("nav.about") },
    { href: "/ofisler", label: t("nav.offices") },
    { href: "/iletisim", label: t("nav.contact") },
    { href: "/sik-sorulan-sorular", label: t("nav.faq") },
  ];
  const vehicles = [
    { href: "/4x4-suv-arac-kiralama", label: t("nav.suv") },
    { href: "/7-10-kisilik-arac-kiralama", label: t("nav.people7") },
    { href: "/ekonomik-arac-kiralama", label: t("nav.economic") },
    { href: "/luks-arac-kiralama", label: t("nav.luxury") },
  ];
  const services = [
    { href: "/kredi-kartsiz-arac-kiralama", label: t("nav.noCard") },
    { href: "/uzun-donem-arac-kiralama", label: t("nav.longTerm") },
    { href: "/kurumsal-arac-kiralama", label: t("nav.corporate") },
    { href: "/sik-sorulan-sorular", label: t("nav.faq") },
  ];
  const main = [
    { href: "/arac-modelleri", label: t("nav.models") },
    { href: "/rezervasyon-sorgulama", label: t("nav.lookup") },
    { href: "/blog", label: t("nav.blog") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-white/95 backdrop-blur">
      <div className="border-b border-surface-border bg-white">
        <div className="container-page flex min-h-12 flex-wrap items-center justify-end gap-x-4 gap-y-1 py-1.5 text-[13px]">
          <Link
            href="/rezervasyon-sorgulama"
            className="hidden font-medium text-ink-muted transition hover:text-ink sm:inline"
          >
            {t("nav.myBookings")}
          </Link>
          <span className="hidden h-3.5 w-px bg-surface-border sm:block" aria-hidden />
          {user ? (
            <span className="hidden items-center gap-2 sm:flex">
              <span className="max-w-[9rem] truncate font-medium text-ink">{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="font-medium text-ink-muted transition hover:text-brand"
              >
                {t("nav.logout")}
              </button>
            </span>
          ) : (
            <Link href="/giris" className="hidden font-medium text-ink-muted transition hover:text-ink sm:inline">
              {t("nav.loginOrJoin")}
            </Link>
          )}
          <LocaleCurrencySwitch plain />
          <a
            href={`tel:${SITE.phoneTel}`}
            className="ms-1 flex items-center gap-2.5 rounded-xl py-0.5 pe-1 ps-0.5 text-brand transition hover:bg-brand-light"
          >
            <CallCenterMark />
            <span className="leading-none">
              <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-brand sm:block">
                {t("header.callCenter")}
              </span>
              <span className="font-display text-base font-bold tracking-tight text-brand sm:mt-0.5 sm:block sm:text-xl">
                {SITE.phone}
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={t("nav.home")}>
          <Image
            src={SITE.logo}
            alt={SITE.name}
            width={220}
            height={80}
            className="h-11 w-auto object-contain lg:h-[52px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {top.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/arac-modelleri" className="btn-primary ml-2 !py-2.5 !text-sm">
            {t("nav.findCar")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border"
            aria-label={t("nav.menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-surface-border bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/rezervasyon-sorgulama"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-soft"
              onClick={() => setOpen(false)}
            >
              {t("nav.myBookings")}
            </Link>
            {user ? (
              <button
                type="button"
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-surface-soft"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                {t("nav.logout")}
              </button>
            ) : (
              <Link
                href="/giris"
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-soft"
                onClick={() => setOpen(false)}
              >
                {t("nav.loginOrJoin")}
              </Link>
            )}
            {[...top, ...main].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-soft"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/arac-modelleri" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              {t("nav.findCar")}
            </Link>
          </div>
        </div>
      )}

      <div className="hidden border-t border-surface-border md:block">
        <div className="container-page flex flex-wrap items-center gap-x-1 gap-y-1 py-2">
          <NavDrop label={t("nav.vehicles")} items={vehicles} />
          <NavDrop label={t("nav.services")} items={services} />
          <NavDrop
            label={t("nav.airports")}
            items={NAV.airports.map((a) => ({ href: a.href, label: t(a.labelKey) }))}
          />
          <NavDrop
            label={t("nav.cities")}
            items={NAV.cities.map((c) => ({ href: c.href, label: t(c.labelKey) }))}
          />
          {main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm text-ink-muted transition hover:bg-surface-soft hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function CallCenterMark() {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-display text-[11px] font-black leading-none tracking-tight text-white"
      aria-hidden
    >
      7/24
    </span>
  );
}

function NavDrop({ label, items }: { label: string; items: readonly { href: string; label: string }[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="rounded-lg px-3 py-1.5 text-sm text-ink-muted transition group-hover:bg-surface-soft group-hover:text-ink"
      >
        {label} ▾
      </button>
      <div className="invisible absolute start-0 top-full z-50 min-w-[200px] rounded-xl border border-surface-border bg-white py-2 opacity-0 shadow-search transition group-hover:visible group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm text-ink hover:bg-brand-light hover:text-brand"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
