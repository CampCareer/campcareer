# CampCareer Career Page Experience Spec

Status: **Canonical experience specification for the initial Career Page**

Owner: CampCareer  
Effective date: 2026-08-14

This document translates the product doctrine and initial information architecture into the exact content hierarchy and interaction model for CampCareer's primary product surface.

See also:
- [PRODUCT_DOCTRINE.md](./PRODUCT_DOCTRINE.md) — product purpose and scope
- [INITIAL_INFORMATION_ARCHITECTURE.md](./INITIAL_INFORMATION_ARCHITECTURE.md) — site hierarchy and route intent
- [product-core.md](./product-core.md) — concise execution rules

---

## 1. Page job

A Career Page has one job:

> **Help the user decide whether this career is worth pursuing in this market, then move them toward the next practical action.**

The user should not have to choose which CampCareer tool to use.

The page itself carries the journey:

`Verdict → Evidence → Pathway → Study / Programs → Jobs → Secondary actions`

The Career Page is not a dashboard, report library, comparison workspace, university directory, job board, or onboarding funnel.

---

## 2. Five-second / thirty-second / action test

### Within five seconds

The user should understand:
- which career they are viewing;
- which country / market the result applies to;
- the Career Score;
- the short verdict.

### Within thirty seconds

The user should understand:
- the strongest reasons for the score;
- the biggest risk, blocker, or tradeoff;
- whether the evidence is strong enough to trust as a decision signal.

### Within a few minutes

The user should be able to:
- understand the entry pathway;
- inspect relevant training or programs;
- inspect real employment opportunities or trusted job-search destinations;
- take an external next action.

If the page makes the user configure an account, compare tools, maps, countries, or a long questionnaire before these outcomes, the page has failed.

---

## 3. Fixed page hierarchy

The default order is:

1. **Career Hero / Verdict**
2. **Score reasons**
3. **Key evidence**
4. **Pathway / requirements**
5. **Study / Programs**
6. **Jobs**
7. **Sources / methodology**
8. **Save / Compare / Personalise / Share**
9. **Related careers** only when useful

Sections may collapse or be omitted when data is unavailable, but they must not be reordered merely because another dataset is easier to render.

---

# 4. Section A — Career Hero / Verdict

## Purpose

Answer immediately:

> **Is this career worth pursuing here?**

This is the most important area of the entire product.

## Required content

### Identity
- occupation name;
- country / market;
- optional official local occupation title when it aids trust;
- last meaningful evidence update, shown quietly.

### Career Score

The score must be the dominant visual element, not a small badge in the corner.

Required semantic structure:

```text
87 / 100
STRONG CAREER
```

Exact visual styling is defined in the brand phase, but layout hierarchy is fixed now:

1. score number;
2. verdict label;
3. one-sentence explanation.

### Verdict

The verdict must be short and directional.

Example:

> **Strong career. Demand and pay are attractive, but registration is a real entry gate.**

Do not lead with generic descriptions such as “Review the local market and entry conditions.”

The user needs CampCareer's conclusion first.

## Hero information budget

Above the first major scroll boundary, show no more than:
- one score;
- one verdict sentence;
- three to four high-signal reasons;
- one material warning / blocker when present;
- one low-friction continuation cue.

Do not put Save, Compare, personalisation, several links, and multiple tool CTAs beside the score.

## Primary interaction

The default action is not login.

Preferred continuation is an in-page action such as:

> **Why this score ↓**

or simply natural scrolling with a visible section cue.

If there is one immediately useful external action that is uniquely important for the career, it may appear later in the relevant section, not as a competing hero CTA.

---

# 5. Section B — Why this score

## Purpose

Answer:

> **What drove the verdict?**

The user should be able to understand the score without reading raw methodology.

## Display model

Do not expose all nine score inputs at equal visual weight by default.

Group the underlying score system into four to five user-facing dimensions.

Recommended initial dimensions:

1. **Demand**
   - shortage signal;
   - vacancy intensity;
   - vacancy trend / employment momentum;
   - employer or industry diversity where useful.

2. **Pay & growth**
   - salary / relative salary;
   - projected or historical growth.

3. **Entry access**
   - entry-level accessibility;
   - education / training burden;
   - registration or licensing burden.

4. **Stability / outlook**
   - employment base;
   - growth and long-term signals;
   - evidence-supported stability indicators.

