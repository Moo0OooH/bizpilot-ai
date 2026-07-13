/*
 * ============================================================
 * File: app/faq/page.tsx
 * Project: BizPilot AI
 * Description: Public FAQ for the universal smart-intake product and cleaning-first founder pilot.
 * Role: Separates current capabilities, human-control boundaries, pilot terms, and roadmap integrations clearly.
 * Related:
 * - components/public/bizpilot-v2-page.tsx
 * - lib/i18n/public-v2-copy.ts
 * Author: MoOoH
 * Created: 2026-06-21
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
    getPublicV2Copy(language).faq.meta,
    language,
  );
}

export default async function FaqPage({ searchParams }: FaqPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const copy = getPublicV2Copy(language).faq;

  return (
    <BizPilotV2Page
      copy={copy}
      faqItems={copy.items}
      language={language}
      path="/faq"
    />
  );
}
