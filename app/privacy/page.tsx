/**
 * ============================================================
 * File: app/privacy/page.tsx
 * Project: BizPilot AI
 * Description: Public privacy notice route for the pilot-stage smart-intake workspace.
 * Role: Gives prospects and pilot owners a clear privacy boundary before real data.
 * Related:
 * - components/public/policy-page.tsx
 * - lib/i18n/policy-copy.ts
 * - docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated Privacy metadata, hero, navigation, and footer to the Website V3 content contract.
 * - 2026-07-05: Added complete BizPilot source header metadata for public policy route hygiene.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PolicyPage } from "@/components/public/policy-page";
import {
  INTERFACE_LANGUAGE_COOKIE,
} from "@/lib/i18n/language";
import { getPolicyCopy } from "@/lib/i18n/policy-copy";
import { getPublicV3Spec } from "@/lib/i18n/public-v3-spec";
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
  return buildPublicMetadata(
    "/privacy",
    getPublicV3Spec(language).routes["/privacy"].meta,
    language,
  );
}

export default async function PrivacyPage({
  searchParams,
}: PrivacyPageProps = {}) {
  const language = await readPolicyLanguage(searchParams);
  const spec = getPublicV3Spec(language);

  return (
    <PolicyPage
      copy={getPolicyCopy(language).privacy}
      language={language}
      navCopy={spec.nav}
      pagePath="/privacy"
      routeHero={spec.routes["/privacy"].hero}
    />
  );
}
