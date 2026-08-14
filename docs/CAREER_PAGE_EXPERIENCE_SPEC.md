# CampCareer Career Page Experience Spec

Status: **Canonical experience specification for the initial Career Page**

Owner: CampCareer  
Effective date: 2026-08-14

This document translates the product doctrine, score contract and information architecture into the page-level experience for CampCareer's primary product surface.

See also:
- [PRODUCT_DOCTRINE.md](./PRODUCT_DOCTRINE.md) — product purpose and scope
- [CAMPCAREER_SCORE_CONTRACT.md](./CAMPCAREER_SCORE_CONTRACT.md) — canonical public score
- [INITIAL_INFORMATION_ARCHITECTURE.md](./INITIAL_INFORMATION_ARCHITECTURE.md) — site hierarchy and route intent
- [product-core.md](./product-core.md) — concise execution rules

---

## 1. Page job

A Career Page has one job:

> **Help a person considering a new career or career change decide whether this career is worth pursuing in this country, then move them toward the next practical action.**

The user should not need to choose which CampCareer tool to use.

The page itself carries the journey:

`Score + Verdict → Evidence → Pathway → Study / Programs → Jobs → Secondary actions`

The Career Page is not a dashboard, comparison workspace, university directory, job board, onboarding funnel, or raw data report.

---

## 2. Five-second / thirty-second / action test

### Within five seconds

The user should understand:
- the career;
- the country / market;
- CampCareer Score;
- verdict;
- Demand, Pay and Entry scores.

### Within thirty seconds

The user should understand:
- the strongest reason the career scores well;
- the main tradeoff or entry friction;
- whether evidence confidence is Verified, Estimated or Limited.

### Within a few minutes

The user should be able to:
- understand the generic entry pathway;
- inspect relevant study or training options;
- inspect real employment opportunities or trusted job-search destinations;
- take a useful next action without first creating an account.

If the page makes the user configure an account, map, comparison, country tool, or questionnaire before these outcomes, the page has failed.

---

## 3. Fixed page hierarchy

The default order is:

1. **Career Hero — Score + Verdict**
2. **Why it scored this way — Demand / Pay / Entry**
3. **Key evidence**
4. **Pathway / requirements**
5. **Study / Programs**
6. **Jobs**
7. **Sources / methodology**
8. **Save / Compare / Personalise / Share**
9. **Related careers** only when useful

Sections may collapse or be omitted when data is unavailable, but the order must not change merely because another dataset is easier to render.

---

# 4. Section A — Career Hero

## Purpose

Answer immediately:

> **Is this career worth pursuing here?**

## Required content

### Career identity
- occupation name;
- country / market;
- optional official local occupation title when useful;
- evidence update date shown quietly.

### CampCareer Score

The score is the dominant visual element.

Required semantic structure:

```text
78 / 100
STRONG CAREER
```

The total must use the score defined in `CAMPCAREER_SCORE_CONTRACT.md`, not the historical nine-factor Opportunity Score.

### Three public dimensions

Directly associated with the total:

```text
Demand  9/10
Pay     8/10
Entry   6/10
```

These are the only public score dimensions.

Do not add separate public scores for:
- visa;
- stability;
- mobility;
- employer diversity;
- shortage;
- growth;
- personal fit.

Those are evidence or pathway concepts underneath the three public dimensions.

### Verdict sentence

One short sentence explains the tradeoff.

Example:

> **Strong demand and good pay make this attractive, but becoming job-ready requires meaningful training and licensing.**

Avoid generic copy such as “Review the local market and entry conditions.”

CampCareer should give a conclusion.

### Evidence confidence

Show separately from the score:

```text
Evidence: Verified
```

or:

```text
Evidence: Estimated
```

or:

```text
Evidence: Limited
```

Evidence confidence must never be represented as a fourth score dimension.

## First-viewport information budget

Above the first major scroll boundary, show no more than:
- career and country;
- total score;
- verdict;
- Demand / Pay / Entry;
- one material tradeoff or blocker;
- evidence confidence;
- one low-friction continuation cue.

Do not put Save, Compare, login, personalisation and several external links beside the score.

## Primary interaction

The default continuation is in-page:

> **Why this score ↓**

Natural scrolling is acceptable if the next section is clearly visible.

Login is not the primary CTA.

---

# 5. Section B — Why this score

## Purpose

Answer:

> **Why are Demand, Pay and Entry what they are?**

The page must explain the score in the same three-language system used in social content.

## Demand

