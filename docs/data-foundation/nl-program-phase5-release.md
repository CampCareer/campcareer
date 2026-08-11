# NL Programs Phase 5 — public release

Date: 2026-08-10

## Scope

Phase 5 publishes the bounded Netherlands canonical programme cohort created in Phases 1–4. It does not expand programme collection, promote unresolved HBO provider identities, infer programme campuses, or fabricate Netherlands occupation profiles.

## Public catalogue boundary

Production `program_detail_nl_v1` contains 26 canonical programmes. All 26 are Tier A, publication-ready and indexable. Tier C rows remain outside the canonical public reader. Programme-specific canonical city/campus linkage remains zero.

The application does not expose internal verification-tier terminology in the product UI.

## Routing

The Netherlands is enabled on the shared programme explorer at `/programs?country=NL`.

Programme details use stable source-derived slugs at `/programs/nl/[program]`, derived from `institution_slug + source_program_key`. The 26-programme production cohort has 26 distinct source-derived routes.

The application reads the canonical Phase 4 `program_detail_nl_v1` service-role view and does not read NL staging tables directly.

## Explorer

The NL explorer supports programme/institution text search, shared study-level filters where they map cleanly to the canonical NL level, verified-source filtering, recommended/shortest-duration/programme-name sorting and pagination at 20 programmes per page.

Programme cards keep separate programme identity, Dutch recognition evidence, international-student eligibility, recognised sponsor evidence and the current application state.

Raw source city text is not presented as a canonical programme location.

## Detail pages

NL programme detail pages expose current official programme, recognition, international-student, recognised-sponsor and admission source links where available. Dutch framework metadata including ECTS, NLQF/EQF and native level information is preserved from the Phase 4 canonical model.

Programme existence, recognition, institutional sponsor status and current admission availability remain separate facts. The UI does not infer an open application window from programme existence or sponsor status.

The current canonical cohort contains one verified closed application cycle, University of Amsterdam Business Analytics, and 25 records where the current application schedule is not confirmed.

## SEO

All 26 public NL detail records are indexable. `INDEXABLE_NL_PROGRAM_PATHS` contains exactly the 26 source-derived canonical routes. Filtered programme explorer URLs remain noindex while the NL base explorer is indexable.

## Sitemap

`src/app/sitemap.ts` consumes `INDEXABLE_NL_PROGRAM_PATHS` and publishes the 26 canonical NL programme routes.

## Security

The browser does not query Phase 4 programme views directly. NL programme reads use the server-side Supabase admin client against service-role-only `security_invoker` views.

Production Phase 4 verification remains: anon SELECT blocked, authenticated SELECT blocked, service_role SELECT allowed.

## Regression coverage

Phase 5 adds `tests/nl-program-phase5-publication.test.ts` covering shared explorer enablement, canonical read-model-only server access, stable source-derived slugs, exactly 26 indexable SEO routes, detail-route admission/indexability semantics, internal pipeline copy exclusion and sitemap integration.

Phase 3 and Phase 4 regression tests remain in place.

## Release rule

Phase 5 is complete when the branch head passes the repository validation pipeline. Main merge and Vercel production deployment are explicitly outside this handoff. PR #156 remains Draft / Open / Unmerged until an explicit merge instruction.
