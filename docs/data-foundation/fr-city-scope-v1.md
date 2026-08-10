# France city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/fr-cities-v1`

Base Phase 0 commit: `715496af124eac89abcc8dc32a87f7b0f2edcb8d`

Audit date: 2026-08-10

## Purpose

Select the first public France `/cities` cohort and define the exact Phase 2 geography-normalisation contract without corrupting the existing registered-location locality layer.

Phase 1 does not mutate production geography rows, publish city routes, create city read models, or infer programme delivery from institution presence.

## Decision

France Tier A v1 contains exactly seven public study destinations:

1. `paris`
2. `paris-saclay`
3. `bordeaux`
4. `strasbourg`
5. `grenoble`
6. `aix-marseille`
7. `nice`

Initial public route contract:

- `/cities/fr/paris`
- `/cities/fr/paris-saclay`
- `/cities/fr/bordeaux`
- `/cities/fr/strasbourg`
- `/cities/fr/grenoble`
- `/cities/fr/aix-marseille`
- `/cities/fr/nice`

This is a bounded first CampCareer France destination cohort. It is **not** a national ranking of all French student cities.

## Selection methodology

France has a strong national higher-education enrolment dataset from MESR/SIES, but the current CampCareer provider foundation is intentionally narrow: nine high-confidence universities concentrated in seven existing registered-location localities.

Tier A v1 therefore uses a conservative product-readiness gate rather than pretending the current nine-university foundation represents the national provider market.

A destination qualifies for v1 when all are true:

1. it is a current, recognisable international-student destination supported by Campus France;
2. at least one current canonical CampCareer France university is anchored in the destination or a clearly documented component locality;
3. an explicit INSEE public/population boundary can be defined;
4. source depth is sufficient for later living-cost, transport, work-context and employment-context metrics;
5. the destination can be represented without converting a registered legal address into false teaching-location evidence;
6. programme delivery can remain explicitly `verification_pending` until Phase 3 verifies teaching locations.

The order below is a publication order, not a ranking.

## Tier A decisions

### Paris

Decision: `TIER_A`

Public slug: `paris`

Current production geography: exists as `paris` and may be reused in Phase 2.

Current canonical institution anchors:

- Sorbonne Université
- Université PSL
- Université Paris Cité

Current national programme foundation associated with these institutions: `52` active verified offerings in total, but city delivery remains unverified.

Why selected:

- Paris is the largest French student market; Campus France's 2025 student-city context notes more than 800,000 students in the wider Paris market;
- Campus France maintains a current Paris and Île-de-France international-student guide;
- the current CampCareer foundation has three canonical institutions registered in Paris;
- Paris has the deepest immediate source coverage for later metrics and teaching-location verification.

Phase 2 scope contract:

- public destination: Paris;
- population boundary: Paris commune, COG `75056`;
- current INSEE 2023 population: `2,103,778`;
- preserve the existing Paris geography UUID;
- do not present the Paris commune population as all Île-de-France;
- do not infer any non-Paris teaching location from the university brand.

Sources:

https://www.insee.fr/fr/statistiques/1405599?geo=COM-75056

https://www.campusfrance.org/en/resource/paris-and-ile-de-france

### Paris-Saclay

Decision: `TIER_A`

Public slug: `paris-saclay`

Current production geography: no public destination row exists. The current `saint-aubin` geography is a registered-location locality and must be preserved as such.

Current canonical institution anchor:

- Université Paris-Saclay

Current programme foundation: `15` verified offerings, city delivery unverified.

Why selected:

- Campus France operates a dedicated Palaiseau / Paris-Saclay international-welcome surface covering Palaiseau, Orsay, Saclay, Gif-sur-Yvette and the wider Paris-Saclay area;
- Université Paris-Saclay is already a canonical production institution;
- the existing Saint-Aubin registered address is too narrow and too administrative to serve as the user-facing study destination;
- the Communauté Paris-Saclay provides an explicit INSEE intercommunal geography.

Phase 2 scope contract:

