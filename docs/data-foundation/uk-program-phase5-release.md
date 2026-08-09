# UK Programs Phase 5 — public release

Date: 2026-08-09

## Scope

Phase 5 publishes the bounded UK canonical programme cohort created in Phases 1–4. It does not expand programme collection, add unverified providers, infer programme campuses, or fabricate UK occupation profiles.

## Public catalogue boundary

Production `program_detail_uk_v1` currently contains:

- 76 accessible canonical programmes.
- 75 publication-ready/indexable programmes.
- 1 accessible but noindex review programme: University of Glasgow — Community Development BA.
- 0 Tier C leaks.
- 0 programme-specific city/campus links.

The application preserves the Phase 4 publication boundary:

- Tier A: accessible and indexable.
- Tier B: accessible but noindex.
- Tier C: not exposed through the public UK programme reader.

Internal tier terminology is not shown in the product UI.

## Routing

UK is enabled on the shared programme explorer:

- `/programs?country=UK`

Programme details use stable source-derived slugs:

- `/programs/uk/[program]`

The slug is derived from `institution_slug + source_program_key`. The 76-programme production cohort was checked for collisions: 76 rows, 76 distinct slugs, 0 collisions.

The application reads the canonical Phase 4 `program_detail_uk_v1` service-role view. It does not read UK staging tables directly.

## Explorer

The UK explorer supports:

- programme/institution text search;
- shared study-level filters where they map cleanly to the UK canonical level;
- verified-source filtering;
- recommended, shortest-duration and programme-name sorting;
- pagination at 20 programmes per page.

Australia-specific tuition, state and city semantics are not presented as UK programme facts.

Programme cards keep separate:

- programme identity;
- international-student eligibility;
- Student sponsor evidence;
- current application state;
- reviewed CampCareer career relationships.

## Detail pages

UK programme detail pages expose current official source links and the canonical Phase 4 evidence already collected. The UI explicitly avoids representing programme existence as proof that applications are open.

CAS remains outside the static programme model. A Confirmation of Acceptance for Studies is student-specific post-offer evidence and is not inferred from sponsor status or generic programme eligibility.

Programme-specific campus/city remains absent because the current programme evidence does not establish delivery location. Institution presence is not used as a location proxy.

## SEO

SEO rules are deliberately stricter than catalogue accessibility:

- 76 detail records are accessible.
- 75 Tier A routes are in the static SEO allowlist and sitemap.
- the single Tier B Glasgow Community Development route is accessible but `noindex`.
- Tier C routes do not exist in the public reader.
- filtered programme explorer URLs are noindex; the UK base explorer is indexable.

## Sitemap

`src/app/sitemap.ts` consumes `INDEXABLE_UK_PROGRAM_PATHS`. The allowlist contains exactly 75 unique Tier A programme routes and excludes the Glasgow Tier B route.

## Security

The browser does not query Phase 4 programme views directly. UK programme reads use the server-side Supabase admin client against service-role-only `security_invoker` views.

Production verification remains:

- `anon` SELECT: blocked.
- `authenticated` SELECT: blocked.
- `service_role` SELECT: allowed.

## Regression coverage

Phase 5 adds `tests/uk-program-phase5-publication.test.ts` covering:

- UK shared explorer enablement;
- canonical read-model-only server access;
- stable source-derived programme slugs;
- exactly 75 indexable SEO routes;
- Glasgow Tier B exclusion from the SEO allowlist;
- accessible/noindex detail semantics;
- no internal Phase/Tier copy leakage;
- sitemap integration.

Phase 4 regression tests remain in place for canonicalization and read-model boundaries.

## Release rule

Phase 5 is complete when the final branch head passes dependency audit, typecheck, lint, tests and production build. Git-history secret scanning is tracked separately if it reports a pre-existing branch-history finding. Vercel preview validation must use a deployment built from the final Phase 5 head; an older READY deployment is not sufficient evidence for the final release head.

PR #133 remains Draft / Open / Unmerged until an explicit merge instruction.
