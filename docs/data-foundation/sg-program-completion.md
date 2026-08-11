# Singapore Programs completion

Status: `PHASE_1_TO_5_COMPLETE`

Branch: `agent/programs-sg`

Base: `agent/programs-de`

Date: 2026-08-10

## Scope

This checkpoint completes the Singapore `/programs` rollout only. No country after Singapore is in scope.

The bounded provider cohort is the six canonical Singapore local universities already used by CampCareer destination and institution data:

- National University of Singapore (NUS)
- Nanyang Technological University (NTU)
- Singapore Management University (SMU)
- Singapore Institute of Technology (SIT)
- Singapore University of Social Sciences (SUSS)
- Singapore University of Technology and Design (SUTD)

Programme existence, full-time study mode, international applicant eligibility, current application timing, ICA Student's Pass context and professional registration are deliberately separate claims.

## Phase 1

Discovery and publication boundaries are recorded in `sg-program-phase1-discovery.md`.

The initial programme cohort is restricted to current official university sources. Part-time and in-employment pathways are not promoted as Student's Pass pathways by inference.

## Phase 2

Production private staging is complete:

- `program_catalog_sg_staging`: 134 programmes
- `program_international_sg_staging`: 134 rows
- `program_occupation_sg_staging`: 215 approved education relationships
- distinct CampCareer careers covered: 57 of 80

Institution distribution:

- NUS: 31
- NTU: 37
- SMU: 11
- SIT: 38
- SUSS: 12
- SUTD: 5

QA at publication time:

- missing institution links: 0
- duplicate source keys: 0
- missing official programme URLs: 0
- missing admission URLs: 0
- programme/international evidence mismatch: 0

The operational collection snapshot is QA-verified in production staging. It is not represented as a fresh-database content seed migration; the repository migrations define the staging and publication schema, while collection rows remain sourced operational data.

## Phase 3

International admission evidence is 1:1 with the 134-programme cohort.

Verified state on 2026-08-10:

- `closed`: 122
- `not_yet_open`: 12

NUS, NTU, SMU, SIT and SUTD have closed AY2026/27 undergraduate application windows. SUSS explicitly states that the July 2027 full-time undergraduate application cycle begins in November 2026 for its twelve listed international-student programmes.

SIT post-registration Nursing is retained as an official programme but carries an explicit restriction note covering Singapore Nursing Board registration and eligible Singapore nursing diploma prerequisites. Programme existence is not treated as universal international applicant eligibility.

## Phase 4

Canonical publication is complete:

- `SG_OFFICIAL_PROGRAM_KEY` identifiers: 134
- `SG_OFFICIAL_UNIVERSITIES` offerings: 134
- `program_explorer_sg_v1`: 134
- `program_detail_sg_v1`: 134

Canonical programme and offering IDs include both `source_name` and `source_program_key` to prevent collisions across universities and official source collections.

Publication views use `security_invoker=true` and are restricted to `service_role`:

- `anon` SELECT: false
- `authenticated` SELECT: false
- `service_role` SELECT: true

No CampCareer programme-accreditation records are created by this rollout. Autonomous-university status, official programme listing and ICA IHL status are not converted into programme-level accreditation or regulated-profession claims.

Production migration history:

- `20260810123204_sg_program_staging_foundation`
- `20260810130140_sg_program_canonicalization_publication`
- `20260810130212_sg_program_publication_security_invoker`

## Phase 5

Singapore is wired into the shared Programs country picker and `/programs?country=SG` explorer.

Detail route:

`/programs/sg/[program]`

All 134 source-verified programmes are browseable through the application. SEO indexing is limited to the 12 non-closed SUSS programmes whose next international application cycle is source-backed as `not_yet_open`; the 122 programmes with closed verified application cycles remain browseable but are not added to the programme sitemap cohort.

The detail UI explicitly separates:

- programme source verification
- current international admission status
- ICA Student's Pass context
- CampCareer career relationships
- programme-level accreditation claims
- regulated profession registration/licensing

Regression coverage includes Singapore staging, publication security, UI semantics, SEO cohort size and the shared Germany -> Singapore publication boundary.

## Final checkpoint

`SINGAPORE_PROGRAMS_COMPLETE`
