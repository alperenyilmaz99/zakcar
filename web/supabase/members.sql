-- Panelde siteye üye olan hesaplar
-- Supabase Dashboard → SQL Editor → bir kez çalıştırın
-- Liste yalnızca aktif personel hesabından okunur. Üye şifreleri dönmez.

create or replace function public.list_site_members()
returns table (
  id uuid,
  email text,
  full_name text,
  phone text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed boolean,
  rental_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Personel oturumu gerekli.';
  end if;

  return query
  select
    u.id,
    u.email::text,
    coalesce(
      nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(c.full_name), ''),
      ''
    ) as full_name,
    nullif(trim(c.phone), '') as phone,
    u.created_at,
    u.last_sign_in_at,
    (u.email_confirmed_at is not null) as email_confirmed,
    coalesce((
      select count(*)::bigint
      from public.rentals r
      join public.customers cust on cust.id = r.customer_id
      where cust.auth_user_id = u.id
         or (
           u.email is not null
           and lower(coalesce(cust.email, '')) = lower(u.email::text)
         )
    ), 0) as rental_count
  from auth.users u
  left join lateral (
    select cust.full_name, cust.phone
    from public.customers cust
    where cust.auth_user_id = u.id
       or (
         u.email is not null
         and lower(coalesce(cust.email, '')) = lower(u.email::text)
       )
    order by (cust.auth_user_id = u.id) desc, cust.created_at desc
    limit 1
  ) c on true
  where not exists (
    select 1 from public.staff_profiles s where s.id = u.id
  )
  order by u.created_at desc;
end;
$$;

revoke all on function public.list_site_members() from public, anon;
grant execute on function public.list_site_members() to authenticated;
