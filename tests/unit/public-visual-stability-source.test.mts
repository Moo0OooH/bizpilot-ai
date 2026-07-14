/**
 * ============================================================
 * File: tests/unit/public-visual-stability-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for the public V2 visual system.
 * Role: Protects responsive primitives, shared page rendering, honest product-scene hooks, motion accessibility, and viewport safety.
 * Related:
 * - components/public/bizpilot-v2-home.tsx
 * - components/public/bizpilot-v2-home.module.css
 * - components/public/bizpilot-v2-page.tsx
 * - components/public/marketing-compact-menu.tsx
 * - tests/smoke/public-browser-interaction-smoke.mts
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Replaced the obsolete nested-scroll exception with the measured no-internal-scroll compact-menu contract.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

const migratedRouteFiles = [
  "app/features/page.tsx",
  "app/industries/cleaning/page.tsx",
  "app/comparison/page.tsx",
  "app/trust/page.tsx",
  "app/demo/page.tsx",
  "app/pricing/page.tsx",
  "app/faq/page.tsx",
] as const;

const publicRouteFiles = [
  "app/page.tsx",
  ...migratedRouteFiles,
  "app/pilot/page.tsx",
  "app/content-studio/page.tsx",
  "app/quote-link-guide/page.tsx",
  "app/faster-quote-replies/page.tsx",
  "app/privacy/page.tsx",
  "app/security/page.tsx",
  "app/terms/page.tsx",
] as const;

describe("public V2 visual stability source contracts", () => {
  it("keeps the canonical responsive primitive foundation available", () => {
    const globals = source("app/globals.css");
    const marketingUi = source("components/public/marketing-ui.tsx");

    for (const primitive of [
      ".bp-page",
      ".bp-container",
      ".bp-container-wide",
      ".bp-container-narrow",
      ".bp-section",
      ".bp-section-tight",
      ".bp-section-hero",
      ".bp-grid-three",
      ".bp-grid-two",
      ".bp-display",
      ".bp-page-title",
      ".bp-section-title",
      ".bp-card-title",
      ".bp-body",
      ".bp-button-row",
      ".marketing-page-hero",
      ".marketing-page-hero-with-visual",
      ".marketing-page-hero-proof",
      ".marketing-page-hero-panel",
    ]) {
      assert.equal(
        globals.includes(primitive),
        true,
        `Missing canonical public primitive ${primitive}.`,
      );
    }

    assert.equal(marketingUi.includes("bp-container public-container"), true);
    assert.equal(marketingUi.includes("bp-container-wide mx-auto"), true);
  });

  it("keeps public surfaces free of viewport-width and nested-scroll traps", () => {
    const publicSources = [
      source("app/globals.css"),
      source("components/public/marketing-ui.tsx"),
      source("components/public/bizpilot-v2-home.tsx"),
      source("components/public/bizpilot-v2-home.module.css"),
      source("components/public/bizpilot-v2-page.tsx"),
      ...publicRouteFiles.map((path) => source(path)),
    ].join("\n");

    for (const forbidden of [
      "overflow-x-hidden",
      "width: 100vw",
      "w-screen",
      "min-h-screen",
      "h-screen",
      "100vh",
      "max-h-[18rem] overflow-auto",
      "overflow-y-auto",
    ]) {
      assert.equal(
        publicSources.includes(forbidden),
        false,
        `Public V2 should not contain viewport or nested-scroll trap ${forbidden}.`,
      );
    }

    assert.equal(source("app/globals.css").includes("overflow-wrap: anywhere"), true);
    assert.equal(
      source("components/public/marketing-compact-menu.tsx").includes("overflow-y-auto"),
      false,
      "The compact navigation menu must not restore a first-viewport nested scroller.",
    );
  });

  it("keeps one responsive V2 homepage product story with measurable hooks", () => {
    const homepage = source("components/public/bizpilot-v2-home.tsx");
    const pageRoute = source("app/page.tsx");
    const css = source("components/public/bizpilot-v2-home.module.css");

    for (const required of [
      "homepage-hero-section",
      "homepage-hero-stage",
      "homepage-hero-actions",
      "homepage-hero-proof-rail",
      "homepage-hero-mockup",
      "homepage-product-scene",
      "homepage-problem-section",
      "homepage-demo-grid",
      "ProductScene",
      "copy.placements.map",
      "copy.workspace.fields.map",
      "copy.workspace.actions.map",
    ]) {
      assert.equal(
        homepage.includes(required),
        true,
        `V2 homepage visual hook missing ${required}.`,
      );
    }

    assert.equal(pageRoute.includes("<BizPilotV2Home copy={copy} language={language} />"), true);
    assert.equal(pageRoute.includes("buildHomeJsonLd(language)"), true);
    assert.equal(css.includes("@media (min-width: 390px)"), true);
    assert.equal(css.includes("@media (min-width: 720px)"), true);
    assert.equal(css.includes("@media (min-width: 1020px)"), true);
    assert.equal(css.includes("@media (max-width: 359px)"), true);
  });

  it("respects reduced-motion preferences while keeping motion product-led", () => {
    const css = source("components/public/bizpilot-v2-home.module.css");

    assert.equal(css.includes("@media (prefers-reduced-motion: no-preference)"), true);
    assert.equal(css.includes("animation: scene-enter"), true);
    assert.equal(css.includes("animation: placement-pulse"), true);
    assert.equal(css.includes("animation: draft-glow"), true);
    assert.equal(css.includes("animation: infinite"), false);
    assert.equal(css.includes("animation-duration: 0.01ms"), false);
  });

  it("keeps migrated routes on one shared V2 page renderer", () => {
    for (const route of migratedRouteFiles) {
      const routeSource = source(route);
      assert.equal(
        routeSource.includes("BizPilotV2Page"),
        true,
        `${route} should use the shared V2 renderer.`,
      );
      assert.equal(
        routeSource.includes("getPublicV2Copy"),
        true,
        `${route} should read the V2 bilingual dictionary.`,
      );
      assert.equal(
        routeSource.includes("buildPublicMetadata"),
        true,
        `${route} should keep localized canonical metadata.`,
      );
    }

    const sharedPage = source("components/public/bizpilot-v2-page.tsx");
    for (const required of [
      "bp-page public-site",
      "bp-section-tight",
      "MarketingPageHero",
      "MarketingHeader",
      "MarketingFooter",
      "buildBreadcrumbJsonLd",
      "buildFaqPageJsonLd",
    ]) {
      assert.equal(
        sharedPage.includes(required),
        true,
        `Shared V2 page contract missing ${required}.`,
      );
    }
  });

  it("preserves the manual pilot conversion path under the V2 message", () => {
    const pilot = source("app/pilot/page.tsx");
    const template = source("components/public/pilot-request-template-card.tsx");

    assert.equal(pilot.includes("getPublicV2Copy"), true);
    assert.equal(pilot.includes("PilotRequestTemplateCard"), true);
    assert.equal(pilot.includes('id="pilot-request-template"'), true);
    assert.equal(pilot.includes('href: "#pilot-request-template"'), true);
    assert.equal(template.includes("mailto:?subject="), true);
    assert.equal(template.includes("navigator.clipboard"), true);
    assert.equal(template.includes("trackPublicEvent(\"pilot_template_copy\")"), true);
  });

  it("keeps light and dark surfaces on semantic design tokens", () => {
    const publicSources = [
      source("components/public/bizpilot-v2-home.module.css"),
      source("components/public/bizpilot-v2-page.tsx"),
    ].join("\n");

    for (const required of [
      "var(--surface)",
      "var(--surface-interactive)",
      "var(--text-strong)",
      "var(--text-default)",
      "var(--text-muted)",
      "var(--border-default)",
      "var(--primary)",
      "var(--accent)",
      "var(--success)",
      "var(--warning)",
    ]) {
      assert.equal(
        publicSources.includes(required),
        true,
        `V2 should use semantic token ${required}.`,
      );
    }
  });
});
