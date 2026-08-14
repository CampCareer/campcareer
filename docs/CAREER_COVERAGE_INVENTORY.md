# Career Coverage Inventory

Snapshot date: 2026-08-14

This document is the operating inventory for expanding CampCareer from a reference Career Page into a country-by-country Career Score database plus action pathways.

The canonical unit is:

`country_code + career_id -> CampCareer Score -> Evidence -> Path -> Study / Programs -> Jobs`

This inventory covers the 20 launch countries x 80 canonical careers = 1,600 country-career combinations.

## Status definitions

### Ready

The country-career profile exists, the legacy inputs needed by CampCareer Score v1 have evidence for all required public inputs, and the profile is already marked `decision_ready`.

A Ready row can be used for a public Career Page and content production, subject to the normal source freshness checks.

### Needs one gap

Exactly one blocker remains before Ready.

A blocker may be one missing public-score input or the final publication review.

This is the highest-priority expansion queue because one targeted piece of work can make the row publishable.

### Profile ready

The country-career profile exists, but two or more blockers remain.

The current legacy `opportunity_score` or provisional component total must not be treated as a public CampCareer Score when one of the required v1 inputs is actually missing.

### Not ready

No canonical country-career profile exists yet.

## Audit blockers

The audit does not treat a stored zero as evidence by itself. It checks whether the score input is supported by a usable data point or explicit evidence basis.

Blocker keys:

- `pay`: no defensible pay measure for the canonical career scope.
- `shortage`: no defensible shortage/no-shortage evidence for the shortage input.
- `vacancy_intensity`: no defensible vacancy-intensity input.
- `employer_diversity`: no defensible employer-diversity evidence basis.
- `demand_trend`: no defensible vacancy/demand-trend input.
- `growth`: no defensible employment-growth input.
- `entry_access`: no defensible structured-entry/access evidence.
- `entry_burden`: no defensible burden/licensing/registration evidence.
- `publication_review`: evidence may exist, but the profile has not yet passed the final decision-ready review gate.

This is intentionally conservative and follows the public Score contract: missing evidence means `Score not ready yet`; missing evidence must never silently become a zero score.

## Country summary

| Country | Ready | Needs one gap | Profile ready | Not ready | Existing-profile avg blockers |
|---|---:|---:|---:|---:|---:|
| Australia | 8 | 3 | 69 | 0 | 3.1 |
| United Kingdom | 0 | 0 | 80 | 0 | 5.0 |
| Canada | 0 | 0 | 80 | 0 | 6.2 |
| United States | 0 | 0 | 64 | 16 | 4.1 |
| New Zealand | 0 | 0 | 47 | 33 | 5.0 |
| Ireland | 0 | 0 | 80 | 0 | 6.0 |
| Japan | 0 | 0 | 80 | 0 | 8.0 |
| South Korea | 0 | 0 | 80 | 0 | 8.0 |
| Singapore | 0 | 0 | 80 | 0 | 8.0 |
| Germany | 0 | 0 | 0 | 80 | — |
| Netherlands | 0 | 0 | 0 | 80 | — |
| Belgium | 0 | 0 | 0 | 80 | — |
| France | 0 | 0 | 0 | 80 | — |
| Spain | 0 | 0 | 0 | 80 | — |
| Norway | 0 | 0 | 0 | 80 | — |
| Sweden | 0 | 0 | 0 | 80 | — |
| Denmark | 0 | 0 | 0 | 80 | — |
| Finland | 0 | 0 | 0 | 80 | — |
| Switzerland | 0 | 0 | 0 | 80 | — |
| United Arab Emirates | 0 | 0 | 0 | 80 | — |

## Australia

### Ready — 8

- `care-worker` — Demand 9 · Pay 5 · Entry 9 → 78 · Strong
- `carpenter`
- `electrician`
- `midwife`
- `occupational-therapist`
- `physiotherapist`
- `registered-nurse`
- `welder` — Demand 8 · Pay 4 · Entry 7 → 65 · Strong

These are the current content-production pool.

`care-worker` and `welder` passed publication review on 2026-08-14. Care Worker was rechecked against the official JSA Aged and Disabled Carers profile and current CHC33021 Ageing/Disability training route. Welder was rechecked against the official JSA ANZSCO 3223 profile; the CampCareer roll-up matches the full 3223 group of Metal Fabricators, Pressure Welders and Welders (First Class). The score remains transparent about provisional demand-source provenance where applicable.

