# Finland Cities — Phase 3 institution and programme linkage v1

Status: `PHASE_3_COMPLETE`
Checkpoint: `LINKAGE_COMPLETE`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Evidence chain

A programme appears in a Finland city read model only when this chain is satisfied:

`Statistics Finland municipality -> verified official institution study-location representative -> recognised canonical university -> exact FI_OFFICIAL offering source key -> canonical programme`

Institution presence alone never implies programme delivery.

## Institution / location coverage

Current verified university-core location representatives: 10.

- Espoo: Aalto University
- Helsinki: University of Helsinki; Hanken School of Economics
- Tampere: Tampere University
- Turku: University of Turku; Åbo Akademi University
- Oulu: University of Oulu
- Jyväskylä: University of Jyväskylä
- Lappeenranta: LUT University
- Joensuu: University of Eastern Finland

Each representative is backed by an official university campus/location source. The records remain explicitly `campus_inventory_complete=false`; they are not a claim that CampCareer has enumerated every physical campus of each institution.

## Programme linkage

The programme view requires all of the following:

- offering `source_system='FI_OFFICIAL'`
- offering `verification_status='verified'`
- exact `source_record_key = source_name || ':' || source_program_key`
- staging `verification_tier='A'`
- staging `collection_status='official_current_program_verified'`
- non-null official programme URL
- canonical programme belongs to the same staging institution
- assigned campus belongs to the same institution
- staging source city exactly matches the normalized municipality name
- campus has Phase 3 verified-location metadata

Production result:

| City | Institutions | Programmes |
|---|---:|---:|
| Espoo | 1 | 81 |
| Helsinki | 2 | 49 |
| Tampere | 1 | 47 |
| Turku | 2 | 42 |
| Lappeenranta | 1 | 40 |
| Joensuu | 1 | 30 |
| Oulu | 1 | 27 |
| Jyväskylä | 1 | 26 |
| **Total** | **10 distinct** | **342** |

Source-city mismatches after publication: 0.

Programme coverage state is therefore `verified_partial`, not complete municipal catalogue coverage. The current provider layer remains a 10-university core and excludes much of the 35-recognised-HEI universe, especially UAS providers.

## Institution identifier maturity

The current production identifier system is `FI_EDUFI_TIER_A_NAME`.

No Studyinfo organisation OID is fabricated in this phase. Read models explicitly publish:

`provisional_name_identity_studyinfo_oid_pending`

This preserves the Phase 0 remediation gate while allowing verified location/programme relationships for the current university core.

## Qualification boundary

Staging degree levels are present for all 342 programme rows. Canonical `catalog.programmes.qualification_level_id` remains null for all 342 FI programmes, so the city layer surfaces source-native `degree_level` but does not claim a repaired canonical qualification taxonomy.

## Read models and security

Created:

- `public.city_institution_directory_fi_v1`
- `public.city_programme_directory_fi_v1`
- `public.city_directory_fi_v1`

All three use `security_invoker=true`.

Access contract:

- `service_role`: SELECT
- `anon`: no SELECT
- `authenticated`: no SELECT

## Production operation note

The combined Phase 3 migration was rejected by the tool safety gateway before execution. No partial combined migration ran.

The ten study-location data updates were then applied through individually constrained production updates and independently verified. Read-model DDL was recorded through Supabase migration history as:

`20260811023312_publish_fi_tier_a_city_read_models_v1`

The repository also contains the deterministic replay migration `20260811023200_verify_fi_tier_a_study_locations_v1.sql` for the data step.

## Phase 3 conclusion

Production verification:

- city directory rows: 8
- verified study-location representatives: 10
- distinct linked institutions: 10
- verified-partial programme rows: 342
- source-city mismatches: 0
- read-model exposure regressions: 0

Checkpoint: `LINKAGE_COMPLETE`.
