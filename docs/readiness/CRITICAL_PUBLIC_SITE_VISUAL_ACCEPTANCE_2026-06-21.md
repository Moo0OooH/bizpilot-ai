# Critical Public Site Visual Acceptance

Date: 2026-06-21
Phase: C5 final production visual acceptance
Repository: `E:\bizpilot-ai`
Production: `https://bizpilo.com`

## Scope

This acceptance records the final C0-C5 public-site visual repair pass for the
owner-visible routes. It does not approve real customer data, billing,
dashboard implementation, AI provider changes, auth changes, database schema
changes, migrations, RLS changes, production data-flow expansion, or pricing
changes.

Dashboard D1 was not started in this phase.

## Commit And Deploy State

- Local HEAD before this C5 docs acceptance commit:
  `abd91f0a64fca1a03a3dede79e22a8bdb4975492`
- `origin/main` before this C5 docs acceptance commit:
  `abd91f0a64fca1a03a3dede79e22a8bdb4975492`
- Production did not expose a deployment commit header during the check, so
  production/runtime match was verified by route smokes plus the rendered
  C1-C4 acceptance markers.
- This C5 commit is docs-only and does not change runtime behavior.

## Local Verification

Local production server target: `http://127.0.0.1:3001`

| Command | Result |
| --- | --- |
| `pnpm verify` | PASS: lint, typecheck, 136 unit tests, build |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3001` | PASS: 10/10 |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3001` | PASS: 19/19 |
| `pnpm smoke:quote -- --base-url=http://127.0.0.1:3001 --fr-slug=akora?language=fr-CA --inactive-slug=phase1-unavailable-synthetic` | PASS: 2/2 |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3001 --fr-quote-url=http://127.0.0.1:3001/quote/akora?language=fr-CA` | PASS: final failures 0 |
| `git diff --check` | PASS |

## Production Verification

Production target: `https://bizpilo.com`

| Command | Result |
| --- | --- |
| `pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=30000` | PASS: 10/10 |
| `pnpm smoke:responsive -- --base-url=https://bizpilo.com` | PASS: 19/19 |
| `pnpm smoke:quote -- --base-url=https://bizpilo.com --timeout-ms=30000 --fr-slug=akora?language=fr-CA --inactive-slug=phase1-unavailable-synthetic` | PASS: 2/2 |
| `pnpm smoke:ui-matrix -- --base-url=https://bizpilo.com --timeout-ms=30000 --fr-quote-url=https://bizpilo.com/quote/akora?language=fr-CA` | PASS: final failures 0 |

## Production Route Markers

| Route | Status | Marker result |
| --- | ---: | --- |
| `/` | 200 | Final hero trust copy present; stale `AI drafts you approve` absent |
| `/?language=fr-CA` | 200 | Final fr-CA hero trust copy present; stale English trust copy absent |
| `/industries/cleaning?language=en` | 200 | `cleaning-detail-panel` count 1; old duplicate roots count 0 |
| `/industries/cleaning?language=fr-CA` | 200 | `cleaning-detail-panel` count 1; old duplicate roots count 0 |
| `/features?language=fr-CA` | 200 | Final shorter fr-CA Features H1 present; stale literal phrase absent |
| `/demo` | 200 | Route smoke passed; no stale CTA or missing-copy markers |
| `/faq` | 200 | Route smoke passed; no stale CTA or missing-copy markers |
| `/quote/akora?language=fr-CA` | 200 | Quote form rendered; noindex/nofollow present; safe GET only |
| `/auth/sign-in` | 200 | noindex/nofollow present; auth chrome smoke passed |

## Browser Visual Measurements

Production browser checks used rendered pages, not source-only checks.

Homepage EN, forced with `?language=en`:

| Viewport | CTA visible | Hero bottom | Problem top | Hero-to-Problem gap | H2/H1 ratio | Actual overflow | Nested scroll |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `1280x720` | Yes | 434px | 434px | 0px | 0.676 | 0px | 0 |
| `1366x768` | Yes | 437px | 437px | 0px | 0.676 | 0px | 0 |

