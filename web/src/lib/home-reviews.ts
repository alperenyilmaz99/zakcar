import type { Locale } from "@/lib/i18n";

type Copy = { title: string; body: string; place: string };

export type HomeReviewCard = {
  id: string;
  author: string;
  copy: Record<Locale, Copy>;
};

const places = {
  saw: {
    tr: "Sabiha Gökçen",
    en: "Sabiha Gökçen",
    de: "Sabiha Gökçen",
    ar: "صبيحة كوكجن",
    ru: "Сабиха Гёкчен",
  },
  iga: {
    tr: "İstanbul Havalimanı",
    en: "Istanbul Airport",
    de: "Istanbul Airport",
    ar: "مطار إسطنبول",
    ru: "Аэропорт Стамбула",
  },
  merkez: {
    tr: "Merkez Ofis",
    en: "Central Office",
    de: "Zentrale",
    ar: "المكتب المركزي",
    ru: "Центральный офис",
  },
} as const;

function card(author: string, place: keyof typeof places, copy: Record<Locale, Omit<Copy, "place">>): HomeReviewCard {
  return {
    id: `builtin-${author.toLocaleLowerCase("tr").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    author,
    copy: {
      tr: { ...copy.tr, place: places[place].tr },
      en: { ...copy.en, place: places[place].en },
      de: { ...copy.de, place: places[place].de },
      ar: { ...copy.ar, place: places[place].ar },
      ru: { ...copy.ru, place: places[place].ru },
    },
  };
}

export const HOME_REVIEW_CARDS: HomeReviewCard[] = [
  card("Emre Ka", "saw", {
    tr: {
      title: "Hızlı teslim",
      body: "Gece 01.30’da Sabiha Gökçen’e indim. Ofisteki arkadaş kapıda bekliyordu, evrak birkaç dakikada bitti. Aracı otoparktan aldım.",
    },
    en: {
      title: "Quick handover",
      body: "I landed at Sabiha Gökçen at 1:30 a.m. Someone from the office was waiting, and the paperwork took a few minutes. I picked the car up from the car park.",
    },
    de: {
      title: "Schnelle Übergabe",
      body: "Ich landete um 1:30 Uhr nachts am Sabiha Gökçen. Jemand vom Büro wartete schon, die Papiere waren in wenigen Minuten erledigt. Das Auto habe ich im Parkhaus übernommen.",
    },
    ar: {
      title: "تسليم سريع",
      body: "هبطت في صبيحة كوكجن الساعة الواحدة والنصف ليلاً. كان أحد موظفي المكتب بانتظاري، وانتهت الأوراق خلال دقائق. استلمت السيارة من الموقف.",
    },
    ru: {
      title: "Быстрая выдача",
      body: "Я прилетел в Сабиху Гёкчен в 1:30 ночи. Сотрудник офиса уже ждал, документы заняли несколько минут. Машину забрал на парковке.",
    },
  }),
  card("Ayşe Yı", "iga", {
    tr: {
      title: "Kartsız kiralama",
      body: "Kredi kartım yanımda değildi. Rezervasyonda söyledikleri gibi ödemeyi teslimde nakit yaptım, ekstra bir kalem çıkmadı.",
    },
    en: {
      title: "No card needed",
      body: "I did not have a credit card with me. As they said when I booked, I paid in cash at pickup and nothing extra was added.",
    },
    de: {
      title: "Ohne Karte",
      body: "Ich hatte keine Kreditkarte dabei. Wie bei der Reservierung gesagt, habe ich bei der Übergabe bar gezahlt. Es kam nichts extra dazu.",
    },
    ar: {
      title: "بدون بطاقة",
      body: "لم تكن بطاقتي الائتمانية معي. دفعت نقداً عند التسليم كما قيل لي في الحجز، ولم يُضف أي بند إضافي.",
    },
    ru: {
      title: "Без карты",
      body: "Кредитной карты с собой не было. Как и сказали при бронировании, оплатил наличными при выдаче. Лишних пунктов не появилось.",
    },
  }),
  card("Burak De", "saw", {
    tr: {
      title: "Aynı fiyat",
      body: "Sitede gördüğüm günlük tutar teslimde de aynıydı. Kasko ve havalimanı teslimi ayrıca yazılmadı.",
    },
    en: {
      title: "Same price",
      body: "The daily price I saw on the site was the same at pickup. Insurance and the airport handover were not added on top.",
    },
    de: {
      title: "Gleicher Preis",
      body: "Der Tagespreis auf der Seite war bei der Übergabe derselbe. Kasko und Flughafenübergabe wurden nicht extra berechnet.",
    },
    ar: {
      title: "السعر نفسه",
      body: "السعر اليومي الذي رأيته في الموقع بقي نفسه عند التسليم. لم يُضف التأمين أو تسليم المطار بشكل منفصل.",
    },
    ru: {
      title: "Та же цена",
      body: "Дневная цена с сайта при выдаче не изменилась. Каско и выдача в аэропорту отдельно не дописывались.",
    },
  }),
  card("Selin Ar", "iga", {
    tr: {
      title: "Temiz araç",
      body: "İstanbul Havalimanı’nda araç hazırdı. İçi temizdi, depo doluydu. Dönüşü de aynı ofise bıraktım, işlem kısa sürdü.",
    },
    en: {
      title: "Clean car",
      body: "The car was ready at Istanbul Airport. It was clean and the tank was full. I returned it to the same office and it did not take long.",
    },
    de: {
      title: "Sauberes Auto",
      body: "Am Istanbul Airport stand das Auto bereit. Es war sauber und der Tank voll. Die Rückgabe im selben Büro ging schnell.",
    },
    ar: {
      title: "سيارة نظيفة",
      body: "كانت السيارة جاهزة في مطار إسطنبول. من الداخل نظيفة والخزان ممتلئ. أعدتها إلى المكتب نفسه ولم تطل المعاملة.",
    },
    ru: {
      title: "Чистая машина",
      body: "В аэропорту Стамбула машина уже ждала. Салон чистый, бак полный. Вернул в тот же офис, это заняло немного времени.",
    },
  }),
  card("Mert Öz", "saw", {
    tr: {
      title: "Gece inişi",
      body: "Uçak rötar yaptı. WhatsApp’tan yazdım, ekip inişi bekledi. Bagajdan çıkınca araç hazırdı.",
    },
    en: {
      title: "Late landing",
      body: "The flight was delayed. I wrote on WhatsApp and the team waited for the landing. The car was ready when I left baggage claim.",
    },
    de: {
      title: "Späte Landung",
      body: "Der Flug hatte Verspätung. Ich schrieb per WhatsApp, das Team wartete die Landung ab. Nach der Gepäckausgabe war das Auto bereit.",
    },
    ar: {
      title: "هبوط متأخر",
      body: "تأخرت الرحلة. كتبت عبر واتساب فانتظر الفريق الهبوط. عندما خرجت من استلام الأمتعة كانت السيارة جاهزة.",
    },
    ru: {
      title: "Ночная посадка",
      body: "Рейс задержали. Написал в WhatsApp, команда дождалась посадки. После выдачи багажа машина уже была готова.",
    },
  }),
  card("Deniz Ko", "merkez", {
    tr: {
      title: "Tekrar gelirim",
      body: "Üçüncü kez ZakCar’dan kiraladım. Merkez ofiste de havalimanındaki gibi net anlattılar, sürpriz kalem çıkmadı.",
    },
    en: {
      title: "I will be back",
      body: "This was my third rental with ZakCar. At the central office they explained everything as clearly as at the airport. No surprise charges.",
    },
    de: {
      title: "Ich komme wieder",
      body: "Das war meine dritte Miete bei ZakCar. In der Zentrale wurde alles so klar erklärt wie am Flughafen. Keine Überraschungsposten.",
    },
    ar: {
      title: "سأعود مجدداً",
      body: "هذه ثالث مرة أستأجر من ZakCar. في المكتب المركزي شرحوا كل شيء بوضوح كما في المطار، ولم يظهر أي بند مفاجئ.",
    },
    ru: {
      title: "Вернусь снова",
      body: "Третья аренда в ZakCar. В центральном офисе всё объяснили так же ясно, как в аэропорту. Неожиданных пунктов не было.",
    },
  }),
];
