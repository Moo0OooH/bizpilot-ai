/**
 * ============================================================
 * File: tests/smoke/public-route-smoke.mts
 * Project: BizPilot AI
 * Description: Synthetic public-route smoke runner for local and production URLs.
 * Role: Verifies public demo, pricing, trust, and auth surfaces without secrets or real data.
 * Related:
 * - docs/readiness/PHASE_21N_SYNTHETIC_PRODUCTION_SMOKE_PLAN.md
 * - docs/readiness/PHASE_21O_PUBLIC_TRUST_PAGES_AND_SAFE_GAP_REVIEW.md
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-06-21: Added the dedicated public FAQ route to smoke coverage.
 * - 2026-07-04: Added comparison route smoke coverage.
 * - 2026-07-04: Added quote-link guide smoke coverage.
 * - 2026-07-04: Added product-real demo route smoke coverage.
 * - 2026-07-05: Updated homepage smoke markers for the product-scene hero.
 * - 2026-07-05: Updated homepage smoke markers for the hot quote rescue hero.
 * - 2026-07-05: Aligned homepage smoke markers with escaped production HTML.
 * - 2026-07-11: Updated homepage smoke markers for the stronger quote-rescue hero.
 * - 2026-07-11: Added all primary public marketing pages to route smoke coverage.
 * - 2026-07-12: Added fr-CA route and internal-link persistence smoke coverage.
 * ============================================================
 */

type SmokeTarget = Readonly<{
  expectedText?: readonly string[];
  maxBytes?: number;
  path: string;
  status: number;
}>;

