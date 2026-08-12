# United Arab Emirates Cities — Phase 4 metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `SOURCE_AWARE_METRICS_LOCKED`

Country: `AE` — United Arab Emirates

Checked: 2026-08-12

Branch: `agent/ae-cities-v1`

## Metric contract

Each of the four Tier A Cities has exactly five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Expected total: 20 metric rows.

## Population boundary

No emirate-wide population figure is relabelled as a City-locality figure.

For this release, the four population records explicitly state that a release-safe comparable City-scope numeric value is not being used. The metric therefore preserves the evidence boundary instead of manufacturing comparability.

## Living-cost references

Living-cost evidence stays source-native and is not a cheapest-City ranking.

- Abu Dhabi: NYU Abu Dhabi graduate on-campus monthly housing reference in USD
- Sharjah: AUS residential-hall semester range in AED, deliberately not converted to a synthetic monthly number
- Al Ain: no release-safe numeric official monthly student-cost reference used
- Dubai: Emirates Aviation University monthly on-campus accommodation reference in AED

These are accommodation/planning references, not harmonised full student budgets.

## Transport references

- Abu Dhabi: Hafilat student annual permit, AED 500
- Al Ain: Hafilat student annual permit, AED 500
- Sharjah: Sayer 30-day subscription, AED 225, not student-specific
- Dubai: student nol 30-day product, AED 70 one-zone to AED 175 all-zones

Operator-native validity periods and eligibility remain intact.

## Student work context

The UAE record uses the MOHRE student training and employment permit model.

A universal weekly-hour cap is not invented. The stored record makes explicit that:

- the context is national, not City-specific
- a permit is required under the verified source contract
- the student training/employment permit duration is three months
- no one fixed weekly-hour value is asserted by this metric

## Employment context

Sector lists are official/local economic-development context only. They are not shortage rankings, hiring forecasts or job guarantees.

- Abu Dhabi: ADDED growth sectors
- Sharjah: Sharjah Chamber investment/business-sector context
- Al Ain: ADDED Nibras Al Ain / industrial-location context
- Dubai: Dubai DET economy/tourism and industrial context

## Read model and security

Phase 4 creates:

`public.city_metric_directory_ae_v1`

The view is `security_invoker=true`, revokes access from `public`, `anon`, and `authenticated`, and grants SELECT only to `service_role`.

## Validation

A transactionally rolled-back production-schema replay confirmed:

- Cities represented: 4
- minimum metric families per City: 5
- maximum metric families per City: 5

No production change was retained.

## Conclusion

UAE Cities Phase 4 is complete with source-aware metrics that preserve City/emirate, period, eligibility and evidence-availability boundaries.