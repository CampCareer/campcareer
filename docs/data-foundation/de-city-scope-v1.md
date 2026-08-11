# Germany city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/de-cities-scope-v1`

Base Phase 0: `efb31b526ac03a9d7c8fb82fe11295f4f3f1255c`

Audit date: 2026-08-10

## Purpose

Select the first public Germany `/cities` cohort and define the Phase 2 geography-normalization contract for each selected study destination.

Phase 1 does not mutate production geography rows, publish routes, create city read models, create programme-to-campus links or infer programme delivery from institution presence.

## Decision

Germany Tier A v1 contains exactly nine bounded supported study destinations:

1. `berlin`
2. `munich`
3. `hamburg`
4. `aachen`
5. `bonn`
6. `dresden`
7. `heidelberg`
8. `karlsruhe`
9. `tuebingen`

Initial public route contract:

- `/cities/de/berlin`
- `/cities/de/munich`
- `/cities/de/hamburg`
- `/cities/de/aachen`
- `/cities/de/bonn`
- `/cities/de/dresden`
- `/cities/de/heidelberg`
- `/cities/de/karlsruhe`
- `/cities/de/tuebingen`

This is a bounded CampCareer v1 support cohort. It is not a ranking of German cities and it is not a claim that these are Germany's only important study destinations.

## Why all nine current supported cities are retained

Unlike several earlier city rollouts, the Germany foundation already has meaningful institution and programme coverage across every existing city geography.

For each of the nine cities, production currently has:

- an active stable `core.geographies` city row;
- at least one current canonical institution identity;
- a verified institution-city location row;
- at least six current Germany programme explorer rows;
- current international-student eligibility context for those programme rows.

Berlin has 18 programme rows across three institutions and Munich has 12 across two institutions. Each of the other seven cities has six programme rows in the current bounded Germany programme foundation.

Reducing the first cohort below nine would discard already-supported, distinct study destinations without solving the main quality gap, which is campus-level delivery verification. The correct solution is therefore to retain the supported nine while clearly labelling national expansion gaps.

## Selection methodology

Tier A v1 selection uses the following order of evidence:

1. stable existing CampCareer geography identity;
2. recognised current institution identity and official domain;
3. verified institution-city presence;
4. current bounded Germany programme coverage;
5. distinct study-destination value rather than duplicate neighbouring geography;
6. ability to define a consistent official municipality boundary through Destatis GV-ISys;
7. geographic spread across several Bundesländer;
8. DFG Excellence evidence only as provenance for the current seed, never as a national city ranking.

The public cohort is therefore selected for current supportability and traceability, not because Excellence status is a universal product inclusion rule.

## Geography semantics

The default Germany v1 metric/publication scope is the politically independent municipality / city proper represented by Destatis GV-ISys.

Primary source:

https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html

Phase 2 must bind each selected row to its official municipality identity and Bundesland while preserving the existing CampCareer UUID and slug.

Do not combine surrounding municipalities into the selected city merely because they belong to the same metro area, transport network or university brand.

## Tier A city contracts

### Berlin

Decision: `TIER_A`

Canonical slug: `berlin`

Preliminary Bundesland: Berlin

Scope semantics: Land Berlin / municipality-city boundary.

Current CampCareer support:

- three canonical institutions: Freie Universität Berlin, Humboldt-Universität zu Berlin, Technische Universität Berlin;
- 18 Germany programme explorer rows across those institutions;
- three verified institution-city location rows.

Why selected:

- strongest current Germany programme coverage in CampCareer;
- multiple independently recognised universities within one official city boundary;
- major international-study and labour-market context;
- clean official city-state boundary for population metrics.

Phase 3 rule:

Berlin's multiple campuses remain separate location evidence even though they fall within one municipality. Programme delivery must still be verified rather than inferred from institution presence.

### Munich

Decision: `TIER_A`

Canonical slug: `munich`

Source-native name: München

Preliminary Bundesland: Bavaria / Bayern

Scope semantics: City of Munich municipality; not the whole Munich metropolitan region.

Current CampCareer support:

- Ludwig-Maximilians-Universität München;
- Technical University of Munich;
- 12 Germany programme explorer rows;
- two institution-city location rows.

Why selected:

- second-highest current Germany programme coverage;
- two current canonical institutions;
- major national and international study/employment market.

Phase 3 rule:

TUM locations outside Munich municipality, including major locations such as Garching, must not be silently counted as Munich campus delivery. Programme-to-location verification is mandatory.

Phase 2 should preserve `munich` as the English public slug while adding deterministic source aliases such as `München`/`Muenchen` only if they fit the existing alias contract.

### Hamburg

Decision: `TIER_A`

Canonical slug: `hamburg`

Preliminary Bundesland: Hamburg

Scope semantics: Free and Hanseatic City of Hamburg municipality/city-state boundary.

Current CampCareer support:

- Universität Hamburg;
- six Germany programme explorer rows;
- verified institution-city presence.

Why selected:

