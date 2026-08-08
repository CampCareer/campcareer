# United Kingdom city scope v1

Status: `PHASE_2_COMPLETE`

Current branch: `agent/uk-cities-foundation-v1`

Phase 1 branch: `agent/uk-cities-scope-v1`

Parent readiness branch: `agent/uk-cities-readiness-v1`

## Purpose

Define and normalize the first public UK study-destination set for CampCareer `/cities` before institution/programme linkage verification.

The UK legacy catalogue is useful discovery material, but city publication is bounded to a small explicit allowlist. Existing campus and programme links are not treated as authoritative until Phase 3 verifies them against explicit provider/location evidence.

## Selection contract

Tier A selection balances:

1. international-student relevance and UK higher-education scale;
2. institution density and breadth;
3. current CampCareer linkage as a discovery signal only;
4. useful geographic coverage across England, Scotland, Wales and Northern Ireland;
5. City/Compare decision value;
6. availability of official evidence for the five city metrics.

HESA 2024/25 Higher Education Student Statistics supports London, Manchester and Birmingham as major first-batch study markets. The four-nation structure is retained rather than treating the UK as England-only.

Official references:

- HESA, Where do HE students study?: https://www.hesa.ac.uk/data-and-analysis/students/where-study
- HESA, Higher Education Student Statistics: UK, 2024/25: https://www.hesa.ac.uk/news/27-01-2026/sb273-higher-education-student-statistics/location
- Medr, Students in Higher Education 2024/25: https://www.medr.cymru/en/News/sta-medr-01-2026-students-in-higher-education-2024-25/
- Northern Ireland Department for the Economy, Higher education enrolments: https://www.economy-ni.gov.uk/articles/higher-education-enrolments

## Phase 1 final Tier A set

The product owner reduced the provisional twelve-city list to ten before normalization. Leeds and Nottingham were moved to Tier B.

Publish and compare these ten destinations first:

| Order | City | Nation / region | Phase 1 discovery signal | Public slug |
| ---: | --- | --- | --- | --- |
| 1 | London | England / London | largest current UK cluster | `london` |
| 2 | Manchester | England / North West | major multi-provider market | `manchester` |
| 3 | Birmingham | England / West Midlands | major regional study/employment hub | `birmingham` |
| 4 | Edinburgh | Scotland | major Scottish study destination | `edinburgh` |
| 5 | Glasgow | Scotland | distinct Scottish urban comparison market | `glasgow` |
| 6 | Cardiff | Wales | Wales city-market anchor | `cardiff` |
| 7 | Belfast | Northern Ireland | Northern Ireland city-market anchor | `belfast` |
| 8 | Oxford | England / South East | institution-concentrated global destination | `oxford` |
| 9 | Cambridge | England / South East | institution-concentrated technology/life-sciences destination | `cambridge` |
| 10 | Bristol | England / South West | strong South West student/career market | `bristol` |

Approved public slugs are exactly:

- `london`
- `manchester`
- `birmingham`
- `edinburgh`
- `glasgow`
- `cardiff`
- `belfast`
- `oxford`
- `cambridge`
- `bristol`

## Tier B

Leeds and Nottingham are explicitly outside the first publication allowlist after the Phase 1 product decision. They remain high-priority expansion candidates together with Coventry, Sheffield, Newcastle, Southampton, Exeter, Bath, York, St Andrews, Aberdeen and Swansea.

A canonical slug existing in `core.geographies` does not by itself authorize publication. Publication requires `metadata.publication_tier = 'A'` plus the later linkage, metric and SEO gates.

## Phase 2 scope contract

Production migration `20260808205309_normalize_uk_tier_a_city_slugs_v1.sql` normalizes only the approved ten Tier A city entities and preserves their existing geography UUIDs.

All ten use `scope_kind = 'city'`, but their actual decision boundary is explicit in metadata.

| City | Education nation | Study-destination scope | Boundary contract |
| --- | --- | --- | --- |
| London | England | `greater_london` | Greater London administrative area |
| Manchester | England | `named_city` | City of Manchester local authority |
| Birmingham | England | `named_city` | Birmingham local authority |
| Edinburgh | Scotland | `named_city` | City of Edinburgh council area |
| Glasgow | Scotland | `named_city` | Glasgow City council area |
| Cardiff | Wales | `named_city` | Cardiff local authority |
| Belfast | Northern Ireland | `named_city` | Belfast local government district |
| Oxford | England | `named_city` | Oxford local authority |
| Cambridge | England | `named_city` | Cambridge local authority |
| Bristol | England | `named_city` | Bristol, City of local authority |

### London

`London` means the Greater London study destination, not the small City of London local authority. A provider or campus is not included merely because it uses “London” in its institution name. Phase 3 must establish explicit location evidence within Greater London.

### Manchester

`Manchester` means the City of Manchester. It does not automatically absorb Salford or the wider Greater Manchester area. The legacy graph currently associates University of Salford with Manchester; Phase 3 must correct or exclude that linkage unless explicit evidence places a relevant delivery location inside the City of Manchester scope.

### Other cities

No Tier A city automatically absorbs a neighbouring authority, county, council area or marketing region. Oxford and Cambridge do not become county-wide markets, Glasgow does not become Greater Glasgow, Cardiff does not proxy all of South Wales, and Belfast does not proxy all of Northern Ireland.

## Normalization metadata contract

Each Tier A geography now records:

- `uk_city_normalization_v1 = true`
- `publication_tier = A`
- `public_slug`
- `education_nation`
- `study_destination_scope`
- `scope_boundary_label`
- `scope_note`
- `campus_membership_contract = phase_3_explicit_location_evidence_required`

The migration also registers aliases for:

- canonical city name;
- legacy `public.cities_uk` source name;
- legacy source slug such as `manchester-uk`;
- public route slug such as `manchester`.

These aliases improve matching but do not change city membership.

## Phase 2 production verification

Post-migration checks confirmed:

- exactly 10 UK geographies have `publication_tier = A`;
- all 10 have the approved public slug;
- all 10 have `scope_kind = 'city'`;
- all 10 have an explicit education nation and boundary contract;
- each Tier A geography has four provenance/matching alias rows covering `canonical_name`, `source` and `slug` types;
- Leeds and Nottingham are not Tier A and remain outside the first publication allowlist.

No campus, institution, programme or programme-offering membership was changed by this migration.

## Concurrent UK institution foundation

During Phase 2, production also received separate migration `20260808205212_uk_institution_identity_foundation_phase3` from the UK institution workstream. Current production now has official website values for all 50 active UK institutions and both legacy `UK_PROVIDER_ID` and `UK_UKPRN` identifiers for all 50.

That migration is outside this city-normalization change. Phase 3 should consume the improved institution identity data while independently verifying city/campus membership and programme delivery. Do not merge the two evidence questions into one.

## Phase 2 completion gate

Phase 2 is complete because:

- the final ten-city Tier A allowlist is fixed;
- stable public slugs are assigned;
- existing geography UUIDs are preserved;
- London and the nine named-city scopes are explicit;
- four-nation identity is stored per city;
- provenance aliases are registered;
- campus membership remains deliberately gated for Phase 3;
- Tier B cities cannot become public merely because they have a slug.

Next branch:

`agent/uk-cities-linkage-v1`

Phase 3 must verify `campus -> city -> institution -> programme` relationships using explicit location and offering evidence. It must not preserve legacy Manchester/Salford or London-labelled membership blindly.
