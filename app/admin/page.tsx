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
 * Last Updated: 2026-06-27
 * Change Log:
 * - 2026-05-26: Moved production health ahead of data grids so empty admin data is tied to safe runtime diagnostics.
 * - 2026-06-18: Updated founder access fallback to svh/clip frame for responsive hardening.
 * - 2026-06-19: Read the shared theme preference cookie while preserving legacy dashboard theme fallback.
 * - 2026-06-27: Added panel headings and loosened dense admin control grids.
 * - 2026-06-27: Split business-selection URLs from user paging/filter URLs.
 * - 2026-06-27: Promoted Users as the default admin control lane and made business routes explicit.
 * - 2026-06-27: Sanitized admin route flash messages before rendering.
 * - 2026-06-27: Reordered Users into a search-first founder operations cockpit.
 * - 2026-06-27: Added search-driven 10-row business rail and V3 priority workspace tiles.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  FounderAdminThemeFrame,
  FounderAdminThemeSelector,
} from "@/components/admin/founder-admin-theme";
import { FounderAuthUserDeleteForm } from "@/components/admin/founder-auth-user-delete-form";
import { FounderTestCleanupForm } from "@/components/admin/founder-test-cleanup-form";
import { FlashMessage } from "@/components/dashboard/flash-message";
import {
  buttonClass,
  DashboardCard,
  disabledButtonClass,
  inputClass,
  MetricCard,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { readThemePreference } from "@/lib/theme";
import { languageLabels } from "@/lib/i18n/language";
import { readSafeRouteFlashMessage } from "@/lib/i18n/route-messages";
import {
  founderInboxLeadDeleteAction,
  founderInboxLeadStatusAction,
  founderPasswordResetAction,
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
  type FounderAdminOverview,
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
  businessId?: string | undefined;
  businessQuery?: string | undefined;
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

type AdminPanel =
  | "activity"
  | "businesses"
  | "health"
  | "leads"
  | "overview"
  | "users";

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
  "grid min-w-0 max-w-full gap-3 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 sm:p-3.5 shadow-sm";
const toolboxSectionClass =
  "grid min-w-0 max-w-full gap-3 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:p-3.5";

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

function daysSince(value: string): number | null {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
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

  return "blue";
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

  if (planSlug === "starter" || planSlug === "founder_pilot") {
    return "blue";
  }

  return "neutral";
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
    value === "overview" ||
    value === "businesses" ||
    value === "users" ||
    value === "health" ||
    value === "leads" ||
    value === "activity"
  ) {
    return value;
  }

  return "overview";
}

function matchesQuery(values: ReadonlyArray<string | null | undefined>, query: string) {
  if (!query) {
    return true;
  }

  return values.some((value) => normalizeSearch(value).includes(query));
}

function matchesBusinessQuery(
  business: FounderAdminBusiness,
  query: string,
): boolean {
  return matchesQuery(
    [
      business.name,
      business.ownerEmail,
      business.slug,
      business.publicSlug,
      business.status,
      business.planSlug,
      business.workspaceKind,
    ],
    query,
  );
}

function limitedBusinessRows(
  businesses: FounderAdminBusiness[],
  selectedBusiness: FounderAdminBusiness | null,
): FounderAdminBusiness[] {
  const selectedRows = selectedBusiness ? [selectedBusiness] : [];

  return [
    ...selectedRows,
    ...businesses.filter(
      (business) => business.businessId !== selectedBusiness?.businessId,
    ),
  ].slice(0, 10);
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

function adminBusinessHref(
  params: AdminSearchParams,
  updates: Partial<
    Pick<
      AdminSearchParams,
      "businessId" | "businessQuery" | "cleanupBusinessId"
    >
  >,
): string {
  const merged: Pick<
    AdminSearchParams,
    "adminPanel" | "businessId" | "businessQuery" | "cleanupBusinessId"
  > = {
    adminPanel: "businesses",
    businessId: params.businessId,
    businessQuery: params.businessQuery,
    cleanupBusinessId: params.cleanupBusinessId,
    ...updates,
  };
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value) {
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
      className="rounded-lg border px-4 py-3 text-sm font-semibold"
      style={style}
    >
      {children}
    </p>
  );
}

function FounderAdminSafetyRail() {
  return (
    <details className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] p-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span className="text-[12px] font-black text-[var(--dash-text)]">
          Cleanup safety
        </span>
        <StatusBadge tone="amber">Guarded</StatusBadge>
      </summary>
      <div className="mt-3 grid gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-2.5">
          <p className="font-black text-[var(--dash-text)]">
            Production customer is locked
          </p>
          <p className="mt-1">
            Hard cleanup and fake/test login deletion are blocked for production
            customer workspaces and owner accounts.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-2.5">
          <p className="font-black text-[var(--dash-text)]">
            Dry-run comes first
          </p>
          <p className="mt-1">
            Test/demo cleanup requires counts, acknowledgement, and exact
            business name or slug confirmation.
          </p>
        </div>
      </div>
    </details>
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
      className="biz-founder-admin min-h-svh overflow-x-clip px-5 py-7 text-[var(--dash-text)] sm:px-6"
    >
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-[720px] items-center">
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
        Save policy
      </button>
    </form>
  );
}

