# UK cities readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/uk-cities-readiness-v1`

Baseline: `agent/us-cities-city-compare-v1` at `5ebeeaabd1f1c2046973b544216fa9a801ddc784`

This document is the Phase 0 readiness record for the United Kingdom `/cities` rollout. Phase 1 must use this record rather than treating the existing UK catalogue as already verified.

## 1. Canonical CampCareer country code

CampCareer currently uses `UK`, not ISO alpha-2 `GB`, across the launch registry and canonical catalogue.

Current launch registry:

- code: `UK`
- route slug: `united-kingdom`
- name: `United Kingdom`
- currency: `GBP`

Do not introduce parallel `GB` rows during the city rollout unless a separate country-code migration is deliberately designed.

## 2. UK education/regulatory structure

The UK must be treated as one product country with four education/regulatory nations:

- England
- Scotland
- Wales
- Northern Ireland

Provider recognition is not governed by one single HE regulator across all four nations.

Authority hierarchy for later verification:

### UK-wide provider identity

Use UK Provider Reference Number (`UKPRN`) as the canonical external provider identifier.

Primary source:

- UK Register of Learning Providers (`UKRLP`): https://ukrlp.education.gov.uk/

UKPRN is an 8-digit provider identifier used across UK education data systems. UKRLP identity alone is not evidence of quality assurance or degree-awarding recognition, so it must be paired with the appropriate national regulatory/recognition source.

### England

Primary higher-education regulatory source:

- Office for Students Register: https://www.officeforstudents.org.uk/for-providers/registering-with-the-ofs/guide-to-the-ofs-register/

The OfS Register is the authoritative regulatory-status reference for registered English higher-education providers.

### Scotland

Primary recognition source:

- Scottish Government recognised bodies: https://www.gov.scot/policies/universities/

Scottish degree recognition and provider structure must not be inferred from the England/OfS model.

### Wales

Primary recognition source:

- GOV.UK recognised bodies in Wales: https://www.gov.uk/check-university-award-degree/recognised-bodies-wales
- Medr is the Welsh tertiary education and research regulator/funder used in the Discover Uni governance model.

### Northern Ireland

Primary recognition/governance source:

- Department for the Economy in Northern Ireland
- GOV.UK degree-recognition guidance links to the Northern Ireland recognised/listed-body sources.

Reference: https://www.gov.uk/check-university-award-degree/overview

## 3. Qualification normalization

Do not reuse the current legacy `aqf_level` field as a UK qualification-level authority. That field name comes from an Australia-oriented ingest shape and is not an acceptable UK normalization contract.

For later programme normalization:

- England, Wales and Northern Ireland use UK qualification levels where bachelor's degrees map to level 6, master's/integrated master's to level 7, and doctorates to level 8 in the commonly referenced level system.
- Scotland uses a distinct Scottish qualification framework and must have an explicit Scotland mapping rather than silently reusing England values.

Reference: https://www.gov.uk/what-different-qualification-levels-mean/overview

## 4. Programme/course source hierarchy

### Discovery source

Use Discover Uni / HESA as the preferred structured discovery and cross-validation source for eligible undergraduate higher-education courses.

Discover Uni is owned and operated by the four UK higher-education funding/regulatory bodies and its course dataset is collected with HESA. The current Discover Uni information states that the displayed dataset covers courses relevant to the 2026-27 academic year.

References:

- https://discoveruni.gov.uk/information-providers/
- https://www.hesa.ac.uk/collection/c26061/a/Institution

### Tier A programme verification

The final programme record should be verified against the provider's official programme/course page whenever possible.

Rules:

1. Discover Uni/HESA may establish structured discovery and provider/course identity.
2. The institution's official programme URL is the preferred final Tier A source for title, award, duration, campus/location, intake and international tuition/eligibility claims.
3. Do not infer a programme location from institution presence.
4. Postgraduate coverage must not be assumed complete from Discover Uni undergraduate coverage; postgraduate programmes require direct provider collection or another authoritative source.

