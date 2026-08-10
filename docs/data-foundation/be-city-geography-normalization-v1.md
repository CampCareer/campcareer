# Belgium city geography normalization v1

Status: `PHASE_2_COMPLETE`

Branch: `agent/be-cities-v1`

Migration: `20260810202058_normalize_be_tier_a_city_geographies_v1`

Checkpoint: `GEOGRAPHY_NORMALIZED`

## Scope

Normalizes exactly the Phase 1 Tier A destinations without replacing existing geography UUIDs:

`brussels`, `ghent`, `leuven`, `antwerp`, `louvain-la-neuve`, `liege`.

## Geography contract

Statbel REFNIS 2025 is the administrative reference family.

- Antwerp — municipality, REFNIS `11002`, Flemish Region.
- Ghent — municipality, REFNIS `44021`, Flemish Region.
- Leuven — municipality, REFNIS `24062`, Flemish Region.
- Liège — municipality, REFNIS `62063`, Walloon Region.
- Brussels — public study destination and population boundary is the Brussels-Capital Region, not the City of Brussels municipality.
- Louvain-la-Neuve — remains the public study-destination label, but population uses Ottignies-Louvain-la-Neuve municipality, REFNIS `25121`.

Each Tier A geography receives canonical-name and slug aliases plus explicit publication, population-scope and campus-membership metadata.

No Tier B geography is normalized by this phase.

Production mutation: applied and verified.

Next: Phase 3 explicit institution and teaching-location linkage.
