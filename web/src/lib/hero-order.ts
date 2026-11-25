export const STOCK_HERO = [
  {
    id: "m1",
    title: "Sabiha Gökçen'de 7/24 teslim",
    sub: "Uçağınız iner inmez aracınız hazır. SAW ofisimiz gece gündüz açık.",
  },
  {
    id: "m2",
    title: "İstanbul Havalimanı'nda hızlı teslim",
    sub: "IST ofisimizle terminal çıkışında bekletmeden kiralayın.",
  },
  {
    id: "m3",
    title: "Kredi kartı olmadan araç kiralayın",
    sub: "Nakit veya banka kartıyla rezervasyon. Esnek depozito seçenekleri.",
  },
  {
    id: "m4",
    title: "İlk kiralamanızda %10 indirim",
    sub: "Standart ve SUV grubunda geçerli. Hemen rezervasyon yapın.",
  },
  {
    id: "m5",
    title: "ZakCar Merkez Ofis'te şehir teslimi",
    sub: "Sabiha Gökçen karşısında, şehir içi alışverişe en yakın teslim noktası.",
  },
] as const;

const STOCK_IDS = STOCK_HERO.map((item) => item.id);

export function heroSlideOrder(customIds: string[], saved: string[]): string[] {
  const known = new Set<string>([...STOCK_IDS, ...customIds]);
  const next: string[] = [];
  const seen = new Set<string>();
  for (const id of saved) {
    if (!known.has(id) || seen.has(id)) continue;
    seen.add(id);
    next.push(id);
  }
  for (const id of [...STOCK_IDS, ...customIds]) {
    if (seen.has(id)) continue;
    seen.add(id);
    next.push(id);
  }
  return next;
}
