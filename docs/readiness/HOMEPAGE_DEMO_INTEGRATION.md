# Homepage Demo Integration

**Project:** BizPilot AI
**Document Type:** Implementation note
**Status:** Applied, deployed, and smoked on 2026-05-25
**Owner:** MoOoH

---

## Applied Scope

The interactive cleaning demo is now wired into `app/page.tsx`.

Implemented files:

- `components/public/interactive-cleaning-demo.tsx`
- `app/page.tsx`

Homepage changes:

- Hero secondary CTA now points to `#cleaning-demo`.
- Hero vertical padding is reduced so the first viewport is tighter.
- Hero desk shows fewer journey/lead rows to reduce above-the-fold height.
- The previous tab demo render was replaced with the interactive 7-step demo.

## Demo Coverage

The interactive demo shows:

- customer quote question,
- lead organization,
- missing-info flagging,
- AI summary,
- owner-reviewed reply draft,
- manual owner copy/send gate,
- follow-up visibility.

Guardrails shown in the demo:

- no auto-send,
- no invented price,
- no booking promise,
- owner review before any reply,
- manual copy/send only,
- owner decides follow-up.

## Validation Required

Run before treating this as deployed:

- `pnpm verify` - passed locally
- browser QA at 375px for `/` - initial render/no-overflow passed
- production smoke after Vercel deploy - passed on
  `dpl_H2EtZKwH5E24YTaWxz4JcT859kCF`

No migration, no env change, no production SQL, and no real customer data are
involved.
