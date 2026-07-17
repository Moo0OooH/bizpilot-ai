/**
 * ============================================================
 * File: tests/unit/dashboard-shell-copy.test.mts
 * Project: BizPilot AI
 * Description: Source guards for serializable protected dashboard copy boundaries.
 * Role: Prevents formatter functions from crossing from Server Components into dashboard Client Components.
 * Related:
 * - app/(dashboard)/layout.tsx
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - components/dashboard/faq-knowledge-editor.tsx
 * Author: MoOoH
 * Created: 2026-05-23
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added Quote Setup FAQ serialization regression coverage and the standard source header.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("dashboard shell copy boundary", () => {
  it("does not pass function-valued Settings copy into client shell components", () => {
    const layoutSource = readFileSync("app/(dashboard)/layout.tsx", "utf8");
    const shellSource = readFileSync(
      "components/dashboard/dashboard-shell.tsx",
      "utf8",
    );

    assert.equal(
      layoutSource.includes("settings: copy.settings"),
      false,
      "DashboardLayout must not pass the full settings dictionary because it contains formatter functions.",
    );
    assert.match(
      layoutSource,
      /settings:\s*{\s*plan:\s*copy\.settings\.plan,\s*}/s,
    );
    assert.match(
      shellSource,
      /settings:\s*Pick<BizPilotCopy\["dashboard"\]\["settings"\], "plan">/s,
    );
  });

  it("does not pass function-valued FAQ copy into the Quote Setup client editor", () => {
    const pageSource = readFileSync(
      "app/(dashboard)/dashboard/configuration/page.tsx",
      "utf8",
    );
    const editorSource = readFileSync(
      "components/dashboard/faq-knowledge-editor.tsx",
      "utf8",
    );

    assert.equal(
      pageSource.includes("copy={configCopy.faq}"),
      false,
      "Quote Setup must select serializable FAQ labels instead of passing the formatter dictionary into a Client Component.",
    );
    assert.equal(
      editorSource.includes("summary: (count: number) => string"),
      false,
    );
    assert.equal(pageSource.includes("countMany: configCopy.faq.countMany"), true);
    assert.equal(pageSource.includes("countOne: configCopy.faq.countOne"), true);
  });
});
