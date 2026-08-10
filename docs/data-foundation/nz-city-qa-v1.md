# New Zealand city QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Release hold: `VERCEL_BUILD_RATE_LIMIT`

Branch: `agent/nz-cities-qa-v1`

Parent publication branch: `agent/nz-cities-publication-v1`

This document records the completed Phase 8 QA gate for the five approved New Zealand Tier A city profiles and New Zealand City Compare. Phase 9 integration and Phase 10 main/deploy remain separate and are intentionally not performed here.

## QA scope

The country rollout standard requires Phase 8 verification of:

1. production DB contracts
2. route allowlist and deferred-city protection
3. source and verification state
4. programme empty-state behaviour
5. City Compare
6. sitemap and canonical metadata
7. repository CI and production build
8. preview/deployment status

## Production DB verification

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-09.

The three New Zealand city migrations are present in production migration history:

- `20260809120738_normalize_nz_tier_a_city_geographies_v1`
- `20260809121651_publish_nz_tier_a_city_linkage_v1`
- `20260809123214_publish_nz_tier_a_city_metrics_v1`

### Tier A geography readiness

The public New Zealand city read model contains exactly five cities:

- Auckland
- Christchurch
- Hamilton
- Wellington
- Dunedin

Each row has:

- `publication_tier = A` in canonical geography metadata
- canonical public slug
- `scope_kind = city`
- `study_destination_scope = stats_nz_urban_area`
- positive verified campus count
- positive verified institution count
- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

Current verified distribution remains:

- Auckland: 3 institutions / 3 teaching locations
- Christchurch: 2 / 2
- Hamilton: 1 / 1
- Wellington: 3 / 3
- Dunedin: 1 / 1

Each of the five canonical city geographies currently has two geography-alias rows, giving ten canonical-name/slug aliases across Tier A and satisfying the Phase 2 alias contract.

The deferred publication boundary remains intact:

- Palmerston North exists as a legacy geography but has no Phase 2 publication tier, public slug metadata or study-destination scope.
- Lincoln exists as a legacy geography but has no Phase 2 publication tier, public slug metadata or study-destination scope.
- Tauranga remains outside the New Zealand publication allowlist and is not present in the five-city canonical publication read model.

No deferred city is allowed into the public route or Compare allowlist.

### Institution and location evidence

The current New Zealand city institution read model contains:

- 10 rows
- 7 distinct canonical institutions
- 10 distinct verified teaching-campus/location records
- 0 invalid evidence rows under the Phase 3 contract

Each published institution/location row has:

- canonical New Zealand provider identity
- `NZ_MOE_PROVIDER_NUMBER` identifier linkage
- provider source URL
- official institution location source
- `location_quality = verified_official`
- `record_scope = verified_teaching_campus`

This remains an initial verified set, not a claim that the city institution directory is exhaustive.

### Programme empty state

`city_programme_directory_nz_v1` contains 0 rows.

The current canonical New Zealand `catalog.programme_offerings` set also contains 0 rows, including 0 verified offerings.

This is the expected state for the current New Zealand rollout. Institution or campus presence is never used to infer programme delivery. The profile and Compare UI therefore present programme coverage as verification pending rather than a misleading zero-programme conclusion.

Programme count is not a profile-publication or City Compare readiness gate in this phase.

### Five verified metrics

Each of the five Tier A cities has exactly five distinct verified core metric rows and no verified core metric row is missing a source URL.

The metric keys are:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Total verified core metric rows: 25.

The Phase 4 semantics remain protected:

- campus membership uses the approved Stats NZ urban-area study-destination scope.
- population values retain their own source geography labels when the official population source uses a different statistical boundary.
- transport keeps its source-native fare product and period rather than a synthetic monthly conversion.
- student work context remains conditional on the individual visa and records the current eligible-student reference of up to 25 hours per week during term from 3 November 2025.
- eligible full-time scheduled-break work remains conditional on the visa conditions.
- employment sectors remain official economic-development context rather than shortage rankings or employment guarantees.
- living-cost references remain indicative because official source methodologies differ.

The student-work rule was rechecked against current Immigration New Zealand guidance during Phase 8. The Stats NZ SSGA23 urban/rural geography basis was also rechecked against current Stats NZ geography guidance.

### Read-model access controls

The three New Zealand city read-model objects are views with `security_invoker=true`:

- `city_directory_nz_v1`
- `city_institution_directory_nz_v1`
- `city_programme_directory_nz_v1`

Privilege checks show:

- `service_role: SELECT`
- no direct `anon: SELECT`
- no direct `authenticated: SELECT`

This matches the server-only New Zealand profile and Compare loaders and preserves least-privilege Data API access.

## Supabase platform compatibility check

The current Supabase breaking-change review was repeated during Phase 8.