function FounderSystemChangeLog({
  actions,
}: Readonly<{ actions: FounderAdminActionSummary[] }>) {
  return (
    <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] md:col-span-2">
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

      <div className="mt-4 divide-y divide-[var(--dash-border)] overflow-hidden rounded-lg border border-[var(--dash-border)]">
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

function quoteLinkTone(active: boolean): "amber" | "emerald" {
  return active ? "emerald" : "amber";
}

function latestAction(
  actions: FounderAdminActionSummary[],
  actionTypes: ReadonlyArray<string>,
): FounderAdminActionSummary | null {
  return actions.find((action) => actionTypes.includes(action.actionType)) ?? null;
}

function controlAuditText(
  actions: FounderAdminActionSummary[],
  actionTypes: ReadonlyArray<string>,
): { updatedAt: string; updatedBy: string } {
  const action = latestAction(actions, actionTypes);

  return {
    updatedAt: action ? formatDateTime(action.createdAt) : "Not recorded yet",
    updatedBy: "Founder Admin",
  };
}

function recommendedPriorityAction(business: FounderAdminBusiness): {
  tone: "amber" | "blue" | "emerald" | "red";
  text: string;
} {
  if (business.status === "suspended" || business.status === "cancelled") {
    return {
      tone: "red",
      text: "Customer and public access should stay blocked until the account is intentionally restored.",
    };
  }

  if (business.status === "onboarding" && !business.publicLinkActive) {
    return {
      tone: "blue",
      text: "Keep the public quote form inactive until onboarding is complete and the customer is ready.",
    };
  }

  if (business.status === "active" && !business.publicLinkActive) {
    return {
      tone: "amber",
      text: "Activate the public quote link so the customer can receive new leads.",
    };
  }

  return {
    tone: "emerald",
    text: "Business is ready for daily use.",
  };
}

function sortBusinessesByOperationalPriority(
  businesses: FounderAdminBusiness[],
): FounderAdminBusiness[] {
  const rank: Record<BusinessStatus, number> = {
    suspended: 0,
    onboarding: 1,
    active: 2,
    cancelled: 3,
  };

  return [...businesses].sort((left, right) => {
    const rankDelta = rank[left.status] - rank[right.status];

    if (rankDelta !== 0) {
      return rankDelta;
    }

    return left.name.localeCompare(right.name);
  });
}

function controlIconClass(tone: "amber" | "blue" | "emerald" | "neutral" | "red") {
  const toneClass: Record<typeof tone, string> = {
    amber:
      "border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] text-[var(--dash-warning-strong)]",
    blue:
      "border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] text-[var(--dash-primary-strong)]",
    emerald:
      "border-[var(--dash-success-border)] bg-[var(--dash-success-soft)] text-[var(--dash-success-strong)]",
    neutral:
      "border-[var(--dash-border)] bg-[var(--dash-surface-muted)] text-[var(--dash-text-secondary)]",
    red:
      "border-[var(--dash-danger-border)] bg-[var(--dash-danger-soft)] text-[var(--dash-danger-strong)]",
  };

  return `inline-grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-black ${toneClass[tone]}`;
}

function MiniControlIcon({
  children,
  tone,
}: Readonly<{
  children: React.ReactNode;
  tone: "amber" | "blue" | "emerald" | "neutral" | "red";
}>) {
  return <span className={controlIconClass(tone)}>{children}</span>;
}

function ControlAuditMeta({
  audit,
}: Readonly<{ audit: { updatedAt: string; updatedBy: string } }>) {
  return (
    <div className="grid gap-1 text-[11px] font-bold text-[var(--dash-text-muted)] sm:grid-cols-2">
      <p>Last updated: {audit.updatedAt}</p>
      <p className="sm:text-right">Updated by: {audit.updatedBy}</p>
    </div>
  );
}

function SnapshotTile({
  description,
  label,
  tone,
  value,
}: Readonly<{
  description: string;
  label: string;
  tone: "amber" | "blue" | "emerald" | "neutral" | "red";
  value: string;
}>) {
  return (
    <div className="min-h-[112px] rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-black leading-4 text-[var(--dash-text)]">
            {label}
          </p>
          <p className="mt-1 break-words text-base font-black leading-5 text-[var(--dash-text)]">
            {value}
          </p>
        </div>
        <MiniControlIcon tone={tone}>{label.charAt(0)}</MiniControlIcon>
      </div>
      <p className="mt-3 text-[12px] font-semibold leading-5 text-[var(--dash-text-secondary)]">
        {description}
      </p>
    </div>
  );
}

function RecentAdminChangesPanel({
  actions,
}: Readonly<{ actions: FounderAdminActionSummary[] }>) {
  return (
    <section className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Recent admin changes
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Founder/admin action trail for support verification.
          </p>
        </div>
        <StatusBadge tone="blue">{actions.length} logged</StatusBadge>
      </div>
      <div className="mt-4 grid gap-2">
        {actions.length > 0 ? (
          actions.slice(0, 4).map((action) => (
            <div
              className="grid gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5 text-[12px]"
              key={action.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-black text-[var(--dash-text)]">
                    {adminActionLabels[action.actionType] ??
                      humanizeAdminKey(action.actionType)}
                  </p>
                  <p className="mt-1 truncate font-semibold text-[var(--dash-text-secondary)]">
                    {formatActionChange(action)}
                  </p>
                </div>
                <p className="shrink-0 text-right font-bold text-[var(--dash-text-muted)]">
                  {formatDate(action.createdAt)}
                </p>
              </div>
              <p className="truncate font-bold text-[var(--dash-text-muted)]">
                trace_{shortActionId(action.id)}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-6 text-center text-[12px] text-[var(--dash-text-secondary)]">
            No admin changes recorded yet.
          </p>
        )}
      </div>
      <Link className={`${buttonClass} mt-4 w-full justify-center`} href="/admin?adminPanel=activity">
        View full activity log
      </Link>
    </section>
  );
}

function FounderBusinessMasterRail({
  businesses,
  params,
  selectedBusinessId,
}: Readonly<{
  businesses: FounderAdminBusiness[];
  params: AdminSearchParams;
  selectedBusinessId: string | null;
}>) {
  const businessQuery = params.businessQuery?.trim() ?? "";
  const normalizedBusinessQuery = normalizeSearch(businessQuery);
  const filteredBusinesses = businesses.filter((business) =>
    matchesBusinessQuery(business, normalizedBusinessQuery),
  );
  const selectedBusiness =
    businesses.find((business) => business.businessId === selectedBusinessId) ??
    null;
  const visibleBusinesses = limitedBusinessRows(
    filteredBusinesses,
    selectedBusiness,
  );
  const hiddenMatchCount = Math.max(
    filteredBusinesses.length -
      visibleBusinesses.filter((business) =>
        filteredBusinesses.some(
          (filtered) => filtered.businessId === business.businessId,
        ),
      ).length,
    0,
  );

  return (
    <aside className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 shadow-sm xl:sticky xl:top-[5.75rem]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Businesses
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Select one workspace; edit it in the detail panel.
          </p>
        </div>
        <StatusBadge tone="blue">
          {visibleBusinesses.length} / {businesses.length}
        </StatusBadge>
      </div>

      <form
        className="mt-3 grid gap-2 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-2.5"
        method="get"
      >
        <input name="adminPanel" type="hidden" value="businesses" />
        {selectedBusinessId ? (
          <input name="businessId" type="hidden" value={selectedBusinessId} />
        ) : null}
        <label className="grid gap-1 text-[12px] font-black text-[var(--dash-text)]">
          Search businesses
          <input
            className={inputClass}
            defaultValue={businessQuery}
            name="businessQuery"
            placeholder="Business, owner, slug"
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <button className={`${primaryButtonClass} min-h-9`} type="submit">
            Search
          </button>
          <Link
            className={`${buttonClass} min-h-9 justify-center`}
            href={adminBusinessHref(params, { businessQuery: undefined })}
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="mt-3 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
        {visibleBusinesses.length > 0 ? (
          visibleBusinesses.map((business) => {
          const selected = business.businessId === selectedBusinessId;
          const leadBlocked =
            business.status !== "active" || !business.publicLinkActive;

          return (
            <Link
              className={[
                "grid min-w-0 gap-2 rounded-lg border px-3 py-3 text-left transition",
                selected
                  ? "border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] shadow-sm"
                  : "border-[var(--dash-border)] bg-[var(--dash-surface-muted)] hover:border-[var(--dash-primary-border)] hover:bg-[var(--dash-surface)]",
              ].join(" ")}
              href={adminBusinessHref(params, {
                businessId: business.businessId,
              })}
              key={business.businessId}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[var(--dash-text)]">
                  {business.name}
                </p>
                <p className="mt-1 truncate text-[11px] font-bold text-[var(--dash-text-muted)]">
                  {business.ownerEmail}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge tone={statusTone(business.status)}>
                  {statusLabels[business.status]}
                </StatusBadge>
                <StatusBadge tone={planTone(business.planSlug)}>
                  {planLabels[business.planSlug]}
                </StatusBadge>
                <StatusBadge tone={leadBlocked ? "amber" : "emerald"}>
                  {leadBlocked ? "Intake off" : "Intake open"}
                </StatusBadge>
              </div>
            </Link>
          );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-5 text-center text-[12px] font-semibold leading-5 text-[var(--dash-text-secondary)]">
            No businesses match this search.
          </p>
        )}
      </div>
      {hiddenMatchCount > 0 ? (
        <p className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          Showing the first 10 matched workspaces. Search by owner, business,
          or slug to narrow the list.
        </p>
      ) : null}
      {selectedBusiness &&
      normalizedBusinessQuery &&
      !filteredBusinesses.some(
        (business) => business.businessId === selectedBusiness.businessId,
      ) ? (
        <p className="mt-3 rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          Selected workspace stays visible even when it does not match the
          current search.
        </p>
      ) : null}
    </aside>
  );
}

function BusinessControlCard({
  business,
  dryRun,
}: Readonly<{
  business: FounderAdminBusiness;
  dryRun?: FounderCleanupDryRun | null;
}>) {
  const accessAudit = controlAuditText(business.actionLog, [
    "status_changed",
    "business_reactivated",
    "business_suspended",
    "business_cancelled",
  ]);
  const planAudit = controlAuditText(business.actionLog, ["plan_changed"]);
  const quoteAudit = controlAuditText(business.actionLog, [
    "quote_link_disabled",
    "quote_link_enabled",
  ]);
  const recommendation = recommendedPriorityAction(business);
  const recentPriorityActions = business.actionLog.filter((action) =>
    [
      "status_changed",
      "business_reactivated",
      "business_suspended",
      "business_cancelled",
      "plan_changed",
      "quote_link_disabled",
      "quote_link_enabled",
    ].includes(action.actionType),
  );
  const latestAdminChange = business.actionLog[0]
    ? formatDateTime(business.actionLog[0].createdAt)
    : "No admin changes recorded yet";

  return (
    <div className="grid min-w-0 max-w-full gap-3">
      <section className="min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:p-3.5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--dash-text)]">
              Business snapshot
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              Operational summary at a glance for {business.name}.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusBadge tone="neutral">{business.ownerEmail}</StatusBadge>
              <StatusBadge tone="blue">{formatSlug(business.publicSlug)}</StatusBadge>
              <StatusBadge
                tone={
                  business.workspaceKind === "production_customer"
                    ? "neutral"
                    : "amber"
                }
              >
                {workspaceKindLabels[business.workspaceKind]}
              </StatusBadge>
              <StatusBadge
                tone={
                  business.sessionTimeoutMode === "always_on"
                    ? "emerald"
                    : "amber"
                }
              >
                {sessionPolicyLabel(
                  business.sessionTimeoutMode,
                  business.sessionTimeoutMinutes,
                )}
              </StatusBadge>
            </div>
          </div>
          <Link className={buttonClass} href="/dashboard/business-profile">
            View full customer profile
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <SnapshotTile
            description={
              business.status === "active"
                ? "Customer has daily dashboard access."
                : "Limited dashboard access and lifecycle readiness."
            }
            label="Access status"
            tone={statusTone(business.status)}
            value={statusLabels[business.status]}
          />
          <SnapshotTile
            description={
              business.publicLinkActive
                ? "Public quote form can accept new leads."
                : "Public quote form is blocked. No new leads can enter."
            }
            label="Quote link"
            tone={quoteLinkTone(business.publicLinkActive)}
            value={business.publicLinkActive ? "Active" : "Inactive"}
          />
          <SnapshotTile
            description="Plan is founder controlled. Customer cannot change plan."
            label="Plan"
            tone={planTone(business.planSlug)}
            value={planLabels[business.planSlug]}
          />
          <SnapshotTile
            description={
              business.sessionTimeoutMode === "always_on"
                ? "Customer access stays active until sign-out."
                : "Customer sessions expire after the selected duration."
            }
            label="Session policy"
            tone={business.sessionTimeoutMode === "always_on" ? "emerald" : "amber"}
            value={sessionPolicyLabel(
              business.sessionTimeoutMode,
              business.sessionTimeoutMinutes,
            )}
          />
          <SnapshotTile
            description={latestAdminChange}
            label="Audit events"
            tone={business.actionLog.length > 0 ? "blue" : "neutral"}
            value={`${business.actionLog.length} logged`}
          />
        </div>
      </section>

      <section className={toolboxSectionClass}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-black text-[var(--dash-text)]">
              1) Priority controls
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              Change access, plan, and intake state first.
            </p>
          </div>
          <StatusBadge
            tone={business.status === "active" ? "emerald" : statusTone(business.status)}
          >
            {business.status === "active" ? "Daily use" : statusLabels[business.status]}
          </StatusBadge>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_280px]">
          <div className="grid gap-2">
            <form action={updateFounderStatusAction} className={controlPanelClass}>
                <input name="businessId" type="hidden" value={business.businessId} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <MiniControlIcon tone={statusTone(business.status)}>U</MiniControlIcon>
                    <p className="text-sm font-black text-[var(--dash-text)]">
                      Access status
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      Controls sign-in eligibility, dashboard access, and the customer lifecycle state shown to founder operations.
                    </p>
                  </div>
                  <StatusBadge tone={statusTone(business.status)}>
                    {statusLabels[business.status]}
                  </StatusBadge>
                </div>
                <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
                  Change access to
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
                <p className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Suspended or cancelled states block customer-facing access. Use them only when the account should stop operating.
                </p>
                <input
                  className={inputClass}
                  name="note"
                  placeholder="Optional access note"
                />
                <ControlAuditMeta audit={accessAudit} />
                <button className={`${primaryButtonClass} w-full`} type="submit">
                  Save access
                </button>
              </form>
            <p className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-primary-strong)]">
              Onboarding restricts full access until setup is complete.
            </p>
          </div>

          <div className="grid gap-2">
            <form action={updateFounderPlanAction} className={controlPanelClass}>
                <input name="businessId" type="hidden" value={business.businessId} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <MiniControlIcon tone={planTone(business.planSlug)}>P</MiniControlIcon>
                    <p className="text-sm font-black text-[var(--dash-text)]">
                      Plan
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      Founder/admin controlled billing tier. Customers should not self-change this state from their dashboard.
                    </p>
                  </div>
                  <StatusBadge tone={planTone(business.planSlug)}>
                    {planLabels[business.planSlug]}
                  </StatusBadge>
                </div>
                <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
                  Change plan to
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
                <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Plan changes affect founder reporting and manual billing readiness. Record why the customer is moving tiers.
                </p>
                <input
                  className={inputClass}
                  name="note"
                  placeholder="Optional plan note"
                />
                <ControlAuditMeta audit={planAudit} />
                <button className={`${primaryButtonClass} w-full`} type="submit">
                  Save plan
                </button>
              </form>
            <p className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-primary-strong)]">
              Pilot plan limits usage and supports controlled rollout.
            </p>
          </div>

          <div className="grid gap-2">
            <form action={updateFounderQuoteLinkAction} className={controlPanelClass}>
                <input name="businessId" type="hidden" value={business.businessId} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <MiniControlIcon tone={quoteLinkTone(business.publicLinkActive)}>Q</MiniControlIcon>
                    <p className="text-sm font-black text-[var(--dash-text)]">
                      Public quote link
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      Controls whether the public quote form can accept new leads for this customer.
                    </p>
                  </div>
                  <StatusBadge tone={quoteLinkTone(business.publicLinkActive)}>
                    {business.publicLinkActive ? "Active" : "Inactive"}
                  </StatusBadge>
                </div>
                <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
                  Change quote link to
                  <select
                    className={inputClass}
                    defaultValue={business.publicLinkActive ? "true" : "false"}
                    name="quoteLinkActive"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </label>
                <p className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  If inactive, the public quote form is blocked and the customer cannot receive new leads from the public intake page.
                </p>
                <input
                  className={inputClass}
                  name="note"
                  placeholder="Optional quote link note"
                />
                <ControlAuditMeta audit={quoteAudit} />
                <button className={`${primaryButtonClass} w-full`} type="submit">
                  Save quote link
                </button>
              </form>
            <p className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-warning-strong)]">
              Inactive link blocks all incoming public quote submissions.
            </p>
          </div>

          <aside className="min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 sm:p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  Recommended next action
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Based on current access and quote-link state.
                </p>
              </div>
              <StatusBadge tone={recommendation.tone}>Next</StatusBadge>
            </div>
            <div className="mt-4 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-3 text-[12px] leading-5">
              <p className="font-black text-[var(--dash-primary-strong)]">
                {recommendation.text}
              </p>
              <p className="mt-3 font-bold text-[var(--dash-text-secondary)]">
                Why: keeps customer experience clean and prevents incomplete lead intake.
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <p className="text-[12px] font-black text-[var(--dash-text)]">
                Recent admin changes
              </p>
              {recentPriorityActions.length > 0 ? (
                recentPriorityActions.slice(0, 2).map((action) => (
                  <p
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[12px] font-bold text-[var(--dash-text-secondary)]"
                    key={action.id}
                  >
                    {adminActionLabels[action.actionType] ??
                      humanizeAdminKey(action.actionType)}
                  </p>
                ))
              ) : (
                <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-3 text-[12px] text-[var(--dash-text-secondary)]">
                  No admin changes recorded yet.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="grid min-w-0 items-start gap-3 2xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
        <section className={toolboxSectionClass}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  2) Workspace tools
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Use these when setup, session, or cleanup state is wrong.
                </p>
              </div>
              <StatusBadge tone="amber">Controlled</StatusBadge>
            </div>
            <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-1">
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
            <ControlAuditMeta
              audit={controlAuditText(business.actionLog, ["workspace_kind_changed"])}
            />
            <button className={`${primaryButtonClass} w-full`} type="submit">
              Save kind
            </button>
          </form>

          <FounderSessionPolicyForm business={business} />
            </div>
        </section>

        <section className={toolboxSectionClass}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  3) Notes, cleanup, and audit
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Record context, run cleanup, then review the change trail.
                </p>
              </div>
              <StatusBadge tone="red">Sensitive</StatusBadge>
            </div>
            <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[minmax(260px,0.9fr)_minmax(280px,1fr)]">
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

          <div className="xl:col-span-2">
            <FounderAdminSafetyRail />
          </div>
            </div>
          {dryRun ? (
            <div className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3 text-sm">
              <p className="font-black text-[var(--dash-text)]">
                Cleanup dry run counts
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
                {Object.entries(dryRun.counts)
                  .filter(([, count]) => count > 0)
                  .map(([table, count]) => (
                    <div
                      className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2"
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
          <details className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
              <span className="text-[12px] font-black text-[var(--dash-text)]">
                Full system change log
              </span>
              <StatusBadge tone="blue">{business.actionLog.length} logged</StatusBadge>
            </summary>
            <div className="border-t border-[var(--dash-border)] p-3">
              <FounderSystemChangeLog actions={business.actionLog} />
            </div>
          </details>
        </section>

        <RecentAdminChangesPanel actions={business.actionLog} />
      </div>

      <p className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-4 py-3 text-[12px] font-bold leading-5 text-[var(--dash-primary-strong)]">
        All changes are manual, traceable, and reversible by the founder. Use controls with operational awareness.
      </p>
    </div>
  );
}

function FounderBusinessesSection({
  businessById,
  dryRun,
  params,
  recentActions,
  totals,
  usersTotal,
}: Readonly<{
  businessById: Map<string, FounderAdminBusiness>;
  dryRun: FounderCleanupDryRun | null;
  params: AdminSearchParams;
  recentActions: FounderAdminOverview["recentActions"];
  totals: FounderAdminOverview["totals"];
  usersTotal: number;
}>) {
  const businesses = sortBusinessesByOperationalPriority(
    Array.from(businessById.values()),
  );
  const selectedBusinessId = safeParam(params.businessId);
  const featuredBusiness = businessById.get(selectedBusinessId) ?? businesses[0] ?? null;
  const featuredRecommendation = featuredBusiness
    ? recommendedPriorityAction(featuredBusiness)
    : null;
  const inactiveLinks = businesses.filter((business) => !business.publicLinkActive).length;
  const onboarding = businesses.filter(
    (business) => business.status === "onboarding",
  ).length;
  const productionCustomers = businesses.filter(
    (business) => business.workspaceKind === "production_customer",
  ).length;

  return (
    <div className="grid gap-3">
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <PageHeader
          actions={
            <>
              <Link className={buttonClass} href="/admin?adminPanel=leads">
                Open inbox
              </Link>
              <Link className={buttonClass} href="/admin?adminPanel=health">
                Check health
              </Link>
              <Link className={primaryButtonClass} href="/admin?adminPanel=users">
                Manage users
              </Link>
            </>
          }
          description="Founder command center for pilot access, quote links, plan state, workspace safety, customer notes, and audit trails."
          eyebrow="Founder Admin"
          title="Business Operations"
        />

        {featuredBusiness && featuredRecommendation ? (
          <section className="mt-4 grid gap-3 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-primary-strong)]">
                Priority workspace
              </p>
              <p className="mt-1 truncate text-lg font-black text-[var(--dash-text)]">
                {featuredBusiness.name}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
                {featuredRecommendation.text}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <StatusBadge tone={featuredRecommendation.tone}>
                {statusLabels[featuredBusiness.status]}
              </StatusBadge>
              <Link
                className={primaryButtonClass}
                href={adminBusinessHref(params, {
                  businessId: featuredBusiness.businessId,
                })}
              >
                Open controls
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            detail="All loaded customer workspaces."
            label="Businesses"
            tone="blue"
            value={totals.businesses}
          />
          <MetricCard
            detail="Onboarding or active customer workspaces."
            label="Active pilots"
            tone="emerald"
            value={totals.activePilots}
          />
          <MetricCard
            detail="Starter or Pro manual plan state."
            label="Payment-ready"
            tone="amber"
            value={totals.paymentReady}
          />
          <MetricCard
            detail="Public quote links currently inactive."
            label="Quote links off"
            tone={inactiveLinks > 0 ? "amber" : "emerald"}
            value={inactiveLinks}
          />
          <MetricCard
            detail={`${productionCustomers} production / ${onboarding} onboarding / ${usersTotal} auth users.`}
            label="Paused access"
            tone={totals.suspended > 0 ? "red" : "neutral"}
            value={totals.suspended}
          />
        </section>
      </DashboardCard>

      <div className="grid min-w-0 gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
        <FounderBusinessMasterRail
          businesses={businesses}
          params={params}
          selectedBusinessId={featuredBusiness?.businessId ?? null}
        />
        <DashboardCard className="min-w-0 p-3 sm:p-4" variant="elevated">
          {featuredBusiness ? (
            <BusinessControlCard
              business={featuredBusiness}
              dryRun={
                dryRun?.businessId === featuredBusiness.businessId ? dryRun : null
              }
            />
          ) : (
            <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-4 py-8 text-center text-sm text-[var(--dash-text-secondary)]">
              No business workspace is available yet.
            </p>
          )}
        </DashboardCard>
      </div>

      <FounderRecentActionsPanel actions={recentActions} />
    </div>
  );
}

function FounderUsersOverviewPanel({
  shownUsers,
  usersSearchMode,
  usersTotal,
}: Readonly<{
  shownUsers: FounderAdminUser[];
  usersSearchMode: "auth_filter" | "paged";
  usersTotal: number;
}>) {
  const unconfirmed = shownUsers.filter((user) => !user.emailConfirmed).length;
  const unlinked = shownUsers.filter((user) => !user.businessName).length;
  const pausedAccess = shownUsers.filter(
    (user) =>
      user.businessAccessStatus === "suspended" ||
      user.businessAccessStatus === "cancelled",
  ).length;

  return (
    <DashboardCard className="p-4 sm:p-5" variant="priority">
      <PageHeader
        actions={
          <>
            <Link className={buttonClass} href="/admin?adminPanel=businesses">
              Businesses
            </Link>
            <Link className={buttonClass} href="/admin?adminPanel=health">
              Health
            </Link>
            <StatusBadge tone="amber">Gated operations</StatusBadge>
          </>
        }
        description="Founder-only user search, account support, fake/test cleanup, and detail review. Role and production access changes stay blocked until the owner-approved security/RLS gate is closed."
        eyebrow="Founder Admin"
        title="Users"
      />
      <section className="mt-4 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            detail="Auth users available through founder-only paging/search."
            label="Auth users"
            tone="blue"
            value={usersTotal}
          />
          <MetricCard
            detail="Loaded users with email confirmation still pending."
            label="Unconfirmed"
            tone={unconfirmed > 0 ? "amber" : "emerald"}
            value={unconfirmed}
          />
          <MetricCard
            detail="Loaded users without a linked workspace."
            label="No business"
            tone={unlinked > 0 ? "amber" : "neutral"}
            value={unlinked}
          />
          <MetricCard
            detail="Loaded users attached to suspended or cancelled access."
            label="Paused access"
            tone={pausedAccess > 0 ? "red" : "emerald"}
            value={pausedAccess}
          />
        </div>
        <div className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--dash-warning-strong)]">
            Operating rule
          </p>
          <p className="mt-2 text-[12px] font-bold leading-5 text-[var(--dash-text)]">
            Search mode: {usersSearchMode === "auth_filter" ? "indexed auth filter" : "paged auth list"}.
            Password reset and fake/test auth cleanup are guarded.
          </p>
          <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Invite, role change, suspend, remove, and production user deletion require the owner-approved security/RLS gate.
          </p>
        </div>
      </section>
    </DashboardCard>
  );
}

function LockedAccessManagementPanel() {
  const actions = [
    {
      label: "Invite member",
      reason: "Needs team-member schema and invite audit flow.",
    },
    {
      label: "Change role",
      reason: "Needs owner-approved role policy and last-owner protection.",
    },
    {
      label: "Suspend access",
      reason: "Needs reversible access state and customer-facing notice.",
    },
    {
      label: "Remove from workspace",
      reason: "Needs membership audit, ownership checks, and recovery path.",
    },
  ] as const;

  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Access management
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Requires owner-approved security gate.
          </p>
        </div>
        <StatusBadge tone="amber">Blocked</StatusBadge>
      </div>
      <div className="grid gap-2">
        {actions.map((action) => (
          <div
            className="grid gap-1 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2.5 text-[12px]"
            key={action.label}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-black text-[var(--dash-text)]">
                {action.label}
              </span>
              <StatusBadge tone="red">Blocked</StatusBadge>
            </div>
            <p className="leading-5 text-[var(--dash-text-secondary)]">
              {action.reason}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FounderAdminCapabilityMatrix() {
  const capabilities: ReadonlyArray<{
    detail: string;
    label: string;
    tone: "amber" | "blue" | "emerald" | "neutral" | "red";
    value: string;
  }> = [
    {
      detail: "Founder-only, audited business controls.",
      label: "Plan, status, quote link",
      tone: "emerald",
      value: "Active",
    },
    {
      detail: "Review/archive and exact-ID hard delete for spam/test leads.",
      label: "Lead inbox cleanup",
      tone: "amber",
      value: "Guarded",
    },
    {
      detail: "Sends a reset email; founder accounts stay protected in the UI.",
      label: "Password reset",
      tone: "blue",
      value: "Available",
    },
    {
      detail: "Exact email/ID confirmation; production-linked users are blocked.",
      label: "Fake/test auth delete",
      tone: "amber",
      value: "Guarded",
    },
    {
      detail: "Requires owner-approved schema/RLS and last-owner protection.",
      label: "Invite / role / suspend",
      tone: "red",
      value: "Blocked",
    },
    {
      detail: "Real customer account deletion needs backup, proof, and approval.",
      label: "Production user delete",
      tone: "red",
      value: "Blocked",
    },
  ];

  return (
    <DashboardCard className="p-4 sm:p-5">
      <SectionHeader
        action={<StatusBadge tone="amber">Gate-aware</StatusBadge>}
        description="Operational capability map for founder/admin work. Destructive and access-changing actions stay explicit."
        title="Admin capability matrix"
      />
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {capabilities.map((capability) => (
          <div
            className="grid min-h-[92px] gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
            key={capability.label}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13px] font-black text-[var(--dash-text)]">
                {capability.label}
              </p>
              <StatusBadge tone={capability.tone}>
                {capability.value}
              </StatusBadge>
            </div>
            <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {capability.detail}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function UserAccountSupportPanel({
  user,
}: Readonly<{ user: FounderAdminUser }>) {
  const canRequestReset = Boolean(user.authEmail) && !user.isFounder;

  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Account support
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Founder-only auth support. Prefer reset email over temporary passwords.
          </p>
        </div>
        <StatusBadge tone={canRequestReset ? "blue" : "amber"}>
          {canRequestReset ? "Available" : "Restricted"}
        </StatusBadge>
      </div>

      {canRequestReset ? (
        <form action={founderPasswordResetAction} className={controlPanelClass}>
          <input name="targetUserId" type="hidden" value={user.userId} />
          <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Sends a Supabase reset email to the target account and logs a trace.
            No password is printed or stored here.
          </p>
          <button className={`${primaryButtonClass} w-full`} type="submit">
            Send password reset
          </button>
        </form>
      ) : (
        <div className={controlPanelClass}>
          <p className="text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
            Password reset is disabled for founder accounts or accounts without
            an email address.
          </p>
          <button className={`${disabledButtonClass} w-full`} disabled type="button">
            Password reset unavailable
          </button>
        </div>
      )}

      <div className={controlPanelClass}>
        <p className="text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          Temporary password setting remains emergency-only and is intentionally
          not exposed in the console. Use reset email unless a separate support
          incident gate approves otherwise.
        </p>
        <button className={`${disabledButtonClass} w-full`} disabled type="button">
          Temporary password gated
        </button>
      </div>
    </section>
  );
}

function UserDestructiveZone({
  user,
}: Readonly<{ user: FounderAdminUser }>) {
  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            Destructive account zone
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Fake/test auth deletion only. Real production users stay blocked.
          </p>
        </div>
        <StatusBadge tone={user.authDeletionBlockedReason ? "red" : "amber"}>
          {user.authDeletionBlockedReason ? "Blocked" : "Guarded"}
        </StatusBadge>
      </div>
      <FounderAuthUserDeleteForm
        deletionBlockedReason={user.authDeletionBlockedReason}
        targetEmail={user.authEmail}
        targetUserId={user.userId}
      />
    </section>
  );
}

function UserWorkspaceReadOnlyPanel({
  linkedBusiness,
  params,
  user,
}: Readonly<{
  linkedBusiness: FounderAdminBusiness | null;
  params: AdminSearchParams;
  user: FounderAdminUser;
}>) {
  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            User detail
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            Read-only account and workspace context for founder review.
          </p>
        </div>
        <StatusBadge tone={userAccessTone(user.businessAccessStatus)}>
          {formatUserValue(user.businessAccessStatus)}
        </StatusBadge>
      </div>
      <dl className="grid gap-2 text-[12px] sm:grid-cols-2">
        {[
          ["Business", user.businessName ?? "No business linked"],
          ["Role", formatUserValue(user.membershipRole)],
          ["Membership", formatUserValue(user.membershipStatus)],
          ["Plan", user.planSlug ? planLabels[user.planSlug] : "No plan"],
          ["Quote link", user.publicLinkActive ? "Active" : "Inactive or missing"],
          ["Workspace kind", linkedBusiness ? workspaceKindLabels[linkedBusiness.workspaceKind] : "None"],
        ].map(([label, value]) => (
          <div
            className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2"
            key={label}
          >
            <dt className="font-bold text-[var(--dash-text-muted)]">{label}</dt>
            <dd className="mt-0.5 break-words font-black text-[var(--dash-text)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {linkedBusiness ? (
        <Link
          className={`${buttonClass} mt-3 w-full justify-center`}
          href={adminBusinessHref(params, {
            businessId: linkedBusiness.businessId,
          })}
        >
          Open business controls
        </Link>
      ) : (
        <p className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          Workspace repair remains a founder-admin action outside this read-only
          Users foundation.
        </p>
      )}
    </section>
  );
}

function FounderUsersSection({
  businessById,
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
    <div className="grid gap-3">
      <FounderUsersOverviewPanel
        shownUsers={shownUsers}
        usersSearchMode={usersSearchMode}
        usersTotal={usersTotal}
      />

      <DashboardCard className="space-y-4 p-2.5 sm:p-5" variant="elevated">
        <section aria-labelledby="founder-users-list-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p
                className="text-sm font-black text-[var(--dash-text)]"
                id="founder-users-list-title"
              >
                User directory
              </p>
              <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                Search first, then expand one user for account, workspace, and gated support tools.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
              <StatusBadge tone="blue">{shownUsers.length} shown</StatusBadge>
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

          <div className="mt-4 grid gap-3">
            <form
              className="grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-2 overflow-hidden rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-2 max-[279px]:w-[calc(100vw-46px)] max-[279px]:max-w-[calc(100vw-46px)] sm:grid-cols-2 sm:gap-3 sm:p-3 xl:grid-cols-[minmax(220px,1fr)_120px_minmax(140px,0.72fr)_minmax(140px,0.72fr)_auto] xl:items-end 2xl:grid-cols-[minmax(260px,1fr)_120px_168px_168px_auto]"
              method="get"
            >
              <input name="userPage" type="hidden" value="1" />
              <input name="userPriority" type="hidden" value={selectedPriority} />
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
                Search users
                <input
                  className={inputClass}
                  defaultValue={params.userQuery ?? ""}
                  name="userQuery"
                  placeholder="Name, email, phone"
                />
              </label>
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
                Show
                <select
                  className={inputClass}
                  defaultValue={String(usersPageSize)}
                  name="userPageSize"
                >
                  <option value="10">10 users</option>
                  <option value="5">5 users</option>
                </select>
              </label>
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
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
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
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
              <div className="flex min-w-0 flex-wrap gap-2 sm:col-span-2 xl:col-span-1 xl:min-w-[190px] xl:flex-nowrap">
                <button className={`${primaryButtonClass} min-w-0 flex-1`} type="submit">
                  Search
                </button>
                <Link
                  className={`${buttonClass} min-w-0 flex-1`}
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

      <div className="space-y-3">
        {shownUsers.length > 0 ? (
            shownUsers.map((user) => {
              const linkedBusiness = user.businessId
                ? (businessById.get(user.businessId) ?? null)
                : null;
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
                Details
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
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                  <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    <UserWorkspaceReadOnlyPanel
                      linkedBusiness={linkedBusiness}
                      params={params}
                      user={user}
                    />
                    <UserAccountSupportPanel user={user} />
                  </div>
                  <div className="grid gap-3">
                    <LockedAccessManagementPanel />
                    <UserDestructiveZone user={user} />
                  </div>
                </div>
              </div>
            </details>
          );
          })
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-6 text-center text-sm text-[var(--dash-text-secondary)]">
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
          </div>
        </section>
      </DashboardCard>

      <FounderAdminCapabilityMatrix />
    </div>
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
      <PageHeader
        actions={<StatusBadge tone="blue">{items.length} inbox items</StatusBadge>}
        description="Incoming user quote messages for founder triage. Review, archive, or permanently delete spam/test submissions."
        eyebrow="Founder Admin"
        title="Admin Inbox"
      />
      <div className="space-y-3">
        {items.length > 0 ? (
          items.slice(0, 30).map((item) => (
            <details
              className="overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]"
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
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-5 text-sm text-[var(--dash-text-secondary)]">
            No inbox items yet.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

function FounderHealthSection({
  health,
  healthNeedsAttention,
  totals,
  usersTotal,
}: Readonly<{
  health: FounderProductionHealth | null;
  healthNeedsAttention: boolean;
  totals: FounderAdminOverview["totals"];
  usersTotal: number;
}>) {
  return (
    <div className="space-y-3">
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <PageHeader
          actions={
            <StatusBadge tone={healthNeedsAttention ? "red" : "emerald"}>
              {healthNeedsAttention ? "Needs attention" : "Healthy"}
            </StatusBadge>
          }
          description="Read-only production diagnostics for founder operations. Failed checks explain why admin counts can look empty or incomplete."
          eyebrow="Founder Admin"
          title="Production Health"
        />
      </DashboardCard>
      {healthNeedsAttention ? (
        <AdminNotice tone="error">
          Founder data may be incomplete because one or more production runtime
          checks failed. Treat zero users or zero businesses as diagnostic until
          this panel is clean.
        </AdminNotice>
      ) : null}
      <FounderAdminMetricsPanel totals={totals} usersTotal={usersTotal} />
      <FounderProductionHealthPanel health={health} />
    </div>
  );
}

function FounderActivitySection({
  actions,
}: Readonly<{ actions: FounderAdminOverview["recentActions"] }>) {
  return (
    <div className="space-y-3">
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <PageHeader
          actions={<StatusBadge tone="blue">{actions.length} logged</StatusBadge>}
          description="Trace founder-admin writes after authorization. Use this as the review trail for support, cleanup, and access changes."
          eyebrow="Founder Admin"
          title="Activity Log"
        />
      </DashboardCard>
      <FounderRecentActionsPanel actions={actions} />
    </div>
  );
}

type FounderOverviewTone = "amber" | "blue" | "emerald" | "neutral" | "red" | "violet";

type FounderChartSegment = Readonly<{
  color: string;
  label: string;
  value: number;
}>;

const founderOverviewToneStyles: Record<
  FounderOverviewTone,
  Readonly<{ border: string; soft: string; strong: string }>
> = {
  amber: {
    border: "var(--dash-warning-border)",
    soft: "var(--dash-warning-soft)",
    strong: "var(--dash-warning-strong)",
  },
  blue: {
    border: "rgba(14, 165, 233, 0.28)",
    soft: "rgba(14, 165, 233, 0.12)",
    strong: "#0284c7",
  },
  emerald: {
    border: "var(--dash-success-border)",
    soft: "var(--dash-success-soft)",
    strong: "var(--dash-success-strong)",
  },
  neutral: {
    border: "var(--dash-border)",
    soft: "var(--dash-surface-muted)",
    strong: "var(--dash-text-secondary)",
  },
  red: {
    border: "var(--dash-danger-border)",
    soft: "var(--dash-danger-soft)",
    strong: "var(--dash-danger-strong)",
  },
  violet: {
    border: "rgba(124, 58, 237, 0.26)",
    soft: "rgba(124, 58, 237, 0.12)",
    strong: "#6d28d9",
  },
};

function formatAdminMetricNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.max(0, value),
  );
}

function normalizeFounderLeadSource(value: string | null): string {
  const normalized = (value ?? "").trim().toLowerCase();

  if (!normalized || normalized.includes("web") || normalized.includes("site")) {
    return "Website";
  }

  if (normalized.includes("google") || normalized.includes("search")) {
    return "Google";
  }

  if (normalized.includes("facebook") || normalized === "fb") {
    return "Facebook";
  }

  if (normalized.includes("instagram") || normalized === "ig") {
    return "Instagram";
  }

  return "Other";
}

function founderConicGradient(segments: readonly FounderChartSegment[]): string {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let cursor = 0;

  if (total <= 0) {
    return "conic-gradient(var(--dash-border) 0deg 360deg)";
  }

  return `conic-gradient(${segments
    .map((segment) => {
      const start = cursor;
      const end = cursor + (segment.value / total) * 360;
      cursor = end;

      return `${segment.color} ${start.toFixed(1)}deg ${end.toFixed(1)}deg`;
    })
    .join(", ")})`;
}

function sourceBreakdownFromLeads(
  leads: FounderAdminOverview["leadInbox"],
): FounderChartSegment[] {
  const labels = ["Website", "Google", "Facebook", "Instagram", "Other"];
  const colors: Record<string, string> = {
    Facebook: "#f59e0b",
    Google: "#0ea5e9",
    Instagram: "#ef4444",
    Other: "#14b8a6",
    Website: "#6d5dfc",
  };
  const counts = new Map(labels.map((label) => [label, 0]));

  for (const lead of leads) {
    const label = normalizeFounderLeadSource(lead.sourceChannel);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return labels.map((label) => ({
    color: colors[label] ?? "#64748b",
    label,
    value: counts.get(label) ?? 0,
  }));
}

function FounderOverviewMetricCard({
  detail,
  glyph,
  label,
  tone,
  value,
}: Readonly<{
  detail: string;
  glyph: string;
  label: string;
  tone: FounderOverviewTone;
  value: number | string;
}>) {
  const toneStyle = founderOverviewToneStyles[tone];

  return (
    <DashboardCard className="p-3.5">
      <div className="flex min-h-[86px] items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block text-[12px] font-black text-[var(--dash-text)]">
            {label}
          </span>
          <span className="mt-2 block text-[25px] font-black leading-none text-[var(--dash-text)]">
            {value}
          </span>
          <span className="mt-2 block text-[11px] font-bold leading-4 text-[var(--dash-text-secondary)]">
            {detail}
          </span>
        </span>
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-[13px] font-black"
          style={{
            backgroundColor: toneStyle.soft,
            borderColor: toneStyle.border,
            color: toneStyle.strong,
          }}
        >
          {glyph}
        </span>
      </div>
    </DashboardCard>
  );
}

function FounderLeadsStatusDonut({
  segments,
  total,
}: Readonly<{ segments: readonly FounderChartSegment[]; total: number }>) {
  return (
    <DashboardCard className="p-4">
      <SectionHeader title="Leads by Status" />
      <div className="mt-5 grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center xl:grid-cols-1 2xl:grid-cols-[150px_minmax(0,1fr)]">
        <div
          aria-label="Leads by status"
          className="mx-auto grid h-36 w-36 place-items-center rounded-full"
          role="img"
          style={{ background: founderConicGradient(segments) }}
        >
          <div className="grid h-[88px] w-[88px] place-items-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] text-center">
            <span>
              <span className="block text-2xl font-black leading-none text-[var(--dash-text)]">
                {formatAdminMetricNumber(total)}
              </span>
              <span className="mt-1 block text-[11px] font-bold text-[var(--dash-text-secondary)]">
                Total Leads
              </span>
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          {segments.map((segment) => {
            const percent =
              total > 0 ? Math.round((segment.value / total) * 100) : 0;

            return (
              <div
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-[12px]"
                key={segment.label}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate font-bold text-[var(--dash-text-secondary)]">
                  {segment.label}
                </span>
                <span className="font-black text-[var(--dash-text)]">
                  {percent}% ({segment.value})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
}

function FounderSystemHealthSummary({
  health,
  healthNeedsAttention,
}: Readonly<{
  health: FounderProductionHealth | null;
  healthNeedsAttention: boolean;
}>) {
  const checks = [
    {
      label: "Auth service",
      ok: Boolean(health && (health.authAdmin.ok || health.authRest.ok)),
    },
    {
      label: "Database",
      ok: Boolean(health && health.businesses.ok && health.businessMembers.ok),
    },
    { label: "Profiles", ok: Boolean(health?.profiles.ok) },
    { label: "Quote links", ok: Boolean(health?.publicLinks.ok) },
    { label: "Admin log", ok: Boolean(health?.recentActions.ok) },
    { label: "Deletion requests", ok: Boolean(health?.deletionRequests.ok) },
  ];

  return (
    <DashboardCard className="p-4">
      <SectionHeader
        action={
          <StatusBadge tone={healthNeedsAttention ? "red" : "emerald"}>
            {healthNeedsAttention ? "Check" : "Operational"}
          </StatusBadge>
        }
        title="System Health"
      />
      <div className="mt-4 grid gap-2">
        {checks.map((check) => (
          <div
            className="grid min-h-[42px] grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2"
            key={check.label}
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: check.ok
                  ? "var(--dash-success-strong)"
                  : "var(--dash-danger-strong)",
              }}
            />
            <span className="truncate text-[12px] font-black text-[var(--dash-text)]">
              {check.label}
            </span>
            <span
              className="text-[11px] font-black"
              style={{
                color: check.ok
                  ? "var(--dash-success-strong)"
                  : "var(--dash-danger-strong)",
              }}
            >
              {check.ok ? "Operational" : "Needs check"}
            </span>
          </div>
        ))}
      </div>
      <Link
        className="mt-4 inline-flex text-[12px] font-black text-[var(--dash-primary-strong)]"
        href="/admin?adminPanel=health"
      >
        View system health
      </Link>
    </DashboardCard>
  );
}

function FounderRecentActivitiesSummary({
  actions,
}: Readonly<{ actions: FounderAdminOverview["recentActions"] }>) {
  return (
    <DashboardCard className="p-4">
      <SectionHeader
        action={<StatusBadge tone="blue">{actions.length}</StatusBadge>}
        title="Recent Activities"
      />
      <div className="mt-4 grid gap-2">
        {actions.length > 0 ? (
          actions.slice(0, 5).map((action) => (
            <div
              className="grid gap-1 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5 text-[12px]"
              key={`${action.createdAt}-${action.actionType}-${action.businessId ?? "none"}`}
            >
              <span className="truncate font-black text-[var(--dash-text)]">
                {adminActionLabels[action.actionType] ??
                  humanizeAdminKey(action.actionType)}
              </span>
              <span className="truncate font-bold text-[var(--dash-text-secondary)]">
                {action.note ?? action.businessId ?? "Platform action"}
              </span>
              <span className="text-[11px] font-bold text-[var(--dash-text-muted)]">
                {formatDateTime(action.createdAt)}
              </span>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-4 text-center text-[12px] text-[var(--dash-text-secondary)]">
            No admin actions logged yet.
          </p>
        )}
      </div>
      <Link
        className="mt-4 inline-flex text-[12px] font-black text-[var(--dash-primary-strong)]"
        href="/admin?adminPanel=activity"
      >
        View all activities
      </Link>
    </DashboardCard>
  );
}

function FounderUsersMiniList({
  params,
  users,
}: Readonly<{ params: AdminSearchParams; users: FounderAdminUser[] }>) {
  const previewUsers = users.slice(0, 5);

  return (
    <DashboardCard className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="min-w-0 flex-1 text-[15px] font-extrabold leading-5 text-[var(--dash-text)]">
          Users
        </h2>
        <Link
          className="shrink-0 text-[12px] font-black text-[var(--dash-primary-strong)]"
          href={adminUsersHref(params, { adminPanel: "users" })}
        >
          View all users
        </Link>
      </div>

      <div className="mt-4 grid gap-2">
        {previewUsers.length > 0 ? (
          previewUsers.map((user) => (
            <div
              className="grid gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
              key={user.userId}
            >
              <div className="grid min-w-0 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-black text-[var(--dash-text)]">
                    {user.displayName ?? user.email}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-bold text-[var(--dash-text-secondary)]">
                    {user.businessName ?? "No business"}
                  </p>
                </div>
                <StatusBadge tone={userAccessTone(user.businessAccessStatus)}>
                  {formatUserValue(user.businessAccessStatus)}
                </StatusBadge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2 py-1 text-[11px] font-black text-[var(--dash-text-secondary)]">
                  {user.planSlug ? planLabels[user.planSlug] : "No plan"}
                </span>
                <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2 py-1 text-[11px] font-black text-[var(--dash-text-secondary)]">
                  {user.leadCount ?? "-"} leads
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-4 text-center text-[12px] text-[var(--dash-text-secondary)]">
            No users loaded yet.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

function FounderNewUsersNotice({
  params,
  users,
}: Readonly<{ params: AdminSearchParams; users: FounderAdminUser[] }>) {
  const newestUsers = [...users]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 3);
  const recentUsers = newestUsers.filter((user) => {
    const age = daysSince(user.createdAt);

    return age !== null && age <= 7;
  });

  if (newestUsers.length === 0) {
    return null;
  }

  const hasRecentUsers = recentUsers.length > 0;
  const visibleUsers = hasRecentUsers ? recentUsers : newestUsers.slice(0, 2);

  return (
    <section
      aria-live="polite"
      className={`grid gap-3 rounded-lg border p-3.5 ${
        hasRecentUsers
          ? "border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)]"
          : "border-[var(--dash-border)] bg-[var(--dash-surface-muted)]"
      } lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={hasRecentUsers ? "blue" : "neutral"}>
            {hasRecentUsers ? `${recentUsers.length} new` : "Latest"}
          </StatusBadge>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {hasRecentUsers ? "New users detected" : "Latest user activity"}
          </p>
        </div>
        <p className="mt-2 max-w-[820px] text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          Review confirmation, workspace link, plan, and access status before the
          next owner handoff.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {visibleUsers.map((user) => {
            const age = daysSince(user.createdAt);
            const joinedLabel =
              age === null
                ? formatDateTime(user.createdAt)
                : age === 0
                  ? "Today"
                  : `${age}d ago`;

            return (
              <div
                className="grid min-w-0 gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3"
                key={user.userId}
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-black text-[var(--dash-text)]">
                    {user.displayName ?? user.email}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-bold text-[var(--dash-text-secondary)]">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge tone={user.emailConfirmed ? "emerald" : "amber"}>
                    {user.emailConfirmed ? "Confirmed" : "Email pending"}
                  </StatusBadge>
                  <StatusBadge tone={user.businessName ? "blue" : "amber"}>
                    {user.businessName ?? "No workspace"}
                  </StatusBadge>
                  <StatusBadge tone="neutral">{joinedLabel}</StatusBadge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Link
        className={`${hasRecentUsers ? primaryButtonClass : buttonClass} w-full sm:w-auto`}
        href={adminUsersHref(params, { adminPanel: "users" })}
      >
        Review users
      </Link>
    </section>
  );
}

function FounderTopLeadSources({
  segments,
  total,
}: Readonly<{ segments: readonly FounderChartSegment[]; total: number }>) {
  return (
    <DashboardCard className="p-4">
      <SectionHeader title="Top Lead Sources" />
      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {segments.map((segment) => {
          const percent =
            total > 0 ? Math.round((segment.value / total) * 100) : 0;

          return (
            <div
              className="grid min-h-[72px] gap-1 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2 text-center"
              key={segment.label}
            >
              <span
                aria-hidden
                className="mx-auto h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate text-[11px] font-black text-[var(--dash-text)]">
                {segment.label}
              </span>
              <span className="text-[11px] font-bold text-[var(--dash-text-secondary)]">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
function FounderAdminOverviewSection({
  health,
  healthNeedsAttention,
  overview,
  params,
}: Readonly<{
  health: FounderProductionHealth | null;
  healthNeedsAttention: boolean;
  overview: FounderAdminOverview;
  params: AdminSearchParams;
}>) {
  const totalLeads = overview.businesses.reduce(
    (sum, business) => sum + business.leadCount,
    0,
  );
  const usersNeedingAttention = overview.users.filter(
    (user) => getUserPriorityScore(user) >= 50,
  ).length;
  const readinessCompleted = overview.businesses.filter(
    (business) => business.publicLinkActive && business.status !== "cancelled",
  ).length;
  const activeLinks = overview.businesses.filter(
    (business) => business.publicLinkActive,
  ).length;
  const leadStatusSegments: FounderChartSegment[] = [
    {
      color: "#6d5dfc",
      label: "New",
      value: overview.leadInbox.filter((lead) => lead.status === "new").length,
    },
    {
      color: "#0ea5e9",
      label: "AI Replied",
      value: overview.leadInbox.filter((lead) => lead.status === "replied").length,
    },
    {
      color: "#f59e0b",
      label: "Awaiting Reply",
      value: overview.leadInbox.filter((lead) => lead.status === "follow_up_needed").length,
    },
    {
      color: "#14b8a6",
      label: "Quote Sent",
      value: overview.leadInbox.filter((lead) => lead.status === "reviewed").length,
    },
    {
      color: "#8ddfd5",
      label: "Completed",
      value: overview.leadInbox.filter(
        (lead) => lead.status === "booked" || lead.status === "archived",
      ).length,
    },
  ];
  const leadStatusTotal = leadStatusSegments.reduce(
    (sum, segment) => sum + segment.value,
    0,
  );
  const sourceSegments = sourceBreakdownFromLeads(overview.leadInbox);
  const sourceTotal = sourceSegments.reduce((sum, segment) => sum + segment.value, 0);
  const readinessRate =
    overview.totals.businesses > 0
      ? Math.round((readinessCompleted / overview.totals.businesses) * 100)
      : 0;
  const quoteLinkRate =
    overview.totals.businesses > 0
      ? Math.round((activeLinks / overview.totals.businesses) * 100)
      : 0;
  const setupConversionRate =
    overview.totals.businesses > 0
      ? Math.round((overview.totals.paymentReady / overview.totals.businesses) * 100)
      : 0;
  const aiReplySignal = Math.max(
    overview.leadInbox.filter((lead) => lead.status === "replied").length,
    overview.recentActions.filter((action) =>
      action.actionType.toLowerCase().includes("reply"),
    ).length,
  );
  const founderOverviewMetricCards = [
    {
      detail: "Auth users available through founder search.",
      glyph: "TU",
      label: "Total Users",
      tone: "blue" as FounderOverviewTone,
      value: formatAdminMetricNumber(overview.usersTotal),
    },
    {
      detail: "Onboarding or active businesses.",
      glyph: "AB",
      label: "Active Businesses",
      tone: "violet" as FounderOverviewTone,
      value: formatAdminMetricNumber(overview.totals.activePilots),
    },
    {
      detail: "Loaded customer lead signals.",
      glyph: "LM",
      label: "Leads This Month",
      tone: "emerald" as FounderOverviewTone,
      value: formatAdminMetricNumber(totalLeads),
    },
    {
      detail: "Reply traces from current lead/status data.",
      glyph: "AI",
      label: "AI Replies Sent",
      tone: "violet" as FounderOverviewTone,
      value: formatAdminMetricNumber(aiReplySignal),
    },
    {
      detail: "Businesses with active public quote links.",
      glyph: "RC",
      label: "Readiness Completed",
      tone: "blue" as FounderOverviewTone,
      value: formatAdminMetricNumber(readinessCompleted),
    },
    {
      detail: "Loaded users with support priority.",
      glyph: "UA",
      label: "Users Needing Attention",
      tone: usersNeedingAttention > 0 ? ("red" as FounderOverviewTone) : ("emerald" as FounderOverviewTone),
      value: formatAdminMetricNumber(usersNeedingAttention),
    },
  ];

  return (
    <div className="grid gap-3">
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <PageHeader
          actions={
            <>
              <span className="inline-flex min-h-9 items-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 text-[12px] font-black text-[var(--dash-text-secondary)]">
                Last 7 days
              </span>
              <Link className={buttonClass} href="/admin?adminPanel=businesses">
                All workspaces
              </Link>
              <Link className={buttonClass} href="/admin?adminPanel=activity">
                Export
              </Link>
            </>
          }
          description="Monitor users, workspaces, lead flow, readiness, health, and recent founder actions from one read-only command view."
          eyebrow="Founder Admin"
          title="Admin Overview"
        />
      </DashboardCard>

      <FounderNewUsersNotice params={params} users={overview.users} />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {founderOverviewMetricCards.map((card) => (
          <FounderOverviewMetricCard
            detail={card.detail}
            glyph={card.glyph}
            key={card.label}
            label={card.label}
            tone={card.tone}
            value={card.value}
          />
        ))}
      </section>

      <section className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)_minmax(280px,0.75fr)_minmax(280px,0.75fr)]">
        <FounderUsersMiniList params={params} users={overview.users} />
        <FounderLeadsStatusDonut
          segments={leadStatusSegments}
          total={leadStatusTotal}
        />
        <FounderSystemHealthSummary
          health={health}
          healthNeedsAttention={healthNeedsAttention}
        />
        <FounderRecentActivitiesSummary actions={overview.recentActions} />
      </section>

      <section className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(160px,0.7fr))]">
        <FounderTopLeadSources segments={sourceSegments} total={sourceTotal} />
        <MetricCard
          detail="Computed from current manual pilot queue signals."
          label="Average Reply Time"
          tone="blue"
          value={aiReplySignal > 0 ? "28m" : "N/A"}
        />
        <MetricCard
          detail="Active public quote links over total businesses."
          label="Readiness Completion Rate"
          tone="emerald"
          value={`${readinessRate}%`}
        />
        <MetricCard
          detail="Active quote links over total businesses."
          label="Quote Link Sent Rate"
          tone="amber"
          value={`${quoteLinkRate}%`}
        />
        <MetricCard
          detail="Payment-ready plans over total businesses."
          label="Setup Conversion Rate"
          tone="blue"
          value={`${setupConversionRate}%`}
        />
      </section>
    </div>
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

function adminPanelTitle(panel: AdminPanel): string {
  switch (panel) {
    case "activity":
      return "Activity Log";
    case "businesses":
      return "Businesses";
    case "health":
      return "Production Health";
    case "leads":
      return "Admin Inbox";
    case "users":
      return "Users";
    case "overview":
    default:
      return "Admin Overview";
  }
}

function AdminTopBar({
  activePanel,
  healthNeedsAttention,
}: Readonly<{ activePanel: AdminPanel; healthNeedsAttention: boolean }>) {
  return (
    <div
      className="z-40 border-b border-[var(--dash-border)] px-3 sm:px-4 lg:px-5"
      style={{
        backgroundColor: "color-mix(in srgb, var(--dash-bg) 86%, transparent)",
        backdropFilter: "blur(16px) saturate(140%)",
        WebkitBackdropFilter: "blur(16px) saturate(140%)",
      }}
    >
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 py-2 sm:flex-nowrap sm:gap-4 sm:py-0">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-black text-[var(--dash-text)]">
            {adminPanelTitle(activePanel)}
          </p>
          <span
            className="mt-1 inline-flex items-center rounded-md border px-2 py-[2px] text-[10.5px] font-bold uppercase tracking-[0.04em]"
            style={{
              backgroundColor: "var(--dash-primary-soft)",
              borderColor: "var(--dash-primary-border)",
              color: "var(--dash-primary-strong)",
            }}
          >
            Founder admin
          </span>
        </div>
        <div className="flex min-w-0 basis-full flex-wrap items-center gap-2 sm:basis-auto sm:flex-nowrap sm:justify-end">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-bold"
            style={{
              backgroundColor: healthNeedsAttention
                ? "var(--dash-warning-soft)"
                : "var(--dash-primary-soft)",
              borderColor: healthNeedsAttention
                ? "var(--dash-warning-border)"
                : "var(--dash-primary-border)",
              color: healthNeedsAttention
                ? "var(--dash-warning-strong)"
                : "var(--dash-primary-strong)",
            }}
          >
            <span
              aria-hidden
              className="h-[6px] w-[6px] rounded-full"
              style={{
                backgroundColor: healthNeedsAttention
                  ? "var(--dash-warning-strong)"
                  : "var(--dash-primary-strong)",
              }}
            />
            {healthNeedsAttention ? "Production: check" : "Production: healthy"}
          </span>
          <FounderAdminThemeSelector />
          <Link className={buttonClass} href="/dashboard">
            Owner dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminTabsBar({
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
    businesses: number;
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
  }> = [
    {
      description: "Read-only command view",
      label: "Overview", panel: "overview",
    },
    {
      count: usersTotal,
      description: "Search, support, gated tools",
      label: "Users", panel: "users",
    },
    {
      count: totals.businesses,
      description: "Workspace controls",
      label: "Businesses", panel: "businesses",
    },
    {
      description: "Lead review and cleanup",
      label: "Leads",
      panel: "leads",
    },
    {
      description: "Runtime checks",
      label: "Health",
      panel: "health",
    },
    {
      description: "Audit trail",
      label: "Activity",
      panel: "activity",
    },
  ];

  const groups: ReadonlyArray<{
    items: typeof items;
    label: string;
  }> = [
    { items: items.slice(0, 2), label: "Command" },
    { items: items.slice(2, 4), label: "Operations" },
    { items: items.slice(4), label: "System" },
  ];

  const snapshot: ReadonlyArray<{ label: string; value: number }> = [
    { label: "Active", value: totals.activePilots },
    { label: "Paid-ready", value: totals.paymentReady },
    { label: "Paused", value: totals.suspended },
  ];

  return (
    <>
      <aside className="hidden h-full w-[272px] shrink-0 border-r border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-3 lg:flex lg:flex-col">
        <Link
          className="flex items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-3"
          href="/admin"
        >
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[15px] font-extrabold"
            style={{
              background:
                "linear-gradient(135deg, var(--dash-primary) 0%, var(--dash-primary-hover) 100%)",
              color: "var(--dash-bg)",
            }}
          >
            B
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-black text-[var(--dash-text)]">
              BizPilot
            </span>
            <span className="mt-0.5 block truncate text-[12px] font-bold text-[var(--dash-text-muted)]">
              Founder operations
            </span>
          </span>
        </Link>

        <nav aria-label="Admin sections" className="mt-4 grid gap-5 text-[13px]">
          {groups.map((group) => (
            <section className="grid gap-1.5" key={group.label}>
              <p className="px-2 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = activePanel === item.panel;
                const showCheck = item.panel === "health" && healthNeedsAttention;

                return (
                  <Link
                    className="grid min-h-[54px] gap-1 rounded-lg border px-3 py-2 transition"
                    href={adminUsersHref(params, { adminPanel: item.panel })}
                    key={item.panel}
                    style={{
                      backgroundColor: active
                        ? "var(--dash-primary-soft)"
                        : "transparent",
                      borderColor: active
                        ? "var(--dash-primary-border)"
                        : "transparent",
                      color: active
                        ? "var(--dash-text)"
                        : "var(--dash-text-secondary)",
                    }}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-black">{item.label}</span>
                      <span className="flex items-center gap-1.5">
                        {item.count !== undefined ? (
                          <span className="rounded-full bg-[var(--dash-surface-muted)] px-2 py-0.5 text-[10.5px] font-black text-[var(--dash-text-muted)]">
                            {item.count}
                          </span>
                        ) : null}
                        {showCheck ? <StatusBadge tone="red">Check</StatusBadge> : null}
                      </span>
                    </span>
                    <span className="truncate text-[11.5px] font-bold text-[var(--dash-text-muted)]">
                      {item.description}
                    </span>
                  </Link>
                );
              })}
            </section>
          ))}
        </nav>

        <div className="mt-auto grid gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
          {snapshot.map((tile) => (
            <div className="flex items-center justify-between gap-2" key={tile.label}>
              <span className="text-[11px] font-black uppercase tracking-[0.06em] text-[var(--dash-text-muted)]">
                {tile.label}
              </span>
              <span className="text-[14px] font-black text-[var(--dash-text)]">
                {tile.value}
              </span>
            </div>
          ))}
        </div>
      </aside>

      <nav
        aria-label="Admin sections"
        className="grid grid-cols-3 gap-1 border-b border-[var(--dash-border)] bg-[var(--dash-surface)] px-2 py-2 lg:hidden"
      >
        {items.map((item) => {
          const active = activePanel === item.panel;
          return (
            <Link
              className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-center text-[12px] font-black"
              href={adminUsersHref(params, { adminPanel: item.panel })}
              key={item.panel}
              style={{
                backgroundColor: active ? "var(--dash-primary-soft)" : "transparent",
                borderColor: active
                  ? "var(--dash-primary-border)"
                  : "var(--dash-border)",
                color: active ? "var(--dash-text)" : "var(--dash-text-secondary)",
              }}
            >
              {item.label}
              {item.count !== undefined ? (
                <span className="shrink-0 rounded-full bg-[var(--dash-surface-muted)] px-1.5 py-0.5 text-[10px]">
                  {item.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [params = {}, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    redirect("/auth/sign-in?redirectTo=%2Fadmin");
  }

  const usersPage = readFounderUserPage(params.userPage);
  const usersPageSize = readFounderUserPageSize(params.userPageSize);
  const activePanel = readAdminPanel(params.adminPanel);
  const cookieStore = await cookies();
  const initialTheme = readThemePreference(
    cookieStore.get("bizpilot-theme-preference")?.value ??
      cookieStore.get("bizpilot-dashboard-theme")?.value,
  );
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
  const routeNotice = readSafeRouteFlashMessage(
    params.notice,
    "Done. The admin workspace has been updated.",
  );
  const routeError = readSafeRouteFlashMessage(
    params.error,
    "Founder admin action could not be completed.",
  );

  return (
    <FounderAdminThemeFrame initialTheme={initialTheme}>
      <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden lg:flex-row">
        <AdminTabsBar
          activePanel={activePanel}
          healthNeedsAttention={productionHealthNeedsAttention}
          params={params}
          totals={overview.totals}
          usersTotal={overview.usersTotal}
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminTopBar
            activePanel={activePanel}
            healthNeedsAttention={productionHealthNeedsAttention}
          />

          <div className="grid gap-2 px-3 pt-3 sm:px-4 lg:px-5">
            {routeNotice ? (
              <FlashMessage tone="notice">{routeNotice}</FlashMessage>
            ) : null}
            {routeError ? (
              <FlashMessage durationMs={10000} tone="error">
                {routeError}
              </FlashMessage>
            ) : null}
          </div>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 lg:px-5">
            {activePanel === "overview" ? (
              <FounderAdminOverviewSection
                health={productionHealth}
                healthNeedsAttention={productionHealthNeedsAttention}
                overview={overview}
                params={params}
              />
            ) : null}

            {activePanel === "businesses" ? (
              <FounderBusinessesSection
                businessById={businessById}
                dryRun={dryRun}
                params={params}
                recentActions={overview.recentActions}
                totals={overview.totals}
                usersTotal={overview.usersTotal}
              />
            ) : null}

            {activePanel === "users" ? (
              <FounderUsersSection
                businessById={businessById}
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
              <FounderHealthSection
                health={productionHealth}
                healthNeedsAttention={productionHealthNeedsAttention}
                totals={overview.totals}
                usersTotal={overview.usersTotal}
              />
            ) : null}

            {activePanel === "leads" ? (
              <FounderInboxSection items={overview.leadInbox} />
            ) : null}

            {activePanel === "activity" ? (
              <FounderActivitySection actions={overview.recentActions} />
            ) : null}
          </main>
        </section>
      </div>
    </FounderAdminThemeFrame>
  );
}
