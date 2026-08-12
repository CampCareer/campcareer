# Ireland city compare v1

Status: `PHASE_6_COMPLETE`

Current branch: `agent/ie-cities-city-compare-v1`

Parent branch: `agent/ie-cities-profile-v1`

## Purpose

Connect the four approved Ireland Tier A city profiles to the shared `/compare` city surface without weakening the evidence rules established in Phases 2–5.

The comparison layer is decision support over verified city evidence. It does not infer programme delivery from institution presence and it does not flatten Dublin's study-market boundary into the same geography definition as every other city.

## Published comparison set

The comparison options are exactly the Ireland Tier A allowlist:

- Dublin
- Cork
- Galway
- Limerick

The default pair when no valid `left` / `right` query is supplied is:

`Dublin vs Cork`

Valid pairs use the shared Compare route:

`/compare?type=city&country=IE&left=<slug>&right=<slug>`

The deferred Phase 1 expansion candidates remain outside the allowlist:

- Maynooth
- Waterford
- Athlone
- Sligo
- Dundalk
- Letterkenny

## Compare-readiness contract

An Ireland city is eligible for Compare only when it has:

1. an approved Tier A profile;
2. at least one verified official institution location;
3. at least one verified HEA-recognised institution;
4. all five required city metrics in `report_metric_evidence_city` with `review_status = 'verified'`:
   - `city_population`
   - `student_living_cost_monthly_range`
   - `student_transport_reference`
   - `student_work_hours_week`
   - `employment_focus_sectors`

`linked_program_count > 0` is deliberately not a Compare-readiness requirement.

Production verification on 9 August 2026 confirmed all four Tier A cities meet the contract:

- Dublin: 5 verified locations, 5 verified institutions, 5 verified metrics
- Cork: 1 verified location, 1 verified institution, 5 verified metrics
- Galway: 1 verified location, 1 verified institution, 5 verified metrics
- Limerick: 2 verified locations, 2 verified institutions, 5 verified metrics

## Programme coverage rule

All four city rows currently retain:

- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

This is not interpreted as evidence that the cities have zero programmes.

The Ireland programme catalogue still contains legacy/unverified offerings whose delivery campus has not been promoted through explicit official programme-to-campus evidence. Compare therefore shows a programme verification notice, does not calculate shared programme counts, and does not block comparison readiness on programme coverage.

## Geography and scope rule

Compare preserves each Phase 2 scope.

Dublin:

- `dublin_four_local_authorities`
- Dublin City
- Fingal
- Dún Laoghaire-Rathdown
- South Dublin

Cork:

- `cork_city`

Galway:

- `galway_city`

Limerick:

- `limerick_urban`

The matrix includes an explicit `Study-destination scope` row. County-wide or neighbouring-area membership is not silently inferred.

## Metrics shown

### Student living

The matrix preserves the verified monthly EUR references from Phase 4. Institution budget methodologies differ, so the midpoint signal is directional rather than a guaranteed personal budget or standardized basket.

### Student transport

TFI source-native periods are preserved:

- Dublin keeps its 90-minute reference;
- Cork, Galway and Limerick keep their single-journey references.

No synthetic monthly conversion is introduced.

### Stamp 2 work context

The comparison retains the national conditional reference stored in Phase 4:

- 20 hours per week during term;
- 40 hours per week during designated holiday periods;
- immigration, registration and course conditions still control eligibility.

The numbers are not presented as unconditional work permission for every student.

### Institution and campus presence

Counts come from `city_institution_directory_ie_v1`, whose Phase 3 contract requires:

- active Ireland institution;
- canonical institution slug;
- official website;
- HEA recognised-entity evidence;
- explicit official campus/location evidence.

The current set is the initial verified set and is not presented as exhaustive coverage of every provider in each city.

### Population and career context

Population follows the documented Phase 4 scope. Career sectors remain official economic-development context, not shortage rankings or employment guarantees.

## Product integration

Phase 6 adds:

- `src/lib/cities/ie-city-comparison.server.ts`
- `src/app/(workspace)/compare/ireland-cities-compare-matrix.tsx`
- Ireland handling in `src/app/(workspace)/compare/page.tsx`
- City → Compare CTA in `src/app/(workspace)/cities/ireland-city-dashboard.tsx`
- `tests/ie-city-compare-contract.test.ts`
- Phase 5 profile contract updated to expect Compare navigation

This produces bidirectional City ↔ Compare navigation:

- `/cities/ie/<slug>` → Ireland City Compare with that city selected on the left
- Ireland City Compare → either city profile

## Database impact

Phase 6 requires no database migration.

The Compare layer consumes the existing Phase 3 linkage tables and Phase 4 metric evidence without creating comparison-specific duplicated data.

The current Supabase read models are service-role-only and already use explicit grants, so the 2026 Data API default-exposure change does not require a Phase 6 schema change.

## Publication boundary

Phase 6 does not perform the Phase 7 publication/SEO gate.

Ireland city profile routes remain `noindex, follow` in Phase 6, unsupported slugs remain `noindex, nofollow`, and the shared Compare root remains `noindex, nofollow`.

Phase 7 is responsible for:

- final city-route indexability;
- sitemap inclusion;
- canonical/publication SEO QA;
- publication discovery surfaces.

## Completion gate

Phase 6 is complete because:

- all four Tier A cities are Compare-ready under the evidence contract;
- root Compare supports `country=IE`;
- default comparison is Dublin vs Cork;
- valid Tier A pairs can be selected;
- City and Compare are bidirectionally linked;
- Dublin's distinct scope remains explicit;
- TFI transport periods remain source-native;
- Stamp 2 work conditions remain qualified;
- programme verification pending is not converted into a false zero;
- programme presence is not a readiness gate;
- no programme delivery is inferred from institution presence;
- contract tests guard the above behavior.

Next branch:

`agent/ie-cities-publication-v1`

Phase 7 should handle publication and SEO only while preserving all Phase 6 evidence and scope contracts.
