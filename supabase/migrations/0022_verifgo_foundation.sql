/*
============================================================
File: supabase/migrations/0022_verifgo_foundation.sql
Project: BizPilot AI / VerifGo QC
Description: Adds the VerifGo QC app-first compliance foundation.
Role: Creates driver-owned vehicles, versioned inspection templates, immutable daily reports, defects, corrections, subscriptions, and audit events.
Related:
- docs/verifgo/MASTER_BLUEPRINT.md
- packages/verifgo-shared/src/types.ts
Author: MoOoH
Created: 2026-05-28
============================================================
*/

create table if not exists public.verifgo_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verifgo_profiles_preferred_language_check
    check (preferred_language in ('en', 'fr'))
);

create table if not exists public.verifgo_vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plate_number text not null,
  accessory_number text,
  make text,
  model text,
  vehicle_year integer,
  vehicle_use text not null default 'rideshare',
  powertrain text not null default 'gas',
  photo_path text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verifgo_vehicles_vehicle_use_check
    check (vehicle_use in ('delivery', 'personal', 'rideshare', 'taxi')),
  constraint verifgo_vehicles_powertrain_check
    check (powertrain in ('diesel', 'electric', 'gas', 'hybrid', 'plug_in_hybrid')),
  constraint verifgo_vehicles_vehicle_year_check
    check (vehicle_year is null or vehicle_year between 1980 and 2100)
);

create table if not exists public.verifgo_inspection_templates (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  label text not null,
  is_active boolean not null default false,
  effective_from date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.verifgo_inspection_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.verifgo_inspection_templates(id) on delete cascade,
  code text not null,
  label_en text not null,
  label_fr text not null,
  sort_order integer not null,
  is_required boolean not null default true,
  created_at timestamptz not null default now(),
  unique (template_id, code),
  unique (template_id, sort_order)
);

create table if not exists public.verifgo_daily_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.verifgo_vehicles(id) on delete restrict,
  template_id uuid not null references public.verifgo_inspection_templates(id) on delete restrict,
  report_date date not null,
  inspection_started_at timestamptz,
  client_submitted_at timestamptz,
  server_received_at timestamptz,
  client_timezone text not null default 'America/Toronto',
  offline_created boolean not null default false,
  sync_status text not null default 'local_only',
  driver_name_snapshot text,
  plate_number_snapshot text not null,
  accessory_number_snapshot text,
  vehicle_snapshot_json jsonb not null default '{}'::jsonb,
  odometer_reading integer not null,
  ev_battery_charge_percent integer,
  warning_light_status text,
  no_defect_declared boolean not null default false,
  all_required_items_confirmed boolean not null default false,
  defect_summary text,
  gps_lat numeric(10, 7),
  gps_lng numeric(10, 7),
  gps_accuracy numeric(10, 2),
  gps_consent_given boolean not null default false,
  report_hash text not null,
  status text not null default 'draft',
  corrected_from_report_id uuid references public.verifgo_daily_reports(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verifgo_daily_reports_sync_status_check
    check (sync_status in ('local_only', 'synced', 'failed')),
  constraint verifgo_daily_reports_status_check
    check (status in ('draft', 'submitted', 'corrected', 'voided')),
  constraint verifgo_daily_reports_odometer_check
    check (odometer_reading >= 0),
  constraint verifgo_daily_reports_ev_battery_check
    check (ev_battery_charge_percent is null or ev_battery_charge_percent between 0 and 100),
  constraint verifgo_daily_reports_gps_pair_check
    check ((gps_lat is null and gps_lng is null) or (gps_lat is not null and gps_lng is not null))
);

create table if not exists public.verifgo_daily_report_items (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.verifgo_daily_reports(id) on delete cascade,
  item_code text not null,
  status text not null,
  created_at timestamptz not null default now(),
  unique (report_id, item_code),
  constraint verifgo_daily_report_items_status_check
    check (status in ('ok', 'defect', 'na'))
);

