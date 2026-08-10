# Netherlands city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/nl-cities-readiness-v1`

Base main: `e41f7cd6fe95821d895d72b7236614410574d9be`

Audit date: 2026-08-10

Verdict: `READY_WITH_GATES`

## Purpose

Establish the authoritative education, provider, programme, geography and production-data baseline required before selecting the first public Netherlands `/cities` cohort.

Phase 0 is diagnostic only. It does not mutate production data, publish city routes, alter SEO/indexing, or infer programme delivery from institution or campus presence.

## Product identity

Current canonical country contract:

- country code: `NL`
- country name: Netherlands
- currency: `EUR`
- existing country hub: `/nl`
- intended city route contract: `/cities/nl/{city-slug}`

The existing `/nl` page is a broader work/live/study country hub. The city rollout must remain a separate study-destination layer until later publication phases deliberately connect the surfaces.

## Dutch higher-education structure

The Netherlands uses a binary higher-education model:

- `WO` / wetenschappelijk onderwijs: research-oriented higher education, mainly universities;
- `HBO` / hoger beroepsonderwijs: professionally oriented higher education, mainly universities of applied sciences.

MBO vocational education is a separate sector and has materially different international-study conditions. It must not be treated as equivalent to HBO/WO in the city-study rollout.

The current CampCareer NL institution foundation is the 13 research-university cohort. This is a strong stable identity base but not a complete national higher-education provider universe. City-level institution coverage must therefore avoid implying that HBO providers are absent from a city merely because they are not yet canonical in this foundation.

## Authoritative provider and programme identity

### Provider identity

Primary existing external identifier: `NL_BRIN`.

The current 13 canonical NL institutions each have a DUO-backed BRIN identifier. The older `NL_PROVIDER_ID` values are CampCareer legacy/internal identifiers and must not replace BRIN as the authoritative external identity.

Primary source family:

- DUO / RIO higher-education institution data
- DUO higher-education addresses data

### Programme recognition

Programme recognition and city delivery are separate facts.

Use this authority chain:

1. DUO Registratie Instellingen en Opleidingen (`RIO`) for current recognised institution/programme identity and recognition/licence information;
2. NVAO for accreditation/quality status where applicable;
3. official institution programme pages for current title, study form, campus/location, duration and admissions facts;
4. explicit programme-offering/location evidence before assigning a programme to a public city.

Required invariant:

`institution in city != programme delivered in city`

`campus/location row != programme delivered at that location`

## International-student evidence

For university/HBO study residence permits, institution sponsor recognition and programme recognition are separate conditions.

Use IND as the authority for:

- recognised study sponsors;
- student residence permit conditions;
- student work-rights conditions.

IND sponsor status is institution-level evidence and must not be used to infer that every programme is internationally available.

## Geography authority

For Phase 1 selection, Nuffic's incoming degree-mobility analysis provides a current municipality-level international-student demand signal based on DUO registration data.

For Phase 2 normalization and Phase 4 population metrics, use CBS municipality geography as the primary public city boundary unless a city-specific reason requires a different documented scope.

Do not mix municipality, metropolitan region and province values under one city label.

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-10.

### Country

`core.countries` contains active canonical country `NL` / Netherlands with default currency `EUR`.

### Geography

Production contains 12 active NL city geography rows:

1. Amsterdam
2. Delft
3. Eindhoven
4. Enschede
5. Groningen
6. Leiden
7. Maastricht
8. Nijmegen
9. Rotterdam
10. Tilburg
11. Utrecht
12. Wageningen

Current geography quality:

- active: `12/12`
- coordinates present: `12/12`
- region code present: `12/12`
- canonical slug present: `0/12`
- `scope_kind` present: `0/12`

These UUIDs and coordinates are reusable. Phase 2 must normalize slugs and exact scope metadata rather than recreate the city records.

### Institutions

Production contains 13 active canonical NL institutions.

Quality:

- active: `13/13`
- canonical slug: `13/13`
- official HTTPS website: `13/13`
- DUO-backed `NL_BRIN`: `13/13`

Current cohort:

- Delft University of Technology
- Eindhoven University of Technology
- Erasmus University Rotterdam
- Leiden University
- Maastricht University
- Radboud University
- Tilburg University
- University of Amsterdam
- University of Groningen
- University of Twente
- Utrecht University
- Vrije Universiteit Amsterdam
- Wageningen University & Research

This cohort is WO-heavy by design and is not an exhaustive Dutch provider universe.

### Campus/location rows

Production contains 26 active NL campus/location rows.

Quality:

- geography link: `26/26`
- locality geography link: `26/26`
- source URL: `13/26`
- precise coordinates: `13/26`

The current structure contains a registry-backed `Registered institution location` row and an older unsourced `{City} listed campus` row for the same institution/city pattern. Phase 3 must reconcile these duplicate/legacy location layers rather than counting both as independent campuses.

