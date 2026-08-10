# Singapore study destination scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/sg-destination-scope-v1`

Parent: `agent/sg-destination-readiness-v1@408b8807c8382acb1878c08b865b41eb096a9991`

Audit/source review date: 2026-08-10

## Purpose

Phase 1 defines the publication scope, authoritative source map and evidence contract for Singapore as a country-level city-state study destination.

This phase does not mutate production data, change public routes, alter indexing or introduce a city shortlist.

## Canonical destination scope

Singapore is one public study destination with canonical scope:

- country code: `SG`
- destination name: Singapore
- public destination level: country / city-state
- existing public hub: `/sg`

The destination hierarchy for study data is:

`SG country -> institution -> campus/teaching location -> programme offering`

The existing `core.geographies` row named Singapore may remain as a legacy location record for campus compatibility. It is not the public scope anchor for this rollout.

Planning areas, regions and labels such as Central, East, North, North-East, West and CBD may be used for housing, commute and map context, but they are not canonical study-destination cities in v1.

## In-scope v1 evidence domains

1. national population and demographic context
2. recognised higher-education institution identity
3. explicit campus/teaching locations and addresses
4. Student's Pass context and fees
5. foreign-student work rights
6. student living-cost evidence
7. source-native public-transport fare context
8. tuition reference range with institution/student-type caveats
9. official economic-sector/career context
10. explicit canonical programme and campus-level offering evidence when available

## Out of scope

- a Singapore city shortlist
- city ranking or city comparison inside Singapore
- promoting planning areas or neighbourhoods to canonical city entities
- inferring programme delivery from institution/campus presence
- fabricating a synthetic monthly transport figure when the official source publishes distance fares or a specific pass product
- treating resident wage statistics as foreign graduate salary offers
- immediate SEO/indexing changes
- production database migration in Phase 1

## Authoritative source map

### Population

Primary source: Singapore Department of Statistics / SingStat.

Canonical source family:
`https://www.singstat.gov.sg/find-data/search-by-theme/population/population-and-population-structure/latest-data`

Current official snapshot reviewed in Phase 1:

- total population: 6,111.2 thousand
- reference period: 2025 mid-year estimate
- Singapore residents: 4,204.5 thousand
- population density: 8,300 per sq km

Population claims must retain the exact population definition and reference period.

### Higher-education institution identity

Primary government sources:

- Ministry of Education post-secondary institution overview
- Immigration & Checkpoints Authority Institutes of Higher Learning list

Canonical sources:

`https://www.moe.gov.sg/post-secondary/overview`

`https://www.ica.gov.sg/reside/STP/apply/ihl`

ICA currently identifies the following six local universities:

1. National University of Singapore
2. Nanyang Technological University
3. Singapore Management University
4. Singapore Institute of Technology
5. Singapore University of Social Sciences
6. Singapore University of Technology and Design

This matches the current six active canonical SG institutions in production.

Official institution websites remain required for campus addresses, programme identity, programme delivery and institution-specific cost/fee claims.

### Student's Pass

Primary source: Immigration & Checkpoints Authority.

Canonical source:
`https://www.ica.gov.sg/reside/STP/apply/ihl`

Current Phase 1 source snapshot:

- a foreigner accepted as a full-time matriculated or registered student at an eligible IHL generally requires a Student's Pass, subject to ICA exceptions
- application processing fee: S$45
- pass rules must remain separate from work-rights rules

### Student work rights

Primary source: Ministry of Manpower.

Canonical source:
`https://www.mom.gov.sg/passes-and-permits/work-pass-exemption-for-foreign-students`

Current Phase 1 source snapshot:

- eligibility is institution- and Student's-Pass-dependent
- during school term, qualifying work without a work pass is capped at 16 hours per week unless it is a qualifying industrial attachment/internship contributing towards graduation requirements
- vacation work has a separate eligibility contract
- exchange students are not covered by the standard work exemption

The UI and metric model must never reduce this to an unconditional "16 hours for all international students" statement.

### Student living costs

Primary source family: official Singapore university student-budget guidance.

Initial source anchor:
`https://www.nus.edu.sg/oam/financial-aid/living-costs`

