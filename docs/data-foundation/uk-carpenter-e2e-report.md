# UK Carpenter Career Data Foundation E2E Report

Verified: research in progress, 2026-08-13

Scope: United Kingdom × Carpenter under the frozen `career-opportunity-v4-foundation` 100-point methodology. Legacy `UK:carpenter` (`career-opportunity-uk-v1`, provisional 44/100) remains regression/reference only.

## Current state

| State | Result |
| --- | --- |
| `decision_ready` | `false` |
| `score_ready` | `false` |
| `publish_ready` | `false` |
| required components | `9` |
| authoritative foundation row | not seeded |

No incomplete component receives a synthetic zero.

## Component research status

| Component | Max | Current research result |
| --- | ---: | --- |
| Shortage Signal | 20 | candidate `12` |
| Vacancy Intensity | 15 | candidate `3` fallback |
| Industry Diversity | 5 | `0.00` research-fixed, `derived` |
| Employment Momentum | 10 | `0.00` research-fixed |
| Entry Accessibility | 15 | candidate `14` |
| Relative Salary | 10 | `3.71` research-fixed; direct ONS occupation row required before migration |
| Projected Growth | 10 | `2.01` research-fixed |
| Visa Accessibility | 10 | `7` research-fixed |
| Entry Burden / Licensing | 5 | `5` research-fixed for general employee path |

The six research-fixed components currently contribute `17.72 / 50`. This is not a final Opportunity Score.

## Occupation mapping

Primary mapping: SOC 2020 `5316 Carpenters and joiners`.

Historical 2020 occupation evidence uses SOC 2010 `5315 Carpenters and joiners`, the predecessor code corresponding to SOC 2020 `5316`. The classification break must remain explicit in lineage.

## Shortage Signal — candidate 12 / 20

MAC *Temporary Shortage List: Stage 2* reports limited/mixed historical shortage evidence for SOC 5316, strong future-demand evidence and recommends TSL access for 18 months. Candidate normalization remains `shortage × national = 12` rather than severe/critical.

## Vacancy Intensity — candidate 3 / 15

Skills England *Occupations in demand: 2025* does not classify SOC 5316 as currently high demand and does not provide the clean distinct 90-day numerator required by the primary CampCareer vacancy formula.

Candidate fallback remains low intensity `3`, persistence `0`, `official_partial`, evidence status `fallback`. Structural shortage evidence is not reused as vacancy evidence.

## Employment Momentum — research fixed 0.00 / 10

Frozen normalized metric:

`occupation employment CAGR - UK employee CAGR`

Official inputs for a five-year 2020→2025 window:

- Carpenters and joiners employees, 2020: `79,400` (APS-based official shortage review, SOC 2010 5315).
- Carpenters and joiners employees, 2025: `69,000` (MAC Stage 2, SOC 2020 5316).
- UK employees, 2020 annual four-quarter average: `27,841,000` (ONS LFS employee annual series).
- UK employees, 2025 annual four-quarter average: `29,590,000` (same ONS LFS series).

Derived:

- occupation CAGR: `-2.7688%/yr`;
- UK employee CAGR: `+1.2260%/yr`;
- excess: `-3.9948 percentage points/yr`;
- score: `clamp(5 + -3.9948 × 2.5, 0, 10) = 0.00`.

Evidence should be `derived` with a proxy/directness caution: occupation endpoints are APS-based while the national employee benchmark is LFS. Both are official employee measures, but not one identical statistical table. The 2020 pandemic-period start is retained transparently.

## Relative Salary — research fixed 3.71 / 10

The legacy Home Office `GBP 33,400 / GBP 17.13 per hour` value is an immigration salary threshold and is not used as a wage observation.

Comparable ASHE 2025 full-time gross annual inputs:

- SOC 5316 median: `GBP 34,014`;
- all full-time employees median: `GBP 39,039`;
- ratio: `34,014 / 39,039 = 0.8712826`;
- score: `clamp(5 + (0.8712826 - 1) × 10, 0, 10) = 3.71`.

The all-employee benchmark is directly confirmed in the ONS 2025 ASHE bulletin. The SOC 5316 value is consistently reported by extracts identifying ONS ASHE Table 14.7a. Before production migration, ingest the exact occupation row directly from ONS Table 14 so relational lineage does not depend on a secondary transcription.

This supersedes the earlier `4.54` candidate based on the Home Office going rate.

## Projected Growth — research fixed 2.01 / 10

Frozen normalized metric:

`SOC 5316 projected CAGR - UK all-occupations projected CAGR`

DfE / UK Skills Imperative 2035 / Working Futures matched inputs:

