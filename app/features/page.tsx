/**
 * ============================================================
 * File: app/features/page.tsx
 * Project: BizPilot AI
 * Description: Retained Website V3 product-capability page.
 * Role: Explains the current Smart Intake Link, organized-request, missing-detail, draft, and human-review capabilities.
 * Related:
 * - components/public/public-v3-page.tsx
 * - lib/i18n/public-v3-spec.ts
 * - lib/seo.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated the retained Features route from V2 to the consolidated V3 renderer and copy contract.
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

type FeaturesPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: FeaturesPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/features",
    getPublicV3Spec(language).routes["/features"].meta,
    language,
  );
}

export default async function FeaturesPage({
  searchParams,
}: FeaturesPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  return <PublicV3Page language={language} path="/features" />;
}
