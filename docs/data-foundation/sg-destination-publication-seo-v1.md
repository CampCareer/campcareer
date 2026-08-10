# Singapore destination publication and SEO v1

Status: `PHASE_7_COMPLETE`

Current branch: `agent/sg-destination-publication-v1`

Parent branch: `agent/sg-destination-decision-v1`

## Purpose

Publish Singapore as the single canonical study destination for the city-state without creating a synthetic city shortlist or duplicating national study metrics into city records.

Phase 7 changes publication and search-discovery contracts only. It does not add new geography, institution, campus, programme or metric records.

## Canonical destination

The canonical public study-destination route is:

`/sg`

Singapore remains one country/city-state destination. There is no `/cities/sg/{slug}` publication surface.

Living-area comparisons such as Central, East, North, North-East, West and CBD remain lifestyle and commute decision aids. They are not canonical study cities and do not receive city-profile publication treatment.

## Search metadata

`/sg` now presents study-destination-led metadata covering:

- verified university locations
- bounded student cost and transport references
- conditional student-work rules
- programme verification status
- job-demand and work-pass context

The canonical metadata path remains `/sg`.

## Sitemap

`src/app/sitemap.ts` explicitly publishes `/sg` as the Singapore destination URL.

No `/cities/sg/...` URL is added to the sitemap.

## Programme coverage

Phase 7 does not infer programme delivery from institution or campus presence.

Current programme coverage remains `verification_pending` with zero canonical Singapore programme offerings in the destination read model. This is a coverage state, not evidence that Singapore universities offer no programmes.

## Decision boundary

`/compare?type=city&country=SG` remains a special city-state decision path. Users are directed to `/sg`, living-area comparison or country comparison instead of an invented Singapore city comparison matrix.

## Guardrails retained

- one canonical country/city-state destination
- six verified autonomous universities in the current bounded institution set
- source-backed campus/location evidence only
- no inferred programme delivery
- transport concession eligibility remains conditional
- student-work references remain subject to applicable pass conditions
- tuition references remain source/scenario bounded
- employment sectors remain context, not employment guarantees

## Files changed

- `src/app/sg/page.tsx`
- `src/app/sitemap.ts`
- `tests/sg-destination-publication-seo-contract.test.ts`
- `docs/data-foundation/sg-destination-publication-seo-v1.md`

No database migration is required.

## Completion gate

- [x] `/sg` remains the canonical Singapore study destination
- [x] study-led metadata is published
- [x] `/sg` is present in the sitemap
- [x] no `/cities/sg/...` route or sitemap entry exists
- [x] programme verification pending remains explicit
- [x] city-state compare behaviour remains intact
- [x] publication contract test protects the boundary

Next branch: `agent/sg-destination-qa-v1`
