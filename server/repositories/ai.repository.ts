/**
 * ============================================================
 * File: server/repositories/ai.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 6 AI output and usage event persistence.
 * Role: Owns tenant-scoped cached AI assistant outputs through Supabase RLS.
 * Related:
 * - server/services/ai/lead-conversion-assistant.service.ts
 * - supabase/migrations/0009_ai_lead_conversion_assistant.sql
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-11: Created AI output cache and usage event repository helpers.
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types/database";

export type AiOutputRecord = Database["public"]["Tables"]["ai_outputs"]["Row"];

async function throwIfError(error: { message: string } | null): Promise<void> {
  if (error) {
    throw new Error(error.message);
  }
}

function isMissingAiStorageError(error: { message: string } | null): boolean {
  if (!error) {
    return false;
  }

  return (
    error.message.includes("ai_outputs") ||
    error.message.includes("usage_events") ||
    error.message.includes("relation") ||
    error.message.includes("schema cache")
  );
}

export async function getLatestAiOutputForLead(input: {
  businessId: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<AiOutputRecord | null> {
  const { data, error } = await input.supabase
    .from("ai_outputs")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("lead_id", input.leadId)
    .eq("output_type", "lead_conversion_bundle")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (isMissingAiStorageError(error)) {
    return null;
  }

  await throwIfError(error);

  return data;
}

export async function getAiOutputForLeadByHash(input: {
  businessId: string;
  inputHash: string;
  leadId: string;
  supabase: SupabaseClient<Database>;
}): Promise<AiOutputRecord | null> {
  const { data, error } = await input.supabase
    .from("ai_outputs")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("lead_id", input.leadId)
    .eq("output_type", "lead_conversion_bundle")
    .eq("input_hash", input.inputHash)
    .maybeSingle();

  if (isMissingAiStorageError(error)) {
    return null;
  }

  await throwIfError(error);

  return data;
}

export async function insertAiOutput(input: {
  businessId: string;
  cachedTokens: number;
  errorMessage?: string | null;
  estimatedCost: number;
  inputHash: string;
  inputTokens: number;
  leadId: string;
  model: string;
  output: Json;
  outputTokens: number;
  promptName: string;
  promptVersion: string;
  provider: "openai" | "rule_fallback";
  status: "failed" | "fallback" | "generated";
  supabase: SupabaseClient<Database>;
}): Promise<AiOutputRecord> {
  const { data, error } = await input.supabase
    .from("ai_outputs")
    .upsert(
      {
        business_id: input.businessId,
        cached_tokens: input.cachedTokens,
        error_message: input.errorMessage ?? null,
        estimated_cost: input.estimatedCost,
        input_hash: input.inputHash,
        input_tokens: input.inputTokens,
        lead_id: input.leadId,
        model: input.model,
        output: input.output,
        output_tokens: input.outputTokens,
        output_type: "lead_conversion_bundle",
        prompt_name: input.promptName,
        prompt_version: input.promptVersion,
        provider: input.provider,
        status: input.status,
      },
      {
        onConflict: "business_id,lead_id,output_type,input_hash",
      },
    )
    .select("*")
    .single();

  await throwIfError(error);

  if (!data) {
    throw new Error("Unable to save AI output.");
  }

  return data;
}

export async function insertUsageEvent(input: {
  businessId: string;
  cachedTokens: number;
  estimatedCost: number;
  eventType: "ai_bundle_failed" | "ai_bundle_fallback" | "ai_bundle_generated";
  inputTokens: number;
  leadId: string;
  metadata?: Json;
  model: string;
  operationType: "lead_conversion_bundle";
  outputTokens: number;
  provider: "openai" | "rule_fallback";
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase.from("usage_events").insert({
    business_id: input.businessId,
    cached_tokens: input.cachedTokens,
    estimated_cost: input.estimatedCost,
    event_type: input.eventType,
    input_tokens: input.inputTokens,
    lead_id: input.leadId,
    metadata: input.metadata ?? {},
    model: input.model,
    operation_type: input.operationType,
    output_tokens: input.outputTokens,
    provider: input.provider,
  });

  await throwIfError(error);
}
