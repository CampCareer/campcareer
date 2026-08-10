# NZ Programs — Phase 2 Bounded Collection

Date: 2026-08-10
Branch: `agent/programs-nz`
Scope: New Zealand only. Phase 2 deliberately covers only programmes relevant to CampCareer’s canonical 80 occupation programme-matching categories. It is not a general New Zealand programme catalogue.

## Phase 2 goal

Build a small, defensible programme staging cohort that is useful for CampCareer’s occupation-led product.

The collection rule is strict:

1. every staged programme must have at least one reviewed relation to the canonical 80 programme-matching careers;
2. unrelated degrees are out of scope even when they are prominent university programmes;
3. one programme may support multiple careers when the relationship is explicitly reviewed;
4. `direct` and `related` relationships remain distinct;
5. Phase 2 does not canonicalize, publish or infer programme delivery locations.

## Production staging foundation

Applied migrations:

- `20260810125846_nz_program_phase2_staging_foundation`
- `20260810130426_nz_program_phase2_bounded_seed`
- `20260810131112_nz_program_phase2_staging_indexes`

Server-only staging tables:

- `public.program_catalog_nz_staging`
- `public.program_occupation_nz_staging`
- `public.program_international_nz_staging`

All three staging tables have RLS enabled. `anon` and `authenticated` access is revoked; the operational staging surface is service-role only. The catalogue `institution_id` foreign key has a covering index after the Phase 2 performance-advisor pass.

## Bounded cohort

The initial seed contains exactly:

- 24 programmes;
- 8 existing canonical New Zealand universities;
- 3 selected programmes per university;
- 39 approved programme-to-career relations;
- 35 distinct careers from the canonical 80 programme-matching occupations;
- 0 programme-to-career relations outside the canonical 80;
- 24 international-context placeholder rows, one per programme;
- 0 asserted programme delivery-campus/city links.

The 35/80 coverage count is not a target to maximize in Phase 2. The objective is a compact representative cohort with high occupation relevance. Trades, technician, vocational and other careers should not be force-filled with unrelated university degrees merely to increase coverage.

## Programme selection

### University of Auckland

- Civil Engineering — direct `civil-engineer`; related `construction-manager`.
- Software Engineering — direct `software-developer`; related `cloud-engineer`, `web-designer`, `project-manager`.
- Data Science — direct `data-analyst`; related `data-engineer`, `database-administrator`.

### Auckland University of Technology

- Nursing — direct `registered-nurse`.
- Midwifery — direct `midwife`.
- Physiotherapy — direct `physiotherapist`.

### University of Otago

- Physiotherapy — direct `physiotherapist`.
- Pharmacy — direct `pharmacist`.
- Medical Laboratory Science — related `medical-laboratory-technician`; this is explicitly treated as a related higher-level laboratory pathway rather than claiming technician equivalence.

### Massey University

- Construction Management — direct `construction-manager`; related `project-manager`.
- Food Technology — direct `food-technologist`.
- Aviation, Air Transport Pilot — direct `commercial-pilot`.

### University of Canterbury

- Electrical and Electronic Engineering — direct `electrical-engineer`; related `engineering-technician` with a scope caveat.
- Forestry Science — related `forestry-technician`; this is not represented as a technician qualification.
- Social Work — direct `social-worker`.

### Lincoln University

- Agricultural Science — direct `agronomist`; related `farm-manager`.
- Environmental Management — related `environmental-scientist`; direct `sustainability-specialist`.
- Tourism Management — direct `tourism-manager`; related `hotel-manager`, `event-planner`.

### University of Waikato

- Teaching, Early Childhood — direct `early-childhood-teacher`.
- Teaching, Primary — direct `primary-school-teacher`.
- Business, Accounting — direct `accountant`; related `auditor`.

### Victoria University of Wellington

- Interaction Design — direct `ux-designer`; related `web-designer`.
- Communication Design — direct `graphic-designer`; related `multimedia-designer`.
- Human Resource Management and Employment Relations — direct `human-resources-specialist`.

## Deliberate exclusions

This seed does not attempt to represent every university subject or every possible occupation.

Examples of deliberate exclusions include:

- degrees with no relationship to the canonical 80 programme-matching careers;
- a Dentistry programme because `dentist` is not in the current 80-category programme-matching rule set;
- university degrees used as synthetic substitutes for trades such as electrician, plumber, carpenter, welder or automotive technician;
- generic provider-level programmes discovered only from aggregators;
- programmes whose current official identity could not be anchored to an official institution page;
- polytechnic/PTE expansion solely for coverage count.

Non-university providers remain valid future collection candidates when an exact canonical target career has a substantive vocational/applied pathway and the current provider/programme identity can be verified. That is a later bounded expansion decision, not a Phase 2 requirement.

## International-study boundary

Phase 2 intentionally does not convert programme existence into an international-admission claim.

For all 24 rows:

- `international_students_eligible` remains null pending programme-level verification;
- admission state remains `eligible_schedule_unknown`;
- Code-signatory status remains `not_programme_verified`;
- Post Study Work Visa eligibility is not inferred;
- current intake and application deadline are not inferred.

Phase 3 must verify these independently using current provider, NZQA/Code and Immigration New Zealand evidence where applicable.

## Location boundary

The existing NZ institution/city foundation is not programme-delivery evidence.

The seed therefore has:

- `programme_delivery_verified = false` for every row;
- no programme delivery source URL;
- no canonical city/campus relation created from institution presence.

A later phase may add location only from programme-specific or authoritative delivery evidence.

## Database invariants

The bounded seed migration fails if any of the following is violated:

- programme count is not exactly 24;
- the cohort does not span all 8 existing universities;
- an official programme URL is missing or is not HTTPS;
- approved relation count is not exactly 39;
- distinct target-career coverage is not exactly 35;
- any programme has zero approved target-career relations;
- any approved relation falls outside the canonical 80 `program_occupation_match_rules` set;
- international-context rows are not one-to-one with the 24 programmes;
- any programme delivery location is asserted in Phase 2.

## Phase 2 decision

Phase 2 is complete at the bounded staging level.

The working dataset is intentionally small: 24 programmes rather than a broad New Zealand catalogue. Every programme exists because it supports the occupation-led CampCareer product, not because it happens to be offered by a university.

## Phase 3 handoff

Phase 3 should stay within this 24-programme cohort first and verify:

1. current official programme identity and title;
2. programme-level international-student eligibility;
3. current application route, intake and deadline where safely supportable;
4. Code-signatory/international learner context where relevant;
5. qualification-sensitive Post Study Work Visa context without inference;
6. regulated-profession or licensing caveats for health, teaching, aviation and other controlled occupations;
7. whether each `related` relation remains defensible after programme-level review;
8. programme delivery city/campus only where current authoritative evidence explicitly supports it.

Do not expand to unrelated programmes or another country during that verification pass.