- public destination: Paris-Saclay;
- population boundary: Communauté Paris-Saclay, EPCI `200056232`;
- current INSEE 2023 population: `326,692`;
- create a new public destination geography rather than renaming the existing Saint-Aubin row;
- retain Saint-Aubin as locality/registered-address evidence;
- Phase 3 must verify actual teaching locations such as Orsay, Gif-sur-Yvette, Saclay, Sceaux, Évry or other sites before assigning programmes.

Sources:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200056232

https://www.campusfrance.org/en/cities/palaiseau

### Bordeaux

Decision: `TIER_A`

Public slug: `bordeaux`

Current production geography: no public destination row exists. The current `talence` geography is a registered-location locality and must be preserved.

Current canonical institution anchor:

- Université de Bordeaux

Current programme foundation: `10` verified offerings, city delivery unverified.

Why selected:

- Campus France maintains a current Bordeaux student-city guide;
- Bordeaux is repeatedly identified in Campus France's 2025 student-city context as a major student destination;
- the University of Bordeaux teaching ecosystem spans Bordeaux/Talence/Pessac rather than being safely represented by the Talence registered address alone;
- Bordeaux Métropole provides a stable INSEE population geography.

Phase 2 scope contract:

- public destination: Bordeaux;
- population boundary: Bordeaux Métropole, EPCI `243300316`;
- current INSEE 2023 population: `854,334`;
- create a new `bordeaux` public destination geography;
- retain Talence as locality evidence and do not rename its UUID;
- later teaching-location linkage may include Bordeaux, Talence, Pessac or other verified university sites only when official evidence supports each location.

Sources:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-243300316

https://www.campusfrance.org/en/resource/bordeaux

### Strasbourg

Decision: `TIER_A`

Public slug: `strasbourg`

Current production geography: exists as `strasbourg` and may be reused.

Current canonical institution anchor:

- Université de Strasbourg

Current programme foundation: `20` verified offerings, city delivery unverified.

Why selected:

- Campus France maintains a current Strasbourg city guide;
- Strasbourg appears in the top group of Campus France's reported 2025 student-city context and is highly recommended by surveyed students;
- Université de Strasbourg is already a strong canonical production anchor;
- Eurométropole de Strasbourg provides a defensible wider destination population contract.

Phase 2 scope contract:

- public destination: Strasbourg;
- population boundary: Eurométropole de Strasbourg, EPCI `246700488`;
- current INSEE 2023 population: `522,596`;
- preserve the existing Strasbourg geography UUID while explicitly documenting that the public population context uses the Eurométropole rather than only the commune;
- the registered Strasbourg address remains institution-location evidence, not complete campus evidence.

Sources:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-246700488

https://www.campusfrance.org/en/resource/strasbourg

### Grenoble

Decision: `TIER_A`

Public slug: `grenoble`

Current production geography: no public destination row exists. The current `saint-martin-dheres` geography must remain locality evidence.

Current canonical institution anchor:

- Université Grenoble Alpes

Current programme foundation: `15` verified offerings, city delivery unverified.

Why selected:

- Campus France explicitly defines the reception destination as `Grenoble et Saint-Martin d'Hères`;
- Grenoble is included among the leading student cities in Campus France's 2025 context;
- the university's current registered-address row is in Saint-Martin-d'Hères, demonstrating why a user-facing Grenoble destination cannot be derived by simple renaming;
- Grenoble-Alpes-Métropole is an explicit INSEE geography covering the wider destination.

Phase 2 scope contract:

- public destination: Grenoble;
- display scope should disclose `Grenoble–Saint-Martin-d'Hères study destination` where useful;
- population boundary: Grenoble-Alpes-Métropole, EPCI `200040715`;
- current INSEE 2023 population: `450,608`;
- create a new `grenoble` public destination geography;
- preserve the Saint-Martin-d'Hères locality UUID;
- Phase 3 must verify individual UGA teaching locations before city programme assignment.

Sources:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200040715

https://www.campusfrance.org/en/cities/grenoble-et-saint-martin-d-heres

### Aix-Marseille

Decision: `TIER_A`

