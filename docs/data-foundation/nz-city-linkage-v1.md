# New Zealand city linkage v1

Status: `PHASE_3_COMPLETE`

Branch: `agent/nz-cities-linkage-v1`

Base Phase 2: `f87a27f5dabd130872801adb49ee9b8b71ba8c31`

Production migration: `20260809121651_publish_nz_tier_a_city_linkage_v1`

Audit date: 2026-08-09

## Purpose

Build the source-backed New Zealand city relationship chain required by the country rollout standard:

`city -> campus -> institution -> programme offering -> programme`

This phase verifies campus/institution presence for the five Tier A destinations. It does not invent a New Zealand programme catalogue.

## Tier A cities

Exactly five cities participate:

- `auckland`
- `christchurch`
- `hamilton`
- `wellington`
- `dunedin`

Tier B / expansion destinations such as Palmerston North, Lincoln and Tauranga are not added to the city read models.

## Identity authority

Every linked institution resolves through the existing canonical institution layer and an official:

`NZ_MOE_PROVIDER_NUMBER`

The provider number is the NZQA / Ministry of Education provider identifier already preserved in `catalog.institution_identifiers`.

Phase 3 does not create alternative identities or fuzzy-match providers by name.

## Campus evidence rule

The existing eight NZ registry location rows are retained but are not used as complete campus evidence.

Phase 3 inserts a separate conservative verified set with:

- `record_scope = verified_teaching_campus`
- `location_quality = verified_official`
- `source_tier = institution_official`
- `normalization_batch = nz_city_linkage_v1`
- `programme_assignment_verified = false`
- `coordinate_precision = not_asserted`

No precise coordinates are invented.

The set is intentionally an initial verified teaching-campus set, not an assertion that every university location in each city has been enumerated.

## Verified campus set

### Auckland — 3

1. University of Auckland — City Campus
   - official campus page confirms the central Auckland teaching campus
   - source: https://www.auckland.ac.nz/en/on-campus/our-campuses/campus-locations0/city-campus.html

2. Auckland University of Technology — AUT City Campus
   - official AUT page identifies the campus at 55 Wellesley Street East and states it is home to most AUT academic programmes
   - source: https://www.aut.ac.nz/about/campuses-and-locations/city-campus

3. Massey University — Auckland Campus
   - official Massey source identifies the Albany/North Shore campus and its study facilities
   - source: https://www.massey.ac.nz/student-life/campus-guides-maps/auckland-campus-maps-transport-and-parking/

Excluded from this initial set:

- University of Auckland Tai Tokerau / Whangārei because it is outside the approved Auckland study destination
- University of Otago Auckland Centre because the current official campus material is not equivalent to the Christchurch/Wellington teaching-campus evidence used here
- additional Auckland campuses may be added later after the same explicit teaching-location review

### Christchurch — 2

1. University of Canterbury — Ilam Campus
   - UC states that it is based on its main Ilam campus in Christchurch
   - source: https://www.canterbury.ac.nz/about-uc/our-campus-and-environment/our-campuses

2. University of Otago — Christchurch Campus
   - official Otago material describes Christchurch as a satellite teaching campus with medical, physiotherapy and postgraduate Health Sciences students
   - source: https://www.otago.ac.nz/christchurch/about

Lincoln University is not folded into Christchurch.

### Hamilton — 1

1. University of Waikato — Hamilton Campus
   - the official university page identifies Hamilton as its main campus and student learning environment
   - source: https://www.waikato.ac.nz/about/campus/hamilton/

The separate Tauranga campus is not folded into Hamilton.

### Wellington — 3

1. Victoria University of Wellington — Kelburn Campus
   - the university identifies Kelburn as its main campus in Wellington
   - source: https://www.wgtn.ac.nz/about/campuses-facilities/campuses/kelburn

