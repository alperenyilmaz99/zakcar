"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { GOOGLE_PLACE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export function ContactBody({
  site,
}: {
  site: {
    phone: string;
    phoneTel: string;
    email: string;
    address: string;
    whatsapp: string;
    whatsappDisplay: string;
    facebook: string;
    instagram: string;
  };
}) {
  const { t } = usePrefs();

  return (
    <div className="container-page max-w-5xl py-10 lg:py-14">
      <h1 className="section-title">{t("nav.contact")}</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-6">
        <article className="card p-6 md:col-span-4">
          <CardTitle icon={<PinIcon />}>{t("contact.place")}</CardTitle>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{t("loc.site.address")}</p>
        </article>

        <article className="card p-6 md:col-span-2">
          <CardTitle icon={<MailIcon />}>{t("contact.email")}</CardTitle>
          <a href={`mailto:${site.email}`} className="mt-4 block text-sm text-ink-muted hover:text-brand">
            {site.email}
          </a>
        </article>

        <article className="card p-6 md:col-span-2">
          <CardTitle icon={<PhoneIcon />}>{t("contact.phone")}</CardTitle>
          <a href={`tel:${site.phoneTel}`} className="mt-4 block text-sm text-ink-muted hover:text-brand">
            {site.phone}
          </a>
        </article>

        <article className="card p-6 md:col-span-2">
          <CardTitle icon={<WhatsAppIcon />}>{t("contact.whatsapp")}</CardTitle>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-sm text-ink-muted hover:text-brand"
          >
            {site.whatsappDisplay}
          </a>
        </article>

        <article className="card flex flex-col p-6 md:col-span-2">
          <CardTitle icon={<OnlineIcon />}>{t("contact.online")}</CardTitle>
          <a href={`tel:${site.phoneTel}`} className="btn-primary mt-5 w-fit">
            {t("contact.callNow")}
          </a>
        </article>
      </div>

      <div className="mt-4 flex items-center justify-center gap-8 rounded-2xl bg-surface-soft px-6 py-5">
        <SocialLink href={`https://wa.me/${site.whatsapp}`} label={t("contact.whatsapp")}>
          <WhatsAppIcon />
        </SocialLink>
        <SocialLink href={site.instagram} label={t("contact.instagram")}>
          <InstagramIcon />
        </SocialLink>
        <SocialLink href={site.facebook} label={t("contact.facebook")}>
          <FacebookIcon />
        </SocialLink>
      </div>

      <p className="mt-6 text-sm">
        <Link href="/sik-sorulan-sorular" className="font-medium text-brand hover:underline">
          {t("nav.faq")}
        </Link>
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-surface-border bg-white">
        <iframe
          title={GOOGLE_PLACE.name}
          src={GOOGLE_PLACE.embed}
          className="h-80 w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-sm text-ink-muted">{t("offices.googleNote")}</p>
          <a href={GOOGLE_PLACE.href} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {t("offices.google")}
          </a>
        </div>
      </div>
    </div>
  );
}

function CardTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-brand">{icon}</span>
      <h2 className="font-display text-xl font-bold text-ink">{children}</h2>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-brand transition hover:text-brand-dark"
    >
      {children}
    </a>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 4h2l1.2 3.2-1.6 1.1a12 12 0 0 0 5.1 5.1l1.1-1.6L19 13v2a2 2 0 0 1-2.2 2A15 15 0 0 1 5 7.2 2 2 0 0 1 7 5Z" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
      <path d="M12 3.2A8.7 8.7 0 0 0 4.6 16.3L3.4 20.6l4.4-1.2A8.8 8.8 0 1 0 12 3.2Zm4.8 12.3c-.2.6-1.2 1.1-1.6 1.1-.4.1-.9.1-1.5-.1-.3-.1-.8-.3-1.3-.5-2.3-1-3.8-3.3-3.9-3.5-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4.2.5.6 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.2.3-.3.5l-.3.3c-.1.1-.2.2-.1.4.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.3.1.5 0l.7-.8c.1-.2.3-.1.5-.1l1.5.7c.2.1.3.2.4.3.1.3.1.8-.1 1.3Z" />
    </svg>
  );
}

function OnlineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
      <path d="M12 3.2 14.2 8l5.3.5-4 3.6 1.2 5.2L12 14.8 7.3 17.3 8.5 12 4.5 8.5 9.8 8 12 3.2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.35-2.55a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.1-1h1.4V3h-2.4C11.8 3 11 4.6 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.3-2.8h-2.6Z" />
    </svg>
  );
}