### Needs one gap — 3

Pay only:

- `medical-laboratory-technician`
- `pharmacist`
- `radiographer`

These remain blocked after review. JSA states that median weekly earnings are not produced for ANZSCO 6-digit occupations. The available 4-digit earnings groups are materially broader than each CampCareer canonical scope, so CampCareer will not substitute those group medians merely to make the score complete. Closing these rows requires a defensible, comparable Pay evidence policy or a new exact-scope source.

### Profile ready — 69

`pay + vacancy_intensity + publication_review` — 15:

`accountant`, `business-analyst`, `civil-engineer`, `cloud-engineer`, `cybersecurity-analyst`, `data-analyst`, `data-engineer`, `electrical-engineer`, `financial-analyst`, `manufacturing-engineer`, `marketing-specialist`, `network-administrator`, `project-manager`, `software-developer`, `supply-chain-analyst`

`pay + vacancy_intensity + employer_diversity + publication_review` — 13:

`chef`, `cook`, `counsellor`, `early-childhood-teacher`, `event-planner`, `hotel-manager`, `interior-designer`, `primary-school-teacher`, `restaurant-manager`, `secondary-school-teacher`, `tourism-manager`, `warehouse-manager`, `youth-worker`

`pay + employer_diversity + publication_review` — 12:

`aircraft-maintenance-technician`, `architect`, `automotive-service-technician`, `baker`, `commercial-pilot`, `deck-officer`, `film-editor`, `logistics-coordinator`, `marine-engineer`, `special-education-teacher`, `truck-driver`, `web-designer`

`pay + publication_review` — 10:

`auditor`, `chemical-engineer`, `database-administrator`, `engineering-technician`, `environmental-engineer`, `human-resources-specialist`, `ict-support-technician`, `industrial-engineer`, `mechanical-engineer`, `wall-floor-tiler`

`pay + vacancy_intensity + employer_diversity + entry_burden + publication_review` — 9:

`agronomist`, `animal-science-technician`, `animator`, `forestry-technician`, `graphic-designer`, `horticulturist`, `multimedia-designer`, `sustainability-specialist`, `ux-designer`

`vacancy_intensity + demand_trend + publication_review` — 4:

`bricklayer`, `construction-manager`, `hvac-technician`, `plumber`

`pay + vacancy_intensity + employer_diversity + demand_trend + growth + publication_review` — 2:

`community-worker`, `hospitality-supervisor`

`pay + employer_diversity + entry_burden + publication_review` — 2:

`environmental-scientist`, `food-technologist`

`pay + vacancy_intensity + employer_diversity + demand_trend + growth + entry_burden + publication_review` — 1:

`farm-manager`

`employer_diversity + publication_review` — 1:

`social-worker`

## United Kingdom

All 80 canonical careers have profiles but remain `Profile ready` under the strict CampCareer v1 audit.

`vacancy_intensity + employer_diversity + demand_trend + growth + publication_review` — 79 canonical careers.

`registered-nurse` additionally has a `pay` blocker because the canonical roll-up currently has no defensible weighted pay measure across the six included SOC nursing groups.

## Canada

All 80 canonical careers have profiles but remain `Profile ready`.

Main blocker families:

- 37 careers: `vacancy_intensity + employer_diversity + demand_trend + growth + entry_access + publication_review`
- 22 careers: same blockers plus `entry_burden`
- 11 careers: `vacancy_intensity + employer_diversity + demand_trend + growth + publication_review`
- 7 careers: same base blockers plus `entry_burden`
- `engineering-technician`, `special-education-teacher`: add `pay`
- `project-manager`: add both `pay` and `entry_burden`

Canada has relatively strong pay coverage, but the old provisional score model assigns zero to several missing demand inputs. These rows must not be published as final CampCareer Scores until those inputs are evidenced or the scoring evidence model is deliberately revised.

## United States

### Profile ready — 64

56 careers:

`vacancy_intensity + employer_diversity + demand_trend + publication_review`

8 design careers additionally have a `shortage` blocker:

- `animator`
- `architect`
- `film-editor`
- `graphic-designer`
- `interior-designer`
- `multimedia-designer`
- `ux-designer`
- `web-designer`

### Not ready — 16

