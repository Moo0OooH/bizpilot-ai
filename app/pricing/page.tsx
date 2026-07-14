/*
 * ============================================================
 * File: app/pricing/page.tsx
 * Project: BizPilot AI
 * Description: Public founder-pilot pricing for the current controlled smart-intake workflow.
 * Role: Preserves approved staged pricing and manual billing boundaries under the universal product positioning.
 * Related:
 * - components/public/bizpilot-v2-page.tsx
 * - lib/i18n/public-v2-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { BizPilotV2Page } from "@/components/public/bizpilot-v2-page";
import { INTERFACE_LANGUAGE_COOKIE } from "@/lib/i18n/language";
import { getPublicV2Copy } from "@/lib/i18n/public-v2-copy";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type PricingPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: PricingPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/pricing",
    getPublicV2Copy(language).pricing.meta,
    language,
  );
}

export default async function PricingPage({
  searchParams,
}: PricingPageProps = {}) {
  const language = await readPublicLanguage(searchParams);

  return (
    <BizPilotV2Page
      copy={getPublicV2Copy(language).pricing}
      language={language}
      path="/pricing"
    />
  );
}
