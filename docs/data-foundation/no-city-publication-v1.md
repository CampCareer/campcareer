# Norway Cities — Phase 7 publication and SEO v1

Status: `PHASE_7_COMPLETE`
Checkpoint: `FIVE_CITY_PUBLICATION_LOCKED`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Published cohort

Exactly five Norway City routes are promoted to the published allowlist:

- `/cities/no/oslo`
- `/cities/no/trondheim`
- `/cities/no/stavanger`
- `/cities/no/as`
- `/cities/no/tromso`

`PUBLISHED_NO_CITY_SLUGS` is the publication authority. `SUPPORTED_NO_CITY_SLUGS` aliases the same exact cohort so application and publication scope cannot drift.

## Metadata contract

Published routes use:

- canonical `/cities/no/{slug}`
- `robots: { index: true, follow: true }`
- municipality-specific title and description

Unsupported Norway slugs remain rejected by the route and return `noindex, nofollow` metadata when metadata resolution is attempted.

## Sitemap contract

The root sitemap includes only `PUBLISHED_NO_CITY_SLUGS` under `/cities/no/{slug}`.

Deferred cities remain excluded:

`bodo, kongsberg, kristiansand, bergen, elverum`

No deferred city is silently promoted by sitemap generation.

## Compare publication boundary

City profiles link to the shared Compare surface:

`/compare?type=city&country=NO`

The parameterized Compare surface remains globally `noindex, nofollow`; only canonical City profile pages are SEO-published in Phase 7.

## Coverage disclosures

Publication does not change the underlying evidence limits:

- programme counts remain `verified_partial`
- the provider foundation remains the NOKUT university-category subset rather than Norway's complete approved HEI universe
- study-location rows are not a complete physical-campus inventory
- national student-funds and work-rights context must not be represented as city differentiation

## Phase 7 conclusion

The exact five-city Norway cohort is publication-enabled and sitemap-visible. QA remains Phase 8.
