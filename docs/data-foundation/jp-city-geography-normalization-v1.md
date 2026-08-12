# Japan city geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `DATA_FOUNDATION_COMPLETE`

Branch: `agent/jp-cities-v1`

Production migration: `20260812002159_normalize_jp_tier_a_city_geographies_v1`

## Exact Tier A geography contract

| Destination | Slug | e-Stat/statistical area code | Prefecture code | Product boundary |
| --- | --- | --- | --- | --- |
| Tokyo | `tokyo` | `13100` | `13` | Tokyo 23 special wards aggregate (`東京都区部`) |
| Kyoto | `kyoto` | `26100` | `26` | Kyoto-shi municipality |
| Nagoya | `nagoya` | `23100` | `23` | Nagoya-shi municipality |
| Sendai | `sendai` | `04100` | `04` | Sendai-shi municipality |
| Suita | `suita` | `27205` | `27` | Suita-shi municipality |
| Tsukuba | `tsukuba` | `08220` | `08` | Tsukuba-shi municipality |
| Fukuoka | `fukuoka` | `40130` | `40` | Fukuoka-shi municipality |

All seven existing canonical geography UUIDs were preserved and normalized in place. Kunitachi remains separate and outside Tier A v1.

## Boundary guards

- `tokyo` means the Tokyo 23 special wards aggregate, not all Tokyo Metropolis.
- Kunitachi is never inherited into Tokyo.
- Suita remains distinct from Osaka City, Toyonaka and Minoh.
- raw prefecture labels `Aichi`, `Tochigi` and `Gunma` do not become city geographies.
- Phase 2 does not assign programme delivery.

Every Tier A geography is marked `approved_not_indexed` and `programme_coverage_status=verification_pending` until later phases.

## Population contract

Population evidence must use the same Phase 2 statistical/municipal boundary and area code. Phase 4 uses the 2025 Population Census preliminary counts at 2025-10-01.

## Result

`DATA_FOUNDATION_COMPLETE`

Next: Phase 3 teaching-location and conservative programme linkage.
