# Spain Cities — Phase 8 production QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Country: `ES` — Spain

Audit date: 2026-08-11

## Production recheck

Production was re-queried after the Phase 6 and Phase 7 application changes.

Verified state:

- Tier A canonical municipalities: `7`
- city read-model rows: `7`
- verified teaching-location rows: `10`
- distinct linked institutions in the Tier A read model: `10`
- strict city-linked programme rows: `97`
- verified core metric rows: `35`
- compare-ready cities: `7/7`
- readiness failures: `0`
- programme source-city mismatches: `0`
- forbidden locality leaks: `0`
- programme coverage `verified_partial`: `4` cities
- programme coverage `verification_pending`: `3` cities

## Metric guards

All seven cities retain the intended metric safety flags:

- INE municipality population contract: `7/7`
- living-cost records with `ranking_safe=false`: `7/7`
- national 30-hour student-work rows: `7/7`
- employment-sector rows marked both not-shortage-ranking and not-job-guarantee: `7/7`

## Read-model security

The four Spain city views remain `security_invoker=true`:

- `public.city_directory_es_v1`
- `public.city_institution_directory_es_v1`
- `public.city_programme_directory_es_v1`
- `public.city_metric_directory_es_v1`

Privileges on all four:

- `service_role`: SELECT
- `anon`: no SELECT
- `authenticated`: no SELECT

The public city pages use the server-side service-role loader and do not expose these read models directly to browser roles.

## Security advisor context

The Supabase project security advisor was reviewed during Phase 8.

It reports existing project-wide informational notices for RLS-enabled tables without policies and a project-level warning that leaked-password protection is disabled. These findings are not introduced by the Spain Cities Phase 6–8 changes. The Spain city views themselves remain service-role-only and security-invoker as independently verified above.

The project-wide Auth warning should be handled separately from the Spain Cities release scope.

## Application contract

Phase 8 confirms:

- exactly seven published Spain city slugs
- all seven are also the Compare selector cohort
- profile routes are canonical and indexable
- unsupported Spain city slugs remain excluded
- parameterized Compare remains noindex
- sitemap derives Spain city routes from the published allowlist
- no Compare URL is sitemap-published
- living-cost and transport evidence is not normalized into false comparable rankings
- Valencia, Granada and Bilbao programme status remains verification pending rather than zero-programme claims

## Phase 8 conclusion

Spain Cities has reached `PUBLISH_READY` at the application and data-contract level.

Phase 9 must reconcile the branch against the authoritative current `main`, preserve all shared Compare, route and sitemap changes, run final CI and finish with `behind 0`.

Phase 9 does not merge the Spain branch into `main` and does not deploy production. Those are release actions outside the requested Phase 6–9 scope.
