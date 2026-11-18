"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SITE } from "@/lib/constants";
import { DISTRICT_BLURBS } from "@/lib/district-blurbs";
import { districtLocative, relatedDistricts, type District } from "@/lib/districts";
import { useDistricts } from "@/hooks/useDistricts";
import type { Locale } from "@/lib/i18n";

const ARTICLE =
  "legal-content mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-ink-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_strong]:font-semibold [&_strong]:text-ink";

const DEPOSIT: Record<Locale, string> = {
  tr: "1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL",
  en: "5,000 TL for 1–3 days, 10,000 TL for 4–10 days, and 20,000 TL from 11 days",
  de: "1–3 Tage 5.000 TL, 4–10 Tage 10.000 TL, ab 11 Tagen 20.000 TL",
  ar: "1–3 أيام 5.000 ليرة، 4–10 أيام 10.000 ليرة، ومن 11 يوماً 20.000 ليرة",
  ru: "1–3 дня — 5 000 TL, 4–10 дней — 10 000 TL, от 11 дней — 20 000 TL",
};

function names(locale: Locale, district: District) {
  const asian = district.side === "anadolu";
  const saw = district.pickup === "saw";
  const side = {
    tr: asian ? "Anadolu" : "Avrupa",
    en: asian ? "Asian" : "European",
    de: asian ? "asiatischen" : "europäischen",
    ar: asian ? "الآسيوي" : "الأوروبي",
    ru: asian ? "азиатской" : "европейской",
  }[locale];
  const otherSide = {
    tr: asian ? "Avrupa" : "Anadolu",
    en: asian ? "European" : "Asian",
    de: asian ? "europäischen" : "asiatischen",
    ar: asian ? "الأوروبي" : "الآسيوي",
    ru: asian ? "европейскую" : "азиатскую",
  }[locale];
  const pickup = {
    tr: saw ? "Sabiha Gökçen" : "İstanbul Havalimanı",
    en: saw ? "Sabiha Gökçen" : "Istanbul Airport",
    de: saw ? "Sabiha Gökçen" : "Istanbul Airport",
    ar: saw ? "صبيحة كوكجن" : "مطار إسطنبول",
    ru: saw ? "Сабиха Гёкчен" : "аэропорт Стамбула",
  }[locale];
  const other = {
    tr: saw ? "İstanbul Havalimanı" : "Sabiha Gökçen",
    en: saw ? "Istanbul Airport" : "Sabiha Gökçen",
    de: saw ? "Istanbul Airport" : "Sabiha Gökçen",
    ar: saw ? "مطار إسطنبول" : "صبيحة كوكجن",
    ru: saw ? "аэропорт Стамбула" : "Сабиха Гёкчен",
  }[locale];
  const place =
    locale === "tr"
      ? districtLocative(district.name)
      : locale === "ar"
        ? `في ${district.name}`
        : locale === "ru"
          ? `в ${district.name}`
          : `in ${district.name}`;
  return { side, otherSide, pickup, other, place };
}

function blurb(locale: Locale, district: District) {
  const stored = { area: district.area, around: district.around, drive: district.drive };
  if (locale === "tr") return stored;
  return DISTRICT_BLURBS[district.slug]?.[locale] ?? stored;
}

export function DistrictHeading({ district }: { district: District }) {
  const { locale, t } = usePrefs();
  const { side, pickup } = names(locale, district);
  const title = t("seo.rentalOf", { name: district.name });
  const sub = t("seo.districtSub", { name: district.name, side, pickup });

  useEffect(() => {
    document.title = `${title} | ${SITE.shortName}`;
  }, [title]);

  return (
    <>
      <h1 className="section-title">{title}</h1>
      <p className="section-sub">{sub}</p>
    </>
  );
}

