/**
 * ============================================================
 * File: tests/unit/premium-operations-schedule-integrity-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for Premium Operations exact-time and schedule-integrity SQL.
 * Role: Prevents regression of canonical provenance, freshness, lifecycle serialization, recipient currentness, atomic RPCs, and founder-only entitlement auditing.
 * Related:
 * - supabase/migrations/0026_premium_operations_schedule_integrity.sql
 * - tests/rls/premium-operations-addons.test.sql
 * - tests/rls/premium-operations-locking.manual.sql
 * Author: MoOoH
 * Created: 2026-07-22
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added source contracts for migration 0026.
 * - 2026-07-22: Added release-blocker guards for grants, earliest openings, lifecycle locks, and recipient currentness.
 * - 2026-07-22: Guarded parent-safe exact-time cascades and deadlock-free stale-draft retention.
 * - 2026-07-22: Guarded pre-generated atomic draft IDs against same-statement RLS visibility regressions.
 * - 2026-07-22: Guarded the founder entitlement upsert against output-column conflict-target ambiguity.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const migration = readFileSync(
  "supabase/migrations/0026_premium_operations_schedule_integrity.sql",
  "utf8",
);
const rlsRegression = readFileSync(
  "tests/rls/premium-operations-addons.test.sql",
  "utf8",
);
const lockingProof = readFileSync(
  "tests/rls/premium-operations-locking.manual.sql",
  "utf8",
);

describe("Premium Operations schedule-integrity SQL", () => {
  it("adds a real canonical time field with entitlement-aware public access", () => {
    assert.match(migration, /'date',\s*'time',\s*'time_window'/);
    assert.match(migration, /'preferred_time',\s*'Preferred exact time',\s*'time'/);
    assert.match(
      migration,
      /Customer preferred exact time\. The business still reviews availability before confirming\./,
    );
    assert.match(migration, /template_field\.field_key = 'preferred_time'/);
    assert.match(migration, /template_field\.field_type = 'time'/);
    assert.match(migration, /business_addon_entitlements_sync_preferred_time/);
    assert.match(migration, /public_can_insert_submission_value/);
    assert.match(migration, /target_field_id uuid/);
    assert.match(
      migration,
      /drop function if exists public\.can_public_read_intake_field\(uuid, uuid, boolean\);/,
    );
    assert.match(
      migration,
      /create or replace function public\.can_public_read_intake_field\([\s\S]*?target_field_id uuid/,
    );
  });

  it("pins all local-time derivation to the shared Toronto contract and rejects DST ambiguity", () => {
    assert.equal((migration.match(/'America\/Toronto'/g) ?? []).length, 1);
    assert.match(migration, /premium_operations_operating_time_zone/);
    assert.match(migration, /premium_operations_local_time_is_unique/);
    assert.match(migration, /matching_instants = 1/);
    assert.match(migration, /at time zone operating_time_zone/);
    assert.doesNotMatch(migration, /operating_time_zone\s+text\s+not null/);
  });

  it("persists and revalidates exact request provenance", () => {
    for (const required of [
      "submissionId",
      "requestedStartsAt",
      "requestedEndsAt",
      "suggestedStartsAt",
      "suggestedEndsAt",
      "conflictBlockIds",
      "premium_operations_exact_request_window",
      "premium_operations_first_internal_opening",
      "premium_operations_availability_draft_is_current",
      "lead.intake_submission_id = target_submission_id",
      "supplied_conflict_ids is distinct from actual_conflict_ids",
      "target_requested_starts_at <= statement_timestamp()",
      "local_request <= statement_timestamp()",
      "target_suggested_starts_at is distinct from expected_suggested_starts_at",
      "target_suggested_ends_at is distinct from expected_suggested_ends_at",
    ]) {
      assert.equal(migration.includes(required), true, `Missing ${required}.`);
    }

    assert.match(
      migration,
      /candidate_ends_at := candidate_starts_at \+ requested_duration/,
    );
    assert.match(
      migration,
      /candidate_starts_at := greatest\([\s\S]*?target_requested_starts_at,[\s\S]*?operating_day_starts_at/,
    );
    assert.match(migration, /operating_day_start/);
    assert.match(migration, /operating_day_end/);
    assert.match(
      migration,
      /coalesce\(target_audience_summary ->> 'source', ''\)/,
    );
    assert.match(
      migration,
      /coalesce\(target_audience_summary ->> 'timeZone', ''\)/,
    );
    assert.match(
      migration,
      /coalesce\(target_audience_summary ->> 'leadCount', ''\)/,
    );
    assert.match(
      migration,
      /coalesce\(target_audience_summary ->> 'manualOnly', ''\)/,
    );
    assert.match(
      migration,
      /coalesce\([\s\S]*?jsonb_typeof\(target_audience_summary -> 'conflictBlockIds'\)/,
    );
    assert.match(
      rlsRegression,
      /a later free opening must not replace the derived earliest opening/,
    );
    assert.match(rlsRegression, /NULL metadata key % must fail closed/);
  });

  it("serializes lifecycle changes and fails stale review or copy closed", () => {
    assert.match(migration, /enforce_service_time_block_no_overlap/);
    assert.match(migration, /for update;/);
    assert.match(migration, /existing\.starts_at < new\.ends_at/);
    assert.match(migration, /new\.starts_at < existing\.ends_at/);
    assert.match(migration, /existing\.status in \('reserved', 'tentative'\)/);
    assert.match(migration, /Active internal time blocks must start in the future\./);
    assert.match(migration, /when tg_op = 'DELETE' then old\.business_id/);
    assert.match(migration, /service_time_blocks_serialize_delete/);
    assert.match(migration, /leads_serialize_premium_operations_delete/);
    assert.match(
      migration,
      /bulk_reply_draft_recipients_enforce_availability_current[\s\S]*?before insert or update or delete/,
    );
    assert.match(migration, /enforce_availability_draft_current_on_review/);
    assert.match(migration, /enforce_availability_recipient_current/);
    assert.match(migration, /This availability draft is no longer current\./);
    assert.match(rlsRegression, /historical cancellation must persist/);
    assert.match(rlsRegression, /direct recipient deletion must stale the parent review/);
    assert.match(rlsRegression, /parent deletion must cascade recipient cleanup/);
    assert.match(
      migration,
      /A direct child-row delete must not orphan an exact time\.[\s\S]*?from public\.businesses business[\s\S]*?from public\.intake_submissions submission/,
    );
    assert.match(
      rlsRegression,
      /direct preferred_date deletion must not orphan an exact time/,
    );
    assert.match(
      rlsRegression,
      /parent submission deletion must cascade the exact pair/,
    );
    assert.match(
      rlsRegression,
      /parent business deletion must cascade the submission and exact pair/,
    );
    assert.match(lockingProof, /set local lock_timeout = '1s'/);
    assert.match(lockingProof, /direct recipient DELETE must lock via OLD/);
    assert.match(lockingProof, /expect lock timeout, not deadlock/);
    assert.match(lockingProof, /create-versus-review lock-order regression/);
    assert.match(lockingProof, /select draft\.id[\s\S]*?for update;/);
    assert.match(lockingProof, /public\.create_availability_review_draft\(/);
    assert.match(lockingProof, /Neither session may report "deadlock detected"/);
  });

  it("creates draft parents and recipients transactionally through security-invoker RPCs", () => {
    const availabilityCreateRpc = migration.match(
      /create or replace function public\.create_availability_review_draft\([\s\S]*?\n\$\$;/,
    )?.[0];

    assert.ok(availabilityCreateRpc);
    assert.match(
      migration,
      /create or replace function public\.create_availability_review_draft\([\s\S]*?security invoker/,
    );
    assert.match(
      migration,
      /create or replace function public\.create_premium_reply_draft\([\s\S]*?security invoker/,
    );
    assert.match(migration, /insert into public\.bulk_reply_drafts/);
    assert.match(migration, /insert into public\.bulk_reply_draft_recipients/);
    assert.equal(
      (migration.match(/created_draft_id uuid := gen_random_uuid\(\);/g) ?? []).length,
      2,
    );
    assert.doesNotMatch(migration, /returning id into created_draft_id/);
    assert.doesNotMatch(
      availabilityCreateRpc,
      /delete from public\.bulk_reply_drafts/,
    );
    assert.match(
      availabilityCreateRpc,
      /Stale availability drafts are durable review history/,
    );
    assert.match(migration, /audience_lead_count <> recipient_count/);
    assert.match(
      migration,
      /grant execute on function public\.create_availability_review_draft\([\s\S]*?to authenticated, service_role;/,
    );
    assert.match(
      migration,
      /grant execute on function public\.create_premium_reply_draft\([\s\S]*?to authenticated, service_role;/,
    );
  });

  it("uses least-privilege helper grants without breaking invoker RPCs", () => {
    assert.match(
      migration,
      /grant execute on function public\.premium_operations_exact_request_window\(uuid, uuid\)\s+to authenticated, service_role;/,
    );
    assert.match(
      migration,
      /elsif not public\.is_business_member\(target_business_id\) then\s+return;/,
    );
    assert.match(
      migration,
      /grant execute on function public\.premium_operations_entitlement_record_is_active\(uuid, text\)\s+to service_role;/,
    );
    assert.doesNotMatch(
      migration,
      /grant execute on function public\.premium_operations_entitlement_record_is_active\(uuid, text\)\s+to authenticated/,
    );
    assert.match(
      rlsRegression,
      /raw entitlement helper must be service-role only/,
    );
    assert.match(
      rlsRegression,
      /exact-time provenance must not cross tenant membership/,
    );
  });

  it("revalidates every generic draft recipient at review and copy", () => {
    assert.match(migration, /premium_operations_draft_recipients_are_current/);
    assert.match(
      migration,
      /lead\.status not in \('archived', 'booked', 'lost'\)/,
    );
    assert.match(
      migration,
      /actual_recipient_count = expected_recipient_count/,
    );
    assert.ok(
      (migration.match(/One or more selected leads are unavailable\./g) ?? [])
        .length >= 2,
    );
    assert.match(
      rlsRegression,
      /a draft with a terminal recipient must not be reviewed/,
    );
    assert.match(rlsRegression, /a terminal recipient must not be copied/);
    assert.match(
      rlsRegression,
      /a draft with a missing recipient must not be reviewed/,
    );
    assert.match(
      rlsRegression,
      /no recipient may be copied after another target disappears/,
    );
  });

  it("keeps founder entitlement mutation atomic and service-role-only", () => {
    assert.match(
      migration,
      /create or replace function public\.founder_upsert_premium_addon_entitlement\([\s\S]*?security definer/,
    );
    assert.match(migration, /previous_values := coalesce/);
    assert.match(
      migration,
      /on conflict on constraint business_addon_entitlements_pkey do update/,
    );
    assert.match(migration, /'status_changed'/);
    assert.match(migration, /'operation', 'premium_addon_entitlement_updated'/);
    assert.match(
      migration,
      /from public, anon, authenticated;[\s\S]*?to service_role;/,
    );
    assert.doesNotMatch(
      migration,
      /grant execute on function public\.founder_upsert_premium_addon_entitlement\([\s\S]*?to authenticated/,
    );
  });
});
