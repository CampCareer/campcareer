# CampCareer Product Doctrine

Status: Foundational and durable

Owner: CampCareer
Effective date: 2026-08-09

## Permanent product purpose

CampCareer helps a person choose and execute the overseas study-to-career path that gives them the strongest realistic chance of building a sustainable working life abroad.

The starting question may be specific or open:

> Given my citizenship and situation, which country, city, occupation, and study path should I seriously consider—and why?

CampCareer is not a generic study-abroad directory, visa list, university ranking, immigration agency, job board, productivity workspace, or generic AI chat. It is a source-backed cross-border career opportunity engine.

## The customer problem

The core customer is excited by studying or working abroad but fears spending years and substantial money only to be unable to get work, obtain a legal work path, or remain after study. The product must reduce that uncertainty without promising a job, visa approval, or residency outcome.

## Customer promise

CampCareer gives users two distinct answers:

1. **Market Opportunity** — an evidence-based view of a country, city, and occupation: hiring demand, early-career access, future strength, and work quality.
2. **My Pathway Fit** — a personalised view after the user supplies relevant facts such as citizenship, education, experience, English, budget, and time horizon.

Neither score is a job-probability, visa-approval, or residency guarantee. Missing or weak evidence lowers confidence; it is never silently treated as an average result.

## Primary customer flow

1. **Start lightly, but intentionally.** A user chooses Passport, destination, and career. `My country isn't listed` and `I'm not sure yet` are explicit valid choices; broad defaults such as Anywhere are not used until comparison coverage is ready.
2. **See a useful answer immediately.** Show a general market or destination overview before login. Explain why a country, city, or occupation is worth exploring.
3. **Narrow only when useful.** Ask short, contextual questions only when they materially change the recommendation: education, experience, English, budget, time, licence, and age where relevant.
4. **Receive a personal route view.** Rank realistic country–city–occupation–study routes; explain the strongest signals, blockers, uncertainty, and the next action.
5. **Continue deliberately.** Account creation unlocks saved comparisons, scenarios, updates, and deeper route tracking. It must not gate the first useful result.
6. **Explore without a forced funnel.** Users who decline sign-in can continue to relevant occupations, institutions, programmes, cities, and maps.

The experience must feel like the user's own question, not a questionnaire or a generic dashboard.

## Product surfaces

- **Home:** light entry, discovery, and the first Overview.
- **Map:** geographic exploration of cities, labour demand, employers, cost, and study locations.
- **Explore careers:** occupation-led evidence, requirements, programmes, employers, and city opportunities.
- **Route result:** the joined country–city–occupation–programme–institution–legal-path answer.

Navigation and calls to action must prioritise these surfaces. Planner, task manager, generic onboarding wizard, application tracker, budget tracker, English tracker, and social features are not core surfaces.

## Score and evidence rules

Every score is versioned, explainable, and source-backed.

- Market Opportunity is calculated at the country/occupation level, with city detail where available.
- My Pathway Fit is calculated only after the necessary user facts are present.
- Legal eligibility, required registration, and other hard blockers are shown before a final rank—not hidden inside a high score.
- Data confidence is displayed separately from opportunity: source authority, freshness, coverage, and granularity determine it.
- A result with insufficient evidence is an exploration lead, not a confident recommendation.

## Data model principle

All work should strengthen the connected graph:

`Citizenship → Country → City → Occupation → Programme → Institution → legal/work pathway`

Every material observation should retain source, source URL, publication date or period, retrieval date, geographic scope, occupation/programme identifier, and verification state.

Priority evidence is:

1. Official legal-entry and work conditions.
2. Employment, vacancies, shortage, earnings, and forward outlook.
3. Early-career access: graduate, internship, apprenticeship, and experience requirements.
4. Professional recognition, registration, language, time, and cost barriers.
5. Accredited programme-to-occupation pathways and placement evidence.
6. City-level job density, employer presence, pay, and living cost.

## Expansion rule

CampCareer may be broad in discovery but must be honest in depth. Country and occupation coverage is released by evidence confidence tier, not by page count. A user must be able to distinguish an early exploration signal from a decision-ready route.

## Monetisation rule

The likely first paid value is a subscription for saved scenarios, personal comparisons, monitoring, and deeper decision support. Reports remain optional and must not be assumed as the primary product. Paid placement or referral relationships can never alter evidence, eligibility, or ranking.

## Success metric

The main metric is a completed, useful career decision—not a page view. Track the path from a light search to Overview comprehension, route exploration, personalisation, saved scenario, and useful action.

## Feature admission test

Every feature must answer yes to all of the following:

1. Does it reduce uncertainty about a sustainable overseas career path?
2. Does it improve the quality, speed, clarity, or actionability of Market Opportunity or My Pathway Fit?
3. Is it supported by maintainable, visible evidence?
4. Does it help users move from exploration to a concrete next action?

Otherwise, defer it.
