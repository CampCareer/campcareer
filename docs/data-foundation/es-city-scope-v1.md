# Spain city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/es-cities-v1`

Base Phase 0 commit: `9a53604976def4675afe7860fd45cbc6038604b3`

Audit date: 2026-08-11

Checkpoint: `TIER_A_SCOPE_LOCKED`

## Purpose

Select the first public Spain `/cities` cohort and define the Phase 2 geography-normalisation guardrails without allowing the current rectorate/contact-location seed to dictate product scope.

Phase 1 does not mutate production geography rows, create teaching-campus records, publish city routes, create city read models, change SEO, or infer programme delivery.

## Decision

Spain Tier A v1 contains exactly seven public study destinations, in initial publication order:

1. `madrid`
2. `barcelona`
3. `valencia`
4. `sevilla`
5. `granada`
6. `malaga`
7. `bilbao`

Initial route contract:

- `/cities/es/madrid`
- `/cities/es/barcelona`
- `/cities/es/valencia`
- `/cities/es/sevilla`
- `/cities/es/granada`
- `/cities/es/malaga`
- `/cities/es/bilbao`

This is a bounded first CampCareer Spain destination cohort. The order is a publication sequence, **not** a national ranking of Spanish student cities.

## Selection methodology

Tier A v1 deliberately does not equate current database presence with destination importance.

A destination qualifies for v1 when the rollout can satisfy all of the following:

1. it is a recognisable multi-year higher-education destination with sufficient official-source depth;
2. an explicit public geography/population boundary can be established in Phase 2;
3. at least one material teaching-provider relationship can be verified in Phase 3, including provider expansion where the current ten-university foundation is incomplete;
4. later Five Core Metrics can be sourced without inventing cross-city comparability;
5. existing rectorate/locality evidence can be preserved without silently renaming it into the public destination;
6. autonomous-community differences can remain visible where relevant;
7. programme delivery can remain `verification_pending` until programme-to-teaching-location evidence exists.

National context comes from RUCT/QEDU/SIIU, while physical teaching locations must come from official university/campus evidence.

## Current foundation coverage at scope lock

| Destination | Current public-name geography | Current canonical institution anchor | Phase 1 implication |
| --- | --- | --- | --- |
| Madrid | `madrid` exists | Universidad Autónoma de Madrid; Universidad Complutense de Madrid | Reuse the existing Madrid UUID only after Phase 2 attaches official geography scope. |
| Barcelona | `barcelona` exists | Universitat de Barcelona; Universitat Politècnica de Catalunya; UAB is anchored separately in Cerdanyola del Vallès | Barcelona is Tier A, but `cerdanyola-del-valles` remains distinct locality evidence. |
| Valencia | no | none in current ten-university foundation | Tier A requires provider expansion in Phase 3; current DB absence is not an exclusion criterion. |
| Sevilla | `sevilla` exists | Universidad de Sevilla | Reuse only after explicit municipality/region scope is attached. |
| Granada | no | none in current ten-university foundation | Tier A requires provider expansion in Phase 3; official UGR campus evidence is already sufficient to justify the teaching-destination workstream. |
| Málaga | `malaga` exists | Universidad de Málaga | Reuse only after explicit municipality/region scope is attached. |
| Bilbao | no | EHU currently anchored at `leioa` | Create a separate Bilbao public destination; preserve Leioa as a physical locality and verify Bilbao/Leioa teaching locations independently. |

The following current production geography rows are **not** promoted to public Tier A routes by Phase 1:

- `cadiz`
- `ciudad-real`
- `cerdanyola-del-valles`
- `leioa`

They remain valid evidence for later locality/institution-linkage work.

## Tier A decisions

### Madrid

Decision: `TIER_A`

Public slug: `madrid`

Current production geography: exists and may be reused in Phase 2.

Current canonical anchors:

- Universidad Autónoma de Madrid
- Universidad Complutense de Madrid

Why selected:

- current CampCareer provider and programme foundations are already deep enough to support teaching-location verification;
- Madrid provides central-Spain and Comunidad de Madrid coverage;
- national and local official-source depth is sufficient for the later Five Core Metrics.

Phase 2 guardrail:

- public destination: Madrid;
- use an explicit INE municipality identity/population boundary;
- preserve the existing UUID only if its metadata is normalised in place rather than being treated as already publication-ready;
- do not infer all Madrid-region university activity from the two current institutions.

The current INE municipality-code relation identifies Madrid municipality as `28079`; Phase 2 must re-verify and store the exact source/effective date rather than relying on this Phase 1 note as the migration authority.

### Barcelona

Decision: `TIER_A`

Public slug: `barcelona`

Current production geography: `barcelona` exists; `cerdanyola-del-valles` also exists and must remain separate.

Current canonical anchors:

