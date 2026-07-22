/**
 * ============================================================
 * File: server/repositories/premium-operations.repository.ts
 * Project: BizPilot AI
 * Description: Tenant-scoped Supabase data access for Premium Lead Operations.
 * Role: Reads manual add-on access and persists priority rules, internal time blocks, and owner-reviewed bulk draft records.
 * Related:
 * - server/services/premium-operations.service.ts
 * - server/services/premium-operations-rules.service.ts
 * - supabase/migrations/0025_premium_operations_addons.sql
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Replaced the hard time-block cap with complete stable pagination and made review/copy updates fail closed on zero rows.
 * - 2026-07-22: Added transactional RPC adapters for draft parents and their recipient rows.
 * - 2026-07-21: Created tenant-scoped repository for paid operational add-ons.
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { collectSupabaseRangePages } from "@/lib/supabase/range-pagination";
import type { Database, Json } from "@/types/database";

export type AddonEntitlementRecord =
  Database["public"]["Tables"]["business_addon_entitlements"]["Row"];
export type LeadPriorityRuleRecord =
  Database["public"]["Tables"]["lead_priority_rules"]["Row"];
export type ServiceTimeBlockRecord =
  Database["public"]["Tables"]["service_time_blocks"]["Row"];
export type BulkReplyDraftRecord =
  Database["public"]["Tables"]["bulk_reply_drafts"]["Row"];
export type BulkReplyDraftRecipientRecord =
  Database["public"]["Tables"]["bulk_reply_draft_recipients"]["Row"];

type PremiumSupabase = SupabaseClient<Database>;

async function throwIfError(error: { message: string } | null): Promise<void> {
  if (error) throw new Error(error.message);
}

export async function listAddonEntitlements(input: {
  businessId: string;
  supabase: PremiumSupabase;
}): Promise<AddonEntitlementRecord[]> {
  const { data, error } = await input.supabase
    .from("business_addon_entitlements")
    .select("*")
    .eq("business_id", input.businessId);
  await throwIfError(error);
  return data ?? [];
}

export async function listPriorityRules(input: {
  businessId: string;
  supabase: PremiumSupabase;
}): Promise<LeadPriorityRuleRecord[]> {
  const { data, error } = await input.supabase
    .from("lead_priority_rules")
    .select("*")
    .eq("business_id", input.businessId)
    .order("priority_rank", { ascending: true })
    .order("created_at", { ascending: true });
  await throwIfError(error);
  return data ?? [];
}

export async function createPriorityRule(input: {
  areaTerms: string[];
  businessId: string;
  createdByUserId: string;
  description: string | null;
  name: string;
  priorityRank: number;
  serviceTerms: string[];
  supabase: PremiumSupabase;
}): Promise<LeadPriorityRuleRecord> {
  const { data, error } = await input.supabase
    .from("lead_priority_rules")
    .insert({
      area_terms: input.areaTerms,
      business_id: input.businessId,
      created_by_user_id: input.createdByUserId,
      description: input.description,
      name: input.name,
      priority_rank: input.priorityRank,
      service_terms: input.serviceTerms,
    })
    .select("*")
    .single();
  await throwIfError(error);
  if (!data) throw new Error("Unable to create the priority rule.");
  return data;
}

export async function deletePriorityRule(input: {
  businessId: string;
  id: string;
  supabase: PremiumSupabase;
}): Promise<void> {
  const { error } = await input.supabase
    .from("lead_priority_rules")
    .delete()
    .eq("business_id", input.businessId)
    .eq("id", input.id);
  await throwIfError(error);
}

export async function listServiceTimeBlocks(input: {
  businessId: string;
  supabase: PremiumSupabase;
}): Promise<ServiceTimeBlockRecord[]> {
  return collectSupabaseRangePages({
    fetchPage: async ({ from, to }) => {
      const { data, error } = await input.supabase
        .from("service_time_blocks")
        .select("*")
        .eq("business_id", input.businessId)
        .gte("ends_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to);
      await throwIfError(error);
      return data ?? [];
    },
  });
}

export async function createServiceTimeBlock(input: {
  businessId: string;
  clientName: string;
  companyName: string | null;
  createdByUserId: string;
  endsAt: string;
  leadId: string | null;
  notes: string | null;
  serviceLabel: string;
  startsAt: string;
  status: "reserved" | "tentative";
  supabase: PremiumSupabase;
}): Promise<ServiceTimeBlockRecord> {
  const { data, error } = await input.supabase
    .from("service_time_blocks")
    .insert({
      business_id: input.businessId,
      client_name: input.clientName,
      company_name: input.companyName,
      created_by_user_id: input.createdByUserId,
      ends_at: input.endsAt,
      lead_id: input.leadId,
      notes: input.notes,
      service_label: input.serviceLabel,
      starts_at: input.startsAt,
      status: input.status,
    })
    .select("*")
    .single();
  await throwIfError(error);
  if (!data) throw new Error("Unable to create the internal time block.");
  return data;
}

export async function cancelServiceTimeBlock(input: {
  businessId: string;
  id: string;
  supabase: PremiumSupabase;
}): Promise<void> {
  const { data, error } = await input.supabase
    .from("service_time_blocks")
    .update({ status: "cancelled" })
    .eq("business_id", input.businessId)
    .eq("id", input.id)
    .select("id")
    .maybeSingle();
  await throwIfError(error);
  if (!data) {
    throw new Error("The requested internal time block is unavailable.");
  }
}

export async function listBulkReplyDrafts(input: {
  businessId: string;
  supabase: PremiumSupabase;
}): Promise<BulkReplyDraftRecord[]> {
  const { data, error } = await input.supabase
    .from("bulk_reply_drafts")
    .select("*")
    .eq("business_id", input.businessId)
    .order("created_at", { ascending: false })
    .limit(20);
  await throwIfError(error);
  return data ?? [];
}

export async function getBulkReplyDraftById(input: {
  businessId: string;
  id: string;
  supabase: PremiumSupabase;
}): Promise<BulkReplyDraftRecord | null> {
  const { data, error } = await input.supabase
    .from("bulk_reply_drafts")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("id", input.id)
    .maybeSingle();
  await throwIfError(error);
  return data;
}

export async function findAvailabilityReviewDraftForLead(input: {
  businessId: string;
  leadId: string;
  supabase: PremiumSupabase;
}): Promise<BulkReplyDraftRecord | null> {
  const { data, error } = await input.supabase
    .from("bulk_reply_drafts")
    .select("*")
    .eq("business_id", input.businessId)
    .contains("audience_summary", {
      leadId: input.leadId,
      source: "availability_conflict",
    })
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  await throwIfError(error);
  return data;
}

export async function listBulkReplyDraftRecipients(input: {
  businessId: string;
  draftIds: string[];
  supabase: PremiumSupabase;
}): Promise<BulkReplyDraftRecipientRecord[]> {
  if (input.draftIds.length === 0) return [];
  const { data, error } = await input.supabase
    .from("bulk_reply_draft_recipients")
    .select("*")
    .eq("business_id", input.businessId)
    .in("draft_id", input.draftIds)
    .order("created_at", { ascending: true });
  await throwIfError(error);
  return data ?? [];
}

export async function getBulkReplyDraftRecipientById(input: {
  businessId: string;
  id: string;
  supabase: PremiumSupabase;
}): Promise<BulkReplyDraftRecipientRecord | null> {
  const { data, error } = await input.supabase
    .from("bulk_reply_draft_recipients")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("id", input.id)
    .maybeSingle();
  await throwIfError(error);
  return data;
}

export async function createPremiumReplyDraftAtomic(input: {
  audienceSummary: Json;
  businessId: string;
  messageTemplate: string;
  recipients: Array<Readonly<{ leadId: string; renderedMessage: string }>>;
  supabase: PremiumSupabase;
  title: string;
}): Promise<string> {
  const { data, error } = await input.supabase.rpc("create_premium_reply_draft", {
    target_audience_summary: input.audienceSummary,
    target_business_id: input.businessId,
    target_message_template: input.messageTemplate,
    target_recipients: input.recipients.map((recipient) => ({
      leadId: recipient.leadId,
      renderedMessage: recipient.renderedMessage,
    })),
    target_title: input.title,
  });
  await throwIfError(error);
  if (typeof data !== "string" || data.length === 0) {
    throw new Error("Unable to prepare the draft batch.");
  }
  return data;
}

export async function createAvailabilityReviewDraftAtomic(input: {
  businessId: string;
  conflictBlockIds: readonly string[];
  leadId: string;
  messageTemplate: string;
  requestedEndsAt: string;
  requestedStartsAt: string;
  suggestedEndsAt: string | null;
  suggestedStartsAt: string | null;
  supabase: PremiumSupabase;
  title: string;
}): Promise<string> {
  const { data, error } = await input.supabase.rpc(
    "create_availability_review_draft",
    {
      target_business_id: input.businessId,
      target_conflict_block_ids: [...input.conflictBlockIds],
      target_lead_id: input.leadId,
      target_message_template: input.messageTemplate,
      target_requested_ends_at: input.requestedEndsAt,
      target_requested_starts_at: input.requestedStartsAt,
      target_suggested_ends_at: input.suggestedEndsAt,
      target_suggested_starts_at: input.suggestedStartsAt,
      target_title: input.title,
    },
  );
  await throwIfError(error);
  if (typeof data !== "string" || data.length === 0) {
    throw new Error("Unable to prepare the availability review draft.");
  }
  return data;
}

export async function markBulkReplyDraftReviewed(input: {
  businessId: string;
  draftId: string;
  supabase: PremiumSupabase;
}): Promise<void> {
  const { data, error } = await input.supabase
    .from("bulk_reply_drafts")
    .update({ reviewed_at: new Date().toISOString(), status: "reviewed" })
    .eq("business_id", input.businessId)
    .eq("id", input.draftId)
    .eq("status", "draft")
    .select("id")
    .maybeSingle();
  await throwIfError(error);
  if (!data) throw new Error("The requested draft is unavailable.");
}

export async function markBulkReplyRecipientCopied(input: {
  businessId: string;
  recipientId: string;
  supabase: PremiumSupabase;
}): Promise<void> {
  const { data, error } = await input.supabase
    .from("bulk_reply_draft_recipients")
    .update({ copied_at: new Date().toISOString() })
    .eq("business_id", input.businessId)
    .eq("id", input.recipientId)
    .is("copied_at", null)
    .select("id")
    .maybeSingle();
  await throwIfError(error);
  if (!data) throw new Error("The requested draft is unavailable.");
}
