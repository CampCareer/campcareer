# Singapore study destination foundation v1

Status: `PHASE_2_COMPLETE`

Branch: `agent/sg-destination-foundation-v1`

Parent: `agent/sg-destination-scope-v1`

Date: 2026-08-10

## Result

Singapore remains one country-level city-state study destination. Phase 2 adds no city shortlist and no `/cities/sg/...` publication tier.

Canonical public scope:

`SG country -> institution -> campus/teaching location -> explicit programme offering`

## Production foundation

Phase 2 adds the service-role `public.study_destination_sg_v1` anchor with:

- country code `SG`
- destination name Singapore
- scope kind `country_city_state`
- study destination scope `COUNTRY_LEVEL_CITY_STATE_DESTINATION`
- linked institution count
- linked campus count
- linked canonical programme count
- programme coverage status

Current production state after migration:

- destination rows: 1
- active canonical autonomous universities: 6
- active canonical campus/location rows: 6
- canonical SG programmes: 0
- programme coverage: `verification_pending`

The existing Singapore `core.geographies` city row remains a physical-location compatibility record only; it is not promoted into a separate public destination.

## New verified country evidence

Phase 2 adds three country-scoped evidence rows to the existing Singapore evidence set.

### `country_population`

Source: Singapore Department of Statistics / SingStat.

- total population: 6,111,175
- reference period: 2025 end-June
- resident population: 4,204.5 thousand
- population density: 8,300 per sq km

The population definition remains explicit: total population includes residents and non-residents.

### `student_transport_reference`

Source: Singapore Public Transport Council, current fare page updated 28 January 2026.

The evidence remains source-native rather than manufacturing a synthetic average monthly spend:

- adult basic card fare: S$1.28 to S$2.57 depending on distance
- adult monthly travel pass: S$122
- university-student hybrid monthly pass: S$81
- student concession eligibility is explicitly required and is not assumed for every international student

### `employment_focus_sectors`

Source: Singapore Economic Development Board.

Current national economic-context sectors include aerospace, biotechnology/pharmaceuticals, energy/chemicals, logistics/supply chain, medical technology, professional services, semiconductors, technology hardware/equipment and digital technology.

These are economic-context signals, not occupation-shortage or work-pass guarantees.

## Security

`study_destination_sg_v1` uses `security_invoker=true`.

- `anon`: no direct select
- `authenticated`: no direct select
- `service_role`: select

## Database migration

`20260810120500_sg_destination_foundation_v1.sql`

Production application: successful.

## Phase 2 checkpoint

`COUNTRY_FOUNDATION_READY`

Next: refresh and publish a destination-oriented institution/campus linkage layer without converting Singapore neighbourhoods or planning areas into canonical cities.
