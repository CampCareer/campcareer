# CampCareer Product Core

The authoritative product strategy is in [PRODUCT_DOCTRINE.md](./PRODUCT_DOCTRINE.md). This file is the concise execution rule for the initial CampCareer product.

The canonical site structure and route disposition are in [INITIAL_INFORMATION_ARCHITECTURE.md](./INITIAL_INFORMATION_ARCHITECTURE.md).

The canonical Career Page hierarchy and interaction model are in [CAREER_PAGE_EXPERIENCE_SPEC.md](./CAREER_PAGE_EXPERIENCE_SPEC.md).

## Product in one sentence

> **CampCareer scores careers and shows you the path to get there.**

Consumer-facing promise:

> **Know if a career is worth it. See exactly how to get there.**

## Primary user job

Help a person answer two questions, in this order:

1. **Is this career worth pursuing?**
2. **If yes, what should I do next to enter it?**

## Required product sequence

`Career Score → Verdict → Evidence → Pathway → Study / Programs → Jobs`

The primary surface is the **Career Page**. A user arriving from social content or search should be able to land directly on a career, understand the verdict quickly, and continue to a concrete next action without first navigating a dashboard or completing onboarding.

## Career Page opening rule

The first viewport should make the following obvious:

- career;
- country / market;
- Career Score;
- short verdict;
- strongest three to four reasons;
- one material blocker when relevant.

Career Score is the dominant decision element. Save, Compare, Personalise and login must not compete with the verdict in the opening view.

## Account rule

> **Value first. Account second.**

Career Score, evidence, generic pathway, study/program information, and job links are available before login. Login is for retention features such as Save, history, personalisation, alerts, and managing multiple careers.

Personalisation may adapt the pathway only after the generic route is already useful and visible.

## Product priority

### P0 — Core
- Career Score
- Career Page
- Evidence and source freshness
- Entry pathway and requirements
- Study and training options
- Relevant programs
- Jobs and job-search links

### P1 — Retention
- Save
- Login/account
- Recently viewed
- Personalisation

### P2 — Expansion
- Compare
- Map
- Alerts
- Dashboard
- Advanced recommendations

P2 must not make the P0 experience feel like a multi-tool portal.

## UX rules

1. **Answer first.** Show the verdict before asking the user to process detail.
2. **One dominant action.** Do not make multiple product surfaces compete on the same screen.
3. **Progressive depth.** Start simple; reveal deeper evidence when requested.
4. **Evidence without overload.** Keep sources visible and trustworthy without turning the page into a raw database.
5. **Career context first.** Study, programs, jobs, maps, legal requirements, cities, and other data are subordinate to the career being evaluated.
6. **Generic path before personalisation.** Users should understand how the career is entered before being asked to provide personal details.
7. **Action after evidence.** The page should lead from decision to concrete study/job actions, not from decision to account setup.

## Feature admission test

A feature belongs in the initial product only if it clearly helps the user either:

- decide whether a career is worth pursuing, or
- take the next practical step toward entering that career.

Otherwise, keep it secondary or defer it.
