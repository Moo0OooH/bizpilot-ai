/*
============================================================
File: tests/rls/premium-operations-locking.manual.sql
Project: BizPilot AI
Description: Two-session proof for Premium Operations serialization and lock ordering.
Role: Verifies time-block, lead, recipient, parent-cascade, and availability create/review writes cannot race currentness checks or deadlock.
Related:
- supabase/migrations/0026_premium_operations_schedule_integrity.sql
- tests/rls/premium-operations-addons.test.sql
Author: MoOoH
Created: 2026-07-22
Last Updated: 2026-07-22
Change Log:
- 2026-07-22: Added rollback-only two-session time-block, lead, recipient, and parent-cascade lock checks.
- 2026-07-22: Added a rollback-only create-versus-review lock-order regression using the real availability RPC.
============================================================
*/

/*
  MANUAL / LOCAL-DISPOSABLE DATABASE ONLY

  Why two sessions:
  The executable RLS harness uses one connection, so it cannot prove that a
  trigger-held row lock blocks a concurrent transaction. Open two psql shells
  against the same local disposable database and run each numbered pair while
  Session A is inside pg_sleep. Every Session A block ends in ROLLBACK.

  In both shells, resolve one fixture block and lead before starting:

    select
      block.business_id as fixture_business_id,
      block.id as fixture_block_id,
      block.lead_id as fixture_lead_id
    from public.service_time_blocks block
    where block.status in ('reserved', 'tentative')
      and block.lead_id is not null
    order by block.starts_at desc
    limit 1
    \gset

  Confirm that :fixture_business_id, :fixture_block_id, and :fixture_lead_id
  are populated. Do not substitute a production connection.

  Resolve a recipient fixture in both shells as well:

    select
      recipient.business_id as recipient_business_id,
      recipient.id as fixture_recipient_id,
      recipient.draft_id as fixture_draft_id
    from public.bulk_reply_draft_recipients recipient
    order by recipient.created_at desc
    limit 1
    \gset

  Pair 7 needs a stale pending availability draft whose lead now has a valid
  future exact request and active conflict, with no other current draft. Set
  the local JWT role and resolve the same fixture in both shells:

    select set_config('request.jwt.claim.sub', '', false);
    select set_config('request.jwt.claim.role', 'service_role', false);

    with exact_requests as (
      select
        lead.business_id,
        lead.id as lead_id,
        request.submission_id,
        request.requested_starts_at,
        request.requested_ends_at
      from public.leads lead
      cross join lateral public.premium_operations_exact_request_window(
        lead.business_id,
        lead.id
      ) request
      where request.requested_starts_at > statement_timestamp()
    ),
    conflicted_requests as (
      select
        request.business_id,
        request.lead_id,
        request.submission_id,
        request.requested_starts_at,
        request.requested_ends_at,
        jsonb_agg(block.id::text order by block.id) as conflict_block_ids
      from exact_requests request
      join public.service_time_blocks block
        on block.business_id = request.business_id
       and block.status in ('reserved', 'tentative')
       and block.starts_at < request.requested_ends_at
       and request.requested_starts_at < block.ends_at
      group by
        request.business_id,
        request.lead_id,
        request.submission_id,
        request.requested_starts_at,
        request.requested_ends_at
    )
    select
      request.business_id::text as create_business_id,
      request.lead_id::text as create_lead_id,
      stale.id::text as stale_draft_id,
      request.requested_starts_at::text as create_requested_starts_at,
      request.requested_ends_at::text as create_requested_ends_at,
      coalesce(opening.suggested_starts_at::text, '')
        as create_suggested_starts_at,
      coalesce(opening.suggested_ends_at::text, '')
        as create_suggested_ends_at,
      request.conflict_block_ids::text as create_conflict_block_ids
    from conflicted_requests request
    join public.bulk_reply_drafts stale
      on stale.business_id = request.business_id
     and stale.status = 'draft'
     and stale.audience_summary ->> 'source' = 'availability_conflict'
     and stale.audience_summary ->> 'leadId' = request.lead_id::text
    left join lateral public.premium_operations_first_internal_opening(
      request.business_id,
      request.requested_starts_at,
      request.requested_ends_at
    ) opening on true
    where not public.premium_operations_availability_draft_is_current(
      stale.business_id,
      stale.audience_summary
    )
      and not exists (
        select 1
        from public.bulk_reply_drafts current_draft
        where current_draft.business_id = request.business_id
          and current_draft.id <> stale.id
          and current_draft.audience_summary ->> 'source'
            = 'availability_conflict'
          and current_draft.audience_summary ->> 'leadId'
            = request.lead_id::text
          and public.premium_operations_availability_draft_is_current(
            current_draft.business_id,
            current_draft.audience_summary
          )
      )
    order by stale.created_at desc, stale.id desc
    limit 1
    \gset

  Confirm all create_* variables and :stale_draft_id are populated. If the
  query returns no row, prepare this prerequisite only in a disposable test
  database before running the pair; do not weaken the predicates and never use
  a managed or Production connection.
*/

-- ============================================================
-- 1A — Session A: cancellation must hold the business-row lock.
-- ============================================================
begin;

update public.service_time_blocks
set status = 'cancelled'
where id = :'fixture_block_id'::uuid
  and business_id = :'fixture_business_id'::uuid;

select pg_sleep(15);
rollback;

