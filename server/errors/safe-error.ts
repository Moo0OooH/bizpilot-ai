/**
 * ============================================================
 * File: server/errors/safe-error.ts
 * Project: BizPilot AI
 * Description: Maps unknown server errors to safe user-facing messages.
 * Role: Prevents raw provider, database, and policy errors from reaching UI query strings.
 * Related:
 * - server/actions/business-configuration.actions.ts
 * - server/actions/lead-conversion.actions.ts
 * - server/actions/public-intake.actions.ts
 * Author: MoOoH
 * Created: 2026-05-13
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Created lightweight safe error message mapper.
 * ============================================================
 */

import "server-only";

export type SafeErrorCode =
  | "AI_ASSISTANT_ERROR"
  | "CONFIGURATION_ERROR"
  | "LEAD_WORKFLOW_ERROR"
  | "PUBLIC_INTAKE_ERROR"
  | "UNKNOWN_ERROR";

const unsafeMessageHints = [
  "api key",
  "auth.uid",
  "constraint",
  "database",
  "duplicate key",
  "foreign key",
  "jwt",
  "policy",
  "postgres",
  "relation",
  "rls",
  "row-level security",
  "schema",
  "service_role",
  "supabase",
  "token",
] as const;

function getRawErrorMessage(error: unknown): string | null {
  return error instanceof Error && error.message.trim().length > 0
    ? error.message.trim()
    : typeof error === "string" && error.trim().length > 0
      ? error.trim()
      : null;
}

function looksUnsafeForUsers(message: string): boolean {
  const normalized = message.toLowerCase();

  return unsafeMessageHints.some((hint) => normalized.includes(hint));
}

export function getSafeUserErrorMessage(input: {
  allowMessage?: (message: string) => boolean;
  code?: SafeErrorCode;
  error: unknown;
  fallbackMessage: string;
}): string {
  const message = getRawErrorMessage(input.error);

  if (!message || looksUnsafeForUsers(message)) {
    return input.fallbackMessage;
  }

  if (input.allowMessage?.(message)) {
    return message;
  }

  return input.fallbackMessage;
}
