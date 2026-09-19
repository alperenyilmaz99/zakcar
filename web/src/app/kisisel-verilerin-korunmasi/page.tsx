import Link from "next/link";
import { Content } from "@/components/content/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Kişisel Verilerin Korunması",
  description: `${SITE.shortName} KVKK aydınlatma metni — kişisel verilerin işlenmesi ve haklarınız.`,
};

export default function Page() {
  return (
    <Content title="Kişisel Verilerin Korunması">
      <h2>Kişisel Verilerin Korunması ve İşlenmesi Hakkında Aydınlatma Metni</h2>
      <p>
        İşbu bilgilendirmenin amacı, {SITE.name} (“{SITE.shortName}”) tarafından yönetilmekte olan
        zakcar.com internet sitesi (“Portal”) kullanımı sırasında elde edilen ve/veya üçüncü
        kişilerden alınan kişisel verilerin kullanımına ilişkin olarak 6698 sayılı Kişisel
        Verilerin Korunması Kanunu’nun 10. maddesi ile getirilen aydınlatma yükümlülüğünün yerine
        getirilmesidir. Ayrıca kullanıcıların Portal kullanımı ile ilgili olarak {SITE.shortName}{" "}
        tarafından toplanan kişisel verilerin toplanma şekilleri, işlenme amaçları, hukuki
        nedenleri ve hakları konularında şeffaf bilgilendirme yapılmasıdır.
      </p>
      <p>
        Kısa dönemlik veya uzun dönem araç kiralamalarında potansiyel müşterilere güncel bir ortam
        sunulmuştur. Bu faaliyet içerisinde işbu bilgilendirme metninde belirtildiği şekilde
        kişisel veriler, {SITE.shortName} fonksiyonlarının kullanılabilmesinin gereği olarak
        işlenebilmektedir.
      </p>
      <p>
        {SITE.shortName}, kişisel verilerin hukuka uygun olarak toplanması, saklanması ve
        paylaşılmasını sağlamak ve gizliliğini korumak amacıyla mümkün olan en üst seviyede
        güvenlik tedbirlerini almaktadır.
      </p>
      <p>
        {SITE.shortName}, işbu bilgilendirme hükümlerini dilediği zaman Portal üzerinden yayımlamak
        suretiyle güncelleyebilir. Yapılan güncelleme ve değişiklikler Portal’da yayınlandığı
        tarihten itibaren geçerli olacaktır.
      </p>

      <h2>A — Veri Sorumlusu</h2>
      <p>
        Kişisel Verilerin Korunması Kanunu uyarınca kişisel verileriniz; veri sorumlusu olarak{" "}
        {SITE.shortName} tarafından aşağıda açıklanan kapsamda toplanacak ve işlenebilecektir.
      </p>
      <p>
        <strong>Adres:</strong> {SITE.address}
        <br />
        <strong>E-posta:</strong> {SITE.email}
        <br />
        <strong>Telefon:</strong> {SITE.phone}
      </p>

      <h2>B — Toplanan Kişisel Veriler</h2>
      <p>
        {SITE.shortName}, aşağıda belirtilen yöntemlerle kullanıcılardan çeşitli sabit ve değişken
        veriler toplamaktadır. Toplanan veriler, kullanılan hizmetlere ve özelliklere bağlıdır.
      </p>
      <ul>
        <li>
          <strong>Ad ve iletişim bilgileri:</strong> Ad, soyadı, telefon, adres, e-posta, fatura
          bilgileri, T.C. kimlik numarası, kimlik / pasaport / sürücü belgesi örneği ve benzeri
          belgeler
        </li>
        <li>
          <strong>Kimlik doğrulama bilgileri:</strong> Üyelik bilgileri, kullanıcı adı, rezervasyon
          numaraları, kontak bilgileri
        </li>
        <li>
          <strong>Demografik veriler:</strong> Doğum tarihi, yaş, cinsiyet, tercih edilen dil ve
          para birimi
        </li>
        <li>
          <strong>Kullanım verileri:</strong> Çağrı merkezi ses kayıtları, website kullanım
          bilgileri, rezervasyon verileri, anket verileri ve hata raporları
        </li>
        <li>
          <strong>Konum verileri:</strong> GPS, IP ve ilgili teknolojilerden çıkarılan konum
          bilgileri (izin verilmesi halinde)
        </li>
        <li>
          <strong>Ödeme verileri:</strong> Fatura ve ödeme bilgileri, fatura tutarı ve tarihleri,
          dekont örnekleri
        </li>
        <li>
          <strong>Anket cevapları:</strong> Memnuniyet ve geribildirim anketlerine verilen cevaplar
        </li>
      </ul>
      <p>
        Elde ettiğimiz kişisel verileriniz yurtiçinde veya yurtdışında {SITE.shortName}’ın ya da
        işbirliği içinde bulunduğu hizmet sağlayıcıların tesislerinde depolanabilir ve işbu
        bilgilendirmedeki amaçlar doğrultusunda işlenebilir.
      </p>

      <h2>C — Kişisel Verilerin Hangi Amaçla İşleneceği</h2>
      <p>
        Kişisel verileriniz, 6698 sayılı Kanun’da düzenlenen ilkeler ve işleme şartları uyarınca
        özellikle şu amaçlarla işlenebilir: iletişim, kullanıcı kayıt, satış sonrası süreçler, iş
        geliştirme, tahsilat, müşteri portföy yönetimi, şikayet yönetimi, müşteri memnuniyeti,
        faturalandırma, operasyonel faaliyetler, hizmet kalitesinin ölçülmesi, denetim, müşteri
        doğrulama, dolandırıcılığın tespiti ve önlenmesi, pazarlama (izin verilen hallerde) ve yasal
        yükümlülüklerin yerine getirilmesi.
      </p>
      <p>
        {SITE.shortName}, elde ettiği kişisel verileri hizmetten en iyi şekilde faydalanabilmeniz
        için işlendikleri amaç için gerekli olan süre kadar muhafaza eder. Ayrıca uyuşmazlık
        durumunda ilgili zamanaşımı süreleri boyunca saklayabilir.
      </p>

      <h2>Ç — İşlenen Kişisel Verilerin Aktarılması</h2>
      <p>
        {SITE.shortName}, kişisel verilerinizi hizmetleri ifa etmek, kullanıcı deneyimini
        geliştirmek, güvenliği sağlamak, dolandırıcılığı önlemek ve operasyonel süreçleri yürütmek
        amacıyla dış kaynak hizmet sağlayıcılar, hukuk büroları, çağrı merkezleri, ödeme
        kuruluşları, danışmanlık şirketleri ve yasal zorunluluklar kapsamında yetkili kurum,
        kuruluş ve merciler ile paylaşabilir.
      </p>
      <p>
        Cihazınıza yerleştirilen çerezler aracılığıyla elde edilen kişisel verileriniz de işbu
        bilgilendirmede belirtilen kapsam ve amaçlarla paylaşılabilecektir. Veriler yurt içinde
        üçüncü kişilere aktarılabileceği gibi yurt dışına da aktarılabilir.
      </p>

      <h2>D — Toplama Yöntemi ve Hukuki Sebep</h2>
      <ul>
        <li>
          <strong>Doğrudan verdiğiniz veriler:</strong> Rezervasyon ve hizmet kullanımı sırasında
          kendi inisiyatifinizle sağladığınız ad-soyad, iletişim, kimlik ve benzeri bilgiler
        </li>
        <li>
          <strong>Platform kullanımı sırasında elde edilen veriler:</strong> Kullanım alışkanlıkları,
          konum ve benzeri teknik veriler
        </li>
      </ul>
      <p>
        {SITE.shortName}, site kullanımına ilişkin çerezler aracılığıyla yeniden pazarlama ve
        analitik işlemleri yapabilir. Toplanan veriler 6698 sayılı Kanun’un 5. ve 6. maddelerinde
        belirtilen işleme şartları kapsamında işlenebilir.
      </p>
      <p>Hukuki dayanaklar:</p>
      <ul>
        <li>Sözleşmenin ifası, hakkın tesisi ve korunması</li>
        <li>
          Elektronik ticaret, maliye/vergi, tüketicinin korunması ve sair konuları düzenleyen yasal
          düzenlemeler
        </li>
        <li>
          Özellikle dolandırıcılığı engellemek başta olmak üzere hizmetleri yürütebilmek için gerekli
          olan meşru menfaat
        </li>
      </ul>

      <h2>E — Veri Güvenliği</h2>
      <p>
        {SITE.shortName}, kişisel verileri güvenli bir şekilde korumayı taahhüt eder. Hukuka aykırı
        işlenmeyi ve erişimi engellemek ile muhafazayı sağlamak amacıyla uygun güvenlik düzeyini
        temin etmeye yönelik teknik ve idari tedbirler alınır.
      </p>
      <p>
        {SITE.shortName}, elde ettiği kişisel verileri işbu bilgilendirme ve 6698 sayılı Kanun
        hükümlerine aykırı olarak başkasına açıklamaz ve işleme amacı dışında kullanmaz. Portal
        üzerinden başka uygulamalara link verilmesi halinde, link verilen uygulamaların gizlilik
        politikalarından {SITE.shortName} sorumlu değildir.
      </p>

      <h2>F — Kişisel Veri Sahibinin Hakları</h2>
      <p>
        Haklarınıza ilişkin taleplerinizi {SITE.shortName}’a iletmeniz durumunda talep niteliğine
        göre en kısa sürede ve en geç otuz gün içinde ücretsiz olarak sonuçlandırılır. Bu kapsamda:
      </p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
        <li>
          İşlenmesini gerektiren sebeplerin ortadan kalkması halinde silinmesini veya yok edilmesini
          isteme
        </li>
        <li>
          Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize sonuç
          çıkmasına itiraz etme
        </li>
        <li>Kanuna aykırı işleme sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
      </ul>
      <p>
        Taleplerinizi Türkçe olarak; {SITE.address} adresine kimliğinizi tespit edici belgeler ile
        elden, noter kanalıyla veya{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> adresine kayıtlı elektronik posta olarak
        iletebilirsiniz. {SITE.shortName}’ın cevap vermeden önce kimliğinizi doğrulama hakkı saklıdır.
      </p>
      <p>Başvurunuzda bulunması zorunlu bilgiler:</p>
      <ol>
        <li>Adınız, soyadınız ve başvuru yazılı ise imzanız</li>
        <li>
          T.C. vatandaşları için T.C. kimlik numaranız; yabancı iseniz uyruğunuz, pasaport numaranız
          veya varsa kimlik numaranız
        </li>
        <li>Tebligata esas yerleşim yeri veya iş yeri adresiniz</li>
        <li>Varsa bildirime esas e-posta, telefon ve faks numaranız</li>
        <li>Talep konunuz</li>
      </ol>
      <p>
        Ayrıca <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link> sayfamızı da
        inceleyebilirsiniz.
      </p>
    </Content>
  );
}