- Universitat de Barcelona
- Universitat Politècnica de Catalunya
- Universitat Autònoma de Barcelona, whose current rectorate/locality anchor is Cerdanyola del Vallès

Why selected:

- the current provider foundation already spans both Barcelona municipality and the adjacent UAB/Bellaterra locality;
- this makes Barcelona a strong destination but also exposes the exact geography problem Phase 2 must solve;
- Catalonia-specific institutional and transport context can be sourced explicitly rather than collapsed into a national average.

Phase 2 guardrail:

- public destination: Barcelona;
- preserve `cerdanyola-del-valles` as locality evidence and never alias it directly to Barcelona;
- Phase 2 must choose and document either a Barcelona-municipality population contract or a reproducible official supra-municipal contract;
- if municipality population is used, the UI must disclose that the study ecosystem is wider than the population boundary;
- no UAB programme may be counted as Barcelona delivery solely because Barcelona is the user-facing destination.

The current INE municipality-code relation identifies Barcelona municipality as `08019`; Phase 2 must re-verify and store the effective source.

### Valencia

Decision: `TIER_A`

Public slug: `valencia`

Current production geography: no public destination row.

Current canonical institution anchors: none in the existing ten-university foundation.

Why selected:

- the current provider foundation is intentionally incomplete and Phase 0 explicitly forbids using that incompleteness as a destination-ranking signal;
- Universitat de València's official campus documentation shows a teaching footprint across Valencia city and its metropolitan area, including Blasco Ibáñez, Tarongers and Burjassot-Paterna;
- the destination has enough official campus structure to justify provider expansion and a clean city/metro geography contract.

Phase 2 / Phase 3 guardrail:

- create a new `valencia` public destination geography;
- Phase 2 must define an INE municipality population contract unless a reproducible official metro boundary is deliberately selected;
- any Burjassot/Paterna teaching localities must remain distinct physical localities rather than aliases for Valencia;
- Phase 3 must add at least the material source-backed university providers required for a credible initial Valencia destination before publication readiness is claimed.

Official teaching-location source:

https://www.uv.es/uvweb/universitat/ca/universitat/estructura-organitzativa/campus/introduccio-1285853773596.html

### Sevilla

Decision: `TIER_A`

Public slug: `sevilla`

Current production geography: exists and may be reused in Phase 2.

Current canonical anchor:

- Universidad de Sevilla

Why selected:

- current canonical institution/programme evidence provides an immediate Phase 3 anchor;
- Sevilla provides a major Andalusian destination distinct from Granada and Málaga;
- later transport/living-cost evidence can remain city-specific while regional university context is kept under Andalucía.

Phase 2 guardrail:

- public destination: Sevilla;
- use explicit INE municipality identity and Andalucía region metadata;
- preserve the existing UUID only after its contact-location seed semantics are replaced by a documented public-destination scope contract.

The current INE municipality-code relation identifies Sevilla municipality as `41091`; Phase 2 must re-verify it as part of the migration evidence.

### Granada

Decision: `TIER_A`

Public slug: `granada`

Current production geography: no public destination row.

Current canonical institution anchors: none in the existing ten-university foundation.

Why selected:

- Universidad de Granada's official campus directory documents 25 teaching centres across seven campuses in Granada, Ceuta and Melilla, with five campuses in Granada city;
- UGR's own international/public university-city material identifies Granada as a deeply university-oriented destination;
- excluding Granada solely because the current CampCareer provider cohort omitted UGR would repeat the exact provider-coverage bias identified in Phase 0.

Phase 2 / Phase 3 guardrail:

- create a new `granada` public destination geography with an explicit INE municipality population contract;
- Phase 3 must add Universidad de Granada as a canonical source-backed provider before a credible Granada city institution surface is published;
- UGR's Ceuta and Melilla campuses remain outside Granada city delivery and must never be inherited into Granada through the institution brand.

Official teaching-location source:

https://www.ugr.es/universidad/campus

### Málaga

Decision: `TIER_A`

Public slug: `malaga`

Current production geography: exists and may be reused in Phase 2.

Current canonical anchor:

- Universidad de Málaga

Why selected:

- the current database already contains a source-backed university identity and official-contact locality;
- Málaga is a distinct Andalusian study destination rather than a substitute for Sevilla or Granada;
- its inclusion improves coastal/southern coverage without requiring a composite multi-city public label.

Phase 2 guardrail:

- public destination: Málaga;
- use an explicit INE municipality population contract and Andalucía region metadata;
- keep later teaching-campus verification separate from the current rectorate/contact row.

### Bilbao

Decision: `TIER_A`

Public slug: `bilbao`

Current production geography: no Bilbao public row; current EHU anchor is `leioa`.

Current canonical anchor:

- Euskal Herriko Unibertsitatea (EHU)

Why selected:

