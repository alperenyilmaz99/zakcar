import Link from "next/link";
import { SITE } from "@/lib/constants";

type ServiceSlug =
  | "kredi-kartsiz-arac-kiralama"
  | "uzun-donem-arac-kiralama"
  | "kurumsal-arac-kiralama";

type PageCopy = {
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

const DEPOSIT = "1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL";

const COPY: Record<ServiceSlug, PageCopy> = {
  "kredi-kartsiz-arac-kiralama": {
    lead: "Kredi kartı zorunluluğu olmadan araç kiralamak istiyor musunuz? ZakCar, Sabiha Gökçen, İstanbul Havalimanı ve merkez ofiste kredi kartı ve Findeks sorgusu olmadan araç kiralayan ofislerden biridir.",
    after: "Rezervasyonu siteden ücretsiz oluşturursunuz; ön ödeme alınmaz. Aracı seçtiğiniz ofiste teslim alırsınız. Havalimanı teslimi ücretsizdir.",
    facts: [
      ["Ödeme", "Kredi kartsız", "Nakit, banka kartı veya kredi kartı"],
      ["Teslim", "SAW, IGA, merkez", "Havalimanında ücretsiz"],
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
    pay: [
      "Nakit",
      "Banka kartı",
      "Kredi kartı, zorunlu değildir; tercih ederseniz kullanılır",
    ],
    whyTitle: "Kredi kartı neden genelde istenir?",
    whyIntro:
      "Havalimanı şubelerinde çalışan büyük kiralama firmaları çoğunlukla kredi kartı ister ve depozitoyu kart limitinde bloke eder. Gerekçeleri şunlardır:",
    why: [
      "Depozito blokesi: kart limitinin bir bölümü kiralama bitene kadar kullanılamaz.",
      "Hasar tahsilatı: olası bedel karttan çekilmek istenir.",
      "Kart sahibi banka tarafından doğrulanmış sayılır.",
      "Firma politikası çoğu ülkede aynıdır.",
    ],
    whyOut: "Bu düzen, kredi kartı olmayan ya da limitinin bloke edilmesini istemeyen misafiri dışarıda bırakır.",
    diffTitle: "ZakCar'da ödeme nasıl işler?",
    diffIntro:
      "ZakCar'da kredi kartı ve Findeks zorunlu değildir. Depozito nakit, banka kartı veya kredi kartıyla, kira bedelinden ayrı alınır.",
    steps: [
      "Rezervasyon siteden, WhatsApp'tan veya telefondan yapılır.",
      "Onay bilgisi e-posta ile gönderilir.",
      "Araç seçilen ofiste teslim edilir; ödeme bu anda alınır.",
      `Depozito süreye göredir: ${DEPOSIT}.`,
      "Araç teslim edildiği gibi dönerse depozito iade edilir. Koşullar kiralamadan önce özet ekranında ve teslimde belirtilir.",
    ],
    extraTitle: "Sürücü yaşı ve kredi kartsız kiralama",
    extra: [
      "Genelde 20 yaş ve en az 2 yıllık B sınıfı ehliyet gerekir. Bazı gruplarda yaş ve ehliyet yılı daha yüksektir; şart seçilen aracın sayfasında yazar.",
      "Bu sınırın altındaki sürücü için genç sürücü paketi gerekir. Paket günlük 335 TL'dir. Depozito yine süre tablosuna göredir ve teslimde nakit, banka kartı veya kredi kartıyla alınabilir.",
    ],
    faqTitle: "Sık sorulanlar",
    faq: [
      [
        "Kredi kartsız araç kiralayabilir miyim?",
        "Evet. ZakCar kredi kartı ve Findeks zorunluluğu olmadan kiralama yapar. Ödeme teslimde nakit, banka kartı veya kredi kartı ile alınır. Rezervasyon siteden ücretsiz yapılır; isterseniz WhatsApp veya telefon da kullanılır.",
      ],
      [
        "Depozito ne kadar?",
        `${DEPOSIT}'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir.`,
      ],
      [
        "Aracı nerede teslim alırım?",
        "Sabiha Gökçen geliş katında, İstanbul Havalimanı terminal çıkışında veya merkez ofiste. Havalimanı teslimi ücretsizdir. İniş saatinizi bildirmeniz karşılama için yeterlidir.",
      ],
      [
        "20 yaşında, kredi kartı olmadan kiralama yapılır mı?",
        "Yaş ve ehliyet süresi araca göre değişir. Genelde 20 yaş ve 2 yıllık ehliyet aranır; bazı gruplarda şart daha yüksektir ve araç sayfasında yazar. Sınırın altı için genç sürücü paketi günlük 335 TL'dir.",
      ],
    ],
  },
  "uzun-donem-arac-kiralama": {
    lead: "Birkaç hafta veya ay boyunca araca ihtiyacınız varsa uzun dönem kiralama, aracı satın almadan aynı filodan kullanmanızı sağlar. ZakCar'da uzun dönem de kredi kartı ve Findeks zorunluluğu olmadan yapılır.",
    after: "En kısa kiralama 24 saattir. Aylık ve daha uzun süreler için rezervasyonu siteden başlatabilir, netleştirmek için çağrı merkezini arayabilirsiniz. Ön ödeme alınmaz.",
    facts: [
      ["Süre", "1 günden aylığa", "Aylık için çağrı merkezi"],
      ["Yol hakkı", "Aylık 3.800 km", "Günlük 300 km, 10 günde 2.200 km"],
      ["Depozito", "11 gün ve üzeri", "20.000 TL"],
      ["Ödeme", "Teslimde", "Nakit, banka kartı veya kredi kartı"],
      ["Belge", "Aylık kiralamada", "Adres teyidi için fatura"],
      ["Teslim", "SAW, IGA, merkez", "Havalimanında ücretsiz"],
    ],
    reserveTitle: "Uzun dönem rezervasyon",
    reserve: [
      "Tarihleri ve aracı siteden seçersiniz. Süre uzadıkça depozito dilimi değişir: 1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzerinde 20.000 TL. Tutar rezervasyon özetinde görünür.",
      "Aylık kiralama için çağrı merkezimiz süre, kilometre ve teslim ofisini sizinle netleştirir. Adres teyidi için fatura veya benzeri bir belge istenir.",
    ],
    payTitle: "Uzun dönemde ödeme",
    payIntro: "Kira bedeli ve depozito araç tesliminde, peşin alınır. Siteden kart çekimi ve ön ödeme yoktur. Kredi kartı zorunlu değildir.",
    pay: [
      "Nakit",
      "Banka kartı",
      "Kredi kartı, tercih ederseniz kullanılır",
    ],
    whyTitle: "Uzun dönem kiralama ne zaman uygun?",
    whyIntro: "Günlük kiralamayı uzatmak yerine baştan uzun süre seçmek şu durumlarda daha düzenli olur:",
    why: [
      "Şehirde birkaç hafta veya ay kalacaksanız.",
      "İş için sürekli araca ihtiyacınız varsa ve filo satın almak istemiyorsanız.",
      "Havalimanından alıp aynı ofise bırakacaksanız.",
      "Kart limitinin bloke edilmesini istemiyorsanız. Depozito nakit veya banka kartıyla da alınır.",
    ],
    diffTitle: "Süre ve kilometre",
    diffIntro:
      "Yol hakkı seçilen güne göre rezervasyon özetinde yazar. Sınırı aşan kilometre, teslimde bildirilen birim bedelle hesaplanır.",
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
      [
        "Uzun dönem kiralama nasıl başlar?",
        "Siteden tarih ve aracı seçebilirsiniz. Aylık ve daha uzun süreler için çağrı merkezi süreci netleştirir. Rezervasyon ücretsizdir, ön ödeme alınmaz.",
      ],
      [
        "Depozito uzun dönemde ne kadar?",
        "11 gün ve üzeri kiralamada depozito 20.000 TL'dir. Daha kısa sürelerde 1–3 gün 5.000 TL, 4–10 gün 10.000 TL uygulanır. Araç teslim edildiği gibi dönerse depozito iade edilir.",
      ],
      [
        "Aylık kilometre sınırı nedir?",
        "Aylık yol hakkı 3.800 km'dir. Günlük 300 km, 10 günde 2.200 km'dir. Aşan kilometre teslimde, önceden bildirilen birim bedelle hesaplanır.",
      ],
      [
        "Kredi kartı şart mı?",
        "Hayır. Ödeme teslimde nakit, banka kartı veya kredi kartıyla alınır. Findeks sorgusu yapılmaz.",
      ],
    ],
  },
  "kurumsal-arac-kiralama": {
    lead: "Şirketiniz için tek araç ya da birden fazla araç gerekiyorsa ZakCar kurumsal kiralama, aynı filoyu Sabiha Gökçen, İstanbul Havalimanı ve merkez ofisten teslim eder.",
    after: "Teklif çağrı merkezi veya WhatsApp üzerinden netleşir. Rezervasyon ücretsizdir, ön ödeme alınmaz. Ödeme araç tesliminde yapılır; kredi kartı ve Findeks zorunlu değildir.",
    facts: [
      ["Kim için", "Şirketler", "Tek araç veya birden fazla araç"],
      ["Teslim", "SAW, IGA, merkez", "Havalimanında 7/24"],
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
    payIntro:
      "Kira bedeli ve depozito teslimde alınır. Kart limiti bloke edilmez. Kredi kartı zorunlu değildir; nakit veya banka kartı da geçerlidir.",
    pay: [
      "Nakit",
      "Banka kartı",
      "Kredi kartı, sürücü tercih ederse",
    ],
    whyTitle: "Şirketler için ne işe yarar?",
    whyIntro: "Araç satın almak veya mevcut bir aracı havalimanına bırakmak yerine kiralama şu işleri sadeleştirir:",
    why: [
      "Misafir veya personel inişinde araç hazır olur. SAW ve IGA ofisleri 7/24 açıktır.",
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
      `Depozito süreye göredir: ${DEPOSIT}.`,
      "Araç teslim edildiği gibi dönerse depozito iade edilir.",
    ],
    extraTitle: "Aylık kurumsal kullanım",
    extra: [
      "Aylık ve daha uzun kiralamalarda süre, kilometre ve teslim ofisi çağrı merkeziyle netleştirilir. Adres teyidi için fatura veya benzeri bir belge istenir.",
      "Erken iade veya süre uzatmada ücret, kullanılan gün sayısına göre yeniden hesaplanır. Ayrıntı kiralama koşulları sayfasında yazılıdır.",
    ],
    faqTitle: "Sık sorulanlar",
    faq: [
      [
        "Şirket adına nasıl araç kiralanır?",
        "Araç sayısı, ofis ve tarihleri çağrı merkezine veya WhatsApp'a iletin. Sürücü teslimde sözleşmeyi imzalar. Rezervasyon ücretsizdir, ön ödeme yoktur.",
      ],
      [
        "Kredi kartı şirket kartı olmak zorunda mı?",
        "Hayır. Kredi kartı zorunlu değildir. Ödeme teslimde nakit, banka kartı veya kredi kartıyla alınır. Findeks sorgusu yapılmaz.",
      ],
      [
        "Depozito ne kadar?",
        `${DEPOSIT}'dir. Araç teslim edildiği gibi iade edilirse depozito geri verilir.`,
      ],
      [
        "Birden fazla personel aynı aracı kullanabilir mi?",
        "Yalnızca sözleşmede adı yazan sürücüler kullanabilir. Ek sürücü teslimde ehliyetini ibraz eder ve sözleşmeyi imzalar.",
      ],
    ],
  },
};

export function isServiceArticle(slug: string): slug is ServiceSlug {
  return slug in COPY;
}

export function ServiceArticle({ slug }: { slug: ServiceSlug }) {
  const page = COPY[slug];
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
        Telefon{" "}
        <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
        {" · "}
        WhatsApp{" "}
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
          {SITE.whatsappDisplay}
        </a>
        {" · "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        {" · "}
        <Link href="/kiralama-kosullari">Kiralama koşulları</Link>
        {" · "}
        <Link href="/arac-modelleri">Araçları incele</Link>
      </p>
    </article>
  );
}
