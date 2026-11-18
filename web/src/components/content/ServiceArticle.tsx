"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SITE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import type { ServiceSlug } from "@/lib/service-slugs";

type PageCopy = {
  title: string;
  sub: string;
  lead: string;
  after: string;
  facts: readonly (readonly [string, string, string])[];
  reserveTitle: string;
  reserve: readonly string[];
  payTitle: string;
  payIntro: string;
  pay: readonly string[];
  whyTitle: string;
  whyIntro: string;
  why: readonly string[];
  whyOut?: string;
  diffTitle: string;
  diffIntro: string;
  steps: readonly string[];
  extraTitle?: string;
  extra?: readonly string[];
  faqTitle: string;
  faq: readonly (readonly [string, string])[];
};

const DEPOSIT: Record<Locale, string> = {
  tr: "1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL",
  en: "1–3 days 5,000 TL, 4–10 days 10,000 TL, 11 days or more 20,000 TL",
  de: "1–3 Tage 5.000 TL, 4–10 Tage 10.000 TL, ab 11 Tagen 20.000 TL",
  ar: "1–3 أيام 5.000 ليرة، 4–10 أيام 10.000 ليرة، 11 يوماً فأكثر 20.000 ليرة",
  ru: "1–3 дня 5 000 TL, 4–10 дней 10 000 TL, от 11 дней 20 000 TL",
};

