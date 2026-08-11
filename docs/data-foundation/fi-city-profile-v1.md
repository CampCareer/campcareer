# Finland Cities — Phase 5 city profiles v1

Status: `PHASE_5_COMPLETE`
Checkpoint: `PROFILE_COMPLETE`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Route allowlist

Phase 5 implements exactly eight supported routes:

- `/cities/fi/helsinki`
- `/cities/fi/espoo`
- `/cities/fi/tampere`
- `/cities/fi/turku`
- `/cities/fi/oulu`
- `/cities/fi/jyvaskyla`
- `/cities/fi/lappeenranta`
- `/cities/fi/joensuu`

The code-level allowlist is `SUPPORTED_FI_CITY_SLUGS`.

No Tier B candidate is routable through the Finland profile loader.

## Phase 5 publication boundary

This phase makes the eight profiles functional but does not complete SEO publication.

Supported FI routes use:

`robots: { index: false, follow: true }`

Unsupported FI slugs return not found and their generated metadata is:

`robots: { index: false, follow: false }`

Phase 5 does not add Finland routes to the sitemap. Indexing and sitemap promotion remain Phase 7 responsibilities.

## Data contract

The server loader reads only:

- `public.city_directory_fi_v1`
- `public.city_institution_directory_fi_v1`
- `public.city_programme_directory_fi_v1`
- verified `public.report_metric_evidence_city` rows

It does not query raw campus/offering tables to invent profile claims.

## Profile content

Every supported route can surface:

- Statistics Finland municipality code and region
- verified municipality population
- official national student living-budget planning range
- source-native student transport reference
- national Migri student-work context
- local employment-sector context
- verified university-core study-location representatives
- verified-partial programme count and up to eight programme examples
- source disclosure for all five core metrics

## Programme and provider disclosure

The profile explicitly states that:

- the current provider foundation is a selected ten-university core
- it is not Finland's full recognised HEI/UAS universe
- institution identity remains `provisional_name_identity_studyinfo_oid_pending`
- programme counts are `verified_partial`
- source-native degree level may be displayed
- canonical `qualification_level_id` repair remains pending

Institution presence alone is never used to infer programme delivery.

## Geography disclosure

The profile labels the city as a Statistics Finland municipality. Helsinki and Espoo stay separate and are never silently combined into a Helsinki metro population or programme scope.

## Compare boundary

No Finland City Compare link is added in Phase 5. Compare is Phase 6.

## Phase 5 conclusion

Finland Cities Phase 5 is implementation-complete with exact eight-route support and conservative coverage disclosure.

Checkpoint: `PROFILE_COMPLETE`.

The rollout has not yet reached `PUBLISH_READY`; that checkpoint requires Phases 6–8.
