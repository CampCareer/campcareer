# Germany city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/de-cities-readiness-v1`

Base main: `cf9913d7eee78c73d5d4cf01fdeff6b3b6722a7f`

Audit date: 2026-08-10

## Purpose

Establish the authoritative geography, higher-education, programme and international-student evidence contract required before selecting the first public Germany `/cities` cohort.

Phase 0 does not publish German city routes, create city read models, change production geography rows or infer programme delivery from institution presence.

## Product identity

Current CampCareer registry values:

- country code: `DE`
- country slug: `germany`
- country name: `Germany`
- currency: `EUR`
- current launch-country publication stage: `PROFILE_READY`
- mapReady: `true`
- intended city route contract: `/cities/de/{city-slug}`

Germany is already a published country profile. City publication remains a separate bounded release decision.

## Authoritative geography contract

The primary national geography authority is the German Federal Statistical Office (Destatis) and the statistical offices of the Länder through the Gemeindeverzeichnis-Informationssystem (GV-ISys).

GV-ISys provides each politically independent municipality with, among other fields:

- Amtlicher Regionalschlüssel (ARS);
- Amtlicher Gemeindeschlüssel (AGS);
- municipality/city name;
- population;
- area;
- settlement and urbanisation classifications.

Primary source:

https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html

At the time of this audit the current quarterly municipality file is dated 30 June 2026 and the monthly administrative update is dated 31 July 2026.

### Germany v1 city-scope rule

Use the politically independent municipality / city proper as the first canonical metric geography unless a future city explicitly requires a different official scope.

Do not silently substitute:

- metropolitan regions;
- surrounding Landkreis population;
- commuting regions;
- university marketing regions;
- neighbouring municipalities containing satellite campuses.

A campus outside a selected municipality must retain its own locality even when the institution uses the selected city in its brand or main-address identity.

Phase 2 must attach official state/region metadata and stable official geography identifiers without replacing existing CampCareer UUIDs.

## Higher-education authority

The German Rectors' Conference (HRK) Higher Education Compass (`Hochschulkompass`) is the primary national source for recognised German higher-education institutions and current degree-programme discovery.

HRK states that the Higher Education Compass contains public and state-recognised German higher-education institutions and that institution/programme information is entered and updated by the institutions themselves.

Sources:

https://www.hochschulkompass.de/en/higher-education-institutions.html

https://www.hochschulkompass.de/en/about-us.html

https://www.hochschulkompass.de/en/degree-programmes.html

Use HRK for:

- recognised institution identity;
- institution type and current recognition;
- current programme discovery;
- institution location discovery where exposed.

Use institution official websites for:

- exact campus names and addresses;
- teaching-campus versus research/support-location classification;
- programme delivery location;
- intake, duration and delivery mode.

Institution presence in a city never proves that every programme is delivered in that city.

## International-programme discovery

DAAD International Programmes is an authoritative discovery source for internationally oriented programmes and supports location-based search.

Source:

https://www2.daad.de/deutschland/studienangebote/international-programmes/en/result/

DAAD programme presence is a useful international-study signal, but it is not by itself proof of a canonical CampCareer programme offering at a specific campus. Programme publication still requires an explicit institution/programme source chain and, for city-facing delivery claims, a verified location relationship.

## Existing Excellence University foundation

The current Germany institution/location seed was built from the 2026 Excellence Strategy evaluation rather than from a complete national university/city inventory.

The DFG and German Council of Science and Humanities announced in March 2026 that the current Excellence funding locations continuing from 2027 include RWTH Aachen, University of Bonn, the Berlin University Alliance, TU Dresden, University of Hamburg, Heidelberg University, KIT Karlsruhe, LMU Munich, TU Munich and University of Tübingen.

Source:

https://www.dfg.de/en/service/press/press-releases/2026/press-release-no-04

The Berlin University Alliance represents FU Berlin, HU Berlin and TU Berlin in the CampCareer institution foundation. Munich contains LMU and TUM.

This is a strong quality-backed starting cohort, but Excellence status must not be used as a claim that these are Germany's only or universally best study destinations.

## International-student national context

Current German government/DAAD communication reports approximately 420,000 international students and doctoral candidates enrolled at German universities in winter semester 2025/26, around 4% more than the previous year.

Government information source:

https://www.make-it-in-germany.com/en/service/newsletter-nr-2-/-2026

This establishes Germany as a major international-study destination. It does not provide a city-level ranking and therefore must not be used to rank the initial city cohort by itself.

## Student work-rights baseline

The current federal student-work rule for third-country students allows up to 140 full days or 280 half-days of work per year without Federal Employment Agency approval, or alternatively up to 20 hours per week during lecture periods. Student auxiliary academic work is treated separately under the current rules.

