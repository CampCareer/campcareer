# Norway Cities — Phase 0 country readiness v1

Status: `PHASE_0_COMPLETE`
Readiness: `READY_WITH_GATES`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## 1. Country identity and route contract

- Canonical CampCareer country code: `NO`
- Canonical country route: `no`
- Currency: NOK
- Higher-education quality authority: NOKUT
- International programme discovery surface: Study in Norway, maintained by the Norwegian Directorate for Higher Education and Skills (HK-dir)
- City geography authority for this rollout: Statistics Norway (SSB) municipality classification, 2026 version

The Cities rollout will use the official municipality as the default public comparison boundary. Regional labels used by Study in Norway such as East Norway, West Norway, Mid Norway, South Norway and North Norway are discovery groupings and must not replace municipal boundaries.

## 2. Official source hierarchy

### Institution recognition and accreditation

Primary higher-education quality authority:

- NOKUT — Higher education institutions
  - https://www.nokut.no/en/higher-education/higher-education-institutions/

NOKUT currently describes four main categories of higher-education providers: universities, specialised universities, university colleges/universities of applied sciences, and university colleges with accredited study programmes.

NOKUT's general Norway education guidance states that Norway has 49 approved higher-education institutions as of January 2026. The current CampCareer Norway institution foundation contains the 11 institutions in NOKUT's university category, not the full 49-institution higher-education universe.

### Programme discovery

Primary international programme discovery source:

- Study in Norway — Study opportunities
  - https://studyinnorway.no/study-opportunities

StudyinNorway.no is developed and maintained by HK-dir. Its public guidance states that Norwegian higher-education institutions offer around 350 study programmes taught in English, mostly at master's level.

Current CampCareer Norway programme staging is sourced from `HKDIR_STUDYINNORWAY_2026` with a source snapshot dated 2026-08-09.

Programme verification hierarchy for later Cities linkage:

1. Study in Norway programme record for national international-facing discovery
2. official institution programme page for current title, delivery form and study location
3. official institution admissions page for current international application status and intake timing
4. NOKUT institution/programme accreditation context where applicable

NOKUT institutional status must not be converted into a false claim that every programme has an individual NOKUT programme accreditation. Institutions with self-accrediting rights can establish programmes within their authority without separate programme-by-programme NOKUT approval.

### Institution identity

Current CampCareer institution identifiers use:

`NO_NOKUT_UNIVERSITY_NAME`

This is an official-name fast-path identifier and is not a durable national technical identifier.

Target identity source for the next linkage phase:

- HK-dir DBH (Database for Statistics on Higher Education)
  - https://dbh.hkdir.no/

DBH defines a four-digit `Institusjonskode` for institution identification. Phase 3 should augment the current name-only identity with the matching authoritative DBH institution code before claiming mature institution identity.

### Geography

Primary geography authority:

- Statistics Norway (SSB) — Classification of municipalities
  - https://www.ssb.no/en/klass/klassifikasjoner/131

The current version is `Municipalities 2026`, valid from January 2026. SSB defines municipality as both an administrative level and a regional level for statistics. Norwegian municipality numbers are four digits and the first two digits correspond to the county number.

This is the Phase 2 authority for municipality codes, county relationships and public city boundaries.

### Student residence and work rights

Primary immigration authority:

- Norwegian Directorate of Immigration (UDI) — Study permit
  - https://www.udi.no/en/want-to-apply/studies/studietillatelse/

Current UDI study-permit context allows eligible students to work up to 20 hours per week while studying and full-time during holidays.

This is a national immigration rule. It must never be scored as a city differentiator.

## 3. Current production coverage

Production audit on 2026-08-11:

| Layer | Current NO coverage | Phase 0 interpretation |
|---|---:|---|
| Canonical institutions | 11 | complete current NOKUT university category, not full HEI universe |
| Institution identifiers | 11 | provisional `NO_NOKUT_UNIVERSITY_NAME` identity |
| Active campuses | 11 | one primary publication location per university |
| Campuses with geography | 11 | linked, but physical campus inventory is incomplete |
| Campuses marked inventory complete | 0 | location coverage not complete |
| Campuses with programme assignment verified | 0 | no city-delivery claim yet |
| NO city geographies | 10 | fast-path city seeds; not municipality-normalised |
| Staged programmes | 140 | all Tier A and institution-linked |
| Staged programmes with city | 140 | source-city field present |
| Staged programmes with authority URL | 140 | Study in Norway evidence present |
| Staged programmes with institution URL | 140 | provider evidence present |
| Canonical programmes | 140 | reusable programme foundation |
| Canonical offerings | 140 | all currently `verified` |
| International programme rows | 140 | 1:1 with staged programmes |
| Programme-specific international verification | 4 | `verified_program` |
| General international verification | 136 | `verified_general` |

