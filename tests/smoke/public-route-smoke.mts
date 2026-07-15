/**
 * ============================================================
 * File: tests/smoke/public-route-smoke.mts
 * Project: BizPilot AI
 * Description: Synthetic public-route smoke runner for local and production URLs.
 * Role: Verifies public demo, pricing, trust, and auth surfaces without secrets or real data.
 * Related:
 * - docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Added safe EN/fr-CA missing-success coverage for the dynamic quote success boundary.
 * - 2026-07-15: Added direct EN/fr-CA coverage for every auth page and the base quote-unavailable route.
 * - 2026-07-13: Replaced retired V2 page checks with ten retained V3 routes and exact 308 redirect-location coverage.
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
 * - 2026-07-13: Replaced legacy cleaning-only route markers with the universal V2 product truth.
 * - 2026-07-13: Aligned homepage smoke markers with the V3 message-to-reply hero.
 * ============================================================
 */

import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";
import { INTERFACE_LANGUAGE_COOKIE } from "../../lib/i18n/language.ts";
import { getPublicV3Spec } from "../../lib/i18n/public-v3-spec.ts";

type SmokeTarget = Readonly<{
  cookieLanguage?: "en" | "fr-CA";
  expectedText?: readonly string[];
  expectedLanguage?: "en" | "fr-CA";
  location?: string;
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
const englishV3 = getPublicV3Spec("en");
const englishAuth = getBizPilotCopy("en").auth;
const englishQuote = getBizPilotCopy("en").quotePage;
const frenchAuth = getBizPilotCopy("fr-CA").auth;
const frenchQuote = getBizPilotCopy("fr-CA").quotePage;

const smokeTargets: readonly SmokeTarget[] = [
  {
    expectedText: [
      "Turn scattered customer messages into complete requests—and replies ready to review.",
      "One Smart Intake Link",
      "Read, edit, and copy the AI-assisted draft, then send it manually through the real customer channel.",
    ],
    path: "/",
    status: 200,
  },
  {
    expectedText: [
      englishV3.routes["/faq"].hero.title,
      englishV3.faqItems[0]?.question ?? "",
    ],
    path: "/faq",
    status: 200,
  },
  {
    expectedText: [
      englishV3.routes["/features"].hero.title,
      englishV3.features[0]?.title ?? "",
    ],
    path: "/features",
    status: 200,
  },
  {
    expectedText: [
      englishV3.routes["/demo"].hero.title,
      englishV3.demo.incoming,
    ],
    path: "/demo",
    status: 200,
  },
  {
    expectedText: [
      englishV3.routes["/trust"].hero.title,
      englishV3.trust[3]?.title ?? "",
    ],
    path: "/trust",
    status: 200,
  },
  {
    expectedText: [englishV3.routes["/pricing"].hero.title, "$149 setup + $49/month"],
    path: "/pricing",
    status: 200,
  },
  {
    expectedText: [
      englishV3.routes["/pilot"].hero.title,
      englishV3.pilot.applicationAction,
    ],
    path: "/pilot",
    status: 200,
  },
  {
    expectedText: [englishV3.routes["/privacy"].hero.title],
    path: "/privacy",
    status: 200,
  },
  {
    expectedText: [englishV3.routes["/security"].hero.title],
    path: "/security",
    status: 200,
  },
  {
    expectedText: [englishV3.routes["/terms"].hero.title],
    path: "/terms",
    status: 200,
  },
  {
    expectedLanguage: "en",
    expectedText: [englishAuth.signInTitle],
    path: "/auth/sign-in",
    status: 200,
  },
  {
    expectedLanguage: "en",
    expectedText: [
      englishAuth.createWorkspaceTitle,
      "Apply through the founder pilot page first.",
    ],
    path: "/auth/sign-up",
    status: 200,
  },
  {
    expectedLanguage: "en",
    expectedText: [englishAuth.checkEmailTitle],
    path: "/auth/check-email",
    status: 200,
  },
  {
    expectedLanguage: "en",
    expectedText: [englishAuth.forgotPasswordTitle],
    path: "/auth/forgot-password",
    status: 200,
  },
  {
    expectedLanguage: "en",
    expectedText: [englishAuth.resetPasswordTitle],
    path: "/auth/reset-password",
    status: 200,
  },
  {
    expectedLanguage: "fr-CA",
    expectedText: [frenchAuth.signInTitle],
    path: "/auth/sign-in?language=fr-CA",
    status: 200,
  },
  {
    expectedLanguage: "fr-CA",
    expectedText: [frenchAuth.createWorkspaceTitle],
    path: "/auth/sign-up?language=fr-CA",
    status: 200,
  },
  {
    expectedLanguage: "fr-CA",
    expectedText: [frenchAuth.checkEmailTitle],
    path: "/auth/check-email?language=fr-CA",
    status: 200,
  },
  {
    expectedLanguage: "fr-CA",
    expectedText: [frenchAuth.forgotPasswordTitle],
    path: "/auth/forgot-password?language=fr-CA",
    status: 200,
  },
  {
    expectedLanguage: "fr-CA",
    expectedText: [frenchAuth.resetPasswordTitle],
    path: "/auth/reset-password?language=fr-CA",
    status: 200,
  },
  {
    expectedLanguage: "en",
    expectedText: [englishQuote.unavailableTitle],
    path: "/quote",
    status: 200,
  },
  {
    expectedLanguage: "fr-CA",
    expectedText: [frenchQuote.unavailableTitle],
    path: "/quote?language=fr-CA",
    status: 200,
  },
  {
    cookieLanguage: "en",
    expectedLanguage: "en",
    expectedText: [englishQuote.unavailableTitle],
    path: "/quote/__bizpilot-smoke-inactive__/success",
    status: 200,
  },
  {
    cookieLanguage: "fr-CA",
    expectedLanguage: "fr-CA",
    expectedText: [frenchQuote.unavailableTitle],
    path: "/quote/__bizpilot-smoke-inactive__/success?language=fr-CA",
    status: 200,
  },
  {
    cookieLanguage: "en",
    expectedLanguage: "en",
    expectedText: [englishV3.notFound.title, englishV3.notFound.primary],
    path: "/__bizpilot-not-found-smoke__",
    status: 404,
  },
  {
    cookieLanguage: "fr-CA",
    expectedLanguage: "fr-CA",
    expectedText: [
      getPublicV3Spec("fr-CA").notFound.title,
      getPublicV3Spec("fr-CA").notFound.primary,
    ],
    path: "/__bizpilot-not-found-smoke__?language=fr-CA",
    status: 404,
  },
  {
    location: "/features#focused-by-design",
    path: "/comparison",
    status: 308,
  },
  {
    location: "/features#share-anywhere",
    path: "/quote-link-guide",
    status: 308,
  },
  {
    location: "/#how-it-works",
    path: "/faster-quote-replies",
    status: 308,
  },
  {
    location: "/features#reply-drafts",
    path: "/content-studio",
    status: 308,
  },
  {
    location: "/demo",
    path: "/industries/cleaning",
    status: 308,
  },
  {
    location: "/features?language=fr-CA&source=smoke#focused-by-design",
    path: "/comparison?language=fr-CA&source=smoke",
    status: 308,
  },
  {
    location: "/features?language=fr-CA&source=smoke#share-anywhere",
    path: "/quote-link-guide?language=fr-CA&source=smoke",
    status: 308,
  },
  {
    location: "/?language=fr-CA&source=smoke#how-it-works",
    path: "/faster-quote-replies?language=fr-CA&source=smoke",
    status: 308,
  },
  {
    location: "/features?language=fr-CA&source=smoke#reply-drafts",
    path: "/content-studio?language=fr-CA&source=smoke",
    status: 308,
  },
  {
    location: "/demo?language=fr-CA&source=smoke",
    path: "/industries/cleaning?language=fr-CA&source=smoke",
    status: 308,
  },
];

const frenchPublicRoutes = [
  "/",
  "/features",
  "/demo",
  "/pricing",
  "/pilot",
  "/faq",
  "/trust",
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

async function fetchWithTimeout(
  url: URL,
  timeoutMs: number,
  redirect: RequestRedirect = "follow",
  cookieLanguage?: "en" | "fr-CA",
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      headers: {
        ...(cookieLanguage
          ? { cookie: `${INTERFACE_LANGUAGE_COOKIE}=${cookieLanguage}` }
          : {}),
        "user-agent": "BizPilot-public-smoke/1.0",
      },
      redirect,
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
    const response = await fetchWithTimeout(
      url,
      timeoutMs,
      target.location ? "manual" : "follow",
      target.cookieLanguage,
    );
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

    if (target.location && response.headers.get("location") !== target.location) {
      return {
        durationMs,
        error: `expected Location ${JSON.stringify(target.location)}, received ${JSON.stringify(response.headers.get("location"))}`,
        path: target.path,
        pass: false,
        status: response.status,
      };
    }

    if (target.location) {
      return {
        durationMs,
        path: target.path,
        pass: true,
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

    if (
      target.expectedLanguage &&
      !body.includes(`<html lang="${target.expectedLanguage}"`)
    ) {
      return {
        durationMs,
        error: `expected document language ${target.expectedLanguage}`,
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
