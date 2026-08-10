# Netherlands city main integration v1

Status: `PHASE_9_GATE_PENDING`

Branch: `agent/nl-cities-main-integration-v1`

Base main commit: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Source QA branch: `agent/nl-cities-qa-v1`

Audit date: 2026-08-10

## Purpose

Integrate the completed Netherlands Cities Phase 0–8 rollout onto the current cities/main baseline without performing the Phase 10 merge to `main`.

## Current-main reconciliation

At Phase 9 start, GitHub comparison returned:

- QA lineage ahead of current main: 31 commits
- QA lineage behind current main: 0 commits
- merge base: current main `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Current main therefore remains a direct ancestor of the completed Netherlands rollout. No newer main-only commit needs transplantation or conflict reconciliation in this phase.

The integration branch is created directly from the final Phase 8 QA lineage. This preserves current main unchanged while providing a single Phase 0–9 release candidate for a later Phase 10 merge.

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

Because current main is still the rollout ancestor and the integration branch is `0` commits behind main, no additional shared-file reconciliation is necessary at Phase 9 start. The existing AU/CA/NZ/UK/US/SG behaviour already present on main is retained by the Netherlands lineage.

## Data state

No new Phase 9 production migration is required.

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
- `/compare?type=city&country=NL` as the noindex comparison surface
- programme-delivery and HBO coverage gaps as explicit incomplete states

## Release hold

Vercel preview remains externally blocked by the account `build-rate-limit` condition recorded in Phase 8.

GitHub Actions production build is the code/build verification path for Phase 9. Phase 10 deployment must still recheck Vercel capacity or another approved deployment validation path.

## Phase 9 gate

Phase 9 completes only when the integration PR against current `main` confirms:

- branch remains zero commits behind main;
- diff contains the intended Netherlands Cities rollout only;
- repository CI passes dependency install/audit, typecheck, lint, full tests, production build and Git-history secret scan;
- no main merge is performed.

Phase 10 remains explicitly out of scope until the user schedules release.
