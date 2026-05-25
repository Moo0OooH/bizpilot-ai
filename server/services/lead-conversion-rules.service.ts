/**
 * ============================================================
 * File: server/services/lead-conversion-rules.service.ts
 * Project: BizPilot AI
 * Description: Defines pure Phase 5 Lead Conversion Desk rule logic.
 * Role: Calculates quality, missing info, service-area fit, SLA state, recommended actions, and proof metrics.
 * Related:
 * - server/services/lead-conversion.service.ts
 * - docs/product/BIZPILOT_SCORING_SPEC_v1.1.md
 * - tests/unit/lead-conversion-rules.test.ts
 * Author: MoOoH
 * Created: 2026-05-09
 * Last Updated: 2026-05-09
 * Change Log:
 * - 2026-05-09: Extracted pure Phase 5 lead conversion rules for focused unit testing.
 * ============================================================
 */

import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";
import {
  readSupportedLanguage,
  type SupportedLanguage,
} from "../../lib/i18n/language.ts";

export type RuleJson =
  | boolean
  | null
  | number
  | string
  | RuleJson[]
  | { [key: string]: RuleJson | undefined };

export type RuleLead = Readonly<{
  business_id: string;
  city_or_service_area: string | null;
  created_at: string;
  customer_contact: string | null;
  first_reply_copied_at: string | null;
  first_viewed_at: string | null;
  id: string;
  manual_outcome: "asked_info" | "booked" | "lost" | "no_response" | "not_a_fit" | null;
  response_sla_state:
    | "follow_up_due"
    | "new"
    | "overdue"
    | "reply_copied"
    | "viewed";
  service_type: string | null;
  status:
    | "archived"
    | "booked"
    | "follow_up_needed"
    | "lost"
    | "new"
    | "replied"
    | "reviewed";
}>;

export type RuleSubmissionValue = Readonly<{
  field_key: string;
  field_value: RuleJson;
}>;

export type RuleQualityScore = Readonly<{
  businessId: string;
  completenessLabel: "complete" | "mostly_complete" | "needs_info" | "poor";
  completenessScore: number;
  explanation: string;
  leadId: string;
  missingInfoKeys: string[];
  qualityLevel: "good" | "low_fit" | "needs_info" | "strong";
}>;

export type RulePersistedQualityScore = Readonly<{
  completeness_score: number;
  explanation: string;
  lead_id: string;
  missing_info_keys: string[];
  quality_level: "good" | "low_fit" | "needs_info" | "strong";
}>;

export type RuleActionItem = Readonly<{
  action_type: "ask_info" | "follow_up" | "reply";
  status: "completed" | "dismissed" | "open";
}>;

export type RevenueRecoveryProof = Readonly<{
  followUpsCompleted: number;
  followUpsDue: number;
  leadsReviewed: number;
  outcomesMarked: number;
  quoteRequestsCaptured: number;
  strongLeadsActedOn: number;
}>;

export type SmartRoutingPriority = "high" | "review" | "standard";

export type SmartRoutingQueue =
  | "commercial_cleaning"
  | "intake_review"
  | "move_out_cleaning"
  | "owner_review"
  | "recurring_opportunity";

export type SmartRoutingReviewer = "owner";

export type SmartRoutingReason =
  | "commercial_request"
  | "follow_up_due"
  | "missing_required_info"
  | "move_out_request"
  | "outside_service_area"
  | "preferred_date_soon"
  | "ready_for_owner_reply"
  | "recurring_request"
  | "response_overdue";

export type SmartRoutingNextAction =
  | "ask_missing_info"
  | "follow_up"
  | "owner_review"
  | "reply_fast"
  | "review_service_area";

export type SmartIntakeRoutingSuggestion = Readonly<{
  missingInfoKeys: string[];
  nextAction: SmartRoutingNextAction;
  priority: SmartRoutingPriority;
  reasonCodes: SmartRoutingReason[];
  suggestedQueue: SmartRoutingQueue;
  suggestedReviewer: SmartRoutingReviewer;
}>;

type ValueMap = Record<string, RuleJson | undefined>;

function toText(value: RuleJson | undefined): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return String(value);
  }

  return "";
}

function hasText(value: RuleJson | undefined): boolean {
  return toText(value).length > 0;
}

function normalizeComparableText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function valueMapFromSubmission(
  lead: RuleLead,
  values: readonly RuleSubmissionValue[],
): ValueMap {
  const valueMap: ValueMap = Object.fromEntries(
    values.map((value) => [value.field_key, value.field_value]),
  );

  return {
    ...valueMap,
    city_or_service_area:
      valueMap.city_or_service_area ?? lead.city_or_service_area,
    cleaning_type: valueMap.cleaning_type ?? lead.service_type,
    customer_contact: valueMap.customer_contact ?? lead.customer_contact,
  };
}

