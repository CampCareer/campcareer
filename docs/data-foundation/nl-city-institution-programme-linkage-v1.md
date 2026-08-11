# Netherlands city institution and programme linkage v1

Status: `PHASE_3_COMPLETE`

Checkpoint: `LINKAGE_COMPLETE`

Branch: `agent/nl-cities-linkage-v1`

Base Phase 2: `3a9b2d52845bd5b4e5660818e533bd5e84796b4f`

Production migration: `20260810132743_publish_nl_tier_a_city_linkage_v1`

Audit date: 2026-08-10

## Purpose

Build the source-backed institution/location linkage layer for the five Netherlands Tier A study destinations while preserving the Phase 2 municipality boundary and refusing to infer programme delivery from institution presence.

Tier A remains exactly:

- `amsterdam`
- `maastricht`
- `rotterdam`
- `groningen`
- `eindhoven`

Phase 3 does not publish routes, add city metrics, mutate the Tier B geography cohort, or claim exhaustive Dutch higher-education coverage.

## Key decision

The existing NL location layer contains two legacy/provider-location records per research university city pattern:

1. an unsourced legacy `{City} listed campus` anchor;
2. a DUO/RIO-backed `Registered institution location` row.

Those rows remain available for history and provider-registry evidence, but they are not used as the public city linkage layer.

Phase 3 adds a separate official-location batch:

`normalization_batch = nl_city_linkage_v1`

Only that batch feeds the NL city institution directory.

This prevents the existing duplicate location pattern from double-counting institutions or campuses.

## Verified Tier A institution/location anchors

Production now contains six Phase 3 official location anchors.

### Amsterdam — University of Amsterdam

Institution: University of Amsterdam

BRIN: `21PK`

Location: `Roeterseiland Campus — Economics and Business`

Address: `Roetersstraat 11, 1018 WB Amsterdam`

Official source:

https://www.uva.nl/en/about-the-uva/organisation/faculties/faculty-of-economics-and-business/contact-and-location/contact-and-location.html

The official Economics and Business source states that UvA Economics and Business is located on the Roeterseiland Campus.

### Amsterdam — Vrije Universiteit Amsterdam

Institution: Vrije Universiteit Amsterdam

BRIN: `21PL`

Location: `VU Campus — Main Building`

Address: `De Boelelaan 1105, 1081 HV Amsterdam`

Official source:

https://vu.nl/en/about-vu/more-about/contact

VU identifies the Main Building as the central visiting address on the VU Amsterdam campus.

### Maastricht — Maastricht University

Institution: Maastricht University

BRIN: `21PJ`

Location: `Faculty of Science and Engineering — Paul-Henri Spaaklaan`

Address: `Paul-Henri Spaaklaan 1, 6229 EN Maastricht`

Official source:

https://www.maastrichtuniversity.nl/education/bachelor/programmes/data-science-and-artificial-intelligence/contact

This source is deliberately programme/faculty-specific: Maastricht University identifies the Faculty of Science and Engineering at this address for the Data Science and Artificial Intelligence bachelor.

### Rotterdam — Erasmus University Rotterdam

Institution: Erasmus University Rotterdam

BRIN: `21PE`

Location: `Campus Woudestein`

Address: `Burgemeester Oudlaan 50, 3062 PA Rotterdam`

Official source:

https://www.eur.nl/en/campus/locations/campus-woudestein

### Groningen — University of Groningen

Institution: University of Groningen

BRIN: `21PC`

Location: `Zernike Campus — Bernoulliborg`

Address: `Nijenborgh 9, 9747 AG Groningen`

Official source:

https://www.rug.nl/fse/education/sse/contact-and-staff?lang=en

The Faculty of Science and Engineering identifies its student administration location at Zernike Campus, Bernoulliborg.

### Eindhoven — Eindhoven University of Technology

Institution: Eindhoven University of Technology

BRIN: `21PG`

Location: `TU/e Campus`

Address: `De Zaale, 5612 AJ Eindhoven`

Official university source:

https://research.tue.nl/en/organisations/eindhoven-university-of-technology/

This row is classified conservatively as `verified_university_campus`, not as programme-specific delivery evidence.

## Production city linkage state

`public.city_directory_nl_v1` now returns exactly five Tier A cities.

| City | linked campuses | linked institutions | linked programmes |
| --- | ---: | ---: | ---: |
| Amsterdam | 2 | 2 | 0 |
| Maastricht | 1 | 1 | 0 |
| Rotterdam | 1 | 1 | 0 |
| Groningen | 1 | 1 | 0 |
| Eindhoven | 1 | 1 | 0 |

Total official Phase 3 location anchors: `6`.

Rows with missing location source URL: `0`.

Legacy location rows leaking into the city institution directory: `0`.

## Read models

Phase 3 creates three server-only read models.

### `public.city_institution_directory_nl_v1`

Provides the verified Tier A relationship:

`city -> official institution location -> canonical institution -> NL_BRIN identity`

Only `nl_city_linkage_v1` location rows are included.

### `public.city_programme_directory_nl_v1`

Provides the future strict relationship:

`city -> Phase 3 campus/location -> verified programme offering.campus_id -> canonical programme`

A programme appears only when all are true:

- the offering has an explicit `campus_id` equal to a Phase 3 verified location;
- `programme_offerings.verification_status = verified`;
- the offering has a source URL;
- the programme is active and belongs to the same institution;
- the campus metadata has `programme_assignment_verified = true`.

Current result: `0` rows.

### `public.city_directory_nl_v1`

Provides the five-city summary used by later city profile and Compare phases.

Current coverage states:

- `institution_coverage_status = research_university_core_hbo_pending`
- `programme_coverage_status = verification_pending`

