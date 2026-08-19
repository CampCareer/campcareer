# CampCareer Career Page Core Flow

Status: canonical Career detail-page structure under the Campus × Career product architecture.

Top-level product navigation and mode ownership are defined by `docs/CAMPUS_CAREER_PRODUCT_CONSTITUTION.md`. Career is one of two first-class CampCareer decision modes alongside Campus.

Within Career mode, the Career detail page remains the primary decision surface. It must read as one decision narrative rather than a stack of legacy tools or market dashboards.

Canonical order:

`Career → CampCareer Score → Evidence → Path → Study / Programs → Jobs → Secondary actions`

## 1. CampCareer Score

The Hero owns the only public career total.

Allowed public score vocabulary:

- CampCareer Score
- Excellent
- Strong
- Mixed
- Challenging
- Tough
- Demand
- Pay
- Entry
- Evidence confidence

Do not render a second public total such as `Job market score`, `Career Opportunity Score`, `Opportunity Score` or a legacy nine-factor total below the Hero.

## 2. Evidence

The first section below the Hero is `Why this score`.

Evidence explains the same three public dimensions in fixed order:

1. Demand
2. Pay
3. Entry

Evidence may use labour-market demand, salary, entry/licensing/training constraints and official source links. It must not introduce a competing scoring framework.

## 3. Path

The public basic Path appears before any request for personal information.

Path may include:

- licensing / registration / recognition checks
- required study, training or apprenticeship
- work-rights or visa conditions
- movement into the live job market

Visa and individual eligibility are pathway conditions. They do not change the public CampCareer Score.

## 4. Study / Programs

Study and Programs appear in career context.

They answer:

`What education or training, if any, helps me enter this career?`

They are not presented as a duplicate school-discovery product inside the Career detail page. Prefer verified programme, training and apprenticeship links.

When a comparable Campus cohort is ready, the Career page should hand users into the relevant Campus results/value comparison rather than recreate Campus ranking logic locally.

If direct links are not ready, say so rather than inventing recommendations.

## 5. Jobs

Jobs are the action endpoint after judgment and pathway context.

Prefer verified live opportunities, official employer entry points and official job-search sources. Do not fabricate listings when no verified job resource is available.

## 6. Secondary actions

Save and Compare remain secondary within the Career detail narrative, even though Compare is also a first-class shared product in top-level navigation.

Login is requested only when the user initiates an account-dependent action such as Save.

Onboarding and personalisation are not part of the default public Career Page flow. They may return later only as explicit pathway refinement after public value has already been delivered.

## Implementation boundary

The Career Page uses:

- `campcareer-score-hero.tsx` for the public judgment
- `career-core-sections.tsx` for Evidence → Path → Study / Programs → Jobs
- `career-result-actions.tsx` for secondary Save / Compare actions

The legacy `CareerMarketResults` implementation remains in the repository for compatibility and dormant surfaces, but the Career Page must not render it. This prevents legacy market-brief copy, duplicate public scores, early personalisation and dashboard-era information architecture from re-entering the primary product.

## Visual rule

Below the Hero, prefer editorial sections separated by spacing and restrained borders. Avoid rebuilding the page as a grid of equal SaaS cards. Numbers and evidence should remain calm, legible and subordinate to the CampCareer Score hierarchy.

## Do not regress

Do not restore any of the following to the Career Page without a new product decision:

- `FREE CAREER MARKET BRIEF`
- `Job market score`
- a second `/100` total
- legacy nine-factor public score bars
- onboarding or `personalised=1` as the default result flow
- dashboard-style equal cards for Visa, Study, Jobs and Employers
- login before Score, Evidence or the basic Path
