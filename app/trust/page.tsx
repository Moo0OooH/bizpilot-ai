/*
 * ============================================================
 * File: app/trust/page.tsx
 * Project: BizPilot AI
 * Description: Public trust page for human-controlled smart intake and AI-assisted replies.
 * Role: Explains current product limits, data discipline, roadmap labeling, and production approval gates.
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

type TrustPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: TrustPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/trust",
    getPublicV2Copy(language).trust.meta,
    language,
  );
}

export default async function TrustPage({ searchParams }: TrustPageProps = {}) {
  const language = await readPublicLanguage(searchParams);

  return (
    <BizPilotV2Page
      copy={getPublicV2Copy(language).trust}
      language={language}
      path="/trust"
    />
  );
}
