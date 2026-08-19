# Australia Campus × Career Pilot Research

Status: Phase 1 research baseline  
Research date: 2026-08-15  
Scope: Nursing ↔ Registered Nurse, Electrotechnology ↔ Electrician, Computing/IT ↔ Software Developer

This document records the first research pass for implementing the Campus × Career constitution in Australia. It distinguishes reusable CampCareer assets from evidence that must be rebuilt or refreshed.

No schema or production-data mutation is included in this phase.

---

## 1. Why Australia is the first pilot

Australia is the strongest first-country test because the three required evidence layers are all available from official or government-endorsed systems:

- education/provider/course identity for international students — CRICOS
- higher-education graduate outcomes — QILT / ComparED
- VET/apprenticeship outcomes — NCVER
- national occupation shortage and labour-market evidence — Jobs and Skills Australia
- regulated-health programme approval — Ahpra / National Boards
- national VET qualification/provider scope — training.gov.au

Australia also tests both university and non-university pathways, which is necessary if `Campus` is meant to represent education/training value rather than only traditional university ranking.

---

## 2. Source authority matrix

### CRICOS — international course/provider identity

Authority: Australian Government Department of Education  
Primary site: https://cricos.education.gov.au/

Use for:

- CRICOS course code
- institution/provider identity
- course level
- field of education
- course language
- duration
- tuition / non-tuition / estimated total course cost when published
- registered delivery locations
- international-student eligibility through CRICOS registration

CRICOS search explicitly supports field of education, course level, course name, CRICOS code and VET national code. It covers both higher education and VET providers offering courses to student-visa holders.

Product rule:

CRICOS proves that a course/provider is registered for overseas students. It does not by itself prove professional registration eligibility, graduate outcomes, current admissions openness or comparative value.

### QILT / ComparED — higher-education graduate outcomes

Authority: Quality Indicators for Learning and Teaching, government-endorsed national survey system  
Primary site: https://www.qilt.edu.au/  
ComparED: https://www.compared.edu.au/

Use for:

- full-time employment
- overall employment
- median full-time salary
- further study
- supporting satisfaction measures

The Graduate Outcomes Survey measures graduates approximately four to six months after course completion. ComparED pools recent survey years to improve reliability and displays confidence intervals.

Important granularity rule:

ComparED outcomes are suitable as institution × study-area × qualification-level evidence. They are not automatically exact-programme outcomes.

When applied to a specific programme, normally mark the outcome evidence as `estimated` unless a more direct official programme-level source exists.

### QILT GOS-L — medium-term context

Primary site: https://qilt.edu.au/surveys/graduate-outcomes-survey---longitudinal-%28gos-l%29

Use for:

- three-year graduate employment context
- three-year graduate salary context

V1 score does not require GOS-L because publication granularity and coverage need a separate implementation audit. It is a strong future supporting layer.

### NCVER — VET and apprenticeship outcomes

Authority: National Centre for Vocational Education Research  
VET Student Outcomes 2025: https://www.ncver.edu.au/research-and-statistics/publications/all-publications/vet-student-outcomes-2025  
Apprentice and Trainee Outcomes 2025: https://www.ncver.edu.au/research-and-statistics/publications/all-publications/apprentice-and-trainee-outcomes-2025

Use for:

- qualification/training-package outcomes
- employment improvement
- post-training income where available
- apprenticeship completion/outcome context

Current public evidence supports strong outcome analysis for Electrotechnology/trades. For example, NCVER's 2025 VET Student Outcomes publication reports Electrotechnology among the training packages with the highest improved-employment-status outcomes for qualification completers.

Critical limitation:

National or training-package outcomes do not justify different ROI scores between individual RTOs. Provider-level Campus ROI requires provider-comparable outcome evidence or must remain score-not-ready.

### training.gov.au — VET qualification and RTO scope

Authority: National Training Register  
Electrician qualification: https://training.gov.au/training/details/UEE30820

Use for:

- national qualification code/status
- qualification level
- ANZSCO/taxonomy classification
- units/release status
- RTOs authorised to deliver/assess the qualification

UEE30820 Certificate III in Electrotechnology Electrician is current and maps to Electrician (General), Certificate III and the Electrotechnology sector. The register currently exposes a broad RTO delivery list, including providers with international delivery notification.

Product rule:

RTO scope is not the same as a CRICOS international course offering, current intake, apprenticeship contract availability or provider-specific graduate outcome.

### Jobs and Skills Australia — Career evidence

