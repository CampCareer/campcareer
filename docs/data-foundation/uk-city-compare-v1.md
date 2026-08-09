# United Kingdom city compare v1

Status: `PHASE_6_COMPLETE`

Current branch: `agent/uk-cities-city-compare-v1`

Parent branch: `agent/uk-cities-profile-v1`

## Purpose

Connect the ten approved UK Tier A city profiles to the shared `/compare` city surface without weakening the evidence rules established in Phases 2–5.

The comparison layer is decision support over verified city evidence. It does not infer programme delivery from institution presence and it does not flatten different city boundary definitions into a fake common geography.

## Published comparison set

The comparison options are exactly the existing UK Tier A allowlist:

- London
- Manchester
- Birmingham
- Edinburgh
- Glasgow
- Cardiff
- Belfast
- Oxford
- Cambridge
- Bristol

The default pair when no valid `left` / `right` query is supplied is:

`London vs Manchester`

All other valid pairs are selected through the shared city selector and remain on the canonical root Compare route:

`/compare?type=city&country=UK&left=<slug>&right=<slug>`

## Compare-readiness contract

A UK city is eligible for Compare only when it has:

1. a Tier A public city profile;
2. at least one verified official campus/location;
3. at least one verified canonical institution;
4. all five required city metrics in `report_metric_evidence_city` with `review_status = 'verified'`:
   - `city_population`
   - `student_living_cost_monthly_range`
   - `student_transport_reference`
   - `student_work_hours_week`
   - `employment_focus_sectors`

`linked_program_count > 0` is deliberately not a Compare-readiness requirement.

Production verification on 8 August 2026 confirmed all ten Tier A UK cities satisfy the Compare-readiness contract. Each currently has five verified metrics and positive institution/location linkage.

## Programme coverage rule

All ten city rows currently retain:

- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

This is not interpreted as evidence that the cities have zero programmes.

The current UK catalogue contains legacy programme records whose official programme-page and delivery-campus assignment has not yet been promoted to verified city delivery. Compare therefore displays a programme verification notice rather than a numerical zero and does not calculate shared programme counts.

Programme delivery can be added later only through explicit verified programme-offering-to-campus evidence.

## Geography and scope rule

Compare preserves each city's approved Phase 2 scope.

London:

- `Greater London`
- population and campus membership follow that study-destination boundary

Other Tier A destinations:

- approved named-city / local-authority or council boundary
- neighbouring authorities are not silently absorbed

The matrix includes a dedicated `Study-destination scope` row and explicitly warns that Greater London should not be treated as the same geography type as a named-city local authority.

This also prevents a London population comparison from being presented as though every city is measured on an identical administrative unit.

## Metrics shown

### Student living

The matrix preserves the verified monthly GBP reference from Phase 4. Official university budget methodologies differ, so the midpoint signal is labelled directional rather than a guaranteed personal budget or a perfectly standardized basket.

### Student transport

Source-native fare periods are retained. Monthly, 28-day, four-week, daily and single-journey products are not silently normalized into a synthetic common price.

Eligibility conditions remain visible in the underlying city profile evidence.

### Student visa work

The matrix retains the current UK qualification context:

- up to 20 hours per week during term time for qualifying full-time degree-level study at a compliant higher education provider;
- other study levels, sponsor types and course patterns can have different or no work permission;
- applicable Student visa conditions remain controlling.

The comparison does not present `20 hours` as an unconditional rule for every international student.

### Institution and campus presence

Counts come only from `city_institution_directory_uk_v1`, whose Phase 3 contract requires:

- canonical institution slug;
- 8-digit UKPRN;
- official institution website;
- verified official location source.

Manchester therefore continues to exclude the University of Salford from Manchester city membership unless a separately verified delivery location inside the Manchester city scope is established.

### Population and career context

Population follows the documented city scope. Career sectors remain official economic-development context, not shortage rankings or employment guarantees.

## Product integration

Phase 6 adds:

- `src/lib/cities/uk-city-comparison.server.ts`
- `src/app/(workspace)/compare/united-kingdom-cities-compare-matrix.tsx`
- UK handling in `src/app/(workspace)/compare/page.tsx`
- City → Compare CTA in `src/app/(workspace)/cities/united-kingdom-city-dashboard.tsx`
- `tests/uk-city-compare-contract.test.ts`

This produces bidirectional City ↔ Compare navigation:

- `/cities/uk/<slug>` → UK city Compare with that city selected on the left
- UK city Compare → either city profile

## Database impact

Phase 6 requires no new database migration.

The Compare layer consumes the existing Phase 3 linkage tables and Phase 4 metric evidence without duplicating data into a comparison-specific table.

## Publication boundary

Phase 6 completes the City/Compare product connection but does not perform the Phase 7 publication/SEO gate.

The following remain separate Phase 7 responsibilities:

- sitemap inclusion;
- final indexability policy;
- canonical/publication SEO QA;
- publication discovery surfaces beyond the current direct routes.

## Completion gate

Phase 6 is complete because:

- all ten Tier A cities are Compare-ready under the evidence contract;
- root Compare supports `country=UK`;
- default comparison is London vs Manchester;
- arbitrary valid UK Tier A pairs can be selected;
- City and Compare are bidirectionally linked;
- boundary differences are explicit;
- programme verification pending is not converted into a false zero;
- the Student visa work condition remains qualified;
- no programme delivery is inferred from institution presence;
- a contract test guards the above behavior.

Next branch:

`agent/uk-cities-publication-v1`

Phase 7 should handle publication and SEO only after preserving all Phase 6 evidence and scope contracts.
