# NL Programs — Phase 3 Verification

Date: 2026-08-10
Branch: `agent/programs-nl`
Scope: Netherlands only. Phase 4 is not started.

## Goal

Verify the bounded Phase 2 cohort before canonical publication:

1. reject structural duplicates and incomplete source identities;
2. refresh current official programme and international-admission evidence;
3. assign conservative publication verification tiers;
4. normalize application-window state separately from programme eligibility;
5. preserve unresolved HBO provider identities without expanding `/institutions/nl` as a side effect.

## Structural verification

The 37-row Phase 2 programme cohort passed the Phase 3 preconditions:

- programme rows: 37;
- programme-level international rows: 37, one-to-one;
- duplicate `(source_name, source_program_key)` groups: 0;
- duplicate normalized provider/title groups: 0;
- duplicate non-null recognised programme-code groups: 0;
- missing official programme URLs: 0;
- approved programme-career links without source/review dates: 0.

No staged programme was removed as a duplicate during this checkpoint.

## Official-source refinements

### University of Twente

The 11 Twente rows were upgraded from a shared bachelor overview to exact official programme pages where necessary.

All 11 now carry an exact recognised programme code and exact programme URL. Current Twente programme pages also establish full-time provision and NVAO accreditation. International bachelor eligibility is backed by Twente's current foreign-diploma admission requirements for the September 2026 intake.

### Wageningen University & Research

The current WUR international-prior-education bachelor admission source explicitly identifies all eight staged English-taught bachelor programmes and their subject requirements. All eight therefore have programme-family international admission evidence rather than institution sponsor evidence alone.

### University of Amsterdam — Business Analytics

Business Analytics has a dedicated international-prior-education application route, so international eligibility is verified. The September 2026 / 2026-2027 application window is currently closed, which is modelled separately from programme eligibility.

### HBO provider candidates

HZ University of Applied Sciences, HAN University of Applied Sciences and Breda University of Applied Sciences have current programme-level international/full-time evidence and current IND Study sponsor evidence.

They remain Tier C because their CampCareer canonical institution identities are intentionally not created as a side effect of programme verification. Eleven HBO programmes therefore remain staged provider candidates.

## Verification tiers

Phase 3 policy:

- Tier A: canonical NL provider + current official programme source + IND Study sponsor evidence + full-time evidence + programme-level international eligibility/admission evidence.
- Tier B: canonical provider + sponsor + current programme evidence, but programme-level international evidence remains unresolved.
- Tier C: provider identity or another publication-critical dimension remains unresolved.

Production result:

- Tier A: 26 programmes;
- Tier B: 0 programmes;
- Tier C: 11 programmes.

Tier A spans 7 canonical institutions.

Programme-career relations attached to Tier A:

- 56 approved relations;
- 30 distinct canonical careers.

Tier C relations remain staging-only and must not leak into a Phase 4 canonical publication model.

## Admission-state normalization

`program_international_nl_staging.canonical_admission_state` was added with the publication-facing values:

- `open`
- `closed`
- `not_yet_open`
- `restricted`
- `eligible_schedule_unknown`
- `unknown`

Current result:

- closed: 1 (`uva-business-analytics`);
- eligible_schedule_unknown: 36;
- all other states: 0.

The conservative default is deliberate. Programme existence, international eligibility, or an IND sponsor record must not be interpreted as proof that the current application window is open.

## International-study rule

IND Study sponsor recognition remains institution-level evidence. A programme is not Tier A merely because its provider is an IND recognised sponsor.

For Phase 3, Tier A additionally requires current programme-level international evidence and full-time evidence. Accreditation evidence is captured explicitly where directly available, but an accreditation boolean is not fabricated when the current official provider and Dutch recognition sources already identify the programme and no exact accreditation record was collected in this bounded checkpoint.

## Migration

Production migration history:

- `20260810104453_nl_program_phase3_verification`

Repository migration:

- `supabase/migrations/20260810104453_nl_program_phase3_verification.sql`

## Phase 3 decision

Phase 3 is complete for the bounded 37-programme cohort.

Ready for a future Phase 4:

- canonicalization candidate cohort: Tier A 26;
- Tier B: 0;
- Tier C: 11, excluded until provider identity is resolved;
- do not auto-create HZ/HAN/BUas canonical institutions during programme canonicalization;
- do not infer programme campus/city beyond exact programme evidence;
- do not infer an open application window from general admission eligibility.

Phase 4 is not started in this checkpoint.
