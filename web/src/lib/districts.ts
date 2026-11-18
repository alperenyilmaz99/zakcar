export type DistrictSide = "avrupa" | "anadolu";

export type District = {
  slug: string;
  name: string;
  side: DistrictSide;
  pickup: "saw" | "iga";
  area: string;
  around: string;
  drive: string;
};

export const DISTRICTS: District[] = [
  {
    slug: "etiler-arac-kiralama",
    name: "Etiler",
    side: "avrupa",
    pickup: "iga",
    area: "Etiler, Beşiktaş’ın Nispetiye ve Akatlar sırtlarında, üniversite ve konut dokusunun iç içe olduğu bir semttir.",
    around: "Akmerkez, Nispetiye Caddesi ve Ulus–Bebek hattı Etiler’den kısa sürüşle ulaşılır. Boğaz’a inen yollar yokuşludur; toplantı veya ziyaret saatine pay bırakmak gerekir.",
    drive: "Site içi sokaklar dardır ve cadde kenarı yer akşam saatlerinde dolar. Aracı otoparka bırakıp Nispetiye tarafını yürümek daha rahattır.",
  },
  {
    slug: "levent-arac-kiralama",
    name: "Levent",
    side: "avrupa",
    pickup: "iga",
    area: "Levent, Büyükdere Caddesi üzerindeki kuleler ve metro hattıyla Avrupa yakasının iş aksındadır.",
    around: "4. Levent ve Levent metro durakları, Zincirlikuyu ve Maslak aynı hat üzerindedir. Gün içinde birden fazla plaza gezilecekse araç, aktarma süresini kısaltır.",
    drive: "Hafta içi sabah Büyükdere Caddesi ve çevre yollar yoğunlaşır. Kule otoparkları cadde kenarından daha öngörülebilir bir bırakma noktasıdır.",
  },
  {
    slug: "maslak-arac-kiralama",
    name: "Maslak",
    side: "avrupa",
    pickup: "iga",
    area: "Maslak, Sarıyer sınırında toplanan plazalar ve orman yoluna açılan iş bölgesidir.",
    around: "Levent’ten Maslak’a Büyükdere aksı, İstinye ve Ayazağa’ya ise yan yollar çıkar. İstanbul Havalimanı ile aynı yakadadır; köprüye girmeden ulaşılır.",
    drive: "Mesai başlangıcı ve çıkışında ana cadde yavaşlar. Plaza otoparkını önceden sormak, teslim saatini kaçırmamak için işe yarar.",
  },
  {
    slug: "nisantasi-arac-kiralama",
    name: "Nişantaşı",
    side: "avrupa",
    pickup: "iga",
    area: "Nişantaşı, Teşvikiye ve Maçka arasındaki çarşı, otel ve konut semtidir.",
    around: "Abdi İpekçi, Teşvikiye Camii çevresi ve Maçka yokuşu yürüyüş mesafesindedir. Harbiye ve Osmanbey de aynı çıkışlardan bağlanır.",
    drive: "Sokaklar tek yön ve dardır; cadde kenarında uzun süre yer aramak programı uzatır. Yakın otoparka bırakıp çarşıyı yürümek daha kolaydır.",
  },
  {
    slug: "bebek-arac-kiralama",
    name: "Bebek",
    side: "avrupa",
    pickup: "iga",
    area: "Bebek, Beşiktaş’ta Boğaz’a inen koy ve çevresindeki yokuşlu konut sokaklarından oluşur.",
    around: "Etiler’den Bebek yokuşu, sahilden ise Arnavutköy ve Rumelihisarı hatları kullanılır. Sahil yolu hafta sonu öğleden sonra ağırlaşır.",
    drive: "Koy çevresinde park yeri sınırlıdır. Aracı üst kottaki otoparka bırakıp sahile inmek, hem dönüşü hem de tek yön sokakları kolaylaştırır.",
  },
  {
    slug: "florya-arac-kiralama",
    name: "Florya",
    side: "avrupa",
    pickup: "iga",
    area: "Florya, Bakırköy sahilinde, Marmara kıyısı ve konut mahallelerinin bir arada olduğu semttir.",
    around: "Yeşilköy, Ataköy ve Bakırköy merkez aynı sahil aksındadır. Avrupa yakasında kaldığı için İstanbul Havalimanı köprü gerektirmez; Sabiha Gökçen diğer yakadadır.",
    drive: "Sahil yolu yaz aylarında ve hafta sonu kalabalıklaşır. Uçuş saati varsa rotayı sahil yerine iç yoldan kurmak daha öngörülebilir olur.",
  },
  {
    slug: "gokturk-arac-kiralama",
    name: "Göktürk",
    side: "avrupa",
    pickup: "iga",
    area: "Göktürk, Eyüpsultan’da Kemerburgaz yolu üzerindeki konut bölgesidir ve İstanbul Havalimanı’na Avrupa yakasının kuzeyinden bağlanır.",
    around: "Kemerburgaz ormanı, Göktürk çarşısı ve havalimanı yolu aynı çıkışlardan ayrılır. Alış noktası olarak İstanbul Havalimanı, bu semt için köprüsüz seçenektir.",
    drive: "Site girişleri kontrollüdür; teslim veya ziyaret için site adını ve kapısını önceden netleştirmek gerekir. Akşam havalimanı yönü araç yoğunluğu artabilir.",
  },
  {
    slug: "beyoglu-arac-kiralama",
    name: "Beyoğlu",
    side: "avrupa",
    pickup: "iga",
    area: "Beyoğlu, Taksim, Galata ve Karaköy’ü içine alan, sokaklarının önemli kısmı yayalara ayrılmış merkez semtidir.",
    around: "İstiklal Caddesi yürüyüş yoludur. Galata Kulesi, Karaköy ve Tophane çevresine araçla yaklaşıp otoparka bırakmak gerekir.",
    drive: "Tek yönler ve yayalaştırılmış akslar yüzünden semtin içinden geçmek yerine çevredeki otoparklardan birini kullanmak daha sağlıklıdır.",
  },
  {
    slug: "besiktas-arac-kiralama",
    name: "Beşiktaş",
    side: "avrupa",
    pickup: "iga",
    area: "Beşiktaş, sahil, çarşı ve Barbaros Bulvarı’nın birleştiği Avrupa yakası merkezidir.",
    around: "Dolmabahçe, Ortaköy ve Zincirlikuyu aynı ilçenin farklı uçlarıdır. Gün içinde hem sahil hem plaza varsa araç, vapur ve metro aktarmasını azaltır.",
    drive: "Çarşı ve iskele çevresinde park zordur. Barbaros Bulvarı hafta içi akşam yukarı yönde yavaşlar; uçuş dönüşünde bu aksa pay bırakın.",
  },
  {
    slug: "sisli-arac-kiralama",
    name: "Şişli",
    side: "avrupa",
    pickup: "iga",
    area: "Şişli, Mecidiyeköy, Osmanbey ve Bomonti’yi kapsayan iş, hastane ve çarşı ilçesidir.",
    around: "Büyükdere Caddesi Şişli’den Levent’e çıkar. Nişantaşı ve Harbiye de aynı ilçe sınırının içindedir.",
    drive: "Mecidiyeköy kavşağı günün her saatinde dolabilir. Hastane veya plaza randevusunda otopark katını ve çıkış kapısını önceden öğrenmek işe yarar.",
  },
  {
    slug: "bakirkoy-arac-kiralama",
    name: "Bakırköy",
    side: "avrupa",
    pickup: "iga",
    area: "Bakırköy, Marmara sahilinde çarşı, hastane ve Ataköy–Florya hattının toplandığı ilçedir.",
    around: "Capacity, sahil yolu ve Ataköy marina çevresi kısa sürüşle bağlanır. İstanbul Havalimanı aynı yakadadır; Sabiha Gökçen için Boğaz geçişi gerekir.",
    drive: "Sahil ve çarşı içi saatler yoğundur. Alışveriş veya hastane için site ve AVM otoparkları cadde kenarından daha net bir seçenektir.",
  },
  {
    slug: "sariyer-arac-kiralama",
    name: "Sarıyer",
    side: "avrupa",
    pickup: "iga",
    area: "Sarıyer, İstinye’den Rumeli Feneri’ne uzanan Boğaz’ın Avrupa kıyısı ve Belgrad Ormanı’nın kapısıdır.",
    around: "İstinye, Tarabya, Yeniköy ve Zekeriyaköy aynı ilçededir. Maslak ve Göktürk de kuzey aksından ayrılır. Alış için İstanbul Havalimanı aynı yakadadır.",
    drive: "Sahil yolu hafta sonu öğleden sonra ağır ilerler. Orman ve kuzey mahallelerde site yolları dardır; dönüşte sahil yerine iç yolu kontrol etmek faydalı olur.",
  },
  {
    slug: "caddebostan-arac-kiralama",
    name: "Caddebostan",
    side: "anadolu",
    pickup: "saw",
    area: "Caddebostan, Kadıköy’de Bağdat Caddesi ile Marmara sahilinin kesiştiği semttir.",
    around: "Suadiye, Erenköy ve Caddebostan sahili aynı hat üzerindedir. Anadolu yakasında olduğu için Sabiha Gökçen köprü olmadan ulaşılır.",
    drive: "Bağdat Caddesi akşam ve hafta sonu yavaşlar. Sahilde yer sınırlıdır; aracı yan sokak veya otoparka bırakıp caddeyi yürümek daha rahattır.",
  },
  {
    slug: "suadiye-arac-kiralama",
    name: "Suadiye",
    side: "anadolu",
    pickup: "saw",
    area: "Suadiye, Bağdat Caddesi üzerinde, Caddebostan ile Bostancı arasındaki sahil semtidir.",
    around: "Çarşı, sahil ve Bağdat Caddesi iç içedir. Kozyatağı ve Bostancı kısa sürüşle bağlanır. Teslim noktası olarak Sabiha Gökçen aynı yakadadır.",
    drive: "Cadde tek yönlü akış ve yoğun yaya nedeniyle yavaştır. Sahil parkına inerken aracı üst kotta bırakmak dönüşü kolaylaştırır.",
  },
  {
    slug: "bati-atasehir-arac-kiralama",
    name: "Batı Ataşehir",
    side: "anadolu",
    pickup: "saw",
    area: "Batı Ataşehir, Ataşehir’in plaza, finans ofisi ve konut bloklarının toplandığı kısmıdır.",
    around: "Kozyatağı, İçerenköy ve Ataşehir merkez aynı ilçenin içinde kalır. Toplantı günü aracı Sabiha Gökçen’den almak, Avrupa yakasına köprüyle geçmeden iş bölgesine çıkar.",
    drive: "Mesai saatlerinde ana bulvar ve site çıkışları dolar. Plaza otoparkı için misafir kaydı gerekebilir; bunu randevudan önce sorun.",
  },
  {
    slug: "acarkent-arac-kiralama",
    name: "Acarkent",
    side: "anadolu",
    pickup: "saw",
    area: "Acarkent, Beykoz’da orman içindeki konut bölgesidir ve Anadolu yakasının kuzeyindedir.",
    around: "Kavacık, Beykoz çarşı ve TEM bağlantısı Acarkent çıkışlarından ayrılır. Sabiha Gökçen aynı yakadadır; mesafe kuzeye doğru uzar, köprü gerekmez.",
    drive: "Site yolları eğimlidir ve girişler kontrollüdür. Kapı adını ve plaka bildirimini teslim öncesi netleştirin. Akşam orman yolu aydınlatması ana caddeye göre daha seyrektir.",
  },
  {
    slug: "kandilli-arac-kiralama",
    name: "Kandilli",
    side: "anadolu",
    pickup: "saw",
    area: "Kandilli, Üsküdar–Beykoz sırtında Boğaz’a bakan yokuşlu bir semttir.",
    around: "Çengelköy, Vaniköy ve Kuzguncuk sahil hattı Kandilli’nin alt kotundadır. Anadolu yakasında kaldığı için alış noktası Sabiha Gökçen’dir.",
    drive: "Sokaklar dar ve eğimlidir; büyük aracı site kapısına kadar sürmek zor olabilir. Üst yoldaki otoparktan yürümek daha sorunsuzdur.",
  },
  {
    slug: "pendik-arac-kiralama",
    name: "Pendik",
    side: "anadolu",
    pickup: "saw",
    area: "Pendik, Sabiha Gökçen’in bulunduğu ilçedir. Sahil, Kaynarca ve kurtköy aksı aynı sınırın içindedir.",
    around: "Havalimanı, merkez ofis ve Pendik sahil kısa mesafe içindedir. Uçuş bu havalimanına iniyorsa aracı aynı ilçede teslim almak Boğaz geçişini baştan çıkarır.",
    drive: "Havalimanı çevre yolu uçuş saatlerinde yoğunlaşır. Sahil ve çarşı için ayrı süre bırakın; iadeyi de SAW’a yapacaksanız terminale erken çıkın.",
  },
  {
    slug: "kurtkoy-arac-kiralama",
    name: "Kurtköy",
    side: "anadolu",
    pickup: "saw",
    area: "Kurtköy, Pendik’te Sabiha Gökçen’in hemen çevresindeki konut ve iş bölgesidir.",
    around: "Havalimanı kapıları, TEM bağlantısı ve Yenişehir’deki merkez ofis Kurtköy çıkışlarına yakındır. Günlük iş veya uçuş için en kısa teslim noktası SAW’dır.",
    drive: "Havalimanı geliş-gidiş saatlerinde çevre yollar yavaşlar. Site tesliminde blok ve kapı bilgisini önceden yazın.",
  },
  {
    slug: "kadikoy-arac-kiralama",
    name: "Kadıköy",
    side: "anadolu",
    pickup: "saw",
    area: "Kadıköy, çarşı, Moda ve iskeleyi bir araya getiren Anadolu yakası merkezidir.",
    around: "Moda sahili, Bahariye ve rıhtım yürüyüşle gezilir. Bostancı, Caddebostan ve Kozyatağı araçla bağlanır. Sabiha Gökçen aynı yakadadır.",
    drive: "Çarşı ve Moda sokakları araçla dolaşmak için uygun değildir. Aracı otoparka bırakıp çarşıyı yürümek hem zaman hem ceza riskini azaltır.",
  },
  {
    slug: "uskudar-arac-kiralama",
    name: "Üsküdar",
    side: "anadolu",
    pickup: "saw",
    area: "Üsküdar, Boğaz’ın Anadolu girişindeki sahil, çarşı ve Marmaray durağının olduğu ilçedir.",
    around: "Kız Kulesi manzarası, Kuzguncuk, Beylerbeyi ve Altunizade aynı ilçededir. Avrupa yakasına geçilecekse köprü veya Avrasya Tüneli bu sahilden sonra gelir.",
    drive: "Sahil ve iskele çevresi süreli parktadır. Altunizade tarafındaki otoparklar çarşı içine göre daha rahattır. Köprüye çıkacaksanız HGS araçtadır; geçiş ücreti kiralama sonunda size yansır.",
  },
  {
    slug: "maltepe-arac-kiralama",
    name: "Maltepe",
    side: "anadolu",
    pickup: "saw",
    area: "Maltepe, Kartal ile Kadıköy arasında, sahil parkı ve konut mahallelerinin uzandığı ilçedir.",
    around: "İdealtepe, Cevizli ve sahil bandı aynı hat üzerindedir. Sabiha Gökçen Anadolu yakasında olduğu için köprü gerekmez.",
    drive: "Sahil yolu akşam saatlerinde dolar. D-100 iç aksı sahile göre daha öngörülebilir olabilir; uçuş dönüşünde haritadan ikisini birden bakın.",
  },
  {
    slug: "kartal-arac-kiralama",
    name: "Kartal",
    side: "anadolu",
    pickup: "saw",
    area: "Kartal, Maltepe ile Pendik arasında, sahil ve tepedeki mahalleleriyle Anadolu yakasının güney ilçesidir.",
    around: "Dragos, sahil ve hastane bölgesi ilçe içinden bağlanır. Sabiha Gökçen Pendik sınırında, Kartal’a komşudur.",
    drive: "Sahil ve merkez çarşıda park sınırlıdır. Tepedeki mahallelerde eğim vardır. İade SAW’daysa sahil yerine havalimanı yolunu ayrıca kontrol edin.",
  },
];

