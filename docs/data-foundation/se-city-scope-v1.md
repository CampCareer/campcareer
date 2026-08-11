# Sweden city scope v1

Status: `PHASE_1_COMPLETE`

Checkpoint: `TIER_A_SCOPE_LOCKED`

Branch: `agent/se-cities-v1`

Base Phase 0 commit: `41e9c919f46e4072ab0cc3e0b28e52735069342f`

Audit date: 2026-08-10

## Purpose

Lock the first public Sweden city cohort before any SCB municipality normalization, verified campus rebuild or city read-model work.

Phase 1 changes no production rows and creates no new geography.

## Selection method

Sweden does not currently have one official source that defines a fixed national set of "major higher-education municipalities" in the same way used for the Denmark rollout.

The first cohort is therefore selected from the intersection of three auditable signals:

1. an existing canonical CampCareer Sweden city geography;
2. at least one current UKÄ-backed university anchor in that city;
3. material current programme evidence in the Sweden 2026 official-university catalogue.

This produces exactly six current evidence-backed city candidates, and all six are retained as Tier A.

The programme counts are a rollout-readiness signal, not a claim about city popularity, student enrolment or university quality.

## Why Tier A contains six cities

The current evidence-backed candidates and programme counts are:

| Priority | City | Slug | Geography UUID | Staged programme rows | Current university-location rows |
| ---: | --- | --- | --- | ---: | ---: |
| 1 | Stockholm | `stockholm` | `e4d6e0f8-deaf-4486-4754-ed037331583b` | 93 | 3 |
| 2 | Gothenburg | `gothenburg` | `cc9590ad-543b-455a-f11b-f5db185bfbd0` | 65 | 2 |
| 3 | Uppsala | `uppsala` | `9671b5ed-f7ea-5120-a56f-66c62ffbcc18` | 42 | 2 |
| 4 | Lund | `lund` | `c437d6de-abe4-2121-9228-43edb71afa74` | 29 | 1 |
| 5 | Linköping | `linkoping` | `3f7f5dad-7fe0-9cf5-296b-a020fc829775` | 21 | 1 |
| 6 | Umeå | `umea` | `b6afd97c-c5c5-1736-dbb4-63afe4a8d8c1` | 21 | 1 |

There is no evidence-based reason to drop Umeå merely to force the cohort to five cities:

- Linköping and Umeå are tied at 21 staged programme rows;
- both have an existing UKÄ-backed canonical university anchor;
- Umeå is the only current evidence-backed northern Sweden city in the canonical foundation.

Keeping both avoids an arbitrary tie-break and gives the initial rollout meaningful north/south/east/west coverage.

## Tier A lock

Tier A is locked to exactly:

1. `stockholm`
2. `gothenburg`
3. `uppsala`
4. `lund`
5. `linkoping`
6. `umea`

Reserved routes after later publication gates are satisfied:

- `/cities/se/stockholm`
- `/cities/se/gothenburg`
- `/cities/se/uppsala`
- `/cities/se/lund`
- `/cities/se/linkoping`
- `/cities/se/umea`

No route becomes indexable in Phase 1.

## Regional coverage rationale

The six-city cohort is intentionally geographically distributed rather than capital-only:

- Stockholm — capital/east-central Sweden;
- Gothenburg — west coast / Västra Götaland;
- Uppsala — Uppsala County and major university centre north of Stockholm;
- Lund — southern Sweden / Skåne;
- Linköping — Östergötland / south-east-central Sweden;
- Umeå — northern Sweden / Västerbotten.

This is a publication-coverage rationale, not a ranking of Swedish cities.

## Phase 2 boundary rule

The intended public study-destination unit is the SCB municipality corresponding to each city name.

Statistics Sweden is the authority for current county and municipality codes:

https://www.scb.se/en/finding-statistics/regional-statistics/regional-divisions/counties-and-municipalities/counties-and-municipalities-in-numerical-order/

Planned Phase 2 targets:

| City | Municipality | SCB code |
| --- | --- | --- |
| Stockholm | Stockholm Municipality | `0180` |
| Gothenburg | Gothenburg Municipality | `1480` |
| Uppsala | Uppsala Municipality | `0380` |
| Lund | Lund Municipality | `1281` |
| Linköping | Linköping Municipality | `0580` |
| Umeå | Umeå Municipality | `2480` |

Phase 1 does not write these values to production. Phase 2 must preserve each existing geography UUID while adding the official municipality identity, county/region mapping, aliases and publication scope.

## Current institution anchors inside Tier A

### Stockholm

Current selected-university-core anchors:

- Stockholm University
- KTH Royal Institute of Technology
- Karolinska Institutet

The generic fast-path placement of Karolinska Institutet must not be treated as final campus geography. Phase 3 must verify actual programme/location evidence because Karolinska has teaching/research locations outside Stockholm Municipality as well.

### Gothenburg

- University of Gothenburg
- Chalmers University of Technology

### Uppsala

- Uppsala University
- Swedish University of Agricultural Sciences

### Lund

- Lund University

### Linköping

- Linköping University

### Umeå

- Umeå University

These are initial selected-university-core anchors only. They are not a complete UKÄ-recognised institution inventory for each municipality.

Expected later coverage disclosure:

`selected_university_core_full_hei_coverage_pending`

## Programme readiness

The current 2026 Sweden programme foundation contains 271 active canonical programmes and 271 verified offerings with source URLs and non-null campus IDs.

Current city labels exactly match the six Tier A cities:

- Stockholm — 93
- Gothenburg — 65
- Uppsala — 42
- Lund — 29
- Linköping — 21
- Umeå — 21

A current staged-city versus assigned-campus-city text audit reports zero mismatches.

However, the generic location rows still carry `programme_assignment_verified=false`, and multi-campus universities can teach outside their primary city. Therefore Phase 3 must independently verify the city-delivery relationship before a programme is counted in a public city directory.

Status:

`catalogue_strong / delivery_reverification_required`

## Provider expansion / Tier B discovery candidates

UKÄ's current recognised-provider list is substantially broader than CampCareer's selected 10-institution Sweden core.

Important future expansion candidates include cities associated with recognised providers that are absent from the current city foundation, including:

- Malmö
- Luleå
- Växjö / Kalmar
- Örebro
- Karlstad
- Jönköping
- Borås
- Halmstad
- Gävle
- Skövde
- Kristianstad
- Trollhättan

These are `TIER_B_DISCOVERED_PROVIDER_EXPANSION` candidates, not an ordered ranking and not an exhaustive list of every Swedish higher-education location.

Official provider authority:

https://www.uka.se/sa-fungerar-hogskolan/universitet-och-hogskolor/lista-over-universitet-hogskolor-och-enskilda-utbildningsanordnare

No new geography is created for these cities in Phase 1.

## Current student-work rule carried forward

The Swedish Migration Agency's rule effective 11 June 2026 remains a national constraint for later metrics: qualifying bachelor/master permit holders in the applicable decision cohort may normally work up to 15 hours per week during semesters, with summer and specified study/research-related exceptions.

Official source:

https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html

This rule does not affect Tier A selection and must never be used as a city differentiator.

## Scope exclusions

Phase 1 does not:

- create Malmö or any other new Sweden geography;
- claim that the current 10 institutions are complete national provider coverage;
- infer programme delivery from the generic fast-path campus rows;
- repair the 271 null canonical qualification-level links;
- normalize SCB municipality codes or county mappings;
- add Sweden city routes to the sitemap;
- enable city SEO indexing;
- publish a Sweden City Compare surface.

## Phase 1 result

Exact Tier A cohort:

- `stockholm`
- `gothenburg`
- `uppsala`
- `lund`
- `linkoping`
- `umea`

Checkpoint:

`PHASE_1_COMPLETE / TIER_A_SCOPE_LOCKED`

Next work on the same branch: Phase 2 SCB municipality geography normalization for all six Tier A cities.