create table if not exists public.verifgo_defects (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.verifgo_daily_reports(id) on delete cascade,
  item_code text not null,
  severity text not null default 'unknown',
  description text not null,
  photo_path text,
  created_at timestamptz not null default now(),
  constraint verifgo_defects_severity_check
    check (severity in ('minor', 'major', 'unknown'))
);

create table if not exists public.verifgo_audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id uuid references public.verifgo_daily_reports(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint verifgo_audit_events_event_type_check
    check (
      event_type in (
        'report_started',
        'report_submitted',
        'report_sync_failed',
        'report_synced',
        'report_exported_pdf',
        'inspector_mode_opened',
        'correction_created',
        'reminder_updated',
        'premium_smart_notifications_updated',
        'subscription_started',
        'subscription_cancelled'
      )
    )
);

create table if not exists public.verifgo_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_slug text not null default 'free',
  status text not null default 'free',
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verifgo_subscriptions_plan_slug_check
    check (plan_slug in ('free', 'founding_driver', 'pro')),
  constraint verifgo_subscriptions_status_check
    check (status in ('free', 'trialing', 'active', 'past_due', 'cancelled'))
);

create table if not exists public.verifgo_smart_reminder_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  premium_smart_notifications_enabled boolean not null default false,
  timezone text not null default 'America/Toronto',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verifgo_smart_reminder_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references public.verifgo_vehicles(id) on delete cascade,
  reminder_code text not null,
  scheduled_for date not null,
  status text not null default 'scheduled',
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verifgo_smart_reminder_events_code_check
    check (
      reminder_code in (
        'battery_cold_check',
        'emergency_kit_check',
        'summer_tire_wait',
        'washer_fluid_winter',
        'winter_tire_deadline',
        'winter_tire_install'
      )
    ),
  constraint verifgo_smart_reminder_events_status_check
    check (status in ('scheduled', 'sent', 'dismissed', 'skipped'))
);

create or replace function public.verifgo_prevent_submitted_report_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status in ('submitted', 'corrected', 'voided') then
    raise exception 'Submitted VerifGo reports are immutable. Create a correction instead.';
  end if;

  return new;
end;
$$;

drop trigger if exists verifgo_daily_reports_immutable_submitted
  on public.verifgo_daily_reports;

create trigger verifgo_daily_reports_immutable_submitted
before update on public.verifgo_daily_reports
for each row
execute function public.verifgo_prevent_submitted_report_mutation();

create or replace function public.verifgo_set_server_received_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'submitted' and new.server_received_at is null then
    new.server_received_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists verifgo_daily_reports_server_received_at
  on public.verifgo_daily_reports;

create trigger verifgo_daily_reports_server_received_at
before insert on public.verifgo_daily_reports
for each row
execute function public.verifgo_set_server_received_at();

alter table public.verifgo_profiles enable row level security;
alter table public.verifgo_vehicles enable row level security;
alter table public.verifgo_inspection_templates enable row level security;
alter table public.verifgo_inspection_items enable row level security;
alter table public.verifgo_daily_reports enable row level security;
alter table public.verifgo_daily_report_items enable row level security;
alter table public.verifgo_defects enable row level security;
alter table public.verifgo_audit_events enable row level security;
alter table public.verifgo_subscriptions enable row level security;
alter table public.verifgo_smart_reminder_settings enable row level security;
alter table public.verifgo_smart_reminder_events enable row level security;

drop policy if exists verifgo_profiles_owner_all on public.verifgo_profiles;
create policy verifgo_profiles_owner_all on public.verifgo_profiles
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists verifgo_vehicles_owner_all on public.verifgo_vehicles;
create policy verifgo_vehicles_owner_all on public.verifgo_vehicles
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists verifgo_templates_authenticated_read on public.verifgo_inspection_templates;
create policy verifgo_templates_authenticated_read on public.verifgo_inspection_templates
for select to authenticated
using (true);

