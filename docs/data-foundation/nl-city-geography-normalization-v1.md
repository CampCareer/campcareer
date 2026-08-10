# Netherlands city geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `DATA_FOUNDATION_COMPLETE`

Branch: `agent/nl-cities-foundation-v1`

Base Phase 1: `cc79a357fa229f5d88b84d773fb3345e08ce22be`

Production migration: `20260810131602_normalize_nl_tier_a_city_geographies_v1`

Audit date: 2026-08-10

## Purpose

Normalize the exact five Netherlands Tier A city geographies selected in Phase 1 without recreating geography rows, expanding the launch cohort, or inferring campus/programme delivery.

Tier A remains exactly:

- `amsterdam`
- `maastricht`
- `rotterdam`
- `groningen`
- `eindhoven`

Tier B existing geographies remain outside the launch normalization:

- Delft
- Utrecht
- Enschede
- Tilburg
- Leiden
- Nijmegen
- Wageningen

The Hague remains a discovered expansion candidate and is not created in Phase 2.

## Boundary decision

All five Tier A public city scopes use the municipality as the public study-destination boundary.

Primary boundary authority: Statistics Netherlands (CBS), `Gebieden in Nederland 2026`.

Source:

https://www.cbs.nl/nl-nl/cijfers/detail/86247NED

CBS describes the municipality division as the lowest administrative level and publishes the official municipality name/code relationship for 2026.

This boundary aligns with the Phase 1 Nuffic municipality-level international degree-student selection signal and gives Phase 4 a consistent municipality-based population contract.

Do not mix municipality, province, COROP region, metropolitan region or branded economic-region values under one city label.

## Canonical geography contract

| City | Slug | Region code | Province | CBS municipality code | Public boundary |
| --- | --- | --- | --- | --- | --- |
| Amsterdam | `amsterdam` | `NH` | Noord-Holland | `GM0363` | Amsterdam municipality |
| Maastricht | `maastricht` | `LI` | Limburg | `GM0935` | Maastricht municipality |
| Rotterdam | `rotterdam` | `ZH` | Zuid-Holland | `GM0599` | Rotterdam municipality |
| Groningen | `groningen` | `GR` | Groningen | `GM0014` | Groningen municipality |
| Eindhoven | `eindhoven` | `NB` | Noord-Brabant | `GM0772` | Eindhoven municipality |

`scope_kind = city` remains the CampCareer product route concept. The exact statistical/administrative boundary is stored separately as `study_destination_scope = cbs_municipality`.

## UUID preservation

No Tier A geography row was recreated.

Existing production UUIDs were preserved:

- Amsterdam — `14ccfa44-3906-43da-8226-9ebea6108aeb`
- Maastricht — `96ed75a0-2693-4ec5-87dd-c070abaaaed9`
- Rotterdam — `48f1afd5-44ca-48fb-bb61-0a09dd45d570`
- Groningen — `f206698a-22d2-4ac9-9c5e-3360534b58f9`
- Eindhoven — `73ca9682-f778-46dc-aa40-b4f9fdef9395`

This preserves existing institution/campus geography references while upgrading public city semantics.

## Metadata contract

Each Tier A geography now records:

- `nl_city_normalization_v1 = true`
- `publication_tier = A`
- `public_slug`
- `province_code`
- `province_name`
- `cbs_municipality_code`
- `study_destination_scope = cbs_municipality`
- `scope_boundary_label`
- `scope_note`
- `scope_standard = CBS municipal division 2026`
- `scope_reference_date = 2026-01-01`
- `scope_source_url`
- `population_geography_contract = cbs_municipality`
- `student_demand_geography_contract = nuffic_municipality`
- `campus_membership_contract = phase_3_explicit_location_evidence_required`

The population contract prevents later city metrics from silently substituting province or metro figures for city figures.

## City-specific exclusions

### Amsterdam

Public scope is the municipality of Amsterdam.

Do not automatically include Amstelveen, Diemen or the wider Amsterdam metropolitan area.

### Maastricht

Public scope is the municipality of Maastricht.

Do not use Limburg province statistics as Maastricht city statistics.

### Rotterdam

Public scope is the municipality of Rotterdam.

Do not silently expand the city boundary to Rijnmond or the wider Rotterdam-The Hague metropolitan area.

