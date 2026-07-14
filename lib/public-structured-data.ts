/*
 * ============================================================
 * File: lib/public-structured-data.ts
 * Project: BizPilot AI
 * Description: Structured-data builders for public marketing routes.
 * Role: Keeps JSON-LD honest, localized, and aligned with the universal smart-intake core and cleaning-first pilot.
 * Related:
 * - components/public/json-ld.tsx
 * - lib/seo.ts
 * - lib/i18n/public-v2-copy.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Repositioned public JSON-LD around smart service-business intake while preserving cleaning as the first complete pilot vertical.
 * - 2026-07-13: Corrected Canadian-French structured-data accents and terminology.
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
const serviceBusinessAudience = {
  "@type": "BusinessAudience",
  audienceType: "Local service business owners and owner-operated service teams",
} as const;
const coreWorkflowTopics = [
  "smart customer intake",
  "service-aware request forms",
  "missing-information detection",
  "owner-reviewed AI reply drafts",
  "manual customer follow-up",
  "cleaning business founder pilot",
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
      ? "Un espace de travail pour les entreprises de services qui recueille les demandes client avec un lien intelligent, organise les renseignements manquants et prépare des brouillons assistés par IA à valider. Le premier pilote complet vise les entreprises d’entretien."
      : "A smart customer-intake and reply workspace for service businesses that collects requests through one link, organizes missing information, and prepares AI-assisted drafts for owner review. The first complete pilot serves cleaning businesses.";

  return {
    "@id": publicAssetUrl("/#software"),
    "@type": "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    audience: serviceBusinessAudience,
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
      ? "Collecte intelligente de demandes client, organisation des renseignements manquants et brouillons assistés par IA avec validation et envoi manuels par le propriétaire."
      : "Smart customer request intake, missing-information organization, and AI-assisted reply drafts with manual owner review and sending.";
  const serviceOutput =
    language === "fr-CA"
      ? "Une demande client organisee, les renseignements manquants et un brouillon pret a verifier."
      : "An organized customer request, visible missing information, and a reply draft ready for owner review.";

  return {
    "@id": publicAssetUrl("/#service"),
    "@type": "Service",
    areaServed: "Canada",
    audience: serviceBusinessAudience,
    description,
    inLanguage: inLanguage(language),
    name:
      language === "fr-CA"
        ? "Espace intelligent de demandes client et de réponses"
        : "Smart customer intake and reply workspace",
    provider: {
      "@id": publicAssetUrl("/#organization"),
    },
    serviceOutput,
    serviceType: "Service-business customer intake and owner-reviewed reply workflow",
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
