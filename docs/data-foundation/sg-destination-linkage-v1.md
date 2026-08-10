# Singapore study destination institution linkage v1

Status: `PHASE_3_COMPLETE`

Branch: `agent/sg-destination-linkage-v1`

Parent: `agent/sg-destination-foundation-v1`

Date: 2026-08-10

## Result

Phase 3 publishes one country-level destination institution/location directory for Singapore without creating a city shortlist.

Production view:

`public.study_destination_institution_sg_v1`

Current verified coverage:

- 6 autonomous universities
- 6 source-backed primary campus/location records
- 6 valid Singapore postal codes
- 6 current HTTPS location sources
- programme delivery inferred from campus presence: 0

## Institution/location cohort

1. National University of Singapore — Kent Ridge / University Hall — 21 Lower Kent Ridge Road, 119077
2. Nanyang Technological University — Main Campus — 50 Nanyang Avenue, 639798
3. Singapore Management University — Administration Building — 81 Victoria Street, 188065
4. Singapore University of Technology and Design — SUTD Campus — 8 Somapah Road, 487372
5. Singapore Institute of Technology — Punggol Campus — 1 Punggol Coast Road, 828608
6. Singapore University of Social Sciences — Clementi Campus — 463 Clementi Road, 599494

Each row retains canonical institution identity, SG UEN, institution website, campus identity, address, postal code, location source and location-quality state.

## Programme invariant

Every destination linkage row exposes `programme_delivery_verified = false` at this stage.

This is deliberate. An institution or campus existing in Singapore is not evidence that a specific programme is delivered there. Programme publication remains blocked until a canonical programme and explicit source-backed offering-to-campus record exist.

## Geography policy

The legacy `Singapore` city geography remains usable for physical campus linkage. Phase 3 does not create or promote Central, East, North, North-East, West, CBD, Punggol, Clementi or any other local area as a canonical public study-destination city.

## Security

`study_destination_institution_sg_v1` uses `security_invoker=true` and remains service-role only.

## Database migration

`20260810121500_sg_destination_linkage_v1.sql`

Production application: successful.

## Phase 3 checkpoint

`INSTITUTION_LINKAGE_READY`

Next: define a bounded destination-metric read model for the SG study profile while preserving source-native caveats and country scope.
