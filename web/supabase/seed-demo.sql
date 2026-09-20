-- =============================================================================
-- ZakCar Personel Paneli — SUNUM DEMO SEED
-- Supabase SQL Editor'da tek seferde çalıştırın.
-- Güvenli: mevcut staff_profiles'a dokunmaz. Filo/kiralama demo verisini yeniler.
-- =============================================================================

begin;

-- Eski demo kiralamaları / konumları temizle (staff hariç)
delete from public.rentals;
delete from public.vehicle_location_history;
delete from public.vehicle_locations;
delete from public.fleet_vehicles;
delete from public.customers where phone like '053%' or phone like '054%' or phone like '055%';

-- Ofisler
insert into public.offices (code, name, address, phone, email, hours, lat, lng, is_active)
values ('saw', 'İstanbul Sabiha Gökçen Havalimanı (SAW)', 'Sabiha Gökçen Havalimanı, Pendik / İstanbul', '0532 388 29 96', 'info@zakcar.com', '7/24', 40.8986, 29.3092, true)
on conflict (code) do update set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  is_active = true;

insert into public.offices (code, name, address, phone, email, hours, lat, lng, is_active)
values ('ist', 'İstanbul Havalimanı (IST)', 'İstanbul Havalimanı, Arnavutköy / İstanbul', '0532 388 29 96', 'info@zakcar.com', '7/24', 41.2753, 28.7519, true)
on conflict (code) do update set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  is_active = true;

insert into public.offices (code, name, address, phone, email, hours, lat, lng, is_active)
values ('merkez', 'ZakCar Merkez Ofis', 'Sabiha Gökçen Havalimanı Karşısı', '0532 388 29 96', 'info@zakcar.com', '08:00 - 22:00', 40.878, 29.257, true)
on conflict (code) do update set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  is_active = true;

insert into public.offices (code, name, address, phone, email, hours, lat, lng, is_active)
values ('kadikoy', 'Kadıköy Ofis', 'Caferağa Mah. Moda Cad. Kadıköy / İstanbul', '0532 388 29 96', 'info@zakcar.com', '09:00 - 20:00', 40.9901, 29.029, true)
on conflict (code) do update set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  is_active = true;

insert into public.offices (code, name, address, phone, email, hours, lat, lng, is_active)
values ('besiktas', 'Beşiktaş Ofis', 'Sinanpaşa Mah. Beşiktaş / İstanbul', '0532 388 29 96', 'info@zakcar.com', '09:00 - 20:00', 41.0422, 29.0067, true)
on conflict (code) do update set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  is_active = true;

