export const SITE = {
  name: "ZakCar Rent A Car",
  shortName: "ZakCar",
  phone: "+90 532 388 2996",
  phoneTel: "+905323882996",
  email: "info@zakrentacar.com",
  address: "Yenişehir Mahallesi, Osmanlı Bulvarı, No:10 Çağdaş Center A Blok 50, 34890 Pendik/İstanbul",
  whatsapp: "908503077384",
  whatsappDisplay: "+90 850 307 7384",
  facebook: "https://www.facebook.com/profile.php?id=61590545227699",
  instagram: "https://www.instagram.com/zakcarrentall/",
  logo: "/assets/zakcar/logo-header.png",
  logoMark: "/assets/zakcar/logo-mark.png",
} as const;

export const GOOGLE_PLACE = {
  name: "Zakcar Rent A Car Sabiha Gökçen Kredi Kartsız Araç Kiralama",
  embed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2865.2425875497747!2d29.30660047585398!3d40.929070771361594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cadb32455f8f33%3A0x98a36f6d17aa5a03!2sZakcar%20Rent%20A%20Car%20Sabiha%20G%C3%B6k%C3%A7en%20Kredi%20Karts%C4%B1z%20Ara%C3%A7%20Kiralama!5e1!3m2!1str!2str!4v1794137959082!5m2!1str!2str",
  href: "https://www.google.com/maps/place/Zakcar+Rent+A+Car+Sabiha+G%C3%B6k%C3%A7en+Kredi+Karts%C4%B1z+Ara%C3%A7+Kiralama/@40.9290708,29.3091754,17z/data=!3m1!4b1!4m6!3m5!1s0x14cadb32455f8f33:0x98a36f6d17aa5a03!8m2!3d40.9290708!4d29.3091754!16s%2Fg%2F11w3l590r8",
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
    { href: "/findeks-sorgusuz-arac-kiralama", label: "Findeks Sorgusuz" },
    { href: "/uzun-donem-arac-kiralama", label: "Uzun Dönem" },
    { href: "/kurumsal-arac-kiralama", label: "Kurumsal" },
  ],
  airports: [
    { href: "/sabiha-gokcen-havalimani-arac-kiralama", labelKey: "loc.saw.menu" },
    { href: "/istanbul-3-havalimani-arac-kiralama", labelKey: "loc.iga.menu" },
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
