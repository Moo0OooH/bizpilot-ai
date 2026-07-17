/**
 * ============================================================
 * File: lib/quote-form-layout.ts
 * Project: BizPilot AI
 * Description: Defines the versioned, bilingual public quote-form layout contract.
 * Role: Normalizes owner-authored form headers/sections, resolves legacy field grouping,
 *       and encodes public-safe layout metadata without requiring a database migration.
 * Related:
 * - server/repositories/business-configuration.repository.ts
 * - server/repositories/public-intake.repository.ts
 * - components/public/quote-form-wizard.tsx
 * Author: MoOoH
 * Created: 2026-07-17
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Created the V1 layout, localization, merge, and legacy options contract.
 * ============================================================
 */

import { getBizPilotCopy } from "./i18n/bizpilot-copy.ts";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage,
} from "./i18n/language.ts";
import { getPublicSiteCopy } from "./i18n/public-site-copy.ts";
import type { Json } from "../types/database.ts";

export const QUOTE_FORM_LAYOUT_VERSION = 1 as const;
export const MAX_QUOTE_FORM_SECTIONS = 8;
export const MAX_QUOTE_FORM_HEADER_TITLE_LENGTH = 100;
export const MAX_QUOTE_FORM_COPY_LENGTH = 240;
export const MAX_QUOTE_FORM_NAV_LABEL_LENGTH = 40;
export const MAX_QUOTE_FORM_SECTION_TITLE_LENGTH = 100;

export type QuoteFormDisplayMode = "list" | "steps" | "tabs";

export type QuoteFormHeaderTranslation = Readonly<{
  subtitle?: string;
  title?: string;
}>;

export type QuoteFormSectionTranslation = Readonly<{
  description?: string;
  navLabel?: string;
  title?: string;
}>;

export type QuoteFormHeader = Readonly<{
  subtitle?: string;
  title: string;
  translations?: Readonly<
    Partial<Record<SupportedLanguage, QuoteFormHeaderTranslation>>
  >;
}>;

export type QuoteFormSection = Readonly<{
  description?: string;
  isHidden?: boolean;
  key: string;
  navLabel: string;
  sortOrder: number;
  title: string;
  translations?: Readonly<
    Partial<Record<SupportedLanguage, QuoteFormSectionTranslation>>
  >;
}>;

export type QuoteFormLayout = Readonly<{
  displayMode: QuoteFormDisplayMode;
  header: QuoteFormHeader;
  sections: readonly QuoteFormSection[];
  version: typeof QUOTE_FORM_LAYOUT_VERSION;
}>;

export type DecodedPublicQuoteFieldOptions = Readonly<{
  choices: string[];
  formLayout?: QuoteFormLayout;
  sectionKey?: string;
}>;

const displayModes: readonly QuoteFormDisplayMode[] = [
  "list",
  "tabs",
  "steps",
];
const sectionKeyPattern = /^[a-z][a-z0-9_]*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readBoundedText(value: unknown, maximum: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, maximum) : undefined;
}

function readChoiceList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, 20);
}

export function isQuoteFormSectionKey(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 48 &&
    sectionKeyPattern.test(value)
  );
}

function readHeaderTranslation(
  value: unknown,
): QuoteFormHeaderTranslation | undefined {
  if (!isRecord(value)) return undefined;

  const subtitle = readBoundedText(value.subtitle, MAX_QUOTE_FORM_COPY_LENGTH);
  const title = readBoundedText(
    value.title,
    MAX_QUOTE_FORM_HEADER_TITLE_LENGTH,
  );

  return subtitle || title
    ? { ...(subtitle ? { subtitle } : {}), ...(title ? { title } : {}) }
    : undefined;
}

function readHeaderTranslations(
  value: unknown,
): QuoteFormHeader["translations"] | undefined {
  if (!isRecord(value)) return undefined;

  const translations: Partial<
    Record<SupportedLanguage, QuoteFormHeaderTranslation>
  > = {};

  for (const language of supportedLanguages) {
    const translation = readHeaderTranslation(value[language]);
    if (translation) translations[language] = translation;
  }

  return Object.keys(translations).length > 0 ? translations : undefined;
}

function readSectionTranslation(
  value: unknown,
): QuoteFormSectionTranslation | undefined {
  if (!isRecord(value)) return undefined;

  const description = readBoundedText(
    value.description,
    MAX_QUOTE_FORM_COPY_LENGTH,
  );
  const navLabel = readBoundedText(
    value.navLabel,
    MAX_QUOTE_FORM_NAV_LABEL_LENGTH,
  );
  const title = readBoundedText(
    value.title,
    MAX_QUOTE_FORM_SECTION_TITLE_LENGTH,
  );

  return description || navLabel || title
    ? {
        ...(description ? { description } : {}),
        ...(navLabel ? { navLabel } : {}),
        ...(title ? { title } : {}),
      }
    : undefined;
}

