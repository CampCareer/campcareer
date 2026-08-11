# NL Programs — Phase 4 Integration

Date: 2026-08-10
Branch: `agent/programs-nl`
Scope: Netherlands `/programs` only.

## Outcome

Phase 4 canonicalizes the verified Phase 3 Tier A cohort and builds server-only read models for later `/programs` publication.

## Canonical cohort

- 26 Tier A programmes canonicalized.
- 7 existing canonical NL institutions.
- Tier C HBO provider candidates: 11, staging-only.
- Tier B: 0.
- `catalog.programmes`: 26 NL rows, all active.
- `qualification_level_id`: NULL for all 26 because `core.qualification_frameworks` currently has no NL framework rows. The Dutch native metadata remains in the NL canonical view instead of forcing a foreign framework mapping.

## Identity

Stable canonical identity uses `(source_name, source_program_key)`:

- programme UUID: `md5('NL|PROGRAM|' || source_name || chr(31) || source_program_key)::uuid`
- offering UUID: `md5('NL|OFFERING|' || source_name || chr(31) || source_program_key)::uuid`
- source identifier system: `NL_PROGRAM_SOURCE_HASH`
- 26 source-hash identifiers.
- 15 directly evidenced official recognised programme codes preserved under `NL_RIO_PROGRAM_CODE`.

No staging identity/serial ID is used as canonical identity.

## Offerings

- 26 international offerings.
- 26/26 verification status `verified`.
- campus links: 0.
- application state is mapped from Phase 3 canonical admission state.
- UvA Business Analytics remains eligible but its checked 2026–2027 application window is represented as closed.

## Programme → Career integration

`country_occupation_profiles` still has 0 NL rows, so Phase 4 does not fabricate shared country-profile records.

Instead:

- `program_occupation_canonical_nl_v1`: 56 approved relations.
- distinct canonical careers: 30.
- deterministic canonical programme UUIDs are exposed with the reviewed Phase 2/3 relations.

The shared country occupation programme-link layer can be materialized later if NL country occupation profiles are built; canonical programme identity will not need to change.

## Read models

All are `security_invoker=true`, revoked from `PUBLIC`, `anon`, and `authenticated`, and granted only to `service_role`:

- `program_catalog_canonical_nl_v1`: 26
- `program_occupation_canonical_nl_v1`: 56 relations / 30 careers
- `program_explorer_nl_v1`: 26
- `program_detail_nl_v1`: 26
- `program_compare_nl_v1`: 26

All 26 explorer rows are Tier A and `indexable=true`.

## Location policy

Six Tier A staging rows contain source city text, but Phase 4 does not convert raw text or institution location into canonical programme-to-city/campus linkage.

Therefore publication-facing read models currently have:

- `campus_id`: NULL
- `city_slug`: NULL
- `city_name`: NULL

Raw `source_city` remains available only as provenance in the canonical/detail layer. A later linkage phase must require explicit programme-level location evidence and a canonical location relation.

## Security / invariants

Production verification after migration:

- canonical programmes: 26
- source identifiers: 26
- RIO programme-code identifiers: 15
- offerings: 26
- offering campus links: 0
- canonical Programme → Career relations: 56 / 30 careers
- explorer/detail/compare: 26 each
- Tier C canonical leak: 0
- all five Phase 4 views: anon false / authenticated false / service_role true

## Migrations

- `20260810110748_nl_program_phase4_canonicalization.sql`
- `20260810110922_nl_program_phase4_read_models.sql`

## Handoff to Phase 5

Phase 5 can publish only the 26 Tier A canonical programmes. It should use `program_detail_nl_v1` for stable source identity and detail data, generate stable programme slugs, keep all 26 indexable unless a later verification changes their status, and continue to omit canonical programme city/campus until an explicit linkage exists.

Phase 4 does not start Phase 5 and does not touch another country.
