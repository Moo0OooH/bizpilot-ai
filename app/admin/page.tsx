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
 * Last Updated: 2026-05-26
 * Change Log:
 * - 2026-05-26: Moved production health ahead of data grids so empty admin data is tied to safe runtime diagnostics.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { FounderAuthUserDeleteForm } from "@/components/admin/founder-auth-user-delete-form";
import { FounderTestCleanupForm } from "@/components/admin/founder-test-cleanup-form";
import { FlashMessage } from "@/components/dashboard/flash-message";
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
  marketingTone,
} from "@/components/public/marketing-ui";
import { languageLabels } from "@/lib/i18n/language";
import {
  founderPasswordResetAction,
  founderTemporaryPasswordAction,
  founderWorkspaceRepairAction,
  updateFounderInternalNoteAction,
  updateFounderPlanAction,
  updateFounderQuoteLinkAction,
  updateFounderSessionPolicyAction,
  updateFounderStatusAction,
  updateFounderWorkspaceKindAction,
} from "@/server/actions/founder-admin.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import {
  getFounderAdminOverview,
  readFounderUserPage,
  readFounderUserPageSize,
  type FounderAdminActionSummary,
  type FounderAdminBusiness,
  type FounderAdminUser,
} from "@/server/services/founder-admin.service";
import {
  getFounderProductionHealth,
  type FounderProductionHealth,
} from "@/server/services/production-health.service";
import {
  dryRunFounderTestWorkspaceCleanup,
  type FounderCleanupDryRun,
} from "@/server/services/founder-test-cleanup.service";

export const dynamic = "force-dynamic";

type AdminSearchParams = {
  cleanupBusinessId?: string | undefined;
  error?: string | undefined;
  notice?: string | undefined;
  userAccess?: string | undefined;
  userConfirmed?: string | undefined;
  userPage?: string | undefined;
  userPageSize?: string | undefined;
  userPriority?: string | undefined;
  userQuery?: string | undefined;
};

type AdminPageProps = Readonly<{
  searchParams?: Promise<AdminSearchParams>;
}>;

type PlanSlug = FounderAdminBusiness["planSlug"];
type BusinessStatus = FounderAdminBusiness["status"];
type SessionTimeoutMode = FounderAdminBusiness["sessionTimeoutMode"];
type WorkspaceKind = FounderAdminBusiness["workspaceKind"];

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

const workspaceKindOptions: ReadonlyArray<{ label: string; value: WorkspaceKind }> = [
  { label: "Production customer", value: "production_customer" },
  { label: "Founder test", value: "founder_test" },
  { label: "Demo", value: "demo" },
  { label: "Seed", value: "seed" },
];

const sessionTimeoutModeOptions: ReadonlyArray<{
  label: string;
  value: SessionTimeoutMode;
}> = [
  { label: "Always on", value: "always_on" },
  { label: "Sign out after duration", value: "after_duration" },
];

const sessionTimeoutOptions: ReadonlyArray<{ label: string; value: number }> = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "4 hours", value: 240 },
  { label: "8 hours", value: 480 },
  { label: "12 hours", value: 720 },
  { label: "24 hours", value: 1440 },
  { label: "7 days", value: 10080 },
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

const workspaceKindLabels: Record<WorkspaceKind, string> = {
  demo: "Demo",
  founder_test: "Founder test",
  production_customer: "Production customer",
  seed: "Seed",
};

const adminActionLabels: Readonly<Record<string, string>> = {
  business_cancelled: "Business cancelled",
  business_deletion_requested: "Deletion requested",
  business_reactivated: "Business reactivated",
  business_suspended: "Business suspended",
  internal_note_added: "Internal note saved",
  password_reset_requested: "Password reset requested",
  plan_changed: "Plan changed",
  quote_link_disabled: "Quote link disabled",
  quote_link_enabled: "Quote link enabled",
  session_policy_changed: "Session policy changed",
  status_changed: "Workspace status changed",
  temporary_password_set: "Temporary password set",
  test_auth_user_deleted: "Test auth user deleted",
  test_workspace_cleanup_completed: "Test workspace cleanup",
};

const controlPanelClass =
  "rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]";

type UserPriorityOption = Readonly<{
  description: string;
  label: string;
  value: string;
}>;

const followUpPriorityOptions: ReadonlyArray<UserPriorityOption> = [
  {
    description: "Access, auth, quote, and activity risks.",
    label: "Needs attention",
    value: "attention",
  },
  {
    description: "Signed up but email is not confirmed.",
    label: "Unconfirmed",
    value: "unconfirmed",
  },
  {
    description: "Auth accounts with no linked business.",
    label: "No business",
    value: "no_business",
  },
  {
    description: "Suspended or cancelled business access.",
    label: "Paused access",
    value: "paused",
  },
  {
    description: "Linked business has no active public quote link.",
    label: "Quote off",
    value: "quote_off",
  },
] as const;

