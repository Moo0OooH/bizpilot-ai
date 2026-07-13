/*
 * ============================================================
 * File: app/industries/cleaning/page.tsx
 * Project: BizPilot AI
 * Description: Public page for the first complete BizPilot vertical.
 * Role: Explains cleaning-specific smart intake while keeping pricing, quoting, sending, and expansion decisions under owner control.
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

type CleaningPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: CleaningPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/industries/cleaning",
    getPublicV2Copy(language).cleaning.meta,
    language,
  );
}

export default async function CleaningPage({
  searchParams,
}: CleaningPageProps = {}) {
  const language = await readPublicLanguage(searchParams);

  return (
    <BizPilotV2Page
      copy={getPublicV2Copy(language).cleaning}
      language={language}
      path="/industries/cleaning"
    />
  );
}