-- Araç modelleri (katalogdan)
insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok insan birçok farklı ihtiyacı doğrultusunda araç kiralamaktadır. Keza Audi A6 ülkemizde çok sevilen bir araç modeli olduğu için Audi A6 kiralama oranları da oldukça fazladır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Ülkemizde birçok farklı statüdeki insan, birçok farklı aracı, birçok farklı amaç doğrultusunda kiralamaktadır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Ülkemizde birçok farklı amaç doğrultusunda birçok farklı araç kiralanmaktadır. Araç kiralama hususunda oldukça fazla ihtiyaç bulunmaktadır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Ülkemizde birçok farklı amaç doğrultusunda lüks araç kiralaması yapılmaktadır. Bu kategoriden bir araç kiralamayı düşündüğünüzde, seçeneklerin çok fazla olduğu görebilirsiniz.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaç doğrultusunda araç kiralama yapılmaktadır. Bu kapsamda Elitcar olarak filomuz oldukça geniş bir ihtiyaç ve zevk yelpazesine hitap edecek kadar çok yönlüdür.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Elitcar''daki geniş elektrikli otomobil filomuz ile her ihtiyacı ve tercihi karşılamaya inanıyoruz.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaç doğrultusunda, birçok farklı segmentten araç kiralanmaktadır. Ülkemizde ise en fazla kiralanan araç segmentinden bir tanesi de ticari araçlardır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüz dünyasında trafikte araç kullanmak herkes için bir ihtiyaç haline gelmiştir. Bu hususta araç kiralama da oldukça yaygınlaşmıştır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaç doğrultusunda, her sosyal statüden insanımız araç kiralamaktadır. Her türlü ihtiyacı ve tercihi karşılayan devasa filomuzda araç çeşitliliği bulunmaktadır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaçlar doğrultusunda araç kiralama yapılmaktadır. Kiralama konusunda ise insanlar ikiye ayrılabilir.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok ülkede birçok farklı şekillerde araç kiralama yapılmaktadır. Genel olarak online araç kiralama oldukça popüler hale gelmiştir.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaçlarda, farklı araç kiralama yapılır. Nitekim araç kiralama birçok farklı ihtiyaç doğrultusunda yapılabilir.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Tesisimizde, araç kiralama hizmetleri için bize gelen müşterilerimiz için sayısız çok yönlü ihtiyaca hizmet edecek kadar iyi premium seçeneklere sahip olduğumuzdan emin oluyoruz.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde pek çok kişi ve işletme, her ihtiyaca uygun araç seçenekleri sunduğu için araç kiralamayı tercih ediyor.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı sosyal statüden kişi, birçok farklı amaç doğrultusunda araç kiralama yapmaktadır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaç doğrultusunda kısa ve uzun vadeli olarak araç kiralama yapılabilmektedir.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Ülkemizde her gün, taşımacılık ve ulaşım ihtiyaçları doğrultusunda birçok farklı araç modeli kiralanmaktadır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Ülkemizde ticari araçlar oldukça popüler hale gelmiştir çünkü ülke olarak geniş araçları sevmekteyiz. Bu hususta bir Dacia Lodgy Laureate kiralayıp, içine adım attığınızda beş kişi de olsanız, en konforlu ve geniş iç mekanı fark edeceksiniz',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı alanda, birçok farklı araç ülkemizin hemen hemen her yerinde kiralanmaktadır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaç doğrultusunda araç kiralama yapılmaktadır. Ülkemizde ise birçok farklı kiralık araç bulunmaktadır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı ihtiyaçlar için araç kiralama yapılabilmektedir. Elitcar olarak bizler her yıl filomuzdaki araçları yenilemekteyiz.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Ülkemizde birçok farklı ticari araç kiralanabiliyor. Bu araç modelleri ülkemizde küçük işletme ve esnaflar tarafından çok beğenilmektedir.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Ülkemizde araç kiralama, bir araç satın almaya göre finansal açıdan daha mantıklı bir seçim olmaya başladı.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Günümüzde birçok farklı amaç doğrultusunda ticari araç modelleri kiralanmaktadır. Ticari araç kiralayanların iki farklı ihtiyaçları oluyor.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  'Fiat Yeni Egea Sedan araç kiralama, son zamanlarda yoğun rağbet gören hizmetler arasında ilk sıralarda yer alır.',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();

-- Müşteriler
insert into public.customers (full_name, phone, email, license_no)
select 'Ahmet Yılmaz', '0532 111 22 33', 'ahmet.yilmaz@email.com', '34ABC12345'
where not exists (select 1 from public.customers where phone = '0532 111 22 33');

insert into public.customers (full_name, phone, email, license_no)
select 'Elif Demir', '0533 222 33 44', 'elif.demir@email.com', '06DEF67890'
where not exists (select 1 from public.customers where phone = '0533 222 33 44');

insert into public.customers (full_name, phone, email, license_no)
select 'Mehmet Kaya', '0542 333 44 55', 'mehmet.kaya@email.com', '35GHI11223'
where not exists (select 1 from public.customers where phone = '0542 333 44 55');

insert into public.customers (full_name, phone, email, license_no)
select 'Zeynep Arslan', '0555 444 55 66', 'zeynep.arslan@email.com', '16JKL44556'
where not exists (select 1 from public.customers where phone = '0555 444 55 66');

