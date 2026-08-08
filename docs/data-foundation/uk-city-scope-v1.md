# United Kingdom city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/uk-cities-scope-v1`

Parent readiness branch: `agent/uk-cities-readiness-v1`

## Purpose

Define the first public UK study-destination set for CampCareer `/cities` before any slug/scope normalization is applied.

The UK already has 37 legacy city geographies, 50 active institutions and 185 legacy programme offerings. Those rows are discovery material only. Phase 1 deliberately selects a smaller publication allowlist so later normalization, linkage verification, five-metric collection and City/Compare work remain bounded and auditable.

## Selection contract

Tier A selection balances six signals:

1. international-student relevance and current UK higher-education scale;
2. institution density and breadth within the named city;
3. current CampCareer campus/programme linkage as a discovery signal;
4. useful geographic coverage across England, Scotland, Wales and Northern Ireland;
5. student decision value for City/Compare;
6. likely availability of official evidence for population, living cost, transport and employment context.

Current legacy programme counts are not treated as verified programme coverage. They only indicate where the existing catalogue already contains useful discovery material.

The external UK-wide benchmark is HESA's 2024/25 Higher Education Student Statistics, published 27 January 2026. HESA reports 304 providers and identifies University College London, The University of Manchester, King's College London, The University of Birmingham and Manchester Metropolitan University among the five largest non-Open-University providers by enrolment. This strongly supports London, Manchester and Birmingham as first-batch city markets.

Official reference:

- HESA, Where do HE students study?: https://www.hesa.ac.uk/data-and-analysis/students/where-study
- HESA, Higher Education Student Statistics: UK, 2024/25: https://www.hesa.ac.uk/news/27-01-2026/sb273-higher-education-student-statistics/location

The four-nation structure is retained. Wales had 143,825 enrolments at Welsh HE providers in 2024/25 according to Medr, and Northern Ireland's Department for the Economy publishes a separate HE enrolment series for NI institutions. City selection therefore must not collapse the UK into an England-only list.

References:

- Medr, Students in Higher Education 2024/25: https://www.medr.cymru/en/News/sta-medr-01-2026-students-in-higher-education-2024-25/
- Northern Ireland Department for the Economy, Higher education enrolments: https://www.economy-ni.gov.uk/articles/higher-education-enrolments

## Tier A — first public UK city set

Publish and compare these twelve destinations first unless product scope is deliberately reduced before Phase 2.

| Order | City | Nation / region | Current institutions | Legacy programmes | Why Tier A |
| ---: | --- | --- | ---: | ---: | --- |
| 1 | London | England / London | 8 | 40 | Largest current CampCareer UK city cluster; HESA's largest-provider list includes UCL and King's College London; uniquely broad institution and career-market coverage. |
| 2 | Manchester | England / North West | 2 | 12 | University of Manchester is among HESA's largest UK providers; major multi-provider student and employment market. |
| 3 | Birmingham | England / West Midlands | 2 | 11 | University of Birmingham is among HESA's largest UK providers; Aston adds institution breadth and the city is a major regional employment hub. |
| 4 | Edinburgh | Scotland | 2 | 12 | Strong Scotland study destination with University of Edinburgh and Heriot-Watt already linked in the current graph. |
| 5 | Glasgow | Scotland | 2 | 5 | Distinct large Scottish urban study market with University of Glasgow and Strathclyde; useful City/Compare contrast with Edinburgh. |
| 6 | Cardiff | Wales | 1 | 6 | Primary Wales city-market anchor in the current catalogue and necessary four-nation decision coverage. |
| 7 | Belfast | Northern Ireland | 1 | 6 | Primary Northern Ireland city-market anchor in the current catalogue and necessary four-nation decision coverage. |
| 8 | Oxford | England / South East | 1 | 9 | Globally important institution-concentrated study destination; must remain a named-city scope rather than a regional proxy. |
| 9 | Cambridge | England / South East | 1 | 9 | Globally important institution-concentrated study destination with a distinct technology/life-sciences employment context. |
| 10 | Bristol | England / South West | 1 | 8 | Strong South West student/career market and useful regional balance beyond London/South East. |
| 11 | Leeds | England / Yorkshire | 1 | 3 | Large northern student and employment market; current CampCareer coverage is visibly incomplete, making it a priority verification city rather than a reason to exclude it. |
| 12 | Nottingham | England / East Midlands | 2 | 6 | Two-institution current cluster (University of Nottingham and Nottingham Trent) and useful East Midlands coverage. |

