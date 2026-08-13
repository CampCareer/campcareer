# US Carpenter Career Data Foundation E2E Report

Verified: 2026-08-13

Scope: United States × Carpenter reference implementation. The final 100-point Opportunity Score methodology v1 is frozen in this profile before cross-country expansion.

## Outcome

| State | Result |
| --- | --- |
| `decision_ready` | `true` |
| `score_ready` | `true` |
| `publish_ready` | `true` |
| `opportunity_score` | `43.94 / 100` |
| score components | `9 / 9` |
| score coverage weight | `100 / 100` |
| formula | `career-opportunity-v4-foundation` |
| user-facing confidence | `Estimated` |

`score_ready=true` means every required component has been evaluated under the frozen CampCareer v1 methodology. It does not mean every component has a complete direct national statistical series.

The score remains `Estimated` because deterministic proxy/fallback rules remain in shortage, vacancy, industry diversity, visa accessibility and entry burden.

## Final score model

| Component | Max | US Carpenter | Evidence status |
| --- | ---: | ---: | --- |
| Shortage Signal | 20 | 0.00 | `no_evidence_found` |
| Vacancy Intensity | 15 | 4.00 | `fallback` |
| Industry Diversity | 5 | 0.00 | `insufficient_industry_coverage` |
| Employment Momentum | 10 | 2.71 | `derived` |
| Entry Accessibility | 15 | 14.00 | `proxy` |
| Relative Salary | 10 | 6.88 | `derived` |
| Projected Growth | 10 | 5.35 | `derived` |
| Visa Accessibility | 10 | 6.00 | `proxy` |
| Entry Burden / Licensing | 5 | 5.00 | `proxy` |
| Total | 100 | 43.94 | `Estimated` |

The final score is calculated from normalized component inputs. It is not manually entered.

## Final 30-point methodology freeze

### Employment Momentum — 10 points

Definition: recent actual occupation employment growth relative to actual same-country employment growth.

Primary normalized metric:

`occupation employment CAGR - same-country all-employment CAGR`

Source priority:

1. comparable 5-year actual employment series;
2. comparable 3-year actual series;
3. openings-intensity fallback only when actual employment history cannot be validated.

Score:

`clamp(5 + excess CAGR percentage-points/year × 2.5, 0, 10)`

Thus -2 percentage points/year maps to 0, national parity maps to 5, and +2 percentage points/year maps to 10.

For the United States, BLS CPS annual-average detailed occupation employment is used rather than an OEWS time series because BLS cautions against using OEWS estimates for time-series analysis.

US inputs:

- Carpenter employment, 2020: 1.114 million.
- Carpenter employment, 2025: 1.178 million.
- Total employment, 2020: 147.795 million.
- Total employment, 2025: 163.493 million.
- Carpenter CAGR: about 1.1235%/year.
- Total employment CAGR: about 2.0394%/year.
- Excess CAGR: about -0.9159 percentage points/year.
- Employment Momentum score: `2.71 / 10`.

### Relative Salary — 10 points

Definition: the occupation's wage position inside the same national labour market.

Normalized metric:

`occupation median wage / same-country all-occupations median wage`

Comparison inputs should use the same country, period, official source and wage definition. Hourly median is preferred, then weekly, then annual where the paired national benchmark is comparable.

Score:

`clamp(5 + (relative salary ratio - 1) × 10, 0, 10)`

PPP, exchange rates and cost of living are intentionally excluded from this component.

US inputs remain:

- Carpenter median hourly wage: $29.12.
- All-occupations median hourly wage: $24.51.
- Ratio: about 1.1881.
- Relative Salary score: `6.88 / 10`.

### Projected Growth — 10 points

Definition: official future occupation employment growth relative to the same-country all-occupations forecast.

Normalized metric:

`occupation projected CAGR - same-country all-occupations projected CAGR`

Occupation and benchmark must use the same official source, projection horizon and employment definition.

Score:

`clamp(5 + excess projected CAGR percentage-points/year × 2.5, 0, 10)`

US BLS 2024–2034 inputs:

- Carpenter employment: 959,000 → 1,002,100.
- All occupations: 169.9561 million → 175.1679 million.
- Carpenter projected CAGR: about 0.4406%/year.
- All-occupations projected CAGR: about 0.3025%/year.
- Excess CAGR: about +0.1381 percentage points/year.
- Projected Growth score: `5.35 / 10`.

Employment Momentum and Projected Growth deliberately use the same score scale, but measure different time directions: Momentum is past actual change; Projected Growth is future official forecast.

## Important zero semantics

A zero is not always the same factual claim.

Shortage is `0 + no_evidence_found`: official-source review did not validate a comparable official Carpenter shortage designation. It does not assert an authority explicitly classified Carpenter as not in shortage.

Industry Diversity is `0 + insufficient_industry_coverage`: available categories cannot support the agreed comparable HHI normalization without inventing allocations. It does not assert proven maximum concentration.

Raw unavailable observations remain null with an explicit reason. Conservative zero scoring occurs only after the methodology-defined evaluation has been completed.

## Shortage methodology v1

Shortage is kept separate from growth, annual openings and vacancy.

Normalized severity and base points:

- `not_shortage` = 0
- `pressure` = 5
- `shortage` = 12
- `severe` = 18
- `critical` = 20

