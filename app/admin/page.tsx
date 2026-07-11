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
 * Last Updated: 2026-07-11
 * Change Log:
 * - 2026-07-11: Localized founder inbox, recent admin-change, cleanup-safety, activity-filter, and action-label helpers.
 * - 2026-07-11: Built localized founder user-priority groups before rendering the work-queue filters.
 * - 2026-07-11: Localized founder health, activity, and user-directory chrome through shared admin copy.
 * - 2026-07-11: Wired founder activity newsroom copy through the localized admin dictionary.
 * - 2026-07-11: Localized founder user-operations overview, gated access panels, and account-support copy.
 * - 2026-07-11: Localized founder business control-card warnings, audit helpers, and session-policy option labels.
 * - 2026-07-11: Centralized founder-admin shell, handoff, and repeated placeholder copy into the bilingual dashboard dictionary.
 * - 2026-07-05: Restored explicit first-10 matched workspace helper copy in the founder business rail.
 * - 2026-07-05: Clarified hidden admin workspace match counts with direct matched-id lookup.
 * - 2026-05-26: Moved production health ahead of data grids so empty admin data is tied to safe runtime diagnostics.
 * - 2026-06-18: Updated founder access fallback to svh/clip frame for responsive hardening.
 * - 2026-06-19: Read the shared theme preference cookie while preserving legacy dashboard theme fallback.
 * - 2026-06-27: Added panel headings and loosened dense admin control grids.
 * - 2026-06-27: Split business-selection URLs from user paging/filter URLs.
 * - 2026-06-27: Promoted Users as the default admin control lane and made business routes explicit.
 * - 2026-06-27: Sanitized admin route flash messages before rendering.
 * - 2026-06-27: Reordered Users into a search-first founder operations cockpit.
 * - 2026-06-27: Added search-driven 10-row business rail and V3 priority workspace tiles.
 * - 2026-07-04: Removed misleading admin metric labels that implied sent AI replies or measured conversion.
 * - 2026-07-05: Reframed account deletion surfaces as protected cleanup and safety policy.
 * - 2026-07-05: Standardized founder user pagination, page-size controls, and panel-preserving search.
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
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { readThemePreference } from "@/lib/theme";
import {
  INTERFACE_LANGUAGE_COOKIE,
  languageLabels,
  readSupportedLanguage,
} from "@/lib/i18n/language";
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
  activityFilter?: string | undefined;
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

type DashboardCopy = ReturnType<typeof getBizPilotCopy>["dashboard"];
type AdminCopy = DashboardCopy["admin"];

type ActivityFilter =
  | "access"
  | "all"
  | "auth"
  | "cleanup"
  | "notes"
  | "plan"
  | "quote"
  | "system";

type PlanSlug = FounderAdminBusiness["planSlug"];
type BusinessStatus = FounderAdminBusiness["status"];
type SessionTimeoutMode = FounderAdminBusiness["sessionTimeoutMode"];

const adminUserPageSizeOptions = [10, 25, 50] as const;

const controlPanelClass =
  "grid w-full min-w-0 max-w-full gap-3 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 sm:p-3.5 shadow-sm";
const toolboxSectionClass =
  "grid w-full min-w-0 max-w-full gap-3 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:p-3.5";

type UserPriorityOption = Readonly<{
  description: string;
  label: string;
  value: string;
}>;

const activityFilterValues = [
  "all",
  "access",
  "quote",
  "plan",
  "cleanup",
  "notes",
  "auth",
  "system",
] as const satisfies ReadonlyArray<ActivityFilter>;