const planPriorityOptions: ReadonlyArray<UserPriorityOption> = planOptions.map(
  (option) => ({
    description: `Users attached to ${option.label} workspaces.`,
    label: option.label,
    value: `plan_${option.value}`,
  }),
);

const accessPriorityOptions: ReadonlyArray<UserPriorityOption> = [
  ...statusOptions.map((option) => ({
    description: `${option.label} workspace access.`,
    label: option.label,
    value: `access_${option.value}`,
  })),
  {
    description: "Auth accounts without a linked business.",
    label: "No business",
    value: "access_unlinked",
  },
];

const userPriorityGroups: ReadonlyArray<
  Readonly<{ options: ReadonlyArray<UserPriorityOption>; title: string }>
> = [
  { options: followUpPriorityOptions, title: "Priority" },
  { options: planPriorityOptions, title: "Plan" },
  { options: accessPriorityOptions, title: "Access status" },
];

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

function formatDateTime(value: string | null): string {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatSlug(value: string | null): string {
  return value ? `/quote/${value}` : "No quote link";
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  if (minutes % 1440 === 0) {
    const days = minutes / 1440;
    return days === 1 ? "1 day" : `${days} days`;
  }

  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  return `${minutes} minutes`;
}

function sessionPolicyLabel(
  mode: SessionTimeoutMode,
  minutes: number | null,
): string {
  if (mode === "after_duration") {
    return `Sign out after ${formatDuration(minutes ?? 480)}`;
  }

  return "Always on";
}

function humanizeAdminKey(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAdminJsonValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "empty";
  }

  if (typeof value === "boolean") {
    return value ? "on" : "off";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return value.replaceAll("_", " ");
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatAdminJsonValue(item)).join(", ");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return "no prior value";
    }

    return entries
      .map(([key, item]) => `${humanizeAdminKey(key)}: ${formatAdminJsonValue(item)}`)
      .join("; ");
  }

  return String(value);
}

function formatActionChange(action: FounderAdminActionSummary): string {
  if (action.actionType === "internal_note_added") {
    return action.newValues &&
      typeof action.newValues === "object" &&
      "internal_note_present" in action.newValues
      ? "Internal note presence changed"
      : "Internal note saved";
  }

  return `${formatAdminJsonValue(action.previousValues)} -> ${formatAdminJsonValue(
    action.newValues,
  )}`;
}

