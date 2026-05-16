/**
 * ============================================================
 * File: tests/rls/run-rls-tests.mts
 * Project: BizPilot AI
 * Description: Phase 10D RLS test runner. Executes every tests/rls/*.test.sql against a local Postgres.
 * Role: Provides a single `pnpm test:rls` entry point that runs the existing transactional RLS smoke tests.
 * Related:
 * - tests/rls/auth-tenant-foundation.test.sql
 * - tests/rls/business-template-configuration.test.sql
 * - tests/rls/public-intake-and-leads.test.sql
 * - tests/rls/lead-conversion-desk.test.sql
 * - docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md
 * - docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-15
 * Last Updated: 2026-05-15
 * Change Log:
 * - 2026-05-15: Created Phase 10D runner. Local-only by design; refuses non-local DATABASE_URL.
 * ============================================================
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));

const ALLOWED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "host.docker.internal",
]);

type TestResult = Readonly<{
  durationMs: number;
  error?: string;
  file: string;
  pass: boolean;
}>;

function assertLocalDatabaseUrl(rawUrl: string | undefined): string {
  if (!rawUrl || rawUrl.trim().length === 0) {
    throw new Error(
      "DATABASE_URL is not set. Set it to a local Postgres or local Supabase URL before running RLS tests.",
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("DATABASE_URL is not a valid URL.");
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Error(
      `Refusing to run RLS tests against non-local host "${parsed.hostname}". Allowed hosts: ${[...ALLOWED_HOSTS].join(", ")}.`,
    );
  }

  if (parsed.hostname.endsWith(".supabase.co") || parsed.hostname.endsWith(".supabase.in")) {
    throw new Error("Refusing to run RLS tests against a managed Supabase project URL.");
  }

  return rawUrl;
}

function discoverTestFiles(): string[] {
  const entries = readdirSync(here, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".test.sql"))
    .map((entry) => entry.name)
    .sort();
}

async function runTestFile(client: pg.Client, fileName: string): Promise<TestResult> {
  const filePath = join(here, fileName);
  const sql = readFileSync(filePath, "utf8");
  const startedAt = Date.now();

  try {
    await client.query(sql);
    return {
      durationMs: Date.now() - startedAt,
      file: fileName,
      pass: true,
    };
  } catch (error) {
    const message =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return {
      durationMs: Date.now() - startedAt,
      error: message,
      file: fileName,
      pass: false,
    };
  }
}

async function main(): Promise<void> {
  const databaseUrl = assertLocalDatabaseUrl(process.env.DATABASE_URL);
  const testFiles = discoverTestFiles();

  if (testFiles.length === 0) {
    console.error("No .test.sql files found in tests/rls/.");
    process.exit(1);
    return;
  }

  console.log(`BizPilot RLS test runner — found ${testFiles.length} test files`);
  console.log(`Target: ${databaseUrl.replace(/:[^:@/]+@/, ":***@")}`);
  console.log("");

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  const results: TestResult[] = [];

  try {
    for (const fileName of testFiles) {
      process.stdout.write(`  ${fileName} ... `);
      const result = await runTestFile(client, fileName);
      results.push(result);
      if (result.pass) {
        console.log(`pass (${result.durationMs}ms)`);
      } else {
        console.log(`FAIL (${result.durationMs}ms)`);
        console.log(`    ${result.error}`);
      }
    }
  } finally {
    await client.end();
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;

  console.log("");
  console.log(`Results: ${passed} passed, ${failed} failed (${results.length} total)`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`RLS runner error: ${message}`);
  process.exit(1);
});
