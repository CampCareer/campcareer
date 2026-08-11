# Ireland Programs — Phase 1 Discovery

Status: complete

Date: 2026-08-10

Branch: `agent/programs-ie`

Scope: Ireland (`IE`) Programs only. United States work is explicitly out of scope. Do not advance to Phase 2 or another country without explicit instruction.

## Phase 1 goal

Establish the Ireland programme-data baseline before collection and publication work:

1. audit the existing CampCareer Ireland programme, institution, qualification and geography layers;
2. separate reusable legacy discovery data from publication-ready evidence;
3. define the Irish qualification/programme authority model;
4. define the current non-EEA international-study evidence model during the ILEP → TrustEd Ireland transition;
5. define the initial provider and programme boundaries for Phase 2;
6. preserve CampCareer’s occupation-led scope around the canonical 80 programme-matching careers.

Phase 1 does not create staging tables, canonicalise new programmes, publish Ireland in `/programs`, or modify any United States data.

## 1. Existing CampCareer baseline

### Legacy course surface

Ireland is not an empty programme market in the current database.

Existing legacy relations:

- `public.courses_ie`: 2,876 rows;
- `ingest.courses_ie`: 2,876 rows;
- `public.colleges_ie`: 34 rows;
- `ingest.colleges_ie`: 34 rows.

The legacy course snapshot was collected between 2026-05-30 and 2026-06-02.

Legacy course characteristics:

- 2,876 / 2,876 rows have a Qualifax URL;
- only 5 rows currently carry a non-empty CAO code;
- 201 distinct `college_name` values appear in the course seed;
- 163 distinct legacy city strings appear;
- the legacy snapshot mixes higher education, apprenticeships, PLC/FET, lifelong learning and short-course products.

Current course-type distribution:

- NFQ 6: 552 rows;
- NFQ 7: 366 rows;
- NFQ 8: 1,016 rows;
- NFQ 9: 942 rows.

Notable mixed course types include:

- Higher Education CAO;
- Higher Education Direct Entry;
- Postgraduate;
- Apprenticeship;
- PLC Post Leaving Cert;
- Lifelong Learning;
- Short Courses;
- BTEI Part Time;
- Teagasc;
- Traineeship.

The legacy Ireland source is therefore useful for discovery, but it is not a bounded international programme publication cohort.

### Canonical programme state

Current production state attached to Ireland institutions:

- `catalog.institutions`: 201 active IE rows;
- `catalog.programmes`: 2,876 IE programmes;
- active programmes: 2,876;
- programmes with canonical `qualification_level_id`: 2,876;
- institutions referenced by those programmes: 199;
- `catalog.programme_offerings`: 2,876 IE offerings.

However, every current IE offering is:

- `source_system = legacy_backfill`;
- `verification_status = unverified`;
- `market = international`;
- `delivery_mode = NULL`.

The existing `market = international` value is not accepted as international-student eligibility evidence. It is a legacy backfill attribute and must not be promoted into a user-facing eligibility claim.

There is currently no Ireland Programs publication layer:

- `public.program_catalog_ie_staging`: absent;
- `public.program_international_ie_staging`: absent;
- `public.program_occupation_ie_staging`: absent;
- `public.program_explorer_ie_v1`: absent;
- `public.program_detail_ie_v1`: absent.

`public.country_occupation_profiles` contains 0 IE rows. Ireland programme↔career review must therefore use a dedicated programme relationship staging layer rather than fabricating country occupation profiles merely to satisfy a foreign key.

### Qualification framework

Ireland already has a reusable canonical qualification framework in CampCareer:

- framework code: `NFQ`;
- name: National Framework of Qualifications;
- levels: 1 through 10;
- source: QQI.

This is stronger than several country baselines because the legacy 2,876 programmes are already attached to canonical NFQ levels.

Phase 2 should preserve this mapping where the legacy programme’s award evidence remains valid, but an NFQ level alone does not prove that the provider currently offers the programme or that a non-EEA student can enrol.

### Institution identity quality

The current IE institution layer is too broad to treat as an authoritative provider universe.

Examples in the legacy public college surface show why:

