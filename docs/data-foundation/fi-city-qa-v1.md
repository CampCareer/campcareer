# Finland Cities — Phase 8 QA v1

Status: `PHASE_8_COMPLETE`
Checkpoint: `PUBLISH_READY`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Production cross-phase verification

The Phase 8 production recheck confirms:

- Tier A municipalities: 8
- unexpected Tier A municipalities: 0
- city directory rows: 8
- verified university study-location representatives: 10
- distinct linked university institutions: 10
- verified-partial programme rows: 342
- programme source-city / municipality mismatches: 0
- verified core metric rows: 40
- cities missing any of the five required metric families: 0
- compare-ready cities: 8

## Read-model security

Rechecked:

- `public.city_directory_fi_v1`
- `public.city_institution_directory_fi_v1`
- `public.city_programme_directory_fi_v1`

All three retain:

- `security_invoker=true`
- `service_role`: SELECT
- `anon`: no SELECT
- `authenticated`: no SELECT

## Route and publication QA

The route contract contains exactly:

`helsinki, espoo, tampere, turku, oulu, jyvaskyla, lappeenranta, joensuu`

Supported routes are `index, follow`, use canonical `/cities/fi/{slug}` metadata and appear in sitemap through `PUBLISHED_FI_CITY_SLUGS`.

Unsupported FI slugs remain not found / `noindex, nofollow`.

Priority expansion candidates such as Kuopio, Vaasa, Rovaniemi, Vantaa and Lahti are not present in the publication allowlist or sitemap.

The parameterized City Compare surface remains `noindex, nofollow`.

## Compare QA

All eight Tier A municipalities satisfy the Compare readiness contract:

- five verified core metrics
- positive verified study-location linkage
- positive canonical institution linkage

The comparison UI preserves these caveats:

- national EUR 900–1,200 student-budget planning range is not city-ranked
- national Migri average 30-hour weekly work context is not city-ranked
- local transport stays source-native and is not synthetically monthly-normalized
- programme totals remain `verified_partial`
- no winning city score is produced

## Supabase advisors

Security and performance advisors were run after the FI city read-model work.

No Finland city-view exposure regression was identified.

Existing project-wide notices remain outside the Finland rollout, including:

- RLS-enabled tables with no policies (`INFO`), many of which are intentionally inaccessible base/staging/catalog tables under the current service-role read model
- Auth leaked-password protection disabled (`WARN`)
- existing unindexed foreign-key and unused-index performance notices (`INFO`)

Reference remediation pages:

- RLS/database linter: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- leaked password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unindexed foreign keys: https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys

These are project-level maintenance items and are not caused by the FI Cities publication views.

## Known coverage boundaries carried forward

- provider inventory remains a selected ten-university core, not the complete 35-recognised-HEI/UAS universe
- Studyinfo organisation OID reconciliation remains pending
- canonical `qualification_level_id` remains unrepaired for the FI programme foundation
- programme publication remains verified-partial

## Phase 8 conclusion

Finland Cities has reached `PUBLISH_READY` for the exact eight-city cohort.

Full GitHub Actions validation must pass on the Phase 8 branch head before Phase 9 integration is considered complete.
