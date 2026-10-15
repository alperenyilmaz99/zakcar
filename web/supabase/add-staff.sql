-- 1) Authentication → Users → Add user (email + password)
-- 2) Users listesinden UUID'yi kopyala
-- 3) Aşağıya yapıştırıp çalıştır

insert into public.staff_profiles (id, full_name, email, role, is_active)
values (
  'ee67f055-de10-476a-93b2-c1c2bb5c8831',
  'Panel Admin',
  'alperenylmz1071@gmail.com',
  'admin',
  true
)
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  is_active = true,
  updated_at = now();
