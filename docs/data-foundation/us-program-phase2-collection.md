# US Programs — Phase 2 Bounded Collection

Date: 2026-08-10  
Branch: `agent/programs-us`  
Scope: United States `/programs` Phase 2 only. This phase creates server-only staging and a compact occupation-led seed. It does not canonicalize programmes, publish UI routes, infer programme locations, complete SEVP/STEM OPT verification, merge to `main`, deploy, or start another country.

## 1. Product boundary

Phase 2 preserves the Phase 1 rule: CampCareer is not importing the national U.S. programme catalogue.

The broad `ingest.programs_us` dataset remains discovery/analytics input only. The Phase 2 product seed contains exact current institution programmes with official programme/catalogue sources and at least one reviewed relation to CampCareer's canonical 80 programme-matching careers.

The canonical target set remains the 80 approved `CA / v1` career IDs in `public.program_occupation_match_rules`. No new career IDs are invented for U.S. collection.

## 2. Applied production migrations

- `20260810175110_us_program_phase2_staging_foundation`
- `20260810175420_us_program_phase2_bounded_seed`
- `20260810175448_us_program_phase2_staging_indexes`

Phase 2 creates:

- `public.program_catalog_us_staging`
- `public.program_occupation_us_staging`
- `public.program_international_us_staging`

All three staging tables are server-only collection surfaces:

- RLS enabled;
- privileges revoked from `public`, `anon`, and `authenticated`;
- `service_role` CRUD granted;
- no end-user RLS policies intentionally, producing deny-by-default access.

## 3. Bounded cohort

The final seed contains **24 programmes across 8 existing Tier A institutions**. The initial provider pool is deliberately narrower than the full 25-institution Tier A institution cohort because row count is not a goal.

### University of Michigan — UNITID 170976

1. Civil Engineering — B.S.E.
2. Industrial and Operations Engineering — B.S.E.
3. Nursing — B.S.N.

### University of Washington — UNITID 236948

4. Informatics — B.S.
5. Civil Engineering — B.S.
6. Social Welfare — B.A.S.W.

### Cornell University — UNITID 190415

7. Hotel Administration — B.S. — exact official CIP `52.0904`
8. Food Science — B.S. — exact official CIP `01.1001`
9. Architecture — B.Arch. — exact official CIP `04.0902`

### University of Minnesota Twin Cities — UNITID 174066

10. Forest and Natural Resource Management — B.S.
11. Food Science — B.S.
12. Plant Science — B.S.

### The University of Texas at Austin — UNITID 228778

13. Civil Engineering — B.S.
14. Accounting — B.B.A.
15. Interior Design — B.S.

### Penn State — UNITID 214777

16. Supply Chain and Information Systems — B.S.
17. Cybersecurity Analytics and Operations — B.S.
18. Mechanical Engineering — B.S.

### University of Wisconsin–Madison — UNITID 240444

19. Data Science — B.S.
20. Environmental Engineering — B.S.
21. Information Science — B.A.

### New York University — UNITID 193900

22. Integrated Design and Media — B.S. — exact official CIP `11.0103`
23. Hospitality, Travel and Tourism Management — B.S. — exact official CIP `52.0901`
24. Computer Science — B.S. — exact official CIP `11.0101`

## 4. Occupation coverage

Production invariant after the seed:

- programmes: **24**
- providers: **8**
- approved programme↔career relations: **65**
- distinct target careers covered: **42 / 80**
- relations outside the canonical 80: **0**

The 42 represented careers are:

`accountant`, `agronomist`, `animator`, `architect`, `auditor`, `business-analyst`, `civil-engineer`, `cloud-engineer`, `community-worker`, `construction-manager`, `cybersecurity-analyst`, `data-analyst`, `data-engineer`, `database-administrator`, `environmental-engineer`, `environmental-scientist`, `event-planner`, `farm-manager`, `financial-analyst`, `food-technologist`, `forestry-technician`, `horticulturist`, `hospitality-supervisor`, `hotel-manager`, `industrial-engineer`, `interior-designer`, `logistics-coordinator`, `manufacturing-engineer`, `mechanical-engineer`, `multimedia-designer`, `network-administrator`, `project-manager`, `registered-nurse`, `restaurant-manager`, `social-worker`, `software-developer`, `supply-chain-analyst`, `tourism-manager`, `ux-designer`, `warehouse-manager`, `web-designer`, `youth-worker`.

