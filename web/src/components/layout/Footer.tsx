"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV, SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export function Footer() {
  const { t } = usePrefs();

  return (
    <footer className="mt-16 border-t border-surface-border bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label={t("nav.home")}>
            <Image
              src={SITE.logo}
              alt={SITE.shortName}
              width={220}
              height={80}
              className="h-11 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-sm text-ink-muted">{SITE.address}</p>
          <p className="mt-2">
            <a href={`tel:${SITE.phoneTel}`} className="text-sm font-semibold text-brand">
              {SITE.phone}
            </a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-ink">{t("nav.cities")}</h3>
          <ul className="mt-3 space-y-2">
            {NAV.cities.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-ink-muted hover:text-brand">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-ink">{t("nav.airportsTitle")}</h3>
          <ul className="mt-3 space-y-2">
            {NAV.airports.slice(0, 5).map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="text-sm text-ink-muted hover:text-brand">
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-ink">{t("nav.corporateTitle")}</h3>
          <ul className="mt-3 space-y-2">
            {[
              { href: "/hakkimizda", label: t("nav.about") },
              { href: "/ofisler", label: t("nav.offices") },
              { href: "/iletisim", label: t("nav.contact") },
              { href: "/kiralama-kosullari", label: t("nav.terms") },
              { href: "/gizlilik-politikasi", label: t("nav.privacy") },
              { href: "/kisisel-verilerin-korunmasi", label: t("nav.kvkk") },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-muted hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-ink-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {SITE.shortName}. {t("footer.rights")}
          </span>
          <Link href="/site-haritasi" className="hover:text-brand">
            {t("nav.sitemap")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
