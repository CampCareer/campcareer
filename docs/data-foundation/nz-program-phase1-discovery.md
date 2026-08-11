# NZ Programs — Phase 1 Discovery

Date: 2026-08-10
Branch: `agent/programs-nz`
Scope: New Zealand only. Do not advance to Phase 2 or another country without explicit user instruction.

## Phase 1 goal

Establish the New Zealand programme-data baseline before collection:

1. audit existing CampCareer NZ programme and institution data;
2. define the New Zealand programme approval and qualification authority model;
3. define international-student and post-study-work evidence boundaries;
4. define the institution universe and collection rules that Phase 2 will use.

Phase 1 does not create programme staging tables, canonical programmes, offerings or public programme routes.

## 1. Existing CampCareer baseline

### Programme data

The current NZ programme layer is empty:

- `catalog.programmes` attached to NZ institutions: `0`;
- NZ `catalog.programme_offerings`: `0`;
- `public.city_programme_directory_nz_v1`: `0`;
- `public.country_occupation_profiles` for `NZ`: `0`;
- `public.program_catalog_nz_staging`: absent;
- `public.program_international_nz_staging`: absent;
- `public.program_occupation_nz_staging`: absent;
- no `courses_nz` legacy surface exists.

There is therefore no reusable legacy NZ programme cohort. Phase 2 must collect source-first from current official New Zealand and provider sources.

### Institution data

The existing NZ institution foundation is strong and should be reused.

Current production counts:

- `catalog.institutions`: `8` active NZ universities;
- `public.institution_identity_nz_v1`: `8`;
- `public.institution_explorer_nz_v1`: `8`;
- `public.institution_location_nz_v1`: `8`;
- `public.city_directory_nz_v1`: `5` currently published city rows;
- `public.city_institution_directory_nz_v1`: `10` institution-city rows.

The eight canonical universities are:

- Auckland University of Technology;
- Lincoln University;
- Massey University;
- University of Auckland;
- University of Canterbury;
- University of Otago;
- University of Waikato;
- Victoria University of Wellington.

Each already has a canonical `NZ_MOE_PROVIDER_NUMBER` external identifier and NZQA provider source URL:

- University of Auckland — `7001`;
- University of Waikato — `7002`;
- Massey University — `7003`;
- Victoria University of Wellington — `7004`;
- University of Canterbury — `7005`;
- Lincoln University — `7006`;
- University of Otago — `7007`;
- Auckland University of Technology — `7008`.

The existing identity layer should be reused rather than recreated.

### Qualification-framework gap

`core.qualification_frameworks` currently contains `0` NZ rows.

Phase 2 must therefore preserve native NZQCF qualification type, level and credit evidence in staging. A canonical `qualification_level_id` should not be fabricated before an NZ framework mapping exists.

### Geography boundary

CampCareer already has NZ institution and city foundations, but the programme-city directory is empty. Institution presence or a registered provider address must not be used as proof that a programme is delivered at that city or campus.

Future programme location requires an explicit chain:

`programme -> offering/delivery evidence -> campus/location -> canonical geography`.

## 2. New Zealand qualification and programme authority model

### NZQCF

The New Zealand Qualifications and Credentials Framework (`NZQCF`) is the national qualifications framework and has 10 levels.

NZQA states that qualifications and credentials approved by NZQA or Universities New Zealand are listed on the NZQCF.

Official source:
https://www2.nzqa.govt.nz/qualifications-and-standards/about-new-zealand-qualifications-credentials-framework/

For CampCareer, qualification identity and programme delivery must remain separate:

- an NZQCF qualification proves a recognised qualification identity;
- it does not by itself prove that a specific provider currently offers that programme;
- it does not prove current international admission, intake, campus or application status.

### Universities

New Zealand has eight state-funded universities. Universities New Zealand represents the eight-university sector.

Official sources:
https://www.education.govt.nz/our-work/about-us/education-new-zealand/our-education-system/tertiary-education
https://www.universitiesnz.ac.nz/universities

