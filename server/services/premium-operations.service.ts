/**
 * ============================================================
 * File: server/services/premium-operations.service.ts
 * Project: BizPilot AI
 * Description: Coordinates paid, owner-controlled priority, batch-draft, and internal availability workflows.
 * Role: Enforces server-side add-on access, lifecycle safety, tenant ownership, and manual-review-only product boundaries.
 * Related:
 * - server/repositories/premium-operations.repository.ts
 * - server/services/premium-operations-rules.service.ts
 * - server/actions/premium-operations.actions.ts
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-21: Created Premium Lead Operations orchestration and entitlement enforcement.
 * - 2026-07-21: Batched availability reads and enforced review before manual-copy logging.
 * - 2026-07-22: Replaced whole-desk synchronization with complete read-only Operations enrichment.
 * - 2026-07-22: Restricted exact-time handling to canonical template-linked form fields.
 * - 2026-07-22: Unified availability on one operating timezone and added fail-closed draft provenance checks.
 * - 2026-07-22: Rejected partially elapsed exact-time requests at every availability read and mutation boundary.
 * - 2026-07-22: Bounded active Operations reads and revalidated ordinary draft recipients before review or copy.
 * ============================================================
 */

import "server-only";

import { isWorkspaceLockedForNewCustomerWork } from "@/lib/business-lifecycle/lock";
import { readSupportedLanguage } from "@/lib/i18n/language";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BUSINESS_OPERATING_TIME_ZONE } from "@/lib/time/business-operating-time-zone";
import type { Json } from "@/types/database";
import {
  listCanonicalExactTimeSubmissionIds,
  getLeadById,
  listActionableOperationsLeads,
  listLeadsByIds,
  listServiceAreasForBusiness,
  listSubmissionValuesForSubmissions,
  type IntakeSubmissionValueRecord,
  type LeadRecord,
} from "@/server/repositories/lead-conversion.repository";
import type { BusinessRecord } from "@/server/repositories/businesses.repository";
import {
  createAvailabilityReviewDraftAtomic,
  createPremiumReplyDraftAtomic,
  createPriorityRule,
  createServiceTimeBlock,
  cancelServiceTimeBlock,
  deletePriorityRule,
  findAvailabilityReviewDraftForLead,
  getBulkReplyDraftById,
  getBulkReplyDraftRecipientById,
  listAddonEntitlements,
  listBulkReplyDraftRecipients,
  listBulkReplyDrafts,
  listPriorityRules,
  listServiceTimeBlocks,
  markBulkReplyDraftReviewed,
  markBulkReplyRecipientCopied,
  type AddonEntitlementRecord,
  type BulkReplyDraftRecipientRecord,
  type BulkReplyDraftRecord,
  type LeadPriorityRuleRecord,
  type ServiceTimeBlockRecord,
} from "@/server/repositories/premium-operations.repository";
import {
  calculateLeadQuality,
  calculateSlaState,
} from "./lead-conversion-rules.service";
import {
  findConflictingTimeBlocks,
  findFirstInternalOpening,
  formatRequestedTimeWindowLabel,
  isExactRequestedTimeWindow,
  isTerminalLeadStatus,
  parseRequestedTimeWindow,
  parseZonedLocalDateTime,
  rankLeadsByPriority,
  renderAvailabilityReviewDraft,
  renderBulkDraft,
  type PremiumAddonKey,
  type PriorityMatch,
} from "./premium-operations-rules.service";

const MAX_PRIORITY_RULES = 20;
const MAX_BATCH_RECIPIENTS = 50;
const SUBMISSION_VALUE_READ_BATCH_SIZE = 250;
const DEFAULT_AVAILABILITY_DAY_START = "08:00";
const DEFAULT_AVAILABILITY_DAY_END = "18:00";

type PremiumOperationsLeadProjection = Readonly<{
  lead: LeadRecord;
  qualityLevel: PremiumLeadItem["qualityLevel"];
}>;

type AvailabilityLeadProjection = Readonly<{
  lead: LeadRecord;
}>;

type PremiumSupabaseClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

type AvailabilityDraftSnapshot = Readonly<{
  conflictBlockIds: readonly string[];
  leadId: string;
  requestedEndsAt: string;
  requestedStartsAt: string;
  submissionId: string;
  suggestedEndsAt: string | null;
  suggestedStartsAt: string | null;
  timeZone: string;
}>;

export type PremiumEntitlements = Readonly<Record<PremiumAddonKey, boolean>>;

export type PremiumLeadItem = Readonly<{
  area: string | null;
  createdAt: string;
  customerName: string | null;
  id: string;
  priority: PriorityMatch;
  qualityLevel: string;
  requestedDate: string | null;
  requestedTimeWindow: string | null;
  service: string | null;
  slaState: string;
  status: string;
}>;

export type AvailabilityAlert = Readonly<{
  conflictBlockIds: readonly string[];
  draft: string;
  leadId: string;
  requestedEndsAt: string;
  requestedStartsAt: string;
  suggestedEndsAt: string | null;
  suggestedStartsAt: string | null;
}>;

