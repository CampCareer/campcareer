# Belgium City Compare v1

Status: `PHASE_6_COMPLETE`

Branch: `agent/be-cities-v1`

Checkpoint: `COMPARE_COMPLETE`

## Surface

Belgium City Compare is available through the shared compare route:

`/compare?type=city&country=BE`

The default pair is Brussels vs Ghent. Duplicate-city pairs are rejected and invalid requests fall back to an approved compare-ready pair.

## Compare readiness

A Belgium destination is compare-ready only when all of the following are true:

- it is in the exact six-city `PUBLISHED_BE_CITY_SLUGS` allowlist;
- it has at least one verified teaching location;
- it has at least one linked verified university;
- all five Phase 4 metrics are present with `review_status = verified`.

Programme count is deliberately not a readiness criterion while city programme delivery remains `verification_pending`.

## Comparison semantics

The matrix preserves Phase 2 geography semantics rather than pretending all six destinations use one boundary type:

- Brussels = Brussels-Capital Region;
- Louvain-la-Neuve = public study-destination label, with Ottignies-Louvain-la-Neuve municipality used only for the population contract;
- Ghent, Leuven, Antwerp and Liège = municipality scope.

Student living-cost evidence stays source-native and is not converted into a synthetic cheapest-city score. Student transport evidence stays in the source-native ticket period and is not forced into an artificial monthly equivalent. Employment sectors remain contextual signals, not shortage rankings, job guarantees or immigration indicators.

## Programme boundary

Belgium has 188 verified programme offering records, but those inherited primary-location relationships do not prove delivery at the Phase 3 teaching locations. City Compare therefore excludes programme counts and keeps programme delivery visibly pending.

## Navigation

Each Belgium city profile links into City Compare with that city preselected, and the comparison matrix links back to each city profile.

Production DB mutation in Phase 6: `NONE`.
