# Belgium Cities current-main integration v1

Status: `PHASE_9_COMPLETE`

Branch: `agent/be-cities-v1`

Checkpoint: `MAIN_INTEGRATION_READY`

Audit date: 2026-08-10

## Current-main reconciliation

The Phase 9 reconciliation was performed against current `main`:

- current main: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`
- validated Phase 8 code head: `32f156ec2d3643a5a45202b49df608ae72e354ba`
- Phase 8 CI: GitHub Actions run `31431882409` (#1191), success
- Phase 8 QA documentation head before this Phase 9 record: `379fb29716093adaf3f8dafaf8a5f37bb133da68`
- merge base at reconciliation: current `main`
- branch state before this Phase 9 documentation commit: 34 commits ahead / 0 behind

No rebase, transplant or conflict-resolution commit was required because the branch remained a direct descendant of current `main` at reconciliation time.

## Integrated Belgium Cities rollout

The single-country branch now contains the complete Belgium Cities Phase 0–9 rollout:

- Phase 0 readiness and evidence gates
- Phase 1 exact Tier A scope: Brussels, Ghent, Leuven, Antwerp, Louvain-la-Neuve, Liège
- Phase 2 Statbel/REFNIS geography contracts, including the Brussels-Capital Region and Louvain-la-Neuve special boundaries
- Phase 3 seven verified universities / seven verified teaching locations
- Phase 4 exactly 30 verified core metric rows, five per Tier A destination
- Phase 5 Belgium city profiles
- Phase 6 Belgium City Compare under `/compare?type=city&country=BE`
- Phase 7 indexable profile metadata and sitemap publication
- Phase 8 production, security, source and cross-phase QA

## Evidence boundaries preserved

- Brussels is not silently reduced to the City of Brussels municipality.
- Louvain-la-Neuve is not misrepresented as an independent municipality; its population contract uses Ottignies-Louvain-la-Neuve municipality.
- Source-native living-cost and transport evidence is not converted into a fabricated composite city score.
- The linked university set is an initial verified set, not a complete Belgian higher-education provider universe.
- The existing 188 verified Belgium programme offering records are not used as city programme delivery evidence.
- City programme rows remain 0 and all six published destinations remain `verification_pending` until explicit offering-to-teaching-location evidence is verified.
- Belgium city read models remain `security_invoker=true` and service-role-only.

## Release boundary

Phase 9 creates a current-main integration candidate only.

- keep PR draft/open/unmerged
- do not merge to `main`
- do not trigger Vercel deployment

The final branch-head CI must pass dependency audit, typecheck, lint, the complete test suite, production build and Git-history secret scan before this candidate is treated as validated for a later release action.
