/*
 * ============================================================
 * File: app/demo/page.tsx
 * Project: BizPilot AI
 * Description: Public demonstration of the current cleaning smart-intake workflow.
 * Role: Shows request collection, organization, missing-detail detection, AI-assisted drafting, and manual owner approval.
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

type DemoPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: DemoPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/demo",
    getPublicV2Copy(language).demo.meta,
    language,
  );
}

export default async function DemoPage({ searchParams }: DemoPageProps = {}) {
  const language = await readPublicLanguage(searchParams);

  return (
    <BizPilotV2Page
      copy={getPublicV2Copy(language).demo}
      language={language}
      path="/demo"
    />
  );
}
