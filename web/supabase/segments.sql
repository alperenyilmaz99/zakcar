-- Ana sayfa segment görselleri
-- Supabase Dashboard → SQL Editor → çalıştırın

create table if not exists public.site_segments (
  id text primary key,
  image_url text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_segments enable row level security;

drop policy if exists site_segments_public_read on public.site_segments;
create policy site_segments_public_read on public.site_segments
  for select
  using (true);

drop policy if exists site_segments_staff_write on public.site_segments;
create policy site_segments_staff_write on public.site_segments
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.site_segments to anon, authenticated;
grant insert, update, delete on public.site_segments to authenticated;
