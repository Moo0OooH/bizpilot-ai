/**
 * ============================================================
 * File: server/services/ai/lead-conversion-assistant.service.ts
 * Project: BizPilot AI
 * Description: Coordinates Phase 6 on-demand AI lead conversion assistance.
 * Role: Generates cached assistant-only lead summaries, reply drafts, follow-up drafts, and next actions.
 * Related:
 * - server/repositories/ai.repository.ts
 * - server/services/ai/prompt-registry.ts
 * - server/providers/ai/index.ts
 * - server/services/ai/error-sanitizer.ts
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-15
 * Change Log:
 * - 2026-05-15: Phase 15. Extracted raw OpenAI fetch into server/providers/ai/openai-provider.ts.
 *   Service now depends on the AIProvider boundary and sanitizes persisted error metadata.
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-11: Created on-demand lead conversion bundle generator with rule fallback.
 * - 2026-05-13: Imported server env through the explicit server-only boundary.
 * ============================================================
 */

import "server-only";

import { createHash } from "node:crypto";

import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  isWorkspaceLockedForNewCustomerWork,
  WORKSPACE_LOCKED_FOR_NEW_WORK_MESSAGE,
} from "@/lib/business-lifecycle/lock";
import {
  aiLanguageInstruction,
  readSupportedLanguage,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getDefaultAiProvider,
  type AIProvider,
} from "@/server/providers/ai";
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
import { sanitizeAiFailureReason } from "@/server/services/ai/error-sanitizer";
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
  errorMessage: string | null;
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
    errorMessage: record.error_message,
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
      preferredLanguage: input.business.preferred_language,
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
  language: SupportedLanguage;
  lead: NonNullable<Awaited<ReturnType<typeof getLeadById>>>;
  qualityScore: NonNullable<Awaited<ReturnType<typeof getQualityScoreForLead>>>;
}): LeadConversionAiBundle {
  const copy = getBizPilotCopy(input.language);
  const service = input.lead.service_type ?? copy.aiFallback.serviceFallback;
  const area = input.lead.city_or_service_area ?? copy.aiFallback.areaFallback;
  const missing = input.qualityScore.missing_info_keys;
  const missingText = copy.aiFallback.missingText(missing);

  return {
    followUpDraft: copy.aiFallback.followUpDraft(service, area),
    leadQualityExplanation: input.qualityScore.explanation,
    leadSummary: copy.aiFallback.leadSummary(
      input.qualityScore.quality_level.replaceAll("_", " "),
      service,
      area,
    ),
    missingInfoReasoning: missingText,
    replyDraft: copy.aiFallback.replyDraft(service, missingText),
    suggestedNextAction:
      missing.length > 0
        ? copy.aiFallback.askMissingDetails
        : copy.aiFallback.replyWarmLead,
    toneVariants: {
      concise: copy.aiFallback.toneConcise(service, missingText),
      friendly: copy.aiFallback.toneFriendly(service, missingText),
    },
  };
}

function buildInstructions(language: SupportedLanguage): string {
  return `${leadConversionBundleInstructions}
- Write every output field in ${aiLanguageInstruction(language)}.
- Keep the same manual-send guardrails in that language.`.trim();
}

function validateBundle(parsed: unknown): LeadConversionAiBundle | null {
  return isBundle(parsed) ? parsed : null;
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
  aiProvider?: AIProvider | null;
  business: BusinessRecord;
  leadId: string;
}): Promise<LeadConversionAiOutput> {
  if (isWorkspaceLockedForNewCustomerWork(input.business.lifecycle_status)) {
    throw new Error(WORKSPACE_LOCKED_FOR_NEW_WORK_MESSAGE);
  }

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

  const language = readSupportedLanguage(input.business.preferred_language);
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
  const provider =
    input.aiProvider === undefined ? getDefaultAiProvider() : input.aiProvider;
  const cached = await getAiOutputForLeadByHash({
    businessId: input.business.id,
    inputHash,
    leadId: input.leadId,
    supabase,
  });

  if (cached && (cached.provider === "openai" || !provider)) {
    return parseAiOutput(cached)!;
  }

  const model = leadConversionBundlePrompt.approvedModel;
  const inputTokens = estimateTokens(context);

  try {
    if (!provider) {
      throw new Error("AI provider is not configured.");
    }

    const generated = await provider.generateStructuredBundle<LeadConversionAiBundle>({
      inputContext: context,
      instructions: buildInstructions(language),
      model,
      schema: {
        definition: bundleSchema,
        name: leadConversionBundlePrompt.outputSchemaName,
      },
      validate: validateBundle,
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
      model: generated.model,
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
      model: generated.model,
      operationType: "lead_conversion_bundle",
      outputTokens,
      provider: "openai",
      supabase,
    });

    return parseAiOutput(record)!;
  } catch (error) {
    const sanitizedReason = sanitizeAiFailureReason(error);
    const output = fallbackBundle({ language, lead, qualityScore });
    const outputText = JSON.stringify(output);
    const outputTokens = estimateTokens(outputText);
    const record = await insertAiOutput({
      businessId: input.business.id,
      cachedTokens: 0,
      errorMessage: sanitizedReason,
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
      metadata: { reason: sanitizedReason },
      model: "rule-fallback-v1",
      operationType: "lead_conversion_bundle",
      outputTokens,
      provider: "rule_fallback",
      supabase,
    });

    return parseAiOutput(record)!;
  }
}
