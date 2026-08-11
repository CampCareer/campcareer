# US Programs — Phase 4 Canonicalization and Read Models

Date: 2026-08-10  
Branch: `agent/programs-us`  
Scope: United States `/programs` Phase 4 only. This phase canonicalizes the verified 24-programme Phase 3 cohort and creates server-only read models. It does not publish public routes, enable indexing, infer programme location, merge to `main`, deploy, or start another country.

## 1. Phase 4 input gate

Phase 4 consumes only the bounded Phase 3 cohort:

- 24 current official programmes;
- 8 existing Tier A institutions;
- 65 approved programme-to-career relations;
- 42 distinct CampCareer target careers;
- 0 relations outside the canonical programme-matching 80;
- 24 verified provider-level F-1 / I-20 context rows;
- 6 exact programme CIP codes verified;
- 4 positive STEM-designated CIP checks;
- 2 exact-CIP STEM states deliberately unresolved;
- 0 programme delivery city/campus assertions.

The 106,083-row broad U.S. ingest remains discovery/analytics input and is not canonicalized.

## 2. Stable canonical identity

A staging bigint row id is not durable programme identity.

The stable source identity remains:

`(source_name, source_program_key)`

Deterministic canonical UUIDs are generated as:

- programme: `md5('US|PROGRAM|' || source_name || chr(31) || source_program_key)::uuid`
- offering: `md5('US|OFFERING|' || source_name || chr(31) || source_program_key)::uuid`

A 32-character source hash is stored in `catalog.programme_identifiers` with:

- identifier system: `US_PROGRAM_SOURCE_HASH`;
- identifier value: `md5(source_name || chr(31) || source_program_key)`.

This makes canonical identity independent of staging insertion order and reruns.

## 3. Canonical programme mapping

All 24 verified programmes are inserted into `catalog.programmes`.

Mapping rules:

- `institution_id` uses the already canonical institution identity;
- `canonical_title` uses the verified programme title;
- `programme_type` preserves the source-backed U.S. award level;
- `field_name` preserves the bounded field category;
- `field_code` is populated only where an exact programme CIP was verified;
- `default_duration_months` is retained where source-backed;
- `status='active'` because Phase 3 rechecked the current programme identity.

### No synthetic U.S. qualification framework

The United States programme model here does not fabricate a national qualification framework comparable to NZQCF/AQF/RQF.

There are still 0 U.S. rows in `core.qualification_frameworks`, therefore all 24 canonical U.S. programmes keep:

`qualification_level_id = NULL`

The source-backed `credential_name`, `award_level`, CIP and credit metadata remain available in the U.S. read models instead.

## 4. Canonical offering boundary

Each canonical programme receives one deterministic Phase 3 canonical offering:

- source system: `US_PROGRAM_PHASE3_CANONICAL`;
- verification status: `verified`;
- campus: `NULL`;
- market: `unknown`;
- enrolment status: `unknown` for the current cohort.

`market='unknown'` is deliberate. Phase 3 confirmed provider-level F-1 / I-20 context but did not establish programme-specific international-student eligibility. Provider sponsorship must not be promoted into a programme-level international-market claim.

No programme-level campus/city is inferred from institution geography, an IPEDS address or SEVP provider/campus context.

## 5. Canonical occupation relationships

`public.program_occupation_canonical_us_v1` exposes all 65 approved relations across 42 target careers.

The source relation is preserved exactly as one of:

- `direct`;
- `common_pathway`;
- `related`.

For consumers that need the shared two-level relationship contract, the view also exposes:

- `direct` -> `direct`;
- `common_pathway` -> `related`;
- `related` -> `related`.

The original `source_relation_type` remains visible so U.S.-specific nuance is not lost.

No relation implies professional licensure, immigration eligibility or a guaranteed employment outcome.

## 6. Server-only Phase 4 read models

Phase 4 creates five U.S. views:

