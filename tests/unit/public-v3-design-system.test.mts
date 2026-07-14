/**
 * ============================================================
 * File: tests/unit/public-v3-design-system.test.mts
 * Project: BizPilot AI
 * Description: Verifies the Website V3 public design-system foundation at source level.
 * Role: Prevents token, shared-shell, accessibility, localization, and simplified-navigation regressions before page composition.
 * Related:
 * - app/globals.css
 * - components/public/marketing-ui.tsx
 * - components/public/marketing-compact-menu.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Updated skip-link coverage to the consolidated V3 home, retained-page, and policy renderers.
 * - 2026-07-13: Added V3 token, primitive, shell, footer, reduced-motion, and skip-link contracts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Website V3 design-system foundation", () => {
  const globals = source("app/globals.css");
  const marketingUi = source("components/public/marketing-ui.tsx");

  it("defines the consolidated marketing token families and reusable primitives", () => {
    for (const required of [
      "--v3-content-max",
      "--v3-reading-max",
      "--v3-gutter",
      "--v3-section-space",
      "--v3-radius-sm",
      "--v3-radius-md",
      "--v3-radius-lg",
      "--v3-shadow-card",
      "--v3-shadow-float",
      "--v3-type-display",
      "--v3-type-section",
      "--v3-leading-body",
      "--v3-motion-fast",
      "--v3-ease-out",
      ".v3-container",
      ".v3-card",
      ".v3-button-primary",
      ".v3-button-secondary",
      ".v3-button-ghost",
      ".v3-product-frame",
      ".v3-product-stage",
      ".v3-state-chip",
    ]) {
      assert.equal(globals.includes(required), true, `Missing V3 foundation ${required}.`);
    }
  });

  it("uses the shared shell and product-scene primitives without decorative CTA gradients", () => {
    for (const required of [
      "v3-site-header",
      "v3-site-footer",
      "v3-brand-mark",
      "v3-skip-link",
      "MarketingProductFrame",
      "MarketingProductStage",
      "MarketingStateChip",
      "v3-button-primary",
      "v3-button-secondary",
      "v3-button-ghost",
    ]) {
      assert.equal(marketingUi.includes(required), true, `Missing shared primitive ${required}.`);
    }

    assert.equal(marketingUi.includes("linear-gradient(135deg, var(--primary)"), false);
    assert.equal(marketingUi.includes('href: "/comparison"'), false);
    assert.equal(marketingUi.includes('href: "/quote-link-guide"'), false);
    assert.equal(marketingUi.includes('href: "/faster-quote-replies"'), false);
  });

  it("keeps keyboard and motion accessibility in the shared public shell", () => {
    assert.equal(marketingUi.includes('href="#main-content"'), true);
    assert.equal(marketingUi.includes('"Aller au contenu"'), true);
    assert.equal(globals.includes("@media (prefers-reduced-motion: reduce)"), true);
    assert.equal(globals.includes("transition-duration: 0.01ms !important"), true);

    const compactMenu = source("components/public/marketing-compact-menu.tsx");
    assert.equal(compactMenu.includes("Ouvrir la navigation du site"), true);
    assert.equal(compactMenu.includes("Fermer la navigation du site"), true);
    assert.equal(compactMenu.includes("overflow-y-auto"), false);
  });

  it("provides the skip-link target on every currently rendered public shell", () => {
    for (const path of [
      "components/public/public-v3-home.tsx",
      "components/public/public-v3-page.tsx",
      "components/public/policy-page.tsx",
    ]) {
      assert.equal(
        source(path).includes('id="main-content"'),
        true,
        `${path} must expose the shared main-content target.`,
      );
    }
  });
});