insert into public.customers (full_name, phone, email, license_no)
select 'Can Öztürk', '0536 555 66 77', 'can.ozturk@email.com', '41MNO77889'
where not exists (select 1 from public.customers where phone = '0536 555 66 77');

insert into public.customers (full_name, phone, email, license_no)
select 'Selin Aksoy', '0544 666 77 88', 'selin.aksoy@email.com', '07PQR99001'
where not exists (select 1 from public.customers where phone = '0544 666 77 88');

insert into public.customers (full_name, phone, email, license_no)
select 'Burak Çelik', '0530 777 88 99', 'burak.celik@email.com', '34STU22334'
where not exists (select 1 from public.customers where phone = '0530 777 88 99');

insert into public.customers (full_name, phone, email, license_no)
select 'Ayşe Kara', '0537 888 99 00', 'ayse.kara@email.com', '26VWX55667'
where not exists (select 1 from public.customers where phone = '0537 888 99 00');

-- Filo + konum
do $$
declare
  mid uuid;
  oid uuid;
  olat float; olng float; oname text;
  fv_id uuid;
  lat1 float; lng1 float;
  label text;
begin
  -- FLT-001 34 ABC 100
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'audi-a6';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-001', '34 ABC 100', mid, oid, 'bakimda', 35, 12000, now() - interval '1 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00500;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '0.2 hours');

  -- FLT-002 34 DEF 137
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'ist';
  select id into mid from public.vehicle_models where slug = 'bmw-116d';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-002', '34 DEF 137', mid, oid, 'musait', 52, 13843, now() - interval '2 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00200;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '1.2 hours');

  -- FLT-003 34 GHI 174
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'merkez';
  select id into mid from public.vehicle_models where slug = 'bmw-320';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-003', '34 GHI 174', mid, oid, 'musait', 69, 15686, now() - interval '3 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00100;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '2.2 hours');

  -- FLT-004 34 JKL 211
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'kadikoy';
  select id into mid from public.vehicle_models where slug = 'bmw-520';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-004', '34 JKL 211', mid, oid, 'kirada', 86, 17529, now() - interval '4 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00800;
  lng1 := coalesce(olng, 29.3092) + 0.03000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '3.2 hours');

  -- FLT-005 34 MNO 248
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'besiktas';
  select id into mid from public.vehicle_models where slug = 'chery-tiggo-7';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-005', '34 MNO 248', mid, oid, 'musait', 43, 19372, now() - interval '5 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00300;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '4.2 hours');

  -- FLT-006 34 PRS 285
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'chery-tiggo-8';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-006', '34 PRS 285', mid, oid, 'rezerveli', 60, 21215, now() - interval '6 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00000;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '5.2 hours');

  -- FLT-007 34 STU 322
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'ist';
  select id into mid from public.vehicle_models where slug = 'citroen-berlingo';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-007', '34 STU 322', mid, oid, 'kirada', 77, 23058, now() - interval '7 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.06400;
  lng1 := coalesce(olng, 29.3092) + -0.06000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '6.2 hours');

  -- FLT-008 34 VYZ 359
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'merkez';
  select id into mid from public.vehicle_models where slug = 'citroen-c-elysee';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-008', '34 VYZ 359', mid, oid, 'bakimda', 94, 24901, now() - interval '8 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00400;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '7.2 hours');

  -- FLT-009 34 ABC 396
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'kadikoy';
  select id into mid from public.vehicle_models where slug = 'citroen-c3-aircross';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-009', '34 ABC 396', mid, oid, 'musait', 51, 26744, now() - interval '1 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00100;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '0.2 hours');

  -- FLT-010 34 DEF 433
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'besiktas';
  select id into mid from public.vehicle_models where slug = 'citroen-c3';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-010', '34 DEF 433', mid, oid, 'kirada', 68, 28587, now() - interval '2 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.02400;
  lng1 := coalesce(olng, 29.3092) + 0.09000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '1.2 hours');

  -- FLT-011 34 GHI 470
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'citroen-c4';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-011', '34 GHI 470', mid, oid, 'rezerveli', 85, 30430, now() - interval '3 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00500;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '2.2 hours');

  -- FLT-012 34 JKL 507
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'ist';
  select id into mid from public.vehicle_models where slug = 'citroen-c4x';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-012', '34 JKL 507', mid, oid, 'musait', 42, 32273, now() - interval '4 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00200;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '3.2 hours');

  -- FLT-013 34 MNO 544
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'merkez';
  select id into mid from public.vehicle_models where slug = 'citroen-c5-aircross';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-013', '34 MNO 544', mid, oid, 'kirada', 59, 34116, now() - interval '5 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.04800;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '4.2 hours');

  -- FLT-014 34 PRS 581
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'kadikoy';
  select id into mid from public.vehicle_models where slug = 'citroen-jumper';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-014', '34 PRS 581', mid, oid, 'musait', 76, 35959, now() - interval '6 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00400;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '5.2 hours');

  -- FLT-015 34 STU 618
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'besiktas';
  select id into mid from public.vehicle_models where slug = 'citroen-jumpy-8-1';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-015', '34 STU 618', mid, oid, 'bakimda', 93, 37802, now() - interval '7 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00300;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '6.2 hours');

  -- FLT-016 34 VYZ 655
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'dacia-duster';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-016', '34 VYZ 655', mid, oid, 'kirada', 50, 39645, now() - interval '8 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.04000;
  lng1 := coalesce(olng, 29.3092) + -0.09000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '7.2 hours');

  -- FLT-017 34 ABC 692
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'ist';
  select id into mid from public.vehicle_models where slug = 'dacia-jogger';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-017', '34 ABC 692', mid, oid, 'musait', 67, 41488, now() - interval '1 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00300;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '0.2 hours');

  -- FLT-018 34 DEF 729
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'merkez';
  select id into mid from public.vehicle_models where slug = 'dacia-lodgy-laureate-5';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-018', '34 DEF 729', mid, oid, 'musait', 84, 43331, now() - interval '2 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00400;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '1.2 hours');

  -- FLT-019 34 GHI 766
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'kadikoy';
  select id into mid from public.vehicle_models where slug = 'dacia-lodgy-laureate-7-kisilik';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-019', '34 GHI 766', mid, oid, 'kirada', 41, 45174, now() - interval '3 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.03200;
  lng1 := coalesce(olng, 29.3092) + 0.06000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '2.2 hours');

  -- FLT-020 34 JKL 803
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'besiktas';
  select id into mid from public.vehicle_models where slug = 'dacia-sandero-stepway';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-020', '34 JKL 803', mid, oid, 'musait', 58, 47017, now() - interval '4 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00200;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '3.2 hours');

  -- FLT-021 34 MNO 840
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'ds7';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-021', '34 MNO 840', mid, oid, 'rezerveli', 75, 48860, now() - interval '5 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00500;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '4.2 hours');

  -- FLT-022 34 PRS 877
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'ist';
  select id into mid from public.vehicle_models where slug = 'fiat-500';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-022', '34 PRS 877', mid, oid, 'bakimda', 92, 50703, now() - interval '6 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00200;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '5.2 hours');

  -- FLT-023 34 STU 914
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'merkez';
  select id into mid from public.vehicle_models where slug = 'fiat-500-dolcevita';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-023', '34 STU 914', mid, oid, 'musait', 49, 52546, now() - interval '7 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00100;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '6.2 hours');

  -- FLT-024 34 VYZ 951
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'kadikoy';
  select id into mid from public.vehicle_models where slug = 'fiat-500c';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-024', '34 VYZ 951', mid, oid, 'musait', 66, 54389, now() - interval '8 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00400;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '7.2 hours');

  -- FLT-025 34 ABC 988
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'besiktas';
  select id into mid from public.vehicle_models where slug = 'fiat-500l-cross-plus';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-025', '34 ABC 988', mid, oid, 'kirada', 83, 56232, now() - interval '1 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.01600;
  lng1 := coalesce(olng, 29.3092) + -0.12000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '0.2 hours');

  -- FLT-026 34 DEF 125
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'fiat-500l-mirror';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-026', '34 DEF 125', mid, oid, 'rezerveli', 40, 58075, now() - interval '2 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00000;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '1.2 hours');

  -- FLT-027 34 GHI 162
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'ist';
  select id into mid from public.vehicle_models where slug = 'fiat-500l-wagon';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-027', '34 GHI 162', mid, oid, 'musait', 57, 59918, now() - interval '3 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00300;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '2.2 hours');

  -- FLT-028 34 JKL 199
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'merkez';
  select id into mid from public.vehicle_models where slug = 'fiat-500x-sport';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-028', '34 JKL 199', mid, oid, 'kirada', 74, 61761, now() - interval '4 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.07200;
  lng1 := coalesce(olng, 29.3092) + 0.03000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '3.2 hours');

  -- FLT-029 34 MNO 236
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'kadikoy';
  select id into mid from public.vehicle_models where slug = 'fiat-doblo';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-029', '34 MNO 236', mid, oid, 'bakimda', 91, 63604, now() - interval '5 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00100;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '4.2 hours');

  -- FLT-030 34 PRS 273
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'besiktas';
  select id into mid from public.vehicle_models where slug = 'fiat-doblo-panorama-dynamic';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-030', '34 PRS 273', mid, oid, 'musait', 48, 65447, now() - interval '6 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00200;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '5.2 hours');

  -- FLT-031 34 STU 310
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'fiat-fiorino';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-031', '34 STU 310', mid, oid, 'kirada', 65, 67290, now() - interval '7 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00000;
  lng1 := coalesce(olng, 29.3092) + -0.06000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '6.2 hours');

  -- FLT-032 34 VYZ 347
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'ist';
  select id into mid from public.vehicle_models where slug = 'fiat-fiorino-panorama';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-032', '34 VYZ 347', mid, oid, 'musait', 82, 69133, now() - interval '8 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00200;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '7.2 hours');

  -- FLT-033 34 ABC 384
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'merkez';
  select id into mid from public.vehicle_models where slug = 'fiat-panda-urban';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-033', '34 ABC 384', mid, oid, 'musait', 39, 70976, now() - interval '1 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00100;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '0.2 hours');

  -- FLT-034 34 DEF 421
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'kadikoy';
  select id into mid from public.vehicle_models where slug = 'fiat-yeni-egea-cross';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-034', '34 DEF 421', mid, oid, 'kirada', 56, 72819, now() - interval '2 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.07200;
  lng1 := coalesce(olng, 29.3092) + 0.09000;
  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '1.2 hours');

  -- FLT-035 34 GHI 458
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'besiktas';
  select id into mid from public.vehicle_models where slug = 'fiat-yeni-egea-hatchback';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-035', '34 GHI 458', mid, oid, 'musait', 73, 74662, now() - interval '3 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + -0.00300;
  lng1 := coalesce(olng, 29.3092) + -0.00750;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '2.2 hours');

  -- FLT-036 34 JKL 495
  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = 'saw';
  select id into mid from public.vehicle_models where slug = 'fiat-yeni-egea-sedan';
  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)
  values ('FLT-036', '34 JKL 495', mid, oid, 'bakimda', 90, 76505, now() - interval '4 hours')
  returning id into fv_id;
  lat1 := coalesce(olat, 40.8986) + 0.00000;
  lng1 := coalesce(olng, 29.3092) + 0.00000;
  label := coalesce(oname, 'Ofis');
  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (fv_id, lat1, lng1, label, now() - interval '3.2 hours');

