-- ZakCar bos veritabani kurulumu
-- Supabase Dashboard -> SQL Editor -> New query -> tum dosyayi calistirin
-- Siralama: sema, yetkiler, filo, kapaklar, rezervasyon
-- Personel hesabi bu dosyada yok. Auth kullanicisi actiktan sonra add-staff.sql


-- ===== schema.sql =====

-- ZakCar Personel Paneli — Supabase şeması
-- Supabase Dashboard → SQL Editor → New query → çalıştırın
-- Not: Authentication > Users üzerinden personel hesabı oluşturun;
--      ardından staff_profiles satırı ekleyin (örnek aşağıda).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type fleet_status as enum ('musait', 'kirada', 'rezerveli', 'bakimda');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rental_status as enum ('aktif', 'bekliyor', 'tamamlandi', 'iptal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type staff_role as enum ('admin', 'operasyon', 'saha');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Personel (auth.users ile bağlı)
-- ---------------------------------------------------------------------------
create table if not exists public.staff_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role staff_role not null default 'operasyon',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Ofisler
-- ---------------------------------------------------------------------------
create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  address text,
  phone text,
  email text,
  hours text,
  lat double precision,
  lng double precision,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Katalog modelleri (web sitesindeki araç kartları)
-- ---------------------------------------------------------------------------
create table if not exists public.vehicle_models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  brand_slug text,
  vehicle_group text not null, -- Ekonomik / SUV / Minibüs / Lüks
  fuel text,
  transmission text,
  capacity text,
  daily_price_try numeric(12, 2),
  deposit_try numeric(12, 2),
  image_url text,
  banner_url text,
  summary text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Filo birimleri (plakalı fiziksel araçlar)
-- ---------------------------------------------------------------------------
create table if not exists public.fleet_vehicles (
  id uuid primary key default gen_random_uuid(),
  fleet_code text not null unique, -- FLT-001
  plate text not null unique,
  model_id uuid not null references public.vehicle_models (id),
  home_office_id uuid references public.offices (id),
  status fleet_status not null default 'musait',
  fuel_level smallint not null default 100 check (fuel_level between 0 and 100),
  odometer_km integer not null default 0 check (odometer_km >= 0),
  year smallint,
  color text,
  vin text,
  notes text,
  last_status_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fleet_vehicles_status_idx on public.fleet_vehicles (status);
create index if not exists fleet_vehicles_office_idx on public.fleet_vehicles (home_office_id);

-- ---------------------------------------------------------------------------
-- Anlık konum
-- ---------------------------------------------------------------------------
create table if not exists public.vehicle_locations (
  fleet_vehicle_id uuid primary key references public.fleet_vehicles (id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  location_label text,
  speed_kmh numeric(6, 1),
  heading smallint,
  recorded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicle_locations_recorded_idx
  on public.vehicle_locations (recorded_at desc);

-- Konum geçmişi (opsiyonel izleme)
create table if not exists public.vehicle_location_history (
  id bigserial primary key,
  fleet_vehicle_id uuid not null references public.fleet_vehicles (id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  location_label text,
  recorded_at timestamptz not null default now()
);

create index if not exists vehicle_location_history_vehicle_time_idx
  on public.vehicle_location_history (fleet_vehicle_id, recorded_at desc);

-- ---------------------------------------------------------------------------
-- Müşteriler
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  license_no text,
  national_id text,
  birth_date date,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_phone_idx on public.customers (phone);
create index if not exists customers_name_idx on public.customers (full_name);

-- ---------------------------------------------------------------------------
-- Kiralamalar / rezervasyonlar
-- ---------------------------------------------------------------------------
create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  pnr text not null unique,
  fleet_vehicle_id uuid not null references public.fleet_vehicles (id),
  customer_id uuid not null references public.customers (id),
  pickup_office_id uuid references public.offices (id),
  dropoff_office_id uuid references public.offices (id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status rental_status not null default 'bekliyor',
  daily_price_try numeric(12, 2) not null,
  deposit_try numeric(12, 2),
  total_price_try numeric(12, 2),
  flight_number text,
  notes text,
  created_by uuid references public.staff_profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

create index if not exists rentals_status_idx on public.rentals (status);
create index if not exists rentals_vehicle_idx on public.rentals (fleet_vehicle_id);
create index if not exists rentals_customer_idx on public.rentals (customer_id);
create index if not exists rentals_start_idx on public.rentals (start_at);
create index if not exists rentals_end_idx on public.rentals (end_at);

-- ---------------------------------------------------------------------------
-- updated_at tetikleyicisi
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists staff_profiles_updated_at on public.staff_profiles;
create trigger staff_profiles_updated_at
  before update on public.staff_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists vehicle_models_updated_at on public.vehicle_models;
create trigger vehicle_models_updated_at
  before update on public.vehicle_models
  for each row execute function public.set_updated_at();

drop trigger if exists fleet_vehicles_updated_at on public.fleet_vehicles;
create trigger fleet_vehicles_updated_at
  before update on public.fleet_vehicles
  for each row execute function public.set_updated_at();

drop trigger if exists vehicle_locations_updated_at on public.vehicle_locations;
create trigger vehicle_locations_updated_at
  before update on public.vehicle_locations
  for each row execute function public.set_updated_at();

drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

drop trigger if exists rentals_updated_at on public.rentals;
create trigger rentals_updated_at
  before update on public.rentals
  for each row execute function public.set_updated_at();

-- Konum güncellenince history'ye yaz
create or replace function public.log_vehicle_location()
returns trigger
language plpgsql
as $$
begin
  insert into public.vehicle_location_history (fleet_vehicle_id, lat, lng, location_label, recorded_at)
  values (new.fleet_vehicle_id, new.lat, new.lng, new.location_label, coalesce(new.recorded_at, now()));
  return new;
end;
$$;

drop trigger if exists vehicle_locations_history on public.vehicle_locations;
create trigger vehicle_locations_history
  after insert or update of lat, lng on public.vehicle_locations
  for each row execute function public.log_vehicle_location();

-- Kiralama durumu → filo durumu senkronu
create or replace function public.sync_fleet_status_from_rental()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' or tg_op = 'UPDATE' then
    if new.status = 'aktif' then
      update public.fleet_vehicles
      set status = 'kirada', last_status_at = now()
      where id = new.fleet_vehicle_id;
    elsif new.status = 'bekliyor' then
      update public.fleet_vehicles
      set status = 'rezerveli', last_status_at = now()
      where id = new.fleet_vehicle_id
        and status <> 'bakimda';
    elsif new.status in ('tamamlandi', 'iptal') then
      -- başka aktif/bekleyen yoksa müsait yap
      if not exists (
        select 1 from public.rentals r
        where r.fleet_vehicle_id = new.fleet_vehicle_id
          and r.id <> new.id
          and r.status in ('aktif', 'bekliyor')
      ) then
        update public.fleet_vehicles
        set status = 'musait', last_status_at = now()
        where id = new.fleet_vehicle_id
          and status <> 'bakimda';
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists rentals_sync_fleet on public.rentals;
create trigger rentals_sync_fleet
  after insert or update of status on public.rentals
  for each row execute function public.sync_fleet_status_from_rental();

-- PNR üretici (ZK + 6 haneli)
create or replace function public.generate_pnr()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := 'ZK' || lpad((floor(random() * 1000000))::int::text, 6, '0');
    exit when not exists (select 1 from public.rentals where pnr = candidate);
  end loop;
  return candidate;
end;
$$;

-- ---------------------------------------------------------------------------
-- Panel için view'lar
-- ---------------------------------------------------------------------------
create or replace view public.v_fleet_board as
select
  fv.id,
  fv.fleet_code,
  fv.plate,
  fv.status,
  fv.fuel_level,
  fv.odometer_km,
  fv.last_status_at,
  vm.slug as model_slug,
  vm.name as model_name,
  vm.brand,
  vm.vehicle_group,
  vm.image_url,
  o.name as office_name,
  o.code as office_code,
  vl.lat,
  vl.lng,
  vl.location_label,
  vl.recorded_at as location_updated_at
from public.fleet_vehicles fv
join public.vehicle_models vm on vm.id = fv.model_id
left join public.offices o on o.id = fv.home_office_id
left join public.vehicle_locations vl on vl.fleet_vehicle_id = fv.id;

create or replace view public.v_rentals_board as
select
  r.id,
  r.pnr,
  r.status,
  r.start_at,
  r.end_at,
  r.daily_price_try,
  r.deposit_try,
  r.total_price_try,
  r.flight_number,
  r.notes,
  r.created_at,
  c.full_name as customer_name,
  c.phone as customer_phone,
  c.email as customer_email,
  c.license_no as customer_license_no,
  fv.plate,
  fv.fleet_code,
  vm.name as vehicle_name,
  po.name as pickup_office,
  doff.name as dropoff_office
from public.rentals r
join public.customers c on c.id = r.customer_id
join public.fleet_vehicles fv on fv.id = r.fleet_vehicle_id
join public.vehicle_models vm on vm.id = fv.model_id
left join public.offices po on po.id = r.pickup_office_id
left join public.offices doff on doff.id = r.dropoff_office_id;

create or replace view public.v_panel_stats as
select
  (select count(*) from public.fleet_vehicles) as total,
  (select count(*) from public.fleet_vehicles where status = 'musait') as musait,
  (select count(*) from public.fleet_vehicles where status = 'kirada') as kirada,
  (select count(*) from public.fleet_vehicles where status = 'rezerveli') as rezerveli,
  (select count(*) from public.fleet_vehicles where status = 'bakimda') as bakimda,
  (select count(*) from public.rentals where status = 'aktif') as aktif_kiralama,
  (select count(*) from public.rentals where start_at::date = current_date) as bugun_teslim,
  (select count(*) from public.rentals where end_at::date = current_date) as bugun_iade;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.staff_profiles enable row level security;
alter table public.offices enable row level security;
alter table public.vehicle_models enable row level security;
alter table public.fleet_vehicles enable row level security;
alter table public.vehicle_locations enable row level security;
alter table public.vehicle_location_history enable row level security;
alter table public.customers enable row level security;
alter table public.rentals enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles s
    where s.id = auth.uid()
      and s.is_active = true
  );
$$;

-- Staff: kendi profilini okuyabilir
drop policy if exists staff_read_own_profile on public.staff_profiles;
create policy staff_read_own_profile on public.staff_profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff());

drop policy if exists staff_update_own_profile on public.staff_profiles;
create policy staff_update_own_profile on public.staff_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Aktif personel tüm operasyon tablolarını okuyup yazabilir
drop policy if exists staff_all_offices on public.offices;
create policy staff_all_offices on public.offices
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists staff_all_models on public.vehicle_models;
create policy staff_all_models on public.vehicle_models
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists staff_all_fleet on public.fleet_vehicles;
create policy staff_all_fleet on public.fleet_vehicles
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists staff_all_locations on public.vehicle_locations;
create policy staff_all_locations on public.vehicle_locations
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists staff_all_location_history on public.vehicle_location_history;
create policy staff_all_location_history on public.vehicle_location_history
  for select to authenticated
  using (public.is_staff());

drop policy if exists staff_all_customers on public.customers;
create policy staff_all_customers on public.customers
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists staff_all_rentals on public.rentals;
create policy staff_all_rentals on public.rentals
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Seed: ofisler
-- ---------------------------------------------------------------------------
insert into public.offices (code, name, address, phone, email, hours, lat, lng)
values
  ('saw', 'İstanbul Sabiha Gökçen Havalimanı (SAW)', 'Sabiha Gökçen Havalimanı, Pendik / İstanbul', '0532 388 29 96', 'info@zakcar.com', '7/24', 40.8986, 29.3092),
  ('ist', 'İstanbul Havalimanı (IST)', 'İstanbul Havalimanı, Arnavutköy / İstanbul', '0532 388 29 96', 'info@zakcar.com', '7/24', 41.2753, 28.7519),
  ('merkez', 'ZakCar Merkez Ofis', 'Sabiha Gökçen Havalimanı Karşısı', '0532 388 29 96', 'info@zakcar.com', '08:00 - 22:00', 40.8780, 29.2570)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- Personel ekleme (Auth'da user oluşturduktan sonra çalıştırın)
-- ---------------------------------------------------------------------------
-- 1) Authentication → Users → Add user (email + password)
-- 2) Aşağıdaki UUID'yi yeni kullanıcının id'si ile değiştirin:
--
-- insert into public.staff_profiles (id, full_name, email, role)
-- values (
--   '00000000-0000-0000-0000-000000000000',
--   'Panel Admin',
--   'personel@zakcar.com',
--   'admin'
-- );

-- Örnek kiralama PNR'siz insert:
-- insert into public.rentals (
--   pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,
--   start_at, end_at, status, daily_price_try, deposit_try
-- ) values (
--   public.generate_pnr(),
--   '...fleet uuid...',
--   '...customer uuid...',
--   (select id from public.offices where code = 'saw'),
--   (select id from public.offices where code = 'saw'),
--   now(),
--   now() + interval '3 days',
--   'bekliyor',
--   1450,
--   15540
-- );


-- ===== grants.sql =====

-- Panel bağlandıktan sonra bir kez çalıştırın (SQL Editor)
-- View'ların RLS ile çalışması + authenticated yetkileri

alter view public.v_fleet_board set (security_invoker = true);
alter view public.v_rentals_board set (security_invoker = true);
alter view public.v_panel_stats set (security_invoker = true);

grant usage on schema public to authenticated;
grant select on public.v_fleet_board to authenticated;
grant select on public.v_rentals_board to authenticated;
grant select on public.v_panel_stats to authenticated;

grant select, insert, update, delete on public.offices to authenticated;
grant select, insert, update, delete on public.vehicle_models to authenticated;
grant select, insert, update, delete on public.fleet_vehicles to authenticated;
grant select, insert, update, delete on public.vehicle_locations to authenticated;
grant select on public.vehicle_location_history to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.rentals to authenticated;
grant select, update on public.staff_profiles to authenticated;

grant usage, select on all sequences in schema public to authenticated;


-- ===== seed-fleet.sql =====

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

-- ===== promo-covers.sql =====

-- Ana sayfa kampanya kapakları
-- Supabase Dashboard → SQL Editor → çalıştırın

create table if not exists public.promo_covers (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  href text not null default '/arac-modelleri',
  title text not null default '',
  highlight text not null default '',
  subtitle text not null default '',
  badge text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promo_covers_sort_idx on public.promo_covers (sort_order, created_at);

alter table public.promo_covers enable row level security;

drop policy if exists promo_public_read on public.promo_covers;
create policy promo_public_read on public.promo_covers
  for select
  using (true);

drop policy if exists promo_staff_write on public.promo_covers;
create policy promo_staff_write on public.promo_covers
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.promo_covers to anon, authenticated;
grant insert, update, delete on public.promo_covers to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'promo-covers',
  'promo-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists promo_storage_public_read on storage.objects;
create policy promo_storage_public_read on storage.objects
  for select
  using (bucket_id = 'promo-covers');

drop policy if exists promo_storage_staff_insert on storage.objects;
create policy promo_storage_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'promo-covers' and public.is_staff());

drop policy if exists promo_storage_staff_update on storage.objects;
create policy promo_storage_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'promo-covers' and public.is_staff())
  with check (bucket_id = 'promo-covers' and public.is_staff());

drop policy if exists promo_storage_staff_delete on storage.objects;
create policy promo_storage_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'promo-covers' and public.is_staff());

insert into public.promo_covers (image_url, href, title, highlight, subtitle, badge, sort_order)
select * from (values
  ('/assets/promo/ilk-kiralama.png', '/ekonomik-arac-kiralama', 'İlk araç kiralamanızda', '%10 indirim', 'Standart ve SUV grubundaki tüm araçlarda geçerli', 'İlk kiralamaya özel', 0),
  ('/assets/promo/kredi-kartsiz.png', '/kredi-kartsiz-arac-kiralama', 'Kredi kartı olmadan', 'kiralayın', 'Nakit ve banka kartı ile rezervasyon imkânı', 'Kredi kartsız', 1),
  ('/assets/promo/havalimani.png', '/sabiha-gokcen-havalimani-arac-kiralama', 'Havalimanı teslim', 'SAW & IGA', 'Sabiha Gökçen ve İstanbul Havalimanı ofisleri', '7/24 teslim', 2),
  ('/assets/promo/suv.png', '/4x4-suv-arac-kiralama', 'SUV ve 4x4', 'geniş filo', 'Uzun yol ve aile seyahatleri için güçlü seçenekler', 'SUV & arazi', 3)
) as seed(image_url, href, title, highlight, subtitle, badge, sort_order)
where not exists (select 1 from public.promo_covers);


-- ===== booking.sql =====

-- ZakCar rezervasyon servisi
-- Sıra: schema.sql → grants.sql → seed-fleet.sql → bu dosya
-- Supabase Dashboard → SQL Editor → bir kez çalıştırın
-- Anon anahtar yeter. Yazma işlemleri security definer fonksiyonlardadır.

-- ---------------------------------------------------------------------------
-- Ofis kodu: sitedeki arama "iga" kullanır, eski seed "ist" yazmış olabilir
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from public.offices where code = 'ist')
     and not exists (select 1 from public.offices where code = 'iga') then
    update public.offices set code = 'iga' where code = 'ist';
  elsif exists (select 1 from public.offices where code = 'ist')
     and exists (select 1 from public.offices where code = 'iga') then
    update public.fleet_vehicles
      set home_office_id = (select id from public.offices where code = 'iga')
      where home_office_id = (select id from public.offices where code = 'ist');
    update public.rentals
      set pickup_office_id = (select id from public.offices where code = 'iga')
      where pickup_office_id = (select id from public.offices where code = 'ist');
    update public.rentals
      set dropoff_office_id = (select id from public.offices where code = 'iga')
      where dropoff_office_id = (select id from public.offices where code = 'ist');
    delete from public.offices where code = 'ist';
  end if;
