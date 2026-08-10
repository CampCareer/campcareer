# NZ Programs — Phase 3 Verification

Date: 2026-08-10
Branch: `agent/programs-nz`
Scope: New Zealand only. Phase 3 verifies the 24-program occupation-led Phase 2 cohort. It does not broaden the catalogue, canonicalize programmes, publish routes, or start another country.

## Verification policy

CampCareer’s programme work remains subordinate to the canonical 80 programme-matching occupations.

Phase 3 keeps these facts separate:

1. current programme identity;
2. reviewed programme-to-career relevance;
3. international-student study route;
4. provider Code context;
5. current application-window state;
6. student-visa / Post Study Work Visa context;
7. professional registration or licensing;
8. programme delivery location.

A current programme can be internationally eligible without having a currently verified open application window. Tier A therefore does not require `open` admission status.

## Production result

Applied migration:

- `20260810132813_nz_program_phase3_verification`

Verified cohort:

- 24 / 24 programmes retained;
- 8 / 8 existing canonical universities retained;
- Tier A: 24;
- Tier B: 0;
- Tier C: 0;
- current official programme/international sources complete: 24 / 24;
- international-study route verified: 24 / 24;
- provider Code context confirmed: 24 / 24 programme rows across 8 providers;
- approved programme↔career relations: 39;
- distinct target careers: 35 / 80;
- approved relations outside the canonical 80: 0;
- programme delivery city/campus assertions: 0.

No programme was added merely to increase coverage.

## Current admission state

Phase 3 marks a programme `open` only when a current official source gives a live application deadline as of 2026-08-10.

Open source-backed routes:

- University of Otago — Medical Laboratory Science: deadline 2026-08-13;
- University of Otago — Pharmacy: deadline 2026-08-13;
- University of Otago — Physiotherapy: deadline 2026-08-13;
- University of Waikato — Early Childhood Teaching: deadline 2026-08-24 for Trimester A 2027;
- University of Waikato — Primary Teaching: deadline 2026-08-24 for Trimester A 2027;
- Massey University — Air Transport Pilot: international Semester One selected-entry deadline 2026-10-01.

Canonical staging admission distribution:

- `open`: 6;
- `eligible_schedule_unknown`: 18;
- `closed`: 0;
- `not_yet_open`: 0;
- `restricted`: 0;
- `unknown`: 0.

The 18 schedule-unknown rows are not interpreted as closed. Programme existence and international eligibility do not imply that an application window is open today.

## International-study and Code boundary

All 24 programmes have current official evidence supporting an international study route.

Provider-level Code evidence was reviewed independently from provider identity. `NZ_MOE_PROVIDER_NUMBER` is not treated as proof of Code status. The Phase 3 rows store a separate official Code source for each of the eight providers and mark `code_signatory_status = confirmed` only after that review.

Code context is still not a student-visa decision and does not remove programme-specific entry conditions.

## Post Study Work Visa boundary

Phase 3 stores current Immigration New Zealand qualification-level context rather than an applicant-specific eligibility decision.

For the bounded cohort:

- New Zealand degrees at level 7 or above are represented with the current full-time / minimum-study-duration qualification context;
- the level 9 Master of Tourism Management retains the separate master-level duration context;
- no row states that a visa will be granted;
- no programme-to-career relation is used to infer immigration eligibility;
- professional registration remains separate from post-study work rights.

The announced 2026-11-16 rule changes are not applied early to the current 2026-08-10 state.

## Occupation relationship review

The Phase 2 relationship set remains intact at 39 approved links across 35 target careers.

Important scope controls remain:

- Otago Medical Laboratory Science → `medical-laboratory-technician` stays `related`, not direct;
- Canterbury Forestry Science → `forestry-technician` stays `related`, not direct;
- Canterbury Electrical and Electronic Engineering → `engineering-technician` stays `related`, not direct.

These higher-level university pathways are relevant to the occupation family but are not represented as technician qualifications.

For regulated or licensed pathways, Phase 3 adds an explicit registration/licensing boundary to the reviewed relation note. This includes nursing, midwifery, physiotherapy, pharmacy, social work, teaching and commercial aviation. A programme relation is educational relevance only and does not itself prove registration, licensing, visa or employment eligibility.

## Location boundary

Programme delivery remains unasserted in Phase 3.

- `programme_delivery_verified = false` for all 24 programmes;
- no programme delivery source URL is populated;
- institution presence is not converted into programme city/campus evidence.

Location integration belongs to a later phase only when authoritative programme-delivery evidence is available.

## Tier policy

### Tier A

Requires:

- canonical provider identity;
- current official programme source;
- at least one approved CampCareer target-career relation;
- current official international-route evidence;
- separately confirmed provider Code evidence;
- completed Phase 3 international verification.

A current open application window is not required.

### Tier B

Programme/provider identity and target-career relation are sound, but a publication-critical international or Code dimension remains unresolved.

### Tier C

Programme/provider identity or target relevance remains unresolved.

Phase 3 result: A 24 / B 0 / C 0.

## Phase 3 decision

Phase 3 is complete for the bounded NZ cohort.

The result remains intentionally small and occupation-led. No unrelated programme expansion occurred.

## Phase 4 handoff

Phase 4 may canonicalize only this verified 24-program Tier A cohort unless the user explicitly expands scope.

Phase 4 must preserve:

- the 80-occupation boundary;
- `direct` versus `related` relation semantics;
- application-state separation;
- Code / visa / professional-registration separation;
- the no-programme-city inference rule.

Phase 4 has not started.
