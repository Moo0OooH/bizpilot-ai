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
 * Last Updated: 2026-06-25
 * Change Log:
 * - 2026-06-18: Created route-level responsive contract smoke for public hardening.
 * - 2026-06-20: Added fr-CA homepage coverage for bilingual hero stability.
 * - 2026-06-20: Locked balanced public grid classes into route-level smoke coverage.
 * - 2026-06-21: Locked canonical four-step grid classes into smoke coverage.
 * - 2026-06-21: Added fr-CA hero/pricing parity markers.
 * - 2026-06-21: Locked cleaning service grid and detail panel responsive markers.
 * - 2026-06-21: Added homepage mini FAQ and dedicated FAQ route smoke coverage.
 * - 2026-06-21: Added Cleaning service de-duplication and small-commercial smoke guards.
 * - 2026-06-25: Updated Cleaning checks for service cards plus shared detail selector markup.
 * - 2026-06-25: Locked Cleaning to one active detail panel instead of duplicated desktop/mobile details.
 * ============================================================
 */

type RouteContract = Readonly<{
  h1: string;
  maxOccurrences?: readonly Readonly<{ max: number; text: string }>[];
  mustContain?: readonly string[];
  mustNotContain?: readonly string[];
  path: string;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const TIMEOUT_MS = 15_000;

const routes: readonly RouteContract[] = [
  {
    h1: "Never lose a quote request in the chaos.",
    maxOccurrences: [
      {
        max: 3,
        text: "<details",
      },
    ],
    mustContain: [
      "href=\"/demo\"",
      "href=\"/faq\"",
      "homepage-demo-grid",
      "homepage-use-case-grid",
      "THE CHAOS",
      "THE CLARITY",
      "Smart lead queue",
      "Review draft",
      "Founder-led pilot. Approval required. No auto-send.",
      "No auto-send",
    ],
    mustNotContain: ["homepage-workflow-grid"],
    path: "/",
  },
  {
    h1: "Ne perdez jamais une demande dans le chaos.",
    maxOccurrences: [
      {
        max: 3,
        text: "<details",
      },
    ],
    mustContain: [
      "href=\"/demo\"",
      "href=\"/faq\"",
      "homepage-demo-grid",
      "homepage-use-case-grid",
      "LE CHAOS",
      "LA CLARTÉ",
      "File de prospects intelligente",
      "Réviser le brouillon",
      "Projet pilote guidé. Approbation requise. Aucun envoi automatique.",
      "Aucun envoi automatique",
    ],
    mustNotContain: [
      "Confidentialite",
      "Securite",
      "Demo par onglets",
      "demande realiste",
      "Le systeme",
      "Le proprietaire",
      "Aucun prix invente",
      "Pret a reviser",
      "Leads pour le nettoyage",
      "Nettoyage de départ",
      "révisé par le propriétaire",
      "espace propriétaire",
      "homepage-workflow-grid",
    ],
    path: "/?language=fr-CA",
  },
  {
    h1: "Questions cleaning business owners ask before joining.",
    mustContain: [
      "public-faq-section",
      "public-faq-grid",
      "Pilot basics",
      "AI and business control",
    ],
    path: "/faq",
  },
  {
    h1: "Questions que les entreprises de nettoyage posent avant de participer.",
    mustContain: [
      "public-faq-section",
      "public-faq-grid",
      "Bases du projet pilote",
      "IA et contrôle par l'entreprise",
    ],
    path: "/faq?language=fr-CA",
  },
  {
    h1: "A simple system to manage cleaning quote requests faster.",
    mustContain: [
      "Product proof",
      "Roadmap",
      "Manual copy/send",
      "supporting-four-grid",
      "supporting-six-grid",
    ],
    path: "/features",
  },
  {
    h1: "Lead recovery software for cleaning businesses.",
    mustContain: [
      "Example request",
      "Move-out cleaning",
      "Needs reply",
      "cleaning-service-grid",
      "cleaning-service-card",
      "cleaning-detail-tabs",
      "cleaning-tab-button",
      "cleaning-detail-panel",
      "Missing details BizPilot can help ask for",
    ],
    mustNotContain: ["Small commercial cleaning", "Commercial and specialist"],
    path: "/industries/cleaning",
  },
  {
    h1: "Récupération des demandes pour entreprises de nettoyage.",
    mustContain: [
      "Exemple de demande",
      "À répondre",
      "cleaning-service-grid",
      "cleaning-service-card",
      "cleaning-detail-tabs",
      "cleaning-tab-button",
      "cleaning-detail-panel",
      "Détails manquants que BizPilot peut aider à demander",
    ],
    mustNotContain: ["Petit nettoyage commercial", "Commercial et spécialisé"],
    path: "/industries/cleaning?language=fr-CA",
  },
  {
    h1: "Built for business control and trust.",
    mustContain: [
      "Read privacy",
      "Read security",
      "Pilot readiness notes",
      "supporting-three-grid",
    ],
    path: "/trust",
  },
  {
    h1: "See how BizPilot handles a cleaning quote request.",
    mustContain: [
      "Request arrives.",
      "You review, copy, and send manually.",
      "No invented price",
    ],
    path: "/demo",
  },
  {
    h1: "Simple pilot pricing for cleaning businesses.",
    mustContain: [
      "public-pricing-grid",
      "public-pricing-hero-cta",
      "public-plan-card",
      "$149 setup",
      "$49/month",
      "$199 setup",
      "$79/month",
      "supporting-three-grid",
    ],
    path: "/pricing",
  },
  {
    h1: "Tarifs pilotes simples pour le nettoyage.",
    mustContain: [
      "public-pricing-grid",
      "public-pricing-hero-cta",
      "public-plan-card",
      "Entreprises 1 à 5",
      "Projet pilote",
      "Facturation après approbation",
      "$149 setup",
      "$49/month",
      "$199 setup",
      "$79/month",
      "supporting-three-grid",
    ],
    path: "/pricing?language=fr-CA",
  },
  {
    h1: "Help shape BizPilot around real cleaning work.",
    mustContain: [
      "Pilot requests are being prepared.",
      "Copy pilot request template",
      "Preview the six application questions",
    ],
    path: "/pilot",
  },
  {
    h1: "Future Content Studio for local business growth.",
    mustContain: ["Roadmap", "business before publishing", "supporting-six-grid"],
    path: "/content-studio",
  },
  {
    h1: "Privacy rules for careful quote recovery.",
    mustContain: ["Plain-language summary"],
    path: "/privacy",
  },
  {
    h1: "Règles de confidentialité pour la récupération des soumissions.",
    mustContain: ["Résumé simple", "Avis de confidentialité"],
    mustNotContain: ["Regles", "confidentialite", "recuperation"],
    path: "/privacy?language=fr-CA",
  },
  {
    h1: "Security boundaries before real pilot data.",
    mustContain: ["Plain-language summary"],
    path: "/security",
  },
  {
    h1: "Frontières de sécurité avant les données réelles.",
    mustContain: ["Résumé simple", "Posture de sécurité"],
    mustNotContain: ["Frontieres", "securite", "donnees reelles"],
    path: "/security?language=fr-CA",
  },
  {
    h1: "Clear founder-pilot terms, no hidden automation.",
    mustContain: ["$149 setup", "$79/month", "Manual billing only"],
    path: "/terms",
  },
  {
    h1: "Conditions claires, sans automatisation cachée.",
    mustContain: ["Résumé simple", "$149 setup", "$79/month"],
    mustNotContain: ["automation cachee", "donnees reelles", "proprietaire"],
    path: "/terms?language=fr-CA",
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

function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
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
  const visibleHtml = stripScripts(html);

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

  for (const rejected of route.mustNotContain ?? []) {
    if (html.includes(rejected)) {
      failures.push(`unexpected text found ${JSON.stringify(rejected)}`);
    }
  }

  for (const item of route.maxOccurrences ?? []) {
    const count = countOccurrences(visibleHtml, item.text);
    if (count > item.max) {
      failures.push(
        `expected ${JSON.stringify(item.text)} at most ${item.max} time(s), found ${count}`,
      );
    }
  }

  for (const stale of ["Start free recovery", "Start Join founder pilot"]) {
    if (html.includes(stale)) {
      failures.push(`stale CTA found: ${stale}`);
    }
  }

  for (const stale of ["ENFR", "System Light Dark"]) {
    if (html.includes(stale)) {
      failures.push(`stale header control text found: ${stale}`);
    }
  }

  for (const artifact of ["MISSING_COPY", "__MISSING", ">undefined<"]) {
    if (html.includes(artifact)) {
      failures.push(`missing-copy artifact found: ${artifact}`);
    }
  }

  for (const artifact of [
    "Confidentialite",
    "Securite",
    "Demo par onglets",
    "Aucun prix invente",
    "Pret a reviser",
  ]) {
    if (html.includes(artifact)) {
      failures.push(`public acceptance artifact found: ${artifact}`);
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
