# Switzerland Cities — Phase 7 publication and SEO v1

Status: `PHASE_7_COMPLETE`
Checkpoint: `SIX_CITY_PUBLICATION_LOCKED`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Published cohort

Exactly six Switzerland City routes are promoted to the published allowlist:

- `/cities/ch/zurich`
- `/cities/ch/lausanne`
- `/cities/ch/basel`
- `/cities/ch/lugano`
- `/cities/ch/fribourg`
- `/cities/ch/geneva`

`PUBLISHED_CH_CITY_SLUGS` is the publication authority. `SUPPORTED_CH_CITY_SLUGS` aliases the same exact cohort so application and publication scope cannot drift.

## Metadata contract

Published routes use:

- canonical `/cities/ch/{slug}`
- `robots: { index: true, follow: true }`
- municipality-specific title and description

Unsupported Switzerland slugs remain rejected by the route and return `noindex, nofollow` metadata when metadata resolution is attempted.

## Sitemap contract

The root sitemap includes only `PUBLISHED_CH_CITY_SLUGS` under `/cities/ch/{slug}`.

Deferred Cities remain excluded:

`neuchatel, bern, st-gallen, lucerne`

No deferred City is silently promoted by sitemap generation.

## Compare publication boundary

City profiles link to the shared Compare surface:

`/compare?type=city&country=CH`

The parameterized Compare surface remains globally `noindex, nofollow`; only canonical City profile pages are SEO-published in Phase 7.

## Coverage disclosures

Publication does not change the underlying evidence limits:

- programme counts remain `verified_partial`
- the provider foundation remains the 12 swissuniversities university-category institutions rather than the complete accredited HEI universe
- study-location representatives are not a complete physical-campus inventory
- Lausanne continues to exclude EPFL municipality linkage without evidence inside Lausanne municipality
- source-native living and transport references must not be represented as a harmonized City cost ranking
- national third-country student-work context must not be represented as City differentiation

## Phase 7 conclusion

The exact six-City Switzerland cohort is publication-enabled and root-sitemap-visible. QA remains Phase 8.
