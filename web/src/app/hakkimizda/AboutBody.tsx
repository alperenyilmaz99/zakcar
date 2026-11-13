"use client";

import { useEffect } from "react";
import { Content } from "@/components/content/ContentPage";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { SITE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

const COPY: Record<Locale, { title: string; paragraphs: string[] }> = {
  tr: {
    title: "Hakkımızda",
    paragraphs: [
      "ZakCar Rent a Car, turizm ve ulaşım sektöründeki yolculuğuna 2000 yılında Almanya’da kurduğu bilet satış acentesi ve seyahat danışmanlığı hizmetleriyle adım atmıştır. Kurulduğu ilk günden itibaren müşteri memnuniyetini ve kaliteli hizmet anlayışını ilke edinen firmamız, kısa sürede sektörde sağlam ve güvenilir bir yer edinmiştir.",
      "İlerleyen yıllarda turizmin dinamik yapısına ve misafirlerimizin gelişen ihtiyaçlarına yanıt vererek hizmet ağını genişletmiştir. Başta araç alım-satım, filo ve bireysel araç kiralama olmak üzere, otel konaklama çözümleri ve seyahat planlama gibi turizmin tüm kollarını bünyesine katarak entegre bir hizmet anlayışını benimsemiştir.",
      "Almanya’da temelleri atılan uluslararası tecrübemizi, Türkiye’de ve özellikle İstanbul bölgesinde ZakCar güvencesiyle sunmaktan gurur duyuyoruz. Geniş ve modern araç filomuz, havalimanı ve şehir içi kesintisiz teslimat noktalarımız ile hem bireysel hem de kurumsal müşterilerimize konforlu, güvenli ve şeffaf bir kiralama deneyimi vaat ediyoruz.",
      "25 yılı aşan sektör tecrübemiz, yenilikçi vizyonumuz ve uzman kadromuzla; yolculuğunuzun her anında yanınızda olmaya devam ediyoruz.",
      "ZakCar Rent a Car — Konforlu ve Güvenli Yolculuğun Adresi.",
    ],
  },
  en: {
    title: "About",
    paragraphs: [
      "ZakCar Rent a Car started in tourism and transport in 2000, with a ticket agency and travel advice set up in Germany. From the first day the company kept customer satisfaction and a careful service as its rule, and it soon held a solid place in the sector.",
      "In the years after that it widened the work to match how travel changes and what guests need. Car sales, fleet and personal rentals, hotel stays and trip planning all sit in the same service.",
      "We are glad to bring that experience, started in Germany, to Turkey and especially to Istanbul under the ZakCar name. A wide modern fleet and handover at the airports and in the city, without a break, is there for personal and company guests: comfortable, safe and clear.",
      "With more than 25 years in the sector, a practical outlook and an experienced team, we stay with you through the trip.",
      "ZakCar Rent a Car — a comfortable and safe journey.",
    ],
  },
  de: {
    title: "Über uns",
    paragraphs: [
      "ZakCar Rent a Car hat 2000 in Deutschland mit einem Ticketbüro und Reiseberatung in Tourismus und Verkehr begonnen. Von Anfang an galten Kundenzufriedenheit und sorgfältiger Service, und das Unternehmen fand schnell einen festen Platz in der Branche.",
      "In den Jahren danach wurde das Angebot breiter: Autohandel, Flotten- und Privatmiete, Hotelunterkunft und Reiseplanung gehören zu demselben Dienst.",
      "Wir geben diese in Deutschland begonnene Erfahrung in der Türkei und besonders in Istanbul unter dem Namen ZakCar weiter. Eine breite moderne Flotte und Übergabe an den Flughäfen und in der Stadt, ohne Unterbrechung, gilt für private und Firmenkunden: komfortabel, sicher und klar.",
      "Mit mehr als 25 Jahren in der Branche, einem praktischen Blick und einem erfahrenen Team bleiben wir auf der Fahrt an Ihrer Seite.",
      "ZakCar Rent a Car — eine komfortable und sichere Fahrt.",
    ],
  },
  ar: {
    title: "من نحن",
    paragraphs: [
      "بدأت ZakCar Rent a Car في السياحة والنقل عام 2000 بوكالة تذاكر واستشارة سفر أُسست في ألمانيا. منذ اليوم الأول كان رضا الضيف والخدمة المتقنة قاعدة العمل، وسرعان ما أخذت الشركة مكاناً ثابتاً في القطاع.",
      "في السنوات التالية اتسع العمل مع تغيّر السفر وحاجات الضيوف. بيع السيارات وتأجير الأسطول والأفراد وحلول الفنادق وتخطيط الرحلة صارت في الخدمة نفسها.",
      "يسعدنا أن نقدم هذه الخبرة التي بدأت في ألمانيا إلى تركيا وخصوصاً إسطنبول باسم ZakCar. أسطول واسع وحديث ونقاط تسليم في المطار وداخل المدينة بلا انقطاع، للضيوف الأفراد والشركات: مريح وآمن وواضح.",
      "بخبرة تتجاوز 25 سنة ونظرة عملية وفريق مختص، نبقى معكم في كل لحظة من الرحلة.",
      "ZakCar Rent a Car — عنوان رحلة مريحة وآمنة.",
    ],
  },
  ru: {
    title: "О нас",
    paragraphs: [
      "ZakCar Rent a Car начал работу в туризме и перевозках в 2000 году: в Германии открылось бюро билетов и консультаций по поездкам. С первого дня правилом были довольный гость и аккуратная услуга, и компания быстро заняла прочное место в отрасли.",
      "Позже работа расширилась вместе с поездками и запросами гостей. Продажа машин, аренда для парка и для частных поездок, отели и планирование маршрута собраны в одной услуге.",
      "Этот опыт, начатый в Германии, мы ведём в Турции и особенно в Стамбуле под именем ZakCar. Широкий современный парк и выдача в аэропортах и в городе без перерыва — для частных гостей и компаний: удобно, спокойно и понятно.",
      "Больше 25 лет в отрасли, практичный взгляд и опытная команда остаются с вами на всей поездке.",
      "ZakCar Rent a Car — удобная и спокойная дорога.",
    ],
  },
};

export function AboutBody() {
  const { locale } = usePrefs();
  const page = COPY[locale];

  useEffect(() => {
    document.title = `${page.title} | ${SITE.shortName}`;
  }, [page.title]);

  return (
    <Content title={page.title}>
      {page.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </Content>
  );
}
