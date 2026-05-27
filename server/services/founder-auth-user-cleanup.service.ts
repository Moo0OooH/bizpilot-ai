/**
 * ============================================================
 * File: server/services/founder-auth-user-cleanup.service.ts
 * Project: BizPilot AI
 * Description: Founder-only deletion for fake/test auth users.
 * Role: Deletes safe test auth identities after founder authorization and strict guards.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env/server-env";
import {
  getFounderAuthUserDeletionBlock,
  validateFounderAuthUserDeleteConfirmation,
  type FounderAuthUserDeletionBusinessContext,
} from "@/lib/founder-cleanup/auth-user-deletion";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import {
  insertFounderAdminAction,
  updateFounderAdminActionNewValues,
} from "@/server/repositories/founder-admin.repository";
import { assertFounderUser } from "@/server/services/founder-admin.service";
import { purgeFounderTestWorkspaceForAuthDeletion } from "@/server/services/founder-test-cleanup.service";
import type { AuthUser } from "@/server/services/auth.service";
import type { Database } from "@/types/database";

type BusinessRow = Pick<
  Database["public"]["Tables"]["businesses"]["Row"],
  "id" | "owner_user_id" | "workspace_kind"
>;

type MembershipRow = Pick<
  Database["public"]["Tables"]["business_members"]["Row"],
  "business_id" | "role"
>;

export type FounderAuthUserDeleteResult = Readonly<{
  linkedBusinessCount: number;
  targetEmail: string | null;
  targetUserId: string;
}>;

function throwIfError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
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

async function listTargetMemberships(input: {
  supabase: SupabaseClient<Database>;
  targetUserId: string;
}): Promise<MembershipRow[]> {
  const { data, error } = await input.supabase
    .from("business_members")
    .select("business_id,role")
    .eq("user_id", input.targetUserId);

  throwIfError(error);
  return data ?? [];
}

async function listTargetOwnedBusinesses(input: {
  supabase: SupabaseClient<Database>;
  targetUserId: string;
}): Promise<BusinessRow[]> {
  const { data, error } = await input.supabase
    .from("businesses")
    .select("id,owner_user_id,workspace_kind")
    .eq("owner_user_id", input.targetUserId);

  throwIfError(error);
  return data ?? [];
}

async function listBusinessesById(input: {
  businessIds: string[];
  supabase: SupabaseClient<Database>;
}): Promise<BusinessRow[]> {
  if (input.businessIds.length === 0) {
    return [];
  }

  const { data, error } = await input.supabase
    .from("businesses")
    .select("id,owner_user_id,workspace_kind")
    .in("id", input.businessIds);

  throwIfError(error);
  return data ?? [];
}

async function listTargetBusinessContexts(input: {
  supabase: SupabaseClient<Database>;
  targetUserId: string;
}): Promise<FounderAuthUserDeletionBusinessContext[]> {
  const [memberships, ownedBusinesses] = await Promise.all([
    listTargetMemberships(input),
    listTargetOwnedBusinesses(input),
  ]);
  const membershipByBusiness = new Map(
    memberships.map((membership) => [membership.business_id, membership]),
  );
  const memberBusinesses = await listBusinessesById({
    businessIds: Array.from(membershipByBusiness.keys()),
    supabase: input.supabase,
  });
  const businessById = new Map<string, BusinessRow>();

  for (const business of [...ownedBusinesses, ...memberBusinesses]) {
    businessById.set(business.id, business);
  }

  return Array.from(businessById.values()).map((business) => ({
    businessId: business.id,
    membershipRole: membershipByBusiness.get(business.id)?.role ?? null,
    ownerUserId: business.owner_user_id,
    workspaceKind: business.workspace_kind,
  }));
}

async function insertFounderAuthUserDeletionAction(input: {
  actorUserId: string;
  linkedBusinessCount: number;
  supabase: SupabaseClient<Database>;
  targetEmail: string | null;
  targetUserId: string;
}): Promise<string> {
  const previousValues = {
    linked_business_count: input.linkedBusinessCount,
    target_user_id: input.targetUserId,
  };
  const newValues = {
    auth_provider_delete_completed: false,
    auth_user_delete_authorized: true,
    linked_business_count: input.linkedBusinessCount,
    target_email_present: Boolean(input.targetEmail),
    target_user_id: input.targetUserId,
  };

  try {
    return await insertFounderAdminAction({
      actionType: "test_auth_user_deleted",
      actorUserId: input.actorUserId,
      businessId: null,
      newValues,
      note: null,
      previousValues,
      supabase: input.supabase,
    });
  } catch {
    return insertFounderAdminAction({
      actionType: "internal_note_added",
      actorUserId: input.actorUserId,
      businessId: null,
      newValues: {
        ...newValues,
        fallback_action_type: "test_auth_user_deleted",
      },
      note: "Fallback audit for fake/test auth user deletion.",
      previousValues,
      supabase: input.supabase,
    });
  }
}

export async function deleteFounderTestAuthUser(input: {
  acknowledged: boolean;
  cleanupMode: string;
  finalConfirmed: boolean;
  targetUserId: string;
  typedConfirmation: string;
  user: AuthUser | null;
}): Promise<FounderAuthUserDeleteResult> {
  const actor = assertFounderUser(input.user);
  const supabase = createSupabaseServiceRoleClient();
  const [{ data: authUserData, error: authUserError }, linkedBusinesses] =
    await Promise.all([
      supabase.auth.admin.getUserById(input.targetUserId),
      listTargetBusinessContexts({
        supabase,
        targetUserId: input.targetUserId,
      }),
    ]);

  if (authUserError) {
    throw new Error(authUserError.message);
  }

  const targetUser = authUserData.user;
  if (!targetUser) {
    throw new Error("Auth user not found.");
  }

  const targetEmail = targetUser.email ?? null;

  validateFounderAuthUserDeleteConfirmation({
    acknowledged: input.acknowledged,
    cleanupMode: input.cleanupMode,
    finalConfirmed: input.finalConfirmed,
    targetEmail,
    targetUserId: targetUser.id,
    typedConfirmation: input.typedConfirmation,
  });

  const founderEmails = readFounderEmails();
  const blockReason = getFounderAuthUserDeletionBlock({
    actorUserId: actor.id,
    isFounderUser: Boolean(
      targetEmail && founderEmails.has(targetEmail.toLowerCase()),
    ),
    linkedBusinesses,
    targetUserId: targetUser.id,
  });

  if (blockReason) {
    throw new Error(blockReason);
  }

  const actionId = await insertFounderAuthUserDeletionAction({
    actorUserId: actor.id,
    linkedBusinessCount: linkedBusinesses.length,
    supabase,
    targetEmail,
    targetUserId: targetUser.id,
  });

  const ownedBusinessIds = Array.from(
    new Set(
      linkedBusinesses
        .filter((business) => business.ownerUserId === targetUser.id)
        .map((business) => business.businessId),
    ),
  );

  for (const businessId of ownedBusinessIds) {
    await purgeFounderTestWorkspaceForAuthDeletion({
      actorUserId: actor.id,
      businessId,
      supabase,
    });
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUser.id);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  await updateFounderAdminActionNewValues({
    actionId,
    newValues: {
      auth_provider_delete_completed: true,
      auth_user_deleted: true,
      linked_business_count: linkedBusinesses.length,
      target_email_present: Boolean(targetEmail),
      target_user_id: targetUser.id,
    },
    supabase,
  });

  return {
    linkedBusinessCount: linkedBusinesses.length,
    targetEmail,
    targetUserId: targetUser.id,
  };
}
