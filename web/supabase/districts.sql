-- Panelden eklenen semtler
-- Supabase Dashboard → SQL Editor → çalıştırın

create table if not exists public.site_districts (
  slug text primary key,
  name text not null,
  side text not null check (side in ('avrupa', 'anadolu')),
  pickup text not null check (pickup in ('saw', 'iga')),
  area text not null,
  around text not null,
  drive text not null,
  created_at timestamptz not null default now()
);

alter table public.site_districts enable row level security;

drop policy if exists site_districts_public_read on public.site_districts;
create policy site_districts_public_read on public.site_districts
  for select
  using (true);

drop policy if exists site_districts_staff_write on public.site_districts;
create policy site_districts_staff_write on public.site_districts
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.site_districts to anon, authenticated;
grant insert, update, delete on public.site_districts to authenticated;
