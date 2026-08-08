# City, region and campus data model v1

## Goal

Create one durable location identity layer that can power Countries, Programs, Compare and future city pages without copying city names into feature-specific tables.

This phase is intentionally additive. Existing `public.colleges_au`, `public.courses_au`, country pages and program search continue to work while records are normalized in later phases.

## Existing canonical foundation

CampCareer already has most of the required relational structure:

- `core.geographies` — country, region/state, city and other geographic identities.
- `catalog.institutions` — canonical institution identities.
- `catalog.campuses` — campus identities connected to institutions and optionally to a geography.
- `catalog.programmes` — canonical program identities.
- `catalog.programme_offerings` — programme-to-campus offering rows. Multiple offering rows are the supported way for one program to run at multiple campuses.

The Australia snapshot at model-design time contains 44 catalog institutions, 44 campuses and 9,745 Australian programs/offering rows. All 9,745 Australian offerings already have a campus ID. Forty-two of 44 Australian campuses have a geography ID, but most of those IDs currently resolve to legacy city rows rather than the newer ABS-backed city rows.

## Canonical hierarchy

The product hierarchy is:

`Country -> Region/State -> City/Student market -> Locality/Suburb -> Campus -> Institution -> Programme offering`

A city is the student decision market used for search and comparison. For Australia this should normally represent the wider city market (for example Sydney / Greater Sydney), not a campus suburb such as Camperdown or Kensington.

A campus can therefore carry both:

- `geography_id` — canonical city/student-market ID used by Programs and Compare.
- `locality_geography_id` — optional finer suburb/locality identity.

The existing raw `city` and `region` text columns remain during migration and must not be treated as permanent foreign keys.

## Permanent IDs and URLs

Never join or persist product relationships by display name.

- `core.geographies.id` is the permanent city/region/locality ID.
- `catalog.campuses.id` is the permanent campus ID.
- `core.geographies.slug` is the stable URL component, for example `sydney` in `/cities/au/sydney`.
- `canonical_geography_id` lets a legacy or duplicate geography resolve to a permanent canonical record without deleting the old ID.
- `core.geography_aliases` maps raw crawler labels, abbreviations and legacy strings to canonical geography IDs.

## Source normalization

Crawler and source records should resolve locations in this order:

1. External campus identifier -> `catalog.campus_identifiers`.
2. Existing campus ID.
3. Exact geography alias with country and region context.
4. Reviewed normalization rule.
5. Unresolved queue; never silently invent a location relationship.

The alias layer is for ingestion. UI code should read canonical IDs/names rather than aliases.

## Campus identity

`catalog.campus_identifiers` stores external campus IDs such as official provider/CRICOS/source identifiers. This avoids creating a new campus each time source wording changes.

Campus details added in v1:

- locality
- locality geography ID
- address line
- postal code
- official URL
- source URL and checked timestamp
- JSON metadata for source-specific fields

## Program relationship

Do not add `city_id` directly to `catalog.programmes`.

Program location is derived through:

`catalog.programmes.id -> catalog.programme_offerings.programme_id -> programme_offerings.campus_id -> catalog.campuses.geography_id`

This preserves multi-campus programs and prevents a single program record from being incorrectly pinned to one city.

## City metrics

Living cost, rent, transport, salary and labour-market values are not identity fields and should not be added to `core.geographies`.

They should be stored as dated evidence/metric observations with source URL, data date, confidence and estimated/official status. The city page and Compare should resolve the city ID first, then load the latest publishable observations.

Existing `ingest.cities_au` values may be reused later only after their provenance is reviewed. They are not promoted to canonical facts by this schema migration.

## Australia normalization policy for phase 2

Phase 2 should:

1. Select one canonical ABS-backed city identity for Sydney, Melbourne, Brisbane, Perth, Adelaide and other covered Australian cities.
2. Give canonical city records stable slugs such as `sydney`, `melbourne`, `brisbane`, `perth`, `adelaide`.
3. Mark duplicate legacy city rows with `canonical_geography_id` rather than deleting them.
4. Insert legacy/raw names into `core.geography_aliases`.
5. Repoint Australian campuses from legacy city geography IDs to canonical city IDs.
6. Link the two currently unlinked Australian campuses.
7. Keep `public.colleges_au.city` unchanged until the application reads canonical campus geography IDs.

## Explicit non-goals of phase 1

- No city page UI.
- No Sydney content or city metrics.
- No rewrite of `country-explorer.ts`.
- No changes to Programs filters.
- No changes to Compare.
- No deletion or destructive merge of existing city rows.

Those begin after the canonical Australian city mapping is completed in phase 2.
