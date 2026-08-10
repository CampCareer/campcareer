# New Zealand city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/nz-cities-readiness-v1`

Base main: `521c7ba3966caea3d4235880e3e00e7e06ce09d6`

Audit date: 2026-08-09

## Purpose

Establish the authoritative data, regulatory and geography contract required before selecting the first public New Zealand `/cities` cohort.

Phase 0 does not publish city routes, select Tier A cities, create city read models or infer programme delivery from institution presence.

## Product identity

Current CampCareer registry values:

- country code: `NZ`
- country slug: `new-zealand`
- country name: `New Zealand`
- currency: `NZD`
- current launch-country publication stage: `REVIEW_REQUIRED`
- mapReady: `true`
- intended city route contract: `/cities/nz/{city-slug}`

The existing `REVIEW_REQUIRED` country stage is a later publication coordination item. Phase 0 does not change it.

## National tertiary structure

New Zealand tertiary education is not one homogeneous provider system.

### Universities

New Zealand has eight universities. Universities New Zealand — Te Pōkai Tara, the New Zealand Vice-Chancellors' Committee, is the statutory body primarily responsible for university quality assurance.

For university academic programmes, the Committee on University Academic Programmes (CUAP) continues to exercise programme approval and accreditation in 2026. Universities New Zealand has announced a transition toward audited institutional self-accreditation, with CUAP expected to cease by the end of 2027.

CampCareer must therefore distinguish:

- provider identity and registry data;
- university programme approval/quality assurance;
- actual campus/location delivery evidence.

### Non-university tertiary providers

NZQA is the core quality-assurance authority for non-university tertiary education organisations and maintains the provider / qualification framework used for provider discovery and qualification verification.

The vocational sector is currently in structural transition. From 1 January 2026, ten regional polytechnics began operating as stand-alone institutions while NZIST remains a transitional entity for other divisions and programme handover. Further polytechnic changes are scheduled for 2027.

This makes the current university foundation substantially more stable than a broad all-provider city rollout. Polytechnic/PTE inclusion can be added later, but provider identity and current institutional status must be rechecked at the time of linkage.

## Authoritative provider identity

The canonical provider identifier for the current CampCareer NZ university foundation is:

`NZ_MOE_PROVIDER_NUMBER`

NZQA describes the provider number as the unique number assigned to an education provider, also referred to as the Ministry of Education number or provider code.

Current university provider numbers in production are:

- University of Auckland — `7001`
- University of Waikato — `7002`
- Massey University — `7003`
- Victoria University of Wellington — `7004`
- University of Canterbury — `7005`
- Lincoln University — `7006`
- University of Otago — `7007`
- Auckland University of Technology — `7008`

The existing identity migration and production rows already preserve the NZQA provider source URL for each identifier.

For later non-university expansion, use the same official provider number where available and revalidate the current provider legal identity against the latest NZQA / Education Counts registry because of the 2026–2027 VET restructure.

## Provider-recognition and quality source hierarchy

Use the following hierarchy.

### 1. NZQA Find Education Organisations

Primary uses:

- provider number / Ministry of Education provider code;
- provider type and current registered status;
- Code of Practice signatory status;
- provider-level qualification/programme discovery where exposed.

Source:

https://www.nzqa.govt.nz/providers/index.do

### 2. Universities New Zealand

Primary uses for the eight universities:

- authoritative eight-university sector membership;
- university quality-assurance framework;
- CUAP programme approval/accreditation status during the current transition.

Sources:

https://www.universitiesnz.ac.nz/universities

https://www.universitiesnz.ac.nz/quality-assurance

https://www.universitiesnz.ac.nz/quality-assurance/programme-approval-and-accreditation-cuap

### 3. Education Counts tertiary providers directory

Primary uses:

- government provider-directory reconciliation;
- provider number;
- institution contact/location fields;
- territorial authority / regional council context.

The directory reports a latest update of July 2026 at the time of this audit.

Source:

https://www.educationcounts.govt.nz/directories/list-of-tertiary-providers

### 4. Institution official websites

Primary uses:

- exact campus address and campus naming;
- teaching vs research/support location distinction;
- programme availability by campus;
- programme intake, duration and delivery mode.

A provider's presence in a city is never sufficient to infer that every programme is delivered in that city.

## Qualification and programme authority

The New Zealand Qualifications and Credentials Framework (NZQCF) is the national framework for quality-assured qualifications and credentials. It has ten levels.

Relevant higher-tertiary qualification structure includes:

- Level 7: Diploma, Bachelor's Degree, Graduate Certificate, Graduate Diploma;
- Level 8: Bachelor Honours Degree, Postgraduate Certificate, Postgraduate Diploma;
- Level 9: Master's Degree;
- Level 10: Doctoral Degree.

NZQA states that qualifications and credentials approved by NZQA or Universities New Zealand are listed on the NZQCF.

Source:

https://www2.nzqa.govt.nz/qualifications-and-standards/about-new-zealand-qualifications-credentials-framework/

For non-university providers, programme approval/accreditation must be verified through NZQA. For universities, use the Universities New Zealand/CUAP authority plus official university programme pages.

### Programme publication rule

A future city programme directory requires an explicit chain:

`city -> verified campus -> institution -> programme offering/delivery location -> programme`

Do not treat:

- an NZQCF qualification listing;
- an institution's existence in a city;
- an institution-level provider record;
- a generic university course catalogue

as proof of delivery at a specific city campus.

## International-student eligibility

The Education (Pastoral Care of Tertiary and International Learners) Code of Practice 2021 applies to international learners. NZQA states that an education provider must be an approved Code signatory before it can enrol international students.

Sources:

https://www2.nzqa.govt.nz/tertiary/the-code/

https://www2.nzqa.govt.nz/tertiary/the-code/the-code-for-education-providers/becoming-a-signatory-to-the-code/

For later programme-level international-student claims, provider Code-signatory status should be rechecked and programme/visa eligibility must not be inferred from provider recognition alone.

## Student work-rights baseline

Immigration New Zealand currently states that eligible student-visa holders may be allowed to work part-time for up to 25 hours per week, subject to their course and visa conditions, with full-time work possible during eligible scheduled breaks when the visa conditions allow it.

The limit increased from 20 to 25 hours for eligible new student visas from 3 November 2025. Existing visa holders may retain older conditions unless varied or replaced.

Sources:

https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/

https://www.immigration.govt.nz/about-us/news-centre/upcoming-changes-to-student-visa-work-rights/

Phase 4 must model this as a qualified national rule, not a city differentiator and not an unconditional entitlement.

## Geography authority

Stats NZ should be the primary authority for city/urban and administrative geography normalization.

The Statistical Standard for Geographic Areas defines:

- urban/rural statistical geographies;
- territorial authorities;
- regional councils;
- statistical areas.

Urban areas are statistical geographies and do not necessarily match local-government boundaries. This distinction must be explicit when Phase 2 defines each public study-destination scope.

Source:

https://www.stats.govt.nz/methods/geographic-hierarchy/

For city population metrics later, use a single documented geography basis per city rather than mixing territorial-authority and urban-area figures.

## Current international-student demand signal

Current national data strongly supports New Zealand as a meaningful international-study market.

Education New Zealand reported 92,580 international students across New Zealand education providers in 2025, up 11% from 2024. University international enrolments were 38,025, up 14%. Auckland hosted around 55% of international students, followed by Canterbury and Waikato.

Education Counts separately reports 59,890 international students in formal tertiary provider-based study in 2025, up 15% from 2024. The totals differ because the source populations and sector coverage differ; do not combine them as though they are the same measure.

Sources:

https://www.enz.govt.nz/news-and-research/ed-news/latest-data-shows-continued-growth-in-international-enrolments

https://www.educationcounts.govt.nz/statistics/tertiary-participation

These are Phase 1 selection signals only. They do not determine the Tier A city list by themselves.

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-09.

### Canonical object counts

- active canonical NZ geographies: `7`
- active NZ institutions: `8`
- active NZ campus/location rows: `8`
- NZ institution identifiers: `8`
- canonical NZ programmes: `0`
- NZ programme offerings: `0`