export type PremiumOperationsWorkspace = Readonly<{
  availabilityAlerts: readonly AvailabilityAlert[];
  batches: readonly BulkReplyDraftRecord[];
  entitlements: PremiumEntitlements;
  leadLimitReached: boolean;
  leads: readonly PremiumLeadItem[];
  priorityRules: readonly LeadPriorityRuleRecord[];
  recipients: readonly BulkReplyDraftRecipientRecord[];
  timeBlocks: readonly ServiceTimeBlockRecord[];
}>;

function entitlementIsActive(
  entitlement: AddonEntitlementRecord | undefined,
  now = new Date(),
): boolean {
  if (!entitlement || (entitlement.status !== "enabled" && entitlement.status !== "trial")) {
    return false;
  }
  return !entitlement.expires_at || new Date(entitlement.expires_at).getTime() > now.getTime();
}

function resolveEntitlements(rows: AddonEntitlementRecord[]): PremiumEntitlements {
  const byKey = new Map(rows.map((row) => [row.addon_key, row]));
  return {
    availability_coordination: entitlementIsActive(
      byKey.get("availability_coordination"),
    ),
    bulk_reply_review: entitlementIsActive(byKey.get("bulk_reply_review")),
    priority_workbench: entitlementIsActive(byKey.get("priority_workbench")),
  };
}

function assertWorkspaceWritable(business: BusinessRecord): void {
  if (business.status !== "active" && business.status !== "onboarding") {
    throw new Error("This workspace is not active.");
  }
  if (isWorkspaceLockedForNewCustomerWork(business.lifecycle_status)) {
    throw new Error("This workspace is locked for new work.");
  }
}

async function assertPremiumEntitled(input: {
  addon: PremiumAddonKey;
  business: BusinessRecord;
}): Promise<void> {
  assertWorkspaceWritable(input.business);
  const supabase = await createSupabaseServerClient();
  const entitlements = resolveEntitlements(
    await listAddonEntitlements({ businessId: input.business.id, supabase }),
  );
  if (!entitlements[input.addon]) {
    throw new Error("This Premium add-on is not active for this workspace.");
  }
}

async function assertAnyDraftEntitled(business: BusinessRecord): Promise<void> {
  assertWorkspaceWritable(business);
  const supabase = await createSupabaseServerClient();
  const entitlements = resolveEntitlements(
    await listAddonEntitlements({ businessId: business.id, supabase }),
  );
  if (!entitlements.bulk_reply_review && !entitlements.availability_coordination) {
    throw new Error("This Premium add-on is not active for this workspace.");
  }
}

function cleanText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanTerms(value: readonly string[]): string[] {
  return [...new Set(value.map((term) => cleanText(term, 80)).filter(Boolean))].slice(
    0,
    20,
  );
}

function readSubmissionText(
  values: readonly IntakeSubmissionValueRecord[],
  fieldKey: string,
): string | null {
  const value = values.find((item) => item.field_key === fieldKey)?.field_value;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return null;
}

function readRequestedTimeWindow(
  values: readonly IntakeSubmissionValueRecord[],
  hasCanonicalExactTime: boolean,
): string | null {
  return (
    (hasCanonicalExactTime
      ? readSubmissionText(values, "preferred_time")
      : null) || readSubmissionText(values, "preferred_time_window")
  );
}

async function listSubmissionValuesForLeadSet(input: {
  businessId: string;
  leads: readonly LeadRecord[];
  supabase: PremiumSupabaseClient;
}): Promise<IntakeSubmissionValueRecord[]> {
  const submissionIds = [
    ...new Set(input.leads.map((lead) => lead.intake_submission_id).filter(Boolean)),
  ];
  const rows: IntakeSubmissionValueRecord[] = [];
  for (
    let start = 0;
    start < submissionIds.length;
    start += SUBMISSION_VALUE_READ_BATCH_SIZE
  ) {
    rows.push(
      ...(await listSubmissionValuesForSubmissions({
        businessId: input.businessId,
        submissionIds: submissionIds.slice(
          start,
          start + SUBMISSION_VALUE_READ_BATCH_SIZE,
        ),
        supabase: input.supabase,
      })),
    );
  }
  return rows;
}

function operatingDateForInstant(value: string): string | null {
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) return null;
  const parts = new Map(
    new Intl.DateTimeFormat("en-CA", {
      calendar: "gregory",
      day: "2-digit",
      month: "2-digit",
      numberingSystem: "latn",
      timeZone: BUSINESS_OPERATING_TIME_ZONE,
      year: "numeric",
    })
      .formatToParts(instant)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const year = parts.get("year");
  const month = parts.get("month");
  const day = parts.get("day");
  return year && month && day ? `${year}-${month}-${day}` : null;
}

function normalizedOperatingTime(value: string, fallback: string): string {
  const match = /^(?:[01]\d|2[0-3]):[0-5]\d/.exec(value);
  return match?.[0] ?? fallback;
}

