# Germany city profile v1

Status: `PHASE_5_COMPLETE`

Branch: `agent/de-cities-profile-v1`

Base Phase 4: `64518ae6c6124998294b68fcfce882f9d71ac13f`

Audit date: 2026-08-10

## Purpose

Implement the first Germany city-profile routes from the verified Phase 2–4 data foundation without publishing them to search engines yet.

Phase 5 presents only approved Tier A municipalities, verified city metrics, source-backed teaching-location/institution linkage and the current city programme-delivery verification gap.

Phase 5 does not add city metrics, mutate production data, enable City Compare or index the routes.

## Route allowlist

The exact Germany v1 route set is:

- `/cities/de/berlin`
- `/cities/de/munich`
- `/cities/de/hamburg`
- `/cities/de/aachen`
- `/cities/de/bonn`
- `/cities/de/dresden`
- `/cities/de/heidelberg`
- `/cities/de/karlsruhe`
- `/cities/de/tuebingen`

The shared route contract is implemented through:

- `PUBLISHED_DE_CITY_SLUGS`
- `isPublishedDeCitySlug()`
- `deCityPath()`

Expansion candidates such as Frankfurt am Main, Cologne/Köln, Leipzig, Münster, Stuttgart and Freiburg im Breisgau are not in the Phase 5 route allowlist.

Unsupported Germany city slugs resolve through `notFound()`.

## Read model contract

`src/lib/cities/de-city-profile.server.ts` reads only:

1. `public.city_directory_de_v1`
2. `public.city_institution_directory_de_v1`
3. verified rows from `public.report_metric_evidence_city`

The profile layer does not query:

- `public.city_programme_directory_de_v1`
- raw `catalog.campuses`
- raw `catalog.programmes`
- raw `catalog.programme_offerings`

This prevents the 72 existing Germany programmes/offering seeds from being presented as city-delivery evidence before explicit offering-to-campus verification exists.

## Municipality boundary disclosure

All nine profiles use the Phase 2 Destatis / GV-ISys municipality contract.

The profile displays:

- the metric's official municipality label;
- the population `data_as_of` date;
- the eight-digit AGS where available;
- explicit copy that metro areas, neighbouring municipalities and institution marketing regions are not silently included.

This is particularly important for multi-location institutions such as TUM and KIT. Garching is not silently treated as Munich, and KIT Campus North is not silently treated as Karlsruhe city.

## Institution presentation

Phase 3 produced 12 conservative verified teaching-location rows for 12 canonical institutions across the nine Tier A cities.

The profile displays:

- canonical institution name;
- verified institution domain from `DE_HRK_VERIFIED_DOMAIN`;
- official institution website / identity source;
- verified teaching-location name;
- address/postal code where source-backed;
- teaching-location source evidence.

Current distribution:

| City | Verified locations | Distinct institutions |
| --- | ---: | ---: |
| Berlin | 3 | 3 |
| Munich | 2 | 2 |
| Hamburg | 1 | 1 |
| Aachen | 1 | 1 |
| Bonn | 1 | 1 |
| Dresden | 1 | 1 |
| Heidelberg | 1 | 1 |
| Karlsruhe | 1 | 1 |
| Tübingen | 1 | 1 |

Total: 12 verified teaching locations and 12 institutions.

## Programme coverage

Germany already has 72 canonical programmes and 72 offering rows, but the existing offering-to-city seed relationships do not prove campus-specific delivery.

Every Germany city profile therefore displays:

`programme_coverage_status = verification_pending`

The UI explicitly says that this is a city-delivery verification gap rather than `0 programmes`.

Institution or teaching-location presence never establishes programme delivery. A city programme can be presented only after explicit offering-to-campus evidence is verified.

## Five verified metrics

Every route reads the same five Phase 4 metrics:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

The server requires `review_status = verified`.

### Student living cost

Living-cost values preserve the source methodology rather than pretending to be one standardized German market index.

The UI displays the monthly EUR range/reference and the stored source note. Lower-confidence guidance, currently relevant to Tübingen, remains visible rather than being silently upgraded.

### Student transport

Transport references preserve their source-native period.

The profile supports both:

- a single published amount, such as a semester or monthly ticket; and
- a source-published range, such as Heidelberg's current monthly public-transport budget range.

Eligibility/enrolment conditions are disclosed. No artificial monthly conversion is generated for semester tickets.

### Student work rights

The profile preserves the shared federal reference for eligible third-country students:

- up to 20 hours per week during lecture periods;
- or the annual 140 full / 280 half-day framework;
- semester-break and residence conditions remain relevant;
- student auxiliary academic work has the stored exception context.

This is national immigration context, not a city differentiator or an unconditional entitlement.

### Employment sectors

Employment-focus sectors are displayed as official city/economic-development context.

They are not presented as shortage rankings, guaranteed job opportunities or immigration eligibility signals.

## Metadata and publication state

The route has country-specific canonical metadata:

`/cities/de/{slug}`

During Phase 5 every approved route remains:

`noindex, follow`

Unsupported routes return metadata with:

`noindex, nofollow`

Search-engine publication is reserved for the later publication/SEO phase after City Compare and QA are complete.

## Compare state

Phase 5 deliberately does not add a Compare CTA or City Compare integration.

Compare readiness is Phase 6 work. Programme count must not be a Compare readiness condition while Germany city programme coverage remains `verification_pending`.

## Source disclosure

The dashboard includes a metric-source section using the source name, source URL, `data_as_of` and confidence stored with each verified Phase 4 metric.

Institution cards separately expose official institution identity and teaching-location sources.

## Production mutation

No production database mutation is required in Phase 5.

The profile consumes the production data contracts already established by Phases 2–4.

## Files

- `src/lib/cities/city-routes.ts`
- `src/lib/cities/de-city-profile.server.ts`
- `src/app/(workspace)/cities/germany-city-dashboard.tsx`
- `src/app/(workspace)/cities/de/[city]/page.tsx`
- `tests/de-city-profile-contract.test.ts`
- `docs/data-foundation/de-city-profile-v1.md`

## Acceptance criteria

Phase 5 is complete when all are true:

- [x] exactly nine approved Germany city slugs exist in the route allowlist;
- [x] expansion cities do not appear in the allowlist;
- [x] unsupported routes return not found;
- [x] the profile reads only Germany city linkage read models and verified city metric evidence;
- [x] all five metric types are wired into the profile;
- [x] municipality population geography and AGS are disclosed;
- [x] transport source-native period and eligibility/enrolment conditions are preserved;
- [x] both transport single-value and range evidence are supported;
- [x] federal 20-hour and 140/280-day student-work context is preserved;
- [x] verified institution domain and teaching-location evidence are displayed;
- [x] programme coverage is displayed as verification pending rather than zero availability;
- [x] institution presence is never converted to programme delivery;
- [x] metric source disclosure is present;
- [x] approved routes remain `noindex, follow`;
- [x] Compare is not enabled early;
- [x] no production migration is required.

## Handoff

Proceed to Phase 6 — City Compare — using exactly:

`berlin`, `munich`, `hamburg`, `aachen`, `bonn`, `dresden`, `heidelberg`, `karlsruhe`, `tuebingen`.

Compare readiness should require:

- all five verified metrics;
- at least one verified teaching location;
- at least one linked canonical institution.

Programme count must not be required while Germany city programme coverage remains `verification_pending`.
