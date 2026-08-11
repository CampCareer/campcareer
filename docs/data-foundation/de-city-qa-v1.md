# Germany city QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Release hold: `VERCEL_BUILD_CAPACITY_NOT_USED`

Branch: `agent/de-cities-qa-v1`

Parent publication branch: `agent/de-cities-publication-v1`

Audit date: 2026-08-10

## Purpose

Run the final cross-phase QA gate for the nine approved Germany Tier A city profiles and Germany City Compare before Phase 9 current-main integration preparation.

Phase 8 performs no new production database mutation.

## Production migrations

Confirmed in production Supabase migration history:

- `20260810133035_normalize_de_tier_a_city_geographies_v1`
- `20260810163850_publish_de_tier_a_city_linkage_v1`
- `20260810170732_publish_de_tier_a_city_metrics_v1`

## Geography readiness

Production contains exactly nine Tier A Germany city geographies:

- Aachen
- Berlin
- Bonn
- Dresden
- Hamburg
- Heidelberg
- Karlsruhe
- Munich
- Tübingen

Every Tier A geography has:

- `scope_kind = city`
- publication tier `A`
- official eight-digit AGS
- Bundesland `region_code`
- one canonical-name alias
- one slug alias

The Phase 2 public geography contract remains a politically independent municipality as defined by Destatis / Statistische Ämter GV-ISys.

Current Destatis documentation continues to state that GV-ISys lists every politically independent municipality and includes official municipality code (AGS), municipality name, area and population.

## Institution and teaching-location readiness

`city_institution_directory_de_v1` production state:

- 12 rows
- 12 distinct canonical institutions
- 12 distinct verified teaching locations
- 0 invalid evidence rows under the Phase 3 contract

Every published row has:

- verified institution domain
- institution identity source URL
- official teaching-location source URL
- `location_quality = verified_official`
- `record_scope = verified_teaching_campus`

Distribution remains:

- Berlin: 3 institutions / 3 locations
- Munich: 2 / 2
- each other Tier A city: 1 / 1

The municipality boundary remains controlling for multi-campus institutions. Institution sites outside the municipality are not silently included.

## Programme verification state

Production state:

- `city_programme_directory_de_v1`: 0 rows
- existing `program_explorer_de_v1`: 72 rows
- every Tier A city: `programme_coverage_status = verification_pending`

This is intentional. The existing Germany programme catalogue is preserved, but the old city seed relationship is not sufficient evidence of campus-specific programme delivery.

Institution or teaching-location presence is never converted into programme delivery.

## Five verified metrics

All nine Tier A cities have exactly five verified core metric rows.

Total: 45 verified rows.

No verified core metric row is missing a source URL.

Metric keys:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Semantics remain protected:

- population uses the GV-ISys municipality contract and retains AGS;
- living cost remains indicative official university guidance with source-specific methodology;
- transport retains source-native ticket product, period, range and eligibility conditions;
- employment sectors remain context rather than shortage rankings or employment guarantees.

## Student-work rule recheck

The current federal `Make it in Germany` guidance was rechecked on 2026-08-10.

It continues to state that eligible third-country students may work up to 140 full days or 280 half days per year, or alternatively up to 20 hours per week during lecture periods. Student auxiliary academic activities are treated separately from those restrictions.

The profile and Compare UI therefore remain aligned with the stored Phase 4 rule.

Official source:

`https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work`

## Read-model security

The Germany city read models are all views with:

`security_invoker=true`

Objects:

- `city_directory_de_v1`
- `city_institution_directory_de_v1`
- `city_programme_directory_de_v1`

Verified privileges:

- `service_role: SELECT = true`
- `anon: SELECT = false`
- `authenticated: SELECT = false`

This matches the server-only profile and Compare read paths.

## Supabase 2026 compatibility

The current Supabase breaking-change review was repeated during Phase 8.

Supabase is changing public-schema Data API exposure so new objects require explicit grants, with enforcement for existing projects scheduled for 2026-10-30. Supabase documentation also recommends `security_invoker=true` for views where caller permissions should apply.

The Germany city read models already use explicit service-role-only SELECT grants and `security_invoker=true`, so no Phase 8 database migration is required.

Official references:

- `https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically`
- `https://supabase.com/docs/guides/api/securing-your-api`
- `https://supabase.com/docs/guides/database/tables`

## Route and SEO QA

Published route allowlist remains exactly:

`berlin`, `munich`, `hamburg`, `aachen`, `bonn`, `dresden`, `heidelberg`, `karlsruhe`, `tuebingen`

Approved routes use:

- `/cities/de/{slug}`
- `Study in <City>, Germany`
- canonical `/cities/de/{slug}`
- `index, follow`

Unsupported slugs remain outside the shared allowlist and use not-found / `noindex, nofollow` handling.

Sitemap generation derives Germany city URLs from `PUBLISHED_DE_CITY_SLUGS`; it does not maintain a second publication list.

## City Compare QA

Germany City Compare is available at:

`/compare?type=city&country=DE`

Default pair:

`Berlin vs Munich`

Readiness requires:

- all five verified metrics
- at least one linked verified teaching location
- at least one linked canonical institution

Programme count is not a readiness gate while programme delivery remains verification pending.

Compare preserves:

- the common municipality boundary
- AGS population context
- source-native student transport values/ranges
- the federal 20-hour / 140-full / 280-half-day context
- programme verification-pending disclosure
- Profile ↔ Compare navigation

The shared Compare route remains `noindex, nofollow`.

## Automated QA

Added:

`tests/de-city-qa-contract.test.ts`

This contract protects the final Phase 2–7 invariants across geography, linkage, metrics, profile, Compare and publication.

## CI and deployment posture

GitHub Actions CI is required on the Phase 8 QA branch and must pass:

- npm ci
- production dependency audit
- typecheck
- lint
- tests including `de-city-qa-contract.test.ts`
- production build
- Git-history secret scan

Vercel preview/deployment is intentionally not used as a Phase 8 completion requirement because the project is currently operating under Vercel build-capacity constraints. Repository production build remains the code compilation gate. Phase 9 prepares current-main integration but does not deploy.

## Phase 8 result

Data, evidence, security, routing, Compare and publication contracts are `PUBLISH_READY`.

Proceed to Phase 9 current-main integration preparation after final GitHub Actions success is recorded.
