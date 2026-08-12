# Norway Cities — Phase 1 city scope v1

Status: `PHASE_1_COMPLETE`
Checkpoint: `TIER_A_SCOPE_LOCKED`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Scope decision

The first Norway Cities publication cohort is locked to exactly five municipality-based study destinations, selected by current verified Study in Norway programme volume in the canonical foundation:

1. Oslo — `oslo` — 34 programmes
2. Trondheim — `trondheim` — 27 programmes
3. Stavanger — `stavanger` — 14 programmes
4. Ås — `as` — 11 programmes
5. Tromsø — `tromso` — 11 programmes

Planned route shape:

- `/cities/no/oslo`
- `/cities/no/trondheim`
- `/cities/no/stavanger`
- `/cities/no/as`
- `/cities/no/tromso`

Phase 1 does not publish these routes. Phase 2 must first normalize the municipality geography contract.

## Why these five

This is a deliberately constrained initial cohort, not a ranking of Norwegian student-city quality and not a claim that these are the only important higher-education destinations in Norway.

The selection rule is deterministic: take the five municipality labels with the largest current Tier A Study in Norway programme cohorts in CampCareer's Norway staging foundation.

| Rank | Tier A city | Current staged programmes | Current university institutions represented |
|---:|---|---:|---:|
| 1 | Oslo | 34 | 2 |
| 2 | Trondheim | 27 | 1 |
| 3 | Stavanger | 14 | 1 |
| 4 | Ås | 11 | 1 |
| 5 | Tromsø | 11 | 1 |

Together the five contain 97 of the current 140 Norway staged programmes and six of the 11 canonical NOKUT university-category institutions.

There is no tie-expansion beyond five. Ås and Tromsø are tied at 11 programmes and occupy positions four and five. The next cohort is Bodø, Kongsberg and Kristiansand at 10 programmes each, so the five-city boundary remains unambiguous.

These counts are scope-selection evidence only. They must not be presented as complete municipality-wide programme totals until physical delivery and wider HEI coverage are verified.

## Explicitly deferred cities

The previous ten-city draft also included:

- Bodø — 10 programmes
- Kongsberg — 10 programmes
- Kristiansand — 10 programmes
- Bergen — 9 programmes
- Elverum — 4 programmes

Those municipalities are now outside Tier A v1. Their existing canonical geographies and programme data remain reusable foundation data, but Phase 2–5 must not mark them as Tier A, expose City profile routes for them, or include them in Norway City metrics.

Their exclusion is a rollout-size decision, not a quality judgement.

## Geography principle

The public comparison boundary for each Tier A destination is the official Statistics Norway municipality using the `Municipalities 2026` classification:

https://www.ssb.no/en/klass/klassifikasjoner/131

Phase 2 must normalize city comparison on municipality boundaries, not Study in Norway macro-regions or informal metropolitan areas.

Rules:

- Oslo means Oslo municipality
- Trondheim means Trondheim municipality
- Stavanger means Stavanger municipality
- Ås means Ås municipality
- Tromsø means Tromsø municipality
- regional labels such as `East Norway` or `North Norway` are discovery context only
- no municipality may absorb a neighbouring campus or programme without explicit location evidence

ASCII slugs are routing identifiers only:

- Ås -> `as`
- Tromsø -> `tromso`

They must never replace official display names.

## Multi-campus rule

Several institutions represented in the five-city cohort operate across multiple campuses or study locations. In particular, NTNU and UiT have important locations outside the selected municipality represented here.

Phase 1 therefore locks destination scope without converting current `Primary publication location` rows into complete campus inventories.

Phase 3 must:

- verify the selected municipality as a real official institution study location
- require the programme source city to match the verified municipality before City publication
- preserve `campus_inventory_complete=false`
- never assign an institution's programmes to the selected city solely because the institution has a location there

A verified secondary campus outside the five-city allowlist does not automatically promote that municipality to Tier A.

## Institution coverage state carried forward

All five Tier A destinations inherit the Phase 0 disclosure:

`selected_nokut_university_core_full_hei_coverage_pending`

The current canonical foundation represents the 11 institutions in NOKUT's university category, while Norway has a broader approved higher-education universe including specialised universities and university colleges.

Therefore:

- City institution counts are not complete municipality-wide HEI totals
- absence from the current 11-university foundation is not evidence that a municipality lacks higher education
- profile copy must retain the partial-coverage disclosure
- later expansion must reconcile additional approved provider categories before full-coverage language is allowed

## Programme publication boundary

The five-city allowlist does not automatically turn all 97 matching staging rows into city-verified programmes.

Phase 3 publication requires the complete evidence chain:

`SSB municipality -> verified study location -> recognised canonical institution -> verified programme offering -> canonical programme`

For this cohort, the existing 97 offerings are candidates because their current source-city labels and assigned campus-city labels agree. Phase 3 must still make that agreement an explicit publication contract.

Rules:

- source city text is reconciliation evidence, not sufficient by itself
- current `Primary publication location` metadata is not sufficient by itself
- institution presence never implies programme delivery
- exact `NO_STUDYINNORWAY` offering provenance must be retained
- `verified_general` international evidence remains distinct from programme-specific current admissions verification

## Phase 2 normalization targets

Phase 2 must preserve the existing UUIDs and route slugs for exactly these five municipalities while adding:

- official SSB 2026 municipality number
- municipality `scope_kind`
- official county relationship / county code
- SSB source metadata
- Tier A publication metadata
- canonical name and slug aliases

Expected municipality contracts:

| City | Slug | SSB municipality | County code | County |
|---|---|---|---|---|
| Oslo | `oslo` | `0301` | `03` | Oslo |
| Trondheim | `trondheim` | `5001` | `50` | Trøndelag |
| Stavanger | `stavanger` | `1103` | `11` | Rogaland |
| Ås | `as` | `3218` | `32` | Akershus |
| Tromsø | `tromso` | `5501` | `55` | Troms |

No other Norway geography may be silently promoted to Tier A during Phase 2.

## Phase 1 conclusion

The exact Norway Tier A v1 allowlist is now locked to:

`oslo, trondheim, stavanger, as, tromso`

Phase 1 is complete with the five-city scope. Phase 2 may proceed on the same Norway-only branch.
