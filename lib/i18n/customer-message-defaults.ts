/**
 * ============================================================
 * File: lib/i18n/customer-message-defaults.ts
 * Project: BizPilot AI
 * Description: Customer-facing default copy for owner-reviewed message drafts.
 * Role: Keeps a business's English/French customer language independent from the dashboard operator's interface locale.
 * Related:
 * - lib/i18n/language.ts
 * - components/dashboard/premium-operations-workspace.tsx
 * - server/services/premium-operations.service.ts
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-21
 * Change Log:
 * - 2026-07-21: Separated bulk-reply customer defaults from the five-language dashboard interface dictionary.
 * ============================================================
 */

import {
  readSupportedLanguage,
  type SupportedLanguage,
} from "./language.ts";

export type CustomerFacingBulkReplyDefaults = Readonly<{
  template: string;
  title: string;
}>;

/**
 * These defaults are intentionally limited to supported business languages.
 * Persian, Arabic, and Spanish are dashboard-interface languages only; they
 * must never silently change the language of a customer message.
 */
export const customerFacingBulkReplyDefaults = {
  en: {
    template:
      "Hi {{firstName}}, thank you for your {{service}} request. We are reviewing the details and will follow up manually with the next step.",
    title: "Service update",
  },
  "fr-CA": {
    template:
      "Bonjour {{firstName}}, merci pour votre demande concernant {{service}}. Nous examinons les détails et ferons un suivi manuel avec la prochaine étape.",
    title: "Mise à jour du service",
  },
} as const satisfies Record<SupportedLanguage, CustomerFacingBulkReplyDefaults>;

export function getCustomerFacingBulkReplyDefaults(
  businessLanguage: unknown,
): CustomerFacingBulkReplyDefaults {
  return customerFacingBulkReplyDefaults[readSupportedLanguage(businessLanguage)];
}