Geographic multipliers:

- national = 1.00
- broad subnational = 0.75
- regional = 0.50
- local = 0.25

US Carpenter remains `0 / 20 + no_evidence_found` because no validated official Carpenter shortage designation suitable for the cross-country method was found.

## Vacancy methodology v1

Primary definition: distinct job postings over 90 days divided by occupation employment stock.

Intensity bases are 0/3/6/9/12 for no evidence, low, moderate, high and very high. Persistence adds 0–3 points, subject to the evidence-quality cap.

US Carpenter does not have a clean nationally comprehensive distinct 90-day numerator. CareerOneStop/NLx evidence therefore uses the agreed fallback:

- low intensity = 3;
- repeated-period persistence = +1;
- score = `4 / 15`.

Live job examples remain separate from the Vacancy Score statistical evidence.

## Industry Diversity methodology v1

Industry Diversity measures employment resilience. Country-specific industry categories must first be mapped to comparable broad sectors and then HHI is calculated from occupation employment shares.

Normal calculation requires roughly 80% usable coverage and comparable broad-sector categories. The BLS Carpenter major-share publication covers 84%, but mixes self-employment status and construction subindustries in a way that does not support a defensible common-sector HHI. The result remains `0 / 5 + insufficient_industry_coverage`.

## Entry Accessibility methodology v1

Maximum 15 points:

- education: 0–7;
- prior related experience: 0–3;
- training burden before earning/employment: 0–5.

US Carpenter:

- high school diploma or equivalent = 7;
- no related work experience = 3;
- paid employment-linked apprenticeship = 4;
- total = `14 / 15`.

Training duration alone is not treated as pre-entry burden when the normal pathway is paid, employment-linked training.

## Visa Accessibility methodology v1

Maximum 10 points across occupation applicability, employer dependency, visa-specific eligibility burden and long-term pathway.

US Carpenter uses H-2B as the representative primary route and PERM as secondary long-term pathway evidence. Component score remains `6 / 10`. This is a structural occupation-level accessibility score, not personal immigration eligibility.

## Subnational licensing and Entry Burden

Licensing evidence is stored by jurisdiction and separates employee requirements from contractor/business requirements.

Reference evidence includes California C-5 contractor licensing, New York City Home Improvement Contractor licensing and federal OSHA Outreach status.

Contractor-only rules are not deducted from the ordinary employee Entry Burden score. No nationwide general employee Carpenter occupational-license requirement was identified, so the employee Entry Burden remains `5 / 5`, with subnational checks retained as warnings/evidence.

## Relational lineage

Relational lineage is the provenance source of truth. Array references remain compatibility/derived fields.

The explicit chain is:

`official source -> raw observation -> occupation mapping -> normalized metric input -> normalized metric -> score component input -> score component -> score snapshot -> result/read model`

The final v4 growth migration adds role-specific lineage for:

- occupation start/end actual employment;
- country start/end actual employment;
- occupation projection;
- country projection benchmark.

A DB reverse-trace query confirms both final growth components resolve back to their BLS source records.

## Read model and landing behavior

Foundation remains authoritative whenever a decision-ready foundation row exists. Legacy US Carpenter cannot override it.

The landing/read model exposes the numeric score plus evidence confidence, so the expected compact state is:

`43.94/100 · Estimated`

The compatibility profile still does not fabricate a clean three-month vacancy count or an unrelated five-year growth display value.

## Legacy regression

Legacy data remains regression/reference only.

- US Carpenter legacy output is suppressed when the foundation profile exists.
- Australia Registered Nurse remains on its existing legacy/reference path; this US migration does not seed an AU Registered Nurse foundation row.

## Database validation

Live Supabase validation after migration `finalize_career_opportunity_growth_methodology_v1`:

- latest snapshot: `US:carpenter:2026-08-13:v4`;
- formula: `career-opportunity-v4-foundation`;
- `decision_ready=true`;
- `score_ready=true`;
- `publish_ready=true`;
- `opportunity_score=43.94`;
- scored components = 9/9;
- coverage weight = 100/100;
- Employment Momentum = 2.71;
- Relative Salary = 6.88;
- Projected Growth = 5.35.

Earlier v2 and v3 snapshots are preserved for audit/version history.

## Security and database hygiene

The scoring function retains a fixed `search_path = pg_catalog` and execution remains restricted to the service role. The final v4 migration creates no new exposed tables.

Supabase security/performance advisors show no new issue attributable to this v4 change. Existing project-wide advisor notices remain outside this scoped implementation.

## Test expectations

Repository tests freeze:

- the 100-point maxima contract;
- formula version v4;
- shortage/vacancy/diversity deterministic rules;
- visa, Entry Burden and Entry Accessibility rubrics;
- excess-CAGR scale: -2 → 0, 0 → 5, +2 → 10;
- US Momentum = 2.71;
- US Relative Salary = 6.88;
- US Projected Growth = 5.35;
- US total = 43.94;
- estimated confidence semantics;
- relational lineage;
- foundation precedence over legacy data.

## Status for cross-country expansion

US Carpenter now serves as the completed Opportunity Score methodology v1 reference implementation. The next authorized profile is Australia × Carpenter, using the same 9 components and scoring functions while sourcing Australian facts independently from official Australian sources.
