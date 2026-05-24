/**
 * ============================================================
 * File: server/services/business-deletion.service.ts
 * Project: BizPilot AI
 * Description: Owner-controlled workspace deletion request orchestration.
 * Role: Creates deletion requests and locks business workspaces without purging data.
 * Related:
 * - server/actions/business-deletion.actions.ts
 * - lib/business-deletion/confirmation.ts
 * - supabase/migrations/0018_business_lifecycle_deletion_foundation.sql
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import {
  validateBusinessDeletionConfirmation,
} from "@/lib/business-deletion/confirmation";
import type { AuthUser } from "@/server/services/auth.service";
import type { Database } from "@/types/database";

type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
type MembershipRow = Database["public"]["Tables"]["business_members"]["Row"];

function throwIfError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

function assertRequestableBusiness(business: BusinessRow): void {
  if (business.status !== "active" || business.lifecycle_status !== "active") {
    throw new Error("This workspace is not active for deletion request.");
  }
}

function assertActiveOwnerMembership(input: {
  membership: MembershipRow | null;
  userId: string;
}): void {
  if (
    !input.membership ||
    input.membership.user_id !== input.userId ||
    input.membership.role !== "owner" ||
    input.membership.status !== "active"
  ) {
    throw new Error("Only the active business owner can request workspace deletion.");
  }
}

export async function requestBusinessDeletion(input: {
  acknowledged: boolean;
  businessId: string;
  typedBusinessName: string;
  user: AuthUser | null;
}): Promise<void> {
  if (!input.user) {
    throw new Error("Sign in to request workspace deletion.");
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();

  throwIfError(businessError);

  if (!business) {
    throw new Error("Business workspace not found.");
  }

  validateBusinessDeletionConfirmation({
    acknowledged: input.acknowledged,
    businessName: business.name,
    typedBusinessName: input.typedBusinessName,
  });

  assertRequestableBusiness(business);

  const { data: membership, error: membershipError } = await supabase
    .from("business_members")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("user_id", input.user.id)
    .maybeSingle();

  throwIfError(membershipError);
  assertActiveOwnerMembership({
    membership,
    userId: input.user.id,
  });

  const now = new Date().toISOString();

  const { error: requestError } = await supabase
    .from("business_deletion_requests")
    .insert({
      business_id: input.businessId,
      request_type: "production_deletion",
      requested_by_user_id: input.user.id,
      status: "pending",
    });

  throwIfError(requestError);

  const { error: linkError } = await supabase
    .from("public_link_variants")
    .update({ is_active: false })
    .eq("business_id", input.businessId);

  throwIfError(linkError);

  const { error: businessUpdateError } = await supabase
    .from("businesses")
    .update({
      deletion_requested_at: now,
      lifecycle_status: "deletion_requested",
    })
    .eq("id", input.businessId);

  throwIfError(businessUpdateError);

  const { error: logError } = await supabase.from("admin_action_log").insert({
    action_type: "business_deletion_requested",
    actor_user_id: input.user.id,
    business_id: input.businessId,
    new_values: {
      lifecycle_status: "deletion_requested",
      public_links_disabled: true,
      request_type: "production_deletion",
    },
    previous_values: {
      lifecycle_status: business.lifecycle_status,
    },
  });

  throwIfError(logError);
}