- SOC 5316, 2021: `189,873`;
- SOC 5316, 2035: `171,627`;
- UK all occupations, 2021: `35.140m`;
- UK all occupations, 2035: `37.568m`;
- horizon: `14 years`.

Derived:

- Carpenter projected CAGR: `-0.7191%/yr`;
- UK projected CAGR: `+0.4784%/yr`;
- excess: `-1.1974 percentage points/yr`;
- score: `clamp(5 + -1.1974 × 2.5, 0, 10) = 2.01`.

Evidence status should be `derived`. Mapping is SOC 5316, but confidence must reflect the Working Futures method where detailed 4-digit projections inherit the relevant broader occupational growth trajectory.

## Visa Accessibility — research fixed 7 / 10

Primary representative route: Skilled Worker.

Current Home Office evidence lists SOC 2020 `5316 Carpenters and joiners` on the Immigration Salary List for all jobs across the UK. The occupation is therefore directly applicable to the current sponsored-worker route.

Frozen rubric:

- occupation applicability: `3 / 3` for exact SOC 5316 coverage;
- employer dependency: `1 / 3` because an approved sponsor and Certificate of Sponsorship are required;
- eligibility burden: `1 / 2` because salary and general Skilled Worker eligibility requirements remain material;
- long-term pathway: `2 / 2` because Skilled Worker is settlement-capable after the qualifying residence period when settlement conditions are met;
- total: `7 / 10`.

This is an occupation-level structural accessibility score, not an individual immigration eligibility determination. Temporary Shortage List evidence remains policy context and is not double-counted into this component.

## Entry Burden / Licensing — research fixed 5 / 5

The frozen Entry Burden component evaluates the general employee path. Contractor or business rules and site-specific access policies remain separate decision warnings.

Skills England classifies Carpentry and Joinery as not a regulated occupation. HSE guidance also makes clear that third-party conformity assessment is not itself required by law and that industry certification cards should not be treated as the sole evidence of worker competence.

No UK-wide statutory personal Carpenter occupational licence or universal statutory skills-card requirement for the general employee path was validated in this audit.

Frozen rubric:

- geographic-scope burden: `0 / 2`;
- legal-requirement burden: `0 / 1.5`;
- acquisition-difficulty burden: `0 / 1.5`;
- score: `5 - 0 - 0 - 0 = 5 / 5`.

Site operators, employers, clients and particular projects may still require competence evidence, qualifications or a relevant skills card in practice. Those conditions must remain visible as practical entry points and blockers, but they must not be relabelled as a nationwide statutory Carpenter licence.

## Industry Diversity — research fixed 0.00 / 5

Primary input: Skills England / DfE `Occupations in demand: 2025`, SOC 2020 `5316 Carpenters and joiners`, using the official broad `SIC_name` industry distribution derived from the Annual Population Survey.

The 2025 official row set reports occupation employment of `180,400`. The 18 broad industry rows sum to `180,200`; the `200` difference is consistent with the source's rounded worker counts and leaves `99.89%` usable coverage.

Largest 2025 industry inputs:

- Construction: `140,000`, or `77.61%` of occupation employment;
- Manufacturing and production: `26,600`, or `14.75%`;
- Trades: `3,400`, or `1.88%`;
- Business administration and support services: `2,100`, or `1.16%`;
- Health and social care: `1,900`, or `1.05%`;
- all remaining broad industries combined: `6,200`, or about `3.44%`.

Frozen calculation uses each published broad-industry worker count divided by the reported occupation employment total:

`HHI = Σ(industry_workers / 180,400)^2 = 0.6247843`.

Construction is also the top-industry share at `77.6053%`. Renormalizing the rounded covered rows to their `180,200` sum gives HHI `0.6261719`, which remains in the same scoring band.

Methodology checks:

- comparable broad sectors: `true`;
- usable coverage: `99.89%`;
- HHI: `0.6248`;
- top-industry share: `77.61%`;
- evidence status: `derived`;
- score: `0 / 5` because HHI is at least `0.60` and the top-industry share is at least `75%`.

This zero means observed high industry concentration under a completed calculation. It is not an `insufficient_industry_coverage` fallback.

## Remaining gate

Of this research pass:

- Momentum: fixed `0.00/10`;
- Salary: fixed `3.71/10` with direct ONS occupation-row ingestion guard;
- Projected Growth: fixed `2.01/10`;
- Visa Accessibility: fixed `7/10`;
- Entry Burden: fixed `5/5` for the general employee path;
- Industry Diversity: fixed `0/5`, `derived` from `99.89%` covered official broad-industry rows.

There is no unresolved scoring research component left from this gate. The next implementation gate is to ingest the exact ONS salary occupation row, implement the full relational migration and raw-to-normalized regression tests, validate live Supabase lineage, and run final CI while keeping PR #239 Draft until all gates are green.
