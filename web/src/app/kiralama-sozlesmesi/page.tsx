import Link from "next/link";
import { Content } from "@/components/content/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Kiralama Sözleşmesi",
  description: `${SITE.shortName} motorlu kara taşıtı kiralama sözleşmesi — taraflar, kullanım, ödeme, sigorta ve iade.`,
};

export default function Page() {
  return (
    <Content title="Kiralama Sözleşmesi">
      <p>
        İşbu metin, {SITE.name} (“{SITE.shortName}” veya “Kiralayan”) ile aracı teslim alan gerçek
        veya tüzel kişi (“Kiracı”) arasında, rezervasyonun tamamlanması ve aracın tesliminde
        imzalanan kiralama kontratıyla birlikte uygulanır. Teslim formu ve iade formu bu sözleşmenin
        ekidir.
      </p>

      <h2>Taraflar</h2>
      <p>
        Kiralayan: {SITE.name}. İletişim: {SITE.phone}, {SITE.email}. Teslim noktaları İstanbul
        Sabiha Gökçen Havalimanı (SAW), İstanbul Havalimanı (IGA) ve Sabiha Gökçen karşısındaki
        merkez ofistir.
      </p>
      <p>
        Kiracı: rezervasyonu kendi adına yapan ve aracı teslim alırken kimlik ile ehliyetini ibraz
        eden kişidir. Aracı kullanacak her sürücü teslim formunda adıyla yer alır ve kontratı
        imzalar.
      </p>

      <h2>Konu</h2>
      <p>
        Sözleşmenin konusu, rezervasyonda seçilen grupta bir aracın kararlaştırılan süre boyunca
        Kiracı’ya kullandırılması ve bunun karşılığında kira bedeli, depozito ve varsa ek
        hizmetlerin ödenmesidir. Marka ve model, müsaitliğe göre aynı grup içinden belirlenir.
      </p>

      <h2>Süre ve ücret</h2>
      <ul>
        <li>En kısa kiralama 24 saattir. Artan saatler bir kiralama günü sayılır.</li>
        <li>
          Günlük ücret, gün sayısıyla çarpılır. Ek sürücü, genç sürücü paketi, HGS, çocuk koltuğu
          ve kış lastiği ayrıca ve günlük olarak eklenir.
        </li>
        <li>Günlük yol hakkı 300 km’dir. Aşan kilometre, teslimde bildirilen birim bedelle tahsil edilir.</li>
        <li>
          Ön ödeme yoktur. Kiralama bedeli araç tesliminde nakit veya banka kartıyla ödenir. Kredi
          kartı zorunlu değildir.
        </li>
        <li>
          Depozito araç grubuna göre teslimde alınır. Araç sorunsuz ve borcu kalmadan iade edilirse
          depozito iade edilir. Hasar, yakıt, ceza veya kilometre aşımı bu tutardan mahsup
          edilebilir.
        </li>
      </ul>

      <h2>Aracın kullanımı</h2>
      <ul>
        <li>Araç yalnızca Türkiye sınırları içinde ve karayolu trafik kurallarına uygun kullanılır.</li>
        <li>
          Sürücü en az 20 yaşında olmalı ve B sınıfı ehliyeti en az 2 yıldır taşımalıdır. Bu şartı
          karşılamayan sürücü için genç sürücü paketi gerekir. Teslim formunda adı olmayan kişi
          aracı kullanamaz; aksi halde kasko geçersiz olur.
        </li>
        <li>
          Araç yarış, çekme, kaçak veya ticari yolcu taşıma, alkol ya da uyuşturucu etkisinde
          kullanım ve aracın teknik yapısına uygun olmayan zeminde kullanılamaz.
        </li>
        <li>Kiracı, araçta izinsiz değişiklik yapamaz ve kullanım kılavuzuna uyar.</li>
        <li>
          Yakıt, otopark, HGS, otoyol ve köprü ücretleri ile trafik cezaları Kiracı’ya aittir. Kira
          bitse bile kira süresi içinde kesilen cezadan Kiracı sorumludur.
        </li>
        <li>
          Araç, teslim alındığı yakıt seviyesinde iade edilir. Eksik yakıt güncel pompa fiyatından
          tahsil edilir.
        </li>
      </ul>

      <h2>Sigorta ve hasar</h2>
      <p>
        Standart kasko ve 7/24 yol yardım kira bedeline dahildir. Kaza, çalınma, lastik veya arıza
        halinde araç yerinden oynatılmadan {SITE.phone} aranır. Alkol raporu, polis tutanağı veya
        maddi hasarlı kaza tespit tutanağı olmadan kasko işlemez. Kullanım hatası, lastik ve jant,
        alt takım, debriyaj ve dikkatsizlikten doğan zararlar kasko dışındadır ve Kiracı’ya aittir.
      </p>

      <h2>Teslim, iptal ve iade</h2>
      <ul>
        <li>SAW ve IGA ofisleri 7/24 teslim yapar. Merkez ofis saatleri ofis sayfasında yazılıdır.</li>
        <li>Rezervasyon, teslim saatine 24 saat kalaya kadar ücretsiz iptal edilebilir.</li>
        <li>
          Erken iadede ücret kullanılan gün sayısına göre yeniden hesaplanır. Süre uzatma çağrı
          merkezi onayıyla ve geçerli tarifeden yapılır.
        </li>
        <li>
          Kiracı aracı zamanında getirmezse veya haber vermeden gecikirse ek gün bedeli tahsil
          edilebilir. No-show’da araç yaklaşık 1 saat bekletilir; 2 saatte rezervasyon iptal
          olabilir.
        </li>
      </ul>

      <h2>Kişisel veriler</h2>
      <p>
        Kimlik, ehliyet, iletişim ve rezervasyon bilgileri sözleşmenin kurulması ve ifası,
        teslim güvenliği ve yasal yükümlülükler için işlenir. Ayrıntı{" "}
        <Link href="/kisisel-verilerin-korunmasi">KVKK Aydınlatma Metni</Link> ve{" "}
        <Link href="/kiralama-kosullari">Kiralama Koşulları</Link> sayfalarındadır.
      </p>
    </Content>
  );
}
