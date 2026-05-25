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
 * Last Updated: 2026-05-22
 * ============================================================
 */

import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/server/services/auth.service";
import { getServerEnv } from "@/lib/env/server-env";
import {
  getFounderAuthUserDeletionBlock,
  type FounderAuthUserDeletionBusinessContext,
} from "@/lib/founder-cleanup/auth-user-deletion";
import {
  getFounderBusiness,
  insertFounderAdminAction,
  listFounderAdminLog,
  listFounderBusinesses,
  listFounderBusinessMembers,
  listFounderDeletionRequests,
  listFounderLeadSignals,
  listFounderProfilesByUserIds,
  listFounderPublicLinks,
  listFounderUsageSignals,
  searchFounderProfilesByDisplayName,
  setFounderPublicLinksActive,
  updateFounderBusinessControls,
  type FounderBusinessRecord,
  type FounderBusinessMemberRecord,
  type FounderBusinessStatus,
  type FounderPlanSlug,
  type FounderWorkspaceKind,
} from "@/server/repositories/founder-admin.repository";

export type FounderAdminBusiness = Readonly<{
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
const founderUserPageSizes = new Set([5, 10]);

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

export function readFounderWorkspaceKind(value: string): FounderWorkspaceKind {
  if (workspaceKinds.has(value as FounderWorkspaceKind)) {
    return value as FounderWorkspaceKind;
  }

  throw new Error("Invalid workspace kind.");
}

async function fetchFounderAuthUsersWithFilter(input: {
  page: number;
  pageSize: number;
  query: string;
}): Promise<FounderAuthUsersPage | null> {
  const env = getServerEnv();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const url = new URL("/auth/v1/admin/users", env.NEXT_PUBLIC_SUPABASE_URL);
  url.searchParams.set("page", String(input.page));
  url.searchParams.set("per_page", String(input.pageSize));
  url.searchParams.set("filter", input.query);

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!response.ok) {
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
    searchMode: "auth_filter",
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
      throw new Error(usersResult.error.message);
    }

    return {
      lastPage: Math.max(1, usersResult.data.lastPage ?? 1),
      searchMode: "paged",
      total: usersResult.data.total ?? usersResult.data.users.length,
      users: usersResult.data.users,
    };
  }

  const [authFilterPage, profileMatches] = await Promise.all([
    fetchFounderAuthUsersWithFilter({
      page: input.page,
      pageSize: input.pageSize,
      query: input.query,
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
    usersResult,
  ] = await Promise.all([
    listFounderBusinesses({ supabase }),
    listFounderBusinessMembers({ supabase }),
    listFounderPublicLinks({ supabase }),
    listFounderLeadSignals({ supabase }),
    listFounderUsageSignals({ supabase }),
    listFounderAdminLog({ supabase }),
    listFounderDeletionRequests({ supabase }),
    listFounderAuthUsers({
      page: usersPage,
      pageSize: usersPageSize,
      query: usersQuery,
      supabase,
    }),
  ]);

  const userProfiles = await listFounderProfilesByUserIds({
    supabase,
    userIds: usersResult.users.map((user) => user.id),
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

  const overviewBusinesses = businesses.map((business) => {
    const latestLead = latestLeadByBusiness.get(business.id);
    const latestUsage = latestUsageByBusiness.get(business.id);
    const link = firstLinkByBusiness.get(business.id);

    return {
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
