/**
 * ============================================================
 * File: app/privacy/page.tsx
 * Project: BizPilot AI
 * Description: Public privacy notice route for pilot-stage quote recovery.
 * Role: Gives prospects and pilot owners a clear privacy boundary before real data.
 * Related:
 * - components/public/policy-page.tsx
 * - lib/i18n/policy-copy.ts
 * - docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-25
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PolicyPage } from "@/components/public/policy-page";
import { getHomeCopy } from "@/lib/i18n/home-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPolicyCopy } from "@/lib/i18n/policy-copy";

export const metadata: Metadata = {
  title: "Privacy - BizPilot AI",
  description:
    "Pilot-stage privacy notice for BizPilot AI cleaning quote recovery.",
};

export default async function PrivacyPage() {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );

  return (
    <PolicyPage
      copy={getPolicyCopy(language).privacy}
      language={language}
      navCopy={getHomeCopy(language).nav}
      pagePath="/privacy"
    />
  );
}