const BY_SLUG = new Map(DISTRICTS.map((item) => [item.slug, item]));

export function districtBySlug(slug: string): District | undefined {
  return BY_SLUG.get(slug);
}

export function districtSlugs(): string[] {
  return DISTRICTS.map((item) => item.slug);
}

const LOCATIVE: Record<string, string> = {
  Etiler: "Etiler'de",
  Levent: "Levent'te",
  Maslak: "Maslak'ta",
  Nişantaşı: "Nişantaşı'nda",
  Bebek: "Bebek'te",
  Florya: "Florya'da",
  Göktürk: "Göktürk'te",
  Beyoğlu: "Beyoğlu'nda",
  Beşiktaş: "Beşiktaş'ta",
  Şişli: "Şişli'de",
  Bakırköy: "Bakırköy'de",
  Sarıyer: "Sarıyer'de",
  Caddebostan: "Caddebostan'da",
  Suadiye: "Suadiye'de",
  "Batı Ataşehir": "Batı Ataşehir'de",
  Acarkent: "Acarkent'te",
  Kandilli: "Kandilli'de",
  Pendik: "Pendik'te",
  Kurtköy: "Kurtköy'de",
  Kadıköy: "Kadıköy'de",
  Üsküdar: "Üsküdar'da",
  Maltepe: "Maltepe'de",
  Kartal: "Kartal'da",
};

export function districtLocative(name: string): string {
  return LOCATIVE[name] ?? name;
}

export function relatedDistricts(district: District, all: District[] = DISTRICTS): District[] {
  return all.filter((item) => item.slug !== district.slug && item.side === district.side).slice(0, 6);
}
