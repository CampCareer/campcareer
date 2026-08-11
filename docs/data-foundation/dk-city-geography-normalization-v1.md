# Denmark city geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `DATA_FOUNDATION_COMPLETE`

Branch: `agent/dk-cities-v1`

Production migration: `20260810200934_normalize_dk_tier_a_city_geographies_v1`

Audit date: 2026-08-10

## Scope

Phase 2 normalizes the five Phase 1 Tier A Denmark city geographies without changing their UUIDs or creating new city records.

The exact normalized set is:

| City | Slug | Region code | Municipality code | Public scope |
| --- | --- | --- | --- | --- |
| Copenhagen | `copenhagen` | `084` | `101` | Copenhagen Municipality |
| Frederiksberg | `frederiksberg` | `084` | `147` | Frederiksberg Municipality |
| Odense | `odense` | `083` | `461` | Odense Municipality |
| Aarhus | `aarhus` | `082` | `751` | Aarhus Municipality |
| Aalborg | `aalborg` | `081` | `851` | Aalborg Municipality |

Statistics Denmark's regions/provinces/municipalities classification is the geography authority. Municipalities are the LAU layer complementing the NUTS regions.

## Boundary contract

All five public study destinations use `study_destination_scope = dst_municipality`.

Copenhagen and Frederiksberg remain separate municipal study destinations. Copenhagen is not expanded to Greater Copenhagen and Frederiksberg is not folded into Copenhagen.

Phase 2 adds the following canonical metadata:

- `dk_city_normalization_v1 = true`
- `publication_tier = A`
- `public_slug`
- Statistics Denmark region code/name
- Statistics Denmark municipality code
- `study_destination_scope = dst_municipality`
- boundary label and scope note
- `population_geography_contract = dst_municipality`
- `campus_membership_contract = phase_3_explicit_location_evidence_required`

## Alias contract

Canonical-name and slug aliases are created for every Tier A city. Additional Danish/local legacy spellings are retained for route/data matching where relevant:

- Copenhagen → `København`
- Aarhus → `Århus`
- Aalborg → `Ålborg`

## Deferred scope

Existing Tier B geographies remain untouched:

- Lyngby
- Roskilde

Discovered programme cities Sønderborg, Kolding and Esbjerg are not auto-created by Phase 2.

## Verification

The production migration asserts:

- exactly five normalized Tier A rows;
- one canonical row per Tier A slug;
- zero Tier B rows marked by the DK Phase 2 normalization batch;
- at least canonical-name and slug aliases for every Tier A geography.

Repository contract: `tests/dk-city-foundation-contract.test.ts`.

Result: Denmark Cities has reached `DATA_FOUNDATION_COMPLETE` through Phase 2.