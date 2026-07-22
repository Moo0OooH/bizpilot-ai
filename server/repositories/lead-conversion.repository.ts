/**
 * ============================================================
 * File: server/repositories/lead-conversion.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 5 Lead Conversion Desk data access.
 * Role: Owns tenant-scoped lead, score, action item, and timeline operations through Supabase RLS.
 * Related:
 * - lib/supabase/range-pagination.ts
 * - server/services/lead-conversion.service.ts
 * - supabase/migrations/0007_lead_conversion_desk.sql
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-07-21: Added a bounded batch reader for entitlement-gated availability conflict checks.
 * - 2026-07-22: Added complete paged lead and read-only Operations enrichment queries.
 * - 2026-07-22: Added bounded actionable Operations reads and direct tenant-scoped lead-ID validation.
 * - 2026-07-22: Restricted exact-time enrichment to canonical template-linked form fields.
 * - 2026-05-07: Created Phase 5 lead conversion repository.
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  chunkSupabaseFilterValues,
  collectSupabaseRangePages,
} from "@/lib/supabase/range-pagination";
import type { Database, Json } from "@/types/database";

export type LeadRecord = Database["public"]["Tables"]["leads"]["Row"];
export type LeadQualityScoreRecord =
  Database["public"]["Tables"]["lead_quality_scores"]["Row"];
export type LeadActionItemRecord =
  Database["public"]["Tables"]["lead_action_items"]["Row"];
export type LeadEventRecord =
  Database["public"]["Tables"]["lead_events"]["Row"];
export type LeadSourceMetadataRecord =
  Database["public"]["Tables"]["lead_source_metadata"]["Row"];
export type IntakeSubmissionValueRecord =
  Database["public"]["Tables"]["intake_submission_values"]["Row"];
export type BusinessServiceAreaRecord =
  Database["public"]["Tables"]["business_service_areas"]["Row"];

export type LeadQualityInput = Readonly<{
  businessId: string;
  completenessLabel: LeadQualityScoreRecord["completeness_label"];
  completenessScore: number;
  explanation: string;
  leadId: string;
  missingInfoKeys: string[];
  qualityLevel: LeadQualityScoreRecord["quality_level"];
}>;

export type LeadActionType = LeadActionItemRecord["action_type"];
export type LeadEventType = LeadEventRecord["event_type"];
export type LeadManualOutcome = NonNullable<LeadRecord["manual_outcome"]>;
export type LeadStatus = LeadRecord["status"];

export const OPERATIONS_LEAD_READ_LIMIT = 250;

export type ActionableOperationsLeadRead = Readonly<{
  hasMore: boolean;
  leads: readonly LeadRecord[];
}>;

const SUBMISSION_VALUE_BATCH_LIMIT = 250;
const SUBMISSION_VALUE_FILTER_CHUNK_SIZE = 40;
const CANONICAL_SUBMISSION_FILTER_CHUNK_SIZE = 40;
const DIRECT_LEAD_ID_READ_LIMIT = 50;
const actionableLeadStatuses = [
  "follow_up_needed",
  "new",
  "replied",
  "reviewed",
] as const satisfies readonly LeadStatus[];

async function throwIfError(error: { message: string } | null): Promise<void> {
  if (error) {
    throw new Error(error.message);
  }
}

export async function listLeadsForBusiness(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadRecord[]> {
  const leads = await collectSupabaseRangePages({
    fetchPage: async ({ from, to }) => {
      const { data, error } = await input.supabase
        .from("leads")
        .select("*")
        .eq("business_id", input.businessId)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to);
      await throwIfError(error);
      return data ?? [];
    },
  });

  return leads.reverse();
}

/**
 * Operations is an active-work surface, not a historical export. Read one
 * extra stable row so callers can disclose when more actionable leads exist
 * without loading the tenant's full lead history or customer-value payloads.
 */