The DUO registered-location rows are useful provider-location evidence. They are not sufficient proof of complete teaching-campus inventory or programme delivery.

### Programmes and offerings

Production now contains:

- canonical NL programmes: `26`
- active canonical NL programmes: `26`
- canonical NL programme view rows: `26`
- NL programme staging rows: `37`
- NL international staging rows: `37`
- NL programme compare rows: `26`
- explicit NL programme offerings: `0`
- verified NL programme offerings: `0`

Programme identifier coverage:

- programme identifier rows: `41`
- identifier rows with source URL: `41/41`
- programmes with at least one identifier: `26/26`
- `NL_RIO_PROGRAM_CODE` rows: `15`
- `NL_PROGRAM_SOURCE_HASH` rows: `26`

Canonical programme quality gaps:

- duration populated: `26/26`
- qualification-level link populated: `0/26`
- canonical field code populated: `0/26`

The 26 programmes are reusable as programme identities only. Because there are no explicit programme offerings, they must not currently contribute to city programme counts or city delivery claims.

### Country-level evidence

`public.report_metric_evidence_country` contains eight reviewed, source-backed NL evidence rows:

- `average_annual_salary`
- `full_time_annual_earnings_range`
- `national_minimum_hourly_wage`
- `student_living_cost_monthly_range`
- `student_work_hours_limit`
- `tuition_annual_high`
- `tuition_annual_low`
- `visa_application_fee`

These remain country-level evidence. National rules such as student work rights must stay separate from city differentiators in Phase 4.

### NL city read models

No NL-specific city publication/read-model layer currently exists.

Phase 0 introduces none.

## Reusable foundation

The following can be reused safely in later city phases:

1. canonical country `NL` and currency `EUR`;
2. existing `/nl` country hub as a separate country-level surface;
3. all 12 existing city geography UUIDs, coordinates and region codes;
4. all 13 canonical research-university identities and BRIN identifiers;
5. the 13 DUO-sourced registered institution-location rows as provider-location evidence;
6. the 26 current canonical programme identities and their source-backed identifiers;
7. the eight verified country-level evidence rows;
8. DUO/RIO, NVAO, IND, Nuffic and CBS as the core authority families for later phases.

## Data that must not be treated as publication-complete

Do not treat the following as complete city data:

1. the current 12 city rows, because slugs and scope semantics are not normalized;
2. the 26 campus rows, because half are unsourced legacy duplicates and the set is not a verified teaching-campus inventory;
3. the 13-institution WO cohort, because HBO providers materially affect Dutch higher education and city study options;
4. the 26 canonical programmes, because no explicit city/campus offering relationship exists;
5. the current country metrics as city-specific evidence.

## Phase 0 blockers and remediation

### Blocker 1: geography publication metadata is incomplete

Current state: `0/12` NL cities have canonical slugs or `scope_kind`.

Remediation: Phase 2 must preserve existing UUIDs and normalize exact municipality-based scope, slug and supported metadata for the selected Tier A cities.

### Blocker 2: campus/location duplication

Current state: 26 active location rows, but only 13 are source-backed and precisely geocoded.

Remediation: Phase 3 must reconcile the legacy listed-campus rows against DUO and official institution campus evidence. Do not double-count duplicate institution/city locations.

### Blocker 3: no explicit programme offerings

Current state: 26 canonical programmes, 0 offerings.

Remediation: city programme coverage remains `verification_pending` until explicit source-backed programme-to-campus/location offerings exist.

### Blocker 4: programme normalization gaps

Current state: canonical qualification-level and field-code links are absent across the 26 programme rows.

Remediation: preserve the current programme identity work, but complete qualification/field normalization before those attributes become city filtering or comparison dimensions.

### Blocker 5: provider universe is WO-heavy

Current state: 13 canonical research universities are stable, but major HBO providers are not represented in the canonical institution layer.

Remediation: Phase 3 should expand provider coverage where omission would materially misrepresent a selected Tier A city, using BRIN/RIO identity and official campus evidence. If expansion is intentionally deferred, the UI must disclose that institution coverage is not exhaustive.

## Readiness gates

NL may proceed to Phase 1 if the following rules remain fixed:

1. Tier A selection uses current study-demand and verified provider-location evidence, not the existing 12-row seed alone;
2. Phase 2 preserves existing geography UUIDs and normalizes rather than recreates selected cities;
3. Phase 3 reconciles duplicate campus rows before publication counts;
4. programme delivery is never inferred without an explicit offering/location relationship;
5. HBO coverage is either added where materially necessary or explicitly disclosed as incomplete;
6. municipality and wider metro/province metrics are never silently mixed.

## Phase 0 result

Netherlands Phase 0 is complete.

Verdict: `READY_WITH_GATES`

Production mutation: `NONE`

Route/publication change: `NONE`

Next branch: `agent/nl-cities-scope-v1`
