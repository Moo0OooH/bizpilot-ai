/**
 * ============================================================
 * File: server/services/auth-identity-recovery.service.ts
 * Project: BizPilot AI
 * Description: Safely reconciles a detached Google identity with an existing
 * owner account that uses the same verified email.
 * Role: Removes only a workspace-free duplicate Google auth user, preserves
 * the canonical email/password owner UUID, and requests a password reset.
 * Related:
 * - server/actions/workspace-recovery.actions.ts
 * - app/(dashboard)/layout.tsx
 * - server/services/auth.service.ts
 * Author: MoOoH
 * Created: 2026-08-13
 * ============================================================
 */

import "server-only";

import { randomUUID } from "node:crypto";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { safeLogger } from "@/server/logging/safe-logger";
import type { AuthUser } from "@/server/services/auth.service";

const AUTH_USERS_PAGE_SIZE = 1000;
const MAX_AUTH_USER_PAGES = 10;

function normalizeEmail(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function readProviders(user: User): Set<string> {
  const metadataProviders = Array.isArray(user.app_metadata.providers)
    ? user.app_metadata.providers.filter(
        (provider): provider is string => typeof provider === "string",
      )
    : [];
  const identityProviders = (user.identities ?? []).map(
    (identity) => identity.provider,
  );
  const primaryProvider =
    typeof user.app_metadata.provider === "string"
      ? [user.app_metadata.provider]
      : [];

  return new Set(
    [...metadataProviders, ...identityProviders, ...primaryProvider].map(
      (provider) => provider.toLowerCase(),
    ),
  );
}

async function listAuthUsersWithEmail(email: string): Promise<User[]> {
  const supabase = createSupabaseServiceRoleClient();
  const matches: User[] = [];

  for (let page = 1; page <= MAX_AUTH_USER_PAGES; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: AUTH_USERS_PAGE_SIZE,
    });

    if (error) {
      throw new Error(error.message);
    }

    matches.push(
      ...data.users.filter(
        (candidate) => normalizeEmail(candidate.email) === email,
      ),
    );

    if (data.users.length < AUTH_USERS_PAGE_SIZE) {
      return matches;
    }
  }

  throw new Error("Auth directory is too large for automatic identity recovery.");
}

async function assertDetachedGoogleUser(input: {
  currentUser: AuthUser;
}): Promise<{ canonicalUser: User; email: string }> {
  const email = normalizeEmail(input.currentUser.email);

  if (!email || input.currentUser.authProvider !== "google") {
    throw new Error("This recovery is only available for a detached Google login.");
  }

  const supabase = createSupabaseServiceRoleClient();
  const matchingUsers = await listAuthUsersWithEmail(email);
  const detachedUser = matchingUsers.find(
    (candidate) => candidate.id === input.currentUser.id,
  );
  const canonicalCandidates = matchingUsers.filter(
    (candidate) => candidate.id !== input.currentUser.id,
  );

  if (!detachedUser || canonicalCandidates.length !== 1) {
    throw new Error("Founder review is required for this account identity state.");
  }

  const detachedProviders = readProviders(detachedUser);
  const canonicalUser = canonicalCandidates[0];
  const canonicalProviders = canonicalUser
    ? readProviders(canonicalUser)
    : new Set<string>();

  if (
    !canonicalUser ||
    !detachedProviders.has("google") ||
    detachedProviders.has("email") ||
    !canonicalProviders.has("email")
  ) {
    throw new Error("Founder review is required for this account identity state.");
  }

  const [detachedMemberships, detachedBusinesses, canonicalBusinesses] =
    await Promise.all([
      supabase
        .from("business_members")
        .select("id")
        .eq("user_id", detachedUser.id)
        .limit(1),
      supabase
        .from("businesses")
        .select("id")
        .eq("owner_user_id", detachedUser.id)
        .limit(1),
      supabase
        .from("businesses")
        .select("id")
        .eq("owner_user_id", canonicalUser.id)
        .in("status", ["active", "onboarding"])
        .eq("lifecycle_status", "active")
        .limit(2),
    ]);

  for (const result of [
    detachedMemberships,
    detachedBusinesses,
    canonicalBusinesses,
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  if (
    (detachedMemberships.data?.length ?? 0) > 0 ||
    (detachedBusinesses.data?.length ?? 0) > 0 ||
    canonicalBusinesses.data?.length !== 1
  ) {
    throw new Error("Founder review is required for this account identity state.");
  }

  const canonicalBusinessId = canonicalBusinesses.data[0]?.id;
  if (!canonicalBusinessId) {
    throw new Error("Founder review is required for this account identity state.");
  }

  const canonicalMembership = await supabase
    .from("business_members")
    .select("id")
    .eq("business_id", canonicalBusinessId)
    .eq("user_id", canonicalUser.id)
    .eq("role", "owner")
    .eq("status", "active")
    .limit(1);

  if (canonicalMembership.error) {
    throw new Error(canonicalMembership.error.message);
  }

  if (canonicalMembership.data?.length !== 1) {
    throw new Error("Founder review is required for this account identity state.");
  }

  return { canonicalUser, email };
}

export async function repairDetachedGoogleIdentity(input: {
  currentUser: AuthUser;
  resetRedirectTo: string;
}): Promise<{ resetEmailSent: boolean; traceId: string }> {
  const traceId = randomUUID();
  const { canonicalUser, email } = await assertDetachedGoogleUser(input);
  const supabase = createSupabaseServiceRoleClient();

  safeLogger.info("auth.identity_repair.validated", {
    canonicalUserId: canonicalUser.id,
    detachedUserId: input.currentUser.id,
    traceId,
  });

  const { error: deleteError } = await supabase.auth.admin.deleteUser(
    input.currentUser.id,
  );

  if (deleteError) {
    safeLogger.error("auth.identity_repair.delete_failed", {
      detachedUserId: input.currentUser.id,
      errorName: deleteError.name,
      traceId,
    });
    throw new Error("We couldn't remove the detached Google login.");
  }

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: input.resetRedirectTo,
  });

  safeLogger.info("auth.identity_repair.completed", {
    canonicalUserId: canonicalUser.id,
    detachedUserId: input.currentUser.id,
    resetEmailSent: !resetError,
    traceId,
  });

  return {
    resetEmailSent: !resetError,
    traceId: traceId.slice(0, 8),
  };
}
