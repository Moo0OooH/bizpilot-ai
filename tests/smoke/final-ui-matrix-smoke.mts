/**
 * ============================================================
 * File: tests/smoke/final-ui-matrix-smoke.mts
 * Project: BizPilot AI
 * Description: Final-polish public UI matrix smoke checks.
 * Role: Exercises localized public route metadata, noindex boundaries, sitemap/robots, and safe quote render checks without real data.
 * Related:
 * - lib/seo.ts
 * - tests/smoke/public-responsive-smoke.mts
 * - tests/smoke/quote-route-smoke.mts
 * Author: MoOoH
 * Created: 2026-06-20
 * ============================================================
 */

import { getPolicyCopy, type PolicyPageKey } from "../../lib/i18n/policy-copy.ts";
import {
  getPublicSiteCopy,
} from "../../lib/i18n/public-site-copy.ts";
import {
  publicCanonicalRoutes,
  publicLanguageAlternates,
  publicUrl,
  type PublicCanonicalRoute,
} from "../../lib/seo.ts";

type Locale = "en" | "fr-CA";

type PublicRouteContract = Readonly<{
  h1: (locale: Locale) => string;
  meta: (locale: Locale) => Readonly<{ description: string; title: string }>;
  path: PublicCanonicalRoute;
  rejectFrText?: string;
}>;

type CheckResult = Readonly<{
  detail?: string;
  name: string;
  pass: boolean;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const DEFAULT_TIMEOUT_MS = 15_000;

const viewportMatrix = [
  "320x568",
  "360x800",
  "390x844",
  "430x932",
  "844x390",
  "768x1024",
  "1024x768",
  "1280x720",
  "1366x768",
  "1440x900",
  "1920x1080",
] as const;

const routeContracts: readonly PublicRouteContract[] = [
  {
    h1: (locale) => getPublicSiteCopy(locale).home.hero.title,
    meta: (locale) => getPublicSiteCopy(locale).home.meta,
    path: "/",
    rejectFrText: getPublicSiteCopy("en").home.hero.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).features.title,
    meta: (locale) => getPublicSiteCopy(locale).features.meta,
    path: "/features",
    rejectFrText: getPublicSiteCopy("en").features.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).cleaning.title,
    meta: (locale) => getPublicSiteCopy(locale).cleaning.meta,
    path: "/industries/cleaning",
    rejectFrText: getPublicSiteCopy("en").cleaning.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).trust.title,
    meta: (locale) => getPublicSiteCopy(locale).trust.meta,
    path: "/trust",
    rejectFrText: getPublicSiteCopy("en").trust.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).demo.title,
    meta: (locale) => getPublicSiteCopy(locale).demo.meta,
    path: "/demo",
    rejectFrText: getPublicSiteCopy("en").demo.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).pricing.title,
    meta: (locale) => getPublicSiteCopy(locale).pricing.meta,
    path: "/pricing",
    rejectFrText: getPublicSiteCopy("en").pricing.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).pilot.title,
    meta: (locale) => getPublicSiteCopy(locale).pilot.meta,
    path: "/pilot",
    rejectFrText: getPublicSiteCopy("en").pilot.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).contentStudio.title,
    meta: (locale) => getPublicSiteCopy(locale).contentStudio.meta,
    path: "/content-studio",
    rejectFrText: getPublicSiteCopy("en").contentStudio.title,
  },
  ...(["privacy", "security", "terms"] as const satisfies readonly PolicyPageKey[]).map(
    (key) => ({
      h1: (locale: Locale) => getPolicyCopy(locale)[key].title,
      meta: (locale: Locale) => getPolicyCopy(locale)[key].meta,
      path: `/${key}` as PublicCanonicalRoute,
      rejectFrText: getPolicyCopy("en")[key].title,
    }),
  ),
];

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
  return new URL(readCliValue("base-url") ?? process.env.BIZPILOT_SMOKE_BASE_URL ?? DEFAULT_BASE_URL);
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

function localizedPath(path: PublicCanonicalRoute, locale: Locale): string {
  if (locale === "en") {
    return path;
  }

  const url = new URL(path, "https://example.test");
  url.searchParams.set("language", locale);
  return `${url.pathname}${url.search}`;
}

