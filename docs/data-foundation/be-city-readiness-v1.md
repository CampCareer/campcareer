# Belgium city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/be-cities-v1`

Base main: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Audit date: 2026-08-10

Verdict: `READY_WITH_GATES`

## Purpose

Establish the authoritative higher-education, provider, programme, geography and production-data baseline required before selecting the first public Belgium `/cities` cohort.

Phase 0 is diagnostic only. It does not mutate production data, publish city routes, alter SEO/indexing, or infer programme delivery from institution presence.

## Product identity

Current canonical country contract:

- country code: `BE`
- country name: Belgium
- currency: `EUR`
- existing country hub: `/be`
- intended city route contract: `/cities/be/{city-slug}`

Belgium requires an explicit federal/community boundary. Higher education is organised primarily through the Flemish Community and the French-speaking Wallonia-Brussels Federation, while Brussels is a multilingual higher-education market spanning both systems.

The city rollout must not collapse Flemish and French-speaking recognition, provider, tuition or study-location evidence into one undocumented source model.

## Authoritative higher-education source families

### Flemish Community and Brussels

Use the Flemish government higher-education authority and Study in Flanders for recognised-provider/programme context and international-study guidance.

Study in Flanders currently represents 18 Flemish higher-education institutions and separately distinguishes universities from universities of applied sciences and arts.

Primary source family:

- Flemish Education / Higher Education Register
- Study in Flanders
- official institution programme and campus pages

### French-speaking Belgium

Use ARES / Wallonie-Bruxelles Campus and official institution sources for recognised-provider/programme and campus/location context.

Wallonie-Bruxelles Campus lists the recognised French-speaking universities, university colleges and schools of arts; it currently lists 19 French-speaking university colleges alone.

Primary source family:

- ARES
- Wallonie-Bruxelles Campus
- official institution programme and campus pages

### Required invariant

Programme recognition and city delivery are separate facts.

`institution associated with city != programme delivered in city`

`primary institution location != complete teaching-campus inventory`

`verified programme offering != verified city delivery when campus assignment is unverified`

## International-student context

Country-level international-study and work rules remain separate from city differentiators.

The verified Belgium country evidence layer currently includes a 20-hour-per-week academic-year work limit for relevant non-EEA students, with different holiday-period rules. Study in Flanders independently states the same 20-hour academic-year limit for non-EEA students with the relevant residence status.

Phase 4 may reuse the national rule as context but must not score it as a city difference.

## Geography authority

Use Statbel / be.STAT as the population authority and the Belgian administrative geography as the primary population-boundary contract.

Phase 2 must resolve official NIS/INS geography codes and supported `scope_kind` values rather than inventing codes.

### Brussels special case

The current production geography is labelled `Brussels`, but the public study destination cannot safely be interpreted as the municipality of the City of Brussels.

The Brussels-Capital Region is the defensible study-destination boundary because higher education is distributed across multiple municipalities in the 19-municipality region. The Brussels-Capital Region reports more than 140,000 higher-education students and five universities plus roughly 25 other higher-education institutions.

Phase 2 must therefore make the Brussels scope explicit and must not publish City-of-Brussels municipality population as if it represented the full study destination.

### Louvain-la-Neuve special case

Louvain-la-Neuve is a university town inside the municipality of Ottignies-Louvain-la-Neuve, not a standalone municipality.

The public route may retain the user-facing `louvain-la-neuve` destination label, but population and administrative metrics must identify the underlying official municipality or another explicitly documented supported scope.

### Other existing city geographies

Antwerp, Ghent, Leuven, Liège and Namur can use municipality-based geography contracts once Phase 2 assigns authoritative codes and metadata.

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-10.

### Country

`core.countries` contains active canonical country `BE` / Belgium with default currency `EUR`.

### Geography

Production contains 7 active Belgium city geography rows:

1. Antwerp — `antwerp`
2. Brussels — `brussels`
3. Ghent — `ghent`
4. Leuven — `leuven`
5. Liège — `liege`
6. Louvain-la-Neuve — `louvain-la-neuve`
7. Namur — `namur`

Current geography quality:

- active: `7/7`
- canonical slugs: `7/7`
- coordinates present: `0/7`
- region code present: `0/7`
- `scope_kind` present: `0/7`
- geography aliases: `0`

These existing UUIDs are reusable. Phase 2 should normalize selected Tier A rows in place and create new geography rows only when a deliberately selected study destination has no canonical geography.

### Institutions

Production contains 8 active canonical Belgium universities:

- KU Leuven
- Université catholique de Louvain
- Université de Liège
- Université de Namur
- Université libre de Bruxelles
- Universiteit Antwerpen
- Universiteit Gent
- Vrije Universiteit Brussel

Quality:

- active: `8/8`
- canonical slug: `8/8`
- official HTTPS website: `8/8`
- current identity system: `BE_OFFICIAL_UNIVERSITY_NAME`

This is a useful university foundation but is not a complete Belgian higher-education provider universe.

Material omissions include additional universities and, more importantly for city coverage, universities of applied sciences / university colleges and schools of arts. Brussels alone reports five universities and roughly 25 higher-education institutions, while Study in Flanders and Wallonie-Bruxelles Campus both expose broader provider universes than the current canonical eight.

### Campus/location rows

Production contains exactly 8 active Belgium institution-location rows, one per canonical institution.

Quality:

- geography link: `8/8`
- locality geography link: `8/8`
- source URL: `8/8`
- precise coordinates: `0/8`
- `campus_inventory_complete=false`: `8/8`
- `programme_assignment_verified=false`: `8/8`

All eight rows are named `Primary university location` and were created as a fast-path institution/location foundation. They are valid initial institution-location evidence but are explicitly not a complete teaching-campus inventory.