export async function listActionableOperationsLeads(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<ActionableOperationsLeadRead> {
  const { data, error } = await input.supabase
    .from("leads")
    .select("*")
    .eq("business_id", input.businessId)
    .in("status", [...actionableLeadStatuses])
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(OPERATIONS_LEAD_READ_LIMIT + 1);

  await throwIfError(error);
  const rows = data ?? [];

  return {
    hasMore: rows.length > OPERATIONS_LEAD_READ_LIMIT,
    leads: rows.slice(0, OPERATIONS_LEAD_READ_LIMIT),
  };
}

/**
 * Validates a small user-selected audience without scanning unrelated tenant
 * leads. Business scoping remains explicit even though RLS is also active.
 */
export async function listLeadsByIds(input: {
  businessId: string;
  leadIds: readonly string[];
  supabase: SupabaseClient<Database>;
}): Promise<LeadRecord[]> {
  const leadIds = [...new Set(input.leadIds.filter(Boolean))];
  if (leadIds.length === 0) return [];
  if (leadIds.length > DIRECT_LEAD_ID_READ_LIMIT) {
    throw new Error("Too many leads were requested for one direct read.");
  }

  const { data, error } = await input.supabase
    .from("leads")
    .select("*")
    .eq("business_id", input.businessId)
    .in("id", leadIds)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  await throwIfError(error);
  return data ?? [];
}

export async function getLeadById(input: {
  businessId: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadRecord | null> {
  const { data, error } = await input.supabase
    .from("leads")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("id", input.leadId)
    .maybeSingle();

  await throwIfError(error);

  return data;
}

export async function listSubmissionValuesForLead(input: {
  businessId: string;
  lead: LeadRecord;
  supabase: SupabaseClient<Database>;
}): Promise<IntakeSubmissionValueRecord[]> {
  const { data, error } = await input.supabase
    .from("intake_submission_values")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("submission_id", input.lead.intake_submission_id)
    .order("created_at", { ascending: true });

  await throwIfError(error);

  return data ?? [];
}

/**
 * Reads a bounded dashboard batch through URL-safe filters and complete stable
 * range pages. Callers retain the lead-to-submission mapping and must not
 * expose raw rows to an anonymous route.
 */
export async function listSubmissionValuesForSubmissions(input: {
  businessId: string;
  submissionIds: string[];
  supabase: SupabaseClient<Database>;
}): Promise<IntakeSubmissionValueRecord[]> {
  const submissionIds = [...new Set(input.submissionIds.filter(Boolean))];
  if (submissionIds.length === 0) return [];
  if (submissionIds.length > SUBMISSION_VALUE_BATCH_LIMIT) {
    throw new Error("Too many submissions were requested for one value batch.");
  }

  const rows: IntakeSubmissionValueRecord[] = [];
  const submissionIdChunks = chunkSupabaseFilterValues({
    chunkSize: SUBMISSION_VALUE_FILTER_CHUNK_SIZE,
    values: submissionIds,
  });
  for (const submissionIdChunk of submissionIdChunks) {
    const chunkRows = await collectSupabaseRangePages({
      fetchPage: async ({ from, to }) => {
        const { data, error } = await input.supabase
          .from("intake_submission_values")
          .select("*")
          .eq("business_id", input.businessId)
          .in("submission_id", submissionIdChunk)
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .range(from, to);
        await throwIfError(error);
        return data ?? [];
      },
    });
    rows.push(...chunkRows);
  }

  return rows.sort((left, right) => {
    if (left.created_at !== right.created_at) {
      return left.created_at < right.created_at ? -1 : 1;
    }
    if (left.id === right.id) return 0;
    return left.id < right.id ? -1 : 1;
  });
}

/**
 * A custom field that merely reuses `preferred_time` is not the paid exact-time
 * contract. Only submissions from a visible, template-linked time field count.
 */
export async function listCanonicalExactTimeSubmissionIds(input: {
  businessId: string;
  submissionIds: readonly string[];
  supabase: SupabaseClient<Database>;
}): Promise<string[]> {
  const requestedSubmissionIds = new Set(input.submissionIds.filter(Boolean));
  if (requestedSubmissionIds.size === 0) return [];

  const possibleCanonicalFields = await collectSupabaseRangePages({
    fetchPage: async ({ from, to }) => {
      const { data, error } = await input.supabase
        .from("intake_form_fields")
        .select("field_type,id,intake_form_id")
        .eq("business_id", input.businessId)
        .eq("field_key", "preferred_time")
        .eq("is_hidden", false)
        .not("template_field_id", "is", null)
        .order("id", { ascending: true })
        .range(from, to);
      await throwIfError(error);
      return data ?? [];
    },
  });
  const canonicalFormIds = new Set(
    possibleCanonicalFields
      .filter((field) => (field.field_type as string) === "time")
      .map((field) => field.intake_form_id),
  );
  if (canonicalFormIds.size === 0) return [];

  const canonicalSubmissionIds: string[] = [];
  const submissionIdChunks = chunkSupabaseFilterValues({
    chunkSize: CANONICAL_SUBMISSION_FILTER_CHUNK_SIZE,
    values: [...requestedSubmissionIds],
  });
  for (const submissionIdChunk of submissionIdChunks) {
    const submissions = await collectSupabaseRangePages({
      fetchPage: async ({ from, to }) => {
        const { data, error } = await input.supabase
          .from("intake_submissions")
          .select("id,intake_form_id")
          .eq("business_id", input.businessId)
          .in("id", submissionIdChunk)
          .order("id", { ascending: true })
          .range(from, to);
        await throwIfError(error);
        return data ?? [];
      },
    });
    for (const submission of submissions) {
      if (canonicalFormIds.has(submission.intake_form_id)) {
        canonicalSubmissionIds.push(submission.id);
      }
    }
  }

  return canonicalSubmissionIds;
}

export async function getSourceMetadataForLead(input: {
  businessId: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadSourceMetadataRecord | null> {
  const { data, error } = await input.supabase
    .from("lead_source_metadata")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("lead_id", input.leadId)
    .maybeSingle();

  await throwIfError(error);

  return data;
}

export async function listServiceAreasForBusiness(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<BusinessServiceAreaRecord[]> {
  const { data, error } = await input.supabase
    .from("business_service_areas")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  await throwIfError(error);

  return data ?? [];
}

export async function listQualityScoresForLeads(input: {
  leadIds: string[];
  supabase: SupabaseClient<Database>;
}): Promise<LeadQualityScoreRecord[]> {
  if (input.leadIds.length === 0) {
    return [];
  }

  const { data, error } = await input.supabase
    .from("lead_quality_scores")
    .select("*")
    .in("lead_id", input.leadIds);

  await throwIfError(error);

  return data ?? [];
}

export async function getQualityScoreForLead(input: {
  businessId: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadQualityScoreRecord | null> {
  const { data, error } = await input.supabase
    .from("lead_quality_scores")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("lead_id", input.leadId)
    .maybeSingle();

  await throwIfError(error);

  return data;
}

export async function upsertLeadQualityScore(input: {
  score: LeadQualityInput;
  supabase: SupabaseClient<Database>;
}): Promise<LeadQualityScoreRecord> {
  const { data, error } = await input.supabase
    .from("lead_quality_scores")
    .upsert(
      {
        business_id: input.score.businessId,
        calculated_at: new Date().toISOString(),
        completeness_label: input.score.completenessLabel,
        completeness_score: input.score.completenessScore,
        explanation: input.score.explanation,
        lead_id: input.score.leadId,
        missing_info_keys: input.score.missingInfoKeys,
        quality_level: input.score.qualityLevel,
      },
      { onConflict: "lead_id" },
    )
    .select("*")
    .single();

  await throwIfError(error);

  if (!data) {
    throw new Error("Unable to save lead quality score.");
  }

  return data;
}

export async function listActionItemsForLead(input: {
  businessId: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadActionItemRecord[]> {
  const { data, error } = await input.supabase
    .from("lead_action_items")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("lead_id", input.leadId)
    .order("created_at", { ascending: false });

  await throwIfError(error);

  return data ?? [];
}

export async function listOpenActionItemsForBusiness(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadActionItemRecord[]> {
  const { data, error } = await input.supabase
    .from("lead_action_items")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("status", "open")
    .order("due_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  await throwIfError(error);

  return data ?? [];
}

export async function listActionItemsForBusiness(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadActionItemRecord[]> {
  const { data, error } = await input.supabase
    .from("lead_action_items")
    .select("*")
    .eq("business_id", input.businessId)
    .order("created_at", { ascending: false });

  await throwIfError(error);

  return data ?? [];
}

export async function insertLeadActionItem(input: {
  actionType: LeadActionType;
  businessId: string;
  dueAt?: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
  title: string;
}): Promise<LeadActionItemRecord> {
  const { data, error } = await input.supabase
    .from("lead_action_items")
    .insert({
      action_type: input.actionType,
      business_id: input.businessId,
      due_at: input.dueAt ?? null,
      lead_id: input.leadId,
      title: input.title,
    })
    .select("*")
    .single();

  await throwIfError(error);

  if (!data) {
    throw new Error("Unable to create lead action item.");
  }

  return data;
}

export async function completeLeadActionItem(input: {
  actionItemId: string;
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadActionItemRecord> {
  const { data, error } = await input.supabase
    .from("lead_action_items")
    .update({
      completed_at: new Date().toISOString(),
      status: "completed",
    })
    .eq("business_id", input.businessId)
    .eq("id", input.actionItemId)
    .select("*")
    .single();

  await throwIfError(error);

  if (!data) {
    throw new Error("Unable to complete lead action item.");
  }

  return data;
}

export async function dismissOpenActionItemsForLead(input: {
  businessId: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase
    .from("lead_action_items")
    .update({
      status: "dismissed",
    })
    .eq("business_id", input.businessId)
    .eq("lead_id", input.leadId)
    .eq("status", "open");

  await throwIfError(error);
}

export async function listEventsForLead(input: {
  businessId: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadEventRecord[]> {
  const { data, error } = await input.supabase
    .from("lead_events")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("lead_id", input.leadId)
    .order("created_at", { ascending: false });

  await throwIfError(error);

  return data ?? [];
}

export async function insertLeadEvent(input: {
  actorUserId?: string | null | undefined;
  businessId: string;
  eventLabel: string;
  eventType: LeadEventType;
  leadId: string;
  metadata?: Json;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const row = {
    actor_user_id: input.actorUserId ?? null,
    business_id: input.businessId,
    event_label: input.eventLabel,
    event_type: input.eventType,
    lead_id: input.leadId,
    metadata: input.metadata ?? {},
  };

  const { error } = await input.supabase.from("lead_events").insert(row);

  if (
    !error ||
    (!error.message.includes("actor_user_id") &&
      !error.message.includes("lead_events_event_type_check"))
  ) {
    await throwIfError(error);
    return;
  }

  const legacyEventType =
    input.eventType === "status_changed"
      ? "status_updated"
      : input.eventType === "follow_up_marked"
        ? "action_completed"
        : input.eventType;

  const { error: legacyError } = await input.supabase
    .from("lead_events")
    .insert({
      business_id: input.businessId,
      event_label: input.eventLabel,
      event_type: legacyEventType,
      lead_id: input.leadId,
      metadata: input.metadata ?? {},
    } as Database["public"]["Tables"]["lead_events"]["Insert"]);

  await throwIfError(legacyError);
}

export async function updateLeadWorkflow(input: {
  businessId: string;
  leadId: string;
  patch: Database["public"]["Tables"]["leads"]["Update"];
  supabase: SupabaseClient<Database>;
}): Promise<LeadRecord> {
  const { data, error } = await input.supabase
    .from("leads")
    .update(input.patch)
    .eq("business_id", input.businessId)
    .eq("id", input.leadId)
    .select("*")
    .single();

  await throwIfError(error);

  if (!data) {
    throw new Error("Unable to update lead.");
  }

  return data;
}
