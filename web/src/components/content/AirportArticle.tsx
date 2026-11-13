"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { AIRPORT_CARDS, isStockAirportTitle } from "@/lib/airport-cards";
import type { AirportId } from "@/lib/airport-slugs";
import { SITE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

type Fact = [string, string, string];
type Qa = [string, string];

type Shared = {
  payLabel: string;
  noCard: string;
  payNote: string;
  handoverLabel: string;
  reserveLabel: string;
  fromSite: string;
  freeReserve: string;
  whenLabel: string;
  noOnline: string;
  driverLabel: string;
  driverValue: string;
  driverNote: string;
  depositLabel: string;
  byLength: string;
  depositNote: string;
  reserveTitle: string;
  reserveTail: string;
  payIntro: string;
  pay: string[];
  whyTitle: string;
  whyIntro: string;
  why: string[];
  whyOut: string;
  diffTitle: string;
  diffIntro: string;
  stepBook: string;
  stepMail: string;
  stepDeposit: string;
  stepReturn: string;
  ageTitle: string;
  age: string[];
  whoCard: string;
  whoLimit: string;
  whoAbroad: string;
  whoYoung: string;
  whoLong: string;
  faqTitle: string;
  faqDeposit: Qa;
  faqAge: Qa;
};

type Spot = {
  lead: string;
  after: string;
  handoverValue: string;
  handoverNote: string;
  whenValue: string;
  reserve: string;
  payTitle: string;
  stepHandover: string;
  whoTitle: string;
  faqCan: Qa;
  faqWhere: Qa;
};

const SHARED: Record<Locale, Shared> = {
  tr: {
    payLabel: "Ödeme",
    noCard: "Kredi kartsız",
    payNote: "Nakit, banka kartı veya kredi kartı",
    handoverLabel: "Teslim",
    reserveLabel: "Rezervasyon",
    fromSite: "Siteden",
    freeReserve: "Ücretsiz, ön ödemesiz",
    whenLabel: "Ödeme zamanı",
    noOnline: "Online tahsilat yok",
    driverLabel: "Sürücü",
    driverValue: "20 yaş · 2 yıl ehliyet",
    driverNote: "Şart araca göre değişir",
    depositLabel: "Depozito",
    byLength: "Süreye göre",
    depositNote: "5.000 · 10.000 · 20.000 TL",
    reserveTitle: "Kredi kartsız rezervasyon",
    reserveTail: "Depozito ve ödeme koşulları seçtiğiniz süreye göre rezervasyon özetinde görünür, teslimde de teyit edilir. Aynı talebi WhatsApp veya telefondan da iletebilirsiniz.",
    payIntro: "Ön ödeme ve siteden kart çekimi yoktur.",
    pay: ["Nakit", "Banka kartı", "Kredi kartı, zorunlu değildir; tercih ederseniz kullanılır"],
    whyTitle: "Havalimanında kredi kartı neden genelde istenir?",
    whyIntro: "Havalimanı şubelerinde çalışan büyük kiralama firmaları çoğunlukla kredi kartı ister ve depozitoyu kart limitinde bloke eder. Gerekçeleri şunlardır:",
    why: [
      "Depozito blokesi: kart limitinin bir bölümü kiralama bitene kadar kullanılamaz.",
      "Hasar tahsilatı: olası bedel karttan çekilmek istenir.",
      "Kart sahibi banka tarafından doğrulanmış sayılır.",
      "Firma politikası çoğu ülkede aynıdır.",
    ],
    whyOut: "Bu düzen, kredi kartı olmayan ya da limitinin bloke edilmesini istemeyen misafiri dışarıda bırakır.",
    diffTitle: "ZakCar'da ödeme nasıl işler?",
    diffIntro: "ZakCar'da kredi kartı ve Findeks zorunlu değildir. Depozito nakit, banka kartı veya kredi kartıyla, kira bedelinden ayrı alınır.",
    stepBook: "Rezervasyon siteden, WhatsApp'tan veya telefondan yapılır.",
    stepMail: "Onay bilgisi e-posta ile gönderilir.",
    stepDeposit: "Depozito süreye göredir: 1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL.",
    stepReturn: "Araç teslim edildiği gibi dönerse depozito iade edilir. Koşullar kiralamadan önce özet ekranında ve teslimde belirtilir.",
    ageTitle: "Sürücü yaşı ve kredi kartsız kiralama",
    age: [
      "Genelde 20 yaş ve en az 2 yıllık B sınıfı ehliyet gerekir. Bazı gruplarda yaş ve ehliyet yılı daha yüksektir; şart seçilen aracın sayfasında yazar.",
      "Bu sınırın altındaki sürücü için genç sürücü paketi gerekir. Paket günlük 335 TL'dir. Depozito yine süre tablosuna göredir ve teslimde nakit, banka kartı veya kredi kartıyla alınabilir.",
    ],
    whoCard: "Kredi kartı olmayan misafir: ehliyet, kimlik veya pasaport ve teslimde ödeme yeterlidir.",
    whoLimit: "Kart limitini bloke ettirmek istemeyen misafir.",
    whoAbroad: "Yurt dışından gelen ve ödemeyi araç başında yapmak isteyen misafir.",
    whoYoung: "Henüz kredi kartı olmayan genç sürücü: yaş ve ehliyet şartı araç sayfasında, paket günlük 335 TL.",
    whoLong: "Uzun dönem kiralama: ödeme teslimde, depozito süreye göre bir kez alınır.",
    faqTitle: "Sık sorulanlar",
    faqDeposit: ["Depozito ne kadar?", "1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir."],
    faqAge: ["20 yaşında, kredi kartı olmadan kiralama yapılır mı?", "Yaş ve ehliyet süresi araca göre değişir. Genelde 20 yaş ve 2 yıllık ehliyet aranır; bazı gruplarda şart daha yüksektir ve araç sayfasında yazar. Sınırın altı için genç sürücü paketi günlük 335 TL'dir."],
  },
  en: {
    payLabel: "Payment",
    noCard: "No credit card",
    payNote: "Cash, debit card or credit card",
    handoverLabel: "Handover",
    reserveLabel: "Reservation",
    fromSite: "On the site",
    freeReserve: "Free, nothing prepaid",
    whenLabel: "When you pay",
    noOnline: "No online charge",
    driverLabel: "Driver",
    driverValue: "Age 20 · licence for 2 years",
    driverNote: "The rule can differ by car",
    depositLabel: "Deposit",
    byLength: "By length",
    depositNote: "5,000 · 10,000 · 20,000 TL",
    reserveTitle: "A reservation without a credit card",
    reserveTail: "The deposit and the payment terms appear in the reservation summary for the length you chose, and they are confirmed at handover. You can send the same request on WhatsApp or by phone.",
    payIntro: "Nothing is prepaid and the site does not charge a card.",
    pay: ["Cash", "Debit card", "Credit card, if you prefer it. It is not required"],
    whyTitle: "Why do airports usually ask for a credit card?",
    whyIntro: "Large rental companies at airport desks usually require a credit card and block the deposit on the card limit. Their reasons are:",
    why: [
      "A blocked deposit: part of the card limit cannot be used until the rental ends.",
      "Damage charges: they want to take a possible amount from the card.",
      "The cardholder is treated as verified by the bank.",
      "The company policy is the same in most countries.",
    ],
    whyOut: "That setup leaves out a guest who has no credit card, or who does not want the limit blocked.",
    diffTitle: "How payment works at ZakCar",
    diffIntro: "ZakCar does not require a credit card or a Findeks check. The deposit is taken separately from the rental price, in cash, by debit card, or by credit card.",
    stepBook: "You reserve on the site, on WhatsApp, or by phone.",
    stepMail: "The confirmation is sent by email.",
    stepDeposit: "The deposit depends on the length: 5,000 TL for 1–3 days, 10,000 TL for 4–10 days, and 20,000 TL from 11 days.",
    stepReturn: "If the car comes back as it was handed over, the deposit is returned. The terms are shown in the summary before the rental and again at handover.",
    ageTitle: "Driver age and renting without a credit card",
    age: [
      "The usual requirement is age 20 and a category B licence held for at least 2 years. Some groups ask for more; the car page states the rule.",
      "A driver under that limit needs the young-driver package, at 335 TL per day. The deposit still follows the length table and can be paid at handover in cash, by debit card, or by credit card.",
    ],
    whoCard: "A guest with no credit card: a licence, an ID or passport, and payment at handover are enough.",
    whoLimit: "A guest who does not want a card limit blocked.",
    whoAbroad: "A guest arriving from abroad who wants to pay at the car.",
    whoYoung: "A young driver who does not have a credit card yet: the age and licence rule is on the car page, and the package is 335 TL per day.",
    whoLong: "A long-term rental: you pay at handover, and the deposit is taken once for the length.",
    faqTitle: "Common questions",
    faqDeposit: ["How much is the deposit?", "5,000 TL for 1–3 days, 10,000 TL for 4–10 days, and 20,000 TL from 11 days. If the car is returned as delivered, the deposit is given back."],
    faqAge: ["Can a 20-year-old rent without a credit card?", "Age and licence length depend on the car. The usual rule is age 20 and a 2-year licence; some groups ask for more, and the car page says so. Under that limit the young-driver package is 335 TL per day."],
  },
  de: {
    payLabel: "Zahlung",
    noCard: "Ohne Kreditkarte",
    payNote: "Bar, Bankkarte oder Kreditkarte",
    handoverLabel: "Übergabe",
    reserveLabel: "Reservierung",
    fromSite: "Auf der Website",
    freeReserve: "Kostenlos, ohne Vorauszahlung",
    whenLabel: "Zahlungszeit",
    noOnline: "Keine Online-Abbuchung",
    driverLabel: "Fahrer",
    driverValue: "20 Jahre · Führerschein seit 2 Jahren",
    driverNote: "Die Bedingung hängt vom Fahrzeug ab",
    depositLabel: "Kaution",
    byLength: "Nach Dauer",
    depositNote: "5.000 · 10.000 · 20.000 TL",
    reserveTitle: "Reservierung ohne Kreditkarte",
    reserveTail: "Kaution und Zahlungsbedingungen stehen in der Zusammenfassung für die gewählte Dauer und werden bei der Übergabe bestätigt. Dieselbe Anfrage geht auch per WhatsApp oder Telefon.",
    payIntro: "Es gibt keine Vorauszahlung und keine Kartenabbuchung auf der Website.",
    pay: ["Bar", "Bankkarte", "Kreditkarte, wenn Sie möchten. Sie ist nicht Pflicht"],
    whyTitle: "Warum verlangen Flughäfen meist eine Kreditkarte?",
    whyIntro: "Große Vermieter an Flughafen-Schaltern verlangen meist eine Kreditkarte und blockieren die Kaution auf dem Kartenlimit. Die Gründe:",
    why: [
      "Blockierte Kaution: ein Teil des Limits ist bis zum Ende der Miete nicht nutzbar.",
      "Schadenszahlung: ein möglicher Betrag soll von der Karte abgebucht werden.",
      "Der Karteninhaber gilt als von der Bank geprüft.",
      "Die Firmenregel ist in den meisten Ländern gleich.",
    ],
    whyOut: "Damit bleibt ausgeschlossen, wer keine Kreditkarte hat oder das Limit nicht blockieren lassen möchte.",
    diffTitle: "So funktioniert die Zahlung bei ZakCar",
    diffIntro: "Bei ZakCar sind Kreditkarte und Findeks nicht Pflicht. Die Kaution wird getrennt vom Mietpreis bar, mit Bankkarte oder mit Kreditkarte genommen.",
    stepBook: "Die Reservierung läuft über die Website, WhatsApp oder das Telefon.",
    stepMail: "Die Bestätigung geht per E-Mail.",
    stepDeposit: "Die Kaution hängt von der Dauer ab: 1–3 Tage 5.000 TL, 4–10 Tage 10.000 TL, ab 11 Tagen 20.000 TL.",
    stepReturn: "Kommt das Auto so zurück, wie es übergeben wurde, wird die Kaution erstattet. Die Bedingungen stehen vor der Miete in der Zusammenfassung und noch einmal bei der Übergabe.",
    ageTitle: "Fahreralter und Miete ohne Kreditkarte",
    age: [
      "Üblich sind 20 Jahre und ein Führerschein der Klasse B seit mindestens 2 Jahren. Manche Gruppen verlangen mehr; die Bedingung steht auf der Fahrzeugseite.",
      "Darunter braucht der Fahrer das Jungfahrer-Paket, 335 TL pro Tag. Die Kaution folgt weiter der Dauertabelle und kann bei der Übergabe bar, mit Bankkarte oder mit Kreditkarte gezahlt werden.",
    ],
    whoCard: "Gast ohne Kreditkarte: Führerschein, Ausweis oder Reisepass und Zahlung bei der Übergabe genügen.",
    whoLimit: "Gast, der das Kartenlimit nicht blockieren lassen möchte.",
    whoAbroad: "Gast aus dem Ausland, der am Fahrzeug zahlen möchte.",
    whoYoung: "Junger Fahrer noch ohne Kreditkarte: Alter und Führerschein stehen auf der Fahrzeugseite, das Paket kostet 335 TL pro Tag.",
    whoLong: "Langzeitmiete: Zahlung bei der Übergabe, die Kaution wird einmal nach der Dauer genommen.",
    faqTitle: "Häufige Fragen",
    faqDeposit: ["Wie hoch ist die Kaution?", "1–3 Tage 5.000 TL, 4–10 Tage 10.000 TL, ab 11 Tagen 20.000 TL. Wird das Auto wie übergeben zurückgebracht, gibt es die Kaution zurück."],
    faqAge: ["Geht die Miete mit 20 Jahren ohne Kreditkarte?", "Alter und Führerscheindauer hängen vom Fahrzeug ab. Üblich sind 20 Jahre und 2 Jahre Führerschein; manche Gruppen verlangen mehr, das steht auf der Fahrzeugseite. Darunter kostet das Jungfahrer-Paket 335 TL pro Tag."],
  },
  ar: {
    payLabel: "الدفع",
    noCard: "بدون بطاقة ائتمان",
    payNote: "نقداً أو بطاقة بنكية أو بطاقة ائتمان",
    handoverLabel: "التسليم",
    reserveLabel: "الحجز",
    fromSite: "من الموقع",
    freeReserve: "مجاني، بلا دفعة مقدمة",
    whenLabel: "وقت الدفع",
    noOnline: "لا سحب عبر الإنترنت",
    driverLabel: "السائق",
    driverValue: "20 سنة · رخصة منذ سنتين",
    driverNote: "الشرط يختلف حسب السيارة",
    depositLabel: "التأمين",
    byLength: "حسب المدة",
    depositNote: "5.000 · 10.000 · 20.000 ليرة",
    reserveTitle: "حجز بدون بطاقة ائتمان",
    reserveTail: "يظهر التأمين وشروط الدفع في ملخص الحجز حسب المدة التي اخترتموها، ويُؤكدان عند التسليم. يمكن إرسال الطلب نفسه عبر واتساب أو الهاتف.",
    payIntro: "لا دفعة مقدمة ولا سحب من البطاقة عبر الموقع.",
    pay: ["نقداً", "بطاقة بنكية", "بطاقة ائتمان إن رغبتم. ليست إلزامية"],
    whyTitle: "لماذا تطلب المطارات عادة بطاقة ائتمان؟",
    whyIntro: "شركات التأجير الكبيرة في مكاتب المطار تطلب غالباً بطاقة ائتمان وتحجز التأمين على حد البطاقة. أسبابها:",
    why: [
      "حجز التأمين: جزء من حد البطاقة لا يُستخدم حتى تنتهي مدة التأجير.",
      "تحصيل الضرر: يريدون سحب مبلغ محتمل من البطاقة.",
      "يُعد صاحب البطاقة موثقاً من البنك.",
      "سياسة الشركة متشابهة في أغلب الدول.",
    ],
    whyOut: "هذا الأسلوب يستبعد من لا يملك بطاقة ائتمان أو لا يريد حجز حد بطاقته.",
    diffTitle: "كيف يتم الدفع لدى ZakCar",
    diffIntro: "بطاقة الائتمان وفحص Findeks ليسا إلزاميين لدى ZakCar. يُؤخذ التأمين منفصلاً عن بدل الإيجار نقداً أو ببطاقة بنكية أو ببطاقة ائتمان.",
    stepBook: "يتم الحجز من الموقع أو واتساب أو الهاتف.",
    stepMail: "تُرسل معلومات التأكيد بالبريد.",
    stepDeposit: "التأمين حسب المدة: 1–3 أيام 5.000 ليرة، 4–10 أيام 10.000 ليرة، ومن 11 يوماً 20.000 ليرة.",
    stepReturn: "إذا عادت السيارة كما سُلّمت يُرد التأمين. الشروط مكتوبة في الملخص قبل التأجير وعند التسليم.",
    ageTitle: "عمر السائق والتأجير بدون بطاقة ائتمان",
    age: [
      "المعتاد 20 سنة ورخصة فئة B منذ سنتين على الأقل. بعض الفئات تطلب أكثر، والشرط مكتوب في صفحة السيارة.",
      "من هو دون هذا الحد يحتاج باقة السائق الشاب، 335 ليرة في اليوم. التأمين يبقى حسب جدول المدة ويُدفع عند التسليم نقداً أو ببطاقة بنكية أو ائتمان.",
    ],
    whoCard: "ضيف بلا بطاقة ائتمان: الرخصة والهوية أو جواز السفر والدفع عند التسليم تكفي.",
    whoLimit: "ضيف لا يريد حجز حد بطاقته.",
    whoAbroad: "ضيف قادم من الخارج ويريد الدفع عند السيارة.",
    whoYoung: "سائق شاب بلا بطاقة ائتمان بعد: شرط العمر والرخصة في صفحة السيارة، والباقة 335 ليرة في اليوم.",
    whoLong: "تأجير طويل: الدفع عند التسليم، والتأمين يُؤخذ مرة واحدة حسب المدة.",
    faqTitle: "أسئلة شائعة",
    faqDeposit: ["كم مبلغ التأمين؟", "1–3 أيام 5.000 ليرة، 4–10 أيام 10.000 ليرة، ومن 11 يوماً 20.000 ليرة. إذا أُعيدت السيارة كما سُلّمت يُرد التأمين."],
    faqAge: ["هل يمكن التأجير في سن 20 بلا بطاقة ائتمان؟", "العمر ومدة الرخصة يختلفان حسب السيارة. المعتاد 20 سنة ورخصة منذ سنتين، وبعض الفئات تطلب أكثر وذلك مكتوب في الصفحة. دون الحد تكون باقة السائق الشاب 335 ليرة في اليوم."],
  },
  ru: {
    payLabel: "Оплата",
    noCard: "Без кредитной карты",
    payNote: "Наличные, дебетовая или кредитная карта",
    handoverLabel: "Выдача",
    reserveLabel: "Бронь",
    fromSite: "На сайте",
    freeReserve: "Бесплатно, без предоплаты",
    whenLabel: "Когда платить",
    noOnline: "Онлайн-списания нет",
    driverLabel: "Водитель",
    driverValue: "20 лет · права от 2 лет",
    driverNote: "Условие зависит от машины",
    depositLabel: "Депозит",
    byLength: "По сроку",
    depositNote: "5 000 · 10 000 · 20 000 TL",
    reserveTitle: "Бронь без кредитной карты",
    reserveTail: "Депозит и условия оплаты видны в сводке брони для выбранного срока и подтверждаются при выдаче. Ту же заявку можно отправить в WhatsApp или по телефону.",
    payIntro: "Предоплаты нет, и сайт не списывает деньги с карты.",
    pay: ["Наличные", "Дебетовая карта", "Кредитная карта, если хотите. Она не обязательна"],
    whyTitle: "Почему в аэропорту обычно просят кредитную карту?",
    whyIntro: "Крупные прокатные компании в аэропорту обычно требуют кредитную карту и блокируют депозит на лимите. Их доводы:",
    why: [
      "Блокировка депозита: часть лимита недоступна до конца аренды.",
      "Оплата ущерба: возможную сумму хотят списать с карты.",
      "Владелец карты считается проверенным банком.",
      "Правило компании одинаково в большинстве стран.",
    ],
    whyOut: "Так за бортом остаётся гость без кредитной карты или тот, кто не хочет блокировать лимит.",
    diffTitle: "Как проходит оплата в ZakCar",
    diffIntro: "В ZakCar кредитная карта и проверка Findeks не обязательны. Депозит берут отдельно от цены аренды наличными, дебетовой или кредитной картой.",
    stepBook: "Бронь делают на сайте, в WhatsApp или по телефону.",
    stepMail: "Подтверждение уходит на почту.",
    stepDeposit: "Депозит зависит от срока: 1–3 дня — 5 000 TL, 4–10 дней — 10 000 TL, от 11 дней — 20 000 TL.",
    stepReturn: "Если машину вернули в том виде, в каком выдали, депозит возвращают. Условия указаны в сводке до аренды и ещё раз при выдаче.",
    ageTitle: "Возраст водителя и аренда без кредитной карты",
    age: [
      "Обычно нужны 20 лет и права категории B не меньше 2 лет. У некоторых классов требование выше — оно написано на странице машины.",
      "Водителю младше этого порога нужен пакет молодого водителя, 335 TL в день. Депозит по-прежнему зависит от срока и принимается при выдаче наличными, дебетовой или кредитной картой.",
    ],
    whoCard: "Гость без кредитной карты: достаточно прав, удостоверения или паспорта и оплаты при выдаче.",
    whoLimit: "Гость, который не хочет блокировать лимит карты.",
    whoAbroad: "Гость из-за рубежа, который хочет платить у машины.",
    whoYoung: "Молодой водитель ещё без кредитной карты: возраст и стаж прав указаны на странице машины, пакет — 335 TL в день.",
    whoLong: "Долгая аренда: оплата при выдаче, депозит берут один раз по сроку.",
    faqTitle: "Частые вопросы",
    faqDeposit: ["Какой депозит?", "1–3 дня — 5 000 TL, 4–10 дней — 10 000 TL, от 11 дней — 20 000 TL. Если машину вернули как выдали, депозит отдают обратно."],
    faqAge: ["Можно ли в 20 лет арендовать без кредитной карты?", "Возраст и стаж прав зависят от машины. Обычно нужны 20 лет и права от 2 лет; у некоторых классов порог выше, это написано на странице. Ниже порога пакет молодого водителя стоит 335 TL в день."],
  },
};

const SPOT: Record<Locale, Record<AirportId, Spot>> = {
  tr: {
    saw: {
      lead: "İstanbul Sabiha Gökçen Havalimanı'nda kredi kartı zorunluluğu olmadan araç kiralamak istiyor musunuz? ZakCar, Sabiha Gökçen Havalimanı'nda kredi kartı ve Findeks sorgusu olmadan araç kiralayan ofislerden biridir.",
      after: "Rezervasyonu siteden ücretsiz oluşturursunuz; ön ödeme alınmaz. Aracınızı SAW geliş katında, terminal çıkışında teslim alırsınız.",
      handoverValue: "SAW geliş katı",
      handoverNote: "Terminal çıkışında karşılama",
      whenValue: "Araç tesliminde",
      reserve: "Sabiha Gökçen'de kredi kartsız kiralama sitedeki rezervasyon adımlarından yapılır. Alış yeri olarak SAW'ı, tarihleri ve aracı seçmeniz yeterlidir. Uçuş numarası zorunlu değildir; iniş saatinizi bildirirseniz geliş katında karşılama buna göre ayarlanır.",
      payTitle: "Sabiha Gökçen kredi kartsız ödeme",
      stepHandover: "Sabiha Gökçen geliş katında araç teslim edilir; ödeme bu anda alınır.",
      whoTitle: "Sabiha Gökçen'de kredi kartsız kiralama kimler için uygun?",
      faqCan: ["Sabiha Gökçen'de kredi kartsız araç kiralayabilir miyim?", "Evet. ZakCar Sabiha Gökçen'de kredi kartı ve Findeks zorunluluğu olmadan kiralama yapar. Ödeme teslimde nakit, banka kartı veya kredi kartı ile alınır. Rezervasyon siteden ücretsiz yapılır; isterseniz WhatsApp veya telefon da kullanılır."],
      faqWhere: ["Aracı Sabiha Gökçen'de nerede teslim alırım?", "SAW geliş katında, terminal çıkışında. İniş saatinizi rezervasyonda bildirmeniz karşılama için yeterlidir. Teslim ücretsizdir ve ofis 7/24 açıktır."],
    },
    iga: {
      lead: "İstanbul Havalimanı'nda kredi kartı zorunluluğu olmadan araç kiralamak istiyor musunuz? ZakCar, İstanbul Havalimanı'nda kredi kartı ve Findeks sorgusu olmadan araç kiralayan ofislerden biridir.",
      after: "Rezervasyonu siteden ücretsiz oluşturursunuz; ön ödeme alınmaz. Aracınız terminal çıkışında sizi bekler, teslim ücretsizdir.",
      handoverValue: "IGA terminal çıkışı",
      handoverNote: "Araç sizi bekler",
      whenValue: "Araç başında",
      reserve: "İstanbul Havalimanı'nda kredi kartsız kiralama sitedeki rezervasyon adımlarından yapılır. Alış yeri olarak IGA'yı, tarihleri ve aracı seçmeniz yeterlidir. Uçuş numarası zorunlu değildir; iniş saatinizi bildirirseniz teslim buna göre hazırlanır.",
      payTitle: "İstanbul Havalimanı kredi kartsız ödeme",
      stepHandover: "İstanbul Havalimanı terminal çıkışında araç teslim edilir; ödeme bu anda, araç başında alınır.",
      whoTitle: "İstanbul Havalimanı'nda kredi kartsız kiralama kimler için uygun?",
      faqCan: ["İstanbul Havalimanı'nda kredi kartsız araç kiralayabilir miyim?", "Evet. ZakCar İstanbul Havalimanı'nda kredi kartı ve Findeks zorunluluğu olmadan kiralama yapar. Ödeme teslimde nakit, banka kartı veya kredi kartı ile alınır. Rezervasyon siteden ücretsiz yapılır; isterseniz WhatsApp veya telefon da kullanılır."],
      faqWhere: ["Aracı İstanbul Havalimanı'nda nerede teslim alırım?", "Terminal çıkışında. İniş saatinizi rezervasyonda bildirmeniz yeterlidir. Araç sizi bekler, teslim ücretsizdir ve ofis 7/24 açıktır."],
    },
  },
  en: {
    saw: {
      lead: "Do you want to rent a car at Istanbul Sabiha Gökçen Airport without a credit card? ZakCar is one of the desks there that rents with no credit card and no Findeks check.",
      after: "You make the reservation on the site for free, and nothing is prepaid. You collect the car on the SAW arrivals floor, at the terminal exit.",
      handoverValue: "SAW arrivals floor",
      handoverNote: "Meet at the terminal exit",
      whenValue: "At handover",
      reserve: "A rental without a credit card at Sabiha Gökçen starts in the reservation steps on the site. Choose SAW as the pickup, then the dates and the car. A flight number is not required. If you share your landing time, the meet on the arrivals floor is set to it.",
      payTitle: "Paying at Sabiha Gökçen without a credit card",
      stepHandover: "The car is handed over on the Sabiha Gökçen arrivals floor, and payment is taken then.",
      whoTitle: "Who a no-card rental at Sabiha Gökçen suits",
      faqCan: ["Can I rent at Sabiha Gökçen without a credit card?", "Yes. ZakCar rents at Sabiha Gökçen with no credit card and no Findeks check. You pay at handover in cash, by debit card, or by credit card. The reservation on the site is free. WhatsApp or a phone call also works."],
      faqWhere: ["Where do I collect the car at Sabiha Gökçen?", "On the SAW arrivals floor, at the terminal exit. Putting your landing time on the reservation is enough for the meet. Handover is free and the desk is open 24 hours."],
    },
    iga: {
      lead: "Do you want to rent a car at Istanbul Airport without a credit card? ZakCar is one of the desks there that rents with no credit card and no Findeks check.",
      after: "You make the reservation on the site for free, and nothing is prepaid. The car waits for you at the terminal exit, and handover is free.",
      handoverValue: "IGA terminal exit",
      handoverNote: "The car waits for you",
      whenValue: "At the car",
      reserve: "A rental without a credit card at Istanbul Airport starts in the reservation steps on the site. Choose IGA as the pickup, then the dates and the car. A flight number is not required. If you share your landing time, handover is prepared for it.",
      payTitle: "Paying at Istanbul Airport without a credit card",
      stepHandover: "The car is handed over at the Istanbul Airport terminal exit, and you pay then, at the car.",
      whoTitle: "Who a no-card rental at Istanbul Airport suits",
      faqCan: ["Can I rent at Istanbul Airport without a credit card?", "Yes. ZakCar rents at Istanbul Airport with no credit card and no Findeks check. You pay at handover in cash, by debit card, or by credit card. The reservation on the site is free. WhatsApp or a phone call also works."],
      faqWhere: ["Where do I collect the car at Istanbul Airport?", "At the terminal exit. Putting your landing time on the reservation is enough. The car waits for you, handover is free, and the desk is open 24 hours."],
    },
  },
  de: {
    saw: {
      lead: "Möchten Sie am Flughafen Istanbul Sabiha Gökçen ohne Kreditkarte ein Auto mieten? ZakCar ist dort eines der Büros, das ohne Kreditkarte und ohne Findeks-Prüfung vermietet.",
      after: "Die Reservierung auf der Website ist kostenlos, eine Vorauszahlung gibt es nicht. Sie holen das Auto im Ankunftsbereich von SAW ab, am Terminalausgang.",
      handoverValue: "SAW Ankunft",
      handoverNote: "Treffen am Terminalausgang",
      whenValue: "Bei der Übergabe",
      reserve: "Die Miete ohne Kreditkarte am Sabiha Gökçen beginnt in den Reservierungsschritten der Website. Wählen Sie SAW als Abholort, dazu die Daten und das Auto. Eine Flugnummer ist nicht nötig. Nennen Sie die Landezeit, dann richtet sich das Treffen im Ankunftsbereich danach.",
      payTitle: "Zahlung am Sabiha Gökçen ohne Kreditkarte",
      stepHandover: "Das Auto wird im Ankunftsbereich von Sabiha Gökçen übergeben, die Zahlung erfolgt in diesem Moment.",
      whoTitle: "Für wen die Miete ohne Kreditkarte am Sabiha Gökçen passt",
      faqCan: ["Kann ich am Sabiha Gökçen ohne Kreditkarte mieten?", "Ja. ZakCar vermietet am Sabiha Gökçen ohne Kreditkarte und ohne Findeks-Prüfung. Die Zahlung bei der Übergabe erfolgt bar, mit Bankkarte oder mit Kreditkarte. Die Reservierung auf der Website ist kostenlos. WhatsApp oder ein Anruf geht auch."],
      faqWhere: ["Wo hole ich das Auto am Sabiha Gökçen ab?", "Im Ankunftsbereich von SAW, am Terminalausgang. Die Landezeit in der Reservierung genügt für das Treffen. Die Übergabe ist kostenlos, das Büro ist 24 Stunden offen."],
    },
    iga: {
      lead: "Möchten Sie am Istanbul Airport ohne Kreditkarte ein Auto mieten? ZakCar ist dort eines der Büros, das ohne Kreditkarte und ohne Findeks-Prüfung vermietet.",
      after: "Die Reservierung auf der Website ist kostenlos, eine Vorauszahlung gibt es nicht. Das Auto wartet am Terminalausgang, die Übergabe ist kostenlos.",
      handoverValue: "IGA Terminalausgang",
      handoverNote: "Das Auto wartet",
      whenValue: "Am Fahrzeug",
      reserve: "Die Miete ohne Kreditkarte am Istanbul Airport beginnt in den Reservierungsschritten der Website. Wählen Sie IGA als Abholort, dazu die Daten und das Auto. Eine Flugnummer ist nicht nötig. Nennen Sie die Landezeit, dann wird die Übergabe danach vorbereitet.",
      payTitle: "Zahlung am Istanbul Airport ohne Kreditkarte",
      stepHandover: "Das Auto wird am Terminalausgang des Istanbul Airport übergeben, die Zahlung erfolgt dann am Fahrzeug.",
      whoTitle: "Für wen die Miete ohne Kreditkarte am Istanbul Airport passt",
      faqCan: ["Kann ich am Istanbul Airport ohne Kreditkarte mieten?", "Ja. ZakCar vermietet am Istanbul Airport ohne Kreditkarte und ohne Findeks-Prüfung. Die Zahlung bei der Übergabe erfolgt bar, mit Bankkarte oder mit Kreditkarte. Die Reservierung auf der Website ist kostenlos. WhatsApp oder ein Anruf geht auch."],
      faqWhere: ["Wo hole ich das Auto am Istanbul Airport ab?", "Am Terminalausgang. Die Landezeit in der Reservierung genügt. Das Auto wartet, die Übergabe ist kostenlos, das Büro ist 24 Stunden offen."],
    },
  },
  ar: {
    saw: {
      lead: "هل تريدون استئجار سيارة في مطار إسطنبول صبيحة كوكجن بدون بطاقة ائتمان؟ ZakCar من المكاتب التي تؤجر هناك بلا بطاقة ائتمان وبلا فحص Findeks.",
      after: "تنشئون الحجز من الموقع مجاناً، ولا تُؤخذ دفعة مقدمة. تستلمون السيارة في طابق الوصول في SAW، عند مخرج المبنى.",
      handoverValue: "طابق الوصول SAW",
      handoverNote: "استقبال عند مخرج المبنى",
      whenValue: "عند التسليم",
      reserve: "التأجير بلا بطاقة ائتمان في صبيحة كوكجن يبدأ من خطوات الحجز في الموقع. يكفي اختيار SAW مكاناً للاستلام ثم التواريخ والسيارة. رقم الرحلة ليس إلزامياً. إذا أبلغتم بوقت الهبوط يُرتب الاستقبال في طابق الوصول على أساسه.",
      payTitle: "الدفع في صبيحة كوكجن بدون بطاقة ائتمان",
      stepHandover: "تُسلَّم السيارة في طابق الوصول بصبيحة كوكجن، ويُؤخذ الدفع في تلك اللحظة.",
      whoTitle: "لمن يناسب التأجير بلا بطاقة ائتمان في صبيحة كوكجن؟",
      faqCan: ["هل يمكن التأجير في صبيحة كوكجن بلا بطاقة ائتمان؟", "نعم. ZakCar يؤجر في صبيحة كوكجن بلا بطاقة ائتمان وبلا فحص Findeks. الدفع عند التسليم نقداً أو ببطاقة بنكية أو ائتمان. الحجز من الموقع مجاني، وواتساب أو الهاتف متاحان أيضاً."],
      faqWhere: ["أين أستلم السيارة في صبيحة كوكجن؟", "في طابق الوصول في SAW عند مخرج المبنى. كتابة وقت الهبوط في الحجز تكفي للاستقبال. التسليم مجاني والمكتب يعمل 24 ساعة."],
    },
    iga: {
      lead: "هل تريدون استئجار سيارة في مطار إسطنبول بدون بطاقة ائتمان؟ ZakCar من المكاتب التي تؤجر هناك بلا بطاقة ائتمان وبلا فحص Findeks.",
      after: "تنشئون الحجز من الموقع مجاناً، ولا تُؤخذ دفعة مقدمة. السيارة بانتظاركم عند مخرج المبنى، والتسليم مجاني.",
      handoverValue: "مخرج مبنى IGA",
      handoverNote: "السيارة بانتظاركم",
      whenValue: "عند السيارة",
      reserve: "التأجير بلا بطاقة ائتمان في مطار إسطنبول يبدأ من خطوات الحجز في الموقع. يكفي اختيار IGA مكاناً للاستلام ثم التواريخ والسيارة. رقم الرحلة ليس إلزامياً. إذا أبلغتم بوقت الهبوط يُجهَّز التسليم على أساسه.",
      payTitle: "الدفع في مطار إسطنبول بدون بطاقة ائتمان",
      stepHandover: "تُسلَّم السيارة عند مخرج مبنى مطار إسطنبول، ويُؤخذ الدفع حينها عند السيارة.",
      whoTitle: "لمن يناسب التأجير بلا بطاقة ائتمان في مطار إسطنبول؟",
      faqCan: ["هل يمكن التأجير في مطار إسطنبول بلا بطاقة ائتمان؟", "نعم. ZakCar يؤجر في مطار إسطنبول بلا بطاقة ائتمان وبلا فحص Findeks. الدفع عند التسليم نقداً أو ببطاقة بنكية أو ائتمان. الحجز من الموقع مجاني، وواتساب أو الهاتف متاحان أيضاً."],
      faqWhere: ["أين أستلم السيارة في مطار إسطنبول؟", "عند مخرج المبنى. كتابة وقت الهبوط في الحجز تكفي. السيارة بانتظاركم، والتسليم مجاني والمكتب يعمل 24 ساعة."],
    },
  },
  ru: {
    saw: {
      lead: "Хотите арендовать машину в аэропорту Стамбул Сабиха Гёкчен без кредитной карты? ZakCar — один из офисов там, где аренда идёт без кредитной карты и без проверки Findeks.",
      after: "Бронь на сайте бесплатная, предоплаты нет. Машину забираете в зоне прилёта SAW, у выхода из терминала.",
      handoverValue: "Прилёт SAW",
      handoverNote: "Встреча у выхода из терминала",
      whenValue: "При выдаче",
      reserve: "Аренда без кредитной карты в Сабихе Гёкчен начинается с шагов брони на сайте. Достаточно выбрать SAW местом выдачи, даты и машину. Номер рейса не обязателен. Если напишете время посадки, встреча в зоне прилёта подстроится под него.",
      payTitle: "Оплата в Сабихе Гёкчен без кредитной карты",
      stepHandover: "Машину выдают в зоне прилёта Сабихи Гёкчен, оплату берут в этот момент.",
      whoTitle: "Кому подходит аренда без карты в Сабихе Гёкчен",
      faqCan: ["Можно ли арендовать в Сабихе Гёкчен без кредитной карты?", "Да. ZakCar сдаёт машины в Сабихе Гёкчен без кредитной карты и без проверки Findeks. Оплата при выдаче наличными, дебетовой или кредитной картой. Бронь на сайте бесплатная. Подойдут и WhatsApp, и звонок."],
      faqWhere: ["Где забрать машину в Сабихе Гёкчен?", "В зоне прилёта SAW, у выхода из терминала. Времени посадки в брони достаточно для встречи. Выдача бесплатная, офис работает круглосуточно."],
    },
    iga: {
      lead: "Хотите арендовать машину в аэропорту Стамбула без кредитной карты? ZakCar — один из офисов там, где аренда идёт без кредитной карты и без проверки Findeks.",
      after: "Бронь на сайте бесплатная, предоплаты нет. Машина ждёт у выхода из терминала, выдача бесплатная.",
      handoverValue: "Выход терминала IGA",
      handoverNote: "Машина ждёт вас",
      whenValue: "У машины",
      reserve: "Аренда без кредитной карты в аэропорту Стамбула начинается с шагов брони на сайте. Достаточно выбрать IGA местом выдачи, даты и машину. Номер рейса не обязателен. Если напишете время посадки, выдачу подготовят к нему.",
      payTitle: "Оплата в аэропорту Стамбула без кредитной карты",
      stepHandover: "Машину выдают у выхода из терминала аэропорта Стамбула, оплату берут тогда же, у машины.",
      whoTitle: "Кому подходит аренда без карты в аэропорту Стамбула",
      faqCan: ["Можно ли арендовать в аэропорту Стамбула без кредитной карты?", "Да. ZakCar сдаёт машины в аэропорту Стамбула без кредитной карты и без проверки Findeks. Оплата при выдаче наличными, дебетовой или кредитной картой. Бронь на сайте бесплатная. Подойдут и WhatsApp, и звонок."],
      faqWhere: ["Где забрать машину в аэропорту Стамбула?", "У выхода из терминала. Времени посадки в брони достаточно. Машина ждёт, выдача бесплатная, офис работает круглосуточно."],
    },
  },
};

function payIntro(locale: Locale, airport: AirportId, shared: Shared): string {
  if (locale === "tr") {
    return airport === "saw"
      ? `Ödeme araç tesliminde alınır. ${shared.payIntro}`
      : `Ödeme araç başında alınır. ${shared.payIntro}`;
  }
  if (locale === "en") {
    return airport === "saw"
      ? `Payment is taken when the car is handed over. ${shared.payIntro}`
      : `Payment is taken at the car. ${shared.payIntro}`;
  }
  if (locale === "de") {
    return airport === "saw"
      ? `Die Zahlung wird bei der Übergabe genommen. ${shared.payIntro}`
      : `Die Zahlung wird am Fahrzeug genommen. ${shared.payIntro}`;
  }
  if (locale === "ar") {
    return airport === "saw"
      ? `يُؤخذ الدفع عند تسليم السيارة. ${shared.payIntro}`
      : `يُؤخذ الدفع عند السيارة. ${shared.payIntro}`;
  }
  return airport === "saw"
    ? `Оплату берут при выдаче машины. ${shared.payIntro}`
    : `Оплату берут у машины. ${shared.payIntro}`;
}

const ARTICLE =
  "legal-content mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-ink-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_strong]:font-semibold [&_strong]:text-ink";

function ContactLine() {
  const { t } = usePrefs();
  return (
    <p>
      {t("contact.phone")}{" "}
      <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
      {" · "}
      WhatsApp{" "}
      <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
        {SITE.whatsappDisplay}
      </a>
      {" · "}
      <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      {" · "}
      <Link href="/arac-modelleri">{t("seo.browseCars")}</Link>
    </p>
  );
}

export function AirportDetailText({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  return (
    <article className={ARTICLE}>
      {blocks.map((block, index) =>
        block.startsWith("## ") ? <h2 key={index}>{block.slice(3)}</h2> : <p key={index}>{block}</p>,
      )}
      <ContactLine />
    </article>
  );
}

export function AirportHeading({ slug, savedTitle }: { slug: string; savedTitle?: string }) {
  const { locale, t } = usePrefs();
  const card = AIRPORT_CARDS.find((item) => item.href === `/${slug}`);
  const translated = card ? t(card.titleKey) : "";
  const saved = savedTitle?.trim() ?? "";
  const title =
    locale === "tr" && saved && !(card && isStockAirportTitle(card.id, saved)) ? saved : translated;

  useEffect(() => {
    if (title) document.title = `${title} | ${SITE.shortName}`;
  }, [title]);

  if (!title) return null;
  return <h1 className="section-title">{title}</h1>;
}

export function AirportArticle({ airport, customDetail }: { airport: AirportId; customDetail?: string }) {
  const { locale } = usePrefs();
  if (locale === "tr" && customDetail?.trim()) {
    return <AirportDetailText text={customDetail} />;
  }

  const shared = SHARED[locale];
  const spot = SPOT[locale][airport];
  const facts: Fact[] = [
    [shared.payLabel, shared.noCard, shared.payNote],
    [shared.handoverLabel, spot.handoverValue, spot.handoverNote],
    [shared.reserveLabel, shared.fromSite, shared.freeReserve],
    [shared.whenLabel, spot.whenValue, shared.noOnline],
    [shared.driverLabel, shared.driverValue, shared.driverNote],
    [shared.depositLabel, shared.byLength, shared.depositNote],
  ];
  const faq: Qa[] = [spot.faqCan, shared.faqDeposit, spot.faqWhere, shared.faqAge];

  return (
    <article className={ARTICLE}>
      <p>{spot.lead}</p>
      <p>{spot.after}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-surface-border bg-white px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
            <dd className="mt-1 font-semibold text-ink">{value}</dd>
            <dd className="text-sm">{note}</dd>
          </div>
        ))}
      </dl>

      <h2>{shared.reserveTitle}</h2>
      <p>{spot.reserve}</p>
      <p>{shared.reserveTail}</p>

      <h2>{spot.payTitle}</h2>
      <p>{payIntro(locale, airport, shared)}</p>
      <ul className="list-disc space-y-2 pl-5">
        {shared.pay.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{shared.whyTitle}</h2>
      <p>{shared.whyIntro}</p>
      <ul className="list-disc space-y-2 pl-5">
        {shared.why.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{shared.whyOut}</p>

      <h2>{shared.diffTitle}</h2>
      <p>{shared.diffIntro}</p>
      <ol className="list-decimal space-y-2 pl-5">
        {[shared.stepBook, shared.stepMail, spot.stepHandover, shared.stepDeposit, shared.stepReturn].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <h2>{shared.ageTitle}</h2>
      {shared.age.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h2>{spot.whoTitle}</h2>
      <ul className="list-disc space-y-2 pl-5">
        {[shared.whoCard, shared.whoLimit, shared.whoAbroad, shared.whoYoung, shared.whoLong].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{shared.faqTitle}</h2>
      <div className="space-y-4">
        {faq.map(([question, answer]) => (
          <div key={question}>
            <p className="font-semibold text-ink">{question}</p>
            <p className="mt-1">{answer}</p>
          </div>
        ))}
      </div>
      <ContactLine />
    </article>
  );
}
