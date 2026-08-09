# UK Programs — Phase 2 Collection

Date: 2026-08-09
Branch: `agent/programs-uk`
Scope: United Kingdom only.

## Collection target

Collect only programmes with a defensible relationship to CampCareer's canonical 80-career taxonomy. The 185 legacy `courses_uk` rows remain discovery/provenance seeds and are not bulk-promoted.

## Source hierarchy

1. Current official provider programme page for programme identity, award, duration, campus and current intake evidence.
2. Home Office / UKVI Register of Student sponsors for institution-level Student-route sponsor evidence.
3. Official provider international/admissions page for programme-level international eligibility, application timing and CAS evidence.
4. Discover Uni / HESA current course data for UK-wide undergraduate discovery.
5. DfE LARS / Ofqual Register for vocational, FE, apprenticeship and regulated-qualification discovery.
6. Legacy CampCareer `courses_uk` only as a discovery hint or provenance link.

Aggregators and ranking sites are not authoritative programme sources.

## Evidence separation

The following facts are independent and must remain independently nullable/holdable:

- provider recognition / UKPRN identity;
- Student-route sponsor status;
- exact programme identity and current existence;
- international-student eligibility for that exact programme;
- current application window;
- CAS eligibility/issuance;
- occupation relevance;
- publication readiness.

A Student sponsor does not prove every programme can sponsor a Student visa. An international tuition fee does not prove applications are currently open. A visible Apply button does not by itself prove unconditional CAS eligibility.

## Qualification normalization

Do not use the legacy `aqf_level` field.

Store native framework and native level separately from CampCareer's normalized level:

- FHEQ/RQF-style levels for England/Wales/Northern Ireland higher education where applicable;
- SCQF levels for Scottish programmes;
- CQFW/other native evidence where it is the authoritative source;
- canonical level such as BELOW_DEGREE, CERTIFICATE_HE, DIPLOMA_HE, FOUNDATION_DEGREE, BACHELOR, INTEGRATED_MASTER, MASTER, POSTGRADUATE_CERTIFICATE, POSTGRADUATE_DIPLOMA, DOCTORATE, APPRENTICESHIP, OTHER or UNKNOWN.

## Provider relationship

For each programme preserve whether the provider relationship is direct award, validated, franchised, embedded pathway, joint award, other or unknown.

Do not duplicate a host university degree under an embedded pathway college unless the pathway itself is the target programme being represented.

## Occupation linkage

Use conservative reviewed relations:

- `direct_career_path`: exact or explicit graduate-career evidence;
- `professional_registration_pathway`: regulated course leading toward professional registration;
- `professional_pathway_stage`: a documented required/recognised stage that is not sufficient alone for full registration;
- `progression_pathway`: an official access/pre-cadet/pre-professional route into a later qualifying programme;
- `direct_discipline` / `related_discipline`: only when the official curriculum or course description directly supports the target field.

Never approve a relationship from a broad legacy field label alone.

## International-admission rules

Phase 2 records evidence but does not force publication tiers.

- All newly collected programmes remain Tier C pending Phase 3 verification.
- CAS stays `NULL` unless exact official evidence establishes programme-level CAS handling.
- Explicit current closure or waiting-list-only status is recorded as such rather than converted to generic unknown.
- Programme existence and occupation relevance can remain approved even when the current international intake is closed.
- Institution-level Student sponsorship and general CAS guidance do not establish programme-level CAS eligibility.

## Current Phase 2 checkpoint

As of 2026-08-09 after the first university, HE, FE and vocational collection slices:

- Programme staging rows: **73**.
- Programme-level international-evidence rows: **73**.
- 1:1 programme ↔ international-evidence coverage: **73/73**.
- Publication tier: **73 Tier C / 0 Tier A/B**.
- CAS: **0 known / 73 unknown**; no CAS value has been inferred.
- Approved programme-occupation relations: **89**.
- Distinct canonical target careers covered: **55/80**.
- Canonical-provider identity pending programmes: **8**, all from City of Glasgow College.
- Sponsor/provider candidate rows: **1**, City of Glasgow College; its canonical institution identity has not been fabricated.
- Staging-table security: RLS enabled; `service_role` can read; `anon` and `authenticated` cannot SELECT.

### Collected programme batches

- Aston University: 10 programmes.
- Brunel University of London: 17 programmes.
- Cardiff University: 11 programmes.
- City St George's, University of London: 5 programmes.
- Queen's University Belfast: 5 programmes.
- Swansea University: 1 programme.
- City of Glasgow College: 8 programmes across maritime-access, hospitality/cookery, construction, electrical-engineering technician and care pathways; provider identity remains candidate/pending.
- University of Hertfordshire: 6 programmes.
- University of Reading: 2 programmes.
- University of Surrey: 3 programmes.
- University College London: 3 teacher-training programmes.
- Loughborough University: 2 programmes.

### Explicit negative/current-state evidence retained

Examples include:

- Cardiff Adult Nursing BN: overseas applications closed for 2026/27.
- Queen's Belfast Social Work, Midwifery and Pharmacy: relevant 2026 international application deadlines have passed.
- UCL Early Years, Primary and Secondary teacher training: visa-required 2026 deadlines have passed.
- City of Glasgow Professional Cookery NQ, Bakery NQ, Carpentry and Joinery NQ, Electrical Engineering NC and Health and Social Care NC: course full / waiting list only.
- University of Hertfordshire 3D Animation and Visual Effects: first-year intake collected as the published 2027 cycle rather than being promoted to 2026.
- Loughborough Chemical Engineering BEng: current 2026 undergraduate vacancy remains unverified rather than inferred from programme existence and international tuition.

### Conservative linkage examples

- City of Glasgow Pre-Cadet Shipping and Maritime Operations is linked to `deck-officer` and `marine-engineer` as `progression_pathway`, not as a direct officer qualification.
- City of Glasgow NC Electrical Engineering is linked only to `engineering-technician`; it is not treated as an electrician qualification.
- Hertfordshire Supply Chain and Logistics Management MSc is linked to `supply-chain-analyst` and `warehouse-manager` because those outcomes are explicitly listed; `logistics-coordinator` is not inferred.
- Reading Agriculture BSc is linked to agronomy, farm management and horticulture from explicit course/career evidence; it is not used to infer animal-science technician coverage.

## Current uncovered careers — 25

`aircraft-maintenance-technician`, `animal-science-technician`, `automotive-service-technician`, `bricklayer`, `cloud-engineer`, `commercial-pilot`, `community-worker`, `counsellor`, `database-administrator`, `electrician`, `forestry-technician`, `hvac-technician`, `ict-support-technician`, `industrial-engineer`, `logistics-coordinator`, `medical-laboratory-technician`, `multimedia-designer`, `plumber`, `special-education-teacher`, `sustainability-specialist`, `truck-driver`, `ux-designer`, `wall-floor-tiler`, `welder`, `youth-worker`.

## Next collection direction

Continue evidence-first collection on the remaining 25 careers. Prioritise exact professional/vocational pathways over broad-title inference:

1. digital/IT: UX, multimedia, cloud, database, ICT support;
2. social/community: community work, youth work, counselling, special education;
3. aviation/automotive/technical: aircraft maintenance, commercial pilot, automotive service, industrial engineering;
4. land-based/science: animal science technician, forestry technician, sustainability specialist, medical laboratory technician;
5. construction/trades: electrician, plumber, HVAC, bricklayer, wall/floor tiler, welder;
6. transport/logistics: logistics coordinator and truck driver.

If a target career has no defensible Student-route programme, retain it as an evidence gap rather than manufacturing coverage.