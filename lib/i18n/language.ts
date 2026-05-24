/**
 * ============================================================
 * File: lib/i18n/language.ts
 * Project: BizPilot AI
 * Description: MVP-safe language primitives for Quebec/Canada pilot support.
 * Role: Keeps business-level language support explicit without adding a full i18n framework.
 * Related:
 * - lib/i18n/bizpilot-copy.ts
 * - server/services/business-configuration.service.ts
 * - server/services/public-intake.service.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * ============================================================
 */

export type TextDirection = "ltr" | "rtl";

export type LanguageDefinition = Readonly<{
  aiInstruction: string;
  code: string;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  textDirection: TextDirection;
}>;

export const languageDefinitions = {
  en: {
    aiInstruction: "English",
    code: "en",
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
    textDirection: "ltr",
  },
  "fr-CA": {
    aiInstruction: "Canadian French for a Quebec cleaning business",
    code: "fr-CA",
    label: "Français (Canada)",
    nativeLabel: "Français (Canada)",
    shortLabel: "FR",
    textDirection: "ltr",
  },
} as const satisfies Record<string, LanguageDefinition>;

export type SupportedLanguage = keyof typeof languageDefinitions;

export const supportedLanguages = Object.keys(
  languageDefinitions,
) as SupportedLanguage[];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const INTERFACE_LANGUAGE_COOKIE = "bizpilot-interface-language";

export const languageLabels = Object.fromEntries(
  supportedLanguages.map((language) => [
    language,
    languageDefinitions[language].label,
  ]),
) as Record<SupportedLanguage, string>;

export const languageNativeLabels = Object.fromEntries(
  supportedLanguages.map((language) => [
    language,
    languageDefinitions[language].nativeLabel,
  ]),
) as Record<SupportedLanguage, string>;

export const languageShortLabels = Object.fromEntries(
  supportedLanguages.map((language) => [
    language,
    languageDefinitions[language].shortLabel,
  ]),
) as Record<SupportedLanguage, string>;

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    supportedLanguages.includes(value as SupportedLanguage)
  );
}

export function readSupportedLanguage(value: unknown): SupportedLanguage {
  return isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
}

export function resolveWorkspaceInterfaceLanguage(input: {
  businessLanguage?: unknown;
  cookieLanguage?: unknown;
}): SupportedLanguage {
  return isSupportedLanguage(input.businessLanguage)
    ? input.businessLanguage
    : readSupportedLanguage(input.cookieLanguage);
}

export function readSupportedLanguageOrThrow(value: string): SupportedLanguage {
  if (isSupportedLanguage(value)) {
    return value;
  }

  throw new Error("Invalid preferred language.");
}

export function getLanguageDefinition(
  language: unknown,
): LanguageDefinition {
  return languageDefinitions[readSupportedLanguage(language)];
}

export function aiLanguageInstruction(language: SupportedLanguage): string {
  return languageDefinitions[language].aiInstruction;
}
