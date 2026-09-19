import { Content } from "@/components/content/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Kiralama Koşulları",
  description: `${SITE.shortName} araç kiralama koşulları — sürücü, teslimat, sigorta, ödeme ve iptal kuralları.`,
};

export default function Page() {
  return (
    <Content title="Kiralama Koşulları">
      <h2>Sürücü Bilgisi</h2>
      <p>
        Sitemizden rezervasyon aşamasında araç detayları sayfasında belirtilen sürücü yaşı ve
        ehliyet yılı şartlarına uygun kişiler sürücü olarak tanımlanabilir. Sürücü ve ek
        sürücülerden araç teslimi esnasında ehliyet ibrazı ve kiralama kontratını imzalamaları
        istenir. Kiralama kontratında belirtilmeyen kişilerin aracı kullanmaları halinde meydana
        gelebilecek hasarlarda kasko ve sigorta geçersiz kalır.
      </p>

      <h2>Kiralama Süresi</h2>
      <p>
        En az kiralama süresi 24 saat (1 gün) dir. Aylık veya daha uzun vadeli kiralamalar için
        lütfen çağrı merkezimizi {SITE.phone} arayınız.
      </p>
      <p>Olası gecikmeler durumunda:</p>
      <ul>
        <li>Olası gecikme durumlarında çağrı merkezimize bilgi vermeniz gerekmektedir.</li>
        <li>
          2 saati aşan gecikmelerde veya gecikmenin zamanında haber verilmediği durumlarda geçerli
          gün araç kira bedeli tahsil edilir.
        </li>
      </ul>

      <h2>Yakıt</h2>
      <p>
        Araçlarımız genellikle boş depo teslim edilip alınır veya teslim edildiği kadarıyla iade
        alınır. Bu uygulamamız müşterilerimizi olası yanlış hesaplara karşı korumak amacıyla
        uygulanır.
      </p>

      <h2>Araç Teslimi</h2>
      <p>
        <strong>Teslim alma:</strong> Araç teslimi rezervasyon formunuzda belirtilen lokasyonda
        yapılır.
      </p>
      <p>
        <strong>Havalimanı:</strong> Havalimanı teslimlerinde havalimanı otoparkı kullanılır ve
        teslimat personeli ile iletişim kurularak yapılır. Teslim saatinden önce mail adresinize ve
        telefonunuza aracın hazır olduğu konum ve personel iletişim bilgisi gönderilir. İniş
        saatiniz vermiş olduğunuz uçuş numarasına göre takip edilir. Bagaj alma süresi göz önünde
        bulundurularak havalimanında hazır beklenir. Yoğunluk durumuna göre aracınız, rezervasyonda
        belirtilen iniş saati itibariyle otoparkta hazır bulundurulur ve teslim işlemleri otoparkta
        yapılır. Otopark ücreti {SITE.shortName} tarafından ödenir.
      </p>
      <p>
        <strong>Adresten teslim alma ve adrese teslim etme:</strong> Aracınızı belirli bir adresten
        teslim almak istediğinizde en yakın şubemize olan uzaklık 10 km’den fazla olduğu durumda
        ekstra teslim ücreti uygulanır. Bu ücretin belirlenmesi için çağrı merkezimiz sizinle
        e-posta veya telefon ile iletişime geçecektir.
      </p>
      <p>
        <strong>Otogar:</strong> Otobüs terminallerinde şubemiz bulunmadığı için otogar mevkiine
        olan uzaklık hesaplanarak teslim ücreti hesaplanabilir.
      </p>

      <h2>Sigortalar ve Güvenceler</h2>
      <p>
        Sigorta detayları kiralama sözleşmesinde ve internet sitemizde açık olarak belirtilmiştir.
        Sigorta uygulaması, kiraladığınız mevkii ve araca göre farklılıklar gösterebileceği için
        rezervasyon aşamasında, rezervasyon onay belgeniz veya kiralama sözleşmesinde belirtilen
        maddeler geçerlidir.
      </p>
      <ul>
        <li>
          <strong>Full Kasko (Tam Kasko):</strong> Araçlarımız kaza, çarpma, çalınma gibi durumlara
          karşı tam sigorta kapsamındadır. Diğer durumlar için Mini Hasar Paketi seçeneklerini
          gözden geçiriniz.
        </li>
        <li>
          <strong>Mini Hasar Paketi:</strong> Lastik yırtılması, cam kırılması, far kırılması gibi
          polis raporu tutulamayan durumlarda sizi koruma altına alır. Mini Hasar paketinin dahil
          olup olmadığı ve detayları rezervasyon aşamasında belirtildiği gibidir.
        </li>
        <li>
          <strong>Ferdi Kaza Sigortası:</strong> Sürücü ve araç içindeki kişileri sigorta limitleri
          dâhilinde güvence altına alan bir sigortadır.
        </li>
        <li>
          <strong>İhtiyari Mali Mesuliyet Sigortası:</strong> Zorunlu mali mesuliyet (trafik)
          sigortasına ilave üçüncü şahıslara karşı belirlenmiş limitler çerçevesindeki zararları
          kapsayan sigortadır.
        </li>
      </ul>

      <h2>Trafik Cezaları</h2>
      <p>
        Araç plakasına yazılmış radar, otoyol ve köprü kaçak geçiş vb. cezaları ilgili kurum
        tarafından tarafımıza bildirilir. Belirli tarih ve saatte cezanın size ait olduğu
        anlaşılması durumunda tarafınıza ilgili belge e-posta ile iletilir. Ödemenizi bu belgede
        belirtilen süre içerisinde yapmanız talep edilir veya kredi kartınızdan tahsil yoluna
        gidilir. Ceza tutarının ödenmemesi durumunda kiralama sözleşmeniz, kimlik bilgileriniz ve
        ceza tebligatı ile birlikte anlaşmalı hukuk bürolarına devredilerek yasal takip işlemi
        adınıza başlatılır.
      </p>

      <h2>Kilometre Kullanım Sınırları</h2>
      <p>
        Araçlarımız adil kilometre kullanım prensibine göre kullanılır. Kilometre kullanımı için
        asıl detaylar rezervasyon aşamasında “fiyata dahil olanlar” başlığı altında net olarak
        belirtilmiştir. Daha fazla kullanımlar için çağrı merkezimiz ile iletişime geçerek bilgi
        alabilirsiniz. Kilometre aşım ücreti rezervasyon sırasında belirtilen tutara göre
        hesaplanır.
      </p>

      <h2>Ödeme Koşulları ve Güvenlik</h2>
      <p>
        Araç kira ücreti, ek ürün ve hizmet ücretleriyle birlikte teminat tutarı kira başlangıcında
        kiracının şahsına ait kredi kartından veya nakit olarak peşin olarak tahsil edilmektedir.
        Kiralama sonunda oluşabilecek ücret farklılığına göre kredi kartından tahsil veya iade
        gerçekleştirilmektedir. Kiracının şubemizde bizzat bulunması gerekmekte ve ek sürücü veya
        farklı kişiye ait kredi kartı kabul edilmemektedir.
      </p>
      <p>
        <strong>Teminat ücreti:</strong> Araç kira ücreti dışında bazı durumlarda teminat
        (depozito) istenebilir. Araç gruplarına göre rezervasyon adımlarında belirtilen teminat
        tutarları kiralama başlangıcında kiracının şahsi kredi kartından tahsil edilir. Aracın size
        teslim edildiği gibi geri alınması durumunda bu tutar tamamen iade edilir.
      </p>
      <p>
        <strong>Güvenlik:</strong> Rezervasyonunuzu daha güvenli yapabilmeniz için zakcar.com SSL
        güvenlik sertifikası kullanmaktadır.
      </p>

      <h2>Rezervasyon, Sözleşme ve Değişiklik</h2>
      <p>
        <strong>Web sitemizden veya çağrı merkezimiz üzerinden yapılan rezervasyonlar:</strong>{" "}
        Rezervasyonunuz onaylandıktan sonra ve geliş tarihinizden önce araç grubu, rezervasyon
        tarihini değiştirebilir, ek ürün ekleyebilir ve çıkarabilirsiniz. Bazı değişiklikler fiyat
        farklılıklarına neden olabilir. Alış şube değişikliği yapılmak istenmesi durumunda mevcut
        rezervasyonun iptal edilip yeni bir rezervasyon yapılması gerekmektedir.
      </p>
      <p>
        <strong>Kiralama erken iade:</strong> Kiralamanın başlamasının ardından aracın rezervasyon
        tarihleri aralığından önce iade edilmesi durumunda fiyat, aracın kullanılacağı gün sayısına
        göre tekrar hesaplanır. Anlaşmanın iptali ve aracın boşta kalmasından dolayı 3 günlük bedel
        düşülerek geri kalan tutar iade edilir.
      </p>
      <p>
        <strong>Kiralama uzatma:</strong> Daha uzun süre kiralama talebinde sistem tarafından fiyat
        tekrar hesaplandıktan sonra oluşacak ilave ücret, kiralama başlangıcında ibraz edilen ödeme
        yöntemi ile tahsil edilir.
      </p>
      <p>
        <strong>No-Show uygulaması:</strong> Rezervasyonda belirtilen teslim alma saatinde veya
        verdiğiniz uçuş numarasının kontrolü sonrası uçağınızın iniş saatinden sonra aracın teslim
        alınmaması durumunda, araç 1 saat bekletildikten sonra No-show durumuna geçer ve hiçbir
        gruptan araç garanti edilemez. No-show durumundaki rezervasyonunuz 2 saatin sonunda iptal
        olur.
      </p>
      <p>
        <strong>İptal ve iade:</strong> Rezervasyonunuzu teslim alma saatinize 24 saat kalaya kadar
        ücretsiz olarak iptal edebilirsiniz. Gerekçe belirtmeksizin yapılan iptallerin tekrarı
        durumunda müşteri kaydınız sistemimizde olumsuz müşteri portföyüne alınabilir. Ön ödeme
        online kredi kartı ile yapılmış ise iptal işlemiyle birlikte banka üzerinden iade işlemi
        yapılır; genellikle 3 iş günü içerisinde ilgili karta iade edilir. Yurt dışına para iadesi
        istenmesi durumunda banka ve finans kuruluşlarının talep ettiği EFT, havale ve muhabir
        banka ücretleri iade bedelinden düşülür.
      </p>

      <h2>Diğer Önemli Hususlar</h2>
      <ul>
        <li>
          Kiralamaya ait tüm ücretler, kiracının şahsına ait finansal kurumlar aracılığı ile tahsil
          edilir. Sanal kart ve debit kart geçerli değildir.
        </li>
        <li>
          Herhangi bir hasar durumunda sigortanızın geçerli olabilmesi için acil yardım hattına
          ihbarda bulunmanız ve aracınızı kaza yerinden hareket ettirmeden Trafik Polisi ya da
          Trafik Jandarma ekiplerine haber vermeniz ve “Polis Raporu ile birlikte Alkol Raporu”
          almanız gerekmektedir. Maddi hasarlı trafik kazalarında taraflar anlaştığı takdirde
          “Maddi Hasarlı Kaza Tespit Tutanağı” da düzenlenebilir.
        </li>
        <li>
          Aracın çalınması durumunda polis aranarak “Hırsızlık Tespit Tutanağı” alınmalıdır.
          Alınan raporla birlikte aracın anahtarı tarafımıza teslim edilmelidir.
        </li>
        <li>
          Kaza, çalınma, arıza, lastik patlaması ve her türlü acil yardım ihtiyacında 7/24{" "}
          {SITE.phone} numaralı hattımızı arayabilirsiniz.
        </li>
        <li>
          Yurtdışına çıkış: Hiçbir sigortamız Türkiye sınırları dışında geçerli değildir; araçlarımızın
          Türkiye sınırları dışına çıkarılması yasaktır.
        </li>
        <li>
          Araç kiralama rezervasyonunuz araç grubuna konfirme edilmiştir; herhangi bir marka ve/veya
          model garantisi verilmemektedir.
        </li>
        <li>
          Kiralayan; sağlam ve iyi durumda teslim aldığı araçta kullanım hatası ve/veya
          dikkatsizlik, tedbirsizlik vb. nedenlerle oluşan mekanik ve elektrik dahil tüm zarar ve
          ziyanları ödemeyi kabul eder. Bu zararlar kasko ve güvenceler kapsamı dışındadır.
        </li>
        <li>
          Kış lastiği opsiyonu ek ürün olarak sunulmakta ve ücrete tabi bir hizmettir; stoklarla
          sınırlıdır.
        </li>
        <li>
          Aylık kiralama esnasında adres teyidinizi gösterir fatura vb. bir belgenin ibrazı
          gerekmektedir.
        </li>
      </ul>
    </Content>
  );
}
