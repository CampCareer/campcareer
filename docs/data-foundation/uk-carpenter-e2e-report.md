# UK Carpenter Career Data Foundation E2E Report

Verified: scoring research, relational migration, live lineage validation and CI complete, 2026-08-13.

Scope: United Kingdom × Carpenter under frozen `career-opportunity-v4-foundation`.

## Current state

| State | Result |
| --- | --- |
| scoring research | complete |
| relational migration | live in production |
| live foundation row | seeded and validated |
| required components | `9 / 9` |
| score coverage weight | `100` |
| Opportunity Score | `47.15 / 100` |
| score ready | `true` |
| decision ready | `true` |
| publish ready | `true` |
| GitHub Actions CI | run `1589` success |

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

## Key lineage

Primary mapping is SOC 2020 `5316 Carpenters and joiners`. Historical 2020 employment evidence uses SOC 2010 `5315`; the classification bridge remains explicit.

Employment Momentum uses occupation employees `79,400 → 69,000` and UK employees `27,841,000 → 29,584,000`. The resulting excess CAGR is `-3.9907 percentage points/year`, scoring `0/10`.

Relative Salary directly ingests the exact ONS ASHE 2025 provisional Table 14.7a `Full-Time` row for SOC 5316. Row `361` reports median gross annual pay `GBP 34,014`; the all-full-time benchmark is `GBP 39,039`. Ratio `0.8712826` scores `3.71/10`.

Projected Growth uses the current revised DfE Skills Imperative 2035 data: SOC 5316 `203,247.3719 → 188,293.6923` jobs from 2021 to 2035, versus UK all occupations `35,139,637.999037 → 37,567,871.999864`. Excess projected CAGR is `-1.0228 percentage points/year`, scoring `2.44/10`.

Industry Diversity is `0/5` from observed concentration: `99.89%` coverage, Construction share `77.61%`, HHI `0.6248`.

## Live relational validation

Production migration `career_data_foundation_uk_carpenter` was recorded as Supabase migration version `20260813195452`.

Validated live counts for `UK:carpenter`:

- raw observations: `18`
- normalized metrics: `9`
- raw-to-normalized relational inputs: `18`
- score components: `9`
- component-to-normalized relational inputs: `9`
- component-to-raw relational inputs: `18`
- primary visa pathways: `1`
- licensing evidence rows: `2`
- active blockers: `3`
- entry points: `3`

The calculated production read model returns `required_components_present=9`, `scored_components=9`, `score_coverage_weight=100`, `score_ready=true`, `decision_ready=true`, `publish_ready=true`, and `opportunity_score=47.15`.

Relational component-to-metric and component-to-raw links were checked against their compatibility reference arrays and match for all nine components.

## Release validation

Regression coverage is in `tests/career-data-foundation-uk-carpenter.test.ts`.

GitHub Actions CI run `1589` passed production dependency audit, typecheck, lint, unit tests, production build and gitleaks. The UK migration produced no new UK-specific Supabase security-advisor finding; existing project-wide RLS/no-policy information notices and the existing Auth leaked-password-protection warning remain outside this scope.

Keep PR #239 Draft until the remaining external release status is reviewed.
