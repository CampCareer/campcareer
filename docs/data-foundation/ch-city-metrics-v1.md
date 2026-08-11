# Switzerland Cities — Phase 4 decision metrics v1

Status: `PHASE_4_COMPLETE`
Checkpoint: `SIX_CITY_FIVE_METRIC_CONTRACT`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Metric contract

Every Tier A municipality has exactly five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

The total Phase 4 contract is exactly 30 verified rows across six municipalities.

## Population comparability

Population uses one common Federal Statistical Office STATPOP reference rather than mixing current local dashboards with different reference dates.

Reference date: `2022-12-31`

| Municipality | Population |
|---|---:|
| Zurich | 427,721 |
| Geneva | 203,840 |
| Basel | 173,552 |
| Lausanne | 141,418 |
| Lugano | 62,464 |
| Fribourg | 37,653 |

This is intentionally a comparable historical snapshot. Phase 4 does not describe these values as the latest municipal population.

## Student living-cost references

Living cost uses source-native university/student planning references. The values are not converted into a synthetic Swiss city cost index because the underlying definitions differ.

| City | Monthly reference | Source semantics |
|---|---:|---|
| Zurich | CHF 2,430 | ETH single-person monthly guide, not student-specific |
| Lausanne | CHF 2,107 | EPFL foreign-student budget excluding tuition |
| Basel | CHF 2,000–2,500 | University of Basel guest-research guidance excluding insurance |
| Lugano | CHF 1,300–1,900 | USI student monthly range |
| Fribourg | CHF 1,600–1,900 | University of Fribourg incoming-student planning range |
| Geneva | CHF 1,800–1,900 | University of Geneva exchange-student budget |

These are indicative planning references. They must not be treated as equivalent baskets or a ranking without a later normalization methodology.

The EPFL living-cost reference may be useful for the Lausanne study-destination context but does not change Phase 3 geography: EPFL programmes remain excluded from the Lausanne municipality programme linkage because the physical study-location gate is separate from budgeting context.

## Transport references

Transport keeps each source's native product definition:

- Zurich: ZVV young-adult 1–2-zone NetworkPass, CHF 64/month; age and zone rules apply
- Lausanne: EPFL student budget transport line, CHF 60/month
- Basel: TNW young-adult U-Abo, CHF 57/month for the referenced eligibility case
- Lugano: USI student transport budget, CHF 50–100/month; range preserved
- Fribourg: University of Fribourg TPF Greater Fribourg budget reference, CHF 60/month
- Geneva: UNIGE exchange reference, CHF 45/month with CHF 70 age-related reference from age 25

No midpoint is invented for a range and no unlike ticket products are presented as a harmonized fare ranking.

## Student work context

The common national context records the State Secretariat for Migration rule for third-country students subject to work authorization:

- maximum 15 hours per week outside holidays
- supplementary employment may begin no sooner than six months after studies begin
- university confirmation, employer application and permit conditions apply
- EU/EFTA/free-movement cases can differ

This metric has `city_specific=false` and must never be scored as a city differentiator.

## Economic context

`employment_focus_sectors` is official local/cantonal/regional economic-development context only. It is not an occupation-shortage list, demand score, salary forecast or employment guarantee.

The source scope is retained in each value because not every city publishes an equivalent city-level sector taxonomy. Canton or regional context is explicitly labeled when used.

## Deferred cities

`neuchatel, bern, st-gallen, lucerne` receive no Phase 4 metric rows from this rollout.

## Phase 4 conclusion

The six Switzerland Tier A municipalities have exactly five source-aware decision-context metrics each. The contract preserves differences in source definition rather than fabricating comparability.