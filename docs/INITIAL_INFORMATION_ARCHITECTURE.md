# CampCareer Initial Information Architecture

Status: **Canonical execution architecture for the initial CampCareer product**

Owner: CampCareer  
Effective date: 2026-08-14

This document translates the product doctrine into a concrete site structure. When an older workspace, navigation, onboarding, planner, map, country, study, or comparison strategy conflicts with this document, this document governs the initial product experience.

See also:
- [PRODUCT_DOCTRINE.md](./PRODUCT_DOCTRINE.md) — product purpose and scope
- [product-core.md](./product-core.md) — concise execution rules

---

## 1. Structural principle

> **Career is the parent context. Everything else supports the career decision.**

The initial CampCareer must not feel like a portal containing many equally important tools.

A user should not need to decide whether to start with Home, Map, Compare, Countries, Visas, Occupations, Programs, Institutions, Study, or a planner.

The product should make one path obvious:

`Discover a career → judge it → understand why → see how to enter it → act`

The core sequence is:

`Career Score → Verdict → Evidence → Pathway → Study / Programs → Jobs`

Country, city, visa, institution, map, comparison, and personalisation data appear only when they improve one of those steps.

---

## 2. Primary acquisition flows

### 2.1 Social or shared link

This is the preferred acquisition flow.

`TikTok / Instagram / YouTube / shared link`
→ `specific Career Page`
→ `Career Score + verdict`
→ `evidence`
→ `pathway`
→ `study / programs`
→ `jobs`
→ `external next action or optional Save`

The user must not be diverted through:
- a generic dashboard;
- mandatory onboarding;
- a passport-first questionnaire;
- a login wall;
- a tool chooser.

### 2.2 Search engine

`Search result`
→ `specific Career Page`
→ same core sequence

Search landing pages may exist for SEO, but they should route users toward a specific career rather than toward a generic workspace.

### 2.3 Direct homepage visit

`/`
→ `career discovery / search`
→ `specific Career Page`

The homepage is a lightweight discovery entry, not the product dashboard.

### 2.4 Returning signed-in user

`/home` or account entry
→ `saved / recently viewed careers`
→ `specific Career Page`

The returning-user home may help retention, but it must not become the main public product experience.

---

## 3. Canonical public sitemap

The logical public sitemap for the initial product is:

```text
/
├── careers
│   └── career discovery / search index
├── career
│   └── [country]
│       └── [occupation]
│           ├── Career Score + verdict
│           ├── evidence
│           ├── pathway / requirements
│           ├── study / programs
│           └── jobs
├── methodology
│   └── score methodology / evidence principles
├── blog
│   └── acquisition and educational content
├── login
├── profile
└── settings
```

### Route intent

- `/` — lightweight career discovery and brand entry.
- `/careers` — searchable/browsable career index. Useful, but not a competing product surface.
- `/career/[country]/[occupation]` — primary decision page and preferred deep-link target.
- `/methodology` — explain scoring and evidence trust.
- `/blog` — acquisition content that should feed users into Career Pages.
- `/login` — account access only when the user chooses an account action.
- `/profile` and `/settings` — account management, not discovery.

### URL note

The exact SEO migration and redirect plan is implemented later. The information architecture establishes the target concept now:

> **A specific country-context career page is the canonical actionable result.**

Example:

`/career/au/registered-nurse`

Locale prefixes may wrap this structure, for example:

`/ko/career/au/registered-nurse`

A future general occupation page such as `/career/registered-nurse` may exist only when it has a clear purpose such as country selection or cross-country overview. It must not replace the actionable country-context page with an ambiguous score.

---

## 4. Career Page internal architecture

A Career Page is the product, not one tool inside the product.

Its information order is fixed at the structural level:

### A. Verdict

Answer immediately:

> Is this career worth pursuing in this context?

Show:
- occupation name;
- country / market context;
- Career Score;
- short verdict;
- a small number of important component signals.

### B. Evidence

Answer:

> Why did CampCareer reach this verdict?

Show only decision-relevant evidence first. Deeper source detail is progressively disclosed.

Possible evidence includes:
- earnings;
- demand / vacancies;
- outlook;
- stability / growth;
- early-career access;
- entry difficulty;
- evidence confidence and freshness.

### C. Pathway

Answer:

> What do I need to enter this career?

Show:
- education / training requirements;
- registration / licensing;
- major prerequisites;
- material blockers;
- practical sequence and timing.

