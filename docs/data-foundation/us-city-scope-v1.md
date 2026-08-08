# United States city scope v1

## Purpose

Define a deliberately small first public set of U.S. study destinations for CampCareer Cities. The selection prioritizes international-student demand and current CampCareer institution/campus coverage rather than general city population or tourism prominence.

The external benchmark is Open Doors 2025 (IIE / U.S. Department of State), using 2024/25 international-student totals and the leading host institutions. The internal readiness signal is the current canonical `core.geographies` + `catalog.campuses` graph.

## Tier A — first public U.S. city set

Publish and compare these eight destinations first:

| City | State | Why it is Tier A | Current canonical city campuses / institutions |
| --- | --- | --- | ---: |
| New York | NY | NYU and Columbia are both among the largest U.S. international-student hosts; New York is the #2 host state | 73 / 73 |
| Boston | MA | Northeastern Boston and Boston University are both top international-student hosts; Massachusetts is the #4 host state | 26 / 26 |
| Los Angeles | CA | USC and UCLA are both top international-student hosts; California is the #1 host state | 51 / 51 |
| Chicago | IL | Illinois is the #5 host state and Chicago has very broad institution coverage in the current canonical graph | 65 / 65 |
| Seattle | WA | University of Washington is a top U.S. international-student host and Seattle has a clear named-city study market | 17 / 17 |
| San Diego | CA | UC San Diego is a top U.S. international-student host and San Diego has substantial local institution coverage | 30 / 30 |
| Philadelphia | PA | Pennsylvania is the #6 host state and Philadelphia has broad multi-institution coverage | 34 / 34 |
| Tempe | AZ | Arizona State University Campus Immersion is one of the largest U.S. international-student hosts; keep Tempe as its exact city rather than relabelling it Phoenix | 12 / 12 |

Approved public slugs for the next phase:

- `new-york`
- `boston`
- `los-angeles`
- `chicago`
- `seattle`
- `san-diego`
- `philadelphia`
- `tempe`

## Tier B — hold for later expansion

Do not publish these in the first U.S. batch, but retain them as strong later candidates:

- San Francisco / Berkeley / wider Bay Area — high demand, but Berkeley and Stanford are separate municipalities; define a metro-study-market contract before aggregating them under a San Francisco label.
- Washington, DC — strong international profile and 25 current city-linked institutions, but lower first-batch evidence than the Tier A set.
- Austin, TX — Texas is the #3 host state and Austin has 23 current city-linked institutions, but the state's largest international-student hosts are distributed beyond Austin.
- Baltimore, MD — Johns Hopkins is a top international-student host and the city has 22 current institution links.
- Ann Arbor, MI — University of Michigan is a top host, but the market is more institution-concentrated than the first-batch urban set.
- Champaign, IL — UIUC is a top host, but current city coverage is concentrated in two institution records.
- Denton, TX — University of North Texas is a top host, but the market is narrow and should be considered with a later Dallas–Fort Worth scope decision.
- West Lafayette, IN — Purdue is a top host, but the market is highly institution-concentrated.

## Scope rule for phase 2

Tier A selection does not authorize metro-area inference. Phase 2 must normalize each approved city as a stable canonical geography and keep campus membership explicit.

In particular:

- Tempe stays Tempe; do not silently merge it into Phoenix.
- Boston does not automatically absorb Cambridge campuses.
- Chicago does not automatically absorb Evanston.
- New York must use a clearly documented city/borough geography contract.
- Los Angeles and San Diego require explicit campus-to-city evidence rather than marketing-area labels.

If a future U.S. product decision adopts metro study markets, add a separate explicit scope model instead of changing named-city membership implicitly.

## Phase 2 normalization status

Production migration `20260808151041_normalize_us_tier_a_city_slugs_v1.sql` normalizes only the eight approved Tier A rows.

The migration:

- preserves all existing canonical geography UUIDs;
- assigns the approved public slugs;
- sets `scope_kind = 'city'` and keeps the rows active;
- records `study_destination_scope = 'named_city'` and `publication_tier = 'A'` in geography metadata;
- records a scope note that prohibits metro, borough and neighbouring-municipality inference without explicit evidence;
- creates canonical-name, source-name and legacy source-slug aliases for future matching.

Post-migration verification confirmed all eight rows have the expected slug, scope and Tier A metadata. Each approved city has three provenance aliases: canonical name, `public.cities_us` source name and the legacy state-qualified source slug such as `new-york-ny`.

New York remains a named-city legacy geography at this stage. No Brooklyn, Queens, Bronx or Staten Island campus records are silently reassigned to it. Campus-level scope quality is verified separately in the institution/programme linkage phase.

## Phase 3 institution/programme linkage status

Production migration `20260808184326_publish_us_tier_a_city_linkage_v1.sql` publishes the U.S. Tier A city linkage read model.

Institution linkage is locked to canonical `catalog.campuses.geography_id` membership. Current active linkage is:

| City | Campus links | Institution links |
| --- | ---: | ---: |
| New York | 73 | 73 |
| Boston | 26 | 26 |
| Los Angeles | 51 | 51 |
| Chicago | 65 | 65 |
| Seattle | 17 | 17 |
| San Diego | 30 | 30 |
| Philadelphia | 34 | 34 |
| Tempe | 12 | 12 |

Across the eight cities there are 308 campus-city linkage rows representing 306 distinct canonical institutions. Every published Tier A institution link has both a canonical institution slug and a `US_UNIT_ID` identifier.

Programme linkage deliberately remains empty. The canonical catalogue currently contains no U.S. `catalog.programmes`, `catalog.programme_offerings` or programme identifiers, so the city layer must not infer programme delivery from institution presence. `city_programme_directory_us_v1` only accepts future programme rows supported by explicit `programme_offerings.campus_id` evidence.

This completes Phase 3 institution linkage and records programme coverage as a data gap, not a zero-offering claim. Phase 4 city metrics may proceed independently. City and Compare surfaces must label linked programme counts conservatively until a canonical U.S. programme catalogue exists.

## Publication limit

The initial U.S. Cities selector, sitemap and City Compare must be bounded to these eight Tier A slugs. Tier B cities remain non-public until separately approved and fully satisfy the same data, metric, linkage and SEO gates used for Australia and Canada.