export function DistrictArticle({ district }: { district: District }) {
  const { locale, t } = usePrefs();
  const { side, otherSide, pickup, other, place } = names(locale, district);
  const copy = blurb(locale, district);
  const districtList = useDistricts();
  const related = relatedDistricts(district, districtList);
  const pickupHref =
    district.pickup === "saw"
      ? "/sabiha-gokcen-havalimani-arac-kiralama"
      : "/istanbul-3-havalimani-arac-kiralama";

  const text = TEXT[locale]({
    name: district.name,
    place,
    side,
    otherSide,
    pickup,
    other,
    deposit: DEPOSIT[locale],
  });

  const facts: [string, string, string][] = [
    [text.handover, pickup, text.handoverNote],
    [text.pay, text.noCard, text.payNote],
    [text.depositLabel, text.byLength, "5.000 · 10.000 · 20.000 TL"],
    [text.kmLabel, text.byDay, text.kmNote],
  ];

  return (
    <article className={ARTICLE}>
      <p>{text.lead}</p>
      <p>{copy.area}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-surface-border bg-white px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
            <dd className="mt-1 font-semibold text-ink">{value}</dd>
            <dd className="text-sm">{note}</dd>
          </div>
        ))}
      </dl>

      <h2>{text.whereTitle}</h2>
      <p>{text.where}</p>
      <p>
        {text.detailBefore} <Link href={pickupHref}>{text.pickupLink}</Link>
        {text.detailAfter}
      </p>
      <p>{copy.around}</p>

      <h2>{text.driveTitle}</h2>
      <p>{copy.drive}</p>
      <p>{text.tolls}</p>

      <h2>{text.payTitle}</h2>
      <p>{text.payBody}</p>
      <ul className="list-disc space-y-2 pl-5">
        {text.payItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        {text.moreBefore} <Link href="/kredi-kartsiz-arac-kiralama">{text.noCardLink}</Link>
        {text.moreMid} <Link href="/uzun-donem-arac-kiralama">{text.longLink}</Link>
        {text.moreAfter}
      </p>

      <h2>{text.nearTitle}</h2>
      <ul className="list-disc space-y-2 pl-5">
        {related.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{t("seo.rentalOf", { name: item.name })}</Link>
          </li>
        ))}
        <li>
          <Link href="/istanbul-arac-kiralama">{t("seo.rentalOf", { name: text.istanbul })}</Link>
        </li>
      </ul>

      <h2>{text.faqTitle}</h2>
      <div className="space-y-4">
        {text.faq.map(([question, answer]) => (
          <div key={question}>
            <p className="font-semibold text-ink">{question}</p>
            <p className="mt-1">{answer}</p>
          </div>
        ))}
      </div>

      <p>
        {t("contact.phone")} <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
        {" · "}
        WhatsApp{" "}
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
          {SITE.whatsappDisplay}
        </a>
        {" · "}
        <Link href="/ofisler">{t("nav.offices")}</Link>
        {" · "}
        <Link href="/arac-modelleri">{t("seo.browseCars")}</Link>
      </p>
    </article>
  );
}

type Vars = {
  name: string;
  place: string;
  side: string;
  otherSide: string;
  pickup: string;
  other: string;
  deposit: string;
};

type Block = {
  lead: string;
  handover: string;
  handoverNote: string;
  pay: string;
  noCard: string;
  payNote: string;
  depositLabel: string;
  byLength: string;
  kmLabel: string;
  byDay: string;
  kmNote: string;
  whereTitle: string;
  where: string;
  detailBefore: string;
  pickupLink: string;
  detailAfter: string;
  driveTitle: string;
  tolls: string;
  payTitle: string;
  payBody: string;
  payItems: string[];
  moreBefore: string;
  noCardLink: string;
  moreMid: string;
  longLink: string;
  moreAfter: string;
  nearTitle: string;
  istanbul: string;
  faqTitle: string;
  faq: [string, string][];
};

