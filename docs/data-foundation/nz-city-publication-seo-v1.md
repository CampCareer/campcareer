# New Zealand city publication and SEO v1

Status: `PHASE_7_COMPLETE`

Current branch: `agent/nz-cities-publication-v1`

Parent branch: `agent/nz-cities-city-compare-v1`

## Purpose

Publish the approved New Zealand Tier A city profiles for search discovery without changing the evidence, geography, institution-linkage or programme-delivery rules established in Phases 1–6.

Phase 7 is a publication layer only. It does not create new geography rows, institution links, programme links or city metrics.

## Published set

The public New Zealand city allowlist remains exactly:

- Auckland
- Christchurch
- Hamilton
- Wellington
- Dunedin

The following deferred expansion candidates are not published by this phase:

- Palmerston North
- Lincoln
- Tauranga

Their future addition should use the same rollout gates rather than being silently added to the current Tier A list.

## Canonical routes

The five indexable city profiles use:

- `/cities/nz/auckland`
- `/cities/nz/christchurch`
- `/cities/nz/hamilton`
- `/cities/nz/wellington`
- `/cities/nz/dunedin`

The canonical is generated from the same `PUBLISHED_NZ_CITY_SLUGS` allowlist used by routing and sitemap generation.

Unsupported slugs remain outside the allowlist and return the existing not-found path. Their metadata fallback remains `noindex, nofollow`.

## Search metadata

Approved New Zealand city profiles use:

- title: `Study in <City>, New Zealand`
- description covering student living costs, transport, student-visa work context, verified university locations and current programme-delivery coverage
- canonical: `/cities/nz/<slug>`
- robots: `index, follow`

This replaces the intentional Phase 5–6 pre-publication `noindex, follow` state.

## Sitemap

`src/app/sitemap.ts` imports `PUBLISHED_NZ_CITY_SLUGS` from the shared city route module and maps the exact allowlist to:

`/cities/nz/<slug>`

The sitemap does not maintain a second hard-coded New Zealand city list. This prevents deferred candidates from being accidentally indexed without first entering the canonical allowlist.

## Compare publication boundary

The shared Compare surface remains:

`robots: noindex, nofollow`

New Zealand city comparison remains available at:

`/compare?type=city&country=NZ`

Compare is a decision-support surface and is not made indexable by Phase 7.

## Programme coverage policy

Publication does not alter the Phase 3 programme gap.

All five New Zealand city rows currently retain:

- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

The UI must not present this as evidence that a city has zero programmes.

Institution or campus presence is never used to infer programme delivery. Programme delivery can become visible only after an official programme offering is explicitly verified against a delivery campus.

This programme catalogue gap does not block city profile publication because the city profiles already have verified geography, institution/location linkage and all five required city metrics.

## Geography policy

Publication preserves the Phase 2 Stats NZ urban-area study-destination contract for campus membership.

Population evidence retains its own Phase 4 source geography label where the latest official population source uses a different statistical boundary. No silent geography harmonisation is introduced at publication time.

## Evidence preserved on published pages

Published profiles continue to show the five verified decision metrics:

1. city population
2. student living-cost monthly reference
3. student transport reference
4. student-visa work-hours context
5. employment focus sectors

Transport retains its source-native fare product and period rather than being converted into a synthetic monthly amount.

Student work context retains the qualified national reference:

- up to 25 hours per week during term for eligible student visas from 3 November 2025;
- individual eVisa conditions control;
- older visa conditions may differ;
- eligible scheduled-break work depends on the applicable visa conditions.

Employment sectors remain official economic-development context rather than shortage rankings or employment guarantees.

## Institution coverage

Publication continues to use the initial verified canonical NZ provider and official teaching-location set established in Phase 3.

The city profile layer reads only:

- `city_directory_nz_v1`
- `city_institution_directory_nz_v1`
- verified `report_metric_evidence_city`

It does not directly read legacy campuses, programmes or programme offerings.

This ensures institution presence cannot become public programme-delivery evidence simply because a profile is now indexable.

## Files changed

Phase 7 changes only publication contracts:

- `src/app/(workspace)/cities/nz/[city]/page.tsx`
- `src/app/sitemap.ts`
- `tests/nz-city-profile-contract.test.ts`
- `tests/nz-city-publication-seo-contract.test.ts`
- `docs/data-foundation/nz-city-publication-seo-v1.md`

No database migration is required.

## Completion gate

Phase 7 is complete when:

- the New Zealand public allowlist remains exactly five cities;
- approved city pages are `index, follow`;
- unsupported city slugs remain noindex/not-found;
- each approved city has a country-specific canonical URL;
- sitemap generation derives New Zealand city URLs from `PUBLISHED_NZ_CITY_SLUGS`;
- deferred cities are absent from the sitemap;
- Compare remains noindex;
- programme verification pending remains explicit;
- institution presence is not converted into programme delivery;
- source geography and source-native transport semantics remain explicit;
- publication contract tests protect these rules.

Next branch:

`agent/nz-cities-qa-v1`

Phase 8 should run end-to-end QA across database readiness, routing, SEO, Compare, security and full CI before integration or main deployment.
