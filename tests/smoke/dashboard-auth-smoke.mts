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

type DashboardFixtureProfile = "basic" | "dense";

type SyntheticWorkspace = Readonly<{
  businessId: string;
  fixtureProfile: DashboardFixtureProfile;
  leadId: string;
  leadIds: readonly string[];
  slug: string;
  userId: string;
}>;

type SyntheticSubmissionValue = Readonly<{
  fieldKey: string;
  fieldLabel: string;
  fieldValue: unknown;
}>;

type SyntheticLeadScenario = Readonly<{
  cityOrServiceArea: string | null;
  createdAt?: string | undefined;
  customerContact: string | null;
  customerName: string | null;
  firstReplyCopiedAt?: string | null | undefined;
  firstViewedAt?: string | null | undefined;
  lastOwnerActionAt?: string | null | undefined;
  manualOutcome?: "asked_info" | "booked" | "lost" | "no_response" | "not_a_fit" | null;
  referrer: string | null;
  responseSlaState: "follow_up_due" | "new" | "overdue" | "reply_copied" | "viewed";
  responseStatus: "follow_up_due" | "new" | "overdue" | "reply_copied" | "viewed";
  serviceType: string | null;
  sourceChannel: string;
  sourceUrl: string;
  status:
    | "archived"
    | "booked"
    | "follow_up_needed"
    | "lost"
    | "new"
    | "replied"
    | "reviewed";
  utmCampaign: string;
  utmMedium: string;
  utmSource: string;
  values: readonly SyntheticSubmissionValue[];
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

function resolveFixtureProfile(): DashboardFixtureProfile {
  const raw =
    readCliValue("fixture-profile") ??
    process.env.BIZPILOT_DASHBOARD_SMOKE_FIXTURE_PROFILE ??
    "basic";
  const normalized = raw.trim().toLowerCase();

  if (normalized === "basic" || normalized === "dense") {
    return normalized;
  }

  throw new Error(
    'Dashboard smoke fixture profile must be "basic" or "dense". Use --fixture-profile=dense for data-rich QA.',
  );
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

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function createBasicLeadScenario(slug: string): SyntheticLeadScenario {
  return {
    cityOrServiceArea: "Toronto",
    customerContact: "synthetic@example.test",
    customerName: "Synthetic Quote Lead",
    referrer: "https://instagram.com/",
    responseSlaState: "new",
    responseStatus: "new",
    serviceType: "Deep cleaning",
    sourceChannel: "instagram",
    sourceUrl: `https://bizpilo.com/quote/${slug}?utm_source=instagram&utm_medium=bio`,
    status: "new",
    utmCampaign: "dashboard_smoke",
    utmMedium: "bio",
    utmSource: "instagram",
    values: [
      {
        fieldKey: "cleaning_type",
        fieldLabel: "Cleaning type",
        fieldValue: "deep",
      },
      {
        fieldKey: "city_or_service_area",
        fieldLabel: "City or service area",
        fieldValue: "Toronto",
      },
      {
        fieldKey: "customer_contact",
        fieldLabel: "Customer contact",
        fieldValue: "synthetic@example.test",
      },
      {
        fieldKey: "customer_name",
        fieldLabel: "Customer name",
        fieldValue: "Synthetic Quote Lead",
      },
    ],
  };
}

function createDenseLeadScenarios(slug: string): readonly SyntheticLeadScenario[] {
  return [
    {
      cityOrServiceArea:
        "Toronto - East York / Leslieville / Riverdale urgent move-out coverage window",
      createdAt: hoursAgo(31),
      customerContact:
        "synthetic.long.customer+move-out-and-post-renovation-dashboard-fixture@example.test",
      customerName:
        "Synthetic Alexandra Longlastname-Moveout With Extra Dashboard QA Detail",
      referrer: "https://www.google.com/",
      responseSlaState: "new",
      responseStatus: "new",
      serviceType:
        "Move-out deep cleaning with appliance interiors, post-renovation dust, and balcony glass",
      sourceChannel: "google_business_profile",
      sourceUrl: `https://bizpilo.com/quote/${slug}?source=gbp&utm_source=google_business_profile&utm_medium=business_profile&utm_campaign=dense_dashboard_smoke`,
      status: "new",
      utmCampaign: "dense_dashboard_smoke",
      utmMedium: "business_profile",
      utmSource: "google_business_profile",
      values: [
        {
          fieldKey: "cleaning_type",
          fieldLabel: "Cleaning type",
          fieldValue:
            "Move-out deep clean, appliances, cabinets, interior windows, post-renovation dust",
        },
        {
          fieldKey: "property_type",
          fieldLabel: "Property type",
          fieldValue: "Condo townhouse with narrow parking notes",
        },
        {
          fieldKey: "bedrooms",
          fieldLabel: "Bedrooms",
          fieldValue: "3 bedrooms plus den",
        },
        {
          fieldKey: "bathrooms",
          fieldLabel: "Bathrooms",
          fieldValue: "2.5 bathrooms",
        },
        {
          fieldKey: "preferred_date",
          fieldLabel: "Preferred date",
          fieldValue: daysFromNow(1),
        },
        {
          fieldKey: "preferred_time_window",
          fieldLabel: "Preferred time window",
          fieldValue: "Tomorrow morning before key handoff",
        },
        {
          fieldKey: "city_or_service_area",
          fieldLabel: "City or service area",
          fieldValue:
            "Toronto - East York / Leslieville / Riverdale urgent move-out coverage window",
        },
        {
          fieldKey: "customer_contact",
          fieldLabel: "Customer contact",
          fieldValue:
            "synthetic.long.customer+move-out-and-post-renovation-dashboard-fixture@example.test",
        },
        {
          fieldKey: "customer_name",
          fieldLabel: "Customer name",
          fieldValue:
            "Synthetic Alexandra Longlastname-Moveout With Extra Dashboard QA Detail",
        },
        {
          fieldKey: "quote_notes",
          fieldLabel: "Quote notes",
          fieldValue:
            "Please include oven, fridge, cabinet interiors, baseboards, dust on high shelves, and a manual owner-reviewed reply only.",
        },
      ],
    },
    {
      cityOrServiceArea: "North York",
      createdAt: hoursAgo(7),
      customerContact: "synthetic.office+weekly@example.test",
      customerName: "Synthetic Office Lead",
      referrer: "https://example.test/cleaning-services",
      responseSlaState: "new",
      responseStatus: "new",
      serviceType: "Weekly office cleaning",
      sourceChannel: "website",
      sourceUrl: `https://bizpilo.com/quote/${slug}?source=website&utm_source=website&utm_medium=contact_page&utm_campaign=dense_dashboard_smoke`,
      status: "new",
      utmCampaign: "dense_dashboard_smoke",
      utmMedium: "contact_page",
      utmSource: "website",
      values: [
        {
          fieldKey: "cleaning_type",
          fieldLabel: "Cleaning type",
          fieldValue: "Weekly office cleaning",
        },
        {
          fieldKey: "property_type",
          fieldLabel: "Property type",
          fieldValue: "Office",
        },
        {
          fieldKey: "preferred_date",
          fieldLabel: "Preferred date",
          fieldValue: daysFromNow(3),
        },
        {
          fieldKey: "city_or_service_area",
          fieldLabel: "City or service area",
          fieldValue: "North York",
        },
        {
          fieldKey: "customer_contact",
          fieldLabel: "Customer contact",
          fieldValue: "synthetic.office+weekly@example.test",
        },
      ],
    },
    {
      cityOrServiceArea: "Toronto",
      createdAt: hoursAgo(80),
      customerContact: "synthetic.followup@example.test",
      customerName: "Synthetic Follow Up Lead",
      firstReplyCopiedAt: hoursAgo(54),
      firstViewedAt: hoursAgo(55),
      lastOwnerActionAt: hoursAgo(54),
      referrer: "https://instagram.com/",
      responseSlaState: "reply_copied",
      responseStatus: "reply_copied",
      serviceType: "Recurring home cleaning",
      sourceChannel: "instagram",
      sourceUrl: `https://bizpilo.com/quote/${slug}?source=instagram&utm_source=instagram&utm_medium=bio&utm_campaign=dense_dashboard_smoke`,
      status: "replied",
      utmCampaign: "dense_dashboard_smoke",
      utmMedium: "bio",
      utmSource: "instagram",
      values: [
        {
          fieldKey: "cleaning_type",
          fieldLabel: "Cleaning type",
          fieldValue: "Recurring home cleaning",
        },
        {
          fieldKey: "property_type",
          fieldLabel: "Property type",
          fieldValue: "House",
        },
        {
          fieldKey: "bedrooms",
          fieldLabel: "Bedrooms",
          fieldValue: "4",
        },
        {
          fieldKey: "bathrooms",
          fieldLabel: "Bathrooms",
          fieldValue: "3",
        },
        {
          fieldKey: "city_or_service_area",
          fieldLabel: "City or service area",
          fieldValue: "Toronto",
        },
        {
          fieldKey: "customer_contact",
          fieldLabel: "Customer contact",
          fieldValue: "synthetic.followup@example.test",
        },
      ],
    },
    {
      cityOrServiceArea: "Scarborough",
      createdAt: hoursAgo(14),
      customerContact: null,
      customerName: "Synthetic Missing Contact Lead",
      referrer: "https://mail.example.test/",
      responseSlaState: "new",
      responseStatus: "new",
      serviceType: "One-time condo cleaning",
      sourceChannel: "email_signature",
      sourceUrl: `https://bizpilo.com/quote/${slug}?source=email_signature&utm_source=email_signature&utm_medium=email&utm_campaign=dense_dashboard_smoke`,
      status: "new",
      utmCampaign: "dense_dashboard_smoke",
      utmMedium: "email",
      utmSource: "email_signature",
      values: [
        {
          fieldKey: "cleaning_type",
          fieldLabel: "Cleaning type",
          fieldValue: "One-time condo cleaning",
        },
        {
          fieldKey: "property_type",
          fieldLabel: "Property type",
          fieldValue: "Condo",
        },
        {
          fieldKey: "city_or_service_area",
          fieldLabel: "City or service area",
          fieldValue: "Scarborough",
        },
        {
          fieldKey: "customer_name",
          fieldLabel: "Customer name",
          fieldValue: "Synthetic Missing Contact Lead",
        },
      ],
    },
    {
      cityOrServiceArea: "Outside Region - Hamilton",
      createdAt: hoursAgo(3),
      customerContact: "synthetic.outside-area@example.test",
      customerName: "Synthetic Outside Area Lead",
      referrer: "https://facebook.com/",
      responseSlaState: "new",
      responseStatus: "new",
      serviceType: "Post-construction cleaning",
      sourceChannel: "facebook",
      sourceUrl: `https://bizpilo.com/quote/${slug}?source=facebook&utm_source=facebook&utm_medium=post&utm_campaign=dense_dashboard_smoke`,
      status: "new",
      utmCampaign: "dense_dashboard_smoke",
      utmMedium: "post",
      utmSource: "facebook",
      values: [
        {
          fieldKey: "cleaning_type",
          fieldLabel: "Cleaning type",
          fieldValue: "Post-construction cleaning",
        },
        {
          fieldKey: "property_type",
          fieldLabel: "Property type",
          fieldValue: "Detached house",
        },
        {
          fieldKey: "city_or_service_area",
          fieldLabel: "City or service area",
          fieldValue: "Outside Region - Hamilton",
        },
        {
          fieldKey: "customer_contact",
          fieldLabel: "Customer contact",
          fieldValue: "synthetic.outside-area@example.test",
        },
      ],
    },
    {
      cityOrServiceArea: "Toronto",
      createdAt: hoursAgo(90),
      customerContact: "synthetic.booked@example.test",
      customerName: "Synthetic Booked Lead",
      firstReplyCopiedAt: hoursAgo(88),
      firstViewedAt: hoursAgo(89),
      lastOwnerActionAt: hoursAgo(86),
      manualOutcome: "booked",
      referrer: "https://instagram.com/direct/inbox/",
      responseSlaState: "reply_copied",
      responseStatus: "reply_copied",
      serviceType: "Biweekly apartment cleaning",
      sourceChannel: "saved_reply",
      sourceUrl: `https://bizpilo.com/quote/${slug}?source=saved_reply&utm_source=instagram&utm_medium=saved_reply&utm_campaign=dense_dashboard_smoke`,
      status: "booked",
      utmCampaign: "dense_dashboard_smoke",
      utmMedium: "saved_reply",
      utmSource: "instagram",
      values: [
        {
          fieldKey: "cleaning_type",
          fieldLabel: "Cleaning type",
          fieldValue: "Biweekly apartment cleaning",
        },
        {
          fieldKey: "property_type",
          fieldLabel: "Property type",
          fieldValue: "Apartment",
        },
        {
          fieldKey: "bedrooms",
          fieldLabel: "Bedrooms",
          fieldValue: "2",
        },
        {
          fieldKey: "bathrooms",
          fieldLabel: "Bathrooms",
          fieldValue: "1",
        },
        {
          fieldKey: "city_or_service_area",
          fieldLabel: "City or service area",
          fieldValue: "Toronto",
        },
        {
          fieldKey: "customer_contact",
          fieldLabel: "Customer contact",
          fieldValue: "synthetic.booked@example.test",
        },
      ],
    },
  ];
}

async function createSyntheticLead(input: {
  businessId: string;
  consentVersionId: string;
  intakeFormId: string;
  scenario: SyntheticLeadScenario;
  service: UnsafeClient;
}): Promise<string> {
  const submission = await insertOne(input.service, "intake_submissions", {
    business_id: input.businessId,
    consent_accepted_at: new Date().toISOString(),
    consent_version_id: input.consentVersionId,
    ...(input.scenario.createdAt ? { created_at: input.scenario.createdAt } : {}),
    intake_form_id: input.intakeFormId,
    privacy_mode: "standard",
    status: "submitted",
  });
  const submissionId = String(submission.id);

  await insertMany(
    input.service,
    "intake_submission_values",
    input.scenario.values.map((value) => ({
      business_id: input.businessId,
      field_key: value.fieldKey,
      field_label: value.fieldLabel,
      field_value: value.fieldValue,
      submission_id: submissionId,
    })),
  );

  const lead = await insertOne(
    input.service,
    "leads",
    {
      business_id: input.businessId,
      city_or_service_area: input.scenario.cityOrServiceArea,
      ...(input.scenario.createdAt ? { created_at: input.scenario.createdAt } : {}),
      customer_contact: input.scenario.customerContact,
      customer_name: input.scenario.customerName,
      first_reply_copied_at: input.scenario.firstReplyCopiedAt ?? null,
      first_viewed_at: input.scenario.firstViewedAt ?? null,
      intake_submission_id: submissionId,
      last_owner_action_at: input.scenario.lastOwnerActionAt ?? null,
      manual_outcome: input.scenario.manualOutcome ?? null,
      response_sla_state: input.scenario.responseSlaState,
      response_status: input.scenario.responseStatus,
      service_type: input.scenario.serviceType,
      source_channel: input.scenario.sourceChannel,
      status: input.scenario.status,
      ...(input.scenario.createdAt ? { updated_at: input.scenario.createdAt } : {}),
    },
    [
      "created_at",
      "first_reply_copied_at",
      "first_viewed_at",
      "last_owner_action_at",
      "manual_outcome",
      "response_sla_state",
      "response_status",
      "updated_at",
    ],
  );
  const leadId = String(lead.id);

  await insertOne(input.service, "lead_source_metadata", {
    business_id: input.businessId,
    lead_id: leadId,
    referrer: input.scenario.referrer,
    source_channel: input.scenario.sourceChannel,
    source_url: input.scenario.sourceUrl,
    utm_campaign: input.scenario.utmCampaign,
    utm_medium: input.scenario.utmMedium,
    utm_source: input.scenario.utmSource,
  });

  return leadId;
}

async function createSyntheticWorkspace(input: {
  adminApiKey: string;
  fixtureProfile: DashboardFixtureProfile;
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
      name:
        input.fixtureProfile === "dense"
          ? `Codex Dense Dashboard QA Cleaning With Long Owner Workspace Name ${stamp}`
          : `Codex Dashboard Smoke Cleaning ${stamp}`,
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
    ...(input.fixtureProfile === "dense"
      ? [
          {
            business_id: businessId,
            description:
              "Move-out, post-renovation, appliance interior, cabinet, and handoff-window cleaning.",
            is_active: true,
            name: "Move-out and post-renovation deep cleaning",
            sort_order: 20,
          },
          {
            business_id: businessId,
            description:
              "Recurring commercial office cleaning with owner-reviewed quote follow-up.",
            is_active: true,
            name: "Recurring office cleaning",
            sort_order: 30,
          },
        ]
      : []),
  ]);
  await insertMany(unsafeService, "business_service_areas", [
    {
      business_id: businessId,
      is_active: true,
      name: "Toronto",
      sort_order: 10,
    },
    ...(input.fixtureProfile === "dense"
      ? [
          {
            business_id: businessId,
            is_active: true,
            name: "East York / Leslieville / Riverdale",
            sort_order: 20,
          },
          {
            business_id: businessId,
            is_active: true,
            name: "North York",
            sort_order: 30,
          },
          {
            business_id: businessId,
            is_active: true,
            name: "Scarborough",
            sort_order: 40,
          },
        ]
      : []),
  ]);
  await insertMany(unsafeService, "business_faqs", [
    {
      answer: "Synthetic smoke requests are reviewed manually by the owner.",
      business_id: businessId,
      is_active: true,
      question: "How fast do you reply?",
      sort_order: 10,
    },
    ...(input.fixtureProfile === "dense"
      ? [
          {
            answer:
              "BizPilot prepares owner-reviewed drafts only. The owner copies and sends every customer reply outside BizPilot.",
            business_id: businessId,
            is_active: true,
            question: "Does the system send replies automatically?",
            sort_order: 20,
          },
          {
            answer:
              "Synthetic QA links preserve source and UTM context so dashboards can be checked without real customer data.",
            business_id: businessId,
            is_active: true,
            question: "How are quote-link sources tested?",
            sort_order: 30,
          },
        ]
      : []),
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

  const scenarios =
    input.fixtureProfile === "dense"
      ? createDenseLeadScenarios(slug)
      : [createBasicLeadScenario(slug)];
  const leadIds: string[] = [];

  for (const scenario of scenarios) {
    leadIds.push(
      await createSyntheticLead({
        businessId,
        consentVersionId,
        intakeFormId,
        scenario,
        service: unsafeService,
      }),
    );
  }
  const leadId = leadIds[0];
  if (!leadId) {
    throw new Error("Synthetic workspace did not create a lead.");
  }

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
      fixtureProfile: input.fixtureProfile,
      leadId,
      leadIds,
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
  const fixtureProfile = resolveFixtureProfile();
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
  console.log(
    `Synthetic data only. Fixture profile: ${fixtureProfile}. Secrets and cookies are not printed.`,
  );

  const { cookieHeader, workspace } = await createSyntheticWorkspace({
    adminApiKey,
    fixtureProfile,
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
  console.log(`Synthetic leads: ${workspace.leadIds.length}`);
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
