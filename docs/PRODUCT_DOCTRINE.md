# CampCareer Product Doctrine

Status: Foundational and durable
Owner: CampCareer
Effective date: 2026-07-29

## 1. Permanent product purpose

CampCareer exists to answer one question exceptionally well:

> A person from country A wants to enter country B through career or study field C. What realistic routes are available, what does each route require, and what should the person do next?

This is the product's permanent core. It must remain valid for the next 10 to 20 years even when countries, visa rules, occupations, courses, technologies, interfaces, and business models change.

CampCareer is not a generic study-abroad portal, productivity suite, social network, personal planner, university directory, immigration agency, or job board.

CampCareer is a source-backed cross-border career pathway engine.

## 2. Core user outcome

For one origin country, destination country, and target field or occupation, CampCareer must produce a decision-ready pathway showing:

1. Available route options
2. Visa or legal-entry options and eligibility conditions
3. Required qualifications, licences, registrations, language scores, and experience
4. Relevant courses and training providers
5. Relevant job sources and employers
6. Expected costs and preparation time
7. Labour-market and location signals
8. Major constraints, risks, and disqualifiers
9. Official or authoritative sources
10. A clear next-action sequence

The product is successful when a user can understand what is possible, what is not possible, and what to do next without assembling the answer across dozens of disconnected websites.

## 3. Product primitives

All durable product work must strengthen one or more of these primitives:

- Origin country
- Destination country
- Target field or occupation
- Route
- Visa or legal status
- Requirement
- Qualification or licence
- Course or training provider
- Job source or employer
- Location
- Cost
- Timeline
- Risk or constraint
- Evidence source
- Next action

Features that do not improve the quality, coverage, reliability, discoverability, or execution of these primitives are outside the core product.

## 4. Primary interface

The primary experience consists of only two product surfaces:

### Search

Search captures or infers the user's origin country, destination country, and target field or occupation. It returns relevant pathway results rather than generic content results.

Example:

- South Korean citizen
- Australia
- Mining jobs
- Working Holiday visa route

The result should include visa eligibility, required tickets and licences, training links, job boards, major employers, locations, costs, timing, risks, and official sources.

### Maps

Maps provides the geographic view of the same pathway data. It must help users determine where courses, jobs, labour demand, employers, licensing bodies, and route constraints are located.

Maps is not a separate product. It is a geographic representation of Search and pathway results.

## 5. Scope decision

### Keep and strengthen

- Search
- Maps
- Country, field, occupation, visa, course, job, employer, location, cost, and requirement data
- Source verification and freshness controls
- Pathway result pages
- Comparison between route options inside the same user question
- Save, export, or purchase of a pathway result when directly useful

### Remove from the primary product

- Planner workspace
- Wizard-based multi-step onboarding
- Personal dashboard
- Task management
- Budget tracker
- English study tracker
- Application tracker
- Research notes workspace
- Gamification and achievements
- Social-profile features

These may be archived rather than immediately deleted, but they must not define navigation, acquisition, onboarding, or product positioning.

### Explicitly reject

- Features added only because competitors have them
- Generic AI chat without structured pathway output
- Community or social-feed features
- Broad productivity tools
- Unverified rankings
- Content volume without pathway usefulness
- Expansion to a new country or field before the current pathway standard is met

## 6. Feature admission test

Every proposed feature must pass all five tests:

1. Does it help answer the permanent core question?
2. Does it improve route accuracy, depth, trust, speed, or actionability?
3. Can its value be measured through completed pathway decisions?
4. Can it be maintained with reliable data and source controls?
5. Is it more important than improving Search, Maps, or pathway coverage?

A feature that fails any test is rejected or deferred.

When a request conflicts with this doctrine, the default response is to stop the work and explain the conflict before implementation.

## 7. Pathway quality standard

A pathway is not publishable merely because a page exists. A publishable pathway should contain, where applicable:

- Route name and intended user
- Eligibility rules
- Visa or legal-entry conditions
- Required qualifications and licences
- Course and training options
- Job sources and employers
- Geographic opportunities
- Cost range
- Preparation and execution timeline
- Risks, blockers, and uncertainty
- Source links
- Last verified date
- Next actions

Missing information must be labelled as missing or uncertain. CampCareer must not fabricate completeness.

## 8. Expansion rule

CampCareer expands route by route, not feature by feature.

A new origin-country, destination-country, and field combination should be added only after the pathway schema, source standard, and maintenance process are proven on a narrow initial market.

The recommended initial wedge is:

- Destination: Australia
- Interface language: English first, Korean supported
- Initial route clusters: fields with clear legal, training, licensing, course, and employment pathways

The company should achieve exceptional depth in a small number of routes before broad geographic expansion.

## 9. Monetisation doctrine

Monetisation must be designed now but introduced only where it does not weaken trust or discovery.

### Free layer

- Search and pathway discovery
- Basic visa and requirement summary
- Key official sources
- Limited course, job, and location results

### Paid layer

- Full pathway report
- Detailed cost and timeline model
- Route comparison and scenario analysis
- Verified course, qualification, licence, job-source, and employer directory
- Source freshness and change alerts
- Exportable decision pack

### Additional revenue paths

- Clearly disclosed course or service referrals
- Employer or training-provider lead generation after quality thresholds are met
- Institutional data products or APIs

Paid placement must never alter pathway eligibility conclusions or evidence-based rankings. Commercial relationships must be disclosed.

The first revenue product should be a paid, high-depth pathway report attached to a free pathway result. It should not require building a separate planner product.

## 10. Primary metrics

The main metric is not page views. It is completed useful pathway decisions.

Track:

- Searches containing origin, destination, and field or occupation
- Pathway-result completion rate
- Official-source click-through rate
- Course, qualification, licence, and job-source engagement
- Save or export rate
- Paid pathway conversion rate
- Pathway freshness and verified-source coverage
- User reports of missing or incorrect route information

Traffic without pathway engagement is not product success.

## 11. Immediate repository implications

The next implementation programme should proceed in this order:

1. Freeze new Planner, Wizard, Onboarding, dashboard, profile, and gamification development.
2. Define the canonical pathway data contract.
3. Replace the landing-page Wizard with direct pathway Search.
4. Unify Search results and Maps around the same pathway entities.
5. Remove Planner calls to action from global navigation.
6. Redirect or archive non-core primary routes without deleting valuable source data.
7. Build one end-to-end route to the full quality standard.
8. Attach the first paid pathway report to that route.

No broad redesign or mass deletion should happen before the pathway contract and redirect plan are approved.

## 12. Governance

This document governs product scope. Changes require an explicit product decision explaining:

- Why the permanent core question is no longer sufficient
- What user evidence supports the change
- What existing scope will be removed in exchange
- How the change improves pathway quality

Absent that evidence, this doctrine remains unchanged.
