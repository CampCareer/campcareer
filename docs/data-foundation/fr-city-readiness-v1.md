# France city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/fr-cities-v1`

Base main: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Audit date: 2026-08-10

Verdict: `READY_WITH_GATES`

## Purpose

Establish the authoritative higher-education, study-destination, geography and production-data baseline required before selecting the first public France `/cities` cohort.

Phase 0 is diagnostic only. It does not mutate production data, publish city routes, alter SEO/indexing, or infer programme delivery from institution or registered-address presence.

## Product identity

Current canonical country contract:

- country code: `FR`
- country name: France
- currency: `EUR`
- intended city route contract: `/cities/fr/{city-slug}`

France requires a deliberate distinction between a **public study destination** and an institution's legal or registered locality. Several major French university ecosystems span multiple communes, intercommunalities or metropolitan areas.

Required invariant:

`registered university address != complete teaching-campus inventory`

`institution associated with destination != programme delivered in destination`

`verified programme offering with inherited campus_id != verified city delivery when programme_assignment_verified=false`

## Authoritative source families

### Higher-education demand

Use the Ministry of Higher Education / SIES Atlas dataset as the national student-demand authority.

The current dataset covers enrolments through academic year 2024-25, is updated annually, and supports explicit geographic filtering including commune and urban unit. The ministry warns that geographic level and formation grouping must be selected deliberately to avoid double counting.

Primary source:

https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-atlas_regional-effectifs-d-etudiants-inscrits/

### Population and official geography

Use INSEE Code officiel géographique and INSEE territorial statistics for official commune, intercommunality/metropolitan and study-area identity.

Current population reference available during this audit is RP2023 in geography at 1 January 2026.

Primary sources:

https://www.insee.fr/fr/statistiques/9006414

https://www.insee.fr/fr/statistiques/1405599

### International-student destination context

Campus France maintains annually updated student-city and welcome-service guides. The 2025 directory includes Paris, Palaiseau / Paris-Saclay, Bordeaux, Grenoble and Saint-Martin-d'Hères, Aix-en-Provence / Marseille, Nice and Strasbourg among the main student destinations.

Primary sources:

https://www.campusfrance.org/en/villes

https://www.campusfrance.org/en/discover-all-you-need-to-know-about-student-reception-in-50-university-cities-in-france

### Institution identity and location

Current CampCareer France institution identity is UAI-based. Existing location rows use government Onisep/UAI evidence or official institution pages.

The location layer is deliberately labelled as registered institution location rather than a complete campus inventory.

### International-student work context

French national student-work rights are country context rather than a city differentiator. Service-Public currently states that a foreign student holding the relevant student residence status may work up to 964 hours per year; work beyond that threshold requires a work authorisation.

Primary source:

https://www.service-public.fr/particuliers/vosdroits/F3100

Phase 4 may reuse this as national context but must not score it as a city advantage.

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-10.

### Existing France geography seed

Production contains 7 active France `city` geography rows:

1. Marseille — `marseille`
2. Nice — `nice`
3. Paris — `paris`
4. Saint-Aubin — `saint-aubin`
5. Saint-Martin-d'Hères — `saint-martin-dheres`
6. Strasbourg — `strasbourg`
7. Talence — `talence`

All seven originate from the `fr_idex_locations_v1` institution-location normalisation layer.

Current quality:

- active: `7/7`
- geography type: `city` for `7/7`
- `scope_kind`: `0/7`
- `region_code`: `0/7`
- source system: `ONISEP_UAI`
- source purpose: registered institution location

These rows are not automatically seven publishable CampCareer city profiles. They were created to anchor verified registered university addresses.

### Canonical France institutions

Production contains 9 active canonical institutions:

- Aix-Marseille Université
- Sorbonne Université
- Université Côte d'Azur
- Université de Bordeaux
- Université de Strasbourg
- Université Grenoble Alpes
- Université Paris Cité
- Université Paris-Saclay
- Université PSL

Identity quality:

- active: `9/9`
- canonical slug: `9/9`
- official website: `9/9`
- UAI identifiers (`FR_UAI`): `9/9`

This is a deliberate high-confidence IdEx/university foundation, not a complete French higher-education provider universe.

Material omissions include many universities, grandes écoles, engineering schools, business schools and other recognised providers in major student cities such as Lyon, Toulouse, Lille, Montpellier, Rennes and Nantes.

### Current institution-location rows

Production contains exactly 9 active France location rows for the nine canonical universities.

They are distributed as:

- Paris: 3
- Marseille: 1
- Nice: 1
- Saint-Aubin: 1
- Saint-Martin-d'Hères: 1
- Strasbourg: 1
- Talence: 1

Quality contract:

- geography link: `9/9`
- source URL: `9/9`
- `location_quality=verified_official`: `9/9`
- `record_scope=registered_institution_location`: `9/9`
- `campus_inventory_complete=false`: `9/9`
- `programme_assignment_verified=false`: `9/9`
- coordinates intentionally not asserted

These rows are valid institution identity/location anchors only. They are not complete teaching-campus inventories.

## Critical geography finding

The current locality seed cannot be reused blindly as the public city allowlist.

### Bordeaux / Talence

Université de Bordeaux's registered location is in Talence, while the user-facing international study destination is Bordeaux and the teaching ecosystem extends across Bordeaux Métropole.

Do not rename the existing Talence locality UUID to Bordeaux. Talence must remain valid locality evidence if retained, while a Bordeaux public destination requires an explicit destination geography contract.

INSEE current reference:

- Bordeaux Métropole EPCI `243300316`
- population 2023: `854,334`

Source:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-243300316

### Grenoble / Saint-Martin-d'Hères

Université Grenoble Alpes' registered location is Saint-Martin-d'Hères. Campus France explicitly treats the international reception destination as Grenoble and Saint-Martin-d'Hères.

Do not rename the existing Saint-Martin-d'Hères locality UUID to Grenoble.

INSEE current reference:

- Grenoble-Alpes-Métropole EPCI `200040715`
- population 2023: `450,608`

Source:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200040715

Campus France:

https://www.campusfrance.org/en/cities/grenoble-et-saint-martin-d-heres

### Paris-Saclay / Saint-Aubin

Université Paris-Saclay's registered university address seed is Saint-Aubin, but Campus France's international welcome surface is Palaiseau / the Communauté Paris-Saclay area and covers Orsay, Saclay, Gif-sur-Yvette and other locations.

Do not rename the existing Saint-Aubin locality UUID to Paris-Saclay.

INSEE current reference:

- Communauté Paris-Saclay EPCI `200056232`
- population 2023: `326,692`

Source:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200056232

Campus France:

https://www.campusfrance.org/en/cities/palaiseau

### Aix-Marseille

Aix-Marseille Université is a multi-city university. The current production locality seed is Marseille, but Campus France separately supports Aix-en-Provence and Marseille and its city directory groups the destination as Aix-en-Provence / Marseille.

A public Aix-Marseille study destination must not convert the Marseille locality row into evidence that all AMU teaching occurs in Marseille.

INSEE current reference:

- Métropole d'Aix-Marseille-Provence EPCI `200054807`
- population 2023: `1,939,077`

Source:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200054807

Campus France:

https://www.campusfrance.org/en/resource/aix-en-provence

https://www.campusfrance.org/en/resource/marseille

### Paris

Paris is both an existing registered-location geography and a defensible public destination. Phase 2 may reuse the existing Paris UUID only if the public population contract remains explicitly the Paris commune rather than silently expanding to all Île-de-France.

INSEE current reference:

- Paris commune COG `75056`
- population 2023: `2,103,778`

Source:

https://www.insee.fr/fr/statistiques/1405599?geo=COM-75056

Campus France currently publishes a Paris and Île-de-France guide, so the city UI must disclose that the CampCareer v1 Paris population boundary is narrower than the wider regional student ecosystem.

### Strasbourg

The existing Strasbourg locality is a plausible direct public destination, but Phase 2 must explicitly choose whether the public population context is the Strasbourg commune or Eurométropole and then keep that choice stable.

INSEE Eurométropole reference:

- EPCI `246700488`
- population 2023: `522,596`

Source:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-246700488

Campus France:

https://www.campusfrance.org/en/resource/strasbourg

### Nice

The existing Nice locality is a plausible direct public destination. Université Côte d'Azur nevertheless has a wider multi-site footprint, so city programme delivery cannot be inferred from the Nice registered address.

INSEE Métropole Nice Côte d'Azur reference:

- EPCI `200030195`
- population 2023: `574,287`

Source:

https://www.insee.fr/fr/statistiques/1405599?geo=EPCI-200030195

Campus France:

https://www.campusfrance.org/en/cities/nice

## Programmes and offerings

Production contains:

- active canonical France programmes: `132`
- verified programme offerings: `132`
- offerings with a `campus_id`: `132/132`
- verified offerings with a `campus_id`: `132/132`
- linked campus rows with `programme_assignment_verified=true`: `0/132`
- programme identifiers: `132` using `FR_OFFICIAL_PROGRAM_KEY`

Per current canonical institution:

- Université de Strasbourg: 20
- Université PSL: 20
- Sorbonne Université: 17
- Université Grenoble Alpes: 15
- Université Paris Cité: 15
- Université Paris-Saclay: 15
- Aix-Marseille Université: 10
- Université Côte d'Azur: 10
- Université de Bordeaux: 10