- distinct large northern German study market;
- current supported institution/programme foundation;
- clean official city-state boundary for future city metrics.

### Aachen

Decision: `TIER_A`

Canonical slug: `aachen`

Preliminary Bundesland: North Rhine-Westphalia / Nordrhein-Westfalen

Scope semantics: Aachen municipality; do not substitute the wider StädteRegion Aachen.

Current CampCareer support:

- RWTH Aachen University;
- six Germany programme explorer rows;
- verified institution-city presence.

Why selected:

- highly distinct engineering/technology study market;
- current supported programme foundation;
- strong comparison value against larger generalist cities.

Phase 2/4 must distinguish City of Aachen values from StädteRegion Aachen aggregates.

### Bonn

Decision: `TIER_A`

Canonical slug: `bonn`

Preliminary Bundesland: North Rhine-Westphalia / Nordrhein-Westfalen

Scope semantics: Federal City of Bonn municipality; not the wider Cologne/Bonn region.

Current CampCareer support:

- University of Bonn;
- six Germany programme explorer rows;
- verified institution-city presence.

Why selected:

- distinct university and federal/international-organisation study context;
- complete current bounded institution/programme support;
- should not be collapsed into Cologne or a Cologne/Bonn metro geography.

### Dresden

Decision: `TIER_A`

Canonical slug: `dresden`

Preliminary Bundesland: Saxony / Sachsen

Scope semantics: Dresden municipality.

Current CampCareer support:

- Technische Universität Dresden;
- six Germany programme explorer rows;
- verified institution-city presence.

Why selected:

- distinct eastern German study destination;
- current technical/research institution foundation;
- improves geographic and labour-market diversity of the initial cohort.

### Heidelberg

Decision: `TIER_A`

Canonical slug: `heidelberg`

Preliminary Bundesland: Baden-Württemberg

Scope semantics: Heidelberg municipality; not the wider Rhine-Neckar metropolitan region.

Current CampCareer support:

- Heidelberg University;
- six Germany programme explorer rows;
- verified institution-city presence.

Why selected:

- distinctive university-city profile;
- current supported institution/programme foundation;
- useful contrast with large metropolitan destinations.

Policy guardrail:

Future cost/programme displays must account for Baden-Württemberg's non-EU tuition policy where applicable and must not turn that state rule into a generic Germany-wide tuition claim.

### Karlsruhe

Decision: `TIER_A`

Canonical slug: `karlsruhe`

Preliminary Bundesland: Baden-Württemberg

Scope semantics: Karlsruhe municipality.

Current CampCareer support:

- Karlsruhe Institute of Technology;
- six Germany programme explorer rows;
- verified institution-city presence.

Why selected:

- distinct engineering/technology study market;
- current supported programme foundation;
- strong city-comparison value against Aachen, Munich and Dresden.

Phase 3 rule:

KIT locations outside the Karlsruhe municipality boundary must retain their actual municipality and must not be counted as Karlsruhe delivery without explicit scope evidence.

### Tübingen

Decision: `TIER_A`

Canonical slug: `tuebingen`

Public/source-native label: Tübingen

Preliminary Bundesland: Baden-Württemberg

Scope semantics: Tübingen municipality; not the surrounding Landkreis Tübingen.

Current CampCareer support:

- University of Tübingen;
- six Germany programme explorer rows;
- verified institution-city presence.

Why selected:

- distinctive university-town profile;
- current supported programme foundation;
- gives the initial cohort a smaller high-intensity university-city comparison case.

Phase 2 should preserve the ASCII route slug `tuebingen` while retaining `Tübingen` as the public label and adding deterministic aliases only under the standard alias contract.

## Tier B / national expansion discovery

The following are explicit expansion candidates, not rejected destinations:

- Frankfurt am Main;
- Cologne / Köln;
- Leipzig;
- Münster;
- Stuttgart;
- Freiburg im Breisgau;
- Göttingen;
- Bremen;
- Nuremberg / Nürnberg;
- other German university cities discovered through HRK and DAAD.

These cities are omitted from Tier A v1 because the current Germany canonical institution/location/programme foundation does not yet provide the same bounded traceability used for the nine selected cities.

Their omission must never be presented as a quality or demand ranking.

## Expansion discovery sources

Use HRK Higher Education Compass as the primary recognised-institution discovery surface:

https://www.hochschulkompass.de/en/higher-education-institutions.html

Use DAAD International Programmes as an international-programme discovery signal:

https://www2.daad.de/deutschland/studienangebote/international-programmes/en/result/

Expansion should create canonical institution/campus/programme evidence first, then add a city to the public allowlist. Do not create a city merely because a generic DAAD search returns programmes there.

## Existing production geography relationship

All nine Tier A cities already have stable active geography UUIDs and canonical slugs in production.

Phase 2 must preserve these rows rather than recreating them.

Current metadata gap on all nine:

- `scope_kind = null`;
- `region_code = null`;
- no geography aliases.

Phase 2 should normalize exactly these nine rows first and should not create expansion-candidate geographies as a side effect.