For university academic programmes, the Committee on University Academic Programmes (`CUAP`) exercises programme approval and accreditation powers delegated by Universities New Zealand.

Official source:
https://www.universitiesnz.ac.nz/quality-assurance/programme-approval-and-accreditation-cuap

University Phase 2 verification therefore needs both:

1. recognised qualification/programme authority evidence through NZQCF / Universities New Zealand where available;
2. the official university programme page for current programme title, duration, mode, intake, campus and international admission facts.

### Non-university providers

NZQA is the programme approval/accreditation authority for the non-university tertiary sector.

For programmes leading to New Zealand Certificates at Levels 1–6 and New Zealand Diplomas at Levels 5–7, NZQA requires programme approval and provider accreditation.

Official source:
https://www2.nzqa.govt.nz/tertiary/approval-accreditation-and-registration/programme-approval-and-provider-accreditation/

For non-university degree and postgraduate programmes at Levels 7–10, only registered and accredited institutions can deliver approved programmes.

Official source:
https://www2.nzqa.govt.nz/tertiary/approval-accreditation-and-registration/degrees/

NZQA Find Education Organisations exposes the provider number, provider status, Code of Practice signatory status, qualifications and programmes and is the primary provider identity/discovery source for later non-university expansion.

Official source:
https://www.nzqa.govt.nz/providers/index.do

## 3. International-student evidence model

Programme recognition and permission to enrol international students are separate facts.

Immigration New Zealand requires most tertiary students studying for more than three months to hold an offer of place or enrolment evidence from an approved education provider. The offer carries programme-specific facts including course name, programme length and study mode.

Official source:
https://www.immigration.govt.nz/study/for-education-providers/offering-a-place-to-a-student/

NZQA Code of Practice signatory status is provider-level evidence relevant to international learners. It must not be treated as proof that every provider programme is currently open to international applicants.

Phase 2 international evidence should therefore keep separate:

- provider identity and current status;
- Code of Practice signatory status;
- programme recognition/approval;
- current programme availability;
- programme-level international eligibility;
- intake/application state;
- student-visa offer-of-place suitability.

Do not infer current application availability from provider approval alone.

## 4. Post-study-work evidence model

New Zealand post-study work rights are qualification-sensitive and must be stored separately from programme recognition.

As of 2026-08-10, Immigration New Zealand states that degree Level 7 or higher qualifications can support Post Study Work Visa eligibility when the study-duration conditions are met, while non-degree Level 7 or lower qualifications require the qualification to appear on the eligible-qualification list and may impose study-related work conditions.

Official sources:
https://www.immigration.govt.nz/study/after-you-finish-your-study/qualifications-needed-for-a-post-study-work-visa/
https://www.immigration.govt.nz/visas/post-study-work-visa/

Immigration New Zealand has also announced changes effective from 2026-11-16, including an extension for certain NZQCF Level 7 Graduate Diploma holders and a new Short-term Graduate Work Visa.

Official source:
https://www.immigration.govt.nz/about-us/news-centre/new-and-updated-post-study-work-visa-options/

CampCareer must therefore model post-study-work rules with an explicit effective date. A future rule must not be shown as current before its commencement date.

## 5. Institution scope for Phase 2

### Tier A — existing eight universities

Start with the eight canonical universities already in CampCareer because they have stable UUIDs, slugs and official `NZ_MOE_PROVIDER_NUMBER` identities.

Collect only exact current programmes that map to one or more CampCareer target careers and have current official programme evidence.

Priority domains include:

- nursing and allied health;
- medicine/pharmacy where internationally accessible evidence is supportable;
- engineering and construction;
- computing, software, cyber security and data;
- teaching;
- agriculture, food and environmental sciences;
- logistics/supply chain;
- business/accounting/finance;
- design/media and built environment.

### Tier B — polytechnics, wānanga and other non-university providers