There is no NZ-specific programme ingest/staging table in the current database.

### Existing geography inventory

The current seven geography rows are:

- Auckland — `auckland`
- Christchurch — `christchurch`
- Dunedin — `dunedin`
- Hamilton — `hamilton`
- Lincoln — `lincoln`
- Palmerston North — `palmerston-north`
- Wellington — `wellington`

All seven:

- are active;
- have canonical slugs;
- have `geography_type = city`;
- currently have `scope_kind = null`;
- currently have `region_code = null`.

Current geography aliases: `0`.

These rows were created from university registered-location normalization and are not a complete New Zealand city inventory.

### Institution quality

Current eight-university foundation:

- institution slug: `8/8`
- official HTTPS website: `8/8`
- `NZ_MOE_PROVIDER_NUMBER`: `8/8`
- unique provider numbers: `8/8`
- active institution status: `8/8`

Existing institution read models currently return:

- `institution_identity_nz_v1`: `8`
- `institution_location_nz_v1`: `8`
- `institution_explorer_nz_v1`: `8`
- `institution_detail_nz_v1`: `8`

### Campus/location quality

Current NZ campus/location rows:

- rows: `8`
- with `geography_id`: `8/8`
- with source URL: `8/8`
- with precise latitude + longitude: `0/8`
- with `programme_assignment_verified = true`: `0/8`

Every current row is a registry-backed `registered_institution_location` with `location_quality = verified_registry_city`.

This is sufficient as provider-location evidence but not sufficient as a complete campus inventory and not sufficient for programme delivery.

## Multi-campus gap

Official university sources confirm material delivery locations that are not represented by the current eight registry-location rows.

Examples include:

- Massey University: Auckland, Manawatū/Palmerston North and Wellington campuses;
- University of Waikato: Hamilton and Tauranga campuses;
- University of Otago: Dunedin plus teaching/research presence including Christchurch and Wellington, with additional centres including Invercargill and Queenstown;
- University of Auckland: multiple Auckland campuses plus Tai Tokerau in Whangārei and other specialist locations.

Sources:

https://www.massey.ac.nz/study/study-on-campus/

https://www.waikato.ac.nz/about/campus/

https://www.otago.ac.nz/about/campuses

https://www.auckland.ac.nz/en/on-campus/our-campuses/campus-locations0.html

Phase 3 must therefore rebuild city-campus linkage from official campus evidence rather than simply reusing the current one-row-per-university registered-location layer.

## VET transition risk

The 2026 vocational education redesign is an active identity and programme-ownership risk.

The Ministry of Education states that ten stand-alone polytechnics began operating from 1 January 2026. TEC states that three more polytechnics are scheduled to become legally established on 1 October 2026 and operational from 1 January 2027, while Tai Poutini Polytechnic is scheduled to transfer to Open Polytechnic and NZIST is to be disestablished by 31 March 2027.

Sources:

https://www.education.govt.nz/our-work/strategies-policies-and-programmes/tertiary-and-further-education/redesign-vocational-education-and-training-system

https://www.tec.govt.nz/strategic-initiatives/vocational-education-system/changes-to-the-vocational-education-and-training-vet-system/future-of-the-remaining-polytechnic-divisions-from-the-nzist

Implication: Phase 1 can use current polytechnic presence as a city-demand signal, but Phase 3 must recheck the exact provider identity and programme ownership before publishing any polytechnic linkage.

## Supabase platform check

Supabase's April 2026 breaking-change notice states that new public-schema tables will no longer be automatically exposed to the Data/GraphQL API, with the setting scheduled to apply to existing projects on 30 October 2026.

Source:

https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically

The existing NZ institution views already follow the intended server-only pattern. Future NZ city read models should continue to use explicit grants and RLS where tables are created rather than relying on implicit public-schema exposure.

## Reusable data

The following can be reused safely in later city phases:

1. country code `NZ` and route-country contract;
2. the eight canonical university institution identities;
3. the eight NZ Ministry of Education / NZQA provider numbers;
4. official university website URLs;
5. the seven existing city UUIDs/slugs as geography starting points;
6. NZQA/Universities New Zealand authority model;
7. Stats NZ geography definitions;
8. existing NZ institution publication read models for institution identity/display context.