end $$;

insert into public.offices (code, name, address, phone, email, hours, lat, lng)
values
  ('saw', 'İstanbul Sabiha Gökçen Havalimanı (SAW)', 'Sabiha Gökçen Havalimanı, Pendik / İstanbul', '0532 388 29 96', 'info@zakcar.com', '7/24', 40.8986, 29.3092),
  ('iga', 'İstanbul Havalimanı (IGA)', 'İstanbul Havalimanı, Arnavutköy / İstanbul', '0532 388 29 96', 'info@zakcar.com', '7/24', 41.2753, 28.7519),
  ('merkez', 'ZakCar Merkez Ofis', 'Sabiha Gökçen Havalimanı Karşısı', '0532 388 29 96', 'info@zakcar.com', '08:00 - 22:00', 40.8780, 29.2570)
on conflict (code) do update set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng;

-- ---------------------------------------------------------------------------
-- Müşteri eşleme
-- ---------------------------------------------------------------------------
create or replace function public.normalize_phone(raw text)
returns text
language sql
immutable
as $$
  select case
    when length(d) >= 10 then right(d, 10)
    else null
  end
  from (select regexp_replace(coalesce(raw, ''), '[^0-9]', '', 'g') as d) s;
$$;

alter table public.customers
  add column if not exists auth_user_id uuid references auth.users (id) on delete set null;

