# United Kingdom city linkage v1

Status: `PHASE_3_COMPLETE`

Branch: `agent/uk-cities-linkage-v1`

Parent: `agent/uk-cities-foundation-v1`

Production migration: `20260808210529_publish_uk_tier_a_city_linkage_v1`

## Purpose

Publish a conservative institution/programme linkage model for the ten approved UK Tier A study destinations.

Phase 3 does not treat a legacy institution-city label as sufficient evidence. Institution linkage requires official location evidence plus canonical institution identity. Programme linkage requires an explicitly verified programme offering assigned to that verified campus/location.

## Tier A linkage result

| City | Verified location rows | Linked institutions | Verified city programmes | Programme status |
| --- | ---: | ---: | ---: | --- |
| Belfast | 2 | 2 | 0 | verification pending |
| Birmingham | 2 | 2 | 0 | verification pending |
| Bristol | 1 | 1 | 0 | verification pending |
| Cambridge | 1 | 1 | 0 | verification pending |
| Cardiff | 2 | 1 | 0 | verification pending |
| Edinburgh | 2 | 2 | 0 | verification pending |
| Glasgow | 2 | 2 | 0 | verification pending |
| London | 27 | 9 | 0 | verification pending |
| Manchester | 1 | 1 | 0 | verification pending |
| Oxford | 1 | 1 | 0 | verification pending |

Totals:

- 10 Tier A cities
- 41 verified official location rows
- 22 city-institution links when summed across the ten city directories
- 0 verified city-programme links

A zero programme count is not a claim that these cities offer no programmes. It means no existing canonical UK programme offering currently satisfies the explicit city-delivery verification contract.

## Institution publication gate

`public.city_institution_directory_uk_v1` accepts a location only when:

- the institution is active and country code is `UK`;
- the institution has a canonical slug;
- an official institution website is present;
- an 8-digit `UK_UKPRN` is present;
- the campus/location is active;
- `location_quality = verified_official`;
- an official location `source_url` is present;
- the location satisfies the approved Tier A city scope.

Legacy `listed campus` rows remain provenance/offering anchors and are not accepted as Phase 3 publication linkage.

## Scope decisions and boundary exceptions

### London

The Phase 2 scope is Greater London rather than the City of London municipality. Phase 3 therefore accepts verified official locations whose region is `London`.

This correctly allows, for example, Brunel University of London's verified Uxbridge location to participate in the London study-destination directory.

The same rule remains location-specific rather than institution-wide. Royal Holloway's verified Central London location is included, while its Egham location is outside London. Imperial's London locations are included while Silwood Park in Ascot is outside the London linkage.

### Manchester

Manchester remains the City of Manchester rather than Greater Manchester.

University of Salford's legacy row had previously been attached to Manchester, but its institution-official campus locations are in Salford. The Phase 3 migration explicitly guards against publishing University of Salford as a Manchester institution link.

## Programme linkage policy

The existing UK canonical catalogue contains 185 legacy programmes/offerings, but those records are not sufficient for city publication.

`public.city_programme_directory_uk_v1` requires all of the following:

1. `catalog.programme_offerings.campus_id` points to a Phase 3 verified official location;
2. the offering has `verification_status = verified`;
3. the offering has an official `source_url`;
4. the campus has `programme_assignment_verified = true`;
5. the programme is active;
6. the offering is not closed or suspended.

Current result: zero rows.

Do not infer city programme delivery from institution presence, institution headquarters, a legacy city label, or an institution having programmes elsewhere in the UK.

The 185 existing UK programme records remain discovery/staging material until provider course pages or another authoritative source verifies programme delivery location.

## Read models

Phase 3 publishes three service-role-only tables:

- `public.city_directory_uk_v1`
- `public.city_institution_directory_uk_v1`
- `public.city_programme_directory_uk_v1`

All three have RLS enabled. `public`, `anon` and `authenticated` access is revoked; `service_role` receives read access.

## Repository dependency / integration gate

This city migration intentionally reuses the UK institution identity and official campus/location foundation already present in production.

A clean environment must apply/integrate the UK institution foundation before this city linkage migration. The required repository work currently lives in the UK institution stack / `agent/integrate-uk-ca-institutions`, including UKPRN identity, official institution websites and official campus/location normalization.

Do not merge the city stack into `main` as a standalone clean-deployment chain unless that institution dependency is also present in the target branch or has already been applied to the target database.

Production already contains the required institution foundation, so the Phase 3 migration has been applied and verified there.

## Phase 3 completion gate

Phase 3 is complete because:

- all ten Tier A cities have at least one verified official institution location;
- every published institution link has UKPRN, canonical slug, official website and official location evidence;
- London and Manchester boundary contracts are enforced;
- legacy location anchors are excluded from publication linkage;
- programme delivery is not inferred;
- programme coverage is explicitly marked `verification_pending` while verified delivery rows remain zero;
- contract guards and a repository regression test preserve these rules.

Next branch:

`agent/uk-cities-metrics-v1`

Phase 4 should populate the five standard city metrics for all ten Tier A destinations.
