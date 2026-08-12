# United Arab Emirates Cities — Phase 8 production QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Country: `AE` — United Arab Emirates

Audit date: 2026-08-12

Branch: `agent/ae-cities-v1`

## Production recheck

The CampCareer Supabase project was re-queried after restoring and applying the UAE City Phase 2–4 foundation to production and after the Phase 6–7 application changes.

Verified state:

- Tier A canonical City rows: `4`
- verified teaching-location rows: `11`
- distinct linked institutions: `11`
- strict City-linked programme rows: `98`
- verified core metric rows: `20`
- Compare-ready Cities: `4/4`
- readiness failures: `0`
- programme source-City mismatches: `0`
- deferred-City programme leaks: `0`
- programme coverage `verified_partial`: `4` Cities

Per-City verified linkage remains:

- Abu Dhabi: 4 locations, 4 providers, 39 programmes
- Sharjah: 1 location, 1 provider, 26 programmes
- Al Ain: 1 location, 1 provider, 18 programmes
- Dubai: 5 locations, 5 providers, 15 programmes

## Metric guards

All four Cities retain the intended evidence boundaries:

- City-population rows with no substituted numeric emirate value: `4/4`
- living-cost rows with `ranking_safe=false`: `4/4`
- student-work rows with no invented fixed weekly cap: `4/4`
- employment-sector rows marked both not-shortage-ranking and not-job-guarantee: `4/4`

The Phase 4 migration was also corrected so the source date is explicitly cast to PostgreSQL `date` with `m.data_as_of::date`. The original text-inference form failed against the production column type and is no longer retained.

## Read-model security

The four UAE City views are independently verified with `security_invoker=true`:

- `public.city_directory_ae_v1`
- `public.city_institution_directory_ae_v1`
- `public.city_programme_directory_ae_v1`
- `public.city_metric_directory_ae_v1`

Privileges on every view:

- `service_role`: SELECT
- `anon`: no SELECT
- `authenticated`: no SELECT

The application reads these views through the server-side service-role client rather than exposing them to browser roles.

## Security advisor context

The Supabase security advisor was reviewed during Phase 8.

It currently reports project-wide informational notices for RLS-enabled tables without policies and a project-level warning that leaked-password protection is disabled. Phase 8 does not alter those project-wide authentication or table-policy settings.

The UAE City release surface is independently constrained by the service-role-only view grants verified above. The wider project security-advisor findings remain a separate platform-hardening workstream.

## Application contract

Phase 8 confirms:

- exactly four published UAE City slugs
- the same four form the Compare selector cohort
- all four profile routes are canonical and indexable
- unsupported UAE City slugs remain excluded
- parameterized Compare remains noindex
- sitemap derives UAE City routes from `PUBLISHED_AE_CITY_SLUGS`
- no Compare URL is sitemap-published
- City and emirate geography semantics remain separate
- heterogeneous living-cost and transport evidence is not normalized into a false ranking
- student employment stays permit-based national context without an invented universal weekly-hour cap
- programme and provider coverage remains explicitly partial rather than a complete-market claim

## Phase 8 conclusion

UAE Cities has reached `PUBLISH_READY` at the production-data and application-contract level.

Phase 9 must reconcile the branch against authoritative current `main`, preserve shared Compare, route and sitemap surfaces, add integration regression coverage and run final CI.

Phase 9 does not merge the UAE branch into `main` and does not deploy production application code.
