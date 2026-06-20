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
} from "@/lib/i18n/language";
import { getPolicyCopy } from "@/lib/i18n/policy-copy";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type PrivacyPageProps = Readonly<{
  searchParams?: PublicRouteSearchParams;
}>;

async function readPolicyLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: PrivacyPageProps = {}): Promise<Metadata> {
  const language = await readPolicyLanguage(searchParams);
  const copy = getPolicyCopy(language).privacy;

  return buildPublicMetadata("/privacy", copy.meta, language);
}

export default async function PrivacyPage({
  searchParams,
}: PrivacyPageProps = {}) {
  const language = await readPolicyLanguage(searchParams);

  return (
    <PolicyPage
      copy={getPolicyCopy(language).privacy}
      language={language}
      navCopy={getHomeCopy(language).nav}
      pagePath="/privacy"
    />
  );
}
