# Belgium city linkage v1

Status: `PHASE_3_COMPLETE`

Branch: `agent/be-cities-v1`

Migration: `20260810202226_publish_be_tier_a_city_linkage_v1`

Checkpoint: `LINKAGE_COMPLETE`

## Result

The six Tier A study destinations have seven conservative, source-backed university teaching locations:

- Brussels — ULB Solbosch; VUB Main Campus Brussels.
- Ghent — UGent Campus UFO.
- Leuven — KU Leuven Group T Campus.
- Antwerp — University of Antwerp Stadscampus.
- Louvain-la-Neuve — UCLouvain Louvain-la-Neuve Campus.
- Liège — ULiège Sart Tilman Campus, Amphithéâtres de l'Europe.

All locations are institution-official evidence with `record_scope=verified_teaching_campus`, `location_quality=verified_official`, `campus_inventory_complete=false` and `programme_assignment_verified=false`.

## Read models

Created as `security_invoker=true`, revoked from `public`, `anon` and `authenticated`, with SELECT granted only to `service_role`:

- `public.city_institution_directory_be_v1`
- `public.city_programme_directory_be_v1`
- `public.city_directory_be_v1`

Production result: 6 destination rows, 7 institution/location rows, 7 distinct universities, and 0 city programme rows.

The existing 188 verified Belgium programme offerings remain separate because their inherited primary-location relationships do not prove delivery at these verified teaching locations. Programme coverage therefore remains `verification_pending`.

The university set is intentionally not presented as a complete Belgian higher-education provider inventory.

Next: Phase 4 Five Core Metrics.
