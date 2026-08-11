# Ireland Programs — Phase 3 Verification

Date: 2026-08-10
Branch: `agent/programs-ie`
Status: `PHASE_3_COMPLETE_WITH_PUBLICATION_GATE`
Scope: Ireland (`IE`) only. United States work remains out of scope.

## Goal

Verify the Phase 2 bounded Ireland programme cohort against current provider and international-study evidence before canonical publication.

Phase 3 keeps these claims separate:

1. current programme identity;
2. provider-level TrustEd Ireland authorisation;
3. exact TrustEd / ILEP eligible-programme status;
4. full-time daytime study mode;
5. provider admission of non-EU applicants;
6. current application timing;
7. student-permission context;
8. profession-specific registration or protected-title requirements.

No Ireland public explorer/detail view, sitemap route or canonical publication is created in Phase 3.

## Production migration

Applied migration:

- `20260810171125_ie_program_phase3_current_verification`

The migration updates the existing private Phase 2 staging relations only:

- `public.program_catalog_ie_staging`
- `public.program_international_ie_staging`
- `public.program_occupation_ie_staging`

The existing server-only RLS and privilege boundary is unchanged.

## Verification tiers

### Tier A

Tier A requires exact programme-level international-study evidence, including an exact TrustEd / ILEP eligible-programme match where that evidence is required for the student-permission route.

Phase 3 result: `0` Tier A programmes.

This is intentional. TrustEd Ireland publishes an official eligible-programme workbook, but the exact workbook rows were not promoted into CampCareer during this pass. Provider authorisation or a provider's international application route is not treated as a substitute for that exact programme-level evidence.

### Tier B

Tier B means:

- current official provider programme page resolved;
- current provider identity resolved;
- provider-level TrustEd Ireland authorisation already recorded;
- provider-level programme admission evidence supports non-EU applicants;
- no contradiction with the standard student-permission route was found;
- exact TrustEd eligible-programme row remains pending.

Phase 3 result: `28` programmes.

Tier B is review-ready, not publication-ready.

### Tier C

Tier C covers pathways that are restricted, not standard student-permission routes, or still lack sufficient current provider evidence.

Phase 3 result: `12` rows:

- 4 higher-education programmes;
- 8 employment-based apprenticeships.

The higher-education Tier C exceptions are:

1. UCD MSc Cybersecurity — current official page confirms two-year part-time blended study and explicitly states that part-time courses are not eligible for a Study Visa. CampCareer therefore marks the standard international student-permission route false/restricted.
2. University of Limerick Computer Science legacy row — current official provider programme source was not sufficiently resolved in this pass, so legacy Qualifax is not promoted.
3. University of Limerick Electrical Engineering legacy row — same current-provider evidence boundary.
4. MTU Marine Engineering — current full-time programme is verified, but non-EU access is conditional and normally requires approved international shipping-company sponsorship plus maritime entry requirements. It is not represented as a general international-student route.

The 8 apprenticeship rows remain employment-based pathways and are not treated as ordinary student programmes.

## Current programme evidence

Phase 3 production state:

- total bounded rows: 40;
- higher education: 32;
- employment-based apprenticeship: 8;
- current official provider programme evidence resolved: 30 / 32 higher-education rows;
- official provider programme URLs stored: 30;
- Tier A: 0;
- Tier B: 28;
- Tier C: 12.

Official programme evidence was resolved across:

- Dublin City University;
- Trinity College Dublin;
- University College Dublin;
- University College Cork;
- University of Limerick for Construction Management and Engineering;
- University of Galway;
- Technological University Dublin;
- Maynooth University;
- Munster Technological University.

The two unresolved provider-programme pages are kept visibly unresolved rather than being substituted with third-party listings.

## International admission snapshot

Across all 40 staging rows after Phase 3:

- `international_students_eligible = true`: 28;
- `international_students_eligible = false`: 1;
- eligibility unresolved / not applicable: 11;
- full-time daytime verified true: 27;
- full-time daytime verified false: 1;
- full-time daytime unresolved / not applicable: 12.

