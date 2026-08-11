# France city linkage v1

Status: `PHASE_3_COMPLETE`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-10

Checkpoint: `LINKAGE_COMPLETE`

## Verified teaching-location set

Production contains 10 Phase 3 teaching-location rows across 9 canonical universities:

- Paris: Sorbonne Université Jussieu; Université Paris Cité Grands Moulins; Mines Paris – PSL Paris Campus
- Paris-Saclay: Université Paris-Saclay Campus d'Orsay
- Bordeaux: Université de Bordeaux Talence / Peixotto
- Strasbourg: Université de Strasbourg Campus Esplanade
- Grenoble: Université Grenoble Alpes Saint-Martin-d'Hères
- Aix-Marseille: AMU Site Schuman and Site Saint-Charles
- Nice: Université Côte d'Azur Campus Valrose

Paris therefore has 3 verified teaching locations and Aix-Marseille 2; every other Tier A destination has 1.

The PSL row is explicitly a verified PSL-member teaching campus, not a claim that all PSL teaching occurs there.

## Programme boundary

All new teaching-location rows retain:

- `programme_assignment_verified=false`
- `campus_inventory_complete=false`
- `record_scope=verified_teaching_campus`
- `location_quality=verified_official`

The 132 verified France programme offerings retain their earlier registered-location relationships and are not remapped to these Phase 3 teaching locations without explicit programme delivery evidence.

`city_programme_directory_fr_v1` therefore contains 0 rows and every Tier A destination is `verification_pending`.

## Read models and security

- `city_directory_fr_v1`
- `city_institution_directory_fr_v1`
- `city_programme_directory_fr_v1`

All three use `security_invoker=true`. `service_role` has SELECT; `anon` and `authenticated` do not.

## Production verification

- city directory rows: 7
- verified teaching-location rows: 10
- distinct linked universities: 9
- Tier A destinations missing institution/location linkage: 0
- city programme rows: 0