function operatingInstantForLocalTime(date: string, time: string): string | null {
  const parsed = parseZonedLocalDateTime({
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
    value: `${date}T${time}`,
  });
  return parsed.status === "valid" ? parsed.instant : null;
}

function formatOperatingDateTime(
  value: string,
  language: "en" | "fr-CA",
): string {
  return new Intl.DateTimeFormat(language, {
    calendar: "gregory",
    dateStyle: "medium",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    numberingSystem: "latn",
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
    timeZoneName: "short",
  }).format(new Date(value));
}

function buildSuggestedOpening(input: {
  isExactTime: boolean;
  operatingDayEnd: string;
  operatingDayStart: string;
  requested: Readonly<{ endsAt: string; startsAt: string }>;
  timeBlocks: readonly ServiceTimeBlockRecord[];
}): Readonly<{ endsAt: string; startsAt: string }> | null {
  if (!input.isExactTime) return null;
  const durationMinutes = Math.max(
    15,
    Math.round(
      (new Date(input.requested.endsAt).getTime() -
        new Date(input.requested.startsAt).getTime()) /
        60_000,
    ),
  );
  const requestedDay = operatingDateForInstant(input.requested.startsAt);
  if (!requestedDay) return null;
  const dayStart = operatingInstantForLocalTime(
    requestedDay,
    normalizedOperatingTime(
      input.operatingDayStart,
      DEFAULT_AVAILABILITY_DAY_START,
    ),
  );
  const dayEnd = operatingInstantForLocalTime(
    requestedDay,
    normalizedOperatingTime(input.operatingDayEnd, DEFAULT_AVAILABILITY_DAY_END),
  );
  if (!dayStart || !dayEnd) return null;
  const from = new Date(
    Math.max(
      new Date(input.requested.startsAt).getTime(),
      new Date(dayStart).getTime(),
    ),
  ).toISOString();

  return findFirstInternalOpening({
    blocks: input.timeBlocks.map((block) => ({
      endsAt: block.ends_at,
      id: block.id,
      startsAt: block.starts_at,
      status: block.status,
    })),
    durationMinutes,
    from,
    until: dayEnd,
  });
}

function readAvailabilityDraftSnapshot(
  draft: BulkReplyDraftRecord,
): AvailabilityDraftSnapshot | null {
  const summary = draft.audience_summary;
  if (!summary || typeof summary !== "object" || Array.isArray(summary)) return null;
  const value = summary as Record<string, Json | undefined>;
  const requiredKeys = [
    "leadId",
    "requestedEndsAt",
    "requestedStartsAt",
    "submissionId",
    "timeZone",
  ] as const;
  if (requiredKeys.some((key) => typeof value[key] !== "string")) return null;
  const suggestedStartsAt =
    typeof value.suggestedStartsAt === "string" ? value.suggestedStartsAt : null;
  const suggestedEndsAt =
    typeof value.suggestedEndsAt === "string" ? value.suggestedEndsAt : null;
  if ((suggestedStartsAt === null) !== (suggestedEndsAt === null)) return null;

  return {
    conflictBlockIds: Array.isArray(value.conflictBlockIds)
      ? value.conflictBlockIds.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    leadId: value.leadId as string,
    requestedEndsAt: value.requestedEndsAt as string,
    requestedStartsAt: value.requestedStartsAt as string,
    submissionId: value.submissionId as string,
    suggestedEndsAt,
    suggestedStartsAt,
    timeZone: value.timeZone as string,
  };
}

