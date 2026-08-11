# France city metrics v1

Status: `PHASE_4_COMPLETE`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-10

Checkpoint: `METRICS_COMPLETE`

## Five Core Metrics

Exactly 35 verified rows are present: 5 per Tier A destination.

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_year`
5. `employment_focus_sectors`

## Methodology

Population and employment-sector evidence use INSEE RP2023 with geography at 2026-01-01 and preserve each Phase 2 public geography contract.

Living-cost references remain source-native and heterogeneous. Direct university totals are used where available; otherwise a clearly labelled Campus France planning benchmark or transparent component-derived range is retained. These values are not converted into a synthetic cheapest-city ranking.

Transport products retain their published periods and eligibility conditions. Paris and Paris-Saclay use the Île-de-France student annual product; Bordeaux, Strasbourg, Aix-Marseille and Nice retain their local monthly products; Grenoble stores the published 18–25 student 30-day fare effective from 2026-09-01. No hidden monthly normalization is performed.

France-Visas states the national foreign-student work allowance as 964 hours per year, corresponding to 60% of normal annual working time, with a different rule for Algerian nationals. CampCareer stores the annual rule directly and does not manufacture a weekly city comparison.

A separate current-policy note: from 1 August 2026 the student-visa financial-resources threshold increased to €877.50/month. Older university pages that still mention €615 are not treated as current living-cost metrics.

Employment sectors use the same five INSEE RP2023 activity groups and shares for each destination. They are context only, not shortage rankings, job guarantees or immigration signals.

## Production verification

- Tier A destinations with exactly five core metrics: 7/7
- total verified core metric rows: 35
- city programme rows: 0
