# France city geography normalization v1

Status: `PHASE_2_COMPLETE`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-10

Checkpoint: `GEOGRAPHY_NORMALIZED`

## Exact Tier A

- Paris — commune `75056`
- Paris-Saclay — Communauté Paris-Saclay EPCI `200056232`
- Bordeaux — Bordeaux Métropole EPCI `243300316`
- Strasbourg — Eurométropole de Strasbourg EPCI `246700488`
- Grenoble — Grenoble-Alpes-Métropole EPCI `200040715`
- Aix-Marseille — Métropole d'Aix-Marseille-Provence EPCI `200054807`
- Nice — Métropole Nice Côte d'Azur EPCI `200030195`

## Boundary rule

The France seed was created from registered university-address localities. Phase 2 therefore separates public study-destination geography from physical teaching locality.

Paris reuses its existing UUID because the public population contract is the Paris commune itself. Strasbourg and Nice reuse their existing public UUIDs but receive explicit commune locality rows for teaching-location evidence. Paris-Saclay, Bordeaux, Grenoble and Aix-Marseille receive separate public destination rows rather than renaming Saint-Aubin, Talence, Saint-Martin-d'Hères or Marseille.

Locality rows are not aliases for metropolitan destinations.

## Production verification

- exact Tier A public destinations: 7
- Tier A rows missing official code: 0
- Tier A rows missing region code: 0
- Tier A rows missing population geography contract: 0
- explicit Nice/Strasbourg commune-locality split: 2
- existing Talence, Saint-Martin-d'Hères, Saint-Aubin and Marseille locality anchors preserved

INSEE geography is the population authority. Population data later uses RP2023 in geography at 2026-01-01.

## Release boundary

No route publication or SEO indexing is introduced by Phase 2. Programme delivery remains unverified.
