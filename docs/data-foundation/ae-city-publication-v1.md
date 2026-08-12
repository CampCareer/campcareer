# United Arab Emirates Cities — Phase 7 publication v1

Status: `PHASE_7_COMPLETE`

Checkpoint: `PUBLICATION_COMPLETE`

Country: `AE` — United Arab Emirates

Audit date: 2026-08-12

Branch: `agent/ae-cities-v1`

## Published cohort

Exactly four UAE City profiles are approved for indexing:

- Abu Dhabi
- Sharjah
- Al Ain
- Dubai

The publication source of truth is `PUBLISHED_AE_CITY_SLUGS`.

No later candidate is added to the public City allowlist. The following remain deferred:

- Khor Fakkan
- Ajman
- Fujairah
- Ras Al Khaimah
- Umm Al Quwain

## Route and metadata contract

Published routes use:

- `/cities/ae/{slug}`
- canonical metadata matching the route
- `robots: { index: true, follow: true }`

Unsupported UAE City slugs remain:

- `robots: { index: false, follow: false }`
- not found at the route layer

## Sitemap

UAE City sitemap entries are generated directly from `PUBLISHED_AE_CITY_SLUGS`.

No manually maintained second City list is introduced.

## Compare boundary

Parameterized City Compare remains deliberately non-indexable:

`/compare?type=city&country=AE&left={slug}&right={slug}`

The shared Compare page stays:

`robots: { index: false, follow: false }`

Compare URLs are not added to the sitemap.

## Evidence disclosure retained

Publication does not relax the earlier data boundaries:

- City and containing emirate remain separate geography concepts
- emirate population is not substituted for City-locality population
- living-cost references remain heterogeneous and `ranking_safe=false`
- transport remains source-native
- student work remains national MOHRE permit context with no invented universal weekly cap
- institution coverage remains a selected verified provider foundation
- programme counts remain `verified_partial`
- accreditation does not imply current international admission is open

## Phase 7 conclusion

UAE Cities has reached `PUBLICATION_COMPLETE`.

Phase 8 must recheck the complete production and application contract before declaring `PUBLISH_READY`.
