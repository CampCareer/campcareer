# Spain Cities — Phase 4 five core metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `METRICS_COMPLETE`

Country: `ES` — Spain

Audit date: 2026-08-11

Production migration: `20260811141418_publish_es_tier_a_city_metrics_v1`

## Completion result

All seven Tier A municipalities have exactly the same five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production result: `35/35` verified rows, exactly five per city.

## Population contract

Population uses the Phase 2 INE municipality boundary and the official municipal population reference at 1 January 2025.

| City | Population |
| --- | ---: |
| Madrid | 3,506,730 |
| Barcelona | 1,731,649 |
| Valencia | 840,792 |
| Sevilla | 689,423 |
| Málaga | 599,063 |
| Bilbao | 346,933 |
| Granada | 233,975 |

No metropolitan-area population is substituted for the named public municipality.

## Student living-cost references

Spain does not provide one official, directly comparable city living-cost series across all seven destinations. Phase 4 therefore preserves each official university source's methodology rather than manufacturing a ranking.

Stored references:

| City | Reference | Scope |
| --- | ---: | --- |
| Madrid | EUR 800–1,600 / month | broad full-student-budget range from UAM guidance |
| Barcelona | EUR 1,300–1,500 / month | UPC minimum full-budget planning range |
| Valencia | EUR 695–795 / month | calculated core subtotal from UV rent/utilities/internet/grocery components; not a full budget |
| Sevilla | EUR 306–707.50 / month | university-residence accommodation only |
| Granada | EUR 650–850 / month | UGR full student living-cost estimate |
| Málaga | EUR 879–929 / month | UMA-linked residence accommodation only |
| Bilbao | EUR 650–800 / month | EHU incoming-student full budget reference |

Every living-cost record has `ranking_safe=false`. The profile must disclose `reference_kind`, `full_budget` and the source note. Phase 4 does not support a cheapest-city ranking from these heterogeneous references.

## Student transport references

Transport keeps each operator's published product period and eligibility rules rather than forcing all products into a synthetic monthly fare.

| City | Stored reference | Product semantics |
| --- | ---: | --- |
| Madrid | EUR 10 / 30 days | CRTM Abono Joven, eligible young riders |
| Barcelona | EUR 45.50 / 90 days | T-jove under-30 integrated pass |
| Valencia | EUR 12.50 / 30 days | EMT Jove under-30 pass |
| Sevilla | EUR 8.80 / calendar month | TUSSAM Joven personal pass |
| Granada | EUR 0.65 / trip | university/youth urban-bus fare reference |
| Málaga | EUR 0.62 / first stage | current metropolitan transport-card base fare; youth recharge bonus remains a separate rule |
| Bilbao | EUR 30 / 30 days | CTB Mensual Gazte Bilbao |

## Student work context

The current national student-work rule is stored identically for all seven cities:

- up to `30 hours/week` where the work remains compatible with the study authorisation;
- national immigration context, not a city labour-market differentiator;
- current regulation and exceptions remain source-controlled by the national authority.

## Employment focus sectors

The fifth metric records official local economic-development priorities and specialisations, not shortage scores or job guarantees.

Examples include Madrid digital/health/logistics clusters, Barcelona's digital/creative/health/green/blue sectors, Valencia's agri-food/mobility/utilities/pharma focus, Sevilla aerospace/industry/logistics, Granada AI/digital/circular-economy priorities, Málaga technology/tourism/health/culture activity, and Bilbao advanced services/digital/creative/tourism specialisation.

Every record is marked `not_shortage_ranking=true` and `not_job_guarantee=true`.

## Read model and access contract

Phase 4 creates:

- `public.city_metric_directory_es_v1`

The view uses `security_invoker=true`.

Access remains:

- `service_role`: SELECT
- `public`: no SELECT
- `anon`: no SELECT
- `authenticated`: no SELECT

## Production verification

- verified core metric rows: `35`
- Tier A cities with all five families: `7/7`
- cities missing a metric family: `0`
- living-cost rows incorrectly marked ranking-safe: `0`

## Phase 4 conclusion

Spain Cities has reached `METRICS_COMPLETE`.

Phase 5 may consume these verified rows only with their source-native methodology and national-versus-city distinctions preserved.
