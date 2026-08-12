# Ireland city QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Release hold: `VERCEL_BUILD_RATE_LIMIT`

Branch: `agent/ie-cities-qa-v1`

Parent publication branch: `agent/ie-cities-publication-v1`

This document records the completed Phase 8 QA gate for the four approved Ireland Tier A city profiles and Ireland City Compare. Phase 9 integration and Phase 10 main/deploy remain separate and are intentionally not performed here.

## QA scope

The country rollout standard requires Phase 8 verification of:

1. DB contracts
2. route allowlist
3. source and verification state
4. empty-state behaviour
5. City Compare
6. sitemap and canonical metadata
7. preview/build execution

## Production DB verification

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-09.

### Tier A geography readiness

The public Ireland city read model contains exactly four cities:

- Dublin
- Cork
- Galway
- Limerick

Each row has:

- `publication_tier = A` in the canonical geography metadata
- canonical slug
- `scope_kind = city`
- explicit study-destination scope
- positive verified campus count
- positive verified institution count
- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

Canonical study scopes remain:

- Dublin: `dublin_four_local_authorities`
- Cork: `cork_city`
- Galway: `galway_city`
- Limerick: `limerick_urban`

Each of the four canonical geographies currently has five geography-alias rows.

The six deferred expansion candidates remain unnormalized for publication:

- Maynooth
- Waterford
- Athlone
- Sligo
- Dundalk
- Letterkenny

They have no publication tier, public slug or study-destination scope from the Ireland city normalization batch. Existing legacy fields on those deferred rows are not treated as publication evidence. In particular, Waterford still carries the previously identified legacy `region_code = Leinster` issue and must be normalized before any future publication.

### Institution and location evidence

The current Ireland city institution read model contains:

- 9 rows
- 9 distinct institutions
- 9 distinct verified campus/location records
- 0 invalid evidence rows under the Phase 3 contract

Each published institution/location row has:

- HEA recognition authority/source
- canonical institution identity
- official institution website
- official location source
- `location_quality = verified_official`

Current distribution remains:

- Dublin: 5 institutions / 5 locations
- Cork: 1 / 1
- Galway: 1 / 1
- Limerick: 2 / 2

This is intentionally an initial verified set, not a claim that the city institution directory is exhaustive.

### Programme empty state

`city_programme_directory_ie_v1` contains 0 rows.

The wider Ireland catalogue currently contains 2,876 programme offerings, but 0 are verified offerings. Their presence therefore does not satisfy the city programme-delivery contract.

This is the expected state. Institution presence is never used to infer programme delivery, and the public UI presents verification pending rather than a misleading zero-programme claim.

### Five verified metrics

Each of the four Tier A cities has exactly five distinct verified core metric rows and no verified core metric row is missing a source URL.

The metric keys are:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Total verified core metric rows: 20.

The Phase 4 semantics remain protected:

- TFI transport keeps its source-native fare period rather than synthetic monthly conversion.
- Stamp 2 work context remains 20 hours per week during term and 40 hours during designated holiday periods, with eligibility conditions explicit.
- employment sectors remain economic-development context rather than shortage rankings or employment guarantees.
- living-cost references remain indicative because official source methodologies differ.

### Read-model access controls

The three Ireland city read-model tables have RLS enabled:

- `city_directory_ie_v1`
- `city_institution_directory_ie_v1`
- `city_programme_directory_ie_v1`

Direct grants checked for `anon`, `authenticated` and `service_role` show only:

- `service_role: SELECT`

No direct `anon` or `authenticated` SELECT grant is present. This matches the server-only Ireland profile and Compare loaders.

## Supabase platform compatibility check

The current Supabase breaking-change review was repeated during Phase 8. No listed 2026 breaking change blocks these existing Ireland read models or the read-only QA performed here.

The relevant Data API change is that public-schema tables are moving away from automatic Data/GraphQL API exposure, with enforcement for existing projects scheduled for 2026-10-30. The Ireland city read models already use explicit RLS and grants, so this does not require a new Phase 8 migration.

## Route and SEO QA

The canonical route allowlist remains exactly:

`dublin`, `cork`, `galway`, `limerick`

Approved profiles use:

