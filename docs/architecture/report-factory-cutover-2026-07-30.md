# Report Factory production cutover — 2026-07-30

## Status

The canonical Report Factory schema has been created and populated in the production Supabase project. Legacy product tables have either been reclassified as raw `ingest` data or isolated under `retired` pending physical deletion.

## Canonical schemas

- `core`: countries, currencies, qualification frameworks and geographies
- `catalog`: institutions, campuses, programmes, offerings, fees, requirements and accreditations
- `taxonomy`: study concepts, occupations and programme/career mappings
- `evidence`: sources, snapshots, metric observations, review history and ingestion runs
- `labour`: normalised outcome observations
- `reporting`: products, methodology versions, ranking models, analysis runs and release artifacts
- `ingest`: source-shaped datasets retained for reproducible imports; not an application read model

All canonical and ingest schemas are private to `service_role`. `anon` and `authenticated` access was revoked.

## Migrated data

Production counts at the final cutover audit:

- Countries: 6
- Currencies: 5
- Qualification frameworks: 3
- Qualification levels: 28
- Geographies: 31,892
- Canonical institutions: 6,556
- Canonical campuses: 6,683
- Canonical programmes: 12,969
- Canonical offerings: 12,969
- Programme fees: 9,714
- Programme requirements: 28
- Programme accreditations: 9,743
- Evidence sources: 25
- Source snapshots: 119
- Metric observations: 10,557
- Labour outcome observations: 744
- Canonical occupations: 1,390
- Nursing programme mappings: 185
- Nursing occupation mappings: 29

## Course mapping closure

| Legacy source | Programmes | Offerings | Result |
|---|---:|---:|---|
| Australia | 9,743 / 9,743 | 9,743 / 9,743 | Complete |
| Canada | 165 / 165 | 165 / 165 | Complete |
| Ireland | 2,876 / 2,876 | 2,876 / 2,876 | Complete |
| United Kingdom | 185 / 185 | 185 / 185 | Complete |
| **Total** | **12,969 / 12,969** | **12,969 / 12,969** | **Complete** |

Ireland courses with missing legacy provider IDs were recovered from `college_name`. One UK course with a provider absent from the old institution table was recovered from its provider slug. These reconstructed provider identities must remain reviewable rather than being treated as regulator-verified records.

## Source preservation

The large country-specific datasets were not destroyed. They were moved from `public` to `ingest`, including:

- institution, city and course catalogues
- US programme data
- field earnings
- Australian occupation profiles, state outcomes, vacancies, outlook, regional employment and mobility
- CRICOS, programme-page facts, policy, regulatory and visa source tables
- Irish graduate, shortage and language-course datasets

The previous `data_source_runs` table is now `evidence.ingestion_runs`.

## Retired product structures

The following were removed from the application-facing `public` schema and isolated under `retired`:

- all `plan_*` tables
- saved course, institution, occupation and study-concept tables
- timeline, document and planner workspace tables
- `/au/majors` data and aggregate signals
- approximate country ROI materialized views
- superseded programme evidence and legacy operational tables

Six empty legacy report tables remain in `public` only until the final cleanup migrations run:

- `report_decision_options`
- `report_intakes`
- `report_launch_interests`
- `report_orders`
- `city_living_cost_profiles_au`
- `report_metric_evidence_au`

All six were confirmed to contain 0 rows.

## Pending physical cleanup

After migration-history reconciliation, the only pending migrations must be:

1. `20260730181015_retire_report_workspace_tables.sql`
2. `20260730181016_retire_legacy_report_evidence.sql`
3. `20260730181017_drop_retired_schema.sql`

Run:

```bash
bash scripts/reconcile-report-factory-migration-history.sh
supabase db push --dry-run
supabase db push
```

The first script changes migration history records only. It does not execute or reverse schema SQL. The final push moves the six empty tables and physically deletes the `retired` schema.

## Expected final `public` schema

After the pending cleanup, only current application/account tables remain:

- `analytics_events`
- `assessments`
- `leads`
- `profiles`
- `subscriptions`
- `user_preferences`

## Data-quality boundary

Migration into a canonical table is not the same as commercial approval.

- Legacy catalogue and field-outcome imports remain `review_required` or medium confidence.
- Provider-page facts retain their original review status and evidence snapshot.
- Nursing programme detection currently includes title/field matching and must be refined with the approved-programme and international-eligibility rules before ranking.
- US and Netherlands programme catalogues remain raw in `ingest` until their country adapters are designed.
- No ranking model or ROI methodology was approved by this schema cutover.

## Verification

Run the read-only audit:

```sql
\i supabase/maintenance/2026-07-30-report-factory-audit.sql
```

Expected integrity results:

- programmes without institution: 0
- offerings without programme: 0
- metric observations without source snapshot: 0
- AU/CA/IE/UK programme and offering mappings: complete
