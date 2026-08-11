# Denmark city profile v1

Status: `PHASE_5_COMPLETE`

Checkpoint: `PROFILE_COMPLETE`

Branch: `agent/dk-cities-v1`

Audit date: 2026-08-10

## Purpose

Phase 5 implements the first Denmark city profile surface from the verified Phase 2–4 read models and evidence.

No production database mutation is introduced by Phase 5.

## Route scope

The exact allowed routes are:

- `/cities/dk/copenhagen`
- `/cities/dk/frederiksberg`
- `/cities/dk/odense`
- `/cities/dk/aarhus`
- `/cities/dk/aalborg`

`PUBLISHED_DK_CITY_SLUGS` is the single route allowlist.

Deferred cities remain outside the route contract:

- Lyngby
- Roskilde
- Sønderborg
- Kolding
- Esbjerg

Unsupported slugs use the not-found path and `noindex, nofollow` metadata.

Approved Phase 5 routes use canonical `/cities/dk/{slug}` metadata but remain `noindex, follow` until the Phase 7 publication gate.

## Server data boundary

`src/lib/cities/dk-city-profile.server.ts` reads only:

1. `city_directory_dk_v1`
2. `city_institution_directory_dk_v1`
3. `city_programme_directory_dk_v1`
4. verified `report_metric_evidence_city`

It does not read raw `campuses`, `programmes` or `programme_offerings` for profile rendering.

This matters because the historical DK programme canonicalization had fallback campus assignments. The Phase 3 programme read model has already filtered delivery to exact Study in Denmark source-city + verified official-location matches.

## Profile content

Each city profile presents:

- Statistics Denmark municipality identity and scope;
- verified university institution/location counts;
- verified-partial programme count;
- municipality population;
- official national student-budget baseline;
- source-native public-transport reference;
- national student residence-permit work context;
- indicative municipal economic sectors;
- official metric sources.

## Programme presentation

Unlike countries where city programme delivery is still entirely pending, Denmark has useful verified partial programme coverage.

Current Phase 3 counts are:

- Copenhagen — 35
- Frederiksberg — 20
- Odense — 37
- Aarhus — 13
- Aalborg — 10

The profile shows the total verified-partial count and up to eight alphabetically ordered programme examples from `city_programme_directory_dk_v1`, each linked to its official programme source.

The UI explicitly states that this is not an exhaustive municipality catalogue.

Professional higher-education providers remain incomplete in the canonical institution foundation, so profiles continue to disclose a verified university core with professional-provider expansion pending.

## Metric methodology disclosures

### Population

Population uses the same Statistics Denmark municipality boundary family as the profile geography contract.

### Living cost

The current DKK 8,450–13,700 monthly range is a national Study in Denmark student-budget baseline and is displayed as not city-specific.

### Transport

The profile preserves each transport source's native fare product/zone period. The references are general adult fares and are not represented as universal student concessions.

### Work rights

The relevant permit context is shown as `90 h / month` during September–May, with full-time work in June, July and August. The UI deliberately does not convert the official monthly cap into a weekly number.

### Employment sectors

Municipality strategy sectors are presented as economic context, not shortage rankings or job guarantees.

## Phase boundary

Phase 5 deliberately does not add City Compare. That is Phase 6.

Phase 5 deliberately does not enable search indexing. That is Phase 7 after Compare readiness has been checked.

## Files

Phase 5 adds or changes:

- `src/lib/cities/city-routes.ts`
- `src/lib/cities/dk-city-profile.server.ts`
- `src/app/(workspace)/cities/denmark-city-dashboard.tsx`
- `src/app/(workspace)/cities/dk/[city]/page.tsx`
- `tests/dk-city-profile-contract.test.ts`
- `docs/data-foundation/dk-city-profile-v1.md`

## Validation posture

Phase-specific contract tests are committed for Phases 2–5. Full repository CI and production build remain intentionally deferred to Phase 8 QA under the country rollout process.

Result: Denmark Cities Phase 5 is complete on the single country branch `agent/dk-cities-v1`.