# Canada Programs — Phase 5 Release Checklist

Date: 2026-08-09
Branch: `agent/integrate-programs-canada`
PR: #49

## Publication boundary

- Raw Canada staging catalogue: 6,649 programmes.
- Reviewed target set: 1,940 distinct programmes with at least one approved relationship to the 80 target careers.
- Public list: 680 programmes.
- Indexable details: 558 programmes.
- Non-indexable public details: 122 programmes.
- Hidden publication holds: 1,260 programmes.
- Target-career coverage: 80/80 have at least one reviewed relationship; 75/80 have at least one indexable programme.
- PGWP remains a separate evidence state and is never inferred from admission or programme title.

## Product routes

- Canada explorer: `/programs?country=CA`
- Programme detail: `/programs/ca/[program]`
- Institution exact filter: `/programs?country=CA&institution=<slug>`
- Programme-city exact filter: `/programs?country=CA&city=<city>`
- Verified city profiles: Toronto, Vancouver, Montreal, Ottawa, Calgary, Waterloo, Edmonton.
- Canada city Compare uses published target-program totals plus shared target-career coverage.

## Programme-city boundary

- The public set currently contains 26 non-empty source city/campus values.
- 25 are geographic programme-city values exposed in the programme filter.
- `Ottawa - Perley Health` is retained as an Algonquin campus label and is not exposed as a separate city filter.
- City-profile availability is intentionally narrower than programme-city filter availability.

## SEO gate

- `/programs/ca/sitemap.xml` includes the Canada explorer plus only `publicly_listed=true AND indexable_detail=true` programme details.
- Indexable rows: 558.
- Missing sitemap titles: 0.
- Missing sitemap last-modified evidence: 0.
- Tier B indexable leak: 0.
- Tier C public leak: 0.
- Filtered explorer URLs remain non-indexable; the country explorer is canonical.

## Security gate

- `public.ca_program_publication_v1` uses `security_invoker=true`.
- `anon` and `authenticated` do not have direct SELECT access.
- `service_role` has SELECT access for server-side product queries.
- Tier C records cannot be loaded through the public Canada programme server path.

## UI copy gate

- User-facing Canada programme filters do not expose internal pipeline labels such as `Phase 3`, `Approved`, or raw `unknown` terminology.
- City and Compare copy uses source-backed/verified language rather than internal canonical-model terminology.
- PGWP `not confirmed` is explicitly not treated as `ineligible`.

## Automated verification

Required on the release HEAD:

1. `npm audit --omit=dev --audit-level=high`
2. Typecheck
3. Lint
4. Full test suite
5. Production build
6. Secret scan
7. Vercel preview deployment reaches READY
8. Preview smoke test for explorer, programme detail, institution filter, city filter, city profile, Compare, and Canada sitemap

## Release rule

Do not promote or merge solely because the publication data is frozen. Release requires both a green repository CI run and a READY Vercel preview for the same release HEAD. Production promotion is a separate step after preview smoke testing.
