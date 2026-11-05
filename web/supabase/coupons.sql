-- Panelden tanımlanan yüzde indirim kuponları
-- Supabase Dashboard → SQL Editor → bir kez çalıştırın
-- Anon anahtar kupon listesini okuyamaz. Yüzde, yalnızca kod eşleşince döner.

create table if not exists public.discount_coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent integer not null check (percent between 1 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.discount_coupons enable row level security;

drop policy if exists staff_all_coupons on public.discount_coupons;
create policy staff_all_coupons on public.discount_coupons
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select, insert, update, delete on public.discount_coupons to authenticated;

create or replace function public.coupon_percent(p_code text)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select percent
    from public.discount_coupons
    where is_active
      and upper(code) = upper(trim(coalesce(p_code, '')))
    limit 1
  ), 0);
$$;

create or replace function public.apply_reservation_coupon(
  p_pnr text,
  p_phone text,
  p_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pnr text := upper(trim(coalesce(p_pnr, '')));
  v_phone_key text := public.normalize_phone(p_phone);
  v_code text := upper(trim(coalesce(p_code, '')));
  v_percent integer;
  v_rental public.rentals%rowtype;
  v_base numeric(12, 2);
  v_discount numeric(12, 2);
  v_total numeric(12, 2);
  v_notes text;
begin
  if v_pnr !~ '^ZK[A-Z0-9]{4,12}$' or v_phone_key is null then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  select r.* into v_rental
  from public.rentals r
  join public.customers c on c.id = r.customer_id
  where r.pnr = v_pnr
    and (
      c.phone_key = v_phone_key
      or public.normalize_phone(c.phone) = v_phone_key
    )
  limit 1;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  if v_rental.status <> 'bekliyor' or v_rental.created_at < now() - interval '30 minutes' then
    raise exception 'Kupon bu rezervasyona uygulanamıyor.';
  end if;

  if coalesce(v_rental.notes, '') ~* 'Kupon ' then
    return jsonb_build_object(
      'totalPrice', v_rental.total_price_try,
      'notes', v_rental.notes,
      'percent', 0
    );
  end if;

  v_percent := public.coupon_percent(v_code);
  if v_percent < 1 or v_percent > 100 then
    raise exception 'Kupon kodu geçersiz.';
  end if;

  v_base := coalesce(v_rental.total_price_try, 0);
  v_discount := round(v_base * v_percent / 100.0, 2);
  v_total := greatest(0, round(v_base - v_discount, 2));
  v_notes := nullif(
    concat_ws(', ', nullif(v_rental.notes, ''), 'Kupon ' || v_code || ' %' || v_percent::text),
    ''
  );

  update public.rentals
  set total_price_try = v_total,
      notes = v_notes
  where id = v_rental.id;

  return jsonb_build_object(
    'totalPrice', v_total,
    'notes', v_notes,
    'percent', v_percent,
    'discount', v_discount
  );
end;
$$;

revoke all on function public.coupon_percent(text) from public;
revoke all on function public.apply_reservation_coupon(text, text, text) from public;
grant execute on function public.coupon_percent(text) to anon, authenticated;
grant execute on function public.apply_reservation_coupon(text, text, text) to anon, authenticated;
