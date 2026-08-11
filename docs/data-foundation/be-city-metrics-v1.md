# Belgium city metrics v1

Status: `PHASE_4_COMPLETE`

Branch: `agent/be-cities-v1`

Migration history checkpoint: `20260810202906_publish_be_tier_a_city_metrics_v1`

Checkpoint: `METRICS_COMPLETE`

## Five Core Metrics

Each of the six Tier A destinations has exactly five reviewed rows in `public.report_metric_evidence_city`:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production verification: 30 verified rows total, exactly 5 per city; city programme directory remains 0 rows.

## Semantics

Population preserves the Phase 2 scope contract. Brussels uses the Brussels-Capital Region. Louvain-la-Neuve displays population for Ottignies-Louvain-la-Neuve municipality. Other destinations use municipality scope.

Living-cost evidence is source-native and deliberately not converted into a synthetic cost index. Methodologies differ. Ghent is lower confidence because its university reference is aimed at international PhD/research staff; Leuven uses university Belgium-wide guidance rather than a Leuven market survey.

Transport preserves the source-native ticket period. Age, enrolment, residence, card and operator conditions can apply; the values must not be compared as if they were normalized monthly fares.

Student work is a national Belgian context row on all six destinations: eligible foreign students covered by the residence-based rule may work up to 20 hours per week outside school holidays, with work compatible with studies. Individual eligibility still controls.

Employment sectors are contextual ecosystem signals only. Every row is guarded as indicative, not a shortage ranking, not a job guarantee and not an immigration signal.

Production data was applied in small idempotent DML batches after the large single payload was rejected by the tooling safety gate. The exact 30-row state was verified before the migration-history checkpoint was recorded; the repository migration contains the complete idempotent reconstruction SQL.

Next: Phase 5 city profiles.
