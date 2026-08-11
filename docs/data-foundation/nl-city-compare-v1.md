# Netherlands city Compare v1

Status: `PHASE_6_COMPLETE`

Checkpoint: `COMPARE_COMPLETE`

Branch: `agent/nl-cities-city-compare-v1`

Base Phase 5: `8a26fccf58be09cbd7404176c3586f01e8aa594c`

Audit date: 2026-08-10

## Purpose

Connect the five approved Netherlands Tier A city profiles to the shared City Compare surface without weakening the evidence boundaries established in Phases 2–5.

Tier A remains exactly:

- `amsterdam`
- `maastricht`
- `rotterdam`
- `groningen`
- `eindhoven`

Tier B and discovered expansion candidates remain outside the comparison allowlist.

## Route

The Netherlands comparison entrypoint is:

`/compare?type=city&country=NL`

The default pair is:

`Amsterdam vs Maastricht`

Optional `left` and `right` query parameters select another valid pair. Duplicate-city requests fall back to a distinct valid pair.

The shared `/compare` page remains `noindex, nofollow`.

## Compare readiness

A Netherlands city is compare-ready only when it has:

1. all five verified Phase 4 metrics;
2. at least one verified Phase 3 location;
3. at least one linked canonical institution.

The required metrics remain:

- `city_population`
- `student_living_cost_monthly_range`
- `student_transport_reference`
- `student_work_hours_week`
- `employment_focus_sectors`

Programme count is deliberately not part of the readiness gate.

HBO completeness is also not part of the readiness gate. The current institution layer is explicitly an initial research-university core, so incomplete HBO coverage must be disclosed rather than interpreted as absence.

## Production readiness verification

Production verification on 2026-08-10 returned:

| City | Verified locations | Verified institutions | Verified metrics | Programmes | Programme status | Compare-ready |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Amsterdam | 2 | 2 | 5 | 0 | verification_pending | yes |
| Maastricht | 1 | 1 | 5 | 0 | verification_pending | yes |
| Rotterdam | 1 | 1 | 5 | 0 | verification_pending | yes |
| Groningen | 1 | 1 | 5 | 0 | verification_pending | yes |
| Eindhoven | 1 | 1 | 5 | 0 | verification_pending | yes |

No database mutation is required for Phase 6.

## Comparison semantics

### Geography

All five cities use the same public study-destination and population boundary family:

`CBS municipality`

The comparison shows the official municipality code with population and does not substitute province or metropolitan-area values.

Phase 4 population date is 1 January 2026.

### Student living cost

Monthly EUR references are compared as directional decision context only.

Source baskets are not identical:

- Amsterdam and Groningen use current city-linked university student-cost references;
- Maastricht and Rotterdam use explicit university budget proxies;
- Eindhoven currently uses the Study in NL national baseline because a complete current TU/e city-specific monthly total was not verified.

The UI keeps the Eindhoven national-baseline caveat visible and does not imply that every city row has identical methodology.

### Student transport

Transport references preserve source-native products and periods.

Examples include hourly tickets, multi-hour tickets, monthly discount products and a single bus trip. Phase 6 does not synthesize monthly equivalents from those different products.

The metric is general transport context unless the source explicitly identifies a student-specific product.

### Student work context

The stored national employee reference is:

- up to 16 hours per week; **or**
- full-time in June, July and August;
- employer TWV required for the employee route.

This national rule is not used as a city differentiator. Individual nationality, residence status and work conditions remain controlling.

### Employment sectors

Employment-focus sectors remain municipal economic-development context only.

They are not shortage rankings, guaranteed job opportunities or immigration eligibility signals.

## Coverage gaps

### Programme delivery

All five current city rows have:

`programme_coverage_status = verification_pending`

Programme count does not block city comparison. Institution presence never establishes programme delivery; only explicit verified offering-to-campus evidence can create a city programme record.

### Institution universe

Current city institution coverage remains:

`research_university_core_hbo_pending`

The Compare UI states that HBO coverage is incomplete rather than presenting the current research-university counts as exhaustive Dutch higher education.

## Navigation

Each Netherlands City Profile now links into City Compare through:

`/compare?type=city&country=NL&left={city-slug}`

The Compare matrix links back to both selected profiles.

## Data access

`src/lib/cities/nl-city-comparison.server.ts` reads only:

- `public.city_directory_nl_v1`;
- verified `public.report_metric_evidence_city` rows;
- the existing Phase 5 `getNlCityProfile()` read path.

It does not query `city_programme_directory_nl_v1` and does not use `linked_program_count`, `programme_coverage_status` or HBO completion as readiness gates.

## Repository changes

Phase 6 adds or modifies:

- `src/lib/cities/nl-city-comparison.server.ts`
- `src/app/(workspace)/compare/netherlands-cities-compare-matrix.tsx`
- `src/app/(workspace)/compare/page.tsx`
- `src/app/(workspace)/cities/netherlands-city-dashboard.tsx`
- `tests/nl-city-compare-contract.test.ts`
- `docs/data-foundation/nl-city-compare-v1.md`

## Acceptance criteria

- [x] exactly five Tier A cities are eligible;
- [x] all five production cities satisfy the five-metric + institution/location readiness gate;
- [x] programme count is excluded from readiness;
- [x] HBO completeness is excluded from readiness but disclosed;
- [x] default pair is Amsterdam vs Maastricht;
- [x] duplicate-city selection resolves to a distinct pair;
- [x] shared `/compare` supports `country=NL`;
- [x] CBS municipality boundary is explicit;
- [x] Eindhoven national living-cost baseline is disclosed;
- [x] source-native transport periods are preserved;
- [x] 16-hour / June–August / TWV work context is preserved;
- [x] Profile ↔ Compare navigation is connected;
- [x] Compare remains noindex;
- [x] no production migration is required.

## Validation posture

As with the previous multi-city rollout, full repository CI and production build validation are deferred to Phase 8 QA to avoid repeated Vercel preview consumption during intermediate phases.

## Handoff

Proceed to Phase 7 publication and SEO using exactly:

`amsterdam`, `maastricht`, `rotterdam`, `groningen`, `eindhoven`

Phase 7 may make the approved city routes indexable only after the publication allowlist and sitemap contract are checked. The shared Compare route should remain noindex.