Primary government source:

https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work

Phase 4 must represent this as a qualified national rule, not a city differentiator or unconditional work entitlement.

## Cost and tuition baseline

DAAD states that Germany generally does not charge tuition for Bachelor's and most Master's programmes at state higher-education institutions, but material exceptions exist. In particular, Baden-Württemberg charges many non-EU international students EUR 1,500 per semester, and Bavarian institutions may set tuition for non-EU/EEA international students.

DAAD also reports general living-cost guidance of approximately EUR 900–1,200 per month and semester contributions that vary by institution.

Source:

https://www.daad.de/en/studying-in-germany/living-in-germany/finances/

Implications for future city metrics:

- do not publish one national tuition amount as a city metric;
- keep Baden-Württemberg and Bavaria tuition exceptions visible where relevant;
- obtain city-specific housing/living references from source-native student-services or official local sources;
- obtain transport references from the applicable local/regional transport authority and preserve student eligibility conditions.

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-10.

### Existing Germany geographies

There are nine active `core.geographies` rows with `country_code = DE`:

1. Aachen — `aachen`
2. Berlin — `berlin`
3. Bonn — `bonn`
4. Dresden — `dresden`
5. Hamburg — `hamburg`
6. Heidelberg — `heidelberg`
7. Karlsruhe — `karlsruhe`
8. Munich — `munich`
9. Tübingen — `tuebingen`

All nine currently have:

- `geography_type = city`;
- `status = active`;
- stable canonical slugs;
- `scope_kind = null`;
- `region_code = null`.

Germany geography aliases: `0`.

These rows are an Excellence-University-derived study-location seed, not a complete inventory of German university cities.

### Institution foundation

Current Germany institution read-model counts:

- `institution_identity_de_v1`: `12`
- `institution_location_de_v1`: `12`
- `institution_explorer_de_v1`: `12`
- `institution_detail_de_v1`: `12`

The 12 identities are:

- Freie Universität Berlin;
- Humboldt-Universität zu Berlin;
- Technische Universität Berlin;
- Ludwig-Maximilians-Universität München;
- Technical University of Munich;
- RWTH Aachen University;
- University of Bonn;
- Technische Universität Dresden;
- Universität Hamburg;
- Heidelberg University;
- Karlsruhe Institute of Technology;
- University of Tübingen.

Current location rows are city-level verification records with:

- `location_quality = verified_official_city`;
- `record_scope = tier_a_institution_city`;
- city slug present;
- official institution URL present;
- DFG source URL present;
- no precise address in the current read model;
- no postal code in the current read model.

These rows establish institution-city presence but are not complete teaching-campus inventories.

### Programme foundation

Current Germany programme state:

- `program_catalog_de_staging`: `72`
- `program_international_de_staging`: `72`
- `program_occupation_de_staging`: `62`
- `program_explorer_de_v1`: `72`
- `program_detail_de_v1`: `72`

All 72 current programme explorer rows are marked international-student eligible in the existing Germany programme foundation.

Current programme distribution by reported city:

- Berlin: `18` programmes across `3` institutions;
- Munich: `12` programmes across `2` institutions;
- Aachen: `6`;
- Bonn: `6`;
- Dresden: `6`;
- Hamburg: `6`;
- Heidelberg: `6`;
- Karlsruhe: `6`;
- Tübingen: `6`.

This is materially stronger than the initial programme coverage available when several earlier Cities countries began rollout.

However, current programme `city` values reflect the institution-city foundation and must not automatically be treated as verified campus-delivery locations. Phase 3 must verify the location chain before city-facing programme counts are considered canonical.

## Multi-campus risk

Germany has material multi-campus and cross-municipality delivery risk.

Examples requiring Phase 3 verification include:

- Technical University of Munich has major teaching/research locations beyond Munich municipality, including Garching and other locations;
- Karlsruhe Institute of Technology operates locations whose administrative municipality may differ from a simple Karlsruhe city label;
- large Berlin institutions have multiple campuses within Berlin and programme delivery must still be tied to an explicit campus/location when city programme counts are published.

The correct city publication chain is:

`city -> verified teaching campus/location -> institution -> explicit programme offering`

Do not infer programme delivery from the existing institution-level city record.

## Missing-city bias

Because the current Germany foundation was derived from the Excellence cohort, major legitimate study destinations such as Frankfurt am Main, Cologne, Leipzig, Münster, Stuttgart, Freiburg and others are not represented in the nine-row geography seed.

Their absence means `not yet in the bounded CampCareer city foundation`; it must never be interpreted as low quality, low student demand or no international programmes.

