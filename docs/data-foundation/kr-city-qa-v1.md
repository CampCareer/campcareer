# South Korea Cities — Phase 8 production QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Country: `KR` — South Korea

Audit date: 2026-08-12

## Production verification

Checked against Supabase project `babylusxcknjerxtepoc` after Phases 2–7.

Aggregate result:

- Tier A cities: `6`
- city directory rows: `6`
- verified institution/location rows: `14`
- distinct institutions represented: `12`
- strict city programme rows: `182`
- verified metric rows: `30`
- Compare-ready cities: `6`
- readiness failures: `0`
- programme source-city mismatches: `0`
- forbidden locality/non-Tier-A leakage: `0`
- verified-partial programme cities: `6`
- verification-pending programme cities: `0`

## Per-city result

| City | Institutions | Teaching locations | Programmes | Metrics | Programme status |
| --- | ---: | ---: | ---: | ---: | --- |
| Seoul | 7 | 7 | 110 | 5 | verified_partial |
| Busan | 2 | 2 | 23 | 5 | verified_partial |
| Daejeon | 2 | 2 | 14 | 5 | verified_partial |
| Suwon | 1 | 1 | 8 | 5 | verified_partial |
| Yongin | 1 | 1 | 17 | 5 | verified_partial |
| Pohang | 1 | 1 | 10 | 5 | verified_partial |

Counts are verified-partial evidence from the current provider foundation, not complete city-wide higher-education catalogues.

## Multi-campus leakage regression

The Phase 0 mismatch remains repaired:

- SKKU Suwon-source programmes do not leak into Seoul
- Kyung Hee Yongin-source programmes do not leak into Seoul
- Cheonan and Goyang do not leak into the Tier A programme directory

Production source-city mismatch count is `0`.

## Metric methodology guards

All six cities satisfy the required metric contract:

- living-cost rows with `city_specific=false` and `ranking_safe=false`: `6`
- national student-work context rows: `6`
- MOIS resident-registration administrative population rows: `6`
- employment-sector rows with non-shortage/non-job-guarantee guards: `6`

Population uses June 2026 resident-registration administrative boundaries. Living cost remains national planning context and cannot support a cheapest-city ranking.

## Read-model security

The four South Korea city read models are:

- `public.city_directory_kr_v1`
- `public.city_institution_directory_kr_v1`
- `public.city_programme_directory_kr_v1`
- `public.city_metric_directory_kr_v1`

All four were verified with:

- `security_invoker=true`
- `service_role`: SELECT allowed
- `anon`: SELECT denied
- `authenticated`: SELECT denied

## Supabase security advisor

A project-wide security advisor check still reports existing `INFO` notices for RLS-enabled tables with no policies and a global `WARN` that Auth leaked-password protection is disabled.

These notices are project-wide and are not introduced by the South Korea city read models. The KR city views themselves remain explicitly service-role-only and `security_invoker=true`.

Global Auth leaked-password protection remains a separate outstanding security item.

## Application QA

The application contract requires:

- exact published cohort: Seoul, Busan, Daejeon, Suwon, Yongin, Pohang
- KR City Compare enabled on the shared `/compare` route
- parameterized Compare remains noindex/nofollow
- six published city profiles are index/follow
- sitemap derives directly from `PUBLISHED_KR_CITY_SLUGS`
- no Compare URL in sitemap
- no Cheonan/Goyang or provider-expansion candidate publication

## Phase 8 conclusion

South Korea Cities has reached `PUBLISH_READY` at the application/data-contract level.

Phase 9 must reconcile the current branch against the latest `main`, preserve all existing shared-country behavior, and pass the complete CI suite before the branch can be considered a current-main candidate.
