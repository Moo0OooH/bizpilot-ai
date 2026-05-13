/**
 * ============================================================
 * File: server/services/ai/lead-conversion-assistant.service.ts
 * Project: BizPilot AI
 * Description: Coordinates Phase 6 on-demand AI lead conversion assistance.
 * Role: Generates cached assistant-only lead summaries, reply drafts, follow-up drafts, and next actions.
 * Related:
 * - server/repositories/ai.repository.ts
 * - server/services/ai/prompt-registry.ts
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-11: Created on-demand lead conversion bundle generator with rule fallback.
 * - 2026-05-13: Imported server env through the explicit server-only boundary.
 * ============================================================
 */

import "server-only";

import { createHash } from "node:crypto";

import { getServerEnv } from "@/lib/env/server-env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getAiOutputForLeadByHash,
  getLatestAiOutputForLead,
  insertAiOutput,
  insertUsageEvent,
  type AiOutputRecord,
} from "@/server/repositories/ai.repository";
import type { BusinessRecord } from "@/server/repositories/businesses.repository";
import {
  getLeadById,
  getQualityScoreForLead,
  listSubmissionValuesForLead,
} from "@/server/repositories/lead-conversion.repository";
import { estimateAiCost, estimateTokens } from "@/server/services/ai/ai-cost";
import { maskAiPromptValue } from "@/server/services/ai/privacy-filter";
import {
  leadConversionBundleInstructions,
  leadConversionBundlePrompt,
} from "@/server/services/ai/prompt-registry";
import type { Json } from "@/types/database";

export type LeadConversionAiBundle = Readonly<{
  followUpDraft: string;
  leadSummary: string;
  leadQualityExplanation: string;
  missingInfoReasoning: string;
  replyDraft: string;
  suggestedNextAction: string;
  toneVariants: Readonly<{
    concise: string;
    friendly: string;
  }>;
}>;

export type LeadConversionAiOutput = Readonly<{
  createdAt: string;
  estimatedCost: number;
  inputTokens: number;
  model: string;
  output: LeadConversionAiBundle;
  outputTokens: number;
  provider: AiOutputRecord["provider"];
  status: AiOutputRecord["status"];
}>;

const bundleSchema = {
  additionalProperties: false,
  properties: {
    followUpDraft: { type: "string" },
    leadQualityExplanation: { type: "string" },
    leadSummary: { type: "string" },
    missingInfoReasoning: { type: "string" },
    replyDraft: { type: "string" },
    suggestedNextAction: { type: "string" },
    toneVariants: {
      additionalProperties: false,
      properties: {
        concise: { type: "string" },
        friendly: { type: "string" },
      },
      required: ["concise", "friendly"],
      type: "object",
    },
  },
  required: [
    "followUpDraft",
    "leadQualityExplanation",
    "leadSummary",
    "missingInfoReasoning",
    "replyDraft",
    "suggestedNextAction",
    "toneVariants",
  ],
  type: "object",
} as const;

function isBundle(value: unknown): value is LeadConversionAiBundle {
  if (!value || typeof value !== "object") {
    return false;
  }

  const bundle = value as Partial<LeadConversionAiBundle>;
  const toneVariants = bundle.toneVariants;

  return (
    typeof bundle.followUpDraft === "string" &&
    typeof bundle.leadQualityExplanation === "string" &&
    typeof bundle.leadSummary === "string" &&
    typeof bundle.missingInfoReasoning === "string" &&
    typeof bundle.replyDraft === "string" &&
    typeof bundle.suggestedNextAction === "string" &&
    !!toneVariants &&
    typeof toneVariants.concise === "string" &&
    typeof toneVariants.friendly === "string"
  );
}

function parseAiOutput(record: AiOutputRecord | null): LeadConversionAiOutput | null {
  if (!record || !isBundle(record.output)) {
    return null;
  }

  return {
    createdAt: record.created_at,
    estimatedCost: Number(record.estimated_cost),
    inputTokens: record.input_tokens,
    model: record.model,
    output: record.output,
    outputTokens: record.output_tokens,
    provider: record.provider,
    status: record.status,
  };
}

