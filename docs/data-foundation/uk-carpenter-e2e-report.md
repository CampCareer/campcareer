# UK Carpenter Career Data Foundation E2E Report

Verified: scoring research complete and relational migration authored, 2026-08-13.

Scope: United Kingdom × Carpenter under frozen `career-opportunity-v4-foundation`. Legacy `UK:carpenter` remains regression/reference only.

## Current state

| State | Result |
| --- | --- |
| scoring research | complete |
| relational migration | authored and rollback-validated |
| live foundation row | not yet seeded |
| required components | `9` |
| migration-candidate score | `47.16 / 100` |

## Component results

| Component | Max | Result |
| --- | ---: | ---: |
| Shortage Signal | 20 | `12.00` |
| Vacancy Intensity | 15 | `3.00` fallback |
| Industry Diversity | 5 | `0.00` derived |
| Employment Momentum | 10 | `0.00` derived |
| Entry Accessibility | 15 | `14.00` |
| Relative Salary | 10 | `3.71` derived |
| Projected Growth | 10 | `2.44` derived |
| Visa Accessibility | 10 | `7.00` |
| Entry Burden / Licensing | 5 | `5.00` |

## Key lineage updates

Primary mapping is SOC 2020 `5316 Carpenters and joiners`. Historical 2020 employment evidence uses SOC 2010 `5315`; the classification bridge remains explicit.

Employment Momentum uses occupation employees `79,400 → 69,000` and UK employees `27,841,000 → 29,584,000`. The resulting excess CAGR is `-3.9907 percentage points/year`, scoring `0/10`.

Relative Salary now directly ingests the exact ONS ASHE 2025 provisional Table 14.7a `Full-Time` row for SOC 5316. Row `361` reports median gross annual pay `GBP 34,014`; the all-full-time benchmark is `GBP 39,039`. Ratio `0.8712826` scores `3.71/10`.

Projected Growth uses the current revised DfE Skills Imperative 2035 data: SOC 5316 `203,247.3719 → 188,293.6923` jobs from 2021 to 2035, versus UK all occupations `35,139,637.999037 → 37,567,871.999864`. Excess projected CAGR is `-1.0228 percentage points/year`, scoring `2.44/10`.

Industry Diversity remains `0/5` from observed concentration: `99.89%` coverage, Construction share `77.61%`, HHI `0.6248`.

## Relational migration

`supabase/migrations/20260813184500_career_data_foundation_uk_carpenter.sql` contains the UK foundation profile, SOC mappings, source registry, raw observations, normalized metrics, raw-to-normalized lineage, nine score components, score snapshot, visa pathway, licensing evidence, blockers and entry points.

The full SQL was executed against the current database schema inside a transaction and rolled back successfully, so the validation created no production foundation row.

## Next gate

The ONS salary-row ingestion and relational-migration steps are complete. Keep PR #239 Draft while UK Carpenter regression tests, live lineage validation and final CI are completed.