The relevant 2026 Data API change is the move away from automatic public-schema Data/GraphQL API exposure for newly created objects, with enforcement for existing projects scheduled for 2026-10-30. The New Zealand city read models already use explicit `service_role` SELECT grants and `security_invoker=true`, so this change does not require a new New Zealand city migration.

No Supabase platform change identified during this Phase 8 review blocks the existing New Zealand city read path.

## Route and SEO QA

The canonical route allowlist remains exactly:

`auckland`, `christchurch`, `hamilton`, `wellington`, `dunedin`

Approved profiles use:

- `/cities/nz/{slug}`
- `index, follow`
- `Study in <City>, New Zealand` metadata
- canonical `/cities/nz/{slug}`

Unsupported slugs remain outside `PUBLISHED_NZ_CITY_SLUGS`, are rejected by the route guard/not-found flow and receive noindex metadata when metadata resolution occurs.

The sitemap derives New Zealand city URLs directly from `PUBLISHED_NZ_CITY_SLUGS`. Palmerston North, Lincoln and Tauranga are not hard-coded into the New Zealand city sitemap surface.

## Compare QA

New Zealand City Compare remains available through:

`/compare?type=city&country=NZ`

Default pair selection remains Auckland vs Christchurch.

Compare readiness requires:

- all five verified metrics
- at least one linked verified teaching location
- at least one linked canonical institution

Programme count is deliberately not a readiness gate while New Zealand programme delivery remains unverified.

Compare preserves:

- approved Stats NZ urban-area study-destination scope for campus membership
- visible source geography labels for population context
- source-native transport fare periods and eligibility conditions
- conditional 25-hour student-visa work context
- programme verification-pending disclosure
- Profile to Compare and Compare to Profile navigation

Compare remains `noindex`.

## Automated cross-phase QA

Added:

`tests/nz-city-qa-contract.test.ts`

The contract asserts the final Phase 2–7 invariants across:

- exact five-city publication scope
- geography normalization and deferred-city protection
- canonical provider identity and explicit official location evidence
- programme assignment verification rules
- five shared metric keys
- source-native transport and conditional 25-hour work semantics
- verified server-side profile/Compare read models
- programme empty-state disclosure
- canonical metadata and sitemap
- New Zealand City Compare and its noindex state

## GitHub Actions CI

Temporary draft QA PR `#149` was opened only to execute repository CI from the Phase 8 branch against the Phase 7 publication branch. It is not an integration or release PR.

GitHub Actions CI run `31337774319` completed successfully on code commit:

`67756491726e4a0c029f3d7f726fb91149b8090a`

All verification steps passed:

- `npm ci`: pass
- `npm audit --omit=dev --audit-level=high`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm test`: pass
- `npm run build`: pass
- gitleaks history scan: pass

The New Zealand Phase 8 cross-phase contract is included in that successful test run.

## Vercel preview / release hold

Vercel status was checked for the same Phase 8 code commit.

Result:

`Deployment rate limited / build-rate-limit`

This is an account/build-quota condition, not an application compile or test failure. The repository production build for the same code commit passed in GitHub Actions.

Phase 8 therefore records the preview check as performed with an external infrastructure hold. The rollout is `PUBLISH_READY` from the data/product/code QA perspective, but Phase 9/10 release work should remain paused until integration is intentionally performed on the current main baseline and Vercel deployment capacity is available or another approved deployment validation path is used.

## Main integration state

No main merge was performed.

At the time of Phase 8 QA:

- current `main`: `59a977671bfb591de5e48ae84b8193dc62f9fa69`
- New Zealand QA code commit: `67756491726e4a0c029f3d7f726fb91149b8090a`
- common city-rollout base: `521c7ba3966caea3d4235880e3e00e7e06ce09d6`
- QA branch vs current main: diverged, 29 commits ahead / 1 commit behind by GitHub history comparison

The one main-only commit is the Australia occupation integration that landed after the New Zealand city branch was started. Phase 9 should integrate New Zealand onto the then-current main/integration baseline rather than blindly merging the historical QA branch into main.

## Phase 8 completion gate

- [x] production migration history confirmed
- [x] production DB city contracts pass
- [x] exact five-city geography/publication scope passes
- [x] deferred-city protection passes
- [x] institution/location source and verification checks pass
- [x] programme verification empty-state contract passes
- [x] all 25 verified core metric rows pass
- [x] read-model security-invoker / grant checks pass
- [x] current student-work and Stats NZ geography basis rechecked
- [x] route allowlist and canonical metadata pass
- [x] New Zealand City Compare contract passes
- [x] sitemap contract passes
- [x] cross-phase QA contract test is committed
- [x] repository CI passes through production build and secret scan
- [x] preview status checked; Vercel execution is blocked only by account build-rate limit

Result: New Zealand `/cities` has reached `PUBLISH_READY` through Phase 8, with `VERCEL_BUILD_RATE_LIMIT` recorded as a release/deployment hold rather than a rollout correctness failure.

Phase 9 integration and Phase 10 main/deploy are intentionally deferred.