function normalizedValueFromKeys(values: ValueMap, keys: readonly string[]): string {
  return keys
    .map((key) => normalizeComparableText(toText(values[key])))
    .filter(Boolean)
    .join(" ");
}

function hasAnySignal(input: string, signals: readonly string[]): boolean {
  return signals.some((signal) => input.includes(signal));
}

function addReason(
  reasons: SmartRoutingReason[],
  reason: SmartRoutingReason,
): void {
  if (!reasons.includes(reason)) {
    reasons.push(reason);
  }
}

function preferredDateIsSoon(
  value: RuleJson | undefined,
  now: Date,
): boolean {
  const text = toText(value);

  if (!text) {
    return false;
  }

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);

  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const targetDate = Date.UTC(Number(year), Number(month) - 1, Number(day));
    const today = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    const daysUntil = Math.round((targetDate - today) / 86_400_000);

    return daysUntil >= 0 && daysUntil <= 2;
  }

  const parsedDate = new Date(text);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const millisecondsUntil = parsedDate.getTime() - now.getTime();

  return millisecondsUntil >= 0 && millisecondsUntil <= 48 * 60 * 60 * 1000;
}

export function serviceAreaMatches(input: {
  lead: RuleLead;
  serviceAreas: readonly string[];
  values: ValueMap;
}): boolean {
  if (input.serviceAreas.length === 0) {
    return true;
  }

  const area = normalizeComparableText(
    toText(input.values.city_or_service_area) ||
      input.lead.city_or_service_area ||
      "",
  );

  return input.serviceAreas.some((serviceArea) => {
    const normalizedServiceArea = normalizeComparableText(serviceArea);

    return (
      normalizedServiceArea.length > 0 &&
      (area.includes(normalizedServiceArea) ||
        normalizedServiceArea.includes(area))
    );
  });
}

export function isTerminalLead(lead: RuleLead): boolean {
  return (
    lead.status === "archived" ||
    lead.status === "booked" ||
    lead.status === "lost"
  );
}

export function shouldSuppressOpenActions(input: {
  lead: RuleLead;
  score: RulePersistedQualityScore;
}): boolean {
  return isTerminalLead(input.lead) || input.score.quality_level === "low_fit";
}

export function calculateLeadQuality(input: {
  language?: SupportedLanguage;
  lead: RuleLead;
  serviceAreas: readonly string[];
  submissionValues: readonly RuleSubmissionValue[];
}): RuleQualityScore {
  const language = readSupportedLanguage(input.language);
  const copy = getBizPilotCopy(language);
  const values = valueMapFromSubmission(input.lead, input.submissionValues);
  const missingInfoKeys = [
    "customer_contact",
    "cleaning_type",
    "property_type",
    "bedrooms",
    "bathrooms",
    "preferred_date",
    "preferred_time_window",
    "city_or_service_area",
  ].filter((key) => !hasText(values[key]));
  const areaMatches = serviceAreaMatches({
    lead: input.lead,
    serviceAreas: input.serviceAreas,
    values,
  });
  const requiredCompleted = [
    "customer_contact",
    "cleaning_type",
    "city_or_service_area",
  ].filter((key) => hasText(values[key])).length;
  const optionalCompleted = [
    "property_type",
    "bedrooms",
    "bathrooms",
    "preferred_date",
    "preferred_time_window",
  ].filter((key) => hasText(values[key])).length;
  const contactQuality = hasText(values.customer_contact) ? 10 : 0;
  const areaScore = areaMatches && hasText(values.city_or_service_area) ? 10 : 0;
  const completenessScore = Math.min(
    100,
    Math.round(
      (requiredCompleted / 3) * 60 +
        (optionalCompleted / 5) * 20 +
        contactQuality +
        areaScore,
    ),
  );
  const missingImportant = missingInfoKeys.filter(
    (key) => key !== "preferred_time_window",
  );
  const qualityLevel: RuleQualityScore["qualityLevel"] =
    !areaMatches || !hasText(values.customer_contact)
      ? "low_fit"
      : missingImportant.length > 0
        ? "needs_info"
        : completenessScore >= 90
          ? "strong"
          : "good";
  const completenessLabel: RuleQualityScore["completenessLabel"] =
    completenessScore >= 90
      ? "complete"
      : completenessScore >= 70
        ? "mostly_complete"
        : completenessScore >= 40
          ? "needs_info"
          : "poor";
  const missingLabels = missingInfoKeys.map(
    (key) => copy.missingInfoLabels[key] ?? key.replaceAll("_", " "),
  );
  const explanation = !areaMatches
    ? copy.leadRules.lowFitExplanation
    : missingLabels.length > 0
      ? copy.leadRules.missingExplanation(missingLabels)
      : copy.leadRules.completeExplanation;

  return {
    businessId: input.lead.business_id,
    completenessLabel,
    completenessScore,
    explanation,
    leadId: input.lead.id,
    missingInfoKeys,
    qualityLevel,
  };
}

