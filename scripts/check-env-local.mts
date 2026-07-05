/**
 * ============================================================
 * File: scripts/check-env-local.mts
 * Project: BizPilot AI
 * Description: Safe parser and shape validator for local environment files.
 * Role: Verifies that .env.local remains UTF-8 readable, structurally parseable, and populated with the expected Supabase/App keys without printing secrets.
 * Related:
 * - scripts/check-local-targets.mts
 * - lib/env/public-env.ts
 * - lib/env/server-env.ts
 * Author: MoOoH
 * Created: 2026-07-05
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Added a no-secret .env.local health check for parse, URL, and key-shape validation.
 * ============================================================
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type CheckResult = Readonly<{
  errors: string[];
  warnings: string[];
}>;

const requiredKeys = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "DATABASE_URL",
] as const;

const supabasePublicKeyEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const supabasePrivateKeyEnvKeys = [
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

function readLocalEnvFile(): { path: string; text: string } {
  const path = resolve(process.cwd(), ".env.local");

  if (!existsSync(path)) {
    throw new Error(".env.local is missing.");
  }

  return {
    path,
    text: readFileSync(path, "utf8"),
  };
}

function parseEnv(text: string): { entries: Map<string, string>; errors: string[] } {
  const entries = new Map<string, string>();
  const errors: string[] = [];
  const lines = text.split(/\r?\n/);

  for (const [index, rawLine] of lines.entries()) {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    if (!line.includes("=")) {
      errors.push(`Line ${lineNumber} is missing "=".`);
      continue;
    }

    const [rawKey = "", ...rawValueParts] = line.split("=");
    const key = rawKey.trim();

    if (!key) {
      errors.push(`Line ${lineNumber} has an empty key.`);
      continue;
    }

    if (!/^[A-Z0-9_]+$/.test(key)) {
      errors.push(`Line ${lineNumber} has an invalid env key shape: ${key}`);
      continue;
    }

    if (!entries.has(key)) {
      const value = rawValueParts.join("=").trim().replace(/^['"]|['"]$/g, "");
      entries.set(key, value);
    }
  }

  return { entries, errors };
}

function validateUrl(name: string, value: string | undefined, errors: string[]): void {
  if (!value) {
    errors.push(`${name} is missing.`);
    return;
  }

  try {
    new URL(value);
  } catch {
    errors.push(`${name} is not a valid URL.`);
  }
}

function classifyKeyShape(
  value: string | undefined,
): "missing" | "sb_publishable" | "sb_secret" | "jwt_like" | "unknown" {
  if (!value) return "missing";
  if (value.startsWith("sb_publishable_")) return "sb_publishable";
  if (value.startsWith("sb_secret_")) return "sb_secret";
  if (value.split(".").length === 3) return "jwt_like";
  return "unknown";
}

function runChecks(): CheckResult {
  const { path, text } = readLocalEnvFile();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (text.charCodeAt(0) === 0xfeff) {
    warnings.push(`${path} starts with a UTF-8 BOM.`);
  }

  const { entries, errors: parseErrors } = parseEnv(text);
  errors.push(...parseErrors);

  for (const key of requiredKeys) {
    validateUrl(key, entries.get(key), errors);
  }

  const publicKey = supabasePublicKeyEnvKeys
    .map((key) => entries.get(key))
    .find((value) => Boolean(value));
  const privateKey = supabasePrivateKeyEnvKeys
    .map((key) => entries.get(key))
    .find((value) => Boolean(value));

  const publicShape = classifyKeyShape(publicKey);
  const privateShape = classifyKeyShape(privateKey);

  if (publicShape === "missing") {
    errors.push(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  } else if (!["sb_publishable", "jwt_like"].includes(publicShape)) {
    errors.push(`Public Supabase key has an unexpected shape: ${publicShape}`);
  }

  if (privateShape === "missing") {
    warnings.push(
      "SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) is missing from .env.local.",
    );
  } else if (!["sb_secret", "jwt_like"].includes(privateShape)) {
    errors.push(`Private Supabase key has an unexpected shape: ${privateShape}`);
  }

  return { errors, warnings };
}

function main(): void {
  const result = runChecks();

  console.log("BizPilot .env.local health check");

  if (result.warnings.length > 0) {
    for (const warning of result.warnings) {
      console.log(`WARN: ${warning}`);
    }
  }

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(`ERROR: ${error}`);
    }
    process.exit(1);
  }

  console.log("PASS: .env.local is parseable and key shapes look valid.");
}

main();
