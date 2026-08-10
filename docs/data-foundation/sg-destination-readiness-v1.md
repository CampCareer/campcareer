# Singapore study destination readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/sg-destination-readiness-v1`

Baseline: `main@e709212c92d18c0bfb7ae6b4bd5db478c0c6591a`

Audit date: 2026-08-10

Verdict: `READY_WITH_GATES`

## Purpose

Phase 0 establishes the current production and application baseline for Singapore before any destination-specific data-foundation work. This phase is diagnostic only and makes no production database, routing, SEO or publication changes.

Singapore must be treated as a city-state study destination. The rollout must not invent a multi-city shortlist or duplicate Singapore into a second canonical city solely to reuse country patterns designed for larger countries.

## Destination model

The destination anchor is the canonical country `SG`.

The intended study-destination chain is:

`country SG -> institution -> campus/teaching location -> programme offering`

Physical campus addresses and local area labels remain useful evidence, but they are location attributes rather than a required public city-comparison tier.

The existing `core.geographies` Singapore city row is retained as a legacy location-compatibility record. Phase 0 does not delete, rename, repurpose or duplicate it. It must not be interpreted as evidence that Singapore needs a city shortlist.

## Current application baseline

The application already has a first-class Singapore hub at `/sg`.

The existing page explicitly describes Singapore as a city-state and keeps job-demand data national while using Central, East, North, North-East, West and CBD only as living/commute comparison areas. This is compatible with a country-level study-destination model.

No new route is required in Phase 0.

## Production data snapshot

### Country

`core.countries` contains the active canonical country `SG` / Singapore.

### Geography

Production currently contains one Singapore geography row:

- name: Singapore
- slug: `singapore`
- geography type: `city`
- status: active
- scope kind: null

This row is treated as a legacy physical-location compatibility record for the destination rollout. It is not a new publication tier and is not a reason to create a Singapore city comparison.

### Institutions and campuses

Production currently contains six active Singapore institutions, each with one active Singapore campus record:

1. Nanyang Technological University
2. National University of Singapore
3. Singapore Institute of Technology
4. Singapore Management University
5. Singapore University of Social Sciences
6. Singapore University of Technology and Design

Campus geography references are not structurally mandatory: `catalog.campuses.geography_id` and `locality_geography_id` are nullable. Therefore the schema can support a country-level destination without fabricating additional canonical cities.

### Programmes and offerings

At the Phase 0 snapshot:

- canonical SG programmes: 0
- canonical programme offerings for SG institutions: 0
- `programme_offerings.market = 'SG'`: 0

Programme delivery must therefore remain unavailable/pending until explicit canonical programme and campus-level offering evidence is loaded. Institution or campus presence must never be used to infer programme delivery.

### Country-level metric evidence

`public.report_metric_evidence_country` currently contains eight reviewed SG evidence rows:

- `average_annual_salary`
- `full_time_annual_earnings_range`
- `national_minimum_hourly_wage`
- `student_living_cost_monthly_range`
- `student_work_hours_limit`
- `tuition_annual_high`
- `tuition_annual_low`
- `visa_application_fee`

These are already country-scoped and are a better fit for Singapore than creating per-city metric duplicates.

### Existing SG institution read models

Production contains server-oriented SG institution views including:

- `public.institution_identity_sg_v1`
- `public.institution_detail_sg_v1`

Both are PostgreSQL views with `security_invoker=true`. Direct `SELECT` is not granted to `anon` or `authenticated`; `service_role` has `SELECT`.

No destination-level SG read model is introduced in Phase 0.

## Readiness gates

### Gate 1 — city-state semantics

Pass condition: all future destination metrics and study-context claims use country `SG` as the public destination scope unless the source itself is explicitly local-area-specific.

Do not create a fake multi-city launch list.

### Gate 2 — legacy geography isolation

The existing Singapore city geography may remain for campus/location compatibility, but it must not become an accidental public city-comparison requirement.

No Phase 0 mutation is required.

### Gate 3 — programme delivery evidence

A programme can appear only when a canonical programme and explicit offering-to-campus/location record exist with source evidence.

Campus presence alone is never sufficient.

Current state: programme publication remains pending.

### Gate 4 — country metric provenance

Existing SG country metrics may be reused only when source URL, source period, scope, methodology and verification state remain explicit. Calculated values must stay distinguishable from directly observed values.

### Gate 5 — public route separation

The existing `/sg` work/study hub can remain the public Singapore anchor. Later study-destination work should extend or feed that country hub rather than introducing an artificial `/cities/sg/...` requirement.

### Gate 6 — publication separation

Phase 0 does not change indexing, sitemap membership, public route behaviour or production database state.

## Phase 0 result

Singapore is ready to proceed to Phase 1 as a country-level city-state destination.

The correct next step is to define the authoritative source map, evidence contract and exact study-destination scope for `SG` without creating a city shortlist.

Next branch: `agent/sg-destination-scope-v1`
