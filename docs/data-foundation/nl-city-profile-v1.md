# Netherlands city profile v1

Status: `PHASE_5_COMPLETE`

Checkpoint: `PROFILE_COMPLETE`

Branch: `agent/nl-cities-profile-v1`

Base Phase 4: `70635e6f12cb197603f3cde1976a1bf3d7dcae5c`

Audit date: 2026-08-10

## Purpose

Implement the first Netherlands city-profile routes from the verified Phase 2-4 foundation without publishing them to search engines or enabling City Compare early.

Phase 5 presents only:

- the exact five Tier A municipalities;
- verified Phase 4 city metrics;
- the Phase 3 source-backed research-university/location core;
- explicit HBO coverage limitations;
- programme delivery only when an explicit verified offering-to-campus link exists.

No production database mutation is required in this phase.

## Route allowlist

The exact Netherlands v1 route set is:

- `/cities/nl/amsterdam`
- `/cities/nl/maastricht`
- `/cities/nl/rotterdam`
- `/cities/nl/groningen`
- `/cities/nl/eindhoven`

The shared route contract is implemented through:

- `PUBLISHED_NL_CITY_SLUGS`
- `isPublishedNlCitySlug()`
- `nlCityPath()`

Delft, Utrecht, Enschede, Tilburg, Leiden, Nijmegen and Wageningen remain outside the Phase 5 Tier A route allowlist. The Hague remains a discovered expansion candidate and is not created or routed.

Unsupported Netherlands city slugs resolve through `notFound()`.

## Publication state

During Phase 5 every approved route remains:

`noindex, follow`

Unsupported routes return metadata with:

`noindex, nofollow`

Canonical route metadata uses:

`/cities/nl/{slug}`

Search-engine publication is reserved for Phase 7 after Compare and publication QA gates are complete.

## Read model contract

`src/lib/cities/nl-city-profile.server.ts` reads only:

1. `public.city_directory_nl_v1`
2. `public.city_institution_directory_nl_v1`
3. verified rows from `public.report_metric_evidence_city`

It does not query:

- `public.city_programme_directory_nl_v1`
- raw `catalog.campuses`
- raw `catalog.programmes`
- raw `catalog.programme_offerings`

The city directory may expose an evidence-backed linked-program count in the future, but profile presentation never derives programme delivery from institution or campus presence.

## Municipality scope

Each profile explicitly presents the Phase 2 CBS municipality scope.

Population evidence exposes:

- the municipality label;
- `geography_kind = cbs_municipality`;
- the CBS municipality code;
- the metric evidence date.

Province, COROP and wider metropolitan boundaries are not silently substituted.

## Institution presentation

Phase 3 currently provides six official Tier A location anchors:

| City | Verified locations | Distinct research universities |
| --- | ---: | ---: |
| Amsterdam | 2 | 2 |
| Maastricht | 1 | 1 |
| Rotterdam | 1 | 1 |
| Groningen | 1 | 1 |
| Eindhoven | 1 | 1 |

The profile displays:

- canonical institution name;
- BRIN code;
- official institution website;
- BRIN/DUO evidence link;
- official verified location name;
- location source evidence.

Legacy `{City} listed campus` rows and DUO registered-address rows remain source/history records but are not double-counted by this publication layer.

### HBO disclosure

The current provider foundation is not a complete Dutch higher-education provider universe.

Every profile therefore carries:

`institution_coverage_status = research_university_core_hbo_pending`

The UI describes this as research-university core coverage with Dutch HBO expansion still pending. Missing HBO rows must not be interpreted as proof that no university-of-applied-sciences study options exist in the city.

## Programme coverage

Current city programme delivery remains evidence-gated.

At Phase 5 completion the Phase 3 city programme directory has no campus-linked offerings, so the current profile state is:

`programme_coverage_status = verification_pending`

The UI says this is a verification gap rather than `0 programmes`.

