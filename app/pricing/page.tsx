/**
 * ============================================================
 * File: app/pricing/page.tsx
 * Project: BizPilot AI
 * Description: Retained Website V3 founder-pilot pricing page.
 * Role: Shows the approved three pilot tiers and manual approval gates without checkout or unsupported billing claims.
 * Related:
 * - components/public/public-v3-page.tsx
 * - lib/i18n/public-v3-spec.ts
 * - lib/seo.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated pilot pricing to the compact V3 renderer while preserving approved prices and manual billing boundaries.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PublicV3Page } from "@/components/public/public-v3-page";
import { INTERFACE_LANGUAGE_COOKIE } from "@/lib/i18n/language";
import { getPublicV3Spec } from "@/lib/i18n/public-v3-spec";
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
    getPublicV3Spec(language).routes["/pricing"].meta,
    language,
  );
}

export default async function PricingPage({
  searchParams,
}: PricingPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  return <PublicV3Page language={language} path="/pricing" />;
}