## Why programme count remains zero

The NL Programs workstream has advanced independently during this city rollout.

Current production snapshot:

- canonical NL programmes: `26`
- verified NL programme offerings: `26`
- canonical programmes belonging to the current Tier A research-university anchors: `3`
- NL programme offerings with non-null `campus_id`: `0`

Therefore programme identity and international-offering verification are now available, but exact city/campus delivery is still not represented in `programme_offerings.campus_id`.

Phase 3 intentionally does not rewrite those programme/offering rows because they are owned by the parallel NL Programs workstream and because a verified institution location alone must not be used to infer delivery.

## Programme-location evidence discovered for later reconciliation

Current official sources already provide useful candidates for an explicit programme-location reconciliation once the Programs stream and Cities stream are integrated.

### UvA Business Analytics

Official programme page:

https://www.uva.nl/en/programmes/bachelors/business-analytics/business-analytics.html

The programme page identifies:

- RIO code `56856`;
- location `Roeterseiland campus`.

This matches the Phase 3 UvA Roeterseiland anchor, but no `programme_offerings.campus_id` mutation is made in this city phase.

### Maastricht Data Science and Artificial Intelligence

Official programme page:

https://www.maastrichtuniversity.nl/education/bachelor/programmes/data-science-and-artificial-intelligence

The programme page identifies the location as Maastricht. Its contact page identifies the Faculty of Science and Engineering at Paul-Henri Spaaklaan 1.

This matches the Phase 3 Maastricht FSE location anchor, but the offering remains unassigned pending cross-stream reconciliation.

### University of Groningen Artificial Intelligence

Official programme page:

https://www.rug.nl/bachelors/artificial-intelligence/?lang=en

The programme has CROHO/RIO code `56981` and is a University of Groningen Faculty of Science and Engineering bachelor.

Current programme-specific academic-advisor evidence places BSc Artificial Intelligence at Zernike, Bernoulliborg:

https://www.rug.nl/fse/education/sse/academicadvisors/external-pages/bscartificalintelligence?lang=en

This matches the Phase 3 Groningen anchor, but no offering mutation is made here.

## HBO coverage boundary

The current canonical NL institution foundation remains research-university-heavy.

For the five Tier A cities, omitting HBO providers would be materially incomplete if the UI presented the current set as exhaustive. Phase 3 therefore does not label the institution directory as complete.

Every Tier A city explicitly reports:

`institution_coverage_status = research_university_core_hbo_pending`

This means later provider expansion still needs BRIN/RIO-backed HBO normalization. Examples of materially relevant provider classes include universities of applied sciences in Amsterdam, Rotterdam, Groningen, Eindhoven and Maastricht.

No HBO provider is invented or added from an aggregator source in Phase 3.

## Legacy-location handling

Phase 3 does not delete or deactivate the earlier NL campus/location rows.

Reason:

- DUO registered-address rows remain useful provider-registry evidence;
- legacy city-coordinate rows may still support old surfaces;
- deleting shared rows could interfere with parallel institution/program work.

Instead, the publication contract isolates official Phase 3 locations through `normalization_batch = nl_city_linkage_v1`.

This gives the city rollout a clean read model without destructive cleanup.

## Security contract

All three Phase 3 views use:

`security_invoker = true`

Production privilege verification:

- `service_role`: SELECT allowed
- `anon`: SELECT denied
- `authenticated`: SELECT denied

This matches the server-only city loader pattern used by prior country rollouts.

## Production verification

Migration `20260810132743_publish_nl_tier_a_city_linkage_v1` was applied successfully to Supabase project `babylusxcknjerxtepoc`.

Verified after migration:

- Tier A city directory rows: `5`
- official Phase 3 location rows: `6`
- linked institutions: Amsterdam `2`; other Tier A cities `1` each
- cities missing institution/location linkage: `0`
- location rows without source URL: `0`
- legacy location rows in publication directory: `0`
- city programme directory rows: `0`
- NL offerings with explicit `campus_id`: `0`

## Contract test

`tests/nl-city-linkage-contract.test.ts` guards:

- exact Tier A city scope;
- six official initial institution/location anchors;
- `NL_BRIN` identity linkage;
- separation from legacy/registry-only location records;
- explicit `programme_offerings.campus_id` requirement;
- no Cities-side insert/update of NL programme or offering rows;
- explicit HBO coverage-gap disclosure;
- server-only security-invoker read models.

## Phase 3 acceptance criteria

- [x] all five Tier A cities have source-backed institution/location linkage
- [x] Amsterdam has both UvA and VU anchors
- [x] the four remaining Tier A cities each have at least one canonical university anchor
- [x] BRIN identity remains explicit
- [x] legacy duplicate location rows do not leak into publication read models
- [x] institution coverage is explicitly marked non-exhaustive because HBO normalization remains pending
- [x] programme delivery requires explicit verified offering-to-campus linkage
- [x] programme coverage remains `verification_pending` while `campus_id` is absent
- [x] no programme/offering mutation conflicts with the parallel NL Programs workstream
- [x] server-only view permissions are verified in production
- [x] production migration is applied and verified
- [x] contract test is committed

## Handoff

Proceed to Phase 4 — Five Core City Metrics.

Phase 4 should populate exactly five verified metrics for each Tier A municipality:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Use the Phase 2 `cbs_municipality` boundary for city population and other municipality-specific evidence. National student work rights must remain a national rule projected consistently across the five cities rather than being presented as a city differentiator.

Programme reconciliation can occur independently when explicit offering-to-campus evidence is committed by the integrated Programs/Cities data flow; the Phase 3 read model will then surface only verified links.