async function availabilityDraftIsCurrent(input: {
  business: BusinessRecord;
  draft: BulkReplyDraftRecord;
  supabase: PremiumSupabaseClient;
}): Promise<boolean> {
  const snapshot = readAvailabilityDraftSnapshot(input.draft);
  if (
    !snapshot ||
    snapshot.timeZone !== BUSINESS_OPERATING_TIME_ZONE ||
    new Date(snapshot.requestedStartsAt).getTime() <= Date.now()
  ) {
    return false;
  }
  const lead = await getLeadById({
    businessId: input.business.id,
    leadId: snapshot.leadId,
    supabase: input.supabase,
  });
  if (
    !lead ||
    isTerminalLeadStatus(lead.status) ||
    lead.intake_submission_id !== snapshot.submissionId
  ) {
    return false;
  }
  const [values, canonicalExactTimeSubmissionIds, timeBlocks] = await Promise.all([
    listSubmissionValuesForSubmissions({
      businessId: input.business.id,
      submissionIds: [snapshot.submissionId],
      supabase: input.supabase,
    }),
    listCanonicalExactTimeSubmissionIds({
      businessId: input.business.id,
      submissionIds: [snapshot.submissionId],
      supabase: input.supabase,
    }),
    listServiceTimeBlocks({ businessId: input.business.id, supabase: input.supabase }),
  ]);
  const requestedTimeWindow = readRequestedTimeWindow(
    values,
    canonicalExactTimeSubmissionIds.includes(snapshot.submissionId),
  );
  if (!isExactRequestedTimeWindow(requestedTimeWindow)) return false;
  const requested = parseRequestedTimeWindow({
    date: readSubmissionText(values, "preferred_date"),
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
    timeWindow: requestedTimeWindow,
  });
  if (
    !requested ||
    requested.startsAt !== snapshot.requestedStartsAt ||
    requested.endsAt !== snapshot.requestedEndsAt
  ) {
    return false;
  }
  const conflicts = findConflictingTimeBlocks({
    blocks: timeBlocks.map((block) => ({
      endsAt: block.ends_at,
      id: block.id,
      startsAt: block.starts_at,
      status: block.status,
    })),
    requested,
  });
  if (conflicts.length === 0) return false;
  const currentConflictIds = conflicts.map((block) => block.id).sort();
  const snapshotConflictIds = [...snapshot.conflictBlockIds].sort();
  if (
    currentConflictIds.length !== snapshotConflictIds.length ||
    currentConflictIds.some(
      (conflictId, index) => conflictId !== snapshotConflictIds[index],
    )
  ) {
    return false;
  }
  const suggestion = buildSuggestedOpening({
    isExactTime: isExactRequestedTimeWindow(requestedTimeWindow),
    operatingDayEnd: input.business.operating_day_end,
    operatingDayStart: input.business.operating_day_start,
    requested,
    timeBlocks,
  });
  return (
    (suggestion?.startsAt ?? null) === snapshot.suggestedStartsAt &&
    (suggestion?.endsAt ?? null) === snapshot.suggestedEndsAt
  );
}

async function assertAvailabilityDraftCurrent(input: {
  business: BusinessRecord;
  draft: BulkReplyDraftRecord;
  supabase: PremiumSupabaseClient;
}): Promise<void> {
  if (
    isAvailabilityReviewDraft(input.draft) &&
    !(await availabilityDraftIsCurrent(input))
  ) {
    throw new Error("This availability draft is no longer current.");
  }
}

function toPremiumLead(
  input: PremiumOperationsLeadProjection,
  priority: PriorityMatch,
  submissionValues: readonly IntakeSubmissionValueRecord[],
  hasCanonicalExactTime: boolean,
): PremiumLeadItem {
  return {
    area: input.lead.city_or_service_area,
    createdAt: input.lead.created_at,
    customerName: input.lead.customer_name,
    id: input.lead.id,
    priority,
    qualityLevel: input.qualityLevel,
    requestedDate: readSubmissionText(submissionValues, "preferred_date"),
    requestedTimeWindow: readRequestedTimeWindow(
      submissionValues,
      hasCanonicalExactTime,
    ),
    service: input.lead.service_type,
    slaState: input.lead.response_sla_state,
    status: input.lead.status,
  };
}

function buildAvailabilityAlerts(input: {
  canonicalExactTimeSubmissionIds: ReadonlySet<string>;
  customerLanguage: "en" | "fr-CA";
  deskItems: readonly AvailabilityLeadProjection[];
  operatingDayEnd: string;
  operatingDayStart: string;
  timeBlocks: readonly ServiceTimeBlockRecord[];
  valuesBySubmissionId: ReadonlyMap<string, readonly IntakeSubmissionValueRecord[]>;
}): AvailabilityAlert[] {
  const alerts: AvailabilityAlert[] = [];

  const normalizedBlocks = input.timeBlocks.map((block) => ({
    endsAt: block.ends_at,
    id: block.id,
    startsAt: block.starts_at,
    status: block.status,
  }));

  for (const item of input.deskItems) {
    if (isTerminalLeadStatus(item.lead.status)) continue;
    const submissionValues =
      input.valuesBySubmissionId.get(item.lead.intake_submission_id) ?? [];
    const requestedTimeWindow = readRequestedTimeWindow(
      submissionValues,
      input.canonicalExactTimeSubmissionIds.has(item.lead.intake_submission_id),
    );
    const requested = parseRequestedTimeWindow({
      date: readSubmissionText(submissionValues, "preferred_date"),
      timeZone: BUSINESS_OPERATING_TIME_ZONE,
      timeWindow: requestedTimeWindow,
    });
    if (!requested) continue;
    if (new Date(requested.startsAt).getTime() <= Date.now()) continue;
    const isExactTime = isExactRequestedTimeWindow(requestedTimeWindow);
    if (!isExactTime) continue;

    const conflicts = findConflictingTimeBlocks({
      blocks: normalizedBlocks,
      requested,
    });
    if (conflicts.length === 0) continue;

    const suggestion = buildSuggestedOpening({
      isExactTime,
      operatingDayEnd: input.operatingDayEnd,
      operatingDayStart: input.operatingDayStart,
      requested,
      timeBlocks: input.timeBlocks,
    });
    const requestedLabel = isExactTime
      ? formatOperatingDateTime(requested.startsAt, input.customerLanguage)
      : formatRequestedTimeWindowLabel(requestedTimeWindow, input.customerLanguage);
    const suggestedLabel = suggestion
      ? formatOperatingDateTime(suggestion.startsAt, input.customerLanguage)
      : null;

    alerts.push({
      conflictBlockIds: conflicts.map((block) => block.id),
      draft: renderAvailabilityReviewDraft({
        customerName: item.lead.customer_name,
        isExactTime,
        language: input.customerLanguage,
        requestedTimeLabel: requestedLabel,
        suggestedTimeLabel: suggestedLabel,
      }),
      leadId: item.lead.id,
      requestedEndsAt: requested.endsAt,
      requestedStartsAt: requested.startsAt,
      suggestedEndsAt: suggestion?.endsAt ?? null,
      suggestedStartsAt: suggestion?.startsAt ?? null,
    });
  }

  return alerts;
}

