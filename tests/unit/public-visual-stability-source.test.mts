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
    assert.equal(globals.includes(".supporting-six-grid > *"), true);
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
      homepage.includes("text-[clamp(2.75rem,5vw,5.25rem)]"),
      true,
      "Homepage hero should use the Phase 12 readable clamp size.",
    );
    assert.equal(globals.includes("max-inline-size: min(100%, 46rem);"), true);
    assert.equal(
      globals.includes("@media (min-width: 1100px) and (max-height: 780px)"),
      true,
      "Short desktop viewports need reduced hero padding instead of smaller body text.",
    );
  });

  it("keeps theme and compact menus viewport-safe and layout-stable", () => {
    const themeControl = source("components/ui/theme-preference-control.tsx");
    const compactMenu = source("components/public/marketing-compact-menu.tsx");
    const marketingUi = source("components/public/marketing-ui.tsx");

    assert.equal(themeControl.includes("h-11 w-11"), true);
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
});