University-only coverage would miss materially important pathways for trades, technicians, construction, applied engineering, health support, hospitality, automotive and other vocational target careers.

Include a non-university provider only when:

1. current legal/provider identity is verified through NZQA using a stable provider number;
2. the exact programme is approved/accredited and current;
3. the programme maps to one or more target careers;
4. official provider programme evidence is available;
5. international Code/signatory and programme-level eligibility are separately supportable where public international publication is intended.

The 2026–2027 vocational-sector restructure makes identity recency material. Do not bulk-copy stale Te Pūkenga-era provider or programme ownership assumptions.

### Tier C — conditional private/specialist providers

Private training establishments and specialist providers may enter collection when an exact target-career programme justifies inclusion and the provider/programme chain is independently verifiable through NZQA and current official provider evidence.

Default exclusions:

- unapproved or unaccredited programmes;
- language-only programmes;
- foundation/pathway products that do not represent the substantive target qualification;
- short courses without a recognised qualification/programme identity;
- aggregator-only programme records;
- inactive or transitionally ambiguous providers without current legal/provider identity;
- online/distance offers where international-study or New Zealand study-location implications are unclear.

## 6. Source hierarchy for Phase 2

Use this order:

1. NZQA provider number / current provider record for provider identity;
2. NZQCF qualification record for recognised qualification identity and native level/credits;
3. Universities New Zealand / CUAP for university programme approval authority;
4. NZQA programme approval/accreditation for non-university programmes;
5. official provider programme page for current title, mode, duration, campus, intake and admissions;
6. NZQA Code of Practice evidence for provider-level international learner status;
7. Immigration New Zealand for student-visa and post-study-work rules;
8. official provider international-admissions page for programme/applicant eligibility.

Aggregator and ranking sources are discovery-only and cannot qualify a programme for Tier A publication.

## 7. Identity and modelling rules

- Keep CampCareer's internal country code `NZ`.
- Reuse `NZ_MOE_PROVIDER_NUMBER` for the existing university institution identities.
- Preserve native NZQCF qualification type, level and credits.
- Keep qualification identity separate from provider programme/offering identity.
- Keep provider Code-signatory status separate from programme international eligibility.
- Keep student-visa eligibility separate from programme recognition.
- Keep post-study-work eligibility separate and effective-dated.
- Do not infer current applications from programme existence.
- Do not infer campus/city from institution presence or registered provider address.
- Do not create `country_occupation_profiles` merely to support programme-career relationships; Phase 2 can use a dedicated reviewed staging relation as other country programme rollouts do.

## 8. Phase 1 decision

NZ Phase 1 is complete enough to hand off to collection with these rules:

- there is no reusable NZ programme catalogue;
- reuse the existing eight provider-number-backed canonical universities as the initial stable seed;
- expand programme-first into non-university providers where target careers require vocational/applied pathways;
- use NZQCF + CUAP/NZQA as the recognition backbone;
- use official provider pages for current programme facts;
- separate Code signatory, international admission, student visa and post-study-work evidence;
- effective-date immigration rules, especially the announced 2026-11-16 changes;
- preserve the current zero programme-city linkage until programme-specific delivery evidence is collected;
- do not create canonical NZ qualification-level references until the NZ framework mapping is explicitly implemented.

No production schema or catalogue rows are changed in Phase 1.

## Phase 2 handoff

When explicitly instructed to start Phase 2, create a dedicated NZ programme staging layer rather than a legacy `courses_nz` surface.

Expected separation:

- provider source identity / `NZ_MOE_PROVIDER_NUMBER`;
- qualification identity and NZQCF level/credits;
- programme/offering identity and official programme URL;
- university CUAP or non-university NZQA approval evidence;
- current duration/study mode/intake/application facts;
- programme-specific campus/location evidence;
- Code of Practice signatory evidence;
- programme-level international eligibility;
- post-study-work evidence and effective date;
- occupation linkage to the canonical target careers;
- source checked / collected timestamps.

Phase 2 must remain New Zealand-only.