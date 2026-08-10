# US Programs — Phase 1 Discovery and Source Model

Date: 2026-08-10  
Branch: `agent/programs-us`  
Scope: United States `/programs` only. This phase establishes the baseline, authority hierarchy, product boundary and Phase 2 collection contract. It does not seed staging tables, canonicalize programmes, publish UI routes, merge to `main`, or start another country.

## 1. Product boundary

CampCareer is not building a general catalogue of every U.S. degree or certificate.

The programme product boundary is the existing CampCareer canonical 80 programme-matching occupations. A U.S. programme is worth collecting only when it supports at least one of those target careers with a defensible education relationship.

Consequences:

- do not import the full U.S. postsecondary catalogue;
- do not treat every IPEDS/College Scorecard field-of-study row as a product programme;
- do not add popular degrees solely because they are popular;
- do not force a university degree onto a trade or technician career when the educational pathway is different;
- preserve `direct` versus `related` pathway semantics;
- programme relevance does not imply occupational licensing, immigration eligibility, OPT eligibility or employment eligibility.

Phase 2 should remain compact. There is no per-institution quota. Selection should maximize useful target-career coverage with the smallest defensible programme cohort.

## 2. Current CampCareer baseline

Production database audit on 2026-08-10:

| Asset | Current state |
| --- | ---: |
| Canonical U.S. institutions in `catalog.institutions` | 6,220 |
| Existing Tier A U.S. institution identities | 25 |
| Tier A institution explorer rows | 25 |
| Tier A institution location rows | 25 |
| U.S. city directory rows | 8 |
| U.S. city↔institution directory rows | 308 |
| U.S. city↔programme directory rows | 0 |
| Canonical U.S. programmes | 0 |
| Canonical U.S. programme offerings | 0 |
| `ingest.programs_us` rows | 106,083 |
| U.S. `country_occupation_profiles` rows | 0 |
| U.S. rows in `core.qualification_frameworks` | 0 |

There are no `program_catalog_us_staging`, `program_occupation_us_staging` or U.S.-specific programme international/OPT staging tables yet.

### Existing broad U.S. ingest is not a canonical programme catalogue

`ingest.programs_us` currently contains:

- `college_id`;
- `cip_code`;
- `field_name`;
- median earnings;
- employment rate;
- sync timestamp.

It does **not** contain the exact current programme title, award level, official programme URL, campus/delivery evidence, international-admission evidence, SEVP evidence, programme-specific CIP evidence from a current programme source, or licensing/accreditation evidence.

Therefore the 106,083-row ingest is discovery/analytics input only. It must not be promoted wholesale into `catalog.programmes`.

## 3. Existing Tier A institution cohort

The existing U.S. institution publication layer already defines a 25-institution Tier A cohort using stable canonical institution IDs and IPEDS UNITIDs. Phase 1 reuses those identities instead of creating duplicate provider records.

| Rank | Institution | UNITID |
| ---: | --- | --- |
| 1 | Johns Hopkins University | 162928 |
| 2 | University of Michigan | 170976 |
| 3 | University of Washington | 236948 |
| 4 | UC San Diego | 110680 |
| 5 | Columbia University | 190150 |
| 6 | UC San Francisco | 110699 |
| 7 | University of Colorado Boulder | 126614 |
| 8 | Vanderbilt University | 221999 |
| 9 | University of Pittsburgh | 215293 |
| 10 | Washington University in St. Louis | 179867 |
| 11 | University of Pennsylvania | 215062 |
| 12 | Stanford University | 243744 |
| 13 | Duke University | 198419 |
| 14 | Yale University | 130794 |
| 15 | UCLA | 110662 |
| 16 | New York University | 193900 |
| 17 | Cornell University | 190415 |
| 18 | University of North Carolina at Chapel Hill | 199120 |
| 19 | Northwestern University | 147767 |
| 20 | University of Minnesota Twin Cities | 174066 |
| 21 | The University of Texas at Austin | 228778 |
| 22 | Penn State | 214777 |
| 23 | Emory University | 139658 |
| 24 | University of Wisconsin–Madison | 240444 |
| 25 | Harvard University | 166027 |

