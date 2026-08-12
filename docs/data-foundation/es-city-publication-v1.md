# Spain Cities — Phase 7 publication v1

Status: `PHASE_7_COMPLETE`

Checkpoint: `PUBLICATION_COMPLETE`

Country: `ES` — Spain

Audit date: 2026-08-11

## Published cohort

Exactly seven Spain city profiles are approved for indexing:

- Madrid
- Barcelona
- Valencia
- Sevilla
- Granada
- Málaga
- Bilbao

The publication source of truth is `PUBLISHED_ES_CITY_SLUGS`.

No neighbouring locality, rectorate-only geography or later candidate is added to the public city allowlist. In particular:

- Leioa remains separate from Bilbao
- Cerdanyola del Vallès remains separate from Barcelona
- Cádiz remains outside Tier A
- Ciudad Real remains outside Tier A

## Route and metadata contract

Published routes use:

- `/cities/es/{slug}`
- canonical metadata matching the route
- `robots: { index: true, follow: true }`

Unsupported Spain city slugs remain:

- `robots: { index: false, follow: false }`
- not found at the route layer

## Sitemap

Spain city sitemap entries are generated directly from `PUBLISHED_ES_CITY_SLUGS`.

No manually maintained second city list is introduced.

## Compare boundary

Parameterized City Compare remains deliberately non-indexable:

`/compare?type=city&country=ES&left={slug}&right={slug}`

The shared Compare page stays:

`robots: { index: false, follow: false }`

Compare URLs are not added to the sitemap.

## Evidence disclosure retained

Publication does not relax the earlier data boundaries:

- population remains INE municipality-based
- living-cost references remain heterogeneous and `ranking_safe=false`
- transport remains source-native
- student work remains national context
- institution coverage remains a selected verified provider foundation
- Madrid, Barcelona, Sevilla and Málaga programme counts remain verified-partial
- Valencia, Granada and Bilbao programme delivery remains verification pending

## Phase 7 conclusion

Spain Cities has reached `PUBLICATION_COMPLETE`.

Phase 8 must recheck the complete production and application contract before declaring `PUBLISH_READY`.
