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

type ValueMap = Record<string, RuleJson | undefined>;

const missingInfoLabels: Record<string, string> = {
  bathrooms: "bathrooms",
  bedrooms: "bedrooms",
  city_or_service_area: "service area",
  cleaning_type: "cleaning type",
  customer_contact: "contact details",
  preferred_date: "preferred date",
  preferred_time_window: "preferred time window",
  property_type: "property type",
};

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
  lead: RuleLead;
  serviceAreas: readonly string[];
  submissionValues: readonly RuleSubmissionValue[];
}): RuleQualityScore {
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
    (key) => missingInfoLabels[key] ?? key.replaceAll("_", " "),
  );
  const explanation = !areaMatches
    ? "Outside configured service area. Details can be complete while fit remains low."
    : missingLabels.length > 0
      ? `Missing ${missingLabels.join(", ")}.`
      : "Contact, service, area, timing, and quote details are present.";

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
  lead: RuleLead;
  score: RulePersistedQualityScore;
}): { actionType: RuleActionItem["action_type"]; title: string } {
  if (
    input.lead.response_sla_state === "follow_up_due" ||
    input.lead.response_sla_state === "overdue"
  ) {
    return {
      actionType: "follow_up",
      title: "Follow up with this lead",
    };
  }

  if (input.score.missing_info_keys.length > 0) {
    return {
      actionType: "ask_info",
      title: "Ask for missing quote details",
    };
  }

  return {
    actionType: "reply",
    title: "Reply to this lead",
  };
}

export function summarizeLeadDecision(input: {
  lead: RuleLead;
  score: RulePersistedQualityScore;
}): { primaryIssue: string; recommendedAction: string } {
  if (input.lead.status === "booked") {
    return {
      primaryIssue: "Outcome booked",
      recommendedAction: "No open action",
    };
  }

  if (input.lead.status === "lost" || input.lead.manual_outcome === "not_a_fit") {
    return {
      primaryIssue:
        input.lead.manual_outcome === "not_a_fit"
          ? "Manually marked not a fit"
          : "Outcome lost",
      recommendedAction: "No open action",
    };
  }

  if (input.score.quality_level === "low_fit") {
    return {
      primaryIssue: input.score.explanation,
      recommendedAction: "Archive or review service area",
    };
  }

  if (input.score.missing_info_keys.length > 0) {
    return {
      primaryIssue: input.score.explanation,
      recommendedAction: "Ask for missing info",
    };
  }

  if (
    input.lead.response_sla_state === "overdue" ||
    input.lead.response_sla_state === "follow_up_due"
  ) {
    return {
      primaryIssue: `Response state is ${input.lead.response_sla_state.replaceAll("_", " ")}.`,
      recommendedAction: "Follow up today",
    };
  }

  if (input.lead.first_reply_copied_at) {
    return {
      primaryIssue: "Reply copied, waiting for outcome.",
      recommendedAction: "Mark booked/lost when known",
    };
  }

  return {
    primaryIssue: "Ready for owner reply.",
    recommendedAction: "Reply now",
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
