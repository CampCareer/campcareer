# UK city QA v1

Status: PHASE_8_IN_PROGRESS

Branch: `agent/uk-cities-qa-v1`
Parent publication branch: `agent/uk-cities-publication-v1`

This document records the Phase 8 QA gate for the ten approved UK Tier A city profiles and UK City Compare.

## QA scope

The rollout standard requires verification of:

1. DB contracts
2. route allowlist
3. source and verification state
4. empty-state behaviour
5. City Compare
6. sitemap and canonical metadata
7. preview/build execution

## Production DB verification

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-09.

### Tier A city readiness

All ten approved Tier A cities satisfy the publication data gate:

- publication tier `A`
- city read-model row exists
- at least one verified campus location
- at least one canonical institution
- exactly five distinct verified core metric keys
- no core metric row is missing a source URL

The approved cities are London, Manchester, Birmingham, Edinburgh, Glasgow, Cardiff, Belfast, Oxford, Cambridge and Bristol.

Leeds and Nottingham remain outside Tier A and have no UK city publication read-model row or verified city metric set.

### Programme empty state

All ten Tier A cities currently have:

- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

This is accepted by the UK publication contract because programme delivery is not inferred from institution presence. City profile and Compare must keep the verification-pending disclosure instead of displaying a misleading zero-programme result.

### Institution and location evidence

Current UK city institution read model:

- 41 verified location rows
- 22 distinct institutions
- 0 rows with invalid/missing UKPRN, website, source URL or `verified_official` location quality
- 0 University of Salford rows in Manchester

Royal Holloway is intentionally represented in London only through its verified Central London Campus evidence, not through its Egham main campus. The current official Royal Holloway London-campus material confirms teaching locations in Bloomsbury and programmes delivered from the central London campus.

### Read-model access controls

The three UK city read-model tables have RLS enabled:

- `city_directory_uk_v1`
- `city_institution_directory_uk_v1`
- `city_programme_directory_uk_v1`

`service_role` has SELECT access. `anon` and `authenticated` do not have direct SELECT grants. This matches the current server-only profile and Compare loaders.

## Route and SEO QA

The canonical route allowlist remains exactly ten slugs in `PUBLISHED_UK_CITY_SLUGS`.

Approved routes use:

- canonical `/cities/uk/{slug}`
- `index, follow`
- country-specific `United Kingdom` and `Student visa` metadata

Unsupported UK slugs are rejected by `isPublishedUkCitySlug` and `notFound()` and receive noindex metadata when metadata resolution occurs.

The sitemap derives UK city entries directly from `PUBLISHED_UK_CITY_SLUGS`. Leeds and Nottingham are not separately hard-coded into the UK city sitemap surface.

## Compare QA

UK City Compare is available from the root Compare surface using `country=UK`.

Compare readiness requires:

- all five verified metrics
- at least one linked campus
- at least one linked canonical institution

Programme count is not used as a readiness gate while programme delivery verification remains pending.

The UI preserves the London Greater London boundary and named-city/local-authority boundaries for the other Tier A cities. Compare itself remains noindex.

## Work-rights QA

The profile and Compare copy preserve the qualified UK Student visa rule. The 20-hour figure is presented for qualifying full-time degree-level study at a compliant higher education provider during term time, with explicit warning that other categories may have different or no work permission.

## Supabase platform compatibility check

The 2026 Supabase breaking-change review found no new blocker for this QA phase. The relevant existing-platform change is the public-table Data API auto-exposure change, which is scheduled to be enforced for existing projects on 2026-10-30. The UK city read models already use explicit grants and are server-only, so this phase does not require a permission migration.

## Automated contract coverage

Added `tests/uk-city-qa-contract.test.ts` to assert the final cross-phase contracts for:

- exact Tier A route scope
- five verified metric keys
- read-model usage
- institution-location evidence requirements
- programme verification empty state
- London/Manchester scope protection
- canonical metadata and sitemap
- UK City Compare
- qualified Student visa work-rights copy

The repository CI workflow runs `npm ci`, production dependency audit, TypeScript, ESLint, unit tests, Next.js build and gitleaks on pull requests.

## Remaining execution gate

A draft QA pull request is used only to trigger the repository CI against this branch. It must not be merged as an integration/release action.

Vercel preview has recently been blocked by an account deployment-rate limit. Preview/build availability must therefore be recorded separately from code/test failures.

## Phase 8 completion gate

Phase 8 can be marked complete when:

- [x] production DB contracts pass
- [x] source and verification-state checks pass
- [x] programme empty-state contract passes static review
- [x] route allowlist and canonical metadata pass static review
- [x] City Compare contract passes static review
- [x] sitemap contract passes static review
- [x] cross-phase QA contract test is committed
- [ ] repository CI result is recorded
- [ ] Vercel preview/build status is recorded