function readSectionTranslations(
  value: unknown,
): QuoteFormSection["translations"] | undefined {
  if (!isRecord(value)) return undefined;

  const translations: Partial<
    Record<SupportedLanguage, QuoteFormSectionTranslation>
  > = {};

  for (const language of supportedLanguages) {
    const translation = readSectionTranslation(value[language]);
    if (translation) translations[language] = translation;
  }

  return Object.keys(translations).length > 0 ? translations : undefined;
}

function createDefaultLayout(): QuoteFormLayout {
  const englishForm = getBizPilotCopy("en").quoteForm;
  const frenchForm = getBizPilotCopy("fr-CA").quoteForm;
  const englishShell = getPublicSiteCopy("en").quoteShell;
  const frenchShell = getPublicSiteCopy("fr-CA").quoteShell;

  return {
    displayMode: "list",
    header: {
      subtitle: englishShell.subtitle,
      title: englishShell.title,
      translations: {
        en: {
          subtitle: englishShell.subtitle,
          title: englishShell.title,
        },
        "fr-CA": {
          subtitle: frenchShell.subtitle,
          title: frenchShell.title,
        },
      },
    },
    sections: englishForm.steps.map((step, index) => {
      const frenchStep = frenchForm.steps.find((item) => item.id === step.id);

      return {
        description: step.description,
        isHidden: false,
        key: step.id,
        navLabel: step.label,
        sortOrder: (index + 1) * 10,
        title: step.title,
        translations: {
          en: {
            description: step.description,
            navLabel: step.label,
            title: step.title,
          },
          ...(frenchStep
            ? {
                "fr-CA": {
                  description: frenchStep.description,
                  navLabel: frenchStep.label,
                  title: frenchStep.title,
                },
              }
            : {}),
        },
      };
    }),
    version: QUOTE_FORM_LAYOUT_VERSION,
  };
}

const defaultQuoteFormLayout = createDefaultLayout();

export function getDefaultQuoteFormLayout(
  language?: unknown,
): QuoteFormLayout {
  return language === undefined
    ? defaultQuoteFormLayout
    : localizeQuoteFormLayout({
        language,
        layout: defaultQuoteFormLayout,
      });
}

function parseHeader(value: unknown): QuoteFormHeader | null {
  if (!isRecord(value)) return null;

  const title = readBoundedText(
    value.title,
    MAX_QUOTE_FORM_HEADER_TITLE_LENGTH,
  );
  if (!title) return null;

  const subtitle = readBoundedText(value.subtitle, MAX_QUOTE_FORM_COPY_LENGTH);
  const translations = readHeaderTranslations(value.translations);

  return {
    ...(subtitle ? { subtitle } : {}),
    title,
    ...(translations ? { translations } : {}),
  };
}

function parseSection(value: unknown): QuoteFormSection | null {
  if (!isRecord(value) || !isQuoteFormSectionKey(value.key)) return null;

  const navLabel = readBoundedText(
    value.navLabel,
    MAX_QUOTE_FORM_NAV_LABEL_LENGTH,
  );
  const title = readBoundedText(
    value.title,
    MAX_QUOTE_FORM_SECTION_TITLE_LENGTH,
  );
  if (!navLabel || !title) return null;

  const description = readBoundedText(
    value.description,
    MAX_QUOTE_FORM_COPY_LENGTH,
  );
  const rawSortOrder =
    typeof value.sortOrder === "number" ? Math.trunc(value.sortOrder) : 0;
  const sortOrder =
    rawSortOrder >= 1 && rawSortOrder <= 999 ? rawSortOrder : 999;
  const translations = readSectionTranslations(value.translations);

  return {
    ...(description ? { description } : {}),
    isHidden: value.isHidden === true,
    key: value.key,
    navLabel,
    sortOrder,
    title,
    ...(translations ? { translations } : {}),
  };
}

export function parseQuoteFormLayout(value: unknown): QuoteFormLayout | null {
  if (
    !isRecord(value) ||
    value.version !== QUOTE_FORM_LAYOUT_VERSION ||
    !Array.isArray(value.sections)
  ) {
    return null;
  }

  const header = parseHeader(value.header);
  if (!header) return null;

  const seenKeys = new Set<string>();
  const sections = value.sections
    .slice(0, MAX_QUOTE_FORM_SECTIONS)
    .map(parseSection)
    .filter((section): section is QuoteFormSection => {
      if (!section || seenKeys.has(section.key)) return false;
      seenKeys.add(section.key);
      return true;
    })
    .sort((left, right) => left.sortOrder - right.sortOrder);

  if (sections.length === 0) return null;

  const displayMode =
    typeof value.displayMode === "string" &&
    displayModes.includes(value.displayMode as QuoteFormDisplayMode)
      ? (value.displayMode as QuoteFormDisplayMode)
      : "list";

  return {
    displayMode,
    header,
    sections,
    version: QUOTE_FORM_LAYOUT_VERSION,
  };
}

