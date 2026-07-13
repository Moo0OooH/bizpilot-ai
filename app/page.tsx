/*
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Public homepage for the universal smart customer-intake and owner-reviewed reply workspace.
 * Role: Positions the service-business product honestly while keeping cleaning as the first complete pilot vertical.
 * Related:
 * - components/public/bizpilot-v2-home.tsx
 * - lib/i18n/public-v2-copy.ts
 * - lib/public-structured-data.ts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Replaced cleaning-only quote-rescue positioning with the universal smart-intake V2 experience.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { BizPilotV2Home } from "@/components/public/bizpilot-v2-home";
import { JsonLdScript } from "@/components/public/json-ld";
import {
  INTERFACE_LANGUAGE_COOKIE,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicV2Copy } from "@/lib/i18n/public-v2-copy";
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
  return buildPublicMetadata("/", getPublicV2Copy(language).home.meta, language);
}

export default async function HomePage({
  searchParams,
}: HomePageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const copy = getPublicV2Copy(language).home;

  return (
    <>
      <JsonLdScript
        data={buildHomeJsonLd(language)}
        id="bizpilot-v2-home-jsonld"
      />
      <BizPilotV2Home copy={copy} language={language} />
    </>
  );
}
