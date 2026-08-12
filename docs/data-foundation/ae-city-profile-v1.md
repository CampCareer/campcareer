# United Arab Emirates Cities — Phase 5 City profiles v1

Status: `PHASE_5_COMPLETE`

Checkpoint: `FOUR_CITY_PROFILE_SUPPORT_READY`

Country: `AE` — United Arab Emirates

Checked: 2026-08-12

Branch: `agent/ae-cities-v1`

## Supported routes

Phase 5 supports exactly four application routes:

- `/cities/ae/abu-dhabi`
- `/cities/ae/sharjah`
- `/cities/ae/al-ain`
- `/cities/ae/dubai`

Support authority:

`SUPPORTED_AE_CITY_SLUGS`

This is not yet the SEO publication authority.

## SEO state

All four Phase 5 routes use:

`robots: { index: false, follow: true }`

Phase 5 does not add UAE City routes to the root sitemap and does not create `PUBLISHED_AE_CITY_SLUGS`.

Publication remains a later phase.

## Server profile

`src/lib/cities/ae-city-profile.server.ts` reads only:

- `city_directory_ae_v1`
- `city_institution_directory_ae_v1`
- `city_programme_directory_ae_v1`
- `city_metric_directory_ae_v1`

Unsupported slugs are rejected before database lookup.

## Profile semantics

The City profile displays:

- City/locality and containing emirate separately
- verified provider and physical study-location counts
- strict verified-partial programme count
- up to eight City-linked programme examples
- source-aware living-cost reference
- source-native transport reference
- permit-based national student-work context
- local economic-sector context
- metric sources and dates

## Population disclosure

The profile does not substitute emirate-wide population for City population.

When no release-safe comparable City-locality number is used, the UI explicitly reports that state rather than showing a misleading number.

## Coverage disclosures

The profile states that:

- programme coverage is `verified_partial`
- the current provider foundation is not the complete licensed UAE higher-education universe
- campus records are verified representatives, not complete physical-campus inventories
- ECAE has a verified Abu Dhabi physical location but its two current programme rows are not automatically assigned to Abu Dhabi
- Fakeeh College for Medical Sciences – Dubai remains outside City linkage pending sufficient Dubai teaching-location evidence
- programme accreditation does not imply current international admission is open
- living-cost references are source-native and are not a cheapest-City ranking
- employment sectors are context only, not shortage or hiring guarantees

## Deferred routes

The following remain unsupported:

- `khor-fakkan`
- `ajman`
- `fujairah`
- `ras-al-khaimah`
- `umm-al-quwain`

## Conclusion

UAE Cities Phase 5 is implementation-complete for the exact top-four scope. Compare and SEO publication remain later phases.