Visa or legal-work information appears here when it materially affects the pathway. It is not a competing top-level product.

### D. Study / Programs

Answer:

> Where can I study or train for this career?

Show:
- relevant study fields;
- selected programs / training pathways;
- selected institutions when useful;
- external next-action links.

This section does not try to expose the entire program database at once.

### E. Jobs

Answer:

> What real employment opportunities can I inspect next?

Show:
- relevant employment context;
- selected job opportunities or job-search destinations;
- external job-search links.

CampCareer does not need to become a full job board to provide this value.

### F. Secondary actions

Only after the core value is visible:
- Save;
- Compare;
- Share;
- personalise this result.

These actions must not compete with the score or the next practical action.

---

## 5. Global navigation

The initial public navigation should be deliberately small.

### Primary header

Recommended desktop hierarchy:

1. **CampCareer** — logo / home
2. **Search careers** — primary discovery affordance
3. **How scores work** — optional secondary link
4. **Sign in / Account** — utility action

No permanent top-level links for:
- Map;
- Compare;
- Countries;
- Cities;
- Visas;
- Programs;
- Institutions;
- Planner;
- Budget;
- Applications.

Those capabilities can continue to exist technically, but they are not presented as equal product choices.

### Mobile

Do not use a multi-destination bottom navigation for the initial public experience.

Prefer:
- compact header;
- career search access;
- contextual sticky action only when it helps the current Career Page.

The user should not be asked to switch between product modules while evaluating one career.

---

## 6. Existing route disposition

The goal is not immediate deletion. It is removal of cognitive competition.

| Existing surface | Initial product decision | Target role |
|---|---|---|
| `/` | **REBUILD / SIMPLIFY** | Career discovery entry, not a tool hub |
| `/career` query result | **MIGRATE** | Become stable specific Career Page routes |
| `/occupation` | **ABSORB / RENAME** | Career search/index; candidate migration to `/careers` |
| `/home` | **REPURPOSE** | Signed-in saved/recent careers only |
| `/dashboard` | **DEFER / REDIRECT** | No independent dashboard concept |
| `/compare` | **SECONDARY** | Contextual action from a Career Page |
| `/map` | **HIDE FROM PRIMARY NAV** | Advanced contextual map tool |
| `/maps/*` | **KEEP AS SUPPORTING CONTENT** | SEO/context pages; link only when useful |
| `/countries` | **HIDE FROM PRIMARY NAV** | Supporting evidence/context |
| `/cities` | **HIDE FROM PRIMARY NAV** | Supporting evidence/context |
| `/visas` | **HIDE / CONTEXTUALISE** | Pathway/legal context inside a career |
| `/study` | **ABSORB** | Career Page study section |
| `/programs` | **ABSORB** | Career Page program section; legacy discovery may remain |
| `/courses` | **ABSORB / LEGACY** | Supporting study data, not primary navigation |
| `/institutions` | **ABSORB / SUPPORTING** | Shown when relevant to a career/program |
| `/planner` | **DEFER** | Not part of initial acquisition or core flow |
| `/applications` | **DEFER** | Not an initial core surface |
| `/budget` | **DEFER** | Supporting data only when relevant |
| `/onboarding` | **MAKE OPTIONAL** | Contextual personalisation after value |
| `/login` | **KEEP** | Retention/account action, never first-value gate |
| `/profile` | **KEEP / SIMPLIFY LATER** | Account and saved-career management |
| `/settings` | **KEEP** | Account utility |
| `/blog` | **KEEP** | Acquisition content feeding Career Pages |
| country landing routes such as `/au` | **KEEP AS SUPPORTING SEO** | Discovery/content, not primary app navigation |
| ROI explorer / old study tools | **LEGACY / DEFER** | Preserve only where useful; do not define product identity |

### Important rule

**Hidden is different from deleted.**

Legacy routes may remain for SEO, existing links, data validation, or later reuse. The simplification work first removes them from the user's primary decision surface.

---

## 7. Country and personal context

The old product made passport, destination, city, study, and occupation feel like co-equal starting dimensions.

The initial product changes the hierarchy:

1. Career is the question.
2. Country / market provides the score context.
3. Citizenship, education, experience, budget, language, and legal status personalise feasibility only when needed.

### Country rule

A numeric score that depends on country must always make the country context visible.

