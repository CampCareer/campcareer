# Germany city Compare v1

Status: `PHASE_6_COMPLETE`

Branch: `agent/de-cities-city-compare-v1`

Parent Phase 5: `agent/de-cities-profile-v1`

Audit date: 2026-08-10

## Purpose

Connect the nine approved Germany Tier A city profiles to the shared City Compare surface without weakening the Phase 2 municipality boundary, Phase 3 teaching-location evidence, Phase 4 metric semantics or Phase 5 programme-verification disclosure.

## Approved comparison set

Exactly nine Germany cities are compare-eligible:

- Berlin
- Munich
- Hamburg
- Aachen
- Bonn
- Dresden
- Heidelberg
- Karlsruhe
- Tübingen

The route source of truth remains `PUBLISHED_DE_CITY_SLUGS`.

## Route

Germany City Compare uses:

`/compare?type=city&country=DE`

Default pair:

`Berlin vs Munich`

Optional `left` and `right` query parameters select another approved pair. Duplicate-city requests fall back to a valid distinct pair.

The shared Compare surface remains `noindex, nofollow`.

## Compare readiness

A Germany city is compare-ready only when all are true:

1. the city is in `PUBLISHED_DE_CITY_SLUGS`;
2. all five Phase 4 metric keys are verified;
3. at least one verified teaching location is linked;
4. at least one canonical institution is linked.

Required metric keys:

- `city_population`
- `student_living_cost_monthly_range`
- `student_transport_reference`
- `student_work_hours_week`
- `employment_focus_sectors`

Programme count is deliberately not a readiness condition because Germany city programme delivery remains `verification_pending`.

Production readiness was rechecked before Phase 6: all nine Tier A cities have five verified metrics, at least one verified teaching location and at least one linked canonical institution.

## Comparison semantics

### Municipality boundary

All nine cities use the same Phase 2 Destatis / GV-ISys politically independent municipality contract. Population values retain official municipality labels and AGS identifiers.

Metro areas, surrounding districts and neighbouring municipalities are not silently included.

### Student living

Monthly EUR references remain source-native university guidance. Methodologies differ across cities, so midpoint comparisons are directional only and are not treated as a standardized cost-of-living index.

### Student transport

The UI preserves the source ticket product and period. Semester tickets remain semester values; monthly tickets remain monthly values; Heidelberg's source range remains a range.

No synthetic monthly conversion is created. Enrolment, age and other eligibility conditions remain explicit.

### International-student work

The shared federal context remains:

- up to 20 hours per week during lecture periods for eligible third-country students;
- 140 full / 280 half days annually as the stored alternative framework;
- student auxiliary academic work exception where applicable;
- individual residence conditions still control.

This is national context, not a city differentiator.

### Employment sectors

Official economic-sector context is shown as directional career context only. It is not a shortage ranking, employment guarantee or immigration eligibility signal.

## Programme coverage

The Germany canonical programme catalogue is not used as city-delivery evidence.

All nine city rows remain:

- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

Institution or teaching-location presence is never converted into programme delivery. Compare remains available because verified city decision evidence is already sufficient for city-level comparison.

## Navigation

Each Germany city profile links to:

`/compare?type=city&country=DE&left={city-slug}`

The Compare matrix links back to both selected Germany city profiles.

## Files

Phase 6 adds or modifies:

- `src/lib/cities/de-city-comparison.server.ts`
- `src/app/(workspace)/compare/germany-cities-compare-matrix.tsx`
- `src/app/(workspace)/compare/page.tsx`
- `src/app/(workspace)/cities/de/[city]/page.tsx`
- `tests/de-city-compare-contract.test.ts`
- `docs/data-foundation/de-city-compare-v1.md`

No database migration is required.

## Completion gate

- [x] exact nine-city allowlist preserved
- [x] five verified metrics required for Compare readiness
- [x] positive teaching-location and institution linkage required
- [x] programme count excluded from readiness
- [x] Berlin vs Munich default pair
- [x] duplicate pair protection
- [x] Germany routed through shared Compare
- [x] municipality + AGS population semantics preserved
- [x] source-native transport values/ranges preserved
- [x] federal 20h / 140 / 280 work context preserved
- [x] programme verification-pending disclosure preserved
- [x] Profile ↔ Compare navigation present
- [x] Compare remains noindex
- [x] no production database mutation

Next: Phase 7 publication and SEO.
