import type { Locale } from "@/lib/i18n";

const LOCALES: Locale[] = ["tr", "en", "de", "ar", "ru"];

type Localized = Record<Locale, string>;

const STATIC: Record<string, Localized> = {
  "/hakkimizda": { tr: "/hakkimizda", en: "/about", de: "/ueber-uns", ar: "/من-نحن", ru: "/о-нас" },
  "/ofisler": { tr: "/ofisler", en: "/offices", de: "/bueros", ar: "/المكاتب", ru: "/офисы" },
  "/iletisim": { tr: "/iletisim", en: "/contact", de: "/kontakt", ar: "/اتصل-بنا", ru: "/контакты" },
  "/arac-modelleri": { tr: "/arac-modelleri", en: "/car-models", de: "/fahrzeugmodelle", ar: "/موديلات-السيارات", ru: "/модели-авто" },
  "/rezervasyon-sorgulama": {
    tr: "/rezervasyon-sorgulama",
    en: "/find-reservation",
    de: "/reservierung-suchen",
    ar: "/استعلام-الحجز",
    ru: "/поиск-брони",
  },
  "/giris": { tr: "/giris", en: "/sign-in", de: "/anmelden", ar: "/تسجيل-الدخول", ru: "/вход" },
  "/kampanyalar": { tr: "/kampanyalar", en: "/campaigns", de: "/angebote", ar: "/العروض", ru: "/акции" },
  "/sik-sorulan-sorular": { tr: "/sik-sorulan-sorular", en: "/faq", de: "/haeufige-fragen", ar: "/الأسئلة-الشائعة", ru: "/вопросы" },
  "/kiralama-kosullari": {
    tr: "/kiralama-kosullari",
    en: "/rental-terms",
    de: "/mietbedingungen",
    ar: "/شروط-الإيجار",
    ru: "/условия-аренды",
  },
  "/kiralama-sozlesmesi": {
    tr: "/kiralama-sozlesmesi",
    en: "/rental-agreement",
    de: "/mietvertrag",
    ar: "/عقد-الإيجار",
    ru: "/договор-аренды",
  },
  "/gizlilik-politikasi": {
    tr: "/gizlilik-politikasi",
    en: "/privacy-policy",
    de: "/datenschutz",
    ar: "/سياسة-الخصوصية",
    ru: "/конфиденциальность",
  },
  "/kisisel-verilerin-korunmasi": {
    tr: "/kisisel-verilerin-korunmasi",
    en: "/personal-data",
    de: "/personenbezogene-daten",
    ar: "/حماية-البيانات",
    ru: "/персональные-данные",
  },
  "/arac-markalari": { tr: "/arac-markalari", en: "/car-brands", de: "/automarken", ar: "/ماركات-السيارات", ru: "/марки-авто" },
  "/arac-gruplari": { tr: "/arac-gruplari", en: "/car-groups", de: "/fahrzeuggruppen", ar: "/فئات-السيارات", ru: "/классы-авто" },
  "/rezervasyon": { tr: "/rezervasyon", en: "/reservation", de: "/reservierung", ar: "/الحجز", ru: "/бронирование" },
};

const PREFIX: Record<string, Localized> = {
  "/arac": { tr: "/arac", en: "/car", de: "/fahrzeug", ar: "/سيارة", ru: "/авто" },
  "/blog": { tr: "/blog", en: "/blog", de: "/blog", ar: "/المدونة", ru: "/блог" },
};

const TOKENS: { tr: string; en: string; de: string; ar: string; ru: string }[] = [
  {
    tr: "kredi-kartsiz-arac-kiralama",
    en: "car-rental-without-a-credit-card",
    de: "ohne-kreditkarte-autovermietung",
    ar: "بدون-بطاقة-تأجير-سيارات",
    ru: "без-карты-аренда-авто",
  },
  { tr: "kredi-kartsiz", en: "no-credit-card", de: "ohne-kreditkarte", ar: "بدون-بطاقة", ru: "без-карты" },
  { tr: "findeks-sorgusuz", en: "no-findeks", de: "ohne-findeks", ar: "بدون-فيندكس", ru: "без-findeks" },
  { tr: "7-10-kisilik", en: "7-10-seater", de: "7-10-sitzer", ar: "7-10-مقاعد", ru: "7-10-мест" },
  { tr: "arac-kiralama", en: "car-rental", de: "autovermietung", ar: "تأجير-سيارات", ru: "аренда-авто" },
  { tr: "uzun-donem", en: "long-term", de: "langzeit", ar: "طويل-الأمد", ru: "долгосрочно" },
  { tr: "havalimani", en: "airport", de: "flughafen", ar: "مطار", ru: "аэропорт" },
  { tr: "kurumsal", en: "corporate", de: "firmen", ar: "للشركات", ru: "для-компаний" },
  { tr: "ekonomik", en: "economy", de: "spar", ar: "اقتصادي", ru: "эконом" },
  { tr: "sedan", en: "sedan", de: "limousine", ar: "سيدان", ru: "седан" },
  { tr: "luks", en: "luxury", de: "luxus", ar: "فاخر", ru: "люкс" },
];

