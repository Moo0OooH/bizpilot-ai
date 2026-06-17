/**
 * File: server/services/production-health.service.ts
 * Project: BizPilot AI
 * Description: Founder-only safe runtime diagnostics for production wiring.
 * Role: Verifies Supabase target and privileged read health without exposing secrets.
 */

import "server-only";

import {
  createSupabaseAdminRestHeaders,
  createSupabaseServiceRoleClient,
  getSupabaseServerClientConfig,
} from "@/lib/supabase/server";
import { safeLogger } from "@/server/logging/safe-logger";
import type { AuthUser } from "@/server/services/auth.service";
import { assertFounderUser } from "@/server/services/founder-admin.service";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

const canonicalProductionSupabaseRef = "qfqendrqimqvkoojpjao";

type HealthCheck = Readonly<{
  count: number | null;
  ok: boolean;
  status: number | null;
}>;

type ServiceCredentialKind =
  | "jwt_anon"
  | "jwt_other"
  | "jwt_service_role"
  | "missing"
  | "supabase_publishable"
  | "supabase_secret"
  | "unknown";

export type FounderProductionHealth = Readonly<{
  authAdmin: HealthCheck;
  authRest: HealthCheck;
  businessMembers: HealthCheck;
  businesses: HealthCheck;
  deletionRequests: HealthCheck;
  publicLinks: HealthCheck;
  profiles: HealthCheck;
  recentActions: HealthCheck;
  serviceCredentialIssuerRef: string | null;
  serviceCredentialKind: ServiceCredentialKind;
  serviceCredentialMatchesSupabaseRef: boolean | null;
  supabaseHostRef: string | null;
  supabaseTargetMatchesCanonical: boolean;
}>;

function readSupabaseHostRef(url: string): string | null {
  try {
    return new URL(url).host.split(".")[0] ?? null;
  } catch {
    return null;
  }
}

function decodeJwtPayload(value: string): Record<string, unknown> | null {
  const parts = value.split(".");

  if (parts.length !== 3 || !parts[1]) {
    return null;
  }

  try {
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    const parsed = JSON.parse(payload) as unknown;

    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function readServiceCredentialDiagnostics(input: {
  serviceRoleKey: string | undefined;
  supabaseHostRef: string | null;
}): {
  issuerRef: string | null;
  kind: ServiceCredentialKind;
  matchesSupabaseRef: boolean | null;
} {
  const key = input.serviceRoleKey?.trim();

  if (!key) {
    return {
      issuerRef: null,
      kind: "missing",
      matchesSupabaseRef: null,
    };
  }

  if (key.startsWith("sb_secret_")) {
    return {
      issuerRef: null,
      kind: "supabase_secret",
      matchesSupabaseRef: null,
    };
  }

  if (key.startsWith("sb_publishable_")) {
    return {
      issuerRef: null,
      kind: "supabase_publishable",
      matchesSupabaseRef: false,
    };
  }

  const payload = decodeJwtPayload(key);
  const role = typeof payload?.role === "string" ? payload.role : null;
  const issuerRef =
    typeof payload?.iss === "string" ? readSupabaseHostRef(payload.iss) : null;

  if (payload) {
    const matchesSupabaseRef =
      input.supabaseHostRef && issuerRef
        ? input.supabaseHostRef === issuerRef
        : null;

    return {
      issuerRef,
      kind:
        role === "service_role"
          ? "jwt_service_role"
          : role === "anon"
            ? "jwt_anon"
            : "jwt_other",
      matchesSupabaseRef,
    };
  }

  return {
    issuerRef: null,
    kind: "unknown",
    matchesSupabaseRef: null,
  };
}

async function countTable(
  supabase: SupabaseClient<Database>,
  table: keyof Database["public"]["Tables"],
): Promise<HealthCheck> {
  const { count, error, status } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  return {
    count: count ?? null,
    ok: !error,
    status: status ?? null,
  };
}

async function checkAuthAdminRest(input: {
  serviceRoleKey: string | undefined;
  supabaseUrl: string;
}): Promise<HealthCheck> {
  if (!input.serviceRoleKey) {
    return {
      count: null,
      ok: false,
      status: null,
    };
  }

  const url = new URL("/auth/v1/admin/users", input.supabaseUrl);
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", "1");

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: createSupabaseAdminRestHeaders(input.serviceRoleKey),
    });

    if (!response.ok) {
      return {
        count: null,
        ok: false,
        status: response.status,
      };
    }

    const totalHeader = response.headers.get("x-total-count");
    const total = totalHeader ? Number.parseInt(totalHeader, 10) : null;

    return {
      count: Number.isFinite(total) ? total : null,
      ok: true,
      status: response.status,
    };
  } catch {
    return {
      count: null,
      ok: false,
      status: null,
    };
  }
}

export async function getFounderProductionHealth(input: {
  user: AuthUser | null;
}): Promise<FounderProductionHealth> {
  assertFounderUser(input.user);

  const config = getSupabaseServerClientConfig();
  const supabaseHostRef = readSupabaseHostRef(config.url);
  const credentialDiagnostics = readServiceCredentialDiagnostics({
    serviceRoleKey: config.serviceRoleKey,
    supabaseHostRef,
  });
  const supabase = createSupabaseServiceRoleClient();
  const [
    authUsersResult,
    authRest,
    businesses,
    businessMembers,
    profiles,
    publicLinks,
    recentActions,
    deletionRequests,
  ] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1 }),
    checkAuthAdminRest({
      serviceRoleKey: config.serviceRoleKey,
      supabaseUrl: config.url,
    }),
    countTable(supabase, "businesses"),
    countTable(supabase, "business_members"),
    countTable(supabase, "profiles"),
    countTable(supabase, "public_link_variants"),
    countTable(supabase, "admin_action_log"),
    countTable(supabase, "business_deletion_requests"),
  ]);
  const authData = authUsersResult.data as { total?: number } | null;

  safeLogger.info("production_health.checked", {
    auth_admin_ok: !authUsersResult.error,
    auth_admin_status: authUsersResult.error?.status ?? null,
    auth_rest_ok: authRest.ok,
    auth_rest_status: authRest.status,
    business_count: businesses.count,
    businesses_ok: businesses.ok,
    credential_kind: credentialDiagnostics.kind,
    credential_matches_supabase_ref:
      credentialDiagnostics.matchesSupabaseRef ?? "unknown",
    supabase_ref: supabaseHostRef ?? "unknown",
    target_matches_canonical:
      supabaseHostRef === canonicalProductionSupabaseRef,
  });

  return {
    authAdmin: {
      count: authData?.total ?? null,
      ok: !authUsersResult.error,
      status: authUsersResult.error?.status ?? null,
    },
    authRest,
    businessMembers,
    businesses,
    deletionRequests,
    profiles,
    publicLinks,
    recentActions,
    serviceCredentialIssuerRef: credentialDiagnostics.issuerRef,
    serviceCredentialKind: credentialDiagnostics.kind,
    serviceCredentialMatchesSupabaseRef:
      credentialDiagnostics.matchesSupabaseRef,
    supabaseHostRef,
    supabaseTargetMatchesCanonical:
      supabaseHostRef === canonicalProductionSupabaseRef,
  };
}
