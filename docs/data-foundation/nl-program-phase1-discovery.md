# NL Programs — Phase 1 Discovery

Date: 2026-08-10
Branch: `agent/programs-nl`
Scope: Netherlands only. Do not advance to another country without explicit user instruction.

## Phase 1 goal

Establish the Netherlands programme-data baseline before collection:

1. audit existing CampCareer NL programme and institution data;
2. define the Dutch higher-education and programme-recognition model;
3. define the institution universe and inclusion rules that Phase 2 will use.

Phase 1 does not publish new programmes and does not expand another country.

## 1. Existing CampCareer baseline

### Programme data

The current NL programme layer is effectively empty:

- there is no `public.courses_nl` or `ingest.courses_nl` legacy programme table;
- `catalog.programmes` currently contains 0 programmes attached to NL institutions;
- there is no `public.program_occupation_nl_staging` table;
- `public.country_occupation_profiles` currently contains 0 NL rows.

Unlike UK and Canada, NL therefore has no legacy programme cohort to refresh. Phase 2 should be source-first collection from current official Dutch/provider sources.

### Institution data

The existing NL institution foundation contains 13 canonical institutions:

- `public.institution_identity_nl_v1`: 13 rows;
- `public.institution_explorer_nl_v1`: 13 rows;
- `public.colleges_nl`: 13 rows;
- `ingest.colleges_nl`: 13 rows;
- `catalog.institutions`: 13 active NL institutions.

All 13 canonical institutions have official `NL_BRIN` identifiers sourced from DUO/RIO. The current seed is:

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

The current identity foundation was created from DUO/RIO and should be reused rather than recreated.

The 13-row legacy institution snapshot was synced once on 2026-07-08. Its ranking/cost fields are not programme evidence and must not be used to infer current programme availability.

### Geography

There is currently no NL city-programme canonical read model. Programme campus/city must therefore be established from programme-specific official evidence in later phases and must not be inferred from the institution's main address.

## 2. Dutch education and recognition model

### Binary higher-education system

The Netherlands has a binary higher-education system:

- `WO` / wetenschappelijk onderwijs: research-oriented university education;
- `HBO` / hoger beroepsonderwijs: professionally oriented higher education, mainly delivered by universities of applied sciences (`hogescholen`).

CampCareer must preserve this distinction because many of the 80 target careers are better represented by HBO professional programmes than by WO research-university programmes.

Official reference:
https://www.government.nl/themes/education/secondary-vocational-education-mbo-and-tertiary-higher-education/tertiary-higher-education

NVAO notes that professional higher education represents a large share of Dutch higher education and that the Netherlands has 37 publicly funded universities of applied sciences. The existing 13-institution CampCareer seed is therefore not a sufficient nationwide programme universe.

Official reference:
https://www.nvao.net/en/the-netherlands

### Programme recognition

For higher education, institution identity alone is not sufficient. Programme recognition must be verified at programme level.

The authoritative chain is:

1. NVAO accreditation / quality decision;
2. DUO Registratie Instellingen en Opleidingen (`RIO`) current recognition record;
3. official institution programme page for current title, delivery form, location, duration and admissions evidence.

DUO states that RIO contains accredited higher-education programmes and recognition/licence information. The current `Overzicht Erkenningen ho` is the official open-data source for current OCW-recognised higher-education institutions and programmes and is updated daily.

Official references:
https://www.duo.nl/zakelijk/hoger-onderwijs/studentenadministratie/opleidingsgegevens-in-croho/raadplegen-en-downloaden.jsp
https://onderwijsdata.duo.nl/datasets/overzicht-erkenningen-ho

NVAO accreditation covers Associate Degree, Bachelor's and Master's programmes in both professional and academic higher education. Programme variants and locations are material accreditation/registration facts and should be preserved when available.

Official reference:
https://www.nvao.net/en/procedures/the-netherlands/accreditation-of-existing-programme

## 3. International-student evidence

Programme recognition and immigration sponsorship are separate facts.

For HBO/university study residence permits, IND currently requires, among other conditions:

- registration at a university of applied sciences or university;
- an accredited programme;
- the educational institution to be an IND-recognised sponsor;
- full-time study.

Official reference:
https://ind.nl/nl/verblijfsvergunningen/studie/verblijfsvergunning-studie-hbo-of-universiteit

The IND public Study sponsor register is updated monthly and should be stored as institution-level international evidence. Presence in that register does not prove that every programme is currently open to international applicants.

Current Phase 1 sponsor source checked: register updated 2026-07-01.

Official reference:
https://ind.nl/en/public-register-recognised-sponsors/public-register-study