Public slug: `aix-marseille`

Current production geography: no composite destination row exists. The current `marseille` geography must remain locality evidence.

Current canonical institution anchor:

- Aix-Marseille Université

Current programme foundation: `10` verified offerings, city delivery unverified.

Why selected:

- Campus France's current city directory groups the international study destination as Aix-en-Provence / Marseille and maintains current guides for both cities;
- Aix-Marseille Université is explicitly multi-city;
- using the Marseille registered address as the public destination would incorrectly imply that all AMU study activity belongs to Marseille;
- Métropole d'Aix-Marseille-Provence provides an explicit common population geography.

Phase 2 scope contract:

- public destination: Aix-Marseille;
- population boundary: Métropole d'Aix-Marseille-Provence, EPCI `200054807`;
- current INSEE 2023 population: `1,939,077`;
- create a new `aix-marseille` public destination geography;
- retain Marseille as a locality and add Aix-en-Provence locality evidence only when Phase 3 source verification requires it;
- never assign an AMU programme to Marseille or Aix solely from university identity.

Sources:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200054807

https://www.campusfrance.org/en/resource/aix-en-provence

https://www.campusfrance.org/en/resource/marseille

### Nice

Decision: `TIER_A`

Public slug: `nice`

Current production geography: exists as `nice` and may be reused.

Current canonical institution anchor:

- Université Côte d'Azur

Current programme foundation: `10` verified offerings, city delivery unverified.

Why selected:

- Campus France maintains current Nice international-student reception guidance;
- Université Côte d'Azur is a canonical production anchor with active international programme evidence;
- Nice Côte d'Azur Métropole provides an explicit population boundary while the programme-delivery layer remains free to distinguish Nice, Sophia Antipolis and other verified sites later.

Phase 2 scope contract:

- public destination: Nice;
- population boundary: Métropole Nice Côte d'Azur, EPCI `200030195`;
- current INSEE 2023 population: `574,287`;
- preserve the existing Nice geography UUID while documenting the metropolitan population contract;
- do not infer Université Côte d'Azur programme delivery from its registered Nice address.

Sources:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200030195

https://www.campusfrance.org/en/cities/nice

## Existing locality rows retained outside the public route identity

Phase 1 explicitly preserves these existing production rows as locality / registered-location evidence:

- `saint-aubin`
- `saint-martin-dheres`
- `talence`
- `marseille`

They are not deleted, renamed or exposed as separate Tier A public profiles in v1.

The existing `paris`, `strasbourg` and `nice` rows may be reused as public destination identities because their names already match the user-facing destination. Their population-scope metadata must still be explicit.

## Material national expansion gaps

The Tier A v1 cohort is constrained by the current canonical provider foundation and should not be interpreted as the definitive seven largest or best French student cities.

Major later expansion candidates include at least:

- Lyon
- Toulouse
- Lille
- Montpellier
- Rennes
- Nantes
- other Campus France student destinations with substantial enrolment and international-study ecosystems

Campus France's 2025 city directory covers dozens of destinations, and the MESR/SIES Atlas provides the national enrolment evidence needed for a later provider-independent expansion wave.

Do not auto-create these destinations during Phase 1. They require provider identity, teaching-location and metric readiness work first.

## Provider and campus implications for Phase 3

Current Tier A canonical university anchors are:

### Paris

- Sorbonne Université
- Université PSL
- Université Paris Cité

### Paris-Saclay

- Université Paris-Saclay

### Bordeaux

- Université de Bordeaux

### Strasbourg

- Université de Strasbourg

### Grenoble

- Université Grenoble Alpes

### Aix-Marseille

- Aix-Marseille Université

### Nice

- Université Côte d'Azur

These nine institutions are identity anchors only.

Phase 3 must:

1. verify actual teaching locations from official institution sources;
2. preserve registered-address rows as source evidence but not present them as complete campuses;
3. add material providers when omission would materially misrepresent a Tier A destination;
4. keep `campus_inventory_complete=false` unless completeness is genuinely demonstrated;
5. keep programme delivery separate from institution presence;
6. link programmes to destinations only with explicit programme/location evidence.

