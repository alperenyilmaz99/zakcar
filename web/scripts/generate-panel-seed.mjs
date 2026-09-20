/**
 * vehicles.json → Supabase seed SQL üretir
 * Kullanım: node scripts/generate-panel-seed.mjs > supabase/seed-fleet.sql
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "vehicles.json"), "utf8"),
);

const vehicles = catalog.vehicles.slice(0, 40);

function esc(s) {
  if (s == null) return "";
  return String(s).replace(/'/g, "''");
}

function priceNum(p) {
  if (!p) return "null";
  const n = String(p).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const v = parseFloat(n);
  return Number.isFinite(v) ? v : "null";
}

const lines = [];
lines.push("-- ZakCar panel seed — SQL Editor'da çalıştırın");
lines.push("-- Model + filo + örnek konum");
lines.push("");

for (const [i, v] of vehicles.entries()) {
  const deposit = v.group === "SUV" || v.group === "Lüks" ? 18500 : 15540;
  lines.push(`insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary
) values (
  '${esc(v.slug)}',
  '${esc(v.name.replace(/\s*Araç Kiralama\s*$/i, ""))}',
  '${esc(v.brand)}',
  '${esc(v.brandSlug || "")}',
  '${esc(v.group || "Ekonomik")}',
  '${esc(v.fuel || "")}',
  '${esc(v.transmission || "")}',
  '${esc(v.capacity || "")}',
  ${priceNum(v.price)},
  ${deposit},
  '${esc(v.image || "")}',
  '${esc(v.banner || "")}',
  '${esc((v.summary || "").slice(0, 280))}'
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  image_url = excluded.image_url,
  updated_at = now();`);
  lines.push("");
}

lines.push(`-- Filo birimleri (her modelden 1 plaka)`);
lines.push(`do $$`);
lines.push(`declare`);
lines.push(`  r record;`);
lines.push(`  i int := 0;`);
lines.push(`  office uuid;`);
lines.push(`  statuses fleet_status[] := array['musait','kirada','rezerveli','bakimda']::fleet_status[];`);
lines.push(`  plates text[] := array['34 ABC 101','34 DEF 202','34 GHI 303','34 JKL 404','34 MNO 505','34 PRS 606','34 STU 707','34 VYZ 808'];`);
lines.push(`  fv_id uuid;`);
lines.push(`  st fleet_status;`);
lines.push(`  lat0 float; lng0 float;`);
lines.push(`begin`);
lines.push(`  select id into office from public.offices where code = 'saw' limit 1;`);
lines.push(`  for r in select id, slug from public.vehicle_models order by slug loop`);
lines.push(`    i := i + 1;`);
lines.push(`    if i > 36 then exit; end if;`);
lines.push(`    st := statuses[((i - 1) % 4) + 1];`);
lines.push(`    insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km)`);
lines.push(`    values (`);
lines.push(`      'FLT-' || lpad(i::text, 3, '0'),`);
lines.push(`      '34 ' || substr('ABCDEFGHJKLMNPRSTUVYZ', ((i-1)%20)+1, 1) || substr('ABCDEFGHJKLMNPRSTUVYZ', ((i*3)%20)+1, 1) || substr('ABCDEFGHJKLMNPRSTUVYZ', ((i*7)%20)+1, 1) || ' ' || lpad(((100 + i * 17) % 900)::text, 3, '0'),`);
lines.push(`      r.id,`);
lines.push(`      office,`);
lines.push(`      st,`);
lines.push(`      40 + (i * 13) % 55,`);
lines.push(`      8000 + i * 1500`);
lines.push(`    )`);
lines.push(`    on conflict (fleet_code) do nothing`);
lines.push(`    returning id into fv_id;`);
lines.push(`    if fv_id is null then`);
lines.push(`      select id into fv_id from public.fleet_vehicles where fleet_code = 'FLT-' || lpad(i::text, 3, '0');`);
lines.push(`    end if;`);
lines.push(`    select lat, lng into lat0, lng0 from public.offices where id = office;`);
lines.push(`    insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)`);
lines.push(`    values (`);
lines.push(`      fv_id,`);
lines.push(`      coalesce(lat0, 40.8986) + ((i % 7) - 3) * 0.01,`);
lines.push(`      coalesce(lng0, 29.3092) + ((i % 5) - 2) * 0.015,`);
lines.push(`      case when st = 'kirada' then 'SAW civarı · hareket halinde' else 'İstanbul Sabiha Gökçen Havalimanı (SAW)' end,`);
lines.push(`      now() - (i || ' hours')::interval`);
lines.push(`    )`);
lines.push(`    on conflict (fleet_vehicle_id) do update set`);
lines.push(`      lat = excluded.lat,`);
lines.push(`      lng = excluded.lng,`);
lines.push(`      location_label = excluded.location_label,`);
lines.push(`      recorded_at = excluded.recorded_at,`);
lines.push(`      updated_at = now();`);
lines.push(`  end loop;`);
lines.push(`end $$;`);
lines.push("");

lines.push(`-- Örnek müşteri + kiralama`);
lines.push(`insert into public.customers (full_name, phone, email, license_no)`);
lines.push(`select 'Ahmet Yılmaz', '0532 111 22 33', 'ahmet.yilmaz@email.com', '34ABC12345'`);
lines.push(`where not exists (select 1 from public.customers where phone = '0532 111 22 33');`);
lines.push("");
lines.push(`insert into public.customers (full_name, phone, email, license_no)`);
lines.push(`select 'Elif Demir', '0533 222 33 44', 'elif.demir@email.com', '06DEF67890'`);
lines.push(`where not exists (select 1 from public.customers where phone = '0533 222 33 44');`);
lines.push("");
lines.push(`insert into public.rentals (`);
lines.push(`  pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,`);
lines.push(`  start_at, end_at, status, daily_price_try, deposit_try, notes`);
lines.push(`)`);
lines.push(`select`);
lines.push(`  public.generate_pnr(),`);
lines.push(`  fv.id,`);
lines.push(`  c.id,`);
lines.push(`  o.id,`);
lines.push(`  o.id,`);
lines.push(`  now() - interval '1 day',`);
lines.push(`  now() + interval '2 days',`);
lines.push(`  'aktif',`);
lines.push(`  coalesce(vm.daily_price_try, 1450),`);
lines.push(`  coalesce(vm.deposit_try, 15540),`);
lines.push(`  'Uçuş SAW — terminal karşılama'`);
lines.push(`from public.fleet_vehicles fv`);
lines.push(`join public.vehicle_models vm on vm.id = fv.model_id`);
lines.push(`join public.customers c on c.phone = '0532 111 22 33'`);
lines.push(`join public.offices o on o.code = 'saw'`);
lines.push(`where fv.status = 'kirada'`);
lines.push(`limit 1`);
lines.push(`on conflict (pnr) do nothing;`);
lines.push("");
lines.push(`insert into public.rentals (`);
lines.push(`  pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,`);
lines.push(`  start_at, end_at, status, daily_price_try, deposit_try`);
lines.push(`)`);
lines.push(`select`);
lines.push(`  public.generate_pnr(),`);
lines.push(`  fv.id,`);
lines.push(`  c.id,`);
lines.push(`  o.id,`);
lines.push(`  o.id,`);
lines.push(`  now() + interval '1 day',`);
lines.push(`  now() + interval '4 days',`);
lines.push(`  'bekliyor',`);
lines.push(`  coalesce(vm.daily_price_try, 1200),`);
lines.push(`  coalesce(vm.deposit_try, 15540)`);
lines.push(`from public.fleet_vehicles fv`);
lines.push(`join public.vehicle_models vm on vm.id = fv.model_id`);
lines.push(`join public.customers c on c.phone = '0533 222 33 44'`);
lines.push(`join public.offices o on o.code = 'saw'`);
lines.push(`where fv.status = 'rezerveli'`);
lines.push(`limit 1`);
lines.push(`on conflict (pnr) do nothing;`);

const out = path.join(__dirname, "..", "supabase", "seed-fleet.sql");
fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log(`Wrote ${out} (${vehicles.length} models)`);
