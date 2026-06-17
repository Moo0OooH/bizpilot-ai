/**
 * ============================================================
 * File: tests/smoke/dashboard-auth-smoke.mts
 * Project: BizPilot AI
 * Description: Authenticated synthetic dashboard smoke runner.
 * Role: Creates a synthetic owner workspace and checks dashboard routes through SSR auth cookies without printing secrets.
 * Related:
 * - docs/readiness/PHASE_21U_DASHBOARD_RUNTIME_FIX_AND_SMOKE.md
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-05-25
 * ============================================================
 */

import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../../types/database.ts";

type PgError = Readonly<{
  code?: string;
  details?: string | null;
  hint?: string | null;
  message: string;
}>;

type PostgrestSingleResult = Readonly<{
  data: unknown;
  error: PgError | null;
}>;

type PostgrestManyResult = Readonly<{
  error: PgError | null;
}>;

type UnsafeInsertBuilder = Readonly<{
  insert: (
    payload: Record<string, unknown> | ReadonlyArray<Record<string, unknown>>,
  ) => {
    select: (columns: string) => {
      single: () => Promise<PostgrestSingleResult>;
    };
  } & Promise<PostgrestManyResult>;
}>;

type UnsafeClient = Readonly<{
  from: (table: string) => UnsafeInsertBuilder;
}>;

type DashboardSmokeResult = Readonly<{
  durationMs: number;
  error?: string;
  pass: boolean;
  path: string;
  status?: number;
}>;

type DashboardSmokeTarget = Readonly<{
  path: string;
  redirectLocation?: string;
  status?: number;
}>;

type SyntheticWorkspace = Readonly<{
  businessId: string;
  leadId: string;
  slug: string;
  userId: string;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const DEFAULT_TIMEOUT_MS = 20_000;

const dashboardTargets: readonly DashboardSmokeTarget[] = [
  { path: "/dashboard" },
  { path: "/dashboard/leads" },
  { path: "/dashboard/configuration" },
  { path: "/dashboard/business-profile" },
  {
    path: "/dashboard/quote-setup",
    redirectLocation: "/dashboard/configuration",
    status: 307,
  },
  { path: "/dashboard/settings" },
];

const rawErrorMarkers = [
  "This page couldn",
  "A server error occurred",
  "Application error",
  "Functions cannot be passed directly to Client Components",
  "Unhandled Runtime Error",
  "PostgrestError",
  "schema cache",
  "service_role",
  "SUPABASE_SERVICE_ROLE",
  "OPENAI_API_KEY",
  "NEXT_PUBLIC_SUPABASE",
] as const;

function readCliValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) {
    return inline.slice(prefix.length);
  }

  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) {
    return process.argv[index + 1];
  }

  return undefined;
}

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

function readRequiredEnv(name: string, fileValues: Map<string, string>): string {
  const value = process.env[name] ?? fileValues.get(name);
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required for authenticated dashboard smoke.`);
  }

  return value.trim();
}

function readFirstRequiredEnv(
  names: readonly string[],
  fileValues: Map<string, string>,
): string {
  for (const name of names) {
    const value = process.env[name] ?? fileValues.get(name);
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  throw new Error(
    `${names.join(" or ")} is required for authenticated dashboard smoke.`,
  );
}

function resolveBaseUrl(): URL {
  const raw =
    readCliValue("base-url") ?? process.env.BIZPILOT_SMOKE_BASE_URL ?? DEFAULT_BASE_URL;

  try {
    const parsed = new URL(raw);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("base URL must use http or https");
    }
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid smoke base URL "${raw}": ${message}`);
  }
}

function resolveTimeoutMs(): number {
  const raw = readCliValue("timeout-ms") ?? process.env.BIZPILOT_SMOKE_TIMEOUT_MS;
  if (!raw) {
    return DEFAULT_TIMEOUT_MS;
  }

  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1_000) {
    throw new Error("Smoke timeout must be an integer >= 1000ms.");
  }

  return value;
}

