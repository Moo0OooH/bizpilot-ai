/**
 * ============================================================
 * File: server/services/lead-conversion.service.ts
 * Project: BizPilot AI
 * Description: Coordinates Phase 5 rule-based Lead Conversion Desk workflows.
 * Role: Calculates lead quality, missing info, SLA state, action items, timeline events, and manual owner updates.
 * Related:
 * - server/repositories/lead-conversion.repository.ts
 * - server/actions/lead-conversion.actions.ts
 * - docs/product/BIZPILOT_SCORING_SPEC_v1.1.md
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-07
 * Change Log:
 * - 2026-05-07: Created Phase 5 rule-first Lead Conversion Desk service.
 * ============================================================
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  completeLeadActionItem,
  dismissOpenActionItemsForLead,
  getLeadById,
  getQualityScoreForLead,
  insertLeadActionItem,
  insertLeadEvent,
  listActionItemsForBusiness,
  listActionItemsForLead,
  listEventsForLead,
  listLeadsForBusiness,
  listOpenActionItemsForBusiness,
  listQualityScoresForLeads,
  listServiceAreasForBusiness,
  listSubmissionValuesForLead,
  updateLeadWorkflow,
  upsertLeadQualityScore,
  type IntakeSubmissionValueRecord,
  type LeadActionItemRecord,
  type LeadActionType,
  type LeadEventRecord,
  type LeadManualOutcome,
  type LeadQualityInput,
  type LeadQualityScoreRecord,
  type LeadRecord,
  type LeadStatus,
} from "@/server/repositories/lead-conversion.repository";
import type { BusinessRecord } from "@/server/repositories/businesses.repository";
import type { Json } from "@/types/database";

export type LeadDeskItem = Readonly<{
  action: LeadActionItemRecord | null;
  primaryIssue: string;
  recommendedAction: string;
  lead: LeadRecord;
  score: LeadQualityScoreRecord;
}>;

export type LeadConversionDesk = Readonly<{
  leads: LeadDeskItem[];
  recoveryProof: RevenueRecoveryProof;
  todaysActions: LeadActionItemRecord[];
}>;

export type LeadDetail = Readonly<{
  actions: LeadActionItemRecord[];
  events: LeadEventRecord[];
  lead: LeadRecord;
  primaryIssue: string;
  recommendedAction: string;
  recoveryProof: RevenueRecoveryProof;
  score: LeadQualityScoreRecord;
  submissionValues: IntakeSubmissionValueRecord[];
}>;

export type RevenueRecoveryProof = Readonly<{
  followUpsCompleted: number;
  followUpsDue: number;
  leadsReviewed: number;
  outcomesMarked: number;
  quoteRequestsCaptured: number;
  strongLeadsActedOn: number;
}>;

type ValueMap = Record<string, Json | undefined>;

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

function toText(value: Json | undefined): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return String(value);
  }

  return "";
}

function hasText(value: Json | undefined): boolean {
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

function intervalSecondsBetween(start: string, end: string): string {
  const seconds = Math.max(
    0,
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000),
  );

  return `${seconds} seconds`;
}

function valueMapFromSubmission(
  lead: LeadRecord,
  values: IntakeSubmissionValueRecord[],
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

function serviceAreaMatches(input: {
  lead: LeadRecord;
  serviceAreas: string[];
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

function isTerminalLead(lead: LeadRecord): boolean {
  return lead.status === "archived" || lead.status === "booked" || lead.status === "lost";
}

function shouldSuppressOpenActions(input: {
  lead: LeadRecord;
  score: LeadQualityScoreRecord;
}): boolean {
  return isTerminalLead(input.lead) || input.score.quality_level === "low_fit";
}

function calculateLeadQuality(input: {
  lead: LeadRecord;
  serviceAreas: string[];
  submissionValues: IntakeSubmissionValueRecord[];
}): LeadQualityInput {
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
  const qualityLevel: LeadQualityInput["qualityLevel"] =
    !areaMatches || !hasText(values.customer_contact)
      ? "low_fit"
      : missingImportant.length > 0
        ? "needs_info"
        : completenessScore >= 90
          ? "strong"
          : "good";
  const completenessLabel: LeadQualityInput["completenessLabel"] =
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

function summarizeLeadDecision(input: {
  lead: LeadRecord;
  score: LeadQualityScoreRecord;
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

function calculateSlaState(
  lead: LeadRecord,
): LeadRecord["response_sla_state"] {
  const now = new Date();
  const createdAt = new Date(lead.created_at);
  const firstViewedAt = lead.first_viewed_at
    ? new Date(lead.first_viewed_at)
    : null;
  const firstReplyCopiedAt = lead.first_reply_copied_at
    ? new Date(lead.first_reply_copied_at)
    : null;

  if (lead.manual_outcome || lead.status === "booked" || lead.status === "lost") {
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

function chooseAction(input: {
  lead: LeadRecord;
  score: LeadQualityScoreRecord;
}): { actionType: LeadActionType; title: string } {
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

async function syncLeadState(input: {
  lead: LeadRecord;
  serviceAreaNames: string[];
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
}): Promise<{
  action: LeadActionItemRecord | null;
  lead: LeadRecord;
  primaryIssue: string;
  recommendedAction: string;
  score: LeadQualityScoreRecord;
  submissionValues: IntakeSubmissionValueRecord[];
}> {
  const submissionValues = await listSubmissionValuesForLead({
    businessId: input.lead.business_id,
    lead: input.lead,
    supabase: input.supabase,
  });
  const scoreInput = calculateLeadQuality({
    lead: input.lead,
    serviceAreas: input.serviceAreaNames,
    submissionValues,
  });
  const previousScore = await getQualityScoreForLead({
    leadId: input.lead.id,
    supabase: input.supabase,
  });
  const score = await upsertLeadQualityScore({
    score: scoreInput,
    supabase: input.supabase,
  });

  if (!previousScore) {
    await insertLeadEvent({
      businessId: input.lead.business_id,
      eventLabel: "Lead quality calculated",
      eventType: "score_calculated",
      leadId: input.lead.id,
      metadata: { qualityLevel: score.quality_level },
      supabase: input.supabase,
    });
  }

  const slaState = calculateSlaState(input.lead);
  const lead =
    slaState !== input.lead.response_sla_state
      ? await updateLeadWorkflow({
          businessId: input.lead.business_id,
          leadId: input.lead.id,
          patch: {
            response_sla_state: slaState,
            response_status: slaState,
          },
          supabase: input.supabase,
        })
      : input.lead;

  if (shouldSuppressOpenActions({ lead, score })) {
    await dismissOpenActionItemsForLead({
      businessId: lead.business_id,
      leadId: lead.id,
      supabase: input.supabase,
    });

    return {
      action: null,
      lead,
      ...summarizeLeadDecision({ lead, score }),
      score,
      submissionValues,
    };
  }

  const actionChoice = chooseAction({ lead, score });
  const actions = await listActionItemsForLead({
    leadId: lead.id,
    supabase: input.supabase,
  });
  const openAction =
    actions.find(
      (action) =>
        action.status === "open" && action.action_type === actionChoice.actionType,
    ) ?? null;
  const action =
    openAction ??
    (await insertLeadActionItem({
      actionType: actionChoice.actionType,
      businessId: lead.business_id,
      leadId: lead.id,
      supabase: input.supabase,
      title: actionChoice.title,
      ...(actionChoice.actionType === "follow_up"
        ? { dueAt: new Date().toISOString() }
        : {}),
    }));

  return {
    action,
    lead,
    ...summarizeLeadDecision({ lead, score }),
    score,
    submissionValues,
  };
}

function calculateRevenueRecoveryProof(input: {
  actions: LeadActionItemRecord[];
  leads: LeadRecord[];
  scores: LeadQualityScoreRecord[];
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

export async function getLeadConversionDesk(input: {
  business: BusinessRecord;
}): Promise<LeadConversionDesk> {
  const supabase = await createSupabaseServerClient();
  const [leads, serviceAreas] = await Promise.all([
    listLeadsForBusiness({
      businessId: input.business.id,
      supabase,
    }),
    listServiceAreasForBusiness({
      businessId: input.business.id,
      supabase,
    }),
  ]);
  const serviceAreaNames = serviceAreas.map((area) => area.name);
  const deskItems: LeadDeskItem[] = [];

  for (const lead of leads) {
    const synced = await syncLeadState({
      lead,
      serviceAreaNames,
      supabase,
    });

    deskItems.push({
      action: synced.action,
      lead: synced.lead,
      primaryIssue: synced.primaryIssue,
      recommendedAction: synced.recommendedAction,
      score: synced.score,
    });
  }

  const [todaysActions, allActions, scores] = await Promise.all([
    listOpenActionItemsForBusiness({
      businessId: input.business.id,
      supabase,
    }),
    listActionItemsForBusiness({
      businessId: input.business.id,
      supabase,
    }),
    listQualityScoresForLeads({
      leadIds: deskItems.map((item) => item.lead.id),
      supabase,
    }),
  ]);

  return {
    leads: deskItems,
    recoveryProof: calculateRevenueRecoveryProof({
      actions: allActions,
      leads: deskItems.map((item) => item.lead),
      scores,
    }),
    todaysActions,
  };
}

export async function getLeadDetail(input: {
  business: BusinessRecord;
  leadId: string;
}): Promise<LeadDetail | null> {
  const supabase = await createSupabaseServerClient();
  const [lead, serviceAreas] = await Promise.all([
    getLeadById({
      businessId: input.business.id,
      leadId: input.leadId,
      supabase,
    }),
    listServiceAreasForBusiness({
      businessId: input.business.id,
      supabase,
    }),
  ]);

  if (!lead) {
    return null;
  }

  const viewedLead = lead.first_viewed_at
    ? lead
    : await updateLeadWorkflow({
        businessId: input.business.id,
        leadId: lead.id,
        patch: {
          first_viewed_at: new Date().toISOString(),
          last_owner_action_at: new Date().toISOString(),
          response_sla_state: "viewed",
          response_status: "viewed",
          status: lead.status === "new" ? "reviewed" : lead.status,
        },
        supabase,
      });

  if (!lead.first_viewed_at) {
    await insertLeadEvent({
      businessId: input.business.id,
      eventLabel: "Lead viewed",
      eventType: "lead_viewed",
      leadId: lead.id,
      supabase,
    });
  }

  const synced = await syncLeadState({
    lead: viewedLead,
    serviceAreaNames: serviceAreas.map((area) => area.name),
    supabase,
  });
  const [actions, events, allLeads, allActions, allScores] = await Promise.all([
    listActionItemsForLead({
      leadId: lead.id,
      supabase,
    }),
    listEventsForLead({
      leadId: lead.id,
      supabase,
    }),
    listLeadsForBusiness({
      businessId: input.business.id,
      supabase,
    }),
    listActionItemsForBusiness({
      businessId: input.business.id,
      supabase,
    }),
    listQualityScoresForLeads({
      leadIds: [lead.id],
      supabase,
    }),
  ]);

  return {
    actions,
    events,
    lead: synced.lead,
    primaryIssue: synced.primaryIssue,
    recommendedAction: synced.recommendedAction,
    recoveryProof: calculateRevenueRecoveryProof({
      actions: allActions,
      leads: allLeads,
      scores: allScores,
    }),
    score: synced.score,
    submissionValues: synced.submissionValues,
  };
}

export async function updateLeadStatus(input: {
  business: BusinessRecord;
  leadId: string;
  status: LeadStatus;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await updateLeadWorkflow({
    businessId: input.business.id,
    leadId: input.leadId,
    patch: {
      last_owner_action_at: new Date().toISOString(),
      status: input.status,
    },
    supabase,
  });
  await insertLeadEvent({
    businessId: input.business.id,
    eventLabel: `Status updated to ${input.status.replaceAll("_", " ")}`,
    eventType: "status_updated",
    leadId: input.leadId,
    metadata: { status: input.status },
    supabase,
  });
}

export async function markReplyCopied(input: {
  business: BusinessRecord;
  leadId: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const lead = await getLeadById({
    businessId: input.business.id,
    leadId: input.leadId,
    supabase,
  });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const now = new Date().toISOString();
  await updateLeadWorkflow({
    businessId: input.business.id,
    leadId: input.leadId,
    patch: {
      first_reply_copied_at: lead.first_reply_copied_at ?? now,
      first_response_latency:
        lead.first_response_latency ??
        intervalSecondsBetween(lead.created_at, now),
      last_owner_action_at: now,
      response_sla_state: "reply_copied",
      response_status: "reply_copied",
      status: "replied",
    },
    supabase,
  });
  await insertLeadEvent({
    businessId: input.business.id,
    eventLabel: "Reply copied",
    eventType: "reply_copied",
    leadId: input.leadId,
    supabase,
  });
}

export async function markLeadOutcome(input: {
  business: BusinessRecord;
  leadId: string;
  manualOutcome: LeadManualOutcome;
}): Promise<void> {
  const statusByOutcome: Partial<Record<LeadManualOutcome, LeadStatus>> = {
    booked: "booked",
    lost: "lost",
    not_a_fit: "lost",
  };
  const supabase = await createSupabaseServerClient();
  await updateLeadWorkflow({
    businessId: input.business.id,
    leadId: input.leadId,
    patch: {
      last_owner_action_at: new Date().toISOString(),
      manual_outcome: input.manualOutcome,
      status: statusByOutcome[input.manualOutcome] ?? "follow_up_needed",
    },
    supabase,
  });
  await insertLeadEvent({
    businessId: input.business.id,
    eventLabel: `Outcome marked as ${input.manualOutcome.replaceAll("_", " ")}`,
    eventType: "outcome_marked",
    leadId: input.leadId,
    metadata: { manualOutcome: input.manualOutcome },
    supabase,
  });
}

export async function completeActionItem(input: {
  actionItemId: string;
  business: BusinessRecord;
  leadId: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await completeLeadActionItem({
    actionItemId: input.actionItemId,
    businessId: input.business.id,
    supabase,
  });
  await updateLeadWorkflow({
    businessId: input.business.id,
    leadId: input.leadId,
    patch: {
      last_owner_action_at: new Date().toISOString(),
    },
    supabase,
  });
  await insertLeadEvent({
    businessId: input.business.id,
    eventLabel: "Action completed",
    eventType: "action_completed",
    leadId: input.leadId,
    metadata: { actionItemId: input.actionItemId },
    supabase,
  });
}
