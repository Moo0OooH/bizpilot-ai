#!/usr/bin/env python3
"""Apply the last explicit V2 copy and verification corrections."""

from pathlib import Path


def ensure_replace(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    if old in text:
        file.write_text(text.replace(old, new), encoding="utf-8")
        return
    if new not in text:
        raise SystemExit(f"Neither expected nor corrected source exists in {path}: {old!r}")


ensure_replace(
    "lib/i18n/public-v2-copy.ts",
    "Gmail, WhatsApp, Instagram, Messenger, and SMS connections can be explored after validation. Today, the honest workflow begins with the smart intake link.",
    "Gmail, WhatsApp, Instagram, Messenger, and SMS connections are roadmap items that can be explored after validation. Today, the honest workflow begins with the smart intake link.",
)
ensure_replace(
    "lib/i18n/public-v2-copy.ts",
    "Gmail, WhatsApp, Instagram, Messenger et les SMS pourront etre explores apres validation. Aujourd'hui, le flux commence honnetement par le lien intelligent.",
    "Gmail, WhatsApp, Instagram, Messenger et les SMS sont des integrations de la feuille de route a explorer apres validation. Aujourd'hui, le flux commence honnetement par le lien intelligent.",
)
ensure_replace(
    "tests/unit/public-v2-positioning.test.mts",
    'assert.match(english.features.notice?.body ?? "", /after validation/i);',
    'assert.match(english.features.notice?.body ?? "", /roadmap/i);',
)
ensure_replace(
    "tests/unit/seo-source.test.mts",
    '''assert.equal(jsonLd.includes('replaceAll("<", "\\u003c")'), true);''',
    '''assert.equal(jsonLd.includes('replaceAll("<", "\\\\u003c")'), true);''',
)
ensure_replace(
    "tests/unit/i18n-copy.test.mts",
    '''const finalPublicRouteSourceFiles = [
  "app/page.tsx",
  "app/faq/page.tsx",
  "app/comparison/page.tsx",
  "app/features/page.tsx",
  "app/industries/cleaning/page.tsx",
  "app/trust/page.tsx",
  "app/demo/page.tsx",
  "app/pricing/page.tsx",
  "app/pilot/page.tsx",
  "app/content-studio/page.tsx",
  "app/privacy/page.tsx",
  "app/security/page.tsx",
  "app/terms/page.tsx",
  "app/auth/sign-in/page.tsx",
  "app/auth/sign-up/page.tsx",
  "app/auth/forgot-password/page.tsx",
  "app/auth/reset-password/page.tsx",
  "app/auth/check-email/page.tsx",
  "app/(public)/quote/[slug]/page.tsx",
  "components/public/quote-form-wizard.tsx",
] as const;

''',
    "",
)

print("Final V2 verification corrections applied.")
