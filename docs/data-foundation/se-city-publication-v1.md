# Sweden city publication v1

Status: `PHASE_7_COMPLETE`

Checkpoint: `PUBLICATION_COMPLETE`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Indexed routes

Exactly six Sweden city profiles are publication-approved:

- `/cities/se/stockholm`
- `/cities/se/gothenburg`
- `/cities/se/uppsala`
- `/cities/se/lund`
- `/cities/se/linkoping`
- `/cities/se/umea`

Each approved route now uses `index, follow`, country-specific `Study in <City>, Sweden` metadata and a canonical `/cities/se/{slug}` URL.

Unsupported Sweden slugs remain `notFound()` with `noindex, nofollow` metadata.

## Sitemap

The global sitemap derives Sweden city URLs directly from `PUBLISHED_SE_CITY_SLUGS`.

This prevents a separate manually maintained SEO cohort from drifting away from the application allowlist.

Provider-expansion candidates such as Malmö, Luleå, Växjö, Kalmar, Örebro, Karlstad and Jönköping are not present in the Sweden city sitemap.

## Compare SEO boundary

`/compare?type=city&country=SE` remains on the shared parameterized Compare route with `noindex, nofollow` metadata.

City profile publication does not make comparison permutations indexable.

## Evidence disclosures retained

Publication does not weaken the earlier evidence contracts:

- public boundary remains SCB municipality;
- institution layer remains the selected ten-university core;
- programme counts remain `verified_partial`;
- national student-budget and work rules are not city rankings;
- transport remains source-native;
- employment sectors remain contextual rather than shortage rankings.

## Files

- `src/app/(workspace)/cities/se/[city]/page.tsx`
- `src/app/sitemap.ts`
- `tests/se-city-publication-contract.test.ts`

No production database mutation is required in Phase 7.

Next: Phase 8 cross-phase QA.