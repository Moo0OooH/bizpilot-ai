/**
 * ============================================================
 * File: tests/smoke/public-responsive-smoke.mts
 * Project: BizPilot AI
 * Description: Synthetic retained-route responsive and bilingual contract smoke.
 * Role: Verifies all ten V3 public routes use the shared shell, one localized H1, safe layout markers, and route-specific compact content.
 * Related:
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-page.module.css
 * - tests/smoke/public-browser-interaction-smoke.mts
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Updated the homepage smoke contract for the focused five-section story.
 * - 2026-07-13: Replaced retired V2 and merged-route checks with all ten retained V3 routes in EN and fr-CA.
 * ============================================================
 */

import { getPublicV3Spec, publicV3PrimaryRoutes } from "../../lib/i18n/public-v3-spec.ts";

type Locale = "en" | "fr-CA";

type ResponsiveResult = Readonly<{
  errors: readonly string[];
  path: string;
  pass: boolean;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const DEFAULT_TIMEOUT_MS = 15_000;

function readCliValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) {
    return inline.slice(prefix.length);
  }
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function baseUrl(): URL {
  return new URL(
    readCliValue("base-url") ??
      process.env.BIZPILOT_SMOKE_BASE_URL ??
      DEFAULT_BASE_URL,
  );
}

function timeoutMs(): number {
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

function targetPath(path: string, locale: Locale): string {
  if (locale === "en") {
    return path;
  }
  const url = new URL(path, "https://bizpilot.local");
  url.searchParams.set("language", locale);
  return `${url.pathname}${url.search}`;
}

function targetUrl(origin: URL, path: string): URL {
  return new URL(path, origin);
}

function count(source: string, marker: string): number {
  return source.split(marker).length - 1;
}

function visibleMarkup(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

function routeSpecificErrors(
  path: string,
  html: string,
  spec: ReturnType<typeof getPublicV3Spec>,
): string[] {
  const errors: string[] = [];

  if (path === "/" && count(html, "data-v3-section=") !== 5) {
    errors.push("homepage must render exactly five focused V3 sections");
  }
  if (path === "/features") {
    for (const anchor of ["share-anywhere", "reply-drafts", "focused-by-design"]) {
      if (!html.includes(`id="${anchor}"`)) {
        errors.push(`missing consolidation anchor ${anchor}`);
      }
    }
  }
  if (path === "/demo" && !html.includes('role="tablist"')) {
    errors.push("demo must expose the three-stage tablist");
  }
  if (path === "/pricing") {
    for (const value of spec.pricing.tiers.map((tier) => tier.price)) {
      if (!html.includes(value)) {
        errors.push(`pricing missing ${value}`);
      }
    }
  }
  if (path === "/pilot") {
    if (!html.includes('id="application"')) {
      errors.push("pilot copy-only application anchor missing");
    }
    for (const forbidden of ["mailto:", "<form", "<input", "<textarea"]) {
      if (html.includes(forbidden)) {
        errors.push(`pilot contains forbidden conversion marker ${forbidden}`);
      }
    }
  }
  if (path === "/faq" && count(html, "faqItem") !== 10) {
    errors.push("FAQ must render ten compact disclosures");
  }

  return errors;
}

async function checkRoute(
  origin: URL,
  path: (typeof publicV3PrimaryRoutes)[number],
  locale: Locale,
  requestTimeout: number,
): Promise<ResponsiveResult> {
  const localized = targetPath(path, locale);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeout);

  try {
    const response = await fetch(targetUrl(origin, localized), {
      cache: "no-store",
      headers: { "user-agent": "BizPilot-responsive-smoke/3.0" },
      signal: controller.signal,
    });
    const html = await response.text();
    const visibleHtml = visibleMarkup(html);
    const spec = getPublicV3Spec(locale);
    const errors: string[] = [];

    if (response.status !== 200) {
      errors.push(`expected HTTP 200, received ${response.status}`);
    }
    if (!html.includes(spec.routes[path].hero.title)) {
      errors.push("localized V3 H1 missing");
    }
    if (count(html, "<h1") !== 1) {
      errors.push("route must render exactly one H1");
    }
    if (!html.includes(`<html lang="${locale}"`)) {
      errors.push(`document language is not ${locale}`);
    }
    for (const required of ['id="main-content"', "v3-site-footer", "v3-container"]) {
      if (!html.includes(required)) {
        errors.push(`shared V3 marker missing ${required}`);
      }
    }
    for (const forbidden of ["overflow-x-hidden", "w-screen", "h-screen", "100vh"]) {
      if (visibleHtml.includes(forbidden)) {
        errors.push(`responsive escape hatch found ${forbidden}`);
      }
    }
    if (locale === "fr-CA" && !html.includes("language=fr-CA")) {
      errors.push("French internal-link persistence marker missing");
    }
    errors.push(...routeSpecificErrors(path, visibleHtml, spec));

    return { errors, pass: errors.length === 0, path: localized };
  } catch (error) {
    return {
      errors: [error instanceof Error ? error.message : String(error)],
      pass: false,
      path: localized,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main(): Promise<void> {
  const origin = baseUrl();
  const requestTimeout = timeoutMs();
  const results: ResponsiveResult[] = [];

  console.log(`BizPilot responsive smoke target: ${origin.origin}`);
  console.log(`Routes: ${publicV3PrimaryRoutes.length * 2}`);
  console.log("");

  for (const locale of ["en", "fr-CA"] as const) {
    for (const path of publicV3PrimaryRoutes) {
      const result = await checkRoute(origin, path, locale, requestTimeout);
      results.push(result);
      console.log(`  ${result.path} ... ${result.pass ? "pass" : "FAIL"}`);
      for (const error of result.errors) {
        console.log(`    ${error}`);
      }
    }
  }

  const failures = results.filter((result) => !result.pass);
  console.log("");
  console.log(`Responsive smoke failures: ${failures.length}`);
  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