function isAvailabilityReviewDraft(draft: BulkReplyDraftRecord): boolean {
  if (!draft.audience_summary || typeof draft.audience_summary !== "object") {
    return false;
  }

  return (
    !Array.isArray(draft.audience_summary) &&
    draft.audience_summary.source === "availability_conflict"
  );
}

async function assertGenericDraftRecipientsCurrent(input: {
  business: BusinessRecord;
  draft: BulkReplyDraftRecord;
  leadIds?: readonly string[];
  supabase: PremiumSupabaseClient;
}): Promise<void> {
  if (isAvailabilityReviewDraft(input.draft)) return;

  const leadIds = input.leadIds
    ? [...new Set(input.leadIds.filter(Boolean))]
    : [
        ...new Set(
          (
            await listBulkReplyDraftRecipients({
              businessId: input.business.id,
              draftIds: [input.draft.id],
              supabase: input.supabase,
            })
          ).map((recipient) => recipient.lead_id),
        ),
      ];
  if (leadIds.length === 0) {
    throw new Error("One or more selected leads are unavailable.");
  }

  const leads = await listLeadsByIds({
    businessId: input.business.id,
    leadIds,
    supabase: input.supabase,
  });
  if (
    leads.length !== leadIds.length ||
    leads.some((lead) => isTerminalLeadStatus(lead.status))
  ) {
    throw new Error("One or more selected leads are unavailable.");
  }
}

async function getAccessibleDraft(input: {
  business: BusinessRecord;
  draftId: string;
}): Promise<BulkReplyDraftRecord> {
  await assertAnyDraftEntitled(input.business);
  const supabase = await createSupabaseServerClient();
  const draft = await getBulkReplyDraftById({
    businessId: input.business.id,
    id: input.draftId,
    supabase,
  });
  if (!draft) {
    throw new Error("The requested draft is unavailable.");
  }

  const entitlements = resolveEntitlements(
    await listAddonEntitlements({ businessId: input.business.id, supabase }),
  );
  if (!entitlements.bulk_reply_review && !isAvailabilityReviewDraft(draft)) {
    throw new Error("This Premium add-on is not active for this workspace.");
  }

  return draft;
}

