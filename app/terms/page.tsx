/**
 * ============================================================
 * File: app/terms/page.tsx
 * Project: BizPilot AI
 * Description: Public pilot terms route for the founder-led smart-intake workflow.
 * Role: Keeps staged pricing, manual billing, and no-hidden-automation terms visible.
 * Related:
 * - components/public/policy-page.tsx
 * - lib/i18n/policy-copy.ts
 * - docs/business/PILOT_TERMS_DECISION_GATE.md
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated Terms metadata, hero, navigation, and footer to the Website V3 content contract.
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

type TermsPageProps = Readonly<{
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
}: TermsPageProps = {}): Promise<Metadata> {
  const language = await readPolicyLanguage(searchParams);
  return buildPublicMetadata(
    "/terms",
    getPublicV3Spec(language).routes["/terms"].meta,
    language,
  );
}

export default async function TermsPage({ searchParams }: TermsPageProps = {}) {
  const language = await readPolicyLanguage(searchParams);
  const spec = getPublicV3Spec(language);

  return (
    <PolicyPage
      copy={getPolicyCopy(language).terms}
      language={language}
      navCopy={spec.nav}
      pagePath="/terms"
      routeHero={spec.routes["/terms"].hero}
    />
  );
}
