"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV, SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { useDistricts } from "@/hooks/useDistricts";
import { LocaleCurrencySwitch } from "@/components/layout/LocaleCurrencySwitch";
import { useCustomer } from "@/hooks/useCustomer";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = usePrefs();
  const { user, ready, logout } = useCustomer();
  const districtList = useDistricts();

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
  const rentalOptions = [
    { href: "/kredi-kartsiz-arac-kiralama", label: t("nav.noCard") },
    { href: "/findeks-sorgusuz-arac-kiralama", label: t("nav.findeks") },
    { href: "/uzun-donem-arac-kiralama", label: t("nav.longTerm") },
  ];
  const services = [...rentalOptions, { href: "/kurumsal-arac-kiralama", label: t("nav.corporate") }];
  const airports = NAV.airports.map((a) => ({ href: a.href, label: t(a.labelKey) }));
  const districts = districtList.map((district) => ({ href: `/${district.slug}`, label: district.name }));
  const mobileGroups = [
    {
      title: t("nav.corporateTitle"),
      items: [...top, { href: "/kurumsal-arac-kiralama", label: t("nav.corporate") }],
    },
    {
      title: t("nav.classes"),
      items: [...vehicles, { href: "/arac-modelleri", label: t("nav.models") }],
    },
    {
      title: t("nav.services"),
      items: services,
    },
    {
      title: t("nav.locations"),
      items: airports,
    },
    {
      title: t("nav.points"),
      heading: t("nav.istanbul"),
      items: districts,
    },
  ];
  const mobileLinks = [
    { href: "/kampanyalar", label: t("nav.campaigns") },
    { href: "/rezervasyon-sorgulama", label: t("nav.lookup") },
    { href: "/blog", label: t("nav.blog") },
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
            <NavDrop label={t("nav.airports")} items={airports} />
            <NavDrop label={t("nav.points")} heading={t("nav.istanbul")} items={districts} />
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

        <div className="ms-auto flex shrink-0 items-center gap-1 lg:hidden">
          <LocaleCurrencySwitch plain />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border"
            aria-label={t("nav.menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="relative z-10 max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-surface-border bg-white px-4 py-3 lg:hidden">
          {ready ? (
            <div className="mb-3 flex items-center justify-end gap-3">
              {user ? (
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
              ) : (
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
              )}
            </div>
          ) : null}
          <nav className="flex flex-col">
            {mobileGroups.map((group) => (
              <MobileSection
                key={group.title}
                title={group.title}
                heading={"heading" in group ? group.heading : undefined}
                items={group.items}
                onNavigate={() => setOpen(false)}
              />
            ))}
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-surface-border px-3 py-3.5 text-[15px] font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileSection({
  title,
  heading,
  items,
  onNavigate,
}: {
  title: string;
  heading?: string;
  items: readonly { href: string; label: string }[];
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-surface-border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-3.5 text-start text-[15px] font-medium text-ink"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {title}
        <svg
          viewBox="0 0 20 20"
          aria-hidden
          className={`h-4 w-4 shrink-0 text-ink-muted transition ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {expanded ? (
        <div className="max-h-80 overflow-y-auto pb-2">
          {heading ? (
            <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{heading}</p>
          ) : null}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 text-sm text-ink-muted"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NavDrop({
  label,
  items,
  heading,
}: {
  label: string;
  items: readonly { href: string; label: string }[];
  heading?: string;
}) {
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
      <div
        className={`invisible absolute start-0 top-full z-50 rounded-xl border border-surface-border bg-white py-2 opacity-0 shadow-search transition group-hover:visible group-hover:opacity-100 ${
          heading ? "max-h-[70vh] min-w-[280px] overflow-y-auto" : "min-w-[200px]"
        }`}
      >
        {heading ? (
          <p className="sticky top-0 bg-white px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            {heading}
          </p>
        ) : null}
        <div className={heading ? "grid grid-cols-2" : undefined}>
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
    </div>
  );
}
