-- 1) Authentication → Users → Add user (email + password)
-- 2) Users listesinden UUID'yi kopyala
-- 3) Aşağıya yapıştırıp çalıştır

insert into public.staff_profiles (id, full_name, email, role, is_active)
values (
  'BURAYA-USER-UUID',  -- örn: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  'Panel Admin',
  'personel@zakcar.com',
  'admin',
  true
)
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  is_active = true,
  updated_at = now();
