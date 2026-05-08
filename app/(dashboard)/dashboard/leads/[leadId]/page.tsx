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
 * Last Updated: 2026-05-08
 * Change Log:
 * - 2026-05-07: Created Phase 5 lead detail workflow page.
 * - 2026-05-08: Clarified fit/completeness copy and removed mojibake separators.
 * ============================================================
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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
    business: activeBusiness,
    leadId,
  });

  if (!detail) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12">
      <div className="flex flex-col gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            className="text-sm font-medium text-zinc-500"
            href="/dashboard/leads"
          >
            Back to leads
          </Link>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
            {detail.lead.customer_name ?? "Unnamed lead"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            {detail.lead.customer_contact ?? "No contact captured"} -{" "}
            {detail.lead.service_type ?? "Service not set"} -{" "}
            {detail.lead.city_or_service_area ?? "Area missing"}
          </p>
        </div>
        <form action={markReplyCopiedAction}>
          <input name="leadId" type="hidden" value={detail.lead.id} />
          <button
            className="bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
            type="submit"
          >
            Mark reply copied
          </button>
        </form>
      </div>

      {query?.notice ? (
        <p className="mt-6 border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {query.notice}
        </p>
      ) : null}

      {query?.error ? (
        <p className="mt-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {query.error}
        </p>
      ) : null}

      <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Quality
          </p>
          <p className="mt-2 text-2xl font-semibold capitalize text-zinc-950">
            {label(detail.score.quality_level)}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {detailCompletenessText({
              completenessLabel: detail.score.completeness_label,
              completenessScore: detail.score.completeness_score,
            })}
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Fit and completeness are separate: a complete lead can still be low
            fit.
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            SLA state
          </p>
          <p className="mt-2 text-2xl font-semibold capitalize text-zinc-950">
            {label(detail.lead.response_sla_state)}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Viewed {formatDate(detail.lead.first_viewed_at)}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Reply copied
          </p>
          <p className="mt-2 text-base font-medium text-zinc-950">
            {formatDate(detail.lead.first_reply_copied_at)}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Outcome
          </p>
          <p className="mt-2 text-base font-medium capitalize text-zinc-950">
            {detail.lead.manual_outcome
              ? label(detail.lead.manual_outcome)
              : "Not marked"}
          </p>
        </div>
      </section>

      <section className="grid gap-8 border-t border-zinc-200 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Lead fit notes
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {detail.primaryIssue}
          </p>
          <p className="mt-2 text-sm font-medium text-zinc-950">
            Recommended action: {detail.recommendedAction}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.score.missing_info_keys.length > 0 ? (
              detail.score.missing_info_keys.map((key) => (
                <span
                  className="border border-zinc-200 px-3 py-1 text-sm capitalize text-zinc-700"
                  key={key}
                >
                  {label(key)}
                </span>
              ))
            ) : (
              <span className="text-sm text-zinc-500">
                No required quote details are missing.
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Lead controls
          </h2>
          <form action={updateLeadStatusAction} className="mt-4 flex gap-2">
            <input name="leadId" type="hidden" value={detail.lead.id} />
            <select
              className="min-w-0 flex-1 border border-zinc-300 px-3 py-2 text-sm text-zinc-950"
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
            <button
              className="border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
              type="submit"
            >
              Save
            </button>
          </form>
          <form action={markLeadOutcomeAction} className="mt-3 flex gap-2">
            <input name="leadId" type="hidden" value={detail.lead.id} />
            <select
              className="min-w-0 flex-1 border border-zinc-300 px-3 py-2 text-sm text-zinc-950"
              defaultValue={detail.lead.manual_outcome ?? "booked"}
              name="manualOutcome"
            >
              <option value="booked">Booked</option>
              <option value="lost">Lost</option>
              <option value="no_response">No response</option>
              <option value="not_a_fit">Not a fit</option>
              <option value="asked_info">Asked info</option>
            </select>
            <button
              className="border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
              type="submit"
            >
              Mark
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-8 border-t border-zinc-200 py-8 lg:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Quote details
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
            {detail.submissionValues.map((value) => (
              <div
                className="grid gap-2 p-4 text-sm sm:grid-cols-[12rem_1fr]"
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
        </div>

        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Action items
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
            {detail.actions.length > 0 ? (
              detail.actions.map((action) => (
                <div
                  className="grid gap-3 p-4 text-sm sm:grid-cols-[1fr_auto]"
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
                      <button
                        className="border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800"
                        type="submit"
                      >
                        Complete
                      </button>
                    </form>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-zinc-500">No action items yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 py-8">
        <h2 className="text-base font-semibold text-zinc-950">Timeline</h2>
        <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
          {detail.events.length > 0 ? (
            detail.events.map((event) => (
              <div
                className="grid gap-2 p-4 text-sm sm:grid-cols-[12rem_1fr]"
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
            <p className="p-4 text-sm text-zinc-500">No timeline events yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