-- ============================================================
-- 1B — Session B, during 1A sleep: expect lock timeout.
-- ============================================================
begin;
set local lock_timeout = '1s';

select id
from public.businesses
where id = :'fixture_business_id'::uuid
for update;

-- Expected: ERROR: canceling statement due to lock timeout
rollback;

-- ============================================================
-- 2A — Session A: DELETE must lock via OLD.business_id.
-- ============================================================
begin;

delete from public.service_time_blocks
where id = :'fixture_block_id'::uuid
  and business_id = :'fixture_business_id'::uuid;

select pg_sleep(15);
rollback;

-- ============================================================
-- 2B — Session B, during 2A sleep: expect lock timeout.
-- ============================================================
begin;
set local lock_timeout = '1s';

select id
from public.businesses
where id = :'fixture_business_id'::uuid
for update;

-- Expected: ERROR: canceling statement due to lock timeout
rollback;

-- ============================================================
-- 3A — Session A: a terminal lead transition must share the lock.
-- ============================================================
begin;

update public.leads
set status = 'booked'
where id = :'fixture_lead_id'::uuid
  and business_id = :'fixture_business_id'::uuid;

select pg_sleep(15);
rollback;

-- ============================================================
-- 3B — Session B, during 3A sleep: expect lock timeout.
-- ============================================================
begin;
set local lock_timeout = '1s';

select id
from public.businesses
where id = :'fixture_business_id'::uuid
for update;

-- Expected: ERROR: canceling statement due to lock timeout
rollback;

-- ============================================================
-- 4A — Session A: lead DELETE must lock via OLD.business_id.
-- ============================================================
begin;

delete from public.leads
where id = :'fixture_lead_id'::uuid
  and business_id = :'fixture_business_id'::uuid;

select pg_sleep(15);
rollback;

-- ============================================================
-- 4B — Session B, during 4A sleep: expect lock timeout.
-- ============================================================
begin;
set local lock_timeout = '1s';

select id
from public.businesses
where id = :'fixture_business_id'::uuid
for update;

-- Expected: ERROR: canceling statement due to lock timeout
rollback;

-- ============================================================
-- 5A — Session A: direct recipient DELETE must lock via OLD.
-- ============================================================
begin;

delete from public.bulk_reply_draft_recipients
where id = :'fixture_recipient_id'::uuid
  and business_id = :'recipient_business_id'::uuid;

select pg_sleep(15);
rollback;

-- ============================================================
-- 5B — Session B, during 5A sleep: expect lock timeout.
-- ============================================================
begin;
set local lock_timeout = '1s';

select id
from public.businesses
where id = :'recipient_business_id'::uuid
for update;

-- Expected: ERROR: canceling statement due to lock timeout
rollback;

-- ============================================================
-- 6A — Session A: parent DELETE cascade must take the same lock
-- without raising a recipient-currentness error. ROLLBACK restores it.
-- ============================================================
begin;

delete from public.bulk_reply_drafts
where id = :'fixture_draft_id'::uuid
  and business_id = :'recipient_business_id'::uuid;

select pg_sleep(15);
rollback;

-- ============================================================
-- 6B — Session B, during 6A sleep: expect lock timeout, not deadlock.
-- ============================================================
begin;
set local lock_timeout = '1s';

select id
from public.businesses
where id = :'recipient_business_id'::uuid
for update;

-- Expected: ERROR: canceling statement due to lock timeout
-- No session should report "deadlock detected".
rollback;

-- ============================================================
-- 7A — Session A: create-versus-review lock-order regression.
-- Lock the stale draft tuple first, then attempt review after Session B has
-- entered the real creation RPC and acquired the business-row mutex.
-- ============================================================
begin;
set local lock_timeout = '20s';
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'service_role', true);

select draft.id
from public.bulk_reply_drafts draft
where draft.id = :'stale_draft_id'::uuid
  and draft.business_id = :'create_business_id'::uuid
  and draft.status = 'draft'
for update;

select pg_sleep(5);

update public.bulk_reply_drafts
set
  status = 'reviewed',
  reviewed_at = statement_timestamp()
where id = :'stale_draft_id'::uuid
  and business_id = :'create_business_id'::uuid;

-- Expected after Session B rolls back: the existing stale-draft exception.
-- Neither session may report "deadlock detected".
rollback;

-- ============================================================
-- 7B — Session B, during 7A sleep: create the replacement through the real
-- RPC. It must return a UUID without waiting on Session A's stale draft lock,
-- then hold the business lock until this rollback releases Session A.
-- ============================================================
begin;
set local lock_timeout = '20s';
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'service_role', true);

select public.create_availability_review_draft(
  :'create_business_id'::uuid,
  :'create_lead_id'::uuid,
  'Create versus review lock-order proof',
  'Rollback-only availability review concurrency proof.',
  :'create_requested_starts_at'::timestamptz,
  :'create_requested_ends_at'::timestamptz,
  nullif(:'create_suggested_starts_at', '')::timestamptz,
  nullif(:'create_suggested_ends_at', '')::timestamptz,
  :'create_conflict_block_ids'::jsonb
) as replacement_draft_id;

select pg_sleep(15);

-- Expected: RPC succeeds, Session A waits for this transaction, then receives
-- only the normal stale-draft rejection. Neither session may deadlock.
rollback;
