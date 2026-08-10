# Belgium city profile v1

Status: `PHASE_5_COMPLETE`

Branch: `agent/be-cities-v1`

Checkpoint: `PROFILE_COMPLETE`

## Public route allowlist

Phase 5 enables exactly these route contracts while keeping them out of search indexing until Phase 7:

- `/cities/be/brussels`
- `/cities/be/ghent`
- `/cities/be/leuven`
- `/cities/be/antwerp`
- `/cities/be/louvain-la-neuve`
- `/cities/be/liege`

Approved profiles use `noindex, follow`; unsupported slugs use `noindex, nofollow` and `notFound()`.

## Read model

`src/lib/cities/be-city-profile.server.ts` is server-only and reads only:

- `public.city_directory_be_v1`
- `public.city_institution_directory_be_v1`
- verified `public.report_metric_evidence_city`

It does not read the raw campus/programme/offering catalogue and does not query the city programme directory for inferred availability.

## Profile disclosure

The dashboard preserves the Phase 2 geography boundary, all five Phase 4 metric semantics, official teaching-location evidence and the incomplete-provider coverage warning.

Brussels is explicitly the Brussels-Capital Region study destination. Louvain-la-Neuve remains a study-destination label while its population is explicitly that of Ottignies-Louvain-la-Neuve municipality.

Belgium currently has 188 verified programme offering records, but no Phase 3 teaching-location assignment is explicitly programme-verified. The UI therefore displays `verification_pending`, never “0 programmes”, and never infers delivery from institution/campus presence.

The linked institutions form an initial verified university set, not a complete Belgian higher-education universe. Universities of applied sciences and university colleges may be absent until independently verified.

## Phase 6 handoff

City Compare readiness for Belgium must require:

- all five verified city metrics;
- at least one verified teaching location;
- at least one linked institution.

Programme count must not be a readiness criterion while programme delivery remains `verification_pending`. Living cost and transport remain source-native and must not be converted into naive cheapest-city rankings.

Production DB mutation in Phase 5: `NONE`.

Compare: deferred to Phase 6.

SEO indexing: deferred to Phase 7.
