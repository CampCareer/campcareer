# South Korea Cities — Phase 3 institution and programme linkage v1

Status: `PHASE_3_COMPLETE`

Checkpoint: `LINKAGE_COMPLETE`

Country: `KR` — South Korea

Audit date: 2026-08-11

Production migration: `20260811211057_publish_kr_tier_a_city_linkage_v1`

## Purpose

Replace the earlier primary-publication-location inheritance with explicit Tier A teaching-location representatives and strict Study in Korea source-city programme linkage.

Phase 3 does not claim a complete Korean higher-education campus inventory. It creates a bounded verified provider/location layer for the six Phase 1 destinations.

## Verified teaching-location representatives

Production now contains 14 Phase 3 teaching-location representatives:

- Seoul: 7 institutions / 7 locations
- Busan: 2 / 2
- Daejeon: 2 / 2
- Suwon: 1 / 1
- Yongin: 1 / 1
- Pohang: 1 / 1

Every Phase 3 location is backed by an official institution source and carries:

- `record_scope=verified_teaching_location_representative`
- `location_quality=verified_official_institution_city`
- `campus_inventory_complete=false`
- `programme_assignment_verified=true`
- `normalization_batch=kr_city_linkage_v1`

## Programme reassignment

The canonical Korea programme foundation remains based on Study in Korea / NIIED source records.

Phase 3 reassigns a verified offering only when all of the following are true:

1. `source_system=KR_STUDYINKOREA`;
2. the staged programme source city exactly matches the selected destination;
3. the institution identity matches;
4. an official Phase 3 teaching-location representative exists in that city;
5. the offering remains verified;
6. the staged programme is verification tier A or B.

Strict Tier A city-linked programme rows: `182`.

Distribution:

- Seoul: `110`
- Busan: `23`
- Daejeon: `14`
- Suwon: `8`
- Yongin: `17`
- Pohang: `10`

These are `verified_partial` counts for the selected Study in Korea provider foundation. They are not complete citywide programme inventories.

## Multi-campus repair

Phase 3 repairs the two material Phase 0 inheritance errors:

### Sungkyunkwan University

- source city: Suwon
- repaired programmes: `8`
- verified representative: Natural Sciences Campus
- Seoul is no longer inherited for these eight rows.

### Kyung Hee University

- source city: Yongin
- repaired programmes: `17`
- verified representative: Global Campus
- Seoul is no longer inherited for these seventeen rows.

After repair:

- source-city mismatch: `0`
- known Suwon/Yongin inherited-city leakage: `0`

## Later-candidate boundary

Cheonan and Goyang remain outside Tier A.

Their three current source programmes are not present in the Korea city directory v1 views.

## Private read models

Phase 3 publishes three `security_invoker=true` read models:

- `public.city_directory_kr_v1`
- `public.city_institution_directory_kr_v1`
- `public.city_programme_directory_kr_v1`

Permissions:

- `service_role`: SELECT
- `anon`: no SELECT
- `authenticated`: no SELECT

Institution identifier maturity is intentionally reported as `studyinkorea_code_or_ieqas_name_mixed_verified` because the current foundation mixes Study in Korea university codes and previously verified IEQAS official-name identities.

## Production verification

- Tier A city rows: `6`
- verified teaching-location rows: `14`
- strict city-linked programmes: `182`
- cities without verified institution/location linkage: `0`
- source-city mismatch: `0`
- Suwon SKKU rows: `8`
- Yongin Kyung Hee rows: `17`
- Cheonan/Goyang leakage: `0`

## Phase 3 conclusion

South Korea Cities has reached `LINKAGE_COMPLETE`.

Phase 4 may build the Five Core Metrics while keeping programme coverage explicitly partial and preserving national-vs-local evidence boundaries.
