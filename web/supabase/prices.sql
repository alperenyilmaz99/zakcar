-- Günlük fiyat ve depozitoyu sıfırlar.
-- Site, panelden kaydedilen bu tutarları okuyabilsin diye anon okuma açılır.
-- Supabase SQL Editor'da bir kez çalıştırın. Sonra fiyatları panelden girin.

grant select on public.vehicle_models to anon;

drop policy if exists public_read_models on public.vehicle_models;
create policy public_read_models on public.vehicle_models
  for select
  to anon, authenticated
  using (is_active = true);

update public.vehicle_models
set daily_price_try = 0,
    deposit_try = 0;
