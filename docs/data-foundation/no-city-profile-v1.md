# Norway Cities — Phase 5 City profiles v1

Status: `PHASE_5_COMPLETE`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Supported routes

Phase 5 enables exactly five Norway City profile routes:

- `/cities/no/oslo`
- `/cities/no/trondheim`
- `/cities/no/stavanger`
- `/cities/no/as`
- `/cities/no/tromso`

The allowlist lives in `src/lib/cities/city-routes.ts` as `SUPPORTED_NO_CITY_SLUGS`.

No other Norway City slug is supported in Phase 5.

## Publication state

These are supported application routes, not SEO-published City pages yet.

Each route returns:

`robots: { index: false, follow: true }`

A later publication/SEO phase must explicitly promote routes before they become indexed or sitemap-publication surfaces.

## Server profile contract

`src/lib/cities/no-city-profile.server.ts` reads only the Phase 3 server-side views:

- `city_directory_no_v1`
- `city_institution_directory_no_v1`
- `city_programme_directory_no_v1`

and the verified five-key City metric evidence table.

The loader rejects any slug outside the five-city support allowlist before querying the City read model.

## Profile content

Every supported City profile can render:

- Statistics Norway municipality identity and population
- current national student living-cost/funds reference with explicit non-city-specific disclosure
- source-native local student/student-relevant public-transport reference
- national UDI study-permit work context
- official/local employment focus sectors with non-shortage disclaimer
- verified university study-location representatives
- up to eight exact source-city-matched programme examples
- metric source links

## Coverage disclosure

The profile UI preserves two important boundaries:

1. the current institution foundation is the 11-institution NOKUT university category, not Norway's complete approved HEI universe
2. verified study-location rows are representatives for City publication, not complete physical-campus inventories

Programme counts therefore remain `verified_partial`.

## Route-name contract

Display names preserve Norwegian characters while route slugs remain ASCII:

- `as` renders `Ås`
- `tromso` renders `Tromsø`

## Phase 5 conclusion

Norway Cities Phase 0–5 is now implemented on the single Norway branch with exactly five supported City destinations. Phase 6 comparison work and later SEO publication are intentionally not started.
