# New Zealand city Compare v1

Status: `PHASE_6_COMPLETE`

Branch: `agent/nz-cities-city-compare-v1`

## Scope

Phase 6 connects the approved New Zealand Tier A city profiles to the shared City Compare surface.

Approved cities remain exactly:

- Auckland
- Christchurch
- Hamilton
- Wellington
- Dunedin

Deferred cities remain outside the comparison allowlist:

- Palmerston North
- Lincoln
- Tauranga

## Route

The New Zealand comparison entrypoint is:

`/compare?type=city&country=NZ`

The default pair is:

`Auckland vs Christchurch`

Optional `left` and `right` query parameters select another pair from the five approved cities. Duplicate-city requests fall back to a valid distinct pair.

The shared `/compare` surface remains `noindex`.

## Compare readiness

A New Zealand city is compare-ready only when it has:

1. all five verified Phase 4 metrics;
2. at least one verified linked teaching location;
3. at least one linked canonical institution.

The five required metric keys are:

- `city_population`
- `student_living_cost_monthly_range`
- `student_transport_reference`
- `student_work_hours_week`
- `employment_focus_sectors`

Programme count is deliberately not part of the readiness gate because the New Zealand canonical programme catalogue is not yet mature enough for city-delivery coverage to be meaningful.

Production validation on 2026-08-09 confirmed that all five approved cities satisfy the readiness contract.

## Programme gap

All five New Zealand city rows currently have:

- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

The comparison UI does not present this as a completed zero-programme catalogue. It explicitly states that programme delivery remains verification pending and that institution or campus presence is never used to infer programme delivery.

## Comparison semantics

### Study-destination scope

Campus membership continues to use the approved Stats NZ urban-area study-destination scope from Phase 2.

### Population

Population values preserve their own Phase 4 source geography label. Auckland currently uses a Stats NZ urban-area estimated resident population, while several other launch cities use Stats NZ territorial-authority place summaries. The comparison therefore shows the geography label beside each population value and describes the row as contextual rather than perfectly like-for-like.

No silent geography harmonisation is performed in Phase 6.

### Student living cost

The comparison uses the Phase 4 monthly NZD references. These references originate from official institution guidance but use different source baskets and assumptions. The UI therefore treats midpoint comparisons as directional only.

### Student transport

The comparison preserves each source-native public-transport fare product and period.

No synthetic monthly transport amount is generated from single-trip fares.

Fare-card, age and tertiary-eligibility conditions remain visible as source-context caveats.

### Student work rights

The stored national reference is up to 25 hours per week during term for eligible student visas from 3 November 2025.

The UI keeps the rule conditional:

- the individual eVisa conditions control;
- older visa conditions may differ;
- eligible scheduled-break work depends on the applicable visa conditions.

This national rule is not presented as a city differentiator.

### Employment sectors

The sector row uses the Phase 4 official city/economic-development context only. It is not a labour-shortage ranking and is not an employment guarantee.

## Navigation

Each New Zealand City Profile now links into City Compare using:

`/compare?type=city&country=NZ&left={city-slug}`

The Compare matrix links back to both selected city profiles.

## Data access

The comparison server model reads only:

- `public.city_directory_nz_v1`
- `public.report_metric_evidence_city`
- the existing Phase 5 `getNzCityProfile()` read path

It does not query `city_programme_directory_nz_v1` and does not use programme count or programme coverage as a readiness condition.

## Production validation

The Phase 6 production readiness query returned:

| City | Verified locations | Verified institutions | Verified metrics | Programmes | Compare-ready |
|---|---:|---:|---:|---:|---|
| Auckland | 3 | 3 | 5 | 0 / pending | yes |
| Christchurch | 2 | 2 | 5 | 0 / pending | yes |
| Hamilton | 1 | 1 | 5 | 0 / pending | yes |
| Wellington | 3 | 3 | 5 | 0 / pending | yes |
| Dunedin | 1 | 1 | 5 | 0 / pending | yes |

## Repository changes

Phase 6 adds or modifies:

- `src/lib/cities/nz-city-comparison.server.ts`
- `src/app/(workspace)/compare/new-zealand-cities-compare-matrix.tsx`
- `src/app/(workspace)/compare/page.tsx`
- `src/app/(workspace)/cities/new-zealand-city-dashboard.tsx`
- `tests/nz-city-compare-contract.test.ts`
- `docs/data-foundation/nz-city-compare-v1.md`

No database migration is required for Phase 6.

## QA policy for this stage

A dedicated contract test guards:

- the exact five-city allowlist;
- the five-metric compare-ready gate;
- required institution/location linkage;
- programme exclusion from the readiness gate;
- Auckland/Christchurch default pairing;
- NZ routing through the shared Compare page;
- population-geography disclosure;
- source-native transport semantics;
- conditional 25-hour student-work wording;
- Profile ↔ Compare navigation;
- shared Compare `noindex` policy.

Full repository CI and preview/build validation are intentionally deferred to Phase 8 so repeated preview deployments do not consume Vercel build quota during each intermediate phase.
