# South Korea Cities — Phase 9 current-main integration v1

Status: `PHASE_9_COMPLETE_PENDING_FINAL_CI`

Checkpoint: `FINAL_VALIDATION_PENDING`

Country: `KR` — South Korea

Audit date: 2026-08-12

## Current-main reconciliation

The South Korea Cities branch remains based on the current authoritative `main` commit:

`2019dbe23235171cb6bb6b848a95da20f31c5731`

At the Phase 9 integration checkpoint before final CI:

- branch: `agent/kr-cities-v1`
- `behind_by`: `0`
- merge base: current `main`
- no rebase or merge-from-main is required

## Shared surface preservation

The current-main integration contract explicitly preserves all pre-existing shared City Compare country branches:

- AU
- BE
- CA
- DE
- DK
- ES
- FI
- FR
- NL
- NZ
- SE
- UK
- US

South Korea adds `KR` without removing or replacing an existing country branch.

## Shared route and sitemap preservation

The integration contract preserves all pre-existing published-city constants used by shared route/sitemap code, including Spain and Finland.

South Korea adds:

`PUBLISHED_KR_CITY_SLUGS`

with exactly:

- `seoul`
- `busan`
- `daejeon`
- `suwon`
- `yongin`
- `pohang`

No later candidate is promoted by Phase 9.

## SEO separation

Current application contract remains:

- six published South Korea city profiles: index/follow
- parameterized shared City Compare: noindex/nofollow
- city-profile URLs in sitemap
- Compare URLs absent from sitemap

## Production foundation carried into Phase 9

Production QA remains:

- city rows: `6`
- verified teaching-location rows: `14`
- strict city programme rows: `182`
- verified metric rows: `30`
- programme source-city mismatches: `0`
- forbidden/non-Tier-A leakage: `0`
- Compare-ready cities: `6/6`

The SKKU Suwon and Kyung Hee Yongin multi-campus separation remains part of the release contract.

## Security carried into Phase 9

The four South Korea city read models remain:

- `security_invoker=true`
- service-role SELECT only
- no anon SELECT
- no authenticated SELECT

Project-wide Supabase advisor notices are tracked separately; the existing leaked-password-protection warning is not caused by the South Korea Cities rollout.

## Final CI gate

This document is intentionally committed before the final Phase 9 CI run so that the CI evaluates the exact final branch head including this audit snapshot.

Final validation requires success for:

- npm install integrity
- production dependency audit
- TypeScript typecheck
- lint
- full test suite
- production build
- Git-history secret scan

When that exact head passes CI and `main` still reports `behind_by=0`, the branch reaches:

`CURRENT_MAIN_CANDIDATE`

## Release boundary

Phase 9 does not itself:

- merge PR #218 into `main`
- deploy Vercel production
- create a separate release branch
- automatically perform Phase 10

Those remain explicit release actions after the final current-main candidate gate passes.
