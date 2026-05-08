/**
 * ============================================================
 * File: app/(dashboard)/dashboard/leads/page.tsx
 * Project: BizPilot AI
 * Description: Renders the Phase 5 owner Lead Conversion Desk list view.
 * Role: Shows tenant-scoped leads, rule-based quality, today's actions, SLA state, and revenue recovery proof.
 * Related:
 * - server/services/lead-conversion.service.ts
 * - docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-07
 * Change Log:
 * - 2026-05-07: Created Phase 5 lead list and action panel.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { getLeadConversionDesk } from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

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

export default async function LeadConversionDeskPage() {
  const user = await getCurrentUser();

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

  const desk = await getLeadConversionDesk({
    business: activeBusiness,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12">
      <div className="flex flex-col gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
            BizPilot AI
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
            Lead Conversion Desk
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Review captured quote requests, prioritize replies, and track
            manual outcomes for {activeBusiness.name}.
          </p>
        </div>
        <Link
          className="border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
          href="/dashboard"
        >
          Business configuration
        </Link>
      </div>

      <section className="grid gap-4 py-8 sm:grid-cols-3 lg:grid-cols-6">
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Captured
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {desk.recoveryProof.quoteRequestsCaptured}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Reviewed
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {desk.recoveryProof.leadsReviewed}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Follow-ups due
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {desk.recoveryProof.followUpsDue}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Completed
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {desk.recoveryProof.followUpsCompleted}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Strong acted
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {desk.recoveryProof.strongLeadsActedOn}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-xs uppercase tracking-normal text-zinc-500">
            Outcomes
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {desk.recoveryProof.outcomesMarked}
          </p>
        </div>
      </section>

      <section className="border-t border-zinc-200 py-8">
        <h2 className="text-base font-semibold text-zinc-950">
          Today&apos;s action panel
        </h2>
        <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
          {desk.todaysActions.length > 0 ? (
            desk.todaysActions.slice(0, 6).map((action) => (
              <Link
                className="grid gap-2 p-4 text-sm hover:bg-zinc-50 sm:grid-cols-[8rem_1fr_auto]"
                href={`/dashboard/leads/${action.lead_id}`}
                key={action.id}
              >
                <span className="font-medium capitalize text-zinc-700">
                  {label(action.action_type)}
                </span>
                <span className="text-zinc-950">{action.title}</span>
                <span className="text-zinc-500">
                  Due {formatDate(action.due_at)}
                </span>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-zinc-500">
              No open lead actions yet.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-zinc-200 py-8">
        <h2 className="text-base font-semibold text-zinc-950">Leads</h2>
        <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
          {desk.leads.length > 0 ? (
            desk.leads.map((item) => (
              <Link
                className="grid gap-3 p-4 text-sm hover:bg-zinc-50 lg:grid-cols-[1.2fr_1fr_8rem_8rem_10rem]"
                href={`/dashboard/leads/${item.lead.id}`}
                key={item.lead.id}
              >
                <span>
                  <span className="block font-medium text-zinc-950">
                    {item.lead.customer_name ?? "Unnamed lead"}
                  </span>
                  <span className="mt-1 block text-zinc-500">
                    {item.lead.customer_contact ?? "No contact captured"}
                  </span>
                </span>
                <span className="text-zinc-700">
                  {item.lead.service_type ?? "Service not set"}
                  <span className="block text-zinc-500">
                    {item.lead.city_or_service_area ?? "Area missing"}
                  </span>
                </span>
                <span className="capitalize text-zinc-700">
                  {label(item.score.quality_level)}
                </span>
                <span className="capitalize text-zinc-700">
                  {label(item.lead.response_sla_state)}
                </span>
                <span className="text-zinc-500">
                  {formatDate(item.lead.created_at)}
                </span>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-zinc-500">
              Public quote submissions will appear here after leads are
              captured.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
