# France city profile v1

Status: `PHASE_5_COMPLETE_PENDING_CI`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-10

Checkpoint target: `PROFILE_COMPLETE`

## Exact profile routes

- `/cities/fr/paris`
- `/cities/fr/paris-saclay`
- `/cities/fr/bordeaux`
- `/cities/fr/strasbourg`
- `/cities/fr/grenoble`
- `/cities/fr/aix-marseille`
- `/cities/fr/nice`

No other France city slug is accepted by the Phase 5 route allowlist.

## Read contract

The profile server reads only:

- `city_directory_fr_v1`
- `city_institution_directory_fr_v1`
- verified rows from `report_metric_evidence_city`

It does not query raw campuses, programmes or programme offerings and does not read the city programme directory to manufacture a programme count.

## UI disclosure

The profile keeps these distinctions visible:

- public population geography versus physical teaching locality;
- initial verified nine-university foundation versus the full French higher-education provider universe;
- source-native living-cost methodology;
- source-native transport fare periods and eligibility;
- the national 964-hour annual student-work rule;
- INSEE employment-sector context as descriptive, not predictive;
- France programme delivery as `verification_pending` rather than `0 programmes`.

## Publication boundary

Phase 5 approved routes use `noindex, follow`. Unsupported slugs use `noindex, nofollow`.

Search indexing and sitemap publication remain deferred to Phase 7. City Compare remains deferred to Phase 6.

No main merge or Vercel deployment is part of Phase 5.
