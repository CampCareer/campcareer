# United Arab Emirates Cities — Phase 0 readiness v1

Status: `PHASE_0_COMPLETE`

Readiness: `READY_WITH_GATES`

Country: `AE` — United Arab Emirates

Audit date: 2026-08-11

Branch: `agent/ae-cities-v1`

## Purpose

Phase 0 audits whether the existing UAE institution, programme and geography foundations are sufficient to begin a City rollout without overstating city-level evidence.

This phase does not publish a City route, mutate production data or assign programme delivery to a City.

## Country contract

- ISO country code: `AE`
- route segment: `ae`
- currency: AED
- federal higher-education licensing / quality authority: UAE Ministry of Higher Education and Scientific Research / Commission for Academic Accreditation (CAA)
- current CampCareer programme authority surface: CAA accredited-programme registry plus provider-official programme evidence
- local geography authority: emirate and municipal/local-government sources, because local governments retain substantial jurisdiction and municipal structures differ by emirate

Primary authority references:

- CAA Higher Education Institutions: `https://www.caa.ae/Pages/Institutes/All.aspx`
- CAA Accredited Programs: `https://www.caa.ae/Pages/Programs/All.aspx`
- CAA About Us: `https://caa.ae/Pages/AboutUs.aspx`
- MoHESR Licensed Educational Institutions: `https://www.mohesr.gov.ae/En/Pages/institutions.aspx`
- UAE Government, local governments of the seven emirates: `https://u.ae/en/about-the-uae/the-uae-government/the-local-governments-of-the-seven-emirates`
- Abu Dhabi Department of Municipalities and Transport: `https://www.dmt.gov.ae/en`
- Dubai Municipality: `https://www.dm.gov.ae/`
- Ajman official portal: `https://www.ajman.ae/en/`

CAA states that it licenses UAE higher-education institutions and accredits award-bearing academic programmes. Institution licensure, programme accreditation and current international admission are separate evidence dimensions.

## Existing institution foundation

Current production state contains 15 active UAE canonical institutions used by the institution and programme foundations.

The existing selective institution publication cohort was originally built from five CAA-active Group 1 launch universities:

1. American University of Sharjah — Sharjah
2. Khalifa University — Abu Dhabi
3. Mohammed Bin Rashid University of Medicine and Health Sciences — Dubai
4. New York University Abu Dhabi — Abu Dhabi
5. United Arab Emirates University — Al Ain

The programme collection later expanded the canonical provider foundation to 15 active institutions across seven source Cities.

This is not the complete UAE licensed higher-education universe. The current Ministry/CAA institution surfaces are broader than the CampCareer 15-provider programme foundation.

Coverage label for Cities v1:

`verified_program_provider_partial_hei_coverage`

## Institution identity audit

The current 15 programme-linked institutions do not yet have a uniform durable identifier contract.

Production audit:

- programme-linked institutions: 15
- institutions with at least one `catalog.institution_identifiers` row: 7
- programme-linked institutions with no identifier row: 8

Existing identifier systems include:

- `AE_CAA_ACTIVE_HEI_NAME`
- `AE_MOE_TVET_PROGRAM_PROVIDER_NAME`
- `AE_GCAA_TRAINING_PROVIDER_NAME`

The programme snapshot also records CAA provider-name provenance for additional institutions, but eight current programme providers do not have a persisted identifier row in production.

Phase 3 must not treat an institution-name match alone as sufficient city-delivery identity where the canonical provider lacks durable source identity. The missing identifier rows must be reconciled before those providers are used as city publication evidence.

## Existing programme foundation

Production programme staging currently contains 108 UAE programmes.

Audit result:

- staged programmes: 108
- staged programmes with City: 108
- staged programmes linked to canonical institution: 108
- programme verification Tier A: 37
- remaining programme rows: 71
- active canonical programmes: 108

The programme collection is intentionally mixed-source:

- CAA accreditation and institution records
- provider-official programme evidence
- selected MoE TVET evidence
- selected GCAA training-provider evidence

CAA accreditation proves programme recognition/accreditation state. It does not prove that an international application window is currently open.

Likewise, the CAA programme registry exposes an `Emirate` field. An emirate value is not sufficient evidence that a programme is physically delivered inside the same-named City municipality/locality.

## Current programme evidence by source City

| Source City | Emirate | Programmes | Institutions |
|---|---|---:|---:|
| Abu Dhabi | Abu Dhabi | 41 | 4 |
| Sharjah | Sharjah | 26 | 1 |
| Al Ain | Abu Dhabi | 18 | 1 |
| Dubai | Dubai | 17 | 6 |
| Khor Fakkan | Sharjah | 3 | 1 |
| Ajman | Ajman | 2 | 1 |
| Fujairah | Fujairah | 1 | 1 |