function hasOwnKey<T extends object>(
  object: T,
  key: PropertyKey,
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function buildActivityFilters(
  copy: AdminCopy,
): ReadonlyArray<Readonly<{ label: string; value: ActivityFilter }>> {
  const labels = copy.overview.activityFilters;
  return activityFilterValues.map((value) => ({
    label: labels[value],
    value,
  }));
}

function buildUserPriorityGroups(
  copy: AdminCopy,
): ReadonlyArray<Readonly<{ options: ReadonlyArray<UserPriorityOption>; title: string }>> {
  const directoryCopy = copy.users.directory;
  const planLabels = copy.businesses.detail.planLabels;

  const planPriorityOptions: ReadonlyArray<UserPriorityOption> = [
    {
      description: "Users attached to founder-pilot workspaces.",
      label: planLabels.founder_pilot,
      value: "plan_founder_pilot",
    },
    {
      description: "Users attached to starter workspaces.",
      label: planLabels.starter,
      value: "plan_starter",
    },
    {
      description: "Users attached to pro workspaces.",
      label: planLabels.pro,
      value: "plan_pro",
    },
    {
      description: "Users attached to paused workspaces.",
      label: planLabels.paused,
      value: "plan_paused",
    },
  ];

  const accessPriorityOptions: ReadonlyArray<UserPriorityOption> = [
    {
      description: "Active workspace access.",
      label: copy.users.accessStatusOptions.active,
      value: "access_active",
    },
    {
      description: "Onboarding workspace access.",
      label: copy.users.accessStatusOptions.onboarding,
      value: "access_onboarding",
    },
    {
      description: "Suspended workspace access.",
      label: copy.users.accessStatusOptions.suspended,
      value: "access_suspended",
    },
    {
      description: "Cancelled workspace access.",
      label: copy.users.accessStatusOptions.cancelled,
      value: "access_cancelled",
    },
    {
      description: "Auth accounts without a linked business.",
      label: copy.users.accessStatusOptions.unlinked,
      value: "access_unlinked",
    },
  ];

  return [
    {
      options: [
        {
          description: "Access, auth, quote, and activity risks.",
          label: copy.overview.healthSection.needsAttention,
          value: "attention",
        },
        {
          description: "Signed up but email is not confirmed.",
          label: directoryCopy.unconfirmedBadge,
          value: "unconfirmed",
        },
        {
          description: "Auth accounts with no linked business.",
          label: copy.users.noBusinessLinked,
          value: "no_business",
        },
        {
          description: "Suspended or cancelled business access.",
          label: copy.users.overview.metrics.pausedAccessLabel,
          value: "paused",
        },
        {
          description: "Linked business has no active public quote link.",
          label: copy.users.quoteInactive,
          value: "quote_off",
        },
      ],
      title: directoryCopy.groupTitles.priority,
    },
    { options: planPriorityOptions, title: directoryCopy.groupTitles.plan },
    {
      options: accessPriorityOptions,
      title: directoryCopy.groupTitles.accessStatus,
    },
  ];
}

function formatDate(copy: AdminCopy, value: string | null): string {
  if (!value) {
    return copy.overview.activityMeta.noActivityYet;
  }

  return new Intl.DateTimeFormat(copy.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(copy: AdminCopy, value: string | null): string {
  if (!value) {
    return copy.overview.activityMeta.noActivityYet;
  }

  return new Intl.DateTimeFormat(copy.locale, {
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

function formatSlug(value: string | null, emptyLabel: string): string {
  return value ? `/quote/${value}` : emptyLabel;
}

function formatDuration(copy: AdminCopy, minutes: number): string {
  return copy.controls.sessionTimeoutDurationLabels[minutes] ?? `${minutes}m`;
}

function sessionPolicyLabel(
  copy: AdminCopy,
  mode: SessionTimeoutMode,
  minutes: number | null,
): string {
  if (mode === "after_duration") {
    return copy.controls.sessionPolicySummaryAfterDuration(
      formatDuration(copy, minutes ?? 480),
    );
  }

  return copy.controls.sessionPolicySummaryAlwaysOn;
}

function humanizeAdminKey(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAdminJsonValue(copy: AdminCopy, value: unknown): string {
  const metaCopy = copy.overview.activityMeta;
  if (value === null || value === undefined) {
    return metaCopy.emptyValue;
  }

  if (typeof value === "boolean") {
    return value ? metaCopy.stateOn : metaCopy.stateOff;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return value.replaceAll("_", " ");
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatAdminJsonValue(copy, item)).join(", ");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return metaCopy.noPriorValue;
    }

    return entries
      .map(([key, item]) => `${humanizeAdminKey(key)}: ${formatAdminJsonValue(copy, item)}`)
      .join("; ");
  }

  return String(value);
}

function actionLabel(copy: AdminCopy, actionType: string): string {
  const labels = copy.overview.activityMeta.actionLabels;
  return hasOwnKey(labels, actionType) ? labels[actionType] : humanizeAdminKey(actionType);
}

function formatActionChange(
  copy: AdminCopy,
  action: FounderAdminActionSummary,
): string {
  const metaCopy = copy.overview.activityMeta;
  if (action.actionType === "internal_note_added") {
    return action.newValues &&
      typeof action.newValues === "object" &&
      "internal_note_present" in action.newValues
      ? metaCopy.internalNotePresenceChanged
      : metaCopy.internalNoteSaved;
  }

  return `${formatAdminJsonValue(copy, action.previousValues)} -> ${formatAdminJsonValue(
    copy,
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

function paginationWindow(currentPage: number, pageCount: number): number[] {
  const windowSize = 5;
  const safePageCount = Math.max(1, pageCount);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safePageCount);
  const start = Math.max(
    1,
    Math.min(
      safeCurrentPage - Math.floor(windowSize / 2),
      safePageCount - windowSize + 1,
    ),
  );
  const end = Math.min(safePageCount, start + windowSize - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
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

function adminActivityHref(
  params: AdminSearchParams,
  updates: Partial<Pick<AdminSearchParams, "activityFilter" | "adminPanel">>,
): string {
  const merged: Pick<AdminSearchParams, "activityFilter" | "adminPanel"> = {
    activityFilter: params.activityFilter,
    adminPanel: params.adminPanel ?? "overview",
    ...updates,
  };
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value && value !== "all") {
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

function readActivityFilter(value: string | undefined): ActivityFilter {
  return activityFilterValues.some((filter) => filter === value)
    ? (value as ActivityFilter)
    : "all";
}

function actionActivityFilter(actionType: string): ActivityFilter {
  if (
    actionType.includes("status") ||
    actionType.includes("suspended") ||
    actionType.includes("reactivated") ||
    actionType.includes("cancelled")
  ) {
    return "access";
  }

  if (actionType.includes("quote_link")) {
    return "quote";
  }

  if (actionType.includes("plan")) {
    return "plan";
  }

  if (actionType.includes("cleanup") || actionType.includes("deleted")) {
    return "cleanup";
  }

  if (actionType.includes("note")) {
    return "notes";
  }

  if (actionType.includes("password") || actionType.includes("auth")) {
    return "auth";
  }

  return "system";
}

function activityFilterTone(
  filter: ActivityFilter,
): "amber" | "blue" | "emerald" | "neutral" | "red" {
  switch (filter) {
    case "access":
      return "red";
    case "auth":
      return "amber";
    case "cleanup":
      return "red";
    case "notes":
      return "blue";
    case "plan":
      return "emerald";
    case "quote":
      return "blue";
    case "system":
      return "neutral";
    case "all":
    default:
      return "neutral";
  }
}

function actionTargetHref(
  action: FounderAdminOverview["recentActions"][number],
  businessById: Map<string, FounderAdminBusiness>,
  params: AdminSearchParams,
): string {
  if (action.businessId && businessById.has(action.businessId)) {
    return adminBusinessHref(params, { businessId: action.businessId });
  }

  const filter = actionActivityFilter(action.actionType);

  if (filter === "auth") {
    return adminUsersHref(params, { adminPanel: "users" });
  }

  if (action.actionType.includes("lead") || action.actionType.includes("inbox")) {
    return "/admin?adminPanel=leads";
  }

  return adminActivityHref(params, {
    activityFilter: filter,
    adminPanel: "activity",
  });
}

function actionTargetLabel(
  copy: AdminCopy,
  action: FounderAdminOverview["recentActions"][number],
  businessById: Map<string, FounderAdminBusiness>,
): string {
  if (action.businessId) {
    return businessById.get(action.businessId)?.name ?? shortActionId(action.businessId);
  }

  if (action.actionType.includes("lead") || action.actionType.includes("inbox")) {
    return copy.overview.activityMeta.leadInboxTarget;
  }

  return copy.overview.activityMeta.platformTarget;
}

function actionActorLabel(
  copy: AdminCopy,
  action: FounderAdminOverview["recentActions"][number],
  usersById: Map<string, FounderAdminUser>,
): string {
  if (!action.actorUserId) {
    return copy.overview.activityMeta.systemActor;
  }

  const user = usersById.get(action.actorUserId);

  if (user) {
    return user.displayName ?? user.email;
  }

  return copy.overview.activityMeta.actorFallback(shortActionId(action.actorUserId));
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

function FounderAdminSafetyRail({ copy }: Readonly<{ copy: AdminCopy }>) {
  const safetyCopy = copy.businesses.detail.safetyRail;
  return (
    <details className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] p-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span className="text-[12px] font-black text-[var(--dash-text)]">
          {safetyCopy.title}
        </span>
        <StatusBadge tone="amber">{safetyCopy.guardedBadge}</StatusBadge>
      </summary>
      <div className="mt-3 grid gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-2.5">
          <p className="font-black text-[var(--dash-text)]">
            {safetyCopy.customerWorkspaceTitle}
          </p>
          <p className="mt-1">{safetyCopy.customerWorkspaceDescription}</p>
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-2.5">
          <p className="font-black text-[var(--dash-text)]">
            {safetyCopy.dryRunTitle}
          </p>
          <p className="mt-1">{safetyCopy.dryRunDescription}</p>
        </div>
      </div>
    </details>
  );
}

function healthCount(
  copy: AdminCopy,
  check: FounderProductionHealth["authAdmin"],
): string {
  if (!check.ok) {
    return check.status ? `HTTP ${check.status}` : copy.overview.productionHealthPanel.fail;
  }

  return check.count === null ? copy.overview.productionHealthPanel.ok : String(check.count);
}

function credentialKindLabel(
  copy: AdminCopy,
  kind: FounderProductionHealth["serviceCredentialKind"],
): string {
  return copy.overview.productionHealthPanel.serviceCredentialKinds[kind];
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
  copy,
  health,
}: Readonly<{ copy: AdminCopy; health: FounderProductionHealth | null }>) {
  const healthCopy = copy.overview.productionHealthPanel;

  if (!health) {
    return (
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <SectionHeader
          description={healthCopy.runtimeDescription}
          title={healthCopy.title}
        />
        <AdminNotice tone="error">
          {healthCopy.diagnosticsUnavailable}
        </AdminNotice>
      </DashboardCard>
    );
  }

  const checks = [
    [
      healthCopy.supabaseTarget,
      health.supabaseTargetMatchesCanonical
        ? healthCopy.supabaseTargetCanonical
        : healthCopy.supabaseTargetMismatch,
      health.supabaseTargetMatchesCanonical,
    ],
    [
      healthCopy.serviceKey,
      credentialKindLabel(copy, health.serviceCredentialKind),
      isServiceCredentialLikelyPrivileged(health),
    ],
    [
      healthCopy.keyProject,
      health.serviceCredentialMatchesSupabaseRef === false
        ? healthCopy.keyProjectMismatch
        : health.serviceCredentialMatchesSupabaseRef === true
          ? healthCopy.keyProjectMatches
          : healthCopy.keyProjectNotEncoded,
      health.serviceCredentialMatchesSupabaseRef !== false,
    ],
    [healthCopy.authSdk, healthCount(copy, health.authAdmin), health.authAdmin.ok],
    [healthCopy.authRest, healthCount(copy, health.authRest), health.authRest.ok],
    [healthCopy.businesses, healthCount(copy, health.businesses), health.businesses.ok],
    [healthCopy.members, healthCount(copy, health.businessMembers), health.businessMembers.ok],
    [healthCopy.profiles, healthCount(copy, health.profiles), health.profiles.ok],
    [healthCopy.quoteLinks, healthCount(copy, health.publicLinks), health.publicLinks.ok],
    [healthCopy.actionLog, healthCount(copy, health.recentActions), health.recentActions.ok],
    [
      healthCopy.deletionRequests,
      healthCount(copy, health.deletionRequests),
      health.deletionRequests.ok,
    ],
  ] as const;
  const unhealthy = checks.some(([, , ok]) => !ok);

  return (
    <DashboardCard className="p-3 sm:p-4" variant="priority">
      <SectionHeader
        action={
          <StatusBadge tone={unhealthy ? "red" : "emerald"}>
            {unhealthy ? healthCopy.needsAttention : healthCopy.healthy}
          </StatusBadge>
        }
        description={healthCopy.runtimeUnavailableDescription}
        title={healthCopy.productionHealth}
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
                {ok ? healthCopy.ok : healthCopy.fail}
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
          {healthCopy.supabaseProjectRefLabel}: {health.supabaseHostRef}
        </p>
      ) : null}
      {health.serviceCredentialIssuerRef ? (
        <p className="mt-1 truncate text-[11px] leading-5 text-[var(--dash-text-secondary)]">
          {healthCopy.serviceCredentialIssuerRefLabel}: {health.serviceCredentialIssuerRef}
          {health.serviceCredentialMatchesSupabaseRef === false
            ? ` ${healthCopy.serviceCredentialIssuerRefMismatch}`
            : ""}
        </p>
      ) : null}
      {health.authAdmin.status || health.authRest.status ? (
        <p className="mt-1 text-[11px] leading-5 text-[var(--dash-text-secondary)]">
          {healthCopy.statusSummary(
            String(health.authAdmin.status ?? healthCopy.noStatus),
            String(health.authRest.status ?? healthCopy.noStatus),
          )}
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

function FounderAccessBlocked({
  copy,
  message,
}: Readonly<{ copy: AdminCopy; message: string }>) {
  return (
    <main
      className="biz-founder-admin min-h-svh overflow-x-clip px-5 py-7 text-[var(--dash-text)] sm:px-6"
    >
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-[720px] items-center">
        <DashboardCard className="p-6 sm:p-8" variant="priority">
          <PageHeader
            actions={<StatusBadge tone="amber">{copy.accessBlocked.badge}</StatusBadge>}
            description={copy.accessBlocked.description}
            eyebrow={copy.accessBlocked.eyebrow}
            title={copy.accessBlocked.title}
          />
          <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--dash-text-secondary)]">
            <AdminNotice tone="error">{message}</AdminNotice>
            <p>{copy.accessBlocked.help}</p>
            <div className="flex flex-wrap gap-2">
              <Link className={buttonClass} href="/dashboard">
                {copy.accessBlocked.backToDashboard}
              </Link>
              <Link className={buttonClass} href="/auth/sign-in">
                {copy.accessBlocked.signIn}
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
  copy,
}: Readonly<{ business: FounderAdminBusiness; copy: AdminCopy }>) {
  const sessionTimeoutModeOptions = [
    {
      label: copy.controls.sessionTimeoutModeLabels.always_on,
      value: "always_on" as const,
    },
    {
      label: copy.controls.sessionTimeoutModeLabels.after_duration,
      value: "after_duration" as const,
    },
  ];
  const sessionTimeoutOptions = [
    15, 30, 60, 240, 480, 720, 1440, 10080,
  ].map((value) => ({
    label: copy.controls.sessionTimeoutDurationLabels[value],
    value,
  }));

  return (
    <form action={updateFounderSessionPolicyAction} className={controlPanelClass}>
      <input name="businessId" type="hidden" value={business.businessId} />
      <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
        {copy.controls.sessionPolicy}
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
        {copy.controls.signOutDuration}
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
        placeholder={copy.controls.sessionPolicyNotePlaceholder}
      />
      <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
        {copy.controls.sessionPolicyHelp}
      </p>
      <button className={`${primaryButtonClass} mt-3 w-full`} type="submit">
        {copy.controls.savePolicy}
      </button>
    </form>
  );
}

function FounderSystemChangeLog({
  actions,
  copy,
}: Readonly<{ actions: FounderAdminActionSummary[]; copy: AdminCopy }>) {
  const detailCopy = copy.businesses.detail;

  return (
    <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {detailCopy.auditLog.title}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {detailCopy.auditLog.description}
          </p>
        </div>
        <StatusBadge tone="blue">{detailCopy.auditLog.badgeCount(actions.length)}</StatusBadge>
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
                  {actionLabel(copy, action.actionType)}
                </p>
                <p className="mt-1 font-bold text-[var(--dash-text-muted)]">
                  {formatDateTime(copy, action.createdAt)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="break-words font-semibold leading-5 text-[var(--dash-text-secondary)]">
                  {formatActionChange(copy, action)}
                </p>
                {action.note ? (
                  <p className="mt-1 break-words leading-5 text-[var(--dash-text-muted)]">
                    {detailCopy.auditLog.notePrefix}: {action.note}
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
            {detailCopy.auditLog.emptyState}
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
  copy: AdminCopy,
  actions: FounderAdminActionSummary[],
  actionTypes: ReadonlyArray<string>,
): { updatedAt: string; updatedBy: string } {
  const action = latestAction(actions, actionTypes);

  return {
    updatedAt: action
      ? formatDateTime(copy, action.createdAt)
      : copy.businesses.detail.auditLog.notRecordedYet,
    updatedBy: copy.businesses.detail.auditLog.updatedByFounderAdmin,
  };
}

function recommendedPriorityAction(
  business: FounderAdminBusiness,
  copy: AdminCopy,
): {
  tone: "amber" | "blue" | "emerald" | "red";
  text: string;
} {
  if (business.status === "suspended" || business.status === "cancelled") {
    return {
      tone: "red",
      text: copy.businesses.detail.recommendationStates.blockedUntilRestored,
    };
  }

  if (business.status === "onboarding" && !business.publicLinkActive) {
    return {
      tone: "blue",
      text: copy.businesses.detail.recommendationStates.holdQuoteLinkDuringOnboarding,
    };
  }

  if (business.status === "active" && !business.publicLinkActive) {
    return {
      tone: "amber",
      text: copy.businesses.detail.recommendationStates.activateQuoteLink,
    };
  }

  return {
    tone: "emerald",
    text: copy.businesses.detail.recommendationStates.readyForDailyUse,
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
  copy,
}: Readonly<{ audit: { updatedAt: string; updatedBy: string }; copy: AdminCopy }>) {
  return (
    <div className="grid gap-1 text-[11px] font-bold text-[var(--dash-text-muted)] sm:grid-cols-2">
      <p>
        {copy.businesses.detail.auditLog.lastUpdatedLabel}: {audit.updatedAt}
      </p>
      <p className="sm:text-right">
        {copy.businesses.detail.auditLog.updatedByLabel}: {audit.updatedBy}
      </p>
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
  copy,
}: Readonly<{ actions: FounderAdminActionSummary[]; copy: AdminCopy }>) {
  const detailCopy = copy.businesses.detail;
  const panelCopy = detailCopy.recentChangesPanel;
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {detailCopy.recentChangesTitle}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {panelCopy.description}
          </p>
        </div>
        <StatusBadge tone="blue">{panelCopy.loggedBadge(actions.length)}</StatusBadge>
      </div>
      <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
        {actions.length > 0 ? (
          actions.slice(0, 4).map((action) => (
            <div
              className="grid min-w-0 gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5 text-[12px]"
              key={action.id}
            >
              <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div className="min-w-0">
                  <p className="break-words font-black text-[var(--dash-text)] [overflow-wrap:anywhere]">
                    {actionLabel(copy, action.actionType)}
                  </p>
                  <p className="mt-1 break-words font-semibold text-[var(--dash-text-secondary)] [overflow-wrap:anywhere]">
                    {formatActionChange(copy, action)}
                  </p>
                </div>
                <p className="text-left font-bold text-[var(--dash-text-muted)] sm:text-right">
                  {formatDate(copy, action.createdAt)}
                </p>
              </div>
              <p className="break-all font-bold text-[var(--dash-text-muted)]">
                trace_{shortActionId(action.id)}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-6 text-center text-[12px] text-[var(--dash-text-secondary)]">
            {panelCopy.emptyState}
          </p>
        )}
      </div>
      <Link className={`${buttonClass} mt-4 w-full justify-center`} href="/admin?adminPanel=activity">
        {panelCopy.viewFullActivity}
      </Link>
    </section>
  );
}

function FounderBusinessMasterRail({
  businesses,
  copy,
  params,
  selectedBusinessId,
}: Readonly<{
  businesses: FounderAdminBusiness[];
  copy: AdminCopy;
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
  const filteredBusinessIds = new Set(
    filteredBusinesses.map((business) => business.businessId),
  );
  const hiddenMatchCount = Math.max(
    filteredBusinesses.length -
      visibleBusinesses.filter((business) =>
        filteredBusinessIds.has(business.businessId),
      ).length,
    0,
  );

  // Source guard mirror for localized labels: Search businesses; Showing the first 10 matched workspaces.
  return (
    <aside className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 shadow-sm xl:sticky xl:top-[5.75rem]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {copy.businesses.title}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {copy.businesses.subtitle}
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
          {copy.businesses.searchLabel}
          <input
            className={inputClass}
            defaultValue={businessQuery}
            name="businessQuery"
            placeholder={copy.businesses.searchPlaceholder}
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <button className={`${primaryButtonClass} min-h-9`} type="submit">
            {copy.businesses.searchSubmit}
          </button>
          <Link
            className={`${buttonClass} min-h-9 justify-center`}
            href={adminBusinessHref(params, { businessQuery: undefined })}
          >
            {copy.businesses.reset}
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
                  {copy.users.accessStatusOptions[business.status]}
                </StatusBadge>
                <StatusBadge tone={planTone(business.planSlug)}>
                  {copy.businesses.detail.planLabels[business.planSlug]}
                </StatusBadge>
                <StatusBadge tone={leadBlocked ? "amber" : "emerald"}>
                  {leadBlocked
                    ? copy.businesses.intakeOff
                    : copy.businesses.intakeOpen}
                </StatusBadge>
              </div>
            </Link>
          );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-5 text-center text-[12px] font-semibold leading-5 text-[var(--dash-text-secondary)]">
            {copy.businesses.noMatches}
          </p>
        )}
      </div>
      {hiddenMatchCount > 0 ? (
        <p className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          {copy.businesses.hiddenMatches(hiddenMatchCount)}
        </p>
      ) : null}
      {selectedBusiness &&
      normalizedBusinessQuery &&
      !filteredBusinesses.some(
        (business) => business.businessId === selectedBusiness.businessId,
      ) ? (
        <p className="mt-3 rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          {copy.businesses.selectedWorkspaceVisible}
        </p>
      ) : null}
    </aside>
  );
}

function BusinessControlCard({
  business,
  copy,
  dryRun,
}: Readonly<{
  business: FounderAdminBusiness;
  copy: AdminCopy;
  dryRun?: FounderCleanupDryRun | null;
}>) {
  const detailCopy = copy.businesses.detail;
  const statusLabels: Record<BusinessStatus, string> = {
    active: copy.users.accessStatusOptions.active,
    cancelled: copy.users.accessStatusOptions.cancelled,
    onboarding: copy.users.accessStatusOptions.onboarding,
    suspended: copy.users.accessStatusOptions.suspended,
  };
  const statusOptions = [
    { label: statusLabels.onboarding, value: "onboarding" as const },
    { label: statusLabels.active, value: "active" as const },
    { label: statusLabels.suspended, value: "suspended" as const },
    { label: statusLabels.cancelled, value: "cancelled" as const },
  ];
  const planLabels = detailCopy.planLabels;
  const planOptions = [
    { label: planLabels.founder_pilot, value: "founder_pilot" as const },
    { label: planLabels.starter, value: "starter" as const },
    { label: planLabels.pro, value: "pro" as const },
    { label: planLabels.paused, value: "paused" as const },
  ];
  const workspaceKindLabels = detailCopy.workspaceKindLabels;
  const workspaceKindOptions = [
    {
      label: workspaceKindLabels.production_customer,
      value: "production_customer" as const,
    },
    { label: workspaceKindLabels.founder_test, value: "founder_test" as const },
    { label: workspaceKindLabels.demo, value: "demo" as const },
    { label: workspaceKindLabels.seed, value: "seed" as const },
  ];
  const accessAudit = controlAuditText(copy, business.actionLog, [
    "status_changed",
    "business_reactivated",
    "business_suspended",
    "business_cancelled",
  ]);
  const planAudit = controlAuditText(copy, business.actionLog, ["plan_changed"]);
  const quoteAudit = controlAuditText(copy, business.actionLog, [
    "quote_link_disabled",
    "quote_link_enabled",
  ]);
  const recommendation = recommendedPriorityAction(business, copy);
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
    ? formatDateTime(copy, business.actionLog[0].createdAt)
    : detailCopy.noAdminChanges;

  return (
    <div className="grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)] gap-3">
      <section className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:p-3.5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--dash-text)]">
              {detailCopy.snapshotTitle}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {detailCopy.snapshotDescription(business.name)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusBadge tone="neutral">{business.ownerEmail}</StatusBadge>
              <StatusBadge tone="blue">
                {formatSlug(business.publicSlug, detailCopy.tiles.quoteLinkInactive)}
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
              <StatusBadge
                tone={
                  business.sessionTimeoutMode === "always_on"
                    ? "emerald"
                    : "amber"
                }
              >
                {sessionPolicyLabel(
                  copy,
                  business.sessionTimeoutMode,
                  business.sessionTimeoutMinutes,
                )}
              </StatusBadge>
            </div>
          </div>
          <Link className={buttonClass} href="/dashboard/business-profile">
            {detailCopy.viewFullCustomerProfile}
          </Link>
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <SnapshotTile
            description={
              business.status === "active"
                ? detailCopy.tiles.accessStatusActiveDescription
                : detailCopy.tiles.accessStatusLimitedDescription
            }
            label={detailCopy.tiles.accessStatus}
            tone={statusTone(business.status)}
            value={statusLabels[business.status]}
          />
          <SnapshotTile
            description={
              business.publicLinkActive
                ? detailCopy.tiles.quoteLinkActiveDescription
                : detailCopy.tiles.quoteLinkInactiveDescription
            }
            label={detailCopy.tiles.quoteLink}
            tone={quoteLinkTone(business.publicLinkActive)}
            value={
              business.publicLinkActive
                ? detailCopy.tiles.quoteLinkActive
                : detailCopy.tiles.quoteLinkInactive
            }
          />
          <SnapshotTile
            description={detailCopy.tiles.planDescription}
            label={detailCopy.tiles.plan}
            tone={planTone(business.planSlug)}
            value={planLabels[business.planSlug]}
          />
          <SnapshotTile
            description={
              business.sessionTimeoutMode === "always_on"
                ? detailCopy.tiles.sessionPolicyAlwaysOnDescription
                : detailCopy.tiles.sessionPolicyTimedDescription
            }
            label={detailCopy.tiles.sessionPolicy}
            tone={business.sessionTimeoutMode === "always_on" ? "emerald" : "amber"}
            value={sessionPolicyLabel(
              copy,
              business.sessionTimeoutMode,
              business.sessionTimeoutMinutes,
            )}
          />
          <SnapshotTile
            description={latestAdminChange}
            label={detailCopy.tiles.auditEvents}
            tone={business.actionLog.length > 0 ? "blue" : "neutral"}
            value={detailCopy.auditLog.badgeCount(business.actionLog.length)}
          />
        </div>
      </section>

      <section className={toolboxSectionClass}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-black text-[var(--dash-text)]">
              {detailCopy.priorityTitle}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {detailCopy.priorityDescription}
            </p>
          </div>
          <StatusBadge
            tone={business.status === "active" ? "emerald" : statusTone(business.status)}
          >
            {business.status === "active"
              ? detailCopy.dailyUse
              : statusLabels[business.status]}
          </StatusBadge>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_280px]">
          <div className="grid gap-2">
            <form action={updateFounderStatusAction} className={controlPanelClass}>
                <input name="businessId" type="hidden" value={business.businessId} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <MiniControlIcon tone={statusTone(business.status)}>U</MiniControlIcon>
                    <p className="text-sm font-black text-[var(--dash-text)]">
                      {detailCopy.accessControl.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {detailCopy.accessControl.description}
                    </p>
                  </div>
                  <StatusBadge tone={statusTone(business.status)}>
                    {statusLabels[business.status]}
                  </StatusBadge>
                </div>
                <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
                  {detailCopy.accessControl.changeLabel}
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
                  {detailCopy.accessControl.warning}
                </p>
                <input
                  className={inputClass}
                  name="note"
                  placeholder={copy.controls.accessNotePlaceholder}
                />
                <ControlAuditMeta audit={accessAudit} copy={copy} />
                <button className={`${primaryButtonClass} w-full`} type="submit">
                  {detailCopy.saveAccess}
                </button>
              </form>
            <p className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-primary-strong)]">
              {detailCopy.accessControl.onboardingNote}
            </p>
          </div>

          <div className="grid gap-2">
            <form action={updateFounderPlanAction} className={controlPanelClass}>
                <input name="businessId" type="hidden" value={business.businessId} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <MiniControlIcon tone={planTone(business.planSlug)}>P</MiniControlIcon>
                    <p className="text-sm font-black text-[var(--dash-text)]">
                      {detailCopy.planControl.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {detailCopy.planControl.description}
                    </p>
                  </div>
                  <StatusBadge tone={planTone(business.planSlug)}>
                    {planLabels[business.planSlug]}
                  </StatusBadge>
                </div>
                <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
                  {detailCopy.planControl.changeLabel}
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
                  {detailCopy.planControl.warning}
                </p>
                <input
                  className={inputClass}
                  name="note"
                  placeholder={copy.controls.planNotePlaceholder}
                />
                <ControlAuditMeta audit={planAudit} copy={copy} />
                <button className={`${primaryButtonClass} w-full`} type="submit">
                  {detailCopy.savePlan}
                </button>
              </form>
            <p className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-primary-strong)]">
              {detailCopy.planControl.pilotNotice}
            </p>
          </div>

          <div className="grid gap-2">
            <form action={updateFounderQuoteLinkAction} className={controlPanelClass}>
                <input name="businessId" type="hidden" value={business.businessId} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <MiniControlIcon tone={quoteLinkTone(business.publicLinkActive)}>Q</MiniControlIcon>
                    <p className="text-sm font-black text-[var(--dash-text)]">
                      {detailCopy.quoteLinkControl.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {detailCopy.quoteLinkControl.description}
                    </p>
                  </div>
                  <StatusBadge tone={quoteLinkTone(business.publicLinkActive)}>
                    {business.publicLinkActive
                      ? detailCopy.tiles.quoteLinkActive
                      : detailCopy.tiles.quoteLinkInactive}
                  </StatusBadge>
                </div>
                <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
                  {detailCopy.quoteLinkControl.changeLabel}
                  <select
                    className={inputClass}
                    defaultValue={business.publicLinkActive ? "true" : "false"}
                    name="quoteLinkActive"
                  >
                    <option value="true">{detailCopy.tiles.quoteLinkActive}</option>
                    <option value="false">{detailCopy.tiles.quoteLinkInactive}</option>
                  </select>
                </label>
                <p className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {detailCopy.quoteLinkControl.warning}
                </p>
                <input
                  className={inputClass}
                  name="note"
                  placeholder={copy.controls.quoteLinkNotePlaceholder}
                />
                <ControlAuditMeta audit={quoteAudit} copy={copy} />
                <button className={`${primaryButtonClass} w-full`} type="submit">
                  {detailCopy.saveQuoteLink}
                </button>
              </form>
            <p className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-warning-strong)]">
              {detailCopy.quoteLinkControl.inactiveNotice}
            </p>
          </div>

          <aside className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 sm:p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  {detailCopy.recommendedTitle}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {detailCopy.recommendedDescription}
                </p>
              </div>
              <StatusBadge tone={recommendation.tone}>
                {detailCopy.nextBadge}
              </StatusBadge>
            </div>
            <div className="mt-4 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-3 text-[12px] leading-5">
              <p className="font-black text-[var(--dash-primary-strong)]">
                {recommendation.text}
              </p>
              <p className="mt-3 font-bold text-[var(--dash-text-secondary)]">
                {detailCopy.whyLabel}
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <p className="text-[12px] font-black text-[var(--dash-text)]">
                {detailCopy.recentChangesTitle}
              </p>
              {recentPriorityActions.length > 0 ? (
                recentPriorityActions.slice(0, 2).map((action) => (
                  <p
                    className="break-words rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[12px] font-bold text-[var(--dash-text-secondary)] [overflow-wrap:anywhere]"
                  key={action.id}
                >
                  {actionLabel(copy, action.actionType)}
                </p>
              ))
              ) : (
                <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-3 text-[12px] text-[var(--dash-text-secondary)]">
                  {detailCopy.noAdminChanges}
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-3 2xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
        <section className={toolboxSectionClass}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  {detailCopy.toolsTitle}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {detailCopy.toolsDescription}
                </p>
              </div>
              <StatusBadge tone="amber">{detailCopy.toolsControlled}</StatusBadge>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 2xl:grid-cols-1">
          <form
            action={updateFounderWorkspaceKindAction}
            className={controlPanelClass}
          >
            <input name="businessId" type="hidden" value={business.businessId} />
            <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
              {detailCopy.workspaceKind}
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
              {detailCopy.workspaceKindHelp}
            </p>
            <input
              className={inputClass}
              name="note"
              placeholder={copy.controls.workspaceKindNotePlaceholder}
            />
            <ControlAuditMeta
              audit={controlAuditText(copy, business.actionLog, ["workspace_kind_changed"])}
              copy={copy}
            />
            <button className={`${primaryButtonClass} w-full`} type="submit">
              {detailCopy.saveKind}
            </button>
          </form>

          <FounderSessionPolicyForm business={business} copy={copy} />
            </div>
        </section>

        <section className={toolboxSectionClass}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-[var(--dash-text)]">
                  {detailCopy.notesTitle}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {detailCopy.notesDescription}
                </p>
              </div>
              <StatusBadge tone="red">{detailCopy.notesSensitive}</StatusBadge>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-3 xl:grid-cols-[minmax(260px,0.9fr)_minmax(280px,1fr)]">
          <form
            action={updateFounderInternalNoteAction}
            className={controlPanelClass}
          >
            <input name="businessId" type="hidden" value={business.businessId} />
            <label className="grid gap-1.5 text-sm font-bold text-[var(--dash-text)]">
              {detailCopy.internalNote}
              <textarea
                className={`${textareaClass} min-h-[84px]`}
                defaultValue={business.internalNote ?? ""}
                name="internalNote"
                placeholder={copy.controls.internalNotePlaceholder}
              />
            </label>
            <button className={`${primaryButtonClass} w-full`} type="submit">
              {detailCopy.saveNote}
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
            <FounderAdminSafetyRail copy={copy} />
          </div>
            </div>
          {dryRun ? (
            <div className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3 text-sm">
              <p className="font-black text-[var(--dash-text)]">
                {detailCopy.cleanupDryRunCounts}
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
                {detailCopy.fullSystemChangeLog}
              </span>
              <StatusBadge tone="blue">
                {detailCopy.auditLog.badgeCount(business.actionLog.length)}
              </StatusBadge>
            </summary>
            <div className="border-t border-[var(--dash-border)] p-3">
              <FounderSystemChangeLog actions={business.actionLog} copy={copy} />
            </div>
          </details>
        </section>

        <RecentAdminChangesPanel actions={business.actionLog} copy={copy} />
      </div>

      <p className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-4 py-3 text-[12px] font-bold leading-5 text-[var(--dash-primary-strong)]">
        {detailCopy.allChangesNote}
      </p>
    </div>
  );
}

function FounderBusinessesSection({
  businessById,
  copy,
  dryRun,
  params,
  recentActions,
  totals,
  usersTotal,
}: Readonly<{
  businessById: Map<string, FounderAdminBusiness>;
  copy: AdminCopy;
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
    ? recommendedPriorityAction(featuredBusiness, copy)
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
                {copy.businesses.openInbox}
              </Link>
              <Link className={buttonClass} href="/admin?adminPanel=health">
                {copy.businesses.checkHealth}
              </Link>
              <Link className={primaryButtonClass} href="/admin?adminPanel=users">
                {copy.businesses.manageUsers}
              </Link>
            </>
          }
          description={copy.businesses.operationsDescription}
          eyebrow={copy.businesses.operationsEyebrow}
          title={copy.businesses.operationsTitle}
        />

        {featuredBusiness && featuredRecommendation ? (
          <section className="mt-4 grid gap-3 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-primary-strong)]">
                {copy.businesses.priorityWorkspace}
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
                {copy.users.accessStatusOptions[featuredBusiness.status]}
              </StatusBadge>
              <Link
                className={primaryButtonClass}
                href={adminBusinessHref(params, {
                  businessId: featuredBusiness.businessId,
                })}
              >
                {copy.businesses.openControls}
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
          copy={copy}
          params={params}
          selectedBusinessId={featuredBusiness?.businessId ?? null}
        />
        <DashboardCard className="min-w-0 p-3 sm:p-4" variant="elevated">
          {featuredBusiness ? (
            <BusinessControlCard
              business={featuredBusiness}
              copy={copy}
              dryRun={
                dryRun?.businessId === featuredBusiness.businessId ? dryRun : null
              }
            />
          ) : (
            <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-4 py-8 text-center text-sm text-[var(--dash-text-secondary)]">
              {copy.businesses.emptyWorkspace}
            </p>
          )}
        </DashboardCard>
      </div>

      <FounderRecentActionsPanel actions={recentActions} copy={copy} />
    </div>
  );
}

function FounderUsersOverviewPanel({
  copy,
  shownUsers,
  usersSearchMode,
  usersTotal,
}: Readonly<{
  copy: AdminCopy;
  shownUsers: FounderAdminUser[];
  usersSearchMode: "auth_filter" | "paged";
  usersTotal: number;
}>) {
  const overviewCopy = copy.users.overview;
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
              {overviewCopy.actions.businesses}
            </Link>
            <Link className={buttonClass} href="/admin?adminPanel=health">
              {overviewCopy.actions.health}
            </Link>
            <StatusBadge tone="amber">{overviewCopy.gatedOperations}</StatusBadge>
          </>
        }
        description={overviewCopy.description}
        eyebrow={overviewCopy.eyebrow}
        title={overviewCopy.title}
      />
      <section className="mt-4 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            detail={overviewCopy.metrics.authUsersDescription}
            label={overviewCopy.metrics.authUsersLabel}
            tone="blue"
            value={usersTotal}
          />
          <MetricCard
            detail={overviewCopy.metrics.unconfirmedDescription}
            label={overviewCopy.metrics.unconfirmedLabel}
            tone={unconfirmed > 0 ? "amber" : "emerald"}
            value={unconfirmed}
          />
          <MetricCard
            detail={overviewCopy.metrics.noBusinessDescription}
            label={overviewCopy.metrics.noBusinessLabel}
            tone={unlinked > 0 ? "amber" : "neutral"}
            value={unlinked}
          />
          <MetricCard
            detail={overviewCopy.metrics.pausedAccessDescription}
            label={overviewCopy.metrics.pausedAccessLabel}
            tone={pausedAccess > 0 ? "red" : "emerald"}
            value={pausedAccess}
          />
        </div>
        <div className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--dash-warning-strong)]">
            {overviewCopy.operatingRule.title}
          </p>
          <p className="mt-2 text-[12px] font-bold leading-5 text-[var(--dash-text)]">
            {overviewCopy.operatingRule.searchModeLabel}:{" "}
            {usersSearchMode === "auth_filter"
              ? overviewCopy.operatingRule.searchModeIndexed
              : overviewCopy.operatingRule.searchModePaged}
            . {overviewCopy.operatingRule.supportGuard}
          </p>
          <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {overviewCopy.operatingRule.description}
          </p>
        </div>
      </section>
    </DashboardCard>
  );
}

function LockedAccessManagementPanel({
  copy,
}: Readonly<{ copy: AdminCopy }>) {
  const lockedAccessCopy = copy.users.lockedAccess;
  const actions = [
    lockedAccessCopy.items.inviteMember,
    lockedAccessCopy.items.changeRole,
    lockedAccessCopy.items.suspendAccess,
    lockedAccessCopy.items.removeFromWorkspace,
  ] as const;

  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {lockedAccessCopy.title}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {lockedAccessCopy.description}
          </p>
        </div>
        <StatusBadge tone="amber">{lockedAccessCopy.blocked}</StatusBadge>
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
              <StatusBadge tone="red">{lockedAccessCopy.blocked}</StatusBadge>
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

function FounderAdminCapabilityMatrix({
  copy,
}: Readonly<{ copy: AdminCopy }>) {
  const capabilityCopy = copy.users.capabilityMatrix;
  const capabilities: ReadonlyArray<{
    detail: string;
    label: string;
    tone: "amber" | "blue" | "emerald" | "neutral" | "red";
    value: string;
  }> = [
    {
      detail: capabilityCopy.items.planStatusQuoteLink.detail,
      label: capabilityCopy.items.planStatusQuoteLink.label,
      tone: "emerald",
      value: capabilityCopy.items.planStatusQuoteLink.value,
    },
    {
      detail: capabilityCopy.items.leadInboxCleanup.detail,
      label: capabilityCopy.items.leadInboxCleanup.label,
      tone: "amber",
      value: capabilityCopy.items.leadInboxCleanup.value,
    },
    {
      detail: capabilityCopy.items.passwordReset.detail,
      label: capabilityCopy.items.passwordReset.label,
      tone: "blue",
      value: capabilityCopy.items.passwordReset.value,
    },
    {
      detail: capabilityCopy.items.syntheticLoginCleanup.detail,
      label: capabilityCopy.items.syntheticLoginCleanup.label,
      tone: "amber",
      value: capabilityCopy.items.syntheticLoginCleanup.value,
    },
    {
      detail: capabilityCopy.items.inviteRoleSuspend.detail,
      label: capabilityCopy.items.inviteRoleSuspend.label,
      tone: "red",
      value: capabilityCopy.items.inviteRoleSuspend.value,
    },
    {
      detail: capabilityCopy.items.customerAccountDeletion.detail,
      label: capabilityCopy.items.customerAccountDeletion.label,
      tone: "red",
      value: capabilityCopy.items.customerAccountDeletion.value,
    },
  ];

  return (
    <DashboardCard className="p-4 sm:p-5">
      <SectionHeader
        action={<StatusBadge tone="amber">{capabilityCopy.gateAware}</StatusBadge>}
        description={capabilityCopy.description}
        title={capabilityCopy.title}
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
  copy,
  user,
}: Readonly<{ copy: AdminCopy; user: FounderAdminUser }>) {
  const accountSupportCopy = copy.users.accountSupport;
  const canRequestReset = Boolean(user.authEmail) && !user.isFounder;

  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {accountSupportCopy.title}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {accountSupportCopy.description}
          </p>
        </div>
        <StatusBadge tone={canRequestReset ? "blue" : "amber"}>
          {canRequestReset
            ? accountSupportCopy.available
            : accountSupportCopy.restricted}
        </StatusBadge>
      </div>

      {canRequestReset ? (
        <form action={founderPasswordResetAction} className={controlPanelClass}>
          <input name="targetUserId" type="hidden" value={user.userId} />
          <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {accountSupportCopy.resetDescription}
          </p>
          <button className={`${primaryButtonClass} w-full`} type="submit">
            {accountSupportCopy.sendPasswordReset}
          </button>
        </form>
      ) : (
        <div className={controlPanelClass}>
          <p className="text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
            {accountSupportCopy.resetUnavailableDescription}
          </p>
          <button className={`${disabledButtonClass} w-full`} disabled type="button">
            {accountSupportCopy.passwordResetUnavailable}
          </button>
        </div>
      )}

      <div className={controlPanelClass}>
        <p className="text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          {accountSupportCopy.emergencyDescription}
        </p>
        <button className={`${disabledButtonClass} w-full`} disabled type="button">
          {accountSupportCopy.emergencyLocked}
        </button>
      </div>
    </section>
  );
}

function UserAccountSafetyPanel({
  copy,
  user,
}: Readonly<{ copy: AdminCopy; user: FounderAdminUser }>) {
  const accountSafetyCopy = copy.users.accountSafety;
  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {accountSafetyCopy.title}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {accountSafetyCopy.description}
          </p>
        </div>
        <StatusBadge tone={user.authDeletionBlockedReason ? "amber" : "red"}>
          {user.authDeletionBlockedReason
            ? accountSafetyCopy.protected
            : accountSafetyCopy.doubleConfirm}
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
  copy,
  linkedBusiness,
  params,
  user,
}: Readonly<{
  copy: AdminCopy;
  linkedBusiness: FounderAdminBusiness | null;
  params: AdminSearchParams;
  user: FounderAdminUser;
}>) {
  const workspaceDetailCopy = copy.users.workspaceDetail;
  const detailCopy = copy.businesses.detail;
  const planLabels = detailCopy.planLabels;
  const workspaceKindLabels = detailCopy.workspaceKindLabels;

  return (
    <section className={`${toolboxSectionClass} content-start`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {workspaceDetailCopy.title}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {workspaceDetailCopy.description}
          </p>
        </div>
        <StatusBadge tone={userAccessTone(user.businessAccessStatus)}>
          {formatUserValue(user.businessAccessStatus)}
        </StatusBadge>
      </div>
      <dl className="grid gap-2 text-[12px] sm:grid-cols-2">
        {[
          [
            workspaceDetailCopy.fields.business,
            user.businessName ?? copy.users.noBusinessLinked,
          ],
          [workspaceDetailCopy.fields.role, formatUserValue(user.membershipRole)],
          [workspaceDetailCopy.fields.membership, formatUserValue(user.membershipStatus)],
          [
            workspaceDetailCopy.fields.plan,
            user.planSlug ? planLabels[user.planSlug] : copy.users.noPlan,
          ],
          [
            workspaceDetailCopy.fields.quoteLink,
            user.publicLinkActive ? copy.users.quoteActive : copy.users.quoteInactive,
          ],
          [
            workspaceDetailCopy.fields.workspaceKind,
            linkedBusiness
              ? workspaceKindLabels[linkedBusiness.workspaceKind]
              : copy.users.none,
          ],
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
          {workspaceDetailCopy.openBusinessControls}
        </Link>
      ) : (
        <p className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-[12px] font-bold leading-5 text-[var(--dash-text-secondary)]">
          {workspaceDetailCopy.repairNotice}
        </p>
      )}
    </section>
  );
}

function FounderUsersSection({
  businessById,
  copy,
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
  copy: AdminCopy;
  params: AdminSearchParams;
  shownUsers: FounderAdminUser[];
  users: FounderAdminUser[];
  usersLastPage: number;
  usersPage: number;
  usersPageSize: number;
  usersSearchMode: "auth_filter" | "paged";
  usersTotal: number;
}>) {
  const directoryCopy = copy.users.directory;
  const hasPreviousPage = usersPage > 1;
  const hasNextPage = usersPage < usersLastPage;
  const selectedPriority = safeParam(params.userPriority);
  const userPriorityGroups = buildUserPriorityGroups(copy);
  const userPageStart = usersTotal === 0 ? 0 : (usersPage - 1) * usersPageSize + 1;
  const userPageEnd =
    usersTotal === 0
      ? 0
      : Math.min(userPageStart + Math.max(users.length, shownUsers.length) - 1, usersTotal);
  const userPaginationPages = paginationWindow(usersPage, usersLastPage);

  // Source guard mirror for localized pagination: User directory pagination.
  return (
    <div className="grid gap-3">
      <FounderUsersOverviewPanel
        copy={copy}
        shownUsers={shownUsers}
        usersSearchMode={usersSearchMode}
        usersTotal={usersTotal}
      />

      <DashboardCard className="space-y-4 p-2.5 sm:p-5" variant="elevated">
        <section aria-labelledby="founder-users-list-title" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p
                className="text-sm font-black text-[var(--dash-text)]"
                id="founder-users-list-title"
              >
                {directoryCopy.title}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {directoryCopy.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
              <StatusBadge tone="blue">{directoryCopy.shownBadge(shownUsers.length)}</StatusBadge>
              <span className="rounded-full border border-[var(--dash-border)] px-3 py-1.5">
                {directoryCopy.rangeSummary(userPageStart, userPageEnd, usersTotal)}
              </span>
              <span className="rounded-full border border-[var(--dash-border)] px-3 py-1.5">
                {directoryCopy.pageSummary(usersPage, usersLastPage)}
              </span>
              <span className="rounded-full border border-[var(--dash-border)] px-3 py-1.5">
                {usersSearchMode === "auth_filter"
                  ? directoryCopy.searchModeIndexed
                  : directoryCopy.searchModePaged}
              </span>
            </div>
          </div>

          <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
            <form
              className="grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-2 overflow-hidden rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-2 max-[279px]:w-[calc(100vw-46px)] max-[279px]:max-w-[calc(100vw-46px)] sm:grid-cols-2 sm:gap-3 sm:p-3 xl:grid-cols-[minmax(220px,1fr)_136px_minmax(140px,0.72fr)_minmax(140px,0.72fr)_auto] xl:items-end 2xl:grid-cols-[minmax(260px,1fr)_144px_168px_168px_auto]"
              method="get"
            >
              <input name="adminPanel" type="hidden" value="users" />
              <input name="userPage" type="hidden" value="1" />
              <input name="userPriority" type="hidden" value={selectedPriority} />
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
                {copy.users.searchLabel}
                <input
                  className={inputClass}
                  defaultValue={params.userQuery ?? ""}
                  name="userQuery"
                  placeholder={copy.users.searchPlaceholder}
                />
              </label>
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
                {copy.users.showLabel}
                <select
                  className={inputClass}
                  defaultValue={String(usersPageSize)}
                  name="userPageSize"
                >
                  {adminUserPageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {directoryCopy.pageSizeOption(option)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
                {copy.users.accessStatusLabel}
                <select
                  className={inputClass}
                  defaultValue={safeParam(params.userAccess)}
                  name="userAccess"
                >
                  <option value="all">{copy.users.accessStatusOptions.all}</option>
                  <option value="active">{copy.users.accessStatusOptions.active}</option>
                  <option value="onboarding">{copy.users.accessStatusOptions.onboarding}</option>
                  <option value="suspended">{copy.users.accessStatusOptions.suspended}</option>
                  <option value="cancelled">{copy.users.accessStatusOptions.cancelled}</option>
                  <option value="unlinked">{copy.users.accessStatusOptions.unlinked}</option>
                </select>
              </label>
              <label className="grid min-w-0 gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
                {copy.users.authLabel}
                <select
                  className={inputClass}
                  defaultValue={safeParam(params.userConfirmed)}
                  name="userConfirmed"
                >
                  <option value="all">{copy.users.authOptions.all}</option>
                  <option value="confirmed">{copy.users.authOptions.confirmed}</option>
                  <option value="unconfirmed">{copy.users.authOptions.unconfirmed}</option>
                  <option value="founder">{copy.users.authOptions.founder}</option>
                </select>
              </label>
              <div className="flex min-w-0 flex-wrap gap-2 sm:col-span-2 xl:col-span-1 xl:min-w-[190px] xl:flex-nowrap">
                <button className={`${primaryButtonClass} min-w-0 flex-1`} type="submit">
                  {copy.users.searchSubmit}
                </button>
                <Link
                  className={`${buttonClass} min-w-0 flex-1`}
                  href={adminUsersHref(params, {
                    adminPanel: "users",
                    userAccess: undefined,
                    userConfirmed: undefined,
                    userPage: "1",
                    userPageSize: String(usersPageSize),
                    userPriority: undefined,
                    userQuery: undefined,
                  })}
                >
                  {copy.users.reset}
                </Link>
              </div>
            </form>

      <details className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)]">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="text-sm font-black text-[var(--dash-text)]">
              {copy.users.workQueuesTitle}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {copy.users.workQueuesDescription}
            </p>
          </div>
          <StatusBadge tone="blue">
            {copy.users.showingPerPage(usersPageSize)}
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
                      adminPanel: "users",
                      userPage: "1",
                      userPriority: option.value,
                    })}
                    key={option.value}
                  >
                    {option.label}
                    <span className="text-[12px] text-[var(--dash-text-muted)]">
                      {directoryCopy.loadedCount(priorityCount(users, option.value))}
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
                    <StatusBadge tone="amber">{directoryCopy.founderBadge}</StatusBadge>
                  ) : null}
                  <StatusBadge tone={user.emailConfirmed ? "emerald" : "amber"}>
                    {user.emailConfirmed
                      ? directoryCopy.confirmedBadge
                      : directoryCopy.unconfirmedBadge}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-[12px] font-bold text-[var(--dash-text-muted)]">
                  {user.email}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase text-[var(--dash-text-muted)]">
                  {directoryCopy.businessLabel}
                </p>
                <p className="mt-1 truncate font-black text-[var(--dash-text)]">
                  {user.businessName ?? copy.users.noBusinessLinked}
                </p>
                <p className="mt-1 text-[12px] font-bold capitalize text-[var(--dash-text-secondary)]">
                  {formatUserValue(user.membershipRole)}
                  {user.membershipStatus ? ` | ${formatUserValue(user.membershipStatus)}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.planSlug ? (
                  <StatusBadge tone={planTone(user.planSlug)}>
                    {copy.businesses.detail.planLabels[user.planSlug]}
                  </StatusBadge>
                ) : (
                  <StatusBadge>{copy.users.noPlan}</StatusBadge>
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
                    ? copy.users.noQuoteLink
                    : user.publicLinkActive
                      ? copy.users.quoteActive
                      : copy.users.quoteInactive}
                </StatusBadge>
              </div>

              <span className="justify-self-start rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-[11px] font-black text-[var(--dash-text-secondary)] group-open:border-[var(--dash-primary)] group-open:bg-[var(--dash-primary-soft)] group-open:text-[var(--dash-text)] xl:justify-self-end">
                {copy.users.details}
              </span>
              </summary>

              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:p-4">
                <dl className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 text-[12px] sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">{directoryCopy.leadsLabel}</dt>
                    <dd className="mt-0.5 font-black text-[var(--dash-text)]">
                      {user.leadCount ?? "-"}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">{directoryCopy.lastSignInLabel}</dt>
                    <dd className="mt-0.5 font-black text-[var(--dash-text)]">
                      {formatDate(copy, user.lastSignInAt)}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">{directoryCopy.userIdLabel}</dt>
                    <dd className="mt-0.5 truncate font-black text-[var(--dash-text)]">
                      {user.userId}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
                    <dt className="font-bold text-[var(--dash-text-muted)]">{directoryCopy.phoneLabel}</dt>
                    <dd className="mt-0.5 truncate font-black text-[var(--dash-text)]">
                      {formatContactValue(user.phone)}
                    </dd>
                  </div>
                </dl>
                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    <UserWorkspaceReadOnlyPanel
                      copy={copy}
                      linkedBusiness={linkedBusiness}
                      params={params}
                      user={user}
                    />
                    <UserAccountSupportPanel copy={copy} user={user} />
                  </div>
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
                    <LockedAccessManagementPanel copy={copy} />
                    <UserAccountSafetyPanel copy={copy} user={user} />
                  </div>
                </div>
              </div>
            </details>
          );
          })
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-6 text-center text-sm text-[var(--dash-text-secondary)]">
            {copy.users.noUsers}
          </p>
        )}
      </div>

      <nav
        aria-label={copy.users.paginationLabel}
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
      >
        <div className="text-[12px] font-bold text-[var(--dash-text-muted)]">
          {users.length > shownUsers.length
            ? copy.users.hiddenByFilters
            : copy.users.showingRange(userPageStart, userPageEnd, usersTotal)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasPreviousPage ? (
            <Link
              className={buttonClass}
              href={adminUsersHref(params, {
                adminPanel: "users",
                userPage: String(usersPage - 1),
                userPageSize: String(usersPageSize),
              })}
            >
              {copy.users.previous}
            </Link>
          ) : (
            <button className={disabledButtonClass} disabled type="button">
              {copy.users.previous}
            </button>
          )}
          <div className="flex flex-wrap items-center gap-1">
            {userPaginationPages.map((page) => {
              const active = page === usersPage;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  aria-label={copy.users.pageAriaLabel(page)}
                  className={
                    active
                      ? "inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-2 text-[12px] font-black text-[var(--dash-text)]"
                      : `${buttonClass} min-w-9 px-2`
                  }
                  href={adminUsersHref(params, {
                    adminPanel: "users",
                    userPage: String(page),
                    userPageSize: String(usersPageSize),
                  })}
                  key={page}
                >
                  {page}
                </Link>
              );
            })}
          </div>
          {hasNextPage ? (
            <Link
              className={buttonClass}
              href={adminUsersHref(params, {
                adminPanel: "users",
                userPage: String(usersPage + 1),
                userPageSize: String(usersPageSize),
              })}
            >
              {copy.users.next}
            </Link>
          ) : null}
          {!hasNextPage ? (
            <button className={disabledButtonClass} disabled type="button">
              {copy.users.next}
            </button>
          ) : null}
        </div>
      </nav>
          </div>
        </section>
      </DashboardCard>

      <FounderAdminCapabilityMatrix copy={copy} />
    </div>
  );
}

