# AU Electrician — Projected Growth checkpoint

Verified: 2026-08-13

Scope: Australia × Electrician (General), Projected Growth component only.

## Result

Projected Growth is frozen at **4.71 / 10** under `career-opportunity-v4-foundation`.

## Official projection source

Canonical source: Jobs and Skills Australia, Employment Projections - May 2025 to May 2035.

https://www.jobsandskills.gov.au/data/employment-projections

The official workbook is `employment_projections_-_may_2025_to_may_2035.xlsx`.

The occupation projection is published at broader ANZSCO `3411 Electricians`, not exact `341111 Electrician (General)`, so the occupation input is an explicit broader/medium-quality proxy.

### Occupation input

- May 2025 employment: 194,917
- May 2030 employment: 207,935
- May 2035 employment: 218,278
- 10-year change: approximately +12.0%

Occupation projected CAGR:

`(218278 / 194917)^(1/10) - 1 = 1.1383874%/year`

### National benchmark

Use the same JSA projection horizon and employment definition:

- May 2025 all-employment: 14,701,000
- May 2035 all-employment: 16,655,500
- 10-year change: approximately +13.3%

National projected CAGR:

`(16655500 / 14701000)^(1/10) - 1 = 1.2560729%/year`

## Normalized value and score

Excess projected CAGR:

`1.1383874% - 1.2560729% = -0.1176855 percentage points/year`

Frozen CampCareer formula:

`clamp(5 + excess CAGR pp/year × 2.5, 0, 10)`

Result:

`5 + (-0.1176855 × 2.5) = 4.7057863`, rounded to **4.71 / 10**.

## Evidence semantics

- availability: `available`
- directness: `proxy`
- mapping quality: `medium`
- evidence status: `derived`
- normalized value: `-0.1176855`
- proxy reason: official projection is published for broader ANZSCO 3411 rather than exact Electrician (General) 341111.

The May 2025 projection baseline must remain paired with May 2035. The February 2026 current 3411 employment stock must not replace the projection baseline.

Verification note: the JSA XLSX is the production fact source. The occupation row was cross-checked against an independent transcription because the current web research toolchain identifies but does not render the XLSX binary. No secondary transcription should be stored as the production source.

Readiness remains false; this checkpoint freezes only Projected Growth.
