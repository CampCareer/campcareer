# Singapore study destination profile v1

Status: `PHASE_5_COMPLETE`

Branch: `agent/sg-destination-profile-v1`

Parent: `agent/sg-destination-metrics-v1`

Date: 2026-08-10

## Result

Phase 5 connects the verified Singapore country-level destination foundation to the existing `/sg` hub.

No `/cities/sg/...` route is introduced.

## Server profile

New server-only loader:

`src/lib/destinations/sg-destination-profile.server.ts`

It reads only the bounded service-role views created in Phases 2–4:

- `study_destination_sg_v1`
- `study_destination_institution_sg_v1`
- `study_destination_metric_sg_v1`

The loader returns:

- country/city-state scope
- linked institution and campus counts
- programme coverage state
- national population
- student living-cost range
- source-native transport references
- conditional school-term foreign-student work-rights reference
- source-bounded tuition range
- Student's Pass application processing fee
- national economic-sector context
- six verified universities and their primary locations
- metric source/provenance records

## `/sg` integration

The existing `/sg` route now loads the study-destination profile server-side and renders `SingaporeStudyDestinationProfile`.

Existing Singapore functionality remains intact:

- `/sg/jobs`
- MOM job-demand cards
- resident wage cards
- Singapore ROI/decision overview
- Central/East/North/North-East/West/CBD living-area map context
- work-pass caution and MOM links

The route is marked `force-dynamic` so build-time CI does not require Supabase service-role credentials and live destination evidence is read at request time.

## UI caveats preserved

The study profile explicitly states that:

- Singapore is one country-level city-state destination
- local areas are housing/commute context, not separate study cities
- the living-cost range is a reference scenario
- university-student transport concessions require eligibility
- the 16-hour school-term work reference is conditional
- the tuition range is not a universal national fee
- Tuition Grant obligation context remains visible
- programme delivery remains verification pending and is never inferred from institution/campus presence
- economic sectors are context, not shortage/job guarantees

## Contract test

`tests/sg-destination-profile-contract.test.ts`

The contract guards the country-level scope, bounded read models, programme-pending rule and preservation of the existing Singapore jobs/living-area paths.

## Phase 5 checkpoint

`DESTINATION_PROFILE_READY`

Next: finalize the Singapore decision/compare contract. Because Singapore has no internal city shortlist, Phase 6 must explicitly keep City Compare out of SG while preserving living-area comparison and country-level decision paths.
