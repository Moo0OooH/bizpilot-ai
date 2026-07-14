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
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated Security metadata, hero, navigation, and footer to the Website V3 content contract.
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
  return buildPublicMetadata(
    "/security",
    getPublicV3Spec(language).routes["/security"].meta,
    language,
  );
}

export default async function SecurityPage({
  searchParams,
}: SecurityPageProps = {}) {
  const language = await readPolicyLanguage(searchParams);
  const spec = getPublicV3Spec(language);

  return (
    <PolicyPage
      copy={getPolicyCopy(language).security}
      language={language}
      navCopy={spec.nav}
      pagePath="/security"
      routeHero={spec.routes["/security"].hero}
    />
  );
}
