# Public Responsive Hardening Work Log - 2026-06-18

## Scope

- Public marketing routes: `/`, `/features`, `/industries/cleaning`, `/trust`, `/demo`, `/pricing`, `/pilot`, `/content-studio`, `/privacy`, `/security`, `/terms`
- Auth shell short-height behavior for `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, and `/auth/reset-password`
- Dashboard/admin responsive foundation only: frame height units, page scroll behavior, and semantic theme-token readiness

## Product Guardrails

- Cleaning-first only.
- Manual-first lead recovery.
- AI drafts; the owner reviews, edits, copies, and sends manually.
- No auto-send, SMS/WhatsApp automation, booking confirmation, invoicing, full CRM claim, or guaranteed revenue claim.
- Roadmap items remain labeled as Roadmap.

## Implementation Evidence Targets

- Header collapses before crowded desktop widths and keeps one visible founder-pilot CTA.
- Homepage hero uses natural height, content-driven stacking, and a real `/demo` link.
- Homepage demo remains three concise visible steps.
- `/demo` is grouped into four narrative chapters plus guardrails.
- Pricing cards no longer duplicate `$49/month` or `$79/month` in the card highlight.
- `/pilot` announces preview-only state before disabled controls.
- Legal/security/terms pages use a narrow reading column and owner-friendly summary first.
- Auth shell uses `100svh` and top-safe scrolling behavior for short viewports.
- Dashboard shell no longer hard-locks the desktop app frame to `h-screen` plus nested overflow.

## Verification Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm build`
- `pnpm smoke:public`
- `pnpm smoke:responsive`

## Known Limitations

- Lighthouse is not included as a local project dependency.
- Automated responsive smoke uses existing Node tooling and browser HTML checks; full visual screenshot diffing still belongs in a future Playwright/Lighthouse setup if approved.
