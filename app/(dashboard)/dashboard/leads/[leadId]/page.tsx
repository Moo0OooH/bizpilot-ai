/**
 * ============================================================
 * File: app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * Project: BizPilot AI
 * Description: Owner lead detail workspace — Quote Recovery Command Center.
 * Role: AI-reviewed reply desk with owner-controlled status, outcome, missing-info, action items, and timeline.
 * Related:
 * - server/actions/lead-conversion.actions.ts
 * - server/services/lead-conversion.service.ts
 * - docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md
 * - docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-07: Created Phase 5 lead detail workflow page.
 * - 2026-05-10: Refactored detail view into SaaS workspace primitives.
 * - 2026-05-19: Rebuilt to match approved index.html dark navy command center: detail header, AI Summary, Suggested reply, Follow-up draft, missing-info badges, owner notes, controls, action items, timeline.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import { FlashMessage } from "@/components/dashboard/flash-message";
import {
  Avatar,
  buttonClass,
  DashboardCard,
  disabledButtonClass,
  EmptyState,
  inputClass,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  shortCustomerName,
  StatusBadge,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { readSafeRouteFlashMessage } from "@/lib/i18n/route-messages";
import {
  INTERFACE_LANGUAGE_COOKIE,
  resolveWorkspaceInterfaceLanguage,
} from "@/lib/i18n/language";
import { generateLeadAiBundleAction } from "@/server/actions/ai-lead-assistant.actions";
import {
  completeActionItemAction,
  markLeadOutcomeAction,
  markReplyCopiedAction,
  updateLeadStatusAction,
} from "@/server/actions/lead-conversion.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import { getLatestLeadAiOutput } from "@/server/services/ai/lead-conversion-assistant.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { getLeadDetail } from "@/server/services/lead-conversion.service";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";

type DashboardCopy = ReturnType<typeof getBizPilotCopy>["dashboard"];
type LeadDetailCopy = DashboardCopy["leadDetail"];
type LeadQueueCopy = DashboardCopy["leadQueue"];

type LeadDetailPageProps = Readonly<{
  params: Promise<{
    leadId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

function label(value: string, copy?: Record<string, string>): string {
  return copy?.[value] ?? value.replaceAll("_", " ");
}

function formatDate(
  value: string | null,
  detailCopy: LeadDetailCopy,
  queueCopy: LeadQueueCopy,
): string {
  if (!value) {
    return detailCopy.notYet;
  }

  return new Intl.DateTimeFormat(queueCopy.age.olderDateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAge(
  value: string | null,
  detailCopy: LeadDetailCopy,
  queueCopy: LeadQueueCopy,
): string {
  if (!value) {
    return detailCopy.notYet;
  }

  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );
  const suffix = queueCopy.age.ago ? ` ${queueCopy.age.ago}` : "";

  if (diffMinutes < 60) {
    return `${queueCopy.age.minute(Math.max(diffMinutes, 1))}${suffix}`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${queueCopy.age.hour(diffHours)}${suffix}`;
  }

  return formatDate(value, detailCopy, queueCopy);
}

function jsonValueToText(value: Json, detailCopy: LeadDetailCopy): string {
  if (value === null) {
    return detailCopy.notProvided;
  }

  if (typeof value === "boolean") {
    return value ? detailCopy.values.yes : detailCopy.values.no;
  }

  if (typeof value === "number" || typeof value === "string") {
    return String(value);
  }

  return JSON.stringify(value);
}

function statusTone(value: string) {
  if (
    value === "lost" ||
    value === "archived" ||
    value === "overdue" ||
    value === "low_fit"
  ) {
    return "red";
  }

  if (value === "booked" || value === "replied" || value === "reply_copied") {
    return "emerald";
  }

  if (value.includes("follow") || value === "asked_info") {
    return "amber";
  }

  if (value === "new" || value === "reviewed" || value === "viewed") {
    return "blue";
  }

  return "neutral";
}

function routingPriorityTone(value: string) {
  if (value === "high") return "red";
  if (value === "review") return "amber";
  return "blue";
}

export default async function LeadDetailPage({
  params,
  searchParams,
}: LeadDetailPageProps) {
  const [{ leadId }, query, user] = await Promise.all([
    params,
    searchParams,
    getCurrentUser(),
  ]);

  if (!user) {
    redirect("/auth/sign-in");
  }

  const cookieStore = await cookies();
  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    redirect("/dashboard");
  }

  const activeLanguage = resolveWorkspaceInterfaceLanguage({
    businessLanguage: activeBusiness.preferred_language,
    cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const dashboardCopy = getBizPilotCopy(activeLanguage).dashboard;
  const missingInfoLabels = getBizPilotCopy(activeLanguage).missingInfoLabels;
  const detailCopy = dashboardCopy.leadDetail;
  const queueCopy = dashboardCopy.leadQueue;
  const routeNotice = readSafeRouteFlashMessage(
    query?.notice,
    dashboardCopy.routeMessages.genericNotice,
  );
  const routeError = readSafeRouteFlashMessage(
    query?.error,
    dashboardCopy.routeMessages.genericError,
  );
  const localizedBusiness = {
    ...activeBusiness,
    preferred_language: activeLanguage,
  };

  const detail = await getLeadDetail({
    actorUserId: user.id,
    business: localizedBusiness,
    leadId,
  });

  if (!detail) {
    notFound();
  }

  const aiOutput = await getLatestLeadAiOutput({
    business: localizedBusiness,
    leadId,
  });

  const customerName = detail.lead.customer_name ?? detailCopy.fallbacks.unnamedLead;
  const customerShort = shortCustomerName(
    detail.lead.customer_name,
    detailCopy.fallbacks.unnamedLead,
  );
  const serviceType = detail.lead.service_type ?? detailCopy.fallbacks.service;
  const cityArea = detail.lead.city_or_service_area ?? detailCopy.fallbacks.area;
  const contact = detail.lead.customer_contact ?? detailCopy.fallbacks.contact;
  const createdAge = formatAge(detail.lead.created_at, detailCopy, queueCopy);
  const slaTone =
    detail.lead.response_sla_state === "overdue"
      ? "red"
      : detail.lead.response_sla_state.includes("follow")
        ? "amber"
        : "blue";

  return (
    <main className="space-y-4">
      <Link
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--dash-text-muted)] transition hover:text-[var(--dash-text)]"
        href="/dashboard/leads"
      >
        <span>&larr;</span> {detailCopy.backToQueue}
      </Link>

      <PageHeader
        description={detailCopy.detailDescription(
          serviceType,
          cityArea,
          createdAge,
        )}
        eyebrow={dashboardCopy.pages.leadDetail.title}
        title={customerShort}
      />

      {routeNotice ? (
        <FlashMessage
          durationMs={routeNotice.startsWith("Fallback") ? 9000 : 6500}
          tone={routeNotice.startsWith("Fallback") ? "warning" : "notice"}
        >
          {routeNotice}
        </FlashMessage>
      ) : null}

      {routeError ? (
        <FlashMessage durationMs={10000} tone="error">
          {routeError}
        </FlashMessage>
      ) : null}

      <DashboardCard className="p-[18px]" variant="priority">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <SectionHeader
              description={detailCopy.manualWorkflow.description}
              title={detailCopy.manualWorkflow.title}
            />
            <div className="mt-3 grid gap-2 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              <p>
                <span className="font-bold text-[var(--dash-text)]">
                  {detailCopy.labels.primaryIssue}:
                </span>{" "}
                {detail.primaryIssue}
              </p>
              <p>
                <span className="font-bold text-[var(--dash-text)]">
                  {detailCopy.labels.recommendedAction}:
                </span>{" "}
                {detail.recommendedAction}
              </p>
            <p className="text-[12px] leading-5 text-[var(--dash-text-muted)]">
              {detailCopy.manualWorkflow.outcomeNote}
            </p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {detailCopy.manualWorkflow.steps.map(([title, detailText], index) => (
              <div
                className="grid min-h-[78px] gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                key={title}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--dash-primary-soft)] text-[11px] font-black text-[var(--dash-primary)]">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-[13px] font-black text-[var(--dash-text)]">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {detailText}
                  </span>
                </span>
              </div>
            ))}
          </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <form action={markReplyCopiedAction}>
              <input name="leadId" type="hidden" value={detail.lead.id} />
              <button className={primaryButtonClass} type="submit">
                {detailCopy.manualWorkflow.primaryAction}
              </button>
            </form>
            <a className={buttonClass} href="#lead-owner-controls">
              {detailCopy.manualWorkflow.secondaryAction}
            </a>
          </div>
        </div>
      </DashboardCard>

      {/* Detail Header — avatar + identity + SLA badges + quick actions */}
      <DashboardCard className="p-[22px]" variant="elevated">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <Avatar name={customerName} size={52} tone="primary" />
            <div className="min-w-0">
              <h2 className="truncate text-[22px] font-extrabold leading-tight text-[var(--dash-text)]">
                {customerShort}
              </h2>
              <p className="mt-1 truncate text-[13px] text-[var(--dash-text-secondary)]">
                {contact}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <StatusBadge tone={slaTone}>
              {label(detail.lead.response_sla_state, detailCopy.statusLabels)}
            </StatusBadge>
            <StatusBadge tone={statusTone(detail.lead.status)}>
              {label(detail.lead.status, detailCopy.statusLabels)}
            </StatusBadge>
            <StatusBadge tone={slaTone}>{createdAge}</StatusBadge>
          </div>
        </div>
      </DashboardCard>

      {/* Two-column command center: left = data + missing-info + notes; right = AI desk */}
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="min-w-0 space-y-4">
          {/* Lead details (read-only fields) */}
          <DashboardCard className="p-[22px]">
            <SectionHeader
              description={detailCopy.sections.leadDetailsDescription}
              title={detailCopy.sections.leadDetailsTitle}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ReadOnlyField label={detailCopy.fields.name} value={customerShort} />
              <ReadOnlyField label={detailCopy.fields.contact} value={contact} />
              <ReadOnlyField
                label={detailCopy.fields.serviceType}
                value={serviceType}
              />
              <ReadOnlyField label={detailCopy.fields.cityArea} value={cityArea} />
              <ReadOnlyField
                label={detailCopy.fields.source}
                value={detail.lead.source_channel ?? detailCopy.fallbacks.source}
              />
              <ReadOnlyField
                label={detailCopy.fields.submitted}
                value={formatDate(detail.lead.created_at, detailCopy, queueCopy)}
              />
            </div>

            {detail.submissionValues.length > 0 ? (
              <>
                <div className="my-4 h-px bg-[var(--dash-border)]" />
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  {detailCopy.quoteIntakeFields}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {detail.submissionValues.map((value) => (
                    <ReadOnlyField
                      key={value.id}
                      label={value.field_label}
                      value={jsonValueToText(value.field_value, detailCopy)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </DashboardCard>

          {/* Missing info detected */}
          <DashboardCard className="p-[22px]">
            <SectionHeader
              description={detailCopy.missing.description}
              title={detailCopy.missing.title}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.score.missing_info_keys.length > 0 ? (
                detail.score.missing_info_keys.map((key) => (
                  <StatusBadge key={key} tone="amber">
                    {label(key, missingInfoLabels)}
                  </StatusBadge>
                ))
              ) : (
                <StatusBadge tone="emerald">
                  {detailCopy.missing.noRequiredMissing}
                </StatusBadge>
              )}
            </div>
            <p className="mt-4 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              <span className="font-bold text-[var(--dash-text)]">
                {detailCopy.labels.primaryIssue}:
              </span>{" "}
              {detail.primaryIssue}
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              <span className="font-bold text-[var(--dash-text)]">
                {detailCopy.labels.recommendedAction}:
              </span>{" "}
              {detail.recommendedAction}
            </p>
          </DashboardCard>

          <DashboardCard className="p-[22px]" variant="priority">
            <SectionHeader
              description={detailCopy.routing.description}
              title={detailCopy.routing.title}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {detailCopy.routing.badges.map((badge) => (
                <StatusBadge key={badge} tone="emerald">
                  {badge}
                </StatusBadge>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ReadOnlyField
                label={detailCopy.routing.priorityLabel}
                value={
                  detailCopy.routing.priorities[
                    detail.routingSuggestion.priority
                  ] ?? detail.routingSuggestion.priority
                }
              />
              <ReadOnlyField
                label={detailCopy.routing.queueLabel}
                value={
                  detailCopy.routing.queues[
                    detail.routingSuggestion.suggestedQueue
                  ] ?? detail.routingSuggestion.suggestedQueue
                }
              />
              <ReadOnlyField
                label={detailCopy.routing.reviewerLabel}
                value={
                  detailCopy.routing.reviewers[
                    detail.routingSuggestion.suggestedReviewer
                  ] ?? detail.routingSuggestion.suggestedReviewer
                }
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                tone={routingPriorityTone(detail.routingSuggestion.priority)}
              >
                {detailCopy.routing.priorities[
                  detail.routingSuggestion.priority
                ] ?? detail.routingSuggestion.priority}
              </StatusBadge>
              {detail.routingSuggestion.reasonCodes.map((reason) => (
                <StatusBadge key={reason} tone="blue">
                  {detailCopy.routing.reasons[reason] ?? label(reason)}
                </StatusBadge>
              ))}
            </div>
            <p className="mt-4 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              <span className="font-bold text-[var(--dash-text)]">
                {detailCopy.routing.nextActionLabel}:
              </span>{" "}
              {detailCopy.routing.nextActions[
                detail.routingSuggestion.nextAction
              ] ?? detail.routingSuggestion.nextAction}
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              <span className="font-bold text-[var(--dash-text)]">
                {detailCopy.routing.missingInfoLabel}:
              </span>{" "}
              {detail.routingSuggestion.missingInfoKeys.length > 0
                ? detail.routingSuggestion.missingInfoKeys
                    .map((key) => label(key, missingInfoLabels))
                    .join(", ")
                : detailCopy.routing.noMissingInfo}
            </p>
          </DashboardCard>

          {/* Owner controls — status + manual outcome */}
          <div id="lead-owner-controls">
            <DashboardCard className="p-[22px]">
              <SectionHeader
                description={detailCopy.sections.controlsDescription}
                title={detailCopy.sections.controlsTitle}
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <form action={updateLeadStatusAction} className="grid gap-2">
                  <span className="text-[12px] font-bold text-[var(--dash-text-secondary)]">
                    {detailCopy.labels.status}
                  </span>
                  <input name="leadId" type="hidden" value={detail.lead.id} />
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <select
                      className={inputClass}
                      defaultValue={detail.lead.status}
                      name="status"
                    >
                      <option value="new">{detailCopy.statusLabels.new}</option>
                      <option value="reviewed">
                        {detailCopy.statusLabels.reviewed}
                      </option>
                      <option value="replied">
                        {detailCopy.statusLabels.replied}
                      </option>
                      <option value="follow_up_needed">
                        {detailCopy.statusLabels.follow_up_needed}
                      </option>
                      <option value="booked">
                        {detailCopy.statusLabels.booked}
                      </option>
                      <option value="lost">{detailCopy.statusLabels.lost}</option>
                      <option value="archived">
                        {detailCopy.statusLabels.archived}
                      </option>
                    </select>
                    <button className={buttonClass} type="submit">
                      {detailCopy.save}
                    </button>
                  </div>
                </form>
                <form action={markLeadOutcomeAction} className="grid gap-2">
                  <span className="text-[12px] font-bold text-[var(--dash-text-secondary)]">
                    {detailCopy.labels.manualOutcome}
                  </span>
                  <input name="leadId" type="hidden" value={detail.lead.id} />
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <select
                      className={inputClass}
                      defaultValue={detail.lead.manual_outcome ?? "booked"}
                      name="manualOutcome"
                    >
                      <option value="booked">
                        {detailCopy.statusLabels.booked}
                      </option>
                      <option value="lost">{detailCopy.statusLabels.lost}</option>
                      <option value="no_response">
                        {detailCopy.statusLabels.no_response}
                      </option>
                      <option value="not_a_fit">
                        {detailCopy.statusLabels.not_a_fit}
                      </option>
                      <option value="asked_info">
                        {detailCopy.statusLabels.asked_info}
                      </option>
                    </select>
                    <button className={buttonClass} type="submit">
                      {detailCopy.mark}
                    </button>
                  </div>
                  <p className="text-[11px] leading-5 text-[var(--dash-text-muted)]">
                    {detailCopy.manualOutcomeHelp}
                  </p>
                </form>
              </div>
            </DashboardCard>
          </div>

          {/* Owner notes (private). Storage TBD — local-only textarea for now. */}
          <DashboardCard className="p-[22px]">
            <SectionHeader
              description={detailCopy.ownerNotes.description}
              title={detailCopy.ownerNotes.title}
            />
            <textarea
              className={`${textareaClass} mt-4 min-h-28`}
              defaultValue=""
              placeholder={detailCopy.ownerNotes.placeholder}
            />
            <p className="mt-2 text-[11px] text-[var(--dash-text-muted)]">
              {detailCopy.ownerNotes.persistenceNote}
            </p>
          </DashboardCard>
        </div>

        {/* Right column — AI Response Desk */}
        <aside className="min-w-0 space-y-4 xl:sticky xl:top-[92px] xl:self-start">
          <DashboardCard className="biz-card-ai p-[22px]">
            <SectionHeader
              action={
                <form action={generateLeadAiBundleAction}>
                  <input name="leadId" type="hidden" value={detail.lead.id} />
                  <button
                    className={aiOutput ? buttonClass : primaryButtonClass}
                    type="submit"
                  >
                    {aiOutput ? detailCopy.ai.regenerate : detailCopy.ai.generate}
                  </button>
                </form>
              }
              description={detailCopy.ai.manualDraftDescription}
              title={detailCopy.ai.title}
            />
            {aiOutput ? (
              <>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge
                    tone={aiOutput.provider === "openai" ? "emerald" : "amber"}
                  >
                    {aiOutput.provider === "openai"
                      ? detailCopy.ai.modelDraft
                      : detailCopy.ai.ruleFallback}
                  </StatusBadge>
                  <StatusBadge tone="blue">
                    {detailCopy.ai.ownerReviewRequired}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
                  {aiOutput.output.leadSummary}
                </p>
                <div className="mt-4 grid gap-2 text-[12px] text-[var(--dash-text-secondary)]">
                  <p>
                    <span className="font-bold text-[var(--dash-text)]">
                      {detailCopy.ai.nextAction}:
                    </span>{" "}
                    {aiOutput.output.suggestedNextAction}
                  </p>
                  <p>
                    <span className="font-bold text-[var(--dash-text)]">
                      {detailCopy.ai.missingInfo}:
                    </span>{" "}
                    {aiOutput.output.missingInfoReasoning}
                  </p>
                  <p className="text-[11px] text-[var(--dash-text-muted)]">
                    {detailCopy.ai.source}: {aiOutput.model} -{" "}
                    {detailCopy.ai.estimatedCost} $
                    {aiOutput.estimatedCost.toFixed(6)}
                    {aiOutput.provider === "rule_fallback"
                      ? ` (${detailCopy.ai.ruleFallback})`
                      : ""}
                  </p>
                  {aiOutput.provider === "rule_fallback" &&
                  aiOutput.errorMessage ? (
                    <p className="text-[11px] text-[var(--dash-text-muted)]">
                      {detailCopy.ai.fallbackReason}: {aiOutput.errorMessage}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="mt-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
                {detailCopy.ai.manualDraftDescription}
              </p>
            )}
          </DashboardCard>

          {aiOutput ? (
            <>
              <DashboardCard className="biz-card-ai p-[22px]">
                <SectionHeader title={detailCopy.ai.suggestedReply} />
                <pre className="biz-draft-box mt-3 whitespace-pre-wrap font-sans">
                  {aiOutput.output.replyDraft}
                </pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton
                    failedLabel={dashboardCopy.actions.copyFailed}
                    label={detailCopy.ai.copyReply}
                    successLabel={dashboardCopy.actions.copySuccess}
                    value={aiOutput.output.replyDraft}
                  />
                  <button
                    className={`${disabledButtonClass}`}
                    title={detailCopy.ai.editManuallyTitle}
                    type="button"
                  >
                    {detailCopy.ai.editManually}
                  </button>
                </div>
                <p className="mt-3 text-[11px] text-[var(--dash-text-muted)]">
                  {detailCopy.ai.noSend}
                </p>
              </DashboardCard>

              <DashboardCard className="p-[22px]">
                <SectionHeader title={detailCopy.ai.followUpDraft} />
                <pre className="biz-draft-box mt-3 whitespace-pre-wrap font-sans">
                  {aiOutput.output.followUpDraft}
                </pre>
                <div className="mt-3">
                  <CopyButton
                    className="w-full"
                    failedLabel={dashboardCopy.actions.copyFailed}
                    label={detailCopy.ai.copyFollowUp}
                    successLabel={dashboardCopy.actions.copySuccess}
                    value={aiOutput.output.followUpDraft}
                  />
                </div>
              </DashboardCard>
            </>
          ) : null}

          <DashboardCard className="p-[22px]">
            <SectionHeader title={detailCopy.ai.guardrails} />
            <div className="mt-3 flex flex-wrap gap-2">
              {detailCopy.ai.guardrailBadges.map((badge, index) => (
                <StatusBadge
                  key={badge}
                  tone={index < 2 ? "emerald" : "blue"}
                >
                  {badge}
                </StatusBadge>
              ))}
            </div>
          </DashboardCard>
        </aside>
      </section>

      {/* Action items + Timeline */}
      <section className="grid min-w-0 gap-4 xl:grid-cols-2">
        <DashboardCard className="p-[22px]">
          <SectionHeader title={detailCopy.actionItems} />
          <div className="mt-3 overflow-hidden rounded-lg border border-[var(--dash-border)]">
            {detail.actions.length > 0 ? (
              detail.actions.map((action) => (
                <div
                  className="grid gap-3 border-b border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[13px] last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center"
                  key={action.id}
                >
                  <span className="min-w-0">
                    <span className="block font-bold text-[var(--dash-text)]">
                      {action.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] capitalize text-[var(--dash-text-secondary)]">
                      {label(action.action_type, detailCopy.statusLabels)} -{" "}
                      {label(action.status, detailCopy.statusLabels)}
                    </span>
                  </span>
                  {action.status === "open" ? (
                    <form action={completeActionItemAction}>
                      <input
                        name="actionItemId"
                        type="hidden"
                        value={action.id}
                      />
                      <input
                        name="leadId"
                        type="hidden"
                        value={detail.lead.id}
                      />
                      <button className={buttonClass} type="submit">
                        {detailCopy.completeAction}
                      </button>
                    </form>
                  ) : (
                    <StatusBadge tone="emerald">
                      {detailCopy.copiedDone}
                    </StatusBadge>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3">
                <EmptyState title={detailCopy.noActionItemsTitle}>
                  {detailCopy.noActionItemsBody}
                </EmptyState>
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-[22px]">
          <SectionHeader title={detailCopy.timeline} />
          <div className="mt-3 grid gap-3">
            {detail.events.length > 0 ? (
              detail.events.map((event) => (
                <div
                  className="grid grid-cols-[28px_minmax(0,1fr)_auto] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                  key={event.id}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--dash-primary-soft)] text-[12px] font-bold text-[var(--dash-primary)]">
                    *
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold text-[var(--dash-text)]">
                      {event.event_label}
                    </span>
                    <span className="mt-0.5 block text-[12px] capitalize text-[var(--dash-text-secondary)]">
                      {label(event.event_type, detailCopy.statusLabels)}
                    </span>
                  </span>
                  <span className="whitespace-nowrap text-[12px] text-[var(--dash-text-muted)]">
                    {formatAge(event.created_at, detailCopy, queueCopy)}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState title={detailCopy.noTimelineTitle}>
                {detailCopy.noTimelineBody}
              </EmptyState>
            )}
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}

function ReadOnlyField({
  label: fieldLabel,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
        {fieldLabel}
      </p>
      <p className="mt-1 break-words text-[13px] font-semibold text-[var(--dash-text)]">
        {value}
      </p>
    </div>
  );
}
