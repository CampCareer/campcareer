# Singapore destination main integration v1

Status: `PHASE_9_COMPLETE`

Current branch: `agent/sg-destination-main-integration-v1`

Source QA branch: `agent/sg-destination-qa-v1`

Current main baseline: `e41f7cd6fe95821d895d72b7236614410574d9be`

Date: 2026-08-10

## Purpose

Phase 9 prepares the completed Singapore destination rollout for integration into current `main` after successful Phase 8 QA.

The SG rollout branch stack originally diverged from `main` at `e709212c92d18c0bfb7ae6b4bd5db478c0c6591a`. Current `main` advanced to `e41f7cd6fe95821d895d72b7236614410574d9be` with the Programs entry-route fix while the SG work was in progress.

Phase 9 therefore transplants the validated final SG snapshot onto the current-main tree as a clean linear integration commit `93d7bc469e7b82c8e5db4521830a12ab143f2d06`. This preserves the current Programs changes while removing the obsolete branch divergence from the integration history.

## Completed rollout

The integration contains the completed Phase 0 through Phase 8 Singapore destination work:

1. readiness audit
2. country/city-state scope contract
3. destination foundation
4. institution/campus linkage
5. bounded destination metrics
6. `/sg` study destination profile
7. Singapore city-state decision/compare handling
8. publication and SEO
9. full cross-phase QA

## Canonical model

Singapore remains one country-level city-state study destination.

Canonical hierarchy:

`SG country -> institution -> campus/teaching location -> explicit programme offering`

Publication boundary:

- canonical destination route: `/sg`
- no `/cities/sg/...` route
- no Singapore city shortlist
- living areas remain lifestyle and commute context
- `/compare?type=city&country=SG` provides city-state guidance instead of a synthetic city comparison

## Production data state

The three SG destination migrations were already applied successfully to production Supabase before Phase 9:

- `sg_destination_foundation_v1`
- `sg_destination_linkage_v1`
- `sg_destination_metrics_v1`

Verified production state:

- 1 country/city-state destination
- 6 linked canonical institutions
- 6 linked campus/location rows
- 8 verified destination metric rows
- 0 linked canonical programmes
- programme coverage: `verification_pending`

Phase 9 performs no additional database mutation.

## Publication state

Phase 7 established:

- study-led `/sg` metadata
- canonical path `/sg`
- `/sg` sitemap publication
- no `/cities/sg/...` sitemap publication
- explicit programme verification-pending disclosure

## QA state

Phase 8 GitHub Actions CI run `31388308371` completed successfully on the QA code head `5176d3922e8821524cc70c16f947f319e5f2f84a`.

Validated repository checks included:

- npm ci
- production dependency audit
- typecheck
- lint
- tests
- production build
- Git-history secret scan

The first Phase 9 PR CI attempt also passed install, audit, typecheck, lint, tests and production build. Its Gitleaks step did not report a leak; it failed because the temporary non-linear integration history produced an invalid Git revision range. The integration branch was rebuilt linearly from current `main` to remove that CI-history artifact.

## Current-main reconciliation

The final Phase 9 integration history is linear from current `main`.

- parent baseline: `e41f7cd6fe95821d895d72b7236614410574d9be`
- validated SG snapshot integration commit: `93d7bc469e7b82c8e5db4521830a12ab143f2d06`
- commits behind `main`: 0
- unrelated current-main Programs changes preserved
- SG product diff remains restricted to the destination rollout files and shared `/sg`, Compare and sitemap integrations

## Integration rule

This branch is the Phase 9 integration candidate for `main`.

Before merge:

- confirm the branch remains mergeable with current `main`
- run repository CI on the final linear Phase 9 integration head
- preserve the city-state publication boundary
- do not infer Singapore programme delivery

After successful integration CI, the integration PR may be merged to `main` as the final repository integration step. Production application deployment remains subject to the normal deployment pipeline.

## Phase 9 checkpoint

`MAIN_INTEGRATION_READY`