const TEXT: Record<Locale, (v: Vars) => Block> = {
  tr: (v) => ({
    lead: `${v.name} araç kiralama, aracı ${v.side} yakasında kullanacaklar için ${v.pickup} teslimiyle başlar. ZakCar bu noktada kredi kartı ve Findeks zorunluluğu olmadan kiralar; rezervasyon ücretsizdir, ödeme araç tesliminde alınır.`,
    handover: "Teslim",
    handoverNote: `${v.side} yakası, 7/24`,
    pay: "Ödeme",
    noCard: "Kredi kartsız",
    payNote: "Nakit, banka kartı veya kredi kartı",
    depositLabel: "Depozito",
    byLength: "Süreye göre",
    kmLabel: "Yol hakkı",
    byDay: "Güne göre",
    kmNote: "300 km/gün, 10 gün 2.200, ay 3.800",
    whereTitle: `${v.name} için aracı nereden alırsınız?`,
    where: `${v.name} ${v.side} yakasındadır. Online alış noktası olarak ${v.pickup} aynı yakadadır; ${v.other} ise ${v.otherSide} yakasında kalır ve Boğaz geçişi gerektirir. İniş saatinizi bildirirseniz terminal çıkışında karşılama buna göre ayarlanır. Havalimanı teslimi ücretsizdir.`,
    detailBefore: "Ayrıntı için ",
    pickupLink: `${v.pickup} araç kiralama`,
    detailAfter:
      " sayfasına bakın. Pendik’teki merkez ofis de Sabiha Gökçen çevresindedir. Adrese teslim, 10 km üzeri mesafelerde ek ücret çıkar; bunu rezervasyondan önce telefon veya WhatsApp ile netleştirin.",
    driveTitle: `${v.place} araç kullanmak`,
    tolls:
      "Köprü, Avrasya Tüneli ve otoyol geçişleri ücretlidir. Araçlarda HGS vardır; kiralama süresine ait geçişler size yansır. Hafta içi sabah ve akşam ana akslar yavaşlar. Uçuş veya randevu varsa rotayı haritadan, o saatin trafiğiyle kontrol edin.",
    payTitle: "Ödeme, depozito ve kilometre",
    payBody:
      "Rezervasyon siteden ücretsiz yapılır, ön ödeme alınmaz. Kredi kartı zorunlu değildir. Ödeme teslimde nakit, banka kartı veya kredi kartıyla yapılır.",
    payItems: [
      `Depozito kira bedelinden ayrıdır: ${v.deposit}.`,
      "Araç teslim edildiği gibi dönerse depozito iade edilir.",
      "Yol hakkı günlük 300 km, 10 günde 2.200 km, aylık 3.800 km’dir. Süre uzadıkça aylık hak esas alınır.",
      "Genelde 20 yaş ve 2 yıllık ehliyet aranır. Şart araca göre değişir. Sınırın altı için genç sürücü paketi günlük 335 TL’dir.",
    ],
    moreBefore: "Kredi kartsız kiralamanın tamamı ",
    noCardLink: "kredi kartsız araç kiralama",
    moreMid: " sayfasında, uzun süre için ",
    longLink: "uzun dönem araç kiralama",
    moreAfter: " sayfasında yazılıdır.",
    nearTitle: "Yakın semtler",
    istanbul: "İstanbul",
    faqTitle: `${v.name} araç kiralama — sık sorulanlar`,
    faq: [
      [
        `${v.place} aracı nerede teslim alırım?`,
        `${v.pickup} terminal çıkışında. Ofis 7/24 açıktır, havalimanı teslimi ücretsizdir. Diğer havalimanını seçerseniz ${v.otherSide} yakasına geçmeniz gerekir.`,
      ],
      [
        "Kredi kartı olmadan kiralanır mı?",
        "Evet. Findeks sorgusu yapılmaz. Ödeme teslimde nakit, banka kartı veya kredi kartıyla alınır. Rezervasyon ücretsizdir.",
      ],
      [
        "Depozito ve kilometre ne kadar?",
        `${v.deposit}. Yol hakkı seçilen güne göre hesaplanır: günlük 300 km, 10 gün 2.200 km, aylık 3.800 km.`,
      ],
      [
        `${v.name} için hangi havalimanı daha uygun?`,
        `Semt ${v.side} yakasında olduğu için ${v.pickup} köprü olmadan bağlanır. Uçuşunuz ${v.other} tarafına iniyorsa aracı oradan almanız da mümkündür.`,
      ],
    ],
  }),
  en: (v) => ({
    lead: `${v.name} car rental starts with handover at ${v.pickup} for anyone using the car on the ${v.side} side. ZakCar rents there with no credit card and no Findeks check. The reservation is free, and you pay when the car is handed over.`,
    handover: "Handover",
    handoverNote: `${v.side} side, 24 hours`,
    pay: "Payment",
    noCard: "No credit card",
    payNote: "Cash, debit card or credit card",
    depositLabel: "Deposit",
    byLength: "By length",
    kmLabel: "Mileage",
    byDay: "By the day",
    kmNote: "300 km/day, 2,200 for 10 days, 3,800 a month",
    whereTitle: `Where do you collect the car for ${v.name}?`,
    where: `${v.name} is on the ${v.side} side. ${v.pickup} is the online pickup on the same side. ${v.other} stays on the ${v.otherSide} side and needs a Bosphorus crossing. If you share your landing time, the meet at the terminal exit is set to it. Airport handover is free.`,
    detailBefore: "See the ",
    pickupLink: `${v.pickup} car rental`,
    detailAfter:
      " page for the detail. The central office in Pendik is also near Sabiha Gökçen. Delivery to an address beyond 10 km has an extra fee. Agree that by phone or WhatsApp before you reserve.",
    driveTitle: `Driving ${v.place}`,
    tolls:
      "The bridges, the Eurasia Tunnel and the motorways are tolled. The cars have HGS, and the crossings during the rental are charged to you. On weekday mornings and evenings the main roads slow down. If you have a flight or an appointment, check the route on the map with that hour’s traffic.",
    payTitle: "Payment, deposit and mileage",
    payBody:
      "You reserve on the site for free, and nothing is prepaid. A credit card is not required. You pay at handover in cash, by debit card, or by credit card.",
    payItems: [
      `The deposit is separate from the rental price: ${v.deposit}.`,
      "If the car comes back as it was handed over, the deposit is returned.",
      "The allowance is 300 km a day, 2,200 km for 10 days, and 3,800 km a month. For a longer rental the monthly allowance is the base.",
      "The usual requirement is age 20 and a licence held for 2 years. The rule can differ by car. Under that limit the young-driver package is 335 TL per day.",
    ],
    moreBefore: "The full no-card rental is on the ",
    noCardLink: "car rental without a credit card",
    moreMid: " page. For a long rental, see ",
    longLink: "long-term car rental",
    moreAfter: ".",
    nearTitle: "Nearby neighbourhoods",
    istanbul: "Istanbul",
    faqTitle: `${v.name} car rental — common questions`,
    faq: [
      [
        `Where do I collect the car ${v.place}?`,
        `At the ${v.pickup} terminal exit. The desk is open 24 hours, and airport handover is free. If you choose the other airport, you cross to the ${v.otherSide} side.`,
      ],
      [
        "Can I rent without a credit card?",
        "Yes. There is no Findeks check. You pay at handover in cash, by debit card, or by credit card. The reservation is free.",
      ],
      [
        "How much are the deposit and the mileage?",
        `${v.deposit}. The allowance is calculated for the days you chose: 300 km a day, 2,200 km for 10 days, and 3,800 km a month.`,
      ],
      [
        `Which airport suits ${v.name}?`,
        `The neighbourhood is on the ${v.side} side, so ${v.pickup} connects with no bridge. If your flight lands at ${v.other}, you can collect the car there as well.`,
      ],
    ],
  }),
  de: (v) => ({
    lead: `Die Autovermietung ${v.name} beginnt mit der Übergabe am ${v.pickup}, wenn das Auto auf der ${v.side} Seite genutzt wird. ZakCar vermietet dort ohne Kreditkarte und ohne Findeks-Prüfung. Die Reservierung ist kostenlos, gezahlt wird bei der Übergabe.`,
    handover: "Übergabe",
    handoverNote: `${v.side} Seite, 24 Stunden`,
    pay: "Zahlung",
    noCard: "Ohne Kreditkarte",
    payNote: "Bar, Bankkarte oder Kreditkarte",
    depositLabel: "Kaution",
    byLength: "Nach Dauer",
    kmLabel: "Freikilometer",
    byDay: "Nach Tag",
    kmNote: "300 km/Tag, 10 Tage 2.200, Monat 3.800",
    whereTitle: `Wo holen Sie das Auto für ${v.name} ab?`,
    where: `${v.name} liegt auf der ${v.side} Seite. ${v.pickup} ist die Online-Abholung auf derselben Seite. ${v.other} bleibt auf der ${v.otherSide} Seite und braucht die Bosporusquerung. Nennen Sie die Landezeit, dann richtet sich das Treffen am Terminalausgang danach. Die Übergabe am Flughafen ist kostenlos.`,
    detailBefore: "Einzelheiten stehen auf der Seite ",
    pickupLink: `Autovermietung ${v.pickup}`,
    detailAfter:
      ". Das Zentralbüro in Pendik liegt ebenfalls bei Sabiha Gökçen. Lieferung an eine Adresse über 10 km kostet extra. Klären Sie das vor der Reservierung per Telefon oder WhatsApp.",
    driveTitle: `Fahren ${v.place}`,
    tolls:
      "Brücken, der Eurasien-Tunnel und Autobahnen sind mautpflichtig. Die Autos haben HGS, die Fahrten während der Miete werden Ihnen berechnet. An Werktagen verlangsamen sich morgens und abends die Hauptachsen. Bei Flug oder Termin prüfen Sie die Route auf der Karte mit dem Verkehr dieser Stunde.",
    payTitle: "Zahlung, Kaution und Kilometer",
    payBody:
      "Die Reservierung auf der Website ist kostenlos, eine Vorauszahlung gibt es nicht. Eine Kreditkarte ist nicht Pflicht. Gezahlt wird bei der Übergabe bar, mit Bankkarte oder mit Kreditkarte.",
    payItems: [
      `Die Kaution ist vom Mietpreis getrennt: ${v.deposit}.`,
      "Kommt das Auto so zurück, wie es übergeben wurde, wird die Kaution erstattet.",
      "Frei sind 300 km am Tag, 2.200 km in 10 Tagen und 3.800 km im Monat. Bei längerer Miete gilt das Monatskontingent.",
      "Üblich sind 20 Jahre und 2 Jahre Führerschein. Die Bedingung hängt vom Fahrzeug ab. Darunter kostet das Jungfahrer-Paket 335 TL pro Tag.",
    ],
    moreBefore: "Die Miete ohne Kreditkarte steht auf der Seite ",
    noCardLink: "Autovermietung ohne Kreditkarte",
    moreMid: ", eine lange Miete auf ",
    longLink: "Langzeitmiete",
    moreAfter: ".",
    nearTitle: "Nahe Viertel",
    istanbul: "Istanbul",
    faqTitle: `Autovermietung ${v.name} — häufige Fragen`,
    faq: [
      [
        `Wo hole ich das Auto ${v.place} ab?`,
        `Am Terminalausgang von ${v.pickup}. Das Büro ist 24 Stunden offen, die Übergabe am Flughafen ist kostenlos. Wählen Sie den anderen Flughafen, wechseln Sie auf die ${v.otherSide} Seite.`,
      ],
      [
        "Geht die Miete ohne Kreditkarte?",
        "Ja. Eine Findeks-Prüfung gibt es nicht. Gezahlt wird bei der Übergabe bar, mit Bankkarte oder mit Kreditkarte. Die Reservierung ist kostenlos.",
      ],
      [
        "Wie hoch sind Kaution und Kilometer?",
        `${v.deposit}. Die Freikilometer richten sich nach den gewählten Tagen: 300 km am Tag, 2.200 km in 10 Tagen, 3.800 km im Monat.`,
      ],
      [
        `Welcher Flughafen passt zu ${v.name}?`,
        `Das Viertel liegt auf der ${v.side} Seite, deshalb verbindet ${v.pickup} ohne Brücke. Landet der Flug bei ${v.other}, können Sie das Auto auch dort abholen.`,
      ],
    ],
  }),
  ar: (v) => ({
    lead: `تأجير السيارات في ${v.name} يبدأ بالتسليم في ${v.pickup} لمن سيستخدم السيارة في الجانب ${v.side}. ZakCar يؤجر هناك بلا بطاقة ائتمان وبلا فحص Findeks. الحجز مجاني، والدفع عند تسليم السيارة.`,
    handover: "التسليم",
    handoverNote: `الجانب ${v.side}، 24 ساعة`,
    pay: "الدفع",
    noCard: "بدون بطاقة ائتمان",
    payNote: "نقداً أو بطاقة بنكية أو بطاقة ائتمان",
    depositLabel: "التأمين",
    byLength: "حسب المدة",
    kmLabel: "المسافة",
    byDay: "حسب اليوم",
    kmNote: "300 كم/يوم، 10 أيام 2.200، الشهر 3.800",
    whereTitle: `من أين تستلمون السيارة لـ${v.name}؟`,
    where: `${v.name} في الجانب ${v.side}. ${v.pickup} هو الاستلام عبر الموقع في الجهة نفسها. ${v.other} يبقى في الجانب ${v.otherSide} ويحتاج عبور البوسفور. إذا أبلغتم بوقت الهبوط يُرتب الاستقبال عند مخرج المبنى على أساسه. تسليم المطار مجاني.`,
    detailBefore: "التفاصيل في صفحة ",
    pickupLink: `تأجير سيارات ${v.pickup}`,
    detailAfter:
      ". المكتب المركزي في بنديك قريب من صبيحة كوكجن أيضاً. التسليم إلى عنوان أبعد من 10 كم له رسم إضافي. حددوا ذلك بالهاتف أو واتساب قبل الحجز.",
    driveTitle: `القيادة ${v.place}`,
    tolls:
      "الجسور ونفق أوراسيا والطرق السريعة برسوم. السيارات فيها HGS، وعبورات مدة التأجير تُحسب عليكم. في صباح ومساء أيام الأسبوع تبطؤ المحاور الرئيسية. إذا كانت لديكم رحلة أو موعد فراجعوا المسار على الخريطة مع زحام تلك الساعة.",
    payTitle: "الدفع والتأمين والكيلومترات",
    payBody:
      "الحجز من الموقع مجاني، ولا تُؤخذ دفعة مقدمة. بطاقة الائتمان ليست إلزامية. الدفع عند التسليم نقداً أو ببطاقة بنكية أو ائتمان.",
    payItems: [
      `التأمين منفصل عن بدل الإيجار: ${v.deposit}.`,
      "إذا عادت السيارة كما سُلّمت يُرد التأمين.",
      "المسافة 300 كم في اليوم، و2.200 كم في 10 أيام، و3.800 كم في الشهر. كلما طالت المدة يُعتمد حق الشهر.",
      "المعتاد 20 سنة ورخصة منذ سنتين. الشرط يختلف حسب السيارة. دون الحد تكون باقة السائق الشاب 335 ليرة في اليوم.",
    ],
    moreBefore: "التأجير بلا بطاقة ائتمان كاملاً في صفحة ",
    noCardLink: "تأجير سيارات بدون بطاقة ائتمان",
    moreMid: "، وللمدة الطويلة في ",
    longLink: "التأجير طويل الأمد",
    moreAfter: ".",
    nearTitle: "أحياء قريبة",
    istanbul: "إسطنبول",
    faqTitle: `تأجير سيارات ${v.name} — أسئلة شائعة`,
    faq: [
      [
        `أين أستلم السيارة ${v.place}؟`,
        `عند مخرج مبنى ${v.pickup}. المكتب يعمل 24 ساعة، وتسليم المطار مجاني. إذا اخترتم المطار الآخر تنتقلون إلى الجانب ${v.otherSide}.`,
      ],
      [
        "هل يمكن التأجير بلا بطاقة ائتمان؟",
        "نعم. لا فحص Findeks. الدفع عند التسليم نقداً أو ببطاقة بنكية أو ائتمان. الحجز مجاني.",
      ],
      [
        "كم التأمين والكيلومترات؟",
        `${v.deposit}. المسافة تُحسب حسب الأيام المختارة: 300 كم في اليوم، و2.200 كم لعشرة أيام، و3.800 كم في الشهر.`,
      ],
      [
        `أي مطار أنسب لـ${v.name}؟`,
        `الحي في الجانب ${v.side}، لذلك يتصل ${v.pickup} بلا جسر. إذا هبطت رحلتكم عند ${v.other} يمكن استلام السيارة من هناك أيضاً.`,
      ],
    ],
  }),
  ru: (v) => ({
    lead: `Аренда авто в ${v.name} начинается с выдачи в ${v.pickup}, если машиной пользуются на ${v.side} стороне. ZakCar сдаёт там без кредитной карты и без проверки Findeks. Бронь бесплатная, оплата при выдаче.`,
    handover: "Выдача",
    handoverNote: `${v.side} сторона, круглосуточно`,
    pay: "Оплата",
    noCard: "Без кредитной карты",
    payNote: "Наличные, дебетовая или кредитная карта",
    depositLabel: "Депозит",
    byLength: "По сроку",
    kmLabel: "Пробег",
    byDay: "По дням",
    kmNote: "300 км/день, 10 дней 2 200, месяц 3 800",
    whereTitle: `Где забирать машину для ${v.name}?`,
    where: `${v.name} на ${v.side} стороне. ${v.pickup} — онлайн-выдача на той же стороне. ${v.other} остаётся на ${v.otherSide} стороне и требует переход через Босфор. Если напишете время посадки, встреча у выхода из терминала подстроится под него. Выдача в аэропорту бесплатная.`,
    detailBefore: "Подробности на странице ",
    pickupLink: `аренда авто: ${v.pickup}`,
    detailAfter:
      ". Центральный офис в Пендике тоже рядом с Сабихой Гёкчен. Доставка по адресу дальше 10 км стоит отдельно. Согласуйте это по телефону или в WhatsApp до брони.",
    driveTitle: `Как ездить ${v.place}`,
    tolls:
      "Мосты, Евразийский тоннель и автомагистрали платные. В машинах есть HGS, проезды за срок аренды списывают вам. По будням утром и вечером главные оси замедляются. Если есть рейс или встреча, проверьте маршрут на карте с пробками этого часа.",
    payTitle: "Оплата, депозит и километры",
    payBody:
      "Бронь на сайте бесплатная, предоплаты нет. Кредитная карта не обязательна. Оплата при выдаче наличными, дебетовой или кредитной картой.",
    payItems: [
      `Депозит отдельно от цены аренды: ${v.deposit}.`,
      "Если машину вернули в том виде, в каком выдали, депозит возвращают.",
      "Лимит — 300 км в день, 2 200 км за 10 дней и 3 800 км в месяц. На более долгий срок за основу берётся месячный лимит.",
      "Обычно нужны 20 лет и права от 2 лет. Условие зависит от машины. Ниже порога пакет молодого водителя — 335 TL в день.",
    ],
    moreBefore: "Аренда без кредитной карты целиком на странице ",
    noCardLink: "аренда без кредитной карты",
    moreMid: ", долгий срок — на ",
    longLink: "долгая аренда",
    moreAfter: ".",
    nearTitle: "Ближние районы",
    istanbul: "Стамбул",
    faqTitle: `Аренда авто в ${v.name} — частые вопросы`,
    faq: [
      [
        `Где забрать машину ${v.place}?`,
        `У выхода из терминала ${v.pickup}. Офис работает круглосуточно, выдача в аэропорту бесплатная. Если выбрать другой аэропорт, придётся перейти на ${v.otherSide} сторону.`,
      ],
      [
        "Можно ли без кредитной карты?",
        "Да. Проверки Findeks нет. Оплата при выдаче наличными, дебетовой или кредитной картой. Бронь бесплатная.",
      ],
      [
        "Какие депозит и километры?",
        `${v.deposit}. Пробег считают по выбранным дням: 300 км в день, 2 200 км за 10 дней, 3 800 км в месяц.`,
      ],
      [
        `Какой аэропорт удобнее для ${v.name}?`,
        `Район на ${v.side} стороне, поэтому ${v.pickup} связан без моста. Если рейс садится в ${v.other}, машину можно забрать и там.`,
      ],
    ],
  }),
};