Approved provisional public slugs for Phase 2:

- `london`
- `manchester`
- `birmingham`
- `edinburgh`
- `glasgow`
- `cardiff`
- `belfast`
- `oxford`
- `cambridge`
- `bristol`
- `leeds`
- `nottingham`

The list is deliberately capped at twelve. If product scope is reduced before Phase 2, cut from the bottom of the allowlist and update this document before any normalization migration is applied.

## Tier B — high-priority later expansion

Retain these as strong expansion candidates but do not normalize or publish them in the first batch:

- Coventry — current graph contains Coventry University and University of Warwick with 10 legacy programmes. Requires explicit campus-location verification because the Warwick name can be mistaken for the separate town/county geography while the university's main campus is in Coventry.
- Sheffield — strong Yorkshire study market; current graph has University of Sheffield and five legacy programmes.
- Newcastle — useful North East coverage; current graph has one institution and four legacy programmes.
- Southampton — strong South Coast university market but current canonical breadth is narrow.
- Exeter — strong South West institution but overlaps Bristol for first-batch regional coverage.
- Bath — valuable compact student city but first-batch breadth is narrower than Bristol.
- York — strong study destination but current graph is institution-concentrated.
- St Andrews — internationally important university town but small and institution-concentrated; better as a later specialist-city comparison.
- Aberdeen — additional Scotland market, held behind Edinburgh and Glasgow for first batch.
- Swansea — additional Wales market, held behind Cardiff for first batch.

## Explicit exclusions from automatic publication

The remaining legacy city geographies are not rejected permanently. They are simply outside the first publication allowlist.

Do not publish all 37 legacy cities just because they exist in `core.geographies`.

Do not use current legacy programme count as a completeness score. For example, Leeds has only three legacy programmes in the canonical graph even though it is a major UK university market. Phase 3 must verify institution and programme coverage independently.

## Named-city scope rule for Phase 2

Phase 2 must normalize the twelve Tier A rows as named cities only. No metro-area inference is authorized by this selection.

Important scope notes:

- London requires an explicit Greater London / named-city contract because multiple institutions use London in their identity while campuses may sit across London boroughs.
- Manchester must not automatically absorb Salford. The current legacy graph contains University of Salford under Manchester and this must be checked rather than preserved blindly.
- Oxford and Cambridge remain exact named-city destinations and must not absorb neighbouring science parks or satellite campuses without evidence.
- Edinburgh and Glasgow remain separate city markets.
- Cardiff and Belfast are nation-representative city markets, not proxies for all of Wales or Northern Ireland.
- Nottingham must not absorb campuses outside the named-city boundary without explicit campus evidence.

## Known Phase 2/3 data issues discovered during selection

The current city graph is not yet authoritative:

- all 37 UK city geographies currently have `slug IS NULL` and `scope_kind IS NULL`;
- 49 of 50 campuses have a `geography_id`;
- University of Hertfordshire remains the one currently unlinked campus;
- institution identity still uses legacy slug-like `UK_PROVIDER_ID` values instead of verified UKPRNs;
- all 185 programme offerings remain `legacy_backfill` and `unverified` with no official source URL;
- Manchester currently contains University of Salford in its legacy city linkage and therefore needs an exact municipal/campus check in Phase 2/3.

These issues do not block Phase 1 selection. They are explicit work items for normalization and linkage verification.

## Phase 1 completion gate

Phase 1 is complete because:

- a bounded Tier A allowlist exists;
- four-nation coverage is explicit;
- selection criteria and external benchmark are documented;
- Tier B is separated from publication scope;
- provisional slugs are fixed for normalization;
- named-city scope and known linkage risks are documented before database mutation.

Next branch:

`agent/uk-cities-foundation-v1`

Phase 2 should normalize only the approved Tier A rows and preserve all existing geography UUIDs wherever possible.
