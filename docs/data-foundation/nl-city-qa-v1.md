# Netherlands city QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Release hold: `VERCEL_BUILD_RATE_LIMIT`

Branch: `agent/nl-cities-qa-v1`

Parent publication branch: `agent/nl-cities-publication-v1`

Audit date: 2026-08-10

This document records the completed Phase 8 QA gate for the five approved Netherlands Tier A city profiles and Netherlands City Compare. Phase 9 integration and Phase 10 main/deploy remain separate.

## QA scope

Phase 8 verifies:

1. production DB contracts and migration history
2. route allowlist and Tier B protection
3. source and verification state
4. programme/HBO empty-state behaviour
5. City Compare
6. sitemap and canonical metadata
7. read-model access controls
8. repository CI and production build
9. preview/deployment status

## Production migration history

The three Netherlands city data migrations are present in production Supabase project `babylusxcknjerxtepoc`:

- `20260810131602_normalize_nl_tier_a_city_geographies_v1`
- `20260810132743_publish_nl_tier_a_city_linkage_v1`
- `20260810164813_publish_nl_tier_a_city_metrics_v1`

Phase 5–8 require no additional production migration.

## Tier A publication readiness

The public Netherlands city directory contains exactly five Tier A cities:

| City | Verified locations | Verified institutions | Verified metrics | City-linked programmes | Programme status | Publish-ready |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Amsterdam | 2 | 2 | 5 | 0 | verification_pending | yes |
| Maastricht | 1 | 1 | 5 | 0 | verification_pending | yes |
| Rotterdam | 1 | 1 | 5 | 0 | verification_pending | yes |
| Groningen | 1 | 1 | 5 | 0 | verification_pending | yes |
| Eindhoven | 1 | 1 | 5 | 0 | verification_pending | yes |

All five rows retain `institution_coverage_status = research_university_core_hbo_pending`.

## Geography boundary QA

The canonical publication scope remains exactly:

- Amsterdam — `GM0363`
- Maastricht — `GM0935`
- Rotterdam — `GM0599`
- Groningen — `GM0014`
- Eindhoven — `GM0772`

All use `study_destination_scope = cbs_municipality` and preserve existing geography UUIDs.

Tier B protection passed:

- Delft
- Utrecht
- Enschede
- Tilburg
- Leiden
- Nijmegen
- Wageningen

Production query result: Tier B rows carrying the Tier A normalization/publication contract = `0`.

The Hague / Den Haag production geography rows = `0`.

No metropolitan or province substitution is introduced by publication or Compare.

## Institution and location evidence

`city_institution_directory_nl_v1` contains 6 verified Phase 3 location anchors across the five cities.

The publication layer requires:

- canonical institution identity
- `NL_BRIN` identity evidence
- official institution location source
- `nl_city_linkage_v1` location normalization batch

Legacy listed-campus and registry-address duplicates are not counted by the publication read model.

The current set remains an initial research-university core. HBO completeness is intentionally not claimed.

## Programme empty state

`city_programme_directory_nl_v1` contains `0` rows.

Verified programme offerings explicitly linked to a Phase 3 Netherlands city campus also remain `0`.

This is the expected state. Programme existence, institution presence and campus presence never prove city delivery. Profiles and Compare display `verification_pending` rather than treating the empty city programme directory as evidence that a city has no programmes.

Programme count is not a profile-publication or Compare-readiness gate while explicit offering-to-campus coverage is pending.

## Five verified metrics

Production contains exactly 25 verified core city metric rows: five metrics for each of five Tier A cities.

The required keys are:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Phase 4 semantics remain intact:

- population uses the CBS municipality boundary family for all five cities;
- living-cost source baskets remain explicit and indicative;
- Eindhoven retains `national_baseline` rather than being represented as a city-specific TU/e total;
- transport preserves source-native product and period;
- student employee-work context preserves the national 16-hour weekly / June-July-August full-time alternative and employer TWV requirement;
- employment sectors remain context, not shortage rankings or guarantees.

## Read-model access controls

The three Netherlands city read models remain views with `security_invoker=true`:

