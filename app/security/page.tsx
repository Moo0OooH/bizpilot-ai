/**
 * ============================================================
 * File: app/security/page.tsx
 * Project: BizPilot AI
 * Description: Public security posture route for the pilot-stage smart-intake workspace.
 * Role: Summarizes security boundaries without exposing internal secrets or data.
 * Related:
 * - components/public/policy-page.tsx
 * - lib/i18n/policy-copy.ts
 * - docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Added complete BizPilot source header metadata for public policy route hygiene.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PolicyPage } from "@/components/public/policy-page";
import { getPublicV2NavCopy } from "@/lib/i18n/public-v2-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
} from "@/lib/i18n/language";
import { getPolicyCopy } from "@/lib/i18n/policy-copy";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type SecurityPageProps = Readonly<{
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
}: SecurityPageProps = {}): Promise<Metadata> {
  const language = await readPolicyLanguage(searchParams);
  const copy = getPolicyCopy(language).security;

  return buildPublicMetadata("/security", copy.meta, language);
}

export default async function SecurityPage({
  searchParams,
}: SecurityPageProps = {}) {
  const language = await readPolicyLanguage(searchParams);

  return (
    <PolicyPage
      copy={getPolicyCopy(language).security}
      language={language}
      navCopy={getPublicV2NavCopy(language)}
      pagePath="/security"
    />
  );
}
