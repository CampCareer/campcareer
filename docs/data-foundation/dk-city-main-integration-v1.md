# Denmark city main integration v1

Status: `PHASE_9_COMPLETE`

Integration state: `READY_FOR_PHASE_10_RELEASE_APPROVAL`

Branch: `agent/dk-cities-v1`

Base main commit: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Draft PR: `#203` — unmerged

Audit date: 2026-08-10

## Single-country branch policy

Denmark is the first Cities rollout using the user-directed one-country/one-branch policy. Phases 0 through 9 are accumulated on `agent/dk-cities-v1`; no stage-specific integration branch is created.

## Current-main reconciliation

Current `main` was rechecked at the Phase 9 gate and remains `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`.

GitHub comparison confirms the Denmark branch is zero commits behind current main, so no main-only commit requires transplantation or conflict reconciliation.

## Integrated scope

The release candidate contains:

- Phase 0 country readiness;
- Phase 1 exact five-city Tier A scope;
- Phase 2 Statistics Denmark municipality normalization;
- Phase 3 official university location and source-city programme linkage;
- Phase 4 five verified metrics per city;
- Phase 5 city profiles;
- Phase 6 Denmark City Compare;
- Phase 7 publication and SEO;
- Phase 8 cross-phase QA;
- Phase 9 current-main integration gate.

Published cities remain exactly Copenhagen, Frederiksberg, Odense, Aarhus and Aalborg.

Deferred cities remain outside publication: Lyngby, Roskilde, Sønderborg, Kolding and Esbjerg.

## Production state

Production already contains the three Denmark city migrations and requires no Phase 9 database mutation.

Verified production state:

- 5 Tier A city rows;
- 7 verified university locations;
- 115 verified-partial programme rows;
- 25 verified metric rows;
- 0 Tier B publication leaks;
- service-role-only `security_invoker` city read models.

## Validation

The Phase 8 code head passed GitHub Actions CI run `#1169` (`31430307207`) through dependency audit, typecheck, lint, full tests, production build and Git-history secret scan.

The final Phase 9 documentation head must retain the same CI contract before Phase 10.

## Release boundary

Draft PR `#203` targets `main` and remains intentionally unmerged.

Phase 10 is explicitly deferred. No main merge or deployment is performed in Phase 9.

Result: Denmark Cities Phase 0–9 is complete and ready for a separately approved Phase 10 release.
