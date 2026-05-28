/*
============================================================
File: tests/rls/verifgo-foundation.test.sql
Project: BizPilot AI / VerifGo QC
Description: RLS tests for VerifGo driver-owned records and immutable submitted reports.
Role: Prevents cross-driver reads and submitted report mutation.
Related:
- supabase/migrations/0022_verifgo_foundation.sql
Author: MoOoH
Created: 2026-05-28
============================================================
*/

begin;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'f1000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated', 'verifgo-driver-a@example.test', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f1000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated', 'verifgo-driver-b@example.test', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  );

insert into public.verifgo_profiles (id, user_id, display_name, preferred_language)
values
  (
    'f2000000-0000-0000-0000-000000000001',
    'f1000000-0000-0000-0000-000000000001',
    'Driver A',
    'en'
  ),
  (
    'f2000000-0000-0000-0000-000000000002',
    'f1000000-0000-0000-0000-000000000002',
    'Driver B',
    'fr'
  );

insert into public.verifgo_vehicles (
  id, user_id, plate_number, accessory_number, vehicle_use, powertrain, photo_path, is_default
)
values
  (
    'f3000000-0000-0000-0000-000000000001',
    'f1000000-0000-0000-0000-000000000001',
    'AAA111',
    'ACC-A',
    'rideshare',
    'hybrid',
    null,
    true
  ),
  (
    'f3000000-0000-0000-0000-000000000002',
    'f1000000-0000-0000-0000-000000000002',
    'BBB222',
    'ACC-B',
    'taxi',
    'gas',
    null,
    true
  );

insert into public.verifgo_smart_reminder_settings (
  id,
  user_id,
  premium_smart_notifications_enabled,
  timezone
)
values
  (
    'f3500000-0000-0000-0000-000000000001',
    'f1000000-0000-0000-0000-000000000001',
    true,
    'America/Toronto'
  ),
  (
    'f3500000-0000-0000-0000-000000000002',
    'f1000000-0000-0000-0000-000000000002',
    false,
    'America/Toronto'
  );

insert into public.verifgo_daily_reports (
  id,
  user_id,
  vehicle_id,
  template_id,
  report_date,
  plate_number_snapshot,
  odometer_reading,
  no_defect_declared,
  all_required_items_confirmed,
  report_hash,
  status,
  sync_status
)
select
  'f4000000-0000-0000-0000-000000000001',
  'f1000000-0000-0000-0000-000000000001',
  'f3000000-0000-0000-0000-000000000001',
  template.id,
  current_date,
  'AAA111',
  12345,
  true,
  true,
  'hash-a',
  'submitted',
  'synced'
from public.verifgo_inspection_templates template
where template.version = 'qc-v1';

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f1000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  visible_vehicle_count integer;
  visible_report_count integer;
  visible_smart_setting_count integer;
begin
  select count(*) into visible_vehicle_count
  from public.verifgo_vehicles;

  if visible_vehicle_count <> 1 then
    raise exception 'Driver A should see exactly one vehicle, saw %', visible_vehicle_count;
  end if;

  select count(*) into visible_report_count
  from public.verifgo_daily_reports;

  if visible_report_count <> 1 then
    raise exception 'Driver A should see exactly one report, saw %', visible_report_count;
  end if;

  select count(*) into visible_smart_setting_count
  from public.verifgo_smart_reminder_settings;

  if visible_smart_setting_count <> 1 then
    raise exception 'Driver A should see exactly one smart reminder setting, saw %', visible_smart_setting_count;
  end if;
end $$;

do $$
begin
  update public.verifgo_daily_reports
  set odometer_reading = 99999
  where id = 'f4000000-0000-0000-0000-000000000001';

  raise exception 'Submitted report update should have failed';
exception
  when raise_exception then
    if sqlerrm = 'Submitted report update should have failed' then
      raise;
    end if;
end $$;

rollback;