function readOptionalEnv(
  name: string,
  fileValues: Map<string, string>,
): string | undefined {
  const value = process.env[name] ?? fileValues.get(name);
  const trimmed = value?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function assertDashboardSmokeSafeInput(input: {
  appUrl: string | undefined;
  baseUrl: URL;
  isVercelEnvProduction: boolean;
  supabaseUrl: string;
}): void {
  const productionSignals: string[] = [];
  const appUrlHost = input.appUrl?.toLowerCase() ?? "";
  const supabaseHost = input.supabaseUrl.toLowerCase();
  const baseHost = input.baseUrl.host.toLowerCase();

  if (input.isVercelEnvProduction) {
    productionSignals.push("VERCEL_ENV=production");
  }

  if (appUrlHost.includes("bizpilo.com")) {
    productionSignals.push("NEXT_PUBLIC_APP_URL includes bizpilo.com");
  }

  if (supabaseHost.includes("qfqendrqimqvkoojpjao")) {
    productionSignals.push(
      "NEXT_PUBLIC_SUPABASE_URL contains qfqendrqimqvkoojpjao",
    );
  }

  if (baseHost.includes("bizpilo.com")) {
    productionSignals.push("target smoke base URL is bizpilo.com");
  }

  if (productionSignals.length > 0) {
    throw new Error(
      `dashboard-auth-smoke is production-prohibited for synthetic data creation. ` +
        `Detected production signals: ${productionSignals.join(", ")}. ` +
        `This script is local/preview-only. Use founder-approved visual, read-only production validation.`,
    );
  }
}

function shortPgError(error: PgError): string {
  return [error.message, error.details, error.hint].filter(Boolean).join(" ");
}

function missingOptionalColumn(
  error: PgError,
  columns: readonly string[],
): string | undefined {
  const message = shortPgError(error).toLowerCase();

  return columns.find((column) => {
    const lower = column.toLowerCase();
    return (
      message.includes(`'${lower}'`) ||
      message.includes(`"${lower}"`) ||
      message.includes(` ${lower} `)
    );
  });
}

async function insertOne(
  service: UnsafeClient,
  table: string,
  payload: Record<string, unknown>,
  optionalColumns: readonly string[] = [],
): Promise<Record<string, unknown>> {
  const nextPayload = { ...payload };
  const remainingOptionalColumns = [...optionalColumns];

  for (;;) {
    const { data, error } = await service
      .from(table)
      .insert(nextPayload)
      .select("*")
      .single();

    if (!error) {
      return data as Record<string, unknown>;
    }

    const missing = missingOptionalColumn(error, remainingOptionalColumns);
    if (!missing) {
      throw new Error(`${table} insert failed: ${shortPgError(error)}`);
    }

    delete nextPayload[missing];
    remainingOptionalColumns.splice(remainingOptionalColumns.indexOf(missing), 1);
  }
}

async function insertMany(
  service: UnsafeClient,
  table: string,
  rows: ReadonlyArray<Record<string, unknown>>,
): Promise<void> {
  if (rows.length === 0) {
    return;
  }

  const { error } = await service.from(table).insert([...rows]);
  if (error) {
    throw new Error(`${table} insert failed: ${shortPgError(error)}`);
  }
}

async function createSyntheticWorkspace(input: {
  adminApiKey: string;
  publicApiKey: string;
  supabaseUrl: string;
}): Promise<{ cookieHeader: string; workspace: SyntheticWorkspace }> {
  const service = createClient<Database>(input.supabaseUrl, input.adminApiKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const unsafeService = service as unknown as UnsafeClient;
  const stamp = Date.now();
  const slug = `codex-dashboard-${stamp}-${randomUUID().slice(0, 8)}`;
  const password = `${randomUUID()}Aa1!`;
  const email = `codex-dashboard-${stamp}-${randomUUID().slice(0, 8)}@example.test`;

  const createdUser = await service.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
    user_metadata: {
      display_name: "Codex Dashboard Smoke Owner",
    },
  });
  if (createdUser.error || !createdUser.data.user) {
    throw new Error(
      `Synthetic auth user create failed: ${
        createdUser.error?.message ?? "missing user"
      }`,
    );
  }

  const userId = createdUser.data.user.id;
  const template = await service
    .from("industry_templates")
    .select("id")
    .eq("slug", "cleaning-smart-quote-v1")
    .single();
  if (template.error || !template.data) {
    throw new Error(
      `Cleaning template lookup failed: ${
        template.error?.message ?? "missing template"
      }`,
    );
  }

  const business = await insertOne(
    unsafeService,
    "businesses",
    {
      internal_note: "Synthetic dashboard-auth-smoke workspace. No real customer data.",
      lifecycle_status: "active",
      name: `Codex Dashboard Smoke Cleaning ${stamp}`,
      owner_user_id: userId,
      plan_slug: "founder_pilot",
      preferred_language: "en",
      session_timeout_minutes: null,
      session_timeout_mode: "always_on",
      slug,
      status: "active",
      workspace_kind: "founder_test",
    },
    [
      "internal_note",
      "lifecycle_status",
      "plan_slug",
      "preferred_language",
      "session_timeout_minutes",
      "session_timeout_mode",
      "status",
      "workspace_kind",
    ],
  );
  const businessId = String(business.id);

  await insertOne(
    unsafeService,
    "business_members",
    {
      business_id: businessId,
      role: "owner",
      status: "active",
      user_id: userId,
    },
    ["status"],
  );

  await insertOne(unsafeService, "business_branding", {
    accent_color: "#0f766e",
    business_id: businessId,
    logo_url: null,
    primary_color: "#18181b",
  });
  await insertOne(unsafeService, "business_privacy_settings", {
    business_id: businessId,
    privacy_mode: "standard",
    retain_leads_days: 365,
  });
  await insertOne(unsafeService, "business_consent_settings", {
    ai_disclosure_enabled: true,
    business_id: businessId,
    consent_notice:
      "I agree to be contacted about this synthetic cleaning quote request.",
    privacy_contact_email: "privacy@example.test",
  });
  await insertOne(unsafeService, "business_template_settings", {
    business_id: businessId,
    field_overrides: {},
    is_active: true,
    template_id: template.data.id,
  });
  await insertMany(unsafeService, "business_services", [
    {
      business_id: businessId,
      description: "Synthetic weekly and one-time home cleaning.",
      is_active: true,
      name: "Residential cleaning",
      sort_order: 10,
    },
  ]);
  await insertMany(unsafeService, "business_service_areas", [
    {
      business_id: businessId,
      is_active: true,
      name: "Toronto",
      sort_order: 10,
    },
  ]);
  await insertMany(unsafeService, "business_faqs", [
    {
      answer: "Synthetic smoke requests are reviewed manually by the owner.",
      business_id: businessId,
      is_active: true,
      question: "How fast do you reply?",
      sort_order: 10,
    },
  ]);

  const intakeForm = await insertOne(unsafeService, "intake_forms", {
    business_id: businessId,
    is_active: true,
    name: "Synthetic cleaning quote form",
    privacy_mode: "standard",
    template_id: template.data.id,
  });
  const intakeFormId = String(intakeForm.id);

  const consentVersion = await insertOne(unsafeService, "consent_versions", {
    ai_disclosure_enabled: true,
    business_id: businessId,
    consent_notice:
      "I agree to be contacted about this synthetic cleaning quote request.",
    is_active: true,
    privacy_contact_email: "privacy@example.test",
    version_label: `dashboard-smoke-${stamp}`,
  });
  const consentVersionId = String(consentVersion.id);

  await insertOne(
    unsafeService,
    "public_link_variants",
    {
      business_id: businessId,
      display_name: "Synthetic Dashboard Smoke Link",
      is_active: true,
      preferred_language: "en",
      slug,
    },
    ["preferred_language"],
  );

  const submission = await insertOne(unsafeService, "intake_submissions", {
    business_id: businessId,
    consent_accepted_at: new Date().toISOString(),
    consent_version_id: consentVersionId,
    intake_form_id: intakeFormId,
    privacy_mode: "standard",
    status: "submitted",
  });
  const submissionId = String(submission.id);

  await insertMany(unsafeService, "intake_submission_values", [
    {
      business_id: businessId,
      field_key: "cleaning_type",
      field_label: "Cleaning type",
      field_value: "deep",
      submission_id: submissionId,
    },
    {
      business_id: businessId,
      field_key: "city_or_service_area",
      field_label: "City or service area",
      field_value: "Toronto",
      submission_id: submissionId,
    },
    {
      business_id: businessId,
      field_key: "customer_contact",
      field_label: "Customer contact",
      field_value: "synthetic@example.test",
      submission_id: submissionId,
    },
    {
      business_id: businessId,
      field_key: "customer_name",
      field_label: "Customer name",
      field_value: "Synthetic Quote Lead",
      submission_id: submissionId,
    },
  ]);

  const lead = await insertOne(
    unsafeService,
    "leads",
    {
      business_id: businessId,
      city_or_service_area: "Toronto",
      customer_contact: "synthetic@example.test",
      customer_name: "Synthetic Quote Lead",
      intake_submission_id: submissionId,
      response_sla_state: "new",
      response_status: "new",
      service_type: "Deep cleaning",
      source_channel: "instagram",
      status: "new",
    },
    ["response_sla_state", "response_status"],
  );
  const leadId = String(lead.id);

  await insertOne(unsafeService, "lead_source_metadata", {
    business_id: businessId,
    lead_id: leadId,
    referrer: "https://instagram.com/",
    source_channel: "instagram",
    source_url: `https://bizpilo.com/quote/${slug}?utm_source=instagram&utm_medium=bio`,
    utm_campaign: "dashboard_smoke",
    utm_medium: "bio",
    utm_source: "instagram",
  });

  const anonClient = createClient<Database>(input.supabaseUrl, input.publicApiKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const signedIn = await anonClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signedIn.error || !signedIn.data.session) {
    throw new Error(
      `Synthetic auth sign-in failed: ${signedIn.error?.message ?? "missing session"}`,
    );
  }

  const cookies = new Map<string, string>();
  const ssrClient = createServerClient<Database>(input.supabaseUrl, input.publicApiKey, {
    cookies: {
      getAll() {
        return [...cookies].map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          cookies.set(name, value);
        });
      },
    },
  });
  const sessionSet = await ssrClient.auth.setSession({
    access_token: signedIn.data.session.access_token,
    refresh_token: signedIn.data.session.refresh_token,
  });
  if (sessionSet.error) {
    throw new Error(`Synthetic SSR session failed: ${sessionSet.error.message}`);
  }
  if (cookies.size === 0) {
    throw new Error("Synthetic SSR session did not create auth cookies.");
  }

  return {
    cookieHeader: [...cookies]
      .map(([name, value]) => `${name}=${value}`)
      .join("; "),
    workspace: {
      businessId,
      leadId,
      slug,
      userId,
    },
  };
}