const COPY: Record<Locale, Record<ServiceSlug, PageCopy>> = {
  tr: {
    "kredi-kartsiz-arac-kiralama": {
      title: "Kredi Kartsız Araç Kiralama",
      sub: "Kredi kartı ve provizyon yok. Ödeme araç başında nakit, banka kartı veya kredi kartıyla.",
      lead: "Kredi kartı zorunluluğu olmadan araç kiralamak istiyor musunuz? ZakCar, Sabiha Gökçen, İstanbul Havalimanı ve merkez ofiste kredi kartı ve Findeks sorgusu olmadan araç kiralayan ofislerden biridir.",
      after: "Rezervasyonu siteden ücretsiz oluşturursunuz; ön ödeme alınmaz. Aracı seçtiğiniz ofiste teslim alırsınız. Havalimanı teslimi ücretsizdir.",
      facts: [
        ["Ödeme", "Kredi kartsız", "Nakit, banka kartı veya kredi kartı"],
        ["Teslim", "SAW, IST, merkez", "Havalimanında ücretsiz"],
        ["Rezervasyon", "Siteden", "Ücretsiz, ön ödemesiz"],
        ["Ödeme zamanı", "Araç tesliminde", "Online tahsilat yok"],
        ["Sürücü", "20 yaş · 2 yıl ehliyet", "Şart araca göre değişir"],
        ["Depozito", "Süreye göre", "5.000 · 10.000 · 20.000 TL"],
      ],
      reserveTitle: "Kredi kartsız rezervasyon",
      reserve: [
        "Kredi kartsız kiralama sitedeki rezervasyon adımlarından yapılır. Alış yeri olarak Sabiha Gökçen, İstanbul Havalimanı veya merkez ofisi, tarihleri ve aracı seçmeniz yeterlidir. Uçuş numarası zorunlu değildir; iniş saatinizi bildirirseniz havalimanı teslimi buna göre ayarlanır.",
        "Depozito ve ödeme koşulları seçtiğiniz süreye göre rezervasyon özetinde görünür, teslimde de teyit edilir. Aynı talebi WhatsApp veya telefondan da iletebilirsiniz.",
      ],
      payTitle: "Kredi kartsız ödeme",
      payIntro: "Ödeme araç tesliminde alınır. Ön ödeme ve siteden kart çekimi yoktur.",
      pay: ["Nakit", "Banka kartı", "Kredi kartı, zorunlu değildir; tercih ederseniz kullanılır"],
      whyTitle: "Kredi kartı neden genelde istenir?",
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
      steps: [
        "Rezervasyon siteden, WhatsApp'tan veya telefondan yapılır.",
        "Onay bilgisi e-posta ile gönderilir.",
        "Araç seçilen ofiste teslim edilir; ödeme bu anda alınır.",
        `Depozito süreye göredir: ${DEPOSIT.tr}.`,
        "Araç teslim edildiği gibi dönerse depozito iade edilir. Koşullar kiralamadan önce özet ekranında ve teslimde belirtilir.",
      ],
      extraTitle: "Sürücü yaşı ve kredi kartsız kiralama",
      extra: [
        "Genelde 20 yaş ve en az 2 yıllık B sınıfı ehliyet gerekir. Bazı gruplarda yaş ve ehliyet yılı daha yüksektir; şart seçilen aracın sayfasında yazar.",
        "Bu sınırın altındaki sürücü için genç sürücü paketi gerekir. Paket günlük 335 TL'dir. Depozito yine süre tablosuna göredir ve teslimde nakit, banka kartı veya kredi kartıyla alınabilir.",
      ],
      faqTitle: "Sık sorulanlar",
      faq: [
        ["Kredi kartsız araç kiralayabilir miyim?", "Evet. ZakCar kredi kartı ve Findeks zorunluluğu olmadan kiralama yapar. Ödeme teslimde nakit, banka kartı veya kredi kartı ile alınır. Rezervasyon siteden ücretsiz yapılır; isterseniz WhatsApp veya telefon da kullanılır."],
        ["Depozito ne kadar?", `${DEPOSIT.tr}'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir.`],
        ["Aracı nerede teslim alırım?", "Sabiha Gökçen geliş katında, İstanbul Havalimanı terminal çıkışında veya merkez ofiste. Havalimanı teslimi ücretsizdir. İniş saatinizi bildirmeniz karşılama için yeterlidir."],
        ["20 yaşında, kredi kartı olmadan kiralama yapılır mı?", "Yaş ve ehliyet süresi araca göre değişir. Genelde 20 yaş ve 2 yıllık ehliyet aranır; bazı gruplarda şart daha yüksektir ve araç sayfasında yazar. Sınırın altı için genç sürücü paketi günlük 335 TL'dir."],
      ],
    },
    "uzun-donem-arac-kiralama": {
      title: "Uzun Dönem Araç Kiralama",
      sub: "Aylık ve daha uzun kiralamalar. Depozito süreye göre, ödeme teslimde.",
      lead: "Birkaç hafta veya ay boyunca araca ihtiyacınız varsa uzun dönem kiralama, aracı satın almadan aynı filodan kullanmanızı sağlar. ZakCar'da uzun dönem de kredi kartı ve Findeks zorunluluğu olmadan yapılır.",
      after: "En kısa kiralama 24 saattir. Aylık ve daha uzun süreler için rezervasyonu siteden başlatabilir, netleştirmek için çağrı merkezini arayabilirsiniz. Ön ödeme alınmaz.",
      facts: [
        ["Süre", "1 günden aylığa", "Aylık için çağrı merkezi"],
        ["Yol hakkı", "Aylık 3.800 km", "Günlük 300 km, 10 günde 2.200 km"],
        ["Depozito", "11 gün ve üzeri", "20.000 TL"],
        ["Ödeme", "Teslimde", "Nakit, banka kartı veya kredi kartı"],
        ["Belge", "Aylık kiralamada", "Adres teyidi için fatura"],
        ["Teslim", "SAW, IST, merkez", "Havalimanında ücretsiz"],
      ],
      reserveTitle: "Uzun dönem rezervasyon",
      reserve: [
        "Tarihleri ve aracı siteden seçersiniz. Süre uzadıkça depozito dilimi değişir: 1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzerinde 20.000 TL. Tutar rezervasyon özetinde görünür.",
        "Aylık kiralama için çağrı merkezimiz süre, kilometre ve teslim ofisini sizinle netleştirir. Adres teyidi için fatura veya benzeri bir belge istenir.",
      ],
      payTitle: "Uzun dönemde ödeme",
      payIntro: "Kira bedeli ve depozito araç tesliminde, peşin alınır. Siteden kart çekimi ve ön ödeme yoktur. Kredi kartı zorunlu değildir.",
      pay: ["Nakit", "Banka kartı", "Kredi kartı, tercih ederseniz kullanılır"],
      whyTitle: "Uzun dönem kiralama ne zaman uygun?",
      whyIntro: "Günlük kiralamayı uzatmak yerine baştan uzun süre seçmek şu durumlarda daha düzenli olur:",
      why: [
        "Şehirde birkaç hafta veya ay kalacaksanız.",
        "İş için sürekli araca ihtiyacınız varsa ve filo satın almak istemiyorsanız.",
        "Havalimanından alıp aynı ofise bırakacaksanız.",
        "Kart limitinin bloke edilmesini istemiyorsanız. Depozito nakit veya banka kartıyla da alınır.",
      ],
      diffTitle: "Süre ve kilometre",
      diffIntro: "Yol hakkı seçilen güne göre rezervasyon özetinde yazar. Sınırı aşan kilometre, teslimde bildirilen birim bedelle hesaplanır.",
      steps: [
        "Günlük yol hakkı 300 km.",
        "10 güne kadar 2.200 km.",
        "Aylık yol hakkı 3.800 km.",
        "Daha fazla kullanım için çağrı merkeziyle konuşulur.",
        "Erken iade veya uzatmada ücret, kullanılan gün sayısına göre yeniden hesaplanır.",
      ],
      extraTitle: "Teslim ve sürücü",
      extra: [
        "Araç Sabiha Gökçen, İstanbul Havalimanı veya merkez ofiste teslim edilir. Havalimanı ofisleri 7/24 açıktır, teslim ücretsizdir.",
        "Genelde 20 yaş ve en az 2 yıllık ehliyet aranır. Şart araca göre değişir ve araç sayfasında yazar. Sürücü teslimde ehliyetini gösterir ve sözleşmeyi imzalar.",
      ],
      faqTitle: "Sık sorulanlar",
      faq: [
        ["Uzun dönem kiralama nasıl başlar?", "Siteden tarih ve aracı seçebilirsiniz. Aylık ve daha uzun süreler için çağrı merkezi süreci netleştirir. Rezervasyon ücretsizdir, ön ödeme alınmaz."],
        ["Depozito uzun dönemde ne kadar?", "11 gün ve üzeri kiralamada depozito 20.000 TL'dir. Daha kısa sürelerde 1–3 gün 5.000 TL, 4–10 gün 10.000 TL uygulanır. Araç teslim edildiği gibi dönerse depozito iade edilir."],
        ["Aylık kilometre sınırı nedir?", "Aylık yol hakkı 3.800 km'dir. Günlük 300 km, 10 günde 2.200 km'dir. Aşan kilometre teslimde, önceden bildirilen birim bedelle hesaplanır."],
        ["Kredi kartı şart mı?", "Hayır. Ödeme teslimde nakit, banka kartı veya kredi kartıyla alınır. Findeks sorgusu yapılmaz."],
      ],
    },
    "kurumsal-arac-kiralama": {
      title: "Kurumsal Araç Kiralama",
      sub: "Şirketler için araç kiralama. Teslim Sabiha Gökçen, İstanbul Havalimanı ve merkez ofiste.",
      lead: "Şirketiniz için tek araç ya da birden fazla araç gerekiyorsa ZakCar kurumsal kiralama, aynı filoyu Sabiha Gökçen, İstanbul Havalimanı ve merkez ofisten teslim eder.",
      after: "Teklif çağrı merkezi veya WhatsApp üzerinden netleşir. Rezervasyon ücretsizdir, ön ödeme alınmaz. Ödeme araç tesliminde yapılır; kredi kartı ve Findeks zorunlu değildir.",
      facts: [
        ["Kim için", "Şirketler", "Tek araç veya birden fazla araç"],
        ["Teslim", "SAW, IST, merkez", "Havalimanında 7/24"],
        ["Ödeme", "Teslimde", "Nakit, banka kartı veya kredi kartı"],
        ["Sürücü", "Teslimde imza", "Ehliyet ve kimlik"],
        ["Depozito", "Süreye göre", "5.000 · 10.000 · 20.000 TL"],
        ["Aylık", "Adres teyidi", "Fatura veya benzeri belge"],
      ],
      reserveTitle: "Kurumsal talep nasıl iletilir?",
      reserve: [
        "Araç sayısı, teslim ofisi, tarihler ve yaklaşık süreyi çağrı merkezine veya WhatsApp'a yazmanız yeterlidir. İsterseniz önce siteden tek bir aracı da rezerve edebilirsiniz.",
        "Aracı teslim alacak sürücü ehliyet ve kimliğini getirir, kiralama sözleşmesini kendisi imzalar. Sözleşmede adı olmayan kişi aracı kullanamaz.",
      ],
      payTitle: "Kurumsal kiralamada ödeme",
      payIntro: "Kira bedeli ve depozito teslimde alınır. Kart limiti bloke edilmez. Kredi kartı zorunlu değildir; nakit veya banka kartı da geçerlidir.",
      pay: ["Nakit", "Banka kartı", "Kredi kartı, sürücü tercih ederse"],
      whyTitle: "Şirketler için ne işe yarar?",
      whyIntro: "Araç satın almak veya mevcut bir aracı havalimanına bırakmak yerine kiralama şu işleri sadeleştirir:",
      why: [
        "Misafir veya personel inişinde araç hazır olur. SAW ve IST ofisleri 7/24 açıktır.",
        "Depozito süreye göredir ve kira bedelinden ayrıdır.",
        "Aylık kullanımda yol hakkı 3.800 km'dir. Günlük 300 km, 10 günde 2.200 km'dir.",
        "Kartı olmayan veya limit blokesi istemeyen sürücü de aracı teslim alabilir.",
      ],
      diffTitle: "Teslim nasıl olur?",
      diffIntro: "Ofis, tarih ve sürücü bilgisi rezervasyonda bellidir. Havalimanında personel iniş saatine göre bekler, otopark ücretini ZakCar öder.",
      steps: [
        "Talep siteden, telefondan veya WhatsApp'tan alınır.",
        "Onay bilgisi e-posta ile gider.",
        "Sürücü seçilen ofiste ehliyetini gösterir ve sözleşmeyi imzalar.",
        `Depozito süreye göredir: ${DEPOSIT.tr}.`,
        "Araç teslim edildiği gibi dönerse depozito iade edilir.",
      ],
      extraTitle: "Aylık kurumsal kullanım",
      extra: [
        "Aylık ve daha uzun kiralamalarda süre, kilometre ve teslim ofisi çağrı merkeziyle netleştirilir. Adres teyidi için fatura veya benzeri bir belge istenir.",
        "Erken iade veya süre uzatmada ücret, kullanılan gün sayısına göre yeniden hesaplanır. Ayrıntı kiralama koşulları sayfasında yazılıdır.",
      ],
      faqTitle: "Sık sorulanlar",
      faq: [
        ["Şirket adına nasıl araç kiralanır?", "Araç sayısı, ofis ve tarihleri çağrı merkezine veya WhatsApp'a iletin. Sürücü teslimde sözleşmeyi imzalar. Rezervasyon ücretsizdir, ön ödeme yoktur."],
        ["Kredi kartı şirket kartı olmak zorunda mı?", "Hayır. Kredi kartı zorunlu değildir. Ödeme teslimde nakit, banka kartı veya kredi kartıyla alınır. Findeks sorgusu yapılmaz."],
        ["Depozito ne kadar?", `${DEPOSIT.tr}'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir.`],
        ["Birden fazla personel aynı aracı kullanabilir mi?", "Yalnızca sözleşmede adı yazan sürücüler kullanabilir. Ek sürücü teslimde ehliyetini ibraz eder ve sözleşmeyi imzalar."],
      ],
    },
    "findeks-sorgusuz-arac-kiralama": {
      title: "Findeks Sorgusuz Araç Kiralama",
      sub: "Findeks sorgusu yok. Ödeme araç başında nakit, banka kartı veya kredi kartıyla.",
      lead: "Findeks notu sorulmadan araç kiralamak istiyor musunuz? ZakCar, Sabiha Gökçen, İstanbul Havalimanı ve merkez ofiste Findeks sorgusu yapmadan araç kiralar.",
      after: "Rezervasyonu siteden ücretsiz oluşturursunuz; ön ödeme alınmaz. Aracı seçtiğiniz ofiste teslim alırsınız. Havalimanı teslimi ücretsizdir. Kredi kartı da zorunlu değildir.",
      facts: [
        ["Sorgu", "Findeks yok", "Kredi notu istenmez"],
        ["Ödeme", "Teslimde", "Nakit, banka kartı veya kredi kartı"],
        ["Rezervasyon", "Siteden", "Ücretsiz, ön ödemesiz"],
        ["Teslim", "SAW, IST, merkez", "Havalimanında ücretsiz"],
        ["Sürücü", "20 yaş · 2 yıl ehliyet", "Şart araca göre değişir"],
        ["Depozito", "Süreye göre", "5.000 · 10.000 · 20.000 TL"],
      ],
      reserveTitle: "Findeks olmadan rezervasyon",
      reserve: [
        "Rezervasyon sitedeki adımlardan yapılır. Alış yeri olarak Sabiha Gökçen, İstanbul Havalimanı veya merkez ofisi, tarihleri ve aracı seçmeniz yeterlidir. Findeks notu veya kredi kartı istenmez.",
        "Depozito ve ödeme koşulları seçtiğiniz süreye göre rezervasyon özetinde görünür, teslimde de teyit edilir. Aynı talebi WhatsApp veya telefondan da iletebilirsiniz.",
      ],
      payTitle: "Ödeme",
      payIntro: "Ödeme araç tesliminde alınır. Ön ödeme ve siteden kart çekimi yoktur. Findeks sorgusu bu ödemenin parçası değildir.",
      pay: ["Nakit", "Banka kartı", "Kredi kartı, zorunlu değildir; tercih ederseniz kullanılır"],
      whyTitle: "Findeks sorgusu neden istenir?",
      whyIntro: "Findeks, Türkiye'de kredi notunu gösteren kayıttır. Bazı kiralama ofisleri, özellikle kredi kartı olmayan kiralamada bu notu sorgular. Gerekçeleri şunlardır:",
      why: [
        "Kiralayanın ödeme geçmişine bakmak isterler.",
        "Kredi kartı yoksa notu ek güvence sayarlar.",
        "Onay, notun ofisin belirlediği sınıra göre verilir.",
      ],
      whyOut: "ZakCar bu sorguyu yapmaz. Sürücü teslimde ehliyetini gösterir ve sözleşmeyi imzalar. Ehliyet kontrolü Findeks sorgusu değildir.",
      diffTitle: "ZakCar'da süreç nasıl işler?",
      diffIntro: "ZakCar'da Findeks ve kredi kartı zorunlu değildir. Depozito nakit, banka kartı veya kredi kartıyla, kira bedelinden ayrı alınır.",
      steps: [
        "Rezervasyon siteden, WhatsApp'tan veya telefondan yapılır.",
        "Onay bilgisi e-posta ile gönderilir.",
        "Araç seçilen ofiste teslim edilir; ödeme bu anda alınır.",
        `Depozito süreye göredir: ${DEPOSIT.tr}.`,
        "Araç teslim edildiği gibi dönerse depozito iade edilir.",
      ],
      extraTitle: "Sürücü yaşı ve depozito",
      extra: [
        "Genelde 20 yaş ve en az 2 yıllık B sınıfı ehliyet gerekir. Bazı gruplarda yaş ve ehliyet yılı daha yüksektir; şart seçilen aracın sayfasında yazar.",
        "Bu sınırın altındaki sürücü için genç sürücü paketi gerekir. Paket günlük 335 TL'dir. Depozito yine süre tablosuna göredir ve teslimde nakit, banka kartı veya kredi kartıyla alınabilir.",
      ],
      faqTitle: "Sık sorulanlar",
      faq: [
        ["Findeks sorgusu yapılır mı?", "Hayır. ZakCar Findeks sorgusu yapmaz. Kredi notu kiralama şartı değildir."],
        ["Kredi kartı şart mı?", "Hayır. Ödeme teslimde nakit, banka kartı veya kredi kartıyla alınır. Rezervasyon siteden ücretsizdir, ön ödeme alınmaz."],
        ["Depozito ne kadar?", `${DEPOSIT.tr}'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir.`],
        ["Aracı nerede teslim alırım?", "Sabiha Gökçen geliş katında, İstanbul Havalimanı terminal çıkışında veya merkez ofiste. Havalimanı teslimi ücretsizdir. SAW ve IST ofisleri 7/24 açıktır."],
      ],
    },
  },
  en: {
    "kredi-kartsiz-arac-kiralama": {
      title: "Car rental without a credit card",
      sub: "No credit card and no pre-authorization. Pay at the car in cash, by debit card, or by credit card.",
      lead: "Want to rent a car without a credit card? ZakCar is one of the offices at Sabiha Gökçen, Istanbul Airport, and the central office that rents without a credit card and without a Findeks check.",
      after: "You make the reservation on the site for free. Nothing is charged in advance. You collect the car at the office you chose. Airport handover is free.",
      facts: [
        ["Payment", "No credit card", "Cash, debit card, or credit card"],
        ["Pickup", "SAW, IST, central", "Free at the airport"],
        ["Reservation", "On the site", "Free, nothing prepaid"],
        ["When you pay", "At pickup", "No online charge"],
        ["Driver", "Age 20 · 2-year licence", "The car can require more"],
        ["Deposit", "By length", "5,000 · 10,000 · 20,000 TL"],
      ],
      reserveTitle: "Booking without a credit card",
      reserve: [
        "You book from the steps on the site. Choose Sabiha Gökçen, Istanbul Airport, or the central office, the dates, and the car. A flight number is not required. If you tell us the landing time, airport handover is set around it.",
        "The deposit and payment terms appear in the reservation summary for the length you chose, and they are confirmed at pickup. You can send the same request by WhatsApp or phone.",
      ],
      payTitle: "Paying without a credit card",
      payIntro: "Payment is taken when the car is handed over. There is no prepayment and no card charge on the site.",
      pay: ["Cash", "Debit card", "Credit card, only if you prefer it"],
      whyTitle: "Why is a credit card usually required?",
      whyIntro: "Large rental companies at airport desks usually ask for a credit card and block the deposit on the card limit. Their reasons are:",
      why: [
        "The block: part of the card limit cannot be used until the rental ends.",
        "Damage: they want to charge a possible cost to the card.",
        "The cardholder is treated as verified by the bank.",
        "The company policy is the same in many countries.",
      ],
      whyOut: "That leaves out a guest who has no credit card, or who does not want the limit blocked.",
      diffTitle: "How payment works at ZakCar",
      diffIntro: "A credit card and a Findeks check are not required. The deposit is taken separately from the rental price, in cash, by debit card, or by credit card.",
      steps: [
        "The reservation is made on the site, by WhatsApp, or by phone.",
        "The confirmation is sent by email.",
        "The car is handed over at the chosen office, and payment is taken then.",
        `The deposit depends on the length: ${DEPOSIT.en}.`,
        "If the car comes back as it was delivered, the deposit is returned. The terms are shown in the summary before the rental and again at pickup.",
      ],
      extraTitle: "Driver age without a credit card",
      extra: [
        "The usual requirement is age 20 and a category B licence held for at least 2 years. Some groups ask for more. The car page states the requirement.",
        "A driver below that limit needs the young-driver package, 335 TL per day. The deposit still follows the length table and can be paid at pickup in cash, by debit card, or by credit card.",
      ],
      faqTitle: "Common questions",
      faq: [
        ["Can I rent without a credit card?", "Yes. ZakCar rents without a credit card and without a Findeks check. Payment is taken at pickup in cash, by debit card, or by credit card. The reservation on the site is free. WhatsApp or phone also works."],
        ["How much is the deposit?", `${DEPOSIT.en}. If the car is returned as delivered, the deposit is given back.`],
        ["Where do I collect the car?", "At Sabiha Gökçen arrivals, at the Istanbul Airport terminal exit, or at the central office. Airport handover is free. Telling us the landing time is enough for the meet."],
        ["Can a 20-year-old rent without a credit card?", "Age and licence time depend on the car. The usual rule is age 20 and a 2-year licence. Some groups ask for more, and the car page says so. Below that limit, the young-driver package is 335 TL per day."],
      ],
    },
    "uzun-donem-arac-kiralama": {
      title: "Long-term car rental",
      sub: "Monthly rentals and longer. The deposit depends on the length. You pay at pickup.",
      lead: "If you need a car for several weeks or months, a long-term rental lets you use the same fleet without buying a car. At ZakCar a long-term rental also needs no credit card and no Findeks check.",
      after: "The shortest rental is 24 hours. For a month or longer you can start the reservation on the site and call the desk to confirm the details. Nothing is charged in advance.",
      facts: [
        ["Length", "From 1 day to a month", "Call the desk for a month"],
        ["Mileage", "3,800 km a month", "300 km a day, 2,200 km in 10 days"],
        ["Deposit", "11 days or more", "20,000 TL"],
        ["Payment", "At pickup", "Cash, debit card, or credit card"],
        ["Document", "On a monthly rental", "A bill to confirm the address"],
        ["Pickup", "SAW, IST, central", "Free at the airport"],
      ],
      reserveTitle: "A long-term reservation",
      reserve: [
        "You choose the dates and the car on the site. The deposit band changes as the rental gets longer: 5,000 TL for 1–3 days, 10,000 TL for 4–10 days, and 20,000 TL from 11 days. The amount is shown in the reservation summary.",
        "For a monthly rental the desk confirms the length, the mileage, and the pickup office with you. A bill or a similar document is asked for, to confirm the address.",
      ],
      payTitle: "Paying for a long rental",
      payIntro: "The rental price and the deposit are taken in full when the car is handed over. The site does not charge a card, and nothing is prepaid. A credit card is not required.",
      pay: ["Cash", "Debit card", "Credit card, if you prefer it"],
      whyTitle: "When a long-term rental fits",
      whyIntro: "Choosing a long rental from the start is tidier than extending a daily rental when:",
      why: [
        "You will stay in the city for several weeks or months.",
        "Work needs a car all the time and you do not want to buy a fleet.",
        "You will collect at the airport and return to the same office.",
        "You do not want a card limit blocked. The deposit can also be paid in cash or by debit card.",
      ],
      diffTitle: "Length and mileage",
      diffIntro: "The mileage for the days you chose is written in the reservation summary. Kilometres over that limit are charged at pickup at the unit price told to you then.",
      steps: [
        "The daily allowance is 300 km.",
        "Up to 10 days, the allowance is 2,200 km.",
        "The monthly allowance is 3,800 km.",
        "For more use, speak with the desk.",
        "On an early return or an extension, the price is recalculated for the days used.",
      ],
      extraTitle: "Pickup and the driver",
      extra: [
        "The car is handed over at Sabiha Gökçen, Istanbul Airport, or the central office. The airport offices are open 24 hours, and handover is free.",
        "The usual requirement is age 20 and a licence held for at least 2 years. The car page states if the requirement is higher. At pickup the driver shows the licence and signs the contract.",
      ],
      faqTitle: "Common questions",
      faq: [
        ["How does a long-term rental start?", "Choose the dates and the car on the site. For a month or longer, the desk confirms the details. The reservation is free and nothing is prepaid."],
        ["How much is the deposit on a long rental?", "From 11 days the deposit is 20,000 TL. Shorter rentals are 5,000 TL for 1–3 days and 10,000 TL for 4–10 days. If the car comes back as delivered, the deposit is returned."],
        ["What is the monthly mileage?", "The monthly allowance is 3,800 km. A day is 300 km, and 10 days are 2,200 km. Kilometres over the allowance are charged at pickup at the unit price told in advance."],
        ["Is a credit card required?", "No. Payment is taken at pickup in cash, by debit card, or by credit card. There is no Findeks check."],
      ],
    },
    "kurumsal-arac-kiralama": {
      title: "Corporate car rental",
      sub: "Car rental for companies. Pickup at Sabiha Gökçen, Istanbul Airport, and the central office.",
      lead: "If the company needs one car or several, ZakCar corporate rental hands over the same fleet at Sabiha Gökçen, Istanbul Airport, and the central office.",
      after: "The quote is confirmed with the desk or on WhatsApp. The reservation is free and nothing is prepaid. Payment is taken when the car is handed over. A credit card and a Findeks check are not required.",
      facts: [
        ["Who it is for", "Companies", "One car or several"],
        ["Pickup", "SAW, IST, central", "Airports open 24 hours"],
        ["Payment", "At pickup", "Cash, debit card, or credit card"],
        ["Driver", "Signs at pickup", "Licence and identity card"],
        ["Deposit", "By length", "5,000 · 10,000 · 20,000 TL"],
        ["Monthly", "Address check", "A bill or a similar document"],
      ],
      reserveTitle: "How to send a company request",
      reserve: [
        "Write the number of cars, the pickup office, the dates, and the approximate length to the desk or on WhatsApp. You can also reserve a single car on the site first.",
        "The driver who collects the car brings a licence and an identity card and signs the rental contract. A person who is not named in the contract cannot drive the car.",
      ],
      payTitle: "Payment on a company rental",
      payIntro: "The rental price and the deposit are taken at pickup. The card limit is not blocked. A credit card is not required. Cash or a debit card is also accepted.",
      pay: ["Cash", "Debit card", "Credit card, if the driver prefers it"],
      whyTitle: "What it does for a company",
      whyIntro: "Renting, instead of buying a car or sending an existing car to the airport, simplifies this:",
      why: [
        "The car is ready when a guest or a staff member lands. The SAW and IST offices are open 24 hours.",
        "The deposit depends on the length and is separate from the rental price.",
        "Monthly use includes 3,800 km. A day is 300 km, and 10 days are 2,200 km.",
        "A driver with no card, or who does not want a limit blocked, can still collect the car.",
      ],
      diffTitle: "How handover works",
      diffIntro: "The office, the date, and the driver are set in the reservation. At the airport, staff wait for the landing time, and ZakCar pays the parking fee.",
      steps: [
        "The request comes from the site, by phone, or on WhatsApp.",
        "The confirmation is sent by email.",
        "The driver shows the licence at the chosen office and signs the contract.",
        `The deposit depends on the length: ${DEPOSIT.en}.`,
        "If the car comes back as delivered, the deposit is returned.",
      ],
      extraTitle: "Monthly company use",
      extra: [
        "For a month or longer, the desk confirms the length, the mileage, and the pickup office. A bill or a similar document is asked for, to confirm the address.",
        "On an early return or an extension, the price is recalculated for the days used. The detail is on the rental terms page.",
      ],
      faqTitle: "Common questions",
      faq: [
        ["How does a company rent a car?", "Send the number of cars, the office, and the dates to the desk or on WhatsApp. The driver signs the contract at pickup. The reservation is free and nothing is prepaid."],
        ["Does the credit card have to be a company card?", "No. A credit card is not required. Payment is taken at pickup in cash, by debit card, or by credit card. There is no Findeks check."],
        ["How much is the deposit?", `${DEPOSIT.en}. If the car is returned as delivered, the deposit is given back.`],
        ["Can several staff members drive the same car?", "Only drivers named in the contract may drive. An extra driver shows a licence at pickup and signs the contract."],
      ],
    },
    "findeks-sorgusuz-arac-kiralama": {
      title: "Car rental without a Findeks check",
      sub: "No Findeks check. Pay at the car in cash, by debit card, or by credit card.",
      lead: "Want to rent a car without a credit-score check? ZakCar rents at Sabiha Gökçen, Istanbul Airport, and the central office without a Findeks inquiry.",
      after: "You make the reservation on the site for free. Nothing is charged in advance. You collect the car at the office you chose. Airport handover is free. A credit card is not required either.",
      facts: [
        ["Check", "No Findeks", "No credit score is asked"],
        ["Payment", "At pickup", "Cash, debit card, or credit card"],
        ["Reservation", "On the site", "Free, nothing prepaid"],
        ["Pickup", "SAW, IST, central", "Free at the airport"],
        ["Driver", "Age 20 · 2-year licence", "The car can require more"],
        ["Deposit", "By length", "5,000 · 10,000 · 20,000 TL"],
      ],
      reserveTitle: "Booking without Findeks",
      reserve: [
        "You book from the steps on the site. Choose Sabiha Gökçen, Istanbul Airport, or the central office, the dates, and the car. A Findeks score and a credit card are not required.",
        "The deposit and payment terms appear in the reservation summary for the length you chose, and they are confirmed at pickup. You can send the same request by WhatsApp or phone.",
      ],
      payTitle: "Payment",
      payIntro: "Payment is taken when the car is handed over. There is no prepayment and no card charge on the site. A Findeks check is not part of that payment.",
      pay: ["Cash", "Debit card", "Credit card, only if you prefer it"],
      whyTitle: "Why do offices ask for Findeks?",
      whyIntro: "Findeks is the record that shows a credit score in Turkey. Some rental offices query it, especially when there is no credit card. Their reasons are:",
      why: [
        "They want to look at the renter's payment history.",
        "Without a credit card they treat the score as extra cover.",
        "Approval depends on a limit the office sets.",
      ],
      whyOut: "ZakCar does not run this check. The driver shows a licence at pickup and signs the contract. Checking the licence is not a Findeks inquiry.",
      diffTitle: "How it works at ZakCar",
      diffIntro: "Findeks and a credit card are not required. The deposit is taken in cash, by debit card, or by credit card, separate from the rental price.",
      steps: [
        "The reservation is made on the site, on WhatsApp, or by phone.",
        "The confirmation is sent by email.",
        "The car is handed over at the chosen office, and payment is taken then.",
        `The deposit depends on the length: ${DEPOSIT.en}.`,
        "If the car comes back as it was handed over, the deposit is returned.",
      ],
      extraTitle: "Driver age and deposit",
      extra: [
        "The usual requirement is age 20 and a category B licence held for at least 2 years. Some groups ask for more; the car page states the requirement.",
        "A driver below that limit needs the young-driver package. It is 335 TL a day. The deposit still follows the length table and can be paid at pickup in cash, by debit card, or by credit card.",
      ],
      faqTitle: "Common questions",
      faq: [
        ["Do you run a Findeks check?", "No. ZakCar does not query Findeks. A credit score is not a rental requirement."],
        ["Is a credit card required?", "No. Payment is taken at pickup in cash, by debit card, or by credit card. The reservation on the site is free and nothing is prepaid."],
        ["How much is the deposit?", `${DEPOSIT.en}. If the car is returned as delivered, the deposit is given back.`],
        ["Where do I collect the car?", "At Sabiha Gökçen arrivals, at the Istanbul Airport terminal exit, or at the central office. Airport handover is free. The SAW and IST offices are open 24 hours."],
      ],
    },
  },
  de: {
    "kredi-kartsiz-arac-kiralama": {
      title: "Autovermietung ohne Kreditkarte",
      sub: "Keine Kreditkarte und keine Vorautorisierung. Zahlung am Fahrzeug bar, mit Debitkarte oder mit Kreditkarte.",
      lead: "Sie möchten ohne Kreditkarte mieten? ZakCar vermietet am Flughafen Sabiha Gökçen, am Flughafen Istanbul und im Zentralbüro ohne Kreditkarte und ohne Findeks-Abfrage.",
      after: "Die Reservierung auf der Website ist kostenlos. Es gibt keine Vorauszahlung. Sie holen das Fahrzeug im gewählten Büro ab. Die Übergabe am Flughafen ist kostenlos.",
      facts: [
        ["Zahlung", "Ohne Kreditkarte", "Bar, Debitkarte oder Kreditkarte"],
        ["Übergabe", "SAW, IST, Zentrale", "Am Flughafen kostenlos"],
        ["Reservierung", "Auf der Website", "Kostenlos, ohne Vorauszahlung"],
        ["Zahlungszeit", "Bei der Übergabe", "Keine Online-Abbuchung"],
        ["Fahrer", "20 Jahre · 2 Jahre Führerschein", "Je nach Fahrzeug höher"],
        ["Kaution", "Nach Dauer", "5.000 · 10.000 · 20.000 TL"],
      ],
      reserveTitle: "Reservierung ohne Kreditkarte",
      reserve: [
        "Die Miete ohne Kreditkarte läuft über die Schritte auf der Website. Wählen Sie Sabiha Gökçen, den Flughafen Istanbul oder das Zentralbüro, die Daten und das Fahrzeug. Eine Flugnummer ist nicht nötig. Nennen Sie die Landezeit, dann richtet sich die Flughafenübergabe danach.",
        "Kaution und Zahlungsbedingungen stehen in der Zusammenfassung zur gewählten Dauer und werden bei der Übergabe bestätigt. Dieselbe Anfrage geht auch per WhatsApp oder Telefon.",
      ],
      payTitle: "Zahlung ohne Kreditkarte",
      payIntro: "Die Zahlung erfolgt bei der Fahrzeugübergabe. Es gibt keine Vorauszahlung und keine Kartenabbuchung auf der Website.",
      pay: ["Bar", "Debitkarte", "Kreditkarte, nur wenn Sie das möchten"],
      whyTitle: "Warum wird meist eine Kreditkarte verlangt?",
      whyIntro: "Große Vermieter an Flughafenschaltern verlangen meist eine Kreditkarte und blockieren die Kaution auf dem Kartenlimit. Die Gründe:",
      why: [
        "Die Sperre: ein Teil des Limits ist bis zum Mietende nicht nutzbar.",
        "Schaden: ein möglicher Betrag soll von der Karte abgebucht werden.",
        "Der Karteninhaber gilt als von der Bank geprüft.",
        "Die Firmenregel ist in vielen Ländern gleich.",
      ],
      whyOut: "Damit bleibt ausgeschlossen, wer keine Kreditkarte hat oder das Limit nicht sperren lassen will.",
      diffTitle: "So läuft die Zahlung bei ZakCar",
      diffIntro: "Kreditkarte und Findeks sind nicht nötig. Die Kaution wird getrennt vom Mietpreis bar, per Debitkarte oder per Kreditkarte genommen.",
      steps: [
        "Die Reservierung erfolgt auf der Website, per WhatsApp oder telefonisch.",
        "Die Bestätigung geht per E-Mail.",
        "Das Fahrzeug wird im gewählten Büro übergeben, die Zahlung erfolgt dort.",
        `Die Kaution richtet sich nach der Dauer: ${DEPOSIT.de}.`,
        "Kommt das Fahrzeug so zurück, wie es übergeben wurde, wird die Kaution erstattet. Die Bedingungen stehen vor der Miete in der Zusammenfassung und noch einmal bei der Übergabe.",
      ],
      extraTitle: "Fahreralter ohne Kreditkarte",
      extra: [
        "Üblich sind 20 Jahre und ein Führerschein der Klasse B seit mindestens 2 Jahren. Manche Gruppen verlangen mehr. Die Fahrzeugseite nennt die Bedingung.",
        "Darunter braucht es das Jungfahrer-Paket, 335 TL pro Tag. Die Kaution folgt weiter der Dauertabelle und kann bei der Übergabe bar, per Debitkarte oder per Kreditkarte gezahlt werden.",
      ],
      faqTitle: "Häufige Fragen",
      faq: [
        ["Kann ich ohne Kreditkarte mieten?", "Ja. ZakCar vermietet ohne Kreditkarte und ohne Findeks. Die Zahlung erfolgt bei der Übergabe bar, per Debitkarte oder per Kreditkarte. Die Reservierung auf der Website ist kostenlos. WhatsApp oder Telefon geht auch."],
        ["Wie hoch ist die Kaution?", `${DEPOSIT.de}. Kommt das Fahrzeug wie übergeben zurück, wird die Kaution erstattet.`],
        ["Wo hole ich das Fahrzeug ab?", "In der Ankunft von Sabiha Gökçen, am Terminalausgang des Flughafens Istanbul oder im Zentralbüro. Die Flughafenübergabe ist kostenlos. Die Landezeit genügt für die Abholung."],
        ["Geht das mit 20 Jahren ohne Kreditkarte?", "Alter und Führerschein hängen vom Fahrzeug ab. Üblich sind 20 Jahre und 2 Jahre Führerschein. Manche Gruppen verlangen mehr, die Fahrzeugseite sagt es. Darunter kostet das Jungfahrer-Paket 335 TL pro Tag."],
      ],
    },
    "uzun-donem-arac-kiralama": {
      title: "Langzeitmiete",
      sub: "Monatsmieten und länger. Die Kaution richtet sich nach der Dauer, die Zahlung erfolgt bei der Übergabe.",
      lead: "Wenn Sie ein Fahrzeug für mehrere Wochen oder Monate brauchen, nutzen Sie mit der Langzeitmiete dieselbe Flotte, ohne ein Auto zu kaufen. Auch die Langzeitmiete bei ZakCar braucht keine Kreditkarte und keine Findeks-Abfrage.",
      after: "Die kürzeste Miete dauert 24 Stunden. Für einen Monat oder länger starten Sie die Reservierung auf der Website und klären die Einzelheiten mit der Zentrale. Es gibt keine Vorauszahlung.",
      facts: [
        ["Dauer", "Von 1 Tag bis zum Monat", "Für einen Monat die Zentrale"],
        ["Kilometer", "3.800 km im Monat", "300 km am Tag, 2.200 km in 10 Tagen"],
        ["Kaution", "Ab 11 Tagen", "20.000 TL"],
        ["Zahlung", "Bei der Übergabe", "Bar, Debitkarte oder Kreditkarte"],
        ["Nachweis", "Bei Monatsmiete", "Rechnung zur Adresse"],
        ["Übergabe", "SAW, IST, Zentrale", "Am Flughafen kostenlos"],
      ],
      reserveTitle: "Reservierung für längere Zeit",
      reserve: [
        "Sie wählen Daten und Fahrzeug auf der Website. Die Kautionsstufe ändert sich mit der Dauer: 5.000 TL für 1–3 Tage, 10.000 TL für 4–10 Tage, 20.000 TL ab 11 Tagen. Der Betrag steht in der Zusammenfassung.",
        "Bei einer Monatsmiete klärt die Zentrale Dauer, Kilometer und Übergabebüro mit Ihnen. Für die Adresse wird eine Rechnung oder ein ähnliches Dokument verlangt.",
      ],
      payTitle: "Zahlung bei längerer Miete",
      payIntro: "Mietpreis und Kaution werden bei der Übergabe vollständig genommen. Die Website bucht keine Karte ab, eine Vorauszahlung gibt es nicht. Eine Kreditkarte ist nicht nötig.",
      pay: ["Bar", "Debitkarte", "Kreditkarte, wenn Sie das möchten"],
      whyTitle: "Wann eine Langzeitmiete passt",
      whyIntro: "Eine lange Miete von Anfang an ist übersichtlicher als das Verlängern einer Tagesmiete, wenn:",
      why: [
        "Sie mehrere Wochen oder Monate in der Stadt bleiben.",
        "Die Arbeit dauerhaft ein Fahrzeug braucht und Sie keine Flotte kaufen wollen.",
        "Sie am Flughafen abholen und im selben Büro zurückgeben.",
        "Sie kein Kartenlimit sperren lassen wollen. Die Kaution geht auch bar oder per Debitkarte.",
      ],
      diffTitle: "Dauer und Kilometer",
      diffIntro: "Das Kilometerkontingent der gewählten Tage steht in der Zusammenfassung. Darüber hinaus wird bei der Rückgabe zum genannten Satz abgerechnet.",
      steps: [
        "Täglich sind 300 km enthalten.",
        "Bis 10 Tage sind 2.200 km enthalten.",
        "Im Monat sind 3.800 km enthalten.",
        "Für mehr Nutzung spricht man mit der Zentrale.",
        "Bei früher Rückgabe oder Verlängerung wird der Preis nach den genutzten Tagen neu gerechnet.",
      ],
      extraTitle: "Übergabe und Fahrer",
      extra: [
        "Das Fahrzeug wird am Flughafen Sabiha Gökçen, am Flughafen Istanbul oder im Zentralbüro übergeben. Die Flughafenbüros sind rund um die Uhr offen, die Übergabe ist kostenlos.",
        "Üblich sind 20 Jahre und ein Führerschein seit mindestens 2 Jahren. Die Fahrzeugseite nennt eine höhere Bedingung. Bei der Übergabe zeigt der Fahrer den Führerschein und unterschreibt den Vertrag.",
      ],
      faqTitle: "Häufige Fragen",
      faq: [
        ["Wie beginnt eine Langzeitmiete?", "Wählen Sie Daten und Fahrzeug auf der Website. Ab einem Monat klärt die Zentrale die Einzelheiten. Die Reservierung ist kostenlos, eine Vorauszahlung gibt es nicht."],
        ["Wie hoch ist die Kaution bei langer Miete?", "Ab 11 Tagen beträgt die Kaution 20.000 TL. Kürzer sind es 5.000 TL für 1–3 Tage und 10.000 TL für 4–10 Tage. Kommt das Fahrzeug wie übergeben zurück, wird die Kaution erstattet."],
        ["Wie viele Kilometer gibt es im Monat?", "Im Monat sind 3.800 km enthalten. Ein Tag sind 300 km, 10 Tage sind 2.200 km. Mehrkilometer werden bei der Rückgabe zum vorher genannten Satz berechnet."],
        ["Ist eine Kreditkarte nötig?", "Nein. Die Zahlung erfolgt bei der Übergabe bar, per Debitkarte oder per Kreditkarte. Eine Findeks-Abfrage gibt es nicht."],
      ],
    },
    "kurumsal-arac-kiralama": {
      title: "Firmenmiete",
      sub: "Autovermietung für Unternehmen. Übergabe am Flughafen Sabiha Gökçen, am Flughafen Istanbul und im Zentralbüro.",
      lead: "Braucht das Unternehmen ein Fahrzeug oder mehrere, übergibt ZakCar dieselbe Flotte am Flughafen Sabiha Gökçen, am Flughafen Istanbul und im Zentralbüro.",
      after: "Das Angebot wird mit der Zentrale oder per WhatsApp geklärt. Die Reservierung ist kostenlos, eine Vorauszahlung gibt es nicht. Gezahlt wird bei der Übergabe. Kreditkarte und Findeks sind nicht nötig.",
      facts: [
        ["Für wen", "Unternehmen", "Ein Fahrzeug oder mehrere"],
        ["Übergabe", "SAW, IST, Zentrale", "Flughäfen rund um die Uhr"],
        ["Zahlung", "Bei der Übergabe", "Bar, Debitkarte oder Kreditkarte"],
        ["Fahrer", "Unterschrift bei Übergabe", "Führerschein und Ausweis"],
        ["Kaution", "Nach Dauer", "5.000 · 10.000 · 20.000 TL"],
        ["Monatlich", "Adressnachweis", "Rechnung oder ähnliches Dokument"],
      ],
      reserveTitle: "So geht eine Firmenanfrage",
      reserve: [
        "Schreiben Sie Fahrzeugzahl, Übergabebüro, Daten und ungefähre Dauer an die Zentrale oder per WhatsApp. Ein einzelnes Fahrzeug können Sie auch zuerst auf der Website reservieren.",
        "Der Fahrer, der das Fahrzeug abholt, bringt Führerschein und Ausweis mit und unterschreibt den Mietvertrag selbst. Wer nicht im Vertrag steht, darf nicht fahren.",
      ],
      payTitle: "Zahlung bei der Firmenmiete",
      payIntro: "Mietpreis und Kaution werden bei der Übergabe genommen. Das Kartenlimit wird nicht gesperrt. Eine Kreditkarte ist nicht nötig. Bar oder Debitkarte gilt ebenfalls.",
      pay: ["Bar", "Debitkarte", "Kreditkarte, wenn der Fahrer das möchte"],
      whyTitle: "Was das für ein Unternehmen bringt",
      whyIntro: "Mieten statt kaufen oder ein vorhandenes Fahrzeug zum Flughafen zu schicken vereinfacht dies:",
      why: [
        "Das Fahrzeug steht bereit, wenn Gast oder Personal landet. Die Büros SAW und IST sind rund um die Uhr offen.",
        "Die Kaution richtet sich nach der Dauer und ist vom Mietpreis getrennt.",
        "Im Monat sind 3.800 km enthalten. Ein Tag sind 300 km, 10 Tage sind 2.200 km.",
        "Auch ein Fahrer ohne Karte oder ohne Limit-Sperre kann das Fahrzeug abholen.",
      ],
      diffTitle: "So läuft die Übergabe",
      diffIntro: "Büro, Datum und Fahrer stehen in der Reservierung. Am Flughafen wartet das Personal auf die Landezeit, die Parkgebühr zahlt ZakCar.",
      steps: [
        "Die Anfrage kommt über die Website, das Telefon oder WhatsApp.",
        "Die Bestätigung geht per E-Mail.",
        "Der Fahrer zeigt im gewählten Büro den Führerschein und unterschreibt den Vertrag.",
        `Die Kaution richtet sich nach der Dauer: ${DEPOSIT.de}.`,
        "Kommt das Fahrzeug so zurück, wie es übergeben wurde, wird die Kaution erstattet.",
      ],
      extraTitle: "Monatliche Firmennutzung",
      extra: [
        "Ab einem Monat klärt die Zentrale Dauer, Kilometer und Übergabebüro. Für die Adresse wird eine Rechnung oder ein ähnliches Dokument verlangt.",
        "Bei früher Rückgabe oder Verlängerung wird der Preis nach den genutzten Tagen neu gerechnet. Die Einzelheiten stehen auf der Seite Mietbedingungen.",
      ],
      faqTitle: "Häufige Fragen",
      faq: [
        ["Wie mietet ein Unternehmen?", "Schicken Sie Fahrzeugzahl, Büro und Daten an die Zentrale oder per WhatsApp. Der Fahrer unterschreibt bei der Übergabe. Die Reservierung ist kostenlos, eine Vorauszahlung gibt es nicht."],
        ["Muss die Kreditkarte eine Firmenkarte sein?", "Nein. Eine Kreditkarte ist nicht nötig. Gezahlt wird bei der Übergabe bar, per Debitkarte oder per Kreditkarte. Eine Findeks-Abfrage gibt es nicht."],
        ["Wie hoch ist die Kaution?", `${DEPOSIT.de}. Kommt das Fahrzeug wie übergeben zurück, wird die Kaution erstattet.`],
        ["Dürfen mehrere Personen dasselbe Fahrzeug fahren?", "Nur Fahrer, die im Vertrag stehen. Ein zusätzlicher Fahrer zeigt bei der Übergabe den Führerschein und unterschreibt."],
      ],
    },
    "findeks-sorgusuz-arac-kiralama": {
      title: "Autovermietung ohne Findeks-Abfrage",
      sub: "Keine Findeks-Abfrage. Zahlung am Fahrzeug bar, mit Debitkarte oder mit Kreditkarte.",
      lead: "Sie möchten ohne Bonitätsabfrage mieten? ZakCar vermietet am Flughafen Sabiha Gökçen, am Flughafen Istanbul und im Zentralbüro ohne Findeks-Abfrage.",
      after: "Die Reservierung auf der Website ist kostenlos. Eine Vorauszahlung gibt es nicht. Das Fahrzeug holen Sie im gewählten Büro ab. Die Übergabe am Flughafen ist kostenlos. Eine Kreditkarte ist ebenfalls nicht nötig.",
      facts: [
        ["Abfrage", "Kein Findeks", "Keine Bonitätsnote"],
        ["Zahlung", "Bei Übergabe", "Bar, Debitkarte oder Kreditkarte"],
        ["Reservierung", "Auf der Website", "Kostenlos, ohne Vorauszahlung"],
        ["Übergabe", "SAW, IST, Zentrale", "Am Flughafen kostenlos"],
        ["Fahrer", "20 Jahre · 2 Jahre Führerschein", "Je nach Fahrzeug mehr"],
        ["Kaution", "Nach Dauer", "5.000 · 10.000 · 20.000 TL"],
      ],
      reserveTitle: "Reservierung ohne Findeks",
      reserve: [
        "Sie buchen in den Schritten auf der Website. Wählen Sie Sabiha Gökçen, den Flughafen Istanbul oder das Zentralbüro, die Daten und das Fahrzeug. Eine Findeks-Note und eine Kreditkarte werden nicht verlangt.",
        "Kaution und Zahlungsbedingungen stehen in der Zusammenfassung zur gewählten Dauer und werden bei der Übergabe bestätigt. Dieselbe Anfrage geht auch per WhatsApp oder Telefon.",
      ],
      payTitle: "Zahlung",
      payIntro: "Gezahlt wird bei der Übergabe. Es gibt keine Vorauszahlung und keine Kartenbelastung auf der Website. Eine Findeks-Abfrage gehört nicht zu dieser Zahlung.",
      pay: ["Bar", "Debitkarte", "Kreditkarte, nur wenn Sie sie möchten"],
      whyTitle: "Warum wird Findeks abgefragt?",
      whyIntro: "Findeks ist in der Türkei der Nachweis der Bonitätsnote. Manche Vermieter fragen sie ab, vor allem ohne Kreditkarte. Ihre Gründe:",
      why: [
        "Sie wollen die Zahlungshistorie des Mieters sehen.",
        "Ohne Kreditkarte gilt ihnen die Note als zusätzliche Sicherheit.",
        "Die Zusage hängt von einer Grenze ab, die das Büro setzt.",
      ],
      whyOut: "ZakCar führt diese Abfrage nicht durch. Der Fahrer zeigt bei der Übergabe den Führerschein und unterschreibt den Vertrag. Die Kontrolle des Führerscheins ist keine Findeks-Abfrage.",
      diffTitle: "So läuft es bei ZakCar",
      diffIntro: "Findeks und eine Kreditkarte sind nicht nötig. Die Kaution wird bar, per Debitkarte oder per Kreditkarte genommen, getrennt vom Mietpreis.",
      steps: [
        "Die Reservierung läuft über die Website, WhatsApp oder das Telefon.",
        "Die Bestätigung geht per E-Mail.",
        "Das Fahrzeug wird im gewählten Büro übergeben, die Zahlung erfolgt dann.",
        `Die Kaution richtet sich nach der Dauer: ${DEPOSIT.de}.`,
        "Kommt das Fahrzeug so zurück, wie es übergeben wurde, wird die Kaution erstattet.",
      ],
      extraTitle: "Fahreralter und Kaution",
      extra: [
        "Üblich sind 20 Jahre und ein Führerschein der Klasse B seit mindestens 2 Jahren. Manche Gruppen verlangen mehr; die Fahrzeugseite nennt die Bedingung.",
        "Darunter braucht der Fahrer das Jungfahrer-Paket. Es kostet 335 TL pro Tag. Die Kaution folgt weiter der Dauertabelle und kann bei der Übergabe bar, per Debitkarte oder per Kreditkarte gezahlt werden.",
      ],
      faqTitle: "Häufige Fragen",
      faq: [
        ["Gibt es eine Findeks-Abfrage?", "Nein. ZakCar fragt Findeks nicht ab. Eine Bonitätsnote ist keine Mietbedingung."],
        ["Ist eine Kreditkarte nötig?", "Nein. Gezahlt wird bei der Übergabe bar, per Debitkarte oder per Kreditkarte. Die Reservierung auf der Website ist kostenlos, eine Vorauszahlung gibt es nicht."],
        ["Wie hoch ist die Kaution?", `${DEPOSIT.de}. Kommt das Fahrzeug wie übergeben zurück, wird die Kaution erstattet.`],
        ["Wo hole ich das Fahrzeug ab?", "Ankunft Sabiha Gökçen, Ausgang Terminal Flughafen Istanbul oder Zentralbüro. Die Übergabe am Flughafen ist kostenlos. Die Büros SAW und IST sind rund um die Uhr offen."],
      ],
    },
  },
  ar: {
    "kredi-kartsiz-arac-kiralama": {
      title: "تأجير سيارات بدون بطاقة ائتمان",
      sub: "لا بطاقة ائتمان ولا حجز مبلغ. الدفع عند السيارة نقداً أو ببطاقة خصم أو ببطاقة ائتمان.",
      lead: "هل تريد استئجار سيارة من دون بطاقة ائتمان؟ ZakCar من المكاتب التي تؤجر في مطار صبيحة كوكجن ومطار إسطنبول والمكتب المركزي من دون بطاقة ائتمان ومن دون استعلام Findeks.",
      after: "تنشئ الحجز من الموقع مجاناً، ولا يُطلب دفع مقدّم. تستلم السيارة في المكتب الذي اخترته. التسليم في المطار مجاني.",
      facts: [
        ["الدفع", "بدون بطاقة ائتمان", "نقداً أو بطاقة خصم أو ائتمان"],
        ["التسليم", "SAW وIST والمركز", "مجاني في المطار"],
        ["الحجز", "من الموقع", "مجاني ومن دون مقدّم"],
        ["وقت الدفع", "عند استلام السيارة", "لا سحب عبر الموقع"],
        ["السائق", "20 سنة · رخصة لسنتين", "الشرط يختلف حسب السيارة"],
        ["التأمين", "حسب المدة", "5.000 · 10.000 · 20.000 ليرة"],
      ],
      reserveTitle: "حجز من دون بطاقة ائتمان",
      reserve: [
        "يتم الحجز من خطوات الموقع. يكفي اختيار صبيحة كوكجن أو مطار إسطنبول أو المكتب المركزي مع التواريخ والسيارة. رقم الرحلة غير إلزامي. إذا أبلغت بوقت الهبوط يُرتَّب التسليم في المطار على أساسه.",
        "تظهر شروط التأمين والدفع في ملخص الحجز حسب المدة، وتُؤكَّد عند التسليم. يمكن إرسال الطلب نفسه عبر واتساب أو الهاتف.",
      ],
      payTitle: "الدفع من دون بطاقة ائتمان",
      payIntro: "يُحصَّل الدفع عند تسليم السيارة. لا يوجد دفع مقدّم ولا سحب من البطاقة عبر الموقع.",
      pay: ["نقداً", "بطاقة خصم", "بطاقة ائتمان إن رغبت، وهي غير إلزامية"],
      whyTitle: "لماذا تُطلب بطاقة الائتمان عادة؟",
      whyIntro: "شركات التأجير الكبيرة في مكاتب المطار تطلب غالباً بطاقة ائتمان وتحجز التأمين على حد البطاقة. أسبابها:",
      why: [
        "حجز المبلغ: جزء من حد البطاقة يبقى غير متاح حتى انتهاء التأجير.",
        "تحصيل الضرر: يراد سحب المبلغ المحتمل من البطاقة.",
        "صاحب البطاقة يُعد موثَّقاً من البنك.",
        "سياسة الشركة متشابهة في كثير من الدول.",
      ],
      whyOut: "هذا يستبعد من لا يملك بطاقة ائتمان أو لا يريد حجز حد بطاقته.",
      diffTitle: "كيف يتم الدفع لدى ZakCar؟",
      diffIntro: "بطاقة الائتمان واستعلام Findeks غير إلزاميين. يُؤخذ التأمين منفصلاً عن أجرة السيارة نقداً أو ببطاقة خصم أو ائتمان.",
      steps: [
        "يتم الحجز من الموقع أو واتساب أو الهاتف.",
        "تُرسل بيانات التأكيد بالبريد.",
        "تُسلَّم السيارة في المكتب المختار ويُحصَّل الدفع عندها.",
        `التأمين حسب المدة: ${DEPOSIT.ar}.`,
        "إذا عادت السيارة كما سُلِّمت يُرد التأمين. الشروط تظهر في الملخص قبل التأجير وعند التسليم.",
      ],
      extraTitle: "عمر السائق والتأجير بلا بطاقة",
      extra: [
        "المعتاد 20 سنة ورخصة فئة B منذ سنتين على الأقل. بعض الفئات تشترط أكثر، والشرط مكتوب في صفحة السيارة.",
        "من هو دون هذا الحد يحتاج باقة السائق الشاب، 335 ليرة في اليوم. التأمين يبقى حسب جدول المدة ويُدفع عند التسليم نقداً أو ببطاقة خصم أو ائتمان.",
      ],
      faqTitle: "أسئلة شائعة",
      faq: [
        ["هل يمكن التأجير بلا بطاقة ائتمان؟", "نعم. ZakCar يؤجر بلا بطاقة ائتمان وبلا استعلام Findeks. الدفع عند التسليم نقداً أو ببطاقة خصم أو ائتمان. الحجز من الموقع مجاني، ويمكن واتساب أو الهاتف."],
        ["كم مبلغ التأمين؟", `${DEPOSIT.ar}. إذا أُعيدت السيارة كما سُلِّمت يُرد التأمين.`],
        ["أين أستلم السيارة؟", "في صالة الوصول بمطار صبيحة كوكجن أو عند مخرج مطار إسطنبول أو في المكتب المركزي. التسليم في المطار مجاني. إبلاغنا بوقت الهبوط يكفي للاستقبال."],
        ["هل يتم التأجير بعمر 20 ومن دون بطاقة؟", "العمر ومدة الرخصة يختلفان حسب السيارة. المعتاد 20 سنة ورخصة لسنتين. بعض الفئات تشترط أكثر وذلك مكتوب في صفحة السيارة. دون الحد، باقة السائق الشاب 335 ليرة في اليوم."],
      ],
    },
    "uzun-donem-arac-kiralama": {
      title: "تأجير سيارات طويل الأمد",
      sub: "إيجار شهري وما أطول. التأمين حسب المدة، والدفع عند التسليم.",
      lead: "إذا احتجت السيارة لأسابيع أو أشهر، يتيح التأجير الطويل استخدام الأسطول نفسه من دون شراء سيارة. لدى ZakCar يتم التأجير الطويل أيضاً بلا بطاقة ائتمان وبلا استعلام Findeks.",
      after: "أقصر مدة 24 ساعة. للشهر وما أطول يمكن بدء الحجز من الموقع ثم الاتصال بالمركز لتثبيت التفاصيل. لا يُطلب دفع مقدّم.",
      facts: [
        ["المدة", "من يوم إلى شهر", "للشهر يُتصل بالمركز"],
        ["المسافة", "3.800 كم شهرياً", "300 كم يومياً و2.200 كم في 10 أيام"],
        ["التأمين", "11 يوماً فأكثر", "20.000 ليرة"],
        ["الدفع", "عند التسليم", "نقداً أو بطاقة خصم أو ائتمان"],
        ["المستند", "في الإيجار الشهري", "فاتورة لتأكيد العنوان"],
        ["التسليم", "SAW وIST والمركز", "مجاني في المطار"],
      ],
      reserveTitle: "حجز طويل الأمد",
      reserve: [
        "تختار التواريخ والسيارة من الموقع. شريحة التأمين تتغير مع المدة: 5.000 ليرة ليوم إلى 3 أيام، و10.000 ليرة من 4 إلى 10 أيام، و20.000 ليرة من 11 يوماً. المبلغ يظهر في ملخص الحجز.",
        "للإيجار الشهري يثبت المركز معك المدة والمسافة ومكتب التسليم. يُطلب فاتورة أو مستند مشابه لتأكيد العنوان.",
      ],
      payTitle: "الدفع في المدة الطويلة",
      payIntro: "أجرة السيارة والتأمين يُحصَّلان كاملاً عند التسليم. لا سحب من البطاقة عبر الموقع ولا دفع مقدّم. بطاقة الائتمان غير إلزامية.",
      pay: ["نقداً", "بطاقة خصم", "بطاقة ائتمان إن رغبت"],
      whyTitle: "متى يناسب التأجير الطويل؟",
      whyIntro: "اختيار مدة طويلة من البداية أوضح من تمديد إيجار يومي في هذه الحالات:",
      why: [
        "إذا ستبقى في المدينة أسابيع أو أشهراً.",
        "إذا كان العمل يحتاج سيارة باستمرار ولا تريد شراء أسطول.",
        "إذا ستستلم من المطار وتعيد إلى المكتب نفسه.",
        "إذا لا تريد حجز حد البطاقة. التأمين يُقبل نقداً أو ببطاقة خصم أيضاً.",
      ],
      diffTitle: "المدة والمسافة",
      diffIntro: "مسافة الأيام المختارة تُكتب في ملخص الحجز. ما زاد عنها يُحسب عند التسليم بالسعر الذي يُبلَّغ به.",
      steps: [
        "المسافة اليومية 300 كم.",
        "حتى 10 أيام 2.200 كم.",
        "المسافة الشهرية 3.800 كم.",
        "للاستخدام الأكثر يُتكلم مع المركز.",
        "عند الإعادة المبكرة أو التمديد تُعاد الأجرة حسب الأيام المستخدمة.",
      ],
      extraTitle: "التسليم والسائق",
      extra: [
        "تُسلَّم السيارة في صبيحة كوكجن أو مطار إسطنبول أو المكتب المركزي. مكاتب المطار مفتوحة طوال اليوم والتسليم مجاني.",
        "المعتاد 20 سنة ورخصة منذ سنتين على الأقل. الشرط مكتوب في صفحة السيارة إن كان أعلى. عند التسليم يُبرز السائق الرخصة ويوقّع العقد.",
      ],
      faqTitle: "أسئلة شائعة",
      faq: [
        ["كيف يبدأ التأجير الطويل؟", "يمكن اختيار التاريخ والسيارة من الموقع. للشهر وما أطول يثبت المركز التفاصيل. الحجز مجاني ولا يوجد دفع مقدّم."],
        ["كم التأمين في المدة الطويلة؟", "من 11 يوماً التأمين 20.000 ليرة. للمدد الأقصر: 5.000 ليرة ليوم إلى 3 أيام و10.000 ليرة من 4 إلى 10 أيام. إذا عادت السيارة كما سُلِّمت يُرد التأمين."],
        ["ما حد المسافة الشهري؟", "المسافة الشهرية 3.800 كم. اليوم 300 كم وعشرة أيام 2.200 كم. الزيادة تُحسب عند التسليم بالسعر المبلَّغ مسبقاً."],
        ["هل بطاقة الائتمان شرط؟", "لا. الدفع عند التسليم نقداً أو ببطاقة خصم أو ائتمان. لا يُجرى استعلام Findeks."],
      ],
    },
    "kurumsal-arac-kiralama": {
      title: "تأجير سيارات للشركات",
      sub: "تأجير للشركات. التسليم في صبيحة كوكجن ومطار إسطنبول والمكتب المركزي.",
      lead: "إذا احتاجت الشركة سيارة واحدة أو أكثر، يسلّم تأجير ZakCar للشركات الأسطول نفسه من صبيحة كوكجن ومطار إسطنبول والمكتب المركزي.",
      after: "يُثبَّت العرض مع المركز أو عبر واتساب. الحجز مجاني ولا يوجد دفع مقدّم. الدفع عند تسليم السيارة. بطاقة الائتمان واستعلام Findeks غير إلزاميين.",
      facts: [
        ["لمن", "الشركات", "سيارة واحدة أو أكثر"],
        ["التسليم", "SAW وIST والمركز", "المطار طوال اليوم"],
        ["الدفع", "عند التسليم", "نقداً أو بطاقة خصم أو ائتمان"],
        ["السائق", "توقيع عند التسليم", "الرخصة والهوية"],
        ["التأمين", "حسب المدة", "5.000 · 10.000 · 20.000 ليرة"],
        ["شهري", "تأكيد العنوان", "فاتورة أو مستند مشابه"],
      ],
      reserveTitle: "كيف يُرسل طلب الشركة؟",
      reserve: [
        "يكفي كتابة عدد السيارات ومكتب التسليم والتواريخ والمدة التقريبية للمركز أو عبر واتساب. ويمكن حجز سيارة واحدة من الموقع أولاً.",
        "السائق الذي يستلم السيارة يحضر الرخصة والهوية ويوقّع عقد التأجير بنفسه. من ليس اسمه في العقد لا يقود السيارة.",
      ],
      payTitle: "الدفع في تأجير الشركات",
      payIntro: "الأجرة والتأمين يُحصَّلان عند التسليم. لا يُحجز حد البطاقة. بطاقة الائتمان غير إلزامية، والنقد وبطاقة الخصم مقبولان.",
      pay: ["نقداً", "بطاقة خصم", "بطاقة ائتمان إذا اختارها السائق"],
      whyTitle: "ماذا يفيد الشركات؟",
      whyIntro: "التأجير بدل شراء سيارة أو إيصال سيارة موجودة إلى المطار يبسّط هذا:",
      why: [
        "تكون السيارة جاهزة عند هبوط الضيف أو الموظف. مكتبا SAW وIST مفتوحان طوال اليوم.",
        "التأمين حسب المدة ومنفصل عن الأجرة.",
        "الاستخدام الشهري يشمل 3.800 كم. اليوم 300 كم وعشرة أيام 2.200 كم.",
        "السائق بلا بطاقة أو من لا يريد حجز الحد يمكنه استلام السيارة أيضاً.",
      ],
      diffTitle: "كيف يتم التسليم؟",
      diffIntro: "المكتب والتاريخ والسائق محددون في الحجز. في المطار ينتظر الموظف وقت الهبوط، وZakCar تدفع رسم الموقف.",
      steps: [
        "يصل الطلب من الموقع أو الهاتف أو واتساب.",
        "تذهب بيانات التأكيد بالبريد.",
        "يُبرز السائق رخصته في المكتب المختار ويوقّع العقد.",
        `التأمين حسب المدة: ${DEPOSIT.ar}.`,
        "إذا عادت السيارة كما سُلِّمت يُرد التأمين.",
      ],
      extraTitle: "الاستخدام الشهري للشركات",
      extra: [
        "في الشهر وما أطول يثبت المركز المدة والمسافة ومكتب التسليم. يُطلب فاتورة أو مستند مشابه لتأكيد العنوان.",
        "عند الإعادة المبكرة أو التمديد تُعاد الأجرة حسب الأيام المستخدمة. التفاصيل في صفحة شروط التأجير.",
      ],
      faqTitle: "أسئلة شائعة",
      faq: [
        ["كيف تُستأجر سيارة باسم الشركة؟", "أرسلوا عدد السيارات والمكتب والتواريخ إلى المركز أو عبر واتساب. السائق يوقّع العقد عند التسليم. الحجز مجاني ولا يوجد دفع مقدّم."],
        ["هل يجب أن تكون البطاقة بطاقة الشركة؟", "لا. بطاقة الائتمان غير إلزامية. الدفع عند التسليم نقداً أو ببطاقة خصم أو ائتمان. لا يُجرى استعلام Findeks."],
        ["كم التأمين؟", `${DEPOSIT.ar}. إذا أُعيدت السيارة كما سُلِّمت يُرد التأمين.`],
        ["هل يقود أكثر من موظف السيارة نفسها؟", "فقط السائقون المذكورون في العقد. السائق الإضافي يُبرز رخصته عند التسليم ويوقّع العقد."],
      ],
    },
    "findeks-sorgusuz-arac-kiralama": {
      title: "تأجير سيارات بدون استعلام Findeks",
      sub: "لا استعلام Findeks. الدفع عند السيارة نقداً أو ببطاقة خصم أو ببطاقة ائتمان.",
      lead: "تريدون استئجار سيارة دون سؤال عن درجة الائتمان؟ ZakCar يؤجّر في صبيحة كوكجن ومطار إسطنبول والمكتب المركزي دون استعلام Findeks.",
      after: "الحجز من الموقع مجاني ولا يوجد دفع مقدّم. تستلمون السيارة في المكتب الذي اخترتموه. التسليم في المطار مجاني. بطاقة الائتمان غير إلزامية أيضاً.",
      facts: [
        ["الاستعلام", "لا Findeks", "لا تُطلب درجة ائتمان"],
        ["الدفع", "عند التسليم", "نقداً أو بطاقة خصم أو ائتمان"],
        ["الحجز", "من الموقع", "مجاني ومن دون مقدّم"],
        ["التسليم", "SAW وIST والمركز", "مجاني في المطار"],
        ["السائق", "20 سنة · رخصة لسنتين", "قد يزيد الشرط حسب السيارة"],
        ["التأمين", "حسب المدة", "5.000 · 10.000 · 20.000 ليرة"],
      ],
      reserveTitle: "حجز بدون Findeks",
      reserve: [
        "يتم الحجز من خطوات الموقع. اختاروا صبيحة كوكجن أو مطار إسطنبول أو المكتب المركزي والتواريخ والسيارة. لا تُطلب درجة Findeks ولا بطاقة ائتمان.",
        "يظهر التأمين وشروط الدفع في ملخص الحجز حسب المدة، ويُؤكَّدان عند التسليم. يمكن إرسال الطلب نفسه عبر واتساب أو الهاتف.",
      ],
      payTitle: "الدفع",
      payIntro: "يُؤخذ الدفع عند تسليم السيارة. لا يوجد دفع مقدّم ولا سحب من البطاقة على الموقع. استعلام Findeks ليس جزءاً من هذا الدفع.",
      pay: ["نقداً", "بطاقة خصم", "بطاقة ائتمان، فقط إذا رغبتم"],
      whyTitle: "لماذا يُطلب استعلام Findeks؟",
      whyIntro: "Findeks هو السجل الذي يُظهر درجة الائتمان في تركيا. بعض مكاتب التأجير تستعلم عنه، خصوصاً عند غياب بطاقة الائتمان. أسبابهم:",
      why: [
        "يريدون الاطلاع على سجل الدفع للمستأجر.",
        "بلا بطاقة ائتمان يعدّون الدرجة ضماناً إضافياً.",
        "الموافقة تعتمد على حد يحدده المكتب.",
      ],
      whyOut: "ZakCar لا يجري هذا الاستعلام. السائق يُبرز رخصته عند التسليم ويوقّع العقد. فحص الرخصة ليس استعلام Findeks.",
      diffTitle: "كيف تسير العملية في ZakCar",
      diffIntro: "Findeks وبطاقة الائتمان غير إلزاميين. يُؤخذ التأمين نقداً أو ببطاقة خصم أو ائتمان، منفصلاً عن أجرة التأجير.",
      steps: [
        "يُنشأ الحجز من الموقع أو واتساب أو الهاتف.",
        "تُرسل الموافقة بالبريد.",
        "تُسلَّم السيارة في المكتب المختار ويُؤخذ الدفع حينها.",
        `التأمين حسب المدة: ${DEPOSIT.ar}.`,
        "إذا عادت السيارة كما سُلِّمت يُرد التأمين.",
      ],
      extraTitle: "عمر السائق والتأمين",
      extra: [
        "المعتاد 20 سنة ورخصة فئة B منذ سنتين على الأقل. بعض الفئات تطلب أكثر، والشرط مكتوب في صفحة السيارة.",
        "من هو دون هذا الحد يحتاج باقة السائق الشاب. الباقة 335 ليرة في اليوم. التأمين يبقى حسب جدول المدة ويُدفع عند التسليم نقداً أو ببطاقة خصم أو ائتمان.",
      ],
      faqTitle: "أسئلة شائعة",
      faq: [
        ["هل يُجرى استعلام Findeks؟", "لا. ZakCar لا يستعلم عن Findeks. درجة الائتمان ليست شرطاً للتأجير."],
        ["هل بطاقة الائتمان إلزامية؟", "لا. الدفع عند التسليم نقداً أو ببطاقة خصم أو ائتمان. الحجز من الموقع مجاني ولا يوجد دفع مقدّم."],
        ["كم التأمين؟", `${DEPOSIT.ar}. إذا أُعيدت السيارة كما سُلِّمت يُرد التأمين.`],
        ["أين أستلم السيارة؟", "في صالة الوصول بصبيحة كوكجن أو مخرج مبنى مطار إسطنبول أو المكتب المركزي. التسليم في المطار مجاني. مكتبا SAW وIST مفتوحان 24 ساعة."],
      ],
    },
  },
  ru: {
    "kredi-kartsiz-arac-kiralama": {
      title: "Аренда авто без кредитной карты",
      sub: "Без кредитной карты и без блокировки. Оплата у машины наличными, дебетовой или кредитной картой.",
      lead: "Хотите арендовать машину без кредитной карты? ZakCar сдаёт авто в Сабихе Гёкчен, в аэропорту Стамбула и в центральном офисе без кредитной карты и без проверки Findeks.",
      after: "Бронь на сайте бесплатная, предоплаты нет. Машину забираете в выбранном офисе. Выдача в аэропорту бесплатная.",
      facts: [
        ["Оплата", "Без кредитной карты", "Наличные, дебетовая или кредитная карта"],
        ["Выдача", "SAW, IST, центр", "В аэропорту бесплатно"],
        ["Бронь", "На сайте", "Бесплатно, без предоплаты"],
        ["Когда платить", "При выдаче", "Списания на сайте нет"],
        ["Водитель", "20 лет · права 2 года", "Условие зависит от машины"],
        ["Депозит", "По сроку", "5 000 · 10 000 · 20 000 TL"],
      ],
      reserveTitle: "Бронь без кредитной карты",
      reserve: [
        "Аренда без карты оформляется шагами на сайте. Достаточно выбрать Сабиху Гёкчен, аэропорт Стамбула или центральный офис, даты и машину. Номер рейса не обязателен. Если сообщите время посадки, выдачу в аэропорту подстроят под него.",
        "Депозит и условия оплаты видны в сводке по выбранному сроку и подтверждаются при выдаче. Ту же заявку можно отправить в WhatsApp или по телефону.",
      ],
      payTitle: "Оплата без кредитной карты",
      payIntro: "Оплату берут при выдаче машины. Предоплаты нет, с сайта карту не списывают.",
      pay: ["Наличные", "Дебетовая карта", "Кредитная карта, если сами хотите"],
      whyTitle: "Почему обычно просят кредитную карту?",
      whyIntro: "Крупные прокатные компании в аэропорту обычно просят кредитную карту и блокируют депозит на лимите. Причины такие:",
      why: [
        "Блокировка: часть лимита недоступна до конца аренды.",
        "Ущерб: возможную сумму хотят списать с карты.",
        "Владелец карты считается проверенным банком.",
        "Правило компании одинаково во многих странах.",
      ],
      whyOut: "Так остаются в стороне гости без кредитной карты и те, кто не хочет блокировать лимит.",
      diffTitle: "Как проходит оплата в ZakCar",
      diffIntro: "Кредитная карта и Findeks не обязательны. Депозит берут отдельно от аренды наличными, дебетовой или кредитной картой.",
      steps: [
        "Бронь делают на сайте, в WhatsApp или по телефону.",
        "Подтверждение приходит на почту.",
        "Машину выдают в выбранном офисе, оплату берут в этот момент.",
        `Депозит зависит от срока: ${DEPOSIT.ru}.`,
        "Если машину вернули в том виде, в каком выдали, депозит возвращают. Условия указаны в сводке до аренды и ещё раз при выдаче.",
      ],
      extraTitle: "Возраст водителя без карты",
      extra: [
        "Обычно нужны 20 лет и права категории B не меньше 2 лет. У части групп требование выше, оно написано на странице машины.",
        "Ниже этого порога нужен пакет молодого водителя, 335 TL в день. Депозит всё равно по таблице срока, при выдаче его можно внести наличными, дебетовой или кредитной картой.",
      ],
      faqTitle: "Частые вопросы",
      faq: [
        ["Можно арендовать без кредитной карты?", "Да. ZakCar сдаёт без кредитной карты и без Findeks. Оплата при выдаче наличными, дебетовой или кредитной картой. Бронь на сайте бесплатная, подойдут и WhatsApp, и телефон."],
        ["Какой депозит?", `${DEPOSIT.ru}. Если машину вернули как выдали, депозит отдают обратно.`],
        ["Где забрать машину?", "В зоне прилёта Сабихи Гёкчен, у выхода терминала аэропорта Стамбула или в центральном офисе. Выдача в аэропорту бесплатная. Времени посадки достаточно для встречи."],
        ["Можно ли в 20 лет без кредитной карты?", "Возраст и стаж зависят от машины. Обычно 20 лет и права 2 года. У части групп требование выше, это на странице машины. Ниже порога пакет молодого водителя стоит 335 TL в день."],
      ],
    },
    "uzun-donem-arac-kiralama": {
      title: "Долгосрочная аренда",
      sub: "Аренда на месяц и дольше. Депозит зависит от срока, оплата при выдаче.",
      lead: "Если машина нужна на несколько недель или месяцев, долгосрочная аренда даёт тот же парк без покупки авто. В ZakCar и долгий срок оформляют без кредитной карты и без проверки Findeks.",
      after: "Самый короткий срок — 24 часа. На месяц и дольше бронь можно начать на сайте, а детали уточнить по телефону. Предоплаты нет.",
      facts: [
        ["Срок", "От 1 дня до месяца", "На месяц — через офис"],
        ["Пробег", "3 800 км в месяц", "300 км в день, 2 200 км за 10 дней"],
        ["Депозит", "От 11 дней", "20 000 TL"],
        ["Оплата", "При выдаче", "Наличные, дебетовая или кредитная карта"],
        ["Документ", "При месячной аренде", "Счёт для подтверждения адреса"],
        ["Выдача", "SAW, IST, центр", "В аэропорту бесплатно"],
      ],
      reserveTitle: "Бронь на долгий срок",
      reserve: [
        "Даты и машину выбираете на сайте. Ступень депозита меняется со сроком: 5 000 TL за 1–3 дня, 10 000 TL за 4–10 дней, 20 000 TL от 11 дней. Сумма видна в сводке брони.",
        "Для месяца офис уточняет с вами срок, пробег и пункт выдачи. Для адреса просят счёт или похожий документ.",
      ],
      payTitle: "Оплата долгой аренды",
      payIntro: "Аренду и депозит берут полностью при выдаче машины. С сайта карту не списывают, предоплаты нет. Кредитная карта не нужна.",
      pay: ["Наличные", "Дебетовая карта", "Кредитная карта, если хотите"],
      whyTitle: "Когда подходит долгий срок",
      whyIntro: "Сразу выбрать долгий срок удобнее, чем продлевать дневную аренду, если:",
      why: [
        "Вы остаётесь в городе на несколько недель или месяцев.",
        "Для работы машина нужна постоянно, а покупать парк не хотите.",
        "Забираете в аэропорту и возвращаете в тот же офис.",
        "Не хотите блокировать лимит карты. Депозит принимают и наличными, и дебетовой картой.",
      ],
      diffTitle: "Срок и километры",
      diffIntro: "Пробег на выбранные дни написан в сводке брони. Километры сверх лимита считают при возврате по заранее названной цене за километр.",
      steps: [
        "В день включено 300 км.",
        "До 10 дней включено 2 200 км.",
        "В месяц включено 3 800 км.",
        "Если нужно больше, это обсуждают с офисом.",
        "При раннем возврате или продлении цену пересчитывают по использованным дням.",
      ],
      extraTitle: "Выдача и водитель",
      extra: [
        "Машину выдают в Сабихе Гёкчен, в аэропорту Стамбула или в центральном офисе. Аэропортовые офисы работают круглосуточно, выдача бесплатная.",
        "Обычно нужны 20 лет и права не меньше 2 лет. Если требование выше, это на странице машины. При выдаче водитель показывает права и подписывает договор.",
      ],
      faqTitle: "Частые вопросы",
      faq: [
        ["Как начинается долгая аренда?", "Даты и машину можно выбрать на сайте. На месяц и дольше офис уточняет детали. Бронь бесплатная, предоплаты нет."],
        ["Какой депозит на долгий срок?", "От 11 дней депозит 20 000 TL. Короче: 5 000 TL за 1–3 дня и 10 000 TL за 4–10 дней. Если машину вернули как выдали, депозит возвращают."],
        ["Какой месячный пробег?", "В месяц включено 3 800 км. День — 300 км, 10 дней — 2 200 км. Сверх лимита считают при возврате по заранее названной цене."],
        ["Нужна ли кредитная карта?", "Нет. Оплата при выдаче наличными, дебетовой или кредитной картой. Проверки Findeks нет."],
      ],
    },
    "kurumsal-arac-kiralama": {
      title: "Аренда для компаний",
      sub: "Аренда авто для компаний. Выдача в Сабихе Гёкчен, в аэропорту Стамбула и в центральном офисе.",
      lead: "Если компании нужна одна машина или несколько, корпоративная аренда ZakCar выдаёт тот же парк в Сабихе Гёкчен, в аэропорту Стамбула и в центральном офисе.",
      after: "Условия подтверждают с офисом или в WhatsApp. Бронь бесплатная, предоплаты нет. Оплату берут при выдаче машины. Кредитная карта и Findeks не нужны.",
      facts: [
        ["Для кого", "Компании", "Одна машина или несколько"],
        ["Выдача", "SAW, IST, центр", "Аэропорты круглосуточно"],
        ["Оплата", "При выдаче", "Наличные, дебетовая или кредитная карта"],
        ["Водитель", "Подпись при выдаче", "Права и удостоверение"],
        ["Депозит", "По сроку", "5 000 · 10 000 · 20 000 TL"],
        ["Месяц", "Подтверждение адреса", "Счёт или похожий документ"],
      ],
      reserveTitle: "Как отправить заявку компании",
      reserve: [
        "Достаточно написать число машин, офис выдачи, даты и примерный срок в офис или в WhatsApp. Одну машину можно сначала забронировать и на сайте.",
        "Водитель, который забирает машину, привозит права и удостоверение и сам подписывает договор. Кто не указан в договоре, машиной не пользуется.",
      ],
      payTitle: "Оплата корпоративной аренды",
      payIntro: "Аренду и депозит берут при выдаче. Лимит карты не блокируют. Кредитная карта не обязательна, подходят наличные и дебетовая карта.",
      pay: ["Наличные", "Дебетовая карта", "Кредитная карта, если водитель так хочет"],
      whyTitle: "Чем это полезно компании",
      whyIntro: "Аренда вместо покупки машины или доставки своей машины в аэропорт упрощает вот что:",
      why: [
        "Машина готова, когда садится гость или сотрудник. Офисы SAW и IST работают круглосуточно.",
        "Депозит зависит от срока и отделён от стоимости аренды.",
        "На месяц включено 3 800 км. День — 300 км, 10 дней — 2 200 км.",
        "Водитель без карты или без желания блокировать лимит тоже может забрать машину.",
      ],
      diffTitle: "Как проходит выдача",
      diffIntro: "Офис, дата и водитель указаны в брони. В аэропорту сотрудник ждёт время посадки, парковку оплачивает ZakCar.",
      steps: [
        "Заявку принимают с сайта, по телефону или в WhatsApp.",
        "Подтверждение уходит на почту.",
        "Водитель показывает права в выбранном офисе и подписывает договор.",
        `Депозит зависит от срока: ${DEPOSIT.ru}.`,
        "Если машину вернули в том виде, в каком выдали, депозит возвращают.",
      ],
      extraTitle: "Месячное использование компанией",
      extra: [
        "На месяц и дольше офис уточняет срок, пробег и пункт выдачи. Для адреса просят счёт или похожий документ.",
        "При раннем возврате или продлении цену пересчитывают по использованным дням. Подробности на странице условий аренды.",
      ],
      faqTitle: "Частые вопросы",
      faq: [
        ["Как арендовать на компанию?", "Отправьте число машин, офис и даты в офис или в WhatsApp. Водитель подписывает договор при выдаче. Бронь бесплатная, предоплаты нет."],
        ["Кредитная карта должна быть корпоративной?", "Нет. Кредитная карта не обязательна. Оплата при выдаче наличными, дебетовой или кредитной картой. Проверки Findeks нет."],
        ["Какой депозит?", `${DEPOSIT.ru}. Если машину вернули как выдали, депозит отдают обратно.`],
        ["Могут ли несколько сотрудников водить одну машину?", "Только водители, указанные в договоре. Дополнительный водитель показывает права при выдаче и подписывает договор."],
      ],
    },
    "findeks-sorgusuz-arac-kiralama": {
      title: "Аренда авто без проверки Findeks",
      sub: "Без проверки Findeks. Оплата у машины наличными, дебетовой или кредитной картой.",
      lead: "Хотите арендовать машину без проверки кредитного рейтинга? ZakCar сдаёт авто в Сабихе Гёкчен, в аэропорту Стамбула и в центральном офисе без запроса Findeks.",
      after: "Бронь на сайте бесплатная, предоплаты нет. Машину забираете в выбранном офисе. Выдача в аэропорту бесплатная. Кредитная карта тоже не обязательна.",
      facts: [
        ["Проверка", "Без Findeks", "Рейтинг не спрашивают"],
        ["Оплата", "При выдаче", "Наличные, дебетовая или кредитная карта"],
        ["Бронь", "На сайте", "Бесплатно, без предоплаты"],
        ["Выдача", "SAW, IST, центр", "В аэропорту бесплатно"],
        ["Водитель", "20 лет · права 2 года", "Для машины может быть строже"],
        ["Депозит", "По сроку", "5 000 · 10 000 · 20 000 TL"],
      ],
      reserveTitle: "Бронь без Findeks",
      reserve: [
        "Бронь идёт по шагам на сайте. Выберите Сабиху Гёкчен, аэропорт Стамбула или центральный офис, даты и машину. Оценка Findeks и кредитная карта не нужны.",
        "Депозит и условия оплаты видны в сводке по выбранному сроку и подтверждаются при выдаче. Ту же заявку можно отправить в WhatsApp или по телефону.",
      ],
      payTitle: "Оплата",
      payIntro: "Оплату берут при выдаче машины. Предоплаты и списания с карты на сайте нет. Проверка Findeks к этой оплате не относится.",
      pay: ["Наличные", "Дебетовая карта", "Кредитная карта, только если хотите"],
      whyTitle: "Зачем спрашивают Findeks?",
      whyIntro: "Findeks — это запись кредитного рейтинга в Турции. Некоторые прокаты запрашивают её, особенно без кредитной карты. Их причины:",
      why: [
        "Они хотят видеть историю платежей арендатора.",
        "Без кредитной карты рейтинг для них дополнительная гарантия.",
        "Одобрение зависит от порога, который ставит офис.",
      ],
      whyOut: "ZakCar эту проверку не делает. Водитель показывает права при выдаче и подписывает договор. Проверка прав — это не запрос Findeks.",
      diffTitle: "Как это проходит в ZakCar",
      diffIntro: "Findeks и кредитная карта не обязательны. Депозит берут наличными, дебетовой или кредитной картой, отдельно от стоимости аренды.",
      steps: [
        "Бронь делают на сайте, в WhatsApp или по телефону.",
        "Подтверждение уходит на почту.",
        "Машину выдают в выбранном офисе, оплату берут в этот момент.",
        `Депозит зависит от срока: ${DEPOSIT.ru}.`,
        "Если машину вернули в том виде, в каком выдали, депозит возвращают.",
      ],
      extraTitle: "Возраст водителя и депозит",
      extra: [
        "Обычно нужны 20 лет и права категории B не меньше 2 лет. У части групп требование выше; оно написано на странице машины.",
        "Водителю младше этого порога нужен пакет молодого водителя. Он стоит 335 TL в день. Депозит по-прежнему идёт по таблице срока и принимается при выдаче наличными, дебетовой или кредитной картой.",
      ],
      faqTitle: "Частые вопросы",
      faq: [
        ["Делаете ли вы проверку Findeks?", "Нет. ZakCar не запрашивает Findeks. Кредитный рейтинг не является условием аренды."],
        ["Нужна ли кредитная карта?", "Нет. Оплата при выдаче наличными, дебетовой или кредитной картой. Бронь на сайте бесплатная, предоплаты нет."],
        ["Какой депозит?", `${DEPOSIT.ru}. Если машину вернули как выдали, депозит отдают обратно.`],
        ["Где забрать машину?", "В зоне прилёта Сабихи Гёкчен, у выхода терминала аэропорта Стамбула или в центральном офисе. Выдача в аэропорту бесплатная. Офисы SAW и IST работают круглосуточно."],
      ],
    },
  },
};

