/**
 * ============================================================
 * File: tests/smoke/public-responsive-smoke.mts
 * Project: BizPilot AI
 * Description: Public responsive contract smoke checks for local or production URLs.
 * Role: Verifies public-route copy, route hierarchy, duplicate-price fixes, and stale responsive-risk markers.
 * Related:
 * - docs/product/BIZPILOT_RESPONSIVE_LAYOUT_AND_DEVICE_STANDARD_v1.0.md
 * - docs/readiness/BIZPILOT_PUBLIC_SITE_VISUAL_AUDIT_2026-06-18.md
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-06-18: Created route-level responsive contract smoke for public hardening.
 * ============================================================
 */

type RouteContract = Readonly<{
  h1: string;
  mustContain?: readonly string[];
  path: string;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const TIMEOUT_MS = 15_000;

const routes: readonly RouteContract[] = [
  {
    h1: "Stop losing cleaning quote requests to slow replies.",
    mustContain: ["href=\"/demo\"", "No auto-send", "Owner-reviewed AI drafts"],
    path: "/",
  },
  {
    h1: "A simple system to capture, organize, and reply to cleaning leads faster.",
    mustContain: ["Product proof", "Roadmap", "Manual copy/send"],
    path: "/features",
  },
  {
    h1: "Lead recovery software for cleaning businesses.",
    mustContain: ["Example request", "Move-out cleaning", "Needs reply"],
    path: "/industries/cleaning",
  },
  {
    h1: "Built for owner control and trust.",
    mustContain: ["Read privacy", "Read security", "Technical readiness notes"],
    path: "/trust",
  },
  {
    h1: "See how BizPilot handles a cleaning quote request.",
    mustContain: ["Request arrives.", "Manual send + guardrails.", "No invented price"],
    path: "/demo",
  },
  {
    h1: "Simple pilot pricing for cleaning businesses.",
    mustContain: ["$149 setup", "$49/month", "$199 setup", "$79/month"],
    path: "/pricing",
  },
  {
    h1: "Join the BizPilot founder pilot.",
    mustContain: ["Preview only", "disabled", "Request email template"],
    path: "/pilot",
  },
  {
    h1: "Future Content Studio for local business growth.",
    mustContain: ["Roadmap", "owner before publishing"],
    path: "/content-studio",
  },
  {
    h1: "Privacy rules for careful quote recovery.",
    mustContain: ["Plain-language summary"],
    path: "/privacy",
  },
  {
    h1: "Security boundaries before real pilot data.",
    mustContain: ["Plain-language summary"],
    path: "/security",
  },
  {
    h1: "Clear founder-pilot terms, no hidden automation.",
    mustContain: ["$149 setup", "$79/month", "Manual billing only"],
    path: "/terms",
  },
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

function countOccurrences(value: string, needle: string): number {
  return value.split(needle).length - 1;
}

async function fetchHtml(url: URL): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "user-agent": "BizPilot-responsive-smoke/1.0" },
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

function assertContract(route: RouteContract, html: string): string[] {
  const failures: string[] = [];

  if (!html.includes(route.h1)) {
    failures.push(`missing H1 text ${JSON.stringify(route.h1)}`);
  }

  const h1Count = countOccurrences(html, "<h1");
  if (h1Count !== 1) {
    failures.push(`expected exactly one h1, found ${h1Count}`);
  }

  for (const expected of route.mustContain ?? []) {
    if (!html.includes(expected)) {
      failures.push(`missing expected text ${JSON.stringify(expected)}`);
    }
  }

  for (const stale of ["Start free recovery", "Start Join founder pilot"]) {
    if (html.includes(stale)) {
      failures.push(`stale CTA found: ${stale}`);
    }
  }

  if (route.path !== "/demo" && html.includes("Quote Recovery Command Center")) {
    failures.push("stale command-center public framing found");
  }

  if (route.path === "/pricing") {
    for (const price of ["$49/month", "$79/month"]) {
      const count = countOccurrences(html, price);
      if (count < 1) {
        failures.push(`expected ${price} on pricing page`);
      }
    }
  }

  if (html.includes("overflow-x-hidden")) {
    failures.push("public route still renders overflow-x-hidden");
  }

  return failures;
}

async function main(): Promise<void> {
  const baseUrl = resolveBaseUrl();
  let failures = 0;

  console.log(`BizPilot responsive smoke target: ${baseUrl.origin}`);
  console.log(`Routes: ${routes.length}`);
  console.log("");

  for (const route of routes) {
    const url = new URL(route.path, baseUrl);
    process.stdout.write(`  ${route.path} ... `);

    try {
      const html = await fetchHtml(url);
      const routeFailures = assertContract(route, html);
      if (routeFailures.length > 0) {
        failures += routeFailures.length;
        console.log("FAIL");
        for (const failure of routeFailures) {
          console.log(`    ${failure}`);
        }
      } else {
        console.log("pass");
      }
    } catch (error) {
      failures += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.log("FAIL");
      console.log(`    ${message}`);
    }
  }

  console.log("");
  console.log(`Responsive smoke failures: ${failures}`);

  if (failures > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Responsive smoke runner error: ${message}`);
  process.exit(1);
});
