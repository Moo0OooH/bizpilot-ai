/**
 * ============================================================
 * File: lib/seo.ts
 * Project: BizPilot AI
 * Description: Public SEO helpers for canonical URLs, localized metadata, sitemap, and robots.
 * Role: Keeps public-route metadata consistent without adding a routing framework.
 * Related:
 * - app/sitemap.ts
 * - app/robots.ts
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-21: Added the dedicated public FAQ route to canonical metadata helpers.
 * ============================================================
 */

import type { Metadata } from "next";

import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  readSupportedLanguage,
  type SupportedLanguage,
} from "./i18n/language.ts";

export type PublicRouteSearchParams = Promise<
  | {
      language?: string | string[];
    }
  | undefined
>;

type PublicMetaCopy = Readonly<{
  description: string;
  title: string;
}>;

export const PUBLIC_SITE_ORIGIN = "https://bizpilo.com";
export const PUBLIC_SITE_NAME = "BizPilot AI";

export const publicCanonicalRoutes = [
  "/",
  "/faq",
  "/features",
  "/industries/cleaning",
  "/trust",
  "/demo",
  "/pricing",
  "/pilot",
  "/content-studio",
  "/privacy",
  "/security",
  "/terms",
] as const;

export type PublicCanonicalRoute = (typeof publicCanonicalRoutes)[number];

export function getPublicSiteOrigin(): string {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!rawUrl) {
    return PUBLIC_SITE_ORIGIN;
  }

  try {
    const url = new URL(rawUrl);

    if (["127.0.0.1", "localhost"].includes(url.hostname)) {
      return PUBLIC_SITE_ORIGIN;
    }

    return url.origin;
  } catch {
    return PUBLIC_SITE_ORIGIN;
  }
}

export function publicUrl(
  path: PublicCanonicalRoute,
  language: SupportedLanguage = DEFAULT_LANGUAGE,
): string {
  const url = new URL(path, getPublicSiteOrigin());

  if (language !== DEFAULT_LANGUAGE) {
    url.searchParams.set("language", language);
  }

  return url.toString();
}

export function publicLanguageAlternates(path: PublicCanonicalRoute) {
  return {
    "en-CA": publicUrl(path, "en"),
    "fr-CA": publicUrl(path, "fr-CA"),
    "x-default": publicUrl(path, "en"),
  } as const;
}

export function buildPublicMetadata(
  path: PublicCanonicalRoute,
  copy: PublicMetaCopy,
  language: SupportedLanguage,
): Metadata {
  const canonical = publicUrl(path, language);
  const locale = language === "fr-CA" ? "fr_CA" : "en_CA";

  return {
    alternates: {
      canonical,
      languages: publicLanguageAlternates(path),
    },
    description: copy.description,
    metadataBase: new URL(getPublicSiteOrigin()),
    openGraph: {
      description: copy.description,
      locale,
      siteName: PUBLIC_SITE_NAME,
      title: copy.title,
      type: "website",
      url: canonical,
    },
    title: copy.title,
    twitter: {
      card: "summary",
      description: copy.description,
      title: copy.title,
    },
  };
}

export function buildNoIndexMetadata(copy: PublicMetaCopy): Metadata {
  return {
    description: copy.description,
    metadataBase: new URL(getPublicSiteOrigin()),
    robots: {
      follow: false,
      index: false,
    },
    title: copy.title,
  };
}

export async function resolvePublicRouteLanguage(
  searchParams: PublicRouteSearchParams | undefined,
  cookieLanguage: unknown,
): Promise<SupportedLanguage> {
  const params = await searchParams;
  const requestedLanguage = Array.isArray(params?.language)
    ? params?.language[0]
    : params?.language;

  return isSupportedLanguage(requestedLanguage)
    ? requestedLanguage
    : readSupportedLanguage(cookieLanguage);
}
