/**
 * ============================================================
 * File: lib/supabase/rest.ts
 * Project: BizPilot AI
 * Description: Provides minimal Supabase REST helpers for Phase 2 server workflows.
 * Role: Centralizes PostgREST and Auth API calls until a Supabase SDK dependency is added.
 * Related:
 * - lib/supabase/server.ts
 * - server/repositories/profiles.repository.ts
 * - server/services/auth.service.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 Supabase REST helper.
 * - 2026-05-04: Aligned fetch options with exact optional property types.
 * - 2026-05-04: Added service-role request support for server-only tenant setup.
 * ============================================================
 */

import { getSupabaseServerClientConfig } from "@/lib/supabase/server";

type SupabaseRestRequest = Readonly<{
  accessToken?: string;
  body?: unknown;
  method?: "GET" | "POST" | "PATCH";
  prefer?: string;
  query?: string;
  serviceRole?: boolean;
}>;

export type SupabaseRestError = Readonly<{
  message: string;
  status: number;
}>;

export class SupabaseRequestError extends Error {
  readonly status: number;

  constructor(error: SupabaseRestError) {
    super(error.message);
    this.name = "SupabaseRequestError";
    this.status = error.status;
  }
}

function buildHeaders(request: SupabaseRestRequest): HeadersInit {
  const config = getSupabaseServerClientConfig();
  const token = request.serviceRole
    ? config.serviceRoleKey
    : request.accessToken ?? config.anonKey;

  if (!token) {
    throw new Error("Supabase service role key is required for this request.");
  }

  const headers: HeadersInit = {
    apikey: config.anonKey,
    Authorization: `Bearer ${token}`,
  };

  if (request.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (request.prefer) {
    headers.Prefer = request.prefer;
  }

  return headers;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();

    if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
    ) {
      return payload.message;
    }
  } catch {
    // Fall through to the generic HTTP message.
  }

  return `Supabase request failed with status ${response.status}`;
}

export async function requestSupabaseAuth<TResponse>(
  path: string,
  request: SupabaseRestRequest = {},
): Promise<TResponse> {
  const config = getSupabaseServerClientConfig();
  const init: RequestInit = {
    method: request.method ?? "GET",
    headers: buildHeaders(request),
    cache: "no-store",
  };

  if (request.body !== undefined) {
    init.body = JSON.stringify(request.body);
  }

  const response = await fetch(`${config.url}/auth/v1/${path}`, init);

  if (!response.ok) {
    throw new SupabaseRequestError({
      message: await readErrorMessage(response),
      status: response.status,
    });
  }

  return (await response.json()) as TResponse;
}

export async function requestSupabaseTable<TResponse>(
  table: string,
  request: SupabaseRestRequest = {},
): Promise<TResponse> {
  const config = getSupabaseServerClientConfig();
  const query = request.query ? `?${request.query}` : "";
  const init: RequestInit = {
    method: request.method ?? "GET",
    headers: buildHeaders(request),
    cache: "no-store",
  };

  if (request.body !== undefined) {
    init.body = JSON.stringify(request.body);
  }

  const response = await fetch(`${config.url}/rest/v1/${table}${query}`, init);

  if (!response.ok) {
    throw new SupabaseRequestError({
      message: await readErrorMessage(response),
      status: response.status,
    });
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
