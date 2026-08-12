# South Korea city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/kr-cities-v1`

Base Phase 0 commit: `86c9b61d0b40424fad562c7f2d0d3f7f4a7b07fb`

Audit date: 2026-08-11

Checkpoint: `TIER_A_SCOPE_LOCKED`

## Purpose

Select the first public South Korea `/cities` cohort and define the Phase 2 geography-normalisation guardrails without allowing current primary-publication campus rows or inherited programme offering links to dictate city delivery.

Phase 1 does not mutate production geography, create teaching-campus records, publish city routes, create city read models, change SEO, or assign programme delivery.

## Decision

South Korea Tier A v1 contains exactly six public study destinations, in initial publication order:

1. Seoul — `seoul`
2. Busan — `busan`
3. Daejeon — `daejeon`
4. Suwon — `suwon`
5. Yongin — `yongin`
6. Pohang — `pohang`

Initial route contract:

- `/cities/kr/seoul`
- `/cities/kr/busan`
- `/cities/kr/daejeon`
- `/cities/kr/suwon`
- `/cities/kr/yongin`
- `/cities/kr/pohang`

This is a bounded first CampCareer South Korea destination cohort. The order is a publication sequence, not a national ranking of Korean student cities.

## Selection methodology

A destination qualifies for Tier A v1 when all of the following can be satisfied without inventing evidence:

1. the current Study in Korea programme foundation contains a non-trivial explicit source-city signal;
2. at least one current canonical institution anchor exists;
3. an official administrative geography/population boundary can be established in Phase 2;
4. official university evidence can establish a physical teaching-location relationship in Phase 3;
5. the destination helps expose and repair current multi-campus assignment risks rather than hiding them;
6. later Five Core Metrics can be sourced with clear national-vs-local semantics;
7. current programme counts can remain unpublished until explicit teaching-location linkage is verified.

Current Study in Korea source-city evidence used for scope selection:

| Tier A city | Current staged programmes | Institutions represented |
| --- | ---: | ---: |
| Seoul | 110 | 7 |
| Busan | 23 | 2 |
| Yongin | 17 | 1 |
| Daejeon | 14 | 2 |
| Pohang | 10 | 1 |
| Suwon | 8 | 1 |

These counts are selection/reconciliation evidence only. They are not publication-ready municipal programme inventories.

## Current foundation coverage at scope lock

| Destination | Current geography | Current provider anchor | Phase 1 implication |
| --- | --- | --- | --- |
| Seoul | `seoul` exists | 7 current programme-source institutions | Reuse the existing geography UUID only after Phase 2 adds official administrative scope. Phase 3 must prevent Yongin/Suwon offerings from leaking into Seoul through inherited campus links. |
| Busan | `busan` exists | Pusan National University; Korea Maritime & Ocean University | Reuse only after explicit administrative scope/code is attached. |
| Daejeon | `daejeon` exists | KAIST; Daejeon Health University | Reuse only after explicit administrative scope/code is attached; KAIST has multiple Daejeon-area campuses and later programme assignment must remain evidence-specific. |
| Suwon | no canonical geography | Sungkyunkwan University Natural Sciences Campus evidence | Create a separate Suwon geography. Do not treat SKKU's current Seoul primary-publication row as the Suwon teaching location. |
| Yongin | no canonical geography | Kyung Hee University Global Campus evidence | Create a separate Yongin geography. Do not treat Kyung Hee's current Seoul primary-publication row as the Yongin teaching location. |
| Pohang | `pohang` exists | POSTECH | Reuse only after official city/province scope is attached. |

## Tier A decisions

### Seoul

Decision: `TIER_A`

Public slug: `seoul`

Current production geography: exists.

Current source programme evidence: `110` rows across `7` institutions.

Why selected:

- it has the deepest current Study in Korea programme/provider foundation;
- current canonical university coverage is sufficiently broad for a first teaching-location verification pass;
- official national and Seoul-local source depth is sufficient for later metrics.

Phase 2 / Phase 3 guardrails:

- public destination is the official Seoul administrative area, not an informal Seoul metropolitan region;
- Phase 2 must attach an explicit MOIS/KOSIS geography and population contract;
- Phase 3 must not count the 17 Yongin-source Kyung Hee programmes or 8 Suwon-source SKKU programmes as Seoul simply because current canonical offerings inherit Seoul primary-publication campus rows;
- Seoul programme coverage remains `verification_pending` until strict teaching-location linkage is rebuilt.

### Busan

Decision: `TIER_A`

Public slug: `busan`

Current production geography: exists.

Current source programme evidence: `23` rows across `2` institutions.

Current anchors:

- Pusan National University
- Korea Maritime & Ocean University

Why selected:

- it has a substantial current source-backed programme foundation outside the capital region;
- it provides a major southeast metropolitan study destination;
- the current provider set is sufficient for an initial bounded city profile while still being disclosed as incomplete.

Phase 2 guardrail:

- use the official Busan administrative boundary and code;
- do not collapse nearby Gyeongsangnam-do teaching locations into Busan without explicit evidence.

### Daejeon

Decision: `TIER_A`

Public slug: `daejeon`

Current production geography: exists.

Current source programme evidence: `14` rows across `2` institutions.

Current anchors:

- KAIST
- Daejeon Health University

Why selected:

- current programme/provider evidence is material and independently source-backed;
- KAIST official campus information confirms a strong Daejeon teaching-location foundation;
- Daejeon provides a central science/research-oriented destination distinct from Seoul and Busan.

Phase 3 guardrail:

- KAIST has multiple campuses, including Daejeon-area Main and Munji campuses plus Seoul/Dogok locations;
- institution identity must not cause all KAIST activity to be treated as Daejeon delivery;
- only explicitly Daejeon-linked programme evidence may enter city programme counts.

Official campus source:

https://www.kaist.ac.kr/en/html/kaist/01200201.html

### Suwon

Decision: `TIER_A`

Public slug: `suwon`

Current production geography: none.

Current source programme evidence: `8` rows from Sungkyunkwan University (SKKU).

Why selected:

- Study in Korea currently identifies eight programme rows with source city Suwon;
- SKKU officially identifies its Natural Sciences Campus as being in Suwon;
- the city is a required correctness case because the current canonical programme-offering migration incorrectly inherits these rows to SKKU's Seoul primary-publication campus.

Phase 2 / Phase 3 guardrails:

- create a new Suwon city geography under Gyeonggi-do;
- keep Seoul and Suwon distinct even though both belong to the wider capital-region study market;
- Phase 3 must create a verified SKKU Suwon teaching-location row before any of the eight source programmes are published as Suwon delivery;
- do not alias Suwon to Seoul.

Official teaching-location source:

https://www.skku.edu/eng/About/campusinfo/location02.do

### Yongin

Decision: `TIER_A`

Public slug: `yongin`

Current production geography: none.

Current source programme evidence: `17` rows from Kyung Hee University.

Why selected:

- Study in Korea currently identifies 17 programme rows with source city Yongin;
- Kyung Hee officially identifies Global Campus at 1732 Deogyeong-daero, Giheung-gu, Yongin-si;
- the city is the largest current source-city/campus-city mismatch and must be represented explicitly rather than absorbed into Seoul.

Phase 2 / Phase 3 guardrails:

- create a new Yongin geography under Gyeonggi-do;
- preserve Seoul Campus and Yongin Global Campus as distinct teaching locations;
- the 17 source rows remain `verification_pending` until programme-to-Global-Campus evidence is confirmed;
- institution brand identity cannot bridge the two city boundaries automatically.

Official teaching-location source:

https://www.khu.ac.kr/eng/user/contents/view.do?menuNo=300051

### Pohang

Decision: `TIER_A`

Public slug: `pohang`

Current production geography: exists.

Current source programme evidence: `10` rows from POSTECH.

Why selected:

- POSTECH provides a focused source-backed teaching ecosystem with current programme evidence;
- official POSTECH material places the university in Pohang-si, Gyeongsangbuk-do;
- inclusion provides a non-metropolitan specialised research destination and broader geographic coverage.

Phase 2 guardrail:

- reuse the existing Pohang geography UUID only after attaching the official city/province scope and code;
- later provider counts must be described as selected current coverage, not the complete Pohang HEI universe.

Official location source:

https://www.postech.ac.kr/eng/about/campus_info.do

## Explicit Tier B / expansion candidates

The following are important future candidates, not rejected cities.

### Provider-expansion priority

- Incheon
- Daegu
- Gwangju
- Ulsan
- Jeonju
- Jeju
- Sejong

These destinations have meaningful higher-education ecosystems, and the current 2026 IEQAS source includes institutions outside the present 14-provider CampCareer foundation, including examples in Incheon and Daegu. They remain outside Tier A v1 because Phase 0 already identified an incomplete provider universe and the first rollout should first repair the current multi-campus city-assignment defect.

### Current thin-source candidates

- Cheonan — current source evidence: 2 programmes / 1 institution
- Goyang — current source evidence: 1 programme / 1 institution

Their current database presence is useful evidence but not sufficient reason to expand the first publication cohort. They can be promoted later after provider/location coverage is broadened.

Additional cities may enter only through a documented future scope revision. No city may leak into the v1 allowlist automatically from a new programme-source row.

## Administrative geography contract

Phase 2 must normalize exactly the six Tier A destinations and no others.

Required work:

1. preserve existing UUIDs for Seoul, Busan, Daejeon and Pohang where identity remains correct;
2. create new canonical city geographies for Suwon and Yongin;
3. attach explicit official administrative codes and scope metadata;
4. record parent/province context where applicable, including Gyeonggi-do for Suwon/Yongin and Gyeongsangbuk-do for Pohang;
5. establish one reproducible population contract per city using MOIS/KOSIS data;
6. disclose that MOIS resident-registration population excludes foreigners if that series is used;
7. do not use metropolitan-market language to merge Seoul, Suwon and Yongin;
8. do not promote Cheonan, Goyang or any provider-expansion candidate during Phase 2;
9. add contract tests for exact Tier A slugs and geography separation.

## Programme boundary

The existing `185` canonical Korea programmes remain national/source programme evidence only.

Phase 1 assigns none of them to public Tier A city programme coverage.

Until Phase 3 verifies programme-to-teaching-location relationships:

`programme_coverage_status = verification_pending`

Known invalid inherited city relationships that must not leak into publication:

- Kyung Hee University: 17 Yongin source programmes currently inherited to Seoul campus row
- SKKU: 8 Suwon source programmes currently inherited to Seoul campus row

Phase 3 must repair teaching-location structure before any city programme count is exposed.

## Phase 1 result

South Korea Phase 1 is complete.

Checkpoint: `TIER_A_SCOPE_LOCKED`

Exact Tier A count: `6`

Exact slugs:

`seoul`, `busan`, `daejeon`, `suwon`, `yongin`, `pohang`

Production mutation: `NONE`

Route/publication change: `NONE`

Next phase: Phase 2 geography normalization on the same branch.