function buildPromptContext(input: {
  business: BusinessRecord;
  lead: NonNullable<Awaited<ReturnType<typeof getLeadById>>>;
  qualityScore: NonNullable<Awaited<ReturnType<typeof getQualityScoreForLead>>>;
  submissionValues: Awaited<ReturnType<typeof listSubmissionValuesForLead>>;
}): string {
  const context = {
    business: {
      name: input.business.name,
      vertical: "cleaning",
    },
    lead: {
      cityOrServiceArea: input.lead.city_or_service_area,
      customerNameCaptured: Boolean(input.lead.customer_name),
      responseSlaState: input.lead.response_sla_state,
      serviceType: input.lead.service_type,
      sourceChannel: input.lead.source_channel,
      status: input.lead.status,
    },
    quality: {
      completenessLabel: input.qualityScore.completeness_label,
      completenessScore: input.qualityScore.completeness_score,
      explanation: input.qualityScore.explanation,
      missingInfoKeys: input.qualityScore.missing_info_keys,
      qualityLevel: input.qualityScore.quality_level,
    },
    submittedQuoteDetails: input.submissionValues.map((value) => ({
      label: value.field_label,
      value: maskAiPromptValue(value.field_value),
    })),
  };

  return JSON.stringify(maskAiPromptValue(context));
}

function hashContext(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function fallbackBundle(input: {
  lead: NonNullable<Awaited<ReturnType<typeof getLeadById>>>;
  qualityScore: NonNullable<Awaited<ReturnType<typeof getQualityScoreForLead>>>;
}): LeadConversionAiBundle {
  const service = input.lead.service_type ?? "cleaning";
  const area = input.lead.city_or_service_area ?? "your area";
  const missing = input.qualityScore.missing_info_keys;
  const missingText =
    missing.length > 0
      ? `I need a few details first: ${missing.join(", ")}.`
      : "I have the key details needed to reply.";

  return {
    followUpDraft: `Hi, just following up on your ${service} quote request for ${area}. If you still need help, send me any missing details and I can help move this forward.`,
    leadQualityExplanation: input.qualityScore.explanation,
    leadSummary: `This is a ${input.qualityScore.quality_level.replaceAll(
      "_",
      " ",
    )} ${service} quote request for ${area}.`,
    missingInfoReasoning: missingText,
    replyDraft: `Hi, thanks for reaching out about ${service}. ${missingText} Once I have that, I can review the request and follow up with the next step.`,
    suggestedNextAction:
      missing.length > 0 ? "Ask for the missing quote details." : "Reply now while the lead is warm.",
    toneVariants: {
      concise: `Thanks for the ${service} request. ${missingText}`,
      friendly: `Hi, thanks so much for reaching out about ${service}. ${missingText}`,
    },
  };
}

async function callOpenAi(input: {
  apiKey: string;
  context: string;
  model: string;
}): Promise<{ output: LeadConversionAiBundle; outputText: string }> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    body: JSON.stringify({
      input: input.context,
      instructions: leadConversionBundleInstructions,
      max_output_tokens: 900,
      model: input.model,
      text: {
        format: {
          name: leadConversionBundlePrompt.outputSchemaName,
          schema: bundleSchema,
          strict: true,
          type: "json_schema",
        },
      },
    }),
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as { output_text?: string };
  const outputText = payload.output_text;

  if (!outputText) {
    throw new Error("OpenAI response did not include output text.");
  }

  const parsed = JSON.parse(outputText) as unknown;

  if (!isBundle(parsed)) {
    throw new Error("OpenAI response did not match the lead bundle schema.");
  }

  return { output: parsed, outputText };
}

