# New Zealand city geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `DATA_FOUNDATION_COMPLETE`

Branch: `agent/nz-cities-foundation-v1`

Base Phase 1: `b7393b72c0163459ad0c952952b7dadef31b9ab1`

Production migration: `20260809120738_normalize_nz_tier_a_city_geographies_v1`

Audit date: 2026-08-09

## Purpose

Normalize the exact five New Zealand Tier A city geographies selected in Phase 1 without recreating geography rows, expanding the launch cohort, or inferring campus/programme delivery.

Tier A remains exactly:

- `auckland`
- `christchurch`
- `hamilton`
- `wellington`
- `dunedin`

Tier B remains outside the launch normalization:

- `palmerston-north`
- `lincoln`

Tauranga remains a discovered expansion destination and still requires a future canonical geography decision.

## Boundary decision

All five Tier A public city scopes use the Stats NZ urban/rural geography defined under the Statistical standard for geographic areas 2023 (SSGA23).

Stats NZ distinguishes statistical urban areas from administrative boundaries. Urban areas are contiguous statistical geographies intended to represent built-up urban communities and are independent of territorial-authority and regional-council boundaries.

Primary source:

https://www.stats.govt.nz/methods/geographic-hierarchy/

Supporting current Stats NZ metadata:

https://datainfoplus.stats.govt.nz/item/nz.govt.stats/3e66b451-133b-4ffc-9cc6-63cec3f80d41

This is preferable to using regional-council boundaries because the public product is comparing study destinations rather than whole regions. It also avoids mixing very broad local-government areas with compact urban destinations.

## Canonical geography contract

| City | Slug | Region mapping | scope_kind | Public boundary |
| --- | --- | --- | --- | --- |
| Auckland | `auckland` | Auckland | `city` | Stats NZ Auckland urban area |
| Christchurch | `christchurch` | Canterbury | `city` | Stats NZ Christchurch urban area |
| Hamilton | `hamilton` | Waikato | `city` | Stats NZ Hamilton urban area |
| Wellington | `wellington` | Wellington | `city` | Stats NZ Wellington urban area |
| Dunedin | `dunedin` | Otago | `city` | Stats NZ Dunedin urban area |

`scope_kind = city` is retained as the CampCareer product-level route concept. The exact statistical boundary basis is stored separately in metadata as `stats_nz_urban_area`.

## UUID preservation

No Tier A geography row was recreated.

Existing UUIDs were preserved:

- Auckland — `844c6c05-5744-a6c3-266f-0f38cd0cabae`
- Christchurch — `11a6090a-9f2e-b655-5b86-2b77311fbfb5`
- Dunedin — `a33903f1-150e-c425-b4e8-4eb5c7e6de3c`
- Hamilton — `8ff1cdcc-f359-1ce7-95c0-0043a8ed3501`
- Wellington — `750e03b7-1c61-e268-5152-e0956e277b00`

This preserves all existing foreign-key references while upgrading geography semantics.

## Metadata contract

Each Tier A row now records:

- `nz_city_normalization_v1 = true`
- `publication_tier = A`
- `public_slug`
- `region`
- `study_destination_scope = stats_nz_urban_area`
- `scope_boundary_label`
- `scope_note`
- `scope_standard = SSGA23 urban/rural geography`
- `scope_source_url`
- `population_geography_contract = stats_nz_urban_area`
- `campus_membership_contract = phase_3_explicit_location_evidence_required`

The `population_geography_contract` gives Phase 4 a single boundary rule for population metrics instead of mixing territorial authorities and regions.

## City-specific exclusions

### Auckland

Public scope is the Stats NZ Auckland urban area, not the entire Auckland Region.

Do not include Whangārei / Tai Tokerau merely because the University of Auckland has a location there.

### Christchurch

Public scope is the Stats NZ Christchurch urban area.

Lincoln remains a separate geography and Tier B destination. It is not folded into Christchurch because of proximity or Canterbury regional membership.

### Hamilton

Public scope is the Stats NZ Hamilton urban area.

Tauranga remains separate. University of Waikato provider identity must never cause Tauranga delivery to appear under Hamilton.

### Wellington

Public scope is the Stats NZ Wellington urban area, not the entire Wellington Region.

Future campus rows must be tested against the approved urban-area boundary rather than inferred from region name alone.

### Dunedin

Public scope is the Stats NZ Dunedin urban area.

Queenstown, Southland and other Otago teaching/research locations are outside the Dunedin city contract unless separately normalized later.

## Alias policy

Phase 2 registers two deterministic aliases per Tier A geography:

1. canonical English city name (`canonical_name`)
2. canonical route slug (`slug`)

No speculative locality aliases are introduced.

Māori place-name presentation can be added to user-facing copy after the exact product convention and source are defined; it is not required to change the canonical English route slugs in this phase.

## Duplicate handling

The migration asserts that every Tier A slug resolves to exactly one canonical `core.geographies` row.

No duplicate Tier A canonical geography currently exists.

`canonical_geography_id` remains null for all five launch rows.

## Tier B guard

The migration explicitly checks that:

- `palmerston-north`
- `lincoln`

were not tagged with `nz_city_normalization_v1`.

Production verification confirms both remain active seed geographies with null `scope_kind`, null `region_code`, and no Tier A metadata.

## Programme and campus boundary

Phase 2 does not modify campus rows or programme data.

Current NZ programme catalogue remains absent, and the existing eight registry-backed institution locations remain provider-location evidence rather than a complete campus inventory.

Phase 3 must build:

`city -> verified campus -> institution -> explicit programme offering -> programme`

with official campus evidence.

Provider presence remains insufficient to prove programme delivery.

## Production verification

After migration application, production contains exactly five normalized Tier A rows:

- Auckland — region `Auckland`
- Christchurch — region `Canterbury`
- Hamilton — region `Waikato`
- Wellington — region `Wellington`
- Dunedin — region `Otago`

Each has:

- `scope_kind = city`
- `publication_tier = A`
- `study_destination_scope = stats_nz_urban_area`
- `population_geography_contract = stats_nz_urban_area`
- one canonical-name alias
- one slug alias

Lincoln and Palmerston North remain unnormalized.

## Contract test

`tests/nz-city-foundation-contract.test.ts` guards:

- exact five-city allowlist
- Tier B non-mutation
- UUID preservation by prohibiting `insert into core.geographies`
- Stats NZ urban-area scope contract
- region mapping
- explicit nearby-city exclusions
- deterministic canonical/slug aliases
- Phase 3 campus-evidence requirement

## Phase 2 acceptance criteria

- [x] exact five Tier A slugs remain canonical
- [x] existing Tier A geography UUIDs are preserved
- [x] geography type is `city`
- [x] scope kind is normalized
- [x] region mapping is explicit
- [x] public study-destination boundary is explicit
- [x] population geography contract is explicit
- [x] deterministic aliases exist
- [x] duplicate canonical rows are guarded
- [x] Tier B rows remain untouched
- [x] campus/programme delivery is not inferred
- [x] production migration is applied and verified
- [x] contract test is committed

## Handoff

Proceed to Phase 3 — Institution and Programme Linkage.

Priority campus audits:

- Auckland: University of Auckland, AUT, Massey Auckland
- Christchurch: University of Canterbury, University of Otago Christchurch
- Hamilton: University of Waikato Hamilton
- Wellington: Victoria University of Wellington, Massey Wellington, University of Otago Wellington classification
- Dunedin: University of Otago Dunedin

If programme-specific delivery evidence remains unavailable, programme coverage must remain `verification_pending` rather than being inferred from institution or campus presence.