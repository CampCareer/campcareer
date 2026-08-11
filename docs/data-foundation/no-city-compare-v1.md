# Norway Cities — Phase 6 City Compare v1

Status: `PHASE_6_COMPLETE`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Surface

Norway City Compare is available through:

`/compare?type=city&country=NO`

Default pair:

- Oslo
- Trondheim

The shared selector prevents duplicate left/right pairs and falls back to Oslo plus another compare-ready Tier A municipality.

## Compare readiness

A Norway city enters Compare only when all of the following are true:

- it is in the exact five-city Norway rollout allowlist
- all five required metric families are verified
- linked campus/study-location count is positive
- linked canonical institution count is positive
- the profile loader resolves the verified Norway read models

The five current Tier A municipalities satisfy this contract:

`oslo, trondheim, stavanger, as, tromso`

## Comparison semantics

Comparable city evidence:

- Statistics Norway municipality population
- source-native local transport reference
- verified university-category institutions/locations
- verified-partial programme count
- official/local employment-sector context

Shared national context, deliberately not ranked:

- 2026–27 NOK 15,488 monthly student-funds/living reference
- UDI 20-hours-per-week student work context

Transport remains source-native. Phase 6 does not synthesize unlike local ticket products into an artificial common price.

## Coverage disclosure

Programme counts remain `verified_partial` because the current institution foundation covers NOKUT's university category rather than Norway's complete approved HEI universe.

Study-location records remain publication representatives rather than a claim of complete physical-campus inventory.

Compare does not score or name a winning city.

## Phase 6 conclusion

Norway City Compare is implementation-complete for the five Tier A municipalities. SEO publication remains Phase 7.
