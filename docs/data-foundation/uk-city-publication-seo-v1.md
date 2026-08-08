# UK city publication and SEO v1

Status: PHASE_7_IN_PROGRESS

This document records the Phase 7 publication contract for the ten approved UK Tier A cities.

## Publication scope

Only these canonical routes are indexable:

- `/cities/uk/london`
- `/cities/uk/manchester`
- `/cities/uk/birmingham`
- `/cities/uk/edinburgh`
- `/cities/uk/glasgow`
- `/cities/uk/cardiff`
- `/cities/uk/belfast`
- `/cities/uk/oxford`
- `/cities/uk/cambridge`
- `/cities/uk/bristol`

Leeds, Nottingham and every other UK city remain outside the publication allowlist.

## Indexability gate

An indexable UK city route must be present in `PUBLISHED_UK_CITY_SLUGS`. The page layer must return `notFound()` for unsupported slugs. Metadata for unsupported slugs remains `noindex, nofollow`.

The approved ten routes are indexable even though programme delivery remains `verification_pending`, because the country rollout standard permits publication when canonical institution linkage and all five city metrics are verified. Programme delivery is not inferred from institution presence.

## Canonical URL contract

Every approved city uses the canonical form:

`/cities/uk/{canonical-city-slug}`

No alternate GB route is introduced. CampCareer continues to use `UK` as the canonical country code and `/uk/` as the route segment.

## Country-specific metadata

Approved pages use:

- title: `Study in {City}, United Kingdom`
- description covering student living costs, transport, Student visa work context, verified institutions and programme-delivery coverage
- canonical URL: `/cities/uk/{slug}`
- robots: `index, follow`

## Sitemap contract

`src/app/sitemap.ts` must derive UK city entries directly from `PUBLISHED_UK_CITY_SLUGS` rather than duplicating a second hard-coded UK list. This ensures sitemap publication cannot drift from the route allowlist.

Each route uses monthly change frequency and the existing city-page priority convention.

## Scope disclosure

Publication does not change the Phase 2 geography contract:

- London uses Greater London.
- Manchester does not absorb Salford.
- Other Tier A cities retain the approved named-city/local-authority scope.

## Compare relationship

The indexable city profile links to UK City Compare. Compare itself remains `noindex` under the existing root Compare metadata; it is a decision tool, not an SEO landing page.

## Programme coverage

The current programme linkage remains verification pending. Indexed city pages must keep the explicit coverage warning and must not present missing verified delivery as `0 programmes`.

## Phase 7 completion checks

- [ ] approved ten routes are `index, follow`
- [ ] unsupported slugs remain noindex/not-found
- [ ] sitemap imports `PUBLISHED_UK_CITY_SLUGS`
- [ ] sitemap emits `/cities/uk/${slug}` only for the ten approved slugs
- [ ] no Leeds or Nottingham entry exists in the UK city sitemap surface
- [ ] canonical metadata uses `/cities/uk/{slug}`
- [ ] country-specific title and description use United Kingdom / Student visa terminology
- [ ] Phase 5 contract updated so it no longer asserts the intentionally temporary noindex/Compare-disabled state
- [ ] Phase 7 publication contract test added

## Deployment note

Vercel preview execution is currently blocked by the account deployment-rate limit observed on the Phase 5 and Phase 6 branch heads. This is an external preview-capacity condition, not a Phase 7 publication-rule change. Build/preview verification belongs to Phase 8 QA when execution is available.
