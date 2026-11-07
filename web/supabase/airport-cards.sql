-- Havalimanı kartları: görsel, başlık, kart metni ve detay yazısı
-- Supabase Dashboard → SQL Editor → çalıştırın

create table if not exists public.airport_cards (
  id text primary key,
  image_url text not null,
  href text not null,
  title text not null default '',
  summary text not null default '',
  detail text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.airport_cards enable row level security;

drop policy if exists airport_cards_public_read on public.airport_cards;
create policy airport_cards_public_read on public.airport_cards
  for select
  using (true);

drop policy if exists airport_cards_staff_write on public.airport_cards;
create policy airport_cards_staff_write on public.airport_cards
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.airport_cards to anon, authenticated;
grant insert, update, delete on public.airport_cards to authenticated;

insert into public.airport_cards (id, image_url, href, title, summary, detail, sort_order)
select * from (values
  ('saw', '/assets/hero/saw.jpg', '/sabiha-gokcen-havalimani-arac-kiralama', 'Sabiha Gökçen Havalimanı', 'Gece gündüz teslim. Karşılama ve evrak birkaç dakika sürer.', '', 0),
  ('iga', '/assets/hero/iga.jpg', '/istanbul-3-havalimani-arac-kiralama', 'İstanbul Havalimanı', 'Aracınız sizi bekler. Teslim ücretsizdir, ödeme araç başında yapılır.', '', 1),
  ('saw-card', '/assets/hero/saw.jpg', '/sabiha-gokcen-havalimani-kredi-kartsiz-arac-kiralama', 'Sabiha Gökçen Havalimanı Kredi Kartsız Araç Kiralama', 'Kredi kartı ve Findeks yok. Ödeme teslimde nakit veya banka kartıyla yapılır.', '', 2),
  ('iga-card', '/assets/hero/iga.jpg', '/iga-havalimani-kredi-kartsiz-arac-kiralama', 'IGA Havalimanı Kredi Kartsız Araç Kiralama', 'Kart limiti bloke edilmez. Ödeme araç başında, teslim ücretsizdir.', '', 3)
) as seed(id, image_url, href, title, summary, detail, sort_order)
where not exists (select 1 from public.airport_cards);
