/**
 * ============================================================
 * File: tests/unit/public-visual-stability-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for public visual stability before dashboard work.
 * Role: Protects public layout, theme menu sizing, and EN/fr-CA stability contracts without touching data flows.
 * Related:
 * - app/globals.css
 * - components/public/marketing-ui.tsx
 * - components/public/marketing-compact-menu.tsx
 * - components/ui/theme-preference-control.tsx
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-06-25
 * Change Log:
 * - 2026-06-21: Added homepage demo numbering regression coverage.
 * - 2026-06-21: Added canonical public responsive-grid regression coverage.
 * - 2026-06-21: Added homepage workflow de-duplication coverage.
 * - 2026-06-21: Added multilingual pricing-card action alignment contracts.
 * - 2026-06-21: Added public dark-theme callout contrast contracts.
 * - 2026-06-21: Added localization-aware copy role and cleaning detail layout contracts.
 * - 2026-06-21: Locked pricing-card container queries for compact multilingual actions.
 * - 2026-06-21: Locked public amber utility mappings for dark-theme guardrails.
 * - 2026-06-21: Locked hydration-stable theme trigger icon switching.
 * - 2026-06-21: Added guards against duplicated Cleaning service detail cards.
 * - 2026-06-21: Updated homepage hero rhythm guardrails for CSS-owned type and compact mockup sizing.
 * - 2026-06-25: Locked the canonical bp responsive primitive foundation.
 * - 2026-06-25: Updated homepage hero rhythm guardrails for the final balanced fold.
 * - 2026-06-25: Updated Cleaning guards for six service detail entries and one shared selector.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

const publicRouteFiles = [
  "app/page.tsx",
  "app/features/page.tsx",
  "app/industries/cleaning/page.tsx",
  "app/trust/page.tsx",
  "app/demo/page.tsx",
  "app/pricing/page.tsx",
  "app/pilot/page.tsx",
  "app/content-studio/page.tsx",
  "app/privacy/page.tsx",
  "app/security/page.tsx",
  "app/terms/page.tsx",
] as const;

describe("public visual stability source contracts", () => {
  it("keeps the canonical bp responsive primitive foundation available", () => {
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
      ".bp-hero-grid",
      ".bp-grid-six",
      ".bp-grid-three",
      ".bp-grid-two",
      ".bp-pricing-grid",
      ".bp-trust-grid",
      ".bp-display",
      ".bp-page-title",
      ".bp-section-title",
      ".bp-card-title",
      ".bp-body",
      ".bp-meta",
      ".bp-eyebrow",
      ".bp-badge",
      ".bp-button-row",
    ]) {
      assert.equal(
        globals.includes(primitive),
        true,
        `Missing canonical public primitive ${primitive}.`,
      );
    }

    for (const token of [
      "--bp-container-padding: clamp(1.25rem, 4vw, 2.5rem);",
      "--bp-container-max: 73.75rem;",
      "--bp-container-wide-max: 80rem;",
      "--bp-container-narrow-max: 50rem;",
      "--bp-section-space: clamp(3rem, 6.5vw, 6rem);",
      "--bp-section-tight-space: clamp(2rem, 4.5vw, 4rem);",
      "--bp-section-hero-space: clamp(2.25rem, 5vh, 4.75rem);",
      "--bp-hero-grid-gap: clamp(2rem, 4vw, 4rem);",
      "--bp-display-size: clamp(2.6rem, 4.6vw, 4.9rem);",
      "--bp-page-title-size: clamp(2.15rem, 1.55rem + 1.4vw, 3.45rem);",
      "--bp-section-title-size: clamp(1.85rem, 3vw, 3.2rem);",
      "--bp-card-title-size: clamp(1.2rem, 1.35vw, 1.5rem);",
      "--bp-body-size: clamp(1rem, 0.22vw + 0.95rem, 1.125rem);",
      "--bp-meta-size: clamp(0.82rem, 0.15vw + 0.78rem, 0.95rem);",
    ]) {
      assert.equal(
        globals.includes(token),
        true,
        `Missing canonical public token ${token}.`,
      );
    }

    assert.equal(globals.includes("--public-max: var(--bp-container-max);"), true);
    assert.equal(globals.includes("--public-gutter: var(--bp-container-padding);"), true);
    assert.equal(globals.includes("--legal-max: var(--bp-container-narrow-max);"), true);
    assert.equal(marketingUi.includes("bp-container public-container"), true);
    assert.equal(marketingUi.includes("bp-container-wide mx-auto"), true);
  });

  it("keeps public surfaces free of overflow masking and viewport-width traps", () => {
    const globals = source("app/globals.css");
    const publicSources = [
      globals,
      source("components/public/marketing-ui.tsx"),
      source("components/public/marketing-compact-menu.tsx"),
      ...publicRouteFiles.map((path) => source(path)),
    ].join("\n");

    assert.equal(publicSources.includes("overflow-x-hidden"), false);
    assert.equal(publicSources.includes("width: 100vw"), false);
    assert.equal(publicSources.includes("w-screen"), false);
    assert.equal(publicSources.includes("min-h-screen"), false);
    assert.equal(publicSources.includes("h-screen"), false);
    assert.equal(publicSources.includes("100vh"), false);
    assert.equal(globals.includes("overflow-wrap: anywhere"), true);
  });

  it("keeps marketing grids content-driven while preserving locked column structure", () => {
    const globals = source("app/globals.css");

    assert.equal(globals.includes("grid-auto-rows: 1fr"), false);
    assert.equal(
      globals.includes("repeat(3, minmax(0, 1fr))"),
      true,
      "desktop public grids should keep minmax(0, 1fr) tracks",
    );
    assert.equal(globals.includes(".homepage-use-case-grid > *"), true);
    assert.equal(globals.includes(".supporting-four-grid > *"), true);
    assert.equal(globals.includes(".supporting-six-grid > *"), true);
    assert.equal(
      globals.includes(".supporting-four-grid {\n    grid-template-columns: repeat(4, minmax(0, 1fr));"),
      true,
      "Four-step proof strips should reach four columns only at the wide public breakpoint.",
    );
  });

  it("keeps public routes off one-off fragile grid breakpoints", () => {
    const publicSources = publicRouteFiles.map((path) => source(path)).join("\n");

    for (const forbidden of [
      "min-[900px]:grid-cols-4",
      "min-[1180px]:grid-cols-5",
    ]) {
      assert.equal(
        publicSources.includes(forbidden),
        false,
        `Public routes should use canonical CSS grid classes instead of ${forbidden}.`,
      );
    }

    assert.equal(publicSources.includes("supporting-four-grid"), true);
  });

  it("keeps pricing cards equal-height with anchored actions", () => {
    const pricing = source("app/pricing/page.tsx");
    const globals = source("app/globals.css");

    for (const required of [
      "public-pricing-title",
      "public-pricing-hero-cta",
      "public-pricing-grid",
      "public-plan-card",
      "public-plan-card-header",
      "public-plan-card-price",
      "public-plan-card-highlight",
      "public-plan-card-features",
      "public-plan-card-cta mt-auto w-full",
    ]) {
      assert.equal(
        pricing.includes(required) || globals.includes(required),
        true,
        `Pricing alignment contract missing ${required}`,
      );
    }

    assert.equal(globals.includes(".supporting-three-grid {\n  display: grid;"), true);
    assert.equal(globals.includes(".public-plan-card-header"), true);
    assert.equal(globals.includes("grid-template-rows: minmax(2rem, auto) minmax(3.75rem, auto) minmax(4rem, auto) minmax(3rem, auto);"), true);
    assert.equal(globals.includes("min-block-size: 3.5rem;"), true);
    assert.equal(globals.includes("container: public-plan-card / inline-size;"), true);
    assert.equal(globals.includes("@container public-plan-card (max-width: 20rem)"), true);
    assert.equal(
      globals.includes(".public-plan-card-cta {\n    padding-inline: 1rem;"),
      true,
    );
  });

  it("keeps the homepage from repeating the workflow before the demo", () => {
    const homepage = source("app/page.tsx");

    assert.equal(
      homepage.includes("copy.workflow.steps.map"),
      false,
      "Homepage should not render the old repeated five-card workflow section.",
    );
    assert.equal(
      homepage.includes("homepage-workflow-grid"),
      false,
      "Homepage should not keep the removed workflow-grid surface.",
    );
    assert.equal(
      homepage.match(/<ProductPreview copy=\{copy\.preview\} \/>/g)?.length,
      1,
      "Homepage should keep one product preview workflow demo.",
    );
  });

  it("keeps the bilingual homepage hero from regressing to a narrow first-fold layout", () => {
    const globals = source("app/globals.css");
    const homepage = source("app/page.tsx");

    assert.equal(
      homepage.includes("[max-inline-size:13ch]"),
      false,
      "Homepage hero title should not use the old narrow 13ch wrap constraint.",
    );
    assert.equal(homepage.includes("homepage-hero-section"), true);
    assert.equal(homepage.includes("homepage-hero-title"), true);
    assert.equal(homepage.includes("homepage-hero-actions"), true);
    assert.equal(
      homepage.includes("min-[1100px]:text-[4.25rem]"),
      false,
      "Homepage hero title size should be owned by the rhythm CSS contract.",
    );
    assert.equal(
      globals.includes(".homepage-hero-title {\n  max-inline-size: min(100%, 49rem);\n  font-size: 2.25rem;"),
      true,
      "Homepage hero should keep a compact mobile/base title size in CSS.",
    );
    assert.equal(
      globals.includes("@media (min-width: 1100px) {\n  .homepage-hero-title {\n    font-size: 3.45rem;"),
      false,
      "Homepage hero should no longer use the older heavier desktop title size.",
    );
    assert.equal(
      globals.includes("@media (min-width: 1100px) {\n  .homepage-hero-title {\n    font-size: 3.28rem;"),
      true,
      "Homepage hero should keep a compact desktop title size in CSS.",
    );
    assert.equal(globals.includes("max-inline-size: min(100%, 49rem);"), true);
    assert.equal(
      globals.includes("@media (min-width: 1100px) and (max-height: 780px)"),
      true,
      "Short desktop viewports need reduced hero padding instead of smaller body text.",
    );
    assert.equal(
      globals.includes("max-inline-size: min(100%, 23.5rem);"),
      true,
      "Short desktop viewports need a compact hero preview card to stay inside the first fold.",
    );
    assert.equal(
      homepage.includes("min-h-[1.5rem]"),
      true,
      "Homepage mockup field values should keep compact field heights for first-fold visibility.",
    );
    assert.equal(homepage.includes("bp-button-row homepage-hero-actions"), true);
    assert.equal(homepage.includes("min-[360px]:flex-row"), true);
    assert.equal(
      globals.includes(".homepage-problem-section"),
      true,
      "Homepage should keep tighter first follow-up section spacing after the hero.",
    );
  });

  it("keeps homepage demo cards from rendering duplicate visible step numbers", () => {
    const homepage = source("app/page.tsx");
    const previewStart = homepage.indexOf("function ProductPreview");
    const previewEnd = homepage.indexOf("function ListColumn");
    const productPreviewSource = homepage.slice(previewStart, previewEnd);

    assert.notEqual(previewStart, -1, "ProductPreview should exist on the homepage.");
    assert.notEqual(previewEnd, -1, "ProductPreview source slice should remain findable.");
    assert.equal(
      productPreviewSource.match(/\{index \+ 1\}/g)?.length,
      1,
      "ProductPreview should render one visible step number per card.",
    );
    assert.equal(
      productPreviewSource.includes("justify-between gap-3"),
      false,
      "ProductPreview should not keep the old two-number header layout.",
    );
  });

  it("keeps theme and compact menus viewport-safe and layout-stable", () => {
    const globals = source("app/globals.css");
    const themeControl = source("components/ui/theme-preference-control.tsx");
    const compactMenu = source("components/public/marketing-compact-menu.tsx");
    const marketingUi = source("components/public/marketing-ui.tsx");

    assert.equal(themeControl.includes("h-11 w-11"), true);
    assert.equal(themeControl.includes("theme-preference-trigger inline-grid h-11 w-11"), true);
    assert.equal(themeControl.includes('data-theme-icon="sun"'), true);
    assert.equal(themeControl.includes('data-theme-icon="moon"'), true);
    assert.equal(
      globals.includes('[data-theme="dark"] .theme-preference-trigger [data-theme-icon="moon"]'),
      true,
    );
    assert.equal(themeControl.includes("calc(100vw-2rem)"), true);
    assert.equal(compactMenu.includes("calc(100vw-2rem)"), true);
    assert.equal(compactMenu.includes('aria-haspopup="menu"'), true);
    assert.equal(marketingUi.includes("truncate"), false);
  });

  it("keeps fr-CA theme labels free from mojibake artifacts", () => {
    const themeControl = source("components/ui/theme-preference-control.tsx");

    for (const artifact of ["Ã", "Â", "â€"]) {
      assert.equal(
        themeControl.includes(artifact),
        false,
        `Theme control source contains mojibake artifact ${artifact}`,
      );
    }

    assert.equal(themeControl.includes("fr-CA"), true);
    assert.equal(themeControl.includes("Utiliser le"), true);
  });

  it("keeps public dark-theme callout panels contrast-safe", () => {
    const globals = source("app/globals.css");

    for (const required of [
      '[data-theme="dark"] .public-site :where(.bg-teal-50)',
      '[data-theme="dark"] .public-site :where(.bg-amber-50)',
      '[data-theme="dark"] .public-site :where(.border-teal-200)',
      '[data-theme="dark"] .public-site :where(.border-amber-200)',
      '[data-theme="dark"] .public-site :where(.text-teal-700)',
      '[data-theme="dark"] .public-site :where(.text-amber-600, .text-amber-700)',
      '[data-theme="dark"] .public-site :where(.bg-slate-950)',
      '[data-theme="dark"] .public-site :where(.text-white)',
    ]) {
      assert.equal(
        globals.includes(required),
        true,
        `Dark public theme mapping missing ${required}`,
      );
    }

    assert.equal(globals.includes("var(--primary-contrast)"), true);
  });

  it("keeps localization-aware copy roles and cleaning details locked", () => {
    const globals = source("app/globals.css");
    const marketingUi = source("components/public/marketing-ui.tsx");
    const homepage = source("app/page.tsx");
    const features = source("app/features/page.tsx");
    const cleaning = source("app/industries/cleaning/page.tsx");
    const publicSiteCopy = source("lib/i18n/public-site-copy.ts");
    const pricing = source("app/pricing/page.tsx");

    for (const required of [
      ".bp-copy-nav",
      ".bp-copy-button",
      ".bp-copy-status",
      ".bp-copy-eyebrow",
      ".bp-copy-hero",
      ".bp-copy-hero-body",
      ".bp-copy-section-title",
      ".bp-copy-card-title",
      ".bp-copy-card-body",
      ".bp-copy-meta",
      ".bp-copy-plan-title",
      ".bp-card-structured",
    ]) {
      assert.equal(globals.includes(required), true, `Missing ${required}`);
    }

    assert.equal(globals.includes("white-space: nowrap;"), true);
    assert.equal(globals.includes("text-wrap: pretty;"), true);
    assert.equal(globals.includes("min-block-size: 2lh;"), true);
    assert.equal(marketingUi.includes("bp-copy-nav"), true);
    assert.equal(homepage.includes("bp-copy-hero"), true);
    assert.equal(features.includes("bp-card-structured"), true);
    assert.equal(pricing.includes("bp-copy-plan-title"), true);

    for (const required of [
      "const services = copy.serviceCards",
      "cleaning-service-grid",
      "cleaning-service-card",
      "cleaning-detail-tabs",
      "cleaning-tab-list",
      'role="tablist"',
      'role="tabpanel"',
      "cleaning-detail-mobile",
      "copy.detailSection.clearTitle",
      "copy.detailHelp.title",
      "copy.detailHelp.body",
      "copy.serviceActionLabel",
      "service.clearDetails.map",
      "service.missingDetails.map",
      "<details",
    ]) {
      assert.equal(cleaning.includes(required), true, `Cleaning layout missing ${required}`);
    }

    assert.equal(
      cleaning.includes("copy.families"),
      false,
      "Cleaning page should not render the old repeated family groups.",
    );
    assert.equal(
      publicSiteCopy.includes("families: ["),
      false,
      "Cleaning copy should no longer keep repeated Homes / Moves / Commercial family groups.",
    );
    assert.equal(
      publicSiteCopy.includes("serviceCards: ["),
      true,
      "Cleaning copy should expose six compact service detail entries.",
    );
    assert.equal(
      publicSiteCopy.includes("small-commercial"),
      false,
      "Small commercial should not remain in the final public Cleaning page copy.",
    );
    assert.equal(publicSiteCopy.includes("Small commercial cleaning"), false);
    assert.equal(publicSiteCopy.includes("Petit nettoyage commercial"), false);
    assert.equal(
      cleaning.includes("supporting-three-grid mt-8"),
      false,
      "Cleaning page should not render the previous three oversized family mega-cards.",
    );
    assert.equal(globals.includes(".cleaning-service-grid"), true);
    assert.equal(
      globals.includes(".cleaning-service-grid {\n    grid-template-columns: repeat(3, minmax(0, 1fr));"),
      true,
      "Cleaning service cards should use the canonical three-column desktop grid.",
    );
  });
});