### Programmes and offerings

Production contains:

- active canonical Belgium programmes: `188`
- verified Belgium programme offerings: `188`
- offerings with source URL: `188/188`
- offerings linked to a campus row: `188/188`
- offerings whose linked campus has `programme_assignment_verified=true`: `0/188`
- qualification-level links populated: `0/188`
- canonical field codes populated: `0/188`

All 188 offerings use source system `BE_OFFICIAL` and are verified as programme offerings, but their primary-city campus assignment remains explicitly unverified.

Therefore the current 188 offerings must not be converted directly into city programme counts.

### Country-level evidence

`public.report_metric_evidence_country` contains 8 reviewed Belgium evidence rows:

- `average_annual_salary`
- `full_time_annual_earnings_range`
- `national_minimum_hourly_wage`
- `student_living_cost_monthly_range`
- `student_work_hours_limit`
- `tuition_annual_high`
- `tuition_annual_low`
- `visa_application_fee`

These remain country-level evidence and are not city-specific observations.

### City metric and publication layers

Current Belgium city state:

- verified city metric rows: `0`
- Belgium city publication/read-model views: `0`
- geography aliases: `0`

Phase 0 introduces none.

## Reusable foundation

The following can be reused safely:

1. canonical country `BE` and `EUR` currency;
2. existing `/be` country hub as a separate country-level surface;
3. seven existing Belgium geography UUIDs and slugs;
4. eight canonical university identities and official-source evidence;
5. eight current primary institution-location rows as initial location anchors only;
6. 188 canonical programme identities and verified programme-offering source evidence;
7. eight verified country-level evidence rows;
8. Statbel, Flemish Education / Study in Flanders, ARES / Wallonie-Bruxelles Campus and official institution sites as the authority families for later phases.

## Data that must not be treated as publication-complete

Do not treat the following as complete city data:

1. the current seven geography rows, because official administrative codes, coordinates, region codes and scope semantics are absent;
2. the current Brussels row as the City of Brussels municipality without resolving the Brussels-Capital Region study-destination boundary;
3. the current Louvain-la-Neuve row as a standalone municipality;
4. the eight `Primary university location` rows as a complete campus inventory;
5. the current eight universities as the complete Belgium provider universe;
6. the 188 programme-to-primary-location links as verified city delivery;
7. country-level work, tuition or living-cost evidence as city-specific metrics.

## Phase 0 blockers and remediation

### Blocker 1: geography scope is incomplete

Current state: `7/7` rows lack `scope_kind`, region codes and coordinates.

Remediation: Phase 2 must attach official geography identity and explicit public/population scope while preserving valid existing UUIDs.

### Blocker 2: Brussels needs region-level treatment

Current state: generic `Brussels` city row.

Remediation: document and normalize the Brussels-Capital Region as the public study-destination geography, rather than silently using one of its 19 municipalities.

### Blocker 3: Louvain-la-Neuve is not a municipality

Current state: route-friendly city geography exists, but administrative population scope is unresolved.

Remediation: bind population and administrative metrics to Ottignies-Louvain-la-Neuve municipality or another explicitly justified supported scope while retaining the public destination label.

### Blocker 4: provider coverage is university-only and incomplete

Current state: 8 canonical universities.

Remediation: Phase 3 should add missing higher-education providers where their omission would materially misrepresent a Tier A city, or explicitly disclose the bounded university-first coverage.

### Blocker 5: campus inventory is incomplete

Current state: 8 primary-location anchors with `campus_inventory_complete=false`.

Remediation: Phase 3 must verify real teaching locations using official institution evidence before institution/campus counts are presented as a verified set.

### Blocker 6: programme city delivery is unverified

Current state: 188 verified offerings but `0/188` linked campus assignments marked verified.

Remediation: keep `programme_coverage_status = verification_pending` until explicit programme-to-teaching-location evidence is established. Programme existence must never be used as city delivery proof.

### Blocker 7: no city metric/read-model layer

Current state: 0 Belgium city metrics and 0 Belgium city read-model views.

Remediation: build these only after Tier A geography and linkage contracts are fixed.

## Readiness gates

Belgium may proceed to Phase 1 if these rules remain fixed:

1. selection is national and bilingual, not limited to the current university seed;
2. Brussels is treated as a Brussels-Capital Region study destination;
3. Louvain-la-Neuve retains a user-facing destination identity while administrative population scope remains explicit;
4. Phase 2 preserves existing UUIDs where possible and adds official geography identity;
5. Phase 3 verifies teaching locations and addresses material university-college / applied-sciences gaps;
6. programme delivery is never inferred from a primary institution location;
7. national work and visa rules remain contextual rather than city-ranking signals.

## Primary external sources

- Study in Flanders: https://www.studyinflanders.be/
- Study in Flanders programmes: https://www.studyinflanders.be/programmes
- Wallonie-Bruxelles Campus: https://www.studyinbelgium.be/en
- ARES: https://www.ares-ac.be/
- Brussels-Capital Region higher education: https://be.brussels/en/education-teaching/education-belgium/higher-and-university-education
- Brussels student housing / higher-education population context: https://be.brussels/en/housing/rental/rent-allowance/student-housing
- Statbel population: https://statbel.fgov.be/en/themes/population/structure-population
- KU Leuven student numbers: https://www.kuleuven.be/prodstudinfo/v2/50000050/aant_det_en_v2.html
- UCLouvain figures: https://www.uclouvain.be/fr/universite/chiffres
- University of Liège key figures: https://www.uliege.be/cms/c_11478577/en/key-figures-2025-2026

## Phase 0 result

Belgium Phase 0 is complete.

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

Production mutation: `NONE`

Route/publication change: `NONE`
