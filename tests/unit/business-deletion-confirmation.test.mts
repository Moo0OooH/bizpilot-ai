/**
 * ============================================================
 * File: tests/unit/business-deletion-confirmation.test.mts
 * Project: BizPilot AI
 * Description: Tests owner double-confirmation helpers for workspace deletion requests.
 * Role: Prevents accidental requests when acknowledgement or exact name typing is missing.
 * Related:
 * - lib/business-deletion/confirmation.ts
 * - components/dashboard/workspace-deletion-request-form.tsx
 * Author: MoOoH
 * Created: 2026-05-24
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isExactBusinessNameConfirmation,
  validateBusinessDeletionConfirmation,
} from "../../lib/business-deletion/confirmation.ts";

describe("Business deletion confirmation", () => {
  it("requires the exact normalized business name", () => {
    assert.equal(
      isExactBusinessNameConfirmation({
        businessName: "Bright Home Cleaning",
        typedBusinessName: "Bright Home Cleaning",
      }),
      true,
    );
    assert.equal(
      isExactBusinessNameConfirmation({
        businessName: "Bright Home Cleaning",
        typedBusinessName: "Bright   Home   Cleaning",
      }),
      true,
    );
    assert.equal(
      isExactBusinessNameConfirmation({
        businessName: "Bright Home Cleaning",
        typedBusinessName: "bright home cleaning",
      }),
      false,
    );
  });

  it("rejects requests without acknowledgement", () => {
    assert.throws(
      () =>
        validateBusinessDeletionConfirmation({
          acknowledged: false,
          businessName: "Bright Home Cleaning",
          typedBusinessName: "Bright Home Cleaning",
        }),
      /Confirm that you understand what this request does\./,
    );
  });

  it("rejects requests without exact business-name confirmation", () => {
    assert.throws(
      () =>
        validateBusinessDeletionConfirmation({
          acknowledged: true,
          businessName: "Bright Home Cleaning",
          typedBusinessName: "Bright Cleaning",
        }),
      /Type the exact business name to confirm\./,
    );
  });
});
