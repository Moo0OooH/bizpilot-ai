/**
 * ============================================================
 * File: tests/unit/public-visual-stability-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for the consolidated Website V3 visual system.
 * Role: Protects shared rendering, responsive safety, motion accessibility, safe pilot conversion, and semantic light/dark tokens.
 * Related:
 * - components/public/public-v3-home.tsx
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-page.module.css
 * - tests/smoke/public-browser-interaction-smoke.mts
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added guards for open indexed policy documents and their responsive editorial stylesheet.
 * - 2026-07-16: Replaced the seven-section guard with the focused five-section home contract.
 * - 2026-07-14: Added final-polish guards for balanced desktop grids and legible card icons.
 * - 2026-07-13: Accepted an animation-free homepage while retaining explicit reduced-motion handling on shared pages.
 * - 2026-07-13: Replaced retired V2 guards with retained-route V3 consolidation, redirect, and copy-only pilot contracts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

const retainedMarketingRoutes = [
  "app/features/page.tsx",
  "app/demo/page.tsx",
  "app/pricing/page.tsx",
  "app/pilot/page.tsx",
  "app/faq/page.tsx",
  "app/trust/page.tsx",
] as const;

const publicSources = [
  source("app/globals.css"),
  source("components/public/marketing-ui.tsx"),
  source("components/public/public-v3-home.tsx"),
  source("components/public/public-v3-home.module.css"),
  source("components/public/public-v3-page.tsx"),
  source("components/public/public-v3-page.module.css"),
  source("components/public/public-v3-demo.tsx"),
  source("components/public/public-v3-pilot-request.tsx"),
  source("components/public/policy-page.tsx"),
  source("components/public/policy-page.module.css"),
  ...retainedMarketingRoutes.map(source),
  ...["privacy", "security", "terms"].map((route) => source(`app/${route}/page.tsx`)),
].join("\n");

describe("Website V3 visual stability source contracts", () => {
  it("keeps the consolidated V3 token and primitive foundation available", () => {
    const globals = source("app/globals.css");
    const marketingUi = source("components/public/marketing-ui.tsx");

    for (const primitive of [
      "--v3-content-max",
      "--v3-reading-max",
      "--v3-section-space",
      "--v3-type-display",
      "--v3-radius-sm",
      "--v3-shadow-card",
      ".v3-container",
      ".v3-card",
      ".v3-button",
      ".v3-product-frame",
    ]) {
      assert.equal(globals.includes(primitive), true, primitive);
    }

    assert.equal(marketingUi.includes("MarketingProductFrame"), true);
    assert.equal(marketingUi.includes("v3-site-footer"), true);
  });

  it("keeps all retained public surfaces free of viewport and nested-scroll traps", () => {
    for (const forbidden of [
      "overflow-x-hidden",
      "width: 100vw",
      "w-screen",
      "min-h-screen",
      "h-screen",
      "100vh",
    ]) {
      assert.equal(publicSources.includes(forbidden), false, forbidden);
    }

    assert.equal(source("app/globals.css").includes("overflow-wrap: anywhere"), true);
    assert.equal(
      source("components/public/marketing-compact-menu.tsx").includes("overflow-y-auto"),
      true,
    );
  });

  it("keeps exactly one measurable five-section homepage story", () => {
    const homepage = source("components/public/public-v3-home.tsx");
    const pageRoute = source("app/page.tsx");

    for (const key of [
      "hero",
      "problem",
      "workflow",
      "cleaning-demo",
      "final-cta",
    ]) {
      assert.equal(homepage.includes(`data-v3-section="${key}"`), true, key);
    }

    assert.equal((homepage.match(/data-v3-section=/g) ?? []).length, 5);
    assert.equal(homepage.includes("workflowOutcomeGrid"), true);
    assert.equal(homepage.includes("finalAssurances"), true);
    assert.equal(pageRoute.includes("PublicV3Home"), true);
    assert.equal(pageRoute.includes("buildHomeJsonLd(language)"), true);
  });

  it("keeps all retained product routes on one shared V3 renderer", () => {
    for (const route of retainedMarketingRoutes) {
      const routeSource = source(route);
      assert.equal(routeSource.includes("PublicV3Page"), true, route);
      assert.equal(routeSource.includes("getPublicV3Spec"), true, route);
      assert.equal(routeSource.includes("buildPublicMetadata"), true, route);
      assert.equal(routeSource.includes("getPublicV2Copy"), false, route);
    }

    const sharedPage = source("components/public/public-v3-page.tsx");
    for (const required of [
      "MarketingHeader",
      "MarketingFooter",
      "buildBreadcrumbJsonLd",
      "FeaturesContent",
      "DemoContent",
      "PricingContent",
      "PilotContent",
      "FaqContent",
      "TrustContent",
    ]) {
      assert.equal(sharedPage.includes(required), true, required);
    }
  });

  it("keeps every policy section visible in an indexed reading layout", () => {
    const policyPage = source("components/public/policy-page.tsx");
    const policyCss = source("components/public/policy-page.module.css");

    assert.equal(policyPage.includes("copy.sections.map"), true);
    assert.equal(policyPage.includes("policy-section-${index + 1}"), true);
    assert.equal(policyPage.includes("<details"), false);
    assert.equal(policyCss.includes(".readingLayout"), true);
    assert.equal(policyCss.includes(".contentsCard"), true);
    assert.equal(policyCss.includes(".policySections"), true);
  });

  it("keeps the pilot conversion copy-only and non-submitting", () => {
    const pilot = source("components/public/public-v3-pilot-request.tsx");

    assert.equal(pilot.includes("navigator.clipboard.writeText"), true);
    assert.equal(pilot.includes('aria-live="polite"'), true);
    assert.equal(pilot.includes("selectTemplate"), true);
    for (const forbidden of ["mailto:", "fetch(", "XMLHttpRequest", "<form", "<input"] ) {
      assert.equal(pilot.includes(forbidden), false, forbidden);
    }
  });

  it("respects reduced motion across the homepage and retained pages", () => {
    const homeCss = source("components/public/public-v3-home.module.css");
    const pageCss = source("components/public/public-v3-page.module.css");

    assert.equal(homeCss.includes("animation:"), false);
    assert.equal(pageCss.includes("@media (prefers-reduced-motion: reduce)"), true);
    assert.equal(`${homeCss}\n${pageCss}`.includes("animation: infinite"), false);
  });

  it("keeps light and dark surfaces on semantic design tokens", () => {
    for (const required of [
      "var(--surface)",
      "var(--surface-interactive)",
      "var(--text-strong)",
      "var(--text-default)",
      "var(--text-muted)",
      "var(--border-default)",
      "var(--primary)",
      "var(--accent)",
    ]) {
      assert.equal(publicSources.includes(required), true, required);
    }
  });

  it("keeps flagship features and proof-first trust content balanced with legible icons", () => {
    const pageCss = source("components/public/public-v3-page.module.css");

    assert.equal(
      pageCss.includes(".featureGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); }"),
      true,
    );
    assert.equal(
      pageCss.includes(".trustGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }"),
      true,
    );
    assert.equal(
      pageCss.includes(".trustSequence { grid-template-columns: repeat(4, minmax(0, 1fr)); }"),
      true,
    );
    assert.equal(pageCss.includes(".trustCard:first-child { grid-row: span 2; }"), false);
    assert.equal(pageCss.includes(".cardIcon svg"), true);
    assert.equal(pageCss.includes(".trustCard:nth-child(3n + 1) .cardIcon"), true);
    assert.equal(pageCss.includes("text-wrap: balance"), true);
    assert.equal(pageCss.includes("text-wrap: pretty"), true);
  });
});