const INDEX: Record<Locale, { lead: string; after: string; europe: string; asia: string }> = {
  tr: {
    lead: "İstanbul araç kiralama, kalacağınız yakaya göre iki teslim noktasından biriyle başlar: Anadolu yakasında Sabiha Gökçen, Avrupa yakasında İstanbul Havalimanı. İkisinde de ofis 7/24 açıktır ve havalimanı teslimi ücretsizdir.",
    after: "ZakCar kredi kartı ve Findeks zorunluluğu olmadan kiralar. Rezervasyon ücretsizdir, ödeme araç tesliminde alınır. Aşağıdaki semt sayfaları, o semte hangi havalimanının uyduğunu ve sokakta aracı nasıl kullanacağınızı anlatır.",
    europe: "Avrupa yakası",
    asia: "Anadolu yakası",
  },
  en: {
    lead: "Car rental in Istanbul starts at one of two desks, depending on the side you will stay on: Sabiha Gökçen on the Asian side, Istanbul Airport on the European side. Both desks are open 24 hours, and airport handover is free.",
    after: "ZakCar rents with no credit card and no Findeks check. The reservation is free, and you pay when the car is handed over. The neighbourhood pages below say which airport fits that place, and how to use the car on those streets.",
    europe: "European side",
    asia: "Asian side",
  },
  de: {
    lead: "Die Autovermietung in Istanbul beginnt an einem von zwei Schaltern, je nach der Seite, auf der Sie bleiben: Sabiha Gökçen auf der asiatischen Seite, Istanbul Airport auf der europäischen. Beide Büros sind 24 Stunden offen, die Übergabe am Flughafen ist kostenlos.",
    after: "ZakCar vermietet ohne Kreditkarte und ohne Findeks-Prüfung. Die Reservierung ist kostenlos, gezahlt wird bei der Übergabe. Die Viertelseiten unten sagen, welcher Flughafen passt und wie Sie das Auto in diesen Straßen nutzen.",
    europe: "Europäische Seite",
    asia: "Asiatische Seite",
  },
  ar: {
    lead: "تأجير السيارات في إسطنبول يبدأ من إحدى نقطتي التسليم حسب الجهة التي ستقيمون فيها: صبيحة كوكجن في الجانب الآسيوي، ومطار إسطنبول في الجانب الأوروبي. المكتبان يعملان 24 ساعة، وتسليم المطار مجاني.",
    after: "ZakCar يؤجر بلا بطاقة ائتمان وبلا فحص Findeks. الحجز مجاني، والدفع عند تسليم السيارة. صفحات الأحياء أدناه توضح أي مطار يناسب الحي وكيف تُستخدم السيارة في شوارعه.",
    europe: "الجانب الأوروبي",
    asia: "الجانب الآسيوي",
  },
  ru: {
    lead: "Аренда авто в Стамбуле начинается в одной из двух точек, по стороне, где вы остановитесь: Сабиха Гёкчен на азиатской, аэропорт Стамбула на европейской. Оба офиса работают круглосуточно, выдача в аэропорту бесплатная.",
    after: "ZakCar сдаёт машины без кредитной карты и без проверки Findeks. Бронь бесплатная, оплата при выдаче. Страницы районов ниже говорят, какой аэропорт подходит и как ездить по этим улицам.",
    europe: "Европейская сторона",
    asia: "Азиатская сторона",
  },
};

export function IstanbulDistrictIndex() {
  const { locale, t } = usePrefs();
  const districts = useDistricts();
  const copy = INDEX[locale];
  const europe = districts.filter((item) => item.side === "avrupa");
  const anatolia = districts.filter((item) => item.side === "anadolu");
  return (
    <article className={ARTICLE}>
      <p>{copy.lead}</p>
      <p>{copy.after}</p>
      <h2>{copy.europe}</h2>
      <ul className="list-disc space-y-2 pl-5">
        {europe.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{t("seo.rentalOf", { name: item.name })}</Link>
          </li>
        ))}
      </ul>
      <h2>{copy.asia}</h2>
      <ul className="list-disc space-y-2 pl-5">
        {anatolia.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{t("seo.rentalOf", { name: item.name })}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
