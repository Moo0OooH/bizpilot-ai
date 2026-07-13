#!/usr/bin/env python3
"""Temporarily migrate legacy public-site source tests to the universal V2 contracts."""

from pathlib import Path


def ensure_replace(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    if old in text:
        file.write_text(text.replace(old, new), encoding="utf-8")
        return
    if new not in text:
        raise SystemExit(f"Neither expected nor migrated source exists in {path}: {old!r}")


def replace_block(path: str, start: str, end: str, replacement: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    if replacement in text:
        return
    start_index = text.find(start)
    if start_index < 0:
        raise SystemExit(f"Start marker missing in {path}: {start}")
    end_index = text.find(end, start_index)
    if end_index < 0:
        raise SystemExit(f"End marker missing in {path}: {end}")
    file.write_text(
        text[:start_index] + replacement + "\n\n" + text[end_index:],
        encoding="utf-8",
    )


ensure_replace(
    "tests/unit/i18n-copy.test.mts",
    '} from "../../lib/i18n/public-site-copy.ts";\nimport {\n  languageDefinitions,',
    '} from "../../lib/i18n/public-site-copy.ts";\nimport { getPublicV2Copy } from "../../lib/i18n/public-v2-copy.ts";\nimport {\n  languageDefinitions,',
)

replace_block(
    "tests/unit/i18n-copy.test.mts",
    '  it("keeps final public routes wired to dictionaries instead of hardcoded marketing copy", () => {',
    '  it("keeps fr-CA public marketing copy localized and claim-equivalent", () => {',
    '''  it("keeps final public routes wired to the active dictionaries instead of hardcoded marketing copy", () => {
    const v2Routes = [
      "app/page.tsx",
      "app/features/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/pilot/page.tsx",
      "app/trust/page.tsx",
      "app/comparison/page.tsx",
      "app/faq/page.tsx",
      "app/industries/cleaning/page.tsx",
    ] as const;

    for (const file of v2Routes) {
      const source = readFileSync(file, "utf8");
      assert.equal(
        source.includes("getPublicV2Copy"),
        true,
        `${file} should read the active public V2 dictionary.`,
      );
      assert.equal(source.includes("generateMetadata"), true, file);
    }

    for (const file of [
      "app/content-studio/page.tsx",
      "app/quote-link-guide/page.tsx",
      "app/faster-quote-replies/page.tsx",
    ]) {
      assert.equal(
        readFileSync(file, "utf8").includes("getPublicSiteCopy"),
        true,
        `${file} should remain dictionary-backed until its own V2 migration.`,
      );
    }

    for (const file of [
      "app/privacy/page.tsx",
      "app/security/page.tsx",
      "app/terms/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      assert.equal(source.includes("getPolicyCopy"), true, file);
      assert.equal(source.includes("generateMetadata"), true, file);
    }

    const homepageSource = readFileSync("app/page.tsx", "utf8");
    assert.equal(homepageSource.includes("BizPilotV2Home"), true);
    for (const phrase of [
      "Stop losing cleaning quote requests to slow replies.",
      "Messages get buried",
      "Your next customer may already be waiting.",
      "AI drafts. You decide.",
    ]) {
      assert.equal(
        homepageSource.includes(phrase),
        false,
        `app/page.tsx should not keep hardcoded legacy phrase: ${phrase}`,
      );
    }

    const quoteWizardSource = readFileSync(
      "components/public/quote-form-wizard.tsx",
      "utf8",
    );
    assert.equal(quoteWizardSource.includes("copy.quoteForm.guardrail"), true);

    const proxySource = readFileSync("proxy.ts", "utf8");
    for (const authPath of [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/check-email",
    ]) {
      assert.equal(proxySource.includes(authPath), true, authPath);
    }
  });''',
)

replace_block(
    "tests/unit/i18n-copy.test.mts",
    '  it("keeps homepage cleaning use-case cards locked to six service anchors", () => {',
    '  it("keeps homepage compressed with a short FAQ and the full FAQ on a dedicated route", () => {',
    '''  it("keeps the universal homepage honest while cleaning remains the complete launch vertical", () => {
    const english = getPublicV2Copy("en");
    const serviceCards = english.cleaning.sections[0]?.cards ?? [];

    assert.equal(english.home.industries.cards.length, 4);
    assert.equal(english.home.industries.cards[0]?.title, "Cleaning");
    assert.match(english.home.industries.cards[0]?.badge ?? "", /Founder pilot/i);
    assert.equal(
      english.home.industries.cards.slice(1).every((card) =>
        /Roadmap template/i.test(card.badge ?? ""),
      ),
      true,
    );
    assert.deepEqual(
      serviceCards.map((card) => card.title),
      [
        "Residential cleaning",
        "Deep cleaning",
        "Move-in / move-out",
        "Office cleaning",
        "Airbnb turnover",
        "Post-construction",
      ],
    );

    for (const language of supportedLanguages) {
      const copy = getPublicV2Copy(language);
      assert.equal(copy.home.flow.steps.length, 5, language);
      assert.equal(copy.home.industries.cards.length, 4, language);
      assert.equal(copy.cleaning.sections[0]?.cards.length, 6, language);
    }

    const homepageSource = readFileSync(
      "components/public/bizpilot-v2-home.tsx",
      "utf8",
    );
    assert.equal(homepageSource.includes("copy.industries.cards.map"), true);
    assert.equal(homepageSource.includes("homepage-demo-grid"), true);
    assert.equal(homepageSource.includes("homepage-use-case-grid"), false);
  });''',
)

replace_block(
    "tests/unit/i18n-copy.test.mts",
    '  it("keeps homepage compressed with a short FAQ and the full FAQ on a dedicated route", () => {',
    '  it("keeps final supporting-page polish structure locked", () => {',
    '''  it("keeps the homepage focused while full product objections stay on the FAQ route", () => {
    const english = getPublicV2Copy("en");
    const questions = english.faq.items.map((item) => item.question);

    assert.equal(english.faq.items.length, 6);
    for (const question of [
      "Does BizPilot connect directly to Gmail, WhatsApp, Instagram, or SMS today?",
      "Does AI send messages automatically?",
      "Can BizPilot invent prices or confirm bookings?",
      "Is BizPilot only for cleaning businesses?",
      "What happens after a customer submits the intake form?",
      "Is BizPilot a CRM, booking platform, or invoicing system?",
    ]) {
      assert.equal(questions.includes(question), true, question);
    }

    const homepageSource = readFileSync(
      "components/public/bizpilot-v2-home.tsx",
      "utf8",
    );
    const faqSource = readFileSync("app/faq/page.tsx", "utf8");
    const sharedPageSource = readFileSync(
      "components/public/bizpilot-v2-page.tsx",
      "utf8",
    );

    assert.equal(homepageSource.includes("copy.faq.items.map"), false);
    assert.equal(faqSource.includes("faqItems={copy.items}"), true);
    assert.equal(faqSource.includes("getPublicV2Copy"), true);
    assert.equal(sharedPageSource.includes("buildFaqPageJsonLd"), true);
    assert.equal(readFileSync("proxy.ts", "utf8").includes('"/faq"'), true);
  });''',
)

replace_block(
    "tests/unit/i18n-copy.test.mts",
    '  it("keeps final supporting-page polish structure locked", () => {',
    '  it("keeps pilot Branch B conversion honest and non-submitting", () => {',
    '''  it("keeps final V2 supporting-page structure and product boundaries locked", () => {
    const english = getPublicV2Copy("en");

    assert.equal(english.features.sections.length, 3);
    assert.equal(
      english.features.sections.every((section) => section.cards.length === 3),
      true,
    );
    assert.equal(english.cleaning.sections[0]?.cards.length, 6);
    assert.equal(english.trust.sections.length, 2);
    assert.equal(
      english.trust.sections.every((section) => section.cards.length === 3),
      true,
    );
    assert.equal(english.demo.sections.length, 3);
    assert.equal(
      english.demo.sections.every((section) => section.cards.length === 3),
      true,
    );
    assert.equal(english.pilot.sections.length, 2);

    const pricingText = JSON.stringify(english.pricing);
    for (const value of [
      "$0 setup",
      "$149 setup + $49/month",
      "$199 setup + $79/month",
    ]) {
      assert.equal(pricingText.includes(value), true, value);
    }
    assert.match(english.features.notice?.badge ?? "", /Roadmap/i);
    assert.match(english.trust.notice?.badge ?? "", /Production gate/i);
    assert.match(english.pricing.notice?.badge ?? "", /Before any paid pilot/i);

    for (const file of [
      "app/features/page.tsx",
      "app/comparison/page.tsx",
      "app/industries/cleaning/page.tsx",
      "app/trust/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/faq/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      assert.equal(source.includes("BizPilotV2Page"), true, file);
      assert.equal(source.includes("getPublicV2Copy"), true, file);
    }

    const sharedPage = readFileSync(
      "components/public/bizpilot-v2-page.tsx",
      "utf8",
    );
    for (const required of [
      "copy.sections.map",
      "linksForRoute",
      "copy.notice",
      "bp-grid-three",
      "MarketingPageHero",
    ]) {
      assert.equal(sharedPage.includes(required), true, required);
    }

    for (const [file, forbidden] of [
      ["app/page.tsx", "min-h-[170px]"],
      ["app/page.tsx", "min-h-[260px]"],
      ["app/features/page.tsx", "min-h-[210px]"],
    ] as const) {
      assert.equal(readFileSync(file, "utf8").includes(forbidden), false, file);
    }
  });''',
)

replace_block(
    "tests/unit/i18n-copy.test.mts",
    '  it("keeps pilot Branch B conversion honest and non-submitting", () => {',
    '  it("keeps public copy namespaces explicit and complete", () => {',
    '''  it("keeps founder-pilot conversion honest, bilingual, and non-submitting", () => {
    const v2English = getPublicV2Copy("en").pilot;
    const v2French = getPublicV2Copy("fr-CA").pilot;
    const englishConversion = getPublicSiteCopy("en").pilot.conversion;
    const frenchConversion = getPublicSiteCopy("fr-CA").pilot.conversion;

    assert.match(v2English.badge, /Cleaning businesses first/i);
    assert.match(v2English.notice?.badge ?? "", /Approval gate/i);
    assert.match(v2French.notice?.badge ?? "", /Porte d'approbation/i);
    assert.equal(v2English.sections.length, 2);
    assert.equal(v2French.sections.length, 2);

    assert.equal(englishConversion.emailDraftAction, "Open email draft");
    assert.equal(englishConversion.previewQuestions.length, 6);
    assert.equal(frenchConversion.previewQuestions.length, 6);
    assert.equal(
      JSON.stringify(frenchConversion).includes("Copy pilot request template"),
      false,
    );

    const pilotSource = readFileSync("app/pilot/page.tsx", "utf8");
    for (const forbidden of ["<form", "<input", "<select", "<textarea"]) {
      assert.equal(pilotSource.includes(forbidden), false, forbidden);
    }
    assert.equal(pilotSource.includes("PilotRequestTemplateCard"), true);
    assert.equal(pilotSource.includes("getPublicV2Copy"), true);
    assert.equal(pilotSource.includes("getPublicSiteCopy"), true);
    assert.equal(pilotSource.includes('id="pilot-request-template"'), true);

    const conversionSource = readFileSync(
      "components/public/pilot-request-template-card.tsx",
      "utf8",
    );
    assert.equal(conversionSource.includes("navigator.clipboard.writeText"), true);
    assert.equal(conversionSource.includes('document.execCommand("copy")'), true);
    assert.equal(conversionSource.includes('aria-live="polite"'), true);
    assert.equal(conversionSource.includes("mailto:?subject="), true);
    for (const forbidden of ["fetch(", "XMLHttpRequest", "<form"]) {
      assert.equal(conversionSource.includes(forbidden), false, forbidden);
    }
  });''',
)

ensure_replace(
    "tests/unit/public-v2-positioning.test.mts",
    'assert.match(english.features.notice?.body ?? "", /roadmap/i);',
    'assert.match(english.features.notice?.body ?? "", /after validation/i);',
)
ensure_replace(
    "tests/unit/public-v2-positioning.test.mts",
    'assert.match(english.faq.items[5]?.answer ?? "", /does not.*replace a full CRM/i);',
    'assert.match(english.faq.items[5]?.answer ?? "", /without trying to replace a full CRM/i);',
)

ensure_replace(
    "tests/unit/seo-source.test.mts",
    'import { getPublicSiteCopy } from "../../lib/i18n/public-site-copy.ts";\nimport {',
    'import { getPublicSiteCopy } from "../../lib/i18n/public-site-copy.ts";\nimport { getPublicV2Copy } from "../../lib/i18n/public-v2-copy.ts";\nimport {',
)

replace_block(
    "tests/unit/seo-source.test.mts",
    '  it("emits structured data only through the approved public JSON-LD helper", () => {',
    '  it("keeps FAQ AI-search content source-backed without ranking claims", () => {',
    '''  it("emits structured data through the approved helper and shared V2 renderer", () => {
    const jsonLd = source("components/public/json-ld.tsx");
    const structured = source("lib/public-structured-data.ts");
    const home = source("app/page.tsx");
    const faq = source("app/faq/page.tsx");
    const sharedV2 = source("components/public/bizpilot-v2-page.tsx");
    const pilot = source("app/pilot/page.tsx");
    const quoteLinkGuide = source("app/quote-link-guide/page.tsx");
    const replySpeedGuide = source("app/faster-quote-replies/page.tsx");
    const policyPage = source("components/public/policy-page.tsx");
    const ogImage = source("app/opengraph-image.tsx");

    assert.equal(jsonLd.includes('type="application/ld+json"'), true);
    assert.equal(jsonLd.includes('replaceAll("<", "\\\\u003c")'), true);
    assert.equal(structured.includes('"FAQPage"'), true);
    assert.equal(structured.includes('"BreadcrumbList"'), true);
    assert.equal(structured.includes('"SoftwareApplication"'), true);
    assert.equal(structured.includes('"Service"'), true);
    assert.equal(home.includes("buildHomeJsonLd"), true);
    assert.equal(faq.includes("faqItems={copy.items}"), true);
    assert.equal(sharedV2.includes("buildFaqPageJsonLd(faqItems, language)"), true);
    assert.equal(sharedV2.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(pilot.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(pilot.includes("bizpilot-v2-pilot-breadcrumb-jsonld"), true);
    assert.equal(quoteLinkGuide.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(replySpeedGuide.includes("buildBreadcrumbJsonLd"), true);

    for (const route of [
      "app/features/page.tsx",
      "app/industries/cleaning/page.tsx",
      "app/trust/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/comparison/page.tsx",
      "app/faq/page.tsx",
    ]) {
      assert.equal(source(route).includes("BizPilotV2Page"), true, route);
    }

    assert.equal(policyPage.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(policyPage.includes("JsonLdScript"), true);
    assert.equal(policyPage.includes("breadcrumbId"), true);
    assert.equal(ogImage.includes("ImageResponse"), true);
  });''',
)

replace_block(
    "tests/unit/seo-source.test.mts",
    '  it("keeps FAQ AI-search content source-backed without ranking claims", () => {',
    '  it("keeps Search Console and Core Web Vitals checklist source-backed", () => {',
    '''  it("keeps FAQ AI-search content source-backed without ranking claims", () => {
    const questions = getPublicV2Copy("en").faq.items.map(
      (item) => item.question,
    );
    const faqRoute = source("app/faq/page.tsx");
    const sharedV2 = source("components/public/bizpilot-v2-page.tsx");
    const structured = source("lib/public-structured-data.ts");
    const phase25n = source(
      "docs/readiness/PHASE_25N_FAQ_AI_SEARCH_COMPLETION_2026-07-04.md",
    );

    for (const question of [
      "Does BizPilot connect directly to Gmail, WhatsApp, Instagram, or SMS today?",
      "Does AI send messages automatically?",
      "Can BizPilot invent prices or confirm bookings?",
      "Is BizPilot only for cleaning businesses?",
      "What happens after a customer submits the intake form?",
      "Is BizPilot a CRM, booking platform, or invoicing system?",
    ]) {
      assert.equal(questions.includes(question), true, question);
    }

    assert.equal(faqRoute.includes("faqItems={copy.items}"), true);
    assert.equal(sharedV2.includes("buildFaqPageJsonLd(faqItems, language)"), true);
    assert.equal(structured.includes('"FAQPage"'), true);
    for (const required of [
      "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
      "https://developers.google.com/search/docs/appearance/structured-data/search-gallery",
      "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
      "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
      "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
      "FAQPage JSON-LD does not guarantee indexing, rankings, rich results, AI",
      "BizPilot does not auto-send messages.",
      "Paid pilot collection remains blocked",
    ]) {
      assert.equal(phase25n.includes(required), true, required);
    }
  });''',
)

print("Public V2 test-contract migration patch applied.")
