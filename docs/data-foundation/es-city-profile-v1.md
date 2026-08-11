# Spain Cities — Phase 5 city profiles v1

Status: `PHASE_5_COMPLETE`

Checkpoint: `PROFILE_COMPLETE`

Country: `ES` — Spain

Audit date: 2026-08-11

## Route allowlist

Phase 5 implements exactly seven supported functional routes:

- `/cities/es/madrid`
- `/cities/es/barcelona`
- `/cities/es/valencia`
- `/cities/es/sevilla`
- `/cities/es/granada`
- `/cities/es/malaga`
- `/cities/es/bilbao`

The code-level allowlist is `SUPPORTED_ES_CITY_SLUGS`.

No Tier B or rectorate/locality-only geography is routable through the Spain profile loader.

## Phase 5 publication boundary

Phase 5 makes the seven routes functional in application code but does not complete SEO publication.

Supported Spain routes use:

`robots: { index: false, follow: true }`

Unsupported Spain slugs use:

`robots: { index: false, follow: false }`

Spain routes are not added to a published-city constant or sitemap in this phase. Indexing, sitemap and City Compare remain later-phase work.

No Vercel production deployment is required for the Phase 5 checkpoint.

## Data contract

The server loader reads only the private Phase 3–4 read models through the service-role client:

- `public.city_directory_es_v1`
- `public.city_institution_directory_es_v1`
- `public.city_programme_directory_es_v1`
- `public.city_metric_directory_es_v1`

The page does not read raw rectorate/contact rows and does not infer programme city delivery from institution presence.

## Profile content

Every supported route can surface:

- INE municipality identity and 2025 population
- source-native student living-cost reference with full-budget/partial-budget disclosure
- source-native student/youth transport reference
- national student-work context
- official local strategic economic-sector context
- verified teaching-location representatives
- conservative programme coverage status and up to eight exact city-linked programme examples
- source disclosure for all five core metrics

## Programme coverage boundary

Current strict city-linked programme counts are:

- Madrid: `50`
- Barcelona: `33`
- Sevilla: `8`
- Málaga: `6`
- Valencia: `0 / verification_pending`
- Granada: `0 / verification_pending`
- Bilbao: `0 / verification_pending`

A zero value for Valencia, Granada or Bilbao is rendered as verification pending, not as a claim that the city has no programmes.

EHU programmes sourced to Leioa are not inherited into Bilbao. UAB programmes sourced to Cerdanyola del Vallès are not inherited into Barcelona.

## Metric methodology boundary

Living-cost references are intentionally heterogeneous because the official sources do not provide one equivalent city-by-city series. The profile exposes each source's methodology note and does not present the values as a cheapest-city ranking.

Transport also keeps source-native product periods rather than normalising every product to a synthetic monthly fare.

Employment sectors are context only, not shortage rankings or job guarantees. The 30-hour student-work rule is national immigration context, not a city differentiator.

## Phase 5 conclusion

Spain Cities is implementation-complete through Phase 5.

Checkpoint: `PROFILE_COMPLETE`.

The rollout is not yet `PUBLISH_READY`. Compare, SEO publication, sitemap promotion, cross-phase QA and final release remain later phases.
