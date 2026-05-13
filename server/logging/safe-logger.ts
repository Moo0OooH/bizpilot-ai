/**
 * ============================================================
 * File: server/logging/safe-logger.ts
 * Project: BizPilot AI
 * Description: Minimal server-only logger for safe operational events.
 * Role: Keeps future server logs structured while avoiding sensitive data.
 * Author: MoOoH
 * Created: 2026-05-13
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Added lightweight safe logging helper for MVP baseline.
 * ============================================================
 */

import "server-only";

export type SafeLogLevel = "info" | "warn" | "error";

export type SafeLogMetadata = Record<string, unknown>;

const REDACTED = "[redacted]";
const UNSUPPORTED = "[unsupported]";
const MAX_METADATA_KEYS = 20;
const MAX_STRING_LENGTH = 160;

const sensitiveKeyHints = [
  "apikey",
  "api_key",
  "authorization",
  "body",
  "cookie",
  "customer_message",
  "description",
  "email",
  "message",
  "output",
  "password",
  "payload",
  "phone",
  "prompt",
  "secret",
  "service_role",
  "token",
] as const;

function normalizeKey(key: string): string {
  return key.toLowerCase().replaceAll(/[^a-z0-9_]/g, "");
}

function shouldRedactKey(key: string): boolean {
  const normalized = normalizeKey(key);

  return sensitiveKeyHints.some((hint) => normalized.includes(hint));
}

function sanitizeString(value: string): string {
  return value.length > MAX_STRING_LENGTH
    ? `${value.slice(0, MAX_STRING_LENGTH)}...`
    : value;
}

function sanitizeMetadataValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return sanitizeString(value.replaceAll(/[\r\n\t]/g, " "));
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return UNSUPPORTED;
}

export function sanitizeLogMetadata(
  metadata: SafeLogMetadata = {},
): Record<string, string | number | boolean | null> {
  return Object.entries(metadata)
    .slice(0, MAX_METADATA_KEYS)
    .reduce<Record<string, string | number | boolean | null>>(
      (safeMetadata, [key, value]) => {
        safeMetadata[key] = shouldRedactKey(key)
          ? REDACTED
          : sanitizeMetadataValue(value);

        return safeMetadata;
      },
      {},
    );
}

function writeSafeLog(
  level: SafeLogLevel,
  operation: string,
  metadata?: SafeLogMetadata,
): void {
  const entry = {
    level,
    metadata: sanitizeLogMetadata(metadata),
    operation: sanitizeString(operation.replaceAll(/[\r\n\t]/g, " ")),
    timestamp: new Date().toISOString(),
  };

  console[level](`[bizpilot] ${JSON.stringify(entry)}`);
}

export const safeLogger = {
  error(operation: string, metadata?: SafeLogMetadata): void {
    writeSafeLog("error", operation, metadata);
  },
  info(operation: string, metadata?: SafeLogMetadata): void {
    writeSafeLog("info", operation, metadata);
  },
  warn(operation: string, metadata?: SafeLogMetadata): void {
    writeSafeLog("warn", operation, metadata);
  },
};
