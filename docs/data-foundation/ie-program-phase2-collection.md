# Ireland Programs — Phase 2 Collection

Date: 2026-08-10
Branch: `agent/programs-ie`
Status: `PHASE_2_COMPLETE`
Scope: Ireland (`IE`) only. United States work remains out of scope.

## Goal

Create a private, reviewable Ireland programme cohort for CampCareer's canonical 80 programme-matching occupations without promoting the full 2,876-row legacy catalogue or inferring international-student eligibility.

Phase 2 is a staging and reviewed-relation phase. It does not create Ireland programme explorer/detail views, canonical programme identifiers, sitemap routes or public UI.

## Legacy boundary carried forward from Phase 1

Ireland already contains 2,876 canonical programme/offering rows derived from the older Qualifax ingestion. They remain useful for discovery and source provenance, but every corresponding canonical offering is `legacy_backfill` + `unverified`.

The Phase 2 cohort therefore does not treat legacy `market = international` as evidence that a non-EEA student may enrol. Programme existence, TrustEd/ILEP programme eligibility, full-time daytime study, admission timing, student permission and post-study graduate permission remain independent claims.

## Private staging

Production migrations:

- `20260810164130_ie_program_phase2_staging_foundation`
- `20260810164303_ie_program_phase2_bounded_seed`

Tables:

- `public.program_catalog_ie_staging`
- `public.program_occupation_ie_staging`
- `public.program_international_ie_staging`

All three are server-only staging relations:

- RLS enabled;
- `anon` has no table privileges;
- `authenticated` has no table privileges;
- `service_role` has SELECT/INSERT/UPDATE/DELETE;
- no public RLS policy is created by design.

## Bounded cohort

Production snapshot after Phase 2 seed:

- programme rows: 40;
- higher-education rows: 32;
- employment-based apprenticeship rows: 8;
- higher-education canonical institutions represented: 9;
- higher-education rows missing a canonical institution: 0;
- apprenticeship rows incorrectly attached to a university institution: 0;
- missing Qualifax provenance URLs: 0;
- duplicate `(source_name, source_program_key)` groups: 0.

The higher-education cohort uses a deliberately compact sample across:

- Dublin City University;
- Trinity College Dublin;
- University College Dublin;
- University College Cork;
- University of Limerick;
- University of Galway;
- Technological University Dublin;
- Maynooth University;
- Munster Technological University.

Legacy aliases are resolved to current canonical providers where needed. In particular, `University of Galway`, TU Dublin source labels and `MTU - Cork Campuses` are not allowed to create duplicate current institutions.

## Higher-education selection

The 32 higher-education programmes were chosen because their titles provide a clear reviewed relationship to one or more CampCareer target occupations. Examples include:

- Computer Science;
- Data Science & Artificial Intelligence;
- Primary Teaching;
- Diagnostic Radiography;
- Environmental Science & Engineering;
- Agricultural Science;
- Architecture;
- Cybersecurity;
- Accounting;
- Construction Management;
- Electrical Engineering;
- Civil Engineering;
- Cloud Computing;
- Culinary Arts;
- Film & Broadcasting;
- User Experience & Interaction;
- Chemical & Biopharmaceutical Engineering;
- Marine Engineering.

This is not a claim that only these programmes are relevant in Ireland. It is a controlled Phase 2 cohort designed for evidence review before publication.

## Apprenticeship boundary

Eight national craft apprenticeship records are retained separately as employment-based occupational pathways:

- Brick & Stonelaying;
- Carpentry & Joinery;
- Plumbing;
- Aircraft Mechanics;
- Electrical;
- Refrigeration & Air Conditioning;
- Metal Fabrication;
- Pipefitting.

They use `delivery_model = employment_based_apprenticeship`, `verification_tier = C`, and no canonical university institution link.

They must not be represented as ordinary international-student study routes. Employer hiring/registration requirements remain explicit and international-student eligibility is not asserted.

## Reviewed programme ↔ career relations

Production Phase 2 relationship state:

- approved relations: 63;
- programmes with at least one approved relation: 40 / 40;
- distinct CampCareer target careers covered: 41 / 80;
- relations outside the canonical target-career vocabulary: 0.

Relation semantics are deliberately conservative:

- `direct`: the programme title names the profession/discipline closely enough to support a direct educational pathway;
- `related`: the programme is a reasonable adjacent educational pathway but is not represented as a dedicated profession qualification;
- `common_pathway`: reserved for later reviewed cases and not used merely to inflate coverage.

Missing careers remain missing rather than being force-filled with weak or unrelated degrees.

Occupation relations are educational relevance only. They do not imply professional registration, licensing, work permission, immigration eligibility or guaranteed employment.

## International-study state

Every Phase 2 catalogue row has exactly one `program_international_ie_staging` row.

Higher education:

- 32 / 32 selected programme rows are attached to providers included in the first TrustEd Ireland higher-education authorisation cohort;
- provider-level TrustEd authorisation is stored separately from exact programme eligibility;
- exact `ILEP / TrustEd eligible programme` status remains `not_programme_verified`;
- `international_students_eligible` remains NULL;
- `full_time_daytime_verified` remains NULL;
- application timing remains `eligible_schedule_unknown`;
- verification state is `provider_authorised_programme_pending`.

Employment-based apprenticeships:

- exact student-programme eligibility is `not_applicable`;
- `international_students_eligible` remains NULL;
- admission state is `restricted` to make the non-standard access model visible;
- verification state is `employment_based_not_student_route`.

Across all 40 rows, Phase 2 makes zero positive programme-level international-eligibility assertions.

## Qualification framework

The existing canonical Irish National Framework of Qualifications (`NFQ`) remains the qualification-level backbone. Phase 2 preserves legacy NFQ levels for discovery but does not convert that alone into current programme recognition or immigration eligibility.

A later verification phase should prefer current Irish Register of Qualifications / awarding-provider evidence when establishing a programme's current recognised status.

## Security and advisor review

Supabase security advisor reports the three Ireland staging relations only under the intentional `RLS enabled / no policy` INFO pattern used for private server-only staging. No public policies were added.

The catalogue institution foreign key is covered by `program_catalog_ie_staging_institution_idx`. The performance advisor reports that new index as initially unused, which is expected immediately after creation; it does not report a new unindexed Ireland staging foreign key.

## Phase 2 release gate

Phase 2 is complete when all of these remain true:

1. exactly 40 bounded staging programmes exist;
2. 32 are higher-education and 8 are employment-based apprenticeship pathways;
3. all 32 higher-education rows resolve to a current canonical institution;
4. all 40 rows have at least one approved target-career relation;
5. the approved relation set contains no career outside the canonical 80 vocabulary;
6. all 40 rows have international-context records;
7. no programme-level international eligibility is inferred;
8. staging remains inaccessible to `anon` and `authenticated` roles;
9. no Ireland programme publication view or product route is created in Phase 2;
10. no United States programme work is introduced.

## Next phase

Phase 3 has not started.

Phase 3 should verify exact current programme/provider evidence, TrustEd/ILEP eligible-programme status where relevant, full-time daytime study, current international admission windows and any profession-specific registration boundary before canonical publication is considered.

United States Programs remains untouched.
