# Netherlands city main integration v1

Status: `PHASE_9_COMPLETE`

Integration state: `READY_FOR_PHASE_10_RELEASE_APPROVAL`

Branch: `agent/nl-cities-main-integration-v1`

Base main commit: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Source QA branch: `agent/nl-cities-qa-v1`

Integration PR: `#196` — draft / unmerged

Audit date: 2026-08-10

## Purpose

Integrate the completed Netherlands Cities Phase 0–8 rollout onto the current cities/main baseline without performing the Phase 10 merge to `main`.

## Current-main reconciliation

At Phase 9 start and again after integration CI, current main remains:

`cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

GitHub comparison confirms the Netherlands integration lineage is zero commits behind current main. Current main remains a direct ancestor of the rollout, so no newer main-only commit needs transplantation or conflict reconciliation.

The integration branch therefore uses the completed Phase 8 QA lineage directly and provides one Phase 0–9 release candidate for a later explicit Phase 10 merge.

## Integrated scope

The integration candidate contains the completed Netherlands city stack:

- Phase 0 readiness
- Phase 1 five-city Tier A scope
- Phase 2 CBS municipality normalization
- Phase 3 BRIN-backed institution/location linkage
- Phase 4 five verified decision metrics
- Phase 5 city profiles
- Phase 6 City Compare
- Phase 7 publication and SEO
- Phase 8 cross-phase QA
- Phase 9 current-main integration gate

Published cities remain exactly:

- Amsterdam
- Maastricht
- Rotterdam
- Groningen
- Eindhoven

Tier B cities and The Hague remain outside publication and Compare allowlists.

## Shared-file reconciliation

The rollout touches three shared runtime/publication surfaces:

- `src/lib/cities/city-routes.ts`
- `src/app/(workspace)/compare/page.tsx`
- `src/app/sitemap.ts`

Because current main remains the rollout ancestor and the integration branch is `0` commits behind main, no additional shared-file reconciliation was required. Existing AU/CA/NZ/UK/US/SG behaviour already present on main is retained by the Netherlands lineage.

## Data state

No Phase 9 production migration is required.

Production already contains the three Netherlands city migrations:

- `20260810131602_normalize_nl_tier_a_city_geographies_v1`
- `20260810132743_publish_nl_tier_a_city_linkage_v1`
- `20260810164813_publish_nl_tier_a_city_metrics_v1`

Phase 8 production QA confirmed:

- 5 Tier A cities
- 6 verified Phase 3 location anchors
- 25 verified city metrics
- 0 Tier B normalization/publication leaks
- 0 The Hague geography rows
- 0 explicitly campus-linked city programme rows
- programme coverage remains `verification_pending`
- institution coverage remains `research_university_core_hbo_pending`
- city read models remain `security_invoker=true` and service-role-only for SELECT

## Publication boundary

The Phase 9 candidate retains:

- `/cities/nl/{approved-slug}` as canonical city routes
- `index, follow` on the five approved profiles
- sitemap generation from `PUBLISHED_NL_CITY_SLUGS`
- `/compare?type=city&country=NL` as the `noindex, nofollow` comparison surface
- programme-delivery and HBO coverage gaps as explicit incomplete states

## Phase 8 verification

The Phase 8 QA code commit `646302a11b9d19347a6a71dc1d33072dbdc07aea` passed GitHub Actions CI run `#1113` (`31416456716`).

The final Phase 8 documentation head `b2820fea63d6459f4ed6b8a1ce26331b21b179bb` also passed follow-up CI run `#1120` (`31416834342`).

Both validation lines preserve the same runtime/data contracts.

## Phase 9 integration CI

Draft integration PR `#196` targets `main` from `agent/nl-cities-main-integration-v1` and remains intentionally unmerged.

Integration code/documentation commit `0c2f02ec587b65e6de24cbafe7ab4621da9abbca` passed GitHub Actions CI run `#1122` (`31416953509`).

All verification steps passed:

- `npm ci`
- `npm audit --omit=dev --audit-level=high`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- Git-history secret scan

## Vercel preview / release hold

Vercel status remains externally blocked by the account `build-rate-limit` condition. The status points to the account build-limit path rather than an application build failure.

GitHub Actions production build passed for the Phase 9 integration candidate. Phase 10 deployment must still recheck Vercel capacity or use another approved deployment validation path.

## Phase 9 completion gate

- [x] completed Phase 0–8 lineage integrated into one release candidate
- [x] current main rechecked and unchanged
- [x] integration branch remains zero commits behind main at the Phase 9 gate
- [x] intended Netherlands Cities scope preserved
- [x] production migration/data contracts remain verified
- [x] Phase 8 QA and follow-up documentation CI passed
- [x] Phase 9 integration CI passed through production build and secret scan
- [x] integration PR `#196` remains draft and unmerged
- [x] no Phase 10 main merge/deploy performed

Result: Netherlands Cities Phase 0–9 is complete and ready for a separately approved Phase 10 release.
