# Norway Cities — Phase 1 city scope v1

Status: `PHASE_1_COMPLETE`
Checkpoint: `TIER_A_SCOPE_LOCKED`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Scope decision

The first Norway Cities publication cohort is locked to exactly ten municipality-based study destinations:

1. Oslo — `oslo`
2. Trondheim — `trondheim`
3. Stavanger — `stavanger`
4. Ås — `as`
5. Tromsø — `tromso`
6. Bodø — `bodo`
7. Kongsberg — `kongsberg`
8. Kristiansand — `kristiansand`
9. Bergen — `bergen`
10. Elverum — `elverum`

Planned route shape:

- `/cities/no/oslo`
- `/cities/no/trondheim`
- `/cities/no/stavanger`
- `/cities/no/as`
- `/cities/no/tromso`
- `/cities/no/bodo`
- `/cities/no/kongsberg`
- `/cities/no/kristiansand`
- `/cities/no/bergen`
- `/cities/no/elverum`

Phase 1 does not publish these routes. Phase 2 must first normalize the municipality geography contract.

## Why these ten

Phase 1 is an initial publication cohort, not a ranking of Norwegian student cities and not a claim that these are the only important higher-education destinations in Norway.

The ten are selected because all of the following are already true in the current canonical foundation:

- each has an existing stable Norway city UUID/slug seed
- each is linked to at least one of the 11 canonical NOKUT universities through the existing fast-path foundation
- each appears in the current 140-row official Study in Norway programme staging foundation
- each has non-zero current programme evidence
- together they span the current university foundation across eastern, western, southern, central and northern Norway

Current programme evidence by source city:

| Tier A city | Current staged programmes | Current university institutions represented |
|---|---:|---:|
| Oslo | 34 | 2 |
| Trondheim | 27 | 1 |
| Stavanger | 14 | 1 |
| Ås | 11 | 1 |
| Tromsø | 11 | 1 |
| Bodø | 10 | 1 |
| Kongsberg | 10 | 1 |
| Kristiansand | 10 | 1 |
| Bergen | 9 | 1 |
| Elverum | 4 | 1 |

These counts are scope-selection evidence only. They must not be presented as complete municipality-wide programme totals until physical delivery and wider HEI coverage are verified.

## Geography principle

The public comparison boundary for each Tier A destination is the official Statistics Norway municipality using the `Municipalities 2026` classification:

https://www.ssb.no/en/klass/klassifikasjoner/131

SSB defines municipality as an administrative and statistical regional level. Phase 2 must therefore normalize city comparison on municipality boundaries, not on Study in Norway macro-regions or informal metropolitan areas.

Rules:

- Oslo means Oslo municipality
- Stavanger means Stavanger municipality
- Bergen means Bergen municipality
- Trondheim means Trondheim municipality
- regional labels such as `East Norway` or `North Norway` are discovery context only
- no municipality may absorb a neighbouring campus or programme without explicit location evidence

## Coverage rationale

### Oslo / eastern university core

- Oslo
- Ås
- Kongsberg
- Elverum

This captures the current eastern university foundation without collapsing separate municipalities into a generic Oslo/East Norway destination.

Oslo currently represents two canonical universities. Ås, Kongsberg and Elverum each represent a separate municipality and separate institution/location seed.

### Western Norway

- Bergen
- Stavanger

Both have current university and programme foundations and remain separate municipal study destinations.

### Southern Norway

- Kristiansand

Kristiansand is the current University of Agder primary publication municipality in the existing fast-path foundation.

### Mid Norway

- Trondheim

Trondheim is the current NTNU primary publication municipality and the largest current programme cohort outside Oslo.

### Northern Norway

- Bodø
- Tromsø

Bodø and Tromsø provide separate northern municipality anchors for Nord University and UiT respectively.

## Multi-campus rule

Several institutions represented in the ten-city cohort operate across multiple campuses or study locations.

Phase 1 therefore locks destination scope without converting current primary publication locations into delivery claims.

The following remain mandatory for Phase 3:

- verify actual teaching/study locations
- reconcile each programme to the verified location where it is delivered
- preserve secondary campuses as separate municipality relationships when supported
- do not assign all programmes of a multi-campus university to the current primary publication city

The exact Tier A city allowlist may remain stable while later phases add verified secondary locations. Adding a secondary location does not automatically make that municipality Tier A; promotion requires an explicit scope decision.

## Institution coverage state carried forward

All ten Tier A destinations inherit the Phase 0 disclosure:

`all_nokut_universities_full_hei_coverage_pending`

The current canonical foundation represents all 11 institutions in NOKUT's university category, but Norway has a broader approved HEI universe including specialised universities and university colleges.

Therefore:

- city institution counts cannot yet be described as complete HEI totals
- a city with specialised-university or university-college activity outside the current 11-university foundation is not considered absent from higher education
- later expansion must reconcile those provider categories before full-coverage language is allowed

## Explicit exclusions and expansion boundary

No Norway municipality outside the ten-city allowlist is Tier A in v1.

This exclusion is not a quality judgement. It is a data-governance decision based on the current canonical foundation.

Priority expansion work after the initial cohort must come from one of two evidence paths:

1. verified secondary campuses/study locations of the current 11 universities
2. verified institutions from NOKUT's specialised-university, university-college/UAS, or accredited-programme college categories

A municipality may enter a later cohort only when it has:

- an official SSB municipality identity
- a verified teaching/study location
- a recognised canonical institution relationship
- current programme evidence suitable for City linkage

No additional city may be silently promoted during Phase 2 geography normalization.

## Programme publication boundary

The ten-city allowlist does not automatically publish all 140 current staged programmes as city-verified programmes.

Later city programme publication requires the evidence chain:

`SSB municipality -> verified study location -> recognised canonical institution -> verified programme offering -> canonical programme`

Rules:

- current source city text is reconciliation evidence, not sufficient by itself
- current primary publication campus rows are not sufficient by themselves
- institution presence never implies programme delivery in every institution city
- multi-campus institutions require location-specific verification
- `verified_general` international evidence remains distinct from programme-specific current admissions verification

## Phase 2 normalization targets

Phase 2 must preserve existing UUIDs/slugs for the ten Tier A municipalities where there is no identity conflict while adding:

- official SSB 2026 municipality number
- municipality `scope_kind`
- official county relationship / county code
- SSB source metadata
- publication tier/status metadata
- canonical aliases where needed for Norwegian characters and ASCII routing

Special attention is required for routing aliases:

- Ås -> `as`
- Tromsø -> `tromso`
- Bodø -> `bodo`

ASCII slugs are routing aliases only and must not replace the official municipality names.

## Phase 1 conclusion

The exact Norway Tier A v1 allowlist is locked to:

`oslo, trondheim, stavanger, as, tromso, bodo, kongsberg, kristiansand, bergen, elverum`

Phase 1 is complete.

Do not start Phase 2 on this branch until explicitly instructed. The branch must remain Norway-only and Phase 0–1 only for the current delivery boundary.
