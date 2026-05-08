/*
============================================================
File: supabase/migrations/0007_lead_conversion_desk.sql
Project: BizPilot AI
Description: Creates the Phase 5 Lead Conversion Desk tables and lead workflow fields.
Role: Adds rule-first lead quality, action items, timeline events, and owner/member RLS.
Related:
- docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
- docs/product/BIZPILOT_SCORING_SPEC_v1.1.md
- tests/rls/lead-conversion-desk.test.sql
Author: MoOoH
Created: 2026-05-07
Last Updated: 2026-05-07
Change Log:
- 2026-05-07: Created Phase 5 Lead Conversion Desk data model and RLS baseline.
============================================================
*/

alter table public.leads
  add column if not exists first_viewed_at timestamptz,
  add column if not exists first_reply_copied_at timestamptz,
  add column if not exists last_owner_action_at timestamptz,
  add column if not exists response_status text not null default 'new'
    check (response_status in ('new', 'viewed', 'reply_copied', 'follow_up_due', 'overdue')),
  add column if not exists response_sla_state text not null default 'new'
    check (response_sla_state in ('new', 'viewed', 'reply_copied', 'follow_up_due', 'overdue')),
  add column if not exists first_response_latency interval,
  add column if not exists manual_outcome text
    check (manual_outcome in ('booked', 'lost', 'no_response', 'not_a_fit', 'asked_info'));

create table if not exists public.lead_quality_scores (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  quality_level text not null check (quality_level in ('strong', 'good', 'needs_info', 'low_fit')),
  completeness_score integer not null check (completeness_score >= 0 and completeness_score <= 100),
  completeness_label text not null check (completeness_label in ('complete', 'mostly_complete', 'needs_info', 'poor')),
  missing_info_keys text[] not null default '{}'::text[],
  explanation text not null,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_action_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  action_type text not null check (action_type in ('reply', 'ask_info', 'follow_up')),
  title text not null check (char_length(trim(title)) > 0),
  status text not null default 'open' check (status in ('open', 'completed', 'dismissed')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'lead_created',
      'lead_viewed',
      'status_updated',
      'reply_copied',
      'outcome_marked',
      'action_completed',
      'score_calculated'
    )
  ),
  event_label text not null check (char_length(trim(event_label)) > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lead_quality_scores_business_id_idx
  on public.lead_quality_scores(business_id);

create index if not exists lead_action_items_business_id_idx
  on public.lead_action_items(business_id);

create index if not exists lead_action_items_lead_id_status_idx
  on public.lead_action_items(lead_id, status);

create index if not exists lead_events_business_id_idx
  on public.lead_events(business_id);

create index if not exists lead_events_lead_id_created_at_idx
  on public.lead_events(lead_id, created_at desc);

drop trigger if exists lead_quality_scores_set_updated_at on public.lead_quality_scores;
create trigger lead_quality_scores_set_updated_at
before update on public.lead_quality_scores
for each row
execute function public.set_updated_at();

drop trigger if exists lead_action_items_set_updated_at on public.lead_action_items;
create trigger lead_action_items_set_updated_at
before update on public.lead_action_items
for each row
execute function public.set_updated_at();

alter table public.lead_quality_scores enable row level security;
alter table public.lead_action_items enable row level security;
alter table public.lead_events enable row level security;

grant select, insert, update on public.lead_quality_scores to authenticated;
grant select, insert, update on public.lead_action_items to authenticated;
grant select, insert on public.lead_events to authenticated;
grant update on public.leads to authenticated;

drop policy if exists "leads_update_member" on public.leads;
create policy "leads_update_member"
on public.leads
for update
to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

drop policy if exists "lead_quality_scores_select_member" on public.lead_quality_scores;
create policy "lead_quality_scores_select_member"
on public.lead_quality_scores
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "lead_quality_scores_insert_member" on public.lead_quality_scores;
create policy "lead_quality_scores_insert_member"
on public.lead_quality_scores
for insert
to authenticated
with check (public.is_business_member(business_id));

drop policy if exists "lead_quality_scores_update_member" on public.lead_quality_scores;
create policy "lead_quality_scores_update_member"
on public.lead_quality_scores
for update
to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

drop policy if exists "lead_action_items_select_member" on public.lead_action_items;
create policy "lead_action_items_select_member"
on public.lead_action_items
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "lead_action_items_insert_member" on public.lead_action_items;
create policy "lead_action_items_insert_member"
on public.lead_action_items
for insert
to authenticated
with check (public.is_business_member(business_id));

drop policy if exists "lead_action_items_update_member" on public.lead_action_items;
create policy "lead_action_items_update_member"
on public.lead_action_items
for update
to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

drop policy if exists "lead_events_select_member" on public.lead_events;
create policy "lead_events_select_member"
on public.lead_events
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "lead_events_insert_member" on public.lead_events;
create policy "lead_events_insert_member"
on public.lead_events
for insert
to authenticated
with check (public.is_business_member(business_id));
