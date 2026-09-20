-- ZakCar panel seed — SQL Editor'da çalıştırın
-- Model + filo + örnek konum

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'audi-a6',
  'Audi A6',
  'Audi',
  'audi',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/audi-a6.png',
  '',
  'Günümüzde birçok insan birçok farklı ihtiyacı doğrultusunda araç kiralamaktadır. Keza Audi A6 ülkemizde çok sevilen bir araç modeli olduğu için Audi A6 kiralama oranları da oldukça fazladır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'bmw-116d',
  'BMW 116D',
  'Bmw',
  'bmw',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/bmw-116d.png',
  '',
  'Ülkemizde birçok farklı statüdeki insan, birçok farklı aracı, birçok farklı amaç doğrultusunda kiralamaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'bmw-320',
  'BMW 3.20',
  'Bmw',
  'bmw',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/bmw-320.png',
  '',
  'Ülkemizde birçok farklı amaç doğrultusunda birçok farklı araç kiralanmaktadır. Araç kiralama hususunda oldukça fazla ihtiyaç bulunmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'bmw-520',
  'BMW 5.20',
  'Bmw',
  'bmw',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/bmw-520.png',
  '',
  'Ülkemizde birçok farklı amaç doğrultusunda lüks araç kiralaması yapılmaktadır. Bu kategoriden bir araç kiralamayı düşündüğünüzde, seçeneklerin çok fazla olduğu görebilirsiniz.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'chery-tiggo-7',
  'Chery Tiggo 7',
  'Chery',
  'chery',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/chery-tiggo-7.png',
  '',
  'Günümüzde birçok farklı amaç doğrultusunda araç kiralama yapılmaktadır. Bu kapsamda Elitcar olarak filomuz oldukça geniş bir ihtiyaç ve zevk yelpazesine hitap edecek kadar çok yönlüdür.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'chery-tiggo-8',
  'Chery Tiggo 8',
  'Chery',
  'chery',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/chery-tiggo-8.png',
  '',
  'Elitcar''daki geniş elektrikli otomobil filomuz ile her ihtiyacı ve tercihi karşılamaya inanıyoruz.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-berlingo',
  'Citroen Berlingo',
  'Citroen',
  'citroen',
  'Ekonomik',
  'Dizel',
  'Otomatik',
  '5',
  1369,
  15540,
  '/assets/images/vehicles/png/citroen-berlingo.png',
  '',
  'Günümüzde birçok farklı amaç doğrultusunda, birçok farklı segmentten araç kiralanmaktadır. Ülkemizde ise en fazla kiralanan araç segmentinden bir tanesi de ticari araçlardır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-c-elysee',
  'Citroen C-Elysee',
  'Citroen',
  'citroen',
  'Ekonomik',
  'Dizel',
  'Manuel',
  '5',
  962,
  15540,
  '/assets/images/vehicles/png/citroen-c-elysee.png',
  '',
  'Günümüz dünyasında trafikte araç kullanmak herkes için bir ihtiyaç haline gelmiştir. Bu hususta araç kiralama da oldukça yaygınlaşmıştır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-c3-aircross',
  'Citroen C3 Aircross',
  'Citroen',
  'citroen',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/citroen-c3-aircross.png',
  '',
  'Günümüzde birçok farklı amaç doğrultusunda, her sosyal statüden insanımız araç kiralamaktadır. Her türlü ihtiyacı ve tercihi karşılayan devasa filomuzda araç çeşitliliği bulunmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-c3',
  'Citroen C3',
  'Citroen',
  'citroen',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/citroen-c3-aircross.png',
  '',
  'Günümüzde birçok farklı amaçlar doğrultusunda araç kiralama yapılmaktadır. Kiralama konusunda ise insanlar ikiye ayrılabilir.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-c4',
  'Citroen C4',
  'Citroen',
  'citroen',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/citroen-c4.png',
  '',
  'Günümüzde birçok ülkede birçok farklı şekillerde araç kiralama yapılmaktadır. Genel olarak online araç kiralama oldukça popüler hale gelmiştir.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-c4x',
  'Citroen C4X',
  'Citroen',
  'citroen',
  'SUV',
  'Benzin',
  'Otomatik',
  '5',
  1258,
  18500,
  '/assets/images/vehicles/png/citroen-c4x.png',
  '',
  'Günümüzde birçok farklı amaçlarda, farklı araç kiralama yapılır. Nitekim araç kiralama birçok farklı ihtiyaç doğrultusunda yapılabilir.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-c5-aircross',
  'Citroen C5 Aircross',
  'Citroen',
  'citroen',
  'SUV',
  'Dizel',
  'Otomatik',
  '5',
  1739,
  18500,
  '/assets/images/vehicles/png/citroen-c5-aircross.png',
  '',
  'Tesisimizde, araç kiralama hizmetleri için bize gelen müşterilerimiz için sayısız çok yönlü ihtiyaca hizmet edecek kadar iyi premium seçeneklere sahip olduğumuzdan emin oluyoruz.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-jumper',
  'Citroen Jumper',
  'Citroen',
  'citroen',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/citroen-jumper.png',
  '',
  'Günümüzde pek çok kişi ve işletme, her ihtiyaca uygun araç seçenekleri sunduğu için araç kiralamayı tercih ediyor.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'citroen-jumpy-8-1',
  'Citroen Jumpy 8+1',
  'Citroen',
  'citroen',
  'Minibüs',
  'Dizel',
  'Otomatik',
  '8+1',
  3515,
  15540,
  '/assets/images/vehicles/png/citroen-jumpy-8-1.png',
  '',
  'Günümüzde birçok farklı sosyal statüden kişi, birçok farklı amaç doğrultusunda araç kiralama yapmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'dacia-duster',
  'Dacia Duster',
  'Dacia',
  'dacia',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/dacia-duster.png',
  '',
  'Günümüzde birçok farklı amaç doğrultusunda kısa ve uzun vadeli olarak araç kiralama yapılabilmektedir.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'dacia-jogger',
  'Dacia Jogger',
  'Dacia',
  'dacia',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/dacia-jogger.png',
  '',
  'Ülkemizde her gün, taşımacılık ve ulaşım ihtiyaçları doğrultusunda birçok farklı araç modeli kiralanmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'dacia-lodgy-laureate-5',
  'Dacia Lodgy Laureate 5',
  'Dacia',
  'dacia',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/dacia-lodgy-laureate-5.png',
  '',
  'Ülkemizde ticari araçlar oldukça popüler hale gelmiştir çünkü ülke olarak geniş araçları sevmekteyiz. Bu hususta bir Dacia Lodgy Laureate kiralayıp, içine adım attığınızda beş kişi de olsanız, en konforlu ve geniş iç mekanı fark edeceksiniz.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'dacia-lodgy-laureate-7-kisilik',
  'Dacia Lodgy Laureate 7 Kişilik',
  'Dacia',
  'dacia',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/dacia-lodgy-laureate-7-kisilik.png',
  '',
  'Günümüzde birçok farklı alanda, birçok farklı araç ülkemizin hemen hemen her yerinde kiralanmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'dacia-sandero-stepway',
  'Dacia Sandero Stepway',
  'Dacia',
  'dacia',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/dacia-sandero-stepway.png',
  '',
  'Günümüzde birçok farklı amaç doğrultusunda araç kiralama yapılmaktadır. Ülkemizde ise birçok farklı kiralık araç bulunmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'ds7',
  'DS7',
  'Ds7',
  'ds7',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/ds7.png',
  '',
  'Günümüzde birçok farklı ihtiyaçlar için araç kiralama yapılabilmektedir. Elitcar olarak bizler her yıl filomuzdaki araçları yenilemekteyiz.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-500',
  'Fiat 500',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-500.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-500-dolcevita',
  'Fiat 500 Dolcevita',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-500-dolcevita.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-500c',
  'Fiat 500C',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-500c.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-500l-cross-plus',
  'Fiat 500L Cross Plus',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-500l-cross-plus.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-500l-mirror',
  'Fiat 500L Mirror',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-500l-mirror.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-500l-wagon',
  'Fiat 500L Wagon',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-500l-wagon.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-500x-sport',
  'Fiat 500X Sport',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-500x-sport.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-doblo',
  'Fiat Doblo',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-doblo.png',
  '',
  'Ülkemizde birçok farklı ticari araç kiralanabiliyor. Bu araç modelleri ülkemizde küçük işletme ve esnaflar tarafından çok beğenilmektedir.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-doblo-panorama-dynamic',
  'Fiat Doblo Panorama Dynamic',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-doblo-panorama-dynamic.png',
  '',
  'Ülkemizde araç kiralama, bir araç satın almaya göre finansal açıdan daha mantıklı bir seçim olmaya başladı.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-fiorino',
  'Fiat Fiorino',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Dizel',
  'Manuel',
  '5',
  962,
  15540,
  '/assets/images/vehicles/png/fiat-fiorino.png',
  '',
  'Günümüzde birçok farklı amaç doğrultusunda ticari araç modelleri kiralanmaktadır. Ticari araç kiralayanların iki farklı ihtiyaçları oluyor.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-fiorino-panorama',
  'Fiat Fiorino Panorama',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Dizel',
  'Manuel',
  '5',
  962,
  15540,
  '/assets/images/vehicles/png/fiat-fiorino-panorama.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-panda-urban',
  'Fiat Panda Urban',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-panda-urban.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-yeni-egea-cross',
  'Fiat Yeni Egea Cross',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-yeni-egea-cross.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-yeni-egea-hatchback',
  'Fiat Yeni Egea Hatchback',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Dizel',
  'Manuel',
  '5',
  962,
  15540,
  '/assets/images/vehicles/png/fiat-yeni-egea-hatchback.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-yeni-egea-sedan',
  'Fiat Yeni Egea Sedan',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-yeni-egea-sedan.png',
  '',
  'Fiat Yeni Egea Sedan araç kiralama, son zamanlarda yoğun rağbet gören hizmetler arasında ilk sıralarda yer alır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'fiat-yeni-egea-station-wagon',
  'Fiat Yeni Egea Station Wagon',
  'Fiat',
  'fiat',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/fiat-yeni-egea-station-wagon.png',
  '',
  ''
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'ford-focus',
  'Ford Focus',
  'Ford',
  'ford',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/ford-focus.png',
  '',
  'Ülkemizde birçok farklı araç marka ve modelleri her gün kiralanmaktadır. Özellikle büyük şehirlerde birçok farklı araç modeli kiralanmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'ford-tourneo-courier',
  'Ford Tourneo Courier',
  'Ford',
  'ford',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/ford-tourneo-courier.png',
  '',
  'Ülkemizde birçok farklı marka ve modelde ticari araç bulunmaktadır. Bu araçların bütün modelleri Elitcar olarak filomuzda bulunmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  'ford-transit-custom',
  'Ford Transit Custom',
  'Ford',
  'ford',
  'Ekonomik',
  'Benzin',
  'Manuel',
  '5',
  925,
  15540,
  '/assets/images/vehicles/png/ford-transit-custom.png',
  '',
  'Günümüzde birçok kişi, birçok farklı ihtiyacı doğrultusunda araç kiralama yapabiliyor. Bu kapsamda kiralanan binlerce hatta milyonlarca araç bulunmaktadır.'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();

