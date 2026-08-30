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

## Vercel

Root Directory: **`web`**

Production build komutu (varsayılan): `npm run build`
