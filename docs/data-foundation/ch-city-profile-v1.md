# Switzerland Cities — Phase 5 City profiles v1

Status: `PHASE_5_COMPLETE`
Checkpoint: `SIX_CITY_PROFILE_ROUTES_READY`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Supported routes

Phase 5 supports exactly six Switzerland City profile routes:

- `/cities/ch/zurich`
- `/cities/ch/lausanne`
- `/cities/ch/basel`
- `/cities/ch/lugano`
- `/cities/ch/fribourg`
- `/cities/ch/geneva`

`SUPPORTED_CH_CITY_SLUGS` is the application allowlist. It is not yet the SEO publication allowlist.

Unsupported Switzerland slugs return `notFound()`.

## SEO state

All six supported profiles remain:

`robots: { index: false, follow: true }`

Phase 5 creates usable canonical profile routes but does not publish/index them. Publication and sitemap inclusion remain Phase 7 work.

## Server loader contract

`getChCityProfile()` resolves only supported slugs and loads:

- `city_directory_ch_v1`
- `city_institution_directory_ch_v1`
- `city_programme_directory_ch_v1`
- the five verified City metric families

The loader uses the service-role server client. The underlying City views remain service-role only and `security_invoker=true`.

## Profile evidence

Each City dashboard displays:

- FSO/BFS municipality identity and canton context
- common-reference municipality population
- source-native living-cost planning context
- source-native transport context
- third-country student-work context with EU/EFTA caveat
- verified university-core study-location representatives
- a sample of municipality-linked programmes
- international-admission evidence state separate from programme existence
- official metric sources
- local/cantonal/regional economic-development context without shortage-ranking claims

## Programme coverage

Current verified-partial programme counts are:

| City | Programmes |
|---|---:|
| Zurich | 74 |
| Lausanne | 10 |
| Basel | 24 |
| Lugano | 22 |
| Fribourg | 20 |
| Geneva | 20 |
| Total | 170 |

The Lausanne profile explicitly explains that EPFL's 29 Lausanne-labelled programmes are excluded from the Lausanne municipality profile because Phase 3 did not establish the EPFL main campus as being inside Lausanne municipality.

## Coverage disclosure

Every profile retains these constraints:

- current institutions cover the 12 swissuniversities university-category institutions, not the complete accredited HEI universe
- study-location representatives are not complete campus inventories
- programme coverage remains `verified_partial`
- most international evidence is `verified_general` rather than programme-specific
- living-cost and transport references are source-native planning values, not a harmonized city ranking
- student-work context is a national third-country rule, not city differentiation

## Phase 5 conclusion

Switzerland Cities Phase 0–5 is implementation-complete for the six supported municipality routes. Compare remains Phase 6 and SEO publication remains Phase 7.