### Groningen

Public scope is the municipality of Groningen.

Do not use Province of Groningen statistics as Groningen city statistics.

### Eindhoven

Public scope is the municipality of Eindhoven.

Do not treat the wider Brainport region as the city boundary.

## Alias policy

Phase 2 registers two deterministic aliases per Tier A geography:

1. canonical city name (`canonical_name`)
2. canonical route slug (`slug`)

Production verification returns exactly 10 aliases across the five Tier A cities for those two alias types.

CBS municipality codes are stored as explicit metadata rather than overloaded into the route alias system.

## Duplicate handling

The migration asserts that every Tier A slug resolves to exactly one canonical `core.geographies` row.

No duplicate Tier A canonical geography currently exists.

`canonical_geography_id` remains null for the five selected rows.

## Tier B guard

The migration explicitly guards the seven current Tier B geographies:

- Delft
- Utrecht
- Enschede
- Tilburg
- Leiden
- Nijmegen
- Wageningen

Production verification after Phase 2 confirms:

- Tier B rows tagged with `nl_city_normalization_v1`: `0`
- Tier B rows given a Phase 2 slug: `0`

The Hague is still absent from the current canonical NL geography seed and remains an expansion decision rather than an automatic insertion.

## Programme and campus boundary

Phase 2 does not modify campus rows, institutions, programmes or programme offerings.

Current programme state remains:

- canonical NL programmes: `26`
- explicit NL programme offerings: `0`

Therefore city programme coverage remains `verification_pending`.

Phase 3 must build or verify the explicit relationship chain:

`city -> verified campus/location -> institution -> explicit programme offering -> programme`

Institution presence and existing programme identity must never be combined to infer city delivery.

Phase 3 must also reconcile the current duplicate location pattern where registry-backed DUO rows coexist with legacy unsourced `{City} listed campus` rows.

## Production verification

After migration application, production contains exactly five normalized Tier A rows:

- Amsterdam — `amsterdam`, `NH`, `GM0363`
- Maastricht — `maastricht`, `LI`, `GM0935`
- Rotterdam — `rotterdam`, `ZH`, `GM0599`
- Groningen — `groningen`, `GR`, `GM0014`
- Eindhoven — `eindhoven`, `NB`, `GM0772`

Each has:

- existing UUID preserved
- `scope_kind = city`
- `publication_tier = A`
- `study_destination_scope = cbs_municipality`
- `population_geography_contract = cbs_municipality`
- `campus_membership_contract = phase_3_explicit_location_evidence_required`

Alias verification:

- canonical-name + slug aliases: `10`

Tier B verification:

- normalized Tier B rows: `0`
- Tier B rows with non-null slug introduced by this phase: `0`

## Contract test

`tests/nl-city-foundation-contract.test.ts` guards:

- exact five-city Tier A allowlist
- seven existing Tier B geographies remain outside Phase 2
- UUID preservation by prohibiting `insert into core.geographies`
- CBS municipality scope and 2026 municipality codes
- province mapping
- municipality-vs-metro/province exclusions
- deterministic canonical-name and slug aliases
- Phase 3 explicit campus-evidence requirement

## Phase 2 acceptance criteria

- [x] exact five Tier A slugs are canonical
- [x] existing Tier A geography UUIDs are preserved
- [x] geography type is `city`
- [x] scope kind is normalized to `city`
- [x] province mapping is explicit
- [x] official CBS municipality codes are stored
- [x] public study-destination boundary is municipality-based
- [x] population geography contract is municipality-based
- [x] deterministic aliases exist
- [x] duplicate canonical rows are guarded
- [x] Tier B rows remain untouched
- [x] campus/programme delivery is not inferred
- [x] production migration is applied and verified
- [x] contract test is committed

## Handoff

Proceed to Phase 3 — Institution and Programme Linkage.

Phase 3 priorities:

1. reconcile duplicate/legacy campus rows in the five Tier A cities;
2. verify current teaching-campus inventory from DUO/RIO and official provider sources;
3. expand HBO provider coverage where omission would materially misrepresent a city;
4. establish explicit programme-to-location offerings only from source evidence;
5. retain `programme_coverage_status = verification_pending` wherever explicit delivery evidence is absent.