## Data that must not be treated as complete

Do not treat the following as publication-complete city data:

1. the seven existing city rows — they are a university-location seed, not a complete city universe;
2. the eight current campus rows — they represent registered institution locations, not all teaching campuses;
3. the absence of NZ canonical programmes — it means catalogue coverage is absent, not that universities have no programmes;
4. provider presence in a city — it does not prove programme delivery there;
5. current polytechnic identity from stale Te Pūkenga-era assumptions — the VET sector is actively restructuring.

## Phase 0 blockers / remediation

### Blocker 1 — No canonical NZ programme catalogue

Current state: `0` canonical programmes and `0` offerings.

Remediation:

- build programme identity from NZQCF / university authority and official institution catalogues;
- create an offering/location relationship only when the delivery campus is explicit;
- allow city publication with a clearly disclosed `verification_pending` programme state if the city standard is otherwise satisfied.

### Blocker 2 — Campus inventory is incomplete

Current state: one registry-backed location per university.

Remediation:

- collect official teaching-campus inventories for selected Tier A cities during Phase 3;
- distinguish teaching campuses from research centres, liaison offices, clinical-only placements and overseas locations;
- never infer campus delivery from a provider's registered head-office city.

### Blocker 3 — Geography scope metadata is incomplete

Current state: all seven geography rows have null `scope_kind` and `region_code`; aliases are absent.

Remediation:

- Phase 2 must define exact Stats NZ / local-government scope semantics per selected city;
- populate region mapping and aliases;
- keep urban-area and territorial-authority measures distinct.

### Blocker 4 — VET provider identities are changing

Current state: CampCareer NZ canonical institution layer intentionally contains only the stable eight-university cohort.

Remediation:

- do not block a university-first city v1 on complete polytechnic normalization;
- if a Tier A city requires a polytechnic to avoid a materially misleading institution picture, verify that provider against the latest 2026/2027 NZQA/TEC structure during Phase 3;
- label initial institution coverage when it is not exhaustive.

### Blocker 5 — Country publication registry remains REVIEW_REQUIRED

Current state: NZ is `REVIEW_REQUIRED` in the launch-country registry even though the institution publication foundation exists.

Remediation:

- Phase 7 must explicitly decide whether the country-level publication stage is promoted before city pages become indexable;
- do not silently make city SEO state contradict the country release registry.

## Phase 1 handoff

Phase 1 should select a deliberately small Tier A city cohort rather than automatically publishing all seven seeded geographies.

Selection should consider:

1. current international-student concentration by region;
2. verified university teaching-campus presence;
3. distinct study-market value rather than simple population size;
4. programme/campus verification feasibility;
5. geographic spread across the North and South Islands;
6. the 2026 VET transition where polytechnic presence materially affects the city picture.

Auckland is the strongest obvious discovery signal because Education New Zealand reports it hosts about 55% of international students. Canterbury and Waikato are the next strongest regional international-enrolment signals. This is not yet the Phase 1 allowlist.

Phase 1 must explicitly decide how to treat:

- Auckland's broad unitary-authority geography versus named campus localities;
- Christchurch versus nearby Lincoln as separate study destinations;
- Palmerston North versus Massey's Auckland and Wellington campuses;
- Hamilton versus the University of Waikato's Tauranga campus;
- Dunedin versus Otago's Christchurch/Wellington and other specialist locations.

## Completion gate

Phase 0 is complete because:

- [x] canonical country identity is confirmed;
- [x] tertiary regulatory structure is documented;
- [x] authoritative provider identifier is confirmed;
- [x] provider-recognition and programme authority hierarchy is documented;
- [x] international-student signatory requirement is documented;
- [x] student-work-rights baseline is documented;
- [x] Stats NZ geography authority is identified;
- [x] current production geography/institution/campus/programme coverage is measured;
- [x] current data-quality gaps are measured;
- [x] multi-campus and VET-transition blockers are explicit;
- [x] remediation required for Phases 1–3 is recorded.

Next branch:

`agent/nz-cities-scope-v1`
