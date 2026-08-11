# Belgium city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/be-cities-v1`

Base Phase 0 commit: `5170db82eda59d54f5238b16037d12481b3594b3`

Audit date: 2026-08-10

## Purpose

Select the first public Belgium `/cities` cohort and define the exact Phase 2 geography-normalization contract.

Phase 1 does not mutate production geography rows, publish city routes, create city read models, or infer programme delivery from institution presence.

## Decision

Belgium Tier A v1 contains exactly six study destinations:

1. `brussels`
2. `ghent`
3. `leuven`
4. `antwerp`
5. `louvain-la-neuve`
6. `liege`

Initial public route contract:

- `/cities/be/brussels`
- `/cities/be/ghent`
- `/cities/be/leuven`
- `/cities/be/antwerp`
- `/cities/be/louvain-la-neuve`
- `/cities/be/liege`

All six already exist as active production Belgium geographies. Phase 2 must preserve their existing UUIDs while making the administrative/public scope explicit.

## Selection methodology

Belgium does not have one simple nationwide municipality-level international-student dataset that can be used safely across both language communities with one methodology.

Tier A is therefore not presented as a national ranking. It is a bounded first publication cohort selected using a conservative multi-source study-destination gate:

1. strong current official evidence of a substantial higher-education/student ecosystem;
2. at least one verified canonical university location already present in production;
3. material international-study relevance;
4. useful geographic and linguistic coverage across Belgium;
5. a public study-destination boundary that can be normalized explicitly in Phase 2;
6. enough source depth to support the later Five Core Metrics and teaching-location verification.

Student figures below come from different official source definitions and must not be sorted as though they were one directly comparable national series.

## Tier A decisions

### Brussels

Decision: `TIER_A`

Canonical slug: `brussels`

Current production geography: exists and active.

Why selected:

- the Brussels-Capital Region reports more than `140,000` higher-education students;
- the Region reports five universities and roughly 25 other higher-education institutions;
- current canonical production anchors include Université libre de Bruxelles and Vrije Universiteit Brussel;
- Brussels is a multilingual, international study market that spans the Flemish and French-speaking systems.

Phase 2 scope contract:

- public study destination: Brussels-Capital Region;
- do not interpret the existing `Brussels` row as only the municipality of the City of Brussels;
- preserve the current production geography UUID while normalizing it to an explicitly supported regional study-destination scope;
- population metrics must use Brussels-Capital Region data when the public label is `Brussels`;
- institution/campus evidence may reference individual municipalities inside the Region, but those municipalities must not silently become separate city profiles in v1.

### Ghent

Decision: `TIER_A`

Canonical slug: `ghent`

Current production geography: exists and active.

Why selected:

- the City of Ghent reports `88,286` higher-education students in academic year 2023-2024 and describes Ghent as attracting almost one in three Flemish students;
- the city reports two universities and four university colleges;
- Ghent University is a current canonical production anchor;
- Ghent provides a major Flemish university-city destination distinct from Brussels and Leuven.

Phase 2 scope contract:

- municipality of Ghent;
- preserve current UUID and slug;
- assign official administrative identity and coordinates;
- do not fold neighbouring municipalities or non-Ghent campuses into the city.

### Leuven

Decision: `TIER_A`

Canonical slug: `leuven`

Current production geography: exists and active.

Why selected:

- KU Leuven reports `52,134` students at its Leuven campus in the current 2025-2026 campus table, with the current-year figure still provisional;
- KU Leuven is the current canonical production university anchor;
- Leuven is a concentrated university-city market with strong international-study relevance;
- current official KU Leuven data also exposes distinct non-Leuven campuses, which makes strict city delivery boundaries especially important.

Phase 2 scope contract:

- municipality of Leuven;
- preserve current UUID and slug;
- do not assign KU Leuven programmes from Brussels, Antwerp, Ghent, Kortrijk, Diepenbeek or other campuses to Leuven without explicit programme-location evidence.

### Antwerp

Decision: `TIER_A`

Canonical slug: `antwerp`

Current production geography: exists and active.

Why selected:

- University of Antwerp reports `24,827` students and 35 English-language programmes in figures updated 12 June 2026;
- Universiteit Antwerpen is a current canonical production anchor;
- Antwerp also has a broader higher-education ecosystem beyond the current university-only canonical layer;
- Antwerp adds a major northern urban study and employment market distinct from Ghent and Leuven.