- EHU's official international guidance explicitly states that the Campus of Biscay is divided between Bilbao and Leioa and warns that they are physically distinct study locations;
- the current Leioa rectorate row therefore cannot serve as a silent synonym for Bilbao;
- Bilbao gives the v1 cohort Basque Country coverage while providing a strong test of locality-vs-destination discipline.

Phase 2 / Phase 3 guardrail:

- create a new `bilbao` public destination geography;
- preserve the existing `leioa` UUID as locality evidence;
- use a Bilbao municipality population contract unless a different official scope is explicitly justified in Phase 2;
- Phase 3 must verify Bilbao and Leioa teaching locations separately;
- a programme located only at Leioa must not be labelled Bilbao delivery merely because both belong to EHU's Campus of Biscay.

Official EHU location sources:

https://www.ehu.eus/en/web/nazioarteko-harremanak/en-help-centre-offices

https://www.ehu.eus/en/web/nazioarteko-harremanak/en-latin-america-others

## Autonomous-community coverage rationale

Tier A v1 deliberately spans several regulatory and student-market contexts:

- Comunidad de Madrid — Madrid
- Catalunya — Barcelona
- Comunitat Valenciana — Valencia
- Andalucía — Sevilla, Granada, Málaga
- Euskadi / País Vasco — Bilbao / Leioa teaching ecosystem

Andalusia has three destinations because they are separate mature study ecosystems with different provider/location structures; this is not a weighting claim that Andalusia is objectively more important than all omitted regions.

The first cohort is not nationally exhaustive. Northwest Spain, inland university cities beyond Madrid, the Balearic/Canary Islands and several other major regional systems remain explicit expansion work.

## Tier B / later candidates

Phase 1 records the following as later candidates rather than rejected cities:

- Salamanca
- Zaragoza
- Alicante
- Murcia
- Santiago de Compostela
- Pamplona
- Cádiz
- Córdoba
- Valladolid
- Oviedo / Gijón
- La Laguna / Santa Cruz de Tenerife
- Las Palmas de Gran Canaria
- UCLM multi-campus destinations beyond the current Ciudad Real rectorate anchor, including Toledo, Albacete and Cuenca

Additional candidates may be added only by a future documented scope revision. They must not leak into the v1 route allowlist automatically.

### Why Cádiz is not Tier A despite current DB presence

The existing `cadiz` row exists because Universidad de Cádiz's rectorate was normalised there. That is useful locality evidence, not a product-priority score. Cádiz remains a strong later candidate, but the first seven-city cohort already has three Andalusian destinations and Phase 3 needs material provider expansion in Valencia and Granada.

### Why Ciudad Real is not Tier A despite current DB presence

The current `ciudad-real` row represents the UCLM rectorate anchor. UCLM is a distributed multi-campus university, so promoting Ciudad Real automatically would encode an administrative-address bias. A later UCLM city rollout should evaluate Ciudad Real, Toledo, Albacete and Cuenca as separate teaching destinations using explicit campus/programme evidence.

### Why Cerdanyola del Vallès and Leioa are not public Tier A routes

They remain critical physical localities:

- Cerdanyola del Vallès / Bellaterra for UAB;
- Leioa for major EHU teaching facilities.

Phase 1 treats them as teaching-location/locality evidence inside wider destination decisions, not as aliases and not as discarded data.

## Phase 2 geography contract

Phase 2 must now normalise exactly the seven Tier A destinations and no others.

Required work:

1. reuse existing UUIDs only for Madrid, Barcelona, Sevilla and Málaga where the public identity remains appropriate;
2. create new public destination rows for Valencia, Granada and Bilbao;
3. preserve Cerdanyola del Vallès and Leioa as separate locality geographies;
4. preserve Cádiz and Ciudad Real without promoting them into the Tier A route allowlist;
5. add explicit `scope_kind` for every Tier A public destination;
6. add autonomous-community/region metadata and official codes where available;
7. attach an INE municipality code and population contract, or an explicitly justified official supra-municipal contract, to every Tier A public destination;
8. add aliases only when they refer to the same public geography — never use aliases to collapse neighbouring municipalities;
9. add contract tests for exact Tier A slugs, geography identity and public-vs-locality separation.

## Programme boundary

The existing 167 verified Spain programme offerings remain national programme evidence only.

Phase 1 does not assign any of them to Tier A destinations.

Until Phase 3 verifies programme-to-teaching-location relationships:

`programme_coverage_status = verification_pending`

No inherited offering count may be presented as a city programme count.

## Phase 1 result

Spain Phase 1 is complete.

Checkpoint: `TIER_A_SCOPE_LOCKED`

Exact Tier A count: `7`

Exact slugs:

`madrid`, `barcelona`, `valencia`, `sevilla`, `granada`, `malaga`, `bilbao`

Production mutation: `NONE`

Route/publication change: `NONE`

Next phase: Phase 2 geography normalization on the same branch.
