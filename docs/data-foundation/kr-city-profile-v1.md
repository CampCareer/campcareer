# South Korea Cities — Phase 5 functional profile v1

Status: `PHASE_5_COMPLETE`

Checkpoint: `PROFILE_COMPLETE`

Country: `KR` — South Korea

Audit date: 2026-08-11

## Functional routes

Phase 5 enables exactly six supported profile routes:

- `/cities/kr/seoul`
- `/cities/kr/busan`
- `/cities/kr/daejeon`
- `/cities/kr/suwon`
- `/cities/kr/yongin`
- `/cities/kr/pohang`

The route source of truth is `SUPPORTED_KR_CITY_SLUGS`.

Phase 5 deliberately does not create `PUBLISHED_KR_CITY_SLUGS`.

## Server read contract

The profile server reads only the four private Phase 3–4 service-role views:

- `public.city_directory_kr_v1`
- `public.city_institution_directory_kr_v1`
- `public.city_programme_directory_kr_v1`
- `public.city_metric_directory_kr_v1`

It does not infer city claims directly from raw campus or programme-offering rows.

## Profile evidence

Each profile exposes:

- MOIS administrative-city identity/code
- 2026-06-30 resident-registration population
- national Study in Korea living-cost planning range with non-city/ranking disclosure
- source-native local transport reference
- conditional national student-work context
- official local strategic-sector context
- verified teaching-location representatives
- up to eight strict city-linked programme examples
- source links and evidence dates

## Programme semantics

Current strict programme counts:

- Seoul: `110`
- Busan: `23`
- Daejeon: `14`
- Suwon: `8`
- Yongin: `17`
- Pohang: `10`

All six are `verified_partial` because they represent the current selected Study in Korea programme/provider foundation rather than complete citywide catalogues.

The Phase 0 multi-campus error is not reproduced:

- SKKU Suwon programmes display the Natural Sciences Campus relationship;
- Kyung Hee Yongin programmes display the Global Campus relationship;
- those 25 rows are not inherited into Seoul.

## Methodology disclosure

The UI explicitly states:

- population uses the Phase 2 administrative boundary;
- living cost is a national planning baseline and is not ranking-safe;
- transport is source-native and may use different local modes/effective dates;
- student work is a conditional national rule, not an automatic entitlement or city differentiator;
- employment sectors are official strategy context, not shortage rankings or job guarantees;
- teaching locations are verified representatives, not complete campus inventories;
- institution coverage is selected and not the complete Korean HEI universe.

## SEO and publication boundary

Phase 5 remains pre-publication.

Supported routes use:

`robots: { index: false, follow: true }`

Unsupported slugs use:

`robots: { index: false, follow: false }`

and are rejected with `notFound()`.

Phase 5 does not:

- add Korea city routes to the sitemap;
- create a published Korea city constant;
- enable Korea City Compare;
- merge to main;
- require Vercel production deployment.

## Phase 5 conclusion

South Korea Cities has reached `PROFILE_COMPLETE`.

The next phase is Phase 6 City Compare. Publication/indexing remains a later explicit phase.