-- Filo birimleri (her modelden 1 plaka)
do $$
declare
  r record;
  i int := 0;
  office uuid;
  statuses fleet_status[] := array['musait','kirada','rezerveli','bakimda']::fleet_status[];
  plates text[] := array['34 ABC 101','34 DEF 202','34 GHI 303','34 JKL 404','34 MNO 505','34 PRS 606','34 STU 707','34 VYZ 808'];
  fv_id uuid;
  st fleet_status;
  lat0 float; lng0 float;
begin
  select id into office from public.offices where code = 'saw' limit 1;
  for r in select id, slug from public.vehicle_models order by slug loop
    i := i + 1;
    if i > 36 then exit; end if;
    st := statuses[((i - 1) % 4) + 1];
    insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km)
    values (
      'FLT-' || lpad(i::text, 3, '0'),
      '34 ' || substr('ABCDEFGHJKLMNPRSTUVYZ', ((i-1)%20)+1, 1) || substr('ABCDEFGHJKLMNPRSTUVYZ', ((i*3)%20)+1, 1) || substr('ABCDEFGHJKLMNPRSTUVYZ', ((i*7)%20)+1, 1) || ' ' || lpad(((100 + i * 17) % 900)::text, 3, '0'),
      r.id,
      office,
      st,
      40 + (i * 13) % 55,
      8000 + i * 1500
    )
    on conflict (fleet_code) do nothing
    returning id into fv_id;
    if fv_id is null then
      select id into fv_id from public.fleet_vehicles where fleet_code = 'FLT-' || lpad(i::text, 3, '0');
    end if;
    select lat, lng into lat0, lng0 from public.offices where id = office;
    insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
    values (
      fv_id,
      coalesce(lat0, 40.8986) + ((i % 7) - 3) * 0.01,
      coalesce(lng0, 29.3092) + ((i % 5) - 2) * 0.015,
      case when st = 'kirada' then 'SAW civarı · hareket halinde' else 'İstanbul Sabiha Gökçen Havalimanı (SAW)' end,
      now() - (i || ' hours')::interval
    )
    on conflict (fleet_vehicle_id) do update set
      lat = excluded.lat,
      lng = excluded.lng,
      location_label = excluded.location_label,
      recorded_at = excluded.recorded_at,
      updated_at = now();
  end loop;
