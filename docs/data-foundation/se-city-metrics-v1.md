# Sweden city metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `METRICS_COMPLETE`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Result

All six Tier A municipalities have exactly five verified decision metrics: 30 rows total.

Required families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

## Population

Municipality population uses the SCB municipality boundary and year-end 2025 reference:

- Stockholm — 999,239
- Gothenburg — 613,278
- Uppsala — 249,726
- Lund — 132,333
- Linköping — 168,714
- Umeå — 135,273

The population geography therefore matches the Phase 2 public boundary rather than a metro or urban-area estimate.

## Student living-cost baseline

Study in Sweden currently publishes a monthly student budget of about SEK 10,656. The same national baseline is retained for all six cities with `city_specific=false`.

This deliberately avoids manufacturing city cost rankings from incompatible housing or lifestyle baskets.

## Transport

Transport references keep the operator's source-native product and period:

| City | Reference |
| --- | --- |
| Stockholm | SEK 43 adult single / 75 minutes |
| Gothenburg | SEK 38 Zone A adult single / 90 minutes |
| Uppsala | SEK 40 adult single / 75 minutes |
| Lund | SEK 327.50 current temporary 30-day small-zone/major-city ticket |
| Linköping | SEK 35 adult city-zone single / 60 minutes |
| Umeå | SEK 31 pre-purchased adult single / 1 hour |

These are comparison context references, not a claim that each city uses an identical fare product or student-discount eligibility rule.

## Student work rule

For the relevant bachelor/master residence-permit context granted on or after 11 June 2026, the Swedish Migration Agency states a maximum of 15 hours per week during semesters. June, July and August plus listed study/research exceptions may exceed that limit. Earlier permits can be subject to transition rules.

This is stored as a national immigration rule, never a city differentiator.

## Employment sectors

Each city uses current official municipality/business-development context. Sector lists are marked `not_shortage_ranking=true`; they are not employment guarantees or occupation-demand scores.

## Production migration

`20260810220332_publish_se_tier_a_city_metrics_v1`

Production verification: 6 cities × 5 verified metric families = 30 rows.