-- Panel bağlandıktan sonra bir kez çalıştırın (SQL Editor)
-- View'ların RLS ile çalışması + authenticated yetkileri

alter view public.v_fleet_board set (security_invoker = true);
alter view public.v_rentals_board set (security_invoker = true);
alter view public.v_panel_stats set (security_invoker = true);

grant usage on schema public to authenticated;
grant select on public.v_fleet_board to authenticated;
grant select on public.v_rentals_board to authenticated;
grant select on public.v_panel_stats to authenticated;

grant select, insert, update, delete on public.offices to authenticated;
grant select, insert, update, delete on public.vehicle_models to authenticated;
grant select, insert, update, delete on public.fleet_vehicles to authenticated;
grant select, insert, update, delete on public.vehicle_locations to authenticated;
grant select on public.vehicle_location_history to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.rentals to authenticated;
grant select, update on public.staff_profiles to authenticated;

grant usage, select on all sequences in schema public to authenticated;
