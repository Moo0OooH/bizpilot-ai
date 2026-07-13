#!/usr/bin/env python3
"""Apply final V2 runtime, navigation, metadata, and source-header alignment."""

from pathlib import Path


def replace(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    if old in text:
        file.write_text(text.replace(old, new), encoding="utf-8")
        return
    if new not in text:
        raise SystemExit(f"Neither expected nor final source exists in {path}: {old!r}")


replace(
    "lib/i18n/public-v2-fr-copy.ts",
    "export function buildPublicV2FrenchCopy(): PublicV2Copy {",
    "export function buildPublicV2FrenchCopy(legacyCopy: PublicV2Copy): PublicV2Copy {\n  void legacyCopy;",
)
replace(
    "lib/i18n/public-v2-copy.ts",
    'import type { HomeNavCopy } from "./home-copy.ts";',
    'import type { HomeNavCopy } from "./home-copy.ts";\nimport { buildPublicV2FrenchCopy } from "./public-v2-fr-copy.ts";',
)
replace(
    "lib/i18n/public-v2-copy.ts",
    'return readSupportedLanguage(language) === "fr-CA" ? frenchCopy : englishCopy;',
    'return readSupportedLanguage(language) === "fr-CA"\n    ? buildPublicV2FrenchCopy(frenchCopy)\n    : englishCopy;',
)

for path in (
    "app/content-studio/page.tsx",
    "app/quote-link-guide/page.tsx",
    "app/faster-quote-replies/page.tsx",
    "app/privacy/page.tsx",
    "app/security/page.tsx",
    "app/terms/page.tsx",
):
    replace(
        path,
        'import { getHomeCopy } from "@/lib/i18n/home-copy";',
        'import { getPublicV2NavCopy } from "@/lib/i18n/public-v2-copy";',
    )
    replace(path, "getHomeCopy(language).nav", "getPublicV2NavCopy(language)")

replace(
    "components/public/marketing-ui.tsx",
    'brandSubtitle: "Lead recovery for cleaning businesses",',
    'brandSubtitle: "Smart customer intake and reply workspace",',
)
replace(
    "components/public/marketing-ui.tsx",
    'cleaning: "Cleaning",',
    'cleaning: "Cleaning pilot",',
)
replace(
    "components/public/marketing-ui.tsx",
    'comparison: "Comparison",',
    'comparison: "Compare",',
)
replace(
    "components/public/marketing-ui.tsx",
    'features: "Features",',
    'features: "Product",',
)
replace(
    "components/public/marketing-ui.tsx",
    'guide: "Quote link guide",',
    'guide: "Intake link guide",',
)
replace(
    "components/public/marketing-ui.tsx",
    'languageLabel: "Homepage language",',
    'languageLabel: "Website language",',
)
replace(
    "components/public/marketing-ui.tsx",
    'startFull: "Join founder pilot",',
    'startFull: "Apply for the founder pilot",',
)
replace(
    "components/public/marketing-ui.tsx",
    'startShort: "Join pilot",',
    'startShort: "Apply for pilot",',
)

replace(
    "lib/seo.ts",
    'alt: "BizPilot AI lead recovery workspace preview",',
    'alt: "BizPilot AI smart customer intake and reply workspace preview",',
)
replace(
    "lib/seo.ts",
    " * - lib/i18n/public-site-copy.ts",
    " * - lib/i18n/public-v2-copy.ts",
)
replace(
    "lib/seo.ts",
    " * Last Updated: 2026-07-05",
    " * Last Updated: 2026-07-13",
)

replace(
    "app/content-studio/page.tsx",
    " * Role: Labels Content Studio as roadmap while preserving cleaning-first lead recovery scope.",
    " * Role: Labels Content Studio as roadmap while preserving the current smart-intake and owner-reviewed reply scope.",
)
replace(
    "app/privacy/page.tsx",
    " * Description: Public privacy notice route for pilot-stage quote recovery.",
    " * Description: Public privacy notice route for the pilot-stage smart-intake workspace.",
)
replace(
    "app/security/page.tsx",
    " * Description: Public security posture route for pilot-stage quote recovery.",
    " * Description: Public security posture route for the pilot-stage smart-intake workspace.",
)
replace(
    "app/terms/page.tsx",
    " * Description: Public pilot terms route for founder-led quote recovery.",
    " * Description: Public pilot terms route for the founder-led smart-intake workflow.",
)

print("Final public V2 activation patch applied.")
