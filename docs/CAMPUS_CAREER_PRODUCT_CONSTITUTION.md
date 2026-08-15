# CampCareer Campus × Career Product Constitution v1

Status: Canonical product architecture for the next CampCareer product phase  
Effective date: 2026-08-15  
Base: current `main`, preserving `docs/CAMPCAREER_SCORE_CONTRACT.md`

This document defines how CampCareer is organised for users and which product decisions are fixed before implementation.

When older product documents describe Career as the only top-level product surface, this constitution supersedes that top-level information architecture. It does **not** change the CampCareer Score formula or the internal order of the Career detail page.

---

## 1. Product identity

CampCareer has two first-class decision modes:

1. **Campus** — decide where and what education is worth paying for.
2. **Career** — decide which career is worth pursuing.

Shared product promise:

> Find education worth paying for. Find careers worth pursuing.

The two modes are not separate websites. They share one data graph:

`Career ↔ Programme ↔ Institution / Provider ↔ Location ↔ Jobs`

A user may enter from either side and move naturally to the other.

---

## 2. Top-level navigation

V1 primary navigation:

`Campus | Career | Compare | Blog | Profile`

Rules:

- Campus and Career are equally visible first-class modes.
- Compare is a shared decision tool and remains visible in the main navigation.
- Map is initially a contextual result view, not a separate top-level app.
- Do not introduce a Google-style app launcher in v1. CampCareer does not yet have enough independent applications to justify hiding core decision tools behind an app grid.
- Save remains contextual/account-dependent rather than a primary navigation destination.

---

## 3. Home

The landing page keeps one simple promise and one search module.

Hero:

> Explore. Compare. Find your future.

Below the hero is a two-mode selector:

### Campus

`Country | Major / Field | Search`

### Career

`Country | Career | Search`

Rules:

- Do not explain the whole product on the landing page.
- Do not add dashboard-style feature grids.
- Preview cards may change with the selected mode.
- Campus previews show programme/provider value examples.
- Career previews show CampCareer Score examples.

---

## 4. Campus search and result contract

### User question

> Where should I study this field, and which option gives me the best value?

### Search inputs

Required:

- Country
- Major / field of study

Optional result filters may include:

- qualification level
- institution/provider type
- state / region / city
- tuition range
- English requirement
- delivery mode
- intake / application state

### Result entity

The scoreable Campus result is **not a university in isolation**.

The canonical decision unit is:

`Programme / Qualification × Institution / Provider × Country × Student market`

Location may further differentiate an offering where cost, delivery or eligibility differs.

The UI may visually group results under an institution/provider, but a numeric Campus ROI Score must remain attached to a specific comparable programme/qualification context.

Do not publish a generic institution-wide ROI score such as `University X ROI 87`.

### Default result information

Where evidence is available, a Campus result may show:

- Campus ROI Score
- institution/provider name
- programme/qualification name
- qualification level
- location
- tuition / estimated total tuition
- graduate earnings outcome
- graduate employment outcome
- duration
- English requirement
- application/intake state
- external ranking field when legally licensed
- evidence confidence / freshness

### Sorting

V1 supported product contract:

- Best ROI / value
- Lowest tuition
- Highest graduate earnings
- Highest graduate employment
- Shortest duration
- Lowest English requirement, where a comparable numeric requirement exists

Ranking datasets such as QS are a separate sort/filter dimension and are **never part of the Campus ROI Score**.

External proprietary rankings may be enabled only when CampCareer has a licence or other permission that covers the intended public/commercial display. Schema support can exist before display is enabled.

---

## 5. Campus detail contract

A Campus result leads to programme-level decision detail while preserving institution/provider context.

The page answers, in order:

1. What is this programme and who provides it?
2. Is it a strong value option within its comparable cohort?
3. Why did the Campus ROI Score receive this value?
4. What does it cost and how long does it take?
5. What graduate outcomes support the estimate?
6. What are the English, academic, registration or licensing-related requirements?
7. Which careers does this programme commonly lead toward?
8. Where is it delivered?
9. What should the user compare next?

The institution/provider name may link separately to an institution overview page containing institutional facts and its available CampCareer programme results.

---

## 6. Career search and explorer contract

### User question

> Which careers are worth pursuing in this country, and how does my chosen career compare with related options?

### Search inputs

Required:

- Country
- Career

The selected career must remain visible even when related careers rank above it.

### Result entity

The canonical decision unit is:

`Career × Country × Evidence snapshot`

### Related-career explorer

After search, show the selected career together with a curated set of related careers.

Related careers must come from an explicit taxonomy or reviewed relationship graph. Do not create similarity purely from title keywords.

### Default result information

- career title
- CampCareer Score
- verdict
- Demand
- Pay
- Entry
- evidence confidence
- selected-country salary evidence
- optional verified live-jobs signal when available

### Sorting

V1 supported product contract:

- Best overall — CampCareer Score
- Highest pay
- Highest demand
- Easiest entry

A `Most jobs` sort may be enabled only when comparable and sufficiently fresh job-volume evidence exists across the result cohort.

---

## 7. Career detail contract

The existing canonical Career detail flow is preserved:

`Career → CampCareer Score → Evidence → Path → Study / Programs → Jobs → Secondary actions`