## Programme coverage rule

Current production state:

- active canonical France programmes: `132`
- verified offerings: `132`
- offerings with inherited `campus_id`: `132`
- linked campus relationships marked `programme_assignment_verified=true`: `0`

Therefore all seven Tier A public destinations begin with:

`programme_coverage_status = verification_pending`

This does not block later publication of verified city profiles, but programme counts must not be displayed as zero or as inherited national catalogue counts. The correct semantic is verification pending.

## Phase 2 normalization targets

| Destination | Public slug | Existing locality handling | Population contract | INSEE ID |
| --- | --- | --- | --- | --- |
| Paris | `paris` | Reuse existing Paris UUID | Paris commune | `75056` |
| Paris-Saclay | `paris-saclay` | Create destination; retain Saint-Aubin locality | Communauté Paris-Saclay | EPCI `200056232` |
| Bordeaux | `bordeaux` | Create destination; retain Talence locality | Bordeaux Métropole | EPCI `243300316` |
| Strasbourg | `strasbourg` | Reuse existing Strasbourg UUID | Eurométropole de Strasbourg | EPCI `246700488` |
| Grenoble | `grenoble` | Create destination; retain Saint-Martin-d'Hères locality | Grenoble-Alpes-Métropole | EPCI `200040715` |
| Aix-Marseille | `aix-marseille` | Create destination; retain Marseille locality | Métropole d'Aix-Marseille-Provence | EPCI `200054807` |
| Nice | `nice` | Reuse existing Nice UUID | Métropole Nice Côte d'Azur | EPCI `200030195` |

Phase 2 requirements:

- do not rename `talence`, `saint-martin-dheres`, `saint-aubin` or `marseille` into broader public destinations;
- preserve existing locality UUIDs;
- create deterministic new destination UUIDs for `paris-saclay`, `bordeaux`, `grenoble` and `aix-marseille`;
- add explicit INSEE source IDs and scope metadata;
- define destination-to-locality relationships without creating cycles or duplicate public routes;
- add aliases only for true naming variants, never to pretend two different geographic scopes are synonyms;
- keep public population geography distinct from teaching-location geography;
- do not create Tier B expansion cities during the Tier A normalization migration.

## Source contract

National student enrolment:

https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-atlas_regional-effectifs-d-etudiants-inscrits/

Campus France city directory:

https://www.campusfrance.org/en/villes

Campus France 2025 student-city context:

https://www.campusfrance.org/en/actu/les-meilleures-villes-etudiantes-en-2025-un-palmares-aux-multiples-facettes

INSEE territorial comparator:

https://www.insee.fr/fr/statistiques/1405599

## Phase 1 acceptance criteria

- [x] exact seven-destination Tier A allowlist is fixed;
- [x] public routes use recognisable study destinations rather than registered-address localities;
- [x] every Tier A destination has at least one current canonical university anchor or component-locality anchor;
- [x] every destination has an explicit proposed INSEE population boundary;
- [x] Paris remains narrower than all Île-de-France and the distinction is documented;
- [x] Paris-Saclay preserves Saint-Aubin rather than renaming it;
- [x] Bordeaux preserves Talence rather than renaming it;
- [x] Grenoble preserves Saint-Martin-d'Hères rather than renaming it;
- [x] Aix-Marseille preserves Marseille locality rather than equating it with the whole university destination;
- [x] national expansion gaps such as Lyon and Toulouse are documented rather than ranked below Tier A;
- [x] programme delivery remains `verification_pending` for all seven destinations;
- [x] no production DB mutation occurs in Phase 1;
- [x] no city route is published in Phase 1.

## Handoff

Proceed to Phase 2 Slug and Geography Normalization with exactly:

`paris`, `paris-saclay`, `bordeaux`, `strasbourg`, `grenoble`, `aix-marseille`, `nice`

Phase 1 checkpoint: `TIER_A_SCOPE_LOCKED`

Production mutation: `NONE`

Publication change: `NONE`
