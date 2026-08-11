# Denmark city readiness v1

Status: `PHASE_0_COMPLETE`

Readiness: `READY_WITH_GATES`

Branch: `agent/dk-cities-v1`

Base main: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Audit date: 2026-08-10

## Purpose

Establish the national data, provider, programme-delivery, immigration and geography contracts required before selecting the first Denmark `/cities` publication cohort.

Denmark uses the new country rollout branch policy: all city phases for this country continue on the single branch `agent/dk-cities-v1` rather than creating one branch per phase.

Phase 0 does not publish city routes, assign publication tiers, normalize city boundaries or infer programme delivery from institution presence.

## Product identity

Current CampCareer registry values:

- country code: `DK`
- country name: `Denmark`
- currency: `DKK`
- country active: `true`
- canonical country route: `/countries/dk`
- intended city route: `/cities/dk/{city-slug}`

## National higher-education structure

Denmark is not a university-only higher-education system.

The Ministry of Science, Higher Education and Digital Affairs lists multiple institution groups under its remit, including:

- universities;
- university colleges / professional higher-education institutions;
- business academies;
- artistic and cultural higher-education institutions;
- maritime higher-education institutions.

Official ministry institution list:

https://ufm.dk/ministeriet/organisation/institutioner-under-ministeriet

The ministry also states that higher-education programmes are delivered by state-financed independent institutions within national quality and approval frameworks, and that new programmes and programme offerings are centrally approved with geographic distribution among the considerations.

https://ufm.dk/english/key-areas/education/educational-institutions/

Study in Denmark describes five higher-education institution types for international students: Universities, University Colleges, Business Academies, Artistic Higher Education Institutions and Schools of Maritime Education and Training.

https://studyindenmark.dk/study-options/what-can-i-study

### CampCareer coverage implication

The current canonical CampCareer Denmark institution layer contains only the eight universities. It is therefore an initial university core, not a complete Danish higher-education provider inventory.

City publication must preserve an explicit coverage state equivalent to:

`university_core_professional_providers_pending`

Missing university-college, business-academy, artistic or maritime providers must never be interpreted as absence from a city.

## Current production institution foundation

Production currently contains eight active Danish universities, matching the ministry university list:

1. Aalborg Universitet
2. Aarhus Universitet
3. Copenhagen Business School
4. Danmarks Tekniske Universitet
5. IT-Universitetet i København
6. Københavns Universitet
7. Roskilde Universitet
8. Syddansk Universitet

The existing canonical identifier system is:

`DK_UFM_UNIVERSITY_NAME`

Each identifier points to the ministry's official institution list.

This identifier is suitable for preserving the current eight-university identity layer, but future professional-provider expansion should create an equally explicit authority-backed identity contract rather than overloading the university-name identifier.

## Current production geography foundation

Production currently contains seven active canonical Denmark city geographies created by the university fast-path foundation:

| City | Slug | Geography UUID | Current role |
| --- | --- | --- | --- |
| Aalborg | `aalborg` | `4831d54c-2d55-e3c9-fdbd-d7f30c956e0a` | university anchor |
| Aarhus | `aarhus` | `f0c7d88d-9613-df19-3da8-6e9a0ffd8433` | university anchor |
| Copenhagen | `copenhagen` | `851bc5c8-563c-1063-06e7-a2244ee58c60` | university anchor |
| Frederiksberg | `frederiksberg` | `b76a5a2e-2cd3-b6af-b4f1-dc37c7704414` | university anchor |
| Lyngby | `lyngby` | `3f1b5cce-1168-adf4-1114-3b816501538e` | university anchor |
| Odense | `odense` | `260f33ab-0b31-8b5f-caea-b39c5b86f334` | university anchor |
| Roskilde | `roskilde` | `d30bed85-dcc4-9d66-94ec-562b649ad053` | university anchor |

All seven currently have `geography_type=city`, but `scope_kind` is null and the current metadata only reflects the earlier university fast-path source. Phase 2 must therefore define the actual public municipal/city boundary contract before publication.

No new geography should be created in Phase 0 or Phase 1.

## Current production university-location foundation

Production has eight active `Primary university location` rows:

- Aalborg Universitet → Aalborg
- Aarhus Universitet → Aarhus
- Copenhagen Business School → Frederiksberg
- Danmarks Tekniske Universitet → Lyngby
- IT-Universitetet i København → Copenhagen
- Københavns Universitet → Copenhagen
- Roskilde Universitet → Roskilde
- Syddansk Universitet → Odense

