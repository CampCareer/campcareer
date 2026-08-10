# Belgium city publication and SEO v1

Status: `PHASE_7_COMPLETE`

Branch: `agent/be-cities-v1`

Checkpoint: `PUBLICATION_COMPLETE`

## Published profiles

Exactly six Belgium city routes are approved for indexing:

- `/cities/be/brussels`
- `/cities/be/ghent`
- `/cities/be/leuven`
- `/cities/be/antwerp`
- `/cities/be/louvain-la-neuve`
- `/cities/be/liege`

Approved routes use `index, follow`. Unsupported slugs remain `noindex, nofollow` and resolve through `notFound()`.

## Metadata contract

Each approved page uses country-specific metadata:

- title: `Study in <City>, Belgium`
- canonical: `/cities/be/<slug>`
- description covers population scope, student living, transport, international-student work context, verified teaching locations and programme-delivery coverage.

## Sitemap

`src/app/sitemap.ts` derives Belgium city entries directly from `PUBLISHED_BE_CITY_SLUGS`. No Tier B or discovered candidate is added manually.

The shared City Compare page remains `noindex, nofollow`; Phase 7 indexes city profiles, not parameterized comparison states.

## Evidence and disclosure

Publication does not relax any earlier evidence boundary:

- Brussels remains Brussels-Capital Region scope;
- Louvain-la-Neuve retains its separate study-destination/population contract;
- source-native living and transport semantics remain intact;
- the linked provider set is an initial verified university set, not a complete Belgian higher-education inventory;
- city programme delivery stays `verification_pending` until explicit offering-to-teaching-location evidence exists.

Production DB mutation in Phase 7: `NONE`.
