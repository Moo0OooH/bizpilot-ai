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
} from "@/lib/i18n/language";
import { getPolicyCopy } from "@/lib/i18n/policy-copy";
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
  const copy = getPolicyCopy(language).terms;

  return buildPublicMetadata("/terms", copy.meta, language);
}

export default async function TermsPage({ searchParams }: TermsPageProps = {}) {
  const language = await readPolicyLanguage(searchParams);

  return (
    <PolicyPage
      copy={getPolicyCopy(language).terms}
      language={language}
      navCopy={getHomeCopy(language).nav}
      pagePath="/terms"
    />
  );
}
