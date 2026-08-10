# Denmark city metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `METRICS_COMPLETE`

Branch: `agent/dk-cities-v1`

Production migration history: `20260810202207_publish_dk_tier_a_city_metrics_v1`

Audit date: 2026-08-10

## Purpose

Phase 4 publishes the same five verified decision metrics for Copenhagen, Frederiksberg, Odense, Aarhus and Aalborg while keeping source methodology visible.

The required keys are:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production contains exactly 25 verified rows: five metrics for each of the five Tier A municipalities.

## Production application note

The full Phase 4 evidence payload was too large for the database-tool safety envelope as one operation. The five metric families were therefore applied as smaller idempotent upserts, verified in production, and then the migration-history version `20260810202207` was recorded. The repository migration file contains the replayable full evidence SQL for fresh environments.

This was a tooling constraint, not a PostgreSQL or data-contract failure.

## Population

Population uses Statistics Denmark municipality scope consistently with Phase 2 and the FOLK1A first-day-of-quarter population series.

Current stored reference: 2026 Q3 / 2026-07-01.

| City | Municipality code | Population |
| --- | --- | ---: |
| Copenhagen | `101` | 670,389 |
| Frederiksberg | `147` | 105,947 |
| Odense | `461` | 213,140 |
| Aarhus | `751` | 378,270 |
| Aalborg | `851` | 226,404 |

Stored semantics include:

- `geography_kind = dst_municipality`
- municipality code
- `estimate_kind = population_first_day_of_quarter`
- `quarter = 2026Q3`
- high confidence / observed evidence

## Student living cost

All five cities currently use the same official Study in Denmark rough monthly student-budget baseline:

`DKK 8,450–13,700 / month`

The range is calculated from the current official budget components and is deliberately stored as:

- `reference_scope = national_baseline`
- `city_specific = false`
- `indicative = true`
- medium confidence / calculated evidence

This avoids pretending that incompatible university or housing-budget baskets create a fair city-by-city ranking. Phase 6 Compare must keep this limitation visible.

## Student transport reference

Transport remains source-native and is a general adult public-transport reference, not a claim that every international student receives a student concession.

| City | Reference | Source-native period |
| --- | ---: | --- |
| Copenhagen | DKK 24 | 2 zones |
| Frederiksberg | DKK 24 | 2 zones |
| Odense | DKK 28 | 1–2 zones |
| Aarhus | DKK 26 | 1–2 zones |
| Aalborg | DKK 24 | 2 zones |

All rows store:

- `student_specific = false`
- `source_native_period = true`

No synthetic monthly transport cost is created.

## Student work-rights context

The national reference for the relevant state-approved higher-education student residence-permit context is preserved in its official unit:

- up to 90 hours per month from September through May;
- full-time work in June, July and August.

Stored semantics include:

- `hours_normal_period = 90`
- `period = month`
- normal-period month list
- full-time summer month list
- `national_rule = true`
- `limited_work_permit = true`

The UI must not convert the monthly cap into a weekly entitlement. Other nationality, residence or permit rules may differ.

## Employment focus sectors

Each city stores indicative municipality/economic-strategy context rather than a shortage occupation ranking or employment guarantee.

### Copenhagen

- Life science
- Green solutions
- Creative industries
- Tourism
- International business

### Frederiksberg

- Knowledge and education
- Sustainable business
- Tourism and culture
- Retail and city life
- Entrepreneurship

### Odense

- Automation technology
- Advanced aviation technology
- Health technology
- Life science
- Startups and investment

### Aarhus

- Renewable energy
- Digital technology
- Health
- Food
- Industrial innovation

### Aalborg

- Industry and technology
- Green energy
- Digitalisation
- Health technology
- Circular economy

All sector rows store `indicative = true` and `not_shortage_ranking = true`.

## Verification

Production verification returned exactly five verified metric rows per Tier A city and 25 total.

Repository contract: `tests/dk-city-metrics-contract.test.ts`.

Result: Denmark Cities has reached `METRICS_COMPLETE`.