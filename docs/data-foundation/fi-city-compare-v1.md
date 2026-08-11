# Finland Cities — Phase 6 City Compare v1

Status: `PHASE_6_COMPLETE`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Surface

Finland City Compare is available through:

`/compare?type=city&country=FI`

Default pair:

- Helsinki
- Espoo

The selector prevents duplicate left/right pairs and falls back to Helsinki plus another compare-ready Tier A municipality.

## Compare readiness

A Finland city enters Compare only when all of the following are true:

- it is in the exact eight-city FI rollout allowlist
- all five required metric families are verified
- linked campus/study-location count is positive
- linked canonical institution count is positive
- the profile loader can resolve the verified read models

All eight current Tier A municipalities satisfy this contract.

## Comparison semantics

Comparable city evidence:

- Statistics Finland municipality population
- source-native local transport reference
- verified university-core institutions/locations
- verified-partial programme count
- official local employment-sector context

Shared national context, deliberately not ranked:

- Study in Finland EUR 900–1,200 monthly planning range
- Migri average 30-hours-per-week student work context

Transport is not synthetically converted to a common monthly product. Turku therefore remains a source-native student value-card journey reference while other cities can use 30-day student season products.

## Coverage disclosure

Programme counts remain `verified_partial` because CampCareer currently covers a selected ten-university core rather than Finland's complete recognised HEI/UAS universe.

Institution identity maturity also remains `provisional_name_identity_studyinfo_oid_pending`.

Compare does not score or name a winning city.

## Phase 6 conclusion

Finland City Compare is implementation-complete for the eight Tier A municipalities. SEO publication remains Phase 7.
