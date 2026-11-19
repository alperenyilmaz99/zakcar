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

-- Panelden gizlenen sabit bloglar ve anasayfa yorumları
create table if not exists public.site_hidden_content (
  kind text not null check (kind in ('post', 'review')),
  key text not null,
  created_at timestamptz not null default now(),
  primary key (kind, key)
);

alter table public.site_hidden_content enable row level security;

drop policy if exists site_hidden_content_public_read on public.site_hidden_content;
create policy site_hidden_content_public_read on public.site_hidden_content
  for select
  using (true);

drop policy if exists site_hidden_content_staff_write on public.site_hidden_content;
create policy site_hidden_content_staff_write on public.site_hidden_content
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.site_hidden_content to anon, authenticated;
grant insert, update, delete on public.site_hidden_content to authenticated;

-- Ana sayfa hero cümleleri. Ayrı dosya: web/supabase/hero-lines.sql
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

-- Footer hizmet bağlantıları. Ayrı dosya: web/supabase/footer-services.sql
create table if not exists public.site_footer_services (
  id text primary key,
  href text not null,
  label text not null default '',
  label_key text not null default '',
  sort_order integer not null default 0
);

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
