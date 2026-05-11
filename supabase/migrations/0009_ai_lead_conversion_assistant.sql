/*
============================================================
File: supabase/migrations/0009_ai_lead_conversion_assistant.sql
Project: BizPilot AI
Description: Creates Phase 6 AI Lead Conversion Assistant storage.
Role: Adds tenant-scoped cached AI outputs and usage events for on-demand lead assistance.
Related:
- docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
- docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md
Author: MoOoH
Created: 2026-05-11
Last Updated: 2026-05-11
Change Log:
- 2026-05-11: Created Phase 6 AI output cache and usage/cost tracking baseline.
============================================================
*/

create table if not exists public.ai_outputs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  output_type text not null check (output_type in ('lead_conversion_bundle')),
  prompt_name text not null check (char_length(trim(prompt_name)) > 0),
  prompt_version text not null check (char_length(trim(prompt_version)) > 0),
  model text not null check (char_length(trim(model)) > 0),
  provider text not null default 'openai' check (provider in ('openai', 'rule_fallback')),
  input_hash text not null check (char_length(trim(input_hash)) > 0),
  output jsonb not null default '{}'::jsonb,
  status text not null default 'generated' check (status in ('generated', 'fallback', 'failed')),
  error_message text,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  cached_tokens integer not null default 0 check (cached_tokens >= 0),
  estimated_cost numeric(10, 6) not null default 0 check (estimated_cost >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, lead_id, output_type, input_hash)
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'ai_bundle_generated',
      'ai_bundle_fallback',
      'ai_bundle_failed'
    )
  ),
  operation_type text not null default 'lead_conversion_bundle'
    check (operation_type in ('lead_conversion_bundle')),
  provider text not null check (provider in ('openai', 'rule_fallback')),
  model text not null check (char_length(trim(model)) > 0),
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  cached_tokens integer not null default 0 check (cached_tokens >= 0),
  estimated_cost numeric(10, 6) not null default 0 check (estimated_cost >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_outputs_business_id_idx
  on public.ai_outputs(business_id);

create index if not exists ai_outputs_lead_id_created_at_idx
  on public.ai_outputs(lead_id, created_at desc);

create index if not exists usage_events_business_id_created_at_idx
  on public.usage_events(business_id, created_at desc);

create index if not exists usage_events_lead_id_created_at_idx
  on public.usage_events(lead_id, created_at desc);

drop trigger if exists ai_outputs_set_updated_at on public.ai_outputs;
create trigger ai_outputs_set_updated_at
before update on public.ai_outputs
for each row
execute function public.set_updated_at();

alter table public.ai_outputs enable row level security;
alter table public.usage_events enable row level security;

grant select, insert, update on public.ai_outputs to authenticated;
grant select, insert on public.usage_events to authenticated;

drop policy if exists "ai_outputs_select_member" on public.ai_outputs;
create policy "ai_outputs_select_member"
on public.ai_outputs
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "ai_outputs_insert_member" on public.ai_outputs;
create policy "ai_outputs_insert_member"
on public.ai_outputs
for insert
to authenticated
with check (public.is_business_member(business_id));

drop policy if exists "ai_outputs_update_member" on public.ai_outputs;
create policy "ai_outputs_update_member"
on public.ai_outputs
for update
to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

drop policy if exists "usage_events_select_member" on public.usage_events;
create policy "usage_events_select_member"
on public.usage_events
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "usage_events_insert_member" on public.usage_events;
create policy "usage_events_insert_member"
on public.usage_events
for insert
to authenticated
with check (public.is_business_member(business_id));
