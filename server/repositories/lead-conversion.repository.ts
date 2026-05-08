/**
 * ============================================================
 * File: server/repositories/lead-conversion.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 5 Lead Conversion Desk data access.
 * Role: Owns tenant-scoped lead, score, action item, and timeline operations through Supabase RLS.
 * Related:
 * - server/services/lead-conversion.service.ts
 * - supabase/migrations/0007_lead_conversion_desk.sql
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-07
 * Change Log:
 * - 2026-05-07: Created Phase 5 lead conversion repository.
 * ============================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types/database";

export type LeadRecord = Database["public"]["Tables"]["leads"]["Row"];
export type LeadQualityScoreRecord =
  Database["public"]["Tables"]["lead_quality_scores"]["Row"];
export type LeadActionItemRecord =
  Database["public"]["Tables"]["lead_action_items"]["Row"];
export type LeadEventRecord =
  Database["public"]["Tables"]["lead_events"]["Row"];
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

async function throwIfError(error: { message: string } | null): Promise<void> {
  if (error) {
    throw new Error(error.message);
  }
}

export async function listLeadsForBusiness(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadRecord[]> {
  const { data, error } = await input.supabase
    .from("leads")
    .select("*")
    .eq("business_id", input.businessId)
    .order("created_at", { ascending: false });

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
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadQualityScoreRecord | null> {
  const { data, error } = await input.supabase
    .from("lead_quality_scores")
    .select("*")
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
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadActionItemRecord[]> {
  const { data, error } = await input.supabase
    .from("lead_action_items")
    .select("*")
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
}): Promise<void> {
  const { error } = await input.supabase
    .from("lead_action_items")
    .update({
      completed_at: new Date().toISOString(),
      status: "completed",
    })
    .eq("business_id", input.businessId)
    .eq("id", input.actionItemId);

  await throwIfError(error);
}

export async function listEventsForLead(input: {
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<LeadEventRecord[]> {
  const { data, error } = await input.supabase
    .from("lead_events")
    .select("*")
    .eq("lead_id", input.leadId)
    .order("created_at", { ascending: false });

  await throwIfError(error);

  return data ?? [];
}

export async function insertLeadEvent(input: {
  businessId: string;
  eventLabel: string;
  eventType: LeadEventType;
  leadId: string;
  metadata?: Json;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase.from("lead_events").insert({
    business_id: input.businessId,
    event_label: input.eventLabel,
    event_type: input.eventType,
    lead_id: input.leadId,
    metadata: input.metadata ?? {},
  });

  await throwIfError(error);
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
