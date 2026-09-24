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
