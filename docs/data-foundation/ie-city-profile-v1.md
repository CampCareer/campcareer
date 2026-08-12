# Ireland city profile v1

Status: `PHASE_5_COMPLETE`

Branch: `agent/ie-cities-profile-v1`

Base branch: `agent/ie-cities-metrics-v1`

## Purpose

Publish the application-layer City Profile contract for the four approved Ireland Tier A study destinations while preserving the Phase 3 programme-verification gap. Phase 5 creates no database schema or data migration; it consumes the service-role city read models from Phase 3 and the five verified metrics from Phase 4.

## Approved profile routes

Exactly four Ireland city slugs are allowlisted:

- `dublin` → `/cities/ie/dublin`
- `cork` → `/cities/ie/cork`
- `galway` → `/cities/ie/galway`
- `limerick` → `/cities/ie/limerick`

Deferred cities such as Maynooth, Waterford, Athlone, Sligo, Dundalk and Letterkenny are not added to the route allowlist.

The route helper is `ieCityPath()` and the canonical route family remains `/cities/ie/{slug}`.

## Server read model

`src/lib/cities/ie-city-profile.server.ts` is server-only and cached with React `cache()`.

It reads only:

- `public.city_directory_ie_v1`
- `public.city_institution_directory_ie_v1`
- verified rows from `public.report_metric_evidence_city`

It does not read raw `catalog.campuses`, `catalog.programmes`, `catalog.programme_offerings`, or the Ireland city programme directory. This prevents legacy programme discovery rows from appearing as verified city delivery.

## Profile metrics

Every profile consumes the five Phase 4 metric keys:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Metric presentation preserves source methodology:

- population retains its actual geography label;
- student living costs remain indicative EUR values and source scenarios are not treated as harmonised budgets;
- transport keeps the source-native period rather than inventing monthly equivalents;
- Stamp 2 work permission is shown as a national conditional rule with both term-time and designated-holiday hour references;
- employment sectors are contextual cluster/economic-development signals, not shortage rankings or employment guarantees.

## Geography semantics

### Dublin

Dublin is not treated as Dublin City Council alone. The profile explicitly describes the approved study-market scope covering:

- Dublin City
- Fingal
- Dún Laoghaire-Rathdown
- South Dublin

The broad scope does not relax campus evidence. Each institution location must still be explicitly verified.

### Cork and Galway

Cork and Galway use approved city study scopes. County-wide membership is not inferred.

### Limerick

Limerick uses the approved urban study scope. County-wide membership is not inferred.

## Institution presentation

Phase 3 currently exposes an initial verified set of nine HEA-recognised institution/campus rows:

- Dublin: 5
- Cork: 1
- Galway: 1
- Limerick: 2

The profile calls this an initial verified set rather than an exhaustive city institution directory. Each presented institution has:

- HEA recognition evidence in the Phase 3 contract;
- canonical institution identity;
- official website;
- explicit official campus/location evidence.

Ireland-specific internal institution profile routes are not invented in Phase 5. The UI links to the official institution website and HEA authority source. Broader Institution integration belongs to Phase 9.

## Programme coverage

Verified city programme delivery remains intentionally empty.

Current state:

- `linked_program_count = 0` for all four cities;
- `programme_coverage_status = verification_pending` for all four cities;
- the existing 2,876 Ireland programme offerings remain legacy/unverified discovery data.

The profile must never describe this as “0 programmes” in the user-facing catalogue sense. It presents an explicit verification-pending notice and states that institution presence is not evidence of programme delivery.

Programme absence is not a profile-readiness blocker.

## Publication state

Phase 5 routes exist but are not yet search-published.

Approved route metadata:

- valid Tier A route: `robots: index=false, follow=true`
- unsupported Ireland city slug: `robots: index=false, follow=false` and `notFound()`
- canonical URL is already stable at `/cities/ie/{slug}`

Phase 7 Publication & SEO will decide when to turn the four approved routes indexable and add them to sitemap surfaces.

## Compare state

Phase 5 does not enable City Compare or add a Compare CTA. Compare eligibility and navigation are Phase 6 work.

The intended Phase 6 readiness gate may use the same principle as the UK rollout:

- five verified city metrics;
- at least one verified institution and campus location;
- programme delivery is not required while the verification gap is stated explicitly.

All four current Tier A cities already meet the data portion of that expected gate.

## Files

- `src/lib/cities/city-routes.ts`
- `src/lib/cities/ie-city-profile.server.ts`
- `src/app/(workspace)/cities/ireland-city-dashboard.tsx`
- `src/app/(workspace)/cities/ie/[city]/page.tsx`
- `tests/ie-city-profile-contract.test.ts`
- `docs/data-foundation/ie-city-profile-v1.md`

## Database impact

No Phase 5 migration.

The application consumes production data already created by:

- `20260809093421_publish_ie_tier_a_city_linkage_v1`
- `20260809094322_publish_ie_tier_a_city_metrics_v1`

## Phase 5 decision

`PHASE_5_COMPLETE`

Ireland City Profiles are implemented for Dublin, Cork, Galway and Limerick with verified institutions, verified five-metric evidence, explicit study scopes and an honest programme-delivery gap.

Next branch:

`agent/ie-cities-city-compare-v1`

Phase 6 should add Ireland City Compare for the same four-city allowlist without introducing a programme-count readiness requirement.