- `city_directory_nl_v1`
- `city_institution_directory_nl_v1`
- `city_programme_directory_nl_v1`

Direct privilege QA returned for all three:

- `service_role: SELECT = true`
- `anon: SELECT = false`
- `authenticated: SELECT = false`

This matches the server-only profile and Compare loaders.

## Supabase advisor review

The project security advisor was run during Phase 8.

It reports the existing project-wide `RLS enabled / no policy` informational findings on service-role-only/internal tables and the existing Auth warning that leaked-password protection is disabled. These are not introduced by the Netherlands Cities rollout.

The Netherlands city read models themselves pass the direct `security_invoker` and service-role-only privilege contract above.

## Route and SEO QA

The exact published route allowlist remains:

`amsterdam`, `maastricht`, `rotterdam`, `groningen`, `eindhoven`

Approved profiles use:

- `/cities/nl/{slug}`
- `index, follow`
- `Study in <City>, Netherlands` metadata
- canonical `/cities/nl/{slug}`

Unsupported slugs remain outside `PUBLISHED_NL_CITY_SLUGS`, resolve through the not-found guard, and use `noindex, nofollow` fallback metadata.

The sitemap derives Netherlands city URLs directly from `PUBLISHED_NL_CITY_SLUGS`. Tier B and The Hague are not hard-coded into the Netherlands city sitemap surface.

## Compare QA

Netherlands City Compare is available at:

`/compare?type=city&country=NL`

Default pair: Amsterdam vs Maastricht.

Compare readiness requires:

- all five verified metrics
- at least one verified Phase 3 location
- at least one linked canonical institution

Programme count and HBO completeness are deliberately not readiness gates. Their incomplete coverage is disclosed instead.

Compare preserves:

- CBS municipality scope
- source-specific living-cost methodology
- Eindhoven national living-cost baseline disclosure
- source-native transport products and periods
- national 16-hour/TWV work context
- programme verification-pending state
- research-university-core / HBO-pending state
- Profile ↔ Compare navigation

The shared Compare page remains `noindex, nofollow`.

## Automated cross-phase QA

Added:

`tests/nl-city-qa-contract.test.ts`

The test guards the final Phase 2–7 invariants across geography, linkage, metrics, profile, Compare, publication and empty-state semantics.

## GitHub Actions CI

Temporary draft QA PR: `#193`.

CI run: `31416456716` / workflow run number `1113`.

Code commit tested:

`646302a11b9d19347a6a71dc1d33072dbdc07aea`

All verification steps passed:

- `npm ci`: pass
- `npm audit --omit=dev --audit-level=high`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm test`: pass
- `npm run build`: pass
- Git-history secret scan: pass

## Vercel preview / release hold

The Vercel status for the same QA commit is:

`failure — build-rate-limit`

The status target points to the account upgrade/build-rate-limit page rather than an application build log. Repository production build passed in GitHub Actions for the same code commit.

Phase 8 therefore records Vercel as an external preview-capacity hold, not a rollout correctness failure.

## Current main state

At Phase 8 verification time:

- current `main`: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`
- Phase 7 publication branch is `29` commits ahead / `0` behind main
- no current-main reconciliation conflict exists

Phase 9 can therefore create the Netherlands integration branch directly from the completed QA lineage while retaining current main as its ancestor. No main merge is performed in Phase 8.

## Phase 8 completion gate

- [x] production migration history confirmed
- [x] production DB city contracts pass
- [x] exact five-city publication scope passes
- [x] Tier B and The Hague protection passes
- [x] institution/location evidence checks pass
- [x] programme verification empty-state contract passes
- [x] HBO coverage gap disclosure remains explicit
- [x] all 25 verified metric rows pass
- [x] read-model security and direct grant checks pass
- [x] route allowlist and canonical metadata pass
- [x] Netherlands City Compare passes
- [x] sitemap contract passes
- [x] cross-phase QA contract committed
- [x] repository CI passes through production build and secret scan
- [x] preview status checked; Vercel blocked only by account build-rate limit

Result: Netherlands `/cities` has reached `PUBLISH_READY` through Phase 8.