The NUS source publishes annual student expense components and accommodation separately. Any monthly range derived from an annual source must preserve derivation metadata and must not imply a universal Singapore student budget.

The current production evidence already includes a reviewed `student_living_cost_monthly_range` row. Future refreshes must preserve institution, scenario, accommodation assumptions and source period.

### Public transport

Primary source: Public Transport Council.

Canonical source:
`https://www.ptc.gov.sg/fares/public-transport-fares-and-passes/`

Current Phase 1 source snapshot:

- basic bus and rail fares are distance-based
- adult card fare begins at S$1.28 for up to 3.2 km
- adult monthly travel pass: S$122

The destination model must preserve the source-native fare product. Student concession eligibility must not be assumed merely because the user is a student.

### Tuition

Primary sources: official university fee pages plus MOE Tuition Grant context where applicable.

Current production SG country evidence contains reviewed low/high tuition reference rows based on AY2026 subsidised international undergraduate examples.

The tuition range is contextual rather than a universal national fee. Each value must retain:

- institution
- programme or programme class
- academic year
- international-student category
- Tuition Grant assumption
- any attached service/work obligation

### Economic and career context

Primary source: Singapore Economic Development Board, with Ministry of Trade and Industry or MOM used where the metric is labour-market-specific.

Initial EDB source family:
`https://www.edb.gov.sg/en/our-industries/headquarters.html`

Current official sector context includes areas such as aerospace, biotechnology/pharmaceuticals, energy and chemicals, logistics/supply chain, medical technology, professional services, semiconductors and technology hardware/equipment.

These are economic-context signals, not shortage rankings or employment guarantees.

### Programme delivery

Primary source: official institution programme pages and explicit delivery/campus evidence.

Required invariant:

`institution exists != programme is delivered`

`campus exists != programme is delivered at that campus`

A programme can be published only when the canonical programme and explicit offering location are source-backed.

At the Phase 1 snapshot production contains zero canonical SG programmes and zero SG programme offerings, so programme coverage remains pending.

## Existing country evidence snapshot

`public.report_metric_evidence_country` currently contains eight reviewed SG rows:

- `average_annual_salary`
- `full_time_annual_earnings_range`
- `national_minimum_hourly_wage`
- `student_living_cost_monthly_range`
- `student_work_hours_limit`
- `tuition_annual_high`
- `tuition_annual_low`
- `visa_application_fee`

These existing rows remain country-scoped. Phase 1 does not duplicate them into a Singapore city metric table.

## Evidence contract

Every study-destination evidence row introduced or refreshed after Phase 1 must preserve, where applicable:

- `scope_type` / destination scope
- `scope_id = SG`
- metric key
- raw/source-native value
- unit and currency
- source name
- source URL
- source type
- source checked/retrieved timestamp
- source data/reference period
- source geography/scope
- methodology or scenario
- observed vs calculated evidence kind
- calculation lineage when derived
- confidence
- review/verification status

Derived values must never overwrite the source-native evidence or hide the transformation.

## Initial collection backlog for the next data phase

The current evidence set is useful but not yet a complete study-destination profile. The next collection/foundation phase should prioritise:

1. canonical national population evidence from SingStat
2. source-native public-transport reference from PTC
3. official economic-sector context from EDB/MTI
4. explicit institution/campus verification refresh across all six local universities
5. programme catalogue acquisition with explicit offering-to-campus evidence
6. any missing study-specific metrics required by the future SG destination profile, without manufacturing city-level duplicates

## Route and publication contract

The existing `/sg` hub is the canonical public Singapore country entry point for this rollout.

Phase 1 does not add `/cities/sg/...` routes and does not create a Singapore City Compare mode.

Any future study-specific UI should attach to or reuse the SG country destination model unless a genuinely separate use case requires another route.

## Phase 1 result

Singapore Phase 1 is complete.

Approved model: `COUNTRY_LEVEL_CITY_STATE_DESTINATION`

Approved canonical scope: `SG`

City shortlist: `NOT_APPLICABLE`

Programme publication: `PENDING_EXPLICIT_PROGRAMME_EVIDENCE`

Production mutation in Phase 1: `NONE`

The rollout can proceed to the next foundation/data-collection phase using country-level evidence and explicit institution/campus/programme lineage.
