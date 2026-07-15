/**
 * ============================================================
 * File: scripts/check-local-targets.mts
 * Project: BizPilot AI
 * Description: Safe local-target classifier for dashboard smoke and RLS gates.
 * Role: Reads local env files, prints only host-level classifications, and fails when requested local-only targets are not local.
 * Related:
 * - tests/smoke/dashboard-auth-smoke.mts
 * - tests/rls/run-rls-tests.mts
 * - docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Repointed safe-target authority to the current master phase plan.
 * - 2026-07-04: Created a no-secret target classifier for local Supabase and database gates.
 * ============================================================
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type TargetKind = "database" | "supabase";
type TargetStatus = "invalid" | "local" | "managed" | "missing" | "non_local";

type TargetClassification = Readonly<{
  host: string;
  status: TargetStatus;
}>;

const localHosts = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "host.docker.internal",
]);

const canonicalProductionProjectRef = "qfqendrqimqvkoojpjao";

function readEnvFiles(): Map<string, string> {
  const values = new Map<string, string>();

  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) {
      continue;
    }

    for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.includes("=")) {
        continue;
      }

      const [rawKey = "", ...rawValueParts] = line.split("=");
      const key = rawKey.trim();
      const rawValue = rawValueParts.join("=").trim();
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      if (key && value && !values.has(key)) {
        values.set(key, value);
      }
    }
  }

  return values;
}

function readEnvValue(name: string, fileValues: Map<string, string>): string | undefined {
  const value = process.env[name] ?? fileValues.get(name);
  const trimmed = value?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function isLocalHost(host: string): boolean {
  return localHosts.has(host) || host.endsWith(".localhost");
}

function classifyTarget(
  rawValue: string | undefined,
  kind: TargetKind,
): TargetClassification {
  if (!rawValue) {
    return {
      host: "missing",
      status: "missing",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawValue);
  } catch {
    return {
      host: "invalid-url",
      status: "invalid",
    };
  }

  const host = parsed.hostname.toLowerCase();
  const rawLower = rawValue.toLowerCase();

  if (isLocalHost(host)) {
    return {
      host,
      status: "local",
    };
  }

  if (
    rawLower.includes(canonicalProductionProjectRef) ||
    host.endsWith(".supabase.co") ||
    host.endsWith(".supabase.in")
  ) {
    return {
      host,
      status: "managed",
    };
  }

  return {
    host,
    status: kind === "supabase" ? "managed" : "non_local",
  };
}

function formatStatus(status: TargetStatus): string {
  if (status === "local") return "local";
  if (status === "managed") return "managed/non-local";
  if (status === "non_local") return "non-local";
  return status;
}

function requireLocal(name: string, classification: TargetClassification): boolean {
  if (classification.status === "local") {
    return true;
  }

  console.error(
    `${name} must be local for this gate. Current classification: ${formatStatus(
      classification.status,
    )} (${classification.host}).`,
  );

  return false;
}

function main(): void {
  const fileValues = readEnvFiles();
  const requireDashboardLocal = process.argv.includes("--require-dashboard-local");
  const requireDbLocal = process.argv.includes("--require-db-local");

  const appUrl = readEnvValue("NEXT_PUBLIC_APP_URL", fileValues);
  const databaseUrl = readEnvValue("DATABASE_URL", fileValues);
  const supabaseUrl = readEnvValue("NEXT_PUBLIC_SUPABASE_URL", fileValues);

  const appTarget = classifyTarget(appUrl, "supabase");
  const databaseTarget = classifyTarget(databaseUrl, "database");
  const supabaseTarget = classifyTarget(supabaseUrl, "supabase");
  const vercelProduction = process.env.VERCEL_ENV?.toLowerCase() === "production";

  console.log("BizPilot local target classifier");
  console.log(`NEXT_PUBLIC_APP_URL host: ${formatStatus(appTarget.status)} (${appTarget.host})`);
  console.log(
    `NEXT_PUBLIC_SUPABASE_URL host: ${formatStatus(supabaseTarget.status)} (${supabaseTarget.host})`,
  );
  console.log(`DATABASE_URL host: ${formatStatus(databaseTarget.status)} (${databaseTarget.host})`);
  console.log(`VERCEL_ENV production: ${vercelProduction ? "yes" : "no"}`);

  const failures: boolean[] = [];

  if (vercelProduction && (requireDashboardLocal || requireDbLocal)) {
    console.error("Local-only gates must not run with VERCEL_ENV=production.");
    failures.push(true);
  }

  if (requireDashboardLocal) {
    failures.push(!requireLocal("NEXT_PUBLIC_SUPABASE_URL", supabaseTarget));
  }

  if (requireDbLocal) {
    failures.push(!requireLocal("DATABASE_URL", databaseTarget));
  }

  if (failures.some(Boolean)) {
    process.exit(1);
  }
}

main();