export function calculateSlaState(input: {
  lead: RuleLead;
  now?: Date;
}): RuleLead["response_sla_state"] {
  const now = input.now ?? new Date();
  const createdAt = new Date(input.lead.created_at);
  const firstViewedAt = input.lead.first_viewed_at
    ? new Date(input.lead.first_viewed_at)
    : null;
  const firstReplyCopiedAt = input.lead.first_reply_copied_at
    ? new Date(input.lead.first_reply_copied_at)
    : null;

  if (
    input.lead.manual_outcome ||
    input.lead.status === "booked" ||
    input.lead.status === "lost"
  ) {
    return firstReplyCopiedAt ? "reply_copied" : "viewed";
  }

  if (firstReplyCopiedAt) {
    return now >= addHours(firstReplyCopiedAt, 48)
      ? "follow_up_due"
      : "reply_copied";
  }

  if (firstViewedAt) {
    return now >= addHours(firstViewedAt, 24) ? "overdue" : "viewed";
  }

  return now >= addHours(createdAt, 24) ? "overdue" : "new";
}

export function chooseAction(input: {
  language?: SupportedLanguage;
  lead: RuleLead;
  score: RulePersistedQualityScore;
}): { actionType: RuleActionItem["action_type"]; title: string } {
  const copy = getBizPilotCopy(input.language);

  if (
    input.lead.response_sla_state === "follow_up_due" ||
    input.lead.status === "replied" ||
    Boolean(input.lead.first_reply_copied_at)
  ) {
    return {
      actionType: "follow_up",
      title: copy.leadRules.actionFollowUp,
    };
  }

  if (input.score.missing_info_keys.length > 0) {
    return {
      actionType: "ask_info",
      title: copy.leadRules.actionAskInfo,
    };
  }

  return {
    actionType: "reply",
    title:
      input.lead.response_sla_state === "overdue"
        ? copy.leadRules.actionReplyOverdue
        : copy.leadRules.actionReply,
  };
}

export function summarizeLeadDecision(input: {
  language?: SupportedLanguage;
  lead: RuleLead;
  score: RulePersistedQualityScore;
}): { primaryIssue: string; recommendedAction: string } {
  const copy = getBizPilotCopy(input.language);

  if (input.lead.status === "booked") {
    return {
      primaryIssue: copy.leadRules.outcomeBooked,
      recommendedAction: copy.leadRules.noOpenAction,
    };
  }

  if (input.lead.status === "lost" || input.lead.manual_outcome === "not_a_fit") {
    return {
      primaryIssue:
        input.lead.manual_outcome === "not_a_fit"
          ? copy.leadRules.manuallyMarkedNotFit
          : copy.leadRules.outcomeLost,
      recommendedAction: copy.leadRules.noOpenAction,
    };
  }

  if (input.score.quality_level === "low_fit") {
    return {
      primaryIssue: input.score.explanation,
      recommendedAction: copy.leadRules.archiveOrReviewArea,
    };
  }

  if (input.score.missing_info_keys.length > 0) {
    return {
      primaryIssue: input.score.explanation,
      recommendedAction: copy.leadRules.recommendedAskInfo,
    };
  }

  if (
    input.lead.response_sla_state === "overdue" ||
    input.lead.response_sla_state === "follow_up_due"
  ) {
    return {
      primaryIssue: copy.leadRules.responseState(
        input.lead.response_sla_state.replaceAll("_", " "),
      ),
      recommendedAction: copy.leadRules.followUpToday,
    };
  }

  if (input.lead.first_reply_copied_at) {
    return {
      primaryIssue: copy.leadRules.replyCopiedWaiting,
      recommendedAction: copy.leadRules.markBookedLost,
    };
  }

  return {
    primaryIssue: copy.leadRules.readyForReply,
    recommendedAction: copy.aiFallback.replyWarmLead,
  };
}

