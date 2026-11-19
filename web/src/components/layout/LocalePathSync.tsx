"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { localizeHref, localeFromPath, takeLocalePick } from "@/lib/localized-paths";

export function LocalePathSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, setLocale } = usePrefs();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/panel")) return;
    const query = searchParams.toString();
    const current = pathname + (query ? `?${query}` : "");
    const picked = takeLocalePick();
    if (picked) {
      const target = localizeHref(current, picked);
      if (target !== current) router.replace(target);
      return;
    }
    const fromPath = localeFromPath(pathname);
    if (fromPath && fromPath !== locale) {
      setLocale(fromPath);
      return;
    }
    if (!fromPath && locale !== "tr") {
      const target = localizeHref(current, locale);
      if (target !== current) router.replace(target);
    }
  }, [locale, pathname, router, searchParams, setLocale]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(mailto:|tel:|https?:|\/\/)/.test(raw)) return;
      let url: URL;
      try {
        url = new URL(raw, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      const next = localizeHref(url.pathname + url.search + url.hash, locale);
      const current = url.pathname + url.search + url.hash;
      if (next === current) return;
      event.preventDefault();
      router.push(next);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [locale, router]);

  return null;
}
