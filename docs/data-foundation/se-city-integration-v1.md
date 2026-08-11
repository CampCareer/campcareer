# Sweden city current-main integration v1

Status: `PHASE_9_COMPLETE`

Checkpoint: `READY_FOR_PHASE_10_RELEASE_APPROVAL`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Integration policy

CampCareer uses one cumulative country branch for the Sweden Cities rollout. Phase 9 therefore does not create a second Sweden integration branch.

`agent/se-cities-v1` itself is the current-main integration candidate and Phase 10 release candidate.

## Current-main reconciliation

Current `main` at Phase 9 review:

`cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Phase 8 QA head:

`a0c576176b8531f7f60158b9b1f079528a784363`

Before this Phase 9 documentation commit, the Sweden branch was:

- 30 commits ahead of current main;
- 0 commits behind current main;
- merge base equal to current main;
- no rebase, transplant or conflict-resolution step required.

## Integrated rollout

The release candidate contains Phases 0–8 as one coherent Sweden city stack:

- readiness and provider-coverage boundaries;
- exact six-city Tier A scope;
- SCB municipality normalization;
- 10 UKÄ-backed canonical universities and 10 verified university city locations;
- 271 verified-partial source-city-matched programme rows;
- exactly 30 verified core city metric rows;
- six `/cities/se/{slug}` city profiles;
- Sweden City Compare at `/compare?type=city&country=SE`;
- profile canonical metadata and exact six-city sitemap publication;
- Phase 8 production, security and cross-phase QA.

## Evidence boundaries preserved

Phase 9 does not weaken the rollout contracts:

- public city boundary remains SCB municipality;
- the institution layer remains a selected ten-university core, not full Swedish HEI coverage;
- programme counts remain `verified_partial` and require source-city/location reconciliation;
- the shared SEK 10,656 student-budget baseline is not treated as a city cost ranking;
- the relevant 15-hour/week student residence-permit rule remains national context;
- local transport remains source-native rather than synthetically normalized;
- employment-sector context remains non-ranking.

## Phase 8 validation

GitHub Actions CI #1224 passed on Phase 8 head `a0c576176b8531f7f60158b9b1f079528a784363`:

- dependency install;
- production dependency audit;
- typecheck;
- lint;
- full test suite;
- production build;
- Git-history secret scan.

Production recheck at the same gate confirmed:

- 6 Tier A cities;
- 0 unexpected Tier A cities;
- 10 verified university locations;
- 10 distinct linked universities;
- 271 verified-partial programme rows;
- 0 programme source-city mismatches;
- 30 verified core metric rows;
- 0 cities missing a required metric family;
- 6 compare-ready cities;
- all three Sweden city read models `security_invoker=true` and service-role-only SELECT.

## Release boundary

Phase 9 prepares integration only.

Do not perform any of the following without explicit Phase 10 release approval:

- merge PR #207 to `main`;
- deploy the Sweden city release to production through the application deployment pipeline;
- mark the draft PR ready for final release merely from Phase 9 completion.

A final GitHub Actions run on the Phase 9 head is required before the release candidate is considered fully validated.