1. `public.program_catalog_canonical_us_v1`
2. `public.program_occupation_canonical_us_v1`
3. `public.program_explorer_us_v1`
4. `public.program_detail_us_v1`
5. `public.program_compare_us_v1`

The explorer/detail/compare projections preserve:

- programme and institution identity;
- UNITID;
- credential and award level;
- CIP evidence state;
- credits/duration/study mode;
- accreditation context;
- provider-level SEVP context;
- F/M student-visa context;
- exact-CIP / STEM-designation state;
- OPT and STEM OPT explanatory context;
- reviewed career relationships;
- source provenance.

Programme campus/city fields remain `NULL`.

## 7. Phase 5 release gate

Canonicalization does not equal publication.

All 24 U.S. explorer rows currently expose:

- `publication_status='review_ready'`;
- `indexable=false`;
- `release_gate_reason='programme_specific_international_eligibility_unresolved'`.

This is intentionally more conservative than countries where programme-specific international eligibility was verified in Phase 3.

Current Phase 4 state:

- programme-specific `international_students_eligible=true`: 0;
- `eligible_schedule_unknown`: 24;
- offering market `unknown`: 24;
- indexable: 0.

Phase 5 must make an explicit release decision rather than silently converting provider-level F-1 context into programme-level eligibility.

## 8. STEM and immigration boundary

The Phase 3 evidence contract is preserved unchanged:

- exact verified CIP: 6;
- positive STEM-designated CIP: 4;
- exact CIP with deliberately unresolved STEM state: 2.

A positive CIP condition is still not a guarantee of STEM OPT. Applicant status, DSO actions, employer requirements and USCIS adjudication remain separate.

The two hospitality CIP rows remain unresolved instead of being assigned unsupported negative STEM values.

## 9. Security model

All five Phase 4 views use `security_invoker=true`.

Permissions are deliberately server-only:

- `anon`: no privileges;
- `authenticated`: no privileges;
- `service_role`: `SELECT`.

The views therefore do not create a new direct public Data API surface during Phase 4.

## 10. Production migrations

Applied and migration-history matched:

1. `20260810201717_us_program_phase4_canonicalization`
2. `20260810201804_us_program_phase4_read_models`

## 11. Production verification snapshot

After both migrations:

| Invariant | Result |
| --- | ---: |
| Canonical programmes | 24 |
| Canonical providers | 8 |
| `US_PROGRAM_SOURCE_HASH` identifiers | 24 |
| Canonical offerings | 24 |
| Verified canonical offerings | 24 |
| Offering market `unknown` | 24 |
| Canonical campus links | 0 |
| Canonical qualification-level links | 0 |
| Canonical occupation relations | 65 |
| Distinct target careers | 42 |
| Relations outside target 80 | 0 |
| Explorer rows | 24 |
| Detail rows | 24 |
| Compare rows | 24 |
| `review_ready` rows | 24 |
| Indexable rows | 0 |
| Programme-level international positive | 0 |
| Schedule unknown | 24 |
| STEM positive | 4 |
| Exact-CIP STEM unresolved | 2 |
| U.S. country occupation profiles | 0 |

## 12. Advisor review

Post-DDL security review found no new U.S. Phase 4 view exposure. The existing project-wide `RLS enabled / no policy` information notices remain expected for deny-by-default service-only tables, and the existing leaked-password-protection Auth warning remains unrelated to this programme canonicalization.

Performance review found no new Phase 4 U.S. foreign-key or index problem. Existing project-wide unindexed-foreign-key and unused-index notices remain outside this phase.

## 13. Phase boundary

Phase 4 is complete when:

- the two production migrations are applied;
- all 24 verified programmes have deterministic canonical identities and offerings;
- the 65 reviewed career relations survive canonicalization;
- explorer/detail/compare read models match the verified cohort;
- no qualification framework, programme location or programme-specific international eligibility is fabricated;
- all read models remain server-only;
- repository regression tests and full CI pass.

Phase 5 remains explicitly out of scope until requested.