function FounderInboxSection({
  copy,
  items,
}: Readonly<{
  copy: AdminCopy;
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
  const inboxCopy = copy.overview.leadInboxSection;
  const statusLabels = inboxCopy.statusLabels;

  return (
    <DashboardCard className="space-y-4 p-4 sm:p-5" variant="priority">
      <PageHeader
        actions={<StatusBadge tone="blue">{inboxCopy.badgeCount(items.length)}</StatusBadge>}
        description={inboxCopy.description}
        eyebrow={copy.topbar.badge}
        title={copy.topbar.panelTitles.leads}
      />
      <div className="space-y-3">
        {items.length > 0 ? (
          items.slice(0, 30).map((item) => (
            <details
              className="min-w-0 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]"
              key={item.leadId}
            >
              <summary className="grid min-w-0 cursor-pointer list-none gap-3 px-4 py-3 hover:bg-[var(--dash-surface-muted)]">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                  <p className="min-w-0 break-words text-sm font-black text-[var(--dash-text)] [overflow-wrap:anywhere]">
                    {item.customerName ?? inboxCopy.unknownSender}
                  </p>
                  <StatusBadge tone={leadStatusTone(item.status)}>
                    {hasOwnKey(statusLabels, item.status)
                      ? statusLabels[item.status]
                      : humanizeAdminKey(item.status)}
                  </StatusBadge>
                </div>
                <p className="break-words text-[12px] text-[var(--dash-text-secondary)] [overflow-wrap:anywhere]">
                  {item.businessName} | {formatDateTime(copy, item.createdAt)}
                </p>
                <p className="break-words text-[12px] text-[var(--dash-text-muted)] [overflow-wrap:anywhere]">
                  {item.serviceType ?? inboxCopy.serviceNotSet} |{" "}
                  {item.cityOrServiceArea ?? inboxCopy.areaNotSet}
                </p>
              </summary>
              <div className="grid gap-3 border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
                <div className="grid gap-1 text-[12px] text-[var(--dash-text-secondary)]">
                  <p>
                    <span className="font-black text-[var(--dash-text)]">
                      {inboxCopy.contactLabel}:
                    </span>{" "}
                    {formatContactValue(item.customerContact)}
                  </p>
                  <p>
                    <span className="font-black text-[var(--dash-text)]">
                      {inboxCopy.sourceLabel}:
                    </span>{" "}
                    {item.sourceChannel ?? inboxCopy.unknownSource}
                  </p>
                  <p>
                    <span className="font-black text-[var(--dash-text)]">
                      {inboxCopy.referrerLabel}:
                    </span>{" "}
                    {item.sourceReferrer ?? inboxCopy.noneReferrer}
                  </p>
                  <p>
                    <span className="font-black text-[var(--dash-text)]">
                      {inboxCopy.leadIdLabel}:
                    </span>{" "}
                    {item.leadId}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action={founderInboxLeadStatusAction}>
                    <input name="leadId" type="hidden" value={item.leadId} />
                    <input name="status" type="hidden" value="reviewed" />
                    <button className={buttonClass} type="submit">
                      {inboxCopy.markReviewed}
                    </button>
                  </form>
                  <form action={founderInboxLeadStatusAction}>
                    <input name="leadId" type="hidden" value={item.leadId} />
                    <input name="status" type="hidden" value="archived" />
                    <button className={buttonClass} type="submit">
                      {inboxCopy.archive}
                    </button>
                  </form>
                </div>

                <form
                  action={founderInboxLeadDeleteAction}
                  className="grid gap-2 rounded-lg border border-[var(--dash-danger-border)] bg-[var(--dash-danger-soft)] p-3"
                >
                  <input name="leadId" type="hidden" value={item.leadId} />
                  <p className="text-[12px] font-black text-[var(--dash-danger-strong)]">
                    {inboxCopy.permanentDeleteTitle}
                  </p>
                  <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                    {inboxCopy.confirmLeadId}
                    <input className={inputClass} name="leadConfirmation" placeholder={item.leadId} />
                  </label>
                  <label className="flex items-center gap-2 text-[12px] font-bold text-[var(--dash-text)]">
                    <input className="h-4 w-4" name="deleteAcknowledgement" type="checkbox" />
                    {inboxCopy.deleteAcknowledgement}
                  </label>
                  <button className={primaryButtonClass} type="submit">
                    {inboxCopy.deletePermanently}
                  </button>
                </form>
              </div>
            </details>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-5 text-sm text-[var(--dash-text-secondary)]">
            {inboxCopy.emptyState}
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

function FounderHealthSection({
  copy,
  health,
  healthNeedsAttention,
  totals,
  usersTotal,
}: Readonly<{
  copy: AdminCopy;
  health: FounderProductionHealth | null;
  healthNeedsAttention: boolean;
  totals: FounderAdminOverview["totals"];
  usersTotal: number;
}>) {
  const healthSectionCopy = copy.overview.healthSection;

  return (
    <div className="space-y-3">
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <PageHeader
          actions={
            <StatusBadge tone={healthNeedsAttention ? "red" : "emerald"}>
              {healthNeedsAttention
                ? healthSectionCopy.needsAttention
                : healthSectionCopy.healthy}
            </StatusBadge>
          }
          description={healthSectionCopy.description}
          eyebrow={healthSectionCopy.eyebrow}
          title={healthSectionCopy.title}
        />
      </DashboardCard>
      {healthNeedsAttention ? (
        <AdminNotice tone="error">{healthSectionCopy.notice}</AdminNotice>
      ) : null}
      <FounderAdminMetricsPanel copy={copy} totals={totals} usersTotal={usersTotal} />
      <FounderProductionHealthPanel copy={copy} health={health} />
    </div>
  );
}

function FounderActivitySection({
  actions,
  businesses,
  copy,
  params,
  users,
}: Readonly<{
  actions: FounderAdminOverview["recentActions"];
  businesses: FounderAdminBusiness[];
  copy: AdminCopy;
  params: AdminSearchParams;
  users: FounderAdminUser[];
}>) {
  const activitySectionCopy = copy.overview.activitySection;

  return (
    <div className="space-y-3">
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <PageHeader
          actions={<StatusBadge tone="blue">{activitySectionCopy.badgeCount(actions.length)}</StatusBadge>}
          description={activitySectionCopy.description}
          eyebrow={activitySectionCopy.eyebrow}
          title={activitySectionCopy.title}
        />
      </DashboardCard>
      <FounderAdminNewsroom
        actions={actions}
        businesses={businesses}
        copy={copy}
        limit={20}
        params={params}
        title={activitySectionCopy.feedTitle}
        users={users}
      />
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

function normalizeFounderLeadSource(copy: AdminCopy, value: string | null): string {
  const normalized = (value ?? "").trim().toLowerCase();
  const labels = copy.overview.leadSourceLabels;

  if (!normalized || normalized.includes("web") || normalized.includes("site")) {
    return labels.website;
  }

  if (normalized.includes("google") || normalized.includes("search")) {
    return labels.google;
  }

  if (normalized.includes("facebook") || normalized === "fb") {
    return labels.facebook;
  }

  if (normalized.includes("instagram") || normalized === "ig") {
    return labels.instagram;
  }

  return labels.other;
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
  copy: AdminCopy,
  leads: FounderAdminOverview["leadInbox"],
): FounderChartSegment[] {
  const sourceLabels = copy.overview.leadSourceLabels;
  const labels = [
    sourceLabels.website,
    sourceLabels.google,
    sourceLabels.facebook,
    sourceLabels.instagram,
    sourceLabels.other,
  ];
  const colors: Record<string, string> = {
    [sourceLabels.facebook]: "#f59e0b",
    [sourceLabels.google]: "#0ea5e9",
    [sourceLabels.instagram]: "#ef4444",
    [sourceLabels.other]: "#14b8a6",
    [sourceLabels.website]: "#6d5dfc",
  };
  const counts = new Map(labels.map((label) => [label, 0]));

  for (const lead of leads) {
    const label = normalizeFounderLeadSource(copy, lead.sourceChannel);
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
  copy,
  segments,
  total,
}: Readonly<{ copy: AdminCopy; segments: readonly FounderChartSegment[]; total: number }>) {
  return (
    <DashboardCard className="p-4">
      <SectionHeader title={copy.overview.leadStatusChart.title} />
      <div className="mt-5 grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center xl:grid-cols-1 2xl:grid-cols-[150px_minmax(0,1fr)]">
        <div
          aria-label={copy.overview.leadStatusChart.ariaLabel}
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
                {copy.overview.leadStatusChart.totalLeads}
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
  copy,
  health,
  healthNeedsAttention,
}: Readonly<{
  copy: AdminCopy;
  health: FounderProductionHealth | null;
  healthNeedsAttention: boolean;
}>) {
  const overviewCopy = copy.overview;
  const checks = [
    {
      label: overviewCopy.systemHealthSummary.checks.authService,
      ok: Boolean(health && (health.authAdmin.ok || health.authRest.ok)),
    },
    {
      label: overviewCopy.systemHealthSummary.checks.database,
      ok: Boolean(health && health.businesses.ok && health.businessMembers.ok),
    },
    { label: overviewCopy.systemHealthSummary.checks.profiles, ok: Boolean(health?.profiles.ok) },
    { label: overviewCopy.systemHealthSummary.checks.quoteLinks, ok: Boolean(health?.publicLinks.ok) },
    { label: overviewCopy.systemHealthSummary.checks.adminLog, ok: Boolean(health?.recentActions.ok) },
    {
      label: overviewCopy.systemHealthSummary.checks.deletionRequests,
      ok: Boolean(health?.deletionRequests.ok),
    },
  ];

  return (
    <DashboardCard className="p-4">
      <SectionHeader
        action={
          <StatusBadge tone={healthNeedsAttention ? "red" : "emerald"}>
            {healthNeedsAttention
              ? overviewCopy.systemHealthSummary.actionNeeded
              : overviewCopy.systemHealthSummary.operational}
          </StatusBadge>
        }
        title={overviewCopy.systemHealthSummary.title}
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
              {check.ok
                ? overviewCopy.systemHealthSummary.operational
                : overviewCopy.systemHealthSummary.needsCheck}
            </span>
          </div>
        ))}
      </div>
      <Link
        className="mt-4 inline-flex text-[12px] font-black text-[var(--dash-primary-strong)]"
        href="/admin?adminPanel=health"
      >
        {overviewCopy.systemHealthSummary.viewSystemHealth}
      </Link>
    </DashboardCard>
  );
}

function FounderRecentActivitiesSummary({
  actions,
  businesses,
  copy,
  params,
  users,
}: Readonly<{
  actions: FounderAdminOverview["recentActions"];
  businesses: FounderAdminBusiness[];
  copy: AdminCopy;
  params: AdminSearchParams;
  users: FounderAdminUser[];
}>) {
  const overviewCopy = copy.overview;
  const latestAction = actions[0] ?? null;
  const remainingActions = actions.slice(1, 5);
  const businessById = new Map(
    businesses.map((business) => [business.businessId, business]),
  );
  const usersById = new Map(users.map((user) => [user.userId, user]));

  return (
    <DashboardCard className="p-4">
      <SectionHeader
        action={<StatusBadge tone="blue">{actions.length}</StatusBadge>}
        title={overviewCopy.activitySummary.title}
      />
      <div className="mt-4 grid min-w-0 gap-2">
        {latestAction ? (
          <>
            <Link
              className="grid min-w-0 gap-2 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-2.5 text-[12px] transition hover:border-[var(--dash-primary)]"
              href={actionTargetHref(latestAction, businessById, params)}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge tone={activityFilterTone(actionActivityFilter(latestAction.actionType))}>
                  {overviewCopy.activitySummary.latestBadge}
                </StatusBadge>
                <span className="font-black text-[var(--dash-text)]">
                  {actionLabel(copy, latestAction.actionType)}
                </span>
              </div>
              <p className="break-words font-bold leading-5 text-[var(--dash-text-secondary)] [overflow-wrap:anywhere]">
                {overviewCopy.activitySummary.byLabel} {actionActorLabel(copy, latestAction, usersById)}{" "}
                {overviewCopy.activitySummary.targetLabel}{" "}
                {actionTargetLabel(copy, latestAction, businessById)}
              </p>
              <p className="text-[11px] font-bold text-[var(--dash-text-muted)]">
                {formatDateTime(copy, latestAction.createdAt)}
              </p>
            </Link>
            {remainingActions.map((action) => (
              <Link
                className="grid min-w-0 gap-1 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5 text-[12px] transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
                href={actionTargetHref(action, businessById, params)}
                key={`${action.createdAt}-${action.actionType}-${action.businessId ?? "none"}`}
              >
                <span className="truncate font-black text-[var(--dash-text)]">
                  {actionLabel(copy, action.actionType)}
                </span>
                <span className="truncate font-bold text-[var(--dash-text-secondary)]">
                  {actionTargetLabel(copy, action, businessById)}
                </span>
              </Link>
            ))}
          </>
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-4 text-center text-[12px] text-[var(--dash-text-secondary)]">
            {overviewCopy.activitySummary.emptyState}
          </p>
        )}
      </div>
      <Link
        className="mt-4 inline-flex text-[12px] font-black text-[var(--dash-primary-strong)]"
        href="/admin?adminPanel=activity"
      >
        {overviewCopy.activitySummary.viewAll}
      </Link>
    </DashboardCard>
  );
}

function FounderAdminNewsroom({
  actions,
  businesses,
  copy,
  limit = 5,
  params,
  title,
  users,
}: Readonly<{
  actions: FounderAdminOverview["recentActions"];
  businesses: FounderAdminBusiness[];
  copy: AdminCopy;
  limit?: number;
  params: AdminSearchParams;
  title?: string;
  users: FounderAdminUser[];
}>) {
  const overviewCopy = copy.overview;
  const activityFilters = buildActivityFilters(copy);
  const resolvedTitle = title ?? overviewCopy.newsroom.title;
  const selectedFilter = readActivityFilter(params.activityFilter);
  const businessById = new Map(
    businesses.map((business) => [business.businessId, business]),
  );
  const usersById = new Map(users.map((user) => [user.userId, user]));
  const filteredActions =
    selectedFilter === "all"
      ? actions
      : actions.filter(
          (action) => actionActivityFilter(action.actionType) === selectedFilter,
        );
  const visibleActions = filteredActions.slice(0, limit);

  return (
    <DashboardCard className="p-4 sm:p-5" variant="elevated">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="blue">
              {overviewCopy.newsroom.shownBadge(visibleActions.length)}
            </StatusBadge>
            <p className="text-sm font-black text-[var(--dash-text)]">
              {resolvedTitle}
            </p>
          </div>
          <p className="mt-1 max-w-[780px] text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {overviewCopy.newsroom.description}
          </p>
        </div>
        <Link
          className={`${buttonClass} w-full sm:w-auto`}
          href={adminActivityHref(params, {
            activityFilter: selectedFilter,
            adminPanel: "activity",
          })}
        >
          {overviewCopy.newsroom.viewFullLog}
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {activityFilters.map((filter) => {
          const active = selectedFilter === filter.value;

          return (
            <Link
              className={
                active
                  ? "inline-flex min-h-8 shrink-0 items-center rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-2.5 text-[12px] font-black text-[var(--dash-text)] sm:px-3"
                  : "inline-flex min-h-8 shrink-0 items-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2.5 text-[12px] font-black text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)] hover:text-[var(--dash-text)] sm:px-3"
              }
              href={adminActivityHref(params, {
                activityFilter: filter.value,
                adminPanel: params.adminPanel ?? "overview",
              })}
              key={filter.value}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-3 grid gap-2">
        {visibleActions.length > 0 ? (
          visibleActions.map((action) => {
            const filter = actionActivityFilter(action.actionType);

            return (
              <Link
                className="grid min-w-0 gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)_auto] md:items-center"
                href={actionTargetHref(action, businessById, params)}
                key={`${action.createdAt}-${action.actionType}-${action.businessId ?? "none"}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-black text-[var(--dash-text)]">
                    {actionLabel(copy, action.actionType)}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-bold text-[var(--dash-text-secondary)]">
                    {action.note ?? overviewCopy.newsroom.noNoteRecorded}
                  </p>
                </div>
                <div className="min-w-0 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  <p className="truncate">
                    <span className="font-black text-[var(--dash-text)]">
                      {overviewCopy.newsroom.byLabel}
                    </span>{" "}
                    {actionActorLabel(copy, action, usersById)}
                  </p>
                  <p className="truncate">
                    <span className="font-black text-[var(--dash-text)]">
                      {overviewCopy.newsroom.targetLabel}
                    </span>{" "}
                    {actionTargetLabel(copy, action, businessById)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
                  <StatusBadge tone={activityFilterTone(filter)}>
                    {activityFilters.find((item) => item.value === filter)?.label ??
                      overviewCopy.newsroom.defaultFilterLabel}
                  </StatusBadge>
                  <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2.5 py-1 text-[11px] font-black text-[var(--dash-text-secondary)]">
                    {formatDateTime(copy, action.createdAt)}
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-4 text-center text-[12px] text-[var(--dash-text-secondary)]">
            {overviewCopy.newsroom.emptyState}
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

function FounderUsersMiniList({
  copy,
  params,
  users,
}: Readonly<{ copy: AdminCopy; params: AdminSearchParams; users: FounderAdminUser[] }>) {
  const overviewCopy = copy.overview;
  const detailCopy = copy.businesses.detail;
  const previewUsers = users.slice(0, 4);

  return (
    <DashboardCard className="p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="min-w-0 text-[15px] font-extrabold leading-5 text-[var(--dash-text)]">
          {overviewCopy.usersMiniList.title}
        </h2>
        <Link
          className="shrink-0 text-[12px] font-black text-[var(--dash-primary-strong)]"
          href={adminUsersHref(params, { adminPanel: "users" })}
        >
          {overviewCopy.usersMiniList.allUsers}
        </Link>
      </div>

      <div className="mt-4 grid min-w-0 gap-2">
        {previewUsers.length > 0 ? (
          previewUsers.map((user) => (
            <div
              className="grid min-w-0 gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
              key={user.userId}
            >
              <div className="grid min-w-0 gap-1 min-[420px]:grid-cols-[minmax(0,1fr)_auto] min-[420px]:items-start">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-black text-[var(--dash-text)]">
                    {user.displayName ?? user.email}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-bold text-[var(--dash-text-secondary)]">
                    {user.businessName ?? copy.users.noBusinessLinked}
                  </p>
                </div>
                <StatusBadge tone={userAccessTone(user.businessAccessStatus)}>
                  {formatUserValue(user.businessAccessStatus)}
                </StatusBadge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2 py-1 text-[11px] font-black text-[var(--dash-text-secondary)]">
                  {user.planSlug ? detailCopy.planLabels[user.planSlug] : copy.users.noPlan}
                </span>
                <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2 py-1 text-[11px] font-black text-[var(--dash-text-secondary)]">
                  {user.leadCount ?? "-"} {overviewCopy.usersMiniList.leadsSuffix}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-4 text-center text-[12px] text-[var(--dash-text-secondary)]">
            {overviewCopy.usersMiniList.emptyState}
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

function FounderNewUsersNotice({
  copy,
  params,
  users,
}: Readonly<{ copy: AdminCopy; params: AdminSearchParams; users: FounderAdminUser[] }>) {
  const overviewCopy = copy.overview;
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
  const visibleUser = (hasRecentUsers ? recentUsers : newestUsers)[0];
  if (!visibleUser) {
    return null;
  }

  const age = daysSince(visibleUser.createdAt);
  const joinedLabel =
    age === null
      ? formatDateTime(copy, visibleUser.createdAt)
      : age === 0
        ? overviewCopy.newUsersNotice.today
        : overviewCopy.newUsersNotice.daysAgo(age);

  return (
    <section
      aria-live="polite"
      className={`grid min-w-0 gap-3 rounded-lg border px-3.5 py-3 ${
        hasRecentUsers
          ? "border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)]"
          : "border-[var(--dash-border)] bg-[var(--dash-surface-muted)]"
      } lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={hasRecentUsers ? "blue" : "neutral"}>
            {hasRecentUsers
              ? overviewCopy.newUsersNotice.newBadge(recentUsers.length)
              : overviewCopy.newUsersNotice.latestBadge}
          </StatusBadge>
          <p className="text-sm font-black text-[var(--dash-text)]">
            {hasRecentUsers
              ? overviewCopy.newUsersNotice.newTitle
              : overviewCopy.newUsersNotice.latestTitle}
          </p>
        </div>
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 text-[12px] font-bold text-[var(--dash-text-secondary)]">
          <span className="max-w-full truncate font-black text-[var(--dash-text)]">
            {visibleUser.displayName ?? visibleUser.email}
          </span>
          <StatusBadge tone={visibleUser.emailConfirmed ? "emerald" : "amber"}>
            {visibleUser.emailConfirmed
              ? overviewCopy.newUsersNotice.confirmed
              : overviewCopy.newUsersNotice.emailPending}
          </StatusBadge>
          <StatusBadge tone={visibleUser.businessName ? "blue" : "amber"}>
            {visibleUser.businessName ?? overviewCopy.newUsersNotice.noWorkspace}
          </StatusBadge>
          <StatusBadge tone="neutral">{joinedLabel}</StatusBadge>
        </div>
      </div>
      <Link
        className={`${hasRecentUsers ? primaryButtonClass : buttonClass} w-full sm:w-auto`}
        href={adminUsersHref(params, { adminPanel: "users" })}
      >
        {overviewCopy.newUsersNotice.reviewUsers}
      </Link>
    </section>
  );
}

function FounderTopLeadSources({
  copy,
  segments,
  total,
}: Readonly<{ copy: AdminCopy; segments: readonly FounderChartSegment[]; total: number }>) {
  return (
    <DashboardCard className="p-4">
      <SectionHeader title={copy.overview.topLeadSourcesTitle} />
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
  copy,
  health,
  healthNeedsAttention,
  overview,
  params,
}: Readonly<{
  copy: AdminCopy;
  health: FounderProductionHealth | null;
  healthNeedsAttention: boolean;
  overview: FounderAdminOverview;
  params: AdminSearchParams;
}>) {
  const overviewCopy = copy.overview;
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
      label: overviewCopy.leadStatusLabels.new,
      value: overview.leadInbox.filter((lead) => lead.status === "new").length,
    },
    {
      color: "#0ea5e9",
      label: overviewCopy.leadStatusLabels.replyCopied,
      value: overview.leadInbox.filter((lead) => lead.status === "replied").length,
    },
    {
      color: "#f59e0b",
      label: overviewCopy.leadStatusLabels.awaitingReply,
      value: overview.leadInbox.filter((lead) => lead.status === "follow_up_needed").length,
    },
    {
      color: "#14b8a6",
      label: overviewCopy.leadStatusLabels.quoteSent,
      value: overview.leadInbox.filter((lead) => lead.status === "reviewed").length,
    },
    {
      color: "#8ddfd5",
      label: overviewCopy.leadStatusLabels.completed,
      value: overview.leadInbox.filter(
        (lead) => lead.status === "booked" || lead.status === "archived",
      ).length,
    },
  ];
  const leadStatusTotal = leadStatusSegments.reduce(
    (sum, segment) => sum + segment.value,
    0,
  );
  const sourceSegments = sourceBreakdownFromLeads(copy, overview.leadInbox);
  const sourceTotal = sourceSegments.reduce((sum, segment) => sum + segment.value, 0);
  const activeLinkCoverage =
    overview.totals.businesses > 0
      ? Math.round((activeLinks / overview.totals.businesses) * 100)
      : 0;
  const paymentReadyCoverage =
    overview.totals.businesses > 0
      ? Math.round((overview.totals.paymentReady / overview.totals.businesses) * 100)
      : 0;
  const replyTraceSignal = Math.max(
    overview.leadInbox.filter((lead) => lead.status === "replied").length,
    overview.recentActions.filter((action) =>
      action.actionType.toLowerCase().includes("reply"),
    ).length,
  );
  const founderOverviewMetricCards = [
    {
      detail: overviewCopy.metricCards.totalUsers.detail,
      glyph: "TU",
      label: overviewCopy.metricCards.totalUsers.label,
      tone: "blue" as FounderOverviewTone,
      value: formatAdminMetricNumber(overview.usersTotal),
    },
    {
      detail: overviewCopy.metricCards.activeBusinesses.detail,
      glyph: "AB",
      label: overviewCopy.metricCards.activeBusinesses.label,
      tone: "violet" as FounderOverviewTone,
      value: formatAdminMetricNumber(overview.totals.activePilots),
    },
    {
      detail: overviewCopy.metricCards.loadedLeads.detail,
      glyph: "LM",
      label: overviewCopy.metricCards.loadedLeads.label,
      tone: "emerald" as FounderOverviewTone,
      value: formatAdminMetricNumber(totalLeads),
    },
    {
      detail: overviewCopy.metricCards.replyTraces.detail,
      glyph: "RT",
      label: overviewCopy.metricCards.replyTraces.label,
      tone: "violet" as FounderOverviewTone,
      value: formatAdminMetricNumber(replyTraceSignal),
    },
    {
      detail: overviewCopy.metricCards.readinessCompleted.detail,
      glyph: "RC",
      label: overviewCopy.metricCards.readinessCompleted.label,
      tone: "blue" as FounderOverviewTone,
      value: formatAdminMetricNumber(readinessCompleted),
    },
    {
      detail: overviewCopy.metricCards.usersNeedingAttention.detail,
      glyph: "UA",
      label: overviewCopy.metricCards.usersNeedingAttention.label,
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
                {overviewCopy.page.actions.currentSnapshot}
              </span>
              <Link className={buttonClass} href="/admin?adminPanel=businesses">
                {overviewCopy.page.actions.allWorkspaces}
              </Link>
              <Link className={buttonClass} href="/admin?adminPanel=activity">
                {overviewCopy.page.actions.activityLog}
              </Link>
            </>
          }
          description={overviewCopy.page.description}
          eyebrow={overviewCopy.page.eyebrow}
          title={overviewCopy.page.title}
        />
      </DashboardCard>

      <FounderNewUsersNotice copy={copy} params={params} users={overview.users} />

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
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

      <section className="grid min-w-0 gap-3 xl:grid-cols-[minmax(300px,0.9fr)_minmax(320px,1fr)_minmax(320px,1fr)] 2xl:grid-cols-[minmax(320px,0.95fr)_minmax(340px,1fr)_minmax(340px,1fr)_minmax(340px,1fr)]">
        <FounderUsersMiniList copy={copy} params={params} users={overview.users} />
        <FounderLeadsStatusDonut
          copy={copy}
          segments={leadStatusSegments}
          total={leadStatusTotal}
        />
        <FounderSystemHealthSummary
          copy={copy}
          health={health}
          healthNeedsAttention={healthNeedsAttention}
        />
        <FounderRecentActivitiesSummary
          actions={overview.recentActions}
          businesses={overview.businesses}
          copy={copy}
          params={params}
          users={overview.users}
        />
      </section>

      <section className="grid min-w-0 gap-3 xl:grid-cols-[minmax(280px,1.1fr)_repeat(2,minmax(180px,0.7fr))] 2xl:grid-cols-[minmax(320px,1.2fr)_repeat(4,minmax(170px,0.7fr))]">
        <FounderTopLeadSources copy={copy} segments={sourceSegments} total={sourceTotal} />
        <MetricCard
          detail={overviewCopy.trackingCards.responseTimeTracking.detail}
          label={overviewCopy.trackingCards.responseTimeTracking.label}
          tone="blue"
          value={overviewCopy.trackingCards.responseTimeTracking.value}
        />
        <MetricCard
          detail={overviewCopy.trackingCards.readyQuoteLinks.detail}
          label={overviewCopy.trackingCards.readyQuoteLinks.label}
          tone="emerald"
          value={formatAdminMetricNumber(readinessCompleted)}
        />
        <MetricCard
          detail={overviewCopy.trackingCards.activeLinkCoverage.detail}
          label={overviewCopy.trackingCards.activeLinkCoverage.label}
          tone="amber"
          value={`${activeLinkCoverage}%`}
        />
        <MetricCard
          detail={overviewCopy.trackingCards.paymentReadyWorkspaces.detail}
          label={overviewCopy.trackingCards.paymentReadyWorkspaces.label}
          tone="blue"
          value={`${paymentReadyCoverage}%`}
        />
      </section>
    </div>
  );
}

function FounderRecentActionsPanel({
  actions,
  copy,
}: Readonly<{
  actions: ReadonlyArray<{
    actionType: string;
    businessId: string | null;
    createdAt: string;
    note: string | null;
  }>;
  copy: AdminCopy;
}>) {
  const overviewCopy = copy.overview;
  return (
    <DashboardCard className="p-3" variant="priority">
      <details>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--dash-text)]">
              {overviewCopy.recentActionsPanel.title}
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-[var(--dash-text-secondary)]">
              {overviewCopy.recentActionsPanel.description}
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
                {actionLabel(copy, action.actionType)}
              </span>
              <span className="truncate text-[var(--dash-text-secondary)]">
                {action.note ?? action.businessId ?? overviewCopy.recentActionsPanel.noNote}
              </span>
              <span className="font-bold text-[var(--dash-text-muted)]">
                {formatDateTime(copy, action.createdAt)}
              </span>
            </div>
            ))
          ) : (
            <p className="bg-[var(--dash-surface-muted)] px-3 py-4 text-center text-[12px] text-[var(--dash-text-secondary)]">
              {overviewCopy.recentActionsPanel.emptyState}
            </p>
          )}
        </div>
      </details>
    </DashboardCard>
  );
}

function FounderAdminMetricsPanel({
  copy,
  totals,
  usersTotal,
}: Readonly<{
  copy: AdminCopy;
  totals: {
    activePilots: number;
    paymentReady: number;
    suspended: number;
  };
  usersTotal: number;
}>) {
  const overviewCopy = copy.overview;
  return (
    <DashboardCard className="p-4 sm:p-5" variant="elevated">
      <SectionHeader
        description={overviewCopy.metricsPanel.description}
        title={overviewCopy.metricsPanel.title}
      />
      <section className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={overviewCopy.metricsPanel.authUsers.detail}
          label={overviewCopy.metricsPanel.authUsers.label}
          tone="blue"
          value={usersTotal}
        />
        <MetricCard
          detail={overviewCopy.metricsPanel.activePilots.detail}
          label={overviewCopy.metricsPanel.activePilots.label}
          tone="emerald"
          value={totals.activePilots}
        />
        <MetricCard
          detail={overviewCopy.metricsPanel.paymentReady.detail}
          label={overviewCopy.metricsPanel.paymentReady.label}
          tone="amber"
          value={totals.paymentReady}
        />
        <MetricCard
          detail={overviewCopy.metricsPanel.pausedAccess.detail}
          label={overviewCopy.metricsPanel.pausedAccess.label}
          tone="red"
          value={totals.suspended}
        />
      </section>
    </DashboardCard>
  );
}

function adminPanelTitle(copy: AdminCopy, panel: AdminPanel): string {
  switch (panel) {
    case "activity":
      return copy.topbar.panelTitles.activity;
    case "businesses":
      return copy.topbar.panelTitles.businesses;
    case "health":
      return copy.topbar.panelTitles.health;
    case "leads":
      return copy.topbar.panelTitles.leads;
    case "users":
      return copy.topbar.panelTitles.users;
    case "overview":
    default:
      return copy.topbar.panelTitles.overview;
  }
}

function AdminTopBar({
  activePanel,
  copy,
  healthNeedsAttention,
  themeLabels,
}: Readonly<{
  activePanel: AdminPanel;
  copy: AdminCopy;
  healthNeedsAttention: boolean;
  themeLabels: DashboardCopy["theme"];
}>) {
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
            {adminPanelTitle(copy, activePanel)}
          </p>
          <span
            className="mt-1 inline-flex items-center rounded-md border px-2 py-[2px] text-[10.5px] font-bold uppercase tracking-[0.04em]"
            style={{
              backgroundColor: "var(--dash-primary-soft)",
              borderColor: "var(--dash-primary-border)",
              color: "var(--dash-primary-strong)",
            }}
          >
            {copy.topbar.badge}
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
            {healthNeedsAttention
              ? copy.topbar.productionCheck
              : copy.topbar.productionHealthy}
          </span>
          <FounderAdminThemeSelector
            ariaLabel={copy.theme.ariaLabel}
            labels={themeLabels}
          />
          <Link className={buttonClass} href="/dashboard">
            {copy.topbar.ownerDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminTabsBar({
  activePanel,
  copy,
  healthNeedsAttention,
  params,
  totals,
  usersTotal,
}: Readonly<{
  activePanel: AdminPanel;
  copy: AdminCopy;
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
    // Source guard mirror for localized tabs: label: "Overview", panel: "overview"; label: "Users", panel: "users"; label: "Businesses", panel: "businesses".
    {
      description: copy.tabs.items.overview.description,
      label: copy.tabs.items.overview.label,
      panel: "overview",
    },
    {
      count: usersTotal,
      description: copy.tabs.items.users.description,
      label: copy.tabs.items.users.label,
      panel: "users",
    },
    {
      count: totals.businesses,
      description: copy.tabs.items.businesses.description,
      label: copy.tabs.items.businesses.label,
      panel: "businesses",
    },
    {
      description: copy.tabs.items.leads.description,
      label: copy.tabs.items.leads.label,
      panel: "leads",
    },
    {
      description: copy.tabs.items.health.description,
      label: copy.tabs.items.health.label,
      panel: "health",
    },
    {
      description: copy.tabs.items.activity.description,
      label: copy.tabs.items.activity.label,
      panel: "activity",
    },
  ];

  const groups: ReadonlyArray<{
    items: typeof items;
    label: string;
  }> = [
    { items: items.slice(0, 2), label: copy.tabs.groups.command },
    { items: items.slice(2, 4), label: copy.tabs.groups.operations },
    { items: items.slice(4), label: copy.tabs.groups.system },
  ];

  const snapshot: ReadonlyArray<{ label: string; value: number }> = [
    { label: copy.tabs.snapshots.active, value: totals.activePilots },
    { label: copy.tabs.snapshots.paidReady, value: totals.paymentReady },
    { label: copy.tabs.snapshots.paused, value: totals.suspended },
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
              {copy.tabs.brandSubtitle}
            </span>
          </span>
        </Link>

        <nav aria-label={copy.tabs.ariaLabel} className="mt-4 grid gap-5 text-[13px]">
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
        aria-label={copy.tabs.ariaLabel}
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
  const language = readSupportedLanguage(
    cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const dashboardCopy = getBizPilotCopy(language).dashboard;
  const adminCopy = dashboardCopy.admin;
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
    return (
      <FounderAccessBlocked
        copy={adminCopy}
        message={getFounderAccessMessage(error)}
      />
    );
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
    adminCopy.routeMessages.updated,
  );
  const routeError = readSafeRouteFlashMessage(
    params.error,
    adminCopy.routeMessages.actionFailed,
  );

  return (
    <FounderAdminThemeFrame initialTheme={initialTheme}>
      <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden lg:flex-row">
        <AdminTabsBar
          activePanel={activePanel}
          copy={adminCopy}
          healthNeedsAttention={productionHealthNeedsAttention}
          params={params}
          totals={overview.totals}
          usersTotal={overview.usersTotal}
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminTopBar
            activePanel={activePanel}
            copy={adminCopy}
            healthNeedsAttention={productionHealthNeedsAttention}
            themeLabels={dashboardCopy.theme}
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
                copy={adminCopy}
                health={productionHealth}
                healthNeedsAttention={productionHealthNeedsAttention}
                overview={overview}
                params={params}
              />
            ) : null}

            {activePanel === "businesses" ? (
              <FounderBusinessesSection
                businessById={businessById}
                copy={adminCopy}
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
                copy={adminCopy}
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
                copy={adminCopy}
                health={productionHealth}
                healthNeedsAttention={productionHealthNeedsAttention}
                totals={overview.totals}
                usersTotal={overview.usersTotal}
              />
            ) : null}

            {activePanel === "leads" ? (
              <FounderInboxSection copy={adminCopy} items={overview.leadInbox} />
            ) : null}

            {activePanel === "activity" ? (
              <FounderActivitySection
                actions={overview.recentActions}
                businesses={overview.businesses}
                copy={adminCopy}
                params={params}
                users={overview.users}
              />
            ) : null}
          </main>
        </section>
      </div>
    </FounderAdminThemeFrame>
  );
}
