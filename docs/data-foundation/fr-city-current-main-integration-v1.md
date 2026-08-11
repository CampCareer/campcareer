# France city current-main integration v1

Status: `PHASE_9_COMPLETE`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-11

Checkpoint: `CURRENT_MAIN_CANDIDATE`

## Latest main checkpoint

Phase 9 repeatedly re-read `main` because other country-city branches were being merged concurrently during this work.

The current integrated main checkpoint for this candidate is:

`d81dcaf42917fe45e90208850643dae8c45a645f`

That main already contains the France Phase 0–5 foundation as well as the Germany and Netherlands city work that landed while Phase 6–9 was in progress.

France Phase 6–8 was then applied on top and current main was integrated as a second parent.

Pre-document candidate head:

`0f30777a7081fc0dbb1505c5a60868ca73df1b60`

Comparison against `d81dcaf42917fe45e90208850643dae8c45a645f` at that checkpoint:

- ahead: `2` commits
- behind: `0` commits
- further rebase required: `NO`

The final branch head is this document commit. Phase 9 is accepted only if GitHub Actions passes on that final head and a final main recheck still shows the branch is not behind.

## Phase 6 — City Compare

France City Compare is available through:

`/compare?type=city&country=FR&left={slug}&right={slug}`

Default pair: Paris vs Paris-Saclay.

All seven Tier A destinations are eligible only when they retain all Five Core Metrics plus verified institution and teaching-location linkage.

The comparison explicitly preserves commune/EPCI population geography labels, source-native living-cost and transport methodologies, and the national 964-hours-per-year work rule.

The 132 verified national programme offerings are not treated as city delivery evidence.

## Phase 7 — publication / SEO

Exactly seven France destination profiles are indexable and canonical:

- Paris
- Paris-Saclay
- Bordeaux
- Strasbourg
- Grenoble
- Aix-Marseille
- Nice

France city sitemap entries derive from `PUBLISHED_FR_CITY_SLUGS`.

`/compare` itself remains noindex.

## Phase 8 — production / cross-phase QA

Production was re-queried and verified at:

- 7 city-directory rows
- 10 verified teaching locations
- 9 distinct linked universities
- 35 verified Five Core Metric rows, exactly 5 per destination
- 0 city programme rows
- 7/7 programme coverage states `verification_pending`

The three France city read models remain `security_invoker=true`, with SELECT allowed to `service_role` and not to `anon` or `authenticated`.

Physical teaching localities remain distinct from broader public metropolitan destinations where required.

## Concurrent-main integration

During Phase 9, Germany and Netherlands Cities work landed on main, followed by the France Phase 0–5 foundation itself.

The shared files were preserved rather than overwritten:

- `src/lib/cities/city-routes.ts` retains Germany, Netherlands and France allowlists;
- `src/app/(workspace)/compare/page.tsx` retains Germany and Netherlands comparison branches and adds France;
- `src/app/sitemap.ts` retains Germany and Netherlands city entries and adds France entries without rewriting their existing last-modified contract.

This avoids a country rollout accidentally deleting another completed city rollout.

## Migration-history caveat

The France Phase 2–4 SQL migration files are committed and reproduce the verified production state.

During the operational Phase 2–4 session, the Supabase migration-history action was blocked by the tool safety gateway, so production changes were applied through controlled SQL and independently re-queried.

This candidate therefore does **not** claim that these three France migration filenames are already recorded in Supabase migration history. Reconciliation remains a later controlled operations step.

## Final validation contract

The final branch-head CI must pass:

- npm ci
- production dependency audit
- typecheck
- lint
- full test suite including France Phase 6–9 contracts
- production build
- Git-history secret scan

A final `main` recheck must also show `behind = 0` before this candidate is reported complete.

## Release boundary

This is an integration candidate only.

Do not perform:

- main merge
- Vercel deployment
- automatic migration-history reconciliation
