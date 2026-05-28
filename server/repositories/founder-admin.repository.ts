/**
 * ============================================================
 * File: server/repositories/founder-admin.repository.ts
 * Project: BizPilot AI
 * Description: Service-role repository for the internal founder admin console.
 * Role: Centralizes manual plan/access reads and writes after founder authorization.
 * Related:
 * - server/services/founder-admin.service.ts
 * - supabase/migrations/0015_business_access_plan_and_admin_log.sql
 * Author: MoOoH
 * Created: 2026-05-22
 * Last Updated: 2026-05-22
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types/database";

export type FounderBusinessRecord =
  Database["public"]["Tables"]["businesses"]["Row"];
export type FounderBusinessStatus = FounderBusinessRecord["status"];
export type FounderPlanSlug = FounderBusinessRecord["plan_slug"];
export type FounderSessionTimeoutMode =
  FounderBusinessRecord["session_timeout_mode"];
export type FounderWorkspaceKind = FounderBusinessRecord["workspace_kind"];
export type FounderAdminActionType =
  Database["public"]["Tables"]["admin_action_log"]["Row"]["action_type"];
export type FounderAdminLogRecord =
  Database["public"]["Tables"]["admin_action_log"]["Row"];
export type FounderDeletionRequestRecord =
  Database["public"]["Tables"]["business_deletion_requests"]["Row"];
export type FounderProfileRecord =
  Database["public"]["Tables"]["profiles"]["Row"];

export type FounderBusinessMemberRecord =
  Database["public"]["Tables"]["business_members"]["Row"];

export type FounderPublicLinkRecord =
  Database["public"]["Tables"]["public_link_variants"]["Row"];
export type FounderLeadRecord = Database["public"]["Tables"]["leads"]["Row"];
export type FounderLeadSourceRecord =
  Database["public"]["Tables"]["lead_source_metadata"]["Row"];

function throwIfError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

export async function listFounderBusinesses(input: {
  supabase: SupabaseClient<Database>;
}): Promise<FounderBusinessRecord[]> {
  const { data, error } = await input.supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  throwIfError(error);

  return data ?? [];
}

export async function listFounderBusinessMembers(input: {
  supabase: SupabaseClient<Database>;
}): Promise<FounderBusinessMemberRecord[]> {
  const { data, error } = await input.supabase
    .from("business_members")
    .select("*")
    .order("created_at", { ascending: true });

  throwIfError(error);

  return data ?? [];
}

export async function listFounderPublicLinks(input: {
  supabase: SupabaseClient<Database>;
}): Promise<FounderPublicLinkRecord[]> {
  const { data, error } = await input.supabase
    .from("public_link_variants")
    .select("*")
    .order("created_at", { ascending: true });

  throwIfError(error);

  return data ?? [];
}

export async function listFounderLeadSignals(input: {
  supabase: SupabaseClient<Database>;
}): Promise<Array<{ business_id: string; created_at: string }>> {
  const { data, error } = await input.supabase
    .from("leads")
    .select("business_id,created_at")
    .order("created_at", { ascending: false });

  throwIfError(error);

  return data ?? [];
}

export async function listFounderLeadInbox(input: {
  limit?: number;
  supabase: SupabaseClient<Database>;
}): Promise<FounderLeadRecord[]> {
  const { data, error } = await input.supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(input.limit ?? 80);

  throwIfError(error);

  return data ?? [];
}

export async function listFounderLeadSourcesByLeadIds(input: {
  leadIds: string[];
  supabase: SupabaseClient<Database>;
}): Promise<FounderLeadSourceRecord[]> {
  if (input.leadIds.length === 0) {
    return [];
  }

  const { data, error } = await input.supabase
    .from("lead_source_metadata")
    .select("*")
    .in("lead_id", input.leadIds);

  throwIfError(error);

  return data ?? [];
}

export async function getFounderLeadById(input: {
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<FounderLeadRecord> {
  const { data, error } = await input.supabase
    .from("leads")
    .select("*")
    .eq("id", input.leadId)
    .single();

  throwIfError(error);

  if (!data) {
    throw new Error("Lead not found.");
  }

  return data;
}

export async function updateFounderLeadStatus(input: {
  leadId: string;
  status: FounderLeadRecord["status"];
  supabase: SupabaseClient<Database>;
}): Promise<FounderLeadRecord> {
  const { data, error } = await input.supabase
    .from("leads")
    .update({ status: input.status })
    .eq("id", input.leadId)
    .select("*")
    .single();

  throwIfError(error);

  if (!data) {
    throw new Error("Lead not found.");
  }

  return data;
}

export async function deleteFounderLeadThread(input: {
  businessId: string;
  submissionId: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase
    .from("intake_submissions")
    .delete()
    .eq("id", input.submissionId)
    .eq("business_id", input.businessId);

  throwIfError(error);
}

export async function listFounderUsageSignals(input: {
  supabase: SupabaseClient<Database>;
}): Promise<Array<{ business_id: string; created_at: string }>> {
  const { data, error } = await input.supabase
    .from("usage_events")
    .select("business_id,created_at")
    .order("created_at", { ascending: false });

  throwIfError(error);

  return data ?? [];
}

export async function listFounderAdminLog(input: {
  businessId?: string;
  limit?: number;
  supabase: SupabaseClient<Database>;
}): Promise<FounderAdminLogRecord[]> {
  let query = input.supabase
    .from("admin_action_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (input.businessId) {
    query = query.eq("business_id", input.businessId);
  }

  const { data, error } = await query.limit(input.limit ?? 20);

  throwIfError(error);

  return data ?? [];
}

export async function listFounderDeletionRequests(input: {
  supabase: SupabaseClient<Database>;
}): Promise<FounderDeletionRequestRecord[]> {
  const { data, error } = await input.supabase
    .from("business_deletion_requests")
    .select("*")
    .order("requested_at", { ascending: false });

  throwIfError(error);

  return data ?? [];
}

export async function listFounderProfilesByUserIds(input: {
  supabase: SupabaseClient<Database>;
  userIds: string[];
}): Promise<Array<Pick<FounderProfileRecord, "display_name" | "user_id">>> {
  if (input.userIds.length === 0) {
    return [];
  }

  const { data, error } = await input.supabase
    .from("profiles")
    .select("user_id,display_name")
    .in("user_id", input.userIds);

  throwIfError(error);

  return data ?? [];
}

export async function searchFounderProfilesByDisplayName(input: {
  page: number;
  pageSize: number;
  query: string;
  supabase: SupabaseClient<Database>;
}): Promise<{
  profiles: Array<Pick<FounderProfileRecord, "display_name" | "user_id">>;
  total: number;
}> {
  const from = (input.page - 1) * input.pageSize;
  const to = from + input.pageSize - 1;
  const { count, data, error } = await input.supabase
    .from("profiles")
    .select("user_id,display_name", { count: "exact" })
    .ilike("display_name", `%${input.query}%`)
    .range(from, to);

  throwIfError(error);

  return {
    profiles: data ?? [],
    total: count ?? 0,
  };
}

export async function getFounderBusiness(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<FounderBusinessRecord> {
  const { data, error } = await input.supabase
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();

  throwIfError(error);

  if (!data) {
    throw new Error("Business not found.");
  }

  return data;
}

export async function updateFounderBusinessControls(input: {
  businessId: string;
  internalNote?: string | null;
  planExpiresAt?: string | null;
  planSlug?: FounderPlanSlug;
  sessionTimeoutMinutes?: number | null;
  sessionTimeoutMode?: FounderSessionTimeoutMode;
  status?: FounderBusinessStatus;
  supabase: SupabaseClient<Database>;
  workspaceKind?: FounderWorkspaceKind;
}): Promise<FounderBusinessRecord> {
  const update: Database["public"]["Tables"]["businesses"]["Update"] = {};

  if (input.internalNote !== undefined) {
    update.internal_note = input.internalNote;
  }

  if (input.planExpiresAt !== undefined) {
    update.plan_expires_at = input.planExpiresAt;
  }

  if (input.planSlug !== undefined) {
    update.plan_slug = input.planSlug;
    update.plan_started_at = new Date().toISOString();
  }

  if (input.sessionTimeoutMode !== undefined) {
    update.session_timeout_mode = input.sessionTimeoutMode;
    update.session_timeout_minutes =
      input.sessionTimeoutMode === "after_duration"
        ? (input.sessionTimeoutMinutes ?? 480)
        : null;
  }

  if (input.status !== undefined) {
    update.status = input.status;
  }

  if (input.workspaceKind !== undefined) {
    update.workspace_kind = input.workspaceKind;
  }

  const { data, error } = await input.supabase
    .from("businesses")
    .update(update)
    .eq("id", input.businessId)
    .select("*")
    .single();

  throwIfError(error);

  if (!data) {
    throw new Error("Business not found.");
  }

  return data;
}

export async function setFounderPublicLinksActive(input: {
  active: boolean;
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase
    .from("public_link_variants")
    .update({ is_active: input.active })
    .eq("business_id", input.businessId);

  throwIfError(error);
}

export async function insertFounderAdminAction(input: {
  actionType: FounderAdminActionType;
  actorUserId: string;
  businessId: string | null;
  newValues: Json;
  note?: string | null;
  previousValues: Json;
  supabase: SupabaseClient<Database>;
}): Promise<string> {
  const { data, error } = await input.supabase
    .from("admin_action_log")
    .insert({
      action_type: input.actionType,
      actor_user_id: input.actorUserId,
      business_id: input.businessId,
      new_values: input.newValues,
      note: input.note ?? null,
      previous_values: input.previousValues,
    })
    .select("id")
    .single();

  throwIfError(error);

  if (!data) {
    throw new Error("Admin action log insert failed.");
  }

  return data.id;
}

export async function updateFounderAdminActionNewValues(input: {
  actionId: string;
  newValues: Json;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase
    .from("admin_action_log")
    .update({ new_values: input.newValues })
    .eq("id", input.actionId);

  throwIfError(error);
}
