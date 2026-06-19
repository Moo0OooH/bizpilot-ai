/**
 * ============================================================
 * File: app/terms/page.tsx
 * Project: BizPilot AI
 * Description: Public pilot terms route for founder-led quote recovery.
 * Role: Keeps staged pricing, manual billing, and no-hidden-automation terms visible.
 * Related:
 * - components/public/policy-page.tsx
 * - lib/i18n/policy-copy.ts
 * - docs/business/PILOT_TERMS_DECISION_GATE.md
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

async function readPolicyLanguage() {
  return readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await readPolicyLanguage();
  const copy = getPolicyCopy(language).terms;

  return {
    description: copy.body,
    title: `${copy.title} | BizPilot AI`,
  };
}

export default async function TermsPage() {
  const language = await readPolicyLanguage();

  return (
    <PolicyPage
      copy={getPolicyCopy(language).terms}
      language={language}
      navCopy={getHomeCopy(language).nav}
      pagePath="/terms"
    />
  );
}
