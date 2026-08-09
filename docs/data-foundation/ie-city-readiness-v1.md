# Ireland city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/ie-cities-readiness-v1`

Base main commit: `ad011095de06d39abeb8393a4a54b308698bc486`

## Purpose

Establish the Phase 0 data and source baseline for the Ireland `/cities` rollout before selecting Tier A cities. Existing Ireland records are treated as discovery/staging evidence until canonical provider identity, official campus location, programme delivery and international-student eligibility are verified.

## Canonical product identity

- CampCareer country code: `IE`
- Product country slug: `ireland`
- Currency: `EUR`
- Current launch stage: `PROFILE_READY`
- Planned city route family: `/cities/ie/{canonical-city-slug}`

Do not introduce a second Ireland country code or route alias.

## Education and qualification system

Ireland uses the ten-level National Framework of Qualifications (NFQ), maintained by Quality and Qualifications Ireland (QQI).

Higher-education levels relevant to the CampCareer programme catalogue include:

- NFQ Level 6: Higher Certificate and other eligible higher-education awards
- NFQ Level 7: Ordinary Bachelor Degree
- NFQ Level 8: Honours Bachelor Degree
- NFQ Level 9: Masters Degree and other postgraduate awards
- NFQ Level 10: Doctoral Degree

The Irish Register of Qualifications (IRQ) is the national database of qualifications included in the NFQ and programmes leading to them. It also exposes awarding bodies and providers that are externally quality assured by QQI.

Primary references:

- https://www.qqi.ie/national-framework-of-qualifications
- https://www.qqi.ie/what-we-do/the-qualifications-system/irish-register-of-qualifications

## Provider authority and identity strategy

### Publicly funded higher education

The Higher Education Authority (HEA) maintains the current list of higher education institutions with which it works under statute or which receive core public funding. At the Phase 0 audit date the HEA page lists 18 current institutions and separately archives predecessor institutes that have been absorbed into technological universities.

Reference:

- https://hea.ie/higher-education-institutions/

### QQI quality-assured providers

QQI QSearch/IRQ is the authoritative quality-assurance source for providers within QQI's remit. QSearch exposes stable-looking provider codes such as `PU03048` for Dublin Business School. These codes should be captured as an authoritative provider identifier where the provider has one.

A single QQI provider code must not be assumed to exist for every autonomous university or statutory higher-education body. For those institutions, canonical identity must be anchored to the HEA/IRQ recognised entity and official institution website rather than inventing a universal identifier.

References:

- https://qsearch.qqi.ie/
- https://www.qqi.ie/what-we-do/the-qualifications-system/irish-register-of-qualifications

### Existing CampCareer identifiers are not authoritative

Current Ireland identifier rows are discovery identifiers only:

- `IE_LEGACY_COLLEGE_NAME`: 165 institutions; values are normalized legacy names
- `IE_PROVIDER_ID`: 36 institutions; values are slug-like strings such as `dublin-city-university` or `atu-galway`

These must not be presented as official national provider identifiers. Phase 3 should add a distinct authoritative identifier system for QQI provider codes where applicable and retain HEA/IRQ source evidence for institutions without such a code.

## International-student eligibility

Ireland is in a transition from the Interim List of Eligible Programmes (ILEP) to TrustEd Ireland, QQI's statutory international education mark.

As of the Phase 0 audit:

- the ILEP is closed to new applicant providers;
- the final ILEP update was published 20 June 2025;
- non-EEA/non-Swiss students must choose an eligible programme on the ILEP or an eligible programme offered by a TrustEd Ireland authorised provider;
- QQI announced the first 28 higher-education institutions authorised to use TrustEd Ireland on 4 February 2026;
- provider authorisation and programme eligibility must be stored as dated evidence, not permanent inferred metadata.

References:

- https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/interim-list-of-eligible-programmes-ilep/
- https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/
- https://www.qqi.ie/news/qqi-announces-first-28-higher-education-institutions-authorised-to-use-trusted-ireland-quality
- https://www.qqi.ie/trusted-ireland-reports

For later city metrics, Stamp 2 currently permits casual employment up to 20 hours per week during term and 40 hours per week during holidays, subject to the student's immigration conditions. This rule is national and must remain qualified rather than being treated as a city differentiator.

Reference:

- https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/

## Programme discovery and verification hierarchy

### Discovery

Qualifax is the national learners' database and provides a broad searchable catalogue covering third-level, postgraduate, further-education and other learning options. Existing CampCareer Ireland offerings overwhelmingly point to Qualifax and can be reused for discovery.

References:

- https://www.qualifax.ie/
- https://www.qualifax.ie/about-us

### Qualification and provider validation

Use the IRQ to confirm NFQ inclusion, awarding body/provider relationships and recognised programme/qualification context.

### Tier A programme evidence