function targetUrl(baseUrl: URL, path: string): URL {
  const normalizedBase = new URL(baseUrl.toString());
  normalizedBase.pathname = "/";
  normalizedBase.search = "";
  normalizedBase.hash = "";
  return new URL(path, normalizedBase);
}

async function fetchWithTimeout(
  url: URL,
  cookieHeader: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
        "user-agent": "BizPilot-dashboard-auth-smoke/1.0",
      },
      redirect: "manual",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function runDashboardPath(input: {
  baseUrl: URL;
  cookieHeader: string;
  target: DashboardSmokeTarget;
  timeoutMs: number;
}): Promise<DashboardSmokeResult> {
  const startedAt = Date.now();
  const expectedStatus = input.target.status ?? 200;
  const url = targetUrl(input.baseUrl, input.target.path);

  try {
    const response = await fetchWithTimeout(url, input.cookieHeader, input.timeoutMs);
    const durationMs = Date.now() - startedAt;

    if (response.status !== expectedStatus) {
      return {
        durationMs,
        error: `expected HTTP ${expectedStatus}, received HTTP ${response.status}`,
        pass: false,
        path: input.target.path,
        status: response.status,
      };
    }

    if (input.target.redirectLocation) {
      const location = response.headers.get("location") ?? "";
      if (!location.includes(input.target.redirectLocation)) {
        return {
          durationMs,
          error: `expected redirect to ${input.target.redirectLocation}, received ${location || "no location header"}`,
          pass: false,
          path: input.target.path,
          status: response.status,
        };
      }

      return {
        durationMs,
        pass: true,
        path: input.target.path,
        status: response.status,
      };
    }

    const body = await response.text();
    if (body.length > 3_000_000) {
      return {
        durationMs,
        error: `response body too large for smoke check (${body.length} bytes)`,
        pass: false,
        path: input.target.path,
        status: response.status,
      };
    }

    for (const marker of rawErrorMarkers) {
      if (body.includes(marker)) {
        return {
          durationMs,
          error: `raw/internal marker exposed: ${JSON.stringify(marker)}`,
          pass: false,
          path: input.target.path,
          status: response.status,
        };
      }
    }

    return {
      durationMs,
      pass: true,
      path: input.target.path,
      status: response.status,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const message =
      error instanceof Error && error.name === "AbortError"
        ? `request timed out after ${input.timeoutMs}ms`
        : error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);

    return {
      durationMs,
      error: message,
      pass: false,
      path: input.target.path,
    };
  }
}

