/**
 * ============================================================
 * File: app/security/page.tsx
 * Project: BizPilot AI
 * Description: Public security posture route for pilot-stage quote recovery.
 * Role: Summarizes security boundaries without exposing internal secrets or data.
 * Related:
 * - components/public/policy-page.tsx
 * - lib/i18n/policy-copy.ts
 * - docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md
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
  const copy = getPolicyCopy(language).security;

  return {
    description: copy.body,
    title: `${copy.title} | BizPilot AI`,
  };
}

export default async function SecurityPage() {
  const language = await readPolicyLanguage();

  return (
    <PolicyPage
      copy={getPolicyCopy(language).security}
      language={language}
      navCopy={getHomeCopy(language).nav}
      pagePath="/security"
    />
  );
}