- Atlantic Technological University is split into campus-like labels such as `ATU - Galway Campuses`, `ATU - Donegal Campuses`, `ATU - Mayo Campus`, `ATU - Sligo Campus` and `ATU - St. Angela's`;
- South East Technological University and Technological University of the Shannon are similarly represented by campus labels;
- `NUI Galway` remains as a legacy name even though the institution’s current official name is University of Galway;
- many Qualifax course-provider strings represent FET centres, training organisations or local delivery units rather than stable higher-education institution identities.

Provider identity must therefore be re-resolved against current authority-backed provider records before programme publication.

### Geography

Existing Ireland geography read models are limited:

- `public.city_directory_ie_v1`: 4 rows;
- `public.city_institution_directory_ie_v1`: 9 rows.

The 163 legacy course city strings must not be promoted automatically into canonical programme locations.

Future programme geography requires explicit evidence:

`programme -> current offering/delivery evidence -> campus/location -> canonical geography`

Institution presence or a legacy Qualifax city string alone is not enough.

## 2. Irish qualification and programme authority model

### National Framework of Qualifications

Quality and Qualifications Ireland (QQI) maintains Ireland’s 10-level National Framework of Qualifications (NFQ).

Official source:
https://www.qqi.ie/national-framework-of-qualifications

The NFQ describes qualification levels and award types. Higher education awards include, among others:

- Level 6 Higher Certificate;
- Level 7 Ordinary Bachelor Degree;
- Level 8 Honours Bachelor Degree / Higher Diploma;
- Level 9 Masters Degree / Postgraduate Diploma;
- Level 10 Doctoral Degree.

Universities and technological universities have autonomous awarding powers for relevant higher-education levels. QQI also validates programmes and awards qualifications within its statutory remit.

For CampCareer, qualification level, awarding authority, provider identity and current programme delivery remain separate claims.

### Irish Register of Qualifications

The Irish Register of Qualifications (`IRQ`) is the national database of qualifications included in the NFQ and the programmes that lead to them. QQI describes it as the most reliable source for qualifications and quality-assured providers in Ireland.

Official source:
https://www.qqi.ie/what-we-do/the-qualifications-system/irish-register-of-qualifications

Phase 2 should use IRQ as the primary recognition/qualification backbone wherever an exact programme or qualification record can be resolved.

An IRQ/NFQ record supports recognised qualification/programme context. It does not by itself prove:

- that a specific intake is currently open;
- that the programme is currently delivered at a specific campus;
- that the programme is eligible for non-EEA student immigration;
- that a graduate automatically qualifies for a post-study immigration outcome.

### Higher Education Authority provider context

The Higher Education Authority publishes the current higher-education institutions with which it works under statute or through core public funding.

Official source:
https://hea.ie/higher-education-institutions/

The current public landscape includes universities, technological universities and other publicly funded higher-education institutions.

HEA status is provider-level context. It must not be converted into a programme-level recognition, admission or international-eligibility claim.

## 3. International-student evidence model

Ireland is in an active transition from the Interim List of Eligible Programmes (`ILEP`) to the statutory TrustEd Ireland international education mark.

### ILEP and TrustEd Ireland

Immigration Service Delivery states that non-EEA/non-Swiss nationals may be recruited only to:

1. programmes listed on the ILEP; or
2. eligible programmes offered by providers authorised to use the TrustEd Ireland mark.

Official source:
https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/interim-list-of-eligible-programmes-ilep/

The ILEP is closed to new applicant providers. Its final update was published on 2025-06-20 and it is being superseded by TrustEd Ireland.

Current third-level study guidance explicitly instructs students to check both the ILEP and the TrustEd Ireland providers’ eligible-programme list because eligible programmes will not necessarily appear on both lists.

Official source:
https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/

This transition is material to CampCareer modelling. A single static provider-level boolean is insufficient.

### TrustEd Ireland provider cohort

QQI announced the first 28 higher-education institutions authorised to use the TrustEd Ireland statutory quality mark in January 2026.

Official source:
https://www.qqi.ie/news/qqi-announces-first-28-higher-education-institutions-authorised-to-use-trusted-ireland-quality

The current authorised higher-education provider cohort includes major public universities and technological universities as well as approved private/independent providers.

TrustEd Ireland is provider-level international-education quality/authorisation evidence. It must not be represented as:

