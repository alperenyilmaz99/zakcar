-- Footer hizmet bağlantıları
-- Supabase Dashboard → SQL Editor → bir kez çalıştırın

create table if not exists public.site_footer_services (
  id text primary key,
  href text not null,
  label text not null default '',
  label_key text not null default '',
  body text not null default '',
  sort_order integer not null default 0
);

alter table public.site_footer_services add column if not exists body text not null default '';

alter table public.site_footer_services enable row level security;

drop policy if exists site_footer_services_public_read on public.site_footer_services;
create policy site_footer_services_public_read on public.site_footer_services
  for select
  using (true);

drop policy if exists site_footer_services_staff_write on public.site_footer_services;
create policy site_footer_services_staff_write on public.site_footer_services
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.site_footer_services to anon, authenticated;
grant insert, update, delete on public.site_footer_services to authenticated;
