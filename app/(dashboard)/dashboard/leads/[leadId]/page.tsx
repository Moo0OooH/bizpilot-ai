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
import { notFound, redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import {
  Avatar,
  buttonClass,
  DashboardCard,
  disabledButtonClass,
  EmptyState,
  inputClass,
  LeadStatusBadge,
  PageHeader,
  primaryButtonClass,
  ResponseSlaBadge,
  SectionHeader,
  shortCustomerName,
  StatusBadge,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
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

type LeadDetailPageProps = Readonly<{
  params: Promise<{
    leadId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

function label(value: string): string {
  return value.replaceAll("_", " ");
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAge(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );

  if (diffMinutes < 60) {
    return `${Math.max(diffMinutes, 1)}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return formatDate(value);
}

function jsonValueToText(value: Json): string {
  if (value === null) {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number" || typeof value === "string") {
    return String(value);
  }

  return JSON.stringify(value);
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

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    redirect("/dashboard");
  }

  const detail = await getLeadDetail({
    actorUserId: user.id,
    business: activeBusiness,
    leadId,
  });

  if (!detail) {
    notFound();
  }

  const aiOutput = await getLatestLeadAiOutput({
    business: activeBusiness,
    leadId,
  });

  const customerName = detail.lead.customer_name ?? "Unnamed lead";
  const customerShort = shortCustomerName(detail.lead.customer_name);
  const serviceType = detail.lead.service_type ?? "Service not set";
  const cityArea = detail.lead.city_or_service_area ?? "Area missing";
  const contact = detail.lead.customer_contact ?? "No contact captured";
  const createdAge = formatAge(detail.lead.created_at);
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
        <span>&larr;</span> Back to Lead Recovery Queue
      </Link>

      <PageHeader
        actions={
          <>
            <form action={markReplyCopiedAction}>
              <input name="leadId" type="hidden" value={detail.lead.id} />
              <button className={buttonClass} type="submit">
                Mark Reply Copied
              </button>
            </form>
            <form action={markLeadOutcomeAction}>
              <input name="leadId" type="hidden" value={detail.lead.id} />
              <input name="manualOutcome" type="hidden" value="booked" />
              <button className={primaryButtonClass} type="submit">
                Mark Won
              </button>
            </form>
          </>
        }
        description={`${serviceType} request - ${cityArea} - received ${createdAge}`}
        eyebrow="Lead Response Desk"
        title={customerShort}
      />

      {query?.notice ? (
        <p className="rounded-[14px] border border-emerald-300/35 bg-emerald-500/12 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-200">
          {query.notice}
        </p>
      ) : null}

      {query?.error ? (
        <p className="rounded-[14px] border border-red-300/35 bg-red-500/12 p-3 text-xs font-medium text-red-700 dark:text-red-200">
          {query.error}
        </p>
      ) : null}

      {/* Detail Header — avatar + identity + SLA badges + quick actions */}
      <DashboardCard className="p-[22px]" variant="elevated">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <Avatar name={customerName} size={52} tone="primary" />
            <div className="min-w-0">
              <h2 className="truncate text-[22px] font-extrabold leading-tight tracking-[-0.04em] text-[var(--dash-text)]">
                {customerShort}
              </h2>
              <p className="mt-1 truncate text-[13px] text-[var(--dash-text-secondary)]">
                {contact}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <ResponseSlaBadge value={detail.lead.response_sla_state} />
            <LeadStatusBadge value={detail.lead.status} />
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
              description="Quote intake values captured from the public form."
              title="Lead details"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ReadOnlyField label="Name" value={customerShort} />
              <ReadOnlyField label="Contact" value={contact} />
              <ReadOnlyField label="Service type" value={serviceType} />
              <ReadOnlyField label="City / area" value={cityArea} />
              <ReadOnlyField
                label="Source"
                value={detail.lead.source_channel ?? "Quote link"}
              />
              <ReadOnlyField
                label="Submitted"
                value={formatDate(detail.lead.created_at)}
              />
            </div>

            {detail.submissionValues.length > 0 ? (
              <>
                <div className="my-4 h-px bg-[var(--dash-border)]" />
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  Quote intake fields
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {detail.submissionValues.map((value) => (
                    <ReadOnlyField
                      key={value.id}
                      label={value.field_label}
                      value={jsonValueToText(value.field_value)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </DashboardCard>

          {/* Missing info detected */}
          <DashboardCard className="p-[22px]">
            <SectionHeader
              description="Ask these before estimating or promising availability."
              title="Missing information detected"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.score.missing_info_keys.length > 0 ? (
                detail.score.missing_info_keys.map((key) => (
                  <StatusBadge key={key} tone="amber">
                    {label(key)}
                  </StatusBadge>
                ))
              ) : (
                <StatusBadge tone="emerald">
                  No required quote details missing
                </StatusBadge>
              )}
            </div>
            <p className="mt-4 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              <span className="font-bold text-[var(--dash-text)]">
                Primary issue:
              </span>{" "}
              {detail.primaryIssue}
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              <span className="font-bold text-[var(--dash-text)]">
                Recommended action:
              </span>{" "}
              {detail.recommendedAction}
            </p>
          </DashboardCard>

          {/* Owner controls — status + manual outcome */}
          <DashboardCard className="p-[22px]">
            <SectionHeader
              description="Owner-controlled status and manual outcome tracking. Nothing changes automatically."
              title="Lead controls"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <form action={updateLeadStatusAction} className="grid gap-2">
                <span className="text-[12px] font-bold text-[var(--dash-text-secondary)]">
                  Status
                </span>
                <input name="leadId" type="hidden" value={detail.lead.id} />
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <select
                    className={inputClass}
                    defaultValue={detail.lead.status}
                    name="status"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="replied">Replied</option>
                    <option value="follow_up_needed">Follow-up needed</option>
                    <option value="booked">Booked</option>
                    <option value="lost">Lost</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button className={buttonClass} type="submit">
                    Save
                  </button>
                </div>
              </form>
              <form action={markLeadOutcomeAction} className="grid gap-2">
                <span className="text-[12px] font-bold text-[var(--dash-text-secondary)]">
                  Manual outcome
                </span>
                <input name="leadId" type="hidden" value={detail.lead.id} />
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <select
                    className={inputClass}
                    defaultValue={detail.lead.manual_outcome ?? "booked"}
                    name="manualOutcome"
                  >
                    <option value="booked">Booked</option>
                    <option value="lost">Lost</option>
                    <option value="no_response">No response</option>
                    <option value="not_a_fit">Not a fit</option>
                    <option value="asked_info">Asked info</option>
                  </select>
                  <button className={buttonClass} type="submit">
                    Mark
                  </button>
                </div>
              </form>
            </div>
          </DashboardCard>

          {/* Owner notes (private). Storage TBD — local-only textarea for now. */}
          <DashboardCard className="p-[22px]">
            <SectionHeader
              description="Private notes for pilot learning and follow-up quality. Storage will be wired in a later phase; the field is visible to remind the owner of what to track."
              title="Owner notes"
            />
            <textarea
              className={`${textareaClass} mt-4 min-h-28`}
              defaultValue=""
              placeholder="Add notes about this request, objections, pricing context, or follow-up outcome..."
            />
            <p className="mt-2 text-[11px] text-[var(--dash-text-muted)]">
              Notes persistence is part of Phase 18B and is not yet stored
              server-side.
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
                    {aiOutput ? "Regenerate" : "Generate AI draft"}
                  </button>
                </form>
              }
              description="Manual, on-demand drafts. Nothing is sent automatically."
              title="AI Summary"
            />
            {aiOutput ? (
              <>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge
                    tone={aiOutput.provider === "openai" ? "emerald" : "amber"}
                  >
                    {aiOutput.provider === "openai"
                      ? "Model draft"
                      : "Rule fallback"}
                  </StatusBadge>
                  <StatusBadge tone="blue">Owner review required</StatusBadge>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
                  {aiOutput.output.leadSummary}
                </p>
                <div className="mt-4 grid gap-2 text-[12px] text-[var(--dash-text-secondary)]">
                  <p>
                    <span className="font-bold text-[var(--dash-text)]">
                      Next action:
                    </span>{" "}
                    {aiOutput.output.suggestedNextAction}
                  </p>
                  <p>
                    <span className="font-bold text-[var(--dash-text)]">
                      Missing info:
                    </span>{" "}
                    {aiOutput.output.missingInfoReasoning}
                  </p>
                  <p className="text-[11px] text-[var(--dash-text-muted)]">
                    Source: {aiOutput.model} - Est. cost $
                    {aiOutput.estimatedCost.toFixed(6)}
                    {aiOutput.provider === "rule_fallback" ? " (fallback)" : ""}
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
                Generate a draft when ready. BizPilot prepares a summary, reply
                draft, follow-up draft, and next action. Owner reviews, copies,
                and sends manually.
              </p>
            )}
          </DashboardCard>

          {aiOutput ? (
            <>
              <DashboardCard className="biz-card-ai p-[22px]">
                <SectionHeader title="Suggested reply" />
                <pre className="biz-draft-box mt-3 whitespace-pre-wrap font-sans">
                  {aiOutput.output.replyDraft}
                </pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton
                    label="Copy reply"
                    value={aiOutput.output.replyDraft}
                  />
                  <button
                    className={`${disabledButtonClass}`}
                    title="Editing inline is a Phase 18B improvement."
                    type="button"
                  >
                    Edit manually
                  </button>
                </div>
                <p className="mt-3 text-[11px] text-[var(--dash-text-muted)]">
                  No Send button in MVP. Owner copies and sends manually.
                </p>
              </DashboardCard>

              <DashboardCard className="p-[22px]">
                <SectionHeader title="Follow-up draft" />
                <pre className="biz-draft-box mt-3 whitespace-pre-wrap font-sans">
                  {aiOutput.output.followUpDraft}
                </pre>
                <div className="mt-3">
                  <CopyButton
                    className="w-full"
                    label="Copy follow-up"
                    value={aiOutput.output.followUpDraft}
                  />
                </div>
              </DashboardCard>
            </>
          ) : null}

          <DashboardCard className="p-[22px]">
            <SectionHeader title="AI guardrails" />
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge tone="emerald">No auto-send</StatusBadge>
              <StatusBadge tone="emerald">No invented pricing</StatusBadge>
              <StatusBadge tone="blue">Owner reviewed</StatusBadge>
            </div>
          </DashboardCard>
        </aside>
      </section>

      {/* Action items + Timeline */}
      <section className="grid min-w-0 gap-4 xl:grid-cols-2">
        <DashboardCard className="p-[22px]">
          <SectionHeader title="Action items" />
          <div className="mt-3 overflow-hidden rounded-[16px] border border-[var(--dash-border)]">
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
                      {label(action.action_type)} - {label(action.status)}
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
                        Complete
                      </button>
                    </form>
                  ) : (
                    <StatusBadge tone="emerald">Done</StatusBadge>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3">
                <EmptyState title="No action items">
                  Follow-up and reply tasks will appear here.
                </EmptyState>
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-[22px]">
          <SectionHeader title="Timeline" />
          <div className="mt-3 grid gap-3">
            {detail.events.length > 0 ? (
              detail.events.map((event) => (
                <div
                  className="grid grid-cols-[28px_minmax(0,1fr)_auto] gap-3 rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                  key={event.id}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[var(--dash-primary-soft)] text-[12px] font-bold text-[var(--dash-primary)]">
                    *
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold text-[var(--dash-text)]">
                      {event.event_label}
                    </span>
                    <span className="mt-0.5 block text-[12px] capitalize text-[var(--dash-text-secondary)]">
                      {label(event.event_type)}
                    </span>
                  </span>
                  <span className="whitespace-nowrap text-[12px] text-[var(--dash-text-muted)]">
                    {formatAge(event.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState title="No timeline events">
                Lead activity will appear here as the owner reviews and acts.
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
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
        {fieldLabel}
      </p>
      <p className="mt-1 break-words text-[13px] font-semibold text-[var(--dash-text)]">
        {value}
      </p>
    </div>
  );
}
