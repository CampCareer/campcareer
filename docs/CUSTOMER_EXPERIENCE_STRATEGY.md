# CampCareer Customer Experience Strategy

Status: **Superseded for the initial product where it conflicts with the current doctrine and information architecture**

Updated: 2026-08-14

The current initial-product experience is governed by:

- [PRODUCT_DOCTRINE.md](./PRODUCT_DOCTRINE.md)
- [product-core.md](./product-core.md)
- [INITIAL_INFORMATION_ARCHITECTURE.md](./INITIAL_INFORMATION_ARCHITECTURE.md)

The earlier Home-first, passport/destination/career-first, and broad workspace flow below is retained as historical context only. It must not be used to override the career-first initial product architecture.

---

## Historical strategy retained for context

## The feeling we were designing for

"This is not another school or visa list. It is helping me work out the safest, strongest future I can realistically build abroad."

## Earlier experience principles

- Start with curiosity, not commitment.
- Give value before asking for detailed personal information or login.
- Ask one useful question at a time; each answer must visibly improve the result.
- Make recommendations explainable: why it ranks, what could block it, and what improves it.
- Treat uncertainty honestly. Confidence belongs beside the score, never inside hidden logic.
- Make exploration safe: users can browse careers, cities, institutions, and programmes without signing in.

## Earlier interaction flow

### 1. Home: "Where could I build a career?"

Inputs: Passport, destination, and career. All three require an explicit choice: `My country isn't listed` and `I'm not sure yet` are valid, but broad defaults are not.

Output: an immediate general Overview. It should identify strong areas to explore, not pretend to know the user's full answer.

### 2. General Overview: "What is promising here?"

Show concise market signals for the selected country, city, or occupation: demand now, early-career access, future strength, work quality, and evidence confidence. Let users enter a career, city, programme, or institution without a hard conversion wall.

### 3. Progressive questions: "What changes for me?"

Only request facts that change feasibility or ranking: education, work experience, English, budget, time horizon, licences, and age when relevant. Never present this as a long onboarding form.

### 4. Personalised Overview: "Which routes fit me best?"

Present a small number of ranked routes. Each route explains:

- why it is promising;
- the most important blocker or requirement;
- evidence confidence;
- the next practical action;
- which additional fact could materially change the ranking.

### 5. Continuation: "Keep this decision alive"

Use account creation to save scenarios, compare alternatives, receive source/policy alerts, and revisit decisions. A secondary route lets non-sign-in users continue exploring relevant public pages.

## Earlier working sequence for the team

1. Agree the user promise and score vocabulary.
2. Design the Home-to-General-Overview flow for every input state.
3. Define the minimum personal questions and the resulting personalised states.
4. Design score explanation, confidence, blocker, and next-action patterns once.
5. Reuse those patterns in Home, Map, Explore careers, cities, programmes, and institutions.
6. Implement one state at a time and test it on mobile first.
7. Update the strategy only when user evidence or data capability changes the flow.

## Principles that remain valid

- Never call a score a job probability or visa approval probability.
- Never require login before a user sees useful evidence.
- Never make weak-data countries look equally decision-ready.
- Never make a user read a long report before seeing what is relevant to them.
