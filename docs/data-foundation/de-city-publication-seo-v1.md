# Germany city publication and SEO v1

Status: `PHASE_7_COMPLETE`

Branch: `agent/de-cities-publication-v1`

Parent Phase 6: `agent/de-cities-city-compare-v1`

Audit date: 2026-08-10

## Purpose

Publish the approved Germany Tier A city profiles for search discovery without changing the evidence, geography, institution-linkage, metric or programme-delivery contracts established in Phases 1–6.

Phase 7 is a publication layer only.

## Published set

Exactly nine Germany city profiles are indexable:

- Berlin
- Munich
- Hamburg
- Aachen
- Bonn
- Dresden
- Heidelberg
- Karlsruhe
- Tübingen

The publication source of truth remains `PUBLISHED_DE_CITY_SLUGS`.

Unapproved or future expansion candidates such as Frankfurt, Cologne, Leipzig, Münster, Stuttgart and Freiburg are not silently published.

## Canonical routes

Indexable routes are:

- `/cities/de/berlin`
- `/cities/de/munich`
- `/cities/de/hamburg`
- `/cities/de/aachen`
- `/cities/de/bonn`
- `/cities/de/dresden`
- `/cities/de/heidelberg`
- `/cities/de/karlsruhe`
- `/cities/de/tuebingen`

Approved pages use:

- title `Study in <City>, Germany`
- canonical `/cities/de/<slug>`
- `robots: index, follow`

Unsupported slugs remain outside the route allowlist and retain the not-found / `noindex, nofollow` fallback.

## Sitemap

`src/app/sitemap.ts` imports `PUBLISHED_DE_CITY_SLUGS` from the shared city-route contract and derives all Germany city sitemap entries from it.

There is no second hard-coded Germany publication list.

## Compare publication boundary

Germany City Compare remains available at:

`/compare?type=city&country=DE`

The shared Compare route remains:

`robots: noindex, nofollow`

Compare is a decision-support surface, not a search landing page.

## Evidence and programme policy

Publication does not alter the Phase 2–4 evidence contracts:

- population remains the official GV-ISys municipality value with AGS;
- living-cost guidance remains source-native and indicative;
- transport remains source-native and preserves ticket period/range/eligibility conditions;
- student-work context remains the federal 20-hour / 140-full / 280-half-day framework for eligible third-country students;
- employment sectors remain context, not shortage rankings or employment guarantees.

Publication also does not alter Phase 3 programme coverage:

- city programme rows remain 0;
- `programme_coverage_status = verification_pending`;
- institution or teaching-location presence never proves programme delivery.

## Files changed

Phase 7 changes only publication contracts:

- `src/app/(workspace)/cities/de/[city]/page.tsx`
- `src/app/sitemap.ts`
- `tests/de-city-profile-contract.test.ts`
- `tests/de-city-publication-seo-contract.test.ts`
- `docs/data-foundation/de-city-publication-seo-v1.md`

No database migration is required.

## Completion gate

- [x] exact nine-city allowlist retained
- [x] approved profiles switched to `index, follow`
- [x] unsupported slugs remain noindex/not-found
- [x] canonical `/cities/de/{slug}` metadata present
- [x] sitemap derives Germany city URLs from `PUBLISHED_DE_CITY_SLUGS`
- [x] deferred cities absent from sitemap
- [x] Germany City Compare remains noindex
- [x] programme verification pending remains explicit
- [x] municipality, transport and work-rule semantics preserved
- [x] publication contract tests added
- [x] no production database mutation

Next: Phase 8 cross-phase QA.