Homepage fr-CA:

| Viewport | CTA visible | Hero bottom | Problem top | Hero-to-Problem gap | H2/H1 ratio | Actual overflow | Nested scroll |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `1280x720` | Yes | 483px | 483px | 0px | 0.676 | 0px | 0 |
| `1366x768` | Yes | 486px | 486px | 0px | 0.676 | 0px | 0 |

Cleaning EN/fr-CA at `390x844` and `1366x768`:

- Six service cards rendered.
- Six detail selector buttons rendered.
- One selected detail tab rendered.
- One active detail panel rendered.
- Old desktop/mobile duplicate detail roots were absent.
- Native `<details>` under `main` count was 0.
- Ordered lists under `main` count was 0.
- Duplicate numbering pattern was not detected.
- Actual horizontal overflow was 0.
- Nested scroll count was 0.

Quote fr-CA active route at `390x844` and `1366x768`:

- One quote form shell rendered.
- Three step cards rendered.
- One consent block rendered.
- One submit guardrail rendered.
- One submit button rendered.
- Honeypot input remained hidden.
- Minimum visible control height was 48px.
- Minimum measured helper gap was about 14px.
- Actual horizontal overflow was 0.
- Nested scroll count was 0.

Quote inactive route at `390x844` and `1366x768`:

- No quote form rendered.
- Unavailable page H1 rendered.
- Actual horizontal overflow was 0.
- Nested scroll count was 0.

## Explicit Acceptance Answers

1. Is Cleaning duplicated content removed?
   Yes. Production renders one active `cleaning-detail-panel`; old duplicate
   desktop/mobile roots are absent in the checked EN and fr-CA routes.

2. Are Cleaning workflow numbers fixed?
   Yes. The workflow no longer uses an ordered list plus manual badges, and the
   rendered production checks did not detect duplicate numbering patterns.

3. Is homepage hero visually balanced?
   Yes. The CTA remains in the first fold at `1280x720` and `1366x768`, the
   mockup and copy are aligned as one composed layout, and no nested scroll was
   measured.

4. Is hero-to-Problem spacing reduced?
   Yes. The measured hero-to-Problem gap is `0px` in EN and fr-CA at the
   checked desktop viewports, and the Problem section starts in the first fold.

5. Is typography scale consistent?
   Yes. The rendered Problem H2 to Hero H1 ratio is about `0.676`, within the
   requested 65-75% range, while card/body scale remains governed by shared
   public typography tokens.

6. Is fr-CA copy natural and polished?
   Yes for this C5 acceptance. Production contains the final shorter fr-CA
   Features H1 marker, the stale literal phrase is absent, and fr-CA route
   smokes passed without missing-copy, mojibake, or English-body-copy markers.

7. Is quote form spacing clean?
   Yes. The production quote form renders with one consent block, one review
   notice path, hidden honeypot, 48px minimum controls, clear helper spacing,
   no horizontal overflow, and no nested scroll.

8. Are EN/fr-CA stable at `1280x720` and `1366x768`?
   Yes. EN and fr-CA homepage measurements passed at both viewport sizes with
   visible CTAs, no actual horizontal overflow, no nested scroll, and the same
   typography ratio.

9. Does production match latest commit?
   Yes for runtime acceptance. Before this docs-only C5 commit, local HEAD and
   `origin/main` both pointed to `abd91f0a64fca1a03a3dede79e22a8bdb4975492`,
   and production rendered the C1-C4 markers introduced by that latest runtime
   commit. This C5 file is docs-only.

10. Is Dashboard D1 GO or NO-GO?
    GO for the next implementation prompt only. Dashboard D1 was not started
    here, and it must still respect the existing product gates for real data,
    billing, auth, database, RLS, AI provider, and production data flows.

## Final Decision

The critical public-site visual repair sequence is accepted for the scoped
public surfaces. The next correct phase may be Dashboard D1 only after the user
explicitly asks to start it.
