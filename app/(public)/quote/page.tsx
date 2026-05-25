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
 * ============================================================
 */

import { QuoteUnavailable } from "@/components/public/quote-unavailable";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
} from "@/lib/i18n/language";

export const dynamic = "force-dynamic";

type QuoteBasePageProps = Readonly<{
  searchParams?: Promise<{
    language?: string;
  }>;
}>;

export default async function QuoteBasePage({
  searchParams,
}: QuoteBasePageProps) {
  const query = await searchParams;
  const language = query?.language
    ? readSupportedLanguage(query.language)
    : DEFAULT_LANGUAGE;

  return <QuoteUnavailable language={language} pathname="/quote" />;
}
