# South Korea Cities — Phase 7 publication v1

Status: `PHASE_7_COMPLETE`

Checkpoint: `PUBLICATION_COMPLETE`

Country: `KR` — South Korea

Audit date: 2026-08-12

## Published cohort

Exactly six South Korea city profiles are approved for indexing:

- Seoul
- Busan
- Daejeon
- Suwon
- Yongin
- Pohang

The publication source of truth is `PUBLISHED_KR_CITY_SLUGS`.

No later candidate or provider-expansion candidate is added to the public city allowlist. In particular:

- Cheonan remains outside Tier A
- Goyang remains outside Tier A
- Incheon, Daegu, Gwangju, Ulsan, Jeonju, Jeju and Sejong remain provider-expansion candidates

## Route and metadata contract

Published routes use:

- `/cities/kr/{slug}`
- canonical metadata matching the route
- `robots: { index: true, follow: true }`

Unsupported South Korea city slugs remain:

- `robots: { index: false, follow: false }`
- not found at the route layer

## Sitemap

South Korea city sitemap entries are generated directly from `PUBLISHED_KR_CITY_SLUGS`.

No manually maintained second city list is introduced.

## Compare boundary

Parameterized City Compare remains deliberately non-indexable:

`/compare?type=city&country=KR&left={slug}&right={slug}`

The shared Compare page stays:

`robots: { index: false, follow: false }`

Compare URLs are not added to the sitemap.

## Evidence disclosure retained

Publication does not relax the earlier data boundaries:

- population remains MOIS/KOSIS administrative-boundary based
- living-cost planning reference remains national and `ranking_safe=false`
- transport remains source-native
- student work remains conditional national context
- institution coverage remains the current verified Study in Korea provider foundation
- programme counts remain verified-partial rather than complete city catalogues
- Suwon and Yongin programme evidence remains isolated from Seoul inherited-campus leakage

## Phase 7 conclusion

South Korea Cities has reached `PUBLICATION_COMPLETE`.

Phase 8 must recheck the complete production and application contract before declaring `PUBLISH_READY`.
