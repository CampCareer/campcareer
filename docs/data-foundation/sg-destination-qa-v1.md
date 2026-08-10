# Singapore destination QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `CI_COMPLETE`

Current branch: `agent/sg-destination-qa-v1`

Parent branch: `agent/sg-destination-publication-v1`

## QA scope

Phase 8 validates the completed Singapore destination rollout across production data, read-model security, city-state routing, publication/SEO, programme disclosure, decision support and repository CI.

## Production Supabase verification

Project: `babylusxcknjerxtepoc`

Production migration history contains:

- `sg_destination_foundation_v1`
- `sg_destination_linkage_v1`
- `sg_destination_metrics_v1`

The production read models currently report:

- 1 Singapore country/city-state destination
- 6 linked canonical institutions
- 6 linked campus/location rows
- 0 linked canonical programmes
- programme coverage: `verification_pending`
- 8 verified destination metric rows
- 8 distinct metric keys
- 0 metric rows missing a source URL

The institution read model contains six distinct institutions and six distinct campus/location records. No row currently claims verified programme delivery.

## Read-model security

The following production views are `security_invoker=true`:

- `study_destination_sg_v1`
- `study_destination_institution_sg_v1`
- `study_destination_metric_sg_v1`

Privilege verification:

- `service_role`: SELECT allowed
- `anon`: SELECT not granted
- `authenticated`: SELECT not granted

This matches the server-only Singapore destination loader and preserves least-privilege access.

## City-state boundary

Singapore remains one country-level destination.

- canonical destination: `/sg`
- no `/cities/sg/...` route
- no Singapore city shortlist
- no national study metric duplication into synthetic city records
- living areas remain lifestyle/commute contexts only

`/compare?type=city&country=SG` continues to present city-state guidance instead of constructing an artificial city comparison matrix.

## Publication and SEO

Phase 7 publication is preserved:

- `/sg` has study-led metadata and canonical path `/sg`
- `/sg` is present in the sitemap
- `/cities/sg/...` is absent from the sitemap
- programme coverage remains explicitly verification pending

## Programme and evidence guardrails

- institution or campus presence is never used to infer programme delivery
- student transport concessions remain eligibility dependent
- student-work references remain conditional on applicable pass rules
- tuition/cost references remain bounded to their source scenario
- employment-sector context is not presented as an employment guarantee

## Automated cross-phase QA

Added `tests/sg-destination-qa-contract.test.ts` to assert the final Phase 2 through Phase 7 invariants across:

- one-destination city-state scope
- bounded institution linkage
- programme verification rules
- source-backed metric contract
- conditional student rules
- Singapore-specific city compare behaviour
- canonical `/sg` publication
- sitemap boundary

## CI result

Temporary draft PR #165 ran repository CI against the completed Phase 7 publication branch and the Phase 8 QA contract.

GitHub Actions CI run `31388308371` completed successfully on head `5176d3922e8821524cc70c16f947f319e5f2f84a`.

Validated checks:

- npm ci
- production dependency audit
- typecheck
- lint
- tests
- production build
- Git-history secret scan

## Phase 8 completion gate

- [x] production destination counts verified
- [x] production institution/campus counts verified
- [x] programme verification-pending state verified
- [x] all eight metric rows source-backed and verified
- [x] read-model security and grants verified
- [x] city-state route boundary verified
- [x] publication/SEO boundary verified
- [x] cross-phase QA contract committed
- [x] repository CI completed

Phase 8 checkpoint: `QA_COMPLETE`

Next branch: `agent/sg-destination-main-integration-v1`
