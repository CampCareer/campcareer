# US Programs — Phase 5 Release Gate

Date: 2026-08-11

Branch: `agent/programs-us`

## Decision

United States Programs Phase 5 is complete as an explicit release gate.

The 24 Phase 4 canonical programmes are source-verified programme identities across 8 providers, but the current evidence model deliberately keeps provider-level SEVP / F-1 context separate from programme-specific international eligibility. As of the evidence checked through 2026-08-10, no programme has a positive programme-level international eligibility assertion and all canonical offerings remain `market='unknown'`.

Therefore canonicalization does not trigger public release.

## Production gate

Migration:

- `20260811101355_us_program_phase5_release_gate`

Server-only view:

- `public.program_publication_gate_us_v1`

Current state:

- canonical programmes: 24
- Tier A: 24
- verified canonical offerings: 24
- programme-level international positive: 0
- canonical offerings with `international` / `both` market: 0
- programme campus links: 0
- publishable programmes: 0
- `publication_ready=false`
- reason: `programme_specific_international_eligibility_required`
- evidence checked through: 2026-08-10

## Release predicates

A U.S. canonical programme can become a public international-study programme only when all of the following are true:

1. exact current programme identity remains Tier A;
2. programme-specific international eligibility is positively verified;
3. the canonical offering market is verified as `international` or `both`;
4. the canonical offering remains verified;
5. programme delivery location is shown only when programme-specific delivery evidence exists.

Provider SEVP certification, an I-20/F-1 institutional route, general international admissions pages, accreditation, exact CIP, or STEM designation do not independently satisfy the programme publication gate.

## Product / SEO decision

Phase 5 deliberately does not enable the United States as a published Programs country while the release gate is false.

No U.S. programme should be added to an SEO allowlist or programme sitemap from this cohort while `program_publication_gate_us_v1.publication_ready=false`.

The Phase 4 read models remain server-only review surfaces:

- `program_catalog_canonical_us_v1`
- `program_occupation_canonical_us_v1`
- `program_explorer_us_v1`
- `program_detail_us_v1`
- `program_compare_us_v1`

All 24 explorer rows remain `review_ready` and `indexable=false`.

## Security

`program_publication_gate_us_v1` uses `security_invoker=true`.

- `anon`: no access
- `authenticated`: no access
- `service_role`: SELECT only

## Status

- Phase 1 complete
- Phase 2 complete
- Phase 3 complete
- Phase 4 complete
- Phase 5 complete as a release gate
- public U.S. programme publication remains blocked pending programme-specific international eligibility evidence
