# Phase 25E - Lead Source Attribution Visibility

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Make captured lead source context visible on the owner lead detail page without
turning it into broad analytics, attribution scoring, or paid/premium source
charts.

This is a focused owner workflow improvement: when a cleaning-business owner
opens a lead, they can see the source channel plus source URL, referrer, and UTM
values that were already captured by the public quote intake path.

## What Changed

- Added tenant-scoped `lead_source_metadata` read support to the lead conversion
  repository.
- Added `sourceMetadata` to `LeadDetail`.
- Rendered a compact "Source attribution" section inside the existing Lead
  Details card.
- Shows:
  - Source URL
  - Referrer
  - UTM source
  - UTM medium
  - UTM campaign
- Added EN/fr-CA copy that explicitly says this context is not a full analytics
  report.
- Added source guards to preserve tenant scoping and the detail-page rendering
  contract.

## Product Boundary

This does not enable source analytics, lead-source charts, attribution
recommendations, automatic campaign optimization, booking, auto-send, or
customer messaging. It only displays the source metadata already tied to the
current lead record.

The broader feature registry item `lead_source_attribution_analytics` remains a
planned/admin or premium capability until source taxonomy, privacy rules, and
chart behavior are approved.

## Backlog Items Advanced

```text
51 advanced
54 done
58 preserved
64 preserved
74 preserved
79 prepared
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030 --fixture-profile=dense SKIPPED
```

Dashboard smoke remains intentionally skipped because the current
`NEXT_PUBLIC_SUPABASE_URL` classification is canonical production blocked:
`qfqendrqimqvkoojpjao.supabase.co`. The attribution UI is ready for browser QA
after a confirmed local/synthetic Supabase target is active.
