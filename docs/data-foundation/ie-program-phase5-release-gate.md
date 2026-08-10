# Ireland Programs Phase 5 release gate

Status: Phase 5 complete as a release decision. Public Ireland programme release remains blocked.

## Decision

Ireland does not enter the shared public Programs explorer in this phase.

The Phase 3/4 cohort has 28 canonical Tier B programmes across 9 institutions, but Tier B in the Ireland model is deliberately review-ready rather than publication-ready. None of the 28 rows has an exact current TrustEd Ireland / ILEP eligible-programme assertion, and all 28 canonical offerings remain unverified.

Publishing those rows would collapse separate claims that CampCareer has intentionally kept apart:

- current programme existence;
- NFQ / qualification recognition;
- provider TrustEd Ireland authorisation;
- exact eligible-programme status for study visa / student permission;
- full-time daytime study mode;
- current international admission state;
- programme-to-career relevance;
- professional registration or licensing.

## Current official rule boundary

The current TrustEd Ireland study-visa page says learners who require a study visa and/or immigration permission for study longer than 90 days must choose an eligible programme and must check the two eligible-programme lists. Eligible programmes do not appear on both lists, so both must be checked.

Source:
- https://www.trustedireland.ie/check-eligible-courses-for-study-visas

The TrustEd Ireland page currently links its higher-education programme list to:
- https://www.trustedireland.ie/sites/default/files/2026-02/trusted-ireland-he-list-of-eligible-programmes.xlsx

Immigration Service Delivery likewise states that a learner studying longer than 90 days must choose a course from the ILEP or the TrustEd Ireland Providers eligible programmes list.

Source:
- https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/

ISD also states that student permission requires a full-time daytime programme and that part-time or distance-learning courses do not qualify.

Source:
- https://www.irishimmigration.ie/coming-to-study-in-ireland/frequently-asked-questions-for-students/

## Production release gate

Migration:
- `20260810195944_ie_program_phase5_release_gate`

Server-only view:
- `public.program_publication_gate_ie_v1`

Current production result on 2026-08-10:

- `country_code = IE`
- `publication_ready = false`
- Tier A = 0
- Tier B = 28
- Tier C = 12
- publishable = 0
- reason = `exact_eligible_programme_evidence_required`
- evidence checked through = 2026-08-10

The gate requires all of the following before a canonical row can contribute to a public release cohort:

1. Tier A verification.
2. Exact eligible-programme source URL.
3. Positive international-student eligibility.
4. Verified full-time daytime study.
5. Verified canonical offering.

The gate view is `security_invoker=true`, has no `anon` or `authenticated` access, and grants SELECT only to `service_role`.

## Product and SEO boundary

Phase 5 deliberately does not create or enable:

- `public.program_explorer_ie_v1`;
- `public.program_detail_ie_v1`;
- `public.program_compare_ie_v1`;
- `/programs?country=IE` as a published country;
- `/programs/ie/[program]` detail routes;
- Ireland programme sitemap entries;
- an Ireland programme SEO allowlist.

The shared country picker must continue to show Ireland as unpublished until the release gate is satisfied.

## Canonical data retained

Phase 4 canonical data is retained server-side so exact eligibility evidence can be attached without rebuilding the bounded occupation-led cohort:

- 28 Tier B canonical programmes;
- 9 canonical institutions;
- 28 deterministic `IE_PROGRAM_SOURCE_HASH` identifiers;
- 28 unverified canonical offerings;
- 51 approved canonical programme-to-career relations;
- 32 / 80 canonical careers represented.

The 12 Tier C rows remain staging-only. The 2,876 legacy Ireland programmes remain active for existing legacy consumers and provenance until a publication-ready replacement cohort exists.

## Re-open criteria

Ireland public programme publication can resume only after the TrustEd Ireland / ILEP eligible-programme evidence is matched at programme level for a useful occupation-led cohort. At that point the affected rows can be promoted to Tier A, offerings can be verified, and Phase 5 publication code can be added without weakening the evidence model.

## Scope

Ireland only. This Phase 5 change does not modify United States programme data, routes, or release state.
