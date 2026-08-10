# Singapore study destination metrics v1

Status: `PHASE_4_COMPLETE`

Branch: `agent/sg-destination-metrics-v1`

Parent: `agent/sg-destination-linkage-v1`

Date: 2026-08-10

## Result

Phase 4 publishes a bounded, service-role Singapore study-destination metric view while keeping all evidence country-scoped.

Production view:

`public.study_destination_metric_sg_v1`

Verified metric count: 8 / 8.

## Bounded study profile metrics

1. `country_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_limit`
5. `tuition_annual_low`
6. `tuition_annual_high`
7. `visa_application_fee`
8. `employment_focus_sectors`

All eight rows retain source URL, source name, source/reference date, verification timestamp, confidence and evidence kind.

## Interpretation rules

### Population

Population remains a Singapore country/city-state statistic. No neighbourhood value is substituted for the destination.

### Living costs

The current monthly range is a source-backed student scenario, not a universal cost guarantee. Accommodation assumptions remain material.

### Transport

The publication layer keeps PTC's source-native fare/pass references. It does not manufacture a synthetic monthly transport budget, and university-student concession eligibility is not assumed for every international student.

### Work rights

The 16-hour school-term figure is conditional on the foreign student meeting MOM's Student's Pass/institution eligibility rules. Qualifying industrial attachment/internship rules remain distinct.

### Tuition

The low/high values are AY2026 source-backed undergraduate reference examples for the stated international-student/Tuition-Grant scenario. They are not universal Singapore tuition fees and retain the attached Tuition Grant service-obligation caveat.

### Student's Pass fee

The S$45 value is the application processing fee. Issuance and other applicable fees remain separate.

### Economic sectors

EDB sector context is descriptive economic evidence, not a shortage score, visa outcome or employment guarantee.

## Programme coverage

Canonical SG programmes: 0.

Programme coverage remains `verification_pending`. The metric read model does not change that state.

## Security

`study_destination_metric_sg_v1` uses `security_invoker=true` and is intended for service-role server reads only.

## Database migration

`20260810122500_sg_destination_metrics_v1.sql`

Production application: successful.

## Phase 4 checkpoint

`DESTINATION_METRICS_READY`

Next: build a server-side Singapore destination profile and attach it to the existing `/sg` hub without removing the existing jobs/work-pass experience.
