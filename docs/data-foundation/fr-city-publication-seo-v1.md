# France city publication and SEO v1

Status: `PHASE_7_COMPLETE`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-11

Checkpoint: `PUBLICATION_COMPLETE`

## Indexable routes

Exactly seven France city profiles are indexable:

- `/cities/fr/paris`
- `/cities/fr/paris-saclay`
- `/cities/fr/bordeaux`
- `/cities/fr/strasbourg`
- `/cities/fr/grenoble`
- `/cities/fr/aix-marseille`
- `/cities/fr/nice`

These routes derive from `PUBLISHED_FR_CITY_SLUGS`.

Unsupported France city slugs remain `noindex, nofollow` and route to not-found.

## Metadata

Each approved route uses:

- a France-specific `Study in {destination}, France` title;
- a canonical `/cities/fr/{slug}` URL;
- `robots: index, follow`;
- description copy that keeps student living, transport, national work context, verified teaching locations and programme-delivery coverage explicit.

## Sitemap

The sitemap derives all seven France city URLs from `PUBLISHED_FR_CITY_SLUGS` rather than duplicating a separate manual city list.

Registered/locality seed rows such as `talence`, `saint-aubin`, `saint-martin-dheres` and `marseille` are not published as France Tier A city routes.

Expansion candidates such as Lyon, Toulouse, Lille, Montpellier, Rennes and Nantes are not added by Phase 7.

## Compare indexing

`/compare` remains `noindex, nofollow`. Phase 7 publishes the profile landing pages, not arbitrary comparison query combinations.

## Data boundaries

Publication does not change:

- the verified teaching-location set;
- the Five Core Metrics;
- the programme-delivery state;
- the distinction between public population geography and physical teaching locality.

All seven France destinations remain `programme_coverage_status = verification_pending` until explicit programme-to-teaching-location evidence exists.

## Release boundary

- no main merge
- no Vercel deployment
- Phase 8 performs production and cross-phase QA
