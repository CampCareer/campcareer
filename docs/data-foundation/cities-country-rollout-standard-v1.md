# Cities country rollout standard v1

This is the mandatory rollout sequence for every new `/cities` country after the United States and Canada work.

## Phase 0 — Country readiness

Before choosing publishable cities, audit the country as a data system.

Required checks:

1. Confirm the canonical country code used by CampCareer.
2. Map the national education structure and any sub-national regulatory differences.
3. Identify the authoritative institution/provider identifier.
4. Identify authoritative provider-recognition or regulatory sources.
5. Identify official programme/course discovery sources and the source hierarchy for final verification.
6. Identify the international-student eligibility/sponsorship source when applicable.
7. Measure existing canonical DB coverage for geographies, institutions, campuses, programmes and offerings.
8. Measure data quality: slugs, official URLs, identifiers, geography linkage, programme qualification levels, programme source URLs and verification status.
9. Record blockers and the remediation required before publication.

Completion gate: a written readiness record exists and clearly states what existing data can be reused, what must be repaired, and which official sources become the authority for later phases.

## Phase 1 — City scope

Select the Tier A cities to publish first.

Required outputs:

- exact city allowlist
- selection rationale
- country/nation/region coverage rationale
- explicit exclusions or Tier B candidates

Completion gate: the Tier A list is fixed and documented.

## Phase 2 — Slug and geography normalization

Normalize each Tier A city in `core.geographies`.

Required checks:

- canonical slug
- geography type
- scope kind
- country and region/nation mapping
- aliases
- duplicate handling
- municipality/metro/locality scope definition

Completion gate: each Tier A city resolves to one canonical geography and the contract is guarded by tests.

## Phase 3 — Institution and programme linkage

Build the canonical relationship chain:

`city -> campus -> institution -> programme offering -> programme`

Rules:

- institution identity must use the country's authoritative provider identifier where one exists
- campus-city linkage must be explicit
- programme delivery must not be inferred from institution presence
- programme linkage requires an explicit offering/location relationship
- unsupported or legacy-only programme data must be labelled as such

Completion gate: city-level institution and programme linkage is queryable, source-backed and contract-tested.

## Phase 4 — Five core metrics

Every Tier A city must have the same five verified metrics:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Rules:

- prefer official or primary sources
- record source date/effective date
- normalize only when methodology is explicit
- keep national rules such as work rights distinct from city-level differentiators

Completion gate: every Tier A city has exactly five verified metric records.

## Phase 5 — City profile

Implement `/cities/{country-route}/{city-slug}`.

Required behaviour:

- exact Tier A allowlist
- canonical metadata
- verified metrics only
- canonical institutions
- programme coverage state
- source disclosure
- no fabricated values for missing programme coverage

## Phase 6 — Compare

Connect Tier A cities to City Compare.

Compare readiness requires:

- published Tier A city
- all five verified metrics
- at least one linked campus
- at least one linked canonical institution

Programme count is a readiness requirement only when the country's canonical programme catalogue is mature enough for programme coverage to be meaningful. Otherwise the UI must show a clear catalogue-gap state.

## Phase 7 — Publication and SEO

Required checks:

- sitemap contains only approved Tier A routes
- canonical URLs are correct
- unsupported city routes return not found/noindex as appropriate
- metadata is country-specific
- no Tier B city leaks into indexed surfaces

## Phase 8 — QA

Run:

- DB contract checks
- route allowlist checks
- source/verification checks
- empty-state checks
- comparison checks
- sitemap checks
- preview/build checks

## Phase 9 — Integration

Merge the completed country rollout branch into the current cities integration baseline. Do not merge to `main` until the user schedules the release.

## Phase 10 — Main and deploy

After explicit release approval:

- merge to `main`
- verify production migrations/read models
- smoke-test city routes and Compare
- verify sitemap/canonical metadata

## Standard checkpoints

Use these four progress checkpoints in status reports:

1. `DATA_FOUNDATION_COMPLETE` — Phases 0-2
2. `LINKAGE_COMPLETE` — Phase 3
3. `METRICS_COMPLETE` — Phase 4
4. `PUBLISH_READY` — Phases 5-8

## Standard branch chain

Use one branch per stage so progress is visible from Git history:

```text
agent/{country}-cities-readiness-v1
  -> agent/{country}-cities-scope-v1
  -> agent/{country}-cities-foundation-v1
  -> agent/{country}-cities-linkage-v1
  -> agent/{country}-cities-metrics-v1
  -> agent/{country}-cities-city-compare-v1
```

Each data-changing phase should ship together with the relevant migration/read model, contract test and documentation.

## Publication principle

Never make missing data look complete. A city can publish with a clearly disclosed programme-catalogue gap when the institution linkage and five city metrics are verified, but programme delivery must never be inferred from institution presence.