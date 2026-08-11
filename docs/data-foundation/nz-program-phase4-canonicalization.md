# NZ Programs — Phase 4 Canonicalization

Date: 2026-08-10  
Branch: `agent/programs-nz`  
Scope: New Zealand only. Phase 4 canonicalizes the verified 24-program Tier A occupation-led cohort from Phase 3. It does not add unrelated programmes, publish the web UI, infer programme locations, or start another country.

## Production migrations

Applied migrations:

- `20260810163650_nz_program_phase4_canonicalization`
- `20260810163727_nz_program_phase4_read_models`

## Canonicalization result

Canonical cohort:

- 24 programmes;
- 8 existing canonical universities;
- 24 deterministic `NZ_PROGRAM_SOURCE_HASH` identifiers;
- 24 deterministic international offerings;
- 24 / 24 offering verification status `verified`;
- 6 offerings with a source-backed current open application window;
- 18 offerings with `eligible_schedule_unknown` application timing;
- 0 programme offering campus links.

Stable canonical identity is derived from `(source_name, source_program_key)` rather than staging row IDs.

Canonical programme ID:

`md5('NZ|PROGRAM|' || source_name || chr(31) || source_program_key)::uuid`

Canonical offering ID:

`md5('NZ|OFFERING|' || source_name || chr(31) || source_program_key)::uuid`

## Qualification framework boundary

`core.qualification_frameworks` currently has no NZ framework rows. Phase 4 therefore does not fabricate NZQCF framework or level identities.

- `catalog.programmes.qualification_level_id` remains `NULL` for all 24 NZ canonical programmes;
- verified `nzqcf_level` and `nzqcf_credits` remain available in the NZ canonical read models;
- a future shared qualification-framework migration can attach stable core IDs without changing programme identity.

## Programme ↔ occupation boundary

Phase 4 preserves the exact reviewed Phase 3 relationship set:

- 39 canonical programme↔career relations;
- 35 distinct careers from CampCareer’s canonical 80-programme-matching occupation set;
- 0 relations outside the canonical 80;
- `direct` remains `direct`;
- technician-adjacent and other non-direct routes remain `related`.

The relation is educational relevance only. It does not imply professional registration, licensing, visa approval or employment eligibility.

Because `country_occupation_profiles` still has no NZ rows, Phase 4 does not fabricate shared profile records. The reviewed NZ relations are exposed through an NZ-specific canonical read model.

## Location boundary

Phase 4 continues the no-programme-city inference rule.

- canonical offering `campus_id`: 0 populated;
- explorer `campus_id`: always null;
- explorer `city_slug`: always null;
- explorer `city_name`: always null.

Institution geography is not treated as evidence of programme delivery location.

## Canonical read models

Server-only views:

- `public.program_catalog_canonical_nz_v1` — 24 rows;
- `public.program_occupation_canonical_nz_v1` — 39 relations across 35 careers;
- `public.program_explorer_nz_v1` — 24 rows;
- `public.program_detail_nz_v1` — 24 rows;
- `public.program_compare_nz_v1` — 24 rows.

Explorer/detail/compare preserve:

- canonical institution identity;
- NZQCF level and credits;
- qualification and degree type;
- programme duration and study mode;
- international-student eligibility;
- provider Code context;
- current application state without conflating it with programme eligibility;
- Post Study Work Visa context as qualification-level information only;
- reviewed occupation relations;
- official programme and international/visa source provenance.

## Security

All Phase 4 views use `security_invoker=true`.

Privileges are intentionally server-only:

- `anon`: no SELECT;
- `authenticated`: no SELECT;
- `service_role`: SELECT.

This keeps staging/canonical programme evidence behind the server boundary until the application layer exposes curated fields.

## Phase 4 decision

Phase 4 is complete for the bounded NZ cohort.

No programme was added to increase catalogue coverage. No unrelated programme, polytechnic/PTE expansion, city/campus inference, or shared occupation-profile fabrication occurred.

## Phase 5 handoff

Phase 5 is now implemented separately in `docs/data-foundation/nz-program-phase5-release.md` using only this verified 24-program cohort.

The Phase 4 invariants remain unchanged:

- the canonical 80-occupation boundary;
- `direct` versus `related` semantics;
- application-window separation;
- Code / visa / professional-registration separation;
- no programme city/campus claim without programme-level evidence;
- server-only access to underlying canonical views.