MBO / vocational study uses a separate residence-permit route with materially stricter eligibility conditions. MBO should therefore not be treated as equivalent to HBO/WO for CampCareer international programme publication.

Official reference:
https://ind.nl/en/residence-permits/study/student-residence-permit-secondary-or-vocational-education

## 4. Institution scope for Phase 2

### Tier A — existing WO seed

Start with the existing 13 canonical research-university institutions because they already have stable CampCareer UUIDs, slugs and official BRIN identities.

The Dutch university sector has a wider recognised universe than this seed. For example, Universiteiten van Nederland represents 14 universities and includes Open Universiteit Nederland. Missing institutions should be added only when an exact target-career programme justifies inclusion and official identity/recognition is verified.

Reference:
https://www.universiteitenvannederland.nl/cao/algemeen/definities-en-afkortingen

### Tier B — universities of applied sciences / HBO

HBO providers are required expansion scope, not optional cleanup.

Include a university of applied sciences when:

1. the provider has a stable DUO/RIO identity;
2. the exact programme is current and NVAO/RIO-recognised;
3. the programme maps to one or more of the 80 target careers;
4. current official provider programme evidence is available;
5. for international publication, IND recognised-sponsor status and programme-level international eligibility are verified.

Priority HBO domains include health/allied health, nursing, teaching, engineering, ICT, logistics, hospitality, agriculture, design/media, built environment and applied business programmes.

### Tier C — conditional MBO and private higher education

MBO providers may enter collection only for target careers where the vocational route is substantively important and the international-study conditions are explicitly supportable. Do not bulk-ingest MBO institutions merely because they exist in RIO.

Private higher-education providers may enter collection only when the exact programme has Dutch-recognised accreditation/registration and the provider identity is independently resolvable. For international publication, recognised-sponsor status remains a separate requirement.

### Default exclusions

Exclude unless an exact target-programme exception is demonstrated:

- unaccredited programmes;
- short courses without recognised programme status;
- language-only schools;
- pathway/foundation entities that do not own the substantive recognised programme;
- providers supported only by ranking or aggregator pages;
- distance/online offers where the delivery and international residence implications are unclear;
- MBO programmes whose international residence requirements are not supportable from official evidence.

## 5. Source hierarchy for collection

Phase 2 should use this source order:

1. DUO/RIO institution and programme identity/recognition;
2. NVAO accreditation evidence;
3. official provider programme page for current programme facts;
4. IND recognised-sponsor register for institution-level study sponsorship;
5. official provider international admissions page for programme/applicant eligibility.

Aggregator sources may be used for discovery only, never as Tier A verification evidence.

Current official institution datasets checked in Phase 1:

- DUO higher-education institutions dataset: snapshot 2026-08-01, published 2026-08-03;
- DUO MBO institutions dataset: snapshot 2026-08-01, published 2026-08-03;
- DUO `Overzicht Erkenningen ho`: current RIO recognition data, daily update model;
- IND Study recognised-sponsor register: updated 2026-07-01.

## 6. Identity and modelling rules

- Keep CampCareer's internal country code `NL`.
- Reuse `NL_BRIN` as the primary existing external institution identity where present.
- Do not use legacy `NL_PROVIDER_ID` as an external/public identifier.
- Preserve WO vs HBO as a programme/provider classification dimension.
- Keep recognised programme identity separate from provider marketing title and specialisation/track labels.
- Store programme delivery form and location only when supported by current programme/RIO evidence.
- Do not infer international eligibility from IND sponsor status alone.
- Do not infer campus/city from institution headquarters.

## 7. Phase 1 decision

NL Phase 1 is complete enough to start collection with these rules:

- there is no reusable legacy NL programme catalogue; collection starts fresh;
- reuse the existing 13 BRIN-backed canonical institutions as the initial WO seed;
- expand programme-first into HBO because university-only collection would systematically miss major career pathways;
- use DUO/RIO + NVAO as the recognition backbone;
- use IND sponsor evidence separately for international-study eligibility;
- treat MBO as conditional because the international residence route is materially more restrictive;
- do not create programme-city links without programme-specific location evidence.

No production schema or catalogue rows are changed in Phase 1.

## Phase 2 handoff

When Phase 2 starts, create a new NL programme staging layer rather than inventing a `courses_nl` legacy surface.

Expected separation:

- programme source identity and current official URL;
- institution BRIN/RIO identity;
- WO/HBO/MBO sector;
- recognised programme/accreditation evidence;
- qualification/programme type;
- delivery form and programme-specific location;
- international-student eligibility evidence;
- IND study sponsor evidence;
- occupation linkage to the canonical 80 target careers;
- source checked/collected timestamps.

Phase 2 should remain Netherlands-only and collect source-first, programme-by-programme.