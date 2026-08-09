# UK Programs — Phase 3 Verification

Date: 2026-08-09
Branch: `agent/programs-uk`
Scope: United Kingdom only.

## Phase 3 objective

Phase 3 converts the evidence collected in Phase 2 into publication-readiness tiers without collapsing distinct facts into one flag.

The following remain independent:

- official programme existence;
- canonical provider identity;
- Student sponsor evidence;
- programme-level international-student eligibility;
- current admission state;
- CAS issuance;
- occupation relevance;
- publication readiness.

## Regulatory semantics

Current GOV.UK Student visa guidance requires an unconditional offer from a licensed Student sponsor. The provider sends the student a Confirmation of Acceptance for Studies (CAS) after offering a place. CAS is therefore student-specific post-offer evidence and is not a static programme-catalogue attribute.

Sources checked 2026-08-09:

- Student visa course/CAS guidance: https://www.gov.uk/student-visa/course
- Register of licensed Student sponsors: https://www.gov.uk/government/publications/register-of-licensed-sponsors-students
- Student sponsor licence/CAS guidance: https://www.gov.uk/guidance/apply-for-a-student-sponsor-licence

The licensed-sponsor register was last updated 2026-07-28 at the time of this verification.

## Tier rules

### Tier A

A programme is Tier A when all of the following are true:

1. canonical UK institution identity is linked;
2. current official programme URL and source date exist;
3. Student-sponsor evidence is positive;
4. programme-level international-student eligibility is positive;
5. programme-level international source URL and source date exist;
6. the international verification state is not unresolved.

A closed current intake does not by itself disqualify an otherwise source-verified programme from Tier A. Programme existence, international eligibility and current application availability are different facts.

CAS is not required for Tier A and must remain unknown unless a student-specific post-offer CAS can legitimately exist.

### Tier B

Tier B requires canonical provider identity, official programme evidence and Student-sponsor evidence, but one programme-level publication-eligibility dimension remains unresolved.

Current Tier B record:

- University of Glasgow — Community Development BA, because the exact programme is current and the university is a Student sponsor, but programme-level Student-route/international eligibility remains intentionally unresolved for this work-based course.

### Tier C

Tier C is retained where canonical provider identity or programme-level international evidence is not publication-ready.

Current Tier C provider-identity blockers:

- City of Glasgow College — 8 programmes;
- Leicester College — 3 programmes;
- Bishop Burton College — 1 programme;
- Kingston University London — 1 programme;
- University of Huddersfield — 1 programme;
- University of South Wales — 1 programme;
- University of Westminster — 1 programme.

These providers are not force-matched to unrelated institutions. Adding new canonical institutions is deferred so that `/institutions/uk` is not expanded as a side effect of the programme verification phase.

## Verified database state

Production project: `babylusxcknjerxtepoc`.

- Programme staging rows: 92.
- Programme-level international rows: 92.
- Programme ↔ international evidence: 92/92 one-to-one.
- Tier A: 75.
- Tier B: 1.
- Tier C: 16.
- Official programme URL missing: 0.
- Programme source date missing: 0.
- International source URL missing: 0.
- International source date missing: 0.
- Source identity duplicate groups `(source_name, source_program_key)`: 0.
- Duplicate official programme URL groups: 0.
- Same-provider/same-title groups: 5, all verified as distinct qualifications such as BEng/MEng or BSc/MSc rather than duplicates.
- CAS known: 0.
- CAS unknown: 92.
- Student-sponsor eligible: 88.
- International-student eligible: 87.
- International eligibility unknown: 5.
- Approved programme ↔ career links: 108.
- Candidate programme ↔ career links: 0.
- Rejected programme ↔ career links: 0.
- Approved career coverage: 74/80.
- Tier A career coverage: 55/80.
- Tier A + B career coverage: 56/80.

## Canonical admission state

Phase 2 evidence-rich free-text admission descriptions are preserved. Phase 3 adds a separate stable publication-facing `canonical_admission_state`.

All 92 records normalize to:

- `open`: 22;
- `closed`: 17;
- `not_yet_open`: 1;
- `eligible_schedule_unknown`: 52;
- `restricted`: 0;
- `unknown`: 0.

Within Tier A:

- open: 17;
- closed: 9;
- not yet open: 1;
- eligible schedule unknown: 48.

A visible programme and confirmed international eligibility do not imply that applications are open today. `eligible_schedule_unknown` is retained whenever the evidence does not justify a stronger current-window state.

## Occupation coverage closeout

The Phase 2 collection queue has no candidate occupation relationships left. Six target careers remain without an approved UK programme relationship:

- `bricklayer`;
- `forestry-technician`;
- `hvac-technician`;
- `truck-driver`;
- `wall-floor-tiler`;
- `welder`.

These remain deliberate evidence gaps. No unrelated degree, domestic-only short course or licensing/training product is force-mapped merely to produce 80/80 coverage.

## Production migrations

Phase 3 production migration history:

- `20260809204821_uk_program_phase3_verification_tiers`
- `20260809205042_uk_program_phase3_admission_state_normalization`

Repository migration filenames are aligned to these production versions.

## Phase 3 completion gate

Phase 3 is complete for the current bounded 92-programme UK cohort when all of the following continue to hold:

- 92/92 programme-to-international evidence coverage;
- zero duplicate source identities;
- zero missing official programme URLs/source dates;
- Tier A rows have canonical institution identity plus positive Student-sponsor and programme-level international eligibility evidence;
- CAS remains uninferred;
- occupation review queue remains empty;
- Tier C provider-identity gaps remain unpublished until their institution scope is intentionally resolved.

Phase 4 should canonicalize and publish only the Tier A/B cohort, with Tier B accessible but non-indexable unless the shared publication policy is changed deliberately. Tier C must not leak into the public UK programme explorer.