`docs/CAMPCAREER_SCORE_CONTRACT.md` remains authoritative for Career scoring.

This constitution does not change:

- Demand / Pay / Entry as the only three public score dimensions
- 40 / 30 / 30 weighting
- verdict bands
- evidence-confidence separation
- Score-not-ready behaviour
- exclusion of visa from the public score

The Study / Programs section should increasingly link into Campus-ranked education options when comparable Campus evidence is ready.

---

## 8. Campus ↔ Career connection contract

Campus and Career must never become two isolated catalogues.

### Career to Campus

Example:

`Registered Nurse → Path → Nursing education options → Campus ROI → Compare → Programme`

### Campus to Career

Example:

`Bachelor of Nursing → Leads toward Registered Nurse → CampCareer Score → Career detail → Jobs`

Relationship types should distinguish at least:

- direct / required pathway
- common pathway
- related / optional pathway
- progression pathway

A programme must not be represented as qualifying a user for a regulated career merely because the subject title looks related.

---

## 9. Compare contract

Compare is a shared core capability, not a hidden utility.

### Entry points

- Compare in primary navigation
- Compare control on every eligible Campus result card
- Compare control on every eligible Career result card
- sticky comparison tray after the user selects items

### V1 selection limit

Use a maximum of **3 items** per comparison to preserve readability and reuse the strongest existing comparison interaction patterns.

### Campus Compare

Compare like-for-like programme/provider options using fields such as:

- Campus ROI Score
- total tuition
- graduate earnings
- employment
- duration
- English requirement
- location
- intake/application state
- evidence confidence

### Career Compare

Compare careers using:

- CampCareer Score
- Demand
- Pay
- Entry
- salary
- training/qualification burden
- evidence confidence
- verified job-market actions

Do not compare Campus and Career entities in the same table.

---

## 10. Map contract

Map is a **view of decision data**, not an independent product in v1.

### Campus v1

Campus result pages support:

`List | Map`

Map pins must represent verified delivery locations or campuses. Institution headquarters must not be substituted for a programme delivery location without evidence.

Selecting a pin should surface the same programme/provider decision information available in list results.

### Career

Career regional maps are deferred until comparable regional career evidence is ready. Do not colour a national map from incomplete or non-comparable state signals merely to create a visual feature.

A standalone `/maps` product can be reconsidered only when multiple mature map experiences justify it.

---

## 11. Campus ROI and rankings separation

CampCareer must keep these concepts separate:

- **Campus ROI Score** — CampCareer's evidence-based education-value judgment within a comparable cohort.
- **External ranking** — a third party's institutional or subject ranking.
- **Tuition** — a direct cost fact.
- **English requirement** — an eligibility/filter fact.

No external ranking is allowed to influence the Campus ROI Score in v1.

No English requirement is allowed to improve or reduce the Campus ROI Score in v1.

These dimensions exist so users can make their own trade-offs after seeing CampCareer's value judgment.

---

## 12. Evidence and readiness philosophy

The Career product already uses a strict readiness rule. Campus adopts the same product philosophy:

> Complex evidence underneath; simple decision language on top.

Rules:

- never fill missing evidence with arbitrary averages
- distinguish direct, estimated and limited evidence
- disclose proxy granularity
- do not rank entities when the available outcome evidence cannot differentiate them fairly
- freshness and provenance are product data, not internal metadata only
- unavailable score is better than false precision

Detailed Campus scoring/readiness rules live in `docs/CAMPUS_ROI_SCORE_CONTRACT.md`.

---

## 13. SEO and canonical ownership

### Career

Canonical Career details remain owned by:

`/career/{country}/{career}`

Career explorer/search state should not create competing canonical pages for every filter combination.

### Campus

High-quality country × field cohorts may own indexable discovery pages, conceptually:

`/campus/{country}/{field}`

Only cohorts that pass the Campus publication/readiness gate should be indexable.

Programme and institution detail should reuse canonical programme/institution surfaces rather than create duplicate content under multiple product namespaces.

### Blog

Blog remains the acquisition layer for long-tail questions and should hand users into Campus or Career decision surfaces.

---

## 14. Product release order

The first-country pilot is Australia.

First three end-to-end test verticals:

1. Nursing ↔ Registered Nurse
2. Electrotechnology / electrician training ↔ Electrician
3. Computing / IT ↔ Software Developer

These are intentionally different:

- Nursing tests a regulated profession with higher education and professional programme approval.
- Electrician tests VET, apprenticeship and licensing rather than university-first assumptions.
- Software Developer tests a non-statutory profession with broad higher-education supply and weaker shortage evidence.

Do not expand to dozens of careers or every Australian field before these three flows expose and resolve the core data-model problems.

---

## 15. Change control

The following require an explicit new product decision rather than incremental implementation drift:

- removing Campus or Career as a first-class mode
- returning to institution-wide ROI scores
- changing the public Career Score contract
- adding QS or another proprietary ranking into the Campus ROI formula
- turning English requirements into a score penalty or bonus
- publishing Campus scores without comparable programme-level cohort context
- making Map a primary product before its data is ready
- hiding Compare behind an app launcher
- allowing unreviewed programme↔career title matching to imply professional qualification
- returning to a country-first strategy where every occupation/programme is populated before any end-to-end user flow ships
