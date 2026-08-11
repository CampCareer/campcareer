# Netherlands city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/nl-cities-scope-v1`

Base Phase 0: `fa6ea6b0a6fdd9790e0dabccf126f0370b8c7e1e`

Audit date: 2026-08-10

## Purpose

Select the first public Netherlands `/cities` cohort and define the exact Phase 2 geography-normalization contract.

Phase 1 does not mutate production geography rows, publish routes, create city read models, or infer programme delivery from institution presence.

## Decision

Netherlands Tier A v1 contains exactly five public study destinations:

1. `amsterdam`
2. `maastricht`
3. `rotterdam`
4. `groningen`
5. `eindhoven`

Initial public route contract:

- `/cities/nl/amsterdam`
- `/cities/nl/maastricht`
- `/cities/nl/rotterdam`
- `/cities/nl/groningen`
- `/cities/nl/eindhoven`

All five already exist as active production NL city geographies. Phase 2 must preserve their existing UUIDs and normalize them in place.

## Selection methodology

Tier A is anchored to the latest Nuffic municipality-level international degree-student distribution for academic year 2025-26, based on DUO registration data.

The five largest municipalities in that dataset are:

| Rank | Municipality | International degree students |
| --- | --- | ---: |
| 1 | Amsterdam | 25,734 |
| 2 | Maastricht | 14,235 |
| 3 | Rotterdam | 11,581 |
| 4 | Groningen | 11,313 |
| 5 | Eindhoven | 9,385 |

This provides a current, source-consistent demand criterion rather than selecting cities merely because they already exist in CampCareer's geography seed.

Selection is then checked against:

1. active canonical city geography already present in production;
2. at least one current canonical research-university institution/location anchor;
3. distinct national study-market value;
4. useful geographic spread across the Netherlands;
5. ability to use municipality semantics consistently for later population and student-demand evidence.

The existing 12-row geography inventory is a foundation, not the product allowlist.

## Geography scope principle

For Tier A v1, the intended public study-destination boundary is the municipality rather than an inferred metropolitan region.

Reasons:

- Nuffic's current international-student distribution is reported by municipality/location of enrolment;
- CBS provides municipality-based population context suitable for a stable city metric contract;
- municipality scope avoids silently absorbing nearby independent municipalities, campuses or commuter markets.

Phase 2 must resolve the exact supported `scope_kind`, canonical slug and any official municipality code/alias representation. Do not invent unsupported metadata values.

## Tier A decisions

### Amsterdam

Decision: `TIER_A`

Canonical slug target: `amsterdam`

Current production geography: exists and active.

Why selected:

- largest current international degree-student municipality in the Nuffic 2025-26 dataset, with `25,734` students;
- current canonical institution anchors include University of Amsterdam and Vrije Universiteit Amsterdam;
- largest Dutch international study market and a required comparison anchor for v1.

Phase 2 preliminary scope:

- municipality of Amsterdam;
- do not automatically include Amstelveen, Diemen or the wider Amsterdam metropolitan area;
- preserve current production geography UUID;
- population and city metrics must use the same municipality boundary unless explicitly labelled otherwise.

### Maastricht

Decision: `TIER_A`

Canonical slug target: `maastricht`

Current production geography: exists and active.

Why selected:

- second-largest current international degree-student municipality, with `14,235` students;
- Nuffic reports an exceptionally high international share of the local student population;
- Maastricht University provides a strong canonical university anchor;
- gives v1 a distinct southern and highly international study destination.

Phase 2 preliminary scope:

- municipality of Maastricht;
- do not use Limburg province statistics as Maastricht city statistics;
- preserve current production geography UUID.

### Rotterdam

Decision: `TIER_A`

Canonical slug target: `rotterdam`

Current production geography: exists and active.

Why selected:

- third-largest current international degree-student municipality, with `11,581` students;
- Nuffic reports Rotterdam moved ahead of Groningen into third place in 2025-26;
- Erasmus University Rotterdam provides the current canonical research-university anchor;
- materially distinct Randstad study and employment market from Amsterdam.

Phase 2 preliminary scope:

- municipality of Rotterdam;
- do not silently expand to Rijnmond or the wider Rotterdam-The Hague metropolitan area;
- preserve current production geography UUID.

### Groningen

Decision: `TIER_A`

Canonical slug target: `groningen`

Current production geography: exists and active.

Why selected:

- fourth-largest current international degree-student municipality, with `11,313` students;
- University of Groningen provides a major canonical university anchor;
- adds a distinct northern university-city market not represented by the Randstad or southern cities.

Phase 2 preliminary scope:

- municipality of Groningen;
- do not use Province of Groningen data as city data;
- preserve current production geography UUID.

### Eindhoven

Decision: `TIER_A`

Canonical slug target: `eindhoven`

Current production geography: exists and active.

Why selected:

- fifth-largest current international degree-student municipality, with `9,385` students;
- Nuffic reports the strongest relative international-student growth among the leading municipalities in 2025-26;
- Eindhoven University of Technology provides the current canonical university anchor;
- adds a distinct technology/engineering study market in North Brabant.

Phase 2 preliminary scope:

- municipality of Eindhoven;
- do not treat the broader Brainport region as the city boundary;
- preserve current production geography UUID.

## Tier B existing geography candidates

The following active production geographies remain valid expansion candidates but are not Tier A v1:

1. Delft
2. Utrecht
3. Enschede
4. Tilburg
5. Leiden
6. Nijmegen
7. Wageningen

They remain active canonical geography records. Phase 1 does not delete, deactivate or repurpose them.

Current Nuffic 2025-26 international degree-student counts support them as meaningful later expansion markets:

