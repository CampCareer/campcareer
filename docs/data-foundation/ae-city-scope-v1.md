# United Arab Emirates Cities — Phase 1 scope v1

Status: `PHASE_1_COMPLETE`

Checkpoint: `TIER_A_SCOPE_LOCKED`

Country: `AE` — United Arab Emirates

Audit date: 2026-08-11

Branch: `agent/ae-cities-v1`

## Purpose

Phase 1 locks the exact UAE Cities v1 rollout cohort before geography normalization, study-location verification, metrics, profile publication or Compare work begins.

No City route is published by this phase.

## Locked City cohort

The UAE Cities v1 Tier A rollout is exactly seven study-destination Cities:

1. Abu Dhabi — `abu-dhabi`
2. Dubai — `dubai`
3. Sharjah — `sharjah`
4. Al Ain — `al-ain`
5. Khor Fakkan — `khor-fakkan`
6. Ajman — `ajman`
7. Fujairah — `fujairah`

Planned canonical routes after later publication gates:

- `/cities/ae/abu-dhabi`
- `/cities/ae/dubai`
- `/cities/ae/sharjah`
- `/cities/ae/al-ain`
- `/cities/ae/khor-fakkan`
- `/cities/ae/ajman`
- `/cities/ae/fujairah`

Phase 1 does not make these routes indexable or publicly supported.

## Selection basis

Every selected City currently has all of the following:

- at least one source-backed UAE programme in `program_catalog_ae_staging`
- at least one linked active canonical provider institution
- a current provider/location source path that can be independently rechecked in Phase 3
- an unambiguous intended City/locality interpretation distinct from the containing emirate

Programme evidence at the Phase 1 checkpoint:

| City | Emirate | Programmes | Provider institutions | Existing canonical geography |
|---|---|---:|---:|---|
| Abu Dhabi | Abu Dhabi | 41 | 4 | yes |
| Sharjah | Sharjah | 26 | 1 | yes |
| Al Ain | Abu Dhabi | 18 | 1 | yes |
| Dubai | Dubai | 17 | 6 | yes |
| Khor Fakkan | Sharjah | 3 | 1 | no |
| Ajman | Ajman | 2 | 1 | no |
| Fujairah | Fujairah | 1 | 1 | no |

Total foundation represented by the scope:

- Cities: 7
- emirates represented: 5
- source programmes: 108
- active provider institutions: 15

## Tier A meaning

`Tier A` in this document is the City rollout priority tier only.

It is not the same as `verification_tier='A'` in the UAE programme staging table.

A City can be in the Phase 1 Tier A rollout because it has enough current evidence to justify the verification workstream, while individual programmes within that City retain their own source and verification tiers.

## City boundary contract

The City product must use physical study-destination locality semantics.

It must not use emirate-wide semantics even when the City and emirate share the same English name.

Examples:

- `Abu Dhabi` City is not all of Abu Dhabi emirate.
- `Dubai` City is not all of Dubai emirate.
- `Sharjah` City is not all of Sharjah emirate.
- `Ajman` City is not all of Ajman emirate.
- `Fujairah` City is not all of Fujairah emirate.
- `Al Ain` is a distinct City within Abu Dhabi emirate.
- `Khor Fakkan` is a distinct study-location candidate within Sharjah emirate.

The containing emirate is context/region metadata, not a replacement for City verification.

## Publication linkage contract

The authoritative publication chain for UAE Cities is:

`verified City/locality -> verified physical study location -> recognised canonical provider -> verified programme offering -> canonical programme`

A programme may enter a City profile only when every link in that chain is supported.

The following are explicitly insufficient on their own:

- CAA registry `Emirate`
- staging `city` text
- institution canonical name match
- institution presence in a City
- `Primary publication location` campus rows
- provider marketing text without a physical teaching-location claim

Phase 3 must verify the physical teaching location and programme relationship.

## Existing four-City identity preservation

Phase 2 must preserve the existing canonical geography identities where the current interpretation remains valid:

- Abu Dhabi — `abu-dhabi`
- Al Ain — `al-ain`
- Dubai — `dubai`
- Sharjah — `sharjah`

The existing UUIDs must not be replaced merely to add normalized scope metadata.

Phase 2 may create new canonical geography rows for:

- Khor Fakkan — `khor-fakkan`
- Ajman — `ajman`
- Fujairah — `fujairah`

only after official locality validation.

## Geography authority rule

There is no Phase 1 assumption of a single federal municipality code that can safely identify every selected City.

Phase 2 must use official local-government/municipal geography evidence and record the containing emirate separately.

For the Abu Dhabi emirate candidates, the Department of Municipalities and Transport explicitly distinguishes Abu Dhabi City Municipality and Al Ain City Municipality.

For other emirates, equivalent local-government evidence must be attached before canonical geography normalization is considered complete.

## Provider identity gate

The seven-City programme foundation uses 15 active provider institutions.

At the Phase 1 audit:

- 7 have at least one persisted institution identifier row
- 8 programme-linked providers have no persisted identifier row

Phase 1 does not remove those providers from the scope because their programme records retain source provenance and the Cities are valid verification candidates.

However, Phase 3 publication linkage must resolve provider identity before a missing-identifier provider contributes City programme evidence.

Name-only canonical matching is not an acceptable final publication contract.

## Programme coverage boundary

The 108-programme collection is a verified working foundation, not a complete inventory of all programmes offered by all licensed UAE institutions.

The selected seven Cities therefore must use conservative coverage language such as:

`verified_partial`

until a broader national provider/programme coverage audit proves otherwise.

A low programme count does not mean that a City has few total programmes.

Examples:

- Fujairah currently has one programme in the CampCareer collection.
- Ajman currently has two.
- Khor Fakkan currently has three.

Those counts describe current verified collection coverage only.

## Deferred UAE Cities / emirates

The following are not part of Tier A v1:

- Ras Al Khaimah
- Umm Al Quwain
- any other UAE locality not listed in the locked seven-City cohort

Reason:

The current 108-programme foundation contains no City-level programme cohort for those destinations that satisfies the Phase 1 selection basis.

Their exclusion must not be interpreted as absence of licensed higher education. CAA/MoHESR list a broader UAE institutional universe.

No later phase may silently promote a deferred City into Tier A.

A scope change requires an explicit new scope decision.

## Phase 2 handoff

Phase 2 is authorized to normalize exactly these seven Cities and no others.

Required Phase 2 outputs:

- preserve four existing City UUIDs/slugs where valid
- add three missing canonical City geographies after official verification
- assign explicit City/locality `scope_kind`
- record containing emirate/region metadata without collapsing City into emirate
- attach official geography provenance
- add safe aliases where source-backed
- keep all routes unpublished
- leave programme delivery unassigned until Phase 3

## Phase 1 conclusion

UAE Cities has reached `TIER_A_SCOPE_LOCKED` for exactly:

`abu-dhabi, dubai, sharjah, al-ain, khor-fakkan, ajman, fujairah`

The scope covers all 108 programmes in the current UAE programme collection across 15 providers and five emirates, while deliberately excluding Ras Al Khaimah, Umm Al Quwain and all other localities from automatic promotion.

Phase 2 may begin geography normalization for this exact seven-City cohort. Phase 3 remains responsible for physical study-location, provider-identity and programme-delivery verification.