async function main(): Promise<void> {
  const fileValues = readEnvFiles();
  const baseUrl = resolveBaseUrl();
  const timeoutMs = resolveTimeoutMs();
  const supabaseUrl = readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", fileValues);
  const publicApiKey = readFirstRequiredEnv(
    ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    fileValues,
  );
  const adminApiKey = readFirstRequiredEnv(
    ["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    fileValues,
  );
  const appUrl = readOptionalEnv("NEXT_PUBLIC_APP_URL", fileValues);
  const isVercelEnvProduction =
    process.env.VERCEL_ENV?.toLowerCase() === "production";

  assertDashboardSmokeSafeInput({
    appUrl,
    baseUrl,
    isVercelEnvProduction,
    supabaseUrl,
  });

  console.log(`BizPilot dashboard auth smoke target: ${baseUrl.origin}`);
  console.log("Synthetic data only. Secrets and cookies are not printed.");

  const { cookieHeader, workspace } = await createSyntheticWorkspace({
    adminApiKey,
    publicApiKey,
    supabaseUrl,
  });
  const targets = [
    ...dashboardTargets,
    { path: `/dashboard/leads/${workspace.leadId}` },
  ];
  const results: DashboardSmokeResult[] = [];

  console.log(
    `Synthetic workspace: slug=${workspace.slug}, businessId=${workspace.businessId}, leadId=${workspace.leadId}`,
  );
  console.log(`Routes: ${targets.length}`);
  console.log("");

  for (const target of targets) {
    process.stdout.write(`  ${target.path} ... `);
    const result = await runDashboardPath({
      baseUrl,
      cookieHeader,
      target,
      timeoutMs,
    });
    results.push(result);

    if (result.pass) {
      console.log(`pass (${result.status}, ${result.durationMs}ms)`);
    } else {
      console.log(`FAIL (${result.status ?? "no status"}, ${result.durationMs}ms)`);
      console.log(`    ${result.error}`);
    }
  }

  const passed = results.filter((result) => result.pass).length;
  const failed = results.length - passed;

  console.log("");
  console.log(`Results: ${passed} passed, ${failed} failed (${results.length} total)`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Dashboard auth smoke runner error: ${message}`);
  process.exit(1);
});