function shortActionId(value: string): string {
  return value.slice(0, 8);
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

function formatContactValue(value: string | null): string {
  return value && value.trim().length > 0 ? value : "Not captured";
}

function normalizeSearch(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function safeParam(value: string | undefined, fallback = "all"): string {
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

function matchesQuery(values: ReadonlyArray<string | null | undefined>, query: string) {
  if (!query) {
    return true;
  }

  return values.some((value) => normalizeSearch(value).includes(query));
}

function matchesUserFilters(user: FounderAdminUser, params: AdminSearchParams): boolean {
  const query = normalizeSearch(params.userQuery);
  const access = safeParam(params.userAccess);
  const confirmed = safeParam(params.userConfirmed);
  const priority = safeParam(params.userPriority);

  if (
    !matchesQuery(
      [
        user.displayName,
        user.email,
        user.phone,
        user.userId,
        user.businessName,
        user.membershipRole,
        user.membershipStatus,
      ],
      query,
    )
  ) {
    return false;
  }

  if (access === "unlinked" && user.businessName) {
    return false;
  }

  if (access !== "all" && access !== "unlinked" && user.businessAccessStatus !== access) {
    return false;
  }

  if (confirmed === "confirmed" && !user.emailConfirmed) {
    return false;
  }

  if (confirmed === "unconfirmed" && user.emailConfirmed) {
    return false;
  }

  if (confirmed === "founder" && !user.isFounder) {
    return false;
  }

  return matchesUserPriority(user, priority);
}

function getUserPriorityScore(user: FounderAdminUser): number {
  if (!user.emailConfirmed) {
    return 100;
  }

  if (user.businessAccessStatus === "suspended" || user.businessAccessStatus === "cancelled") {
    return 90;
  }

  if (!user.businessName) {
    return 80;
  }

  if (user.publicLinkActive === false) {
    return 70;
  }

  if (!user.lastSignInAt) {
    return 60;
  }

  if (user.businessAccessStatus === "onboarding") {
    return 50;
  }

  return 10;
}

function matchesUserPriority(user: FounderAdminUser, priority: string): boolean {
  if (priority.startsWith("plan_")) {
    return user.planSlug === priority.slice("plan_".length);
  }

  if (priority.startsWith("access_")) {
    const accessStatus = priority.slice("access_".length);

    if (accessStatus === "unlinked") {
      return !user.businessName;
    }

    return user.businessAccessStatus === accessStatus;
  }

  if (priority === "unconfirmed") {
    return !user.emailConfirmed;
  }

  if (priority === "no_business") {
    return !user.businessName;
  }

  if (priority === "paused") {
    return user.businessAccessStatus === "suspended" || user.businessAccessStatus === "cancelled";
  }

  if (priority === "quote_off") {
    return user.publicLinkActive === false;
  }

  if (priority === "attention") {
    return getUserPriorityScore(user) >= 50;
  }

  return true;
}

function priorityCount(users: FounderAdminUser[], priority: string): number {
  return users.filter((user) => matchesUserPriority(user, priority)).length;
}

function sortUsersByPriority(users: FounderAdminUser[]): FounderAdminUser[] {
  return [...users].sort((left, right) => {
    const scoreDifference = getUserPriorityScore(right) - getUserPriorityScore(left);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return right.createdAt.localeCompare(left.createdAt);
  });
}

function priorityFilterClass(active: boolean): string {
  return active
    ? "rounded-[16px] border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] p-3 text-left text-sm font-black text-[var(--dash-text)] shadow-[0_14px_30px_rgba(15,118,110,0.12)]"
    : "rounded-[16px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 text-left text-sm font-black text-[var(--dash-text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)] hover:text-[var(--dash-text)]";
}

function adminUsersHref(
  params: AdminSearchParams,
  updates: Partial<AdminSearchParams>,
): string {
  const merged: AdminSearchParams = {
    userAccess: params.userAccess,
    userConfirmed: params.userConfirmed,
    userPage: params.userPage,
    userPageSize: params.userPageSize,
    userPriority: params.userPriority,
    userQuery: params.userQuery,
    ...updates,
  };
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value && value !== "all" && value !== "1") {
      search.set(key, value);
    }
  }

  const query = search.toString();

  return query ? `/admin?${query}` : "/admin";
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
          color: "var(--dash-text)",
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

function FounderAdminSafetyRail() {
  return (
    <DashboardCard className="p-4 sm:p-5" variant="priority">
      <SectionHeader
        action={<StatusBadge tone="red">Production-safe controls</StatusBadge>}
        description="Cleanup and auth deletion stay synthetic-only until a workspace is deliberately classified as non-production."
        title="Safety rail"
      />
      <div className="mt-4 grid gap-3 text-sm leading-6 text-[var(--dash-text-secondary)] lg:grid-cols-3">
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
          <p className="font-black text-[var(--dash-text)]">
            Production customer is locked
          </p>
          <p className="mt-1">
            Hard cleanup and fake/test login deletion are blocked for production
            customer workspaces and owner accounts.
          </p>
        </div>
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
          <p className="font-black text-[var(--dash-text)]">
            Dry-run comes first
          </p>
          <p className="mt-1">
            Test/demo cleanup requires a dry-run count, explicit acknowledgement,
            and exact business name or slug confirmation.
          </p>
        </div>
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
          <p className="font-black text-[var(--dash-text)]">
            Auth deletion is separate
          </p>
          <p className="mt-1">
            Login deletion is audited before the Supabase Auth call. If production
            `0020` is missing, the audit constraint blocks before deletion.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

function healthCount(check: FounderProductionHealth["authAdmin"]): string {
  if (!check.ok) {
    return check.status ? `HTTP ${check.status}` : "Unavailable";
  }

  return check.count === null ? "OK" : String(check.count);
}

function credentialKindLabel(
  kind: FounderProductionHealth["serviceCredentialKind"],
): string {
  const labels: Record<
    FounderProductionHealth["serviceCredentialKind"],
    string
  > = {
    jwt_anon: "JWT anon",
    jwt_other: "JWT non-service",
    jwt_service_role: "JWT service",
    missing: "Missing",
    supabase_publishable: "Publishable",
    supabase_secret: "Secret",
    unknown: "Unknown",
  };

  return labels[kind];
}

function isServiceCredentialLikelyPrivileged(
  health: FounderProductionHealth,
): boolean {
  return (
    health.serviceCredentialKind === "jwt_service_role" ||
    health.serviceCredentialKind === "supabase_secret"
  );
}

function FounderProductionHealthPanel({
  health,
}: Readonly<{ health: FounderProductionHealth | null }>) {
  if (!health) {
    return (
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <SectionHeader
          description="Runtime health could not be loaded without exposing internals."
          title="Production health"
        />
        <AdminNotice tone="error">
          Founder runtime diagnostics are unavailable.
        </AdminNotice>
      </DashboardCard>
    );
  }

  const checks = [
    ["Supabase target", health.supabaseTargetMatchesCanonical ? "Canonical" : "Mismatch", health.supabaseTargetMatchesCanonical],
    [
      "Service key",
      credentialKindLabel(health.serviceCredentialKind),
      isServiceCredentialLikelyPrivileged(health),
    ],
    [
      "Key project",
      health.serviceCredentialMatchesSupabaseRef === false
        ? "Mismatch"
        : health.serviceCredentialMatchesSupabaseRef === true
          ? "Matches"
          : "Not encoded",
      health.serviceCredentialMatchesSupabaseRef !== false,
    ],
    ["Auth SDK", healthCount(health.authAdmin), health.authAdmin.ok],
    ["Auth REST", healthCount(health.authRest), health.authRest.ok],
    ["Businesses", healthCount(health.businesses), health.businesses.ok],
    ["Members", healthCount(health.businessMembers), health.businessMembers.ok],
    ["Profiles", healthCount(health.profiles), health.profiles.ok],
    ["Quote links", healthCount(health.publicLinks), health.publicLinks.ok],
    ["Action log", healthCount(health.recentActions), health.recentActions.ok],
    ["Deletion requests", healthCount(health.deletionRequests), health.deletionRequests.ok],
  ] as const;
  const unhealthy = checks.some(([, , ok]) => !ok);

  return (
    <DashboardCard className="p-4 sm:p-5" variant="priority">
      <SectionHeader
        action={
          <StatusBadge tone={unhealthy ? "red" : "emerald"}>
            {unhealthy ? "Needs attention" : "Healthy"}
          </StatusBadge>
        }
        description="Founder-only runtime wiring checks. Values are counts or safe statuses only."
        title="Production health"
      />
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {checks.map(([label, value, ok]) => (
          <div
            className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
            key={label}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-black uppercase text-[var(--dash-text-muted)]">
                {label}
              </p>
              <StatusBadge tone={ok ? "emerald" : "red"}>
                {ok ? "OK" : "Fail"}
              </StatusBadge>
            </div>
            <p className="mt-2 text-lg font-black text-[var(--dash-text)]">
              {value}
            </p>
          </div>
        ))}
      </div>
      {health.supabaseHostRef ? (
        <p className="mt-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          Supabase project ref: {health.supabaseHostRef}
        </p>
      ) : null}
      {health.serviceCredentialIssuerRef ? (
        <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          Service credential issuer ref: {health.serviceCredentialIssuerRef}
          {health.serviceCredentialMatchesSupabaseRef === false
            ? " (does not match Supabase target)"
            : ""}
        </p>
      ) : null}
      {health.authAdmin.status || health.authRest.status ? (
        <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          Auth status: SDK {health.authAdmin.status ?? "n/a"} / REST{" "}
          {health.authRest.status ?? "n/a"}
        </p>
      ) : null}
    </DashboardCard>
  );
}

function isProductionHealthUnhealthy(
  health: FounderProductionHealth | null,
): boolean {
  if (!health) {
    return true;
  }

  return [
    health.supabaseTargetMatchesCanonical,
    isServiceCredentialLikelyPrivileged(health),
    health.serviceCredentialMatchesSupabaseRef !== false,
    health.authAdmin.ok || health.authRest.ok,
    health.businesses.ok,
    health.businessMembers.ok,
    health.profiles.ok,
    health.publicLinks.ok,
    health.recentActions.ok,
    health.deletionRequests.ok,
  ].some((ok) => !ok);
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
      className="biz-founder-admin min-h-screen overflow-x-hidden px-5 py-7 text-[var(--dash-text)] sm:px-6"
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

function FounderSessionPolicyForm({
  business,
}: Readonly<{ business: FounderAdminBusiness }>) {
  return (
    <form action={updateFounderSessionPolicyAction} className={controlPanelClass}>
      <input name="businessId" type="hidden" value={business.businessId} />
      <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
        Session policy
        <select
          className={inputClass}
          defaultValue={business.sessionTimeoutMode}
          name="sessionTimeoutMode"
        >
          {sessionTimeoutModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-2 grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
        Sign-out duration
        <select
          className={inputClass}
          defaultValue={business.sessionTimeoutMinutes ?? 480}
          name="sessionTimeoutMinutes"
        >
          {sessionTimeoutOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <input
        className={`${inputClass} mt-2`}
        name="note"
        placeholder="Reason owner can trace later"
      />
      <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
        Checked on the next dashboard request. Every policy edit is written to the
        customer system log.
      </p>
      <button className={`${primaryButtonClass} mt-3 w-full`} type="submit">
        Save session policy
      </button>
    </form>
  );
}

function FounderSystemChangeLog({
  actions,
}: Readonly<{ actions: FounderAdminActionSummary[] }>) {
  return (
    <div className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Customer system change log
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Owner-visible trail for founder/admin changes, with trace IDs for
            support verification.
          </p>
        </div>
        <StatusBadge tone="blue">{actions.length} logged</StatusBadge>
      </div>

      <div className="mt-4 divide-y divide-[var(--dash-border)] overflow-hidden rounded-[16px] border border-[var(--dash-border)]">
        {actions.length > 0 ? (
          actions.map((action) => (
            <div
              className="grid gap-2 bg-[var(--dash-surface-muted)] px-4 py-3 text-[12px] sm:grid-cols-[150px_minmax(0,1fr)_105px] sm:items-start"
              key={action.id}
            >
              <div>
                <p className="font-black text-[var(--dash-text)]">
                  {adminActionLabels[action.actionType] ??
                    humanizeAdminKey(action.actionType)}
                </p>
                <p className="mt-1 font-bold text-[var(--dash-text-muted)]">
                  {formatDateTime(action.createdAt)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="break-words font-semibold leading-5 text-[var(--dash-text-secondary)]">
                  {formatActionChange(action)}
                </p>
                {action.note ? (
                  <p className="mt-1 break-words leading-5 text-[var(--dash-text-muted)]">
                    Note: {action.note}
                  </p>
                ) : null}
              </div>
              <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-1.5 text-center font-black text-[var(--dash-text-secondary)]">
                #{shortActionId(action.id)}
              </span>
            </div>
          ))
        ) : (
          <p className="bg-[var(--dash-surface-muted)] px-4 py-5 text-center text-sm text-[var(--dash-text-secondary)]">
            No system changes logged for this customer yet.
          </p>
        )}
      </div>
    </div>
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
    <DashboardCard className="p-5 sm:p-6" variant="elevated">
      <div className="grid gap-6 xl:grid-cols-[minmax(300px,0.9fr)_minmax(520px,1.35fr)]">
        <div className="min-w-0 space-y-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-black text-[var(--dash-text)]">
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
                {workspaceKindLabels[business.workspaceKind]}
              </StatusBadge>
              <StatusBadge tone="neutral">
                {business.lifecycleStatus.replaceAll("_", " ")}
              </StatusBadge>
              <StatusBadge tone={business.sessionTimeoutMode === "always_on" ? "emerald" : "amber"}>
                {sessionPolicyLabel(
                  business.sessionTimeoutMode,
                  business.sessionTimeoutMinutes,
                )}
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

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 xl:grid-cols-2">
            <div className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                Leads
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.leadCount}
              </dd>
            </div>
            <div className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                AI usage
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.usageCount}
              </dd>
            </div>
            <div className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                Users
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.memberCount}
              </dd>
            </div>
            <div className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                Last activity
              </dt>
              <dd className="mt-1 text-sm font-black text-[var(--dash-text)]">
                {formatDate(business.lastActivityAt)}
              </dd>
            </div>
          </dl>

          <div className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 text-sm">
            <p className="font-black text-[var(--dash-text)]">
              {formatSlug(business.publicSlug)}
            </p>
            <p className="mt-1 text-[var(--dash-text-secondary)]">
              Quote link is {business.publicLinkActive ? "active" : "inactive"}.
            </p>
          </div>

          <div className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 text-sm">
            <p className="font-black text-[var(--dash-text)]">
              {sessionPolicyLabel(
                business.sessionTimeoutMode,
                business.sessionTimeoutMinutes,
              )}
            </p>
            <p className="mt-1 text-[var(--dash-text-secondary)]">
              Owner sessions follow this policy on dashboard requests.
            </p>
          </div>

          {dryRun ? (
            <div className="rounded-[18px] border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] p-4 text-sm">
              <p className="font-black text-[var(--dash-text)]">
                Cleanup dry run counts
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
                {Object.entries(dryRun.counts)
                  .filter(([, count]) => count > 0)
                  .map(([table, count]) => (
                    <div
                      className="rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2"
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

        <div className="grid gap-4 md:grid-cols-2">
          <form
            action={updateFounderPlanAction}
            className={controlPanelClass}
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
            className={controlPanelClass}
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
            action={updateFounderWorkspaceKindAction}
            className={controlPanelClass}
          >
            <input name="businessId" type="hidden" value={business.businessId} />
            <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
              Workspace kind
              <select
                className={inputClass}
                defaultValue={business.workspaceKind}
                name="workspaceKind"
              >
                {workspaceKindOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              Use Founder test, Demo, or Seed only for fake data before hard cleanup
              or fake/test auth login deletion.
            </p>
            <input
              className={`${inputClass} mt-2`}
              name="note"
              placeholder="Why this workspace is safe to mark non-production"
            />
            <button className={`${primaryButtonClass} mt-3 w-full`} type="submit">
              Save workspace kind
            </button>
          </form>

          <form
            action={updateFounderQuoteLinkAction}
            className={controlPanelClass}
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
            className={controlPanelClass}
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

          <FounderSessionPolicyForm business={business} />

          <FounderTestCleanupForm
            businessId={business.businessId}
            businessName={business.name}
            businessSlug={business.slug}
            dryRunAvailable={dryRun?.businessId === business.businessId}
            workspaceKind={business.workspaceKind}
          />

          <FounderSystemChangeLog actions={business.actionLog} />
        </div>
      </div>
    </DashboardCard>
  );
}

function FounderWorkspaceRepairControls({
  user,
}: Readonly<{ user: FounderAdminUser }>) {
  if (user.businessName) {
    return null;
  }

  return (
    <form
      action={founderWorkspaceRepairAction}
      className="grid gap-3 rounded-[20px] border border-[var(--dash-border-strong)] bg-[var(--dash-warning-soft)] p-4"
    >
      <input name="targetUserId" type="hidden" value={user.userId} />
      <div>
        <p className="text-sm font-black text-[var(--dash-text)]">
          Recover owner workspace
        </p>
        <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          Use for confirmed auth users created while signup did not finish
          workspace bootstrap.
        </p>
      </div>
      <label className="grid gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
        Business name
        <input
          className={inputClass}
          maxLength={80}
          name="businessName"
          placeholder="Customer cleaning business"
          required
          type="text"
        />
      </label>
      <label className="flex items-start gap-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
        <input
          className="mt-0.5 h-4 w-4 accent-[var(--dash-primary)]"
          name="workspaceRepairAcknowledgement"
          type="checkbox"
        />
        <span>This confirmed user has no existing workspace or membership.</span>
      </label>
      <button
        className={primaryButtonClass}
        disabled={!user.emailConfirmed}
        type="submit"
      >
        Recover workspace
      </button>
      {!user.emailConfirmed ? (
        <p className="text-[12px] font-bold text-[var(--dash-text-secondary)]">
          Confirm the email before creating a workspace.
        </p>
      ) : null}
    </form>
  );
}

function FounderPasswordControls({
  user,
}: Readonly<{ user: FounderAdminUser }>) {
  return (
    <div className="grid gap-4 rounded-[20px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4 md:grid-cols-2">
      <form
        action={founderPasswordResetAction}
        className="grid gap-3 rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4"
      >
        <input name="targetUserId" type="hidden" value={user.userId} />
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Reset password
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Sends the standard reset email to {user.authEmail ?? "this auth user"}.
          </p>
        </div>
        <button className={buttonClass} disabled={!user.authEmail} type="submit">
          Send reset email
        </button>
      </form>

      <form
        action={founderTemporaryPasswordAction}
        className="grid gap-3 rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4"
      >
        <input name="targetUserId" type="hidden" value={user.userId} />
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Temporary password
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Use only after identity check. The password is never written to logs.
          </p>
        </div>
        <input
          autoComplete="new-password"
          className={inputClass}
          minLength={12}
          name="temporaryPassword"
          placeholder="12+ character temporary password"
          type="text"
        />
        <label className="flex items-start gap-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          <input
            className="mt-0.5 h-4 w-4 accent-[var(--dash-primary)]"
            name="temporaryPasswordAcknowledgement"
            type="checkbox"
          />
          <span>Share securely and ask the user to change it after sign-in.</span>
        </label>
        <button className={primaryButtonClass} type="submit">
          Set temporary password
        </button>
      </form>
    </div>
  );
}

function FounderUsersSection({
  businessById,
  dryRun,
  params,
  shownUsers,
  totalLoaded,
  usersLastPage,
  usersPage,
  usersPageSize,
  usersSearchMode,
  usersTotal,
  users,
}: Readonly<{
  businessById: Map<string, FounderAdminBusiness>;
  dryRun: FounderCleanupDryRun | null;
  params: AdminSearchParams;
  shownUsers: FounderAdminUser[];
  totalLoaded: number;
  users: FounderAdminUser[];
  usersLastPage: number;
  usersPage: number;
  usersPageSize: number;
  usersSearchMode: "auth_filter" | "paged";
  usersTotal: number;
}>) {
  const hasPreviousPage = usersPage > 1;
  const hasNextPage = usersPage < usersLastPage;
  const selectedPriority = safeParam(params.userPriority);

  return (
    <DashboardCard className="space-y-5 p-5 sm:p-6" variant="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionHeader
          action={<StatusBadge tone="blue">{shownUsers.length} shown</StatusBadge>}
          description="Search by name, email, phone, or user ID. Only 5-10 auth users load per page, then priority filters tighten the view."
          title="User control desk"
        />
        <div className="flex flex-wrap gap-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
          <span className="rounded-full border border-[var(--dash-border)] px-3 py-1.5">
            Page {usersPage} / {usersLastPage}
          </span>
          <span className="rounded-full border border-[var(--dash-border)] px-3 py-1.5">
            {usersTotal} auth users
          </span>
          <span className="rounded-full border border-[var(--dash-border)] px-3 py-1.5">
            {usersSearchMode === "auth_filter" ? "Search indexed" : "Paged"}
          </span>
        </div>
      </div>

      <div className="space-y-4 rounded-[22px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--dash-text)]">
              Priority views
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              Choose a work queue first, then search or refine inside that queue.
            </p>
          </div>
          <Link
            className={priorityFilterClass(selectedPriority === "all")}
            href={adminUsersHref(params, { userPage: "1", userPriority: undefined })}
          >
            All loaded
            <span className="mt-1 block text-[12px] text-[var(--dash-text-muted)]">
              {totalLoaded} users
            </span>
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1.15fr]">
          {userPriorityGroups.map((group) => (
            <div className="min-w-0 space-y-2" key={group.title}>
              <p className="text-[12px] font-black uppercase text-[var(--dash-text-muted)]">
                {group.title}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                {group.options.map((option) => (
                  <Link
                    className={priorityFilterClass(selectedPriority === option.value)}
                    href={adminUsersHref(params, {
                      userPage: "1",
                      userPriority: option.value,
                    })}
                    key={option.value}
                  >
                    {option.label}
                    <span className="mt-1 block text-[12px] text-[var(--dash-text-muted)]">
                      {priorityCount(users, option.value)} loaded
                    </span>
                    <span className="mt-1 block text-[11px] font-bold leading-4 text-[var(--dash-text-muted)]">
                      {option.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        className="grid gap-4 rounded-[22px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 lg:grid-cols-[minmax(260px,1fr)_130px_180px_180px_auto] lg:items-end"
        method="get"
      >
        <input name="userPage" type="hidden" value="1" />
        <input name="userPriority" type="hidden" value={selectedPriority} />
        <label className="grid gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
          Search users
          <input
            className={inputClass}
            defaultValue={params.userQuery ?? ""}
            name="userQuery"
            placeholder="Name, email, phone"
          />
        </label>
        <label className="grid gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
          Show
          <select
            className={inputClass}
            defaultValue={String(usersPageSize)}
            name="userPageSize"
          >
            <option value="5">5 users</option>
            <option value="10">10 users</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
          Access status
          <select
            className={inputClass}
            defaultValue={safeParam(params.userAccess)}
            name="userAccess"
          >
            <option value="all">All users</option>
            <option value="active">Active access</option>
            <option value="onboarding">Onboarding</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
            <option value="unlinked">No business linked</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
          Auth
          <select
            className={inputClass}
            defaultValue={safeParam(params.userConfirmed)}
            name="userConfirmed"
          >
            <option value="all">All auth states</option>
            <option value="confirmed">Confirmed email</option>
            <option value="unconfirmed">Unconfirmed email</option>
            <option value="founder">Founder accounts</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <button className={primaryButtonClass} type="submit">
            Search
          </button>
          <Link className={buttonClass} href="/admin">
            Reset
          </Link>
        </div>
      </form>

      <div className="space-y-3">
        {shownUsers.length > 0 ? (
          shownUsers.map((user) => {
            const linkedBusiness = user.businessId
              ? (businessById.get(user.businessId) ?? null)
              : null;

            return (
            <details
              className="group overflow-hidden rounded-[22px] border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
              key={user.userId}
            >
              <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 text-sm transition hover:bg-[var(--dash-surface-muted)] xl:grid-cols-[minmax(260px,1.1fr)_minmax(220px,0.9fr)_minmax(280px,1fr)_minmax(180px,0.65fr)_110px] xl:items-center">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="truncate font-black text-[var(--dash-text)]">
                    {user.displayName ?? user.email}
                  </p>
                  {user.isFounder ? (
                    <StatusBadge tone="amber">Founder</StatusBadge>
                  ) : null}
                  <StatusBadge tone={user.emailConfirmed ? "emerald" : "amber"}>
                    {user.emailConfirmed ? "Confirmed" : "Unconfirmed"}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-[12px] font-bold text-[var(--dash-text-muted)]">
                  {user.email}
                </p>
                <p className="mt-1 text-[12px] font-bold text-[var(--dash-text-muted)]">
                  Phone: {formatContactValue(user.phone)}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
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

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2">
                  <p className="font-black text-[var(--dash-text)]">
                    {user.leadCount ?? "-"}
                  </p>
                  <p className="mt-0.5 font-bold text-[var(--dash-text-muted)]">
                    Leads
                  </p>
                </div>
                <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2">
                  <p className="font-black text-[var(--dash-text)]">
                    {formatDate(user.lastSignInAt)}
                  </p>
                  <p className="mt-0.5 font-bold text-[var(--dash-text-muted)]">
                    Last sign-in
                  </p>
                </div>
              </div>

              <span className="justify-self-start rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-2 text-[11px] font-black text-[var(--dash-text-secondary)] group-open:border-[var(--dash-primary)] group-open:bg-[var(--dash-primary-soft)] group-open:text-[var(--dash-text)] xl:justify-self-end">
                Modify
              </span>
              </summary>

              <div className="grid gap-5 border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-5">
                {linkedBusiness ? (
                  <BusinessControlCard
                    business={linkedBusiness}
                    dryRun={
                      dryRun?.businessId === linkedBusiness.businessId
                        ? dryRun
                        : null
                    }
                  />
                ) : (
                  <FounderWorkspaceRepairControls user={user} />
                )}
                <FounderPasswordControls user={user} />
                <FounderAuthUserDeleteForm
                  deletionBlockedReason={user.authDeletionBlockedReason}
                  targetEmail={user.authEmail}
                  targetUserId={user.userId}
                />
              </div>
            </details>
          );
          })
        ) : (
          <p className="rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-6 text-center text-sm text-[var(--dash-text-secondary)]">
            No users found.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[12px] font-bold text-[var(--dash-text-muted)]">
          {users.length > shownUsers.length
            ? "Some loaded users are hidden by access/auth filters."
            : "Use search to jump directly to a user instead of scrolling."}
        </div>
        <div className="flex flex-wrap gap-2">
          {hasPreviousPage ? (
            <Link
              className={buttonClass}
              href={adminUsersHref(params, {
                userPage: String(usersPage - 1),
                userPageSize: String(usersPageSize),
              })}
            >
              Previous
            </Link>
          ) : null}
          {hasNextPage ? (
            <Link
              className={buttonClass}
              href={adminUsersHref(params, {
                userPage: String(usersPage + 1),
                userPageSize: String(usersPageSize),
              })}
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </DashboardCard>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [params = {}, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    redirect("/auth/sign-in");
  }

  const usersPage = readFounderUserPage(params.userPage);
  const usersPageSize = readFounderUserPageSize(params.userPageSize);
  let overview;
  try {
    overview = await getFounderAdminOverview({
      user,
      userPage: usersPage,
      userPageSize: usersPageSize,
      ...(params.userQuery ? { userQuery: params.userQuery } : {}),
    });
  } catch (error) {
    return <FounderAccessBlocked message={getFounderAccessMessage(error)} />;
  }

  let dryRun: FounderCleanupDryRun | null = null;
  const productionHealth = await getFounderProductionHealth({ user }).catch(
    () => null,
  );
  if (params.cleanupBusinessId) {
    try {
      dryRun = await dryRunFounderTestWorkspaceCleanup({
        businessId: params.cleanupBusinessId,
        user,
      });
    } catch {
      dryRun = null;
    }
  }
  const businessById = new Map(
    overview.businesses.map((business) => [business.businessId, business]),
  );
  const shownUsers = sortUsersByPriority(
    overview.users.filter((adminUser) => matchesUserFilters(adminUser, params)),
  );

  return (
    <main
      className="biz-founder-admin min-h-screen overflow-x-hidden px-5 py-8 text-[var(--dash-text)] sm:px-7 lg:px-10"
    >
      <div className="mx-auto max-w-[1440px] space-y-6">
        <DashboardCard className="p-6 sm:p-8" variant="priority">
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

        {params.notice ? (
          <FlashMessage tone="notice">{params.notice}</FlashMessage>
        ) : null}
        {params.error ? (
          <FlashMessage durationMs={10000} tone="error">
            {params.error}
          </FlashMessage>
        ) : null}

        {isProductionHealthUnhealthy(productionHealth) ? (
          <AdminNotice tone="error">
            Founder data may be incomplete because one or more production runtime
            checks failed. Review Production health before treating zero users or
            zero businesses as real data.
          </AdminNotice>
        ) : null}

        <FounderProductionHealthPanel health={productionHealth} />

        <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            detail="Auth users available through paged founder search."
            label="Auth users"
            tone="blue"
            value={overview.usersTotal}
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
          businessById={businessById}
          dryRun={dryRun}
          params={params}
          shownUsers={shownUsers}
          totalLoaded={overview.users.length}
          users={overview.users}
          usersLastPage={overview.usersLastPage}
          usersPage={overview.usersPage}
          usersPageSize={overview.usersPageSize}
          usersSearchMode={overview.usersSearchMode}
          usersTotal={overview.usersTotal}
        />

        <FounderAdminSafetyRail />

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
                    {adminActionLabels[action.actionType] ??
                      humanizeAdminKey(action.actionType)}
                  </span>
                  <span className="truncate text-[var(--dash-text-secondary)]">
                    {action.note ?? action.businessId ?? "No note"}
                  </span>
                  <span className="text-[12px] font-bold text-[var(--dash-text-muted)] sm:text-right">
                    {formatDateTime(action.createdAt)}
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
