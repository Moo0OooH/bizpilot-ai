/**
 * ============================================================
 * File: tests/unit/premium-operations-boundaries-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for Premium Operations tenant, entitlement, and review boundaries.
 * Role: Prevents easy regression of the database controls that protect paid add-ons and manual-only review records.
 * Related:
 * - supabase/migrations/0025_premium_operations_addons.sql
 * - server/services/premium-operations.service.ts
 * - components/dashboard/premium-operations-workspace.tsx
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Guarded complete read-only lead enrichment and canonical exact-time interpretation.
 * - 2026-07-22: Guarded bounded active lead-set enrichment so Operations does not scan tenant history.
 * - 2026-07-22: Guarded explicit audience filters, visible-only submission, full preview, and transactional draft creation.
 * - 2026-07-22: Guarded rejection of partially elapsed exact-time availability requests.
 * - 2026-07-22: Guarded stale ordinary recipients, terminal alert filtering, and LTR customer drafts in RTL layouts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const migration = readFileSync(
  "supabase/migrations/0025_premium_operations_addons.sql",
  "utf8",
);
const workspace = readFileSync(
  "components/dashboard/premium-operations-workspace.tsx",
  "utf8",
);
const actions = readFileSync(
  "server/actions/premium-operations.actions.ts",
  "utf8",
);
const repository = readFileSync(
  "server/repositories/lead-conversion.repository.ts",
  "utf8",
);
const premiumRepository = readFileSync(
  "server/repositories/premium-operations.repository.ts",
  "utf8",
);
const service = readFileSync(
  "server/services/premium-operations.service.ts",
  "utf8",
);
const workspaceLoader = service.slice(
  service.indexOf("export async function getPremiumOperationsWorkspace"),
  service.indexOf("export async function addPriorityRule"),
);
const genericDraftValidation = service.slice(
  service.indexOf("async function assertGenericDraftRecipientsCurrent"),
  service.indexOf("async function getAccessibleDraft"),
);
const bulkDraftPreparation = service.slice(
  service.indexOf("export async function prepareBulkReplyDraft"),
  service.indexOf("export async function prepareAvailabilityReviewDraft"),
);
const availabilityAlertBuilder = service.slice(
  service.indexOf("function buildAvailabilityAlerts"),
  service.indexOf("function isAvailabilityReviewDraft"),
);
const availabilityConflictPanel = workspace.slice(
  workspace.indexOf("workspace.availabilityAlerts.map"),
  workspace.indexOf("workspace.recipients.length"),
);

describe("Premium Operations source boundaries", () => {
  it("enforces entitlement and tenant integrity at the database boundary", () => {
    assert.match(migration, /premium_operations_addon_is_active/);
    assert.match(migration, /foreign key \(business_id, lead_id\)\s+references public\.leads\(business_id, id\)/);
    assert.match(migration, /premium_operations_can_access_draft/);
    assert.match(migration, /Availability review drafts require one validated conflict\./);
    assert.match(migration, /Availability review drafts require one validated recipient\./);
  });

  it("keeps review and manual-copy records durable and server-attributed", () => {
    assert.match(migration, /new\.reviewed_by_user_id := auth\.uid\(\);/);
    assert.match(migration, /new\.reviewed_at := now\(\);/);
    assert.match(migration, /new\.copied_by_user_id := auth\.uid\(\);/);
    assert.match(migration, /new\.copied_at := now\(\);/);
    assert.match(migration, /Recipients must be created before a manual copy is recorded\./);
    assert.match(migration, /and status = 'draft'/);
  });

  it("keeps bulk selection usable without Priority Search and hides mutations from members", () => {
    assert.match(workspace, /activeTab === "bulkReply"/);
    assert.match(workspace, /workspace\.entitlements\.bulk_reply_review/);
    assert.match(workspace, /filteredLeads\.map\(\(lead\)/);
    assert.match(workspace, /canManage \? \(/);
    assert.match(workspace, /cancelInternalTimeBlockAction/);
    assert.match(workspace, /requestedDateFilter/);
    assert.match(workspace, /serviceFilter/);
    assert.match(workspace, /areaFilter/);
    assert.match(workspace, /statusFilter/);
    assert.match(workspace, /timeFilter/);
    assert.match(workspace, /selectedVisibleLeadIds\.map/);
    assert.doesNotMatch(workspace, /\[\.\.\.selectedLeadIds\]\.map/);
    assert.match(workspace, /<details/);
    assert.match(workspace, /workspace\.recipients\.map/);
    assert.doesNotMatch(workspace, /workspace\.recipients\.slice/);
    assert.match(workspace, /CopyAndRecordReplyButton/);
  });

  it("builds Operations from a bounded actionable read instead of synchronizing every lead", () => {
    assert.match(workspaceLoader, /listActionableOperationsLeads\(/);
    assert.match(workspaceLoader, /listSubmissionValuesForLeadSet\(/);
    assert.match(workspaceLoader, /calculateLeadQuality\(/);
    assert.match(workspaceLoader, /calculateSlaState\(/);
    assert.match(workspaceLoader, /hasAnyPremiumEntitlement/);
    assert.match(
      workspaceLoader,
      /leadLimitReached: operationsLeadRead\.hasMore/,
    );
    assert.match(workspace, /workspace\.leadLimitReached/);
    assert.match(
      workspace,
      /copy\.premiumOperations\.prioritySearch\.availabilityCheckLimit/,
    );
    assert.doesNotMatch(workspaceLoader, /listLeadsForBusiness\(/);
    assert.doesNotMatch(workspaceLoader, /getLeadConversionDesk\(/);
    assert.doesNotMatch(workspaceLoader, /syncLeadState\(/);
    assert.doesNotMatch(workspaceLoader, /upsertLeadQualityScore\(/);
    assert.match(repository, /export async function listSubmissionValuesForSubmissions/);
  });

  it("uses direct lead-ID reads for batch creation and revalidates ordinary recipients", () => {
    assert.match(bulkDraftPreparation, /listLeadsByIds\(/);
    assert.doesNotMatch(bulkDraftPreparation, /listLeadsForBusiness\(/);
    assert.match(genericDraftValidation, /listBulkReplyDraftRecipients\(/);
    assert.match(genericDraftValidation, /listLeadsByIds\(/);
    assert.match(
      genericDraftValidation,
      /leads\.some\(\(lead\) => isTerminalLeadStatus\(lead\.status\)\)/,
    );
    assert.equal(
      (service.match(/assertGenericDraftRecipientsCurrent\(/g) ?? []).length,
      3,
      "Ordinary recipient validation must run before review and before manual copy.",
    );
  });

  it("does not offer terminal conflict actions and keeps customer drafts LTR", () => {
    assert.match(
      availabilityAlertBuilder,
      /if \(isTerminalLeadStatus\(item\.lead\.status\)\) continue;/,
    );
    assert.match(availabilityConflictPanel, /data-dashboard-ltr-value/);
    assert.match(availabilityConflictPanel, /dir="ltr"/);
    assert.match(availabilityConflictPanel, /lang=\{businessLanguage\}/);
    assert.match(availabilityConflictPanel, /\[unicode-bidi:plaintext\]/);
  });

  it("enriches every displayed lead and rejects custom preferred-time collisions", () => {
    assert.match(workspaceLoader, /listCanonicalExactTimeSubmissionIds\(/);
    assert.match(
      workspaceLoader,
      /submissionIds: leads\.map\(\(lead\) => lead\.intake_submission_id\)/,
    );
    assert.match(
      workspaceLoader,
      /canonicalExactTimeSubmissionIds\.has\(item\.lead\.intake_submission_id\)/,
    );
    assert.match(service, /function readRequestedTimeWindow\(/);
    assert.match(
      service,
      /hasCanonicalExactTime[\s\S]*readSubmissionText\(values, "preferred_time"\)/,
    );
    assert.match(service, /requestedDate: readSubmissionText/);
    assert.match(service, /requestedTimeWindow: readRequestedTimeWindow/);
    assert.equal(
      (
        service.match(
          /new Date\((?:snapshot\.)?requested(?:\.startsAt|StartsAt)\)\.getTime\(\) <= Date\.now\(\)/g,
        ) ?? []
      ).length,
      3,
      "Every alert, draft-currentness check, and availability mutation must reject a request whose start has elapsed.",
    );
    assert.doesNotMatch(
      service,
      /new Date\((?:snapshot\.)?requested(?:\.endsAt|EndsAt)\)\.getTime\(\) <= Date\.now\(\)/,
    );
  });

  it("requires an active owner or admin before every operational mutation", () => {
    assert.match(actions, /membership\.status === "active"/);
    assert.match(actions, /membership\.role === "owner" \|\| membership\.role === "admin"/);
    assert.equal(
      (actions.match(/getActionContext\(\{ requireManager: true \}\)/g) ?? []).length,
      8,
    );
  });

  it("creates each draft and its recipients through one transactional RPC", () => {
    assert.match(service, /createPremiumReplyDraftAtomic\(/);
    assert.match(service, /createAvailabilityReviewDraftAtomic\(/);
    assert.match(premiumRepository, /\.rpc\("create_premium_reply_draft"/);
    assert.match(
      premiumRepository,
      /"create_availability_review_draft"/,
    );
    assert.doesNotMatch(
      premiumRepository,
      /export async function createBulkReplyDraft\(/,
    );
    assert.doesNotMatch(
      premiumRepository,
      /export async function createBulkReplyDraftRecipients\(/,
    );
  });
});
