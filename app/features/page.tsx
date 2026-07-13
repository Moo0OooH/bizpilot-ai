/*
 * ============================================================
 * File: app/features/page.tsx
 * Project: BizPilot AI
 * Description: Public product page for the smart customer-intake and owner-reviewed reply workspace.
 * Role: Explains current capabilities and explicitly separates roadmap integrations from active product claims.
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
    getPublicV2Copy(language).features.meta,
    language,
  );
}

export default async function FeaturesPage({
  searchParams,
}: FeaturesPageProps = {}) {
  const language = await readPublicLanguage(searchParams);

  return (
    <BizPilotV2Page
      copy={getPublicV2Copy(language).features}
      language={language}
      path="/features"
    />
  );
}
