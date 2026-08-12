# Ireland city linkage v1

Status: `PHASE_3_COMPLETE_WITH_PROGRAMME_GAP`

Branch: `agent/ie-cities-linkage-v1`

Parent branch: `agent/ie-cities-foundation-v1`

## Scope

Phase 3 links the four approved Ireland Tier A destinations to a first verified higher-education institution set using current Higher Education Authority recognition plus official institution campus/location evidence.

Tier A remains exactly:

- Dublin
- Cork
- Galway
- Limerick

This phase deliberately does not promote legacy programme delivery.

## Institution identity contract

Ireland does not expose one universal HEA-issued provider number across every autonomous higher-education institution. The current Phase 3 set therefore uses:

- canonical CampCareer institution UUID + slug;
- current HEA recognition evidence from `https://hea.ie/higher-education-institutions/`;
- official institution website;
- official institution campus/location source.

`IE_HEA_RECOGNISED_ENTITY` is a CampCareer source-backed authority key. Its value is the canonical institution slug; it must not be presented to users as an Irish government provider number.

The legacy systems `IE_PROVIDER_ID` and `IE_LEGACY_COLLEGE_NAME` remain discovery provenance only.

## Initial verified institution set

Phase 3 publishes nine city-campus rows.

### Dublin

1. Trinity College Dublin — College Green
2. University College Dublin — Belfield
3. Dublin City University — Glasnevin
4. Technological University Dublin — Grangegorman
5. RCSI University of Medicine and Health Sciences — St Stephen's Green

### Cork

6. University College Cork — College Road

### Galway

7. University of Galway — Galway City

### Limerick

8. University of Limerick — Limerick campus
9. Mary Immaculate College — Limerick campus

This is an `initial_verified_set`, not a claim that every publishable higher-education provider in each city has already been captured.

MTU Cork, ATU Galway and TUS Limerick are intentionally not published through their legacy campus pseudo-institution records in this phase. They should be added after canonical technological-university identity consolidation rather than preserving duplicate predecessor/campus entities in the public city graph.

## Official location rule

Every published city-institution row requires:

- active IE canonical institution;
- non-null canonical slug;
- official institution website;
- current HEA recognition evidence;
- active campus/location row;
- `metadata.location_quality = verified_official`;
- non-null official `source_url`;
- explicit `geography_id` equal to the Tier A city geography.

Dublin's broader four-local-authority product scope does not permit name-based inference. Every included campus still has its own official Dublin location evidence.

## Read models

Migration `20260809093421_publish_ie_tier_a_city_linkage_v1` creates and populates service-role-only read models:

- `public.city_directory_ie_v1`
- `public.city_institution_directory_ie_v1`
- `public.city_programme_directory_ie_v1`

All three have RLS enabled, revoke public/anon/authenticated access, and grant SELECT only to `service_role`.

## Programme gap

At Phase 3 audit time the Ireland catalogue contains 2,876 active offerings, but:

- verified offerings: `0`
- offerings with a legacy campus id: `2,876`
- publishable candidates satisfying verified + source + campus: `0`
- current source system: `legacy_backfill`

Therefore `public.city_programme_directory_ie_v1` is intentionally empty.

A programme can enter the city directory only when:

1. the programme is active;
2. the offering has `verification_status = verified`;
3. the offering has an official source URL;
4. the offering is assigned to the verified campus;
5. that campus has `metadata.programme_assignment_verified = true`;
6. the offering is not closed or suspended.

Institution presence must never be used to infer programme delivery.

`city_directory_ie_v1.programme_coverage_status` remains `verification_pending` for all four cities.

## Production result

The migration guard requires:

- exactly 4 Tier A city rows;
- at least one verified official institution location in every city;
- exactly 9 initial verified city-campus rows;
- valid institution website and authority/location evidence on every published row;
- zero published programme rows until explicit programme-to-campus verification exists.

## Phase 3 decision

`PHASE_3_COMPLETE_WITH_PROGRAMME_GAP`

The programme gap does not block Phase 4. The agreed rollout principle permits the four cities to proceed to five verified decision metrics while the UI later discloses `verification_pending` rather than showing legacy programme counts as verified coverage.

Next branch:

`agent/ie-cities-metrics-v1`
