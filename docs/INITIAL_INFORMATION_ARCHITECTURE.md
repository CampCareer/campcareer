# CampCareer Initial Information Architecture

Status: **Canonical execution architecture for the initial CampCareer product**

Owner: CampCareer  
Effective date: 2026-08-14

This document translates the product doctrine into a concrete site structure. When an older workspace, navigation, onboarding, planner, map, country, study, or comparison strategy conflicts with this document, this document governs the initial product experience.

See also:
- [PRODUCT_DOCTRINE.md](./PRODUCT_DOCTRINE.md) — product purpose and scope
- [product-core.md](./product-core.md) — concise execution rules
- [CAREER_PAGE_EXPERIENCE_SPEC.md](./CAREER_PAGE_EXPERIENCE_SPEC.md) — canonical Career Page hierarchy and interaction model

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

Its structural order is:

1. Career Hero / Verdict
2. Score reasons
3. Key evidence
4. Pathway / requirements
5. Study / Programs
6. Jobs
7. Sources / methodology
8. Secondary actions

The detailed information budget, interaction hierarchy, desktop/mobile wireframes, state model, and current implementation disposition are defined in [CAREER_PAGE_EXPERIENCE_SPEC.md](./CAREER_PAGE_EXPERIENCE_SPEC.md).

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
- page-local actions;
- account utility only when needed.

---

## 6. Existing route disposition

Existing routes do not need to be deleted immediately. Their role changes first.

| Existing surface | Initial-product disposition |
|---|---|
| `/` | Keep, but simplify into career discovery / search entry |
| `/career` | Replace query-led result concept with canonical career-page structure |
| `/home` | Repurpose later for signed-in saved / recent careers; not public acquisition |
| `/occupation` | Fold discovery value into `/careers`; avoid global-tool positioning |
| `/programs` | Keep technically if useful, but remove from primary nav; feed Career Page program sections |
| `/courses` | Secondary/legacy; fold useful content into career context |
| `/institutions` | Secondary/legacy; primarily reached from relevant program/career context |
| `/countries` | Secondary/SEO/supporting context; not a top-level product choice |
| `/cities` | Supporting context inside career/pathway decisions |
| `/visas` | Supporting pathway/blocker context; not primary nav |
| `/compare` | Secondary career action; not primary nav |
| `/maps` / `/map` | Contextual exploration only; not primary nav |
| `/planner` | Deferred; do not use as the shell for the initial public product |
| `/applications` | Deferred / non-core |
| `/budget` | Deferred / non-core |
| `/dashboard` | Do not use as the public destination |
| `/onboarding` | Optional post-value personalisation only |
| `/login` | Utility / retention entry; never required to see core career value |
| `/profile` | Account / retention |
| `/settings` | Account utility |
| `/blog` | Keep as acquisition content feeding Career Pages |
| `/roi-explorer` | Legacy/specialized; not product identity or primary navigation |

### Principle

Hide before deleting.

Existing SEO equity, datasets, deep links, and useful tools should not be destroyed merely to simplify the visible product. First remove them from the user's default decision path. Redirect/deprecation decisions come later after traffic and SEO review.

---

## 7. Core user flow

The default public flow is:

```text
External discovery or homepage
        ↓
Specific Career Page
        ↓
Career Score + verdict
        ↓
Why this score / evidence
        ↓
How to enter this career
        ↓
Study / Programs
        ↓
Jobs
        ↓
External next action
        ↓ optional
Save / Account / Personalise / Compare
```

This is the primary funnel to optimise.

---

## 8. Account and onboarding flow

### Wrong order

```text
Career interest
→ login
→ onboarding
→ dashboard
→ find result
```

### Initial-product order

```text
Career interest
→ Career Page
→ useful score / evidence / generic pathway
→ user chooses a retention or personalisation action
→ login if required
→ return to the same career context
```

Account creation must preserve `return_to` / `next` context.

---

## 9. Compare flow

Compare is a child action of a career decision.

Preferred flow:

```text
Registered Nurse — Australia
→ Compare with another career
→ select Physiotherapist
→ focused comparison
→ return to either Career Page
```

The user should not need to open a generic Compare tool from global navigation before having a career context.

---

## 10. Map flow

Map is a contextual answer, not the site identity.

Examples:
- `Where are nursing jobs strongest?`
- `Where can I study nursing?`
- `Which regions have stronger hiring signals?`

A Career Page may open a career-filtered map or map section when geography genuinely improves the decision.

The raw interactive map may remain available via direct/legacy routes, but it does not receive top-level navigation priority.

---

## 11. Study / Program flow

Programs are downstream of career intent.

Preferred flow:

```text
Career Page
→ pathway says a qualification is needed
→ relevant study / training section
→ selected programs
→ provider / official program page
```

Avoid making a new user choose a program database before understanding what qualification they need and why.

---

## 12. Jobs flow

Jobs are downstream proof and action.

Preferred flow:

```text
Career Page
→ employment evidence / entry requirements
→ selected current opportunities or trusted job-search destinations
→ external job listing / employer site
```

CampCareer may curate or link jobs without becoming the job board of record.

---

## 13. SEO and legacy content principle

Simplifying the product does not require immediately deleting older country, map, study, ROI, or blog content.

Classify legacy content into:

### Feed the core
Useful data or pages should link into Career Pages.

### Support SEO
Keep pages with genuine search value, but make the Career Page the preferred next step.

### Hide from primary UX
Pages may remain directly accessible without appearing in header/sidebar navigation.

### Deprecate later
Only after analytics, redirect mapping, and SEO impact are understood.

---

## 14. Analytics funnel implied by the architecture

The main product journey should be measurable as:

`career_page_view`
→ `score_viewed`
→ `evidence_engaged`
→ `pathway_viewed`
→ `program_clicked` or `job_clicked`
→ optional `career_saved`
→ optional `account_created`

The strongest initial success signal is not account creation by itself.

A high-value event is:

> **The user consumes a career decision and takes a relevant next action.**

---

## 15. Implementation order implied by this architecture

1. Build one canonical Career Page reference experience.
2. Make it work without login.
3. Connect its evidence, pathway, program and job sections to existing data.
4. Simplify the public header/navigation around it.
5. Simplify `/` into career discovery.
6. Move Save/account/personalisation behind demonstrated value.
7. Remove Map/Compare/Countries/Visas/Programs/Institutions from primary global navigation.
8. Add redirects/canonical SEO changes only after route migration is deliberately planned.
9. Generalise the reference Career Page across supported careers.
10. Reintroduce secondary tools only when they reinforce the career-first flow.

---

## 16. Architecture acceptance test

A new visitor should be able to answer all of these without learning CampCareer's internal product structure:

1. **What career am I looking at?**
2. **Is it worth pursuing?**
3. **Why?**
4. **What do I need to do to enter it?**
5. **Where can I study or train?**
6. **Where can I find work?**

If the user instead needs to understand the difference between Home, Occupation, Map, Compare, Programs, Institutions and Planner, the architecture has failed.
