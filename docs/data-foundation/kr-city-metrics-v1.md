# South Korea Cities — Phase 4 Five Core Metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `METRICS_COMPLETE`

Country: `KR` — South Korea

Audit date: 2026-08-11

Production migration: `20260811211725_publish_kr_tier_a_city_metrics_v1`

## Metric contract

Each of the six Tier A cities has exactly five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production verified rows: `30`.

## Population

Population uses a consistent 2026-06-30 resident-registration administrative-area reference.

| City | Resident-registration population |
| --- | ---: |
| Seoul | 9,289,813 |
| Busan | 3,232,370 |
| Daejeon | 1,442,034 |
| Suwon | 1,185,770 |
| Yongin | 1,090,211 |
| Pohang | 487,008 |

The metric excludes foreigners because the Ministry of the Interior and Safety resident-registration `전체` definition contains residents, persons with unknown residence and overseas Korean nationals registered as residents, but excludes foreigners.

The population boundary is the exact Phase 2 administrative city, not a metropolitan study ecosystem.

## Living-cost reference

Study in Korea currently publishes an approximate national student living-cost planning range of KRW 750,000–1,000,000 per month.

This same national baseline is carried to all six city profiles with explicit flags:

- `city_specific=false`
- `regional_price_variation=true`
- `ranking_safe=false`

It must not be used to claim that the six cities have equal living costs or to rank a cheapest city.

## Transport references

Transport remains source-native rather than converted to a synthetic monthly student price.

- Seoul: KRW 1,550 adult transit-card subway base fare
- Busan: KRW 1,550 adult city-bus card fare
- Daejeon: KRW 1,500 adult general-bus card fare
- Suwon: KRW 1,650 adult general city/local-bus card fare
- Yongin: KRW 1,650 Ddokbus card base fare
- Pohang: KRW 1,200 adult bus card reference derived from the published KRW 1,300 fare less the KRW 100 card discount

These references have different modes and effective dates. They are useful local transport anchors, not a normalized affordability index.

## Student work context

Study in Korea publishes detailed part-time work rules whose permitted hours depend on programme level, academic year, Korean proficiency, university/accreditation or academic conditions and immigration permission.

The profile stores `30 hours/week` as a conservative national reference ceiling for eligible undergraduate conditions and records a graduate reference of 35 hours under listed conditions.

Flags:

- `national_rule=true`
- `city_specific=false`
- `conditional_permission_required=true`
- `korean_proficiency_required=true`

The work metric is context only and cannot differentiate cities.

## Employment-sector context

Official local economic-development strategies provide indicative sector context:

- Seoul: AI, biotechnology/medicine, quantum, robotics, fintech, creative industries
- Busan: nine strategic industries spanning digital technology, mobility, energy, components/materials, biohealth, lifestyle, culture/tourism, marine and finance
- Daejeon: ABCD+QR — aerospace, bio, chips, defense, quantum, robot
- Suwon: semiconductors, IT, AI/software, bio/medical, IoT/robotics, future mobility/energy
- Yongin: semiconductor production ecosystem, materials/parts/equipment and fabless/chip design
- Pohang: steel/advanced materials, secondary batteries, AI, quantum, biomedical/green bio, hydrogen/clean energy

Every row is explicitly marked:

- `not_shortage_ranking=true`
- `not_job_guarantee=true`

## Private read model

Phase 4 publishes:

- `public.city_metric_directory_kr_v1`

The view uses `security_invoker=true` and remains service-role-only.

## Production verification

- Tier A cities with five metrics: `6/6`
- verified metric rows: `30`
- living-cost rows incorrectly ranking-safe: `0`
- student-work rows incorrectly city-specific: `0`
- sector rows missing no-shortage/no-job-guarantee safeguards: `0`

## Phase 4 conclusion

South Korea Cities has reached `METRICS_COMPLETE`.

Phase 5 may build non-indexed functional profiles from the four private Phase 3–4 read models. Phase 5 must not yet introduce a published Korea city allowlist, sitemap entries or City Compare release.