2. Massey University — Wellington Pukeahu Campus
   - Massey identifies Wellington as one of its New Zealand study campuses with qualifications offered there
   - source: https://www.massey.ac.nz/study/study-on-campus/study-on-the-wellington-campus/

3. University of Otago — Wellington Campus
   - Otago identifies Wellington as a medical and Health Sciences teaching campus
   - source: https://www.otago.ac.nz/wellington/about

The initial set uses one representative verified campus record per institution/city relationship; Victoria's additional Pipitea and Te Aro campuses can be added later without changing the city contract.

### Dunedin — 1

1. University of Otago — Dunedin Main Campus
   - Otago identifies Dunedin as its main campus containing its four academic divisions
   - source: https://www.otago.ac.nz/about/campuses

Other Otago locations are not inferred into Dunedin.

## Read models

Phase 3 creates three server-only read views.

### `public.city_institution_directory_nz_v1`

One row per verified teaching campus linked to a Tier A city.

It exposes:

- canonical city ID
- canonical campus ID
- canonical institution ID/name/slug
- NZ provider number and provider evidence URL
- institution website
- campus name/city/region
- address where explicitly supported
- official campus source URL
- location quality and record scope

### `public.city_programme_directory_nz_v1`

This view can only emit a programme when all of the following are true:

- the programme is canonical and active;
- the offering references the verified campus ID;
- the offering has `verification_status = verified`;
- the offering has a source URL;
- the campus has `programme_assignment_verified = true`;
- the offering is not closed/suspended.

Current result: `0` rows.

### `public.city_directory_nz_v1`

Aggregates city readiness counts and exposes:

- linked campus count
- linked institution count
- linked programme count
- institution coverage status
- programme coverage status

Current institution coverage status is:

`initial_verified_set`

Current programme coverage status is:

`verification_pending`

## Production result

Post-migration verification returned:

| City | Verified campuses | Verified institutions | Verified programmes |
| --- | ---: | ---: | ---: |
| Auckland | 3 | 3 | 0 |
| Christchurch | 2 | 2 | 0 |
| Hamilton | 1 | 1 | 0 |
| Wellington | 3 | 3 | 0 |
| Dunedin | 1 | 1 | 0 |

Overall:

- city rows: `5`
- city-campus rows: `10`
- distinct canonical institutions represented: `7`
- programme directory rows: `0`

## Programme decision

New Zealand currently has no CampCareer canonical programme catalogue suitable for city delivery publication.

Phase 3 therefore does not create programmes from:

- university marketing catalogues alone;
- NZQA provider identity;
- institution presence in a city;
- registry campus/location records.

Programme publication requires an explicit canonical programme plus verified offering-to-campus relationship.

The correct current state is therefore:

`programme_coverage_status = verification_pending`

This catalogue gap does not block Phase 4 metrics or later city profiles, provided the gap is disclosed honestly.

## Security

All three NZ city directory views use:

`security_invoker = true`

They revoke access from:

- `public`
- `anon`
- `authenticated`

and explicitly grant `SELECT` only to:

- `service_role`

This follows the server-side read-model pattern and does not rely on implicit public-schema Data API exposure.

## Acceptance criteria

Phase 3 is complete because:

- [x] exactly five Tier A city directory rows exist;
- [x] every Tier A city has at least one verified official teaching campus;
- [x] every campus resolves to a canonical NZ institution;
- [x] every institution relationship carries its NZ provider number;
- [x] all campus relationships use institution-owned official source pages;
- [x] 10 conservative verified campus relationships are queryable;
- [x] programme delivery is not inferred;
- [x] programme directory remains empty until explicit campus-level offering evidence exists;
- [x] all city directory read models are service-role-only security-invoker views;
- [x] production migration guards passed.

## Handoff

Proceed to Phase 4 — Five Core Metrics.

The programme catalogue gap is non-blocking for Phase 4. It must remain visible as `verification_pending` through profile, Compare and publication phases unless later programme verification changes it.
