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
  const { user, ready, logout } = useCustomer();

  const top = [
    { href: "/hakkimizda", label: t("nav.about") },
    { href: "/ofisler", label: t("nav.offices") },
    { href: "/iletisim", label: t("nav.contact") },
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
  ];
  const main = [
    { href: "/kampanyalar", label: t("nav.campaigns") },
    { href: "/arac-modelleri", label: t("nav.models") },
    { href: "/rezervasyon-sorgulama", label: t("nav.lookup") },
    { href: "/blog", label: t("nav.blog") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-white">
      <div className="container-page flex items-center gap-6 py-3 lg:py-3.5">
        <Link href="/" className="flex shrink-0 items-center" aria-label={t("nav.home")}>
          <Image
            src={SITE.logo}
            alt={SITE.name}
            width={920}
            height={352}
            className="h-11 w-auto object-contain lg:h-[4.25rem]"
            priority
          />
        </Link>

        <div className="ms-auto hidden min-w-0 flex-col items-end gap-2 lg:flex">
          <div className="flex items-center gap-4 text-[13px] font-medium text-ink">
            {top.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-brand">
                {item.label}
              </Link>
            ))}
            <LocaleCurrencySwitch plain />
            {ready && user ? (
              <span className="flex items-center gap-3">
                <Link href="/rezervasyon-sorgulama" className="max-w-[10rem] truncate transition hover:text-brand">
                  {user.name}
                </Link>
                <button type="button" onClick={() => void logout()} className="text-ink-muted transition hover:text-brand">
                  {t("nav.logout")}
                </button>
              </span>
            ) : ready ? (
              <span className="flex items-center gap-2">
                <Link
                  href="/giris"
                  className="inline-flex h-9 items-center rounded-full border border-[#d7dbe3] bg-white px-4 text-[13px] font-semibold text-ink transition hover:border-brand hover:text-brand"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/giris?kayit=1"
                  className="inline-flex h-9 items-center rounded-full bg-brand px-4 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
                >
                  {t("nav.register")}
                </Link>
              </span>
            ) : null}
          </div>

          <nav className="flex items-center gap-1">
            <NavDrop label={t("nav.vehicles")} items={vehicles} />
            <NavDrop label={t("nav.services")} items={services} />
            <NavDrop
              label={t("nav.airports")}
              items={NAV.airports.map((a) => ({ href: a.href, label: t(a.labelKey) }))}
            />
            {main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap px-2.5 py-1 text-[15px] font-medium text-ink transition hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="ms-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border lg:hidden"
          aria-label={t("nav.menu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-surface-border bg-white px-4 py-4 lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <LocaleCurrencySwitch plain />
            {ready && user ? (
              <button
                type="button"
                className="text-sm font-medium text-ink-muted"
                onClick={() => {
                  void logout();
                  setOpen(false);
                }}
              >
                {t("nav.logout")}
              </button>
            ) : ready ? (
              <span className="flex items-center gap-2">
                <Link href="/giris" className="text-sm font-semibold" onClick={() => setOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link
                  href="/giris?kayit=1"
                  className="rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.register")}
                </Link>
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            {[...top, ...vehicles, ...services, ...NAV.airports.map((a) => ({ href: a.href, label: t(a.labelKey) })), ...main].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-soft"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavDrop({ label, items }: { label: string; items: readonly { href: string; label: string }[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="whitespace-nowrap px-2.5 py-1 text-[15px] font-medium text-ink transition group-hover:text-brand"
      >
        {label}
        <span aria-hidden className="ms-1 text-[10px] text-ink-muted">
          ▾
        </span>
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
