# CampCareer Report Factory Schema v1

Status: Draft foundation

## Objective

Create a reusable, country-neutral data layer for paid reports without deleting or changing the existing country-specific production tables.

The first vertical slice is Australia Nursing. Existing tables such as `courses_au`, `colleges_au`, `program_page_facts_au`, `report_metric_evidence_au`, and JSA labour-market tables remain authoritative ingestion sources during migration.

## Design principles

1. Additive migration only.
2. Existing application reads continue unchanged.
3. Raw/source ingestion remains separate from curated report data.
4. Every material paid-report claim must resolve to dated evidence.
5. Calculations and rankings must be versioned and reproducible.
6. Institution, programme, offering, fee, requirement, and accreditation are separate entities.
7. Country-specific identifiers are stored as identifiers, not embedded into core table names.
8. Unknown values remain null; they are never converted to zero.

## Schemas

### `core`

Shared reference data.

- `core.countries`
- `core.currencies`
- `core.qualification_frameworks`
- `core.qualification_levels`

### `catalog`

Education catalogue.

- `catalog.institutions`
- `catalog.institution_identifiers`
- `catalog.campuses`
- `catalog.programmes`
- `catalog.programme_identifiers`
- `catalog.programme_offerings`
- `catalog.programme_fees`
- `catalog.programme_requirements`
- `catalog.programme_accreditations`

Entity boundaries:

- Programme: the academic qualification itself.
- Offering: a programme delivered at a campus for a market/intake period.
- Fee: a dated fee applying to an offering.
- Requirement: admission, English, placement, or other entry requirement.
- Accreditation: a dated regulator or professional-body status.

### `evidence`

Source and claim control.

- `evidence.sources`
- `evidence.source_snapshots`
- `evidence.metric_observations`
- `evidence.claims`
- `evidence.claim_evidence`
- `evidence.review_events`

A material claim should be publishable only when it has at least one active evidence link and an approved review state.

### `labour`

Comparable time-series outcomes.

- `labour.outcome_observations`

This stores provider-, field-, qualification-, occupation-, geography-, cohort-, and outcome-window scoped observations without pretending that provider-level evidence is course-level evidence.

### `reporting`

Versioned calculations and releases.

- `reporting.products`
- `reporting.methodology_versions`
- `reporting.ranking_models`
- `reporting.ranking_weights`
- `reporting.analysis_runs`
- `reporting.analysis_inputs`
- `reporting.analysis_outputs`
- `reporting.report_releases`
- `reporting.report_artifacts`
- `reporting.monitoring_actions`

## Australia Nursing vertical slice

Initial backfill targets:

| Existing source | New target |
|---|---|
| `colleges_au` | `catalog.institutions` |
| `courses_au` | `catalog.programmes`, `catalog.programme_offerings` |
| `program_page_facts_au` | fees, requirements, campuses |
| `field_earnings_au` and QILT imports | `labour.outcome_observations` |
| `report_metric_evidence_au` | `evidence.metric_observations` |
| Nursing Source Register | sources, snapshots, claims, reviews |
| Nursing ROI model | methodology versions, analysis inputs, outputs |
| PM manifest | report releases and artifacts |

## Migration sequence

1. Create schemas and foundation tables.
2. Seed stable reference rows only.
3. Add read-only backfill scripts for Australia Nursing.
4. Compare source counts, hashes, and protected values.
5. Add canonical adapters in application code.
6. Run old and new reads in parallel.
7. Switch reads only after parity approval.
8. Archive legacy structures later; do not drop them in v1.

## Security model

- Operational evidence, analysis inputs, and release-control tables are service-role only.
- Public pages must use curated views or server-side adapters.
- No anonymous write policies are added by this migration.
- RLS is enabled on all new tables.
- No browser role receives direct access in this foundation migration.

## Out of scope for this migration

- Production data backfill
- Existing table modification or deletion
- Existing materialized-view replacement
- Existing app route changes
- Ranking calculations
- Report rendering
- Payment or fulfilment changes
