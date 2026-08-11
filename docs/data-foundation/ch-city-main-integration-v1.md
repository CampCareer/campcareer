# Switzerland Cities — Phase 9 main reconciliation v1

Status: `PHASE_9_COMPLETE`
Checkpoint: `MAIN_READY_WITH_EXTERNAL_CI_LIMIT`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Authoritative main reconciliation

Phase 9 detected that `main` advanced while Switzerland Phase 6–8 was being implemented. The new authoritative main contained the completed Spain Cities release through Phase 10.

Authoritative main commit used for reconciliation:

`2019dbe23235171cb6bb6b848a95da20f31c5731`

Rather than retaining a stale common-file snapshot, the Switzerland branch was reconciled with that main commit through an actual two-parent merge commit. The latest main tree was used as the shared-file authority and the Switzerland-specific files were overlaid onto it.

This preserves the Spain Cities release while keeping Switzerland as a separate country delivery branch.

## Shared-file reconciliation

After the merge, only the Switzerland hooks were reapplied to the latest shared files.

### City routes

`src/lib/cities/city-routes.ts` preserves the current Spain publication contract and adds the exact Switzerland publication contract:

- Spain: `madrid, barcelona, valencia, sevilla, granada, malaga, bilbao`
- Switzerland: `zurich, lausanne, basel, lugano, fribourg, geneva`

### Compare dispatcher

`src/app/(workspace)/compare/page.tsx` preserves Spain Compare and adds Switzerland Compare alongside it:

- `getEsCityComparison` + `SpainCitiesCompareMatrix`
- `getChCityComparison` + `SwitzerlandCitiesCompareMatrix`

### Root sitemap

`src/app/sitemap.ts` preserves the Spain published City entries and adds the six Switzerland published City entries using the same publication allowlist authority.

No Spain route, comparison branch, or sitemap entry is removed by the Switzerland reconciliation.

## Switzerland release state

Phase 0–9 is complete for exactly:

`zurich, lausanne, basel, lugano, fribourg, geneva`

Validated controlled data contract:

- Tier A municipalities: 6
- geography aliases: 15
- verified university study-location representatives: 7
- verified-partial municipality programme links: 170
- verified City metrics: 30
- required metrics per City: 5
- Lausanne verified municipality programmes: 10
- EPFL Lausanne-labelled programmes excluded from Lausanne municipality linkage: 29

## Country isolation

Switzerland-specific migrations, read models, docs, tests, profile code and Compare code remain Switzerland-named and Switzerland-scoped.

The only shared hooks are the minimum required for:

- CH City route allowlisting
- CH City Compare dispatch
- CH sitemap publication

The Phase 9 merge reconciliation imports the current main history into the Switzerland branch but does not merge the Switzerland branch into main.

## Production state

Phase 9 does not apply Switzerland migrations to production.

Earlier Phase 2–4 validation executed the Switzerland migration chain transactionally against the current Supabase schema and rolled it back after confirming the expected cardinality. Production was therefore not mutated by that validation.

## CI state

Vercel remains externally blocked by the account deployment/build-rate limit. The status must not be represented as a successful remote build, but it also is not evidence of a Switzerland application build failure.

No GitHub Actions run was available for the branch during the Phase 8 check.

## Phase 9 conclusion

`agent/ch-cities-v1` is reconciled with the Spain-inclusive current main and is prepared as one Switzerland Cities Phase 0–9 delivery.

Main merge, production migration application and production deployment remain separate release actions and have not been performed by Phase 9.