## Phase 2 normalization targets

| City | Slug | Preliminary Bundesland | Phase 2 scope requirement |
| --- | --- | --- | --- |
| Berlin | `berlin` | Berlin | official Berlin municipality/city-state boundary |
| Munich | `munich` | Bavaria | City of Munich; exclude Garching and other surrounding TUM locations by default |
| Hamburg | `hamburg` | Hamburg | official Hamburg municipality/city-state boundary |
| Aachen | `aachen` | North Rhine-Westphalia | City of Aachen; not StädteRegion Aachen |
| Bonn | `bonn` | North Rhine-Westphalia | City of Bonn; not Cologne/Bonn metro region |
| Dresden | `dresden` | Saxony | Dresden municipality |
| Heidelberg | `heidelberg` | Baden-Württemberg | Heidelberg municipality; not Rhine-Neckar metro |
| Karlsruhe | `karlsruhe` | Baden-Württemberg | Karlsruhe municipality; external KIT locations remain separate |
| Tübingen | `tuebingen` | Baden-Württemberg | Tübingen municipality; not Landkreis Tübingen |

Phase 2 must inspect the repository's supported `scope_kind` and region-code conventions before writing production metadata. Do not invent unsupported values.

Where possible, Phase 2 should preserve official Destatis AGS/ARS values as source identifiers/metadata without replacing the CampCareer canonical geography UUID.

## Phase 3 campus-linkage priorities

The Tier A selection creates the following priority audits:

### Berlin

Verify teaching-campus/location coverage for FU Berlin, HU Berlin and TU Berlin.

### Munich

Verify LMU Munich and TUM campus geography. Do not fold Garching, Freising/Weihenstephan, Straubing, Heilbronn or other non-Munich locations into Munich city delivery without explicit approved geography treatment.

### Hamburg

Verify Universität Hamburg teaching locations and programme delivery.

### Aachen

Verify RWTH Aachen teaching campuses/locations and distinguish city from wider regional facilities.

### Bonn

Verify University of Bonn teaching locations and programme delivery within Bonn municipality.

### Dresden

Verify TU Dresden teaching campuses/locations.

### Heidelberg

Verify Heidelberg University teaching locations and any external clinical/research locations before programme counting.

### Karlsruhe

Verify KIT city versus non-city campus/location boundaries before programme counting.

### Tübingen

Verify University of Tübingen teaching locations within the municipal study-destination scope.

## Programme coverage rule

The current 72 Germany programme rows are a strong discovery foundation, but city-facing programme counts require an explicit delivery chain:

`selected city -> verified teaching campus/location -> canonical institution -> explicit programme offering`

If delivery location cannot be verified, the programme remains valid for country/institution discovery but must not inflate a city programme count.

No city may infer programme delivery merely because the programme's institution has a verified institution-city record.

## Metric contract for later phases

Phase 4 should prepare the five standard city decision metrics with source-native units and periods:

1. population — Destatis/official municipality basis;
2. student living-cost reference — local Studierendenwerk or equivalent official/local student-services source where available;
3. student transport reference — applicable local/regional transport authority with eligibility conditions;
4. international-student work rule — current federal rule, qualified as national rather than city-specific;
5. employment/career-context sectors — official city/state/regional economic or labour sources, not shortage guarantees.

Do not mix municipality population with metro living costs or regional employment statistics without clearly labelling the scope difference.

## Compare allowlist contract

Future Germany City Compare should expose exactly the Tier A v1 city slugs until a later expansion decision:

`berlin`, `munich`, `hamburg`, `aachen`, `bonn`, `dresden`, `heidelberg`, `karlsruhe`, `tuebingen`

Primary route shape:

`/compare?type=city&country=DE&left={city-a}&right={city-b}`

Compare remains non-indexable and must not surface expansion candidates before their city publication gate is complete.

## Phase 1 acceptance criteria

Phase 1 is complete when all are true:

- [x] exact Germany Tier A v1 allowlist is defined;
- [x] all selected cities already have stable production geography UUIDs/slugs;
- [x] municipality/city-proper scope is the default geography contract;
- [x] preliminary Bundesland mapping is recorded;
- [x] current institution/programme support is documented for each selected city;
- [x] Excellence-derived selection bias is explicitly bounded;
- [x] major unseeded German university cities are recorded as expansion candidates;
- [x] multi-campus and cross-municipality risks are explicit;
- [x] programme delivery requires explicit campus/location evidence;
- [x] Phase 2 normalization targets are defined;
- [x] future Compare allowlist is explicit;
- [x] no production DB mutation occurs in Phase 1;
- [x] no Germany city route is published in Phase 1.

## Handoff

Proceed to Phase 2 — Germany Slug & Geography Normalization — with the exact Tier A v1 allowlist:

`berlin`, `munich`, `hamburg`, `aachen`, `bonn`, `dresden`, `heidelberg`, `karlsruhe`, `tuebingen`

Do not add expansion candidates to production/public city scope until their canonical institution/location/programme foundations are independently verified.