export async function getPremiumOperationsWorkspace(input: {
  actorUserId: string;
  business: BusinessRecord;
}): Promise<PremiumOperationsWorkspace> {
  const supabase = await createSupabaseServerClient();
  const entitlementRows = await listAddonEntitlements({
    businessId: input.business.id,
    supabase,
  });
  const entitlements = resolveEntitlements(entitlementRows);
  const hasAnyPremiumEntitlement = Object.values(entitlements).some(Boolean);
  const [priorityRules, timeBlocks, batches, operationsLeadRead, serviceAreas] =
    await Promise.all([
      entitlements.priority_workbench
        ? listPriorityRules({ businessId: input.business.id, supabase })
        : [],
      entitlements.availability_coordination
        ? listServiceTimeBlocks({ businessId: input.business.id, supabase })
        : [],
      entitlements.bulk_reply_review || entitlements.availability_coordination
        ? listBulkReplyDrafts({ businessId: input.business.id, supabase })
        : [],
      hasAnyPremiumEntitlement
        ? listActionableOperationsLeads({
            businessId: input.business.id,
            supabase,
          })
        : { hasMore: false, leads: [] as LeadRecord[] },
      hasAnyPremiumEntitlement
        ? listServiceAreasForBusiness({ businessId: input.business.id, supabase })
        : [],
    ]);
  const leads = operationsLeadRead.leads;
  const submissionValues = hasAnyPremiumEntitlement
    ? await listSubmissionValuesForLeadSet({
        businessId: input.business.id,
        leads,
        supabase,
      })
    : [];
  const valuesBySubmissionId = new Map<string, IntakeSubmissionValueRecord[]>();
  for (const value of submissionValues) {
    const values = valuesBySubmissionId.get(value.submission_id) ?? [];
    values.push(value);
    valuesBySubmissionId.set(value.submission_id, values);
  }
  const canonicalExactTimeSubmissionIds = new Set(
    hasAnyPremiumEntitlement
      ? await listCanonicalExactTimeSubmissionIds({
          businessId: input.business.id,
          submissionIds: leads.map((lead) => lead.intake_submission_id),
          supabase,
        })
      : [],
  );
  const serviceAreaNames = serviceAreas.map((area) => area.name);
  const customerLanguage = readSupportedLanguage(input.business.preferred_language);
  const operationsLeads: PremiumOperationsLeadProjection[] = leads.map((lead) => {
    const slaState = calculateSlaState({ lead });
    const projectedLead =
      slaState === lead.response_sla_state
        ? lead
        : {
            ...lead,
            response_sla_state: slaState,
            response_status: slaState,
          };
    const score = calculateLeadQuality({
      language: customerLanguage,
      lead: projectedLead,
      serviceAreas: serviceAreaNames,
      submissionValues:
        valuesBySubmissionId.get(lead.intake_submission_id) ?? [],
    });
    return { lead: projectedLead, qualityLevel: score.qualityLevel };
  });
  const priorityInput = operationsLeads.map((item) => ({
    area: item.lead.city_or_service_area,
    createdAt: item.lead.created_at,
    id: item.lead.id,
    qualityLevel: item.qualityLevel,
    service: item.lead.service_type,
    slaState: item.lead.response_sla_state,
    status: item.lead.status,
  }));
  const rankedLeads = rankLeadsByPriority({
    leads: priorityInput,
    rules: priorityRules.map((rule) => ({
      areaTerms: rule.area_terms,
      id: rule.id,
      isActive: rule.is_active,
      name: rule.name,
      priorityRank: rule.priority_rank,
      serviceTerms: rule.service_terms,
    })),
  });
  const rankByLeadId = new Map(
    rankedLeads.map((item) => [item.id, item.priority]),
  );
  const operationsLeadById = new Map(
    operationsLeads.map((item) => [item.lead.id, item]),
  );
  const priorityOrderedLeadItems = rankedLeads.flatMap((item) => {
    const operationsLead = operationsLeadById.get(item.id);
    return operationsLead ? [operationsLead] : [];
  });
  const visibleBatches = entitlements.bulk_reply_review
    ? batches
    : entitlements.availability_coordination
      ? batches.filter(isAvailabilityReviewDraft)
      : [];
  const recipients = visibleBatches.length > 0
    ? await listBulkReplyDraftRecipients({
        businessId: input.business.id,
        draftIds: visibleBatches.map((batch) => batch.id),
        supabase,
      })
    : [];
  const availabilityAlerts = entitlements.availability_coordination
    ? buildAvailabilityAlerts({
        canonicalExactTimeSubmissionIds,
        customerLanguage: input.business.preferred_language,
        deskItems: operationsLeads,
        operatingDayEnd: input.business.operating_day_end,
        operatingDayStart: input.business.operating_day_start,
        timeBlocks,
        valuesBySubmissionId,
      })
    : [];

  return {
    availabilityAlerts,
    batches: visibleBatches,
    entitlements,
    leadLimitReached: operationsLeadRead.hasMore,
    leads: priorityOrderedLeadItems.map((item) =>
      toPremiumLead(
        item,
        rankByLeadId.get(item.lead.id) ?? {
          matchingRuleIds: [],
          priorityRank: null,
        },
        valuesBySubmissionId.get(item.lead.intake_submission_id) ?? [],
        canonicalExactTimeSubmissionIds.has(item.lead.intake_submission_id),
      ),
    ),
    priorityRules: entitlements.priority_workbench ? priorityRules : [],
    recipients,
    timeBlocks: entitlements.availability_coordination ? timeBlocks : [],
  };
}

export async function addPriorityRule(input: {
  actorUserId: string;
  areaTerms: string[];
  business: BusinessRecord;
  description: string;
  name: string;
  priorityRank: number;
  serviceTerms: string[];
}): Promise<void> {
  await assertPremiumEntitled({ addon: "priority_workbench", business: input.business });
  const name = cleanText(input.name, 80);
  if (name.length < 2) throw new Error("Priority name must be at least 2 characters.");
  if (!Number.isInteger(input.priorityRank) || input.priorityRank < 1 || input.priorityRank > 5) {
    throw new Error("Priority rank must be between 1 and 5.");
  }
  const supabase = await createSupabaseServerClient();
  const currentRules = await listPriorityRules({ businessId: input.business.id, supabase });
  if (currentRules.length >= MAX_PRIORITY_RULES) {
    throw new Error("Limit reached: up to 20 priority views are supported.");
  }
  await createPriorityRule({
    areaTerms: cleanTerms(input.areaTerms),
    businessId: input.business.id,
    createdByUserId: input.actorUserId,
    description: cleanText(input.description, 280) || null,
    name,
    priorityRank: input.priorityRank,
    serviceTerms: cleanTerms(input.serviceTerms),
    supabase,
  });
}

