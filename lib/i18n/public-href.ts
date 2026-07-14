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
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Normalized both locale directions so English removes stale language queries while fr-CA replaces them without dropping other URL state.
 * - 2026-07-12: Added centralized fr-CA query preservation for public links.
 * ============================================================
 */

import type { SupportedLanguage } from "./language.ts";

const publicHrefBase = "https://bizpilot.local";

/** Applies the selected public locale without changing external or hash-only links. */
export function publicHref(href: string, language?: SupportedLanguage): string {
  if (
    !language ||
    !href.startsWith("/")
  ) {
    return href;
  }

  const url = new URL(href, publicHrefBase);
  if (language === "fr-CA") {
    url.searchParams.set("language", language);
  } else {
    url.searchParams.delete("language");
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

/** Sends an explicit locale signal so the request proxy can update persistence. */
export function publicLanguageHref(
  href: string,
  language: SupportedLanguage,
): string {
  if (!href.startsWith("/")) {
    return href;
  }

  const url = new URL(href, publicHrefBase);
  url.searchParams.set("language", language);
  return `${url.pathname}${url.search}${url.hash}`;
}
