# Japan city metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `METRICS_COMPLETE`

Production migration: `20260812002829_publish_jp_tier_a_city_metrics_v1`

## Five Core Metrics

Each of the seven Tier A destinations has exactly five verified metric families, for `35` rows total:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

## Methodology guards

### Population

Uses 2025 Population Census preliminary counts at 2025-10-01 and the same Phase 2 area code/boundary. Tokyo uses the 23-special-ward aggregate rather than Tokyo Metropolis.

### Living costs

Uses the JASSO / Study in Japan national international-student planning baseline of JPY 105,000 per month excluding study/research expenses. All seven rows are `city_specific=false` and `ranking_safe=false`; no cheapest-city ordering is allowed.

### Transport

Each city stores a source-native current public-transport product. Single rides and Tsukuba's weekend/holiday day pass are not converted into a synthetic monthly cost. Sendai stores the current JPY 160 initial bus fare plus the announced JPY 190 fare effective 2026-10-01.

### Student work

National Immigration Services Agency context: permission is required, with the blanket-permission reference up to 28 hours/week and up to 8 hours/day during long school holidays. It is not a city differentiator.

### Employment context

Sector lists come from official local economic-development material and are descriptive only. Every row carries guards against interpreting the data as a shortage ranking or job guarantee.

## Private read model

`public.city_metric_directory_jp_v1`

It uses `security_invoker=true`, with SELECT for `service_role` only and no SELECT for `anon` or `authenticated`.

## Result

`METRICS_COMPLETE`

Next: Phase 5 functional, non-indexed city profiles.
