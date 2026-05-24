/**
 * ============================================================
 * File: server/services/business.service.ts
 * Project: BizPilot AI
 * Description: Coordinates Phase 2 tenant business setup and membership reads.
 * Role: Owns business foundation workflows without adding product configuration.
 * Related:
 * - server/repositories/businesses.repository.ts
 * - server/repositories/business-members.repository.ts
 * - server/policies/business-membership.policy.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-04: Created Phase 2 business foundation service.
 * - 2026-05-04: Added service-role path for sign-up before confirmed sessions.
 * - 2026-05-04: Migrated business workflows to official Supabase SDK clients.
 * ============================================================
 */

import "server-only";

import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import {
  createOwnerMembership,
  listMembershipsForUser,
  type BusinessMemberRecord,
} from "@/server/repositories/business-members.repository";
import {
  createBusinessForOwner,
  listBusinessesForUser,
  updateBusinessPreferredLanguage,
  type BusinessRecord,
} from "@/server/repositories/businesses.repository";

export type BusinessWorkspace = Readonly<{
  businesses: BusinessRecord[];
  memberships: BusinessMemberRecord[];
}>;

export type WorkspaceAccessSummary = Readonly<{
  businessName: string;
  lifecycleStatus: BusinessRecord["lifecycle_status"];
  status: BusinessRecord["status"];
}> | null;

function toSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || `business-${Date.now()}`;
}

function withSlugSuffix(input: { baseSlug: string; suffix: string }): string {
  const suffix = input.suffix.replace(/[^a-z0-9]/g, "").slice(0, 8);
  const maxBaseLength = Math.max(1, 48 - suffix.length - 1);

  return `${input.baseSlug.slice(0, maxBaseLength)}-${suffix}`;
}

function isUniqueSlugError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  return (
    message.includes("duplicate key") ||
    message.includes("unique constraint") ||
    message.includes("businesses_slug") ||
    message.includes("slug")
  );
}

export async function createFoundingBusiness(input: {
  businessName: string;
  ownerUserId: string;
  serviceRole?: boolean;
}): Promise<BusinessRecord> {
  const supabase = input.serviceRole
    ? createSupabaseServiceRoleClient()
    : await createSupabaseServerClient();
  const baseSlug = toSlug(input.businessName);
  const fallbackSlug = withSlugSuffix({
    baseSlug,
    suffix: input.ownerUserId,
  });
  let business: BusinessRecord;

  try {
    business = await createBusinessForOwner({
      name: input.businessName,
      ownerUserId: input.ownerUserId,
      slug: baseSlug,
      supabase,
    });
  } catch (error) {
    if (!isUniqueSlugError(error)) {
      throw error;
    }

    business = await createBusinessForOwner({
      name: input.businessName,
      ownerUserId: input.ownerUserId,
      slug: fallbackSlug,
      supabase,
    });
  }

  await createOwnerMembership({
    businessId: business.id,
    supabase,
    userId: input.ownerUserId,
  });

  return business;
}

export async function getBusinessWorkspace(input: {
  userId: string;
}): Promise<BusinessWorkspace> {
  const supabase = await createSupabaseServerClient();
  const [businesses, memberships] = await Promise.all([
    listBusinessesForUser({ supabase }),
    listMembershipsForUser({
      supabase,
      userId: input.userId,
    }),
  ]);

  return {
    businesses,
    memberships,
  };
}

export async function getWorkspaceAccessSummary(input: {
  userId: string;
}): Promise<WorkspaceAccessSummary> {
  const supabase = createSupabaseServiceRoleClient();
  const memberships = await listMembershipsForUser({
    supabase,
    userId: input.userId,
  });
  const businessIds = memberships.map((membership) => membership.business_id);

  if (businessIds.length === 0) {
    return null;
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("id,name,status,lifecycle_status")
    .in("id", businessIds)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const business = data?.[0];

  return business
    ? {
        businessName: business.name,
        lifecycleStatus: business.lifecycle_status,
        status: business.status,
      }
    : null;
}

export async function updateWorkspaceLanguage(input: {
  businessId: string;
  language: BusinessRecord["preferred_language"];
  userId: string;
}): Promise<BusinessRecord> {
  const supabase = await createSupabaseServerClient();
  const memberships = await listMembershipsForUser({
    supabase,
    userId: input.userId,
  });
  const canManage = memberships.some(
    (membership) =>
      membership.business_id === input.businessId &&
      (membership.role === "owner" || membership.role === "admin"),
  );

  if (!canManage) {
    throw new Error("You do not have permission to manage this business.");
  }

  return updateBusinessPreferredLanguage({
    businessId: input.businessId,
    preferredLanguage: input.language,
    supabase,
  });
}
