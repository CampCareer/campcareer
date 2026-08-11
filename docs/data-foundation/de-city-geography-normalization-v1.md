# Germany city geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `DATA_FOUNDATION_COMPLETE`

Branch: `agent/de-cities-foundation-v1`

Base Phase 1: `6ce113e8b015332e88f87ba7a3d7da4e8b7ee466`

Production migration: `20260810133035_normalize_de_tier_a_city_geographies_v1`

Audit date: 2026-08-10

## Purpose

Normalize the exact nine Germany Tier A city geographies selected in Phase 1 without recreating geography rows, changing public slugs, publishing city routes or inferring campus/programme delivery.

Tier A remains exactly:

- `berlin`
- `munich`
- `hamburg`
- `aachen`
- `bonn`
- `dresden`
- `heidelberg`
- `karlsruhe`
- `tuebingen`

## Boundary decision

Germany v1 uses the politically independent municipality represented by Destatis / the Statistical Offices of the Federation and the Länder GV-ISys as the canonical public and population geography.

Primary authority:

https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html

GV-ISys provides an eight-digit Amtlicher Gemeindeschlüssel (AGS) for unique municipality identification. Phase 2 stores that AGS in geography metadata and uses the municipality rather than a metropolitan region, commuting region, Landkreis or university marketing geography.

## Production normalization

Existing CampCareer UUIDs and slugs were preserved. No `core.geographies` rows were inserted.

The nine rows now have:

- `geography_type = city`
- `scope_kind = city`
- `status = active`
- official Bundesland code in `region_code`
- `publication_tier = A`
- `study_destination_scope = destatis_gvisys_municipality`
- official eight-digit AGS
- `population_geography_contract = destatis_gvisys_municipality`
- `campus_membership_contract = phase_3_explicit_location_evidence_required`

## Official municipality mapping

| Public city | Slug | Bundesland | Code | AGS |
| --- | --- | --- | --- | --- |
| Berlin | `berlin` | Berlin | `BE` | `11000000` |
| Munich | `munich` | Bayern | `BY` | `09162000` |
| Hamburg | `hamburg` | Hamburg | `HH` | `02000000` |
| Aachen | `aachen` | Nordrhein-Westfalen | `NW` | `05334002` |
| Bonn | `bonn` | Nordrhein-Westfalen | `NW` | `05314000` |
| Dresden | `dresden` | Sachsen | `SN` | `14612000` |
| Heidelberg | `heidelberg` | Baden-Württemberg | `BW` | `08221000` |
| Karlsruhe | `karlsruhe` | Baden-Württemberg | `BW` | `08212000` |
| Tübingen | `tuebingen` | Baden-Württemberg | `BW` | `08416041` |

## Boundary guardrails

Berlin uses the Land Berlin / municipality boundary, not the wider Berlin-Brandenburg metro region.

Munich uses the municipality of München. Garching bei München is a separate municipality and remains outside the Munich city boundary unless handled as its own location in Phase 3.

Hamburg uses the Hamburg city-state boundary. Neighbouring municipalities remain outside the city scope.

Aachen uses the municipality of Aachen; Städteregion Aachen is administrative context rather than the city metric boundary.

Bonn uses the municipality of Bonn and does not absorb wider Cologne/Bonn or Rhein-Sieg context.

Dresden uses the municipality of Dresden; wider Saxony teaching/research locations require separate evidence.

Heidelberg uses the Stadtkreis Heidelberg boundary; Mannheim and Rhein-Neckar-Kreis remain separate.

Karlsruhe uses the Stadtkreis Karlsruhe boundary; Karlsruhe district municipalities are not included by proximity.

Tübingen uses the municipality of Tübingen; Landkreis Tübingen locations remain separate unless explicitly verified.

## Alias normalization

Phase 2 registered deterministic aliases for each Tier A geography:

- canonical city name
- canonical public slug

Production verification returned:

- canonical-name aliases: `9`
- slug aliases: `9`

Stable route slugs remain unchanged, including `munich` and `tuebingen`.

## Production verification

After migration:

- normalized Tier A rows matching the full Phase 2 metadata contract: `9/9`
- rows with valid eight-digit AGS: `9/9`
- rows with non-null Bundesland `region_code`: `9/9`
- canonical-name aliases: `9`
- slug aliases: `9`
- inserted replacement geography rows: `0`

The production migration is recorded in `supabase_migrations.schema_migrations` as:

`20260810133035_normalize_de_tier_a_city_geographies_v1`

## Phase 3 handoff

Proceed to institution/campus linkage using the normalized nine-city municipality contract.

Phase 3 must verify actual teaching-campus locations, distinguish municipality membership from metro-area branding and link programme delivery only where explicit campus/programme evidence exists.

No city route, Compare publication or SEO indexing is introduced in Phase 2.
