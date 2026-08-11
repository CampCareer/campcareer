# Switzerland Cities — Phase 2 geography normalization v1

Status: `PHASE_2_COMPLETE`
Checkpoint: `SIX_BFS_MUNICIPALITIES_NORMALIZED`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Normalized Tier A cohort

Exactly six existing City UUIDs are retained and normalized to the Swiss Federal Statistical Office Official Directory of Municipalities, state 01.01.2026.

| Public City | Route slug | FSO/BFS municipality | Canton |
|---|---|---:|---|
| Zurich / Zürich | `zurich` | `261` | `ZH` |
| Lausanne | `lausanne` | `5586` | `VD` |
| Basel | `basel` | `2701` | `BS` |
| Lugano | `lugano` | `5192` | `TI` |
| Fribourg | `fribourg` | `2196` | `FR` |
| Geneva / Genève | `geneva` | `6621` | `GE` |

No new canonical City row is created. Existing stable UUIDs and ASCII route slugs are preserved.

## Naming contract

`core.geographies.name` keeps the existing routing/display-compatible English labels where already present. Official/local municipality names are stored in metadata and aliases so routing stability is not confused with official naming.

Examples:

- `zurich` keeps aliases `Zurich` and `Zürich`
- `geneva` keeps aliases `Geneva` and `Genève`
- `fribourg` keeps `Fribourg` and language alias `Freiburg`

## Boundary contract

Every Tier A geography has:

- `scope_kind = city`
- official FSO/BFS municipality number in `code`
- canton abbreviation in `region_code`
- `study_destination_scope = bfs_municipality`
- `publication_tier = A`
- `publication_status = approved_not_indexed`

The municipality is the statistical profile boundary. Cantons and metropolitan regions are context only.

## Lausanne safeguard

Lausanne needs an explicit distinction between the municipality and the wider academic cluster. EPFL official material places its main campus in Ecublens near Lausanne. Therefore Phase 2 does not treat a `Lausanne` source label or `1015 Lausanne` postal label as proof that a physical study location lies inside Lausanne municipality.

Phase 3 must gate programme membership on explicit location evidence and may exclude an institution/programme cohort from the Lausanne municipality profile even when its programme source uses `Lausanne` as the destination label.

## Deferred Cities

The following remain outside Tier A:

`neuchatel, bern, st-gallen, lucerne`

The Phase 2 migration fails if another Switzerland City is silently marked Tier A.

## Phase 2 conclusion

The six Switzerland route geographies now have a deterministic FSO/BFS municipality and canton contract. Phase 3 may verify physical study locations and programme delivery without changing the route cohort.