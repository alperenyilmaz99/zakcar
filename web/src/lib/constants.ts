export const SITE = {
  name: "ZakCar Rent A Car",
  shortName: "ZakCar",
  phone: "+90 532 388 2996",
  phoneTel: "+905323882996",
  email: "info@zakcar.com",
  address: "İstanbul Sabiha Gökçen Havalimanı (SAW), Pendik / İstanbul",
  whatsapp: "908503077384",
  whatsappDisplay: "+90 850 307 7384",
  logo: "/assets/zakcar/logo-wordmark.png",
  logoMark: "/assets/zakcar/logo-mark.png",
} as const;

export const NAV = {
  top: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/ofisler", label: "Ofisler" },
    { href: "/iletisim", label: "İletişim" },
  ],
  vehicles: [
    { href: "/4x4-suv-arac-kiralama", label: "SUV" },
    { href: "/7-10-kisilik-arac-kiralama", label: "7-10 Kişilik" },
    { href: "/ekonomik-arac-kiralama", label: "Ekonomik" },
    { href: "/luks-arac-kiralama", label: "Lüks" },
  ],
  services: [
    { href: "/kredi-kartsiz-arac-kiralama", label: "Kredi Kartsız" },
    { href: "/uzun-donem-arac-kiralama", label: "Uzun Dönem" },
    { href: "/kurumsal-arac-kiralama", label: "Kurumsal" },
  ],
  airports: [
    { href: "/sabiha-gokcen-havalimani-arac-kiralama", labelKey: "loc.saw" },
    { href: "/istanbul-3-havalimani-arac-kiralama", labelKey: "loc.iga" },
    { href: "/esenboga-havalimani-arac-kiralama", labelKey: "loc.esenboga" },
    { href: "/antalya-havalimani-arac-kiralama", labelKey: "loc.antalya" },
    { href: "/adnan-menderes-havalimani-arac-kiralama", labelKey: "loc.izmir" },
  ],
  cities: [
    { href: "/istanbul-3-havalimani-arac-kiralama", labelKey: "loc.iga.city" },
    { href: "/sabiha-gokcen-havalimani-arac-kiralama", labelKey: "loc.saw" },
    { href: "/ofisler#merkez", labelKey: "loc.merkez" },
  ],
  main: [
    { href: "/arac-modelleri", label: "Araç Modelleri" },
    { href: "/rezervasyon-sorgulama", label: "Rezervasyon Sorgula" },
    { href: "/blog", label: "Blog" },
  ],
} as const;

export const FEATURES = [
  {
    title: "Kredi kartsız, Findeks sorgusuz",
    desc: "Kredi kartı ve Findeks sorgusu olmadan araç kiralayın.",
  },
  {
    title: "7/24 Çağrı Merkezi",
    desc: "Sorunlarınız için her zaman bir destek ekibi yanınızda.",
  },
  {
    title: "Her şey dahil fiyatlar",
    desc: "Araç başında sürpriz ek ücret yok. Görünen fiyat, ödeyeceğiniz fiyattır.",
  },
  {
    title: "Ücretsiz rezervasyon",
    desc: "Ön ödeme yok. Ödemeyi araç tesliminde yapın.",
  },
] as const;
