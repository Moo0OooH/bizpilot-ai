# BizPilot Language Support

BizPilot keeps MVP language support in a small, typed dictionary instead of a full i18n framework. This keeps the Quebec pilot simple while making future languages predictable.

## Current public and business languages

- `en` - English
- `fr-CA` - Canadian French for Quebec cleaning businesses

## Dashboard-only interface languages

The protected dashboard has a separate interface-language contract in `dashboard-interface.ts`:

- `en` - English
- `fr-CA` - Canadian French
- `fa` - Persian, RTL
- `ar` - Arabic, RTL
- `es` - Spanish

These interface languages do not extend `SupportedLanguage` in `language.ts`. They must not change the public quote language, customer-authored content, or AI context selected for a business.

Legacy protected route bodies use `dashboard-legacy-interface.ts`. It starts from the established English or Canadian-French dashboard copy and applies the dashboard-only Persian, Arabic, or Spanish UI vocabulary without passing that locale into a business, public form, customer message, or AI service. Persian and Arabic use complete checked-in owner-route maps. Exhaustive tests permit unchanged values only for protected routes, identifiers, Latin numeric fixtures, sample identities, and customer/business-language content that the dashboard locale must not rewrite; unexpected English fallback fails the test suite.

## Add a public or business language

1. Add the language to `languageDefinitions` in `language.ts`.
2. Add a complete `BizPilotCopy` dictionary in `bizpilot-copy.ts`.
3. Keep copy grouped by namespace: public quote page, quote form, quote success, intake errors, lead rules, AI fallback, and demo state.
4. Update database constraints only when the business should be allowed to save the new language.
5. Add or update tests for localized lead-rule guidance and safe public-intake errors.
6. Verify `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build`.

## Add a dashboard-only interface language

1. Add the code, native label, and `ltr`/`rtl` direction to `dashboard-interface.ts`.
2. Add a complete `DashboardInterfaceCopy` dictionary with the exact English source shape.
3. Keep the locale out of `SupportedLanguage` unless a separate product decision also expands public/customer language support.
4. Add cookie, direction, shape, and public-language-isolation coverage in `tests/unit/dashboard-interface.test.mts`.
5. Route legacy dashboard bodies through `getDashboardInterfaceLegacyCopy(...)`; do not replace `business.preferred_language` or pass the interface locale to a service.
6. Test responsive RTL placement where relevant. Structured technical inputs (date, time, number, phone, and identifiers) must retain English/Latin LTR values even in RTL UI.

## Guardrails

- Do not branch on language in random UI files when a dictionary key is enough.
- Keep English as the source copy shape. `tests/unit/i18n-copy.test.mts` compares every supported language against that source shape so missing keys, extra keys, mismatched arrays, and mismatched function arity fail in unit tests.
- When English source copy changes, update every supported language in the same diff before merging.
- Do not translate customer-provided text.
- AI drafts must stay owner-reviewed and manual-send only in every language.
- Public validation errors must remain safe and non-sensitive.
- Service-role access, auth tokens, and API keys must never be exposed to client code.
- Dashboard interface language must stay separate from public intake and business language. Persian and Arabic flip UI direction, not technical date/time or numeric value order.