Phase 2 scope contract:

- municipality of Antwerp;
- preserve current UUID and slug;
- provider expansion in Phase 3 must consider material university-college / applied-sciences coverage rather than presenting the university-only seed as exhaustive.

### Louvain-la-Neuve

Decision: `TIER_A`

Canonical slug: `louvain-la-neuve`

Current production geography: exists and active.

Why selected:

- UCLouvain identifies Louvain-la-Neuve as its main site and reports about `23,500` students there;
- Wallonie-Bruxelles Campus describes Louvain-la-Neuve as a purpose-built university city where roughly half of the population is made up of students and more than 125 nationalities are represented;
- Université catholique de Louvain is the current canonical production anchor;
- the destination is materially distinct from Brussels even though UCLouvain also has several Brussels campuses.

Phase 2 scope contract:

- retain `Louvain-la-Neuve` as the public study-destination label and route slug;
- administrative population scope must resolve to the municipality of Ottignies-Louvain-la-Neuve or another explicitly documented supported official geography;
- do not treat Louvain-la-Neuve as an independent Belgian municipality;
- do not infer Brussels, Mons, Tournai, Charleroi or other UCLouvain campus delivery into this city.

### Liège

Decision: `TIER_A`

Canonical slug: `liege`

Current production geography: exists and active.

Why selected:

- University of Liège reports `29,438` students and PhD students across four campuses for 2025-2026;
- the City of Liège describes itself as a major university/teaching city and identifies roughly 20,000 ULiège students in the city context plus additional university colleges;
- Wallonie-Bruxelles Campus reports a large international ULiège population and a diversified study offer;
- Université de Liège is the current canonical production anchor;
- Liège provides a major eastern French-speaking study destination.

Phase 2 scope contract:

- municipality of Liège for city population context;
- preserve current UUID and slug;
- Phase 3 must distinguish Liège city-centre / Sart Tilman teaching locations from ULiège locations in Gembloux, Arlon and other municipalities.

## Tier B existing geography

### Namur

Decision: `TIER_B_EXISTING`

Current production geography: exists and active with slug `namur`.

Université de Namur is already a canonical production anchor, and the wider city also contains university-college activity. Namur remains a valid expansion candidate, but the first cohort is intentionally bounded to six destinations with the strongest combined current study-market, source-depth and national-coverage case.

Phase 1 does not delete, deactivate or repurpose the Namur geography.

## Material discovered expansion gaps

The current seven-city geography seed is not a complete Belgian study-city universe.

Later expansion review should explicitly consider at least:

- Hasselt / Diepenbeek, including Hasselt University and university-college coverage;
- Mons, including Université de Mons and UCLouvain activity;
- Kortrijk, including KU Leuven and university-college activity;
- Bruges and other cities with substantial applied-sciences / arts higher education.

These are recorded as discovery gaps, not silently excluded destinations.

Do not create them during Phase 1.

## National and linguistic coverage rationale

Tier A deliberately spans both major higher-education communities and multiple regional markets:

- Brussels: bilingual/multilingual Brussels-Capital Region;
- Ghent: East Flanders;
- Leuven: Flemish Brabant;
- Antwerp: Antwerp province;
- Louvain-la-Neuve: Walloon Brabant;
- Liège: Liège province.

The cohort is designed as a first decision-useful study-destination set, not as a claim that these are the only or definitively top six Belgian student cities.

## Institution and campus implications for Phase 3

Current canonical university anchors for Tier A are:

### Brussels

- Université libre de Bruxelles
- Vrije Universiteit Brussel

### Ghent

- Universiteit Gent

### Leuven

- KU Leuven

### Antwerp

- Universiteit Antwerpen

### Louvain-la-Neuve

- Université catholique de Louvain

### Liège

- Université de Liège

These are identity/location anchors only.

Phase 3 must:

1. replace the one-row-per-university primary-location abstraction with a verified teaching-location set where evidence supports it;
2. retain `campus_inventory_complete=false` unless a complete inventory is genuinely verified;
3. add material university-college / applied-sciences providers where omission would misrepresent the destination, especially Brussels, Ghent, Antwerp and Liège;
4. keep programme delivery separate from institution presence;
5. publish city programme counts only where programme-to-location evidence is explicit.

## Programme coverage rule

Current production state:

- active canonical Belgium programmes: `188`
- verified programme offerings: `188`
- offerings linked to primary university location: `188`
- programme assignments verified to those locations: `0`

