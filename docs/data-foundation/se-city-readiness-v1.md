# Sweden city readiness v1

Status: `PHASE_0_COMPLETE`

Readiness: `READY_WITH_GATES`

Branch: `agent/se-cities-v1`

Base main: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Audit date: 2026-08-10

## Purpose

Establish the national provider, programme, immigration, geography and production-data contracts required before selecting Sweden's first `/cities` publication cohort.

Sweden follows the user-directed one-country/one-branch policy. Phases 0 through 9 will accumulate on `agent/se-cities-v1`.

Phase 0 changes no production rows and publishes no city route.

## Product identity

Current CampCareer registry values:

- country code: `SE`
- country name: `Sweden`
- currency: `SEK`
- country active: `true`
- canonical country route: `/countries/se`
- intended city route: `/cities/se/{city-slug}`

## National higher-education authority and provider structure

Universitetskanslersämbetet (UKÄ) is the Swedish Higher Education Authority and the official-statistics authority for higher education. UKÄ maintains the current list of universities, university colleges, artistic higher-education institutions and other degree-awarding providers.

Authority list:

https://www.uka.se/sa-fungerar-hogskolan/universitet-och-hogskolor/lista-over-universitet-hogskolor-och-enskilda-utbildningsanordnare

UKÄ's current list is materially broader than the CampCareer Sweden canonical institution base. It includes universities, university colleges, artistic institutions and other independent providers.

### CampCareer coverage implication

Production currently contains 10 active Swedish institutions:

1. Chalmers University of Technology
2. Karolinska Institutet
3. KTH Royal Institute of Technology
4. Linköping University
5. Lund University
6. Stockholm University
7. Swedish University of Agricultural Sciences
8. Umeå University
9. University of Gothenburg
10. Uppsala University

This is a selected university core, not a complete Swedish higher-education provider inventory and not even the full UKÄ university list.

Later city read models must preserve an explicit coverage state equivalent to:

`selected_university_core_full_hei_coverage_pending`

Absence of Malmö University, Linnaeus University, Luleå University of Technology, Örebro University, Karlstad University, Jönköping University and other UKÄ-recognised providers must never be presented as provider absence from their cities.

## Canonical institution identity

The existing CampCareer Sweden authority-backed identifier system is:

`SE_UKA_UNIVERSITY_NAME`

All 10 current institutions have an identifier row sourced to UKÄ's degree-awarding provider list.

This identifier can continue to anchor the current university core. Future expansion beyond the present 10 institutions must remain authority-backed and must not silently infer identity from website or programme-name similarity.

## Official programme and admissions sources

The Swedish Council for Higher Education (UHR) is a public agency and manages the coordinated admissions process together with Swedish higher-education institutions.

UHR states that University Admissions is the official website for applying to higher-education studies across Sweden:

https://www.uhr.se/en/start/

Universityadmissions.se states that Swedish universities provide their course and programme listings to its searchable database and that the international First admission round contains the full catalogue of English-taught courses and programmes available in that round:

https://www.universityadmissions.se/en/apply-to-bachelors/search-for-courses-and-programmes-bachelors/

https://www.universityadmissions.se/en/support-centre/admissions-application/

### Programme source hierarchy for Cities

Use the following hierarchy later in Phase 3:

1. UKÄ for provider recognition and authority identity;
2. UHR / Universityadmissions.se for official admissions and programme-discovery context;
3. the university's official programme page for programme facts;
4. the university's official campus/location page or an equally explicit programme-location source for city delivery.

Programme delivery must never be inferred from institution presence alone.

## Current production geography foundation

Production currently contains six Sweden city geographies created by the earlier university fast-path foundation:

| City | Slug | Geography UUID | Current programme signal |
| --- | --- | --- | ---: |
| Stockholm | `stockholm` | `e4d6e0f8-deaf-4486-4754-ed037331583b` | 93 staged programmes |
| Gothenburg | `gothenburg` | `cc9590ad-543b-455a-f11b-f5db185bfbd0` | 65 |
| Uppsala | `uppsala` | `9671b5ed-f7ea-5120-a56f-66c62ffbcc18` | 42 |
| Lund | `lund` | `c437d6de-abe4-2121-9228-43edb71afa74` | 29 |
| Linköping | `linkoping` | `3f7f5dad-7fe0-9cf5-296b-a020fc829775` | 21 |
| Umeå | `umea` | `b6afd97c-c5c5-1736-dbb4-63afe4a8d8c1` | 21 |

All six currently have null `region_code` and null `scope_kind`. Their metadata identifies the earlier `UKA_DEGREE_AWARDING_LIST` fast-path batch, not a publication-grade municipal boundary.

Phase 2 must normalize the public study-destination boundary against Statistics Sweden (SCB) municipality identities while preserving the existing UUIDs.

## Geography authority

Statistics Sweden (SCB) is the authority for Swedish county and municipality divisions and publishes the current municipality codes and names.

Official source:

https://www.scb.se/en/finding-statistics/regional-statistics/regional-divisions/counties-and-municipalities/counties-and-municipalities-in-numerical-order/

