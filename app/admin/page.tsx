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
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { FounderAuthUserDeleteForm } from "@/components/admin/founder-auth-user-delete-form";
import {
  FounderAdminThemeFrame,
  FounderAdminThemeSelector,
} from "@/components/admin/founder-admin-theme";
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
import { languageLabels } from "@/lib/i18n/language";
import {
  founderInboxLeadDeleteAction,
  founderInboxLeadStatusAction,
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
  adminPanel?: string | undefined;
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

type AdminPanel = "users" | "health" | "leads" | "activity" | "safety";

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
  "grid gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm";
const toolboxSectionClass =
  "grid gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5";

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

function leadStatusTone(status: string) {
  if (status === "new" || status === "follow_up_needed") {
    return "amber";
  }
  if (status === "archived" || status === "lost") {
    return "neutral";
  }
  if (status === "replied" || status === "reviewed" || status === "booked") {
    return "emerald";
  }
  return "blue";
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

function readAdminPanel(value: string | undefined): AdminPanel {
  if (
    value === "health" ||
    value === "leads" ||
    value === "activity" ||
    value === "safety"
  ) {
    return value;
  }

  return "users";
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
    ? "inline-flex min-h-9 items-center gap-2 rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3 py-2 text-left text-[12px] font-black text-[var(--dash-text)] shadow-sm"
    : "inline-flex min-h-9 items-center gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-left text-[12px] font-black text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)] hover:text-[var(--dash-text)]";
}

function adminUsersHref(
  params: AdminSearchParams,
  updates: Partial<AdminSearchParams>,
): string {
  const merged: AdminSearchParams = {
    adminPanel: params.adminPanel,
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
          backgroundColor: "var(--dash-danger-soft)",
          borderColor: "var(--dash-danger-border)",
          color: "var(--dash-text)",
        }
      : {
          backgroundColor: "var(--dash-primary-soft)",
          borderColor: "var(--dash-primary-border)",
          color: "var(--dash-primary-strong)",
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
    <DashboardCard className="p-3" variant="priority">
      <details>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--dash-text)]">
              Safety rules
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-[var(--dash-text-secondary)]">
              Destructive controls stay behind explicit guards.
            </p>
          </div>
          <StatusBadge tone="red">Rules</StatusBadge>
        </summary>
        <div className="mt-3 grid gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
            <p className="font-black text-[var(--dash-text)]">
              Production customer is locked
            </p>
            <p className="mt-1">
              Hard cleanup and fake/test login deletion are blocked for production
              customer workspaces and owner accounts.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
            <p className="font-black text-[var(--dash-text)]">
              Dry-run comes first
            </p>
            <p className="mt-1">
              Test/demo cleanup requires counts, acknowledgement, and exact
              business name or slug confirmation.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
            <p className="font-black text-[var(--dash-text)]">
              Auth deletion is separate
            </p>
            <p className="mt-1">
              Login deletion is audited before the Supabase Auth call.
            </p>
          </div>
        </div>
      </details>
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
    <DashboardCard className="p-3 sm:p-4" variant="priority">
      <SectionHeader
        action={
          <StatusBadge tone={unhealthy ? "red" : "emerald"}>
            {unhealthy ? "Needs attention" : "Healthy"}
          </StatusBadge>
        }
        title="Production health"
      />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {checks.map(([label, value, ok]) => (
          <div
            className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5"
            key={label}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[10px] font-black uppercase text-[var(--dash-text-muted)]">
                {label}
              </p>
              <StatusBadge tone={ok ? "emerald" : "red"}>
                {ok ? "OK" : "Fail"}
              </StatusBadge>
            </div>
            <p className="mt-1.5 truncate text-sm font-black text-[var(--dash-text)]">
              {value}
            </p>
          </div>
        ))}
      </div>
      {health.supabaseHostRef ? (
        <p className="mt-3 truncate text-[11px] leading-5 text-[var(--dash-text-secondary)]">
          Supabase project ref: {health.supabaseHostRef}
        </p>
      ) : null}
      {health.serviceCredentialIssuerRef ? (
        <p className="mt-1 truncate text-[11px] leading-5 text-[var(--dash-text-secondary)]">
          Service credential issuer ref: {health.serviceCredentialIssuerRef}
          {health.serviceCredentialMatchesSupabaseRef === false
            ? " (does not match Supabase target)"
            : ""}
        </p>
      ) : null}
      {health.authAdmin.status || health.authRest.status ? (
        <p className="mt-1 text-[11px] leading-5 text-[var(--dash-text-secondary)]">
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
  const toolboxName = `business-toolbox-${business.businessId}`;

  return (
    <DashboardCard className="p-4 sm:p-5" variant="elevated">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.78fr)_minmax(500px,1.35fr)]">
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

          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                Leads
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.leadCount}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                AI usage
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.usageCount}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                Users
              </dt>
              <dd className="mt-1 text-xl font-black text-[var(--dash-text)]">
                {business.memberCount}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3">
              <dt className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                Last activity
              </dt>
              <dd className="mt-1 text-sm font-black text-[var(--dash-text)]">
                {formatDate(business.lastActivityAt)}
              </dd>
            </div>
          </dl>

          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 text-sm">
            <p className="font-black text-[var(--dash-text)]">
              {formatSlug(business.publicSlug)}
            </p>
            <p className="mt-1 text-[var(--dash-text-secondary)]">
              Quote link is {business.publicLinkActive ? "active" : "inactive"}.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 text-sm">
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

        <div className="founder-toolbox relative grid gap-3 lg:grid-cols-[150px_minmax(0,1fr)]">
          <input
            className="founder-toolbox-radio founder-toolbox-radio-priority"
            defaultChecked
            id={`${toolboxName}-priority`}
            name={toolboxName}
            type="radio"
          />
          <input
            className="founder-toolbox-radio founder-toolbox-radio-workspace"
            id={`${toolboxName}-workspace`}
            name={toolboxName}
            type="radio"
          />
          <input
            className="founder-toolbox-radio founder-toolbox-radio-audit"
            id={`${toolboxName}-audit`}
            name={toolboxName}
            type="radio"
          />
          <nav className="grid content-start gap-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-1.5">
            <label
              className="founder-toolbox-nav-item founder-toolbox-nav-priority cursor-pointer rounded-md border px-2.5 py-2 text-[12px] font-black"
              htmlFor={`${toolboxName}-priority`}
            >
              Priority
            </label>
            <label
              className="founder-toolbox-nav-item founder-toolbox-nav-workspace cursor-pointer rounded-md border px-2.5 py-2 text-[12px] font-black"
              htmlFor={`${toolboxName}-workspace`}
            >
              Workspace
            </label>
            <label
              className="founder-toolbox-nav-item founder-toolbox-nav-audit cursor-pointer rounded-md border px-2.5 py-2 text-[12px] font-black"
              htmlFor={`${toolboxName}-audit`}
            >
              Cleanup & audit
            </label>
          </nav>
          <div className="min-w-0 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 lg:max-h-[62vh] lg:overflow-y-auto">
          <section className={`founder-toolbox-panel founder-toolbox-panel-priority ${toolboxSectionClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  Priority controls
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Change access, plan, and intake state first.
                </p>
              </div>
              <StatusBadge tone="emerald">Daily use</StatusBadge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
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
                  className={inputClass}
                  name="note"
                  placeholder="Optional access note"
                />
                <button className={`${primaryButtonClass} w-full`} type="submit">
                  Save access
                </button>
              </form>

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
              className={inputClass}
              name="note"
              placeholder="Optional plan note"
            />
            <button className={`${primaryButtonClass} w-full`} type="submit">
              Save plan
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
              className={inputClass}
              name="note"
              placeholder="Optional quote link note"
            />
            <button className={`${primaryButtonClass} w-full`} type="submit">
              Save quote link
            </button>
          </form>
            </div>
          </section>

          <section className={`founder-toolbox-panel founder-toolbox-panel-workspace ${toolboxSectionClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  Workspace tools
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Use these when setup, session, or cleanup state is wrong.
                </p>
              </div>
              <StatusBadge tone="amber">Controlled</StatusBadge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
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
            <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              Mark fake data as Founder test, Demo, or Seed before cleanup.
            </p>
            <input
              className={inputClass}
              name="note"
              placeholder="Why this is safe"
            />
            <button className={`${primaryButtonClass} w-full`} type="submit">
              Save workspace kind
            </button>
          </form>

          <FounderSessionPolicyForm business={business} />
            </div>
          </section>

          <section className={`founder-toolbox-panel founder-toolbox-panel-audit ${toolboxSectionClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  Notes, cleanup, and audit
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Record context, run cleanup, then review the change trail.
                </p>
              </div>
              <StatusBadge tone="red">Sensitive</StatusBadge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
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
            <button className={`${primaryButtonClass} w-full`} type="submit">
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

          <FounderSystemChangeLog actions={business.actionLog} />
            </div>
          </section>
          </div>
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
    <DashboardCard className="space-y-4 p-4 sm:p-5" variant="elevated">
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

      <details className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)]">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="text-sm font-black text-[var(--dash-text)]">
              Work queues
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              Start with risk and recovery queues, then search inside the result.
            </p>
          </div>
          <StatusBadge tone="blue">
            Showing up to {usersPageSize} users per page
          </StatusBadge>
        </summary>

        <div className="grid gap-3 border-t border-[var(--dash-border)] p-3 xl:grid-cols-[1.2fr_1fr_1.15fr]">
          {userPriorityGroups.map((group) => (
            <div className="min-w-0 space-y-2" key={group.title}>
              <p className="text-[12px] font-black uppercase text-[var(--dash-text-muted)]">
                {group.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
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
                    <span className="text-[12px] text-[var(--dash-text-muted)]">
                      {priorityCount(users, option.value)} loaded
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>

      <form
        className="grid gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 lg:grid-cols-[minmax(260px,1fr)_120px_168px_168px_auto] lg:items-end"
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
          <Link
            className={buttonClass}
            href={adminUsersHref(params, {
              userAccess: undefined,
              userConfirmed: undefined,
              userPage: "1",
              userPriority: undefined,
              userQuery: undefined,
            })}
          >
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
            const accountToolboxName = `account-toolbox-${user.userId}`;

            return (
            <details
              className="group overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[0_10px_26px_rgba(15,23,42,0.05)]"
              key={user.userId}
            >
              <summary className="grid cursor-pointer list-none gap-3 px-4 py-3 text-sm transition hover:bg-[var(--dash-surface-muted)] xl:grid-cols-[minmax(240px,1.08fr)_minmax(210px,0.85fr)_minmax(220px,1fr)_90px] xl:items-center">
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

              <span className="justify-self-start rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-[11px] font-black text-[var(--dash-text-secondary)] group-open:border-[var(--dash-primary)] group-open:bg-[var(--dash-primary-soft)] group-open:text-[var(--dash-text)] xl:justify-self-end">
                Modify
              </span>
              </summary>

              <div className="grid gap-4 border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
                <dl className="grid gap-2 text-[12px] sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">Leads</dt>
                    <dd className="mt-0.5 font-black text-[var(--dash-text)]">
                      {user.leadCount ?? "-"}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">Last sign-in</dt>
                    <dd className="mt-0.5 font-black text-[var(--dash-text)]">
                      {formatDate(user.lastSignInAt)}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">User ID</dt>
                    <dd className="mt-0.5 truncate font-black text-[var(--dash-text)]">
                      {user.userId}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">Phone</dt>
                    <dd className="mt-0.5 truncate font-black text-[var(--dash-text)]">
                      {formatContactValue(user.phone)}
                    </dd>
                  </div>
                </dl>
                <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
                  <p className="text-sm font-black text-[var(--dash-text)]">
                    Founder toolbox
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    Work from top to bottom: priority controls, workspace tools,
                    account tools, then destructive cleanup.
                  </p>
                </div>
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
                <section className={`${toolboxSectionClass} founder-toolbox relative lg:grid-cols-[180px_minmax(0,1fr)]`}>
                  <input
                    className="founder-toolbox-radio founder-toolbox-radio-password"
                    defaultChecked
                    id={`${accountToolboxName}-password`}
                    name={accountToolboxName}
                    type="radio"
                  />
                  <input
                    className="founder-toolbox-radio founder-toolbox-radio-auth-delete"
                    id={`${accountToolboxName}-auth-delete`}
                    name={accountToolboxName}
                    type="radio"
                  />
                  <div className="flex flex-wrap items-start justify-between gap-2 lg:col-span-2">
                    <div>
                      <p className="text-sm font-black text-[var(--dash-text)]">
                        Account tools
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                        Password help stays separate from destructive auth cleanup.
                      </p>
                    </div>
                    <StatusBadge tone="blue">Identity</StatusBadge>
                  </div>
                  <nav className="grid content-start gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2">
                    <label
                      className="founder-toolbox-nav-item founder-toolbox-nav-password cursor-pointer rounded-lg border px-3 py-2 text-[12px] font-black"
                      htmlFor={`${accountToolboxName}-password`}
                    >
                      Passwords
                    </label>
                    <label
                      className="founder-toolbox-nav-item founder-toolbox-nav-auth-delete cursor-pointer rounded-lg border px-3 py-2 text-[12px] font-black"
                      htmlFor={`${accountToolboxName}-auth-delete`}
                    >
                      Auth deletion
                    </label>
                  </nav>
                  <div className="min-w-0 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 lg:max-h-[58vh] lg:overflow-y-auto">
                    <div className="founder-toolbox-panel founder-toolbox-panel-password">
                      <FounderPasswordControls user={user} />
                    </div>
                    <div className="founder-toolbox-panel founder-toolbox-panel-auth-delete">
                      <FounderAuthUserDeleteForm
                        deletionBlockedReason={user.authDeletionBlockedReason}
                        targetEmail={user.authEmail}
                        targetUserId={user.userId}
                      />
                    </div>
                  </div>
                </section>
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
            : `Showing ${shownUsers.length} user(s) on this page. Use search or Next for more.`}
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

function FounderInboxSection({
  items,
}: Readonly<{
  items: ReadonlyArray<{
    businessName: string;
    cityOrServiceArea: string | null;
    createdAt: string;
    customerContact: string | null;
    customerName: string | null;
    leadId: string;
    serviceType: string | null;
    sourceChannel: string | null;
    sourceReferrer: string | null;
    status: string;
  }>;
}>) {
  return (
    <DashboardCard className="space-y-4 p-4 sm:p-5" variant="priority">
      <SectionHeader
        action={<StatusBadge tone="blue">{items.length}</StatusBadge>}
        description="Incoming user quote messages for founder triage. Review, archive, or permanently delete spam/test submissions."
        title="Admin inbox"
      />
      <div className="space-y-3">
        {items.length > 0 ? (
          items.slice(0, 30).map((item) => (
            <details
              className="overflow-hidden rounded-[16px] border border-[var(--dash-border)] bg-[var(--dash-surface)]"
              key={item.leadId}
            >
              <summary className="grid cursor-pointer list-none gap-3 px-4 py-3 hover:bg-[var(--dash-surface-muted)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-black text-[var(--dash-text)]">
                    {item.customerName ?? "Unknown sender"}
                  </p>
                  <StatusBadge tone={leadStatusTone(item.status)}>
                    {item.status.replaceAll("_", " ")}
                  </StatusBadge>
                </div>
                <p className="text-[12px] text-[var(--dash-text-secondary)]">
                  {item.businessName} | {formatDateTime(item.createdAt)}
                </p>
                <p className="truncate text-[12px] text-[var(--dash-text-muted)]">
                  {item.serviceType ?? "Service not set"} | {item.cityOrServiceArea ?? "Area not set"}
                </p>
              </summary>
              <div className="grid gap-3 border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
                <div className="grid gap-1 text-[12px] text-[var(--dash-text-secondary)]">
                  <p>
                    <span className="font-black text-[var(--dash-text)]">Contact:</span>{" "}
                    {formatContactValue(item.customerContact)}
                  </p>
                  <p>
                    <span className="font-black text-[var(--dash-text)]">Source:</span>{" "}
                    {item.sourceChannel ?? "unknown"}
                  </p>
                  <p>
                    <span className="font-black text-[var(--dash-text)]">Referrer:</span>{" "}
                    {item.sourceReferrer ?? "none"}
                  </p>
                  <p>
                    <span className="font-black text-[var(--dash-text)]">Lead ID:</span> {item.leadId}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action={founderInboxLeadStatusAction}>
                    <input name="leadId" type="hidden" value={item.leadId} />
                    <input name="status" type="hidden" value="reviewed" />
                    <button className={buttonClass} type="submit">
                      Mark reviewed
                    </button>
                  </form>
                  <form action={founderInboxLeadStatusAction}>
                    <input name="leadId" type="hidden" value={item.leadId} />
                    <input name="status" type="hidden" value="archived" />
                    <button className={buttonClass} type="submit">
                      Archive
                    </button>
                  </form>
                </div>

                <form
                  action={founderInboxLeadDeleteAction}
                  className="grid gap-2 rounded-lg border border-[var(--dash-danger-border)] bg-[var(--dash-danger-soft)] p-3"
                >
                  <input name="leadId" type="hidden" value={item.leadId} />
                  <p className="text-[12px] font-black text-[var(--dash-danger-strong)]">
                    Permanent delete (cannot be undone)
                  </p>
                  <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                    Type Lead ID to confirm
                    <input className={inputClass} name="leadConfirmation" placeholder={item.leadId} />
                  </label>
                  <label className="flex items-center gap-2 text-[12px] font-bold text-[var(--dash-text)]">
                    <input className="h-4 w-4" name="deleteAcknowledgement" type="checkbox" />
                    I understand this delete is permanent.
                  </label>
                  <button className={primaryButtonClass} type="submit">
                    Delete permanently
                  </button>
                </form>
              </div>
            </details>
          ))
        ) : (
          <p className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-5 text-sm text-[var(--dash-text-secondary)]">
            No inbox items yet.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

function FounderRecentActionsPanel({
  actions,
}: Readonly<{
  actions: ReadonlyArray<{
    actionType: string;
    businessId: string | null;
    createdAt: string;
    note: string | null;
  }>;
}>) {
  return (
    <DashboardCard className="p-3" variant="priority">
      <details>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--dash-text)]">
              Recent admin actions
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-[var(--dash-text-secondary)]">
              Service-role writes after founder authorization.
            </p>
          </div>
          <StatusBadge tone="blue">{actions.length}</StatusBadge>
        </summary>
        <div className="mt-3 divide-y divide-[var(--dash-border)] overflow-hidden rounded-lg border border-[var(--dash-border)]">
          {actions.length > 0 ? (
            actions.map((action) => (
              <div
                className="grid gap-1 bg-[var(--dash-surface-muted)] px-3 py-2.5 text-[12px]"
                key={`${action.createdAt}-${action.actionType}-${action.businessId ?? "none"}`}
              >
                <span className="font-black text-[var(--dash-text)]">
                  {adminActionLabels[action.actionType] ??
                    humanizeAdminKey(action.actionType)}
                </span>
                <span className="truncate text-[var(--dash-text-secondary)]">
                  {action.note ?? action.businessId ?? "No note"}
                </span>
                <span className="font-bold text-[var(--dash-text-muted)]">
                  {formatDateTime(action.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <p className="bg-[var(--dash-surface-muted)] px-3 py-4 text-center text-[12px] text-[var(--dash-text-secondary)]">
              No admin actions logged yet.
            </p>
          )}
        </div>
      </details>
    </DashboardCard>
  );
}

function FounderAdminToolRail({
  activePanel,
  healthNeedsAttention,
  params,
  totals,
  usersTotal,
}: Readonly<{
  activePanel: AdminPanel;
  healthNeedsAttention: boolean;
  params: AdminSearchParams;
  totals: {
    activePilots: number;
    paymentReady: number;
    suspended: number;
  };
  usersTotal: number;
}>) {
  const items: ReadonlyArray<{
    count?: number;
    description: string;
    label: string;
    panel: AdminPanel;
    tone?: "amber" | "blue" | "emerald" | "red";
  }> = [
    {
      count: usersTotal,
      description: "Search, repair, plan, access, and deletion tools.",
      label: "Users",
      panel: "users",
      tone: "blue",
    },
    {
      description: "Supabase, service key, auth, and table readiness.",
      label: "Production health",
      panel: "health",
      tone: healthNeedsAttention ? "red" : "emerald",
    },
    {
      description: "Lead inbox cleanup and intake state controls.",
      label: "Leads",
      panel: "leads",
      tone: "emerald",
    },
    {
      description: "Founder write log and recent admin operations.",
      label: "Activity log",
      panel: "activity",
      tone: "amber",
    },
    {
      description: "Destructive-action guards and deletion rules.",
      label: "Safety",
      panel: "safety",
      tone: "red",
    },
  ];

  return (
    <aside className="sticky top-3 h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-2 shadow-sm">
      <div className="mb-1 px-2 py-2">
        <p className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
          Tools
        </p>
        <p className="mt-1 hidden text-[12px] leading-5 text-[var(--dash-text-secondary)] 2xl:block">
          Pick one tool; the workspace opens in the main panel.
        </p>
      </div>

      <nav className="grid gap-1">
        {items.map((item) => {
          const active = activePanel === item.panel;

          return (
            <Link
              className={[
                "grid gap-1 rounded-lg border px-2.5 py-2 text-left transition",
                active
                  ? "border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] text-[var(--dash-text)] shadow-sm"
                  : "border-transparent text-[var(--dash-text-secondary)] hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]",
              ].join(" ")}
              href={adminUsersHref(params, { adminPanel: item.panel })}
              key={item.panel}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-black">{item.label}</span>
                {item.count !== undefined ? (
                  <StatusBadge tone={item.tone ?? "neutral"}>{item.count}</StatusBadge>
                ) : (
                  <StatusBadge tone={item.tone ?? "neutral"}>
                    {item.panel === "health" && healthNeedsAttention ? "Check" : "Open"}
                  </StatusBadge>
                )}
              </span>
              <span className="hidden text-[11px] leading-4 text-[var(--dash-text-secondary)] 2xl:block">
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 grid gap-1.5">
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2 py-2">
          <p className="truncate text-[10px] font-black uppercase text-[var(--dash-text-muted)]">
            Active
          </p>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {totals.activePilots}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2 py-2">
          <p className="truncate text-[10px] font-black uppercase text-[var(--dash-text-muted)]">
            Paid-ready
          </p>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {totals.paymentReady}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2 py-2">
          <p className="truncate text-[10px] font-black uppercase text-[var(--dash-text-muted)]">
            Paused
          </p>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {totals.suspended}
          </p>
        </div>
      </div>
    </aside>
  );
}

function FounderAdminMetricsPanel({
  totals,
  usersTotal,
}: Readonly<{
  totals: {
    activePilots: number;
    paymentReady: number;
    suspended: number;
  };
  usersTotal: number;
}>) {
  return (
    <DashboardCard className="p-4 sm:p-5" variant="elevated">
      <SectionHeader
        description="High-level counts stay here as a compact snapshot instead of occupying the workspace."
        title="Workspace snapshot"
      />
      <section className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail="Auth users available through paged founder search."
          label="Auth users"
          tone="blue"
          value={usersTotal}
        />
        <MetricCard
          detail="Onboarding or active businesses."
          label="Active pilots"
          tone="emerald"
          value={totals.activePilots}
        />
        <MetricCard
          detail="Starter or Pro manual plans."
          label="Payment-ready"
          tone="amber"
          value={totals.paymentReady}
        />
        <MetricCard
          detail="Suspended or cancelled access."
          label="Paused access"
          tone="red"
          value={totals.suspended}
        />
      </section>
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
  const activePanel = readAdminPanel(params.adminPanel);
  const cookieStore = await cookies();
  const initialTheme =
    cookieStore.get("bizpilot-dashboard-theme")?.value === "dark" ? "dark" : "light";
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
  const productionHealthNeedsAttention = isProductionHealthUnhealthy(productionHealth);

  return (
    <FounderAdminThemeFrame initialTheme={initialTheme}>
      <div className="mx-auto max-w-[1440px] space-y-3">
        <DashboardCard className="p-4" variant="priority">
          <PageHeader
            actions={
              <div className="flex flex-wrap gap-2">
                <FounderAdminThemeSelector />
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

        <div className="grid min-w-0 grid-cols-[210px_minmax(0,1fr)] gap-3">
          <FounderAdminToolRail
            activePanel={activePanel}
            healthNeedsAttention={productionHealthNeedsAttention}
            params={params}
            totals={overview.totals}
            usersTotal={overview.usersTotal}
          />

          <main className="min-w-0 max-h-[calc(100dvh-9.5rem)] overflow-y-auto pr-1">
            {activePanel === "users" ? (
              <FounderUsersSection
                businessById={businessById}
                dryRun={dryRun}
                params={params}
                shownUsers={shownUsers}
                users={overview.users}
                usersLastPage={overview.usersLastPage}
                usersPage={usersPage}
                usersPageSize={usersPageSize}
                usersSearchMode={overview.usersSearchMode}
                usersTotal={overview.usersTotal}
              />
            ) : null}

            {activePanel === "health" ? (
              <div className="space-y-3">
                {productionHealthNeedsAttention ? (
                  <AdminNotice tone="error">
                    Founder data may be incomplete because one or more production
                    runtime checks failed. Treat zero users or zero businesses as
                    diagnostic until this panel is clean.
                  </AdminNotice>
                ) : null}
                <FounderProductionHealthPanel health={productionHealth} />
                <FounderAdminMetricsPanel
                  totals={overview.totals}
                  usersTotal={overview.usersTotal}
                />
              </div>
            ) : null}

            {activePanel === "leads" ? (
              <FounderInboxSection items={overview.leadInbox} />
            ) : null}

            {activePanel === "activity" ? (
              <FounderRecentActionsPanel actions={overview.recentActions} />
            ) : null}

            {activePanel === "safety" ? <FounderAdminSafetyRail /> : null}
          </main>
        </div>
      </div>
    </FounderAdminThemeFrame>
  );
}
