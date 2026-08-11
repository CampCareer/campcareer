# United Arab Emirates Cities — Phase 1 scope v1

Status: `PHASE_1_COMPLETE`

Checkpoint: `TIER_A_SCOPE_LOCKED`

Country: `AE` — United Arab Emirates

Audit date: 2026-08-12

Branch: `agent/ae-cities-v1`

## Purpose

Phase 1 locks the exact UAE Cities v1 rollout cohort before geography normalization, study-location verification, metrics, profile publication or Compare work begins.

The rollout was reduced from the initial seven-City draft to the top four current programme destinations. No City route is published by this phase.

## Locked City cohort

The UAE Cities v1 Tier A rollout is exactly four study-destination Cities, ranked by current CampCareer UAE programme volume:

1. Abu Dhabi — `abu-dhabi` — 41 programmes
2. Sharjah — `sharjah` — 26 programmes
3. Al Ain — `al-ain` — 18 programmes
4. Dubai — `dubai` — 17 programmes

Planned canonical routes after later publication gates:

- `/cities/ae/abu-dhabi`
- `/cities/ae/sharjah`
- `/cities/ae/al-ain`
- `/cities/ae/dubai`

Phase 1 does not make these routes indexable or publicly supported.

## Selection basis

Every selected City currently has all of the following:

- at least one source-backed UAE programme in `program_catalog_ae_staging`
- at least one linked active canonical provider institution
- an existing canonical City geography row
- a current provider/location source path that can be independently rechecked in Phase 3
- an unambiguous intended City/locality interpretation distinct from the containing emirate

Programme evidence at the Phase 1 checkpoint:

| City | Emirate | Programmes | Provider institutions | Existing canonical geography |
|---|---|---:|---:|---|
| Abu Dhabi | Abu Dhabi | 41 | 4 | yes |
| Sharjah | Sharjah | 26 | 1 | yes |
| Al Ain | Abu Dhabi | 18 | 1 | yes |
| Dubai | Dubai | 17 | 6 | yes |

Total foundation represented by the locked scope:

- Cities: 4
- emirates represented: 3
- source programmes: 102
- active provider institutions: 12

## Deferred Cities

The following Cities from the original seven-City draft are now explicitly deferred:

- Khor Fakkan — 3 current collection programmes
- Ajman — 2 current collection programmes
- Fujairah — 1 current collection programme

Also deferred:

- Ras Al Khaimah
- Umm Al Quwain
- every other UAE locality not in the exact four-City allowlist

The six programmes attached to Khor Fakkan, Ajman and Fujairah remain valid country/programme foundation data. They must not enter Phase 2–5 City geography, linkage, metrics, routes or publication contracts.

No later phase may silently promote a deferred City into Tier A. A scope change requires an explicit new scope decision.

## Tier A meaning

`Tier A` in this document is the City rollout priority tier only.

It is not the same as `verification_tier='A'` in the UAE programme staging table.

A City can be in the Phase 1 Tier A rollout because it has enough current evidence to justify the verification workstream, while individual programmes within that City retain their own source and verification tiers.

## City boundary contract

The City product must use physical study-destination locality semantics.

It must not use emirate-wide semantics even when the City and emirate share the same English name.

- `Abu Dhabi` City is not all of Abu Dhabi emirate.
- `Dubai` City is not all of Dubai emirate.
- `Sharjah` City is not all of Sharjah emirate.
- `Al Ain` is a distinct City within Abu Dhabi emirate.

The containing emirate is context/region metadata, not a replacement for City verification.

## Publication linkage contract

The authoritative publication chain for UAE Cities is:

`verified City/locality -> verified physical study location -> recognised canonical provider -> verified programme recognition/provenance -> canonical programme`

A programme may enter a City profile only when every link in that chain is supported.

The following are explicitly insufficient on their own:

- CAA registry `Emirate`
- staging `city` text
- institution canonical name match
- institution presence in a City
- `Primary publication location` campus rows
- provider marketing text without a physical teaching-location claim

Phase 3 must verify the physical teaching location and programme relationship.

## Existing City identity preservation

Phase 2 must preserve the existing canonical geography identities for all four selected Cities:

- Abu Dhabi — `abu-dhabi`
- Sharjah — `sharjah`
- Al Ain — `al-ain`
- Dubai — `dubai`

The existing UUIDs must not be replaced merely to add normalized scope metadata.

Phase 2 is not authorized to create canonical City geography rows for Khor Fakkan, Ajman, Fujairah or any other deferred locality.

## Geography authority rule

There is no Phase 1 assumption of a single federal municipality code that can safely identify every selected City.

Phase 2 must use official local-government/municipal geography evidence, make the City/locality scope explicit, and record the containing emirate separately.

For the Abu Dhabi emirate candidates, the Department of Municipalities and Transport distinguishes Abu Dhabi City Municipality and Al Ain City Municipality.

Equivalent official local-government evidence must support Dubai and Sharjah scope normalization.

## Provider identity gate

The four-City programme foundation uses 12 active provider institutions.

Several programme-provider rows currently lack a persisted durable identifier even though the existing UAE programme snapshot carries source-provider identity evidence. Phase 3 must reconcile those selected-provider identifiers before they contribute publication linkage.

Name-only canonical matching is not an acceptable final publication contract.

The provider type must also remain source-specific:

- CAA higher-education provider identity
- MoE TVET provider identity
- GCAA training-provider identity

A TVET or aviation training provider must not be described as a CAA university merely because it is part of the UAE programme foundation.

## Programme coverage boundary

The 102 selected programmes are a verified working foundation, not a complete inventory of all programmes offered by all licensed UAE institutions in the four Cities.

The selected Cities therefore use conservative coverage language:

`verified_partial`

A programme count describes current CampCareer source coverage only. It must not be presented as a complete City programme market count.

International-admission state remains a separate evidence dimension. City inclusion must not imply that applications are currently open or that a visa is guaranteed.

## Phase 2 handoff

Phase 2 is authorized to normalize exactly these four Cities and no others:

`abu-dhabi, sharjah, al-ain, dubai`

Required Phase 2 outputs:

- preserve all four existing City UUIDs and slugs
- assign explicit City/locality scope semantics
- record containing emirate metadata without collapsing City into emirate
- attach official geography provenance
- add safe aliases only where source-backed
- keep all routes unpublished
- leave programme delivery unassigned until Phase 3

## Phase 1 conclusion

UAE Cities has reached `TIER_A_SCOPE_LOCKED` for exactly four destinations:

`abu-dhabi, sharjah, al-ain, dubai`

The scope covers 102 programmes across 12 current provider institutions and three emirates.

Khor Fakkan, Ajman and Fujairah are explicitly removed from the active rollout despite having six combined programmes in the country foundation. Phase 2–5 must not create geography normalization, City metrics, City profile routes or programme linkage for those deferred destinations.

Phase 2 may begin geography normalization for the exact four-City cohort. Phase 3 remains responsible for physical study-location, provider-identity and programme-delivery verification.