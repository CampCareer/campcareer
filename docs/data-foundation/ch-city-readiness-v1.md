# Switzerland Cities — Phase 0 country readiness v1

Status: `PHASE_0_COMPLETE`
Readiness: `READY_WITH_GATES`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`
Baseline main: `b1bacadc840d0fb9c67e1ec8b4ab95889df27e63`

## 1. Country identity and route contract

- Canonical CampCareer country code: `CH`
- Canonical country route: `ch`
- Currency: CHF
- Institutional accreditation decision body: Swiss Accreditation Council
- Accredited-institution discovery surface: swissuniversities accredited Swiss higher-education institutions list
- City geography authority for this rollout: Swiss Federal Statistical Office (FSO/BFS), Official Directory of Municipalities of Switzerland, state 01.01.2026

The Cities rollout will use the official municipality as the public comparison boundary. Cantons remain regional context and must not replace municipality boundaries.

## 2. Official source hierarchy

### Institution recognition and accreditation

Primary discovery/register surface:

- swissuniversities — Accredited Swiss Higher Education Institutions
  - https://www.swissuniversities.ch/en/topics/studying/accredited-swiss-higher-education-institutions

Accreditation decisions under HEdA are made by the Swiss Accreditation Council. swissuniversities explicitly distinguishes universities, universities of applied sciences, universities of teacher education and other institutions of the higher-education sector.

The current CampCareer Switzerland canonical institution foundation contains exactly the 12 institutions in the `Universities` category. It is not the complete Swiss accredited higher-education universe.

Current institution identifier system:

`CH_ACCREDITED_UNIVERSITY_NAME`

This is an official-name fast-path identity and must not be described as a durable national technical identifier.

### Programme discovery and current programme evidence

Current Switzerland programme staging source:

`CH_OFFICIAL_UNIVERSITY_2026`

All 243 current staged rows have source date `2026-08-09` and are linked to official university programme evidence. Canonical publication records preserve source identity through `CH_OFFICIAL_PROGRAM_KEY` and the `CH_SWISSUNIVERSITIES` source system.

Later City linkage must retain the hierarchy:

1. accredited canonical institution
2. official current programme page
3. official international/admissions evidence
4. verified physical study location
5. canonical municipality

Institutional accreditation must not be converted into a false programme-level accreditation claim. Swiss programme accreditation can exist, but it is not implied by institutional accreditation.

### Geography

Primary authority:

- Swiss Federal Statistical Office — Application of Swiss Municipalities / Official Directory of Municipalities
  - https://www.agvchapp.bfs.admin.ch/

The FSO assigns and maintains official municipality numbers. The 01.01.2026 directory is the Phase 2 authority for municipality codes, official names and canton relationships.

Current CampCareer Switzerland City seeds were created by the earlier European institution fast-path and are not yet municipality-normalised.

### Student work context

Primary immigration authority:

- State Secretariat for Migration (SEM) — Working while studying
  - https://www.sem.admin.ch/sem/en/home/themen/arbeit/faq.0021.html

For foreign students, supplementary employment may be authorised subject to the applicable conditions. SEM states that work may begin no sooner than six months after the start of studies and is limited to 15 hours per week outside holidays.

This is national immigration/employment context. It must never be used as a City differentiator.

## 3. Current production coverage

Production audit on 2026-08-11:

| Layer | Current CH coverage | Phase 0 interpretation |
|---|---:|---|
| Canonical active institutions | 12 | complete current swissuniversities `Universities` category only |
| Institution identifiers | 12 | provisional `CH_ACCREDITED_UNIVERSITY_NAME` identity |
| Active campuses | 12 | one primary publication location per current university |
| Campuses with geography | 12 | linked to current City seeds |
| Campuses marked inventory complete | 0 | physical campus inventory incomplete |
| Campuses with programme assignment verified | 0 | no City delivery claim yet |
| CH City geographies | 10 | fast-path seeds, not FSO municipality-normalised |
| Staged programmes | 243 | current official-university programme foundation |
| Staged programmes with City | 243 | source City field present |
| Canonical active programmes | 243 | reusable programme foundation |
| Active canonical offerings | 243 | current published programme foundation |
| International evidence rows | 243 | 1:1 with staged programmes |
| Programme-specific international verification | 3 | `verified_program` |
| General international verification | 240 | `verified_general` |
| SEO-indexed future-application programme routes | 38 | current strict publication subset |

The programme foundation is strong enough to support City scope selection. It is not proof of complete Switzerland-wide programme coverage because the current institution foundation is limited to the 12 universities category.

## 4. Current university foundation

Current production institutions:

1. Ecole polytechnique fédérale de Lausanne EPFL
2. Eidgenössische Technische Hochschule Zürich ETH
3. Universität Basel
4. Universität Bern UniBE
5. Université de Fribourg Unifr
6. Université de Genève UNIGE
7. Université de Lausanne UNIL
8. Universität Luzern Unilu
9. Université de Neuchâtel UniNE
10. Universität St. Gallen HSG
11. Università della Svizzera italiana USI
12. Universität Zürich UZH

Coverage state carried forward for Cities:

`selected_swissuniversities_university_core_full_hei_coverage_pending`

Meaning:

- the 12-university category is represented
- universities of applied sciences are not represented as a complete City-count cohort
- universities of teacher education are not represented as a complete City-count cohort
- other accredited institutions are not represented as a complete City-count cohort
- City institution totals must therefore remain explicitly partial

## 5. Current programme City distribution

The 243 staged programmes resolve to ten current source-City labels:

| City | Programmes | Current university institutions represented |
|---|---:|---:|
| Zurich | 74 | 2 |
| Lausanne | 39 | 2 |
| Basel | 24 | 1 |
| Lugano | 22 | 1 |
| Fribourg | 20 | 1 |
| Geneva | 20 | 1 |
| Neuchâtel | 16 | 1 |
| Bern | 15 | 1 |
| St. Gallen | 10 | 1 |
| Lucerne | 3 | 1 |

These counts are scope-selection and reconciliation evidence only. They are not complete municipality-wide programme inventories.

## 6. Geography quality blocker

All ten current CH City geographies currently have:

- `code = null`
- `region_code = null`
- `scope_kind = null`
- fast-path metadata using `SWISSUNIVERSITIES_HEDA`
- `normalization_batch = eu_fastpath_universities_v1`

Therefore Phase 2 must preserve stable IDs/slugs where appropriate while adding the official 01.01.2026 FSO municipality contract and canton relationship.

Phase 0 and Phase 1 do not mutate these production geography rows.

## 7. Campus and City-delivery blocker

The 12 current campus rows are primary publication locations from the institution fast-path. Across all 12:

- `campus_inventory_complete = false`
- `programme_assignment_verified = false`

This matters because several Swiss institutions operate across multiple schools, campuses or municipalities. A primary publication City must not be treated as proof that every programme is delivered there.

Later linkage must therefore:

- verify the physical study location from official provider evidence
- match a programme to the verified municipality before City publication
- preserve incomplete-campus disclosure where the full inventory is not known
- never infer programme delivery solely from institution presence

## 8. International-student eligibility model

Current international evidence distribution:

- 205 `eligible_schedule_unknown / verified_general`
- 35 `not_yet_open / verified_general`
- 3 `not_yet_open / verified_program`

The safe City publication chain is:

`accredited institution -> official current programme -> international evidence -> verified study location -> FSO municipality`

General international evidence must remain distinguishable from programme-specific current admissions verification.

## 9. Phase 0 gates

### Reusable now

- country code / route `CH` / `ch`
- 12 current canonical universities
- 243 current staged and canonical programmes
- 243 active programme offerings
- official programme and international evidence URLs
- ten stable City seeds, subject to Phase 2 normalization

### Must be repaired or expanded before broad City publication claims

1. normalize selected City geographies to the FSO 01.01.2026 municipality directory
2. add authoritative municipality number and canton relationship
3. verify physical study locations before assigning programme delivery
4. keep `campus_inventory_complete=false` until a real location inventory is verified
5. keep `verified_general` international evidence distinct from programme-specific verification
6. never convert institutional accreditation into programme-level accreditation
7. preserve the disclosure that the current provider foundation covers the 12-university category, not the complete accredited HEI universe
8. never rank Cities using national SEM work-rights rules

## Phase 0 conclusion

Switzerland is `READY_WITH_GATES` for Cities scope definition and municipality normalization.

The existing 12-university / 243-programme foundation is strong, but complete accredited-provider coverage, municipality-normalised geography and verified programme study-location assignment remain pending.