- proof that every programme is currently open;
- proof of programme-specific intake dates;
- proof of programme-specific visa approval;
- a profession-specific accreditation claim.

Phase 2/3 must still resolve the exact eligible programme and the current provider programme page.

### Full-time study boundary

Irish immigration guidance for student permission requires an eligible full-time course/programme. Part-time or distance learning should not be promoted as a standard non-EEA student-permission route by inference.

For every programme CampCareer should keep separate:

- programme existence;
- NFQ / recognised qualification context;
- provider TrustEd/ILEP status;
- programme-level international eligibility;
- study mode;
- current application/intake status;
- student-permission context.

## 4. Graduate immigration evidence

Post-study permission must remain separate from programme publication.

Immigration Service Delivery’s Third Level Graduate Programme currently provides:

- NFQ Level 8 graduates: up to 12 months on Stamp 1G, subject to programme conditions and overall student-path limits;
- NFQ Level 9 or above graduates: an initial 12 months with a possible further 12 months, subject to conditions and the overall limit.

Official source:
https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/

CampCareer must not infer a positive Stamp 1G outcome solely from `NFQ 8` or `NFQ 9` stored on a legacy programme row. Recognition, successful completion, immigration history and other scheme conditions remain separate.

## 5. Apprenticeship and vocational boundary

Ireland has a substantial apprenticeship and FET system, which matters for CampCareer’s trade, technician, hospitality and applied-career categories.

The Government’s apprenticeship guidance states that an apprenticeship mixes institution-based learning with paid work-based learning, and that a person must be hired by an employer to become an apprentice. Employers must be approved by SOLAS.

Official source:
https://www.gov.ie/en/department-of-further-and-higher-education-research-innovation-and-science/services/become-an-apprentice/

Generation Apprenticeship provides the current national apprenticeship programme directory and craft training-location context.

Official source:
https://apprenticeship.ie/

Implication for CampCareer:

- apprenticeship programme existence is not equivalent to a normal international student pathway;
- an apprenticeship requires an employment relationship and should not be published to a non-EEA study user as a standard student-permission route without explicit immigration/work-right evidence;
- apprenticeship records may still be valuable occupation pathways, but the product must distinguish `employment-based training` from `student programme`.

## 6. Qualifax reuse boundary

Qualifax remains a high-value national discovery source and currently exposes a much broader course universe than the legacy 2,876-row CampCareer snapshot.

Official source:
https://www.qualifax.ie/courses

Qualifax contains current records across higher education, postgraduate, apprenticeship, PLC, lifelong-learning, short-course and other categories.

Phase 2 may reuse the existing Qualifax identifiers/URLs as discovery leads, but a legacy row does not qualify for publication until its current identity and eligibility are independently re-verified.

The old `courses_ie` snapshot should therefore be treated as:

- discovery/provenance seed: yes;
- canonical current programme authority: no;
- current international eligibility evidence: no;
- current application status evidence: no;
- current campus evidence: no unless reconfirmed.

## 7. Phase 2 provider scope

Phase 2 remains occupation-led rather than catalogue-completeness-led.

A programme enters the working cohort only when it supports at least one of CampCareer’s canonical 80 programme-matching careers and has a defensible current source chain.

### Tier A — current international higher education

Start with current TrustEd Ireland-authorised higher-education providers where:

1. provider identity can be resolved to one canonical CampCareer institution;
2. the exact programme maps to at least one target career;
3. the qualification/programme is supported through IRQ/NFQ or the provider’s valid awarding authority;
4. a current official provider programme page exists;
5. current international eligibility can be linked through TrustEd eligible-programme evidence or current ILEP evidence as applicable;
6. study mode and intake/application state are represented separately.

This cohort should include universities, technological universities and relevant authorised independent/private providers when their exact programmes justify inclusion.

### Tier B — recognised higher education requiring identity or international resolution

A recognised programme can remain in staging when the programme/award is valid but one of the following remains unresolved:

- canonical provider identity;
- TrustEd/ILEP programme-level international eligibility;
- current provider page;
- current study mode;
- current intake state.

Tier B must not be silently upgraded to public international eligibility.

### Tier C — FET, apprenticeships and conditional vocational routes

FET/apprenticeship records enter collection only when they materially support one of the 80 target careers.