end $$;

-- Kiralamalar: kirada + rezerveli araçlara müşteri bağla
do $$
declare
  fv record;
  v_cust uuid;
  v_pick uuid;
  v_drop uuid;
  v_i int := 0;
  phones text[] := array[
'0532 111 22 33', '0533 222 33 44', '0542 333 44 55', '0555 444 55 66', '0536 555 66 77', '0544 666 77 88', '0530 777 88 99', '0537 888 99 00'
  ];
  v_pnr text;
  v_active boolean;
  v_price numeric;
  v_dep numeric;
begin
  for fv in
    select f.id, f.status, f.home_office_id, vm.daily_price_try, vm.deposit_try
    from public.fleet_vehicles f
    join public.vehicle_models vm on vm.id = f.model_id
    where f.status in ('kirada', 'rezerveli')
    order by f.fleet_code
  loop
    v_i := v_i + 1;
    select id into v_cust from public.customers where phone = phones[((v_i - 1) % array_length(phones, 1)) + 1];
    v_pick := fv.home_office_id;
    select id into v_drop from public.offices where code = (array['saw','ist','kadikoy','besiktas','merkez'])[((v_i + 1) % 5) + 1];
    v_active := fv.status = 'kirada';
    v_pnr := 'ZK' || lpad((2400 + v_i * 13)::text, 6, '0');
    v_price := coalesce(fv.daily_price_try, 1200 + (v_i % 5) * 350);
    v_dep := coalesce(fv.deposit_try, 15540);
    insert into public.rentals (
      pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,
      start_at, end_at, status, daily_price_try, deposit_try, total_price_try, notes
    ) values (
      v_pnr,
      fv.id,
      v_cust,
      v_pick,
      v_drop,
      case when v_active then now() - interval '2 days' else now() + interval '1 day' end,
      case when v_active then now() + interval '2 days' else now() + interval '4 days' end,
      case when v_active then 'aktif'::rental_status else 'bekliyor'::rental_status end,
      v_price,
      v_dep,
      v_price * 3,
      case when v_i % 4 = 1 then 'Uçuş SAW — terminal karşılama' else null end
    ) on conflict (pnr) do nothing;
  end loop;

  -- Tamamlanmış + iptal örnekleri
  insert into public.rentals (
    pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,
    start_at, end_at, status, daily_price_try, deposit_try, total_price_try
  )
  select 'ZK002180', f.id, c.id, o.id, o.id,
    now() - interval '8 days', now() - interval '5 days', 'tamamlandi', 1450, 15540, 4350
  from public.fleet_vehicles f
  cross join lateral (select id from public.customers where phone = '0532 111 22 33' limit 1) c
  cross join lateral (select id from public.offices where code = 'saw' limit 1) o
  order by f.fleet_code limit 1
  on conflict (pnr) do nothing;

  insert into public.rentals (
    pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,
    start_at, end_at, status, daily_price_try, deposit_try, notes
  )
  select 'ZK002201', f.id, c.id, o1.id, o2.id,
    now() - interval '3 days', now() - interval '3 days' + interval '2 hours', 'iptal', 1200, 15540,
    'Müşteri iptali — 24 saat kala'
  from public.fleet_vehicles f
  cross join lateral (select id from public.customers where phone = '0555 444 55 66' limit 1) c
  cross join lateral (select id from public.offices where code = 'ist' limit 1) o1
  cross join lateral (select id from public.offices where code = 'kadikoy' limit 1) o2
  order by f.fleet_code desc limit 1
  on conflict (pnr) do nothing;
end $$;

commit;

-- Kontrol (view yoksa da çalışır)
select 'offices' as t, count(*)::bigint as n from public.offices
union all select 'models', count(*) from public.vehicle_models
union all select 'fleet', count(*) from public.fleet_vehicles
union all select 'locations', count(*) from public.vehicle_locations
union all select 'customers', count(*) from public.customers
union all select 'rentals', count(*) from public.rentals;