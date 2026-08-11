# Spain city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/es-cities-v1`

Base main: `abc088b58a4d4c2efde6729eec1b30d0cb3cc938`

Audit date: 2026-08-11

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

## Purpose

Establish the authoritative higher-education, geography, international-student and production-data baseline required before selecting the first public Spain `/cities` cohort.

Phase 0 is diagnostic only. It does not mutate production data, publish city routes, create city read models, alter SEO/indexing, or infer programme delivery from institution or registered-address presence.

## Product identity

Current canonical country contract:

- country code: `ES`
- country name: Spain
- currency: `EUR`
- country status: active
- intended city route contract: `/cities/es/{city-slug}`

Spain needs a strict distinction between a public study destination and a university's rectorate, legal address or one administrative campus row.

Required invariants:

`rectorate / official contact locality != complete teaching-campus inventory`

`institution associated with destination != programme delivered in destination`

`verified programme offering with inherited campus_id != verified city delivery when programme_assignment_verified=false`

This matters especially for multi-campus systems such as UCLM, EHU, UAB and Universidad de Cádiz.

## Higher-education governance and authority

Spain's university system is governed by the Ley Orgánica 2/2023 del Sistema Universitario (LOSU). The law provides a national framework while preserving substantial autonomous-community competence. Public universities are created and private universities recognised principally through the relevant autonomous-community legislature, and autonomous communities also authorise the start of activities and exercise supervision within their competence.

Quality assurance is likewise shared. ANECA operates at national level, while recognised autonomous-community quality agencies may perform evaluation and accreditation functions within their competences.

Primary authorities:

- LOSU / BOE: https://www.boe.es/buscar/act.php?id=BOE-A-2023-7500
- Ministry LOSU overview: https://www.ciencia.gob.es/Estrategias-y-Planes/GobernanzaEstrategica/LOSU.html
- ANECA overview: https://www.ciencia.gob.es/Ministerio/Mision-y-organizacion/Entidades-Adscritas/ANECA.html

Implication for Cities:

- city profiles must not imply that tuition, admission, quality-agency procedures or regional university policy are identical across all autonomous communities;
- national official-degree status and city delivery are separate evidence layers;
- later phases may need autonomous-community sources for fees, transport, admission context or regional quality evidence.

## Authoritative source families

### University and official-degree identity — RUCT

The Registro de Universidades, Centros y Títulos (RUCT) is Spain's public administrative register for Spanish universities, their centres and official university degrees. The Ministry describes it as continuously reviewed and the official reference for public bodies and universities.

Primary source:

https://www.ciencia.gob.es/Universidades/RUCT.html

CampCareer currently uses `ES_OFFICIAL_UNIVERSITY_NAME` as the verified institution identifier layer because a stable machine-readable RUCT university code was not verified in the existing institution foundation. Do not invent or backfill a numeric RUCT identifier without a reproducible official extraction path.

### Study and programme discovery — QEDU + RUCT + institution official pages

The Ministry's QEDU application is explicitly designed to help students decide what and where to study, and its data are drawn from RUCT and SIIU.

Primary source:

https://www.ciencia.gob.es/Universidades/QEDU.html

Source hierarchy for later city programme verification:

1. RUCT — official university/centre/official-degree identity and status;
2. QEDU/SIIU — national discovery and system-level cross-check;
3. official university programme pages — current programme facts and teaching-location evidence;
4. official faculty/school/campus pages — physical delivery location;
5. no city programme assignment from university brand or rectorate address alone.

### National university statistics — SIIU

The Sistema Integrado de Información Universitaria (SIIU) is the Ministry platform for homogeneous, comparable data across the Spanish university system. Current university-student statistics publish 2024-2025 data, and the university/centre/titulation statistics publish the territorial distribution of universities and teaching units.

Primary sources:

https://www.ciencia.gob.es/Ministerio/Estadisticas/SIIU/QueEsSIIU.html

https://www.ciencia.gob.es/Ministerio/Estadisticas/SIIU/Estudiantes.html

https://www.ciencia.gob.es/Ministerio/Estadisticas/SIIU/UCT.html

https://www.ciencia.gob.es/Ministerio/Estadisticas/SIIU/Clasificaciones.html

SIIU is the preferred national source for student-demand and provider-distribution context. Phase 1 must not convert the current CampCareer ten-university cohort into a national city ranking.

### Official geography and population — INE

Use Instituto Nacional de Estadística (INE) municipal codes, population statistics and Nomenclátor as the baseline national geography authority.

Primary sources:

https://www.ine.es/dyngs/INEbase/es/categoria.htm?c=Estadistica_P&cid=1254735976614