function toTargetUrl(baseUrl: URL, path: string): URL {
  const normalizedBase = new URL(baseUrl.toString());
  normalizedBase.pathname = "/";
  normalizedBase.search = "";
  normalizedBase.hash = "";
  return new URL(path, normalizedBase);
}

async function fetchText(url: URL, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "user-agent": "BizPilot-final-ui-matrix-smoke/1.0" },
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.status !== 200) {
      throw new Error(`expected HTTP 200, received HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function countOccurrences(value: string, needle: string): number {
  return value.split(needle).length - 1;
}

function decodeHtml(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function headIncludes(html: string, value: string): boolean {
  return decodeHtml(html).includes(value);
}

function checkPublicRoute(
  route: PublicRouteContract,
  locale: Locale,
  html: string,
): CheckResult[] {
  const meta = route.meta(locale);
  const expectedLang = locale === "fr-CA" ? "fr-CA" : "en";
  const expectedCanonical = locale === "fr-CA"
    ? publicUrl(route.path, "fr-CA")
    : publicUrl(route.path, "en");
  const results: CheckResult[] = [];

  results.push({
    detail: route.path,
    name: `${locale} h1`,
    pass: headIncludes(html, route.h1(locale)),
  });
  results.push({
    detail: route.path,
    name: `${locale} one h1`,
    pass: countOccurrences(html, "<h1") === 1,
  });
  results.push({
    detail: route.path,
    name: `${locale} document lang`,
    pass: html.includes(`<html lang="${expectedLang}"`),
  });
  results.push({
    detail: route.path,
    name: `${locale} title metadata`,
    pass: headIncludes(html, `<title>${meta.title}</title>`),
  });
  results.push({
    detail: route.path,
    name: `${locale} description metadata`,
    pass: headIncludes(html, meta.description),
  });
  results.push({
    detail: route.path,
    name: `${locale} canonical metadata`,
    pass: headIncludes(html, expectedCanonical),
  });
  results.push({
    detail: route.path,
    name: `${locale} hreflang metadata`,
    pass:
      headIncludes(html, publicLanguageAlternates(route.path)["en-CA"]) &&
      headIncludes(html, publicLanguageAlternates(route.path)["fr-CA"]) &&
      headIncludes(html, publicLanguageAlternates(route.path)["x-default"]),
  });

  if (locale === "fr-CA" && route.rejectFrText) {
    results.push({
      detail: route.path,
      name: "fr-CA rejects English h1",
      pass: !headIncludes(html, route.rejectFrText),
    });
  }

  results.push({
    detail: route.path,
    name: `${locale} no overflow escape hatch`,
    pass: !html.includes("overflow-x-hidden"),
  });

  return results;
}

function checkAuthRoute(path: string, html: string): CheckResult[] {
  return [
    {
      detail: path,
      name: "auth noindex",
      pass: html.includes("noindex") && html.includes("nofollow"),
    },
    {
      detail: path,
      name: "auth no utility controls",
      pass:
        !html.includes("Theme:") &&
        !html.includes("Homepage language") &&
        !html.includes("language=fr-CA"),
    },
    {
      detail: path,
      name: "auth one h1",
      pass: countOccurrences(html, "<h1") === 1,
    },
  ];
}

function checkExternalLinks(path: string, html: string): CheckResult[] {
  const blankLinks = Array.from(
    html.matchAll(/<a\b(?=[^>]*target="_blank")[^>]*>/g),
  ).map((match) => match[0]);

  return blankLinks.map((tag, index) => ({
    detail: `${path} external link ${index + 1}`,
    name: "external link target/rel",
    pass:
      tag.includes('rel="noopener noreferrer"') &&
      (tag.includes("https://www.priv.gc.ca/") ||
        tag.includes("https://www.cai.gouv.qc.ca/")),
  }));
}

function checkNoInternalNewTabs(path: string, html: string): CheckResult {
  const blankLinks = Array.from(
    html.matchAll(/<a\b(?=[^>]*target="_blank")[^>]*href="([^"]+)"[^>]*>/g),
  ).map((match) => match[1] ?? "");

  return {
    detail: path,
    name: "internal links same tab",
    pass: blankLinks.every((href) => href.startsWith("https://")),
  };
}

function checkSitemapAndRobots(sitemap: string, robots: string): CheckResult[] {
  const results: CheckResult[] = [
    {
      name: "sitemap route count",
      pass: countOccurrences(sitemap, "<url>") === publicCanonicalRoutes.length,
    },
    {
      name: "sitemap localized alternates",
      pass: publicCanonicalRoutes.every((path) =>
        sitemap.includes(publicLanguageAlternates(path)["fr-CA"]),
      ),
    },
    {
      name: "sitemap excludes auth and quote",
      pass: !sitemap.includes("/auth") && !sitemap.includes("/quote"),
    },
    {
      name: "robots excludes private/intake paths",
      pass:
        robots.includes("Disallow: /auth") &&
        robots.includes("Disallow: /dashboard") &&
        robots.includes("Disallow: /quote"),
    },
  ];

  return results;
}

async function maybeCheckQuoteUrl(
  label: string,
  rawUrl: string | undefined,
  timeoutMs: number,
  expectedText: readonly string[],
): Promise<CheckResult[]> {
  if (!rawUrl) {
    return [
      {
        detail: label,
        name: "optional quote fixture skipped",
        pass: true,
      },
    ];
  }

  const html = await fetchText(new URL(rawUrl), timeoutMs);

  return [
    {
      detail: rawUrl,
      name: `${label} quote renders`,
      pass: expectedText.every((text) => headIncludes(html, text)),
    },
    {
      detail: rawUrl,
      name: `${label} quote noindex`,
      pass: html.includes("noindex") && html.includes("nofollow"),
    },
  ];
}

function printResults(results: readonly CheckResult[]): number {
  let failures = 0;

  for (const result of results) {
    if (result.pass) {
      console.log(`  pass ${result.name}${result.detail ? ` (${result.detail})` : ""}`);
    } else {
      failures += 1;
      console.log(`  FAIL ${result.name}${result.detail ? ` (${result.detail})` : ""}`);
    }
  }

  return failures;
}

async function main(): Promise<void> {
  const baseUrl = resolveBaseUrl();
  const timeoutMs = resolveTimeoutMs();
  const results: CheckResult[] = [];

  console.log(`BizPilot final UI matrix target: ${baseUrl.origin}`);
  console.log(`Viewport matrix recorded: ${viewportMatrix.join(", ")}`);
  console.log(`Routes: ${routeContracts.length} public, 3 auth, optional quote fixtures`);
  console.log("");

  for (const route of routeContracts) {
    for (const locale of ["en", "fr-CA"] as const) {
      const html = await fetchText(
        toTargetUrl(baseUrl, localizedPath(route.path, locale)),
        timeoutMs,
      );

      results.push(...checkPublicRoute(route, locale, html));
      if (["/privacy", "/security"].includes(route.path)) {
        results.push(...checkExternalLinks(route.path, html));
      }
      results.push(checkNoInternalNewTabs(route.path, html));
    }
  }

  for (const path of ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"]) {
    const html = await fetchText(toTargetUrl(baseUrl, path), timeoutMs);
    results.push(...checkAuthRoute(path, html));
  }

  results.push(
    ...checkSitemapAndRobots(
      await fetchText(toTargetUrl(baseUrl, "/sitemap.xml"), timeoutMs),
      await fetchText(toTargetUrl(baseUrl, "/robots.txt"), timeoutMs),
    ),
  );

  results.push(
    ...(await maybeCheckQuoteUrl(
      "EN safe",
      readCliValue("en-quote-url") ?? process.env.BIZPILOT_SMOKE_EN_QUOTE_URL,
      timeoutMs,
      ["Quote page unavailable"],
    )),
  );
  results.push(
    ...(await maybeCheckQuoteUrl(
      "fr-CA safe",
      readCliValue("fr-quote-url") ?? process.env.BIZPILOT_SMOKE_FR_QUOTE_URL,
      timeoutMs,
      ["Quel type de nettoyage", "Envoyer la demande"],
    )),
  );

  const failures = printResults(results);

  console.log("");
  console.log(`Final UI matrix failures: ${failures}`);

  if (failures > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Final UI matrix smoke runner error: ${message}`);
  process.exit(1);
});
