# Sweden city institution and programme linkage v1

Status: `PHASE_3_COMPLETE`

Checkpoint: `LINKAGE_COMPLETE`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Result

Sweden Phase 3 converts the earlier university fast-path city anchors into a conservative city-delivery read model.

Production result:

- 6 Tier A municipalities
- 10 UKÄ-backed canonical universities
- 10 verified university city-location rows
- 271 verified-partial programme/location rows
- 0 staged-city / published-city mismatches

City distribution:

| City | Institutions | Locations | Verified-partial programmes |
| --- | ---: | ---: | ---: |
| Stockholm | 3 | 3 | 93 |
| Gothenburg | 2 | 2 | 65 |
| Uppsala | 2 | 2 | 42 |
| Lund | 1 | 1 | 29 |
| Linköping | 1 | 1 | 21 |
| Umeå | 1 | 1 | 21 |

## Programme evidence rule

A non-null legacy `programme_offerings.campus_id` is not accepted as city-delivery proof by itself.

The Phase 3 directory requires all of the following:

1. canonical programme and institution are active;
2. institution carries `SE_UKA_UNIVERSITY_NAME` authority identity;
3. offering is `SE_UNIVERSITYADMISSIONS` and `verified`;
4. staging programme is Tier A and has an official programme URL;
5. staging `city` exactly matches the normalized Tier A city name;
6. the same institution has a Phase 3 verified city-location row in that municipality;
7. the location carries `programme_assignment_verified=true` from this explicit source-city reconciliation.

This is stricter than merely reusing the pre-existing campus assignment.

## Coverage disclosure

The current provider layer remains a selected ten-university core rather than the complete Swedish higher-education provider universe.

Institution coverage status:

`selected_university_core_full_hei_coverage_pending`

Programme coverage status for all six Tier A cities:

`verified_partial`

The 271 rows are the current source-verified programme cohort for the selected university core; they are not claimed to be a complete catalogue of every higher-education programme delivered in each municipality.

## Read models

- `public.city_institution_directory_se_v1`
- `public.city_programme_directory_se_v1`
- `public.city_directory_se_v1`

All three use `security_invoker=true`, revoke `public` / `anon` / `authenticated`, and grant SELECT only to `service_role`.

## Production migration

`20260810220002_publish_se_tier_a_city_linkage_v1`

## Remaining provider gate

UKÄ-recognised institutions outside the current ten-provider base remain a provider-expansion task. Phase 3 does not infer that their absence from CampCareer means absence from a city.