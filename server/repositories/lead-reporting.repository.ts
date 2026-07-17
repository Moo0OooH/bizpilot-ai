/**
 * ============================================================
 * File: server/repositories/lead-reporting.repository.ts
 * Project: BizPilot AI
 * Description: Tenant-scoped read-only queries for owner lead source reports.
 * Role: Loads bounded lead and attribution signals through the authenticated Supabase client without triggering workflow writes.
 * Related:
 * - server/services/lead-reporting.service.ts
 * - lib/lead-source-analytics.ts
 * - supabase/migrations/0005_public_intake_and_leads.sql
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Created bounded tenant reporting reads for leads and source metadata.
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type LeadReportingRow = Pick<
  Database["public"]["Tables"]["leads"]["Row"],
  | "business_id"
  | "created_at"
  | "id"
  | "manual_outcome"
  | "source_channel"
  | "status"
>;

export type LeadReportingSourceRow = Pick<
  Database["public"]["Tables"]["lead_source_metadata"]["Row"],
  "lead_id" | "utm_campaign" | "utm_source"
>;

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export async function listLeadReportingRows(input: {
  businessId: string;
  limit: number;
  rangeStart?: string | undefined;
  supabase: SupabaseClient<Database>;
}): Promise<LeadReportingRow[]> {
  let query = input.supabase
    .from("leads")
    .select("business_id,created_at,id,manual_outcome,source_channel,status")
    .eq("business_id", input.businessId)
    .order("created_at", { ascending: false })
    .limit(input.limit);

  if (input.rangeStart) query = query.gte("created_at", input.rangeStart);

  const { data, error } = await query;
  throwIfError(error);
  return data ?? [];
}

export async function listLeadReportingSources(input: {
  businessId: string;
  leadIds: readonly string[];
  supabase: SupabaseClient<Database>;
}): Promise<LeadReportingSourceRow[]> {
  if (input.leadIds.length === 0) return [];

  const { data, error } = await input.supabase
    .from("lead_source_metadata")
    .select("lead_id,utm_campaign,utm_source")
    .eq("business_id", input.businessId)
    .in("lead_id", [...input.leadIds]);

  throwIfError(error);
  return data ?? [];
}
