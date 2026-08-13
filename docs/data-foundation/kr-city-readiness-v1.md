# South Korea city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/kr-cities-v1`

Base main: `2019dbe23235171cb6bb6b848a95da20f31c5731`

Audit date: 2026-08-11

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

## Purpose

Establish the authoritative higher-education, geography, international-student and production-data baseline required before selecting the first public South Korea `/cities` cohort.

Phase 0 is diagnostic only. It does not mutate production data, publish routes, create city read models, alter SEO/indexing, or convert inherited campus links into city programme delivery claims.

## Product identity

Current canonical country contract:

- country code: `KR`
- country name: South Korea
- currency: `KRW`
- country active: `true`
- intended city route contract: `/cities/kr/{city-slug}`

Required invariants:

`Study in Korea source city != verified programme teaching location by itself`

`primary publication location != complete campus inventory`

`institution presence in one city != all programmes delivered in that city`

`inherited programme_offering.campus_id != verified city delivery when programme_assignment_verified=false`

These rules are material for multi-campus institutions, especially Kyung Hee University and Sungkyunkwan University (SKKU).

## Authoritative source families

### International-study university authority — Ministry of Education / NIIED Study in Korea

Study in Korea is the official Korean-government international-study portal operated by the National Institute for International Education. The Ministry of Education describes it as the official portal providing university, admissions, scholarship, visa, living and employment information for prospective international students.

Primary sources:

- https://www.studyinkorea.go.kr/
- https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=105857

### International Education Quality Assurance System — IEQAS

The Ministry of Education and Ministry of Justice jointly evaluate and certify institutions under IEQAS. The current Study in Korea accreditation page was updated on 2026-03-03.

Primary sources:

- https://studyinkorea.go.kr/ko/plan/certifiedUniversity.do
- https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=105347

IEQAS is useful as institution/internationalisation evidence. It is not a city ranking and must not be treated as proof of programme delivery at a specific campus.

### Foreign-student statistics — Ministry of Education / KEDI

The Ministry of Education publishes annual statistics on foreign students in Korean higher-education institutions, sourced from the Korean Educational Development Institute.

Primary source family:

- https://www.moe.go.kr/boardCnts/listRenew.do?boardID=350

The current project should use these data for national or later regional context, not to infer a programme teaching address.

### Official geography and population — MOIS / KOSIS

Use Ministry of the Interior and Safety administrative geography and resident-registration population statistics, with KOSIS as the national statistical access layer.

Primary sources:

- https://www.mois.go.kr/eng/sub/a03/citiesProvinces/screen.do
- https://jumin.mois.go.kr/index.jsp
- https://kosis.kr/

MOIS publishes monthly resident-registration population by administrative area. This population excludes foreigners, so later city profiles must label the measure accurately rather than presenting it as total resident population.

Phase 2 must store a reproducible administrative-area identity/code and an explicit population-boundary contract for every Tier A city.

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-11.

### Country

Production contains:

- `KR` — South Korea
- default currency: `KRW`
- active: `true`

### Existing Korea geography seed

Production contains exactly four active Korea city geography rows:

1. Busan — `busan`
2. Daejeon — `daejeon`
3. Pohang — `pohang`
4. Seoul — `seoul`

Current quality:

- geography type: `city` for `4/4`
- active: `4/4`
- `scope_kind`: `0/4`
- official geography `code`: `0/4`
- `region_code`: `0/4`
- source system: `NIIED_STUDY_IN_KOREA_IEQAS`
- normalization batch: `fi_no_jp_kr_fastpath_v1`

These rows are authority-backed publication-location seeds. They are not yet publication-complete administrative geography contracts.

### Canonical institution foundation

Production contains 14 active Korea institutions represented by the current programme foundation.

The initial authority fastpath included 10 IEQAS-backed universities, and the programme rollout added four additional Study in Korea provider identities:

- Daejeon Health University
- Korea Aerospace University
- Korea Maritime & Ocean University
- Namseoul University

Current programme-source institution coverage is therefore `14` institutions across `8` source-city labels.

This is a selected source-backed provider foundation, not the complete Korean higher-education provider universe.

### Existing campus/location rows

Production contains exactly 14 active Korea campus/location rows.

Quality:

- source URL present: `14/14`
- geography link present: `10/14`
- `programme_assignment_verified=true`: `0/14`
- `programme_assignment_verified=false` or absent/false: `14/14`

The rows are explicitly incomplete primary-publication/program-publication locations. They must not be described as complete campus inventories.

### Programmes and offerings

Production contains:

- staged Study in Korea programmes: `185`
- staged programmes at verification tier A/B: `185`
- canonical active Korea programmes: `185`
- verified Korea programme offerings: `185`
- source cities represented: `8`
- institutions represented: `14`

Current source-city distribution:

| Source city | Programmes | Institutions |
| --- | ---: | ---: |
| Seoul | 110 | 7 |
| Busan | 23 | 2 |
| Yongin | 17 | 1 |
| Daejeon | 14 | 2 |
| Pohang | 10 | 1 |
| Suwon | 8 | 1 |
| Cheonan | 2 | 1 |
| Goyang | 1 | 1 |

