# Spain Cities — Phase 9 current-main integration v1

Status: `PHASE_9_COMPLETE_PENDING_FINAL_CI`

Checkpoint: `CURRENT_MAIN_CANDIDATE`

Country: `ES` — Spain

Audit date: 2026-08-11

## Current-main reconciliation

Immediately before final Phase 9 validation, `agent/es-cities-v1` was compared with authoritative `main`.

Result:

- branch status: ahead
- behind main: `0`
- current merge base: `b1bacadc840d0fb9c67e1ec8b4ab95889df27e63`

No main-to-Spain reconciliation commit was required at that checkpoint.

## Shared-surface preservation

Spain Phase 6 and Phase 7 modify shared application files:

- `src/app/(workspace)/compare/page.tsx`
- `src/lib/cities/city-routes.ts`
- `src/app/sitemap.ts`

Phase 9 adds regression coverage to ensure the pre-existing City Compare countries and published city constants remain connected while Spain is added.

The integration contract explicitly preserves existing Compare handling for:

- Australia
- Belgium
- Canada
- Germany
- Denmark
- Finland
- France
- Netherlands
- New Zealand
- Sweden
- United Kingdom
- United States

It also preserves the existing published city route/sitemap constants for Belgium, Germany, Denmark, Finland, France, Netherlands, New Zealand, Sweden, United Kingdom and United States.

## Spain final candidate state

The Phase 9 candidate contains:

- Phase 0 readiness
- Phase 1 Tier A scope
- Phase 2 INE geography normalization
- Phase 3 verified provider / teaching-location / programme linkage
- Phase 4 Five Core Metrics
- Phase 5 functional profiles
- Phase 6 City Compare
- Phase 7 exact seven-city publication
- Phase 8 production QA and `PUBLISH_READY`
- Phase 9 current-main integration regression guard

## Release boundary

Phase 9 does not perform release actions.

The intended terminal state for this task remains:

- PR Draft / Open / Unmerged
- no merge into `main`
- no Vercel production deployment
- no automatic Phase 10 release

Final CI and a final `main` comparison are required before changing this document status from `PHASE_9_COMPLETE_PENDING_FINAL_CI` to complete.
