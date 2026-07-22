/**
 * ============================================================
 * File: tests/unit/customer-message-defaults.test.mts
 * Project: BizPilot AI
 * Description: Tests business-language customer message defaults.
 * Role: Prevents a dashboard interface locale from changing default customer reply content.
 * Related:
 * - lib/i18n/customer-message-defaults.ts
 * - components/dashboard/premium-operations-workspace.tsx
 * - lib/i18n/dashboard-interface.ts
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-21
 * Change Log:
 * - 2026-07-21: Added customer-language isolation coverage for Premium Operations bulk-reply defaults.
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  customerFacingBulkReplyDefaults,
  getCustomerFacingBulkReplyDefaults,
} from "../../lib/i18n/customer-message-defaults.ts";
import { dashboardInterfaceLanguages } from "../../lib/i18n/dashboard-interface.ts";

describe("customer-facing bulk-reply defaults", () => {
  it("uses only the business's supported English or French language", () => {
    assert.deepEqual(getCustomerFacingBulkReplyDefaults("en"), {
      template:
        "Hi {{firstName}}, thank you for your {{service}} request. We are reviewing the details and will follow up manually with the next step.",
      title: "Service update",
    });
    assert.deepEqual(getCustomerFacingBulkReplyDefaults("fr-CA"), {
      template:
        "Bonjour {{firstName}}, merci pour votre demande concernant {{service}}. Nous examinons les détails et ferons un suivi manuel avec la prochaine étape.",
      title: "Mise à jour du service",
    });
  });

  it("never treats a dashboard-only locale as a customer message language", () => {
    const english = customerFacingBulkReplyDefaults.en;

    for (const dashboardLanguage of dashboardInterfaceLanguages) {
      if (dashboardLanguage === "en" || dashboardLanguage === "fr-CA") {
        continue;
      }

      assert.deepEqual(
        getCustomerFacingBulkReplyDefaults(dashboardLanguage),
        english,
        `${dashboardLanguage} must fall back to the English business-message default.`,
      );
    }
  });
});
