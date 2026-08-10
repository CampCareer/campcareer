# UK Programs — Phase 1 Discovery

Date: 2026-08-09
Branch: `agent/programs-uk`
Scope: United Kingdom only. Do not advance to another country without explicit user instruction.

## Phase 1 goal

Establish the UK programme-data baseline before collection:

1. audit existing CampCareer UK programme/institution data;
2. define the UK qualification and provider-recognition model;
3. define the institution universe and inclusion rules that Phase 2 will use.

This phase does **not** publish or promote legacy UK course rows.

## 1. Existing CampCareer baseline

### Programme data

Current legacy surface:

- `public.courses_uk` → `ingest.courses_uk`
- 185 rows total.
- 50 distinct legacy programme institutions.
- all rows share the same `synced_at`: 2026-05-30.
- 169 rows are labelled `Bachelor`; 16 are labelled `Masters`.
- the legacy schema uses `aqf_level` and stores Bachelor as 8 / Masters as 9.
- only 9 broad `field_name` groups are represented:
  - Computer Science: 57
  - Business Administration / Management: 40
  - Engineering, General: 21
  - Law: 17
  - Medicine: 13
  - Registered Nursing: 11
  - Economics: 10
  - Mathematics: 9
  - Finance: 7
- one legacy `courses_uk` row (`university-of-hertfordshire` / `Business`) has no matching row in `ingest.colleges_uk`.

Canonical catalogue state:

- `catalog.programmes` currently contains 185 UK programmes, all active.
- all 185 currently have `qualification_level_id IS NULL`; none is mapped to a UK qualification framework.
- therefore the 185 rows are useful as legacy discovery seeds only, not as a publication-ready UK programme catalogue.

### Institution data

Current UK institution foundation is stronger than the programme layer:

- `public.institution_identity_uk_v1`: 50 institutions.
- all 50 have a canonical UUID/slug plus a UKPRN identifier.
- `public.institution_explorer_uk_v1`: 50 institutions.
- `public.colleges_uk`: 49 legacy rows.
- current 50-institution canonical set covers England, Scotland, Wales and Northern Ireland, but it is intentionally selective rather than a complete UK provider register.

Existing institution work from PR #52 is already merged to `main` and provides UK identity/location/detail/search/canonical-route infrastructure. UK programmes should reuse that identity layer rather than recreate institutions.

### City/programme linkage

- `public.city_directory_uk_v1`: 10 city rows.
- `public.city_programme_directory_uk_v1`: 0 rows.

Programme-to-city linkage is therefore not established yet and must not be inferred from institution presence alone.

### Occupation data

- `public.occupations_uk`: 408 legacy UK occupation rows.
- `public.country_occupation_profiles` currently has no UK rows.

The cross-country canonical 80-career programme workflow therefore does not yet have a UK country-profile layer. Phase 2 programme collection should still use the canonical 80-career product taxonomy as the target set; UK-specific occupation-profile publication can remain a separate concern.

## 2. UK education and qualification model

The legacy `aqf_level` column is not valid UK modelling and must not be carried into the new UK programme foundation.

### England, Wales and Northern Ireland

Use the UK qualification-level model for programme normalization:

- Level 4: CertHE / HNC-level higher education
- Level 5: DipHE / Foundation Degree / HND-level higher education
- Level 6: bachelor's / honours degree
- Level 7: master's / integrated master's / postgraduate diploma or certificate
- Level 8: doctorate

Official reference:
https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels

For Student-route eligibility, degree-level study is RQF 6/7/8; eligible full-time below-degree study can include RQF 3/4/5 subject to Student-route requirements.

Official reference:
https://www.gov.uk/student-visa/course

### Scotland

Scotland uses the SCQF and must keep its native level separately:

- SCQF 7: CertHE / Advanced Higher area
- SCQF 8: DipHE / HND area
- SCQF 9: ordinary bachelor's degree
- SCQF 10: honours degree
- SCQF 11: master's / postgraduate level
- SCQF 12: doctorate

Official reference:
https://scqf.org.uk/the-framework/know-your-scqf-level/

New UK programme staging should store both a canonical programme level and the native framework/level where known. Do not coerce Scottish programmes into an English-only level field.

## 3. Provider recognition and international-student evidence

Provider recognition and Student sponsorship are separate facts.

### International-student baseline

The Home Office / UKVI Register of Student sponsors is the UK-wide source for whether an institution is currently licensed for Student and/or Child Student sponsorship.

Current source checked for Phase 1: updated 2026-08-07.

Official source:
https://www.gov.uk/government/publications/register-of-licensed-sponsors-students

The register contains multiple provider types, including:

- Higher Education Institution (HEI)
- Publicly funded college
- Private provider
- Embedded college offering pathway courses
- Overseas Higher Education Institution
- Independent school

Therefore presence on the sponsor register alone is **not** sufficient for CampCareer institution inclusion.

Sponsor status is institution-level evidence only. It must not be interpreted as proof that every programme accepts international students or can issue a CAS for the current intake.

### Degree recognition is jurisdiction-specific

Official UK guidance explicitly separates recognition by nation:

- England: Office for Students Register / recognised awards
- Scotland: Scottish Government recognised/listed bodies
- Wales: recognised bodies in Wales
- Northern Ireland: Department for the Economy recognised/listed bodies

UK overview:
https://www.gov.uk/check-university-award-degree

England OfS Register:
https://www.officeforstudents.org.uk/for-providers/registering-with-the-ofs/guide-to-the-ofs-register/

The OfS Register currently reports 426 registered English providers. It is authoritative for regulatory status but is too broad to use as an automatic CampCareer programme-institution allowlist.

## 4. Institution scope for Phase 2

### Tier A — core programme institutions

Include when all are true:

