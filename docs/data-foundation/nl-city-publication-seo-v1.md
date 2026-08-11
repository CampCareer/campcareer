# Netherlands city publication and SEO v1

Status: `PHASE_7_COMPLETE`

Checkpoint: `PUBLICATION_COMPLETE`

Current branch: `agent/nl-cities-publication-v1`

Parent branch: `agent/nl-cities-city-compare-v1`

Audit date: 2026-08-10

## Purpose

Publish the approved Netherlands Tier A city profiles for search discovery without weakening the municipality, institution-linkage, metric, programme-delivery or HBO-coverage rules established in Phases 1–6.

Phase 7 is publication-only. It creates no database rows and changes no production metrics or programme assignments.

## Published set

The public Netherlands city allowlist remains exactly:

- Amsterdam
- Maastricht
- Rotterdam
- Groningen
- Eindhoven

The following Tier B cities remain outside the publication allowlist:

- Delft
- Utrecht
- Enschede
- Tilburg
- Leiden
- Nijmegen
- Wageningen

The Hague remains a discovered expansion candidate and is neither created nor routed by this phase.

## Canonical routes

The five indexable routes are:

- `/cities/nl/amsterdam`
- `/cities/nl/maastricht`
- `/cities/nl/rotterdam`
- `/cities/nl/groningen`
- `/cities/nl/eindhoven`

Approved routes use country-specific canonical metadata and `index, follow`.
Unsupported slugs remain outside `PUBLISHED_NL_CITY_SLUGS`, return the not-found path and use the metadata fallback `noindex, nofollow`.

## Sitemap

`src/app/sitemap.ts` imports `PUBLISHED_NL_CITY_SLUGS` from the shared city route contract and maps that exact allowlist to `/cities/nl/<slug>`.

There is no second hard-coded Netherlands publication list. Tier B cities and The Hague therefore cannot enter the sitemap without first passing the canonical route allowlist.

## Compare boundary

The shared City Compare surface remains `noindex, nofollow`.

Netherlands comparison remains available at:

`/compare?type=city&country=NL`

The default pair remains Amsterdam versus Maastricht.

## Geography policy

All five published cities preserve the Phase 2 CBS municipality contract. Publication does not expand Amsterdam to the wider metro, Maastricht to Limburg, Rotterdam to Rijnmond or the Rotterdam-The Hague metro, Groningen to the province, or Eindhoven to Brainport.

Population evidence uses the same CBS municipality boundary family for all five cities.

## Programme coverage policy

Publication does not reinterpret the current city-level programme gap.

All five city rows currently retain zero explicitly campus-linked programmes and `programme_coverage_status = verification_pending`.

This is not presented as evidence that the cities have no programmes. Institution or campus presence never establishes programme delivery. Only an explicit verified offering-to-campus relationship can make a programme appear in a city directory.

The programme gap does not block city publication because all five cities satisfy the geography, linkage and five-metric publication gates.

## Institution coverage policy

The current city linkage layer is an initial research-university core, not a complete Dutch provider inventory.

HBO providers remain an explicit expansion gap. Publication preserves `research_university_core_hbo_pending` semantics rather than silently treating missing HBO providers as absent from the city.

## Published decision evidence

Every published profile continues to require the same five verified metrics:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Living-cost methodologies remain source-specific. Eindhoven continues to identify its current living-cost value as a national baseline rather than a city-specific TU/e total.

Transport values remain source-native products and periods; no synthetic monthly fare is created.

The student employee-work reference remains a national residence-permit context: up to 16 hours per week, or full-time work in June, July and August, with an employer TWV required. It is not presented as a city differentiator or universal entitlement.

Employment sectors remain economic context rather than shortage rankings or employment guarantees.

## Files changed

Phase 7 changes only publication contracts:

- `src/app/(workspace)/cities/nl/[city]/page.tsx`
- `src/app/sitemap.ts`
- `tests/nl-city-profile-contract.test.ts`
- `tests/nl-city-publication-seo-contract.test.ts`
- `docs/data-foundation/nl-city-publication-seo-v1.md`

No database migration is required.

## Completion gate

Phase 7 is complete when:

- the public allowlist remains exactly five Tier A cities;
- approved city pages are `index, follow`;
- unsupported city slugs remain not-found/noindex;
- canonical URLs use `/cities/nl/<slug>`;
- sitemap generation derives Netherlands URLs from `PUBLISHED_NL_CITY_SLUGS`;
- Tier B and The Hague are absent from indexed surfaces;
- Compare remains noindex;
- programme verification pending remains explicit;
- HBO incompleteness remains explicit;
- municipality, transport and work-rights methodology disclosures remain intact.

Next branch:

`agent/nl-cities-qa-v1`

Phase 8 must run cross-phase database, routing, SEO, comparison, empty-state and build/CI checks before integration.
