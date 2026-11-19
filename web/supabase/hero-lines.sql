-- Ana sayfa hero cümleleri
-- Supabase Dashboard → SQL Editor → bir kez çalıştırın

create table if not exists public.site_hero_lines (
  id uuid primary key,
  before text not null,
  accent text not null default '',
  after text not null default '',
  sub text not null default '',
  tag text not null default '',
  pill boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.site_hero_lines enable row level security;

drop policy if exists site_hero_lines_public_read on public.site_hero_lines;
create policy site_hero_lines_public_read on public.site_hero_lines
  for select
  using (true);

drop policy if exists site_hero_lines_staff_write on public.site_hero_lines;
create policy site_hero_lines_staff_write on public.site_hero_lines
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.site_hero_lines to anon, authenticated;
grant insert, update, delete on public.site_hero_lines to authenticated;
