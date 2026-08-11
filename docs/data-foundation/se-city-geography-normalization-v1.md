# Sweden city geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `DATA_FOUNDATION_COMPLETE`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Result

The six Phase 1 Tier A destinations are normalized to official Statistics Sweden (SCB) municipality identities while preserving the existing CampCareer UUIDs and public slugs.

| City | Slug | SCB municipality | County code | Municipality boundary |
| --- | --- | --- | --- | --- |
| Stockholm | `stockholm` | `0180` | `01` | Stockholms kommun |
| Gothenburg | `gothenburg` | `1480` | `14` | Göteborgs kommun |
| Uppsala | `uppsala` | `0380` | `03` | Uppsala kommun |
| Lund | `lund` | `1281` | `12` | Lunds kommun |
| Linköping | `linkoping` | `0580` | `05` | Linköpings kommun |
| Umeå | `umea` | `2480` | `24` | Umeå kommun |

The public study-destination contract is `scb_municipality`. City names are product labels; the administrative/population boundary is the municipality.

Official authority:

https://www.scb.se/en/finding-statistics/regional-statistics/regional-divisions/counties-and-municipalities/counties-and-municipalities-in-numerical-order/

## Identity preservation

Existing UUIDs remain unchanged:

- Stockholm — `e4d6e0f8-deaf-4486-4754-ed037331583b`
- Gothenburg — `cc9590ad-543b-455a-f11b-f5db185bfbd0`
- Uppsala — `9671b5ed-f7ea-5120-a56f-66c62ffbcc18`
- Lund — `c437d6de-abe4-2121-9228-43edb71afa74`
- Linköping — `3f7f5dad-7fe0-9cf5-296b-a020fc829775`
- Umeå — `b6afd97c-c5c5-1736-dbb4-63afe4a8d8c1`

The migration validates this identity contract explicitly.

## Aliases

Each city receives canonical-name and slug aliases. Gothenburg additionally receives the official Swedish name `Göteborg` as an alternate alias.

Verified production alias count for the six Tier A cities: 13.

## Scope exclusions

Phase 2 does not create or promote Malmö, Luleå, Växjö, Kalmar, Örebro, Karlstad, Jönköping or any other provider-expansion candidate.

It does not infer campus membership or programme delivery from municipality normalization.

## Production migration

`20260810215750_normalize_se_tier_a_city_geographies_v1`

## Next gate

Phase 3 must establish the explicit relationship chain:

`SCB municipality -> verified university location -> UKÄ-backed institution -> verified offering -> source-city-matched programme`

Existing fast-path campus rows cannot become programme evidence merely because they now resolve to a normalized municipality.