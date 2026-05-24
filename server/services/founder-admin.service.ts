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
  listFounderPublicLinks,
  listFounderUsageSignals,
  setFounderPublicLinksActive,
  updateFounderBusinessControls,
  type FounderBusinessRecord,
  type FounderBusinessMemberRecord,
  type FounderBusinessStatus,
  type FounderPlanSlug,
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
  businessName: string | null;
  createdAt: string;
  email: string;
  emailConfirmed: boolean;
  isFounder: boolean;
  lastSignInAt: string | null;
  leadCount: number | null;
  membershipRole: string | null;
  membershipStatus: string | null;
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
  usersResultLimit: number;
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

export async function getFounderAdminOverview(input: {
  user: AuthUser | null;
}): Promise<FounderAdminOverview> {
  const actor = assertFounderUser(input.user);

  const supabase = createSupabaseServiceRoleClient();
  const founderEmails = readFounderEmails();
  const usersResultLimit = 1000;
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
    supabase.auth.admin.listUsers({ page: 1, perPage: usersResultLimit }),
  ]);

  if (usersResult.error) {
    throw new Error(usersResult.error.message);
  }

  const ownerEmailById = new Map(
    usersResult.data.users.map((user) => [user.id, user.email ?? user.id]),
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

  const users = usersResult.data.users.map((user) => {
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
    const business = membership ? businessById.get(membership.business_id) : undefined;
    const link = business ? firstLinkByBusiness.get(business.id) : undefined;
    const isFounder = Boolean(user.email && founderEmails.has(user.email.toLowerCase()));

    return {
      authEmail: user.email ?? null,
      authDeletionBlockedReason: getFounderAuthUserDeletionBlock({
        actorUserId: actor.id,
        isFounderUser: isFounder,
        linkedBusinesses: Array.from(linkedBusinessById.values()),
        targetUserId: user.id,
      }),
      businessAccessStatus: business?.status ?? null,
      businessName: business?.name ?? null,
      createdAt: user.created_at,
      email: user.email ?? user.id,
      emailConfirmed: Boolean(user.email_confirmed_at ?? user.confirmed_at),
      isFounder,
      lastSignInAt: user.last_sign_in_at ?? null,
      leadCount: business ? (leadCountByBusiness.get(business.id) ?? 0) : null,
      membershipRole: membership?.role ?? null,
      membershipStatus: membership?.status ?? null,
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
    usersResultLimit,
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
