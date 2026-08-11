# France city cross-phase QA v1

Status: `PHASE_8_COMPLETE`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-11

Checkpoint: `PUBLISH_READY`

## Production recheck

Production Supabase was re-queried after Phase 6–7 code changes.

Current France Tier A state:

- city-directory rows: `7`
- verified teaching-location rows: `10`
- distinct linked universities: `9`
- verified Five Core Metric rows: `35`
- verified core metrics per destination: `5/5`
- city programme rows: `0`
- programme coverage: `verification_pending` for `7/7`

Per-destination institution/teaching-location counts remain:

- Paris: 3 universities / 3 teaching locations
- Aix-Marseille: 1 university / 2 teaching locations
- Paris-Saclay: 1 / 1
- Bordeaux: 1 / 1
- Strasbourg: 1 / 1
- Grenoble: 1 / 1
- Nice: 1 / 1

## Read-model security

Rechecked production views:

- `city_directory_fr_v1`
- `city_institution_directory_fr_v1`
- `city_programme_directory_fr_v1`

All three currently have `security_invoker=true`.

Access contract:

- `service_role`: SELECT allowed
- `anon`: SELECT not allowed
- `authenticated`: SELECT not allowed

## Geography separation QA

The Phase 2 public-population geography remains separate from physical teaching locality where required.

Verified examples:

- Aix-Marseille public destination → Marseille and Aix-en-Provence teaching localities
- Bordeaux public destination → Talence teaching locality
- Grenoble public destination → Saint-Martin-d'Hères teaching locality
- Nice metropolitan public destination → Nice commune locality
- Paris-Saclay public destination → Orsay teaching locality
- Strasbourg metropolitan public destination → Strasbourg commune locality
- Paris commune → Paris teaching locality, where public and locality geography legitimately coincide

No metropolitan destination is represented as an alias for these physical locality rows.

## Cross-phase application contract

Phase 8 verifies that:

1. the seven-route allowlist drives profile and compare scope;
2. profiles read only verified France city read models and metric evidence;
3. Compare requires all five verified metrics plus institution/teaching-location linkage;
4. Compare keeps commune/EPCI boundary differences visible;
5. the 964-hour national student-work rule remains source-native;
6. the 132 national programme offerings are not treated as city delivery;
7. Phase 7 publishes only the seven approved profiles;
8. `/compare` remains noindex;
9. sitemap entries derive from the France route allowlist.

## Migration-history note

The three Phase 2–4 migration files are committed and reproducible, but the Supabase migration-history action was blocked by the tool safety gateway during the operational session. Production state has been independently re-queried and matches the committed contracts; this QA does not claim that those filenames are recorded in the Supabase migration history table.

## Result

France Cities passes Phase 8 cross-phase QA.

Status: `PUBLISH_READY`

Phase 9 may now assess the branch against the latest `main` and prepare the current-main integration candidate.

No main merge or Vercel deployment is part of Phase 8.
