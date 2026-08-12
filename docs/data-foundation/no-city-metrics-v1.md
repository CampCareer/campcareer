# Norway Cities — Phase 4 city metrics v1

Status: `PHASE_4_COMPLETE`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Metric contract

Each of the five Tier A municipalities receives exactly five verified decision-support metrics:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

The migration asserts 25 verified metric rows in total and exactly five for every Tier A city.

## Population

Population uses the exact Statistics Norway municipality geography normalized in Phase 2 and the 2026-01-01 population reference.

| City | Population |
|---|---:|
| Oslo | 728,714 |
| Trondheim | 218,460 |
| Stavanger | 151,669 |
| Tromsø | 79,943 |
| Ås | 22,725 |

Source contract: Statistics Norway Statbank table 07459.

## Student living-cost reference

The 2026–2027 national student living-cost/funds reference is NOK 15,488 per month / NOK 170,368 per academic year.

This value is deliberately stored on each city with:

`city_specific = false`

It must not be rendered as a measured city cost ranking.

Source: Study in Norway, cross-consistent with UDI's current study-permit funds requirement.

## Student transport reference

Transport remains source-native rather than forcing unlike local fare systems into a synthetic common score.

| City | Reference | Amount |
|---|---|---:|
| Oslo | Ruter student, Zone 1, 30 days | NOK 393 |
| Trondheim | AtB student, 1 zone, 30 days | NOK 425 |
| Stavanger | Kolumbus student, 1 zone, 30 days | NOK 396 |
| Ås | Ruter student, 1 Akershus zone, 30 days | NOK 551 |
| Tromsø | Svipper young adult 18–29, Tromsø municipality, 30 days | NOK 265 |

Tromsø is explicitly marked `student_specific=false` because the cited local product is age-based rather than a dedicated student category.

## Student work context

Norwegian study permits normally include permission to work up to 20 hours per week alongside studies and full-time during holidays, subject to UDI permit conditions.

The metric carries:

`national_rule = true`

It is context for international students and must not be used as a city differentiator.

## Employment focus sectors

This field records municipality/business-development context from official local sources. It is intentionally qualitative.

Every row carries:

- `indicative = true`
- `not_shortage_ranking = true`

It must not be converted into a job guarantee, shortage score or occupation-level demand claim.

## Exclusion contract

The Phase 4 migration is generated only from Tier A rows and explicitly checks that the five deferred cities do not receive Norway Phase 4 metric IDs.

## Phase 4 conclusion

The five Norway City profiles now have a bounded, evidence-backed five-metric decision layer suitable for Phase 5 rendering while preserving national-vs-city and observed-vs-context distinctions.
