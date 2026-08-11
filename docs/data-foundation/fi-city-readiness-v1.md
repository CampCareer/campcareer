# Finland Cities — Phase 0 country readiness v1

Status: `PHASE_0_COMPLETE`
Readiness: `READY_WITH_GATES`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## 1. Country identity and route contract

- Canonical CampCareer country code: `FI`
- Canonical country route: `fi`
- Currency: EUR
- Higher-education system: dual sector — universities and universities of applied sciences (UAS)
- City geography authority for this rollout: Statistics Finland municipality classification, 2026 edition

Finland's city rollout must treat a municipality as the default public comparison boundary. Capital-region or commuting-area concepts must not silently replace municipal boundaries. Helsinki and Espoo therefore remain separate public destinations when both are selected.

## 2. Official source hierarchy

### Provider recognition

Primary recognition authority:
- Finnish Ministry of Education and Culture — recognised higher-education institutions
  - https://okm.fi/en/heis-and-science-agencies

International-facing official cross-check:
- Study in Finland — recognised universities and universities of applied sciences
  - https://www.studyinfinland.fi/universities

As of the 2026 official Study in Finland guidance, Finland has 35 recognised higher-education institutions in the Study in Finland universe: 13 universities and 22 universities of applied sciences.

### Programme discovery and admission

Primary national discovery/application source:
- Studyinfo / Opintopolku, maintained by the Finnish National Agency for Education
  - https://opintopolku.fi/konfo/en/

Studyinfo is the official up-to-date national service for degree-leading study programmes. Higher-education institutions maintain their own programme information in the service.

Final programme verification hierarchy:
1. Studyinfo programme / implementation record
2. official higher-education institution programme page
3. official institution admissions page for application status and intake timing

A programme must not be treated as delivered in a city solely because its institution has a campus there.

### Geography

Primary geography authority:
- Statistics Finland — Municipalities 2026
  - https://stat.fi/en/luokitukset/kunta/kunta_1_20260101

The municipality classification is the Phase 2 authority for municipality codes, region relationships and public city boundaries.

### Education statistics

Primary national education-statistics source:
- Vipunen — Education Statistics Finland
  - https://vipunen.fi/

Vipunen can be used for later student-volume and system-coverage checks, but the Phase 1 allowlist is not allowed to masquerade as a complete ranking of Finnish student cities while CampCareer's provider inventory remains partial.

### Student residence / work rights

Primary authority:
- Finnish Immigration Service (Migri)
  - https://migri.fi/en/working-and-internships-during-studies

Current residence-permit study work context:
- paid employment in any field: average 30 hours per week
- hours may exceed 30 in individual weeks if the year-end average remains within the rule
- Migri also expresses this as an average 120 hours per month / 1,560 hours per year
- degree-related practical training or diploma work may fall outside the normal limit when it is part of the degree under Migri's stated conditions

This is a national residence-permit rule. It must never be scored as a city differentiator.

## 3. Authoritative institution identity

### Target identity

For canonical data linkage, prefer the Studyinfo organisation OID exposed by the official Studyinfo data model (`organisaatio.oid`) as the technical institution identifier, with the Ministry / Study in Finland recognised-provider list used to validate that the entity is a legitimate Finnish HEI.

Official Studyinfo API documentation exposes organisation OIDs in the programme / implementation data model:
- https://opintopolku.fi/konfo-backend/redoc/index.html

### Current CampCareer identity limitation

Production currently has 10 FI canonical institutions and 10 institution identifiers, but the identifier system is:

`FI_EDUFI_TIER_A_NAME`

This is a provisional name identity derived from an earlier university fastpath, not a durable national identifier.

Phase 3 must therefore augment or replace name-only identity with authoritative Studyinfo organisation OIDs before claiming full institution identity maturity.

## 4. Current production coverage

Production audit on 2026-08-11:

| Layer | Current FI coverage | Phase 0 interpretation |
|---|---:|---|
| Canonical institutions | 10 | university-core subset only |
| Institution identifiers | 10 | provisional `FI_EDUFI_TIER_A_NAME` identifiers |
| Campuses | 10 | one `Primary publication location` per current institution |
| Campuses with geography | 10 | linked, but location inventory is incomplete |
| FI geographies | 8 | fastpath city seeds; not yet municipality-normalised |
| Staged programmes | 342 | all have Tier A verification flag, official programme URL, international source URL, institution link and city text |
| Canonical programmes | 342 | reusable programme foundation |
| Programme offerings | 342 | all current canonical offerings are `verified` |
| International programme rows | 342 | eligibility layer exists, but most verification is general rather than programme-specific |

