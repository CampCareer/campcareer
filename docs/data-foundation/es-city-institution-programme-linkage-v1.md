# Spain Cities — Phase 3 institution and programme linkage v1

Status: `PHASE_3_COMPLETE`

Checkpoint: `LINKAGE_COMPLETE`

Country: `ES` — Spain

Audit date: 2026-08-11

Production migration: `20260811140230_publish_es_tier_a_city_linkage_v1`

## Purpose

Establish evidence-backed institution and teaching-location linkage for the seven Phase 2 Tier A municipalities without turning rectorate addresses, neighbouring localities or inherited programme campus IDs into city-delivery claims.

## Provider expansion

Phase 3 expands the active Spain institution foundation from 10 to 13 institutions by adding the material providers explicitly gated in Phase 1:

- Universitat de València
- Universitat Politècnica de València
- Universidad de Granada

All three use `ES_OFFICIAL_UNIVERSITY_NAME` as the current verified identity layer. A machine-stable RUCT institution code remains future identity-maturity work and is not invented in this phase.

## Verified teaching-location representatives

Phase 3 creates 10 official-source teaching-location representatives across all seven Tier A destinations:

| City | Verified provider representatives | Programme assignment status |
| --- | ---: | --- |
| Madrid | UAM Cantoblanco; UCM Moncloa / Ciudad Universitaria | verified for exact source-city programme linkage |
| Barcelona | Universitat de Barcelona; UPC Campus Nord | verified for exact source-city programme linkage |
| Valencia | Universitat de València Blasco Ibáñez; UPV Vera | teaching location verified; programme assignment pending |
| Sevilla | Universidad de Sevilla Ramón y Cajal / Facultad de Derecho | verified for exact source-city programme linkage |
| Granada | Universidad de Granada city campus network | teaching location verified; programme assignment pending |
| Málaga | Universidad de Málaga Teatinos | verified for exact source-city programme linkage |
| Bilbao | EHU Escuela de Ingeniería de Bilbao | teaching location verified; programme assignment pending |

The records are representatives for city linkage, not assertions that the complete campus inventory has been collected.

## Strict programme linkage

The existing 167 Spain programme rows were re-evaluated against the authoritative `program_catalog_es_staging.city` value.

Only source-city exact matches are exposed through `city_programme_directory_es_v1`:

- Madrid: 50
- Barcelona: 33
- Sevilla: 8
- Málaga: 6
- Valencia: 0
- Granada: 0
- Bilbao: 0

Total strict city-linked programmes: `97`.

The following are deliberately excluded:

- EHU programmes whose source city is Leioa are not relabelled as Bilbao.
- UAB programmes whose source city is Cerdanyola del Vallès are not relabelled as Barcelona.
- Valencia and Granada receive provider and teaching-location coverage but no programme count until programme-to-location evidence is collected.

## Read models

Phase 3 creates service-role-only, `security_invoker` views:

- `public.city_institution_directory_es_v1`
- `public.city_programme_directory_es_v1`
- `public.city_directory_es_v1`

`anon`, `authenticated` and `public` access is revoked. Publication remains an application/server concern.

## Production verification

- active Spain institutions: `13`
- verified Tier A teaching-location representatives: `10`
- Tier A cities with at least one verified institution/location: `7/7`
- strict city-linked programmes: `97`
- source-city mismatches: `0`
- forbidden Leioa → Bilbao programme leakage: `0`
- forbidden Cerdanyola → Barcelona programme leakage: `0`

## Phase 3 conclusion

Spain Cities has reached `LINKAGE_COMPLETE`.

Phase 4 may publish the Five Core Metrics while keeping metric semantics source-native and avoiding false cross-city comparability.
