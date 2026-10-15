# ZakCar Web

Next.js 15 · TypeScript · Tailwind CSS · App Router

## Geliştirme

```bash
npm install
npm run dev
```

## Build pipeline

```
pages/*.html  ──data──►  src/data/vehicles.json
assets/       ──sync──►  public/assets/
                          └──►  next build  ──►  Vercel
```

## Sayfa yapısı

| Route | Açıklama |
|-------|----------|
| `/` | Ana sayfa |
| `/arac-modelleri` | Araç kataloğu |
| `/arac/[slug]` | Araç detay (89 SSG) |
| `/[slug]` | SEO landing (şehir, marka, grup…) |
| `/rezervasyon` | Rezervasyon formu |

## Rezervasyon servisi

Halka açık katalog JSON’dan gelir. Kiralama, müsaitlik ve personel yazma işlemleri Supabase’tedir.

SQL Editor sırası:

1. `supabase/schema.sql`
2. `supabase/grants.sql`
3. `supabase/seed-fleet.sql`
4. `supabase/promo-covers.sql`
5. `supabase/booking.sql`

`booking.sql` rezervasyon oluşturma, PNR + telefon sorgusu, model müsaitliği ve bakım sonrası filo durumunu kurar. Anon anahtar yeter; yazma `security definer` fonksiyonlarla yapılır.

Müşteri üyeliği Supabase Auth kullanır. Personel paneli ayrıdır ve `staff_profiles` kaydı ister. Panelden kiralama durumu (teslim / iade / iptal), yakıt, kilometre, bakım ve konum güncellenir.

## Vercel

Root Directory: **`web`**

Production build komutu (varsayılan): `npm run build`