1. provider has a stable canonical identity, preferably UKPRN;
2. provider is a recognised degree-awarding body **or** a clearly documented listed/validated higher-education delivery body;
3. provider has at least one programme relevant to the canonical 80 target careers;
4. for international publication, the provider is on the current Student sponsor register for the Student route;
5. programme evidence is obtainable from an official provider page or official admissions/course source.

The existing 50 canonical UK institutions are the initial seed set, not the final UK universe.

### Tier B — vocational / further-education expansion

Publicly funded colleges and listed bodies are eligible when they offer target-career programmes at relevant levels and have current Student-route sponsorship where international publication is intended.

This tier matters for occupations where university-only discovery would systematically miss the real training pathway, including examples such as construction trades, agriculture, maritime, technical engineering, aviation, hospitality and some health/allied-health pathways.

### Tier C — conditional private providers

Private providers may enter collection only when their exact role is verifiable, for example:

- they have recognised degree-awarding powers; or
- they deliver a formally validated/franchised programme with the awarding/lead body identified; and
- the exact target-career programme is current; and
- international Student-route suitability is evidenced.

Do not include a private provider merely because it appears on the Student sponsor register.

### Default exclusions

Exclude from the programme institution universe unless an exact target-programme exception is proven:

- independent schools / Child Student-only schools;
- English-language-only providers;
- overseas HEI study-abroad centres whose UK operation is not a UK target-career programme provider;
- theological-only providers without target-career relevance;
- embedded pathway colleges as duplicate standalone institutions when the substantive degree belongs to the host university;
- providers whose only evidence is an aggregator or ranking page.

## 5. Known geographic coverage gaps in the current 50-institution seed

The current set is strong on large research universities but incomplete for a nationwide target-career programme crawl.

### Scotland

The Scottish Government states that Scotland has 19 autonomous HE institutions and lists 18 recognised degree-awarding bodies, plus Glasgow School of Art as a validated HE institution.

Official source:
https://www.gov.scot/policies/universities/

Current seed already contains:

- University of Aberdeen
- University of Edinburgh
- University of Glasgow
- Heriot-Watt University
- University of St Andrews
- University of Strathclyde

Recognised Scottish bodies missing from the current seed and therefore Phase 2 candidates include:

- Abertay University
- University of Dundee
- Edinburgh Napier University
- Glasgow Caledonian University
- University of the Highlands and Islands
- The Open University in Scotland
- Queen Margaret University
- Robert Gordon University
- Royal Conservatoire of Scotland
- Scotland's Rural College (SRUC)
- University of Stirling
- University of the West of Scotland

Glasgow School of Art should be treated as a validated-provider case, not silently as a degree-awarding body.

### Wales

Official recognised bodies in Wales currently include Aberystwyth, Bangor, Cardiff Metropolitan, Cardiff, Open University, Royal College of Nursing, University of South Wales, Swansea, University of Wales, University of Wales Trinity Saint David and Wrexham University.

Official source:
https://www.gov.uk/check-university-award-degree/recognised-bodies-wales

Current seed contains Cardiff University and Swansea University. The other recognised bodies are Phase 2 candidates, subject to target-career relevance and Student sponsorship.

### Northern Ireland

Current seed contains Queen's University Belfast and Ulster University.

The Department for the Economy identifies the current recognised bodies and also maintains listed bodies, including vocational providers such as Belfast Metropolitan College, Northern Regional College, North West Regional College, South Eastern Regional College, South West College, Southern Regional College and CAFRE.

Official source:
https://www.economy-ni.gov.uk/articles/higher-education-policy

These listed bodies are important Phase 2 candidates where they offer target-career programmes and meet international-evidence requirements.

### England

Do not pre-load all 426 OfS-registered providers.

Phase 2 should start from:

1. the existing 40 English institutions in the canonical seed;
2. current UKVI Student sponsors whose type is HEI or publicly funded college;
3. providers surfaced by exact target-career programme discovery;
4. OfS recognition/status verification before promotion.

This keeps discovery broad enough for vocational coverage without turning every English registered provider into a publication candidate.

## 6. Identity rules for the UK programme foundation

- Continue CampCareer's existing internal country code `UK` for UK institution/programme read models. Do not introduce a parallel `GB` identity namespace.
- UKPRN is the preferred external provider identifier where available.
- Preserve provider aliases separately from canonical names, especially Home Office sponsor names, historic names and trading names.
- A sponsor-register row is evidence about the sponsor entity; it is not automatically the same thing as the awarding body, teaching body or campus.
- Explicitly model awarding provider vs delivery provider for validated/franchised programmes.
- Embedded/pathway colleges should normally link to a host institution rather than duplicate the host's substantive programme catalogue.

## 7. Phase 1 decision

Phase 1 discovery is complete enough to start collection with these rules:

- keep the 185 legacy UK courses as discovery seeds/provenance only;
- do not publish them as the new UK catalogue without fresh official evidence;
- do not carry `aqf_level` into UK staging;
- reuse the existing 50-institution UK identity foundation;
- expand institutions program-first using recognised/listed provider status + UKVI Student sponsorship + exact target-career evidence;
- treat England, Scotland, Wales and Northern Ireland recognition/qualification frameworks explicitly;
- do not infer city/programme linkage from institution locations.

## Phase 2 handoff

When Phase 2 starts, build a new UK programme staging layer rather than extending `ingest.courses_uk` in place. Expected separation:

- programme catalogue / stable source identity
- provider/awarding/delivery relationship
- native qualification framework + canonical level
- current international admission evidence
- Student sponsor evidence
- occupation linkage to the canonical 80 target careers
- official programme URL and source timestamps

Phase 2 collection order should be institution-by-institution and source-first, with current official programme pages taking precedence over the 2026-05-30 legacy seed rows.
