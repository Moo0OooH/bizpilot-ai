/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Public Website V3 homepage for smart service-request intake and human-reviewed replies.
 * Role: Resolves locale, metadata, structured data, and the approved seven-section V3 conversion narrative.
 * Related:
 * - components/public/public-v3-home.tsx
 * - lib/i18n/public-v3-spec.ts
 * - lib/public-structured-data.ts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Replaced the V2 homepage renderer and metadata with the approved seven-section V3 experience.
 * - 2026-07-13: Replaced cleaning-only quote-rescue positioning with the universal smart-intake V2 experience.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { JsonLdScript } from "@/components/public/json-ld";
import { PublicV3Home } from "@/components/public/public-v3-home";
import {
  INTERFACE_LANGUAGE_COOKIE,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicV3Spec } from "@/lib/i18n/public-v3-spec";
import { buildHomeJsonLd } from "@/lib/public-structured-data";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type HomePageProps = Readonly<{
  searchParams?: PublicRouteSearchParams;
}>;

async function readPublicLanguage(
  searchParams?: PublicRouteSearchParams,
): Promise<SupportedLanguage> {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: HomePageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata("/", getPublicV3Spec(language).routes["/"].meta, language);
}

export default async function HomePage({
  searchParams,
}: HomePageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const spec = getPublicV3Spec(language);

  return (
    <>
      <JsonLdScript
        data={buildHomeJsonLd(language)}
        id="bizpilot-v3-home-jsonld"
      />
      <PublicV3Home language={language} spec={spec} />
    </>
  );
}
