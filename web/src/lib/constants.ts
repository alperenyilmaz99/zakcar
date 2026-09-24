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
    { href: "/sabiha-gokcen-havalimani-arac-kiralama", label: "Sabiha Gökçen" },
    { href: "/istanbul-3-havalimani-arac-kiralama", label: "İstanbul" },
    { href: "/esenboga-havalimani-arac-kiralama", label: "Esenboğa" },
    { href: "/antalya-havalimani-arac-kiralama", label: "Antalya" },
    { href: "/adnan-menderes-havalimani-arac-kiralama", label: "Adnan Menderes" },
  ],
  cities: [
    { href: "/istanbul-arac-kiralama", label: "İstanbul" },
    { href: "/izmir-arac-kiralama", label: "İzmir" },
    { href: "/antalya-arac-kiralama", label: "Antalya" },
    { href: "/ankara-arac-kiralama", label: "Ankara" },
    { href: "/kayseri-arac-kiralama", label: "Kayseri" },
  ],
  main: [
    { href: "/arac-modelleri", label: "Araç Modelleri" },
    { href: "/rezervasyon-sorgulama", label: "Rezervasyon Sorgula" },
    { href: "/blog", label: "Blog" },
  ],
} as const;

export const FEATURES = [
  {
    title: "Uygun Fiyat Garantisi",
    desc: "Standart kasko, KDV ve havalimanı teslim ücreti fiyatlara dahildir.",
  },
  {
    title: "7/24 Müşteri Hizmetleri",
    desc: "Sorunlarınız için her zaman bir destek ekibi yanınızda.",
  },
  {
    title: "Tecrübe & Güven",
    desc: "Uzun yıllara dayanan tecrübemiz ve güvenilir hizmet anlayışımız.",
  },
] as const;