A programme must not become city-delivery verified solely because it exists in Qualifax/IRQ or because its institution has a campus in that city. Final city programme linkage requires an explicit provider programme page or another authoritative record tying the specific programme/offering to the verified delivery location, plus current ILEP/TrustEd eligibility where international-student eligibility is surfaced.

## Current production inventory

Audit against Supabase project `babylusxcknjerxtepoc` on 2026-08-09:

| Entity | IE rows |
| --- | ---: |
| active city geographies | 18 |
| active institutions | 201 |
| active campuses | 238 |
| active programmes | 2,876 |
| programme offerings | 2,876 |
| institution identifiers | 201 |

### Geography quality

All 18 legacy Ireland city geographies currently have:

- `slug IS NULL`
- `scope_kind IS NULL`
- `metadata.legacy_table = cities_ie`

Current geography names:

Athlone, Carlow, Castlebar, Cork, Drogheda, Dublin, Dun Laoghaire, Dundalk, Galway, Kilkenny, Letterkenny, Limerick, Maynooth, Sligo, Thurles, Tralee, Waterford and Wexford.

The geography set is useful discovery material but is not yet a publication contract.

### Institution quality

- 201/201 active institutions have canonical slugs.
- 0/201 have an official `website_url`.
- Existing identifier coverage is entirely legacy/source-derived as described above.
- The catalogue mixes universities, technological-university campus records, private higher-education colleges, FET providers, ETBs, language/training providers and other education providers.

Phase 1 city publication scope should therefore first define the higher-education/international-student provider perimeter rather than treating all 201 institutions equally.

### Campus quality

- 238 active Ireland campus/location rows
- 33 have `geography_id`
- 10 have latitude and longitude
- 0 have `source_url`

Existing city text is inconsistent and cannot be treated as canonical geography. Examples include separate values such as `Dublin`, `Dublin City Centre`, `Dublin City Centre,`, `Dublin 24`, `Galway` / `Galway City`, `Cork` / `Cork City`, and `Limerick` / `Limerick City`.

This is a primary Phase 2/3 remediation requirement.

### Programme quality

- 2,876 active canonical programme rows
- 2,876/2,876 have `qualification_level_id`
- 2,876 programme offerings
- 2,876/2,876 offerings currently have `verification_status = unverified`
- 2,876/2,876 use `source_system = legacy_backfill`
- 2,865 offering source URLs point to `www.qualifax.ie`
- 11 use manual/source placeholders

Therefore the Ireland programme catalogue is substantially richer than the UK starting point for discovery, but none of the 2,876 offerings is currently Tier A city-delivery evidence.

## Legacy city-cluster signal only

The existing campus/offering graph suggests the largest discovery clusters include:

- Dublin: 14 institutions / 928 programmes
- Limerick: 3 / 245
- Cork: 3 / 209
- Sligo: 2 / 140
- Galway City: 3 / 133, plus separate legacy `Galway` rows
- Waterford: 1 / 118
- Carlow: 2 / 110
- Letterkenny: 1 / 93
- Dundalk: 3 / 85
- Athlone: 1 / 69

These counts are not verified publication counts. They are distorted by inconsistent locality strings and by legacy institution/campus modelling, including technological-university predecessor/campus entities.

## Current national higher-education signal

HEA Key Facts & Figures for 2024/25 reports 278,880 enrolments across publicly funded higher education, including 44,535 non-Ireland-domiciled enrolments. UCD had the largest overall enrolment; international enrolment was highest at UCD and Trinity College Dublin, followed by UCC and University of Galway.

This supports Dublin, Cork and Galway as strong Phase 1 candidates but does not by itself define the Tier A city list.

Reference:

- https://hea.ie/statistics/data-for-download-and-visualisations/key-facts-figures-report/

## Phase 0 blockers and remediation

1. `core.geographies` needs canonical slugs and explicit city/scope definitions.
2. Ireland institution scope must distinguish higher-education/international-student providers from the broad FET/training inventory.
3. Official provider websites must be added for publishable institutions.
4. QQI provider codes should be captured where applicable; legacy `IE_PROVIDER_ID` must remain a source identifier only.
5. Campus/locality rows require official address/location evidence and canonical city linkage.
6. Technological universities must be modelled as one canonical institution with explicit campuses rather than relying on predecessor/campus pseudo-institutions for public city linkage.
7. All 2,876 current offerings remain discovery/staging because they are `legacy_backfill` + `unverified`.
8. Programme delivery must be verified at the offering/campus level.
9. International-student eligibility must combine current ILEP and TrustEd Ireland evidence during the transition period.
10. Legacy city-string variants must be collapsed only after official campus evidence is reviewed.

## Phase 0 decision

`PHASE_0_COMPLETE`

Ireland has enough existing catalogue depth to proceed to Phase 1 immediately, but the current data must not be published as-is. The next branch should be:

`agent/ie-cities-scope-v1`

Phase 1 should select the initial Tier A cities using official HEA/TrustEd provider presence, current international student concentration, verified campus geography and the legacy programme graph only as a discovery signal.