These source-city values are valuable reconciliation evidence. They are not sufficient by themselves to publish city programme counts.

### Critical inherited-campus mismatch

The current canonicalisation migration assigns each programme offering to the first active campus row for its institution. Because current campus inventories are incomplete, this creates exactly `25` verified offerings whose inherited campus city differs from the Study in Korea source city:

- Kyung Hee University: `17` programmes with source city `Yongin` inherited to current Seoul campus row
- Sungkyunkwan University (SKKU): `8` programmes with source city `Suwon` inherited to current Seoul campus row

Official university evidence confirms these institutions have distinct teaching campuses:

- Kyung Hee Global Campus: Yongin
- SKKU Natural Sciences Campus: Suwon

Therefore Phase 3 must establish separate teaching-location rows and re-link only programmes with explicit location evidence. Until then, no Seoul/Yongin/Suwon programme count may rely on inherited `campus_id`.

### City metrics and read models

Current production state:

- Korea rows in `report_metric_evidence_city`: `0`
- Korea city directory/read-model views: `0`
- Korea City Compare surface: not established
- Korea city route allowlist: not established

Phase 0 introduces none.

## Reusable foundation

The following can be reused safely:

1. canonical country `KR` and KRW currency;
2. 14 current canonical Study in Korea / authority-backed provider identities;
3. 185 canonical programme identities and source records;
4. Study in Korea source-city labels as reconciliation evidence;
5. four existing geography UUIDs for Seoul, Busan, Daejeon and Pohang if Phase 2 normalises them in place;
6. NIIED / Study in Korea as the primary international-study institution/programme source family;
7. IEQAS as institution internationalisation/visa-screening context;
8. MOIS/KOSIS as the geography/population authority family;
9. official university campus/faculty pages as the Phase 3 physical teaching-location authority.

## Data that must not be treated as publication-complete

Do not treat the following as complete city evidence:

1. the current four geography rows as the final public destination list;
2. the 14 campus rows as complete campus inventories;
3. an IEQAS institution name as proof of programme delivery in the fastpath city;
4. the inherited `campus_id` on any Korea offering as city-delivery proof;
5. the 25 mismatched inherited offering links as valid Seoul programme assignments;
6. Study in Korea source city as a substitute for official teaching-location evidence;
7. the current 14 institutions as the complete Korean HEI universe;
8. current absence of a city/provider from CampCareer as a quality judgement;
9. MOIS resident-registration population as total population including foreigners;
10. national visa/work rules as city differentiators.

## Phase 0 blockers and remediation

### Blocker 1: geography scope is absent

Current state: all four Korea geography seeds have no official code, `scope_kind`, or region code.

Remediation: Phase 2 must attach explicit MOIS/KOSIS administrative identity and population-boundary metadata.

### Blocker 2: campus inventory is incomplete

Current state: 14 primary publication/program publication locations only, all with programme assignment unverified.

Remediation: Phase 3 must verify actual teaching campuses from official university sources.

### Blocker 3: multi-campus inheritance creates wrong city links

Current state: exactly 25 verified offering rows inherit a campus city different from the Study in Korea source city.

Remediation: Phase 3 must add distinct Yongin and Suwon teaching-location evidence and must not migrate these 25 rows into Seoul city coverage.

### Blocker 4: provider universe is incomplete

Current state: 14 institutions from the current programme/authority foundation.

Remediation: Phase 1 may lock a bounded first cohort around cities with sufficiently mature current evidence, while major omitted destinations such as Incheon, Daegu and Gwangju remain explicit provider-expansion candidates rather than being treated as lower-quality cities.

### Blocker 5: no city metric layer

Current state: zero Korea city metrics.

Remediation: Phase 4 creates the Five Core Metrics after geography and teaching-location contracts are fixed.

### Blocker 6: population semantics require disclosure

MOIS resident-registration population excludes foreigners.

Remediation: Phase 4 must label the metric as resident-registration population or choose another reproducible official population series; it must not silently label it total resident population.

## Readiness gates

South Korea may proceed to Phase 1 if these rules remain fixed:

1. Tier A is a bounded initial publication cohort, not a national ranking;
2. exact administrative geography is established before public profile publication;
3. current fastpath geography rows are normalised, not blindly trusted;
4. primary publication locations are not treated as full campus inventories;
5. programme delivery is never inferred from institution presence or inherited `campus_id`;
6. the 25 current source-city/campus-city mismatches are treated as known invalid city assignments until repaired;
7. source-city labels are reconciliation evidence only;
8. current provider coverage is disclosed as incomplete;
9. major omitted destinations remain expansion candidates;
10. national immigration/IEQAS context is not converted into a city ranking signal.

## Phase 0 result

South Korea Phase 0 is complete.

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

Production mutation: `NONE`

Route/publication change: `NONE`

Next phase: Phase 1 Tier A scope lock on the same branch.