Publication for an international study user requires a clear route that distinguishes:

- ordinary student-permission study;
- employment-based apprenticeship;
- domestic/work-right-dependent training;
- progression-only or pathway programmes.

Do not bulk-publish PLC, lifelong-learning, short-course or apprenticeship records merely because Qualifax lists them.

## 8. Programme inclusion and exclusion rules

### Include for Phase 2 collection

- current degree and postgraduate programmes relevant to the 80 careers;
- Higher Certificates / Ordinary Bachelor / Honours Bachelor / Higher Diploma / Masters / Postgraduate Diploma where occupation-relevant;
- selected apprenticeships or FET major-award pathways where they are substantively important to a target career and their access model is explicit;
- current official programme pages with resolvable provider identity.

### Exclude by default

- minor/component awards presented as standalone career programmes;
- generic short courses and CPD;
- hobby/leisure courses;
- language-only programmes;
- duplicate campus/provider aliases;
- obsolete institution names or pre-merger institution identities without a current provider mapping;
- online/distance or part-time offerings presented as an international student-permission route without explicit support;
- apprenticeship records presented as ordinary student programmes;
- legacy records whose current provider or programme cannot be verified.

## 9. Phase 2 source hierarchy

Use the following order:

1. QQI Irish Register of Qualifications for NFQ qualification/programme and quality-assured provider evidence;
2. current awarding-body / recognised-provider evidence where the provider has autonomous awarding powers;
3. QQI TrustEd Ireland authorisation and eligible-programme evidence for international-provider context;
4. Immigration Service Delivery ILEP where an exact programme remains valid under the transition;
5. official provider programme/admissions page for current programme title, mode, duration, campus, intake and application facts;
6. HEA for current publicly funded higher-education provider context;
7. Qualifax for national course discovery and supporting course facts;
8. Generation Apprenticeship / SOLAS-backed sources for apprenticeship identity and delivery model;
9. Immigration Service Delivery for student-permission and Third Level Graduate Programme rules.

Aggregator, ranking and marketing sources cannot qualify a programme for Tier A.

## 10. Modelling rules for later phases

- Keep internal country code `IE`.
- Reuse the existing canonical NFQ framework and levels 1–10.
- Preserve native NFQ level, award type and awarding body.
- Do not trust legacy `market = international` as evidence.
- Keep provider identity separate from campus/delivery location.
- Keep recognised qualification/programme evidence separate from current offering status.
- Keep TrustEd provider authorisation separate from exact programme eligibility.
- Keep ILEP transition evidence explicit and source-dated.
- Keep international eligibility separate from current application state.
- Keep student permission separate from programme recognition.
- Keep Stamp 1G / graduate-permission context separate from programme existence.
- Keep apprenticeship/employment-based training separate from student-permission programmes.
- Do not infer programme city from provider headquarters or legacy city strings.
- Do not fabricate IE `country_occupation_profiles` to support programme↔career relationships.

## 11. Phase 1 decision

Ireland Phase 1 is complete enough to hand off to bounded collection.

Key decisions:

- reuse the 2,876-row Qualifax-derived legacy catalogue only as discovery/provenance;
- do not expose the existing 2,876 unverified `legacy_backfill` international offerings as current international programmes;
- reuse the existing canonical NFQ framework;
- rebuild provider identity around current HEA / QQI / TrustEd authority rather than legacy campus/provider strings;
- use IRQ as the recognition backbone;
- model the ILEP → TrustEd Ireland transition explicitly;
- prioritise current TrustEd-authorised higher-education providers for the international programme cohort;
- include FET/apprenticeship only where a target career justifies it and access/immigration semantics can be represented honestly;
- preserve the occupation-led 80-career scope instead of attempting to ingest all current Qualifax courses.

No production database schema or data was changed in Phase 1.

## Phase 2 handoff

When explicitly requested, Phase 2 should create a private Ireland programme staging layer with at least three separated concerns:

1. programme identity/current offering;
2. reviewed programme↔career relation;
3. international/immigration evidence.

The first collection pass should prioritise occupation-relevant programmes at current TrustEd Ireland-authorised higher-education providers, then add gap-driven vocational/apprenticeship routes only where they improve real coverage of the canonical 80 careers.
