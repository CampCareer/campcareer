# UK Carpenter Career Data Foundation E2E Report

Verified: research in progress, 2026-08-13

Scope: United Kingdom × Carpenter. This profile must reuse the frozen 100-point Opportunity Score methodology v1 (`career-opportunity-v4-foundation`) without reusing US or AU numeric inputs.

## Current status

| State | Result |
| --- | --- |
| `decision_ready` | `false` |
| `score_ready` | `false` |
| `publish_ready` | `false` |
| formula | `career-opportunity-v4-foundation` |
| required components | `9` |
| authoritative foundation row | not seeded yet |
| legacy reference | `UK:carpenter`, `career-opportunity-uk-v1`, 44/100 provisional |

The legacy UK score remains regression/reference only. It must not be transformed into the new foundation score.

## Frozen component contract

| Component | Max | Research state |
| --- | ---: | --- |
| Shortage Signal | 20 | candidate evidence fixed |
| Vacancy Intensity | 15 | candidate fallback fixed |
| Industry Diversity | 5 | official distribution file identified; exact HHI pending |
| Employment Momentum | 10 | official APS/Nomis source identified; comparable 3y/5y inputs pending |
| Entry Accessibility | 15 | candidate evidence fixed |
| Relative Salary | 10 | candidate paired official evidence fixed, definition check retained |
| Projected Growth | 10 | official Working Futures source identified; matched occupation/national levels pending |
| Visa Accessibility | 10 | current route evidence fixed; rubric mapping under final audit |
| Entry Burden / Licensing | 5 | regulation/site-card evidence identified; rubric mapping under final audit |

No incomplete component is assigned a synthetic zero. `0` is only valid when the methodology explicitly evaluates a completed no-evidence/insufficient-coverage case.

## Occupation mapping

Primary UK mapping: SOC 2020 `5316 Carpenters and joiners`.

Skills England maps the current Site Carpenter occupation to SOC 2020 5316 and treats it as Level 2 and not a regulated occupation. The foundation mapping will remain exact at the SOC unit-group scope while clearly noting that the canonical CampCareer label `Carpenter` includes the official UK grouping `Carpenters and joiners`.

Planned mapping key: `UK:carpenter:SOC:5316`.

## Shortage Signal — candidate 12 / 20

Primary evidence: Migration Advisory Committee, *Temporary Shortage List: Stage 2 report*, published 23 July 2026.

For SOC 5316 the MAC reports limited/mixed historical shortage evidence, strong future-demand evidence, and recommends TSL access for 18 months. This supports the frozen `shortage` severity rather than `severe` or `critical`.

Candidate normalization:

- severity: `shortage`
- scope: `national`
- points: `12`
- evidence status: `direct_verified`

The Immigration Salary List / visa eligibility is not used as the shortage score itself.

## Vacancy Intensity — candidate 3 / 15

Primary evidence: Skills England *Occupations in demand: 2025* and its online-job-advert methodology.

SOC 5316 is not classified as currently high demand. The source uses indicator snapshots and online adverts but does not provide the clean distinct 90-day posting numerator required by the primary CampCareer vacancy formula.

Candidate fallback:

- intensity: `low`
- persistence bonus: `0`
- source quality: `official_partial`
- clean distinct 90-day numerator: `false`
- points: `3`
- evidence status: `fallback`

Shortage and Vacancy deliberately remain separate. A structural/future shortage recommendation does not imply high current vacancy intensity.

## Industry Diversity — pending

Skills England publishes an occupation-to-industry mapping derived from the Annual Population Survey. The exact SOC 5316 industry shares must be extracted and mapped into the common broad-sector taxonomy before HHI is calculated.

Until those shares are validated, this component remains pending rather than claiming concentration or diversity.

If the official file cannot support at least about 80% comparable coverage, the final methodology-defined outcome will be `0 + insufficient_industry_coverage`.

## Employment Momentum — pending

Required normalized metric:

`SOC 5316 employment CAGR - UK all-employment CAGR`

Preferred source is ONS Annual Population Survey through Nomis using a comparable 5-year window; a comparable 3-year window is acceptable if the SOC 2020 break prevents a valid 5-year series.

The legacy 69,000 employee figure is not sufficient for Momentum because a matched start/end occupation series and national benchmark are required.

## Entry Accessibility — candidate 14 / 15

Official entry route: Skills England Level 2 Carpentry and Joinery apprenticeship.

The apprenticeship is employment-linked and paid, so its total duration is not treated as years of unpaid pre-entry education.

Candidate rubric:

- education: `7 / 7`
- prior related experience: `3 / 3`
- paid employment-linked training: `4 / 5`
- total: `14 / 15`
- evidence status: `proxy`

## Relative Salary — candidate about 4.54 / 10

Occupation input: current Home Office ASHE-based SOC 5316 going rate, `GBP 17.13/hour` (`GBP 33,400/year`).

Candidate national comparator: ONS ASHE 2025 median hourly pay for all employee jobs, `GBP 17.96/hour`.

Candidate ratio:

`17.13 / 17.96 = 0.9538`

Frozen score:

`clamp(5 + (0.9538 - 1) × 10, 0, 10) ≈ 4.54`

Before final publication, the occupation and national figures must be confirmed as sufficiently comparable ASHE definitions. A mismatched full-time-only comparator must not be substituted silently.

## Projected Growth — pending

Required normalized metric:

`SOC 5316 projected CAGR - UK all-occupations projected CAGR`

Official Working Futures / DfE labour-market projections have been identified, but the exact occupation start/end levels and the matched national benchmark still need to be extracted from the same projection release.

Skills England's 2026 construction-sector forecast is useful context but cannot replace the frozen national-relative growth formula because it is not an economy-wide matched benchmark.

## Visa Accessibility — candidate under final rubric audit

SOC 5316 currently has Skilled Worker access through the Immigration Salary List. The route is employer-sponsored and can lead to settlement after the qualifying period, but eligibility and employer dependence remain material.

The legacy UK `10/10` visa value is not reused. Candidate scoring will be derived only from the frozen four-part rubric:

- occupation applicability: 0–3
- employer dependency: 0–3
- eligibility burden: 0–2
- long-term pathway: 0–2

Current working candidate: `7 / 10`, subject to final consistency check against the US/AU rubric semantics.

## Entry Burden / Licensing — pending final rubric audit

Skills England does not classify Site Carpenter as a regulated occupation. A CSCS card is not itself a statutory occupational licence, although site access policies commonly make proof of competence/safety material in practice.

The final score must distinguish:

- statutory occupational licensing: none identified;
- employer/site access requirements: practical rather than universal legal licensing;
- qualification/safety evidence: recorded as blockers/entry points without falsely calling them a nationwide statutory Carpenter licence.

## Source plan

Primary source families identified for the final migration:

- ONS / Nomis: SOC employment history and national benchmarks;
- ONS ASHE: wage comparison;
- Skills England: occupation mapping, apprenticeship route, current demand, industry mapping;
- Migration Advisory Committee: shortage evidence;
- Home Office / GOV.UK: Skilled Worker and Immigration Salary List evidence;
- DfE / Working Futures: occupation and national projections;
- CSCS / relevant official construction competence sources: practical site-entry evidence.

## Next implementation gate

Do not seed a decision-ready foundation profile until all three unresolved statistical components are defensible:

1. Industry Diversity HHI or methodology-defined insufficient-coverage result;
2. Employment Momentum matched actual series;
3. Projected Growth matched occupation/national projection series.

After those are fixed, implement the full relational migration, raw-to-normalized regression test, E2E DB validation, CI, and Draft PR.
