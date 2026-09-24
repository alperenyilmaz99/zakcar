import Link from "next/link";
import { Content } from "@/components/content/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Gizlilik Politikası",
  description: `${SITE.shortName} gizlilik politikası — kişisel bilgilerin toplanması, kullanımı ve korunması.`,
};

export default function Page() {
  return (
    <Content title="Gizlilik Politikası">
      <h2>Amaç</h2>
      <p>
        {SITE.name} olarak gizlilik konusunu ciddiye alıyoruz ve kişisel bilgilerinizin (birey
        olarak kimliğinizi tanımlayan bilgiler) nasıl toplandığı, kullanıldığı ve açıklandığı
        hakkında bilgi sahibi olmanızı istiyoruz.
      </p>
      <p>
        İşbu {SITE.shortName} Web Sitesi (zakcar.com) Gizlilik Politikası (“Gizlilik Politikası”),
        site üzerinden toplayabileceğimiz kişisel bilgiler ile bağlantılı uygulamalarımızı
        açıklamaktadır. İşbu Gizlilik Politikası, bilgilerin site dışında herhangi bir yolla
        toplanmasını, kullanılmasını veya açıklanmasını ele almamaktadır.
      </p>
      <p>
        Bize kişisel bilgilerinizi sağlayarak ve bu sitenin sunduğu hizmetleri kullanarak, işbu
        Gizlilik Politikasının şartlarını ve koşullarını kabul etmiş ve aşağıdaki bilgilerin
        edinilmesine ve/veya kullanılmasına onay vermiş olursunuz:
      </p>
      <ul>
        <li>Kişisel bilgiler</li>
        <li>IP bilgileri ve konum verileri</li>
      </ul>
      <p>
        İşbu Gizlilik Politikasını değiştirme hakkımızı saklı tutarız. Gizlilik Politikamızda
        yapılacak olası değişiklikler, revize edilmiş metnin site üzerinde yayınlanmasıyla birlikte
        geçerlilik kazanır. Bu değişikliklerin ardından site kullanımı, o tarihte yürürlükte olan
        revize edilmiş Gizlilik Politikasını kabul ettiğiniz anlamına gelir.
      </p>

      <h2>Ne Tür Bilgiler Topluyoruz?</h2>
      <p>
        {SITE.shortName} ve üçüncü taraf hizmet sağlayıcılar, siteyi kullandığınız esnada çeşitli
        aşamalarda sizden bilgi toplayabilir ve bu bilgileri işleyebilir.
      </p>
      <p>
        <strong>Bize sağladığınız bilgiler:</strong> Ad soyad, açık posta adresi, telefon numarası,
        e-posta adresi bilgileri bulunmaktadır.
      </p>
      <p>
        <strong>Konum verileri:</strong> Siteyi kullandığınızda coğrafi konumunuzla ilgili bilgiler
        elde edebiliriz. Gerektiği zaman konuma dayalı ürünler ve hizmetler sağlamak amacıyla
        konum verilerinizi kullanabiliriz.
      </p>

      <h2>Teknik Bilgiler</h2>
      <p>
        Bu bilgiler IP adresiniz, oturum açma bilgileriniz, tarayıcı türü ve sürümü, saat dilimi
        ayarları, işletim sistemi ve platformunu içerebilir.
      </p>

      <h2>Kişisel Olmayan Bilgiler</h2>
      <p>
        Siteye gelen veya siteden çıkan URL bilgileri (tarih ve saat dahil); görüntülediğiniz veya
        aradığınız hizmetler; sayfa yanıt süreleri, indirme hataları, belirli sayfalara yapılan
        ziyaretlerin uzunluğu, sayfa etkileşim bilgileri ve sayfadan ayrılmak için kullanılan
        yöntemler de dahil olmak üzere siteyi kullanımınız ile ilgili birleştirilmiş bilgilerdir.
      </p>

      <h2>Sizden Toplanan Bilgileri Nasıl Kullanırız?</h2>
      <ul>
        <li>
          Taleplerinizi yerine getirmek için (Türkiye Cumhuriyeti mevzuatı kapsamında gerekli
          bildirimler, haber ve güncelleme bilgileri göndermek ve sorularınızı cevaplamak dahil)
        </li>
        <li>Geribildirim almak için (örneğin anket yoluyla)</li>
        <li>
          Size site ile ilgili önemli bilgileri, şartlarımız, koşullarımız ve politikalarımızdaki
          değişiklikleri ve/veya diğer idari bilgileri göndermek için
        </li>
        <li>
          Yasaların ve sizin izin verdiğiniz durumlarda ürünlerimiz, hizmetlerimiz, özel
          tekliflerimiz ve promosyonlarımız hakkında sizi tercih ettiğiniz iletişim yoluyla (e-posta,
          SMS, WhatsApp vb.) bilgilendirmek için
        </li>
        <li>
          Veri analizleri, denetimler, yeni ürünlerin geliştirilmesi, web sitemizin ve
          hizmetlerimizin iyileştirilmesi, kullanım trendlerinin belirlenmesi gibi kurum içi iş
          amaçlarımız için
        </li>
      </ul>

      <h2>Kişisel Bilgilerin Açıklanması</h2>
      <p>Kişisel bilgileri aşağıdaki şekillerde açıklayabiliriz:</p>
      <ul>
        <li>
          Sitemizin geliştirilmesi ve optimize edilmesinde bize destek veren analitik ve arama
          motoru sağlayıcılarına
        </li>
        <li>
          İşimiz veya varlıklarımızın yeniden organizasyonu, birleşmesi, satışı veya temliki
          halinde ilgili üçüncü taraflara
        </li>
        <li>
          Geçerli yasalar kapsamında, hukuki işlemlere uymak, kamu ve devlet otoritelerinden gelen
          taleplere cevap vermek, şartlarımızı uygulamak, operasyonlarımızı korumak ve haklarımızı
          savunmak için
        </li>
      </ul>
      <p>
        Kişisel bilgilerinizin güvenli bir biçimde ve işbu Gizlilik Politikası uyarınca muamele
        görmesini sağlamak için gerekli adımları makul seviyede atacağız.
      </p>

      <h2>Üçüncü Taraf Siteleri</h2>
      <p>
        İşbu Gizlilik Politikası, sitede bağlantı verilen diğer siteleri işleten üçüncü tarafların
        gizlilik uygulamalarını ele almamaktadır ve bu hususlardan sorumlu değiliz. Site üzerinde
        bir bağlantıya yer verilmesi, bağlantı verilen sitenin tarafımızca onaylandığı anlamına
        gelmez.
      </p>

      <h2>Vazgeçme</h2>
      <p>
        Pazarlamayla ilgili e-postalar almak istemezseniz, bu hususta sağlanan araçları kullanarak
        vazgeçebilirsiniz. Talebinizi mümkün olduğunca erken yerine getirmek için elimizden geleni
        yapacağız.
      </p>

      <h2>Saklama Süresi</h2>
      <p>
        Yasaların daha uzun bir saklama süresi talep etmediği veya izin vermediği takdirde, kişisel
        bilgilerinizi işbu Gizlilik Politikasında belirtilen amaçları gerçekleştirmek doğrultusunda
        gerekli olan süre boyunca saklayacağız.
      </p>

      <h2>Yargı Alanı</h2>
      <p>
        Siteye erişmeyi tercih edenler bunu kendi iradeleriyle ve olası riskleri üstlenerek
        yaparlar ve tüm yerel yasalara uymaktan sorumludurlar. Siteyi kullanarak ve kişisel
        bilgilerinizi paylaşarak, kişisel bilgilerin ikamet ettiğiniz ülkeden farklı seviyede veri
        güvenliği sağlayabilecek ülkelere aktarılmasına onay vermiş olursunuz.
      </p>

      <h2>İletişim</h2>
      <p>
        Bu Gizlilik Politikası ile ilgili sorularınız için{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> adresinden veya{" "}
        <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a> numaralı hattımızdan
        bizimle iletişime geçebilirsiniz.
      </p>
      <p>
        Verilerin işlenmesi hakkında aydınlatma metnine{" "}
        <Link href="/kisisel-verilerin-korunmasi">Kişisel Verilerin Korunması</Link> sayfasından
        ulaşabilirsiniz.
      </p>
    </Content>
  );
}