Authority: Jobs and Skills Australia  
Occupation shortage: https://www.jobsandskills.gov.au/data/occupation-shortage

Use for:

- Occupation Shortage List
- shortage status by occupation/state
- labour-market occupation profiles
- employment
- earnings
- employment-growth context

The 2025 OSL publishes downloadable six-digit ANZSCO/OSCA evidence and state/territory results.

Product rule:

The public Career score still follows `docs/CAMPCAREER_SCORE_CONTRACT.md`. Old Opportunity Score totals remain non-canonical.

### Ahpra / NMBA — Registered Nurse approval and registration

Approved programs: https://www.ahpra.gov.au/accreditation/approved-programs-of-study.aspx  
NMBA English standard: https://www.nursingmidwiferyboard.gov.au/registration-standards/english-language-skills.aspx

Use for:

- approved programmes of study leading toward registration
- registration-related pathway evidence
- nursing English-language registration standard

Ahpra states that graduates of approved programs are qualified for registration subject to the remaining registration requirements.

The NMBA English language skills registration standard applies to initial nursing/midwifery registration. It must remain separate from a university's admission-English requirement.

---

## 3. Proprietary ranking research — QS

QS datasets and ranking data are proprietary/licensed data products.

Current reference:

- https://www.qs.com/terms-and-conditions/qs-analytics-terms
- https://www.qs.com/solutions/datasets

The current QS Analytics/Datasets terms define dataset access through licence/API/technical methods and restrict use/display according to the applicable licence/order.

Decision:

- create a neutral external-ranking data contract in the future
- do **not** scrape QS rankings into production
- do **not** make QS a Campus MVP dependency
- enable a QS sort/filter only after CampCareer has display rights suitable for the intended public/commercial product
- never include QS in Campus ROI Score v1

---

## 4. Live CampCareer database inventory

Snapshot queried from Supabase project `babylusxcknjerxtepoc` on 2026-08-15.

### Canonical education assets

Live reusable tables include:

- `catalog.institutions`
- `catalog.programmes`
- `catalog.programme_offerings`
- `catalog.programme_fees`
- `catalog.programme_requirements`
- `catalog.programme_identifiers`
- `public.courses_au`
- `public.au_program_identity_v1`
- institution/programme read-model views

Australia active programme inventory:

- active programmes: **11,670**
- with a verified offering: **11,600**
- with at least one fee row: **9,693**
- with at least one requirement row: **15**

Conclusion:

CampCareer already owns a large Australian course/provider identity and fee asset. The major Campus gap is not catalogue size. It is **comparable outcome joins, field-aware scoring, requirements, and canonical cross-linking**.

### Historical ROI asset

`public.roi_explorer_au` currently exists as a view.

Audit result:

- 44 rows
- `field_name` is null for all 44 current rows

Conclusion:

The current ROI view cannot power `Country + Major → programme/provider` rankings.

Reuse:

- UI concepts
- compare patterns
- field names such as tuition/earnings/employment
- percentile score mechanics after refactoring

Do not reuse as canonical Campus data:

- current `roi_score`
- current `payback_years`
- institution-only cohort logic

### Existing score code

`src/lib/school-score.ts` already implements:

- Earnings 45%
- Employment 30%
- Affordability 25%
- percentile-relative peer scoring

Its own source comment correctly says this is not an ROI calculation and scores change with the peer cohort.

Decision:

Reuse its scoring mechanics only after enforcing the new Campus cohort contract in `docs/CAMPUS_ROI_SCORE_CONTRACT.md`.

---

## 5. Live vertical coverage

### A. Nursing / Registered Nurse

#### Existing education inventory

Approximate current catalogue match:

- 187 active Nursing-related programmes in `catalog.programmes`
- 40 institutions
- 184 with verified offerings
- 143 with fee evidence
- only 10 with requirement rows

Legacy `public.courses_au` match:

- 185 Nursing-related courses
- 40 institutions
- CRICOS code present across the matched set
- tuition populated across the matched set
- official-course URL coverage is sparse relative to total inventory
- existing `employment_rate` field is not populated for the matched set

#### Existing Career evidence

`AU:registered-nurse` is currently `decision_ready` in the occupation profile layer.

Latest live stored evidence includes:

- official unit group: OSCA 2654
- registration required: yes
- authority: Nursing and Midwifery Board of Australia
- employment: 366,200
- median weekly earnings: A$2,192
- all-occupations comparison: A$1,852
- stored vacancy trend and growth evidence