Display:
- `Demand X/10`;
- a plain-language state such as Very strong / Strong / Mixed / Weak;
- one sentence explaining the main demand reason;
- one or two strongest supporting signals.

Possible evidence underneath Demand includes:
- shortage evidence;
- vacancies;
- employment base;
- vacancy or employment momentum;
- projected growth;
- employer / industry breadth.

Do not expose these as equal public subscores by default.

## Pay

Display:
- `Pay X/10`;
- relative earning interpretation;
- absolute salary evidence nearby.

The user should understand both:
- how the career pays relative to the local labour market; and
- roughly what the actual earnings figure is.

## Entry

Display:
- `Entry X/10`;
- explicit statement that higher means easier;
- short explanation of the qualification / training / licensing burden.

Possible evidence includes:
- degree or qualification requirement;
- apprenticeship / training duration;
- registration or licence;
- prior experience expectations;
- mandatory safety / certification requirements;
- existence of a realistic newcomer route.

Entry is about becoming job-ready from a newcomer baseline. It is not personal eligibility.

## Formula disclosure

A secondary interaction may say:

> **How CampCareer Score works**

and reveal:

```text
Demand 40%
Pay    30%
Entry  30%
```

The formula should be understandable without exposing the internal evidence-engine schema.

Detailed internal evidence may be available under deeper methodology disclosure.

---

# 6. Section C — Key evidence

## Purpose

Answer:

> **What real-world evidence supports this score?**

This is where CampCareer earns trust.

## Initial evidence budget

Show approximately three to four evidence cards selected by decision usefulness, for example:
- median salary / earnings;
- recent vacancies or annual openings;
- employment size;
- projected or historical growth.

Each card should contain:
- metric;
- plain-language meaning;
- reference period / as-of date;
- source access through a secondary details interaction.

## Confidence rule

Do not hide weak or proxy evidence.

If evidence is estimated or limited, say so once clearly and explain what is missing.

Do not reduce the public score by an arbitrary confidence penalty. Score quality and evidence confidence remain separate.

---

# 7. Section D — Pathway / requirements

## Purpose

Answer:

> **What do I actually need to do to enter this career?**

The generic pathway is visible before login.

## Structure

Prefer three to five numbered steps.

Example:

```text
01  Training / qualification
02  Registration / licence
03  Work rights if relevant
04  First job
```

Only include steps that materially apply to the career.

## Requirement labels

Requirements should be classified in plain language:

- **Required**
- **Depends on your situation**
- **Good to know**

Hard blockers must never be hidden inside a strong score.

## Visa and work rights

Visa and work rights belong here or in a nearby personal-path subsection.

They do not contribute to the public CampCareer Score.

This separation is non-negotiable for v1.

## Personalisation

After the generic pathway is clear, an optional CTA may appear:

> **Check this path for my situation**

Personalisation may shorten, lengthen or qualify the pathway based on the user's circumstances.

It must not recalculate the public CampCareer Score.

---

# 8. Section E — Study / Programs

## Purpose

Answer:

> **What should I study or train in, and where can I inspect real options?**

## Information order

First explain the typical education / training route.

Example:

> **Typical entry route: approved Bachelor of Nursing**

Then show a curated shortlist of relevant programs.

## Program count

Prefer approximately 3–6 strong options rather than exposing a large database.

## Program card content

Use only decision-relevant fields:
- program;
- institution / provider;
- location when useful;
- duration;
- cost when reliable;
- relationship to the career;
- external CTA.

Example CTAs:
- **View program**
- **Check entry requirements**

The page is not an exhaustive university directory.

---

# 9. Section F — Jobs

## Purpose

Answer:

> **What real work can I inspect next?**

## Preferred hierarchy

When data is available, prioritize:

1. active relevant job opportunities;
2. official employer career pages;
3. trusted job-search destinations.

## Job card content

When available:
- role title;
- employer;
- location;
- posted date / deadline;
- source;
- View / Apply action.

Do not pretend CampCareer is the employer or a full job board.

## Freshness

Expired opportunities must not be presented as active.

If only general job-search links are available, label them honestly.

---

# 10. Section G — Sources / methodology

## Purpose

Answer:

> **Can I verify this?**

Keep this section compact by default.

Include:
- evidence update date;
- score confidence;
- link to CampCareer Score methodology;
- relevant official sources;
- explanation of missing evidence when material.

The detailed internal nine-factor evidence model may be disclosed for auditability, but it must be labeled as underlying evidence rather than as the public score.

