# Finland Cities — Phase 2 geography normalization v1

Status: `PHASE_2_COMPLETE`
Checkpoint: `DATA_FOUNDATION_COMPLETE`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Scope

Phase 2 normalizes exactly the eight Phase 1 Tier A destinations to the official Statistics Finland 2026 municipality classification. No new public city is created and no Tier B candidate is promoted.

| City | Slug | Municipality code | Region code | Region | Existing UUID preserved |
|---|---|---:|---:|---|---|
| Helsinki | `helsinki` | `091` | `01` | Uusimaa | yes |
| Espoo | `espoo` | `049` | `01` | Uusimaa | yes |
| Tampere | `tampere` | `837` | `06` | Pirkanmaa | yes |
| Turku | `turku` | `853` | `02` | Southwest Finland | yes |
| Oulu | `oulu` | `564` | `17` | North Ostrobothnia | yes |
| Jyväskylä | `jyvaskyla` | `179` | `13` | Central Finland | yes |
| Lappeenranta | `lappeenranta` | `405` | `09` | South Karelia | yes |
| Joensuu | `joensuu` | `167` | `12` | North Karelia | yes |

Authority: Statistics Finland, `Municipalities 2026`.

## Geography contract

For all eight rows:

- `geography_type='city'`
- `scope_kind='city'`
- canonical `code` is the Statistics Finland municipality code
- `region_code` uses the Statistics Finland region code
- `metadata.publication_tier='A'`
- `metadata.publication_status='approved_not_indexed'`
- `metadata.study_destination_scope='statistics_finland_municipality'`
- `metadata.population_geography_contract='statistics_finland_municipality'`

The product label remains a city name, but the statistical and comparison boundary is the municipality.

## Capital-region boundary

Helsinki and Espoo are separate municipalities and separate public study destinations. Phase 2 does not create or use a synthetic Helsinki metropolitan area as the city boundary.

## Aliases

Every Tier A geography has canonical-name and slug aliases. The bilingual municipal names `Helsingfors`, `Esbo`, and `Åbo` are also recorded as aliases for Helsinki, Espoo, and Turku respectively.

Aliases are routing/search aids only; they do not merge municipality identities.

## Stable identity

All eight pre-existing fastpath geography UUIDs are preserved. Phase 2 repairs their geography contract rather than replacing them, protecting current campus/programme foreign keys.

## Publication boundary

Phase 2 does not make routes indexable. The rows remain `approved_not_indexed` until later publication/SEO gates.

Explicitly not promoted in this phase include Kuopio, Vaasa, Rovaniemi, Vantaa and Lahti.

## Production migration

Applied migration:

`20260811022937_normalize_fi_tier_a_city_geographies_v1`

Production verification after the migration found:

- normalized Tier A municipality rows: 8
- stable UUID/slug preservation: 8/8
- municipality codes present: 8/8
- region codes present: 8/8
- unexpected FI Tier A rows: 0

## Phase 2 conclusion

Finland Cities has reached `DATA_FOUNDATION_COMPLETE` for Phases 0–2. Phase 3 must now verify study locations and programme delivery without treating the old `Primary publication location` rows as sufficient evidence on their own.