The server is also forward-compatible with `verified_partial`: if explicit verified `programme_offerings.campus_id` evidence is added later, the city directory can expose partial verified delivery without inferring the rest of the catalogue.

## Five verified metrics

Every route reads the same five Phase 4 metric keys:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

The server requires `review_status = verified`.

### Population

All five populations use the same CBS municipality boundary and 1 January 2026 reference date.

### Living cost

Living-cost values remain indicative and preserve their source methodology:

- Amsterdam and Groningen: current university student-cost references;
- Maastricht and Rotterdam: explicit university budget proxies;
- Eindhoven: explicit Study in NL national baseline because a sufficiently complete current TU/e city-specific all-in figure was not verified.

The UI labels Eindhoven's value as a national baseline rather than city-specific evidence.

### Transport

Transport values remain source-native products/fares. Their periods deliberately differ:

- Amsterdam: one-hour GVB reference;
- Maastricht: monthly Arriva off-peak discount product price;
- Rotterdam: two-hour RET reference;
- Groningen: monthly Arriva off-peak discount product price;
- Eindhoven: single-trip Bravo reference.

The UI does not invent a monthly equivalent and does not present these as generic student discounts.

### Student work context

The stored national IND employee-work context is presented as:

- up to 16 hours per week; or
- full-time in June, July and August;
- employer TWV required;
- the two employee-work routes are alternatives;
- self-employment is a separate rule path;
- residence/nationality circumstances may change the applicable rules.

This is national context, not a city differentiator or an individual entitlement decision.

### Employment sectors

Employment-focus sectors are displayed as municipal economic context only.

They are not shortage rankings, guaranteed job opportunities or a substitute for occupation-level labour-market analysis.

## Source disclosure

The dashboard includes a metric-source section using each verified Phase 4 row's:

- source name;
- source URL;
- `data_as_of`.

Institution cards separately expose official institution and BRIN evidence links.

## Compare state

Phase 5 deliberately does not add a Compare CTA or City Compare route integration.

Compare readiness is Phase 6 work. It should require:

- all five verified city metrics;
- at least one verified official location;
- at least one linked canonical institution.

Programme count should not be a hard Compare-readiness requirement while catalogue/location verification is incomplete.

## Files

- `src/lib/cities/city-routes.ts`
- `src/lib/cities/nl-city-profile.server.ts`
- `src/app/(workspace)/cities/netherlands-city-dashboard.tsx`
- `src/app/(workspace)/cities/nl/[city]/page.tsx`
- `tests/nl-city-profile-contract.test.ts`
- `docs/data-foundation/nl-city-profile-v1.md`

## Phase 5 acceptance criteria

- [x] exactly five approved NL city slugs exist in the route allowlist
- [x] Tier B and The Hague do not enter the allowlist
- [x] unsupported routes return not found
- [x] approved routes remain `noindex, follow`
- [x] profile reads only the NL city linkage read models and verified metric evidence
- [x] all five metric types are wired into the server model
- [x] CBS municipality population scope is visible
- [x] living-cost proxy/baseline methodology is visible
- [x] transport source-native periods are preserved
- [x] the 16-hour/TWV/summer alternative work context is preserved
- [x] BRIN and official location evidence are presented
- [x] HBO coverage limitation is explicit
- [x] programme delivery is evidence-gated and current gap is verification pending
- [x] employment sectors are contextual rather than shortage rankings
- [x] metric source disclosure is present
- [x] Compare is not enabled early
- [x] no production migration is required

## Validation posture

The Phase 5 static contract is committed now. As with the existing country rollout pattern, repository-wide CI and a production build can be reserved for the later QA phase to avoid spending deployment/build quota on an intermediate profile checkpoint.

## Handoff

Proceed to Phase 6 — City Compare — using exactly:

`amsterdam`, `maastricht`, `rotterdam`, `groningen`, `eindhoven`

Keep HBO coverage and programme-delivery coverage as explicit disclosure fields rather than silently converting current catalogue gaps into zeroes.
