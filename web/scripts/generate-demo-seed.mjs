/**
 * Sunum için zengin mock seed üretir → supabase/seed-demo.sql
 * node scripts/generate-demo-seed.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "vehicles.json"), "utf8"),
);

const vehicles = catalog.vehicles.slice(0, 36);

function esc(s) {
  return String(s ?? "").replace(/'/g, "''");
}

function priceNum(p) {
  if (!p) return "null";
  const n = String(p).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const v = parseFloat(n);
  return Number.isFinite(v) ? v : "null";
}

function plateFor(i) {
  const series = ["ABC", "DEF", "GHI", "JKL", "MNO", "PRS", "STU", "VYZ"][i % 8];
  const num = String(100 + ((i * 37) % 900)).padStart(3, "0");
  return `34 ${series} ${num}`;
}

function statusFor(i) {
  // ~1/3 kirada, ~1/5 rezerveli, az bakım, kalan müsait
  if (i % 7 === 0) return "bakimda";
  if (i % 3 === 0) return "kirada";
  if (i % 5 === 0) return "rezerveli";
  return "musait";
}

const OFFICES = [
  { code: "saw", name: "İstanbul Sabiha Gökçen Havalimanı (SAW)", address: "Sabiha Gökçen Havalimanı, Pendik / İstanbul", lat: 40.8986, lng: 29.3092, hours: "7/24" },
  { code: "ist", name: "İstanbul Havalimanı (IST)", address: "İstanbul Havalimanı, Arnavutköy / İstanbul", lat: 41.2753, lng: 28.7519, hours: "7/24" },
  { code: "merkez", name: "ZakCar Merkez Ofis", address: "Sabiha Gökçen Havalimanı Karşısı", lat: 40.878, lng: 29.257, hours: "08:00 - 22:00" },
  { code: "kadikoy", name: "Kadıköy Ofis", address: "Caferağa Mah. Moda Cad. Kadıköy / İstanbul", lat: 40.9901, lng: 29.029, hours: "09:00 - 20:00" },
  { code: "besiktas", name: "Beşiktaş Ofis", address: "Sinanpaşa Mah. Beşiktaş / İstanbul", lat: 41.0422, lng: 29.0067, hours: "09:00 - 20:00" },
];

const CUSTOMERS = [
  { name: "Ahmet Yılmaz", phone: "0532 111 22 33", email: "ahmet.yilmaz@email.com", license: "34ABC12345" },
  { name: "Elif Demir", phone: "0533 222 33 44", email: "elif.demir@email.com", license: "06DEF67890" },
  { name: "Mehmet Kaya", phone: "0542 333 44 55", email: "mehmet.kaya@email.com", license: "35GHI11223" },
  { name: "Zeynep Arslan", phone: "0555 444 55 66", email: "zeynep.arslan@email.com", license: "16JKL44556" },
  { name: "Can Öztürk", phone: "0536 555 66 77", email: "can.ozturk@email.com", license: "41MNO77889" },
  { name: "Selin Aksoy", phone: "0544 666 77 88", email: "selin.aksoy@email.com", license: "07PQR99001" },
  { name: "Burak Çelik", phone: "0530 777 88 99", email: "burak.celik@email.com", license: "34STU22334" },
  { name: "Ayşe Kara", phone: "0537 888 99 00", email: "ayse.kara@email.com", license: "26VWX55667" },
];

const lines = [];
lines.push("-- =============================================================================");
lines.push("-- ZakCar Personel Paneli — SUNUM DEMO SEED");
lines.push("-- Supabase SQL Editor'da tek seferde çalıştırın.");
lines.push("-- Güvenli: mevcut staff_profiles'a dokunmaz. Filo/kiralama demo verisini yeniler.");
lines.push("-- =============================================================================");
lines.push("");
lines.push("begin;");
lines.push("");
lines.push("-- Eski demo kiralamaları / konumları temizle (staff hariç)");
lines.push("delete from public.rentals;");
lines.push("delete from public.vehicle_location_history;");
lines.push("delete from public.vehicle_locations;");
lines.push("delete from public.fleet_vehicles;");
lines.push("delete from public.customers where phone like '053%' or phone like '054%' or phone like '055%';");
lines.push("");

lines.push("-- Ofisler");
for (const o of OFFICES) {
  lines.push(`insert into public.offices (code, name, address, phone, email, hours, lat, lng, is_active)
values ('${o.code}', '${esc(o.name)}', '${esc(o.address)}', '0532 388 29 96', 'info@zakcar.com', '${o.hours}', ${o.lat}, ${o.lng}, true)
on conflict (code) do update set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  is_active = true;`);
  lines.push("");
}

lines.push("-- Araç modelleri (katalogdan)");
for (const v of vehicles) {
  const deposit = v.group === "SUV" || v.group === "Lüks" ? 18500 : 15540;
  lines.push(`insert into public.vehicle_models (
  slug, name, brand, brand_slug, vehicle_group, fuel, transmission, capacity,
  daily_price_try, deposit_try, image_url, banner_url, summary, is_active
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
  '${esc((v.summary || "").slice(0, 240))}',
  true
) on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  vehicle_group = excluded.vehicle_group,
  daily_price_try = excluded.daily_price_try,
  deposit_try = excluded.deposit_try,
  image_url = excluded.image_url,
  is_active = true,
  updated_at = now();`);
  lines.push("");
}

lines.push("-- Müşteriler");
for (const c of CUSTOMERS) {
  lines.push(`insert into public.customers (full_name, phone, email, license_no)
select '${esc(c.name)}', '${c.phone}', '${esc(c.email)}', '${c.license}'
where not exists (select 1 from public.customers where phone = '${c.phone}');`);
  lines.push("");
}

lines.push("-- Filo + konum");
lines.push("do $$");
lines.push("declare");
lines.push("  mid uuid;");
lines.push("  oid uuid;");
lines.push("  olat float; olng float; oname text;");
lines.push("  fv_id uuid;");
lines.push("  lat1 float; lng1 float;");
lines.push("  label text;");
lines.push("begin");

for (let i = 0; i < vehicles.length; i++) {
  const v = vehicles[i];
  const st = statusFor(i);
  const plate = plateFor(i);
  const code = `FLT-${String(i + 1).padStart(3, "0")}`;
  const officeCode = OFFICES[i % OFFICES.length].code;
  const fuel = 35 + ((i * 17) % 60);
  const km = 12000 + i * 1843;
  const onRoad = st === "kirada";
  const dLat = onRoad ? (((i * 17) % 20) - 10) * 0.008 : (((i * 3) % 10) - 5) * 0.001;
  const dLng = onRoad ? (((i * 29) % 24) - 12) * 0.01 : (((i * 5) % 10) - 5) * 0.0015;

  lines.push(`  -- ${code} ${plate}`);
  lines.push(`  select id, lat, lng, name into oid, olat, olng, oname from public.offices where code = '${officeCode}';`);
  lines.push(`  select id into mid from public.vehicle_models where slug = '${esc(v.slug)}';`);
  lines.push(`  insert into public.fleet_vehicles (fleet_code, plate, model_id, home_office_id, status, fuel_level, odometer_km, last_status_at)`);
  lines.push(`  values ('${code}', '${plate}', mid, oid, '${st}', ${fuel}, ${km}, now() - interval '${(i % 8) + 1} hours')`);
  lines.push(`  returning id into fv_id;`);
  lines.push(`  lat1 := coalesce(olat, 40.8986) + ${dLat.toFixed(5)};`);
  lines.push(`  lng1 := coalesce(olng, 29.3092) + ${dLng.toFixed(5)};`);
  if (onRoad) {
    lines.push(`  label := trim(split_part(coalesce(oname,''), '(', 1)) || ' civarı · hareket halinde';`);
  } else {
    lines.push(`  label := coalesce(oname, 'Ofis');`);
  }
  lines.push(`  insert into public.vehicle_locations (fleet_vehicle_id, lat, lng, location_label, recorded_at)`);
  lines.push(`  values (fv_id, lat1, lng1, label, now() - interval '${((i % 8) + 0.2).toFixed(1)} hours');`);
  lines.push("");
}

lines.push("end $$;");
lines.push("");

lines.push("-- Kiralamalar: kirada + rezerveli araçlara müşteri bağla");
lines.push("do $$");
lines.push("declare");
lines.push("  fv record;");
lines.push("  v_cust uuid;");
lines.push("  v_pick uuid;");
lines.push("  v_drop uuid;");
lines.push("  v_i int := 0;");
lines.push("  phones text[] := array[");
lines.push(CUSTOMERS.map((c) => `'${c.phone}'`).join(", "));
lines.push("  ];");
lines.push("  v_pnr text;");
lines.push("  v_active boolean;");
lines.push("  v_price numeric;");
lines.push("  v_dep numeric;");
lines.push("begin");
lines.push("  for fv in");
lines.push("    select f.id, f.status, f.home_office_id, vm.daily_price_try, vm.deposit_try");
lines.push("    from public.fleet_vehicles f");
lines.push("    join public.vehicle_models vm on vm.id = f.model_id");
lines.push("    where f.status in ('kirada', 'rezerveli')");
lines.push("    order by f.fleet_code");
lines.push("  loop");
lines.push("    v_i := v_i + 1;");
lines.push("    select id into v_cust from public.customers where phone = phones[((v_i - 1) % array_length(phones, 1)) + 1];");
lines.push("    v_pick := fv.home_office_id;");
lines.push("    select id into v_drop from public.offices where code = (array['saw','ist','kadikoy','besiktas','merkez'])[((v_i + 1) % 5) + 1];");
lines.push("    v_active := fv.status = 'kirada';");
lines.push("    v_pnr := 'ZK' || lpad((2400 + v_i * 13)::text, 6, '0');");
lines.push("    v_price := coalesce(fv.daily_price_try, 1200 + (v_i % 5) * 350);");
lines.push("    v_dep := coalesce(fv.deposit_try, 15540);");
lines.push("    insert into public.rentals (");
lines.push("      pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,");
lines.push("      start_at, end_at, status, daily_price_try, deposit_try, total_price_try, notes");
lines.push("    ) values (");
lines.push("      v_pnr,");
lines.push("      fv.id,");
lines.push("      v_cust,");
lines.push("      v_pick,");
lines.push("      v_drop,");
lines.push("      case when v_active then now() - interval '2 days' else now() + interval '1 day' end,");
lines.push("      case when v_active then now() + interval '2 days' else now() + interval '4 days' end,");
lines.push("      case when v_active then 'aktif'::rental_status else 'bekliyor'::rental_status end,");
lines.push("      v_price,");
lines.push("      v_dep,");
lines.push("      v_price * 3,");
lines.push("      case when v_i % 4 = 1 then 'Uçuş SAW — terminal karşılama' else null end");
lines.push("    ) on conflict (pnr) do nothing;");
lines.push("  end loop;");
lines.push("");
lines.push("  -- Tamamlanmış + iptal örnekleri");
lines.push("  insert into public.rentals (");
lines.push("    pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,");
lines.push("    start_at, end_at, status, daily_price_try, deposit_try, total_price_try");
lines.push("  )");
lines.push("  select 'ZK002180', f.id, c.id, o.id, o.id,");
lines.push("    now() - interval '8 days', now() - interval '5 days', 'tamamlandi', 1450, 15540, 4350");
lines.push("  from public.fleet_vehicles f");
lines.push("  cross join lateral (select id from public.customers where phone = '0532 111 22 33' limit 1) c");
lines.push("  cross join lateral (select id from public.offices where code = 'saw' limit 1) o");
lines.push("  order by f.fleet_code limit 1");
lines.push("  on conflict (pnr) do nothing;");
lines.push("");
lines.push("  insert into public.rentals (");
lines.push("    pnr, fleet_vehicle_id, customer_id, pickup_office_id, dropoff_office_id,");
lines.push("    start_at, end_at, status, daily_price_try, deposit_try, notes");
lines.push("  )");
lines.push("  select 'ZK002201', f.id, c.id, o1.id, o2.id,");
lines.push("    now() - interval '3 days', now() - interval '3 days' + interval '2 hours', 'iptal', 1200, 15540,");
lines.push("    'Müşteri iptali — 24 saat kala'");
lines.push("  from public.fleet_vehicles f");
lines.push("  cross join lateral (select id from public.customers where phone = '0555 444 55 66' limit 1) c");
lines.push("  cross join lateral (select id from public.offices where code = 'ist' limit 1) o1");
lines.push("  cross join lateral (select id from public.offices where code = 'kadikoy' limit 1) o2");
lines.push("  order by f.fleet_code desc limit 1");
lines.push("  on conflict (pnr) do nothing;");
lines.push("end $$;");
lines.push("");
lines.push("commit;");
lines.push("");
lines.push("-- Kontrol (view yoksa da çalışır)");
lines.push("select 'offices' as t, count(*)::bigint as n from public.offices");
lines.push("union all select 'models', count(*) from public.vehicle_models");
lines.push("union all select 'fleet', count(*) from public.fleet_vehicles");
lines.push("union all select 'locations', count(*) from public.vehicle_locations");
lines.push("union all select 'customers', count(*) from public.customers");
lines.push("union all select 'rentals', count(*) from public.rentals;");

const out = path.join(__dirname, "..", "supabase", "seed-demo.sql");
fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log(`Wrote ${out}`);
console.log(`models=${vehicles.length} offices=${OFFICES.length} customers=${CUSTOMERS.length}`);