export function normalizeQuoteFormLayout(
  value: unknown,
  fallback: QuoteFormLayout = defaultQuoteFormLayout,
): QuoteFormLayout {
  return parseQuoteFormLayout(value) ?? fallback;
}

export function localizeQuoteFormLayout(input: {
  language: unknown;
  layout: QuoteFormLayout;
}): QuoteFormLayout {
  const language = readSupportedLanguage(input.language);
  const headerTranslation = input.layout.header.translations?.[language];
  const localizedSubtitle =
    headerTranslation?.subtitle ?? input.layout.header.subtitle;
  const header: QuoteFormHeader = {
    ...(localizedSubtitle ? { subtitle: localizedSubtitle } : {}),
    title:
      headerTranslation?.title ??
      input.layout.header.title,
    ...(input.layout.header.translations
      ? { translations: input.layout.header.translations }
      : {}),
  };

  return {
    ...input.layout,
    header,
    sections: input.layout.sections.map((section) => {
      const translation = section.translations?.[language];
      const localizedDescription =
        translation?.description ?? section.description;

      return {
        ...section,
        ...(localizedDescription
          ? { description: localizedDescription }
          : {}),
        navLabel:
          translation?.navLabel ?? section.navLabel,
        title:
          translation?.title ?? section.title,
      };
    }),
  };
}

function mergeHeaderTranslations(input: {
  currentLanguage: SupportedLanguage;
  existing: QuoteFormHeader;
  incoming: QuoteFormHeader;
}): NonNullable<QuoteFormHeader["translations"]> {
  return {
    ...(input.existing.translations ?? {}),
    ...(input.incoming.translations ?? {}),
    [input.currentLanguage]: {
      ...(input.incoming.subtitle
        ? { subtitle: input.incoming.subtitle }
        : {}),
      title: input.incoming.title,
      ...(input.incoming.translations?.[input.currentLanguage] ?? {}),
    },
  };
}

function mergeSectionTranslations(input: {
  currentLanguage: SupportedLanguage;
  existing?: QuoteFormSection;
  incoming: QuoteFormSection;
}): NonNullable<QuoteFormSection["translations"]> {
  return {
    ...(input.existing?.translations ?? {}),
    ...(input.incoming.translations ?? {}),
    [input.currentLanguage]: {
      ...(input.incoming.description
        ? { description: input.incoming.description }
        : {}),
      navLabel: input.incoming.navLabel,
      title: input.incoming.title,
      ...(input.incoming.translations?.[input.currentLanguage] ?? {}),
    },
  };
}

export function mergeQuoteFormLayoutsForLanguage(input: {
  currentLanguage: unknown;
  existing: QuoteFormLayout;
  incoming: QuoteFormLayout;
}): QuoteFormLayout {
  const currentLanguage = readSupportedLanguage(input.currentLanguage);
  const existingByKey = new Map(
    input.existing.sections.map((section) => [section.key, section]),
  );

  return {
    ...input.incoming,
    header: {
      ...input.incoming.header,
      translations: mergeHeaderTranslations({
        currentLanguage,
        existing: input.existing.header,
        incoming: input.incoming.header,
      }),
    },
    sections: input.incoming.sections.map((section) => {
      const existing = existingByKey.get(section.key);

      return {
        ...section,
        translations: mergeSectionTranslations({
          currentLanguage,
          ...(existing ? { existing } : {}),
          incoming: section,
        }),
      };
    }),
  };
}

export function inferLegacyQuoteSectionKey(fieldKey: string): string {
  const key = fieldKey.toLowerCase();

  if (
    key.includes("contact") ||
    key.includes("customer_name") ||
    key.includes("email") ||
    key.includes("courriel") ||
    key.includes("message") ||
    key.includes("name") ||
    key.includes("nom") ||
    key.includes("note") ||
    key.includes("phone") ||
    key.includes("telephone")
  ) {
    return "contact";
  }

  if (
    key.includes("service_type") ||
    key.includes("cleaning_type") ||
    key.includes("type_nettoyage") ||
    key.includes("property") ||
    key.includes("propriete") ||
    key.includes("bedroom") ||
    key.includes("chambre") ||
    key.includes("bathroom") ||
    key.includes("salle_bain") ||
    key.includes("square") ||
    key.includes("superficie") ||
    key.includes("size") ||
    key.includes("pet") ||
    key.includes("animaux")
  ) {
    return "service";
  }

  if (
    key.includes("date") ||
    key.includes("time") ||
    key.includes("schedule") ||
    key.includes("horaire") ||
    key.includes("city") ||
    key.includes("ville") ||
    key.includes("area") ||
    key.includes("secteur") ||
    key.includes("location") ||
    key.includes("emplacement") ||
    key.includes("address") ||
    key.includes("adresse") ||
    key.includes("postal")
  ) {
    return "when_where";
  }

  return "contact";
}