alter table public.customers
  add column if not exists phone_key text;

update public.customers
set phone_key = public.normalize_phone(phone)
where phone_key is null;

create index if not exists customers_phone_key_idx on public.customers (phone_key);
create index if not exists customers_auth_user_idx on public.customers (auth_user_id);

create index if not exists rentals_vehicle_window_idx
  on public.rentals (fleet_vehicle_id, start_at, end_at)
  where status in ('aktif', 'bekliyor');

-- ---------------------------------------------------------------------------
-- Filo durumu: çakışan kiralamaya göre, bakım elle korunur
-- ---------------------------------------------------------------------------
create or replace function public.refresh_fleet_status(p_vehicle uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current public.fleet_status;
  next_status public.fleet_status;
begin
  select status into current from public.fleet_vehicles where id = p_vehicle;
  if current is null or current = 'bakimda' then
    return;
  end if;

  if exists (
    select 1 from public.rentals r
    where r.fleet_vehicle_id = p_vehicle
      and r.status = 'aktif'
      and r.start_at <= now()
      and r.end_at > now()
  ) then
    next_status := 'kirada';
  elsif exists (
    select 1 from public.rentals r
    where r.fleet_vehicle_id = p_vehicle
      and r.status in ('aktif', 'bekliyor')
      and r.end_at > now()
  ) then
    next_status := 'rezerveli';
  else
    next_status := 'musait';
  end if;

  update public.fleet_vehicles
  set status = next_status, last_status_at = now()
  where id = p_vehicle
    and status is distinct from next_status;
end;
$$;

create or replace function public.sync_fleet_status_from_rental()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_fleet_status(old.fleet_vehicle_id);
    return old;
  end if;
  perform public.refresh_fleet_status(new.fleet_vehicle_id);
  if tg_op = 'UPDATE' and old.fleet_vehicle_id is distinct from new.fleet_vehicle_id then
    perform public.refresh_fleet_status(old.fleet_vehicle_id);
  end if;
  return new;
end;
$$;

-- Kiralama kaydı olmayan sahte "kirada / rezerveli" durumlarını düzelt
update public.fleet_vehicles fv
set status = 'musait', last_status_at = now()
where fv.status in ('kirada', 'rezerveli')
  and not exists (
    select 1 from public.rentals r
    where r.fleet_vehicle_id = fv.id
      and r.status in ('aktif', 'bekliyor')
      and r.end_at > now()
  );

-- ---------------------------------------------------------------------------
-- Ofis çözümleme
-- ---------------------------------------------------------------------------
create or replace function public.resolve_office_id(p_code text)
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_code text := lower(trim(coalesce(p_code, '')));
begin
  if v_code in ('ist', 'istanbul', 'iga') then
    v_code := 'iga';
  elsif v_code in ('sabiha', 'saw') then
    v_code := 'saw';
  elsif v_code in ('merkez', 'ofis') then
    v_code := 'merkez';
  end if;

  if v_code not in ('saw', 'iga', 'merkez') then
    return null;
  end if;

  return (select id from public.offices where code = v_code and is_active limit 1);
end;
$$;

-- ---------------------------------------------------------------------------
-- Müsaitlik: model başına boş filo adedi
-- ---------------------------------------------------------------------------
create or replace function public.availability_by_model(
  p_start_at timestamptz,
  p_end_at timestamptz
)
returns table (slug text, available integer)
language sql
stable
security definer
set search_path = public
as $$
  select
    vm.slug,
    count(fv.id) filter (
      where fv.status is distinct from 'bakimda'
        and not exists (
          select 1 from public.rentals r
          where r.fleet_vehicle_id = fv.id
            and r.status in ('aktif', 'bekliyor')
            and r.start_at < p_end_at
            and r.end_at > p_start_at
        )
    )::integer as available
  from public.vehicle_models vm
  left join public.fleet_vehicles fv on fv.model_id = vm.id
  where vm.is_active
  group by vm.slug;
$$;

-- ---------------------------------------------------------------------------
-- Herkese açık rezervasyon
-- ---------------------------------------------------------------------------
create or replace function public.create_public_reservation(
  p_model_slug text,
  p_pickup_code text,
  p_dropoff_code text,
  p_start_at timestamptz,
  p_end_at timestamptz,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_flight_number text default null,
  p_birth_date date default null,
  p_extra_codes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text := lower(trim(coalesce(p_model_slug, '')));
  v_first text := trim(coalesce(p_first_name, ''));
  v_last text := trim(coalesce(p_last_name, ''));
  v_email text := lower(trim(coalesce(p_email, '')));
  v_phone text := trim(coalesce(p_phone, ''));
  v_phone_key text := public.normalize_phone(p_phone);
  v_flight text := nullif(upper(trim(coalesce(p_flight_number, ''))), '');
  v_start timestamptz := p_start_at;
  v_end timestamptz := p_end_at;
  v_pickup uuid;
  v_dropoff uuid;
  v_model public.vehicle_models%rowtype;
  v_fleet uuid;
  v_customer uuid;
  v_days integer;
  v_total numeric(12, 2);
  v_extra numeric(12, 2);
  v_extra_codes text;
  v_notes text;
  v_note_parts text[];
  v_pnr text;
  v_uid uuid := auth.uid();
  v_jwt_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if v_slug !~ '^[a-z0-9-]{2,80}$' then
    raise exception 'Geçersiz araç.';
  end if;
  if length(v_first) < 2 or length(v_last) < 2 or length(v_first) > 60 or length(v_last) > 60 then
    raise exception 'Ad ve soyad gerekli.';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 160 then
    raise exception 'Geçerli bir e-posta girin.';
  end if;
  if v_phone_key is null then
    raise exception 'Geçerli bir telefon girin.';
  end if;
  if v_flight is not null and v_flight !~ '^[A-Z0-9 -]{2,12}$' then
    raise exception 'Uçuş numarası geçersiz.';
  end if;
  if v_start is null or v_end is null or v_end <= v_start then
    raise exception 'Bırakış, alıştan sonra olmalı.';
  end if;
  if v_start < now() - interval '2 hours' then
    raise exception 'Alış tarihi geçmişte kalamaz.';
  end if;
  if v_start > now() + interval '365 days' then
    raise exception 'Alış tarihi en fazla 1 yıl sonrası olabilir.';
  end if;
  if v_end > v_start + interval '90 days' then
    raise exception 'Tek seferde en fazla 90 gün kiralanabilir.';
  end if;

  v_pickup := public.resolve_office_id(p_pickup_code);
  v_dropoff := public.resolve_office_id(coalesce(nullif(trim(p_dropoff_code), ''), p_pickup_code));
  if v_pickup is null or v_dropoff is null then
    raise exception 'Seçtiğiniz ofis henüz rezervasyona açık değil.';
  end if;

  select * into v_model
  from public.vehicle_models
  where slug = v_slug and is_active;

  if not found then
    raise exception 'Bu araç modeli operasyon sisteminde tanımlı değil.';
  end if;
  if v_model.daily_price_try is null then
    raise exception 'Bu model için günlük fiyat tanımlı değil.';
  end if;

  select fv.id into v_fleet
  from public.fleet_vehicles fv
  where fv.model_id = v_model.id
    and fv.status <> 'bakimda'
    and not exists (
      select 1 from public.rentals r
      where r.fleet_vehicle_id = fv.id
        and r.status in ('aktif', 'bekliyor')
        and r.start_at < v_end
        and r.end_at > v_start
    )
  order by case when fv.home_office_id = v_pickup then 0 else 1 end, fv.fleet_code
  limit 1
  for update;

  if v_fleet is null then
    raise exception 'Seçtiğiniz tarihte bu model müsait değil.';
  end if;

  perform pg_advisory_xact_lock(hashtext(v_phone_key)::bigint);

  select id into v_customer
  from public.customers
  where phone_key = v_phone_key
     or public.normalize_phone(phone) = v_phone_key
  order by created_at desc
  limit 1
  for update;

  if v_customer is null then
    insert into public.customers (full_name, phone, email, phone_key, auth_user_id, birth_date)
    values (
      v_first || ' ' || v_last,
      v_phone,
      v_email,
      v_phone_key,
      case when v_uid is not null and v_jwt_email = v_email then v_uid else null end,
      p_birth_date
    )
    returning id into v_customer;
  else
    update public.customers
    set
      full_name = v_first || ' ' || v_last,
      phone = v_phone,
      email = v_email,
      phone_key = v_phone_key,
      birth_date = coalesce(p_birth_date, birth_date),
      auth_user_id = case
        when v_uid is not null and v_jwt_email = v_email then v_uid
        else auth_user_id
      end
    where id = v_customer;
  end if;

  if p_birth_date is not null and (p_birth_date > current_date or p_birth_date < date '1920-01-01') then
    raise exception 'Doğum tarihi geçersiz.';
  end if;

  v_days := greatest(1, ceil(extract(epoch from (v_end - v_start)) / 86400.0)::int);
  -- Ek ücretler web/src/lib/extras.ts ile aynı günlük tutarlardır.
  v_extra := 0;
  v_note_parts := array[]::text[];
  v_extra_codes := lower(regexp_replace(coalesce(p_extra_codes, ''), '\s', '', 'g'));
  if v_extra_codes ~ '(^|,)driver(,|$)' then
    v_extra := v_extra + (56 * v_days);
    v_note_parts := array_append(v_note_parts, 'Ek sürücü');
  end if;
  if v_extra_codes ~ '(^|,)young(,|$)' then
    v_extra := v_extra + (335 * v_days);
    v_note_parts := array_append(v_note_parts, 'Genç sürücü paketi');
  end if;
  if v_extra_codes ~ '(^|,)hgs(,|$)' then
    v_extra := v_extra + (140 * v_days);
    v_note_parts := array_append(v_note_parts, 'HGS');
  end if;
  if v_extra_codes ~ '(^|,)child(,|$)' then
    v_extra := v_extra + (167 * v_days);
    v_note_parts := array_append(v_note_parts, 'Çocuk koltuğu');
  end if;
  if v_extra_codes ~ '(^|,)winter(,|$)' then
    v_extra := v_extra + (279 * v_days);
    v_note_parts := array_append(v_note_parts, 'Kış lastiği');
  end if;
  v_total := round(v_model.daily_price_try * v_days + v_extra, 2);
  v_notes := nullif(array_to_string(v_note_parts, ', '), '');

  insert into public.rentals (
    pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,
    start_at, end_at, status, daily_price_try, deposit_try, total_price_try, flight_number, notes
  ) values (
    public.generate_pnr(),
    v_fleet,
    v_customer,
    v_pickup,
    v_dropoff,
    v_start,
    v_end,
    'bekliyor',
    v_model.daily_price_try,
    v_model.deposit_try,
    v_total,
    v_flight,
    v_notes
  )
  returning pnr into v_pnr;

  return (
    select jsonb_build_object(
      'pnr', r.pnr,
      'status', r.status,
      'vehicleName', vm.name,
      'plate', fv.plate,
      'pickup', po.name,
      'dropoff', doff.name,
      'startAt', r.start_at,
      'endAt', r.end_at,
      'dailyPrice', r.daily_price_try,
      'deposit', r.deposit_try,
      'totalPrice', r.total_price_try,
      'days', v_days,
      'flightNumber', r.flight_number,
      'notes', r.notes
    )
    from public.rentals r
    join public.fleet_vehicles fv on fv.id = r.fleet_vehicle_id
    join public.vehicle_models vm on vm.id = fv.model_id
    left join public.offices po on po.id = r.pickup_office_id
    left join public.offices doff on doff.id = r.dropoff_office_id
    where r.pnr = v_pnr
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- PNR + telefon sorgusu (yanlış telefonda da boş döner)
-- ---------------------------------------------------------------------------
create or replace function public.lookup_reservation(p_pnr text, p_phone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_pnr text := upper(trim(coalesce(p_pnr, '')));
  v_phone_key text := public.normalize_phone(p_phone);
  v_row jsonb;
begin
  if v_pnr !~ '^ZK[A-Z0-9]{4,12}$' or v_phone_key is null then
    return null;
  end if;

  select jsonb_build_object(
    'pnr', r.pnr,
    'status', r.status,
    'vehicleName', vm.name,
    'plate', fv.plate,
    'pickup', po.name,
    'dropoff', doff.name,
    'startAt', r.start_at,
    'endAt', r.end_at,
    'dailyPrice', r.daily_price_try,
    'deposit', r.deposit_try,
    'totalPrice', r.total_price_try,
    'days', greatest(1, ceil(extract(epoch from (r.end_at - r.start_at)) / 86400.0)::int),
    'flightNumber', r.flight_number
  )
  into v_row
  from public.rentals r
  join public.customers c on c.id = r.customer_id
  join public.fleet_vehicles fv on fv.id = r.fleet_vehicle_id
  join public.vehicle_models vm on vm.id = fv.model_id
  left join public.offices po on po.id = r.pickup_office_id
  left join public.offices doff on doff.id = r.dropoff_office_id
  where r.pnr = v_pnr
    and (
      c.phone_key = v_phone_key
      or public.normalize_phone(c.phone) = v_phone_key
    )
  limit 1;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- Giriş yapmış müşterinin kendi kayıtları
-- ---------------------------------------------------------------------------
create or replace function public.list_my_reservations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if v_uid is null then
    raise exception 'Oturum gerekli.';
  end if;

  return coalesce(
    (
      select jsonb_agg(item order by item ->> 'startAt' desc)
      from (
        select jsonb_build_object(
          'pnr', r.pnr,
          'status', r.status,
          'vehicleName', vm.name,
          'plate', fv.plate,
          'pickup', po.name,
          'dropoff', doff.name,
          'startAt', r.start_at,
          'endAt', r.end_at,
          'dailyPrice', r.daily_price_try,
          'deposit', r.deposit_try,
          'totalPrice', r.total_price_try,
          'days', greatest(1, ceil(extract(epoch from (r.end_at - r.start_at)) / 86400.0)::int),
          'flightNumber', r.flight_number
        ) as item
        from public.rentals r
        join public.customers c on c.id = r.customer_id
        join public.fleet_vehicles fv on fv.id = r.fleet_vehicle_id
        join public.vehicle_models vm on vm.id = fv.model_id
        left join public.offices po on po.id = r.pickup_office_id
        left join public.offices doff on doff.id = r.dropoff_office_id
        where c.auth_user_id = v_uid
           or (v_email <> '' and lower(c.email) = v_email)
        order by r.start_at desc
        limit 50
      ) s
    ),
    '[]'::jsonb
  );
end;
$$;

-- Bakımdan çıkınca açık kiralamaya göre durumu yeniden hesapla
create or replace function public.staff_release_vehicle(p_vehicle uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Yetkisiz.';
  end if;
  update public.fleet_vehicles
  set status = 'musait', last_status_at = now()
  where id = p_vehicle
    and status = 'bakimda';
  perform public.refresh_fleet_status(p_vehicle);
end;
$$;

-- ---------------------------------------------------------------------------
-- Yetkiler: iç fonksiyonlar anonim çağrıya kapalı
-- ---------------------------------------------------------------------------
revoke all on function public.refresh_fleet_status(uuid) from public, anon, authenticated;
revoke all on function public.normalize_phone(text) from public, anon, authenticated;
revoke all on function public.resolve_office_id(text) from public, anon, authenticated;
revoke all on function public.sync_fleet_status_from_rental() from public, anon, authenticated;

revoke all on function public.availability_by_model(timestamptz, timestamptz) from public;
drop function if exists public.create_public_reservation(text, text, text, timestamptz, timestamptz, text, text, text, text, text);
revoke all on function public.create_public_reservation(text, text, text, timestamptz, timestamptz, text, text, text, text, text, date, text) from public;
revoke all on function public.lookup_reservation(text, text) from public;
revoke all on function public.list_my_reservations() from public;
revoke all on function public.staff_release_vehicle(uuid) from public;

grant execute on function public.availability_by_model(timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.create_public_reservation(text, text, text, timestamptz, timestamptz, text, text, text, text, text, date, text) to anon, authenticated;
grant execute on function public.lookup_reservation(text, text) to anon, authenticated;
grant execute on function public.list_my_reservations() to authenticated;
grant execute on function public.staff_release_vehicle(uuid) to authenticated;

-- ===== content.sql =====
-- Panelden üretilen blog yazıları ve müşteri yorumları

create table if not exists public.site_posts (
  slug text primary key,
  title text not null,
  excerpt text not null default '',
  image text not null default '',
  blocks jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  location text not null,
  rating smallint not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists site_posts_created_idx on public.site_posts (created_at desc);
create index if not exists site_reviews_created_idx on public.site_reviews (created_at desc);

alter table public.site_posts enable row level security;
alter table public.site_reviews enable row level security;

drop policy if exists site_posts_public_read on public.site_posts;
create policy site_posts_public_read on public.site_posts
  for select
  using (true);

drop policy if exists site_posts_staff_write on public.site_posts;
create policy site_posts_staff_write on public.site_posts
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists site_reviews_public_read on public.site_reviews;
create policy site_reviews_public_read on public.site_reviews
  for select
  using (true);

drop policy if exists site_reviews_staff_write on public.site_reviews;
create policy site_reviews_staff_write on public.site_reviews
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.site_posts to anon, authenticated;
grant insert, update, delete on public.site_posts to authenticated;
grant select on public.site_reviews to anon, authenticated;
grant insert, update, delete on public.site_reviews to authenticated;