export async function removePriorityRule(input: {
  business: BusinessRecord;
  ruleId: string;
}): Promise<void> {
  await assertPremiumEntitled({ addon: "priority_workbench", business: input.business });
  const supabase = await createSupabaseServerClient();
  await deletePriorityRule({
    businessId: input.business.id,
    id: input.ruleId,
    supabase,
  });
}

export async function addInternalTimeBlock(input: {
  actorUserId: string;
  business: BusinessRecord;
  clientName: string;
  companyName: string;
  endsAt: string;
  leadId: string;
  notes: string;
  serviceLabel: string;
  startsAt: string;
  status: "reserved" | "tentative";
}): Promise<void> {
  await assertPremiumEntitled({ addon: "availability_coordination", business: input.business });
  const parsedStartsAt = parseZonedLocalDateTime({
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
    value: input.startsAt,
  });
  const parsedEndsAt = parseZonedLocalDateTime({
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
    value: input.endsAt,
  });
  if (parsedStartsAt.status !== "valid" || parsedEndsAt.status !== "valid") {
    throw new Error(
      "Choose valid local times outside a daylight-saving transition.",
    );
  }
  const startsAt = new Date(parsedStartsAt.instant);
  const endsAt = new Date(parsedEndsAt.instant);
  if (
    Number.isNaN(startsAt.getTime()) ||
    Number.isNaN(endsAt.getTime()) ||
    endsAt.getTime() <= startsAt.getTime() ||
    endsAt.getTime() - startsAt.getTime() > 24 * 60 * 60_000
  ) {
    throw new Error("Choose a valid time range of up to 24 hours.");
  }
  if (startsAt.getTime() <= Date.now()) {
    throw new Error("Choose a future time range.");
  }
  const clientName = cleanText(input.clientName, 160);
  const serviceLabel = cleanText(input.serviceLabel, 160);
  if (!clientName || !serviceLabel) {
    throw new Error("Client and service are required.");
  }
  const supabase = await createSupabaseServerClient();
  await createServiceTimeBlock({
    businessId: input.business.id,
    clientName,
    companyName: cleanText(input.companyName, 160) || null,
    createdByUserId: input.actorUserId,
    endsAt: endsAt.toISOString(),
    leadId: input.leadId || null,
    notes: cleanText(input.notes, 600) || null,
    serviceLabel,
    startsAt: startsAt.toISOString(),
    status: input.status,
    supabase,
  });
}

export async function cancelInternalTimeBlock(input: {
  business: BusinessRecord;
  timeBlockId: string;
}): Promise<void> {
  await assertPremiumEntitled({ addon: "availability_coordination", business: input.business });
  const supabase = await createSupabaseServerClient();
  await cancelServiceTimeBlock({
    businessId: input.business.id,
    id: input.timeBlockId,
    supabase,
  });
}

export async function prepareBulkReplyDraft(input: {
  actorUserId: string;
  business: BusinessRecord;
  leadIds: string[];
  messageTemplate: string;
  title: string;
}): Promise<void> {
  await assertPremiumEntitled({ addon: "bulk_reply_review", business: input.business });
  const leadIds = [...new Set(input.leadIds.filter(Boolean))];
  if (leadIds.length === 0) throw new Error("Select at least one lead.");
  if (leadIds.length > MAX_BATCH_RECIPIENTS) {
    throw new Error("A review batch can contain up to 50 leads.");
  }
  const title = cleanText(input.title, 120);
  const messageTemplate = input.messageTemplate.trim().slice(0, 4000);
  if (title.length < 2 || messageTemplate.length === 0) {
    throw new Error("A title and draft message are required.");
  }
  const supabase = await createSupabaseServerClient();
  const selectedLeads = await listLeadsByIds({
    businessId: input.business.id,
    leadIds,
    supabase,
  });
  if (selectedLeads.length !== leadIds.length) {
    throw new Error("One or more selected leads are unavailable.");
  }
  if (selectedLeads.some((lead) => isTerminalLeadStatus(lead.status))) {
    throw new Error("Booked, lost, and archived leads cannot be added to a draft batch.");
  }
  const audienceSummary: Json = {
    leadCount: selectedLeads.length,
    manualOnly: true,
    selectedAt: new Date().toISOString(),
  };
  await createPremiumReplyDraftAtomic({
    audienceSummary,
    businessId: input.business.id,
    messageTemplate,
    recipients: selectedLeads.map((lead) => ({
      leadId: lead.id,
      renderedMessage: renderBulkDraft({
        customerName: lead.customer_name,
        service: lead.service_type,
        template: messageTemplate,
      }),
    })),
    supabase,
    title,
  });
}

/**
 * Stores a single conflict reply in the same review queue as a group draft.
 * Availability-only customers can use this without purchasing the bulk-reply
 * add-on; it remains a draft until manually reviewed and copied.
 */
