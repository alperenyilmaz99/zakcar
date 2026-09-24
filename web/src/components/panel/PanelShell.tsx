"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { panelLogout } from "@/components/panel/PanelGate";
import { SITE } from "@/lib/constants";

const NAV = [
  { href: "/panel", label: "Özet", exact: true },
  { href: "/panel/araclar", label: "Araçlar" },
  { href: "/panel/kiralamalar", label: "Kiralamalar" },
  { href: "/panel/konumlar", label: "Konumlar" },
  { href: "/panel/kapaklar", label: "Kapaklar" },
] as const;

function NavLink({
  href,
  label,
  exact,
  onClick,
}: {
  href: string;
  label: string;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-brand text-white"
          : "text-ink-muted hover:bg-surface-soft hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export function PanelShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const logout = async () => {
    await panelLogout();
    router.push("/panel/giris");
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-surface-border px-5 py-5">
        <Link href="/panel" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src={SITE.logo}
            alt={SITE.shortName}
            width={160}
            height={44}
            className="h-8 w-auto"
          />
        </Link>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
          Personel Paneli
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            exact={"exact" in item && item.exact === true}
            onClick={() => setOpen(false)}
          />
        ))}
      </nav>

      <div className="border-t border-surface-border p-3 space-y-1">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2.5 text-sm text-ink-muted hover:bg-surface-soft hover:text-ink"
          onClick={() => setOpen(false)}
        >
          Siteye dön
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-ink-muted hover:bg-surface-soft hover:text-ink"
        >
          Çıkış yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-surface-border bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-surface-border px-3 py-1.5 text-sm font-medium text-ink"
        >
          Menü
        </button>
        <span className="text-sm font-semibold text-ink">Personel Paneli</span>
        <button type="button" onClick={logout} className="text-sm text-ink-muted">
          Çıkış
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:flex">
        <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-white lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
          {sidebar}
        </aside>

        <div className="min-w-0 flex-1 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
