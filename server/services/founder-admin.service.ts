/**
 * ============================================================
 * File: server/services/founder-admin.service.ts
 * Project: BizPilot AI
 * Description: Internal founder admin orchestration for manual pilot controls.
 * Role: Authorizes founder-only access before service-role plan/status actions.
 * Related:
 * - app/admin/page.tsx
 * - server/repositories/founder-admin.repository.ts
 * Author: MoOoH
 * Created: 2026-05-22
 * Last Updated: 2026-05-26
 * Change Log:
 * - 2026-05-26: Sent a server user agent on Auth Admin REST fallback to avoid browser-agent secret-key rejection.
 * ============================================================
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { getServerEnv } from "@/lib/env/server-env";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/server/services/auth.service";
import { recoverWorkspaceAccess } from "@/server/services/business.service";
import {
  getFounderAuthUserDeletionBlock,
  type FounderAuthUserDeletionBusinessContext,
} from "@/lib/founder-cleanup/auth-user-deletion";
import { safeLogger } from "@/server/logging/safe-logger";
import {
  getFounderBusiness,
  getFounderLeadById,
  insertFounderAdminAction,
  listFounderAdminLog,
  listFounderBusinesses,
  listFounderBusinessMembers,
  listFounderDeletionRequests,
  listFounderLeadInbox,
  listFounderLeadSignals,
  listFounderLeadSourcesByLeadIds,
  listFounderProfilesByUserIds,
  listFounderPublicLinks,
  listFounderUsageSignals,
  searchFounderProfilesByDisplayName,
  deleteFounderLeadThread,
  setFounderPublicLinksActive,
  updateFounderLeadStatus,
  updateFounderBusinessControls,
  type FounderAdminActionType,
  type FounderBusinessRecord,
  type FounderAdminLogRecord,
  type FounderBusinessMemberRecord,
  type FounderBusinessStatus,
  type FounderPlanSlug,
  type FounderSessionTimeoutMode,
  type FounderWorkspaceKind,
} from "@/server/repositories/founder-admin.repository";

export type FounderAdminActionSummary = Readonly<{
  actionType: string;
  createdAt: string;
  id: string;
  newValues: FounderAdminLogRecord["new_values"];
  note: string | null;
  previousValues: FounderAdminLogRecord["previous_values"];
}>;

export type FounderAdminBusiness = Readonly<{
  actionLog: FounderAdminActionSummary[];
  businessId: string;
  createdAt: string;
  internalNote: string | null;
  lastActivityAt: string | null;
  leadCount: number;
  deletionRequestStatus: string | null;
  lifecycleStatus: FounderBusinessRecord["lifecycle_status"];
  memberCount: number;
  ownerEmail: string;
  planExpiresAt: string | null;
  planSlug: FounderPlanSlug;
  preferredLanguage: FounderBusinessRecord["preferred_language"];
  publicLinkActive: boolean;
  publicSlug: string | null;
  sessionTimeoutMinutes: number | null;
  sessionTimeoutMode: FounderSessionTimeoutMode;
  slug: string;
  status: FounderBusinessStatus;
  usageCount: number;
  workspaceKind: FounderBusinessRecord["workspace_kind"];
  name: string;
}>;

export type FounderAdminUser = Readonly<{
  authEmail: string | null;
  authDeletionBlockedReason: string | null;
  businessAccessStatus: FounderBusinessStatus | null;
  businessId: string | null;
  businessName: string | null;
  createdAt: string;
  displayName: string | null;
  email: string;
  emailConfirmed: boolean;
  isFounder: boolean;
  lastSignInAt: string | null;
  leadCount: number | null;
  membershipRole: string | null;
  membershipStatus: string | null;
  phone: string | null;
  planSlug: FounderPlanSlug | null;
  preferredLanguage: FounderBusinessRecord["preferred_language"] | null;
  publicLinkActive: boolean | null;
  userId: string;
}>;

export type FounderAdminOverview = Readonly<{
  businesses: FounderAdminBusiness[];
  leadInbox: ReadonlyArray<{
    businessId: string;
    businessName: string;
    cityOrServiceArea: string | null;
    createdAt: string;
    customerContact: string | null;
    customerName: string | null;
    intakeSubmissionId: string;
    leadId: string;
    serviceType: string | null;
    sourceChannel: string | null;
    sourceReferrer: string | null;
    status: string;
  }>;
  recentActions: ReadonlyArray<{
    actionType: string;
    businessId: string | null;
    createdAt: string;
    note: string | null;
  }>;
  totals: {
    activePilots: number;
    businesses: number;
    paymentReady: number;
    suspended: number;
  };
  users: FounderAdminUser[];
  usersLastPage: number;
  usersPage: number;
  usersPageSize: number;
  usersQuery: string;
  usersSearchMode: "auth_filter" | "paged";
  usersTotal: number;
}>;

const planSlugs = new Set<FounderPlanSlug>([
  "founder_pilot",
  "starter",
  "pro",
  "paused",
]);
const businessStatuses = new Set<FounderBusinessStatus>([
  "onboarding",
  "active",
  "suspended",
  "cancelled",
]);
const workspaceKinds = new Set<FounderWorkspaceKind>([
  "production_customer",
  "founder_test",
  "demo",
  "seed",
]);
const sessionTimeoutModes = new Set<FounderSessionTimeoutMode>([
  "after_duration",
  "always_on",
]);
const founderUserPageSizes = new Set([5, 10]);
const minimumTemporaryPasswordLength = 12;
const sessionTimeoutMinuteOptions = new Set([15, 30, 60, 240, 480, 720, 1440, 10080]);
const serviceRoleUserAgent = "BizPilot-Server-Admin/1.0";

type FounderAuthUserRecord = Readonly<{
  confirmed_at?: string;
  created_at: string;
  email?: string;
  email_confirmed_at?: string;
  id: string;
  last_sign_in_at?: string;
  phone?: string;
  user_metadata?: Record<string, unknown>;
}>;

type FounderAuthUsersPage = Readonly<{
  lastPage: number;
  searchMode: "auth_filter" | "paged";
  total: number;
  users: FounderAuthUserRecord[];
}>;

function normalizeFounderSearch(value: string | null | undefined): string {
  return (value ?? "").trim();
}

export function readFounderUserPage(value: string | null | undefined): number {
  const page = Number.parseInt(value ?? "", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function readFounderUserPageSize(value: string | null | undefined): number {
  const pageSize = Number.parseInt(value ?? "", 10);

  return founderUserPageSizes.has(pageSize) ? pageSize : 10;
}

export function readFounderTemporaryPassword(value: string): string {
  if (value.length < minimumTemporaryPasswordLength) {
    throw new Error("Use at least 12 characters for the temporary password.");
  }

  return value;
}

export function readFounderSessionTimeoutMode(
  value: string,
): FounderSessionTimeoutMode {
  if (sessionTimeoutModes.has(value as FounderSessionTimeoutMode)) {
    return value as FounderSessionTimeoutMode;
  }

  throw new Error("Choose a valid sign-out policy.");
}

export function readFounderSessionTimeoutMinutes(value: string): number {
  const minutes = Number.parseInt(value, 10);

  if (sessionTimeoutMinuteOptions.has(minutes)) {
    return minutes;
  }

  throw new Error("Choose a valid sign-out duration.");
}

function readUserMetadataText(
  user: FounderAuthUserRecord,
  keys: ReadonlyArray<string>,
): string | null {
  const metadata = user.user_metadata;

  if (!metadata) {
    return null;
  }

  for (const key of keys) {
    const value = metadata[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function readFounderUserDisplayName(
  user: FounderAuthUserRecord,
  profileDisplayName: string | null | undefined,
): string | null {
  return (
    profileDisplayName ??
    readUserMetadataText(user, ["display_name", "full_name", "name"]) ??
    null
  );
}

function readFounderUserPhone(user: FounderAuthUserRecord): string | null {
  const metadataPhone = readUserMetadataText(user, ["phone", "phone_number"]);

  return user.phone && user.phone.trim().length > 0
    ? user.phone.trim()
    : metadataPhone;
}

function founderAuthUserMatchesQuery(input: {
  displayName: string | null;
  query: string;
  user: FounderAuthUserRecord;
}): boolean {
  const query = input.query.toLowerCase();

  if (!query) {
    return true;
  }

  const values = [
    input.displayName,
    input.user.email,
    input.user.id,
    readFounderUserPhone(input.user),
    readUserMetadataText(input.user, ["display_name", "full_name", "name"]),
  ];

  return values.some((value) => (value ?? "").toLowerCase().includes(query));
}

function shortTraceId(value: string): string {
  return value.slice(0, 8);
}

function assertPasswordTargetAllowed(input: {
  actor: AuthUser;
  founderEmails: Set<string>;
  targetEmail: string | null;
  targetUserId: string;
}): void {
  if (input.actor.id === input.targetUserId) {
    throw new Error("Founder admin cannot change the signed-in account password here.");
  }

  if (input.targetEmail && input.founderEmails.has(input.targetEmail.toLowerCase())) {
    throw new Error("Founder admin cannot change a founder allowlist account password here.");
  }
}

function logFounderAuthAdminFailure(input: {
  actionName: string;
  actorUserId: string;
  error: unknown;
  eventId: string;
  targetUserId: string;
}): void {
  safeLogger.error("founder_admin.auth_action_failed", {
    action_name: input.actionName,
    actor_user_id: input.actorUserId,
    admin_event_id: input.eventId,
    error_name: input.error instanceof Error ? input.error.name : "unknown",
    target_user_id: input.targetUserId,
  });
}

function logFounderAuthAdminSuccess(input: {
  actionName: string;
  actorUserId: string;
  eventId: string;
  targetUserId: string;
}): void {
  safeLogger.info("founder_admin.auth_action_completed", {
    action_name: input.actionName,
    actor_user_id: input.actorUserId,
    admin_event_id: input.eventId,
    target_user_id: input.targetUserId,
  });
}

async function listFounderTraceBusinessIdsForUser(input: {
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>;
  targetUserId: string;
}): Promise<string[]> {
  const [memberResult, ownedBusinessResult] = await Promise.all([
    input.supabase
      .from("business_members")
      .select("business_id")
      .eq("user_id", input.targetUserId),
    input.supabase
      .from("businesses")
      .select("id")
      .eq("owner_user_id", input.targetUserId),
  ]);

  if (memberResult.error) {
    throw new Error(memberResult.error.message);
  }

  if (ownedBusinessResult.error) {
    throw new Error(ownedBusinessResult.error.message);
  }

  return Array.from(
    new Set([
      ...(memberResult.data ?? []).map((membership) => membership.business_id),
      ...(ownedBusinessResult.data ?? []).map((business) => business.id),
    ]),
  );
}

async function insertFounderAuthActionLogs(input: {
  actionType: Extract<
    FounderAdminActionType,
    "password_reset_requested" | "temporary_password_set"
  >;
  actorUserId: string;
  eventId: string;
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>;
  targetEmail: string | null;
  targetUserId: string;
}): Promise<void> {
  const businessIds = await listFounderTraceBusinessIdsForUser({
    supabase: input.supabase,
    targetUserId: input.targetUserId,
  });

  await Promise.all(
    businessIds.map((businessId) =>
      insertFounderAdminAction({
        actionType: input.actionType,
        actorUserId: input.actorUserId,
        businessId,
        newValues: {
          admin_event_id: shortTraceId(input.eventId),
          target_email: input.targetEmail,
          target_user_id: input.targetUserId,
        },
        previousValues: {},
        supabase: input.supabase,
      }),
    ),
  );
}

function readFounderEmails(): Set<string> {
  const env = getServerEnv();
  return new Set(
    (env.BIZPILOT_FOUNDER_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function assertFounderUser(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new Error("Founder admin requires sign-in.");
  }

  const allowed = readFounderEmails();
  if (allowed.size === 0) {
    throw new Error("Founder admin is not configured.");
  }

  if (!user.email || !allowed.has(user.email.toLowerCase())) {
    throw new Error("Founder admin access required.");
  }

  return user;
}

export function isFounderUser(user: AuthUser | null): boolean {
  try {
    assertFounderUser(user);
    return true;
  } catch {
    return false;
  }
}

function countByBusiness(items: ReadonlyArray<{ business_id: string }>) {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.business_id, (counts.get(item.business_id) ?? 0) + 1);
  }
  return counts;
}

function latestByBusiness(items: ReadonlyArray<{ business_id: string; created_at: string }>) {
  const latest = new Map<string, string>();
  for (const item of items) {
    const existing = latest.get(item.business_id);
    if (!existing || item.created_at > existing) {
      latest.set(item.business_id, item.created_at);
    }
  }
  return latest;
}

function logFounderAdminReadUnavailable(input: {
  error: unknown;
  readName: string;
}): void {
  const errorRecord =
    input.error && typeof input.error === "object"
      ? (input.error as { code?: unknown; status?: unknown })
      : {};

  safeLogger.warn("founder_admin.read_unavailable", {
    error_code:
      typeof errorRecord.code === "string" ? errorRecord.code : undefined,
    error_name: input.error instanceof Error ? input.error.name : "unknown",
    read_name: input.readName,
    status:
      typeof errorRecord.status === "number" ||
      typeof errorRecord.status === "string"
        ? errorRecord.status
        : undefined,
  });
}

function mapFounderAdminAction(
  action: FounderAdminLogRecord,
): FounderAdminActionSummary {
  return {
    actionType: action.action_type,
    createdAt: action.created_at,
    id: action.id,
    newValues: action.new_values,
    note: action.note,
    previousValues: action.previous_values,
  };
}

export function readFounderPlanSlug(value: string): FounderPlanSlug {
  if (planSlugs.has(value as FounderPlanSlug)) {
    return value as FounderPlanSlug;
  }

  throw new Error("Invalid plan.");
}

export function readFounderBusinessStatus(value: string): FounderBusinessStatus {
  if (businessStatuses.has(value as FounderBusinessStatus)) {
    return value as FounderBusinessStatus;
  }

  throw new Error("Invalid business status.");
}

function readFounderRepairBusinessName(value: string): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new Error("Enter a business name for workspace repair.");
  }

  if (trimmed.length > 80) {
    throw new Error("Use 80 characters or fewer for the business name.");
  }

  return trimmed;
}

export function readFounderWorkspaceKind(value: string): FounderWorkspaceKind {
  if (workspaceKinds.has(value as FounderWorkspaceKind)) {
    return value as FounderWorkspaceKind;
  }

  throw new Error("Invalid workspace kind.");
}

async function fetchFounderAuthUsersFromRest(input: {
  filter?: string;
  page: number;
  pageSize: number;
}): Promise<FounderAuthUsersPage | null> {
  const env = getServerEnv();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const url = new URL("/auth/v1/admin/users", env.NEXT_PUBLIC_SUPABASE_URL);
  url.searchParams.set("page", String(input.page));
  url.searchParams.set("per_page", String(input.pageSize));
  if (input.filter) {
    url.searchParams.set("filter", input.filter);
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": serviceRoleUserAgent,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!response.ok) {
    safeLogger.warn("founder_admin.auth_rest_unavailable", {
      status: response.status,
    });
    return null;
  }

  const body = (await response.json()) as
    | { users?: FounderAuthUserRecord[] }
    | FounderAuthUserRecord[];
  const users = Array.isArray(body) ? body : (body.users ?? []);
  const totalHeader = response.headers.get("x-total-count");
  const total = totalHeader ? Number.parseInt(totalHeader, 10) : users.length;
  const safeTotal = Number.isFinite(total) ? total : users.length;

  return {
    lastPage: Math.max(1, Math.ceil(safeTotal / input.pageSize)),
    searchMode: input.filter ? "auth_filter" : "paged",
    total: safeTotal,
    users,
  };
}

async function listFounderAuthUsers(input: {
  page: number;
  pageSize: number;
  query: string;
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>;
}): Promise<FounderAuthUsersPage> {
  if (!input.query) {
    const usersResult = await input.supabase.auth.admin.listUsers({
      page: input.page,
      perPage: input.pageSize,
    });

    if (usersResult.error) {
      const fallback = await fetchFounderAuthUsersFromRest({
        page: input.page,
        pageSize: input.pageSize,
      });

      if (fallback) {
        return fallback;
      }

      throw usersResult.error;
    }

    return {
      lastPage: Math.max(1, usersResult.data.lastPage ?? 1),
      searchMode: "paged",
      total: usersResult.data.total ?? usersResult.data.users.length,
      users: usersResult.data.users,
    };
  }

  const [authFilterPage, profileMatches] = await Promise.all([
    fetchFounderAuthUsersFromRest({
      filter: input.query,
      page: input.page,
      pageSize: input.pageSize,
    }),
    searchFounderProfilesByDisplayName({
      page: input.page,
      pageSize: input.pageSize,
      query: input.query,
      supabase: input.supabase,
    }),
  ]);

  const profileUsers = await Promise.all(
    profileMatches.profiles.map(async (profile) => {
      const result = await input.supabase.auth.admin.getUserById(profile.user_id);

      if (result.error || !result.data.user) {
        return null;
      }

      return result.data.user;
    }),
  );

  const profileNameById = new Map(
    profileMatches.profiles.map((profile) => [
      profile.user_id,
      profile.display_name,
    ]),
  );
  const usersById = new Map<string, FounderAuthUserRecord>();

  for (const user of authFilterPage?.users ?? []) {
    usersById.set(user.id, user);
  }

  for (const user of profileUsers) {
    if (user) {
      usersById.set(user.id, user);
    }
  }

  const users = Array.from(usersById.values()).filter((user) =>
    founderAuthUserMatchesQuery({
      displayName: profileNameById.get(user.id) ?? null,
      query: input.query,
      user,
    }),
  );
  const total = Math.max(
    users.length,
    authFilterPage?.total ?? 0,
    profileMatches.total,
  );

  return {
    lastPage: Math.max(1, Math.ceil(total / input.pageSize)),
    searchMode: authFilterPage ? "auth_filter" : "paged",
    total,
    users: users.slice(0, input.pageSize),
  };
}

async function buildFounderLinkedUsersPage(input: {
  businesses: FounderBusinessRecord[];
  members: FounderBusinessMemberRecord[];
  page: number;
  pageSize: number;
  query: string;
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>;
}): Promise<FounderAuthUsersPage> {
  const createdAtByUserId = new Map<string, string>();
  const businessNamesByUserId = new Map<string, string[]>();

  function addUser(inputUser: {
    businessName?: string;
    createdAt: string;
    userId: string;
  }): void {
    const existingCreatedAt = createdAtByUserId.get(inputUser.userId);
    if (!existingCreatedAt || inputUser.createdAt < existingCreatedAt) {
      createdAtByUserId.set(inputUser.userId, inputUser.createdAt);
    }

    if (inputUser.businessName) {
      const names = businessNamesByUserId.get(inputUser.userId) ?? [];
      names.push(inputUser.businessName);
      businessNamesByUserId.set(inputUser.userId, names);
    }
  }

  for (const business of input.businesses) {
    addUser({
      businessName: business.name,
      createdAt: business.created_at,
      userId: business.owner_user_id,
    });
  }

  const businessNameById = new Map(
    input.businesses.map((business) => [business.id, business.name]),
  );

  for (const member of input.members) {
    const businessName = businessNameById.get(member.business_id);
    addUser({
      createdAt: member.created_at,
      ...(businessName ? { businessName } : {}),
      userId: member.user_id,
    });
  }

  const hydratedUsers = await Promise.all(
    Array.from(createdAtByUserId.keys()).map(async (userId) => {
      const result = await input.supabase.auth.admin.getUserById(userId);

      if (result.error || !result.data.user) {
        return {
          created_at: createdAtByUserId.get(userId) ?? new Date(0).toISOString(),
          id: userId,
        } satisfies FounderAuthUserRecord;
      }

      return result.data.user;
    }),
  );
  const normalizedQuery = input.query.toLowerCase();
  const filteredUsers = hydratedUsers.filter((user) => {
    if (!normalizedQuery) {
      return true;
    }

    const businessNames = businessNamesByUserId.get(user.id) ?? [];

    return founderAuthUserMatchesQuery({
      displayName: null,
      query: normalizedQuery,
      user,
    }) || businessNames.some((name) => name.toLowerCase().includes(normalizedQuery));
  });
  const total = filteredUsers.length;
  const from = (input.page - 1) * input.pageSize;

  return {
    lastPage: Math.max(1, Math.ceil(total / input.pageSize)),
    searchMode: "paged",
    total,
    users: filteredUsers.slice(from, from + input.pageSize),
  };
}

export async function getFounderAdminOverview(input: {
  userPage?: number;
  userPageSize?: number;
  userQuery?: string;
  user: AuthUser | null;
}): Promise<FounderAdminOverview> {
  const actor = assertFounderUser(input.user);

  const supabase = createSupabaseServiceRoleClient();
  const founderEmails = readFounderEmails();
  const usersPage = input.userPage ?? 1;
  const usersPageSize = input.userPageSize ?? 10;
  const usersQuery = normalizeFounderSearch(input.userQuery);
  const [
    businesses,
    members,
    links,
    leads,
    usageEvents,
    recentActions,
    deletionRequests,
    initialUsersResult,
    leadInbox,
  ] = await Promise.all([
    listFounderBusinesses({ supabase }).catch((error) => {
      logFounderAdminReadUnavailable({ error, readName: "businesses" });
      return [];
    }),
    listFounderBusinessMembers({ supabase }).catch((error) => {
      logFounderAdminReadUnavailable({ error, readName: "business_members" });
      return [];
    }),
    listFounderPublicLinks({ supabase }).catch((error) => {
      logFounderAdminReadUnavailable({ error, readName: "public_links" });
      return [];
    }),
    listFounderLeadSignals({ supabase }).catch((error) => {
      logFounderAdminReadUnavailable({ error, readName: "lead_signals" });
      return [];
    }),
    listFounderUsageSignals({ supabase }).catch((error) => {
      logFounderAdminReadUnavailable({ error, readName: "usage_signals" });
      return [];
    }),
    listFounderAdminLog({ limit: 100, supabase }).catch((error) => {
      safeLogger.warn("founder_admin.action_log_unavailable", {
        error_name: error instanceof Error ? error.name : "unknown",
      });

      return [];
    }),
    listFounderDeletionRequests({ supabase }).catch((error) => {
      safeLogger.warn("founder_admin.deletion_requests_unavailable", {
        error_name: error instanceof Error ? error.name : "unknown",
      });

      return [];
    }),
    listFounderAuthUsers({
      page: usersPage,
      pageSize: usersPageSize,
      query: usersQuery,
      supabase,
    }).catch((error) => {
      logFounderAdminReadUnavailable({ error, readName: "auth_users" });

      return {
        lastPage: 1,
        searchMode: "paged" as const,
        total: 0,
        users: [],
      };
    }),
    listFounderLeadInbox({ limit: 120, supabase }).catch((error) => {
      logFounderAdminReadUnavailable({ error, readName: "lead_inbox" });
      return [];
    }),
  ]);
  const leadSourceRows = await listFounderLeadSourcesByLeadIds({
    leadIds: leadInbox.map((lead) => lead.id),
    supabase,
  }).catch((error) => {
    logFounderAdminReadUnavailable({ error, readName: "lead_source_metadata" });
    return [];
  });

  let usersResult = initialUsersResult;
  if (usersResult.users.length === 0 && (businesses.length > 0 || members.length > 0)) {
    usersResult = await buildFounderLinkedUsersPage({
      businesses,
      members,
      page: usersPage,
      pageSize: usersPageSize,
      query: usersQuery,
      supabase,
    });
  }

  const userProfiles = await listFounderProfilesByUserIds({
    supabase,
    userIds: usersResult.users.map((user) => user.id),
  }).catch((error) => {
    logFounderAdminReadUnavailable({ error, readName: "profiles" });
    return [];
  });
  const profileDisplayNameByUserId = new Map(
    userProfiles.map((profile) => [profile.user_id, profile.display_name]),
  );

  const ownerEmailById = new Map(
    usersResult.users.map((user) => [user.id, user.email ?? user.id]),
  );
  const memberCountByBusiness = countByBusiness(members);
  const leadCountByBusiness = countByBusiness(leads);
  const usageCountByBusiness = countByBusiness(usageEvents);
  const latestLeadByBusiness = latestByBusiness(leads);
  const latestUsageByBusiness = latestByBusiness(usageEvents);
  const actionLogByBusiness = new Map<string, FounderAdminActionSummary[]>();
  const deletionRequestByBusiness = new Map(
    deletionRequests.map((request) => [request.business_id, request]),
  );
  const businessById = new Map(businesses.map((business) => [business.id, business]));
  const businessesByOwner = new Map<string, FounderBusinessRecord[]>();
  const membershipsByUser = new Map<string, FounderBusinessMemberRecord[]>();
  const primaryMemberByUser = new Map<string, FounderBusinessMemberRecord>();
  const firstLinkByBusiness = new Map<string, { active: boolean; slug: string }>();

  for (const business of businesses) {
    const existing = businessesByOwner.get(business.owner_user_id) ?? [];
    existing.push(business);
    businessesByOwner.set(business.owner_user_id, existing);
  }

  for (const member of members) {
    const existingMemberships = membershipsByUser.get(member.user_id) ?? [];
    existingMemberships.push(member);
    membershipsByUser.set(member.user_id, existingMemberships);

    const existing = primaryMemberByUser.get(member.user_id);

    if (
      !existing ||
      member.role === "owner" ||
      (existing.role !== "owner" && member.created_at < existing.created_at)
    ) {
      primaryMemberByUser.set(member.user_id, member);
    }
  }

  for (const link of links) {
    if (!firstLinkByBusiness.has(link.business_id) || link.is_active) {
      firstLinkByBusiness.set(link.business_id, {
        active: link.is_active,
        slug: link.slug,
      });
    }
  }

  for (const action of recentActions) {
    if (!action.business_id) {
      continue;
    }

    const existingActions = actionLogByBusiness.get(action.business_id) ?? [];
    existingActions.push(mapFounderAdminAction(action));
    actionLogByBusiness.set(action.business_id, existingActions);
  }
  const leadSourceByLeadId = new Map(
    leadSourceRows.map((row) => [row.lead_id, row]),
  );

  const overviewBusinesses = businesses.map((business) => {
    const latestLead = latestLeadByBusiness.get(business.id);
    const latestUsage = latestUsageByBusiness.get(business.id);
    const link = firstLinkByBusiness.get(business.id);

    return {
      actionLog: actionLogByBusiness.get(business.id)?.slice(0, 12) ?? [],
      businessId: business.id,
      createdAt: business.created_at,
      internalNote: business.internal_note,
      lastActivityAt:
        latestLead && latestUsage
          ? latestLead > latestUsage
            ? latestLead
            : latestUsage
          : (latestLead ?? latestUsage ?? null),
      leadCount: leadCountByBusiness.get(business.id) ?? 0,
      deletionRequestStatus:
        deletionRequestByBusiness.get(business.id)?.status ?? null,
      lifecycleStatus: business.lifecycle_status,
      memberCount: memberCountByBusiness.get(business.id) ?? 0,
      name: business.name,
      ownerEmail: ownerEmailById.get(business.owner_user_id) ?? business.owner_user_id,
      planExpiresAt: business.plan_expires_at,
      planSlug: business.plan_slug,
      preferredLanguage: business.preferred_language,
      publicLinkActive: link?.active ?? false,
      publicSlug: link?.slug ?? null,
      sessionTimeoutMinutes: business.session_timeout_minutes ?? null,
      sessionTimeoutMode: business.session_timeout_mode ?? "always_on",
      slug: business.slug,
      status: business.status,
      usageCount: usageCountByBusiness.get(business.id) ?? 0,
      workspaceKind: business.workspace_kind,
      };
  });

  const users = usersResult.users.map((user) => {
    const membership = primaryMemberByUser.get(user.id);
    const userMemberships = membershipsByUser.get(user.id) ?? [];
    const linkedBusinessById = new Map<
      string,
      FounderAuthUserDeletionBusinessContext
    >();

    for (const item of userMemberships) {
      const linkedBusiness = businessById.get(item.business_id);

      if (linkedBusiness) {
        linkedBusinessById.set(linkedBusiness.id, {
          businessId: linkedBusiness.id,
          membershipRole: item.role,
          ownerUserId: linkedBusiness.owner_user_id,
          workspaceKind: linkedBusiness.workspace_kind,
        });
      }
    }

    for (const business of businessesByOwner.get(user.id) ?? []) {
      if (!linkedBusinessById.has(business.id)) {
        linkedBusinessById.set(business.id, {
          businessId: business.id,
          membershipRole: null,
          ownerUserId: business.owner_user_id,
          workspaceKind: business.workspace_kind,
        });
      }
    }
    const business =
      membership ? businessById.get(membership.business_id) : businessesByOwner.get(user.id)?.[0];
    const link = business ? firstLinkByBusiness.get(business.id) : undefined;
    const isFounder = Boolean(user.email && founderEmails.has(user.email.toLowerCase()));
    const displayName = readFounderUserDisplayName(
      user,
      profileDisplayNameByUserId.get(user.id),
    );

    return {
      authEmail: user.email ?? null,
      authDeletionBlockedReason: getFounderAuthUserDeletionBlock({
        actorUserId: actor.id,
        isFounderUser: isFounder,
        linkedBusinesses: Array.from(linkedBusinessById.values()),
        targetUserId: user.id,
      }),
      businessAccessStatus: business?.status ?? null,
      businessId: business?.id ?? null,
      businessName: business?.name ?? null,
      createdAt: user.created_at,
      displayName,
      email: user.email ?? user.id,
      emailConfirmed: Boolean(user.email_confirmed_at ?? user.confirmed_at),
      isFounder,
      lastSignInAt: user.last_sign_in_at ?? null,
      leadCount: business ? (leadCountByBusiness.get(business.id) ?? 0) : null,
      membershipRole: membership?.role ?? null,
      membershipStatus: membership?.status ?? null,
      phone: readFounderUserPhone(user),
      planSlug: business?.plan_slug ?? null,
      preferredLanguage: business?.preferred_language ?? null,
      publicLinkActive: business ? (link?.active ?? false) : null,
      userId: user.id,
    };
  });

  return {
    businesses: overviewBusinesses,
    leadInbox: leadInbox.map((lead) => ({
      businessId: lead.business_id,
      businessName:
        businessById.get(lead.business_id)?.name ?? "Unknown workspace",
      cityOrServiceArea: lead.city_or_service_area,
      createdAt: lead.created_at,
      customerContact: lead.customer_contact,
      customerName: lead.customer_name,
      intakeSubmissionId: lead.intake_submission_id,
      leadId: lead.id,
      serviceType: lead.service_type,
      sourceChannel: lead.source_channel ?? null,
      sourceReferrer: leadSourceByLeadId.get(lead.id)?.referrer ?? null,
      status: lead.status,
    })),
    recentActions: recentActions.map((action) => ({
      actionType: action.action_type,
      businessId: action.business_id,
      createdAt: action.created_at,
      note: action.note,
    })),
    totals: {
      activePilots: overviewBusinesses.filter(
        (business) => business.status === "active" || business.status === "onboarding",
      ).length,
      businesses: overviewBusinesses.length,
      paymentReady: overviewBusinesses.filter(
        (business) => business.planSlug === "starter" || business.planSlug === "pro",
      ).length,
      suspended: overviewBusinesses.filter(
        (business) => business.status === "suspended" || business.status === "cancelled",
      ).length,
    },
    users,
    usersLastPage: usersResult.lastPage,
    usersPage,
    usersPageSize,
    usersQuery,
    usersSearchMode: usersResult.searchMode,
    usersTotal: usersResult.total,
  };
}

export async function updateFounderInboxLeadStatus(input: {
  leadId: string;
  status: "archived" | "reviewed";
  user: AuthUser | null;
}): Promise<void> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const before = await getFounderLeadById({ leadId: input.leadId, supabase });
  const after = await updateFounderLeadStatus({
    leadId: input.leadId,
    status: input.status,
    supabase,
  });

  await insertFounderAdminAction({
    actionType: "status_changed",
    actorUserId: actor.id,
    businessId: after.business_id,
    newValues: {
      lead_id: after.id,
      lead_status: after.status,
    },
    note: `Inbox lead marked ${input.status}`,
    previousValues: {
      lead_id: before.id,
      lead_status: before.status,
    },
    supabase,
  });
}

export async function deleteFounderInboxLead(input: {
  acknowledged: boolean;
  leadId: string;
  typedConfirmation: string;
  user: AuthUser | null;
}): Promise<void> {
  if (!input.acknowledged) {
    throw new Error("Confirm that this deletion cannot be undone.");
  }

  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const lead = await getFounderLeadById({ leadId: input.leadId, supabase });
  const expected = lead.id.toLowerCase();

  if (input.typedConfirmation.trim().toLowerCase() !== expected) {
    throw new Error("Type the exact lead ID to confirm deletion.");
  }

  await deleteFounderLeadThread({
    businessId: lead.business_id,
    submissionId: lead.intake_submission_id,
    supabase,
  });

  await insertFounderAdminAction({
    actionType: "status_changed",
    actorUserId: actor.id,
    businessId: lead.business_id,
    newValues: {
      deleted_lead_id: lead.id,
      deleted_submission_id: lead.intake_submission_id,
      operation: "hard_delete",
    },
    note: "Inbox lead hard-deleted by founder admin.",
    previousValues: {
      lead_status: lead.status,
    },
    supabase,
  });
}

export async function requestFounderUserPasswordReset(input: {
  targetUserId: string;
  user: AuthUser | null;
}): Promise<string> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const eventId = randomUUID();

  try {
    const { data, error } = await supabase.auth.admin.getUserById(input.targetUserId);

    if (error) {
      throw new Error(error.message);
    }

    const target = data.user;
    const targetEmail = target.email?.trim() ?? null;

    if (!targetEmail) {
      throw new Error("Target user does not have an email address.");
    }

    const env = getServerEnv();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: new URL("/auth/reset-password", env.NEXT_PUBLIC_APP_URL).toString(),
    });

    if (resetError) {
      throw new Error(resetError.message);
    }

    await insertFounderAuthActionLogs({
      actionType: "password_reset_requested",
      actorUserId: actor.id,
      eventId,
      supabase,
      targetEmail,
      targetUserId: input.targetUserId,
    });

    logFounderAuthAdminSuccess({
      actionName: "password_reset_requested",
      actorUserId: actor.id,
      eventId,
      targetUserId: input.targetUserId,
    });

    return shortTraceId(eventId);
  } catch (error) {
    logFounderAuthAdminFailure({
      actionName: "password_reset_requested",
      actorUserId: actor.id,
      error,
      eventId,
      targetUserId: input.targetUserId,
    });
    throw error;
  }
}

export async function repairFounderUserWorkspace(input: {
  businessName: string;
  targetUserId: string;
  user: AuthUser | null;
}): Promise<string> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const eventId = randomUUID();
  const businessName = readFounderRepairBusinessName(input.businessName);

  const targetResult = await supabase.auth.admin.getUserById(input.targetUserId);
  if (targetResult.error || !targetResult.data.user) {
    throw new Error("Auth user not found.");
  }

  const target = targetResult.data.user;
  if (!target.email_confirmed_at && !target.confirmed_at) {
    throw new Error("Confirm the user's email before workspace repair.");
  }

  const [memberResult, ownedBusinessResult] = await Promise.all([
    supabase
      .from("business_members")
      .select("id")
      .eq("user_id", input.targetUserId)
      .limit(1),
    supabase
      .from("businesses")
      .select("id")
      .eq("owner_user_id", input.targetUserId)
      .limit(1),
  ]);

  if (memberResult.error) {
    throw new Error(memberResult.error.message);
  }

  if (ownedBusinessResult.error) {
    throw new Error(ownedBusinessResult.error.message);
  }

  if (
    (memberResult.data?.length ?? 0) > 0 ||
    (ownedBusinessResult.data?.length ?? 0) > 0
  ) {
    throw new Error("Target user already has a workspace or membership.");
  }

  try {
    const business = await recoverWorkspaceAccess({
      businessName,
      userId: input.targetUserId,
    });

    await insertFounderAdminAction({
      actionType: "internal_note_added",
      actorUserId: actor.id,
      businessId: business.id,
      newValues: {
        admin_event_id: shortTraceId(eventId),
        repair: "workspace_recovered",
        target_email: target.email ?? null,
        target_user_id: input.targetUserId,
      },
      note: "Founder repaired a confirmed auth user with no workspace membership.",
      previousValues: {},
      supabase,
    });

    safeLogger.info("founder_admin.workspace_repair_completed", {
      actor_user_id: actor.id,
      admin_event_id: eventId,
      business_id: business.id,
      target_user_id: input.targetUserId,
    });

    return shortTraceId(eventId);
  } catch (error) {
    safeLogger.error("founder_admin.workspace_repair_failed", {
      actor_user_id: actor.id,
      admin_event_id: eventId,
      error_name: error instanceof Error ? error.name : "unknown",
      target_user_id: input.targetUserId,
    });
    throw error;
  }
}

export async function setFounderUserTemporaryPassword(input: {
  targetUserId: string;
  temporaryPassword: string;
  user: AuthUser | null;
}): Promise<string> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const eventId = randomUUID();

  try {
    const { data, error } = await supabase.auth.admin.getUserById(input.targetUserId);

    if (error) {
      throw new Error(error.message);
    }

    const target = data.user;
    const targetEmail = target.email?.trim() ?? null;

    assertPasswordTargetAllowed({
      actor,
      founderEmails: readFounderEmails(),
      targetEmail,
      targetUserId: input.targetUserId,
    });

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      input.targetUserId,
      { password: input.temporaryPassword },
    );

    if (updateError) {
      throw new Error(updateError.message);
    }

    await insertFounderAuthActionLogs({
      actionType: "temporary_password_set",
      actorUserId: actor.id,
      eventId,
      supabase,
      targetEmail,
      targetUserId: input.targetUserId,
    });

    logFounderAuthAdminSuccess({
      actionName: "temporary_password_set",
      actorUserId: actor.id,
      eventId,
      targetUserId: input.targetUserId,
    });

    return shortTraceId(eventId);
  } catch (error) {
    logFounderAuthAdminFailure({
      actionName: "temporary_password_set",
      actorUserId: actor.id,
      error,
      eventId,
      targetUserId: input.targetUserId,
    });
    throw error;
  }
}

export async function updateFounderPlan(input: {
  businessId: string;
  note?: string;
  planSlug: FounderPlanSlug;
  user: AuthUser | null;
}): Promise<void> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const before = await getFounderBusiness({ businessId: input.businessId, supabase });

  const after = await updateFounderBusinessControls({
    businessId: input.businessId,
    planSlug: input.planSlug,
    supabase,
  });

  if (input.planSlug === "paused") {
    await setFounderPublicLinksActive({
      active: false,
      businessId: input.businessId,
      supabase,
    });
  }

  await insertFounderAdminAction({
    actionType: "plan_changed",
    actorUserId: actor.id,
    businessId: input.businessId,
    newValues: {
      plan_slug: after.plan_slug,
      quote_links_disabled: input.planSlug === "paused",
    },
    note: input.note ?? null,
    previousValues: { plan_slug: before.plan_slug },
    supabase,
  });
}

export async function updateFounderStatus(input: {
  businessId: string;
  note?: string;
  status: FounderBusinessStatus;
  user: AuthUser | null;
}): Promise<void> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const before = await getFounderBusiness({ businessId: input.businessId, supabase });
  const after = await updateFounderBusinessControls({
    businessId: input.businessId,
    status: input.status,
    supabase,
  });
  const shouldDisableLinks =
    input.status === "suspended" || input.status === "cancelled";

  if (shouldDisableLinks) {
    await setFounderPublicLinksActive({
      active: false,
      businessId: input.businessId,
      supabase,
    });
  }

  await insertFounderAdminAction({
    actionType:
      input.status === "suspended"
        ? "business_suspended"
        : input.status === "cancelled"
          ? "business_cancelled"
          : input.status === "active"
            ? "business_reactivated"
            : "status_changed",
    actorUserId: actor.id,
    businessId: input.businessId,
    newValues: {
      quote_links_disabled: shouldDisableLinks,
      status: after.status,
    },
    note: input.note ?? null,
    previousValues: { status: before.status },
    supabase,
  });
}

export async function updateFounderWorkspaceKind(input: {
  businessId: string;
  note?: string;
  user: AuthUser | null;
  workspaceKind: FounderWorkspaceKind;
}): Promise<void> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const before = await getFounderBusiness({ businessId: input.businessId, supabase });
  const after = await updateFounderBusinessControls({
    businessId: input.businessId,
    supabase,
    workspaceKind: input.workspaceKind,
  });

  await insertFounderAdminAction({
    actionType: "status_changed",
    actorUserId: actor.id,
    businessId: input.businessId,
    newValues: { workspace_kind: after.workspace_kind },
    note: input.note ?? null,
    previousValues: { workspace_kind: before.workspace_kind },
    supabase,
  });
}

export async function updateFounderQuoteLink(input: {
  active: boolean;
  businessId: string;
  note?: string;
  user: AuthUser | null;
}): Promise<void> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();

  await setFounderPublicLinksActive({
    active: input.active,
    businessId: input.businessId,
    supabase,
  });

  await insertFounderAdminAction({
    actionType: input.active ? "quote_link_enabled" : "quote_link_disabled",
    actorUserId: actor.id,
    businessId: input.businessId,
    newValues: { public_link_active: input.active },
    note: input.note ?? null,
    previousValues: {},
    supabase,
  });
}

export async function updateFounderSessionPolicy(input: {
  businessId: string;
  note?: string;
  sessionTimeoutMinutes: number | null;
  sessionTimeoutMode: FounderSessionTimeoutMode;
  user: AuthUser | null;
}): Promise<void> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const before = await getFounderBusiness({ businessId: input.businessId, supabase });
  const nextMinutes =
    input.sessionTimeoutMode === "after_duration"
      ? (input.sessionTimeoutMinutes ?? 480)
      : null;

  const after = await updateFounderBusinessControls({
    businessId: input.businessId,
    sessionTimeoutMinutes: nextMinutes,
    sessionTimeoutMode: input.sessionTimeoutMode,
    supabase,
  });

  await insertFounderAdminAction({
    actionType: "session_policy_changed",
    actorUserId: actor.id,
    businessId: input.businessId,
    newValues: {
      session_timeout_minutes: after.session_timeout_minutes,
      session_timeout_mode: after.session_timeout_mode,
    },
    note: input.note ?? null,
    previousValues: {
      session_timeout_minutes: before.session_timeout_minutes ?? null,
      session_timeout_mode: before.session_timeout_mode ?? "always_on",
    },
    supabase,
  });
}

export async function updateFounderInternalNote(input: {
  businessId: string;
  note: string;
  user: AuthUser | null;
}): Promise<void> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const before = await getFounderBusiness({ businessId: input.businessId, supabase });
  const trimmed = input.note.trim();

  await updateFounderBusinessControls({
    businessId: input.businessId,
    internalNote: trimmed.length > 0 ? trimmed : null,
    supabase,
  });

  await insertFounderAdminAction({
    actionType: "internal_note_added",
    actorUserId: actor.id,
    businessId: input.businessId,
    newValues: { internal_note_present: trimmed.length > 0 },
    note: trimmed,
    previousValues: { internal_note_present: Boolean(before.internal_note) },
    supabase,
  });
}