export function resolveQuoteFieldSectionKey(input: {
  fieldKey: string;
  formLayout: QuoteFormLayout;
  sectionKey?: unknown;
}): string {
  const allSectionKeys = new Set(
    input.formLayout.sections.map((section) => section.key),
  );
  const visibleSections = input.formLayout.sections.filter(
    (section) => !section.isHidden,
  );
  const visibleSectionKeys = new Set(
    visibleSections.map((section) => section.key),
  );
  if (
    isQuoteFormSectionKey(input.sectionKey) &&
    allSectionKeys.has(input.sectionKey)
  ) {
    return input.sectionKey;
  }

  const inferred = inferLegacyQuoteSectionKey(input.fieldKey);
  if (visibleSectionKeys.has(inferred)) return inferred;

  return visibleSections[0]?.key ?? input.formLayout.sections[0]?.key ?? "contact";
}

function serializeHeaderTranslations(
  translations: QuoteFormHeader["translations"],
): Json | undefined {
  if (!translations) return undefined;
  const result: Record<string, Json> = {};

  for (const language of supportedLanguages) {
    const translation = translations[language];
    if (!translation) continue;
    result[language] = {
      ...(translation.subtitle ? { subtitle: translation.subtitle } : {}),
      ...(translation.title ? { title: translation.title } : {}),
    };
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function serializeSectionTranslations(
  translations: QuoteFormSection["translations"],
): Json | undefined {
  if (!translations) return undefined;
  const result: Record<string, Json> = {};

  for (const language of supportedLanguages) {
    const translation = translations[language];
    if (!translation) continue;
    result[language] = {
      ...(translation.description
        ? { description: translation.description }
        : {}),
      ...(translation.navLabel ? { navLabel: translation.navLabel } : {}),
      ...(translation.title ? { title: translation.title } : {}),
    };
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

export function serializeQuoteFormLayout(layout: QuoteFormLayout): Json {
  const headerTranslations = serializeHeaderTranslations(
    layout.header.translations,
  );

  return {
    displayMode: layout.displayMode,
    header: {
      ...(layout.header.subtitle ? { subtitle: layout.header.subtitle } : {}),
      title: layout.header.title,
      ...(headerTranslations ? { translations: headerTranslations } : {}),
    },
    sections: layout.sections.map((section) => {
      const translations = serializeSectionTranslations(section.translations);

      return {
        ...(section.description ? { description: section.description } : {}),
        isHidden: section.isHidden === true,
        key: section.key,
        navLabel: section.navLabel,
        sortOrder: section.sortOrder,
        title: section.title,
        ...(translations ? { translations } : {}),
      };
    }),
    version: QUOTE_FORM_LAYOUT_VERSION,
  };
}

export function decodePublicQuoteFieldOptions(
  value: Json,
): DecodedPublicQuoteFieldOptions {
  if (Array.isArray(value)) {
    return { choices: readChoiceList(value) };
  }

  if (!isRecord(value)) return { choices: [] };

  const choices = readChoiceList(value.choices);
  const sectionKey = isQuoteFormSectionKey(value.sectionKey)
    ? value.sectionKey
    : undefined;
  const formLayout = parseQuoteFormLayout(value.formLayout);

  return {
    choices,
    ...(formLayout ? { formLayout } : {}),
    ...(sectionKey ? { sectionKey } : {}),
  };
}

export function encodePublicQuoteFieldOptions(input: {
  choices: Json;
  formLayout: QuoteFormLayout;
  sectionKey: string;
}): Json {
  return {
    choices: readChoiceList(input.choices),
    formLayout: serializeQuoteFormLayout(input.formLayout),
    sectionKey: isQuoteFormSectionKey(input.sectionKey)
      ? input.sectionKey
      : inferLegacyQuoteSectionKey(input.sectionKey),
  };
}

export function getPublicQuoteFieldChoices(value: Json): string[] {
  return decodePublicQuoteFieldOptions(value).choices;
}

export function createQuoteFormTranslationForLanguage(input: {
  description?: string;
  language: SupportedLanguage;
  navLabel: string;
  title: string;
}): QuoteFormSection["translations"] {
  return {
    [input.language]: {
      ...(input.description ? { description: input.description } : {}),
      navLabel: input.navLabel,
      title: input.title,
    },
  };
}

export const DEFAULT_QUOTE_FORM_LAYOUT_LANGUAGE = DEFAULT_LANGUAGE;