The 140-programme foundation is strong enough to support Cities discovery work, but it is not a complete national English-taught programme catalogue. The public Study in Norway surface describes a broader national universe of around 350 English-taught programmes and includes institution categories beyond the 11 universities currently canonicalised in CampCareer.

## 4. Current university foundation

Current production university institutions:

1. Nord University
2. Norwegian University of Life Sciences
3. Norwegian University of Science and Technology
4. OsloMet – Oslo Metropolitan University
5. University of Agder
6. University of Bergen
7. University of Inland Norway
8. University of Oslo
9. University of Stavanger
10. University of South-Eastern Norway
11. UiT The Arctic University of Norway

This matches the current NOKUT university category.

Coverage state carried forward for Cities:

`all_nokut_universities_full_hei_coverage_pending`

Meaning:

- the university category is represented
- specialised universities are not yet represented as a complete cohort
- university colleges / universities of applied sciences are not yet represented as a complete cohort
- university colleges with accredited programmes are not yet represented as a complete cohort
- city institution counts must therefore not be described as complete municipality-wide HEI totals

## 5. Programme city distribution currently available

The 140 staged programmes resolve to ten current source-city labels:

| City | Programmes | Current institutions represented |
|---|---:|---:|
| Oslo | 34 | 2 |
| Trondheim | 27 | 1 |
| Stavanger | 14 | 1 |
| Ås | 11 | 1 |
| Tromsø | 11 | 1 |
| Bodø | 10 | 1 |
| Kongsberg | 10 | 1 |
| Kristiansand | 10 | 1 |
| Bergen | 9 | 1 |
| Elverum | 4 | 1 |

These counts are reconciliation and scope-selection evidence. They are not complete municipal programme inventories.

## 6. Geography quality and blocker

The ten current Norway city geographies were created by the earlier `fi_no_jp_kr_fastpath_v1` process.

Current defects across all ten city rows:

- `scope_kind` is null
- municipality `code` is null
- `region_code` is null
- metadata records NOKUT/fast-path provenance rather than SSB municipality normalization

Therefore Phase 2 must preserve stable UUIDs/slugs where appropriate while adding the official 2026 SSB municipality contract.

No Phase 0 or Phase 1 work changes production geography rows.

## 7. Campus and city-delivery evidence blocker

All 11 current campus records are primary publication locations created for the earlier institution fast-path. Their metadata explicitly carries:

- `campus_inventory_complete=false`
- `programme_assignment_verified=false`

Norway has several multi-campus universities. A single primary publication city must not be treated as a complete campus inventory or as proof that every programme is delivered in that municipality.

Consequences for later phases:

- source city text is a strong reconciliation input, not sufficient publication proof by itself
- a current primary publication campus may be reused as a lead, not as conclusive delivery evidence
- Phase 3 must verify actual teaching/study locations from institution and Study in Norway evidence
- programme delivery must be linked to a verified study location before city programme counts are published as verified

## 8. International-student eligibility model

A safe Norway publication chain is:

`NOKUT-recognised HEI -> official current programme -> Study in Norway / provider international evidence -> verified study location -> applicable UDI study-permit context`

Institution recognition by itself does not prove that every programme is currently open to international applicants.

The current international layer contains:

- 4 `verified_program` rows
- 136 `verified_general` rows

The 136 general rows must remain distinguishable from programme-specific current admissions verification.

## 9. Phase 0 gates

### Reusable now

- country code / route `NO` / `no`
- all 11 current NOKUT universities as canonical institutions
- 140 current Tier A programme records
- 140 verified canonical programme offerings
- official Study in Norway and institution programme URLs
- ten stable city UUID/slug seeds, subject to Phase 2 normalization

### Must be repaired or expanded before publication claims

1. augment name-only institution identity with authoritative DBH institution codes
2. expand provider coverage beyond the 11 universities before claiming full Norwegian HEI coverage
3. verify physical campus / study-location inventories for multi-campus institutions
4. normalize Tier A city geographies to SSB 2026 municipality codes and county relationships
5. keep `verified_general` international evidence distinct from programme-specific verification
6. never infer city programme delivery from the current primary publication campus alone
7. keep Study in Norway regional groupings separate from municipality boundaries

## Phase 0 conclusion

Norway is `READY_WITH_GATES` for Cities scope definition and municipality normalization.

The current foundation covers all 11 NOKUT universities and 140 verified programme offerings, but full higher-education-provider coverage, durable institution identity and city-specific physical delivery verification remain pending.
