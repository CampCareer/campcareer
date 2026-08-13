# Ireland city publication and SEO v1

Status: `PHASE_7_COMPLETE`

Current branch: `agent/ie-cities-publication-v1`

Parent branch: `agent/ie-cities-city-compare-v1`

## Purpose

Publish the approved Ireland Tier A city profiles for search discovery without changing the evidence, geography, institution-linkage or programme-delivery rules established in Phases 1–6.

Phase 7 is a publication layer only. It does not create new geography rows, institution links, programme links or city metrics.

## Published set

The public Ireland city allowlist remains exactly:

- Dublin
- Cork
- Galway
- Limerick

The following deferred expansion candidates are not published by this phase:

- Maynooth
- Waterford
- Athlone
- Sligo
- Dundalk
- Letterkenny

Their future addition should use the same rollout gates rather than being silently added to the current Tier A list.

## Canonical routes

The four indexable city profiles use:

- `/cities/ie/dublin`
- `/cities/ie/cork`
- `/cities/ie/galway`
- `/cities/ie/limerick`

The canonical is generated from the same `PUBLISHED_IE_CITY_SLUGS` allowlist used by routing and sitemap generation.

Unsupported slugs remain outside the allowlist and return the existing not-found path. Their metadata fallback remains `noindex, nofollow`.

## Search metadata

Approved Ireland city profiles use:

- title: `Study in <City>, Ireland`
- description covering student living costs, transport, Stamp 2 work context, verified institutions and current programme-delivery coverage
- canonical: `/cities/ie/<slug>`
- robots: `index, follow`

This replaces the intentional Phase 5–6 pre-publication `noindex, follow` state.

## Sitemap

`src/app/sitemap.ts` imports `PUBLISHED_IE_CITY_SLUGS` from the shared city route module and maps the exact allowlist to:

`/cities/ie/<slug>`

The sitemap does not maintain a second hard-coded Ireland city list. This prevents deferred Tier B candidates from being accidentally indexed without first entering the canonical allowlist.

## Compare publication boundary

The shared Compare surface remains:

`robots: noindex, nofollow`

Ireland city comparison remains available at:

`/compare?type=city&country=IE`

Compare is a decision-support surface and is not made indexable by Phase 7.

## Programme coverage policy

Publication does not alter the Phase 3 programme gap.

All four Ireland city rows currently retain:

- `linked_program_count = 0`
- `programme_coverage_status = verification_pending`

The UI must not present this as evidence that a city has zero programmes.

Institution presence is never used to infer programme delivery. Programme delivery can become visible only after an official programme offering is explicitly verified against a delivery campus.

This programme catalogue gap does not block city profile publication because the city profiles already have verified geography, institution/location linkage and all five required city metrics.

## Geography policy

Publication preserves the Phase 2 geography contract.

Dublin remains the explicit four-local-authority study market covering:

- Dublin City
- Fingal
- Dún Laoghaire-Rathdown
- South Dublin

Campus membership still requires verified official location evidence inside that approved study-market boundary.

Cork, Galway and Limerick retain their approved city/urban scopes. County-wide or neighbouring-area membership is not inferred for publication or sitemap purposes.

## Evidence preserved on published pages

Published profiles continue to show the five verified decision metrics:

1. city population
2. student living-cost monthly reference
3. student transport reference
4. Stamp 2 student work-hours context
5. employment focus sectors

Transport retains its source-native TFI fare period rather than being converted into a synthetic monthly value.

Stamp 2 work context retains the qualified national rule:

- up to 20 hours per week during term time;
- up to 40 hours per week during designated holiday periods;
- immigration, course and registration conditions still apply.

Employment sectors remain economic-development context rather than shortage rankings or employment guarantees.

## Institution coverage

Publication continues to use the initial verified HEA-recognised institution set established in Phase 3.

The city profile layer reads only:

- `city_directory_ie_v1`
- `city_institution_directory_ie_v1`
- verified `report_metric_evidence_city`

It does not directly read legacy campuses, programmes or programme offerings.

This ensures the legacy Ireland catalogue cannot become public city-delivery evidence simply because a profile is now indexable.

## Files changed

Phase 7 changes only publication contracts:

- `src/app/(workspace)/cities/ie/[city]/page.tsx`
- `src/app/sitemap.ts`
- `tests/ie-city-profile-contract.test.ts`
- `tests/ie-city-publication-seo-contract.test.ts`
- `docs/data-foundation/ie-city-publication-seo-v1.md`

No database migration is required.

## Completion gate

Phase 7 is complete when:

- the Ireland public allowlist remains exactly four cities;
- approved city pages are `index, follow`;
- unsupported city slugs remain noindex/not-found;
- each approved city has a country-specific canonical URL;
- sitemap generation derives Ireland city URLs from `PUBLISHED_IE_CITY_SLUGS`;
- deferred cities are absent from the sitemap;
- Compare remains noindex;
- programme verification pending remains explicit;
- institution presence is not converted into programme delivery;
- Dublin's four-local-authority scope remains explicit;
- publication contract tests protect these rules.

Next branch:

`agent/ie-cities-qa-v1`

Phase 8 should run end-to-end QA across database readiness, routing, SEO, Compare, security and full CI before integration or main deployment.
