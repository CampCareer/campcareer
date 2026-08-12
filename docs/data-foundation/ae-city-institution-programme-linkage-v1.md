# United Arab Emirates Cities — Phase 3 institution and programme linkage v1

Status: `PHASE_3_COMPLETE`

Checkpoint: `STRICT_CITY_LINKAGE_LOCKED`

Country: `AE` — United Arab Emirates

Checked: 2026-08-12

Branch: `agent/ae-cities-v1`

## Verified linkage contract

A City programme row requires:

`Tier A City -> verified provider teaching location -> source-specific provider identity -> active canonical programme -> verified programme accreditation -> exact staging City match`

CAA `Emirate`, institution presence, staging City text or a generic publication-location row is not enough on its own.

## Provider identity

The selected four-City foundation contains 12 programme providers. Phase 3 reconciles missing source-specific provider identifiers so all 12 have persisted identity evidence.

Supported identity families remain distinct:

- `AE_CAA_ACTIVE_HEI_NAME`
- `AE_CAA_PROGRAM_PROVIDER_NAME`
- `AE_MOE_TVET_PROGRAM_PROVIDER_NAME`
- `AE_GCAA_TRAINING_PROVIDER_NAME`

TVET and aviation-training providers are not relabelled as CAA universities.

## Study-location result

Verified physical study-location representatives: 11.

Programme assignment is enabled for 10 of those providers.

Emirates College for Advanced Education has a verified Abu Dhabi physical location, but its two current staging programmes remain unassigned because the exact programme-to-Abu-Dhabi delivery contract is not sufficiently verified for this release.

Fakeeh College for Medical Sciences – Dubai remains outside the verified City-location directory pending a sufficiently explicit current Dubai teaching-location source.

Campus inventories remain intentionally incomplete.

## Programme result

Strict City-linked programmes: 98.

| City | Verified programme links |
|---|---:|
| Abu Dhabi | 39 |
| Sharjah | 26 |
| Al Ain | 18 |
| Dubai | 15 |

The original top-four source cohort contains 102 programmes. Four rows are deliberately held out rather than inferred:

- ECAE: 2
- Fakeeh College for Medical Sciences – Dubai: 2

## Read models

Phase 3 creates service-role-only security-invoker views:

- `public.city_institution_directory_ae_v1`
- `public.city_programme_directory_ae_v1`
- `public.city_directory_ae_v1`

`public`, `anon` and `authenticated` receive no direct SELECT access.

## Offering provenance

Canonical UAE offerings use:

- `source_system='AE_PROGRAM_STAGING'`
- `source_record_key=source_program_key`

International-admission verification remains separate from accreditation and City delivery. An accredited City-linked programme is not automatically represented as currently open to international applications.

## Coverage statement

Programme coverage is `verified_partial`.

The 98 links describe the current CampCareer evidence foundation, not the complete programme market for these Cities or the complete UAE licensed higher-education universe.

## Deferred scope

No Khor Fakkan, Ajman, Fujairah, Ras Al Khaimah or Umm Al Quwain row may appear in the Phase 3 City read models.

## Conclusion

UAE Cities Phase 3 is implementation-complete with 11 verified physical study-location representatives and 98 conservative programme-location links across the exact four Tier A Cities.