5. **Mobility / legal access** when materially relevant
   - visa accessibility;
   - work-rights constraints;
   - must never be presented as a visa approval probability.

## Display rule

The first view should show only the most decision-relevant three to five dimensions.

Each dimension shows:
- plain-language label;
- concise strength / weakness state;
- one number or signal when meaningful;
- one sentence explaining why it matters.

Example:

```text
Demand        Very strong
Recent vacancy signals and shortage evidence are both positive.

Pay           Strong
Median annual earnings are above the market benchmark used in this score.

Entry access  Harder
Registration and approved training are required before normal practice.
```

Do not make the user infer meaning from nine unlabeled numeric subscores.

## Methodology disclosure

A secondary `See how this score is calculated` interaction may reveal:
- the detailed score components;
- methodology version;
- source mapping;
- missing evidence;
- confidence.

This is progressive disclosure, not primary page content.

---

# 6. Section C — Key evidence

## Purpose

Answer:

> **What real-world evidence supports this verdict?**

This is where CampCareer earns trust.

## Initial evidence budget

Show approximately three to four evidence cards, selected by decision usefulness rather than database availability.

Typical examples:
- median salary / earnings;
- recent hiring demand or vacancies;
- employment size;
- projected or five-year growth.

Each card should contain:
- metric;
- plain-language meaning;
- period / as-of date;
- source access through a secondary details interaction.

## Confidence

Evidence confidence is separate from the Career Score.

Recommended language:
- **Verified evidence**
- **Estimated from partial evidence**
- **Limited evidence**

Confidence must not masquerade as part of the career-quality score.

## Missing evidence

Do not fill missing values with average-looking placeholders.

Prefer:

> **Not enough verified vacancy data yet**

rather than a neutral score that looks measured.

---

# 7. Section D — Pathway / requirements

## Purpose

Answer:

> **What do I actually need to do to enter this career?**

This section converts interest into a plan.

## Default structure

Use a short ordered pathway, normally three to five steps.

Example for Registered Nurse in Australia:

```text
1. Complete an approved nursing qualification
2. Meet registration requirements
3. Obtain / confirm work rights where applicable
4. Apply for graduate or entry nursing roles
```

Each step should contain:
- action title;
- one concise explanation;
- official source link only when the user needs to verify or act.

## Blockers

Material blockers must appear before optional detail.

Use explicit severity:
- **Required** — hard prerequisite;
- **Depends on your situation** — conditional;
- **Good to know** — informational.

Examples:
- registration required;
- occupational licence required;
- mandatory safety training;
- work-rights limitation;
- specific education requirement.

Do not hide hard blockers inside the score.

## Visa / work-rights rule

Visa information belongs here only when it materially affects the route.

It should answer:

> **Will legal work access change the path I need to take?**

It must not become a standalone visa funnel or imply approval probability.

## Personalisation

Only after the generic pathway is visible may CampCareer offer:

> **Check this path for my situation**

This is optional enhancement.

Signed-out users must not be forced to log in to understand the generic pathway.

---

# 8. Section E — Study / Programs

## Purpose

Answer:

> **Where can I study or train for this career?**

This is an action section, not a directory dump.

## Content hierarchy

### First
Explain the required type of education or training.

Example:

> **Typical entry route: approved Bachelor of Nursing**

### Then
Show a curated first set of relevant programs, normally three to six.

Each program card should prioritise:
- program title;
- institution / provider;
- location;
- duration when known;
- tuition / cost when reliable and decision-relevant;
- pathway relationship (`direct`, `graduate entry`, `progression`, `related`);
- primary external action.

### Primary CTA

Use a concrete action such as:

> **View program**

or

> **Check entry requirements**

rather than a vague “Explore”.

## Program safety rule

A program relationship must not imply:
- guaranteed professional registration;
- guaranteed admission;
- guaranteed visa eligibility;
- guaranteed employment.

If registration linkage is material, tell the user what must be verified before enrolment.

## More results

If there are many programs, show a small curated set first and then:

> **See more programs for this career**

The Career Page must not turn into an endless institution catalog.

---

# 9. Section F — Jobs

## Purpose

Answer:

> **What real work opportunities can I inspect next?**

This section makes CampCareer feel connected to the real world rather than ending at education advice.

## Preferred content order

1. current / recently checked job opportunities when reliable;
2. relevant official employer careers pages;
3. trusted job-search destinations when exact listings are unavailable.