- `/cities/ie/{slug}`
- `index, follow`
- `Study in <City>, Ireland` metadata
- canonical `/cities/ie/{slug}`

Unsupported slugs remain outside `PUBLISHED_IE_CITY_SLUGS`, are rejected by the route guard / not-found flow and use noindex metadata when metadata resolution occurs.

The sitemap derives Ireland city URLs directly from `PUBLISHED_IE_CITY_SLUGS`. None of the six deferred cities is separately hard-coded into the Ireland city sitemap surface.

## Compare QA

Ireland City Compare remains available through:

`/compare?type=city&country=IE`

Default pair selection remains Dublin vs Cork.

Compare readiness requires:

- all five verified metrics
- at least one linked campus/location
- at least one linked canonical institution

Programme count is deliberately not a readiness gate while Ireland programme delivery remains unverified.

Compare preserves:

- Dublin's four-local-authority study-market boundary
- Cork, Galway and Limerick approved city/urban scopes
- source-native TFI fare periods
- conditional Stamp 2 work context
- programme verification-pending disclosure

Compare remains `noindex`.

## Automated cross-phase QA

Added:

`tests/ie-city-qa-contract.test.ts`

The contract asserts the final Phase 2–7 invariants across:

- exact four-city publication scope
- geography normalization and deferred-city protection
- HEA institution identity and explicit official location evidence
- programme assignment verification rules
- five shared metric keys
- source-native transport and Stamp 2 semantics
- verified server-side profile / Compare read models
- programme empty-state disclosure
- Dublin scope protection
- canonical metadata and sitemap
- Ireland City Compare and its noindex state

## GitHub Actions CI

Temporary draft QA PR `#89` was opened only to execute repository CI from the Phase 8 branch against the Phase 7 publication branch. It is not an integration or release PR.

GitHub Actions CI run `31308761692` completed successfully on commit:

`ed5c08409fe518d509467e41e5659679d613270e`

All verification steps passed:

- `npm ci`: pass
- `npm audit --omit=dev --audit-level=high`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm test`: pass
- `npm run build`: pass
- gitleaks history scan: pass

The cross-phase Ireland Phase 8 contract is included in that successful test run.

## Vercel preview / release hold

Vercel was checked for the same Phase 8 code commit.

Result:

`Deployment rate limited — retry in 24 hours.`

This is an account/build-quota condition, not an application compile or test failure. The repository production build for the same code commit passed in GitHub Actions.

Phase 8 therefore records the preview check as performed with an external infrastructure hold. The rollout is `PUBLISH_READY` from the data/product/code QA perspective, but Phase 9/10 release work should remain paused until the user approves integration and Vercel deployment capacity is available or another approved deployment validation path is used.

## Main integration state

No main merge was performed.

At the time of Phase 8 QA:

- current `main`: `521c7ba3966caea3d4235880e3e00e7e06ce09d6`
- Ireland QA code commit: `ed5c08409fe518d509467e41e5659679d613270e`
- common city-rollout base: `ad011095de06d39abeb8393a4a54b308698bc486`
- QA branch vs current main: diverged, 32 commits ahead / 57 commits behind by GitHub history comparison

The behind count reflects institution and other work that landed on main after the Ireland city branch was started. Phase 9 should therefore integrate Ireland onto the then-current main/integration baseline rather than directly merging the historical QA branch to main.

## Phase 8 completion gate

- [x] production DB city contracts pass
- [x] exact four-city geography/publication scope passes
- [x] deferred-city protection passes
- [x] institution/location source and verification checks pass
- [x] programme verification empty-state contract passes
- [x] all 20 verified core metric rows pass
- [x] read-model RLS / grant checks pass
- [x] route allowlist and canonical metadata pass
- [x] Ireland City Compare contract passes
- [x] sitemap contract passes
- [x] cross-phase QA contract test is committed
- [x] repository CI passes through production build and secret scan
- [x] preview status checked; Vercel execution is blocked only by account build-rate limit

Result: Ireland `/cities` has reached `PUBLISH_READY` through Phase 8, with `VERCEL_BUILD_RATE_LIMIT` recorded as a release/deployment hold rather than a rollout correctness failure.

Phase 9 integration and Phase 10 main/deploy are intentionally deferred.
