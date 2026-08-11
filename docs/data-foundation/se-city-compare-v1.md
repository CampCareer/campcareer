# Sweden city Compare v1

Status: `PHASE_6_COMPLETE`

Checkpoint: `COMPARE_COMPLETE`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Approved comparison set

Exactly six Sweden Tier A cities are compare-eligible:

- Stockholm
- Gothenburg
- Uppsala
- Lund
- Linköping
- Umeå

The route source of truth remains `PUBLISHED_SE_CITY_SLUGS`.

## Route

`/compare?type=city&country=SE`

Default pair: Stockholm vs Gothenburg.

Optional `left` and `right` parameters select another approved pair. Duplicate-city requests resolve to a valid distinct city.

The shared Compare page remains `noindex, nofollow`.

## Compare readiness

A city is compare-ready only when it has:

1. an approved Sweden Tier A slug;
2. all five verified Phase 4 metrics;
3. at least one verified university city location;
4. at least one linked canonical university.

All six production cities pass this gate.

Programme count is displayed because Sweden Phase 3 has explicit source-city-matched programme evidence, but the count remains `verified_partial` and is not claimed to be a complete municipal catalogue.

## Comparison semantics

### Population

All six use the same SCB municipality boundary contract, so population is municipality-to-municipality.

### Student budget

SEK 10,656/month is the shared national Study in Sweden baseline. It is deliberately not ranked as a city cost difference.

### Transport

Each city keeps the local operator's source-native product and validity period. No synthetic monthly conversion or cheapest-city ranking is created.

### Student work

The relevant 15-hour/week student residence-permit rule is national context, not a city differentiator.

### Programmes

Counts are limited to the selected ten-university core and require exact source-city/location reconciliation. A higher count is not represented as complete provider coverage or university quality.

### Career environment

Official economic-sector context is descriptive only and is not a shortage ranking, employment guarantee or immigration signal.

## Navigation

Every Sweden city profile links to its City Compare state. Compare links back to each selected city profile.

## Files

- `src/lib/cities/se-city-comparison.server.ts`
- `src/app/(workspace)/compare/sweden-cities-compare-matrix.tsx`
- `src/app/(workspace)/compare/page.tsx`
- `src/app/(workspace)/cities/se/[city]/page.tsx`
- `tests/se-city-compare-contract.test.ts`

No production database mutation is required in Phase 6.

Next: Phase 7 publication and SEO.