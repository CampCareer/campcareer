# Singapore Programs Phase 1 — Discovery

Status: complete

Scope: Singapore only. This rollout is stacked on `agent/programs-de`. Do not enable or modify another country as part of this branch.

## Existing publication baseline

The existing Singapore institution publication cohort contains exactly six canonical local universities and must remain unchanged for the initial Programs rollout:

| Institution | Slug | Existing campus city |
|---|---|---|
| National University of Singapore | `national-university-of-singapore` | Singapore |
| Nanyang Technological University | `nanyang-technological-university` | Singapore |
| Singapore Management University | `singapore-management-university` | Singapore |
| Singapore Institute of Technology | `singapore-institute-of-technology` | Singapore |
| Singapore University of Social Sciences | `singapore-university-of-social-sciences` | Singapore |
| Singapore University of Technology and Design | `singapore-university-of-technology-and-design` | Singapore |

Production `institution_explorer_sg_v1` currently reports `program_count = 0` for all six institutions. There is therefore no existing Singapore canonical programme cohort to reuse.

## National source boundary

### Institution and international-student boundary

- Ministry of Education post-secondary overview: https://www.moe.gov.sg/post-secondary/overview
- Immigration & Checkpoints Authority, Student's Pass for Institutes of Higher Learning: https://www.ica.gov.sg/reside/STP/apply/ihl

ICA explicitly lists all six existing CampCareer Singapore universities as local universities for the Institutes of Higher Learning Student's Pass route. A foreign student needs a Student's Pass when accepted as a full-time matriculated or registered student at one of the listed IHLs, subject to ICA exceptions.

Consequences for CampCareer publication:

1. Autonomous-university status or IHL listing proves provider context. It does not prove that a particular programme is open for applications.
2. A programme must not be marked internationally eligible merely because the provider appears on the ICA IHL list.
3. Part-time programmes are not automatically treated as Student's Pass pathways. International publication requires programme- or admission-level evidence appropriate to the study mode.
4. Programme existence, full-time/part-time study mode, international eligibility, current application state and Student's Pass context remain separate facts.

## Official programme source hierarchy

Programme identity must come from the university that awards or jointly awards the degree. National/IHL sources are context layers, not programme catalogues.

### National University of Singapore

Primary programme sources:

- Undergraduate programmes: https://nus.edu.sg/oam/undergraduate-programmes
- NUS Bulletin AY2026/27: https://www.nus.edu.sg/nusbulletin/ay202627/programmes/

Collection rule:

- Use the official programme/degree title published by NUS.
- Do not create separate CampCareer programmes from minors, second majors, specialisations or elective tracks unless the university publishes them as separately awarded degree programmes.
- Concurrent/double/joint degree pathways must remain distinct from ordinary single-degree programmes when the award structure is materially different.

### Nanyang Technological University

Primary programme sources:

- Degree programmes: https://www.ntu.edu.sg/education/degree-programmes
- Graduate coursework programmes: https://www.ntu.edu.sg/admissions/graduate/coursework

Collection rule:

- Prefer the current degree-programme directory for stable programme identity.
- Use individual admissions/programme pages for current intake and application-window evidence.

### Singapore Management University

Primary programme sources:

- University programmes: https://www.smu.edu.sg/programmes
- Postgraduate programme directory: https://masters.smu.edu.sg/programmes

Collection rule:

- Undergraduate degrees and postgraduate degree programmes are separate programme identities.
- Executive and professional programmes may be collected only when they lead to a university-awarded degree and the study mode/international route can be represented accurately.

### Singapore Institute of Technology

Primary programme sources:

- Undergraduate programmes: https://www.singaporetech.edu.sg/undergraduate-programmes
- Postgraduate coursework programmes: https://www.singaporetech.edu.sg/postgraduate/coursework

Collection rule:

- Preserve SIT-only, joint-degree and overseas-university partner award context separately.
- Do not collapse joint degrees and SIT-only degrees with similar subject names.
- Health, engineering, aviation, maritime and culinary programmes may have profession-specific recognition or licensing evidence; that evidence must not be inferred from the programme title.

### Singapore University of Social Sciences

Primary programme sources:

- Full-time undergraduate programmes: https://www.suss.edu.sg/academics/programmes/full-time-undergraduate
- Graduate programmes: https://www.suss.edu.sg/academics/programmes/graduate-programmes
- Graduate programme directory: https://www.suss.edu.sg/academics/programmes/graduate-programmes/programmes

Collection rule:

- The initial international programme cohort prioritises full-time degree programmes.
- Part-time undergraduate programmes remain discovery-only unless a current official source supports an international full-time/Student's Pass pathway for that specific programme.
- Graduate certificates and diplomas are not silently converted into Master's programmes even when they are stackable.

### Singapore University of Technology and Design

Primary programme sources:

- Undergraduate education: https://www.sutd.edu.sg/education/undergraduate
- Graduate Master's directory: https://www.sutd.edu.sg/admissions/graduate/masters

Collection rule:

- Preserve current award titles and programme mode.
- A closed 2026 application window does not mean the programme is discontinued.
- A future intake may be `not_yet_open` only when the university has published the future intake/window.

## Admission-state semantics

Allowed canonical international admission states remain:

- `open`: a current official source supports an application window that is open as of the verification date.
- `closed`: a current official source supports that the relevant application window has closed and no stronger current future-open assertion is made.
- `not_yet_open`: a future intake/window is officially published but has not opened yet.
- `restricted`: applicant category, nomination, employment, citizenship/residency, partner or other pathway restrictions prevent a universal open/closed interpretation.
- `eligible_schedule_unknown`: programme/international pathway evidence exists but a current application schedule cannot be asserted safely.
- `unknown`: evidence is insufficient even for the international-pathway classification.

Programme existence must never be converted into `open` by inference.

## Accreditation and professional-recognition boundary

The Singapore Programs rollout must not create a generic programme-accreditation claim from any of the following alone:

- autonomous-university status;
- ICA IHL listing;
- university degree-awarding authority;
- a programme's presence in the university catalogue.

Profession-specific accreditation, registration or licensing evidence may be added only when an official regulator or professional body can be matched to the individual programme. Regulated health, law, engineering, architecture, aviation and other protected pathways require separate evidence and must not be inferred from degree identity.

## Phase 2 collection contract

Phase 2 must create three private server-only staging layers:

1. `program_catalog_sg_staging`
2. `program_international_sg_staging`
3. `program_occupation_sg_staging`

Collection requirements:

- six-institution cohort remains fixed;
- official programme URL required for every catalogue row;
- source date required for every publishable row;
- study mode recorded explicitly;
- international evidence remains one-to-one with each programme considered for publication;
- programme-to-career relationships are manually reviewable and do not imply professional licensing;
- `anon` and `authenticated` access remains revoked;
- service-role-only access is used for staging and publication read models.

## Phase plan

- Phase 1: discovery and source boundary — complete.
- Phase 2: bounded collection — started with staging foundation; programme seed not yet complete.
- Phase 3: verification — not started.
- Phase 4: canonicalization and read models — not started.
- Phase 5: Programs explorer/detail/SEO publication — not started.

No country after Singapore is in scope for this branch.