https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177011&idp=1254734710990&menu=resultados

https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177010&idp=1254735572981&menu=resultados

As of this audit, INE publishes the municipality-code relation at 1 January 2026. Phase 2 must record an exact public population boundary for every Tier A destination.

For destinations whose real study ecosystem crosses municipal borders — notably Barcelona/UAB and Bilbao/Leioa — Phase 2 must either establish a defensible official supra-municipal scope or keep a municipality population reference with a prominent scope disclosure. It must never silently equate an adjacent teaching locality with the named public city.

### International-student residence eligibility — Ministerio de Inclusión

The national immigration authority currently publishes the long-duration study-authorisation route for higher education. The current guidance states that a foreign student must be admitted to an authorised education centre and distinguishes the applicable immigration requirements from academic admission.

Primary sources:

https://www.inclusion.gob.es/web/migraciones/estudiar

https://www.inclusion.gob.es/web/migraciones/w/estancia-por-estudios

International residence eligibility is national context, not a city quality score.

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-11.

### Country

Production contains the active canonical country:

- `ES` — Spain
- default currency: `EUR`

### Existing Spain geography seed

Production contains exactly 8 active Spain geography rows:

1. Barcelona — `barcelona`
2. Cádiz — `cadiz`
3. Cerdanyola del Vallès — `cerdanyola-del-valles`
4. Ciudad Real — `ciudad-real`
5. Leioa — `leioa`
6. Madrid — `madrid`
7. Málaga — `malaga`
8. Sevilla — `sevilla`

Current quality:

- geography type: `city` for `8/8`
- active: `8/8`
- `scope_kind`: `0/8`
- `region_code`: `0/8`
- coordinates asserted: `0/8`
- source system: `UNIVERSITY_OFFICIAL_CONTACT`
- normalization batch: `es_tier_a_locations_v1`

These rows were created from official university contact/rectorate evidence. They are valid locality anchors but are **not** automatically the public Spain city allowlist.

Critical examples:

- `cerdanyola-del-valles` is the UAB rectorate/Bellaterra locality and must not be silently renamed to Barcelona;
- `leioa` is the EHU rectorate locality and must not be silently renamed to Bilbao;
- `ciudad-real` is the UCLM rectorate locality and does not prove that UCLM programmes are delivered only in Ciudad Real;
- `cadiz` is the Universidad de Cádiz rectorate locality and does not prove university-wide Cádiz-city delivery.

### Canonical Spain institution foundation

Production contains exactly 10 active canonical Spain institutions, all public universities:

- Euskal Herriko Unibertsitatea (EHU)
- Universidad Autónoma de Madrid
- Universidad Complutense de Madrid
- Universidad de Cádiz
- Universidad de Castilla-La Mancha
- Universidad de Málaga
- Universidad de Sevilla
- Universitat Autònoma de Barcelona
- Universitat de Barcelona
- Universitat Politècnica de Catalunya

Identity quality:

- active: `10/10`
- canonical slug: `10/10`
- official website: `10/10`
- `ES_OFFICIAL_UNIVERSITY_NAME`: `10/10`

The existing repository foundation explicitly describes this as a ten-university Tier A major-public-university cohort, not the complete Spanish higher-education provider universe.

Material provider gaps for a national city product include universities in destinations such as Valencia and Granada, plus many other public/private universities and specialised providers. Their absence in the current CampCareer institution set must not be interpreted as lower destination quality.

### Existing campus/location rows

Production contains exactly 10 Spain campus rows, one for each current canonical university.

Distribution:

- Madrid: 2
- Barcelona: 2
- Cerdanyola del Vallès: 1
- Leioa: 1
- Sevilla: 1
- Málaga: 1
- Cádiz: 1
- Ciudad Real: 1

Quality:

- geography link present: `10/10`
- official/source URL present: `10/10`
- source checked: `10/10`
- `programme_assignment_verified=false`: `10/10`
- `programme_assignment_verified=true`: `0/10`

These rows are rectorate/official-contact anchors. They are not complete teaching-campus inventories.

### Programmes and offerings

Production contains:

- active canonical Spain programmes: `167`
- verified programme offerings: `167`
- offerings with a campus_id: `167/167`
- offerings with a source URL: `167/167`
- current canonical institutions represented: `10/10`
- linked campus rows with `programme_assignment_verified=true`: `0`

The 167 records are a conservative official-Master programme foundation built from RUCT-backed/current university evidence. Their inherited campus links do **not** prove city delivery because every current Spain campus row remains programme-assignment unverified.

Therefore Spain city programme coverage must start as:

`programme_coverage_status = verification_pending`