export async function prepareAvailabilityReviewDraft(input: {
  actorUserId: string;
  business: BusinessRecord;
  draft: string;
  leadId: string;
}): Promise<void> {
  await assertPremiumEntitled({
    addon: "availability_coordination",
    business: input.business,
  });
  const messageTemplate = input.draft.trim().slice(0, 4000);
  if (!messageTemplate) throw new Error("A title and draft message are required.");
  const supabase = await createSupabaseServerClient();
  const [lead, timeBlocks] = await Promise.all([
    getLeadById({
      businessId: input.business.id,
      leadId: input.leadId,
      supabase,
    }),
    listServiceTimeBlocks({
      businessId: input.business.id,
      supabase,
    }),
  ]);
  if (!lead || isTerminalLeadStatus(lead.status)) {
    throw new Error("One or more selected leads are unavailable.");
  }

  const [values, canonicalExactTimeSubmissionIds] = await Promise.all([
    listSubmissionValuesForSubmissions({
      businessId: input.business.id,
      submissionIds: [lead.intake_submission_id],
      supabase,
    }),
    listCanonicalExactTimeSubmissionIds({
      businessId: input.business.id,
      submissionIds: [lead.intake_submission_id],
      supabase,
    }),
  ]);
  const requestedTimeWindow = readRequestedTimeWindow(
    values,
    canonicalExactTimeSubmissionIds.includes(lead.intake_submission_id),
  );
  if (!isExactRequestedTimeWindow(requestedTimeWindow)) {
    throw new Error("This request does not include a usable preferred time.");
  }
  const requested = parseRequestedTimeWindow({
    date: readSubmissionText(values, "preferred_date"),
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
    timeWindow: requestedTimeWindow,
  });
  if (!requested) {
    throw new Error("This request does not include a usable preferred time.");
  }
  if (new Date(requested.startsAt).getTime() <= Date.now()) {
    throw new Error("This availability draft is no longer current.");
  }

  const conflicts = findConflictingTimeBlocks({
    blocks: timeBlocks.map((block) => ({
      endsAt: block.ends_at,
      id: block.id,
      startsAt: block.starts_at,
      status: block.status,
    })),
    requested,
  });
  if (conflicts.length === 0) {
    throw new Error("This request no longer conflicts with a saved internal time block.");
  }
  const suggestion = buildSuggestedOpening({
    isExactTime: isExactRequestedTimeWindow(requestedTimeWindow),
    operatingDayEnd: input.business.operating_day_end,
    operatingDayStart: input.business.operating_day_start,
    requested,
    timeBlocks,
  });

  const existingDraft = await findAvailabilityReviewDraftForLead({
    businessId: input.business.id,
    leadId: lead.id,
    supabase,
  });
  if (existingDraft) {
    if (
      await availabilityDraftIsCurrent({
        business: input.business,
        draft: existingDraft,
        supabase,
      })
    ) {
      throw new Error("An availability review draft already exists for this request.");
    }
  }

  await createAvailabilityReviewDraftAtomic({
    businessId: input.business.id,
    conflictBlockIds: conflicts.map((block) => block.id),
    leadId: lead.id,
    messageTemplate,
    requestedEndsAt: requested.endsAt,
    requestedStartsAt: requested.startsAt,
    suggestedEndsAt: suggestion?.endsAt ?? null,
    suggestedStartsAt: suggestion?.startsAt ?? null,
    supabase,
    title:
      input.business.preferred_language === "fr-CA"
        ? "Réponse de disponibilité à réviser"
        : "Availability response for review",
  });
}

export async function reviewBulkReplyDraft(input: {
  business: BusinessRecord;
  draftId: string;
}): Promise<void> {
  const draft = await getAccessibleDraft({
    business: input.business,
    draftId: input.draftId,
  });
  const supabase = await createSupabaseServerClient();
  await assertAvailabilityDraftCurrent({
    business: input.business,
    draft,
    supabase,
  });
  await assertGenericDraftRecipientsCurrent({
    business: input.business,
    draft,
    supabase,
  });
  await markBulkReplyDraftReviewed({
    businessId: input.business.id,
    draftId: input.draftId,
    supabase,
  });
}

export async function recordBulkReplyCopied(input: {
  business: BusinessRecord;
  recipientId: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const recipient = await getBulkReplyDraftRecipientById({
    businessId: input.business.id,
    id: input.recipientId,
    supabase,
  });
  if (!recipient) {
    throw new Error("The requested draft is unavailable.");
  }
  const draft = await getAccessibleDraft({
    business: input.business,
    draftId: recipient.draft_id,
  });
  if (draft.status !== "reviewed") {
    throw new Error("A manager must review this draft before it can be copied.");
  }
  await assertAvailabilityDraftCurrent({
    business: input.business,
    draft,
    supabase,
  });
  await assertGenericDraftRecipientsCurrent({
    business: input.business,
    draft,
    leadIds: [recipient.lead_id],
    supabase,
  });
  await markBulkReplyRecipientCopied({
    businessId: input.business.id,
    recipientId: input.recipientId,
    supabase,
  });
}
