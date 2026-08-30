"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV, SITE } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-white/95 backdrop-blur">
      <div className="hidden border-b border-surface-border bg-surface-soft md:block">
        <div className="container-page flex h-10 items-center justify-between text-xs text-ink-muted">
          <span>{SITE.address}</span>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-medium text-brand hover:underline">
            {SITE.phone}
          </a>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Ana Sayfa">
          <Image
            src="/assets/zakcar/logo.png"
            alt={SITE.name}
            width={140}
            height={42}
            className="h-9 w-auto lg:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.top.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/arac-modelleri" className="btn-primary ml-2 !py-2.5 !text-sm">
            Araç Bul
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border lg:hidden"
          aria-label="Menü"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-surface-border bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {[...NAV.top, ...NAV.main].map((item) => (
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
              Araç Bul
            </Link>
          </div>
        </div>
      )}

      <div className="hidden border-t border-surface-border md:block">
        <div className="container-page flex flex-wrap items-center gap-x-1 gap-y-1 py-2">
          <NavDrop label="Araçlar" items={NAV.vehicles} />
          <NavDrop label="Hizmetler" items={NAV.services} />
          <NavDrop label="Havalimanı" items={NAV.airports} />
          <NavDrop label="Şehirler" items={NAV.cities} />
          {NAV.main.map((item) => (
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

function NavDrop({ label, items }: { label: string; items: readonly { href: string; label: string }[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="rounded-lg px-3 py-1.5 text-sm text-ink-muted transition group-hover:bg-surface-soft group-hover:text-ink"
      >
        {label} ▾
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[200px] rounded-xl border border-surface-border bg-white py-2 opacity-0 shadow-search transition group-hover:visible group-hover:opacity-100">
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
