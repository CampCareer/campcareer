# US Programs — Phase 3 Verification

Date: 2026-08-10  
Branch: `agent/programs-us`  
Scope: verify the bounded 24-programme U.S. cohort created in Phase 2. This phase does not canonicalize programmes, publish `/programs`, infer programme locations, merge to `main`, deploy, or start another country.

## 1. Verification result

Production after Phase 3:

| Check | Result |
| --- | ---: |
| Tier A programmes | 24 |
| Providers | 8 |
| Current official programme identities re-checked | 24 / 24 |
| Approved programme↔career relations retained | 65 |
| Distinct target careers retained | 42 / 80 |
| Relations outside canonical 80 | 0 |
| Provider-level F-1 / I-20 context confirmed | 24 / 24 programme rows |
| Programme-specific international admission asserted `true` | 0 |
| International admission state `eligible_schedule_unknown` | 24 / 24 |
| Exact programme CIP verified | 6 / 24 |
| Exact CIP rows reviewed against STEM context | 6 / 6 |
| Positive STEM-designated CIP | 4 |
| Exact-CIP STEM state left unresolved | 2 |
| Programme delivery city/campus assertions | 0 |
| Rows with programme/accreditation context | 13 / 24 |

Phase 3 deliberately allows `verified` context rows to coexist with unknown programme-specific admission schedules. Verification means the evidence layers were checked and their current state was recorded; it does not mean every nullable field became positive.

## 2. Programme currentness

All 24 Phase 2 programme identities were re-checked against their current official institution programme or catalogue pages on 2026-08-10. The bounded cohort remains intact: no programme was added solely to increase row count and no Tier B provider was introduced.

The production rows now use:

- `collection_status = 'phase3_verified_current_program'`;
- `source_as_of = '2026-08-10'`.

The programme identity check remains separate from current application-window verification.

## 3. International student / SEVP boundary

All eight providers publish current F-1 / Form I-20 / SEVIS-facing guidance through their official international-student offices. Phase 3 therefore records provider-level `sevp_status = 'confirmed'` on the 24 programme context rows.

This is intentionally **not** a programme-specific international-admission claim.

For all 24 programmes:

- `international_students_eligible` remains `NULL`;
- `international_admission_status` remains `eligible_schedule_unknown`;
- no current intake or deadline is fabricated;
- provider F-1/I-20 evidence is not reused as programme-delivery evidence.

Provider evidence used:

- University of Michigan International Center — new F-1 students require a U-M I-20;
- University of Washington ISS — UW-issued I-20 / F-1 guidance;
- Cornell International Services — Cornell issues I-20 forms to admitted F-1 students;
- University of Minnesota ISSS — incoming F-1 students request a UMN I-20;
- UT Austin Texas Global — UT issues Form I-20 for F-1 students;
- Penn State Global — Penn State I-20 / SEVIS / F-1 process;
- UW–Madison ISS — campus-issued I-20 and SEVIS guidance;
- NYU Office of Global Services context — immigration support and I-20/visa processes for NYU students.

The stored `sevp_campus_context` explicitly says provider-level F-1/I-20 sponsorship is **not programme-delivery evidence**.

## 4. F-1 visa / OPT / STEM OPT boundary

The U.S. Department of State student-visa process and USCIS practical-training rules remain separate from programme existence.

Stored Phase 3 semantics:

- acceptance by a SEVP-approved school, SEVIS/Form I-20 and visa issuance are separate applicant-level steps;
- a visa result is never guaranteed by a CampCareer programme row;
- OPT is temporary practical training related to an eligible F-1 student's area of study and requires authorization;
- STEM OPT is additionally dependent on the exact degree CIP appearing on the DHS STEM list plus DSO, employer and USCIS requirements;
- programme title keywords never create STEM designation.

## 5. Exact CIP and STEM review

Six Phase 2 programmes had exact CIP evidence from current programme/catalogue sources. Phase 3 reviewed those six only.

### Positive STEM-designated CIP

1. Cornell Food Science BS — `01.1001`
2. Cornell Architecture B.Arch. — `04.0902`
3. NYU Computer Science BS — `11.0101`
4. NYU Integrated Design and Media BS — `11.0103`

These are CIP-level designations. They do not guarantee that a specific student receives STEM OPT authorization.

### Exact CIP retained but STEM state unresolved

1. NYU Hospitality, Travel and Tourism Management BS — `52.0901`
2. Cornell Hotel Administration BS — `52.0904`

Phase 3 did not convert these to `false` merely because direct current list-membership evidence was not retained during verification. `NULL` is preferable to an unsupported negative claim.

For the other 18 programmes, exact programme-level CIP remains unresolved, so no STEM designation is attempted.

The stored list context is:

`DHS STEM Designated Degree Program List; checked 2026-08-10; latest published update located 2024-07-23`.

The current ICE practical-training page remains the authoritative list entrypoint. The latest Federal Register update located during this review was effective 2024-07-23 and added one field without removing existing fields.

## 6. Accreditation and regulated-career verification

Phase 3 strengthened current official programme accreditation evidence for:

- University of Michigan Civil Engineering — EAC/ABET;
- University of Washington Civil Engineering — EAC/ABET;
- University of Washington BASW — CSWE;
- UT Austin Civil Engineering — EAC/ABET through the Cockrell undergraduate engineering accreditation statement;
- Penn State Mechanical Engineering — EAC/ABET.

These add to Phase 2 accreditation context already present for programmes such as Michigan IOE, Michigan BSN, Cornell Architecture, Minnesota Forest and Natural Resource Management, UT Interior Design and Wisconsin Environmental Engineering.

After Phase 3, 13 of the 24 programme rows carry programme/accreditation context.

Accreditation is not licensure. Existing programme→career reviewer notes continue to preserve boundaries such as:

- Nursing BSN → registered nurse: NCLEX and state licensure remain separate;
- BASW → social worker: state licensure rules remain separate;
- B.Arch. → architect: professional licensure remains separate;
- engineering degrees → engineer careers: PE requirements remain state- and applicant-specific.

## 7. Location boundary

Programme delivery remains deliberately unresolved unless programme-level delivery evidence is collected.

Phase 3 final invariant:

- `programme_delivery_verified = true`: 0;
- programme city/campus assertions: 0.

Institution address, city directory membership, an I-20 issuing campus, a SEVP main campus, or an accreditation location must not be reused as a programme-delivery claim.

## 8. Production migration

Applied migration:

- `20260810200123_us_program_phase3_verification`

Repository migration:

- `supabase/migrations/20260810200123_us_program_phase3_verification.sql`

The migration contains preflight and post-apply invariants for:

- 24 programmes / 8 providers;
- 65 approved relations / 42 careers;
- 6 exact CIP rows;
- 24 provider F-1 contexts;
- zero programme-specific international positives;
- 24 schedule-unknown rows;
- 4 positive STEM CIP rows;
- 2 exact-CIP STEM-unresolved rows;
- zero programme-delivery assertions.

## 9. Phase boundary

Phase 3 is verification only.

Phase 4 may canonicalize the verified cohort, but must preserve:

- stable source programme identity rather than staging IDs;
- canonical 80 occupation boundary;
- `direct` / `common_pathway` / `related` semantics;
- programme existence vs international admission vs SEVP vs visa vs OPT/STEM OPT separation;
- unresolved exact CIP and STEM states where evidence is incomplete;
- professional accreditation vs professional licensure separation;
- no inferred programme city/campus.

Phase 4 is not started by this work.