Therefore all Tier A city programme coverage remains:

`programme_coverage_status = verification_pending`

This does not block later city profile publication if verified teaching-location and Five Core Metrics gates are met, but the UI must disclose the gap and must never present the 188 national programme offerings as city delivery counts.

## Phase 2 normalization targets

Phase 2 should normalize exactly these six existing geography rows first:

| Destination | Slug | Public/population scope | Key guard |
| --- | --- | --- | --- |
| Brussels | `brussels` | Brussels-Capital Region | Not City of Brussels municipality |
| Ghent | `ghent` | Ghent municipality | No neighbouring-campus inference |
| Leuven | `leuven` | Leuven municipality | KU Leuven multi-campus separation |
| Antwerp | `antwerp` | Antwerp municipality | Provider universe remains broader than UAntwerp |
| Louvain-la-Neuve | `louvain-la-neuve` | Ottignies-Louvain-la-Neuve municipality context with LLN public label | LLN is not a municipality |
| Liège | `liege` | Liège municipality | ULiège non-Liège campuses excluded |

Phase 2 requirements:

- preserve existing geography UUIDs;
- preserve the six public route slugs;
- resolve official NIS/INS administrative codes where applicable;
- populate supported region/scope metadata without inventing enum values;
- add authoritative coordinates;
- add deterministic aliases for accented/local-language names where useful;
- do not normalize Namur or discovered Tier B destinations as part of the Tier A mutation unless required by a shared integrity constraint;
- document the Brussels regional exception and Louvain-la-Neuve administrative exception in both migration metadata and tests.

## Source contract

### Brussels

Brussels-Capital Region higher education:

https://be.brussels/en/education-teaching/education-belgium/higher-and-university-education

Student housing / higher-education population context:

https://be.brussels/en/housing/rental/rent-allowance/student-housing

### Ghent

City of Ghent student statistics:

https://hoeveelin.stad.gent/tendensen/onderwijs-en-werk-trekken-volk-naar-gent/

City of Ghent higher-education overview:

https://stad.gent/en/expats-ghent/education

### Leuven

KU Leuven student numbers by campus:

https://www.kuleuven.be/prodstudinfo/v2/50000050/aant_det_en_v2.html

### Antwerp

University of Antwerp facts and figures:

https://www.uantwerpen.be/en/about-uantwerp/organisation/facts-figures-rankings/

### Louvain-la-Neuve

UCLouvain figures by campus:

https://www.uclouvain.be/fr/universite/chiffres

Wallonie-Bruxelles Campus study-city context:

https://www.studyinbelgium.be/en/travelling-belgium-while-studying

### Liège

University of Liège key figures:

https://www.uliege.be/cms/c_11478577/en/key-figures-2025-2026

City of Liège education context:

https://www.liege.be/en/live-in-liege/education

Wallonie-Bruxelles Campus ULiège profile:

https://www.studyinbelgium.be/en/universite-de-liege

### National geography and higher education

Statbel population:

https://statbel.fgov.be/en/themes/population/structure-population

Study in Flanders:

https://www.studyinflanders.be/

Wallonie-Bruxelles Campus:

https://www.studyinbelgium.be/en

## Phase 1 acceptance criteria

Phase 1 is complete when all are true:

- [x] exact six-destination Tier A allowlist is fixed;
- [x] selection uses current official study-market evidence without pretending heterogeneous figures are one ranking;
- [x] every Tier A destination already has an active production geography;
- [x] every Tier A destination has at least one current canonical university anchor;
- [x] Brussels-Capital Region scope is fixed as a deliberate exception;
- [x] Louvain-la-Neuve administrative scope exception is fixed;
- [x] Namur remains a valid Tier B existing geography;
- [x] major provider/city discovery gaps are documented rather than silently ignored;
- [x] existing UUID preservation is fixed for Phase 2;
- [x] programme coverage remains verification pending because delivery assignments are unverified;
- [x] no production DB mutation occurs in Phase 1;
- [x] no city route is published in Phase 1.

## Handoff

Proceed to Phase 2 Slug and Geography Normalization with exactly:

`brussels`, `ghent`, `leuven`, `antwerp`, `louvain-la-neuve`, `liege`

Phase 1 checkpoint: `TIER_A_SCOPE_LOCKED`

Production mutation: `NONE`

Publication change: `NONE`
