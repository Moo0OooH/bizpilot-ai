/**
 * ============================================================
 * File: tests/unit/dashboard-quote-setup-finalization-source.test.mts
 * Project: BizPilot AI
 * Description: Source contracts for the guided dashboard quote-setup finalization.
 * Role: Guards menu placement, progressive fields, safe branding, business knowledge, unique-link guidance, and owner preview recovery.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * - components/dashboard/branding-editor.tsx
 * - server/services/ai/lead-conversion-assistant.service.ts
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Guarded right-aligned protected navigation, recovery links, and the expanded first-run owner guide.
 * - 2026-07-16: Added final dashboard Quote Setup regression coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("dashboard quote setup finalization", () => {
  it("keeps the desktop Actions menu clear of the fixed sidebar", () => {
    const topbar = source("components/dashboard/dashboard-topbar.tsx");

    assert.equal(topbar.includes("ml-auto"), true);
    assert.equal(topbar.includes("absolute right-0 top-11"), true);
    assert.equal(topbar.includes("lg:left-0 lg:right-auto"), false);
    assert.equal(topbar.includes('href="/dashboard/guide"'), true);
    assert.equal(topbar.includes("prefetch={false}"), true);
    assert.equal(topbar.includes("value={quoteUrl}"), true);
    assert.equal(topbar.includes("?preview=dashboard"), true);
  });

  it("provides safe route recovery and a complete first-run guide", () => {
    const errorBoundary = source("app/(dashboard)/dashboard/error.tsx");
    const guide = source("app/(dashboard)/dashboard/guide/page.tsx");
    const copy = source("lib/i18n/bizpilot-copy.ts");

    assert.equal(errorBoundary.includes("window.location.reload()"), true);
    assert.equal(errorBoundary.includes('href="/dashboard"'), true);
    assert.equal(errorBoundary.includes('href="/dashboard/configuration"'), true);
    assert.equal(errorBoundary.includes('href="/dashboard/guide"'), true);
    assert.equal(guide.includes("guideCopy.firstSession.items"), true);
    assert.equal(guide.includes("guideCopy.dailyRoutine.items"), true);
    assert.equal(guide.includes("prefetch={false}"), true);
    assert.equal(copy.includes('title: "If something looks wrong"'), true);
    assert.equal(copy.includes('title: "Si quelque chose semble incorrect"'), true);
  });

  it("keeps custom questions progressive and owner-readable", () => {
    const builder = source(
      "components/dashboard/custom-quote-field-builder.tsx",
    );

    assert.equal(
      builder.includes("useState<readonly DraftField[]>([])") ,
      true,
    );
    assert.equal(builder.includes("recommendedQuestions"), true);
    assert.equal(builder.includes("fields.length === 0"), true);
    assert.equal(builder.includes("advancedSettings"), true);
    assert.equal(builder.includes('name={`newFieldSort:${field.id}`}'), true);
  });

  it("supports bounded local logos and applies branding to the public form", () => {
    const editor = source("components/dashboard/branding-editor.tsx");
    const service = source("server/services/business-configuration.service.ts");
    const quotePage = source("app/(public)/quote/[slug]/page.tsx");

    assert.equal(editor.includes('accept="image/png,image/jpeg,image/webp"'), true);
    assert.equal(editor.includes("MAX_SOURCE_BYTES = 2 * 1024 * 1024"), true);
    assert.equal(editor.includes('name="logoUrl" type="hidden"'), true);
    assert.equal(service.includes("logoDataUrlPattern"), true);
    assert.equal(service.includes('parsed.protocol === "https:"'), true);
    assert.equal(quotePage.includes("getBrandStyle(page.branding)"), true);
    assert.equal(quotePage.includes("page.branding?.logo_url"), true);
  });

  it("provides five FAQ starters and feeds saved knowledge into bounded AI drafts", () => {
    const copy = source("lib/i18n/bizpilot-copy.ts");
    const editor = source("components/dashboard/faq-knowledge-editor.tsx");
    const ai = source(
      "server/services/ai/lead-conversion-assistant.service.ts",
    );
    const prompt = source("server/services/ai/prompt-registry.ts");

    assert.equal(copy.includes('loadExamples: "Load 5 examples"'), true);
    assert.equal(copy.includes('loadExamples: "Charger 5 exemples"'), true);
    assert.equal(editor.includes("examples.join"), true);
    assert.equal(ai.includes("businessKnowledge"), true);
    assert.equal(ai.includes("approvedFaqs"), true);
    assert.equal(ai.includes("serviceAreas"), true);
    assert.equal(prompt.includes("Never infer a fact that is absent"), true);
    assert.equal(prompt.includes("Never auto-send"), true);
  });

  it("makes the unique link explicit and repairs it before owner preview", () => {
    const setup = source(
      "app/(dashboard)/dashboard/configuration/page.tsx",
    );
    const action = source(
      "server/actions/business-configuration.actions.ts",
    );
    const unavailable = source("components/public/quote-unavailable.tsx");

    assert.equal(setup.includes('id: "public-link"'), true);
    assert.equal(setup.includes("quoteUrl"), true);
    assert.equal(setup.includes('value="preview"'), true);
    assert.equal(action.includes('formData.get("submitIntent") === "preview"'), true);
    assert.equal(action.includes("?preview=dashboard"), true);
    assert.equal(unavailable.includes('href={ownerPreview ? "/dashboard/configuration" : "/"}'), true);
    assert.equal(unavailable.includes("ownerUnavailableTitle"), true);
  });
});
