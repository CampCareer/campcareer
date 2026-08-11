# Denmark city QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Branch: `agent/dk-cities-v1`

Audit date: 2026-08-10

## Production QA

Production Supabase confirms:

- exactly five Tier A city rows;
- 7 verified university location rows;
- 115 verified-partial programme-location rows;
- 25 verified metric rows, five per city;
- 0 Tier B rows carrying the Tier A publication contract;
- programme coverage `verified_partial` for all five cities;
- institution coverage `university_core_professional_providers_pending` for all five cities.

The three Denmark city read models remain `security_invoker=true`. Direct SELECT remains enabled for `service_role` and disabled for `anon` and `authenticated`.

Production migration history contains:

- `20260810200934_normalize_dk_tier_a_city_geographies_v1`
- `20260810201203_publish_dk_tier_a_city_linkage_v1`
- `20260810202207_publish_dk_tier_a_city_metrics_v1`

## Route / publication QA

Published and sitemap-eligible routes are exactly Copenhagen, Frederiksberg, Odense, Aarhus and Aalborg.

Lyngby, Roskilde, Sønderborg, Kolding and Esbjerg remain outside indexed city surfaces.

Approved city profiles use `index, follow`; unsupported slugs retain not-found and `noindex, nofollow` behaviour.

City Compare remains `noindex, nofollow`.

## Evidence QA

The cross-phase contract preserves:

- Statistics Denmark municipality scope;
- the national student living baseline as non-city-specific;
- source-native transport products;
- the SIRI 90-hours-per-month rule without weekly conversion;
- verified-partial programme delivery based on source-city/location match;
- professional higher-education provider incompleteness as an explicit gap.

## Automated CI

Draft PR `#203` runs repository CI for the single Denmark country branch.

QA code head `8488ce549db539d0b165fdfb9618752d38f322c7` passed GitHub Actions CI run `#1169` (`31430307207`).

All steps passed:

- `npm ci`
- `npm audit --omit=dev --audit-level=high`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- Git-history secret scan

Result: Denmark Cities is `PUBLISH_READY` through Phase 8.
