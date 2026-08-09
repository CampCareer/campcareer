# United Kingdom city profile v1

Status: `PHASE_5_COMPLETE`

Current branch: `agent/uk-cities-profile-v1`

Parent metrics branch: `agent/uk-cities-metrics-v1`

## Purpose

Render the ten approved UK Tier A study destinations from the verified Phase 3 linkage read models and Phase 4 city metrics. Phase 5 is intentionally limited to City profile pages. Compare is Phase 6 and sitemap/index publication is Phase 7.

## Published profile allowlist

The profile route contract is exactly:

- `/cities/uk/london`
- `/cities/uk/manchester`
- `/cities/uk/birmingham`
- `/cities/uk/edinburgh`
- `/cities/uk/glasgow`
- `/cities/uk/cardiff`
- `/cities/uk/belfast`
- `/cities/uk/oxford`
- `/cities/uk/cambridge`
- `/cities/uk/bristol`

Leeds and Nottingham remain outside Tier A.

## Server read model

`src/lib/cities/uk-city-profile.server.ts` reads:

- `public.city_directory_uk_v1`
- `public.city_institution_directory_uk_v1`
- `public.report_metric_evidence_city`

It does not reconstruct city membership from raw campus names or infer programme delivery from institution presence.

The profile requires the five shared city metric keys:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Only `review_status = verified` metric evidence is loaded.

## Institution presentation

Institution cards use the Phase 3 verified city-institution directory. The underlying publication gate requires:

- canonical UK institution slug;
- 8-digit UKPRN;
- official institution website;
- verified official location evidence;
- explicit city-scope membership.

The profile links to `/institutions/uk/<institution-slug>` and the official institution website. Verified location names and postal codes are shown where available.

## Scope presentation

London is displayed as a Greater London study destination, matching the Phase 2 boundary contract.

The other nine cities retain their approved named-city/local-authority scope. The UI explicitly states that neighbouring authorities are not silently merged. Manchester therefore does not absorb Salford.

## Programme coverage

`linked_program_count = 0` is not presented to users as a claim that the city has zero programmes.

The UI displays `UK programme delivery verification pending` because the legacy UK programme catalogue has not yet established verified programme-offering-to-campus delivery for these city profiles. Programme delivery must remain absent until explicit official programme evidence is linked to a verified campus.

## Student visa work context

The profile preserves the Phase 4 qualification around the 20-hour reference:

- it is the term-time reference for full-time degree-level or above study at a compliant higher education provider;
- other Student visa study categories can have different or no work permission;
- full-time work outside term can be allowed where the relevant visa conditions are met.

The UI must not reduce this to an unconditional statement that every UK student can work 20 hours per week.

## Phase 5 route behaviour

`src/app/(workspace)/cities/uk/[city]/page.tsx`:

- uses the exact ten-city allowlist;
- returns `notFound()` for unsupported slugs;
- exposes canonical route metadata;
- remains `noindex, follow` during Phase 5;
- does not add the routes to the sitemap yet.

This keeps the pages renderable for product QA while reserving search publication for Phase 7.

## UI

`src/app/(workspace)/cities/united-kingdom-city-dashboard.tsx` renders:

- city/nation/scope context;
- population;
- indicative student living cost;
- source-native transport reference;
- qualified Student visa work context;
- verified institution/location cards;
- official economic-sector context;
- programme verification-pending state;
- metric source links.

No Compare CTA is added in Phase 5. Compare is a separate readiness gate in Phase 6.

## Completion gate

Phase 5 is complete when:

- all ten approved city slugs resolve through the UK profile route;
- the profile uses only the Phase 3 city linkage read models for institution membership;
- all five verified Phase 4 metrics are readable;
- London and named-city scope copy is preserved;
- programme delivery is not inferred;
- Student visa work copy retains eligibility qualifications;
- unsupported city slugs cannot render a UK profile;
- Compare and SEO publication remain deferred to their own stages.

Next branch:

`agent/uk-cities-compare-v1`