The 132 offering rows are valid programme existence/publication evidence. Their inherited campus links point to registered institution addresses and are explicitly **not** verified programme-to-teaching-location assignments.

Therefore France city programme coverage must start as:

`programme_coverage_status = verification_pending`

## City metrics and publication state

Current production state:

- France city metric rows in `report_metric_evidence_city`: `0`
- France public city profile/read-model layer: not established
- France City Compare surface: not established
- France Tier A route allowlist: not established before this rollout

Phase 0 introduces none.

## Reusable foundation

The following can be reused safely:

1. canonical country `FR` and EUR currency;
2. nine canonical UAI-backed university identities;
3. seven existing locality UUIDs as registered-location/locality evidence;
4. nine source-backed registered institution locations;
5. 132 canonical programme identities and verified offering records as national programme evidence;
6. MESR/SIES Atlas as the national student-demand source;
7. INSEE as the official geography and population authority;
8. Campus France current city guides as international-student destination context;
9. official institution teaching-location pages for Phase 3.

## Data that must not be treated as publication-complete

Do not treat the following as complete city data:

1. the current seven geography rows as the final public destination list;
2. Talence as synonymous with Bordeaux;
3. Saint-Martin-d'Hères as synonymous with the full Grenoble study destination;
4. Saint-Aubin as synonymous with Paris-Saclay;
5. Marseille registered-address presence as proof of all Aix-Marseille delivery;
6. the nine registered institution addresses as complete teaching-campus inventories;
7. the current nine universities as the complete French provider universe;
8. the 132 offering-to-campus links as verified city delivery;
9. country-level student-work or visa rules as city differences.

## Phase 0 blockers and remediation

### Blocker 1: public destination and registered locality are conflated in the seed

Remediation: Phase 1 must select user-facing study destinations. Phase 2 must preserve the existing locality UUIDs rather than renaming locality evidence into broader metropolitan destinations.

### Blocker 2: geography scope is absent

Current state: `7/7` seed rows lack `scope_kind` and region codes.

Remediation: Phase 2 must attach explicit INSEE identity and a documented population boundary for every selected public destination.

### Blocker 3: provider coverage is intentionally narrow

Current state: 9 high-confidence universities.

Remediation: Phase 3 should add material providers where omission would misrepresent a selected city, or disclose the bounded university-first coverage.

### Blocker 4: campus inventory is incomplete

Current state: 9 registered-address rows, all `campus_inventory_complete=false`.

Remediation: Phase 3 must verify actual teaching locations using official institution evidence.

### Blocker 5: programme city delivery is unverified

Current state: 132 verified offerings, but `0/132` campus relationships are marked as programme-assignment verified.

Remediation: city programme counts remain unavailable until explicit programme-to-teaching-location evidence exists.

### Blocker 6: no city metric layer

Current state: 0 France city metric rows.

Remediation: Phase 4 must create Five Core Metrics only after the Phase 2 destination/population contract and Phase 3 linkage contract are fixed.

## Readiness gates

France may proceed to Phase 1 if these rules remain fixed:

1. Tier A is a bounded first publication cohort, not a claim to rank every French student city;
2. current registered-location geographies remain locality evidence and are not silently renamed into broader destinations;
3. public route identity and metric population boundary are separately documented;
4. MESR student demand is filtered at an explicit geographic level and formation grouping;
5. Phase 3 verifies teaching locations rather than trusting registered headquarters;
6. programme delivery is never inferred from institution or inherited campus presence;
7. national work/residence rules remain context rather than city-ranking signals;
8. major cities outside the current nine-institution foundation are recorded as expansion gaps rather than silently treated as lower quality.

## Primary external sources

- MESR / SIES student enrolment Atlas: https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-atlas_regional-effectifs-d-etudiants-inscrits/
- INSEE territorial comparator: https://www.insee.fr/fr/statistiques/1405599
- INSEE 2023 population release: https://www.insee.fr/fr/statistiques/9006414
- Campus France city directory: https://www.campusfrance.org/en/villes
- Campus France 2025 city guides: https://www.campusfrance.org/en/discover-all-you-need-to-know-about-student-reception-in-50-university-cities-in-france
- Campus France 2025 student-city context: https://www.campusfrance.org/en/actu/les-meilleures-villes-etudiantes-en-2025-un-palmares-aux-multiples-facettes
- Service-Public foreign-student work context: https://www.service-public.fr/particuliers/vosdroits/F3100

## Phase 0 result

France Phase 0 is complete.

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

Production mutation: `NONE`

Route/publication change: `NONE`