All 342 staged programme rows currently have:
- `collection_status='official_current_program_verified'`
- `verification_tier='A'`
- non-empty official programme URL
- non-empty international source URL
- canonical institution link
- non-empty city
- non-empty degree level

International-admission evidence is less mature than the programme catalogue itself:
- 10 rows: `verified_program`
- 332 rows: `verified_general`

The 332 `verified_general` rows must not be presented as individually verified current admission windows merely because the underlying programme and general international eligibility are verified.

## 5. Current institution foundation

Current production university-core institutions:

1. Aalto University — Espoo
2. Åbo Akademi University — Turku
3. Hanken School of Economics — Helsinki
4. LUT University — Lappeenranta
5. Tampere University — Tampere
6. University of Eastern Finland — currently represented by Joensuu primary location
7. University of Helsinki — Helsinki
8. University of Jyväskylä — Jyväskylä
9. University of Oulu — Oulu
10. University of Turku — Turku

Coverage status for Cities work:

`selected_university_core_full_hei_coverage_pending`

This must remain visible in later profiles and QA until the recognised-provider inventory has been expanded beyond these 10 universities.

## 6. Programme city distribution currently available

The 342 staged programmes currently resolve to eight source-city labels:

| City | Programmes | Current institutions represented |
|---|---:|---:|
| Espoo | 81 | 1 |
| Helsinki | 49 | 2 |
| Tampere | 47 | 1 |
| Turku | 42 | 2 |
| Lappeenranta | 40 | 1 |
| Joensuu | 30 | 1 |
| Oulu | 27 | 1 |
| Jyväskylä | 26 | 1 |

These counts describe the current university-core programme foundation. They are not a complete city-level Finnish higher-education catalogue because UAS and several recognised universities / secondary campuses are not represented in the current institution layer.

## 7. Geography quality and blockers

All eight current FI geographies were created by the earlier `fi_no_jp_kr_fastpath_v1` process.

Current problems:
- `scope_kind` is null
- municipality `code` is null
- `region_code` is null
- metadata identifies Study in Finland fastpath provenance rather than Statistics Finland municipality normalization

Therefore Phase 2 must not simply mark these rows publishable. It must preserve stable UUIDs/slugs where appropriate while adding the Statistics Finland municipality contract.

## 8. Campus / delivery evidence blocker

The existing 10 campus rows are named `Primary publication location`. This is a publication convenience layer, not a verified full physical-campus inventory.

Known structural issue:
- University of Eastern Finland is a multi-campus university, while the current canonical campus layer represents only Joensuu as the primary publication location.

Consequences:
- current `campus_id` may be reused as a lead, not as conclusive city-delivery evidence
- Phase 3 must verify physical study locations from official HEI / Studyinfo sources
- programme city must be independently reconciled with the verified study location
- no programme delivery inference from institution presence

## 9. International-student eligibility model

Finland does not use a UK-style public sponsor register for this Cities workflow.

A safe publication chain is:

`recognised HEI -> official degree programme -> current Studyinfo / HEI admission evidence -> applicable Migri study-permit context`

Institution recognition by itself is not sufficient to assert that every programme is currently open to international applicants.

## 10. Phase 0 gates

### Reusable now

- country code / route `FI` / `fi`
- 342 current canonical programme records
- 342 verified canonical programme offerings as programme-foundation evidence
- official programme URLs and current city labels as reconciliation inputs
- eight stable city UUID/slug seeds, subject to Phase 2 normalization

### Must be repaired or expanded before publication claims

1. replace/augment name-only institution identity with Studyinfo organisation OID
2. expand recognised-provider inventory beyond the current 10-university core or disclose the gap everywhere it matters
3. verify real campus / study-location inventory, especially multi-campus institutions
4. normalize Tier A geography rows to Statistics Finland municipality codes and regions
5. keep `verified_general` international-admission rows distinct from programme-specific current admission verification
6. never infer city programme delivery from current `Primary publication location` campus rows

## Phase 0 conclusion

Finland is `READY_WITH_GATES` for City scope and geography normalization.

The programme foundation is unusually strong, but institution and physical-location coverage are not complete enough to claim a full Finnish HEI catalogue. Later phases must preserve that distinction.
