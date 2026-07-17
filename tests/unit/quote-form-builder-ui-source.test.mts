/**
 * File: tests/unit/quote-form-builder-ui-source.test.mts
 * Project: BizPilot AI
 * Description: Source contracts for the configurable quote-form editor and public interaction modes.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("quote form builder UI source contracts", () => {
  it("keeps every Quote Setup field-builder prop serializable", () => {
    function functionPaths(value: unknown, path = "fields"): string[] {
      if (typeof value === "function") return [path];
      if (!value || typeof value !== "object") return [];
      return Object.entries(value as Record<string, unknown>).flatMap(
        ([key, child]) => functionPaths(child, `${path}.${key}`),
      );
    }

    for (const language of ["en", "fr-CA"] as const) {
      const fields = getBizPilotCopy(language).dashboard.configuration.fields;
      assert.deepEqual(
        functionPaths(fields),
        [],
        `${language} Quote Setup fields copy must cross Client Component boundaries`,
      );
      assert.doesNotThrow(() => JSON.stringify(fields));
    }

    const page = source("app/(dashboard)/dashboard/configuration/page.tsx");
    assert.equal(page.includes("copy={configCopy.fields.formStructure}"), true);
  });

  it("connects the saved layout and field assignments to Quote Setup", () => {
    const page = source("app/(dashboard)/dashboard/configuration/page.tsx");
    const builder = source(
      "components/dashboard/quote-form-structure-builder.tsx",
    );
    const customFields = source(
      "components/dashboard/custom-quote-field-builder.tsx",
    );

    for (const marker of [
      "QuoteFormStructureBuilder",
      "initialLayout={cleaningTemplate.formLayout}",
      "sectionKey: field.section_key",
      'name="formDisplayMode"',
      'name="formSectionKeys"',
      "fieldSection:${field.fieldKey}",
      "sectionVisible:${section.key}",
    ]) {
      assert.equal(
        `${page}\n${builder}`.includes(marker),
        true,
        `Missing ${marker}`,
      );
    }

    assert.equal(builder.includes('["list", "tabs", "steps"]'), true);
    assert.equal(builder.includes("MAX_QUOTE_FORM_SECTIONS"), true);
    assert.equal(builder.includes("visibleSectionCount <= 1"), true);
    assert.equal(customFields.includes("newFieldSection:${field.id}"), true);
    assert.equal(customFields.includes("QUOTE_FORM_SECTIONS_EVENT"), true);
  });

  it("renders every saved mode through one validated public form", () => {
    const flow = source("components/public/quote-form-flow.tsx");
    const wizard = source("components/public/quote-form-wizard.tsx");
    const quotePage = source("app/(public)/quote/[slug]/page.tsx");

    for (const marker of [
      'displayMode === "list"',
      'displayMode === "tabs"',
      'displayMode === "steps"',
      'role="tablist"',
      'role={displayMode === "tabs" ? "tabpanel" : undefined}',
      "ArrowRight",
      "firstInvalidControl",
      "validateSection",
      "noValidate",
      "useFormStatus",
    ]) {
      assert.equal(flow.includes(marker), true, `Missing ${marker}`);
    }

    assert.equal(wizard.includes("page.formLayout.sections"), true);
    assert.equal(wizard.includes("field.section_key"), true);
    assert.equal(wizard.includes("QuoteFormFlow"), true);
    assert.equal(quotePage.includes("page.formLayout.header.title"), true);
    assert.equal(quotePage.includes("page.formLayout.header.subtitle"), true);
  });

  it("keeps the fixed setup action bar above mobile navigation and beside the desktop sidebar", () => {
    const page = source("app/(dashboard)/dashboard/configuration/page.tsx");

    assert.equal(page.includes("dashboard-configuration-actions"), true);
    assert.equal(
      page.includes(
        "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]",
      ),
      true,
    );
    assert.equal(page.includes("lg:bottom-0 lg:left-[240px]"), true);
    assert.equal(page.includes("space-y-4 pb-44 sm:pb-28 lg:pb-20"), true);
    assert.equal(page.includes("lg:pl-[224px]"), false);
  });
});