const CANONICAL = new Map<string, string>();
const LOCALE_OF = new Map<string, Locale>();
const LOCAL_OF = new Map<string, string>();

function addExact(localized: string, canonical: string, locale: Locale) {
  const path = cleanPath(localized);
  const target = cleanPath(canonical);
  const previous = CANONICAL.get(path);
  if (previous && previous !== target) {
    throw new Error(`Adres çakışması: ${path}`);
  }
  CANONICAL.set(path, target);
  if (locale !== "tr") LOCALE_OF.set(path, locale);
  LOCAL_OF.set(`${locale}:${target}`, path);
}

function translateSlug(slug: string, locale: Locale): string {
  let out = slug;
  for (const token of TOKENS) out = out.replaceAll(token.tr, token[locale]);
  return out;
}

for (const [canonical, map] of Object.entries(STATIC)) {
  for (const locale of LOCALES) addExact(map[locale], canonical, locale);
}

const REVERSE = TOKENS.flatMap((token) =>
  LOCALES.filter((locale) => locale !== "tr" && token[locale] !== token.tr).map((locale) => ({
    from: token[locale],
    to: token.tr,
  })),
).sort((a, b) => b.from.length - a.from.length);

function replaceBounded(input: string, from: string, to: string): string {
  let out = "";
  let index = 0;
  while (index < input.length) {
    const fits =
      (index === 0 || input[index - 1] === "-") &&
      input.startsWith(from, index) &&
      (index + from.length === input.length || input[index + from.length] === "-");
    if (fits) {
      out += to;
      index += from.length;
    } else {
      out += input[index];
      index += 1;
    }
  }
  return out;
}

function undoSlug(slug: string): string {
  let out = slug;
  for (const item of REVERSE) out = replaceBounded(out, item.from, item.to);
  return out;
}

function cleanPath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

function skip(pathname: string): boolean {
  return (
    pathname.startsWith("/panel") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  );
}

export function canonicalPathname(pathname: string): string {
  const path = cleanPath(pathname);
  if (skip(path)) return path;
  const exact = CANONICAL.get(path);
  if (exact) return exact;
  const segment = path.slice(1);
  if (segment && !segment.includes("/")) {
    const undone = undoSlug(segment);
    if (undone !== segment) return `/${undone}`;
  }
  for (const [canonical, map] of Object.entries(PREFIX)) {
    for (const locale of LOCALES) {
      const prefix = map[locale];
      if (locale === "tr" || prefix === canonical) continue;
      if (path === prefix || path.startsWith(`${prefix}/`)) return canonical + path.slice(prefix.length);
    }
  }
  return path;
}

export function localeFromPath(pathname: string): Locale | null {
  const path = cleanPath(pathname);
  const exact = LOCALE_OF.get(path);
  if (exact) return exact;
  const canonical = canonicalPathname(path);
  if (canonical !== path && !path.slice(1).includes("/")) {
    const base = canonical.slice(1);
    for (const locale of LOCALES) {
      if (locale !== "tr" && translateSlug(base, locale) === path.slice(1)) return locale;
    }
  }
  for (const map of Object.values(PREFIX)) {
    for (const locale of LOCALES) {
      if (locale === "tr") continue;
      const prefix = map[locale];
      if (prefix !== map.tr && (path === prefix || path.startsWith(`${prefix}/`))) return locale;
    }
  }
  return null;
}

export function localizeHref(href: string, locale: Locale): string {
  const hashAt = href.indexOf("#");
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  const beforeHash = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const queryAt = beforeHash.indexOf("?");
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : "";
  const path = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash;
  if (!path.startsWith("/") || path.startsWith("//") || skip(path)) return href;
  const canonical = canonicalPathname(path);
  let localized = LOCAL_OF.get(`${locale}:${canonical}`) ?? canonical;
  if (localized === canonical && canonical !== "/" && !canonical.slice(1).includes("/")) {
    localized = `/${translateSlug(canonical.slice(1), locale)}`;
  }
  if (localized === canonical) {
    for (const [prefix, map] of Object.entries(PREFIX)) {
      if (canonical === prefix || canonical.startsWith(`${prefix}/`)) {
        localized = map[locale] + canonical.slice(prefix.length);
        break;
      }
    }
  }
  return localized + query + hash;
}

let pendingLocale: Locale | null = null;

export function markLocalePick(locale: Locale) {
  pendingLocale = locale;
}

export function takeLocalePick(): Locale | null {
  const value = pendingLocale;
  pendingLocale = null;
  return value;
}
