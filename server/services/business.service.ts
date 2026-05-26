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
  getCleaningTemplate,
  replaceBusinessFaqs,
  replaceBusinessOnboardingTasks,
  replaceBusinessServiceAreas,
  replaceBusinessServices,
  upsertBusinessBranding,
  upsertConsentSettings,
  upsertPrivacySettings,
  upsertTemplateSettings,
} from "@/server/repositories/business-configuration.repository";
import {
  createBusinessForOwner,
  listBusinessesForUser,
  updateBusinessPreferredLanguage,
  type BusinessRecord,
} from "@/server/repositories/businesses.repository";
import {
  upsertConsentVersion,
  upsertIntakeFormFromTemplate,
  upsertPublicLinkVariant,
} from "@/server/repositories/public-intake.repository";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { safeLogger } from "@/server/logging/safe-logger";

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

async function bootstrapDefaultQuoteConfiguration(input: {
  business: BusinessRecord;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const cleaningTemplate = await getCleaningTemplate({
    businessId: input.business.id,
    preferredLanguage: input.business.preferred_language,
    supabase: input.supabase,
  });
  const consentNotice =
    "By submitting this request, you agree that the business may contact you about your quote. AI may help draft owner-reviewed replies.";

  await Promise.all([
    upsertBusinessBranding({
      accentColor: "#0f766e",
      businessId: input.business.id,
      primaryColor: "#18181b",
      supabase: input.supabase,
    }),
    replaceBusinessServices({
      businessId: input.business.id,
      services: [
        {
          description: "Routine residential cleaning requests.",
          name: "Standard cleaning",
        },
        {
          description: "More detailed cleaning for move-outs or resets.",
          name: "Deep cleaning",
        },
      ],
      supabase: input.supabase,
    }),
    replaceBusinessFaqs({
      businessId: input.business.id,
      faqs: [
        {
          answer:
            "Share the basics in the quote form and the owner can follow up with next steps.",
          question: "How do I request a cleaning quote?",
        },
      ],
      supabase: input.supabase,
    }),
    replaceBusinessServiceAreas({
      areas: ["Primary service area"],
      businessId: input.business.id,
      supabase: input.supabase,
    }),
    upsertPrivacySettings({
      businessId: input.business.id,
      privacyMode: "standard",
      retainLeadsDays: 365,
      supabase: input.supabase,
    }),
    upsertConsentSettings({
      aiDisclosureEnabled: true,
      businessId: input.business.id,
      consentNotice,
      supabase: input.supabase,
    }),
    upsertTemplateSettings({
      businessId: input.business.id,
      fieldOverrides: { fields: {} },
      supabase: input.supabase,
      templateId: cleaningTemplate.template.id,
    }),
  ]);

  await Promise.all([
    upsertPublicLinkVariant({
      businessId: input.business.id,
      displayName: input.business.name,
      preferredLanguage: input.business.preferred_language,
      slug: input.business.slug,
      supabase: input.supabase,
    }),
    upsertConsentVersion({
      aiDisclosureEnabled: true,
      businessId: input.business.id,
      consentNotice,
      supabase: input.supabase,
    }),
    upsertIntakeFormFromTemplate({
      businessId: input.business.id,
      fields: cleaningTemplate.fields,
      formName: cleaningTemplate.template.name,
      privacyMode: "standard",
      supabase: input.supabase,
      templateId: cleaningTemplate.template.id,
    }),
  ]);

  await replaceBusinessOnboardingTasks({
    businessId: input.business.id,
    supabase: input.supabase,
    tasks: [
      { complete: true, label: "Business profile confirmed", taskKey: "business_profile" },
      { complete: true, label: "Branding configured", taskKey: "branding" },
      { complete: true, label: "At least one service added", taskKey: "services" },
      { complete: true, label: "At least one service area added", taskKey: "service_areas" },
      { complete: true, label: "At least one FAQ added", taskKey: "faqs" },
      { complete: true, label: "Privacy mode selected", taskKey: "privacy" },
      { complete: true, label: "Consent notice configured", taskKey: "consent" },
      { complete: true, label: "Cleaning template activated", taskKey: "cleaning_template" },
    ],
  });
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

  await bootstrapDefaultQuoteConfiguration({
    business,
    supabase,
  });

  return business;
}

function isDashboardAccessibleBusiness(business: BusinessRecord): boolean {
  return (
    (business.status === "onboarding" || business.status === "active") &&
    business.lifecycle_status === "active" &&
    business.plan_slug !== "paused"
  );
}

function hasActiveOwnerMembership(input: {
  businessId: string;
  memberships: BusinessMemberRecord[];
  userId: string;
}): boolean {
  return input.memberships.some(
    (membership) =>
      membership.business_id === input.businessId &&
      membership.user_id === input.userId &&
      membership.role === "owner" &&
      membership.status === "active",
  );
}

function hasAnyMembership(input: {
  businessId: string;
  memberships: BusinessMemberRecord[];
  userId: string;
}): boolean {
  return input.memberships.some(
    (membership) =>
      membership.business_id === input.businessId &&
      membership.user_id === input.userId,
  );
}

export async function recoverWorkspaceAccess(input: {
  businessName: string;
  userId: string;
}): Promise<BusinessRecord> {
  const businessName = input.businessName.trim();

  if (businessName.length === 0) {
    throw new Error("Business name is required.");
  }

  const supabase = createSupabaseServiceRoleClient();
  const [memberResult, ownedBusinessResult] = await Promise.all([
    supabase
      .from("business_members")
      .select("*")
      .eq("user_id", input.userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("businesses")
      .select("*")
      .eq("owner_user_id", input.userId)
      .order("created_at", { ascending: true }),
  ]);

  if (memberResult.error) {
    throw new Error(memberResult.error.message);
  }

  if (ownedBusinessResult.error) {
    throw new Error(ownedBusinessResult.error.message);
  }

  const memberships = memberResult.data ?? [];
  const ownedBusinesses = ownedBusinessResult.data ?? [];
  const recoverableOwnedBusiness = ownedBusinesses.find(isDashboardAccessibleBusiness);

  if (recoverableOwnedBusiness) {
    if (
      !hasActiveOwnerMembership({
        businessId: recoverableOwnedBusiness.id,
        memberships,
        userId: input.userId,
      })
    ) {
      if (
        hasAnyMembership({
          businessId: recoverableOwnedBusiness.id,
          memberships,
          userId: input.userId,
        })
      ) {
        throw new Error(
          "This account already has a workspace record that needs founder review.",
        );
      }

      await createOwnerMembership({
        businessId: recoverableOwnedBusiness.id,
        supabase,
        userId: input.userId,
      });

      safeLogger.info("workspace_recovery.owner_membership_created", {
        businessId: recoverableOwnedBusiness.id,
        userId: input.userId,
      });
    }

    return recoverableOwnedBusiness;
  }

  if (ownedBusinesses.length > 0 || memberships.length > 0) {
    safeLogger.warn("workspace_recovery.blocked_existing_workspace_state", {
      ownedBusinessCount: ownedBusinesses.length,
      membershipCount: memberships.length,
      userId: input.userId,
    });
    throw new Error(
      "This account already has a workspace record that needs founder review.",
    );
  }

  const business = await createFoundingBusiness({
    businessName,
    ownerUserId: input.userId,
    serviceRole: true,
  });

  safeLogger.info("workspace_recovery.workspace_created", {
    businessId: business.id,
    userId: input.userId,
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