Total: 108 programmes across 15 institutions.

These City strings are reconciliation evidence for later study-location verification. They are not by themselves a City publication contract.

## Existing geography foundation

Production currently has four UAE canonical City geography rows:

| City | Slug | Current code | Current region code | Current scope kind |
|---|---|---|---|---|
| Abu Dhabi | `abu-dhabi` | null | null | null |
| Al Ain | `al-ain` | null | null | null |
| Dubai | `dubai` | null | null | null |
| Sharjah | `sharjah` | null | null | null |

All four are active and were seeded by the original CAA/MoHESR Group 1 institution fast-path.

Ajman, Fujairah and Khor Fakkan exist in current programme/location evidence but do not yet have canonical City geography rows.

The UAE does not have one CampCareer-ready national City-code contract already represented in production. Phase 2 must therefore normalize the City layer conservatively from official emirate/municipal locality evidence instead of inventing a federal City code.

## City versus Emirate ambiguity

Five relevant names can refer both to an emirate and to a City/locality context:

- Abu Dhabi
- Dubai
- Sharjah
- Ajman
- Fujairah

City routes must represent the physical study destination locality/municipal City scope, not the entire emirate.

Al Ain is a distinct City under Abu Dhabi emirate. The Abu Dhabi Department of Municipalities and Transport explicitly distinguishes Abu Dhabi City Municipality and Al Ain City Municipality.

Khor Fakkan is a distinct Sharjah-emirate study-location candidate and must not be collapsed into Sharjah City merely because the CAA programme registry uses the emirate field `Sharjah`.

## Existing campus/location foundation

Production contains 15 active UAE campus/location records.

Audit result:

- active records: 15
- records linked to canonical geography: 5
- records marked complete campus inventory: 0
- records with programme assignment verified: 0

The original five institution-fast-path rows are `Primary publication location` records with conservative metadata such as:

- `campus_inventory_complete=false`
- `programme_assignment_verified=false`
- coordinate precision not asserted

The later programme-provider rows are similarly publication/provenance locations, not verified complete physical-campus inventories.

Therefore institution presence in a City must never automatically assign all institution programmes to that City.

## Phase 2 geography gate

Phase 2 may proceed for the exact Phase 1 cohort only if it:

- preserves the existing UUID and slug for Abu Dhabi, Al Ain, Dubai and Sharjah where valid
- creates canonical City rows for Ajman, Fujairah and Khor Fakkan only after official locality validation
- makes `scope_kind` explicit
- records the containing emirate separately from the City itself
- stores official municipal/local-government provenance in metadata
- does not invent a national City identifier when none has been verified
- adds aliases only where they are source-backed and unambiguous
- does not publish routes

Phase 2 must not silently add Ras Al Khaimah, Umm Al Quwain or any other UAE City.

## Phase 3 study-location gate

Before a City can receive programme counts or become publication-ready, Phase 3 must verify this chain:

`City/locality -> verified physical study location -> canonical provider identity -> verified programme offering -> canonical programme`

Rules:

- CAA `Emirate` is not City evidence
- a programme staging `city` string is not sufficient alone
- a `Primary publication location` row is not sufficient alone
- institution presence never implies programme delivery
- multi-location providers require location-specific programme evidence
- providers missing durable institution identifiers must be reconciled before publication linkage
- TVET/GCAA providers remain source-type-specific and must not be described as CAA university providers

## International-admission boundary

The UAE programme publication foundation deliberately separates programme accreditation from international admission status.

Cities must preserve that separation. A City programme count may describe verified delivery evidence, but it must not imply:

- current international applications are open
- a student visa is guaranteed
- a programme is available to every nationality

Those are programme/immigration evidence dimensions, not City geography dimensions.

## Phase 0 conclusion

UAE Cities is `READY_WITH_GATES`.

The existing foundation is strong enough to begin a controlled seven-City rollout because:

- 108 canonical programmes already exist
- all 108 staged records have source City labels and canonical institution links
- 15 active provider institutions exist
- four core City geographies already exist
- official federal quality and local-government authority surfaces are available

The principal gates are:

1. City and emirate semantics must remain separate.
2. Three candidate Cities need canonical geography creation.
3. Ten of 15 location rows are not linked to canonical geography.
4. No campus inventory is complete.
5. No programme-to-location assignment is currently verified.
6. Eight of 15 programme providers lack persisted durable identifier rows.
7. Current provider/programme coverage is partial relative to the full licensed UAE HEI universe.

Phase 1 may lock the exact City cohort, but publication remains prohibited until later phases satisfy these gates.