## 5. International-student eligibility

Use the Home Office/UKVI Register of licensed student sponsors as the national sponsorship source.

Primary source:

- https://www.gov.uk/government/publications/register-of-licensed-sponsors-students

The register identifies institutions licensed under the Student and Child Student routes. Sponsor status is dynamic and must be stored with source/effective dates rather than treated as permanent institution metadata.

## 6. Current canonical DB inventory

Production audit at Phase 0:

| Entity | UK rows |
| --- | ---: |
| active city geographies | 37 |
| active institutions | 50 |
| campuses | 50 |
| programmes | 185 |
| programme offerings | 185 |
| institution identifiers | 50 |

Programme mix:

- Bachelor: 169
- Masters: 16

The existing dataset is useful as discovery/staging material, not as a verified publication catalogue.

## 7. Current data-quality audit

### Geography

- 37/37 UK city geographies have `slug IS NULL`.
- 37/37 have `scope_kind IS NULL`.
- 49/50 campuses currently have a `geography_id`.
- 0 campuses have `locality_geography_id`.
- 0 campuses have coordinates.
- one campus is currently unlinked to a city geography: University of Hertfordshire.

The existing 37-city set includes London, Birmingham, Manchester, Edinburgh, Glasgow, Belfast, Cardiff, Oxford, Cambridge and other major university cities. The current set must not automatically become the published Tier A allowlist.

### Institution identity

- 50/50 institutions have a CampCareer slug.
- 0/50 institutions currently have `website_url` populated.
- all 50 external identifiers use `UK_PROVIDER_ID`.
- `UK_PROVIDER_ID` values are slug-like strings such as `aston-university` and `university-of-york`, not official 8-digit UKPRNs.

Required remediation before canonical UK institution publication:

- add/verify `UKPRN`
- preserve legacy `UK_PROVIDER_ID` only as a legacy/source identifier
- add official provider URL
- verify national regulatory/recognition status
- preserve nation: England/Scotland/Wales/Northern Ireland.

### Programme catalogue

- 185/185 offerings have `source_system = legacy_backfill`.
- 185/185 offerings have `verification_status = unverified`.
- 0/185 offerings have an official `source_url`.
- 0/185 programmes have `qualification_level_id`.
- the original ingest snapshot was synchronized on 2026-05-30.

Therefore the existing 185 programmes must not be treated as Tier A programme evidence without re-verification.

## 8. Existing city linkage signal

Current legacy programme counts can be used only as a discovery signal for Phase 1, not as a publication ranking.

Largest current linked catalogue clusters include:

| City | Institutions | Legacy programmes |
| --- | ---: | ---: |
| London | 8 | 40 |
| Edinburgh | 2 | 12 |
| Manchester | 2 | 12 |
| Birmingham | 2 | 11 |
| Coventry | 2 | 10 |
| Cambridge | 1 | 9 |
| Oxford | 1 | 9 |
| Bristol | 1 | 8 |
| Belfast | 1 | 6 |
| Cardiff | 1 | 6 |
| Nottingham | 2 | 6 |
| Glasgow | 2 | 5 |

These counts are not completeness claims because the source catalogue is legacy and unverified.

## 9. Phase 1 entry conditions

Phase 0 is complete because the following are now explicit:

- canonical country code: `UK`
- four-nation regulatory model
- authoritative provider identifier: `UKPRN`
- provider verification hierarchy
- programme discovery and Tier A verification hierarchy
- international student sponsor source
- existing DB inventory and data-quality gaps

Phase 1 may now select a Tier A city scope.

When Phase 1 starts, city selection should balance:

1. international-student relevance
2. canonical institution density
3. programme/career breadth
4. geographic coverage across the UK
5. evidence availability for the five city metrics
6. four-nation representation where it improves user decision value

Do not normalize all 37 cities before the Tier A allowlist is fixed.