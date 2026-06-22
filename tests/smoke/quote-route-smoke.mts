/**
 * ============================================================
 * File: tests/smoke/quote-route-smoke.mts
 * Project: BizPilot AI
 * Description: Synthetic public quote-route smoke runner.
 * Role: Checks approved synthetic quote links without secrets, SQL, or real data.
 * Related:
 * - docs/readiness/PHASE_21N_SYNTHETIC_PRODUCTION_SMOKE_PLAN.md
 * - docs/readiness/PHASE_21P_NO_COST_READINESS_HARDENING.md
 * Author: MoOoH
 * Created: 2026-05-25
 * Change Log:
 * - 2026-06-21: Added GET-only quote honeypot and single-review-notice guards.
 * ============================================================
 */

type TextOccurrenceLimit = Readonly<{
  max: number;
  text: string;
}>;

type QuoteSmokeCheck = Readonly<{
  expectedText: readonly string[];
  maxOccurrences?: readonly TextOccurrenceLimit[];
  name: string;
  path: string;
  rejectedText?: readonly string[];
  status: number;
}>;

type QuoteSmokeResult = Readonly<{
  durationMs: number;
  error?: string;
  name: string;
  pass: boolean;
  path: string;
  status?: number;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const DEFAULT_TIMEOUT_MS = 15_000;

const rawErrorMarkers = [
  "PostgrestError",
  "Supabase error",
  "duplicate key value",
  "violates row-level security",
  "relation ",
  "schema cache",
  "service_role",
  "OPENAI_API_KEY",
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE",
  "stack trace",
  "Unhandled Runtime Error",
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

function readOptionalValue(name: string, envName: string): string | undefined {
  const value = readCliValue(name) ?? process.env[envName];
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
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

function normalizeSlug(raw: string): string {
  const value = raw.trim().replace(/^\/+|\/+$/g, "");
  if (value.startsWith("quote/")) {
    return value.slice("quote/".length);
  }

  return value;
}

function quotePathFromSlug(slug: string): string {
  const normalized = normalizeSlug(slug);
  const queryIndex = normalized.indexOf("?");
  const pathSlug =
    queryIndex >= 0 ? normalized.slice(0, queryIndex) : normalized;
  const query = queryIndex >= 0 ? normalized.slice(queryIndex) : "";

  return `/quote/${encodeURIComponent(pathSlug)}${query}`;
}

function toTargetUrl(baseUrl: URL, path: string): URL {
  const normalizedBase = new URL(baseUrl.toString());
  normalizedBase.pathname = "/";
  normalizedBase.search = "";
  normalizedBase.hash = "";
  return new URL(path, normalizedBase);
}

function countOccurrences(value: string, marker: string): number {
  return marker.length > 0 ? value.split(marker).length - 1 : 0;
}

function readableHtml(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
}

async function fetchWithTimeout(url: URL, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      headers: {
        "user-agent": "BizPilot-quote-route-smoke/1.0",
      },
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function runCheck(
  baseUrl: URL,
  check: QuoteSmokeCheck,
  timeoutMs: number,
): Promise<QuoteSmokeResult> {
  const startedAt = Date.now();
  const url = toTargetUrl(baseUrl, check.path);

  try {
    const response = await fetchWithTimeout(url, timeoutMs);
    const body = await response.text();
    const readableBody = readableHtml(body);
    const durationMs = Date.now() - startedAt;

    if (response.status !== check.status) {
      return {
        durationMs,
        error: `expected HTTP ${check.status}, received HTTP ${response.status}`,
        name: check.name,
        pass: false,
        path: check.path,
        status: response.status,
      };
    }

    for (const marker of rawErrorMarkers) {
      if (body.includes(marker)) {
        return {
          durationMs,
          error: `raw/internal marker exposed: ${JSON.stringify(marker)}`,
          name: check.name,
          pass: false,
          path: check.path,
          status: response.status,
        };
      }
    }

    for (const expected of check.expectedText) {
      if (!readableBody.includes(expected)) {
        return {
          durationMs,
          error: `missing expected text: ${JSON.stringify(expected)}`,
          name: check.name,
          pass: false,
          path: check.path,
          status: response.status,
        };
      }
    }

    for (const rejected of check.rejectedText ?? []) {
      if (readableBody.includes(rejected)) {
        return {
          durationMs,
          error: `unexpected text present: ${JSON.stringify(rejected)}`,
          name: check.name,
          pass: false,
          path: check.path,
          status: response.status,
        };
      }
    }

    for (const limit of check.maxOccurrences ?? []) {
      const count = countOccurrences(readableBody, limit.text);
      if (count > limit.max) {
        return {
          durationMs,
          error: `expected at most ${limit.max} occurrence(s) of ${JSON.stringify(limit.text)}, found ${count}`,
          name: check.name,
          pass: false,
          path: check.path,
          status: response.status,
        };
      }
    }

    return {
      durationMs,
      name: check.name,
      pass: true,
      path: check.path,
      status: response.status,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const message =
      error instanceof Error && error.name === "AbortError"
        ? `request timed out after ${timeoutMs}ms`
        : error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);

    return {
      durationMs,
      error: message,
      name: check.name,
      pass: false,
      path: check.path,
    };
  }
}

function buildChecks(): QuoteSmokeCheck[] {
  const activeSlug = readOptionalValue(
    "active-slug",
    "BIZPILOT_SMOKE_ACTIVE_QUOTE_SLUG",
  );
  const inactiveSlug = readOptionalValue(
    "inactive-slug",
    "BIZPILOT_SMOKE_INACTIVE_QUOTE_SLUG",
  );
  const frSlug = readOptionalValue("fr-slug", "BIZPILOT_SMOKE_FR_QUOTE_SLUG");

  const checks: QuoteSmokeCheck[] = [];

  if (activeSlug) {
    checks.push({
      expectedText: [
        "What kind of cleaning?",
        "Send quote request",
        "By sending this request, you agree to share your information with this business so they can respond to your quote request. BizPilot may help prepare an internal draft, but the business reviews every message before sending it.",
        "Submitting this form does not confirm pricing, availability, or booking.",
      ],
      maxOccurrences: [
        { max: 1, text: "BizPilot may help prepare an internal draft" },
      ],
      name: "active synthetic quote link",
      path: quotePathFromSlug(activeSlug),
      rejectedText: [
        "Quote page unavailable",
        "Company website",
        "BizPilot may help prepare internal AI drafts later",
      ],
      status: 200,
    });
  }

  if (inactiveSlug) {
    checks.push({
      expectedText: ["Quote page unavailable"],
      name: "inactive or unavailable synthetic quote link",
      path: quotePathFromSlug(inactiveSlug),
      status: 200,
    });
  }

  if (frSlug) {
    checks.push({
      expectedText: [
        "Quel type de nettoyage?",
        "Envoyer la demande",
        "En envoyant cette demande, vous acceptez que vos renseignements soient partagés avec cette entreprise afin qu’elle puisse répondre à votre demande de soumission. BizPilot peut aider à préparer un brouillon interne, mais l’entreprise révise chaque message avant de l’envoyer.",
        "L’envoi de ce formulaire ne confirme ni prix, ni disponibilité, ni réservation.",
      ],
      maxOccurrences: [
        { max: 1, text: "BizPilot peut aider à préparer un brouillon interne" },
      ],
      name: "fr-CA synthetic quote link",
      path: quotePathFromSlug(frSlug),
      rejectedText: [
        "Quote page unavailable",
        "Send quote request",
        "Company website",
        "BizPilot peut aider à préparer des brouillons IA internes plus tard",
      ],
      status: 200,
    });
  }

  if (checks.length === 0) {
    throw new Error(
      "Provide at least one approved synthetic slug through --active-slug, --inactive-slug, or --fr-slug.",
    );
  }

  return checks;
}

async function main(): Promise<void> {
  const baseUrl = resolveBaseUrl();
  const timeoutMs = resolveTimeoutMs();
  const checks = buildChecks();
  const results: QuoteSmokeResult[] = [];

  console.log(`BizPilot quote route smoke target: ${baseUrl.origin}`);
  console.log(`Checks: ${checks.length}`);
  console.log("");

  for (const check of checks) {
    process.stdout.write(`  ${check.name} (${check.path}) ... `);
    const result = await runCheck(baseUrl, check, timeoutMs);
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
  console.error(`Quote route smoke runner error: ${message}`);
  process.exit(1);
});
