# Denmark city institution and programme linkage v1

Status: `PHASE_3_COMPLETE`

Checkpoint: `LINKAGE_COMPLETE`

Branch: `agent/dk-cities-v1`

Production migration: `20260810201203_publish_dk_tier_a_city_linkage_v1`

Audit date: 2026-08-10

## Purpose

Phase 3 establishes the source-backed Denmark city chain:

`city -> verified university location -> canonical institution -> verified programme offering -> programme`

The existing Denmark programme catalogue is useful but its original canonicalization used a fallback-to-first-campus rule when a programme city did not match an existing campus. Phase 3 therefore does not trust a pre-existing `campus_id` by itself. City publication requires the programme-level Study in Denmark source city to match an official Phase 3 city anchor.

## Verified Tier A location anchors

Seven official university locations are used across the five Tier A municipalities:

- Aalborg — Aalborg University, Campus Aalborg
- Aarhus — Aarhus University main Aarhus location
- Copenhagen — University of Copenhagen central location
- Copenhagen — IT University of Copenhagen
- Copenhagen — Aalborg University Campus Copenhagen
- Frederiksberg — Copenhagen Business School, Solbjerg Plads
- Odense — University of Southern Denmark, SDU Odense

Each Phase 3 location carries:

- `normalization_batch = dk_city_linkage_v1`
- `record_scope = verified_city_study_location`
- `location_quality = verified_official`
- `programme_assignment_verified = true`
- `campus_inventory_complete = false`

The last field is important: these are sufficient verified anchors for the first city publication cohort, not a claim that every teaching location for every Danish higher-education provider has been catalogued.

## Institution identity

Canonical institution linkage uses the current Denmark foundation identifier:

`DK_UFM_UNIVERSITY_NAME`

The identifier source is the Danish ministry institution list. Professional higher-education providers are not yet complete in the CampCareer canonical catalogue, so city coverage remains explicitly `university_core_professional_providers_pending`.

## Programme linkage rule

A programme enters `city_programme_directory_dk_v1` only when all of the following hold:

- canonical offering source system is `DK_STUDYINDENMARK`;
- offering verification state is `verified`;
- staged verification tier is A or B;
- official programme URL is present;
- staged programme city exactly matches the canonical Tier A city;
- campus belongs to the programme institution;
- campus belongs to that Tier A geography;
- campus is a Phase 3 `dk_city_linkage_v1` anchor;
- `programme_assignment_verified = true`.

Institution presence alone is never programme-delivery evidence.

## Production result

The Tier A city read model now returns:

| City | Verified locations | Canonical institutions | Verified partial programmes |
| --- | ---: | ---: | ---: |
| Copenhagen | 3 | 3 | 35 |
| Frederiksberg | 1 | 1 | 20 |
| Odense | 1 | 1 | 37 |
| Aarhus | 1 | 1 | 13 |
| Aalborg | 1 | 1 | 10 |
| **Total** | **7** | — | **115** |

Programme coverage is `verified_partial`, not exhaustive. The underlying catalogue also contains programmes in Lyngby, Roskilde, Sønderborg, Kolding and Esbjerg, but those cities are outside the current Tier A publication scope.

## Legacy mismatch containment

Before Phase 3, 23 DK offerings had a staged source city different from their assigned campus city because of the historical fallback rule. Phase 3 does not need to rewrite all out-of-scope raw data to protect publication. The public DK city programme view requires exact source-city equality and a Phase 3 verified anchor, so those legacy mismatches cannot leak into Tier A city programme counts.

## Read models and security

Phase 3 publishes:

- `public.city_institution_directory_dk_v1`
- `public.city_programme_directory_dk_v1`
- `public.city_directory_dk_v1`

All three are `security_invoker=true`, revoke direct `public`, `anon` and `authenticated` access, and grant SELECT only to `service_role` for server-side loading.

Repository contract: `tests/dk-city-linkage-contract.test.ts`.

Result: Denmark Cities has reached `LINKAGE_COMPLETE`.