Current inherited offering distribution by rectorate geography must not be displayed as city programme counts:

- Madrid: 50
- Barcelona: 33
- Cádiz: 25
- Cerdanyola del Vallès: 20
- Leioa: 20
- Sevilla: 8
- Málaga: 6
- Ciudad Real: 5

All assignment-verified city offering counts are currently `0`.

### City metrics and read models

Current production state:

- Spain rows in `report_metric_evidence_city`: `0`
- verified Spain city metric rows: `0`
- Spain city directory/read-model views: `0`
- Spain City Compare surface: not established
- Spain public city route allowlist: not established before this rollout

Phase 0 introduces none.

## Reusable foundation

The following can be reused safely:

1. canonical country `ES` and EUR currency;
2. ten canonical official-name-backed public-university identities;
3. eight existing geography UUIDs as rectorate/locality evidence;
4. ten source-backed official-contact campus/location rows as identity anchors;
5. 167 canonical official-Master programme identities and verified offering records as national programme evidence;
6. RUCT as national university/centre/official-degree authority;
7. QEDU + SIIU as national discovery/statistical sources;
8. INE as national municipality/population authority;
9. official university campus/faculty pages as Phase 3 teaching-location authority;
10. Ministry of Inclusion student-residence guidance as national eligibility context.

## Data that must not be treated as publication-complete

Do not treat the following as complete city data:

1. the current eight geography rows as the final public destination list;
2. Cerdanyola del Vallès as synonymous with Barcelona;
3. Leioa as synonymous with Bilbao;
4. the UCLM Ciudad Real rectorate as proof of all UCLM teaching delivery;
5. the Universidad de Cádiz rectorate as proof of all UCA delivery;
6. the ten campus rows as complete campus inventories;
7. the current ten universities as the complete Spanish provider universe;
8. the 167 offering-to-campus links as verified city delivery;
9. national immigration rules as city differentiators;
10. official RUCT degree existence as proof that the programme is taught at a specific city site.

## Phase 0 blockers and remediation

### Blocker 1: rectorate/locality seed is being used as geography foundation

Current rows originate from official-contact evidence, not a public-destination study.

Remediation: Phase 1 selects user-facing study destinations independently. Phase 2 preserves locality evidence and creates or normalises separate destination geographies where needed.

### Blocker 2: geography scope is absent

Current state: `8/8` seed rows have no `scope_kind` and no `region_code`.

Remediation: Phase 2 must add exact INE municipality identity and autonomous-community/region metadata, plus an explicit population boundary for every Tier A destination.

### Blocker 3: provider coverage is intentionally incomplete

Current state: 10 public universities only.

Remediation: Phase 1 must not exclude a major destination solely because it is absent from the current ten-institution foundation. Phase 3 must add source-backed canonical institutions when omission would materially misrepresent a Tier A destination, or disclose a bounded initial provider set.

### Blocker 4: campus inventory is incomplete

Current state: one official-contact/rectorate row per institution.

Remediation: Phase 3 must verify actual teaching locations from official university campus/faculty sources.

### Blocker 5: programme city delivery is unverified

Current state: `167` verified offerings but `0` current campus rows with `programme_assignment_verified=true`.

Remediation: city programme counts remain unavailable until explicit programme-to-teaching-location evidence exists.

### Blocker 6: no city metric layer

Current state: zero Spain city metrics.

Remediation: Phase 4 creates the Five Core Metrics only after Phase 2 fixes destination/population scope and Phase 3 fixes institution/teaching-location linkage.

### Blocker 7: autonomous-community differences matter

The national university framework does not erase autonomous-community competence.

Remediation: later fee/admission/transport/quality context must use the appropriate regional authority where the metric is not genuinely national.

## Readiness gates

Spain may proceed to Phase 1 if these rules remain fixed:

1. Tier A is a bounded first publication cohort, not a ranking of every Spanish university city;
2. rectorate/locality geographies are not silently renamed into broader public destinations;
3. public route identity and metric population boundary are separately documented;
4. RUCT/QEDU/SIIU establish national identity/discovery context, while official university evidence establishes physical teaching location;
5. Phase 3 verifies teaching locations rather than trusting rectorate addresses;
6. programme delivery is never inferred from institution presence or inherited campus links;
7. current ten-university coverage is disclosed as incomplete;
8. national immigration rules remain context rather than a city-ranking signal;
9. autonomous-community differences are preserved where relevant;
10. major destinations outside the current institution foundation are treated as provider-expansion work, not excluded by default.

## Phase 0 result

Spain Phase 0 is complete.

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

Production mutation: `NONE`

Route/publication change: `NONE`