Admission states as of 2026-08-10:

- open: 5;
- closed: 22;
- restricted: 10;
- unknown: 2;
- eligible schedule unknown: 1.

The five open rows are the currently source-backed 2026 international routes in the bounded cohort, including UCD Agricultural Science, the three University of Galway programmes, and Maynooth MSc UX&I.

A provider accepting non-EU applicants is not by itself proof of immigration eligibility. Exact TrustEd / ILEP eligible-programme status remains `not_programme_verified` for all 32 higher-education rows in this phase.

## TrustEd / ILEP boundary

Ireland's student-permission model requires eligible study rather than a generic `international` market flag. The official TrustEd Ireland programme-checking surface distinguishes provider authorisation from the list of eligible programmes.

Phase 3 therefore preserves:

- provider-level TrustEd authorisation: verified for the 32 selected higher-education rows;
- exact programme-level TrustEd / ILEP status: not yet asserted;
- `eligible_programme_source_url`: not populated by inference;
- Tier A count: zero.

This prevents a provider-level quality mark or a university international application form from being misrepresented as an immigration eligibility guarantee.

## Full-time daytime boundary

Irish student permission requires eligible full-time study. Part-time or primarily distance/blended programmes must not be promoted as standard student-permission routes.

The clearest exclusion in this cohort is UCD MSc Cybersecurity. The provider currently labels it part-time and blended and explicitly says part-time courses are not eligible for a Study Visa.

Maynooth BA Accounting and Finance and BSc Data Science have current programme and international-application evidence, but Phase 3 does not assert the separate `full_time_daytime_verified` flag because an explicit full-time daytime statement was not resolved in this pass. They remain Tier B rather than being upgraded by inference.

## Profession-specific boundaries

Programme-to-career mapping remains educational relevance only.

Phase 3 adds explicit review notes for regulated/protected-title pathways:

- Primary school teacher: DCU is an accredited initial teacher education provider, but Teaching Council registration, qualification and vetting requirements remain separate.
- Radiographer: CORU lists Trinity MSc Diagnostic Radiography as an approved qualification, but CORU registration and protected-title requirements remain separate.
- Architect: the title `Architect` is statutorily protected in Ireland; completion of the UCD or TU Dublin architecture programme does not by itself equal registration on the Register of Architects.

These notes do not create programme accreditation records or licensing guarantees.

## Security and advisor review

No new public relation or view was created in Phase 3.

The three Ireland staging relations remain:

- RLS enabled;
- no `anon` / `authenticated` privileges;
- service-role only for collection access.

The Supabase security advisor continues to report the intentional `RLS enabled / no policy` INFO pattern for private staging. No new Phase 3 security regression was introduced. The performance advisor reports no new Phase 3 foreign-key issue; the existing Ireland institution index remains present and may still appear as initially unused.

## Phase 3 release gate

Phase 3 is complete when all of these remain true:

1. the bounded cohort remains 40 rows;
2. Tier distribution is A 0 / B 28 / C 12;
3. 30 current official provider programme URLs are stored;
4. exact TrustEd programme eligibility is asserted for zero rows unless an exact eligible-programme source is captured;
5. UCD part-time Cybersecurity is not represented as a standard Study Visa route;
6. MTU Marine Engineering remains conditional rather than generally eligible;
7. unresolved UL programme identities remain Tier C;
8. regulated-profession notes do not become automatic registration claims;
9. apprenticeship rows remain employment-based pathways;
10. staging stays private and no Ireland public programme route is created;
11. United States Programs remains untouched.

## Publication gate / next phase

Phase 4 canonical publication should not promote Tier B merely because provider pages accept international applicants.

Before an Ireland programme can become publication Tier A, CampCareer should resolve and capture the exact current TrustEd / ILEP eligible-programme evidence for that programme and re-check any still-pending full-time daytime or admission dimension.

No Phase 4 work has been started.
