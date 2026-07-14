/**
 * ============================================================
 * File: app/faq/page.tsx
 * Project: BizPilot AI
 * Description: Retained Website V3 frequently asked questions page.
 * Role: Answers the ten approved product, AI, channel, data, pricing, and pilot objections without duplicating the homepage.
 * Related:
 * - components/public/public-v3-page.tsx
 * - lib/i18n/public-v3-spec.ts
 * - lib/seo.ts
 * Author: MoOoH
 * Created: 2026-06-21
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated FAQ to the concise ten-question V3 content contract and renderer.
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

type FaqPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: FaqPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/faq",
    getPublicV3Spec(language).routes["/faq"].meta,
    language,
  );
}

export default async function FaqPage({ searchParams }: FaqPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  return <PublicV3Page language={language} path="/faq" />;
}
