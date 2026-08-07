# Australia city normalization v1

## Goal
Normalize the existing Australian institution/campus city strings to stable `core.geographies` IDs without breaking the legacy `public.colleges_au` / `public.courses_au` read model.

## Canonical rule
- Prefer the existing ABS-backed Significant Urban Area (`au-abs-32180ds0004-v1`) geography when the campus `city + state` has an exact match.
- Keep a stable CampCareer city geography only when the current ABS SUA subset has no matching record.
- Treat a suburb/locality separately from the city/metro geography.
- Do not write city IDs back into raw ingest tables in this phase.

## Normalization result
- 44 active Australian catalog campuses
- 44 / 44 have a non-null canonical city geography ID
- 44 / 44 resolve to an active `geography_type = city`
- 19 distinct city IDs are used
- 42 / 42 legacy `public.colleges_au` institutions map through `AU_PROVIDER_ID` to a catalog institution, campus, and city ID
- 9,743 / 9,743 legacy `public.courses_au` rows can reach a canonical city ID through institution -> campus -> geography

### Main city IDs
| City | Canonical source | Slug |
| --- | --- | --- |
| Sydney | ABS SUA 1031 | `sydney` |
| Melbourne | ABS SUA 2011 | `melbourne` |
| Brisbane | ABS SUA 3002 | `brisbane` |
| Perth | ABS SUA 5009 | `perth` |
| Adelaide | ABS SUA 4001 | `adelaide` |

### Fallback cities
The current core ABS SUA subset does not contain matching records for:
- Armidale
- Bathurst
- Lismore

Their existing stable CampCareer geography IDs remain canonical for now. They are explicitly marked with `city_normalization_method = stable_city_fallback` so a later official-source enrichment can replace them without changing callers.

### Locality exception
`Sippy Downs` is not treated as the canonical city for University of the Sunshine Coast.

The campus now resolves as:
- city: Sunshine Coast (ABS SUA 3015)
- locality: Sippy Downs
- city slug: `sunshine-coast`

## Legacy rows
Of the original 19 `cities_au` geography rows:
- 15 exact duplicates were converted to deprecated alias records that point to ABS canonical cities
- 3 remain active canonical city fallbacks
- 1 became an active locality (`Sippy Downs`)

`core.geography_aliases` now retains legacy names and legacy slugs so ingestion and future URL normalization can resolve old values without recreating duplicate cities.

## Compatibility
`ingest.colleges_au`, `public.colleges_au`, `ingest.courses_au`, and `public.courses_au` were not structurally changed in this step. The existing Programs page can continue using the legacy read model while later city-aware program filtering moves to catalog joins.

## Known limitation
The current catalog has one normalized listed campus per institution for most Australian institutions. This is enough to normalize the existing dataset, but it is not yet a complete physical multi-campus directory. Step 3/4 should not claim that every programme is delivered at that listed campus until programme-offering campus evidence is enriched from official provider/CRICOS sources.

## Migration
`20260807095621_normalize_australia_campus_city_ids_v1.sql`