- `aircraft-maintenance-technician`
- `automotive-service-technician`
- `baker`
- `chef`
- `commercial-pilot`
- `cook`
- `deck-officer`
- `event-planner`
- `hospitality-supervisor`
- `hotel-manager`
- `logistics-coordinator`
- `marine-engineer`
- `restaurant-manager`
- `tourism-manager`
- `truck-driver`
- `warehouse-manager`

## New Zealand

### Profile ready — 47

All 47 canonical profiles currently share:

`vacancy_intensity + employer_diversity + demand_trend + growth + publication_review`

### Not ready — 33

- `agronomist`
- `aircraft-maintenance-technician`
- `animal-science-technician`
- `animator`
- `architect`
- `automotive-service-technician`
- `baker`
- `chef`
- `commercial-pilot`
- `cook`
- `deck-officer`
- `environmental-scientist`
- `event-planner`
- `farm-manager`
- `film-editor`
- `food-technologist`
- `forestry-technician`
- `graphic-designer`
- `horticulturist`
- `hospitality-supervisor`
- `hotel-manager`
- `interior-designer`
- `logistics-coordinator`
- `marine-engineer`
- `medical-laboratory-technician`
- `multimedia-designer`
- `restaurant-manager`
- `sustainability-specialist`
- `tourism-manager`
- `truck-driver`
- `ux-designer`
- `warehouse-manager`
- `web-designer`

### Identifier drift

The live NZ data contains the non-canonical legacy ID `medical-lab-tech`.

The current canonical Career ID is `medical-laboratory-technician`.

`medical-lab-tech` is excluded from the 1,600-row inventory and must be migrated or remapped before NZ can claim full canonical coverage.

## Ireland

All 80 canonical careers are `Profile ready`.

77 careers:

`pay + vacancy_intensity + employer_diversity + demand_trend + growth + publication_review`

3 careers additionally have a `shortage` blocker:

- `bricklayer`
- `hvac-technician`
- `wall-floor-tiler`

## Japan

All 80 canonical careers are `Profile ready` with the same blocker family:

`pay + shortage + vacancy_intensity + employer_diversity + demand_trend + growth + entry_burden + publication_review`

The current legacy totals should not be presented as CampCareer Score v1.

## South Korea

72 careers:

`pay + shortage + vacancy_intensity + employer_diversity + demand_trend + growth + entry_burden + publication_review`

8 health careers use a different entry gap:

`pay + shortage + vacancy_intensity + employer_diversity + demand_trend + growth + entry_access + publication_review`

The 8 careers are:

`care-worker`, `medical-laboratory-technician`, `midwife`, `occupational-therapist`, `pharmacist`, `physiotherapist`, `radiographer`, `registered-nurse`

## Singapore

All 80 canonical careers are `Profile ready` with:

`pay + shortage + vacancy_intensity + employer_diversity + demand_trend + growth + entry_burden + publication_review`

The current legacy totals should not be presented as CampCareer Score v1.

## Countries with no canonical Career profiles yet

For each country below, all 80 canonical careers are `Not ready`:

- Germany
- Netherlands
- Belgium
- France
- Spain
- Norway
- Sweden
- Denmark
- Finland
- Switzerland
- United Arab Emirates

## Immediate operating queue

The expansion order should optimize for the smallest number of blockers before content publication.

1. Australia Ready 8: publish/use for content now.
2. Australia `medical-laboratory-technician`, `pharmacist`, `radiographer`: solve the exact-scope Pay evidence gap without substituting a broader 4-digit median by default.
3. Australia `social-worker`: employer-diversity evidence plus publication review.
4. Australia `auditor`, `chemical-engineer`, `database-administrator`, `engineering-technician`, `environmental-engineer`, `human-resources-specialist`, `ict-support-technician`, `industrial-engineer`, `mechanical-engineer`, `wall-floor-tiler`: Pay evidence plus publication review.
5. Then choose the next country based on evidence-system work, not raw profile count. UK/US/NZ have strong Pay coverage but still need several Demand inputs; Canada also needs Demand plus more Entry validation.

## Coverage KPI

The primary expansion KPI is not raw profile count.

Use:

`publish-ready country-career decisions / 1,600 launch combinations`

Current strict snapshot:

- Ready: 8 / 1,600
- Needs one gap: 3 / 1,600
- Profile ready: 660 / 1,600
- Not ready: 929 / 1,600

The purpose of the inventory is to move rows upward one state at a time while content production consumes the Ready queue immediately.
