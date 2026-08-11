# Denmark city publication and SEO v1

Status: `PHASE_7_COMPLETE`

Checkpoint: `PUBLICATION_COMPLETE`

Branch: `agent/dk-cities-v1`

Audit date: 2026-08-10

## Published set

The indexable Denmark city set is exactly:

- Copenhagen
- Frederiksberg
- Odense
- Aarhus
- Aalborg

Deferred cities remain outside publication:

- Lyngby
- Roskilde
- Sønderborg
- Kolding
- Esbjerg

## Canonical routes

Approved routes use `/cities/dk/{slug}`, country-specific metadata and `index, follow`.

Unsupported slugs remain outside `PUBLISHED_DK_CITY_SLUGS`, resolve through the not-found guard and use `noindex, nofollow` fallback metadata.

## Sitemap

`src/app/sitemap.ts` imports `PUBLISHED_DK_CITY_SLUGS` and maps that exact allowlist to `/cities/dk/<slug>`.

There is no second hard-coded Denmark city publication list.

## Compare boundary

`/compare?type=city&country=DK` remains `noindex, nofollow` even though the five city profiles are indexable.

## Evidence boundary

Publication preserves:

- Statistics Denmark municipality scope;
- the national living-cost baseline as non-city-specific;
- source-native transport references;
- the 90-hours-per-month student residence-permit context without weekly conversion;
- verified-partial programme delivery counts;
- the professional higher-education provider coverage gap.

No database migration is introduced by Phase 7.

Next: Phase 8 cross-phase QA on the same country branch.
