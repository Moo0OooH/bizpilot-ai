/**
 * ============================================================
 * File: app/trust/page.tsx
 * Project: BizPilot AI
 * Description: Retained Website V3 trust and human-control page.
 * Role: Explains explicit inputs, visible gaps, bounded AI, human review, data minimization, and operational boundaries.
 * Related:
 * - components/public/public-v3-page.tsx
 * - lib/i18n/public-v3-spec.ts
 * - app/security/page.tsx
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated Trust to the six-control V3 content contract and compact renderer.
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
    getPublicV3Spec(language).routes["/trust"].meta,
    language,
  );
}

export default async function TrustPage({ searchParams }: TrustPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  return <PublicV3Page language={language} path="/trust" />;
}