type SmokeResult = Readonly<{
  durationMs: number;
  error?: string;
  path: string;
  pass: boolean;
  status?: number;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const DEFAULT_TIMEOUT_MS = 15_000;

const smokeTargets: readonly SmokeTarget[] = [
  {
    expectedText: [
      "Turn missed quote requests into ready replies.",
      "Join the pilot",
      "47-minute response gap",
      "Move-out quote is getting cold",
      "Review &amp; copy",
    ],
    path: "/",
    status: 200,
  },
  {
    expectedText: [
      "Questions cleaning business owners ask before joining.",
      "Pilot basics",
    ],
    path: "/faq",
    status: 200,
  },
  {
    expectedText: [
      "A simple system to manage cleaning quote requests faster.",
      "From quote link to reply ready to send.",
      "Review, copy, and send manually.",
    ],
    path: "/features",
    status: 200,
  },
  {
    expectedText: [
      "Lead recovery software for cleaning businesses.",
      "From vague request to clear next reply.",
      "Move-in / move-out",
      "Post-construction cleaning",
    ],
    path: "/industries/cleaning",
    status: 200,
  },
  {
    expectedText: [
      "BizPilot vs CRMs, forms, and booking tools.",
      "Full CRM",
      "Form builder",
      "The boundary matters.",
    ],
    path: "/comparison",
    status: 200,
  },
  {
    expectedText: [
      "Where to put your cleaning quote link.",
      "Google Business Profile",
      "Tracked link patterns",
      "Do not turn a quote request into a fake booking.",
    ],
    path: "/quote-link-guide",
    status: 200,
  },
  {
    expectedText: [
      "Faster cleaning quote replies without auto-send.",
      "reply-speed-board",
      "A four-week reply-speed content plan.",
      "No automatic customer email",
      "No price, availability, or appointment",
    ],
    path: "/faster-quote-replies",
    status: 200,
  },
  {
    expectedText: [
      "Cleaning quote recovery demo.",
      "demo-owner-workspace",
      "Static owner-view demo",
      "Reply draft for owner review",
      "No booking confirmed",
    ],
    path: "/demo",
    status: 200,
  },
  {
    expectedText: [
      "Built for business control and trust.",
      "No auto-send",
      "Manual communication during the pilot",
    ],
    path: "/trust",
    status: 200,
  },
  {
    expectedText: ["$149 setup", "$49/month"],
    path: "/pricing",
    status: 200,
  },
  {
    expectedText: [
      "Help shape BizPilot around real cleaning work.",
      "What the pilot will measure",
      "Send a clear founder-pilot request when you are ready.",
    ],
    path: "/pilot",
    status: 200,
  },
  {
    expectedText: [
      "Future Content Studio for local business growth.",
      "This page is roadmap only.",
      "still need your approval",
    ],
    path: "/content-studio",
    status: 200,
  },
  {
    expectedText: ["Privacy rules for careful quote recovery."],
    path: "/privacy",
    status: 200,
  },
  {
    expectedText: ["Security boundaries before real pilot data."],
    path: "/security",
    status: 200,
  },
  {
    expectedText: ["Clear founder-pilot terms, no hidden automation."],
    path: "/terms",
    status: 200,
  },
  {
    expectedText: ["Sign in"],
    path: "/auth/sign-in",
    status: 200,
  },
  {
    expectedText: ["Create owner access", "Apply through the founder pilot page first."],
    path: "/auth/sign-up",
    status: 200,
  },
  {
    expectedText: ["Reset password"],
    path: "/auth/forgot-password",
    status: 200,
  },
  {
    expectedText: ["Set new password"],
    path: "/auth/reset-password",
    status: 200,
  },
];

const frenchPublicRoutes = [
  "/",
  "/features",
  "/industries/cleaning",
  "/comparison",
  "/quote-link-guide",
  "/faster-quote-replies",
  "/trust",
  "/demo",
  "/pricing",
  "/pilot",
  "/faq",
  "/privacy",
  "/security",
  "/terms",
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

function toTargetUrl(baseUrl: URL, path: string): URL {
  const normalizedBase = new URL(baseUrl.toString());
  normalizedBase.pathname = "/";
  normalizedBase.search = "";
  normalizedBase.hash = "";
  return new URL(path, normalizedBase);
}

async function fetchWithTimeout(url: URL, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      headers: {
        "user-agent": "BizPilot-public-smoke/1.0",
      },
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function runTarget(
  baseUrl: URL,
  target: SmokeTarget,
  timeoutMs: number,
): Promise<SmokeResult> {
  const startedAt = Date.now();
  const url = toTargetUrl(baseUrl, target.path);

  try {
    const response = await fetchWithTimeout(url, timeoutMs);
    const durationMs = Date.now() - startedAt;

    if (response.status !== target.status) {
      return {
        durationMs,
        error: `expected HTTP ${target.status}, received HTTP ${response.status}`,
        path: target.path,
        pass: false,
        status: response.status,
      };
    }

    const body = await response.text();
    const maxBytes = target.maxBytes ?? 2_000_000;
    if (body.length > maxBytes) {
      return {
        durationMs,
        error: `response body too large for smoke check (${body.length} bytes)`,
        path: target.path,
        pass: false,
        status: response.status,
      };
    }

    for (const expected of target.expectedText ?? []) {
      if (!body.includes(expected)) {
        return {
          durationMs,
          error: `missing expected text: ${JSON.stringify(expected)}`,
          path: target.path,
          pass: false,
          status: response.status,
        };
      }
    }

    return {
      durationMs,
      path: target.path,
      pass: true,
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
      path: target.path,
      pass: false,
    };
  }
}

function frenchPath(path: string): string {
  const url = new URL(path, "https://bizpilot.local");
  url.searchParams.set("language", "fr-CA");
  return `${url.pathname}${url.search}`;
}

function missingFrenchPublicHref(body: string): string | null {
  const hrefs = Array.from(body.matchAll(/href="([^"]+)"/g), (match) =>
    match[1]?.replaceAll("&amp;", "&") ?? "",
  );

  for (const href of hrefs) {
    if (!href.startsWith("/")) {
      continue;
    }

    const url = new URL(href, "https://bizpilot.local");
    if (
      frenchPublicRoutes.includes(url.pathname as (typeof frenchPublicRoutes)[number]) &&
      url.searchParams.get("language") !== "fr-CA"
    ) {
      return href;
    }
  }

  return null;
}

async function runFrenchLinkPersistence(
  baseUrl: URL,
  path: string,
  timeoutMs: number,
): Promise<SmokeResult> {
  const targetPath = frenchPath(path);
  const startedAt = Date.now();

  try {
    const response = await fetchWithTimeout(toTargetUrl(baseUrl, targetPath), timeoutMs);
    const durationMs = Date.now() - startedAt;
    const body = await response.text();
    const missingHref = missingFrenchPublicHref(body);

    return {
      durationMs,
      ...(missingHref
        ? { error: `public fr-CA link drops language: ${missingHref}` }
        : {}),
      path: targetPath,
      pass:
        response.status === 200 &&
        body.includes('<html lang="fr-CA"') &&
        missingHref === null,
      status: response.status,
    };
  } catch (error) {
    return {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
      path: targetPath,
      pass: false,
    };
  }
}

async function main(): Promise<void> {
  const baseUrl = resolveBaseUrl();
  const timeoutMs = resolveTimeoutMs();
  const results: SmokeResult[] = [];

  console.log(`BizPilot public smoke target: ${baseUrl.origin}`);
  console.log(`Routes: ${smokeTargets.length}`);
  console.log("");

  for (const target of smokeTargets) {
    process.stdout.write(`  ${target.path} ... `);
    const result = await runTarget(baseUrl, target, timeoutMs);
    results.push(result);

    if (result.pass) {
      console.log(`pass (${result.status}, ${result.durationMs}ms)`);
    } else {
      console.log(`FAIL (${result.status ?? "no status"}, ${result.durationMs}ms)`);
      console.log(`    ${result.error}`);
    }
  }

  for (const path of frenchPublicRoutes) {
    process.stdout.write(`  ${frenchPath(path)} language links ... `);
    const result = await runFrenchLinkPersistence(baseUrl, path, timeoutMs);
    results.push(result);

    if (result.pass) {
      console.log(`pass (${result.status}, ${result.durationMs}ms)`);
    } else {
      console.log(`FAIL (${result.status ?? "no status"}, ${result.durationMs}ms)`);
      console.log(`    ${result.error ?? "French route did not render as expected"}`);
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
  console.error(`Public smoke runner error: ${message}`);
  process.exit(1);
});
