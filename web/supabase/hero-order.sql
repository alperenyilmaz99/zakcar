-- Ana sayfa slogan sırası. Hazır cümleler m1–m5, eklenen cümleler kendi kimliğiyle durur.
-- Supabase Dashboard → SQL Editor → bir kez çalıştırın

create table if not exists public.site_hero_order (
  line_id text primary key,
  sort_order integer not null
);

alter table public.site_hero_order enable row level security;

drop policy if exists site_hero_order_public_read on public.site_hero_order;
create policy site_hero_order_public_read on public.site_hero_order
  for select
  using (true);

drop policy if exists site_hero_order_staff_write on public.site_hero_order;
create policy site_hero_order_staff_write on public.site_hero_order
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.site_hero_order to anon, authenticated;
grant insert, update, delete on public.site_hero_order to authenticated;