The stored source components are historical evidence inputs. Public calculation must use the current CampCareer Score contract rather than the stored old Opportunity Score.

#### Current programme links

Three Career→Programme references exist, but they use legacy/custom string identifiers rather than one canonical programme-ID contract.

#### Nursing verdict

**Best first end-to-end launch candidate.**

Why:

- Career evidence is already decision-ready
- programme supply is strong
- CRICOS identity/fees are strong
- QILT gives institution × Nursing × level graduate outcomes
- Ahpra can verify direct registration pathways

Required work before Campus score publication:

1. normalise Nursing bachelor / graduate-entry cohorts
2. join QILT/ComparED provider × Nursing × level outcomes
3. verify approved RN programmes against Ahpra
4. refresh official programme URLs
5. ingest admission English requirements for the initial score-ready cohort
6. distinguish admission English from NMBA registration English
7. remap legacy Career→Programme refs to canonical programme IDs

Target first cohort:

Start with a deliberately small set of approximately 8–15 well-evidenced Nursing programmes rather than ranking all 187 immediately.

---

### B. Electrotechnology / Electrician

#### Existing Career evidence

`AU:electrician` is `decision_ready`.

Latest live stored evidence includes:

- OSCA unit group 3812
- registration/licensing required
- employment: 197,300
- median weekly earnings: A$2,191
- all-occupations comparison: A$1,852
- strong stored shortage/vacancy evidence

The Jobs and Skills Australia public Electricians page also reports A$2,191 median weekly full-time earnings versus A$1,852 for all occupations using May 2025 earnings evidence.

#### Education/training reality

The core qualification is UEE30820 Certificate III in Electrotechnology Electrician.

training.gov.au lists current RTOs able to deliver/assess the qualification. However the current CampCareer canonical programme/title search does not expose a comparable electrician-provider cohort in the same way Nursing/IT do.

A single existing Career→Programme reference uses a VET-specific custom ref:

`au-vet:tafe-nsw:UEE30820`

This does not currently resolve through the canonical `courses_au` integer-ID contract.

#### Outcome limitation

NCVER provides strong VET/apprenticeship outcomes, but the publicly comparable data inspected in this phase is primarily qualification/training-package/apprenticeship level.

That is not enough to award different provider-specific ROI scores merely because 75 RTOs may be authorised to deliver the qualification.

#### Electrician verdict

**Second pilot, intentionally score-not-ready on Campus at first if provider evidence cannot differentiate options.**

This is a feature, not a failure. It tests whether CampCareer can show a high-value pathway without manufacturing a provider ranking.

Required work:

1. define a canonical VET programme/provider entity mapping
2. join training.gov.au qualification/RTO scope with CRICOS international offering evidence where relevant
3. model apprenticeship/licensing pathway separately from classroom course identity
4. audit provider-level tuition and international availability
5. determine whether any public comparable provider-level outcome source exists
6. if no defensible provider-level outcomes exist, publish provider facts + pathway with `ROI score not ready yet`
7. preserve NCVER outcome evidence as pathway/qualification context

---

### C. Computing / IT / Software Developer

#### Existing education inventory

Approximate current catalogue match:

- 1,105 active Computing/IT-related programmes
- 42 institutions
- 1,099 verified offerings
- 979 with fee evidence
- only 2 with requirement rows

Legacy `public.courses_au` match:

- 1,105 courses
- 42 institutions
- CRICOS and tuition coverage are broad
- official-course URL coverage is sparse
- existing `employment_rate` field is not populated for the matched set

#### Existing Career evidence

`AU:software-developer` is currently only `profile_ready`, not `decision_ready`.

It is presently represented with official title `Software Engineer`, OSCA unit group 2733, while parts of the labour evidence use broader/legacy software-programmer group data.

Latest live stored evidence includes:

- median weekly earnings: A$2,537
- all-occupations comparison: A$1,852
- vacancies and growth context
- employment total currently null in the canonical snapshot
- no statutory national occupational registration

#### Software verdict

**Third pilot. Do not publish a new public score until canonical scope/evidence is reconciled.**

This vertical is valuable because it tests:

- non-regulated career entry
- many possible degrees rather than one mandatory qualification
- related-programme breadth
- strong pay but mixed/less direct shortage evidence

Required work:

1. lock the canonical Australian career scope: Software Developer vs Software Engineer vs broader programmer grouping
2. refresh OSCA-aligned employment/demand evidence where available
3. reconstruct Demand/Pay/Entry under the #244 Career Score contract
4. create a controlled Computing/IT field taxonomy for Campus
5. join QILT provider × Computing/IT × level outcomes
6. ingest English/admission requirements for the initial cohort
7. remap current `au-program:*` links to canonical programme IDs

---

## 6. Identifier problem discovered

The existing `country_occupation_program_links.program_ref` layer currently contains mixed identifier styles across the three pilots, including:

- human-readable programme slugs
- `au-program:{legacy_id}`
- VET-specific refs such as `au-vet:tafe-nsw:UEE30820`

These values do not all resolve directly to `catalog.programmes.id`.

Decision for implementation phase:

The new Campus↔Career graph should converge on canonical `catalog.programmes.id` / offering/provider relationships, with compatibility mapping for legacy refs during migration.

Do not create another permanent parallel identifier system.

---

## 7. Main data gaps across Campus

### Gap 1 — field-aware outcomes

Current historical ROI rows are institution-level. Campus needs provider × field × qualification-level outcome joins.

### Gap 2 — programme requirements

Only 15 of 11,670 active Australian programmes currently have requirement rows in the canonical catalog.

English/admission filtering therefore requires targeted ingestion before it can be a reliable broad filter.

### Gap 3 — VET canonicalisation

The canonical higher-education catalogue is much stronger than Electrician VET/provider mapping.

### Gap 4 — programme-to-career canonical IDs

Legacy relation refs need migration/compatibility mapping.

### Gap 5 — proprietary rankings

QS is not a free production dependency. Keep the filter slot disabled until licensed.

### Gap 6 — outcome confidence

QILT provider×study-area outcomes must be disclosed as an estimate when inherited by an individual programme.

---

## 8. Asset reuse plan

### Reuse directly

- `docs/CAMPCAREER_SCORE_CONTRACT.md`
- Career detail page core flow
- AU occupation evidence/provenance for RN and Electrician after freshness checks
- `catalog.institutions`
- `catalog.programmes`
- `catalog.programme_offerings`
- `catalog.programme_fees`
- `public.courses_au` as compatibility/source inventory
- current Compare interaction patterns
- verified campus/delivery-location assets where provenance is strong

### Reuse after refactor

- `src/lib/school-score.ts` percentile mechanics
- AU study cards/filter UI
- current ROI result field vocabulary
- Career→Programme relations after canonical-ID remapping

### Do not treat as canonical without rebuild

- historical `public.roi_explorer_au.roi_score`
- historical `payback_years`
- institution-wide ROI
- old Opportunity Score totals
- automatic keyword programme↔career relations
- unlicensed QS data

---

## 9. Pilot execution order after this research phase

### 1. Nursing / Registered Nurse

Goal: first fully score-ready Campus↔Career vertical.

Definition of done:

- controlled Nursing cohort
- at least 5 complete comparable programme rows across at least 3 institutions
- CRICOS identity/cost
- QILT outcome join
- Ahpra approved-program verification
- programme admission requirements for displayed cohort
- Campus ROI Score
- Career Score preserved
- bidirectional linking
- Compare-ready data
- verified delivery locations for Map

### 2. Electrician

Goal: prove the product supports VET/apprenticeship without false provider ranking.

Definition of done:

- canonical UEE30820 pathway
- provider/RTO/international offering identities
- licensing/apprenticeship explanation
- provider comparison on verified facts
- Campus ROI only if provider-comparable evidence passes readiness
- Career Score + jobs/pathway linkage

### 3. Software Developer

Goal: prove a broad, non-regulated professional career can connect to many education options without implying that a degree is mandatory.

Definition of done:

- canonical Career scope fixed
- #244 Career Score readiness rebuilt
- controlled Computing/IT Campus cohort
- QILT outcome join
- fee/requirements refresh for initial cohort
- programme relationship types distinguish direct/common/related

---

## 10. Phase 1 conclusion

The product direction is feasible without discarding CampCareer's existing assets.

The largest existing asset is the Australian programme/provider catalogue and Career evidence base. The largest missing layer is a trustworthy join that turns those assets into **comparable field-specific education decisions**.

Therefore the next implementation task should not be `restore ROI explorer`.

It should be:

> **Build the Australia Nursing Campus cohort and the canonical Campus outcome/readiness pipeline, then connect it to the existing Registered Nurse Career.**

That creates the first real Campus × Career loop and becomes the template for Electrician and Software Developer.