function pageFor(locale: Locale, slug: ServiceSlug): PageCopy {
  return COPY[locale][slug];
}

export function ServiceHeading({ slug }: { slug: ServiceSlug }) {
  const { locale } = usePrefs();
  const page = pageFor(locale, slug);

  useEffect(() => {
    document.title = `${page.title} | ${SITE.shortName}`;
  }, [page.title]);

  return (
    <>
      <h1 className="section-title">{page.title}</h1>
      <p className="section-sub">{page.sub}</p>
    </>
  );
}

export function ServiceArticle({ slug }: { slug: ServiceSlug }) {
  const { locale, t } = usePrefs();
  const page = pageFor(locale, slug);

  return (
    <article className="legal-content mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-ink-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_strong]:font-semibold [&_strong]:text-ink">
      <p>{page.lead}</p>
      <p>{page.after}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {page.facts.map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-surface-border bg-white px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
            <dd className="mt-1 font-semibold text-ink">{value}</dd>
            <dd className="text-sm">{note}</dd>
          </div>
        ))}
      </dl>

      <h2>{page.reserveTitle}</h2>
      {page.reserve.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h2>{page.payTitle}</h2>
      <p>{page.payIntro}</p>
      <ul className="list-disc space-y-2 pl-5">
        {page.pay.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{page.whyTitle}</h2>
      <p>{page.whyIntro}</p>
      <ul className="list-disc space-y-2 pl-5">
        {page.why.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {page.whyOut ? <p>{page.whyOut}</p> : null}

      <h2>{page.diffTitle}</h2>
      <p>{page.diffIntro}</p>
      <ol className="list-decimal space-y-2 pl-5">
        {page.steps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      {page.extraTitle && page.extra ? (
        <>
          <h2>{page.extraTitle}</h2>
          {page.extra.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </>
      ) : null}

      <h2>{page.faqTitle}</h2>
      <div className="space-y-4">
        {page.faq.map(([question, answer]) => (
          <div key={question}>
            <p className="font-semibold text-ink">{question}</p>
            <p className="mt-1">{answer}</p>
          </div>
        ))}
      </div>

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
        <Link href="/kiralama-kosullari">{t("nav.terms")}</Link>
        {" · "}
        <Link href="/arac-modelleri">{t("home.allCars")}</Link>
      </p>
    </article>
  );
}
