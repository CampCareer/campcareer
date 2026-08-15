# CampCareer Campus × Career Execution Roadmap

Status: Active execution plan  
Started: 2026-08-15

This roadmap converts the Campus × Career product direction into a fixed implementation order.

The rule is simple:

> Build a small complete decision loop, publish it, learn from it, then expand.

Do not return to a strategy where an entire country's occupation or programme inventory must be completed before users receive an end-to-end product.

---

## Phase 1 — Product constitution + research

Status: **IN PROGRESS / foundation committed on this branch**

Deliverables:

- Campus / Career responsibilities fixed
- Campus ROI Score v1 contract fixed
- Compare and Map placement fixed
- canonical entity and readiness rules fixed
- Australia source authority research
- live CampCareer data inventory
- first three pilot verticals selected
- reuse / rebuild boundaries identified

Branch:

`agent/campus-career-product-constitution`

Primary documents:

- `docs/CAMPUS_CAREER_PRODUCT_CONSTITUTION.md`
- `docs/CAMPUS_ROI_SCORE_CONTRACT.md`
- `docs/AUSTRALIA_CAMPUS_CAREER_PILOT_RESEARCH.md`

Exit gate:

- no unresolved product-definition contradiction that blocks data modelling
- first implementation target is explicitly identified

Next target after Phase 1:

> Australia Nursing Campus cohort + Registered Nurse connection

---

## Phase 2 — Australia data model / evidence pipeline

Status: NOT STARTED

Build the minimum data model required for field-aware Campus decisions.

Scope:

- canonical field-of-study taxonomy
- qualification cohort mapping
- student-market separation
- programme/provider/offering identity
- outcome evidence join contract
- Campus readiness state
- Campus score calculation layer
- legacy identifier compatibility

First implementation dataset:

`Australia × Nursing × Bachelor × International`

Do not create a generic multi-country abstraction before the Australian pilot works.

---

## Phase 3 — First three vertical research + evidence completion

Status: INITIAL RESEARCH COMPLETE; evidence completion NOT STARTED

Order:

1. Nursing ↔ Registered Nurse
2. Electrotechnology ↔ Electrician
3. Computing / IT ↔ Software Developer

Research and ingestion must be evidence-first rather than quantity-first.

---

## Phase 4 — Campus Explorer

Status: NOT STARTED

Build:

`Country + Major / Field → programme/provider results`

Required v1 capabilities:

- ROI/value sort
- tuition sort
- graduate earnings sort
- graduate employment sort
- duration sort
- relevant filters
- score-not-ready rows
- evidence confidence/freshness
- programme/provider detail navigation

Start with Australia Nursing only. Generalise after the first real cohort works.

---

## Phase 5 — Career Explorer

Status: NOT STARTED

Build:

`Country + Career → selected career + related careers`

Required v1 capabilities:

- selected career retained visibly
- CampCareer Score sort
- Pay sort
- Demand sort
- Entry sort
- reviewed related-career graph
- click-through to canonical Career detail

Preserve the #244 Career Score and Career Page contracts.

---

## Phase 6 — Campus ↔ Career connection

Status: NOT STARTED

First complete loop:

`Registered Nurse → Nursing programmes → Campus ROI → Programme → Registered Nurse → Jobs`

Requirements:

- canonical programme↔career relation types
- regulated-career approval verification
- no duplicate programme identity system
- clear direct/common/related/progression semantics

---

## Phase 7 — Compare

Status: NOT STARTED

Use one shared Compare product with separate entity types.

V1:

- card-level compare control
- sticky selection tray
- max 3 items
- Campus comparison table
- Career comparison table
- URL/shareable state where practical

Reuse existing comparison interaction assets where they fit the new contracts.

---

## Phase 8 — Campus Map

Status: NOT STARTED

Add:

`List | Map`

Map requirements:

- verified programme delivery locations only
- same decision data as list cards
- no inferred institution-headquarters substitute
- comparison/save actions remain available

Career regional map remains deferred until regional evidence is comparable enough.

---

## Phase 9 — Landing + navigation cutover

Status: NOT STARTED

Only after Campus and Career result flows are real:

- switch landing search to Campus / Career mode selector
- keep hero `Explore. Compare. Find your future.`
- primary nav: Campus | Career | Compare | Blog | Profile
- mode-specific preview cards
- remove or redirect old primary discovery entry points that conflict with the new architecture

Do not redesign the landing before the downstream journeys exist.

---

## Phase 10 — First content release

Status: NOT STARTED

Begin content as soon as the first three end-to-end verticals have useful destination pages.

Initial content families:

- Is this career worth it?
- Best-value degrees/programmes for this career
- Cheapest credible pathways
- salary vs education cost
- career comparisons
- how-to-enter / registration requirements

Every article should hand users into a canonical Campus or Career decision surface.

Content is an acquisition and demand-sensing layer, not a substitute for product completion.

---

## Phase 11 — Australia expansion

Status: NOT STARTED

Expand by proven demand and data readiness, not by alphabetical country/category completion.

Initial progression:

- 3 complete verticals
- then 5
- then 10
- then 20

Next candidates after the first three:

- Physiotherapy ↔ Physiotherapist
- Accounting ↔ Accountant

Use search demand, content performance, user behaviour and evidence availability to decide later additions.

---

## Phase 12 — UK replication

Status: NOT STARTED

Australia is the product/data-model proving ground.

The UK is the second-country test of whether the architecture survives a different education and labour-data system.

Goals:

- preserve Campus/Career product language
- swap country-specific source adapters
- test provider × subject outcome model
- validate score comparability and readiness rules
- avoid country-specific logic leaking into global product contracts

Only after the UK model works should CampCareer accelerate US, Canada and subsequent country expansion.

---

## Global execution rules

These apply to every phase:

1. Never manufacture a score to fill a UI slot.
2. Do not use old Opportunity Score totals publicly.
3. Do not revive historical ROI values without the new cohort/readiness contract.
4. Prefer canonical IDs and explicit compatibility mappings over new parallel identifier systems.
5. Build one complete vertical before scaling its ingestion pattern.
6. Keep evidence provenance and freshness visible.
7. External rankings remain independent of CampCareer scores.
8. Regulated-career pathways require explicit approval/licensing evidence.
9. Compare is part of decision flow; Map is initially a result view.
10. Ship content after useful product destinations exist, not after an entire country is 'complete'.