export async function getLatestLeadAiOutput(input: {
  business: BusinessRecord;
  leadId: string;
}): Promise<LeadConversionAiOutput | null> {
  const supabase = await createSupabaseServerClient();
  const record = await getLatestAiOutputForLead({
    businessId: input.business.id,
    leadId: input.leadId,
    supabase,
  });

  return parseAiOutput(record);
}

export async function generateLeadAiBundle(input: {
  business: BusinessRecord;
  leadId: string;
}): Promise<LeadConversionAiOutput> {
  const supabase = await createSupabaseServerClient();
  const [lead, qualityScore] = await Promise.all([
    getLeadById({
      businessId: input.business.id,
      leadId: input.leadId,
      supabase,
    }),
    getQualityScoreForLead({
      businessId: input.business.id,
      leadId: input.leadId,
      supabase,
    }),
  ]);

  if (!lead || !qualityScore) {
    throw new Error("Lead is not ready for AI assistance yet.");
  }

  const submissionValues = await listSubmissionValuesForLead({
    businessId: input.business.id,
    lead,
    supabase,
  });
  const context = buildPromptContext({
    business: input.business,
    lead,
    qualityScore,
    submissionValues,
  });
  const inputHash = hashContext(
    `${leadConversionBundlePrompt.name}:${leadConversionBundlePrompt.version}:${context}`,
  );
  const cached = await getAiOutputForLeadByHash({
    businessId: input.business.id,
    inputHash,
    leadId: input.leadId,
    supabase,
  });

  if (cached) {
    return parseAiOutput(cached)!;
  }

  const env = getServerEnv();
  const model = leadConversionBundlePrompt.approvedModel;
  const inputTokens = estimateTokens(context);

  try {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const generated = await callOpenAi({
      apiKey: env.OPENAI_API_KEY,
      context,
      model,
    });
    const outputTokens = estimateTokens(generated.outputText);
    const estimatedCost = estimateAiCost({ inputTokens, outputTokens });
    const record = await insertAiOutput({
      businessId: input.business.id,
      cachedTokens: 0,
      estimatedCost,
      inputHash,
      inputTokens,
      leadId: input.leadId,
      model,
      output: generated.output as unknown as Json,
      outputTokens,
      promptName: leadConversionBundlePrompt.name,
      promptVersion: leadConversionBundlePrompt.version,
      provider: "openai",
      status: "generated",
      supabase,
    });

    await insertUsageEvent({
      businessId: input.business.id,
      cachedTokens: 0,
      estimatedCost,
      eventType: "ai_bundle_generated",
      inputTokens,
      leadId: input.leadId,
      metadata: { promptVersion: leadConversionBundlePrompt.version },
      model,
      operationType: "lead_conversion_bundle",
      outputTokens,
      provider: "openai",
      supabase,
    });

    return parseAiOutput(record)!;
  } catch (error) {
    const output = fallbackBundle({ lead, qualityScore });
    const outputText = JSON.stringify(output);
    const outputTokens = estimateTokens(outputText);
    const record = await insertAiOutput({
      businessId: input.business.id,
      cachedTokens: 0,
      errorMessage:
        error instanceof Error ? error.message : "AI generation failed.",
      estimatedCost: 0,
      inputHash,
      inputTokens,
      leadId: input.leadId,
      model: "rule-fallback-v1",
      output: output as unknown as Json,
      outputTokens,
      promptName: leadConversionBundlePrompt.name,
      promptVersion: leadConversionBundlePrompt.version,
      provider: "rule_fallback",
      status: "fallback",
      supabase,
    });

    await insertUsageEvent({
      businessId: input.business.id,
      cachedTokens: 0,
      estimatedCost: 0,
      eventType: "ai_bundle_fallback",
      inputTokens,
      leadId: input.leadId,
      metadata: {
        reason: error instanceof Error ? error.message : "unknown",
      },
      model: "rule-fallback-v1",
      operationType: "lead_conversion_bundle",
      outputTokens,
      provider: "rule_fallback",
      supabase,
    });

    return parseAiOutput(record)!;
  }
}
