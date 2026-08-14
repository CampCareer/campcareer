# CampCareer Product Doctrine

Status: **Canonical for the initial CampCareer product**

Owner: CampCareer  
Effective date: 2026-08-14

This doctrine replaces earlier broad product descriptions when they conflict with the scope below, including descriptions of CampCareer as primarily a study-abroad ROI explorer, a generic cross-border career engine, or a multi-surface career-planning workspace.

## Product definition

> **CampCareer scores careers and shows you the path to get there.**

Consumer-facing promise:

> **Know if a career is worth it. See exactly how to get there.**

CampCareer is a career-decision and action product. It is not initially defined by a dashboard, map, comparison tool, study-abroad funnel, or account workflow. The product starts with one career and answers two questions:

1. **Is this career worth pursuing?**
2. **If yes, what should I do next to enter it?**

## Primary customer intent

The initial customer is considering a career, career change, education path, or employment move and wants a fast, evidence-backed way to judge the career and act on that decision.

Age, nationality, and destination may change the answer, but they are context for the career decision rather than the product's primary identity.

## Primary acquisition flow

Social content and search are discovery layers for the product.

A typical flow is:

`Social/Search → Career Page → Career Score → Evidence → Pathway → Study / Programs → Jobs`

A social post may present a simple hook such as:

> Registered Nurse in Australia — 87/100

The linked CampCareer page should immediately continue that same story. Users should not be sent through an unrelated landing page, dashboard, mandatory onboarding flow, or login gate before seeing the career result.

## The Career Page is the core product

The primary product surface is a single career page.

Each Career Page should answer the following in order:

### 1. Is this career worth it?

Show:
- Career Score
- short verdict
- a small number of decision-relevant component scores

### 2. Why does it have this score?

Show:
- pay / earnings evidence
- demand and outlook
- stability or growth signals
- entry difficulty or investment where relevant
- source, freshness, and confidence

### 3. What do I need to enter this career?

Show:
- education or training requirements
- licensing / registration where applicable
- important prerequisites
- expected steps and timing
- material blockers plainly

### 4. Where can I study or train for it?

Show:
- relevant study fields
- selected programs or training pathways
- useful external links

This is not an attempt to become an exhaustive university directory.

### 5. Where can I work?

Show:
- relevant employment context
- selected job opportunities or job-search destinations
- useful external links

This is not an attempt to become a full job board.

## Career Score is the primary brand asset

Career Score is not a decorative feature. It is the main CampCareer decision interface and should be recognizable across the website and social content.

The information order is:

> **Verdict → Evidence → Action**

not:

> raw data → more data → explanation → eventual conclusion

Scores must be explainable, versioned where appropriate, and grounded in visible evidence. Confidence, evidence quality, and hard eligibility blockers must not be hidden inside a single score.

## Evidence rules

A strong career verdict should use current, relevant, source-backed evidence where available. Material evidence should preserve enough provenance to explain why a score or claim exists.

Relevant evidence may include:
- earnings
- hiring demand and vacancies
- forward outlook
- stability
- education and training requirements
- licensing and registration
- early-career access
- work conditions
- relevant immigration or legal-work constraints when they materially affect the user
- programs and training pathways
- employment opportunities

Country, city, citizenship, visa, cost, and institution data remain valuable when they help explain or execute a career path. They are supporting dimensions, not separate products competing for attention.

## Account policy

> **Value first. Account second.**

A signed-out user should be able to access the core value:
- Career Score
- verdict and evidence
- pathway and requirements
- study / program information
- job information and links

Account creation is a retention mechanism, not an acquisition gate.

Login may unlock:
- Save
- history / recently viewed
- personalisation
- alerts
- managing several careers
- deeper saved comparisons

## Onboarding policy

Mandatory onboarding is not part of the initial core flow.

Ask for personal information only when it materially improves the result and only after useful career value is visible. Personalisation should feel like an optional enhancement to a career result, not a prerequisite for seeing one.

## Role of existing product surfaces

Existing features and data do not need to be deleted merely because they are no longer primary.

### Core
- Career Score
- Career Page
- Evidence
- Pathway
- Study / training
- Programs
- Jobs / job-search links

### Secondary / retention
- Save
- Login
- Recently viewed
- Personalisation

### Deferred / contextual
- Compare
- Map
- Dashboard / Home workspace
- Alerts
- advanced recommendations

If Home remains, its primary role should be lightweight retention such as saved or recently viewed careers, not the main way a new user experiences CampCareer.

Compare and Map may be useful inside a career context, but should not make the product feel like a collection of unrelated tools.

## Information architecture rule

Career is the parent context.

Study, programs, jobs, cities, maps, legal requirements, institutions, and other supporting data should answer a question about the career currently being evaluated.

The product should not present those datasets as equal top-level destinations unless user behavior later proves that they deserve independent surfaces.

## Initial product non-goals

The initial CampCareer is not primarily:
- a generic study-abroad directory
- a university ranking site
- an exhaustive program search engine
- a full job board
- an immigration agency or visa guarantee service
- a map-first discovery product
- a productivity workspace
- an application tracker
- a generic AI chatbot
- a social network

Existing content or infrastructure in these areas may remain, but it does not define the initial product.

## UX principles

### Answer first
The user should understand the career verdict before processing large amounts of detail.

### One dominant action
Do not make multiple tools or CTAs compete for attention at the same moment.

### Progressive depth
Start with the decision. Reveal deeper evidence and pathways as the user continues.

### Evidence without overload
Show why CampCareer believes something without forcing the user to read a database dump.

### Action over accumulation
The goal is not to maximize the amount of information displayed. The goal is to help the user make a career decision and take the next practical action.

## Initial success metric

The main product conversion is:

> **Career Page → useful next action**

Examples include:
- opening a relevant program
- opening a training option
- opening a job opportunity or job-search destination
- saving the career after receiving value

Supporting funnel events should include:

`Career Page visit → Score viewed → Evidence viewed → Pathway viewed → Study/Program action → Job action → Save/Account`

Traffic and page views matter for acquisition, but they do not by themselves prove product value.

## Build rule

Before broadening the product again, make one representative Career Page excellent end to end. The reference journey should prove that a user can:

1. understand the career verdict quickly,
2. trust the evidence,
3. understand the entry pathway,
4. find a relevant study or training option,
5. find a relevant employment next step,
6. do all of this without mandatory login.

Only after that experience works should CampCareer expand the same pattern across more careers and selectively reintroduce secondary surfaces based on real user behavior.

## Feature admission test

For the initial product, a proposed feature should answer yes to at least one of these questions:

1. Does it help the user decide whether this career is worth pursuing?
2. Does it help the user take the next practical step toward entering this career?

It should also preserve evidence quality and keep the primary experience simple.

If not, defer it.
