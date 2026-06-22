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
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-21: Added light/dark theme matrix, visual markers, and en-XA fallback checks.
 * - 2026-06-21: Added the dedicated FAQ route to localized metadata coverage.
 * - 2026-06-21: Added Cleaning service de-duplication checks across locales and themes.
 * - 2026-06-21: Updated optional quote fixtures to verify active safe GET quote forms.
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
type Theme = "light" | "dark";

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
const themeMatrix = ["light", "dark"] as const satisfies readonly Theme[];
const TEST_PSEUDO_LOCALE = "en-XA";

const routeContracts: readonly PublicRouteContract[] = [
  {
    h1: (locale) => getPublicSiteCopy(locale).home.hero.title,
    meta: (locale) => getPublicSiteCopy(locale).home.meta,
    path: "/",
    rejectFrText: getPublicSiteCopy("en").home.hero.title,
  },
  {
    h1: (locale) => getPublicSiteCopy(locale).faq.title,
    meta: (locale) => getPublicSiteCopy(locale).faq.meta,
    path: "/faq",
    rejectFrText: getPublicSiteCopy("en").faq.title,
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

async function fetchText(
  url: URL,
  timeoutMs: number,
  theme?: Theme,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const headers: Record<string, string> = {
    "user-agent": "BizPilot-final-ui-matrix-smoke/1.0",
  };

  if (theme) {
    headers.cookie = [
      `bizpilot-theme-preference=${theme}`,
      `bizpilot-dashboard-theme=${theme}`,
    ].join("; ");
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers,
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

function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

function checkPublicRoute(
  route: PublicRouteContract,
  locale: Locale,
  theme: Theme,
  html: string,
): CheckResult[] {
  const meta = route.meta(locale);
  const expectedLang = locale === "fr-CA" ? "fr-CA" : "en";
  const expectedCanonical = locale === "fr-CA"
    ? publicUrl(route.path, "fr-CA")
    : publicUrl(route.path, "en");
  const results: CheckResult[] = [];
  const visibleHtml = stripScripts(html);

  results.push({
    detail: route.path,
    name: `${locale} ${theme} h1`,
    pass: headIncludes(html, route.h1(locale)),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} one h1`,
    pass: countOccurrences(html, "<h1") === 1,
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} document lang`,
    pass: html.includes(`<html lang="${expectedLang}"`),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} data-theme`,
    pass:
      html.includes(`data-theme="${theme}"`) &&
      html.includes(`data-theme-preference="${theme}"`),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} title metadata`,
    pass: headIncludes(html, `<title>${meta.title}</title>`),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} description metadata`,
    pass: headIncludes(html, meta.description),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} canonical metadata`,
    pass: headIncludes(html, expectedCanonical),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} hreflang metadata`,
    pass:
      headIncludes(html, publicLanguageAlternates(route.path)["en-CA"]) &&
      headIncludes(html, publicLanguageAlternates(route.path)["fr-CA"]) &&
      headIncludes(html, publicLanguageAlternates(route.path)["x-default"]),
  });

  if (locale === "fr-CA" && route.rejectFrText) {
    results.push({
      detail: route.path,
      name: `fr-CA ${theme} rejects English h1`,
      pass: !headIncludes(html, route.rejectFrText),
    });
  }

  results.push({
    detail: route.path,
    name: `${locale} ${theme} no overflow escape hatch`,
    pass: !html.includes("overflow-x-hidden"),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} no stale header control text`,
    pass: !html.includes("ENFR") && !html.includes("System Light Dark"),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} no missing-copy artifacts`,
    pass:
      !html.includes("MISSING_COPY") &&
      !html.includes("__MISSING") &&
      !html.includes(">undefined<"),
  });
  results.push({
    detail: route.path,
    name: `${locale} ${theme} no pseudolocale exposed`,
    pass: !visibleHtml.includes(TEST_PSEUDO_LOCALE),
  });

  if (route.path === "/industries/cleaning") {
    const serviceTitles = locale === "fr-CA"
      ? [
          "Nettoyage résidentiel",
          "Nettoyage en profondeur",
          "Nettoyage avant/après déménagement",
          "Nettoyage de bureaux",
          "Nettoyage entre séjours Airbnb",
          "Nettoyage après travaux",
        ]
      : [
          "Residential cleaning",
          "Deep cleaning",
          "Move-in / move-out",
          "Office cleaning",
          "Airbnb turnover",
          "Post-construction cleaning",
        ];

    results.push({
      detail: route.path,
      name: `${locale} ${theme} cleaning has six compact cards`,
      pass: countOccurrences(visibleHtml, "cleaning-service-card") === 6,
    });
    results.push({
      detail: route.path,
      name: `${locale} ${theme} cleaning has desktop tabs and mobile accordion`,
      pass:
        visibleHtml.includes("cleaning-detail-tabs") &&
        visibleHtml.includes('role="tablist"') &&
        visibleHtml.includes("cleaning-detail-mobile") &&
        visibleHtml.includes("<details"),
    });
    results.push({
      detail: route.path,
      name: `${locale} ${theme} cleaning services are not duplicated`,
      pass: serviceTitles.every((title) => countOccurrences(visibleHtml, title) <= 1),
    });
    results.push({
      detail: route.path,
      name: `${locale} ${theme} cleaning excludes small commercial`,
      pass:
        !visibleHtml.includes("Small commercial cleaning") &&
        !visibleHtml.includes("Petit nettoyage commercial"),
    });
  }

  if (route.path === "/pricing") {
    results.push({
      detail: route.path,
      name: `${locale} ${theme} pricing has three plan cards`,
      pass: countOccurrences(visibleHtml, "public-plan-card flex") === 3,
    });
    results.push({
      detail: route.path,
      name: `${locale} ${theme} pricing CTAs anchored`,
      pass: countOccurrences(visibleHtml, "public-plan-card-cta mt-auto w-full") === 3,
    });
  }

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
        !html.includes("language=fr-CA") &&
        !html.includes("ENFR") &&
        !html.includes("System Light Dark"),
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
      name: "sitemap excludes test pseudolocale",
      pass: !sitemap.includes(TEST_PSEUDO_LOCALE),
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
  const readableHtml = stripScripts(html);

  return [
    {
      detail: rawUrl,
      name: `${label} quote renders`,
      pass: expectedText.every((text) => headIncludes(readableHtml, text)),
    },
    {
      detail: rawUrl,
      name: `${label} quote noindex`,
      pass: html.includes("noindex") && html.includes("nofollow"),
    },
    {
      detail: rawUrl,
      name: `${label} quote hides honeypot label`,
      pass: !headIncludes(readableHtml, "Company website"),
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
  console.log(`Theme matrix recorded: ${themeMatrix.join(", ")}`);
  console.log(`Pseudolocale recorded as test-only: ${TEST_PSEUDO_LOCALE}`);
  console.log(`Routes: ${routeContracts.length} public, 3 auth, optional quote fixtures`);
  console.log("");

  for (const route of routeContracts) {
    for (const locale of ["en", "fr-CA"] as const) {
      for (const theme of themeMatrix) {
        const html = await fetchText(
          toTargetUrl(baseUrl, localizedPath(route.path, locale)),
          timeoutMs,
          theme,
        );

        results.push(...checkPublicRoute(route, locale, theme, html));
        if (["/privacy", "/security"].includes(route.path)) {
          results.push(...checkExternalLinks(route.path, html));
        }
        results.push(checkNoInternalNewTabs(route.path, html));
      }
    }
  }

  const pseudoFallbackHtml = await fetchText(
    toTargetUrl(baseUrl, `/?language=${TEST_PSEUDO_LOCALE}`),
    timeoutMs,
    "light",
  );
  results.push({
    detail: `/?language=${TEST_PSEUDO_LOCALE}`,
    name: "test pseudolocale falls back to production English",
    pass:
      pseudoFallbackHtml.includes('<html lang="en"') &&
      headIncludes(pseudoFallbackHtml, getPublicSiteCopy("en").home.hero.title) &&
      !stripScripts(pseudoFallbackHtml).includes(TEST_PSEUDO_LOCALE),
  });

  for (const path of ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"]) {
    const html = await fetchText(toTargetUrl(baseUrl, path), timeoutMs, "light");
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
      [
        "What kind of cleaning",
        "Send quote request",
        "By sending this request",
      ],
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
