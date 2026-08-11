# Spain Cities — Phase 2 geography normalization v1

Status: `PHASE_2_COMPLETE`
Checkpoint: `DATA_FOUNDATION_COMPLETE`
Country: `ES` — Spain
Checked: 2026-08-11
Branch: `agent/es-cities-v1`

## Scope

Phase 2 normalizes exactly the seven Phase 1 Tier A public study destinations to the INE municipality classification referenced at 1 January 2026. The city product boundary and population boundary are both the named municipality.

| City | Slug | INE municipality code | Autonomous-community code | Autonomous community | Existing UUID preserved |
|---|---|---:|---:|---|---|
| Madrid | `madrid` | `28079` | `13` | Madrid, Comunidad de | yes |
| Barcelona | `barcelona` | `08019` | `09` | Cataluña | yes |
| Valencia | `valencia` | `46250` | `10` | Comunitat Valenciana | new public destination |
| Sevilla | `sevilla` | `41091` | `01` | Andalucía | yes |
| Granada | `granada` | `18087` | `01` | Andalucía | new public destination |
| Málaga | `malaga` | `29067` | `01` | Andalucía | yes |
| Bilbao | `bilbao` | `48020` | `16` | País Vasco | new public destination |

Primary authority: Instituto Nacional de Estadística (INE), `Relación de municipios y sus códigos por provincias`, reference 1 January 2026.

Autonomous-community codes use the INE community/city code relation.

## Geography contract

For all seven Tier A rows:

- `geography_type='city'`
- `scope_kind='city'`
- canonical `code` is the five-digit INE municipality code
- `region_code` is the two-digit INE autonomous-community code
- `metadata.publication_tier='A'`
- `metadata.publication_status='approved_not_indexed'`
- `metadata.study_destination_scope='ine_municipality'`
- `metadata.population_geography_contract='ine_municipality'`
- `metadata.programme_coverage_status='verification_pending'`
- campus membership remains gated on Phase 3 explicit teaching-location evidence

Phase 2 does not publish routes or make them indexable.

## Existing identity preservation

The existing canonical UUIDs for Madrid, Barcelona, Sevilla and Málaga were updated in place. They were not replaced.

Valencia, Granada and Bilbao were absent as canonical public destinations at the Phase 2 preflight and were inserted as new canonical geography rows.

## Locality and later-candidate separation

The following existing Spain rows remain outside Tier A and were not promoted:

- `cerdanyola-del-valles`
- `leioa`
- `cadiz`
- `ciudad-real`

Cerdanyola del Vallès remains separate from Barcelona. Leioa remains separate from Bilbao. Phase 3 must verify teaching locations independently before assigning any institution or programme to a public destination.

## Boundary notes

Barcelona uses Barcelona municipality for the public population contract. The wider UAB/Bellaterra ecosystem is not silently absorbed into the city boundary.

Valencia uses València municipality. Burjassot, Paterna and other neighbouring teaching localities remain separate physical geographies. `València` is stored as an official-source alias while the public product label remains Valencia.

Granada uses Granada municipality. Universidad de Granada activity in Ceuta or Melilla is outside this city contract.

Bilbao uses Bilbao municipality. Leioa is not an alias and is not inherited into Bilbao programme delivery.

## Aliases

Every Tier A geography has canonical-name and slug aliases. Valencia additionally records the INE official form `València`.

Production verification found 15 aliases across the seven Tier A geographies.

## Production migration

Applied migration:

`20260811114226_normalize_es_tier_a_city_geographies_v1`

Production verification after the migration found:

- Spain Tier A rows: `7`
- rows satisfying the full INE municipality contract: `7/7`
- unexpected Spain Tier A rows: `0`
- locality/later-candidate rows preserved outside Tier A: `4/4`
- Tier A aliases: `15`

## Phase 2 conclusion

Spain Cities has reached `DATA_FOUNDATION_COMPLETE` for Phases 0–2.

Phase 3 must now expand and verify the provider/teaching-location foundation, especially Valencia and Granada, and must keep programme delivery at `verification_pending` until explicit programme-to-location evidence exists.
