# Ireland Programs — Phase 4 Canonicalization

Date: 2026-08-10
Branch: `agent/programs-ie`
Status: `PHASE_4_COMPLETE_WITH_PUBLICATION_GATE`
Scope: Ireland only. United States work is out of scope.

## Goal

Convert the reviewed Phase 3 Ireland cohort into stable canonical programme identities without turning unresolved TrustEd/ILEP evidence into a public international-study claim.

## Canonical cohort

Phase 3 state entering Phase 4:

- Tier A: 0;
- Tier B: 28;
- Tier C: 12.

Only the 28 Tier B higher-education programmes are canonicalized. Tier C remains staging-only.

Canonical output:

- 28 `catalog.programmes` rows with deterministic IDs derived from `(source_name, source_program_key)`;
- 28 `IE_PROGRAM_SOURCE_HASH` identifiers;
- 28 `catalog.programme_offerings` rows using `source_system = IE_PROGRAM_PHASE3_CANONICAL`;
- 9 canonical institutions;
- Irish NFQ level IDs resolved from the existing canonical NFQ framework;
- 51 approved canonical programme-to-career relations across 32 CampCareer careers.

All 28 new offerings remain `unverified`. Canonical identity means the programme/provider identity is stable enough for internal use; it does not mean exact TrustEd/ILEP eligible-programme status has been proven.

## Publication gate

Phase 4 deliberately does not create:

- `public.program_explorer_ie_v1`;
- `public.program_detail_ie_v1`;
- Ireland `/programs` product routing;
- sitemap/detail publication.

The two Phase 4 canonical read models are server-only:

- `public.program_catalog_canonical_ie_v1`;
- `public.program_occupation_canonical_ie_v1`.

Both use `security_invoker=true`, revoke access from `public`, `anon`, and `authenticated`, and grant SELECT only to `service_role`.

## Tier C exclusion

The 12 Tier C rows are not canonicalized. This includes unresolved/conditional programmes and the eight employment-based apprenticeships. The migration explicitly checks that no Tier C source identity is present under `IE_PROGRAM_SOURCE_HASH`.

## Legacy preservation

Ireland already had 2,876 active legacy Qualifax-derived canonical programmes. Unlike the UK Phase 4 precedent, this phase does not retire them because Ireland currently has zero Tier A programmes and the new cohort is not publication-ready.

After Phase 4 there are 2,904 active IE programme rows in `catalog.programmes`:

- 2,876 legacy rows retained for existing read-model compatibility;
- 28 new deterministic Phase 4 canonical rows.

Legacy retirement must be a separate deliberate action once a publication-ready Ireland cohort exists.

## Production verification

Applied migration:

- `20260810175121_ie_program_phase4_canonicalization_gate`

Verified production state:

- canonical programmes: 28;
- institutions: 9;
- canonical offerings: 28, all `unverified`;
- canonical approved relations: 51;
- canonical careers covered: 32;
- Tier C canonical leaks: 0;
- legacy active programmes preserved: 2,876;
- `anon` / `authenticated` privileges on both canonical views: none;
- `service_role`: SELECT only.

Supabase security/performance advisors show no new Ireland Phase 4 regression. Existing project-wide advisor notices remain outside this scope.

## Next phase

Phase 5 has not started. It must decide whether Ireland should remain publication-gated or expose a carefully labelled review-level surface. Exact TrustEd/ILEP programme eligibility must not be inferred merely because a programme now has a canonical ID.

United States Programs is not part of this work.