/**
 * ============================================================
 * File: app/(public)/quote/page.tsx
 * Project: BizPilot AI
 * Description: Base public quote route for incomplete quote links.
 * Role: Renders a localized safe state instead of a generic 404.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - components/public/quote-unavailable.tsx
 * Author: MoOoH
 * Created: 2026-05-25
 * ============================================================
 */

import { cookies } from "next/headers";

import { QuoteUnavailable } from "@/components/public/quote-unavailable";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";

export const dynamic = "force-dynamic";

export default async function QuoteBasePage() {
  const cookieStore = await cookies();
  const language = readSupportedLanguage(
    cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );

  return <QuoteUnavailable language={language} />;
}
