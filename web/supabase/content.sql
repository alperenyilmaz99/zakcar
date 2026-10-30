-- Panelden üretilen blog yazıları ve müşteri yorumları
-- Supabase Dashboard → SQL Editor → çalıştırın

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
