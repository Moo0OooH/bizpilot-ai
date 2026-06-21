/**
 * ============================================================
 * File: app/(public)/quote/page.tsx
 * Project: BizPilot AI
 * Description: Base public quote route for incomplete quote links.
 * Role: Renders an end-customer safe state instead of leaking owner/admin language settings.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - components/public/quote-unavailable.tsx
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-21: Added localized noindex metadata for incomplete quote links.
 * ============================================================
 */

import { QuoteUnavailable } from "@/components/public/quote-unavailable";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { buildNoIndexMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type QuoteBasePageProps = Readonly<{
  searchParams?: Promise<{
    language?: string;
  }>;
}>;

function readQuoteBaseLanguage(query: Awaited<QuoteBasePageProps["searchParams"]>) {
  return query?.language
    ? readSupportedLanguage(query.language)
    : DEFAULT_LANGUAGE;
}

export async function generateMetadata({
  searchParams,
}: QuoteBasePageProps): Promise<Metadata> {
  const query = await searchParams;
  const language = readQuoteBaseLanguage(query);
  const copy = getBizPilotCopy(language).quotePage;

  return buildNoIndexMetadata({
    description: copy.unavailableBody,
    title: `${copy.unavailableTitle} | BizPilot AI`,
  });
}

export default async function QuoteBasePage({
  searchParams,
}: QuoteBasePageProps) {
  const query = await searchParams;
  const language = readQuoteBaseLanguage(query);

  return <QuoteUnavailable language={language} pathname="/quote" />;
}