end $$;

-- Örnek müşteri + kiralama
insert into public.customers (full_name, phone, email, license_no)
select 'Ahmet Yılmaz', '0532 111 22 33', 'ahmet.yilmaz@email.com', '34ABC12345'
where not exists (select 1 from public.customers where phone = '0532 111 22 33');

insert into public.customers (full_name, phone, email, license_no)
select 'Elif Demir', '0533 222 33 44', 'elif.demir@email.com', '06DEF67890'
where not exists (select 1 from public.customers where phone = '0533 222 33 44');

insert into public.rentals (
  pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,
  start_at, end_at, status, daily_price_try, deposit_try, notes
)
select
  public.generate_pnr(),
  fv.id,
  c.id,
  o.id,
  o.id,
  now() - interval '1 day',
  now() + interval '2 days',
  'aktif',
  coalesce(vm.daily_price_try, 1450),
  coalesce(vm.deposit_try, 15540),
  'Uçuş SAW — terminal karşılama'
from public.fleet_vehicles fv
join public.vehicle_models vm on vm.id = fv.model_id
join public.customers c on c.phone = '0532 111 22 33'
join public.offices o on o.code = 'saw'
where fv.status = 'kirada'
limit 1
on conflict (pnr) do nothing;

insert into public.rentals (
  pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,
  start_at, end_at, status, daily_price_try, deposit_try
)
select
  public.generate_pnr(),
  fv.id,
  c.id,
  o.id,
  o.id,
  now() + interval '1 day',
  now() + interval '4 days',
  'bekliyor',
  coalesce(vm.daily_price_try, 1200),
  coalesce(vm.deposit_try, 15540)
from public.fleet_vehicles fv
join public.vehicle_models vm on vm.id = fv.model_id
join public.customers c on c.phone = '0533 222 33 44'
join public.offices o on o.code = 'saw'
where fv.status = 'rezerveli'
limit 1
on conflict (pnr) do nothing;