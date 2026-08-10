# New Zealand city main integration v1

Status: `PHASE_9_INTEGRATION_READY`

Branch: `agent/nz-cities-main-integration-v1`

Base main commit: `96acf1a5607f16dc6cf8432919035daf9346b849`

Source QA branch: `agent/nz-cities-qa-v1`

## Purpose

Integrate the Phase 0–8 New Zealand city rollout onto the current main baseline without replaying the historical QA branch directly over hundreds of newer main commits.

## Integration method

The integration branch was created from the current main commit. New Zealand-specific runtime, migration, test and data-foundation files were transplanted from the Phase 8 QA tree without content changes.

The three shared files were reconciled manually against current main:

- `src/lib/cities/city-routes.ts`
- `src/app/(workspace)/compare/page.tsx`
- `src/app/sitemap.ts`

Current main changes were preserved, including the Canada City Compare `sharedCareerCount` contract and UK program sitemap publication. New Zealand routing, Compare support and sitemap publication were then added on top.

## Scope

Published New Zealand cities remain exactly:

- Auckland
- Christchurch
- Hamilton
- Wellington
- Dunedin

Deferred cities remain outside publication and Compare allowlists.

## Phase 9 gate

Phase 9 is complete only after the integration PR against main passes repository CI and the diff confirms no unrelated main regressions.

Phase 10 may then merge the integration PR to main and verify the resulting production deployment state.
