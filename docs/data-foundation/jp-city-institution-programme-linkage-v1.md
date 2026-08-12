# Japan city institution and programme linkage v1

Status: `PHASE_3_COMPLETE`

Checkpoint: `LINKAGE_COMPLETE`

Production migration: `20260812002442_publish_jp_tier_a_city_linkage_v1`

## Verified teaching-location layer

Phase 3 establishes 11 official teaching-location representatives across all seven Tier A destinations.

Production coverage:

- Tokyo: 2 institutions / 2 teaching locations
- Kyoto: 4 / 4
- Nagoya: 1 / 1
- Sendai: 1 / 1
- Suita: 1 / 1
- Tsukuba: 1 / 1
- Fukuoka: 1 / 1

These rows are verified representatives, not declarations of complete campus inventories.

## Conservative programme linkage

Only programme groups for which current source data and official teaching-location evidence support the same city are linked in v1:

- Kyoto: `6`
- Nagoya: `25`
- Sendai: `23`
- Tokyo: `0` — `verification_pending`
- Suita: `0` — `verification_pending`
- Tsukuba: `0` — `verification_pending`
- Fukuoka: `0` — `verification_pending`

Strict linked total: `54`.

A zero value does not mean the city has no programmes. It means programme-to-teaching-location verification has deliberately not been inferred.

## Required exclusions

- raw `Osaka` rows are not inherited into Suita;
- Hitotsubashi raw `Tokyo` rows are not inherited into the Tokyo 23-ward product because its current verified publication location is Kunitachi;
- `Aichi`, `Tochigi` and `Gunma` prefecture labels never enter the city programme view;
- multi-campus University of Tokyo, Science Tokyo, University of Osaka, University of Tsukuba, Kyoto University and Kyushu University programme groups remain pending unless the v1 evidence explicitly establishes the teaching-city relationship.

Production assertions: source-city mismatch `0`; forbidden prefecture/Osaka/Kunitachi leakage `0`.

## Private read models

- `public.city_directory_jp_v1`
- `public.city_institution_directory_jp_v1`
- `public.city_programme_directory_jp_v1`

All use `security_invoker=true`; SELECT is granted to `service_role` only, with `anon` and `authenticated` denied.

## Result

`LINKAGE_COMPLETE`

Next: Phase 4 Five Core Metrics.
