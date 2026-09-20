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