Phase 1 may create a bounded first cohort from the supported nine-city foundation, but must record these omitted cities as future discovery candidates.

## Current application audit

No Germany-specific Cities publication stack currently exists:

- no `city_directory_de_v1` read model;
- no Germany city institution/programme directory views;
- no dedicated Germany city route implementation;
- no Germany city Compare allowlist.

The existing `/cities/[country]/[city]` generic route must not be treated as proof that Germany city pages are publication-ready.

## Supabase platform check

Supabase's April 2026 breaking-change notice states that new `public` schema tables will no longer be automatically exposed to the Data/GraphQL APIs. The behavior becomes enforced for existing projects on 30 October 2026.

Source:

https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically

Future Germany city tables/views must therefore use explicit privileges and the repository's established server-only/security-invoker patterns rather than relying on implicit public-schema exposure.

## Reusable data

The following can be reused safely in later Germany city phases:

1. country code `DE`, slug `germany` and EUR currency contract;
2. the nine stable existing Germany geography UUIDs and slugs;
3. the 12 canonical Excellence-cohort institution identities;
4. current official institution domains;
5. the 72-program Germany programme foundation as programme-discovery input;
6. HRK/Hochschulkompass as the recognised institution/programme authority;
7. Destatis GV-ISys as the municipality/geography authority;
8. DFG Excellence evidence as provenance for the current institution seed;
9. current Germany programme explorer/detail surfaces for programme identity and international-study context.

## Data that must not be treated as complete

Do not treat the following as publication-complete city data:

1. the nine existing city rows — they are an Excellence-location seed, not Germany's complete study-city universe;
2. the 12 current location rows — they are verified institution-city records, not complete teaching-campus inventories;
3. a programme's current institution city field — it is not sufficient proof of delivery at a specific campus;
4. the absence of Frankfurt, Cologne or other cities — it is a coverage gap, not a negative study-destination judgment;
5. national living-cost or tuition guidance — it is not a city-specific metric;
6. DFG Excellence status — it is not a city ranking.

## Phase 0 blockers / remediation

### Blocker 1 — geography metadata is incomplete

Current state: all nine existing Germany city rows have null `scope_kind` and `region_code`, with no aliases.

Remediation:

- Phase 2 must normalize each selected city to its exact Destatis municipality scope;
- attach the relevant Bundesland/region code;
- preserve stable UUIDs and current slugs;
- add deterministic aliases only where required.

### Blocker 2 — campus inventory is incomplete

Current state: 12 institution-city location rows, but no complete teaching-campus inventory.

Remediation:

- Phase 3 must inspect each selected institution's official campus/location pages;
- classify teaching campuses separately from research, administrative and satellite facilities;
- preserve municipality boundaries when a campus lies outside the named city.

### Blocker 3 — programme location evidence is not yet canonical

Current state: 72 programme rows have institution/city context, but the city field does not independently prove campus delivery.

Remediation:

- verify programme-to-campus delivery where the official source exposes it;
- count city programmes only when the chain is explicit;
- otherwise retain the programme for institution/country discovery while marking city delivery as verification pending.

### Blocker 4 — current city seed is Excellence-biased

Current state: nine cities derive from the current Excellence-university institution foundation.

Remediation:

- Phase 1 must describe the first cohort as a bounded supported v1, not a national ranking;
- record major unseeded university cities as expansion candidates;
- later expansion should use HRK/DAAD discovery rather than Excellence status as the inclusion gate.

### Blocker 5 — local metric sources are not yet normalized

Current state: no Germany city metric read model exists.

Remediation:

- Phase 4 should use Destatis/local official population values on one consistent municipality basis;
- use city/Studierendenwerk source-native living-cost references;
- use the applicable transport association/operator for student transport;
- keep the federal international-student work rule national;
- use official regional/local economic sources for career-context sectors without converting them into shortage guarantees.

## Phase 0 acceptance criteria

Phase 0 is complete when all are true:

- [x] fresh `main` baseline is recorded;
- [x] current Supabase Germany geography inventory is audited;
- [x] current Germany institution/location read models are audited;
- [x] current Germany programme foundation is audited;
- [x] official geography authority is defined;
- [x] official institution/programme source hierarchy is defined;
- [x] student-work and cost baselines are recorded;
- [x] Excellence-derived seed bias is explicitly documented;
- [x] multi-campus/programme-delivery risks are explicit;
- [x] no production DB mutation occurs in Phase 0;
- [x] no Germany city route is published in Phase 0.

## Handoff

Proceed to Phase 1 — Germany city scope selection — using the nine existing supported city geographies as the candidate foundation while explicitly considering national coverage bias and expansion candidates outside the current seed.
