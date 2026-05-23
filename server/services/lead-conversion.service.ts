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
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-07: Created Phase 5 rule-first Lead Conversion Desk service.
 * ============================================================
 */

import "server-only";

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
  type LeadEventRecord,
  type LeadManualOutcome,
  type LeadQualityScoreRecord,
  type LeadRecord,
  type LeadStatus,
} from "@/server/repositories/lead-conversion.repository";
import type { BusinessRecord } from "@/server/repositories/businesses.repository";
import { readSupportedLanguage } from "@/lib/i18n/language";
import {
  calculateLeadQuality,
  calculateRevenueRecoveryProof,
  calculateSlaState,
  chooseAction,
  shouldSuppressOpenActions,
  summarizeLeadDecision,
  type RevenueRecoveryProof,
} from "@/server/services/lead-conversion-rules.service";

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

function intervalSecondsBetween(start: string, end: string): string {
  const seconds = Math.max(
    0,
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000),
  );

  return `${seconds} seconds`;
}

async function syncLeadState(input: {
  actorUserId?: string | null | undefined;
  language: BusinessRecord["preferred_language"];
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
    language: input.language,
    lead: input.lead,
    serviceAreas: input.serviceAreaNames,
    submissionValues,
  });
  const previousScore = await getQualityScoreForLead({
    businessId: input.lead.business_id,
    leadId: input.lead.id,
    supabase: input.supabase,
  });
  const existingEvents = await listEventsForLead({
    businessId: input.lead.business_id,
    leadId: input.lead.id,
    supabase: input.supabase,
  });

  if (!existingEvents.some((event) => event.event_type === "lead_created")) {
    await insertLeadEvent({
      actorUserId: input.actorUserId,
      businessId: input.lead.business_id,
      eventLabel: "Lead created",
      eventType: "lead_created",
      leadId: input.lead.id,
      metadata: { sourceChannel: input.lead.source_channel },
      supabase: input.supabase,
    });
  }

  const score = await upsertLeadQualityScore({
    score: scoreInput,
    supabase: input.supabase,
  });

  if (!previousScore) {
    await insertLeadEvent({
      actorUserId: input.actorUserId,
      businessId: input.lead.business_id,
      eventLabel: "Lead quality calculated",
      eventType: "score_calculated",
      leadId: input.lead.id,
      metadata: { qualityLevel: score.quality_level },
      supabase: input.supabase,
    });
  }

  const slaState = calculateSlaState({ lead: input.lead });
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
      ...summarizeLeadDecision({ language: input.language, lead, score }),
      score,
      submissionValues,
    };
  }

  const actionChoice = chooseAction({ language: input.language, lead, score });
  const actions = await listActionItemsForLead({
    businessId: lead.business_id,
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
    ...summarizeLeadDecision({ language: input.language, lead, score }),
    score,
    submissionValues,
  };
}

export async function getLeadConversionDesk(input: {
  actorUserId?: string | null | undefined;
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
  const language = readSupportedLanguage(input.business.preferred_language);
  const deskItems: LeadDeskItem[] = [];

  for (const lead of leads) {
    const synced = await syncLeadState({
      actorUserId: input.actorUserId,
      language,
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
  actorUserId?: string | null | undefined;
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
      actorUserId: input.actorUserId,
      businessId: input.business.id,
      eventLabel: "Lead viewed",
      eventType: "lead_viewed",
      leadId: lead.id,
      supabase,
    });
  }

  const synced = await syncLeadState({
    actorUserId: input.actorUserId,
    language: readSupportedLanguage(input.business.preferred_language),
    lead: viewedLead,
    serviceAreaNames: serviceAreas.map((area) => area.name),
    supabase,
  });
  const [actions, events, allLeads, allActions, allScores] = await Promise.all([
    listActionItemsForLead({
      businessId: input.business.id,
      leadId: lead.id,
      supabase,
    }),
    listEventsForLead({
      businessId: input.business.id,
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
  actorUserId?: string | null | undefined;
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
    actorUserId: input.actorUserId,
    businessId: input.business.id,
    eventLabel: `Status updated to ${input.status.replaceAll("_", " ")}`,
    eventType: "status_changed",
    leadId: input.leadId,
    metadata: { status: input.status },
    supabase,
  });
}

export async function markReplyCopied(input: {
  actorUserId?: string | null | undefined;
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
    actorUserId: input.actorUserId,
    businessId: input.business.id,
    eventLabel: "Reply copied",
    eventType: "reply_copied",
    leadId: input.leadId,
    supabase,
  });
}

export async function markLeadOutcome(input: {
  actorUserId?: string | null | undefined;
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
    actorUserId: input.actorUserId,
    businessId: input.business.id,
    eventLabel: `Outcome marked as ${input.manualOutcome.replaceAll("_", " ")}`,
    eventType: "outcome_marked",
    leadId: input.leadId,
    metadata: { manualOutcome: input.manualOutcome },
    supabase,
  });
}

export async function completeActionItem(input: {
  actorUserId?: string | null | undefined;
  actionItemId: string;
  business: BusinessRecord;
  leadId: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const actionItem = await completeLeadActionItem({
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
    actorUserId: input.actorUserId,
    businessId: input.business.id,
    eventLabel:
      actionItem.action_type === "follow_up"
        ? "Follow-up marked complete"
        : "Action completed",
    eventType:
      actionItem.action_type === "follow_up"
        ? "follow_up_marked"
        : "action_completed",
    leadId: input.leadId,
    metadata: { actionItemId: input.actionItemId },
    supabase,
  });
}
