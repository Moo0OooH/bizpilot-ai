/**
 * ============================================================
 * File: lib/i18n/public-href.ts
 * Project: BizPilot AI
 * Description: Builds locale-preserving hrefs for the public marketing site.
 * Role: Keeps fr-CA visitors on localized public routes during internal navigation.
 * Related:
 * - components/public/marketing-ui.tsx
 * - components/public/pilot-request-template-card.tsx
 * - tests/unit/public-language-links.test.mts
 * Author: MoOoH
 * Created: 2026-07-12
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Added centralized fr-CA query preservation for public links.
 * ============================================================
 */

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "./language.ts";

const publicHrefBase = "https://bizpilot.local";

/** Preserves the active public locale without changing external or hash-only links. */
export function publicHref(href: string, language?: SupportedLanguage): string {
  if (
    language !== "fr-CA" ||
    language === DEFAULT_LANGUAGE ||
    !href.startsWith("/")
  ) {
    return href;
  }

  const url = new URL(href, publicHrefBase);
  url.searchParams.set("language", language);

  return `${url.pathname}${url.search}${url.hash}`;
}
