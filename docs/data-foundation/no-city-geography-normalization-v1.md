# Norway Cities — Phase 2 geography normalization v1

Status: `PHASE_2_COMPLETE`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## Result

Exactly five Tier A destinations are normalized to the Statistics Norway 2026 municipality contract:

| City | Route slug | Municipality number | County | County code |
|---|---|---|---|---|
| Oslo | `oslo` | `0301` | Oslo | `03` |
| Trondheim | `trondheim` | `5001` | Trøndelag | `50` |
| Stavanger | `stavanger` | `1103` | Rogaland | `11` |
| Ås | `as` | `3218` | Akershus | `32` |
| Tromsø | `tromso` | `5501` | Troms | `55` |

Authority: Statistics Norway, `Municipalities 2026` classification.

- https://www.ssb.no/en/klass/klassifikasjoner/131

## Identity preservation

Phase 2 does not create replacement geography identities. It updates the five existing canonical Norway city seeds while preserving their UUIDs and public slugs.

This is important because programme/campus foundation rows already point to these geography IDs.

The migration has hard assertions for:

- exactly five normalized Tier A rows
- exact UUID preservation
- exactly one canonical row per approved slug
- exact municipality and county codes
- no unexpected Norway Tier A city
- name and route-slug aliases for every Tier A city

## Publication state

Phase 2 metadata is deliberately:

`publication_status = approved_not_indexed`

The five cities are normalized and approved for later phases but are not SEO-published by this phase.

The scope contract is:

`study_destination_scope = statistics_norway_municipality`

Population and later city evidence must use the same municipality boundary unless an explicit metric says it is national or another source-native reference.

## Deferred Norway cities

Bodø, Kongsberg, Kristiansand, Bergen and Elverum retain their reusable foundation rows but are not Tier A in this rollout.

The migration asserts that no Norway geography outside:

`oslo, trondheim, stavanger, as, tromso`

can carry `publication_tier=A`.

## Routing/display contract

Official municipality names remain Unicode display names. ASCII route slugs are aliases only:

- `Ås` -> `as`
- `Tromsø` -> `tromso`

No ASCII normalization may overwrite the official geography name.

## Phase 2 conclusion

The five-city Norway municipality foundation is locked and ready for explicit study-location/programme linkage in Phase 3.
