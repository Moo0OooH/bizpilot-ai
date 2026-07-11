/**
 * ============================================================
 * File: lib/public-structured-data.ts
 * Project: BizPilot AI
 * Description: Structured-data builders for public marketing routes.
 * Role: Keeps JSON-LD honest, localized, and aligned with manual-first product truth.
 * Related:
 * - components/public/json-ld.tsx
 * - lib/seo.ts
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-11
 * Change Log:
 * - 2026-07-11: Allowed breadcrumb JSON-LD to reference noindex public roadmap routes without adding them to canonical SEO routes.
 * - 2026-07-05: Localized service-output JSON-LD for Canadian French visitors.
 * - 2026-07-05: Added honest audience and feature context to public JSON-LD.
 * - 2026-07-04: Created structured-data builders for public marketing routes.
 * ============================================================
 */

import type { SupportedLanguage } from "./i18n/language.ts";
import { DEFAULT_LANGUAGE } from "./i18n/language.ts";
import {
  getPublicSiteOrigin,
  PUBLIC_SITE_NAME,
  publicAssetUrl,
  publicUrl,
  type PublicCanonicalRoute,
} from "./seo.ts";

export type JsonLdPrimitive = boolean | number | string | null;
export type JsonLdValue =
  | JsonLdPrimitive
  | readonly JsonLdValue[]
  | { readonly [key: string]: JsonLdValue };

type FaqJsonLdItem = Readonly<{
  answer: string;
  question: string;
}>;

type BreadcrumbItem = Readonly<{
  name: string;
  path: PublicCanonicalRoute | "/content-studio";
}>;

const context = "https://schema.org";
const availableLanguages = ["en-CA", "fr-CA"] as const;
const cleaningOwnerAudience = {
  "@type": "BusinessAudience",
  audienceType: "Cleaning business owners",
} as const;
const coreWorkflowTopics = [
  "cleaning quote requests",
  "manual lead recovery",
  "owner-reviewed AI drafts",
  "quote link intake",
  "service business follow-up",
] as const;

function inLanguage(language: SupportedLanguage): "en-CA" | "fr-CA" {
  return language === "fr-CA" ? "fr-CA" : "en-CA";
}

function publicBreadcrumbUrl(
  path: BreadcrumbItem["path"],
  language: SupportedLanguage,
): string {
  const url = new URL(path, getPublicSiteOrigin());

  if (language !== DEFAULT_LANGUAGE) {
    url.searchParams.set("language", language);
  }

  return url.toString();
}

function organizationJsonLd() {
  return {
    "@id": publicAssetUrl("/#organization"),
    "@type": "Organization",
    availableLanguage: availableLanguages,
    knowsAbout: coreWorkflowTopics,
    name: PUBLIC_SITE_NAME,
    url: publicUrl("/"),
  } as const;
}

function websiteJsonLd(language: SupportedLanguage) {
  return {
    "@id": publicAssetUrl("/#website"),
    "@type": "WebSite",
    about: {
      "@id": publicAssetUrl("/#service"),
    },
    availableLanguage: availableLanguages,
    inLanguage: inLanguage(language),
    name: PUBLIC_SITE_NAME,
    publisher: {
      "@id": publicAssetUrl("/#organization"),
    },
    url: publicUrl("/", language),
  } as const;
}

function softwareApplicationJsonLd(language: SupportedLanguage) {
  const description =
    language === "fr-CA"
      ? "Un espace de travail manuel pour aider les entreprises de nettoyage a capter les demandes, organiser les prospects et preparer des brouillons de reponse a valider."
      : "A manual-first workspace for cleaning businesses to capture quote requests, organize leads, and prepare owner-reviewed reply drafts.";

  return {
    "@id": publicAssetUrl("/#software"),
    "@type": "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    audience: cleaningOwnerAudience,
    description,
    featureList: coreWorkflowTopics,
    inLanguage: inLanguage(language),
    name: PUBLIC_SITE_NAME,
    operatingSystem: "Web",
    publisher: {
      "@id": publicAssetUrl("/#organization"),
    },
    url: publicUrl("/", language),
  } as const;
}

function serviceJsonLd(language: SupportedLanguage) {
  const description =
    language === "fr-CA"
      ? "Recuperation de demandes de soumission pour entreprises de nettoyage avec brouillons IA a valider et envoi manuel."
      : "Lead recovery for cleaning businesses with owner-reviewed AI drafts and manual sending.";
  const serviceOutput =
    language === "fr-CA"
      ? "Brouillons de reponse a valider et file organisee de demandes de soumission."
      : "Owner-reviewed response drafts and an organized quote request queue.";

  return {
    "@id": publicAssetUrl("/#service"),
    "@type": "Service",
    areaServed: "Canada",
    audience: cleaningOwnerAudience,
    description,
    inLanguage: inLanguage(language),
    name:
      language === "fr-CA"
        ? "Recuperation de demandes de soumission"
        : "Cleaning quote lead recovery",
    provider: {
      "@id": publicAssetUrl("/#organization"),
    },
    serviceOutput,
    serviceType: "Cleaning business lead recovery workflow",
    url: publicUrl("/", language),
  } as const;
}

export function buildHomeJsonLd(language: SupportedLanguage): JsonLdValue {
  return {
    "@context": context,
    "@graph": [
      organizationJsonLd(),
      websiteJsonLd(language),
      softwareApplicationJsonLd(language),
      serviceJsonLd(language),
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: readonly BreadcrumbItem[],
  language: SupportedLanguage,
): JsonLdValue {
  return {
    "@context": context,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: publicBreadcrumbUrl(item.path, language),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function buildFaqPageJsonLd(
  items: readonly FaqJsonLdItem[],
  language: SupportedLanguage,
): JsonLdValue {
  return {
    "@context": context,
    "@type": "FAQPage",
    inLanguage: inLanguage(language),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
      name: item.question,
    })),
  };
}
