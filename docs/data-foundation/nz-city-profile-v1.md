# New Zealand city profile v1

Status: `PHASE_5_COMPLETE`

Branch: `agent/nz-cities-profile-v1`

Base Phase 4: `93e8a8e88b279a0ad25516e54e59a1012a849642`

Audit date: 2026-08-09

## Purpose

Implement the first New Zealand city-profile routes from the verified Phase 2-4 data foundation without publishing them to search engines yet.

Phase 5 must present only approved Tier A cities, verified city metrics, source-backed teaching-campus/institution linkage and an honest programme-catalogue gap.

Phase 5 does not add city metrics, mutate production data, enable City Compare or index the routes.

## Route allowlist

The exact New Zealand v1 route set is:

- `/cities/nz/auckland`
- `/cities/nz/christchurch`
- `/cities/nz/hamilton`
- `/cities/nz/wellington`
- `/cities/nz/dunedin`

The shared route contract is implemented through:

- `PUBLISHED_NZ_CITY_SLUGS`
- `isPublishedNzCitySlug()`
- `nzCityPath()`

Palmerston North, Lincoln and Tauranga are not in the Phase 5 route allowlist.

Unsupported New Zealand city slugs resolve through `notFound()`.

## Read model contract

`src/lib/cities/nz-city-profile.server.ts` reads only:

1. `public.city_directory_nz_v1`
2. `public.city_institution_directory_nz_v1`
3. verified rows from `public.report_metric_evidence_city`

The profile layer does not query:

- `public.city_programme_directory_nz_v1`
- raw `catalog.campuses`
- raw `catalog.programmes`
- raw `catalog.programme_offerings`

This prevents unverified catalogue or campus data from leaking into the city profile.

## Institution presentation

Phase 3 produced an initial verified teaching-campus set rather than a complete New Zealand campus inventory.

The profile therefore displays:

- canonical institution name;
- NZ provider number;
- official institution website;
- NZQA provider source;
- verified teaching-location name;
- location source evidence.

The current Phase 3 distribution is:

| City | Verified locations | Distinct institutions |
| --- | ---: | ---: |
| Auckland | 3 | 3 |
| Christchurch | 2 | 2 |
| Hamilton | 1 | 1 |
| Wellington | 3 | 3 |
| Dunedin | 1 | 1 |

Total: 10 verified teaching-location rows and 7 distinct universities.

## Programme coverage

The New Zealand programme catalogue remains intentionally unclaimed at city level.

Every profile displays:

`programme_coverage_status = verification_pending`

The UI explicitly says that this is a catalogue-verification gap rather than `0 programmes`.

Institution or campus presence never establishes programme delivery. A programme can be presented later only after explicit offering-to-campus evidence is verified.

## Five verified metrics

Every route reads the same five Phase 4 metrics:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

The server requires `review_status = verified`.

### Population boundary disclosure

Phase 2 uses a Stats NZ urban-area study-destination contract for campus membership.

The latest official population evidence does not use an identical source geography for all five cities. The profile therefore displays the population metric's own `geography` label rather than implying a uniform population boundary.

This prevents Auckland's urban-area estimate and territorial-authority estimates used for other cities from appearing methodologically identical.

### Living-cost disclosure

Living-cost references remain indicative and institution-specific.

The profile displays the normalized monthly NZD range while preserving the source scenario and evidence metadata in the server model. Phase 4 conversions are explicit rather than silently standardized.

### Transport disclosure

Transport references remain source-native.

The profile does not construct artificial monthly equivalents. It displays the published single-trip reference and notes where a fare card or eligibility condition applies.

### Student work-rights disclosure

The profile reads the current national reference as:

- up to 25 hours per week during term for eligible student visas;
- full-time work during eligible scheduled breaks where the visa conditions permit it;
- individual eVisa conditions remain controlling;
- some visas granted before 3 November 2025 may retain an older 20-hour condition unless varied or replaced.

The rule is presented as national immigration context, not a city differentiator or entitlement for every student.

### Employment sectors

Employment-focus sectors are displayed as official economic-development context.

They are not presented as shortage rankings, guaranteed job opportunities or immigration eligibility signals.

## Metadata and publication state

The route has country-specific canonical metadata:

`/cities/nz/{slug}`

During Phase 5 every approved route remains:

`noindex, follow`

Unsupported routes return metadata with:

`noindex, nofollow`

Search-engine publication is reserved for Phase 7 after Compare is implemented and the publication allowlist is rechecked.

## Compare state

Phase 5 deliberately does not add a Compare CTA or City Compare integration.

Compare readiness is Phase 6 work. Programme count will not be a Compare readiness condition while New Zealand programme coverage remains `verification_pending`.

## Source disclosure

The dashboard includes a metric-source section using the source name, source URL and `data_as_of` stored with each verified Phase 4 metric.

Institution cards separately expose official institution and NZQA provider links.

## Production mutation

No production database mutation is required in Phase 5.

The profile consumes the production data contracts already established by Phases 2-4.

## Files

- `src/lib/cities/city-routes.ts`
- `src/lib/cities/nz-city-profile.server.ts`
- `src/app/(workspace)/cities/new-zealand-city-dashboard.tsx`
- `src/app/(workspace)/cities/nz/[city]/page.tsx`
- `tests/nz-city-profile-contract.test.ts`
- `docs/data-foundation/nz-city-profile-v1.md`

## Acceptance criteria

Phase 5 is complete when all are true:

- [x] exactly five approved NZ city slugs exist in the route allowlist;
- [x] deferred cities do not appear in the allowlist;
- [x] unsupported routes return not found;
- [x] the profile reads only the NZ city linkage read model and verified city metric evidence;
- [x] all five metric types are wired into the profile;
- [x] population source geography is disclosed;
- [x] transport source-native period and eligibility/fare-card context are preserved;
- [x] conditional 25-hour student-work context is preserved;
- [x] verified provider number and teaching-location evidence are displayed;
- [x] programme coverage is displayed as verification pending rather than zero availability;
- [x] institution presence is never converted to programme delivery;
- [x] metric source disclosure is present;
- [x] approved routes remain `noindex, follow` until Phase 7;
- [x] Compare is not enabled early;
- [x] no production migration is required.

## Validation posture

Phase 5 is designed to avoid opening a temporary PR solely for validation, preserving Vercel build quota for later QA. The static profile contract is committed now; repository-wide CI and production build validation should be run during the later QA phase or when a non-Vercel-consuming CI path is available.

## Handoff

Proceed to Phase 6 — City Compare — using exactly:

`auckland`, `christchurch`, `hamilton`, `wellington`, `dunedin`

Compare readiness should require:

- all five verified metrics;
- at least one verified teaching location;
- at least one linked canonical institution.

Programme count must not be required while the New Zealand programme catalogue remains `verification_pending`.