These records are useful provider-presence anchors. Their metadata states:

- `record_scope=primary_university_city`
- `location_quality=verified_authority_or_official`
- `campus_inventory_complete=false`
- `programme_assignment_verified=false`

Therefore they are not sufficient by themselves to establish programme delivery.

## Programme catalogue state

Production currently contains:

- 184 active canonical Denmark programmes;
- 184 Denmark staging programme rows;
- 184 verified programme offerings;
- 184 offerings with a non-null `campus_id`.

This is a materially stronger programme foundation than several earlier city rollouts, but the non-null campus count must not be mistaken for explicit city-delivery verification.

The Denmark programme canonicalization migration selected the offering campus by:

1. preferring an active campus whose city text matched the staged programme city; then
2. falling back to the institution's first active campus if no matching row existed.

At the same time, the campus metadata remains `programme_assignment_verified=false`.

### City programme publication rule

A Denmark city programme directory may publish a programme only after the delivery relationship is independently verified.

Required chain:

`city -> verified campus/location -> canonical institution -> verified programme offering -> explicit programme delivery at that campus -> programme`

Do not use any of the following as standalone proof of city delivery:

- institution presence in the municipality;
- the current non-null `programme_offerings.campus_id` alone;
- a general Study in Denmark programme listing;
- a university-wide programme catalogue;
- a fast-path primary-city campus row.

Phase 3 must re-audit programme-to-location evidence before treating the existing campus IDs as publication evidence.

## Programme and international-study sources

Study in Denmark's programme portal is an official international discovery source and currently covers English-taught programmes at Danish higher-education institutions across universities, university colleges, business academies and artistic institutions.

https://studyindenmark.dk/portal

Study in Denmark also states that Danish higher education is state-regulated and subject to national quality requirements.

https://studyindenmark.dk/study-in-denmark/education-in-denmark/guarantee-for-a-quality-experience

For programme publication, use the Study in Denmark listing as a discovery/international-study source and the institution's official programme/location page for exact delivery evidence.

## Quality and accreditation authority

The Ministry publishes the legal framework for accreditation of higher-education institutions.

https://ufm.dk/english/legislation/laws-and-regulations/accreditation/

Programme or institutional quality status must remain distinct from actual city delivery. Accreditation never substitutes for a verified delivery location.

## International-student work-right baseline

SIRI / New to Denmark currently states that a student in a state-approved higher-education programme who is granted the associated limited work permit may work:

- up to 90 hours per calendar month from September through May; and
- full-time in June, July and August.

The page also distinguishes non-state-approved programmes: for applications on or after 2 May 2025, the limited work permit is not granted under the described non-state-approved route.

Official source:

https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education

Phase 4 must store this as a qualified national immigration rule, not a city differentiator and not a universal entitlement for every student.

## Geography authority

Statistics Denmark / StatBank is the primary geography and quantitative authority for the Denmark city rollout.

The relevant current educational-activity table is `UDDAKT11`, which reports educational activity by location of educational institution and includes municipalities as location values.

https://www.statbank.dk/UDDAKT11

Statistics Denmark's current Danish sustainability indicator 11.a.1 uses `UDDAKT11` and explicitly treats Copenhagen, Frederiksberg, Odense, Aarhus and Aalborg as the five major municipalities for the higher-education study-place distribution measure. The latest published indicator covers 2025 and was updated 2 February 2026.

https://www.dst.dk/en/Statistik/temaer/SDG/danske-maalepunkter

Phase 1 should use this official five-municipality higher-education classification as the first Tier A scope signal.

## Key Phase 0 gates

1. **Geography normalization gate** — seven existing city rows lack a Phase 2 municipality/publication boundary contract.
2. **Provider completeness gate** — canonical provider coverage is university-only; university colleges, business academies, artistic and maritime institutions remain pending.
3. **Programme-delivery gate** — the 184 offering campus IDs are useful leads but are not publication evidence until explicit delivery is reverified.
4. **Campus completeness gate** — the eight existing location records explicitly state `campus_inventory_complete=false`.
5. **Publication gate** — no city becomes indexable before Tier A scope, geography normalization, verified linkage and all five Phase 4 metrics are complete.

## Phase 0 result

Denmark is ready to proceed to Phase 1 with explicit gates.

Checkpoint:

`PHASE_0_COMPLETE / READY_WITH_GATES`

Phase 1 may select the first Tier A cohort, but it must not broaden the current seven-city seed or merge Copenhagen/Frederiksberg/Lyngby into a metropolitan geography without a documented Statistics Denmark boundary rule.