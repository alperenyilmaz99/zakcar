import Link from "next/link";
import Image from "next/image";
import { NAV, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-border bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label="Ana Sayfa">
            <Image
              src="/assets/zakcar/logo.png"
              alt={SITE.shortName}
              width={120}
              height={36}
              className="h-8 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm text-ink-muted">{SITE.address}</p>
          <p className="mt-2">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-sm font-semibold text-brand">
              {SITE.phone}
            </a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-ink">Şehirler</h3>
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
          <h3 className="font-semibold text-ink">Havalimanları</h3>
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
          <h3 className="font-semibold text-ink">Kurumsal</h3>
          <ul className="mt-3 space-y-2">
            {[...NAV.top, { href: "/kiralama-kosullari", label: "Koşullar" }, { href: "/gizlilik-politikasi", label: "Gizlilik" }].map(
              (item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink-muted hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-ink-muted sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE.shortName}. Tüm hakları saklıdır.</span>
          <Link href="/site-haritasi" className="hover:text-brand">
            Site Haritası
          </Link>
        </div>
      </div>
    </footer>
  );
}
