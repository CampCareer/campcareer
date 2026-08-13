# Norway Cities — Phase 3 institution/programme linkage v1

Status: `PHASE_3_COMPLETE`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Result

The five Tier A municipalities now have an explicit City publication linkage contract.

Expected read-model state:

- 5 Tier A municipalities
- 6 verified university study-location representatives
- 97 programme rows with exact source-city agreement

City programme counts carried into the contract:

| City | Verified-partial programme linkage |
|---|---:|
| Oslo | 34 |
| Trondheim | 27 |
| Stavanger | 14 |
| Ås | 11 |
| Tromsø | 11 |

## Study-location verification

Phase 3 upgrades the existing primary publication rows only for the six institutions represented in the five-city cohort.

The rows become `verified_city_study_location_representative` records backed by official institution location sources.

They deliberately retain:

`campus_inventory_complete = false`

This prevents a representative City location from being interpreted as a full campus inventory for multi-campus institutions such as NTNU or UiT.

## Programme linkage rule

A programme appears in `city_programme_directory_no_v1` only when all of these conditions agree:

1. canonical offering source system is exactly `NO_STUDYINNORWAY`
2. offering source key resolves to the current Norway staging record
3. offering is verified
4. staging verification tier is A
5. staging collection status is authority-verified
6. canonical programme and staging institution are the same institution
7. offering campus is the verified institution/city representative
8. source programme city equals the SSB municipality display name
9. campus metadata explicitly has `programme_assignment_verified=true`

Institution presence by itself is never enough.

## Public read models

Phase 3 creates three service-role read models using `security_invoker=true`:

- `public.city_institution_directory_no_v1`
- `public.city_programme_directory_no_v1`
- `public.city_directory_no_v1`

They are revoked from `public`, `anon` and `authenticated` and granted to `service_role`, matching the existing server-side City profile access pattern.

## Coverage disclosure

City profiles carry:

`selected_nokut_university_core_full_hei_coverage_pending`

The current canonical institution layer represents the 11 NOKUT university-category institutions, not Norway's complete approved HEI universe.

The programme status is therefore `verified_partial`, not a complete municipality programme catalogue claim.

Institution identity maturity remains:

`provisional_nokut_name_identity`

The existing `NO_NOKUT_UNIVERSITY_NAME` value is an authority-backed name identity, not a durable national institution identifier.

## Phase 3 conclusion

The five approved Norway municipalities have deterministic institution and programme linkage suitable for City metrics and profile rendering. Phase 4 may add evidence-backed City decision metrics without weakening the partial-coverage disclosures.
