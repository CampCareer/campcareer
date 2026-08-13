# South Korea Cities — Phase 2 geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `DATA_FOUNDATION_COMPLETE`

Country: `KR` — South Korea

Audit date: 2026-08-11

Production migration: `20260811210819_normalize_kr_tier_a_city_geographies_v1`

## Exact Tier A geography contract

Phase 2 normalizes exactly six public study destinations:

| City | Slug | MOIS region code | Region | Scope |
| --- | --- | --- | --- | --- |
| Seoul | `seoul` | `1100000000` | Seoul | Seoul Special City |
| Busan | `busan` | `2600000000` | Busan | Busan Metropolitan City |
| Daejeon | `daejeon` | `3000000000` | Daejeon | Daejeon Metropolitan City |
| Suwon | `suwon` | `4111000000` | Gyeonggi-do | Suwon-si |
| Yongin | `yongin` | `4146000000` | Gyeonggi-do | Yongin-si |
| Pohang | `pohang` | `4711000000` | Gyeongsangbuk-do | Pohang-si |

The administrative-code authority is the Ministry of the Interior and Safety Standard Administrative Region Code service. Population scope uses the corresponding resident-registration administrative area.

## Reuse / create behavior

Existing canonical UUIDs are preserved for:

- Seoul
- Busan
- Daejeon
- Pohang

New canonical destination rows are created for:

- Suwon
- Yongin

No other Korea city is promoted to Tier A.

## Capital-region separation

The public destination boundary is administrative, not metropolitan or university-brand based.

Therefore:

- Seoul does not absorb Suwon or Yongin;
- Suwon and Yongin remain independent Gyeonggi-do municipalities;
- Kyung Hee University being present in Seoul and Yongin does not merge those geographies;
- SKKU being present in Seoul and Suwon does not merge those geographies.

This separation is required before Phase 3 repairs the known 25 inherited campus mismatches.

## Metadata contract

Every Tier A geography now carries:

- `publication_tier=A`
- `publication_status=approved_not_indexed`
- `study_destination_scope=mois_administrative_city`
- `population_geography_contract=mois_resident_registration_admin_area`
- MOIS region code and Korean official administrative name
- region code/name
- source and population-source metadata
- `programme_coverage_status=verification_pending`
- explicit requirement for Phase 3 teaching-location evidence

English name, slug and official Korean-name aliases are also stored for every Tier A geography.

## Production verification

Production contains exactly six Korea Tier A rows with the expected codes and region relationships.

No programme delivery was assigned by Phase 2.

## Phase 2 conclusion

South Korea Cities has reached `DATA_FOUNDATION_COMPLETE`.

Phase 3 must verify teaching locations and rebuild programme-to-city assignment from exact Study in Korea source-city evidence plus official campus evidence. The current inherited campus links remain non-authoritative for city delivery.
