# United Arab Emirates Cities — Phase 9 current-main integration v1

Status: `PHASE_9_COMPLETE_PENDING_FINAL_CI`

Checkpoint: `CURRENT_MAIN_CANDIDATE`

Country: `AE` — United Arab Emirates

Audit date: 2026-08-12

Branch: `agent/ae-cities-v1`

## Current-main reconciliation

Immediately before final Phase 9 validation, `agent/ae-cities-v1` was compared with authoritative `main`.

Result:

- branch status: ahead
- ahead of main: `30` commits
- behind main: `0`
- current merge base: `2019dbe23235171cb6bb6b848a95da20f31c5731`

No main-to-UAE reconciliation commit was required at this checkpoint.

## Shared-surface preservation

UAE Phase 6 and Phase 7 modify shared application files:

- `src/app/(workspace)/compare/page.tsx`
- `src/lib/cities/city-routes.ts`
- `src/app/sitemap.ts`

Phase 9 adds regression coverage to ensure the pre-existing City Compare countries and published City constants remain connected while the UAE is added.

The integration contract explicitly preserves existing Compare handling for:

- Australia
- Belgium
- Canada
- Germany
- Denmark
- Spain
- Finland
- France
- Netherlands
- New Zealand
- Sweden
- United Kingdom
- United States

It also preserves the existing published City route and sitemap constants for Belgium, Germany, Denmark, Spain, Finland, France, Netherlands, New Zealand, Sweden, United Kingdom and United States.

## UAE final candidate state

The Phase 9 candidate contains:

- Phase 0 readiness
- Phase 1 exact four-City Tier A scope
- Phase 2 official City-locality geography normalization
- Phase 3 strict provider, teaching-location and programme linkage
- Phase 4 Five Core Metrics with source-aware evidence boundaries
- Phase 5 functional City profiles
- Phase 6 City Compare
- Phase 7 exact four-City publication
- Phase 8 production QA and `PUBLISH_READY`
- Phase 9 current-main integration regression guard

The production data foundation has also been restored through Phase 4 and re-verified. The Phase 4 migration includes the required PostgreSQL date cast for `data_as_of`.

## Release boundary

Phase 9 does not merge the UAE branch into `main` and does not deploy production application code.

The intended terminal state for this task remains:

- PR Draft / Open / Unmerged
- no merge into `main`
- no automatic Phase 10 release

Final CI and a final `main` comparison are required before changing this document status from `PHASE_9_COMPLETE_PENDING_FINAL_CI` to complete.