SCB currently lists 21 counties and 290 municipalities. Phase 2 should use municipality scope rather than an urban-area or metropolitan boundary unless a later city has a documented exception.

The six likely Phase 2 municipality targets are:

- Stockholm Municipality
- Gothenburg Municipality
- Uppsala Municipality
- Lund Municipality
- Linköping Municipality
- Umeå Municipality

No municipality code is written into production in Phase 0.

## Current campus/location foundation

Production currently has 10 active Swedish `Primary university location` rows attached to the selected university core.

Current city distribution:

- Stockholm: 3 rows
- Gothenburg: 2 rows
- Uppsala: 2 rows
- Lund: 1 row
- Linköping: 1 row
- Umeå: 1 row

The current fast-path location metadata states:

- `record_scope=primary_university_city`
- `location_quality=verified_authority_or_official`
- `campus_inventory_complete=false`
- `programme_assignment_verified=false`

These rows are useful discovery anchors but are not sufficient city-delivery evidence.

This matters especially for multi-location institutions. Phase 3 must use actual official location evidence rather than assuming that a generic primary-university-city row represents every programme or campus.

## Current programme catalogue state

Production currently contains:

- 271 Sweden staging programme rows;
- 271 active canonical programmes;
- 271 programme offerings;
- 271 offerings marked `verified`;
- 271 offerings with source URLs;
- 271 offerings with non-null `campus_id`;
- 0 canonical programmes with a populated `qualification_level_id`.

All 271 staging rows currently come from the `official_university_2026` collection, verification tier `A`, with source date 2026-08-09.

The staged city distribution is:

| City | Programme rows |
| --- | ---: |
| Stockholm | 93 |
| Gothenburg | 65 |
| Uppsala | 42 |
| Lund | 29 |
| Linköping | 21 |
| Umeå | 21 |

A direct comparison of staged city labels against the current assigned campus city finds zero text mismatches. That is a useful quality signal, but it does not override `programme_assignment_verified=false` on the generic fast-path locations.

### Programme publication rule

Phase 3 may reuse the programme catalogue only when the explicit chain is verified:

`city municipality -> official campus/location -> UKÄ-backed institution -> verified offering -> explicit programme delivery -> programme`

Do not use the current non-null `campus_id` alone as final city-delivery proof.

### Qualification-level gate

All 271 canonical Swedish programmes currently lack `qualification_level_id`.

This does not block Phase 1 city selection, but later city surfaces must not make canonical qualification-level claims until that field is repaired or the display uses a clearly source-native programme type/degree label with its own evidence.

## International-student work-right baseline

The Swedish Migration Agency changed the student-work rule on 11 June 2026.

For bachelor- and master-level students whose residence permit was granted on or after 11 June 2026, the current baseline is:

- maximum 15 hours per week during semesters;
- work without that limit during June, July and August;
- specified exceptions for work connected to education, traineeship, student representation, administration, research or artistic research in the qualifying context.

Official sources:

https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html

https://www.migrationsverket.se/nyheter/news-archive/2026-05-25-new-rules-for-residence-permits-for-studies-in-higher-education.html

The Migration Agency also states that the 15-hour restriction does not apply to permits granted before 11 June 2026 until the relevant later extension/new-decision context.

Phase 4 must therefore store this as a qualified national immigration rule with an effective-date/permit-decision condition, not as a universal city metric.

## Student living-cost baseline for later metrics

Study in Sweden currently publishes an indicative monthly student budget of SEK 10,656, including accommodation, food, local travel, phone/internet and miscellaneous costs, while explicitly noting that actual costs vary by city and lifestyle.

Official source:

https://studyinsweden.se/moving-to-sweden/accommodation-budget/

The Swedish Migration Agency also uses SEK 10,656 per month as the 2026 maintenance requirement for higher-education permit applications.

Phase 4 may use this only as a national baseline unless a city-specific primary source is available. It must not be represented as a city-specific cost estimate.

## Key Phase 0 gates

1. **Geography normalization gate** — all six current cities lack publication-grade SCB municipality metadata, region mapping and scope kind.
2. **Provider completeness gate** — the current 10-institution base is only a selected university core; broader UKÄ-recognised HEI coverage remains pending.
3. **Programme-delivery gate** — all current generic campus rows still state `programme_assignment_verified=false`; Phase 3 must verify actual location relationships.
4. **Qualification-level gate** — 271/271 canonical programmes currently have null `qualification_level_id`.
5. **Multi-campus gate** — primary-city fast-path records must not be treated as complete campus inventories for institutions with teaching in multiple locations.
6. **Immigration effective-date gate** — the current 15-hour work limit took effect 11 June 2026 and must be represented with its permit-decision qualification.
7. **Publication gate** — no Sweden city becomes indexable before Phase 2 geography, Phase 3 linkage and all five Phase 4 metrics pass.

## Phase 0 result

Sweden has a strong reusable programme and university-core foundation, but it is not publication-ready without geography and delivery verification and explicit provider/qualification coverage disclosures.

Checkpoint:

`PHASE_0_COMPLETE / READY_WITH_GATES`

Phase 1 may lock the first city cohort without changing production data.