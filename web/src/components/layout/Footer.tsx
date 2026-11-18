"use client";

import Link from "next/link";
import Image from "next/image";
import { GOOGLE_PLACE, SITE } from "@/lib/constants";
import { useDistricts } from "@/hooks/useDistricts";
import { usePrefs } from "@/components/prefs/PrefsProvider";

const AIRPORTS = [
  { href: "/sabiha-gokcen-havalimani-arac-kiralama", labelKey: "footer.airportSaw" as const },
  { href: "/istanbul-3-havalimani-arac-kiralama", labelKey: "footer.airportIga" as const },
];

const POPULAR_CARS = [
  { href: "/arac/renault-clio-hb", label: "Renault Clio" },
  { href: "/arac/fiat-yeni-egea-sedan", label: "Fiat Egea" },
  { href: "/arac/peugeot-301", label: "Peugeot 301" },
  { href: "/arac/hyundai-i20", label: "Hyundai i20" },
  { href: "/arac/toyota-corolla", label: "Toyota Corolla" },
  { href: "/arac/hyundai-tucson", label: "Hyundai Tucson" },
];

export function Footer() {
  const { t } = usePrefs();
  const districts = useDistricts();

  const company = [
    { href: "/hakkimizda", label: t("nav.about") },
    { href: "/arac-modelleri", label: t("nav.models") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/rezervasyon-sorgulama", label: t("nav.lookup") },
  ];
  const info = [
    { href: "/kiralama-kosullari", label: t("nav.terms") },
    { href: "/kiralama-sozlesmesi", label: t("nav.contract") },
    { href: "/gizlilik-politikasi", label: t("nav.privacy") },
    { href: "/kisisel-verilerin-korunmasi", label: t("nav.kvkk") },
  ];
  const support = [
    { href: "/sik-sorulan-sorular", label: t("nav.faq") },
    { href: "/iletisim", label: t("nav.contact") },
    { href: "/ofisler", label: t("nav.offices") },
    { href: "/giris", label: t("nav.login") },
  ];

  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <NavCol title={SITE.shortName} items={company} />
        <NavCol title={t("footer.info")} items={info} />
        <NavCol title={t("footer.support")} items={support} />

        <div>
          <Link href="/" aria-label={t("nav.home")} className="inline-block">
            <Image
              src="/assets/zakcar/logo-wordmark-light.png"
              alt={SITE.name}
              width={200}
              height={73}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-6 text-sm font-semibold text-white">{t("footer.help")}</p>
          <a href={`tel:${SITE.phoneTel}`} className="mt-2 block text-sm text-white/70 hover:text-brand">
            {SITE.phone}
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-white/70 hover:text-brand"
          >
            WhatsApp {SITE.whatsappDisplay}
          </a>
          <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm text-white/70 hover:text-brand">
            {SITE.email}
          </a>
          <a
            href={SITE.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-white/70 hover:text-brand"
          >
            {t("contact.facebook")}
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-white/70 hover:text-brand"
          >
            {t("contact.instagram")}
          </a>
          <a
            href={GOOGLE_PLACE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-white hover:text-brand"
          >
            {t("offices.google")}
          </a>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-8 w-0.5 bg-brand" aria-hidden />
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand"
              aria-label={t("contact.phone")}
            >
              <PhoneIcon />
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand"
              aria-label={t("contact.facebook")}
            >
              <FacebookIcon />
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand"
              aria-label={t("contact.instagram")}
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-10 border-t border-white/10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <NavCol
          title={t("footer.popularAirports")}
          items={AIRPORTS.map((a) => ({ href: a.href, label: t(a.labelKey) }))}
        />
        <div className="sm:col-span-2 lg:col-span-2">
          <h3 className="font-semibold text-white">{t("footer.popularDistricts")}</h3>
          <ul className="mt-3 columns-1 gap-x-8 sm:columns-2">
            {districts.map((district) => (
              <li key={district.slug} className="mb-2 break-inside-avoid">
                <Link
                  href={`/${district.slug}`}
                  className="text-sm text-white/65 transition hover:text-white"
                >
                  {t("footer.districtRental", { name: district.name })}
                </Link>
              </li>
            ))}
            <li className="mb-2 break-inside-avoid">
              <Link href="/istanbul-arac-kiralama" className="text-sm text-white/65 transition hover:text-white">
                {t("footer.allDistricts")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">{t("footer.popularCars")}</h3>
          <ul className="mt-3 space-y-2">
            {POPULAR_CARS.map((car) => (
              <li key={car.href}>
                <Link href={car.href} className="text-sm text-white/65 transition hover:text-white">
                  {car.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/arac-modelleri" className="text-sm text-white/65 transition hover:text-white">
                {t("home.allCars")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page border-t border-white/10 pb-20 pt-4 text-xs text-white/45">
        © {new Date().getFullYear()} {SITE.name}. {t("footer.rights")}
      </div>
    </footer>
  );
}

function NavCol({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-white/65 transition hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.1-1h1.4V3h-2.4C11.8 3 11 4.6 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.3-2.8h-2.6Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.35-2.55a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M20 11.9A8 8 0 0 1 7.3 18.6L4 20l1.5-3.2A8 8 0 1 1 20 11.9Zm-8 6.4a6.4 6.4 0 0 0 3.4-.9l.2-.1 2 .5-.5-1.9.2-.2a6.4 6.4 0 1 0-5.3 2.6Zm3.5-4.8c-.2-.1-1.1-.6-1.3-.6s-.3-.1-.5.1-.5.6-.7.8-.2.1-.4 0a5.2 5.2 0 0 1-2.5-2.2c-.2-.3 0-.4.1-.5l.3-.4.1-.2v-.2l-.6-1.4c-.2-.4-.3-.3-.5-.3h-.4c-.2 0-.4.1-.6.3s-.7.7-.7 1.8.7 2.1.8 2.2c.1.2 1.4 2.2 3.5 3 2 .8 2 .5 2.4.5s1.2-.5 1.3-1 .2-.9.1-1-.2-.2-.4-.3Z" />
    </svg>
  );
}
