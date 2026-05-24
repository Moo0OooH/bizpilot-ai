/**
 * ============================================================
 * File: app/admin/page.tsx
 * Project: BizPilot AI
 * Description: Internal founder-only admin console for manual pilot controls.
 * Role: Lets the founder inspect businesses, plans, access state, quote link state, usage signals, and internal notes.
 * Related:
 * - server/actions/founder-admin.actions.ts
 * - server/services/founder-admin.service.ts
 * - docs/product/BIZPILOT_FOUNDER_ADMIN_CONSOLE_SPEC_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-22
 * Last Updated: 2026-05-22
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { FounderAuthUserDeleteForm } from "@/components/admin/founder-auth-user-delete-form";
import { FounderTestCleanupForm } from "@/components/admin/founder-test-cleanup-form";
import {
  buttonClass,
  DashboardCard,
  inputClass,
  MetricCard,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import {
  marketingBackground,
  marketingTone,
} from "@/components/public/marketing-ui";
import { languageLabels } from "@/lib/i18n/language";
import {
  updateFounderInternalNoteAction,
  updateFounderPlanAction,
  updateFounderQuoteLinkAction,
  updateFounderStatusAction,
} from "@/server/actions/founder-admin.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import {
  getFounderAdminOverview,
  type FounderAdminBusiness,
  type FounderAdminUser,
} from "@/server/services/founder-admin.service";
import {
  dryRunFounderTestWorkspaceCleanup,
  type FounderCleanupDryRun,
} from "@/server/services/founder-test-cleanup.service";

export const dynamic = "force-dynamic";

type AdminPageProps = Readonly<{
  searchParams?: Promise<{
    cleanupBusinessId?: string;
    error?: string;
    notice?: string;
  }>;
}>;

type PlanSlug = FounderAdminBusiness["planSlug"];
type BusinessStatus = FounderAdminBusiness["status"];

const planOptions: ReadonlyArray<{ label: string; value: PlanSlug }> = [
  { label: "Founder Pilot", value: "founder_pilot" },
  { label: "Starter", value: "starter" },
  { label: "Pro", value: "pro" },
  { label: "Paused", value: "paused" },
];

const statusOptions: ReadonlyArray<{ label: string; value: BusinessStatus }> = [
  { label: "Onboarding", value: "onboarding" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Cancelled", value: "cancelled" },
];

const planLabels: Record<PlanSlug, string> = {
  founder_pilot: "Founder Pilot",
  paused: "Paused",
  pro: "Pro",
  starter: "Starter",
};

const statusLabels: Record<BusinessStatus, string> = {
  active: "Active",
  cancelled: "Cancelled",
  onboarding: "Onboarding",
  suspended: "Suspended",
};

function formatDate(value: string | null): string {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatSlug(value: string | null): string {
  return value ? `/quote/${value}` : "No quote link";
}

function statusTone(status: BusinessStatus) {
  if (status === "active") {
    return "emerald";
  }

  if (status === "suspended" || status === "cancelled") {
    return "red";
  }

  return "amber";
}

function planTone(planSlug: PlanSlug) {
  if (planSlug === "pro") {
    return "emerald";
  }

  if (planSlug === "paused") {
    return "red";
  }

  if (planSlug === "starter") {
    return "blue";
  }

  return "amber";
}

function userAccessTone(status: FounderAdminUser["businessAccessStatus"]) {
  if (status === "active") {
    return "emerald";
  }

  if (status === "suspended" || status === "cancelled") {
    return "red";
  }

  if (status === "onboarding") {
    return "amber";
  }

  return "neutral";
}

function formatUserValue(value: string | null): string {
  return value ? value.replaceAll("_", " ") : "None";
}

function AdminNotice({
  children,
  tone,
}: Readonly<{ children: React.ReactNode; tone: "error" | "notice" }>) {
  const style =
    tone === "error"
      ? {
          backgroundColor: "rgba(255,95,102,0.10)",
          borderColor: "rgba(255,95,102,0.24)",
          color: "#FFB4B4",
        }
      : {
          backgroundColor: "rgba(45,212,191,0.10)",
          borderColor: "rgba(45,212,191,0.24)",
          color: marketingTone.teal,
        };

  return (
    <p
      aria-live={tone === "error" ? "assertive" : "polite"}
      className="rounded-[14px] border px-4 py-3 text-sm font-semibold"
      style={style}
    >
      {children}
    </p>
  );
}

function getFounderAccessMessage(error: unknown): string {
  const message =
    error instanceof Error && error.message.trim().length > 0
      ? error.message.trim()
      : "";
  const allowed = new Set([
    "Founder admin requires sign-in.",
    "Founder admin is not configured.",
    "Founder admin access required.",
  ]);

  return allowed.has(message)
    ? message
    : "Founder admin is not available right now.";
}

function FounderAccessBlocked({ message }: Readonly<{ message: string }>) {
  return (
    <main
      className="biz-dashboard-dark min-h-screen overflow-x-hidden px-5 py-7 text-[var(--dash-text)] sm:px-6"
      style={{ background: marketingBackground }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[720px] items-center">
        <DashboardCard className="p-6 sm:p-8" variant="priority">
          <PageHeader
            actions={<StatusBadge tone="amber">Internal only</StatusBadge>}
            description="This console is reserved for founder operations and requires an explicit email allowlist."
            eyebrow="Founder Admin"
            title="Access unavailable"
          />
          <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--dash-text-secondary)]">
            <AdminNotice tone="error">{message}</AdminNotice>
            <p>
              Set `BIZPILOT_FOUNDER_EMAILS` on the server to the approved founder
              email list, then sign in with one of those accounts.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link className={buttonClass} href="/dashboard">
                Back to dashboard
              </Link>
              <Link className={buttonClass} href="/auth/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </DashboardCard>
      </div>
    </main>
  );
}

function BusinessControlCard({
  business,
  dryRun,
}: Readonly<{
  business: FounderAdminBusiness;
  dryRun?: FounderCleanupDryRun | null;
}>) {
  return (
    <DashboardCard className="p-4 sm:p-5" variant="elevated">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.05fr)_minmax(360px,1.5fr)]">
        <div className="min-w-0 space-y-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-black tracking-[-0.02em] text-[var(--dash-text)]">
                {business.name}
              </h2>
              <StatusBadge tone={statusTone(business.status)}>
                {statusLabels[business.status]}
              </StatusBadge>
              <StatusBadge tone={planTone(business.planSlug)}>
                {planLabels[business.planSlug]}
              </StatusBadge>
              <StatusBadge tone="blue">
                {languageLabels[business.preferredLanguage]}
              </StatusBadge>
              <StatusBadge
                tone={
                  business.workspaceKind === "production_customer"
                    ? "neutral"
                    : "amber"
                }
              >
                {business.workspaceKind.replaceAll("_", " ")}
              </StatusBadge>
              <StatusBadge tone="neutral">
                {business.lifecycleStatus.replaceAll("_", " ")}
              </StatusBadge>
              {business.deletionRequestStatus ? (
                <StatusBadge tone="red">
                  deletion request {business.deletionRequestStatus}
                </StatusBadge>
              ) : null}
            </div>
            <p className="mt-1 truncate text-sm text-[var(--dash-text-muted)]">
              Owner: {business.ownerEmail}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 xl:grid-cols-2">
            <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
              <dt className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                Leads
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.leadCount}
              </dd>
            </div>
            <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
              <dt className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                AI usage
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.usageCount}
              </dd>
            </div>
            <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
              <dt className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                Users
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.memberCount}
              </dd>
            </div>
            <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
              <dt className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                Last activity
              </dt>
              <dd className="mt-1 text-sm font-black text-[var(--dash-text)]">
                {formatDate(business.lastActivityAt)}
              </dd>
            </div>
          </dl>

          <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-sm">
            <p className="font-black text-[var(--dash-text)]">
              {formatSlug(business.publicSlug)}
            </p>
            <p className="mt-1 text-[var(--dash-text-secondary)]">
              Quote link is {business.publicLinkActive ? "active" : "inactive"}.
            </p>
          </div>

          {dryRun ? (
            <div className="rounded-[14px] border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 p-3 text-sm">
              <p className="font-black text-[var(--dash-text)]">
                Cleanup dry run counts
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
                {Object.entries(dryRun.counts)
                  .filter(([, count]) => count > 0)
                  .map(([table, count]) => (
                    <div
                      className="rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2 py-1"
                      key={table}
                    >
                      <dt className="truncate font-bold text-[var(--dash-text-muted)]">
                        {table}
                      </dt>
                      <dd className="font-black text-[var(--dash-text)]">
                        {count}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <form
            action={updateFounderPlanAction}
            className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
          >
            <input name="businessId" type="hidden" value={business.businessId} />
            <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
              Plan
              <select
                className={inputClass}
                defaultValue={business.planSlug}
                name="planSlug"
              >
                {planOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <input
              className={`${inputClass} mt-2`}
              name="note"
              placeholder="Optional plan note"
            />
            <button className={`${primaryButtonClass} mt-3 w-full`} type="submit">
              Save plan
            </button>
          </form>

          <form
            action={updateFounderStatusAction}
            className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
          >
            <input name="businessId" type="hidden" value={business.businessId} />
            <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
              Access status
              <select
                className={inputClass}
                defaultValue={business.status}
                name="businessStatus"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <input
              className={`${inputClass} mt-2`}
              name="note"
              placeholder="Optional access note"
            />
            <button className={`${primaryButtonClass} mt-3 w-full`} type="submit">
              Save access
            </button>
          </form>

          <form
            action={updateFounderQuoteLinkAction}
            className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
          >
            <input name="businessId" type="hidden" value={business.businessId} />
            <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
              Public quote link
              <select
                className={inputClass}
                defaultValue={business.publicLinkActive ? "true" : "false"}
                name="quoteLinkActive"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <input
              className={`${inputClass} mt-2`}
              name="note"
              placeholder="Optional quote link note"
            />
            <button className={`${primaryButtonClass} mt-3 w-full`} type="submit">
              Save quote link
            </button>
          </form>

          <form
            action={updateFounderInternalNoteAction}
            className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
          >
            <input name="businessId" type="hidden" value={business.businessId} />
            <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
              Internal note
              <textarea
                className={`${textareaClass} min-h-[84px]`}
                defaultValue={business.internalNote ?? ""}
                name="internalNote"
                placeholder="Objection, setup state, next founder follow-up"
              />
            </label>
            <button className={`${primaryButtonClass} mt-3 w-full`} type="submit">
              Save note
            </button>
          </form>

          <FounderTestCleanupForm
            businessId={business.businessId}
            businessName={business.name}
            businessSlug={business.slug}
            dryRunAvailable={dryRun?.businessId === business.businessId}
            workspaceKind={business.workspaceKind}
          />
        </div>
      </div>
    </DashboardCard>
  );
}

function FounderUsersSection({
  limit,
  users,
}: Readonly<{ limit: number; users: FounderAdminUser[] }>) {
  return (
    <DashboardCard className="p-4 sm:p-5" variant="elevated">
      <SectionHeader
        action={<StatusBadge tone="blue">Total users: {users.length}</StatusBadge>}
        description="Read-only Supabase Auth users joined to pilot business access where available."
        title="Users"
      />
      {users.length >= limit ? (
        <p className="mt-3 rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
          Showing first {limit} users.
        </p>
      ) : null}
      <div className="mt-4 divide-y divide-[var(--dash-border)] overflow-hidden rounded-[16px] border border-[var(--dash-border)]">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              className="grid gap-3 bg-[var(--dash-surface-muted)] px-4 py-3 text-sm xl:grid-cols-[minmax(220px,1.2fr)_minmax(190px,0.95fr)_minmax(180px,0.85fr)_minmax(180px,0.85fr)_minmax(190px,0.8fr)] xl:items-center"
              key={user.userId}
            >
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="truncate font-black text-[var(--dash-text)]">
                    {user.email}
                  </p>
                  {user.isFounder ? (
                    <StatusBadge tone="amber">Founder</StatusBadge>
                  ) : null}
                  <StatusBadge tone={user.emailConfirmed ? "emerald" : "amber"}>
                    {user.emailConfirmed ? "Confirmed" : "Unconfirmed"}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-[12px] font-bold text-[var(--dash-text-muted)]">
                  Created {formatDate(user.createdAt)}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                  Business
                </p>
                <p className="mt-1 truncate font-black text-[var(--dash-text)]">
                  {user.businessName ?? "No business linked"}
                </p>
                <p className="mt-1 text-[12px] font-bold capitalize text-[var(--dash-text-secondary)]">
                  {formatUserValue(user.membershipRole)}
                  {user.membershipStatus ? ` | ${formatUserValue(user.membershipStatus)}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.planSlug ? (
                  <StatusBadge tone={planTone(user.planSlug)}>
                    {planLabels[user.planSlug]}
                  </StatusBadge>
                ) : (
                  <StatusBadge>No plan</StatusBadge>
                )}
                <StatusBadge tone={userAccessTone(user.businessAccessStatus)}>
                  {formatUserValue(user.businessAccessStatus)}
                </StatusBadge>
                {user.preferredLanguage ? (
                  <StatusBadge tone="blue">
                    {languageLabels[user.preferredLanguage]}
                  </StatusBadge>
                ) : null}
                <StatusBadge tone={user.publicLinkActive ? "emerald" : "neutral"}>
                  {user.publicLinkActive === null
                    ? "No quote link"
                    : user.publicLinkActive
                      ? "Quote active"
                      : "Quote inactive"}
                </StatusBadge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px] sm:max-w-sm">
                <div className="rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                  <p className="font-black text-[var(--dash-text)]">
                    {user.leadCount ?? "-"}
                  </p>
                  <p className="mt-0.5 font-bold text-[var(--dash-text-muted)]">
                    Leads
                  </p>
                </div>
                <div className="rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                  <p className="font-black text-[var(--dash-text)]">
                    {formatDate(user.lastSignInAt)}
                  </p>
                  <p className="mt-0.5 font-bold text-[var(--dash-text-muted)]">
                    Last sign-in
                  </p>
                </div>
              </div>

              <FounderAuthUserDeleteForm
                deletionBlockedReason={user.authDeletionBlockedReason}
                targetEmail={user.authEmail}
                targetUserId={user.userId}
              />
            </div>
          ))
        ) : (
          <p className="bg-[var(--dash-surface-muted)] px-4 py-5 text-center text-sm text-[var(--dash-text-secondary)]">
            No users found.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    redirect("/auth/sign-in");
  }

  let overview;
  try {
    overview = await getFounderAdminOverview({ user });
  } catch (error) {
    return <FounderAccessBlocked message={getFounderAccessMessage(error)} />;
  }

  let dryRun: FounderCleanupDryRun | null = null;
  if (params?.cleanupBusinessId) {
    try {
      dryRun = await dryRunFounderTestWorkspaceCleanup({
        businessId: params.cleanupBusinessId,
        user,
      });
    } catch {
      dryRun = null;
    }
  }

  return (
    <main
      className="biz-dashboard-dark min-h-screen overflow-x-hidden px-5 py-6 text-[var(--dash-text)] sm:px-6 lg:px-8"
      style={{ background: marketingBackground }}
    >
      <div className="mx-auto max-w-[1200px] space-y-5">
        <DashboardCard className="p-5 sm:p-6" variant="priority">
          <PageHeader
            actions={
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone="amber">Internal only</StatusBadge>
                <Link className={buttonClass} href="/dashboard">
                  Owner dashboard
                </Link>
              </div>
            }
            description="Manual founder controls for pilots, plans, quote-link access, usage signals, and internal notes. Billing and customer messaging stay manual."
            eyebrow="Founder Admin"
            title="Pilot control console"
          />
        </DashboardCard>

        {params?.notice ? <AdminNotice tone="notice">{params.notice}</AdminNotice> : null}
        {params?.error ? <AdminNotice tone="error">{params.error}</AdminNotice> : null}

        <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            detail="All cleaning-business tenants visible to founder service role."
            label="Businesses"
            tone="blue"
            value={overview.totals.businesses}
          />
          <MetricCard
            detail="Onboarding or active businesses."
            label="Active pilots"
            tone="emerald"
            value={overview.totals.activePilots}
          />
          <MetricCard
            detail="Starter or Pro manual plans."
            label="Payment-ready"
            tone="amber"
            value={overview.totals.paymentReady}
          />
          <MetricCard
            detail="Suspended or cancelled access."
            label="Paused access"
            tone="red"
            value={overview.totals.suspended}
          />
        </section>

        <FounderUsersSection
          limit={overview.usersResultLimit}
          users={overview.users}
        />

        <section className="space-y-3">
          <SectionHeader
            description="Change only the pilot control fields needed for manual operations."
            title="Businesses"
          />
          {overview.businesses.length > 0 ? (
            overview.businesses.map((business) => (
              <BusinessControlCard
                business={business}
                dryRun={
                  dryRun?.businessId === business.businessId ? dryRun : null
                }
                key={business.businessId}
              />
            ))
          ) : (
            <DashboardCard className="p-6 text-center text-sm text-[var(--dash-text-secondary)]">
              No businesses found.
            </DashboardCard>
          )}
        </section>

        <DashboardCard className="p-4 sm:p-5" variant="priority">
          <SectionHeader
            description="Service-role writes land here after founder authorization."
            title="Recent admin actions"
          />
          <div className="mt-4 divide-y divide-[var(--dash-border)] overflow-hidden rounded-[16px] border border-[var(--dash-border)]">
            {overview.recentActions.length > 0 ? (
              overview.recentActions.map((action) => (
                <div
                  className="grid gap-1 bg-[var(--dash-surface-muted)] px-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)_140px] sm:items-center"
                  key={`${action.createdAt}-${action.actionType}-${action.businessId ?? "none"}`}
                >
                  <span className="font-black text-[var(--dash-text)]">
                    {action.actionType.replaceAll("_", " ")}
                  </span>
                  <span className="truncate text-[var(--dash-text-secondary)]">
                    {action.note ?? action.businessId ?? "No note"}
                  </span>
                  <span className="text-[12px] font-bold text-[var(--dash-text-muted)] sm:text-right">
                    {formatDate(action.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="bg-[var(--dash-surface-muted)] px-4 py-5 text-center text-sm text-[var(--dash-text-secondary)]">
                No admin actions logged yet.
              </p>
            )}
          </div>
        </DashboardCard>
      </div>
    </main>
  );
}
