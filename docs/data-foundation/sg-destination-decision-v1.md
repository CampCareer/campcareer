# Singapore study destination decision integration v1

Status: `PHASE_6_COMPLETE`

Branch: `agent/sg-destination-decision-v1`

Parent: `agent/sg-destination-profile-v1`

Date: 2026-08-10

## Result

Phase 6 finalizes Singapore's decision/compare contract without fabricating an internal city comparison.

Approved state:

- public destination scope: Singapore country/city-state
- canonical destination hub: `/sg`
- Singapore City Compare: `NOT_APPLICABLE`
- living-area comparison: supported through Singapore map context
- country comparison: remains the correct cross-destination comparison surface
- programme delivery: `verification_pending`

## Compare behaviour

Before Phase 6, `/compare?type=city&country=SG` fell through to the generic unsupported surface and pointed users toward Australian city comparison.

Phase 6 adds explicit Singapore city-state guidance instead.

The SG city-intent surface explains that CampCareer does not maintain a Singapore city shortlist and offers three relevant next actions:

1. open the Singapore destination at `/sg`
2. compare Singapore living/commute areas through `/map?country=sg&area=central`
3. switch to country comparison

No `getSgCityComparison`, Singapore city matrix, city shortlist or `/cities/sg/...` route is introduced.

## Decision hierarchy

The resulting Singapore decision flow is:

`Singapore destination -> study facts + institutions -> job/career context -> living-area context -> explicit programme evidence when available`

For comparisons outside Singapore:

`country comparison -> Singapore destination`

For location decisions inside Singapore:

`Singapore destination -> living/commute area context`

This keeps local-area convenience separate from canonical study-destination geography.

## Guardrails

- local areas are not canonical cities
- economic sectors are not shortage guarantees
- work-rights evidence remains conditional
- student transport concessions remain eligibility-dependent
- tuition is source/scenario bounded
- institution/campus presence does not imply programme delivery
- no programme count is published until explicit canonical offering evidence exists

## Contract test

`tests/sg-destination-decision-contract.test.ts`

The contract verifies the SG-specific city-state compare response and guards against introduction of a synthetic SG city loader or city metric model.

## Phase 6 checkpoint

`DESTINATION_DECISION_READY`

Singapore is complete through Phase 6.

Phase 7 should handle publication/SEO policy and release semantics separately. Phase 8+ should perform full QA, current-main integration and production release checks. No main merge or production application-code deployment is performed in Phase 6.
