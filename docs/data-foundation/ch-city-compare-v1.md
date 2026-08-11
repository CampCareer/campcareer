# Switzerland Cities — Phase 6 City Compare v1

Status: `PHASE_6_COMPLETE`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Surface

Switzerland City Compare is available through:

`/compare?type=city&country=CH`

Default pair:

- Zurich
- Lausanne

The selector prevents duplicate left/right pairs and falls back to Zurich plus another compare-ready Tier A municipality.

## Compare readiness

A Switzerland City enters Compare only when all of the following are true:

- it is in the exact six-City Switzerland rollout allowlist
- all five required metric families are verified
- linked study-location count is positive
- linked canonical institution count is positive
- the Switzerland City profile loader resolves successfully

The six current municipalities satisfy this contract:

`zurich, lausanne, basel, lugano, fribourg, geneva`

## Comparison semantics

Comparable evidence includes:

- common-reference FSO STATPOP municipality population
- source-native living-cost planning context
- source-native local transport context
- verified university-category study locations
- verified-partial programme counts
- official local/cantonal/regional economic context

Shared national context, deliberately not ranked:

- third-country student work context under SEM
- EU/EFTA cases may differ and are disclosed separately

Living-cost and transport products retain their source-native definitions. Phase 6 does not synthesize unlike baskets or ticket products into an artificial common price index.

## Lausanne boundary safeguard

Lausanne remains a municipality comparison, not a wider academic-cluster comparison. The EPFL main-campus programme cohort remains excluded because Phase 3 did not verify it inside Lausanne municipality.

## Coverage disclosure

Programme counts remain `verified_partial` because the current provider foundation covers the 12 swissuniversities university-category institutions rather than Switzerland's complete accredited higher-education universe.

Study-location representatives are not a complete physical-campus inventory.

Compare does not score or name a winning City.

## Phase 6 conclusion

Switzerland City Compare is implementation-complete for the six Tier A municipalities. SEO publication remains Phase 7.
