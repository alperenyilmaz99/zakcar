-- Panel view'ları + yetkiler
-- SQL Editor'da bir kez çalıştırın (seed'den bağımsız)

create or replace view public.v_fleet_board as
select
  fv.id,
  fv.fleet_code,
  fv.plate,
  fv.status,
  fv.fuel_level,
  fv.odometer_km,
  fv.last_status_at,
  vm.slug as model_slug,
  vm.name as model_name,
  vm.brand,
  vm.vehicle_group,
  vm.image_url,
  o.name as office_name,
  o.code as office_code,
  vl.lat,
  vl.lng,
  vl.location_label,
  vl.recorded_at as location_updated_at
from public.fleet_vehicles fv
join public.vehicle_models vm on vm.id = fv.model_id
left join public.offices o on o.id = fv.home_office_id
left join public.vehicle_locations vl on vl.fleet_vehicle_id = fv.id;

create or replace view public.v_rentals_board as
select
  r.id,
  r.pnr,
  r.status,
  r.start_at,
  r.end_at,
  r.daily_price_try,
  r.deposit_try,
  r.total_price_try,
  r.flight_number,
  r.notes,
  r.created_at,
  c.full_name as customer_name,
  c.phone as customer_phone,
  c.email as customer_email,
  c.license_no as customer_license_no,
  fv.plate,
  fv.fleet_code,
  vm.name as vehicle_name,
  po.name as pickup_office,
  doff.name as dropoff_office
from public.rentals r
join public.customers c on c.id = r.customer_id
join public.fleet_vehicles fv on fv.id = r.fleet_vehicle_id
join public.vehicle_models vm on vm.id = fv.model_id
left join public.offices po on po.id = r.pickup_office_id
left join public.offices doff on doff.id = r.dropoff_office_id;

create or replace view public.v_panel_stats as
select
  (select count(*) from public.fleet_vehicles) as total,
  (select count(*) from public.fleet_vehicles where status = 'musait') as musait,
  (select count(*) from public.fleet_vehicles where status = 'kirada') as kirada,
  (select count(*) from public.fleet_vehicles where status = 'rezerveli') as rezerveli,
  (select count(*) from public.fleet_vehicles where status = 'bakimda') as bakimda,
  (select count(*) from public.rentals where status = 'aktif') as aktif_kiralama,
  (select count(*) from public.rentals where start_at::date = current_date) as bugun_teslim,
  (select count(*) from public.rentals where end_at::date = current_date) as bugun_iade;

alter view public.v_fleet_board set (security_invoker = true);
alter view public.v_rentals_board set (security_invoker = true);
alter view public.v_panel_stats set (security_invoker = true);

grant select on public.v_fleet_board to authenticated;
grant select on public.v_rentals_board to authenticated;
grant select on public.v_panel_stats to authenticated;

-- Hızlı kontrol
select * from public.v_panel_stats;
