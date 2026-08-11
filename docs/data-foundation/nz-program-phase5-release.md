# NZ Programs — Phase 5 Release

Date: 2026-08-10  
Branch: `agent/programs-nz`  
Scope: New Zealand only. Phase 5 publishes the existing verified/canonical 24-program occupation-led cohort. It does not broaden collection, add a new provider class, infer programme locations, merge to `main`, deploy production, or start another country.

## Release cohort

The public cohort is exactly the Phase 4 canonical cohort:

- 24 programmes;
- 8 canonical New Zealand universities;
- 24 / 24 `indexable`;
- 24 unique stable public slugs;
- 39 reviewed programme↔career relations;
- 35 distinct careers from CampCareer’s canonical 80 programme-matching occupation set;
- 0 relations outside the canonical 80;
- current admission state: `open` 6 / `eligible_schedule_unknown` 18;
- programme-level canonical campus/city links: 0.

No programme was added for catalogue breadth.

## Public routes

Explorer:

- `/programs?country=NZ`

Stable detail route:

- `/programs/nz/<institution-slug>-<source-program-key>`

The stable slug is derived from canonical institution slug + source programme key rather than database-generated staging IDs.

## Public application layer

Added:

- `src/lib/programs/nz-programs.server.ts`
- `src/lib/programs/nz-program-seo.ts`
- `src/app/(workspace)/programs/nz-programs-explorer.tsx`
- `src/app/(workspace)/programs/nz/[program]/page.tsx`

Updated:

- `src/app/(workspace)/programs/programs-header.tsx`
- `src/app/(workspace)/programs/page.tsx`
- `src/app/sitemap.ts`

Regression coverage:

- `tests/nz-program-phase5-publication.test.ts`

## Server boundary

The application reads only `public.program_detail_nz_v1` through the server-only Supabase admin client.

The public application layer does not query NZ staging tables directly. The underlying Phase 4 views remain service-role-only, and only curated fields are rendered by the Next.js server layer.

## Explorer behavior

The NZ explorer exposes a compact occupation-led catalogue rather than a general New Zealand programme search product.

User-visible facts include:

- programme and university;
- qualification / degree level;
- NZQCF level and credits where source-backed;
- duration and study mode where available;
- current application-window state;
- reviewed CampCareer career relationships.

The explorer does not expose internal Tier A/B/C or phase labels.

## Detail behavior

Each public detail page keeps the evidence dimensions separate:

1. programme identity;
2. NZQCF qualification metadata;
3. international-student study route;
4. provider Code context;
5. current application timing;
6. programme approval/authority context;
7. Post Study Work Visa qualification-level context;
8. reviewed CampCareer career relations;
9. programme delivery location.

The page explicitly avoids presenting programme relevance as professional registration, licensing, visa approval or employment eligibility.

## Admission semantics

As of 2026-08-10:

- `open`: 6;
- `eligible_schedule_unknown`: 18.

A source-verified programme can be public/indexable even when CampCareer does not have a current open application window. The UI therefore says `Current application window not confirmed` instead of interpreting schedule-unknown as closed.

## Visa and Code boundary

Provider Code evidence remains separate from programme international eligibility.

Post Study Work Visa text is shown as qualification-level context only. It is not rendered as an applicant-specific entitlement or visa guarantee.

The Phase 3 effective-date policy remains unchanged: announced future immigration rules are not silently treated as current rules.

## Location boundary

No programme-specific city or campus is displayed.

The Phase 5 application does not use institution geography as a proxy for programme delivery. Location fields remain absent/null until an authoritative programme-delivery relation exists.

## SEO / sitemap

A static allowlist contains exactly 24 stable NZ programme slugs.

Detail metadata indexes a route only when both conditions hold:

- canonical row says `indexable = true`;
- slug exists in the Phase 5 SEO allowlist.

The global sitemap includes only those 24 NZ programme detail paths.

Filtered explorer URLs remain non-indexable; the unfiltered NZ explorer uses the shared country canonical metadata behavior.

## Release decision

NZ Programs Phase 5 is complete when application CI passes on the Phase 5 branch head.

The branch remains Draft / Open / Unmerged until explicitly requested. No Vercel production deployment is triggered by this phase.
