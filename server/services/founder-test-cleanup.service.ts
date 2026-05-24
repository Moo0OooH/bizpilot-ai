/**
 * ============================================================
 * File: server/services/founder-test-cleanup.service.ts
 * Project: BizPilot AI
 * Description: Founder-only cleanup for fake/test/demo workspaces.
 * Role: Dry-runs and hard-purges non-production workspaces without touching auth.users.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import {
  isCleanupEligibleWorkspaceKind,
  validateFounderCleanupConfirmation,
  type CleanupWorkspaceKind,
  type FounderCleanupMode,
} from "@/lib/founder-cleanup/confirmation";
import { insertFounderAdminAction } from "@/server/repositories/founder-admin.repository";
import { assertFounderUser } from "@/server/services/founder-admin.service";
import type { AuthUser } from "@/server/services/auth.service";
import type { Database } from "@/types/database";

type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
type BusinessScopedTable =
  | "intake_submission_values"
  | "ai_outputs"
  | "lead_action_items"
  | "lead_quality_scores"
  | "lead_events"
  | "lead_source_metadata"
  | "public_submission_abuse_log"
  | "usage_events"
  | "leads"
  | "intake_submissions"
  | "public_link_variants"
  | "intake_form_fields"
  | "intake_forms"
  | "consent_versions"
  | "business_services"
  | "business_faqs"
  | "business_service_areas"
  | "business_branding"
  | "business_template_settings"
  | "business_onboarding_tasks"
  | "business_privacy_settings"
  | "business_consent_settings"
  | "business_members"
  | "business_deletion_requests"
  | "admin_action_log";

export type FounderCleanupCounts = Record<BusinessScopedTable | "businesses", number>;

export type FounderCleanupDryRun = Readonly<{
  businessId: string;
  cleanupMode: FounderCleanupMode;
  counts: FounderCleanupCounts;
  workspaceKind: CleanupWorkspaceKind;
}>;

const purgeOrder: readonly BusinessScopedTable[] = [
  "intake_submission_values",
  "ai_outputs",
  "lead_action_items",
  "lead_quality_scores",
  "lead_events",
  "lead_source_metadata",
  "public_submission_abuse_log",
  "usage_events",
  "leads",
  "intake_submissions",
  "public_link_variants",
  "intake_form_fields",
  "intake_forms",
  "consent_versions",
  "business_services",
  "business_faqs",
  "business_service_areas",
  "business_branding",
  "business_template_settings",
  "business_onboarding_tasks",
  "business_privacy_settings",
  "business_consent_settings",
  "business_members",
  "business_deletion_requests",
  "admin_action_log",
];

function throwIfError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

function assertEligibleBusiness(business: BusinessRow): asserts business is BusinessRow & {
  workspace_kind: CleanupWorkspaceKind;
} {
  if (!isCleanupEligibleWorkspaceKind(business.workspace_kind)) {
    throw new Error("Hard cleanup is blocked for production workspaces.");
  }
}

async function getBusinessForCleanup(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<BusinessRow> {
  const { data, error } = await input.supabase
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();

  throwIfError(error);

  if (!data) {
    throw new Error("Business not found.");
  }

  assertEligibleBusiness(data);
  return data;
}

async function countBusinessRows(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
  table: BusinessScopedTable;
}): Promise<number> {
  const { count, error } = await input.supabase
    .from(input.table)
    .select("*", { count: "exact", head: true })
    .eq("business_id", input.businessId);

  throwIfError(error);
  return count ?? 0;
}

async function deleteBusinessRows(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
  table: BusinessScopedTable;
}): Promise<void> {
  const { error } = await input.supabase
    .from(input.table)
    .delete()
    .eq("business_id", input.businessId);

  throwIfError(error);
}

async function getCleanupCounts(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<FounderCleanupCounts> {
  const entries = await Promise.all(
    purgeOrder.map(async (table) => [
      table,
      await countBusinessRows({
        businessId: input.businessId,
        supabase: input.supabase,
        table,
      }),
    ]),
  );

  return {
    ...(Object.fromEntries(entries) as Record<BusinessScopedTable, number>),
    businesses: 1,
  };
}

export async function dryRunFounderTestWorkspaceCleanup(input: {
  businessId: string;
  user: AuthUser | null;
}): Promise<FounderCleanupDryRun> {
  assertFounderUser(input.user);

  const supabase = createSupabaseServiceRoleClient();
  const business = await getBusinessForCleanup({
    businessId: input.businessId,
    supabase,
  });

  return {
    businessId: business.id,
    cleanupMode: "test_hard_purge",
    counts: await getCleanupCounts({ businessId: business.id, supabase }),
    workspaceKind: business.workspace_kind,
  };
}

export async function purgeFounderTestWorkspace(input: {
  acknowledged: boolean;
  businessId: string;
  cleanupMode: string;
  dryRunConfirmed: boolean;
  finalConfirmed: boolean;
  typedConfirmation: string;
  user: AuthUser | null;
}): Promise<FounderCleanupDryRun> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const business = await getBusinessForCleanup({
    businessId: input.businessId,
    supabase,
  });

  validateFounderCleanupConfirmation({
    acknowledged: input.acknowledged,
    businessName: business.name,
    businessSlug: business.slug,
    cleanupMode: input.cleanupMode,
    finalConfirmed: input.finalConfirmed,
    typedConfirmation: input.typedConfirmation,
  });

  if (!input.dryRunConfirmed) {
    throw new Error("Run dry-run before final cleanup.");
  }

  const counts = await getCleanupCounts({ businessId: business.id, supabase });
  const purgedTables = purgeOrder.filter((table) => counts[table] > 0);

  if (counts.admin_action_log > 0) {
    await deleteBusinessRows({
      businessId: business.id,
      supabase,
      table: "admin_action_log",
    });
  }

  const { error: tombstoneError } = await supabase
    .from("business_deletion_tombstones")
    .insert({
      business_id: business.id,
      completed_by_actor_type: "founder",
      deletion_mode: "test_hard_purge",
      purged_tables: [...purgedTables, "businesses"],
      reason_code: "cleanup",
      workspace_kind: business.workspace_kind,
    });

  throwIfError(tombstoneError);

  await insertFounderAdminAction({
    actionType: "test_workspace_cleanup_completed",
    actorUserId: actor.id,
    businessId: business.id,
    newValues: {
      auth_users_deleted: false,
      deletion_mode: "test_hard_purge",
      purged_table_count: purgedTables.length + 1,
      workspace_kind: business.workspace_kind,
    },
    note: null,
    previousValues: {
      lifecycle_status: business.lifecycle_status,
      status: business.status,
      workspace_kind: business.workspace_kind,
    },
    supabase,
  });

  for (const table of purgeOrder.filter((table) => table !== "admin_action_log")) {
    await deleteBusinessRows({ businessId: business.id, supabase, table });
  }

  const { error: businessDeleteError } = await supabase
    .from("businesses")
    .delete()
    .eq("id", business.id);

  throwIfError(businessDeleteError);

  return {
    businessId: business.id,
    cleanupMode: "test_hard_purge",
    counts,
    workspaceKind: business.workspace_kind,
  };
}
