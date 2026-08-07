# Australia city normalization v1

## Goal
Normalize Australian institution/campus city data to stable `core.geographies` IDs, then use official CRICOS registered delivery locations for city-aware program search and city comparison.

## Canonical rule
- Prefer the existing ABS-backed Significant Urban Area (`au-abs-32180ds0004-v1`) geography when the campus `city + state` has an exact match.
- Keep a stable CampCareer city geography only when the current ABS SUA subset has no matching record.
- Treat a suburb/locality separately from the city/metro geography.
- A program belongs to a city only when an official course-location record points to a registered campus that has been mapped to that canonical city.
- An institution's representative/headquarter city is never sufficient evidence for a program-city claim.
- Metro locality matching must include the state. A locality name alone is not enough because names such as `Richmond` occur in multiple states.

## Step 2 normalization result
- 44 active Australian catalog campuses in the original representative-campus layer
- 44 / 44 had a non-null canonical city geography ID
- 19 distinct city IDs were used
- the legacy program catalogue could reach a city through institution -> representative campus, but that relationship was explicitly treated as provisional rather than delivery evidence

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

The campus resolves as:
- city: Sunshine Coast (ABS SUA 3015)
- locality: Sippy Downs
- city slug: `sunshine-coast`

## Step 4 CRICOS delivery-location layer
The Australian Government CRICOS dataset is now the authority for program delivery locations.

Resources used:
- CRICOS Locations
- CRICOS Course Locations
- CRICOS Courses / Institutions for provider-code repair and missing program coverage

Source dataset:
`https://data.gov.au/data/dataset/commonwealth-register-of-institutions-and-courses-for-overseas-students-cricos`

Current source snapshot (4 August 2026):
- 3,931 registered CRICOS locations
- 47,916 unique course-location relationships (the source contains one exact duplicate relationship)
- 11,668 active CampCareer Australian programs across all 44 catalog institutions
- 16,487 verified canonical programme offerings across 11,600 active programs
- 68 active programs have no matching course-location relationship in the current official snapshot and therefore receive no verified city claim

The old July `programme_offerings` representative-campus backfill is retained for compatibility but marked `source_system = legacy_backfill` and `verification_status = unverified`. City filtering does not use it.

## Sydney verified result
Sydney means the Greater Sydney student destination rather than only the City of Sydney local government area.

The initial locality whitelist did not require the CRICOS location state and therefore incorrectly classified the University of Melbourne Burnley campus at Richmond VIC as Sydney. The state-aware normalization removes that collision.

For the current CRICOS snapshot after correction:
- canonical Sydney ID: `efe4c42f-cd2b-09bd-3834-624a53d2f9fb`
- 79 official CRICOS registered delivery locations mapped to Greater Sydney
- 22 education providers with at least one mapped Sydney location
- 3,332 active CRICOS programs with at least one verified Sydney delivery location
- 0 official CRICOS campuses outside NSW remain mapped to Sydney

This supersedes both the earlier representative-city count and the temporary 80 / 23 / 3,334 CRICOS result before the Richmond VIC state collision was removed.

## Melbourne verified result
Melbourne uses the same delivery-location rule as Sydney. The metro whitelist includes registered CRICOS localities such as Melbourne CBD, Parkville, Southbank, Docklands, Footscray, Sunshine, St Albans, Point Cook, Werribee, Brunswick, Fitzroy, Bundoora, Donvale, Richmond, Hawthorn, Wantirna, Burwood, Box Hill, Caulfield East, Chadstone, Prahran, Frankston, Clayton and Berwick when the official state is VIC.

Regional Victorian destinations remain separate. Geelong, Ballarat, Bendigo, Warrnambool, Mildura, Wodonga and similar locations are not folded into Melbourne.

For the current CRICOS snapshot:
- canonical Melbourne ID: `8f42442b-2645-0706-dcbe-60d804f96146`
- 47 official CRICOS registered delivery locations mapped to Greater Melbourne
- 17 education providers with at least one mapped Melbourne location
- 3,025 active CRICOS programs with at least one verified Melbourne delivery location
- 47 / 47 expected Melbourne locations resolve to the canonical Melbourne ID
- 397 active programs are registered in both Sydney and Melbourne and therefore correctly carry both city slugs

Melbourne is normalized in the data layer first. Product exposure can be added separately when the Sydney-vs-Melbourne comparison UI is implemented.

## Program catalog repair
The previous importer omitted nine catalog institutions and contained outdated provider codes. The official provider-code layer now covers all 44 institutions, including:
- University of Sydney: `00026A`
- University of Western Australia: `00126G`
- Avondale University: `02731D`
- TAFE NSW: `00591E`
- TAFE SA: `00092B`
- University of Notre Dame Australia: `01032F`
- University of South Australia: `00121B`
- University of Divinity: `01037A`
- Victoria University: `00124K` and `02475D`

`scripts/import_cricos.py` has been updated so a future course import does not recreate the old omissions.

## Refresh procedure
`scripts/sync-au-cricos-locations.ts` downloads the official CKAN Locations and Course Locations resources, replaces the raw location snapshots, and rebuilds verified campuses, offerings and Sydney/Melbourne city publication rows.

It requires a direct Postgres connection string in `SUPABASE_DB_URL` or `DATABASE_URL`. Database outbound HTTP is not left enabled after the one-time bootstrap.

Before refreshing locations, refresh the CRICOS Courses catalogue when the official Courses resource has materially changed so new course codes are present in `ingest.courses_au`.

## Compatibility
`public.courses_au` remains the Programs read model. It exposes:
- `verified_city_ids`
- `verified_city_slugs`
- `verified_delivery_locations`
- CRICOS location source/freshness fields

The current `/programs?city=sydney` product filter reads only `verified_city_slugs`; program detail pages show the exact registered locations behind city membership. Melbourne now has the same verified data-layer index and can be exposed without reverting to representative-city logic.

## Migrations
- `20260807095621_normalize_australia_campus_city_ids_v1.sql`
- `20260807124754_cricos_program_location_index_v1.sql`
- `20260807125709_backfill_missing_au_cricos_programmes_v1.sql`
- `20260807125832_materialize_au_cricos_campuses_v1.sql`
- `20260807125930_verify_au_cricos_programme_locations_v1.sql`
- `20260807130206_republish_sydney_cricos_campus_directory_v1.sql`
- `20260807133904_normalize_melbourne_cricos_city_v1.sql`