## Job card information

When exact job opportunities exist, show:
- role title;
- employer;
- location;
- listing status;
- posting / deadline when known;
- last checked date;
- direct listing or apply action.

If a listing is expired, do not present it as current.

## Primary CTA

Examples:
- **View job**
- **View current roles**
- **Search nursing jobs**

External actions should clearly indicate that the user is leaving CampCareer when appropriate.

## Guidance

One short `What to check in a job posting` disclosure may exist, but it must not push the actual jobs below a long educational section.

---

# 10. Sources and trust

## Purpose

Keep evidence visible without turning the page into a research paper.

## Default presentation

Near the page end, provide:
- evidence updated date;
- key authorities / source categories;
- score confidence;
- `View sources` interaction;
- `How CampCareer scores careers` link.

Individual metrics may also expose their direct source locally.

## Rule

Source detail is always reachable, but never the first thing the user must process.

---

# 11. Secondary actions

These actions come after the user has received core value.

Priority:

1. **Save career**
2. **Compare with another career**
3. **Personalise this path**
4. **Share**

These are not four primary CTAs.

Recommended behavior:
- one quiet Save affordance can remain accessible while scrolling;
- Compare appears after the verdict/evidence or near the page end;
- Personalisation appears after the generic pathway;
- Share is utility-level.

## Login rule

If Save requires login:

`Save → Sign in → return to the same Career Page`

The user should not be redirected into onboarding unless they explicitly chose personalisation.

---

# 12. Desktop wireframe

Structural wireframe only; visual styling is defined later.

```text
┌───────────────────────────────────────────────────────────────┐
│ CampCareer        Search careers        How scores work  Sign in │
├───────────────────────────────────────────────────────────────┤
│ Registered Nurse · Australia                                │
│                                                               │
│  87 / 100                                                     │
│  STRONG CAREER                                                │
│  Strong demand and pay; registration is the main entry gate. │
│                                                               │
│  Demand ↑   Pay ↑   Outlook ↑   Entry difficulty !           │
│  Why this score ↓                                             │
├───────────────────────────────────────────────────────────────┤
│ WHY THIS SCORE                                                │
│ Demand      Pay & growth      Entry access      Outlook       │
├───────────────────────────────────────────────────────────────┤
│ KEY EVIDENCE                                                  │
│ Salary      Hiring demand     Employment        Growth        │
│ Evidence confidence / updated date                            │
├───────────────────────────────────────────────────────────────┤
│ HOW TO BECOME A REGISTERED NURSE                              │
│ 01 Qualification → 02 Registration → 03 Work rights → 04 Job │
│ Required blocker / conditional notes                          │
│ [Check this path for my situation]                            │
├───────────────────────────────────────────────────────────────┤
│ STUDY / PROGRAMS                                              │
│ Required study route                                         │
│ [Program] [Program] [Program]                                 │
│ See more programs                                             │
├───────────────────────────────────────────────────────────────┤
│ JOBS                                                          │
│ [Current role] [Current role] [Employer careers]              │
│ View current roles                                            │
├───────────────────────────────────────────────────────────────┤
│ SOURCES / METHODOLOGY                                         │
│ Updated · confidence · sources                                │
├───────────────────────────────────────────────────────────────┤
│ Save career   Compare   Personalise   Share                    │
└───────────────────────────────────────────────────────────────┘
```

The page should feel like one editorial decision product, not a grid of independent app modules.

---

# 13. Mobile wireframe

Mobile is the primary acquisition experience because social traffic is expected to be significant.

```text
┌──────────────────────────┐
│ CampCareer        Search │
├──────────────────────────┤
│ Registered Nurse         │
│ Australia                │
│                          │
│ 87                       │
│ /100                     │
│ STRONG CAREER            │
│                          │
│ Strong demand and pay;   │
│ registration is the      │
│ main entry gate.         │
│                          │
│ Demand ↑  Pay ↑          │
│ Outlook ↑ Entry !        │
│                          │
│ Why this score ↓         │
├──────────────────────────┤
│ Why this score           │
│ [Demand]                 │
│ [Pay & growth]           │
│ [Entry access]           │
│ [Outlook]                │
├──────────────────────────┤
│ Key evidence             │
│ [Salary] [Demand]        │
│ [Employment] [Growth]    │
├──────────────────────────┤
│ How to become one        │
│ 01 ...                   │
│ 02 ...                   │
│ 03 ...                   │
│ 04 ...                   │
│                          │
│ Check this path for me   │
├──────────────────────────┤
│ Programs                 │
│ [Program card]           │
│ [Program card]           │
│ See more                 │
├──────────────────────────┤
│ Jobs                     │
│ [Job card]               │
│ [Job card]               │
│ View current roles       │
├──────────────────────────┤
│ Sources                  │
│ Save · Compare · Share   │
└──────────────────────────┘
```