Do not fabricate a generic global score when the evidence is country-specific.

### Citizenship rule

Do not require passport/citizenship before showing the first useful career result.

Ask for citizenship only when it materially changes:
- legal-work feasibility;
- study eligibility;
- visa options;
- a personalised pathway.

---

## 8. Login and onboarding architecture

### Signed-out user can see

- Career Score;
- verdict;
- evidence;
- pathway;
- study / programs;
- jobs / job-search links.

### Login is triggered by retention intent

Examples:
- Save this career;
- keep history;
- receive alerts;
- manage multiple careers;
- preserve personalisation.

After authentication, return the user to the same Career Page and action context.

### Onboarding

There is no mandatory onboarding funnel before a Career Page.

Personal questions are requested contextually, for example:

> Personalise this pathway for my background

The result should remain useful if the user declines.

---

## 9. Secondary feature entry rules

### Compare

Compare is entered from a Career Page, not from the global navigation.

Example:

`Registered Nurse → Compare with Physiotherapist`

A comparison should preserve the original career context and make returning easy.

### Map

Map is entered from a concrete question such as:
- where demand is strongest;
- where a program is located;
- where jobs are concentrated.

Map is a visualisation of career context, not a separate starting product.

### Programs and institutions

A user should usually encounter a program or institution because it helps them enter the current career.

Independent browse pages may remain for SEO or power users, but should not dominate primary navigation.

### Visa / legal information

Visa and legal-work evidence belongs beside pathway feasibility and blockers. It should not force every user into a separate visa product before they understand the career.

---

## 10. Home and returning-user model

### Public `/`

Purpose:
- explain the product quickly;
- let the user search/select a career;
- optionally feature a small number of current Career Scores;
- send the user into a Career Page.

It should not present a grid of every available tool.

### Signed-in `/home`

Purpose:
- saved careers;
- recently viewed careers;
- optional alerts / changed evidence later.

It is a retention surface, not a second public product homepage.

If signed-out users reach `/home`, the implementation may either show a lightweight public state or redirect to `/`. It must not create a mandatory account wall around career information.

---

## 11. Content hierarchy

### Level 1 — Career decision

The product foregrounds:
- Career Score;
- verdict;
- why;
- next step.

### Level 2 — Execution context

Show when useful:
- training;
- programs;
- jobs;
- licensing;
- legal-work constraints;
- country/city evidence.

### Level 3 — Deep exploration

Power-user or SEO surfaces:
- maps;
- institution directories;
- city pages;
- country pages;
- detailed comparisons;
- planners;
- legacy research tools.

Level 3 must not visually compete with Level 1.

---

## 12. Migration principles

The structural migration should happen in this order:

1. Build one production-quality Career Page under the new hierarchy.
2. Make social/search links land directly on it.
3. Simplify the public header/navigation around career discovery.
4. Remove Workspace tool-grid navigation from the public core flow.
5. Move Save/Login behind value.
6. Repurpose `/home` for returning-user retention.
7. Contextualise Compare, Map, Programs, Institutions, Visa, and city/country data.
8. Preserve legacy routes with redirects or low-prominence access where needed.
9. Only delete old routes after traffic, SEO, and dependency review.

This avoids a dangerous big-bang deletion while still giving the user a dramatically simpler product early.

---

## 13. What the user should perceive

A first-time user should perceive only three conceptual layers:

### 1. Career

> Is this worth it?

### 2. Path

> What do I need to do?

### 3. Action

> Where can I study, train, or find work next?

They should not perceive CampCareer as eight separate tools sharing one sidebar.

---

## 14. Stage-2 decisions now locked

The following decisions are fixed for the initial product unless user evidence later justifies changing them:

1. **Career Page is the primary public product surface.**
2. **The global multi-tool workspace navigation is not the target information architecture.**
3. **Career is the parent context; study, programs, jobs, country, city, visa, map, and institutions are supporting context.**
4. **Public homepage becomes lightweight career discovery, not a dashboard.**
5. **`/home` becomes a returning-user retention surface rather than the acquisition hub.**
6. **Compare and Map are contextual secondary actions, not global primary navigation.**
7. **Mandatory onboarding is removed from the first-value path.**
8. **Login follows value and is primarily triggered by Save/retention intent.**
9. **Legacy routes may remain during migration, but they do not define the visible product.**
10. **The next design stage is the detailed Career Page information and interaction hierarchy.**