The underlying institution publication migration is `20260809131500_us_ncses_top25_institution_publication.sql`.

### Cohort policy

- **Tier A initial collection:** reuse the existing 25 institution identities.
- **Tier B bounded expansion:** add a non-Tier-A institution only when an important target occupation has no defensible pathway in the Tier A cohort or when the occupation structurally depends on a provider type underrepresented by the research-university cohort (for example, a specialised aviation, technical, community-college or professional pathway).
- Tier B expansion must be occupation-led, not ranking-led and not catalogue-led.
- Do not attempt to represent all 6,220 canonical U.S. institutions in the programme product.

## 4. U.S. programme identity model

The United States does not have a single national qualification framework comparable to NZQCF, AQF or RQF.

For CampCareer, programme identity should therefore keep the following dimensions separate:

1. canonical institution identity / UNITID;
2. exact current programme or major title from the institution;
3. award/credential level (certificate, associate, bachelor, master's, doctoral/professional, etc.);
4. CIP 2020 code where current evidence supports an exact mapping;
5. programme/campus delivery evidence where explicitly published;
6. institutional and, when applicable, programmatic accreditation;
7. international-student / SEVP context;
8. F/M student-visa context;
9. OPT and STEM OPT context;
10. occupation-specific professional registration/licensing context.

Phase 1 does not create synthetic U.S. `core.qualification_frameworks` rows. Phase 2 should store U.S. award level and CIP directly in U.S. staging until a shared credential model is deliberately designed.

## 5. Authoritative source hierarchy

### Tier A — exact programme identity

**Institution official programme page / academic catalogue**

Primary use:

- exact programme/major title;
- credential/award;
- current status;
- curriculum and pathway evidence;
- duration/credits when published;
- application route and programme-specific admission facts;
- programme-specific campus/location where explicitly stated;
- programme-specific CIP when the institution publishes it.

An institution home page is not enough to prove an exact programme, intake or delivery campus.

### Tier A — federal institution and field classification

**NCES IPEDS / CIP 2020**  
https://nces.ed.gov/ipeds/  
https://nces.ed.gov/ipeds/cipcode/Default.aspx?y=56

Primary use:

- stable UNITID;
- U.S. programme taxonomy through six-digit CIP codes;
- award-level/completions evidence;
- discovery of institution × CIP × award-level combinations;
- distance-education flags where useful.

IPEDS Completions records degrees/certificates by award level and six-digit CIP. CIP 2020 is the current NCES classification system.

Boundary:

- IPEDS/CIP is excellent structured discovery and corroboration;
- a CIP row does not by itself establish the current marketed programme title, current admissions page or programme-specific international eligibility;
- do not infer STEM OPT from a broad field label alone.

**U.S. Department of Education College Scorecard**  
https://www.ed.gov/higher-education/find-college-or-educational-program

Primary use:

- institution/field discovery;
- cost and outcome context;
- secondary structured corroboration.

Boundary:

- Scorecard is not the sole source for exact current programme identity or immigration status.

### Tier A — accreditation

**U.S. Department of Education accreditation resources / Accredited Postsecondary Institutions and Programs database**  
https://www.ed.gov/laws-and-policy/higher-education-laws-and-policy/college-accreditation

Primary use:

- institutional accreditation;
- Department-recognized accreditor context;
- programmatic accreditation where reported.

Boundary:

- accreditation is not SEVP certification;
- accreditation is not proof that an international student can enter a particular programme;
- programme relevance does not imply state professional licensure eligibility.

### Tier A — F/M international-student school eligibility

**DHS Study in the States — School Search / SEVP-certified schools**  
https://studyinthestates.dhs.gov/school-search

Primary use:

- whether a school/campus is SEVP-certified;
- whether it is certified for F-1 and/or M-1 students;
- campus-level identity where the federal source distinguishes campuses.

Boundary:

- SEVP certification is provider/campus context, not automatic proof that every programme is open to international applicants;
- multi-campus schools require careful campus matching;
- do not infer programme delivery location from an institution's main SEVP campus.

### Tier A — student visa process

**U.S. Department of State — Student Visa**  
https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html

Primary use:

- F versus M visa category;
- requirement to be accepted by a SEVP-approved school;
- SEVIS / Form I-20 process;
- applicant-level visa process.

Boundary:

- programme existence or SEVP school status does not guarantee visa issuance;
- visa eligibility/outcome must remain applicant-specific.

### Tier A — practical training / OPT

**USCIS — Practical Training / OPT / STEM OPT**  
https://www.uscis.gov/node/92821

Primary use:

- current CPT/OPT/STEM OPT eligibility rules;
- requirement that practical training relate to the student's major;
- STEM OPT applicant/school/employer conditions.

STEM OPT must be modelled as a separate, qualification- and applicant-sensitive layer. Current USCIS guidance requires, among other conditions, a qualifying bachelor's/master's/doctoral STEM degree whose CIP code appears on the DHS STEM Designated Degree Program List; the school must meet accreditation/SEVP conditions and the employer must meet STEM OPT requirements such as E-Verify.

Boundary:

- never label a programme `STEM OPT eligible` from title keywords such as “data”, “engineering”, “analytics” or “technology”;
- exact CIP evidence is required before a positive STEM designation;
- even with a STEM CIP, CampCareer must not represent an applicant-specific STEM OPT outcome as guaranteed.

**ICE / DHS STEM Designated Degree Program List**  
https://www.ice.gov/sevis/practical-training

Primary use:

- authoritative list/version context for STEM-designated CIP codes.

The STEM list must be effective-dated. A programme's exact CIP and the DHS list version/check date must both be retained.

## 6. Occupation-specific regulatory boundary

For regulated careers, general university accreditation is not enough.

Phase 2/3 must attach additional evidence only where relevant to the target occupation. Examples include:

- nursing: state board approval plus relevant nursing accreditation where needed;
- medicine and allied health: programme-specific professional accreditor and state licensing pathway as applicable;
- pharmacy: professional accreditation/licensure path;
- physical therapy: programme-specific professional accreditation/licensure path;
- social work: programme accreditation and state licensure path;
- teaching: state educator preparation/teacher licensure requirements;
- engineering: ABET/programme accreditation where relevant plus state PE licensing boundary;
- architecture: professional accreditation and state licensure boundary;
- aviation: FAA-approved training/certification pathway where the target career is pilot-related.

These are examples, not a substitute for occupation-specific verification. The relevant authority differs by profession and state.

A `direct` programme→career relationship means the programme is a defensible education pathway. It never means that graduation alone grants a professional licence.

## 7. Programme location policy

Existing U.S. institution and city data must not be reused as programme-delivery evidence.

Current state:

- 8 published U.S. city directory rows;
- 308 city↔institution rows;
- 0 city↔programme rows.

Phase 2 must preserve that 0 until an exact programme source identifies a campus/location or another authoritative programme-level source supports the linkage.

Rules:

- institution city ≠ programme city;
- SEVP main campus ≠ every programme campus;
- IPEDS institution address ≠ programme delivery location;
- an online/hybrid programme must not be assigned a physical programme city without evidence.

## 8. International-study data model for later phases

Programme existence, international admission, SEVP status, visa and work authorization must remain separate fields.

Recommended Phase 2 U.S. staging dimensions:

### Programme catalogue staging

- source name/key;
- canonical institution ID;
- UNITID;
- exact source programme title;
- credential/award level;
- CIP code and CIP evidence state;
- official programme URL;
- official catalogue URL where useful;
- programme authority/accreditation context;
- duration/credits;
- programme-delivery campus/city plus verified flag;
- source-as-of date;
- verification tier and collection status.

### Programme ↔ occupation staging

- programme staging ID;
- canonical career ID from the existing 80-career programme-matching set;
- relation type: `direct`, `common_pathway`, `related`;
- match basis;
- review status;
- source/review date;
- professional/licensing caveat where required.

The canonical 80-career boundary is currently represented by the 80 approved `CA / v1` rows in `public.program_occupation_match_rules`. U.S. Phase 2 should validate its career IDs against that product set rather than inventing new career IDs.

### International / SEVP / OPT staging

Keep distinct fields for:

- programme-level international-student evidence;
- international application state / intake / deadline;
- SEVP-certified school/campus status and source;
- F-1 versus M-1 context;
- student-visa context and source;
- exact CIP verification status;
- STEM-designated CIP status;
- STEM list version/effective/check date;
- OPT/STEM OPT context;
- verification status and review date.

Recommended conservative defaults:

- international programme eligibility: `NULL` until programme/provider evidence is checked;
- SEVP status: unresolved until exact provider/campus match;
- current application window: unknown unless a current official source states it;
- STEM designation: `NULL` until an exact verified CIP is matched to the current DHS list;
- OPT outcome: never stored as a guaranteed boolean for an applicant.

## 9. Inclusion rules for Phase 2

A candidate enters the bounded seed only when all of the following are true:

1. it maps to at least one CampCareer canonical 80 occupation;
2. the institution identity can be resolved to a stable canonical institution/UNITID;
3. an exact current programme or catalogue source can be found;
4. the credential/award can be stated without guessing;
5. the programme→career relation can be explained in one sentence;
6. a `related` pathway is not misrepresented as `direct`;
7. no delivery campus/city is inferred from institution geography.

Priority order:

1. programmes with a strong direct relationship to a target occupation;
2. programmes that cover target careers not yet represented in the seed;
3. regulated-career programmes where authoritative evidence is clear;
4. programmes at the existing 25 Tier A institutions;
5. bounded Tier B provider expansion only where needed for occupation coverage.

## 10. Exclusion rules

Exclude from the Phase 2 bounded seed:

- programmes with no canonical-80 career relation;
- generic fields with no exact current programme identity;
- a College Scorecard/IPEDS field row presented as if it were the exact marketed programme;
- programme titles inferred from CIP descriptions;
- international eligibility inferred solely from school prestige or SEVP status;
- STEM OPT inferred from degree title keywords;
- campus/city inferred from the institution's address;
- professional licensure inferred from graduation;
- stale programme pages with no evidence the programme remains current;
- broad catalogue expansion merely to increase row count.

## 11. Phase 2 collection strategy

Recommended execution sequence:

1. create U.S.-specific service-role-only staging tables;
2. use existing 25 Tier A institutions as the first provider pool;
3. build an occupation-led candidate matrix from the canonical 80 careers;
4. use `ingest.programs_us`, IPEDS/CIP and College Scorecard for discovery only;
5. confirm the exact programme on the institution's current official site;
6. assign `direct` / `common_pathway` / `related` conservatively;
7. store international/SEVP/OPT dimensions separately with conservative null defaults;
8. add Tier B institutions only when a target-career gap justifies it;
9. keep programme city/campus unlinked unless programme-level evidence is available;
10. stop once a compact, high-value occupation-led seed is achieved rather than continuing toward national completeness.

Phase 2 should optimize **career usefulness per programme row**, not raw programme count.

## 12. Phase 1 decision

US Programs Phase 1 is ready for handoff to Phase 2.

The key architectural decision is that the existing 106,083 U.S. ingest rows are a discovery layer, while CampCareer's product catalogue will be a much smaller source-verified subset tied to the canonical 80 occupations.

Phase 2 has not started.
