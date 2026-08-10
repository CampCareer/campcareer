# Germany city main integration v1

Status: `PHASE_9_COMPLETE`

Checkpoint: `MAIN_INTEGRATION_READY`

Branch: `agent/de-cities-main-integration-v1`

Source QA branch: `agent/de-cities-qa-v1`

Current main baseline: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

QA head: `c0bf1d5b93043df5322fd71cd6376ba944307dc0`

Date: 2026-08-10

## Purpose

Prepare the completed Germany Cities rollout for main integration after successful Phase 8 cross-phase QA.

Phase 9 does not merge to main and does not deploy. It creates the final integration candidate and verifies that the Germany rollout is linearly based on the current main baseline.

## Current-main reconciliation

At Phase 9 start:

- current main: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`
- QA head: `c0bf1d5b93043df5322fd71cd6376ba944307dc0`
- QA branch versus main: 30 commits ahead / 0 commits behind
- merge base: current main `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Unlike the earlier Singapore integration, Germany does not require a transplant or rebase onto a newer main snapshot. The full Germany branch stack is already a linear continuation of the current main tree.

The Phase 9 integration branch is therefore created directly from the validated Phase 8 QA head, then adds only this integration checkpoint document.

## Completed Germany Cities rollout

The integration candidate contains the completed Phase 0 through Phase 8 work:

0. readiness audit
1. exact nine-city scope contract
2. municipality / AGS geography normalization
3. canonical institution + verified teaching-location linkage
4. five source-backed city metrics
5. `/cities/de/{slug}` profile surfaces
6. Germany City Compare
7. publication metadata and sitemap
8. cross-phase QA

## Canonical public set

Exactly nine Tier A Germany city profiles are included:

- Berlin
- Munich
- Hamburg
- Aachen
- Bonn
- Dresden
- Heidelberg
- Karlsruhe
- Tübingen

Canonical routes:

`/cities/de/{slug}`

Germany City Compare:

`/compare?type=city&country=DE`

## Geography contract

Public city and population scope remains the politically independent municipality from Destatis / Statistische Ämter GV-ISys.

Every Tier A city retains:

- official AGS
- Bundesland region code
- canonical name alias
- slug alias

Metro areas, Landkreise and neighbouring municipalities are not silently included.

## Institution and programme contract

Production linkage remains:

- 12 canonical institutions
- 12 verified official teaching locations
- Berlin: 3 / 3
- Munich: 2 / 2
- all other Tier A cities: 1 / 1

Programme state remains deliberately separate:

- `city_programme_directory_de_v1`: 0 rows
- existing Germany programme explorer: 72 rows preserved
- `programme_coverage_status = verification_pending` for all nine cities

Institution or teaching-location presence is never used to infer programme delivery.

## Metrics contract

Production contains exactly 45 verified Germany Tier A metric rows: five metrics for each of nine cities.

The final integration preserves:

- municipality population + AGS
- source-native monthly living references
- source-native student transport ticket product/period/ranges
- federal 20-hour / 140-full / 280-half-day student-work context
- official economic-sector context with no shortage/job-guarantee implication

## Publication contract

Approved Germany city profiles are:

`index, follow`

Unsupported slugs remain outside the allowlist and retain noindex/not-found behavior.

The sitemap derives Germany city URLs from `PUBLISHED_DE_CITY_SLUGS`.

The shared Compare surface remains:

`noindex, nofollow`

## Read-model security

The Germany city views remain:

- `city_directory_de_v1`
- `city_institution_directory_de_v1`
- `city_programme_directory_de_v1`

All use `security_invoker=true` and service-role-only SELECT access. No anon/authenticated direct SELECT privilege is added by Phase 9.

## Phase 8 QA result

Phase 8 GitHub Actions CI run:

`31416773798`

QA head:

`c0bf1d5b93043df5322fd71cd6376ba944307dc0`

All steps passed:

- npm ci
- production dependency audit
- typecheck
- lint
- tests including `de-city-qa-contract.test.ts`
- production build
- Git-history secret scan

Checkpoint from Phase 8:

`PUBLISH_READY`

## Phase 9 final gate

Before this integration candidate is merged to main:

- confirm branch is still 0 commits behind current main;
- confirm the PR is mergeable;
- run full GitHub Actions CI on the Phase 9 head;
- preserve the exact nine-city publication boundary;
- preserve programme verification-pending semantics;
- do not deploy through Vercel as part of this phase.

After final Phase 9 CI passes, the branch is `MAIN_INTEGRATION_READY`.

Main merge and deployment are intentionally outside the requested Phase 6–9 scope.
