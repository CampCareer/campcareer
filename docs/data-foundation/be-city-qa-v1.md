# Belgium city cross-phase QA v1

Status: `PHASE_8_COMPLETE`

Branch: `agent/be-cities-v1`

Checkpoint: `PUBLISH_READY`

Audit date: 2026-08-10

## Production cross-check

Production was re-read after Phase 7.

- Tier A geographies: 6
- city directory rows: 6
- verified teaching-location rows: 7
- distinct linked universities: 7
- cities with zero institution or teaching-location linkage: 0
- verified core city metrics: 30
- cities with exactly five core metrics: 6
- city programme rows: 0
- cities with programme coverage `verification_pending`: 6

## Security cross-check

The three Belgium city read-model views were rechecked in production:

- `city_directory_be_v1`
- `city_institution_directory_be_v1`
- `city_programme_directory_be_v1`

All three use `security_invoker=true`. `service_role` has SELECT; `anon` and `authenticated` do not.

## Current-source recheck

Current official source pages were rechecked on 2026-08-10:

- Statbel continues to publish official population structure/open-data material and 2026 population figures: `https://statbel.fgov.be/en/themes/population/structure-population`
- Belgian FPS Employment continues to state that foreign students authorised to reside as students may work during school holidays and, outside school holidays, up to 20 hours per week when compatible with their studies: `https://employment.belgium.be/en/themes/international/foreign-workers/employment-foreign-workers-special-residence-situation`
- Belgian Immigration Office study guidance remains the authoritative residence context: `https://dofi.ibz.be/en/themes/third-country-nationals/study`

These source rechecks do not change the stored Phase 2–4 data contract. They confirm that the main national population and student-work evidence families remain current.

## Cross-phase invariants

1. Exact published scope remains Brussels, Ghent, Leuven, Antwerp, Louvain-la-Neuve and Liège.
2. Brussels is not silently converted into the City of Brussels municipality.
3. Louvain-la-Neuve remains a public study-destination label while population uses Ottignies-Louvain-la-Neuve municipality.
4. Institution presence or a verified teaching location never proves programme delivery.
5. The current linked university set is not presented as a complete Belgian higher-education provider universe.
6. Living-cost sources retain their own methodology and confidence.
7. Transport products retain source-native periods and eligibility conditions.
8. Belgian student-work context is national and is not presented as a city advantage.
9. Employment-sector evidence is contextual only, not a shortage ranking or job guarantee.
10. City Compare requires all five verified metrics plus positive verified teaching-location and institution linkage.
11. Approved city profiles are indexable; unsupported slugs and the parameterized Compare surface remain non-indexable.

## CI validation

GitHub Actions CI run `31431882409` (#1191) passed on validated Phase 8 head `32f156ec2d3643a5a45202b49df608ae72e354ba` after correcting one Belgium Compare JSX lint issue from the preceding run.

Passed gates:

- `npm ci`
- production dependency audit
- typecheck
- lint
- full test suite including Belgium Phase 6–8 contracts
- production build
- Git-history secret scan

No production DB mutation is introduced by Phase 8.
