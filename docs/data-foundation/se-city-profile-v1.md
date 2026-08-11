# Sweden city profile v1

Status: `PHASE_5_COMPLETE`

Checkpoint: `PROFILE_COMPLETE`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Routes

Phase 5 implements exactly six profile routes:

- `/cities/se/stockholm`
- `/cities/se/gothenburg`
- `/cities/se/uppsala`
- `/cities/se/lund`
- `/cities/se/linkoping`
- `/cities/se/umea`

Unsupported Sweden city slugs return not found. Phase 5 metadata remains `noindex, follow` for supported routes and `noindex, nofollow` for unsupported routes. Sitemap/index activation is deferred to Phase 7.

## Profile content

Each profile reads only the verified Sweden city read models and metric evidence introduced in Phases 3 and 4.

Displayed decision context includes:

- SCB municipality and county context;
- year-end municipality population;
- official national student-budget baseline;
- source-native local public-transport reference;
- current qualified student residence-permit work context;
- official local economic-sector context;
- UKÄ-backed university city locations;
- total verified-partial programme count;
- up to eight alphabetic official-programme samples;
- metric source disclosure.

## Programme disclosure

Programme delivery is not inferred from institution presence.

The profile programme total contains only rows whose Sweden programme-source city matches the verified university location in the same normalized municipality.

Current totals:

- Stockholm — 93
- Gothenburg — 65
- Uppsala — 42
- Lund — 29
- Linköping — 21
- Umeå — 21

Total: 271 verified-partial programme rows.

## Provider disclosure

The institution layer is explicitly labelled as a selected ten-university core. Complete UKÄ-recognised provider coverage remains pending.

Coverage state:

`selected_university_core_full_hei_coverage_pending`

A missing provider in the current profile must not be interpreted as absence from the municipality.

## Metric disclosure

The SEK 10,656 student living-cost value is a national Study in Sweden baseline and is not city-specific.

Transport products retain their source-native validity periods and therefore are contextual rather than synthetically normalized.

The 15-hour student work reference is a national rule for the relevant first/second-cycle permit context granted on or after 11 June 2026; transition rules and listed exceptions remain visible in the profile.

Employment sectors are contextual economic-development signals and not shortage rankings or employment guarantees.

## Phase boundary

Phase 5 does not:

- connect Sweden to City Compare;
- add Sweden city routes to the sitemap;
- make the routes indexable;
- create additional Tier B geographies;
- claim complete Swedish HEI coverage.

Next work on the same branch is Phase 6 City Compare.