- Delft: `7,553`
- Utrecht: `6,906`
- Enschede: `5,949`
- Tilburg: `5,111`
- Leiden: `4,225`
- Nijmegen: `3,005`
- Wageningen: `2,972`

Delft is the leading existing-geometry Tier B candidate by the current demand measure.

## Tier B discovered candidate: The Hague

Decision: `TIER_B_DISCOVERED`

Nuffic reports Den Haag / The Hague with `8,378` international degree students in 2025-26, which places it immediately after the Tier A top five and ahead of Delft.

However, The Hague is not present in the current 12-row NL canonical city geography seed and is not represented by the current 13-institution WO foundation in a way that is sufficient for immediate city publication.

This is evidence that the current research-university geography seed is not a complete Dutch study-city universe and that HBO/provider expansion matters.

Do not create The Hague automatically in Phase 1. It should be normalized through a deliberate later expansion decision with:

- canonical municipality geography;
- BRIN/RIO-backed provider identities;
- relevant HBO/university campus evidence;
- the same five city-metric contract as Tier A.

Other Nuffic municipalities such as Leeuwarden and Breda may enter later expansion review through the same rule rather than being inferred from the current seed.

## Country and regional coverage rationale

Tier A provides deliberately diverse national coverage:

- Amsterdam: North Holland / primary international hub;
- Rotterdam: South Holland / major Randstad port and business study market;
- Eindhoven: North Brabant / technology and engineering market;
- Maastricht: Limburg / southern border-region international study market;
- Groningen: Groningen / northern university city.

This avoids a first release dominated entirely by the Randstad while retaining the five strongest current municipality-level international-student demand signals.

## Institution and campus implications for Phase 3

The current production research-university anchors for Tier A are:

### Amsterdam

- University of Amsterdam
- Vrije Universiteit Amsterdam

### Maastricht

- Maastricht University

### Rotterdam

- Erasmus University Rotterdam

### Groningen

- University of Groningen

### Eindhoven

- Eindhoven University of Technology

These are identity/location anchors only.

Phase 3 must:

1. reconcile the duplicate registered-location and legacy listed-campus rows;
2. verify actual teaching-campus inventory from official institution sources;
3. expand HBO provider coverage where omission would materially misrepresent the city;
4. create programme-to-campus/location relationships only from explicit source evidence.

No city programme count may be derived from the existence of the current 26 canonical NL programmes.

## Programme coverage rule

Current production state:

- canonical NL programmes: `26`
- explicit NL programme offerings: `0`

Therefore all Tier A city programme coverage remains:

`programme_coverage_status = verification_pending`

This does not block later city publication if institution/location and five-metric gates are met, but the UI must disclose the catalogue gap and must never present inferred city programme availability.

## Phase 2 normalization targets

Phase 2 should normalize exactly these five existing geography rows first:

| City | Slug target | Region code | Intended scope |
| --- | --- | --- | --- |
| Amsterdam | `amsterdam` | `NH` | Amsterdam municipality |
| Maastricht | `maastricht` | `LI` | Maastricht municipality |
| Rotterdam | `rotterdam` | `ZH` | Rotterdam municipality |
| Groningen | `groningen` | `GR` | Groningen municipality |
| Eindhoven | `eindhoven` | `NB` | Eindhoven municipality |

Phase 2 requirements:

- preserve existing geography UUIDs;
- add canonical slugs;
- use only a supported `scope_kind` value after inspecting current schema/patterns;
- preserve coordinates unless authoritative correction is required;
- keep region codes;
- add aliases only where deterministic;
- do not normalize Tier B cities as part of the Tier A Phase 2 mutation unless required for a shared integrity constraint.

## Source contract

Primary source families for the city rollout:

### International-student demand

Nuffic, Incoming degree mobility in Dutch higher education 2025-26:

https://www.nuffic.nl/onderzoek-en-cijfers/onderzoeken/inkomende-diplomamobiliteit-in-het-hbo-en-wo-2025-26

### Institution/programme identity and recognition

DUO / RIO:

https://onderwijsdata.duo.nl/datasets/overzicht-erkenningen-ho

https://www.duo.nl/zakelijk/hoger-onderwijs/studentenadministratie/opleidingsgegevens-in-croho/raadplegen-en-downloaden.jsp

### Accreditation

NVAO:

https://www.nvao.net/en/the-netherlands

### International study residence/sponsorship

IND:

https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education

https://ind.nl/en/public-register-recognised-sponsors/public-register-study

### Municipality population/geography

CBS:

https://www.cbs.nl/nl-nl/visualisaties/dashboard-bevolking/regionaal/inwoners

Official provider websites remain mandatory for teaching-campus and programme-location evidence.

## Phase 1 acceptance criteria

Phase 1 is complete when all are true:

- [x] exact five-city Tier A allowlist is fixed;
- [x] selection is anchored to current municipality-level international-student data;
- [x] every Tier A city already has an active production geography;
- [x] every Tier A city has at least one current canonical research-university anchor;
- [x] municipality scope is fixed as the preliminary public boundary;
- [x] all seven remaining production cities are retained as Tier B candidates;
- [x] The Hague is recorded as a material discovered expansion gap rather than silently ignored;
- [x] existing UUID preservation rule is fixed for Phase 2;
- [x] programme coverage remains verification pending because explicit offerings are absent;
- [x] no production DB mutation occurs in Phase 1;
- [x] no city route is published in Phase 1.

## Handoff

Proceed to Phase 2 Slug and Geography Normalization with exactly:

`amsterdam`, `maastricht`, `rotterdam`, `groningen`, `eindhoven`

Phase 1 checkpoint: `TIER_A_SCOPE_LOCKED`

Production mutation: `NONE`

Publication change: `NONE`
