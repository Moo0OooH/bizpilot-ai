/**
 * ============================================================
 * File: app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * Project: BizPilot AI
 * Description: Renders the Phase 5 owner lead detail workspace.
 * Role: Shows rule-based quality, fit notes, SLA state, copy tracking, manual outcomes, and lead events.
 * Related:
 * - server/actions/lead-conversion.actions.ts
 * - server/services/lead-conversion.service.ts
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-07: Created Phase 5 lead detail workflow page.
 * - 2026-05-08: Clarified fit/completeness copy and removed mojibake separators.
 * - 2026-05-10: Refactored detail view into SaaS workspace primitives.
 * ============================================================
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  buttonClass,
  DashboardCard,
  EmptyState,
  inputClass,
  KpiCard,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import {
  completeActionItemAction,
  markLeadOutcomeAction,
  markReplyCopiedAction,
  updateLeadStatusAction,
} from "@/server/actions/lead-conversion.actions";
import { getCurrentUser } from "@/server/services/auth.service";
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

function detailCompletenessText(input: {
  completenessLabel: string;
  completenessScore: number;
}): string {
  return `${input.completenessScore}% details ${label(input.completenessLabel)}`;
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

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
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

  return (
    <main className="space-y-5">
      <PageHeader
        actions={
          <form action={markReplyCopiedAction}>
            <input name="leadId" type="hidden" value={detail.lead.id} />
            <button className={primaryButtonClass} type="submit">
              Mark reply copied
            </button>
          </form>
        }
        description={`${detail.lead.customer_contact ?? "No contact captured"} - ${
          detail.lead.service_type ?? "Service not set"
        } - ${detail.lead.city_or_service_area ?? "Area missing"}`}
        eyebrow="Lead detail"
        title={detail.lead.customer_name ?? "Unnamed lead"}
      />

      <Link
        className="inline-flex text-xs font-medium text-zinc-500"
        href="/dashboard/leads"
      >
        Back to leads
      </Link>

      {query?.notice ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          {query.notice}
        </p>
      ) : null}

      {query?.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {query.error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          detail={detailCompletenessText({
            completenessLabel: detail.score.completeness_label,
            completenessScore: detail.score.completeness_score,
          })}
          label="Quality"
          value={label(detail.score.quality_level)}
        />
        <KpiCard
          detail={`Viewed ${formatDate(detail.lead.first_viewed_at)}`}
          label="SLA state"
          value={label(detail.lead.response_sla_state)}
        />
        <KpiCard
          label="Reply copied"
          value={formatDate(detail.lead.first_reply_copied_at)}
        />
        <KpiCard
          label="Outcome"
          value={
            detail.lead.manual_outcome
              ? label(detail.lead.manual_outcome)
              : "Not marked"
          }
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard className="p-4">
          <SectionHeader
            description="Rule-based fit notes and missing information."
            title="Customer context"
          />
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {detail.primaryIssue}
          </p>
          <p className="mt-3 text-sm font-medium text-zinc-950">
            Recommended action: {detail.recommendedAction}
          </p>
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
        </DashboardCard>

        <DashboardCard className="p-4">
          <SectionHeader
            description="Owner-controlled status and outcome tracking."
            title="Lead controls"
          />
          <form
            action={updateLeadStatusAction}
            className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"
          >
            <input name="leadId" type="hidden" value={detail.lead.id} />
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
          </form>
          <form
            action={markLeadOutcomeAction}
            className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]"
          >
            <input name="leadId" type="hidden" value={detail.lead.id} />
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
          </form>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardCard className="p-4">
          <SectionHeader title="Quote details" />
          <div className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {detail.submissionValues.map((value) => (
              <div
                className="grid gap-2 p-3 text-sm sm:grid-cols-[12rem_1fr]"
                key={value.id}
              >
                <span className="font-medium text-zinc-700">
                  {value.field_label}
                </span>
                <span className="break-words text-zinc-950">
                  {jsonValueToText(value.field_value)}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="p-4">
          <SectionHeader title="Action items" />
          <div className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {detail.actions.length > 0 ? (
              detail.actions.map((action) => (
                <div
                  className="grid gap-3 p-3 text-sm sm:grid-cols-[1fr_auto]"
                  key={action.id}
                >
                  <span>
                    <span className="block font-medium text-zinc-950">
                      {action.title}
                    </span>
                    <span className="mt-1 block capitalize text-zinc-500">
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
                  ) : null}
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
      </section>

      <DashboardCard className="p-4">
        <SectionHeader title="Timeline" />
        <div className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
          {detail.events.length > 0 ? (
            detail.events.map((event) => (
              <div
                className="grid gap-2 p-3 text-sm sm:grid-cols-[12rem_1fr]"
                key={event.id}
              >
                <span className="text-zinc-500">
                  {formatDate(event.created_at)}
                </span>
                <span>
                  <span className="block font-medium text-zinc-950">
                    {event.event_label}
                  </span>
                  <span className="mt-1 block capitalize text-zinc-500">
                    {label(event.event_type)}
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div className="p-3">
              <EmptyState title="No timeline events">
                Lead activity will be recorded here.
              </EmptyState>
            </div>
          )}
        </div>
      </DashboardCard>
    </main>
  );
}