## Mobile rules

- no multi-tool bottom navigation;
- no sidebar;
- no horizontally dense dashboard layout;
- score and verdict fit comfortably in the first viewport;
- cards stack naturally;
- sticky UI, if used, may expose only one low-noise action such as Save or Search;
- external CTAs must have touch-friendly targets;
- avoid carousels for essential information.

---

# 14. State model

A Career Page must degrade honestly.

## A. Decision-ready

Show:
- published / sufficiently covered score;
- verdict;
- evidence;
- pathway;
- programs and jobs when available.

## B. Score available, evidence incomplete

Show:
- score with clear limited/estimated confidence;
- what evidence is present;
- what is missing;
- pathway only where verified.

Do not make the page visually identical to a highly verified result.

## C. Evidence available, score not ready

Do not invent a score.

Lead with:

> **Score not ready yet**

then provide useful verified evidence and pathway information.

## D. Career / market unsupported

Do not route the user into a generic dashboard.

Offer:
- nearby supported career variants;
- another country context;
- career search.

---

# 15. Current implementation disposition

The existing implementation is a useful data and component source, but its current hierarchy is not the target hierarchy.

## Reuse

Reuse where appropriate:
- career insight read model;
- opportunity score and score breakdown;
- evidence dates and sources;
- foundation confidence;
- blockers;
- licensing evidence;
- visa pathways;
- entry points;
- linked programs;
- job opportunities;
- employer and job-search links.

## Recompose

The following should be recomposed into the new page structure:
- current `CareerMarketResults` market metrics;
- Registered Nurse pathway steps;
- regional signals when they are genuinely useful;
- program cards;
- employer/job links;
- source components.

## Move down / remove from the opening view

- Save;
- Compare;
- login-to-personalise CTA;
- update-details actions;
- generic disclaimer blocks that compete with the verdict;
- country / tool navigation unrelated to the current career.

## Important behavior change

The current result action component chooses `Sign in to see my path` as the signed-out primary action before the user has consumed the result. That is incompatible with this spec.

The generic pathway must be visible without login. Personalisation may require account state only after the user deliberately asks CampCareer to adapt the path to them.

---

# 16. Reference implementation career

The first implementation should use one career as the reference page before generalising the template.

Recommended reference:

> **Registered Nurse — Australia**

Reasons:
- current score / metric data exists;
- registration is a meaningful real-world blocker;
- study pathway is concrete;
- linked programs exist;
- employer / job-search paths exist;
- the current code already contains a richer nursing-specific flow that can be recomposed instead of invented from scratch.

The reference page must prove the full hierarchy on desktop and mobile before broad rollout.

---

# 17. Acceptance criteria for the design

The Career Page design is acceptable only if all are true:

1. The occupation, country, score, and verdict are obvious in the first viewport.
2. Career Score is visually dominant.
3. The page states a conclusion, not only a collection of facts.
4. A user can understand the main reasons for the score without opening methodology.
5. Evidence confidence is visible but separate from career quality.
6. Hard blockers are explicit.
7. The generic pathway is accessible before login.
8. Programs are shown in career context, not as an independent catalog.
9. Jobs or job-search actions are present when reliable data exists.
10. Save / Compare / Personalise do not compete with the verdict.
11. The mobile flow does not require global tool navigation.
12. Missing evidence is shown honestly rather than filled with neutral-looking values.
13. Sources remain reachable.
14. The page ends in a practical action, not merely more information.

---

# 18. Implementation boundary for the next step

This specification defines information hierarchy and interaction priority only.

The next brand/design-system phase decides:
- exact Career Score visual identity;
- typography;
- color system;
- spacing scale;
- card styling;
- iconography;
- motion;
- final component appearance.

Implementation should not begin by polishing the old workspace shell. The first build target is the Career Page itself, using Registered Nurse — Australia as the reference experience.
