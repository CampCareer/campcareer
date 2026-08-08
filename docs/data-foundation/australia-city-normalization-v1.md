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
- Postcode is not used as the primary metro-membership rule because the CRICOS location snapshot contains postcode inconsistencies; reviewed `state + locality` membership is used instead.

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

## Brisbane verified result
Brisbane follows the same official CRICOS delivery-location rule. Greater Brisbane membership is reviewed using QLD plus locality, not postcode.

The current CRICOS locality set includes Brisbane/Brisbane City, Fortitude Valley, Herston, Banyo, Kelvin Grove, St Lucia, South Bank/South Brisbane, Woolloongabba, Nathan, Mount Gravatt, Meadowbrook, Springfield Lakes, Ipswich, Petrie and Caboolture.

Gold Coast locations such as Coomera, Southport, Bilinga and Robina remain outside Brisbane. Sunshine Coast and regional Queensland locations such as Sippy Downs, Toowoomba and Gatton are also kept separate.

For the current CRICOS snapshot:
- canonical Brisbane ID: `1b389596-4b1f-96a1-5f33-e6d8f675402d`
- 26 official CRICOS registered delivery locations mapped to Greater Brisbane
- 14 education providers with at least one mapped Brisbane location
- 1,330 active CRICOS programs with at least one verified Brisbane delivery location
- 26 / 26 reviewed Brisbane locations resolve to the canonical Brisbane ID
- 0 official CRICOS campuses outside QLD remain mapped to Brisbane

Brisbane city evidence is published separately from the CRICOS membership layer. Its initial student-decision profile uses ABS population, UQ living-cost guidance, Translink's flat 50-cent fare, Australian Government student work rights, and Brisbane Economic Development Agency industry context. The Translink fare is stored as `AUD/trip`; it is deliberately not converted into an arbitrary weekly estimate.

## Perth verified result
Perth follows the same official delivery-location rule. Greater Perth membership is reviewed using WA plus locality rather than postcode.

The current CampCareer provider set maps the following CRICOS localities to the Greater Perth study destination: Perth, Crawley, Joondalup, Mt Lawley, Bentley, Murdoch and Fremantle.

Regional Western Australian destinations remain separate. Stake Hill and Mandurah are not folded into Perth, and Bunbury, Kalgoorlie, Broome and Margaret River retain their own regional location identity.

For the current CRICOS snapshot:
- canonical Perth ID: `ce80bdf1-f6f6-bde4-1bd6-5b742663b96b`
- 11 official CRICOS registered delivery locations mapped to Greater Perth
- 6 education providers with at least one mapped Perth location
- 1,215 active CRICOS programs with at least one verified Perth delivery location
- 11 / 11 reviewed Perth locations resolve to the canonical Perth ID
- 0 official CRICOS campuses outside WA remain mapped to Perth

Perth city evidence uses ABS Greater Perth population, Murdoch University's approximate A$500/week living-cost guide, Transperth's tertiary concession Go Anywhere fare, Australian Government student work rights, and City of Perth economic-development sectors. The living-cost headline is stored as a calculated monthly equivalent (`500 × 52 ÷ 12 ≈ A$2,167/month`) and remains explicitly marked `calculated`. The Transperth fare is stored per trip rather than converted into a weekly estimate.

## Adelaide verified result
Adelaide follows the same official delivery-location rule. Greater Adelaide membership is reviewed using South Australia plus an explicit locality list rather than postcode.

The current reviewed metro set includes Adelaide, North Adelaide, Regency Park, Wayville, Bedford Park, Clovelly Park, Netherby, Urrbrae, Magill, Gilles Plains, Mawson Lakes and Parafield Airport. Regional South Australian delivery locations including Mount Gambier, Renmark, Nuriootpa, Wasleys and Whyalla remain separate.

The CRICOS source contains two North Terrace records whose city value is `AUSTRALIA` even though the registered address is 230 North Terrace, Adelaide SA 5005. These are mapped to Adelaide only when the state is SA and the exact registered location name is `The University of Adelaide, North Terrace`; CampCareer does not generalise the anomaly into a postcode rule.

For the current CRICOS snapshot:
- canonical Adelaide ID: `a0cbe90e-6bf8-3b39-d4b1-091e03a8e429`
- 27 official CRICOS registered delivery locations mapped to Greater Adelaide
- 10 education providers with at least one mapped Adelaide location
- 1,302 active CRICOS programs with at least one verified Adelaide delivery location
- 27 / 27 reviewed Adelaide locations resolve to the canonical Adelaide ID
- 0 official CRICOS campuses outside SA remain mapped to Adelaide

Adelaide city evidence uses ABS Greater Adelaide population, StudyAdelaide's A$350-A$700/week international-student living-cost range, Adelaide Metro tertiary concession fares, Australian Government student work rights, and Government of South Australia industry context. The living range is stored as calculated monthly equivalents (`weekly × 52 ÷ 12 ≈ A$1,517-A$3,033/month`). The transport headline is the tertiary concession peak fare, A$2.25/trip; the A$1.30 off-peak fare and A$59.60 28-day concession pass are retained in the evidence record. The cheaper Adelaide Metro `Student` category is not used because that category applies to school students rather than tertiary students.

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
`scripts/sync-au-cricos-locations.ts` downloads the official CKAN Locations and Course Locations resources, replaces the raw location snapshots, and rebuilds verified campuses, offerings and Sydney/Melbourne/Brisbane/Perth/Adelaide city publication rows.

It requires a direct Postgres connection string in `SUPABASE_DB_URL` or `DATABASE_URL`. Database outbound HTTP is not left enabled after the one-time bootstrap.

Before refreshing locations, refresh the CRICOS Courses catalogue when the official Courses resource has materially changed so new course codes are present in `ingest.courses_au`.

## Compatibility
`public.courses_au` remains the Programs read model. It exposes:
- `verified_city_ids`
- `verified_city_slugs`
- `verified_delivery_locations`
- CRICOS location source/freshness fields

The `/programs?city=<slug>` product filter reads only `verified_city_slugs`; program detail pages show the exact registered locations behind city membership. Sydney, Melbourne, Brisbane, Perth and Adelaide now use the same verified data-layer rule and do not fall back to institution representative cities.

## Migrations
- `20260807095621_normalize_australia_campus_city_ids_v1.sql`
- `20260807124754_cricos_program_location_index_v1.sql`
- `20260807125709_backfill_missing_au_cricos_programmes_v1.sql`
- `20260807125832_materialize_au_cricos_campuses_v1.sql`
- `20260807125930_verify_au_cricos_programme_locations_v1.sql`
- `20260807130206_republish_sydney_cricos_campus_directory_v1.sql`
- `20260807133904_normalize_melbourne_cricos_city_v1.sql`
- `20260807134828_publish_melbourne_city_metrics_v1.sql`
- `20260807174234_normalize_brisbane_cricos_city_v1.sql`
- `20260807174510_publish_brisbane_city_metrics_v1.sql`
- `20260807181433_normalize_perth_cricos_city_v1.sql`
- `20260807181551_publish_perth_city_metrics_v1.sql`
- `20260807185359_normalize_adelaide_cricos_city_v1.sql`
- `20260807185458_publish_adelaide_city_metrics_v1.sql`
