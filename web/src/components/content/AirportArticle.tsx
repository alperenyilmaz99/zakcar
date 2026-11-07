import Link from "next/link";
import { SITE } from "@/lib/constants";

type AirportId = "saw" | "iga";

const COPY = {
  saw: {
    title: "Sabiha Gökçen'de Kredi Kartsız Araç Kiralama",
    lead: "İstanbul Sabiha Gökçen Havalimanı'nda kredi kartı zorunluluğu olmadan araç kiralamak istiyor musunuz? ZakCar, Sabiha Gökçen Havalimanı'nda kredi kartı ve Findeks sorgusu olmadan araç kiralayan ofislerden biridir.",
    after: "Rezervasyonu siteden ücretsiz oluşturursunuz; ön ödeme alınmaz. Aracınızı SAW geliş katında, terminal çıkışında teslim alırsınız.",
    facts: [
      ["Ödeme", "Kredi kartsız", "Nakit, banka kartı veya kredi kartı"],
      ["Teslim", "SAW geliş katı", "Terminal çıkışında karşılama"],
      ["Rezervasyon", "Siteden", "Ücretsiz, ön ödemesiz"],
      ["Ödeme zamanı", "Araç tesliminde", "Online tahsilat yok"],
      ["Sürücü", "20 yaş · 2 yıl ehliyet", "Şart araca göre değişir"],
      ["Depozito", "Süreye göre", "5.000 · 10.000 · 20.000 TL"],
    ],
    reserveTitle: "Kredi kartsız rezervasyon",
    reserve: [
      "Sabiha Gökçen'de kredi kartsız kiralama sitedeki rezervasyon adımlarından yapılır. Alış yeri olarak SAW'ı, tarihleri ve aracı seçmeniz yeterlidir. Uçuş numarası zorunlu değildir; iniş saatinizi bildirirseniz geliş katında karşılama buna göre ayarlanır.",
      "Depozito ve ödeme koşulları seçtiğiniz süreye göre rezervasyon özetinde görünür, teslimde de teyit edilir. Aynı talebi WhatsApp veya telefondan da iletebilirsiniz.",
    ],
    payTitle: "Sabiha Gökçen kredi kartsız ödeme",
    payIntro: "Ödeme araç tesliminde alınır. Ön ödeme ve siteden kart çekimi yoktur.",
    pay: [
      "Nakit",
      "Banka kartı",
      "Kredi kartı, zorunlu değildir; tercih ederseniz kullanılır",
    ],
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
    steps: [
      "Rezervasyon siteden, WhatsApp'tan veya telefondan yapılır.",
      "Onay bilgisi e-posta ile gönderilir.",
      "Sabiha Gökçen geliş katında araç teslim edilir; ödeme bu anda alınır.",
      "Depozito süreye göredir: 1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL.",
      "Araç teslim edildiği gibi dönerse depozito iade edilir. Koşullar kiralamadan önce özet ekranında ve teslimde belirtilir.",
    ],
    ageTitle: "Sürücü yaşı ve kredi kartsız kiralama",
    age: [
      "Genelde 20 yaş ve en az 2 yıllık B sınıfı ehliyet gerekir. Bazı gruplarda yaş ve ehliyet yılı daha yüksektir; şart seçilen aracın sayfasında yazar.",
      "Bu sınırın altındaki sürücü için genç sürücü paketi gerekir. Paket günlük 335 TL'dir. Depozito yine süre tablosuna göredir ve teslimde nakit, banka kartı veya kredi kartıyla alınabilir.",
    ],
    whoTitle: "Sabiha Gökçen'de kredi kartsız kiralama kimler için uygun?",
    who: [
      "Kredi kartı olmayan misafir: ehliyet, kimlik veya pasaport ve teslimde ödeme yeterlidir.",
      "Kart limitini bloke ettirmek istemeyen misafir.",
      "Yurt dışından gelen ve ödemeyi araç başında yapmak isteyen misafir.",
      "Henüz kredi kartı olmayan genç sürücü: yaş ve ehliyet şartı araç sayfasında, paket günlük 335 TL.",
      "Uzun dönem kiralama: ödeme teslimde, depozito süreye göre bir kez alınır.",
    ],
    faqTitle: "Sık sorulanlar",
    faq: [
      ["Sabiha Gökçen'de kredi kartsız araç kiralayabilir miyim?", "Evet. ZakCar Sabiha Gökçen'de kredi kartı ve Findeks zorunluluğu olmadan kiralama yapar. Ödeme teslimde nakit, banka kartı veya kredi kartı ile alınır. Rezervasyon siteden ücretsiz yapılır; isterseniz WhatsApp veya telefon da kullanılır."],
      ["Depozito ne kadar?", "1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir."],
      ["Aracı Sabiha Gökçen'de nerede teslim alırım?", "SAW geliş katında, terminal çıkışında. İniş saatinizi rezervasyonda bildirmeniz karşılama için yeterlidir. Teslim ücretsizdir ve ofis 7/24 açıktır."],
      ["20 yaşında, kredi kartı olmadan kiralama yapılır mı?", "Yaş ve ehliyet süresi araca göre değişir. Genelde 20 yaş ve 2 yıllık ehliyet aranır; bazı gruplarda şart daha yüksektir ve araç sayfasında yazar. Sınırın altı için genç sürücü paketi günlük 335 TL'dir."],
    ],
  },
  iga: {
    title: "İstanbul Havalimanı'nda Kredi Kartsız Araç Kiralama",
    lead: "İstanbul Havalimanı'nda kredi kartı zorunluluğu olmadan araç kiralamak istiyor musunuz? ZakCar, İstanbul Havalimanı'nda kredi kartı ve Findeks sorgusu olmadan araç kiralayan ofislerden biridir.",
    after: "Rezervasyonu siteden ücretsiz oluşturursunuz; ön ödeme alınmaz. Aracınız terminal çıkışında sizi bekler, teslim ücretsizdir.",
    facts: [
      ["Ödeme", "Kredi kartsız", "Nakit, banka kartı veya kredi kartı"],
      ["Teslim", "IGA terminal çıkışı", "Araç sizi bekler"],
      ["Rezervasyon", "Siteden", "Ücretsiz, ön ödemesiz"],
      ["Ödeme zamanı", "Araç başında", "Online tahsilat yok"],
      ["Sürücü", "20 yaş · 2 yıl ehliyet", "Şart araca göre değişir"],
      ["Depozito", "Süreye göre", "5.000 · 10.000 · 20.000 TL"],
    ],
    reserveTitle: "Kredi kartsız rezervasyon",
    reserve: [
      "İstanbul Havalimanı'nda kredi kartsız kiralama sitedeki rezervasyon adımlarından yapılır. Alış yeri olarak IGA'yı, tarihleri ve aracı seçmeniz yeterlidir. Uçuş numarası zorunlu değildir; iniş saatinizi bildirirseniz teslim buna göre hazırlanır.",
      "Depozito ve ödeme koşulları seçtiğiniz süreye göre rezervasyon özetinde görünür, teslimde de teyit edilir. Aynı talebi WhatsApp veya telefondan da iletebilirsiniz.",
    ],
    payTitle: "İstanbul Havalimanı kredi kartsız ödeme",
    payIntro: "Ödeme araç başında alınır. Ön ödeme ve siteden kart çekimi yoktur.",
    pay: [
      "Nakit",
      "Banka kartı",
      "Kredi kartı, zorunlu değildir; tercih ederseniz kullanılır",
    ],
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
    steps: [
      "Rezervasyon siteden, WhatsApp'tan veya telefondan yapılır.",
      "Onay bilgisi e-posta ile gönderilir.",
      "İstanbul Havalimanı terminal çıkışında araç teslim edilir; ödeme bu anda, araç başında alınır.",
      "Depozito süreye göredir: 1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL.",
      "Araç teslim edildiği gibi dönerse depozito iade edilir. Koşullar kiralamadan önce özet ekranında ve teslimde belirtilir.",
    ],
    ageTitle: "Sürücü yaşı ve kredi kartsız kiralama",
    age: [
      "Genelde 20 yaş ve en az 2 yıllık B sınıfı ehliyet gerekir. Bazı gruplarda yaş ve ehliyet yılı daha yüksektir; şart seçilen aracın sayfasında yazar.",
      "Bu sınırın altındaki sürücü için genç sürücü paketi gerekir. Paket günlük 335 TL'dir. Depozito yine süre tablosuna göredir ve teslimde nakit, banka kartı veya kredi kartıyla alınabilir.",
    ],
    whoTitle: "İstanbul Havalimanı'nda kredi kartsız kiralama kimler için uygun?",
    who: [
      "Kredi kartı olmayan misafir: ehliyet, kimlik veya pasaport ve teslimde ödeme yeterlidir.",
      "Kart limitini bloke ettirmek istemeyen misafir.",
      "Yurt dışından gelen ve ödemeyi araç başında yapmak isteyen misafir.",
      "Henüz kredi kartı olmayan genç sürücü: yaş ve ehliyet şartı araç sayfasında, paket günlük 335 TL.",
      "Uzun dönem kiralama: ödeme teslimde, depozito süreye göre bir kez alınır.",
    ],
    faqTitle: "Sık sorulanlar",
    faq: [
      ["İstanbul Havalimanı'nda kredi kartsız araç kiralayabilir miyim?", "Evet. ZakCar İstanbul Havalimanı'nda kredi kartı ve Findeks zorunluluğu olmadan kiralama yapar. Ödeme teslimde nakit, banka kartı veya kredi kartı ile alınır. Rezervasyon siteden ücretsiz yapılır; isterseniz WhatsApp veya telefon da kullanılır."],
      ["Depozito ne kadar?", "1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir."],
      ["Aracı İstanbul Havalimanı'nda nerede teslim alırım?", "Terminal çıkışında. İniş saatinizi rezervasyonda bildirmeniz yeterlidir. Araç sizi bekler, teslim ücretsizdir ve ofis 7/24 açıktır."],
      ["20 yaşında, kredi kartı olmadan kiralama yapılır mı?", "Yaş ve ehliyet süresi araca göre değişir. Genelde 20 yaş ve 2 yıllık ehliyet aranır; bazı gruplarda şart daha yüksektir ve araç sayfasında yazar. Sınırın altı için genç sürücü paketi günlük 335 TL'dir."],
    ],
  },
} as const;

export function airportArticleTitle(slug: string): string | null {
  if (slug === "sabiha-gokcen-havalimani-arac-kiralama") return COPY.saw.title;
  if (slug === "istanbul-3-havalimani-arac-kiralama") return COPY.iga.title;
  return null;
}

export function AirportArticle({ airport }: { airport: AirportId }) {
  const page = COPY[airport];
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
      <p>{page.whyOut}</p>

      <h2>{page.diffTitle}</h2>
      <p>{page.diffIntro}</p>
      <ol className="list-decimal space-y-2 pl-5">
        {page.steps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <h2>{page.ageTitle}</h2>
      {page.age.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h2>{page.whoTitle}</h2>
      <ul className="list-disc space-y-2 pl-5">
        {page.who.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

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
        Telefon{" "}
        <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
        {" · "}
        WhatsApp{" "}
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
          {SITE.whatsappDisplay}
        </a>
        {" · "}
        <Link href="/arac-modelleri">Araçları incele</Link>
      </p>
    </article>
  );
}
