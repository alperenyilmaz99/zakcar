import Link from "next/link";
import { SITE } from "@/lib/constants";
import { DISTRICTS, districtLocative, relatedDistricts, type District } from "@/lib/districts";

const DEPOSIT = "1–3 gün 5.000 TL, 4–10 gün 10.000 TL, 11 gün ve üzeri 20.000 TL";

export function DistrictArticle({ district }: { district: District }) {
  const pickupName = district.pickup === "saw" ? "Sabiha Gökçen" : "İstanbul Havalimanı";
  const otherName = district.pickup === "saw" ? "İstanbul Havalimanı" : "Sabiha Gökçen";
  const sideName = district.side === "anadolu" ? "Anadolu" : "Avrupa";
  const otherSide = district.side === "anadolu" ? "Avrupa" : "Anadolu";
  const pickupHref =
    district.pickup === "saw"
      ? "/sabiha-gokcen-havalimani-arac-kiralama"
      : "/istanbul-3-havalimani-arac-kiralama";
  const place = districtLocative(district.name);
  const related = relatedDistricts(district);

  return (
    <article className="legal-content mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-ink-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_strong]:font-semibold [&_strong]:text-ink">
      <p>
        {district.name} araç kiralama, aracı {sideName} yakasında kullanacaklar için{" "}
        {pickupName} teslimiyle başlar. ZakCar bu noktada kredi kartı ve Findeks zorunluluğu
        olmadan kiralar; rezervasyon ücretsizdir, ödeme araç tesliminde alınır.
      </p>
      <p>{district.area}</p>

      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Teslim", pickupName, `${sideName} yakası, 7/24`],
          ["Ödeme", "Kredi kartsız", "Nakit, banka kartı veya kredi kartı"],
          ["Depozito", "Süreye göre", "5.000 · 10.000 · 20.000 TL"],
          ["Yol hakkı", "Güne göre", "300 km/gün, 10 gün 2.200, ay 3.800"],
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-surface-border bg-white px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
            <dd className="mt-1 font-semibold text-ink">{value}</dd>
            <dd className="text-sm">{note}</dd>
          </div>
        ))}
      </dl>

      <h2>{district.name} için aracı nereden alırsınız?</h2>
      <p>
        {district.name} {sideName} yakasındadır. Online alış noktası olarak {pickupName} aynı
        yakadadır; {otherName} ise {otherSide} yakasında kalır ve Boğaz geçişi gerektirir. İniş
        saatinizi bildirirseniz terminal çıkışında karşılama buna göre ayarlanır. Havalimanı teslimi
        ücretsizdir.
      </p>
      <p>
        Ayrıntı için{" "}
        <Link href={pickupHref}>{pickupName} araç kiralama</Link> sayfasına bakın. Pendik’teki
        merkez ofis de Sabiha Gökçen çevresindedir. Adrese teslim, 10 km üzeri mesafelerde ek ücret
        çıkar; bunu rezervasyondan önce telefon veya WhatsApp ile netleştirin.
      </p>
      <p>{district.around}</p>

      <h2>{place} araç kullanmak</h2>
      <p>{district.drive}</p>
      <p>
        Köprü, Avrasya Tüneli ve otoyol geçişleri ücretlidir. Araçlarda HGS vardır; kiralama
        süresine ait geçişler size yansır. Hafta içi sabah ve akşam ana akslar yavaşlar. Uçuş veya
        randevu varsa rotayı haritadan, o saatin trafiğiyle kontrol edin.
      </p>

      <h2>Ödeme, depozito ve kilometre</h2>
      <p>
        Rezervasyon siteden ücretsiz yapılır, ön ödeme alınmaz. Kredi kartı zorunlu değildir. Ödeme
        teslimde nakit, banka kartı veya kredi kartıyla yapılır.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Depozito kira bedelinden ayrıdır: {DEPOSIT}.</li>
        <li>Araç teslim edildiği gibi dönerse depozito iade edilir.</li>
        <li>Yol hakkı günlük 300 km, 10 günde 2.200 km, aylık 3.800 km’dir. Süre uzadıkça aylık hak esas alınır.</li>
        <li>Genelde 20 yaş ve 2 yıllık ehliyet aranır. Şart araca göre değişir. Sınırın altı için genç sürücü paketi günlük 335 TL’dir.</li>
      </ul>
      <p>
        Kredi kartsız kiralamanın tamamı{" "}
        <Link href="/kredi-kartsiz-arac-kiralama">kredi kartsız araç kiralama</Link> sayfasında,
        uzun süre için{" "}
        <Link href="/uzun-donem-arac-kiralama">uzun dönem araç kiralama</Link> sayfasında yazılıdır.
      </p>

      <h2>Yakın semtler</h2>
      <ul className="list-disc space-y-2 pl-5">
        {related.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.name} araç kiralama</Link>
          </li>
        ))}
        <li>
          <Link href="/istanbul-arac-kiralama">İstanbul araç kiralama</Link>
        </li>
      </ul>

      <h2>{district.name} araç kiralama — sık sorulanlar</h2>
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-ink">{place} aracı nerede teslim alırım?</p>
          <p className="mt-1">
            {pickupName} terminal çıkışında. Ofis 7/24 açıktır, havalimanı teslimi ücretsizdir.
            Diğer havalimanını seçerseniz {otherSide} yakasına geçmeniz gerekir.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">Kredi kartı olmadan kiralanır mı?</p>
          <p className="mt-1">
            Evet. Findeks sorgusu yapılmaz. Ödeme teslimde nakit, banka kartı veya kredi kartıyla
            alınır. Rezervasyon ücretsizdir.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">Depozito ve kilometre ne kadar?</p>
          <p className="mt-1">
            {DEPOSIT}. Yol hakkı seçilen güne göre hesaplanır: günlük 300 km, 10 gün 2.200 km, aylık
            3.800 km.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">{district.name} için hangi havalimanı daha uygun?</p>
          <p className="mt-1">
            Semt {sideName} yakasında olduğu için {pickupName} köprü olmadan bağlanır. Uçuşunuz{" "}
            {otherName} tarafına iniyorsa aracı oradan almanız da mümkündür.
          </p>
        </div>
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
        <Link href="/ofisler">Ofisler</Link>
        {" · "}
        <Link href="/arac-modelleri">Araçları incele</Link>
      </p>
    </article>
  );
}

export function IstanbulDistrictIndex() {
  const europe = DISTRICTS.filter((item) => item.side === "avrupa");
  const anatolia = DISTRICTS.filter((item) => item.side === "anadolu");
  return (
    <article className="legal-content mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-ink-muted [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink">
      <p>
        İstanbul araç kiralama, kalacağınız yakaya göre iki teslim noktasından biriyle başlar:
        Anadolu yakasında Sabiha Gökçen, Avrupa yakasında İstanbul Havalimanı. İkisinde de ofis
        7/24 açıktır ve havalimanı teslimi ücretsizdir.
      </p>
      <p>
        ZakCar kredi kartı ve Findeks zorunluluğu olmadan kiralar. Rezervasyon ücretsizdir, ödeme
        araç tesliminde alınır. Aşağıdaki semt sayfaları, o semte hangi havalimanının uyduğunu ve
        sokakta aracı nasıl kullanacağınızı anlatır.
      </p>
      <h2>Avrupa yakası</h2>
      <ul className="list-disc space-y-2 pl-5">
        {europe.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.name} araç kiralama</Link>
          </li>
        ))}
      </ul>
      <h2>Anadolu yakası</h2>
      <ul className="list-disc space-y-2 pl-5">
        {anatolia.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.name} araç kiralama</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
