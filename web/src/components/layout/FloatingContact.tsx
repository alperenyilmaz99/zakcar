"use client";

import { SITE } from "@/lib/constants";
import { usePrefs } from "@/components/prefs/PrefsProvider";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="currentColor">
      <path d="M17.47 14.38c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.19.28-.71.9-.87 1.08-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.19-.28.28-.46.1-.19.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.19 0-.49.07-.74.35-.25.28-.97.95-.97 2.31s1 2.68 1.13 2.87c.14.19 1.96 2.99 4.75 4.19.66.29 1.18.46 1.58.58.67.21 1.27.18 1.75.11.53-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32ZM12.04 21.2h-.01a9.17 9.17 0 0 1-4.67-1.28l-.33-.2-3.47.91.93-3.38-.22-.35a9.16 9.16 0 0 1-1.4-4.88 9.2 9.2 0 0 1 9.18-9.2c2.45 0 4.76.96 6.49 2.7a9.13 9.13 0 0 1 2.69 6.5 9.2 9.2 0 0 1-9.19 9.18Zm7.9-16.99A10.76 10.76 0 0 0 12.04 1C6.03 1 1.14 5.89 1.14 11.9c0 1.91.5 3.78 1.45 5.43L1 23l5.82-1.53a10.82 10.82 0 0 0 5.21 1.33h.01c6.01 0 10.9-4.89 10.9-10.9 0-2.91-1.13-5.65-3.19-7.7Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="currentColor">
      <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

export function FloatingContact() {
  const { t } = usePrefs();
  const waHref = `https://wa.me/${SITE.whatsapp}`;

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-4 sm:bottom-7 sm:right-6">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t("contact.whatsapp")}: ${SITE.whatsappDisplay}`}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_10px_rgba(37,211,102,0.22)] transition hover:scale-105 hover:shadow-[0_0_0_12px_rgba(37,211,102,0.3)]"
      >
        <WhatsAppIcon />
      </a>
      <a
        href={`tel:${SITE.phoneTel}`}
        aria-label={`${t("contact.phone")}: ${SITE.phone}`}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_0_0_10px_rgba(227,6,19,0.22)] transition hover:scale-105 hover:shadow-[0_0_0_12px_rgba(227,6,19,0.3)]"
      >
        <PhoneIcon />
      </a>
    </div>
  );
}
