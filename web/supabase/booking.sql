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
