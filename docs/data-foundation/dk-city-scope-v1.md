# Denmark city scope v1

Status: `PHASE_1_COMPLETE`

Checkpoint: `TIER_A_SCOPE_LOCKED`

Branch: `agent/dk-cities-v1`

Base Phase 0 commit: `d230f3ac0939d6d910c91da5e44c9e75b2e9224e`

Audit date: 2026-08-10

## Purpose

Lock the first public Denmark city cohort before any geography normalization or city read-model work.

Denmark continues on the single country branch `agent/dk-cities-v1` for all later phases.

Phase 1 changes no production rows and creates no new city geography.

## Authoritative Tier A selection signal

Statistics Denmark's current Danish sustainability indicator 11.a.1 measures the share of education places located outside the five larger higher-education municipalities:

- Copenhagen
- Frederiksberg
- Odense
- Aarhus
- Aalborg

The indicator is sourced from StatBank table `UDDAKT11` (educational activity by location of educational institution), includes 2025 data and was updated 2 February 2026.

Official sources:

https://www.dst.dk/en/Statistik/temaer/SDG/danske-maalepunkter

https://www.statbank.dk/UDDAKT11

This is used as an official higher-education location classification, not as an invented CampCareer ranking.

## Tier A lock

Tier A is locked to exactly five existing CampCareer geographies:

| Priority | City | Slug | Geography UUID | Public boundary to normalize in Phase 2 |
| ---: | --- | --- | --- | --- |
| 1 | Copenhagen | `copenhagen` | `851bc5c8-563c-1063-06e7-a2244ee58c60` | Copenhagen Municipality |
| 2 | Frederiksberg | `frederiksberg` | `b76a5a2e-2cd3-b6af-b4f1-dc37c7704414` | Frederiksberg Municipality |
| 3 | Odense | `odense` | `260f33ab-0b31-8b5f-caea-b39c5b86f334` | Odense Municipality |
| 4 | Aarhus | `aarhus` | `f0c7d88d-9613-df19-3da8-6e9a0ffd8433` | Aarhus Municipality |
| 5 | Aalborg | `aalborg` | `4831d54c-2d55-e3c9-fdbd-d7f30c956e0a` | Aalborg Municipality |

The ordering above is a stable product ordering for the first cohort. It is not a claim that Statistics Denmark ranks these five in this exact order by student count.

Canonical routes to reserve after publication gates are satisfied:

- `/cities/dk/copenhagen`
- `/cities/dk/frederiksberg`
- `/cities/dk/odense`
- `/cities/dk/aarhus`
- `/cities/dk/aalborg`

No route becomes indexable in Phase 1.

## Boundary rule

The public study-destination boundary will be the named municipality for each Tier A city.

This is especially important in the Copenhagen urban area:

- Copenhagen Municipality is not automatically expanded to Frederiksberg Municipality;
- Frederiksberg remains its own Tier A study destination because Statistics Denmark treats it separately in the current higher-education location measure;
- Lyngby-Taarbæk / Lyngby is not silently folded into Copenhagen;
- the wider Capital Region is not a city boundary.

Phase 2 must normalize each of the five existing UUIDs to its Statistics Denmark municipality identity without merging them into a metropolitan geography.

## Current university anchors inside Tier A

The current university-core provider anchors are:

### Copenhagen

- Københavns Universitet
- IT-Universitetet i København

### Frederiksberg

- Copenhagen Business School

### Odense

- Syddansk Universitet

### Aarhus

- Aarhus Universitet

### Aalborg

- Aalborg Universitet

These are initial canonical university anchors only. They do not claim complete institution coverage because university colleges, business academies and other higher-education providers remain outside the current canonical Denmark institution base.

Expected coverage disclosure for later profile/read models:

`university_core_professional_providers_pending`

## Tier B existing geographies

The two remaining existing Denmark city geographies are deferred from Tier A:

| City | Slug | Geography UUID | Reason |
| --- | --- | --- | --- |
| Lyngby | `lyngby` | `3f1b5cce-1168-adf4-1114-3b816501538e` | DTU anchor, but outside the Statistics Denmark five-municipality major-study-place cohort |
| Roskilde | `roskilde` | `d30bed85-dcc4-9d66-94ec-562b649ad053` | RUC anchor, but outside the five-municipality cohort |

They remain active source geographies but receive no Phase 2 Tier A publication metadata in the current rollout.

## Discovered expansion candidates from the programme catalogue

The current Denmark programme staging catalogue contains city labels beyond the seven existing geographies:

- Sønderborg — 14 staged programme rows
- Kolding — 4 staged programme rows
- Esbjerg — 3 staged programme rows

These are `TIER_B_DISCOVERED` candidates only.

Phase 1 does not create geography rows for them. A future expansion phase must first normalize the municipality, verify provider/campus identity and establish explicit programme delivery.

## Programme distribution signal

Current staged programme city labels are:

| Staged city | Programme rows |
| --- | ---: |
| Odense | 37 |
| Copenhagen | 35 |
| Lyngby | 35 |
| Frederiksberg | 20 |
| Sønderborg | 14 |
| Aarhus | 13 |
| Roskilde | 13 |
| Aalborg | 10 |
| Kolding | 4 |
| Esbjerg | 3 |

These counts are catalogue signals only and are not used to override the official Tier A scope.

## Existing programme-to-campus mismatch audit

The current canonical programme offering layer contains 184 verified offerings with non-null `campus_id`, but a direct comparison between the staged programme city and assigned canonical campus city found 23 mismatches:

- Sønderborg staged programmes assigned to Odense campus: 14
- Kolding staged programmes assigned to Odense campus: 4
- Esbjerg staged programmes assigned to Odense campus: 3
- Copenhagen staged programmes assigned to Aalborg campus: 2

This confirms the Phase 0 decision that existing `campus_id` values are not sufficient city-delivery evidence.

Phase 3 must not expose city programmes from these assignments unless programme delivery is explicitly reverified against an official programme/location source and the relevant campus/location is normalized.

## Tier A institution/programme readiness

### Institution readiness

All five Tier A municipalities have at least one current canonical university anchor in production.

Status:

`university_anchor_present / professional_provider_coverage_pending`

### Programme readiness

All five Tier A cities have staged programme rows, but city-level delivery is not yet publication-ready because existing offering-to-campus assignments have not passed the explicit Phase 3 delivery-evidence contract.

Status:

`catalogue_present / delivery_reverification_required`

Programme count is therefore not a Phase 1 publication claim.

## Scope exclusions

Phase 1 does not:

- create Sønderborg, Kolding or Esbjerg geographies;
- promote Lyngby or Roskilde to Tier A;
- merge Copenhagen, Frederiksberg and Lyngby into Greater Copenhagen;
- treat the eight-university provider base as exhaustive;
- infer programme delivery from the current canonical campus IDs;
- add city routes to the sitemap;
- publish SEO metadata.

## Phase 1 result

Exact Tier A cohort:

1. `copenhagen`
2. `frederiksberg`
3. `odense`
4. `aarhus`
5. `aalborg`

Existing Tier B:

- `lyngby`
- `roskilde`

Discovered Tier B candidates:

- `sonderborg`
- `kolding`
- `esbjerg`

Checkpoint:

`TIER_A_SCOPE_LOCKED`

Next work on the same branch: Phase 2 geography and slug normalization against Statistics Denmark municipality identities.