---

# 11. Section H — Secondary actions

Only after core value is visible:
- Save;
- Compare;
- Personalise;
- Share.

## Save

Account creation may be requested here because the user has already received value.

## Compare

Compare uses the same public score system for both careers.

Do not compare a v1 CampCareer Score against a legacy Opportunity Score.

## Share

Sharing should preserve:
- career;
- country;
- total score;
- Demand / Pay / Entry;
- canonical Career Page URL.

This supports the SNS acquisition loop.

---

# 12. Verdict bands

Career Page wording follows the score contract exactly:

| Score | Verdict |
|---|---|
| 80–100 | Excellent |
| 65–79 | Strong |
| 50–64 | Mixed |
| 35–49 | Challenging |
| 0–34 | Tough |

Do not invent alternate bands on individual pages.

---

# 13. Score-not-ready state

If Demand, Pay or Entry cannot be calculated from completed evidence, do not publish a guessed total.

Hero state:

```text
SCORE NOT READY YET
```

Then show:
- the verified evidence that exists;
- which dimension is incomplete;
- why it is incomplete;
- the pathway if sufficiently verified.

Do not use `0/100` to represent missing data.

---

# 14. Desktop structural wireframe

```text
┌───────────────────────────────────────────────────────┐
│ CampCareer                  Search          Account   │
├───────────────────────────────────────────────────────┤
│ Registered Nurse · Australia                         │
│                                                       │
│  82 / 100       EXCELLENT CAREER                     │
│                                                       │
│  Demand 9        Pay 8        Entry 7                │
│                                                       │
│  One-sentence verdict                                │
│  Evidence: Verified                                  │
│  Why this score ↓                                    │
├───────────────────────────────────────────────────────┤
│ Why this score                                        │
│ Demand             Pay              Entry             │
├───────────────────────────────────────────────────────┤
│ Key evidence                                          │
├───────────────────────────────────────────────────────┤
│ How to become one                                     │
│ 01 → 02 → 03 → 04                                    │
├───────────────────────────────────────────────────────┤
│ Study / Programs                                      │
├───────────────────────────────────────────────────────┤
│ Jobs                                                  │
├───────────────────────────────────────────────────────┤
│ Sources                                               │
│ Save · Compare · Personalise · Share                 │
└───────────────────────────────────────────────────────┘
```

---

# 15. Mobile structural wireframe

Mobile is a primary acquisition surface because social traffic is expected to be significant.

```text
CampCareer       Search

Registered Nurse
Australia

82 / 100
EXCELLENT CAREER

Demand 9   Pay 8   Entry 7

One-sentence verdict
Evidence: Verified

Why this score ↓

──────────────
Why this score
Demand
Pay
Entry

──────────────
Evidence

──────────────
How to become one
01
02
03
04

──────────────
Study / Programs

──────────────
Jobs

──────────────
Sources
Save · Compare · Share
```

## Mobile prohibitions

Do not use:
- permanent workspace sidebar;
- multi-tool bottom navigation;
- horizontal carousels for essential score information;
- login wall before score/pathway;
- dense nine-factor score charts above the fold.

---

# 16. Reference implementation

The first reference Career Page remains:

> **Registered Nurse — Australia**

It already has useful building blocks for:
- labour-market evidence;
- registration pathway;
- study route;
- programs;
- employers / job-search links.

However, its score presentation must use CampCareer Score v1 and must not present the historical `Job market score` as the brand score.

Australia Electrician is a useful secondary scoring sanity case because it demonstrates the intended tradeoff:

```text
Demand 9
Pay    8
Entry  6
Total  78 — Strong
```

The strong demand/pay signal remains visible while qualification and licensing friction are no longer buried.

---

# 17. Acceptance criteria

A Career Page meets the initial product spec only when all are true:

1. Career + country + total score + verdict are visible immediately.
2. Demand / Pay / Entry are the only public score dimensions.
3. Displayed component scores reconstruct the displayed total.
4. Visa does not contribute to the total.
5. Personalisation does not change the public total.
6. Evidence confidence is separate from score quality.
7. A material entry blocker is visible even when the score is high.
8. Generic pathway is visible without login.
9. Study/program options are career-contextual and curated.
10. Job actions are career-contextual and fresh enough to be useful.
11. Save/Compare/Personalise do not dominate the hero.
12. Missing required score evidence produces `Score not ready`, not a guessed number.
13. The page can be summarized cleanly in short-form social content using the same score language.