drop policy if exists verifgo_items_authenticated_read on public.verifgo_inspection_items;
create policy verifgo_items_authenticated_read on public.verifgo_inspection_items
for select to authenticated
using (true);

drop policy if exists verifgo_daily_reports_owner_all on public.verifgo_daily_reports;
create policy verifgo_daily_reports_owner_all on public.verifgo_daily_reports
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists verifgo_report_items_owner_all on public.verifgo_daily_report_items;
create policy verifgo_report_items_owner_all on public.verifgo_daily_report_items
for all to authenticated
using (
  exists (
    select 1
    from public.verifgo_daily_reports report
    where report.id = report_id
      and report.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.verifgo_daily_reports report
    where report.id = report_id
      and report.user_id = auth.uid()
  )
);

drop policy if exists verifgo_defects_owner_all on public.verifgo_defects;
create policy verifgo_defects_owner_all on public.verifgo_defects
for all to authenticated
using (
  exists (
    select 1
    from public.verifgo_daily_reports report
    where report.id = report_id
      and report.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.verifgo_daily_reports report
    where report.id = report_id
      and report.user_id = auth.uid()
  )
);

drop policy if exists verifgo_audit_events_owner_read on public.verifgo_audit_events;
create policy verifgo_audit_events_owner_read on public.verifgo_audit_events
for select to authenticated
using (user_id = auth.uid());

drop policy if exists verifgo_audit_events_owner_insert on public.verifgo_audit_events;
create policy verifgo_audit_events_owner_insert on public.verifgo_audit_events
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists verifgo_subscriptions_owner_read on public.verifgo_subscriptions;
create policy verifgo_subscriptions_owner_read on public.verifgo_subscriptions
for select to authenticated
using (user_id = auth.uid());

drop policy if exists verifgo_smart_reminder_settings_owner_all on public.verifgo_smart_reminder_settings;
create policy verifgo_smart_reminder_settings_owner_all on public.verifgo_smart_reminder_settings
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists verifgo_smart_reminder_events_owner_all on public.verifgo_smart_reminder_events;
create policy verifgo_smart_reminder_events_owner_all on public.verifgo_smart_reminder_events
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

insert into public.verifgo_inspection_templates (version, label, is_active, effective_from)
values ('qc-v1', 'Quebec daily vehicle verification baseline', true, '2026-01-01')
on conflict (version) do nothing;

insert into public.verifgo_inspection_items (
  template_id,
  code,
  label_en,
  label_fr,
  sort_order
)
select template.id, seed.code, seed.label_en, seed.label_fr, seed.sort_order
from public.verifgo_inspection_templates template
cross join (
  values
    ('odometer', 'Odometer', 'Odometre', 10),
    ('tires_wheels', 'Tires and wheels', 'Pneus et roues', 20),
    ('brakes', 'Brakes', 'Freins', 30),
    ('steering', 'Steering', 'Direction', 40),
    ('lights_signals', 'Lights and signals', 'Feux et signaux', 50),
    ('windshield_wipers', 'Windshield and wipers', 'Pare-brise et essuie-glaces', 60),
    ('mirrors', 'Mirrors', 'Retroviseurs', 70),
    ('horn', 'Horn', 'Avertisseur sonore', 80),
    ('seatbelts', 'Seatbelts', 'Ceintures de securite', 90),
    ('doors', 'Doors', 'Portieres', 100),
    ('dashboard_warning_lights', 'Dashboard warning lights', 'Temoins du tableau de bord', 110),
    ('passenger_transport_condition', 'Passenger transport condition', 'Etat general pour le transport de passagers', 120),
    ('ev_battery_charge', 'EV battery charge', 'Charge de batterie electrique', 130)
) as seed(code, label_en, label_fr, sort_order)
where template.version = 'qc-v1'
on conflict (template_id, code) do nothing;