## 5. Relation semantics

Phase 2 preserves three relationship strengths:

- `direct`: the named programme is a defensible education pathway to the target career;
- `common_pathway`: the programme is a common, relevant route but does not define the occupation by itself;
- `related`: useful education relationship without claiming equivalence.

Examples of conservative handling:

- Michigan Nursing → `registered-nurse`: `direct`, while NCLEX/state licensure remains separate.
- Cornell B.Arch. → `architect`: `direct`, while professional licensure remains separate.
- Minnesota Forest and Natural Resource Management → `forestry-technician`: `related` because the four-year degree is above technician level and must not be presented as technician-equivalent.
- Computer Science → `web-designer`: `related`, because technical web implementation is not the same as a design credential.

Programme relevance never means guaranteed professional registration, licence, immigration status, or employment outcome.

## 6. CIP policy

Only **6 / 24** seed rows currently carry `cip_evidence_status='verified'`, because those programme-level official catalogue sources expose an exact CIP:

- Cornell Hotel Administration — `52.0904`
- Cornell Food Science — `01.1001`
- Cornell Architecture — `04.0902`
- NYU Integrated Design and Media — `11.0103`
- NYU Hospitality, Travel and Tourism Management — `52.0901`
- NYU Computer Science — `11.0101`

The other 18 programmes intentionally keep CIP unresolved in Phase 2 rather than copying or guessing a broad IPEDS/Scorecard field classification.

## 7. International / SEVP / OPT boundary

All 24 programmes have a corresponding `program_international_us_staging` row, but Phase 2 does **not** positively assert international admission, SEVP or STEM OPT status.

Current conservative state:

- international-student eligibility: `NULL`
- international admission: `eligible_schedule_unknown`
- SEVP status: `unresolved` for **24 / 24**
- STEM-designated CIP status: `NULL` for **24 / 24**
- verification status: programme identity verified, context pending

Even the 6 rows with exact programme-level CIP do not receive a positive STEM designation in Phase 2. Phase 3 must independently match the exact CIP against the current DHS STEM list and retain the list/check date. OPT/STEM OPT remains applicant/status-sensitive and is never stored as a guaranteed applicant outcome.

## 8. Location policy

Programme delivery assertions remain **0**.

Phase 2 does not use:

- institution address;
- existing city↔institution links;
- IPEDS institution geography;
- SEVP main-campus information

as programme delivery evidence. Programme city/campus remains null until an exact programme-level source supports the linkage.

## 9. Security and performance review

Supabase advisors were re-run after the Phase 2 DDL.

Security:

- the three US staging tables appear under `RLS enabled / no policy` INFO;
- this is intentional for the service-role-only deny-by-default staging pattern;
- no public/anon/authenticated grants were added.

Performance:

- no new US staging `unindexed_foreign_keys` advisory was introduced;
- the new US indexes currently appear as `unused_index` INFO because they are newly created and have not accumulated workload yet;
- unrelated pre-existing project-wide advisor findings remain outside this phase.

## 10. Phase 3 handoff

Phase 3 should verify only this bounded 24-programme cohort unless scope is explicitly changed.

Required next checks:

1. confirm current programme/international application route for each row;
2. resolve exact SEVP school/campus context separately from programme location;
3. verify exact CIP for unresolved programmes where authoritative evidence exists;
4. match verified CIPs against the current DHS STEM Designated Degree Program List;
5. preserve OPT/STEM OPT as rule context, never applicant guarantees;
6. strengthen accreditation/licensure boundaries for regulated careers;
7. resolve current intake/deadline only from current official evidence;
8. keep programme city/campus null unless programme-level delivery evidence exists.

Phase 3 is not part of this phase and is not started by this document.