export function calculateSmartIntakeRouting(input: {
  lead: RuleLead;
  now?: Date;
  score: RulePersistedQualityScore;
  serviceAreas: readonly string[];
  submissionValues: readonly RuleSubmissionValue[];
}): SmartIntakeRoutingSuggestion {
  const now = input.now ?? new Date();
  const values = valueMapFromSubmission(input.lead, input.submissionValues);
  const reasons: SmartRoutingReason[] = [];
  const areaMatches = serviceAreaMatches({
    lead: input.lead,
    serviceAreas: input.serviceAreas,
    values,
  });
  const cleaningSignal = normalizedValueFromKeys(values, [
    "cleaning_type",
    "service_type",
    "notes",
  ]);
  const propertySignal = normalizedValueFromKeys(values, [
    "property_type",
    "business_type",
    "notes",
  ]);
  const frequencySignal = normalizedValueFromKeys(values, [
    "frequency",
    "cleaning_frequency",
    "recurring",
    "notes",
  ]);
  const isMoveOut = hasAnySignal(cleaningSignal, [
    "move out",
    "move in move out",
    "moveout",
  ]);
  const isCommercial = hasAnySignal(`${cleaningSignal} ${propertySignal}`, [
    "commercial",
    "office",
    "retail",
    "business",
  ]);
  const isRecurring = hasAnySignal(frequencySignal, [
    "biweekly",
    "monthly",
    "recurring",
    "regular",
    "weekly",
    "yes",
  ]);
  const dateSoon = preferredDateIsSoon(values.preferred_date, now);
  const hasMissingInfo = input.score.missing_info_keys.length > 0;

  if (input.lead.response_sla_state === "overdue") {
    addReason(reasons, "response_overdue");
  }

  if (input.lead.response_sla_state === "follow_up_due") {
    addReason(reasons, "follow_up_due");
  }

  if (!areaMatches) {
    addReason(reasons, "outside_service_area");
  }

  if (hasMissingInfo) {
    addReason(reasons, "missing_required_info");
  }

  if (isMoveOut) {
    addReason(reasons, "move_out_request");
  }

  if (dateSoon) {
    addReason(reasons, "preferred_date_soon");
  }

  if (isCommercial) {
    addReason(reasons, "commercial_request");
  }

  if (isRecurring) {
    addReason(reasons, "recurring_request");
  }

  if (reasons.length === 0) {
    addReason(reasons, "ready_for_owner_reply");
  }

  const priority: SmartRoutingPriority =
    input.lead.response_sla_state === "overdue" ||
    input.lead.response_sla_state === "follow_up_due" ||
    isMoveOut ||
    dateSoon
      ? "high"
      : !areaMatches || hasMissingInfo
        ? "review"
        : "standard";

  const suggestedQueue: SmartRoutingQueue = !areaMatches
    ? "owner_review"
    : hasMissingInfo
      ? "intake_review"
      : isCommercial
        ? "commercial_cleaning"
        : isMoveOut
          ? "move_out_cleaning"
          : isRecurring
            ? "recurring_opportunity"
            : "owner_review";

  const nextAction: SmartRoutingNextAction =
    input.lead.response_sla_state === "follow_up_due"
      ? "follow_up"
      : !areaMatches
        ? "review_service_area"
        : hasMissingInfo
          ? "ask_missing_info"
          : priority === "high"
            ? "reply_fast"
            : "owner_review";

  return {
    missingInfoKeys: input.score.missing_info_keys,
    nextAction,
    priority,
    reasonCodes: reasons,
    suggestedQueue,
    suggestedReviewer: "owner",
  };
}

export function calculateRevenueRecoveryProof(input: {
  actions: readonly RuleActionItem[];
  leads: readonly RuleLead[];
  scores: readonly RulePersistedQualityScore[];
}): RevenueRecoveryProof {
  const strongLeadIds = new Set(
    input.scores
      .filter((score) => score.quality_level === "strong")
      .map((score) => score.lead_id),
  );

  return {
    followUpsCompleted: input.actions.filter(
      (action) =>
        action.action_type === "follow_up" && action.status === "completed",
    ).length,
    followUpsDue: input.actions.filter(
      (action) => action.action_type === "follow_up" && action.status === "open",
    ).length,
    leadsReviewed: input.leads.filter((lead) => lead.first_viewed_at).length,
    outcomesMarked: input.leads.filter((lead) => lead.manual_outcome).length,
    quoteRequestsCaptured: input.leads.length,
    strongLeadsActedOn: input.leads.filter(
      (lead) =>
        strongLeadIds.has(lead.id) &&
        (lead.first_viewed_at || lead.first_reply_copied_at),
    ).length,
  };
}
