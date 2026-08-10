# UK Programs — Phase 4 Integration

Date: 2026-08-09
Branch: `agent/programs-uk`
Scope: United Kingdom only.

## Phase 4 result

Phase 4 is complete for the bounded UK programme cohort established in Phases 2 and 3.

### 4.1 Canonical programme integration

Production migration:

- `20260809212018_uk_program_phase4_canonicalization.sql`

Result:

- 76 active canonical programmes.
- Tier A: 75.
- Tier B: 1.
- 19 canonical institutions represented.
- Tier C canonical leaks: 0.
- 76 deterministic `UK_PROGRAM_SOURCE_HASH` identifiers.
- 76 canonical international offerings.
- 75 verified offerings and 1 unverified Tier B offering.
- 0 programme campus assignments.
- Existing 185 legacy UK programmes preserved but marked inactive.
- Existing 185 legacy offerings preserved but marked stale.
- UK catalogue total: 261 programmes, of which 76 are active canonical records.

Stable programme/offering identity is derived from `(source_name, source_program_key)`. No database-generated staging IDs are hardcoded into canonical UUIDs.

### 4.2 Occupation integration

Production migration:

- `20260809214142_uk_program_phase4_read_models.sql`

The Phase 3 Tier A/B cohort has 90 approved programme-to-occupation relations across 56 canonical careers.

`country_occupation_profiles` currently contains zero UK profiles, so the shared `country_occupation_program_links` foreign-key table cannot accept UK relationships without first fabricating or separately building UK occupation profiles. Phase 4 therefore does not create artificial profile rows.

Instead, reviewed relationships are exposed through:

- `public.program_occupation_canonical_uk_v1`

This view maps the reviewed staging evidence onto deterministic canonical programme UUIDs and preserves the original relation type and evidence metadata.

### 4.3 Programme to Institution to City

Programme-to-institution integration is complete because all 76 canonical programmes have canonical institution IDs.

Programme-to-city/campus linkage remains intentionally empty. The current programme evidence does not establish programme-specific campus delivery, and institution presence is not used to infer a programme location.

Verified result:

- programme city/campus links: 0.

This is an evidence gap, not an integration failure.

### 4.4 Explorer, Detail and Compare read models

Phase 4 creates server-only read models:

- `public.program_explorer_uk_v1`
- `public.program_detail_uk_v1`
- `public.program_compare_uk_v1`

Each contains 76 canonical programmes.

Publication semantics:

- Tier A: `publication_status = publishable`, `indexable = true`.
- Tier B: `publication_status = review`, `indexable = false`.
- Tier C: excluded.

All city/campus fields remain null until programme-level evidence exists.

## Security

The canonical occupation, explorer, detail and compare views are `security_invoker=true` and server-only:

- `anon` SELECT: blocked.
- `authenticated` SELECT: blocked.
- `service_role` SELECT: allowed.

## Final Phase 4 verification

Production state after both Phase 4 migrations:

- Canonical programmes: 76.
- Tier A: 75.
- Tier B: 1.
- Canonical institutions: 19.
- Canonical occupation relations: 90.
- Canonical careers represented: 56.
- Explorer rows: 76.
- Detail rows: 76.
- Compare rows: 76.
- Programme city/campus links: 0.
- UK `country_occupation_profiles`: 0.
- Tier C leaks: 0.

## Phase boundary

UK Programs Phase 4 is complete.

Phase 5 is the next phase and should handle public `/programs` UI routing, programme detail pages, SEO/indexation policy, sitemap behaviour, tests and deployment. Phase 5 should publish Tier A by default and keep Tier B non-indexable unless the publication policy is deliberately changed.
