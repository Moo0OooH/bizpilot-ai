# BizPilot Language Support

BizPilot keeps MVP language support in a small, typed dictionary instead of a full i18n framework. This keeps the Quebec pilot simple while making future languages predictable.

## Current Languages

- `en` - English
- `fr-CA` - Canadian French for Quebec cleaning businesses

## Add A Language

1. Add the language to `languageDefinitions` in `language.ts`.
2. Add a complete `BizPilotCopy` dictionary in `bizpilot-copy.ts`.
3. Keep copy grouped by namespace: public quote page, quote form, quote success, intake errors, lead rules, AI fallback, and demo state.
4. Update database constraints only when the business should be allowed to save the new language.
5. Add or update tests for localized lead-rule guidance and safe public-intake errors.
6. Verify `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build`.

## Guardrails

- Do not branch on language in random UI files when a dictionary key is enough.
- Keep English as the source copy shape. `tests/unit/i18n-copy.test.mts` compares every supported language against that source shape so missing keys, extra keys, mismatched arrays, and mismatched function arity fail in unit tests.
- When English source copy changes, update every supported language in the same diff before merging.
- Do not translate customer-provided text.
- AI drafts must stay owner-reviewed and manual-send only in every language.
- Public validation errors must remain safe and non-sensitive.
- Service-role access, auth tokens, and API keys must never be exposed to client code.
