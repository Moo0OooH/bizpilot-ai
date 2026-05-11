/*
============================================================
File: supabase/migrations/0008_lead_events_actor_and_phase5_event_names.sql
Project: BizPilot AI
Description: Completes Phase 5 lead event audit fields and canonical event names.
Role: Adds authenticated actor tracking and expands allowed Lead Conversion Desk event types.
Related:
- supabase/migrations/0007_lead_conversion_desk.sql
- server/repositories/lead-conversion.repository.ts
Author: MoOoH
Created: 2026-05-10
Last Updated: 2026-05-10
Change Log:
- 2026-05-10: Added lead_events.actor_user_id and canonical Phase 5 event type values.
============================================================
*/

alter table public.lead_events
  add column if not exists actor_user_id uuid references auth.users(id) on delete set null;

alter table public.lead_events
  drop constraint if exists lead_events_event_type_check;

update public.lead_events
set event_type = 'status_changed'
where event_type = 'status_updated';

alter table public.lead_events
  add constraint lead_events_event_type_check
  check (
    event_type in (
      'lead_created',
      'lead_viewed',
      'status_changed',
      'reply_copied',
      'outcome_marked',
      'follow_up_marked',
      'action_completed',
      'score_calculated'
    )
  );

create index if not exists lead_events_actor_user_id_idx
  on public.lead_events(actor_user_id);
