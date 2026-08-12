# US Carpenter Career Data Foundation E2E Report

Verified: 2026-08-12

Scope: United States × Carpenter only. No second country or occupation is seeded by this work. Australia × Registered Nurse remains the existing regression/reference path.

## Outcome

| State | Result |
| --- | --- |
| `decision_ready` | `true` |
| `score_ready` | `true` |
| `publish_ready` | `true` |
| `opportunity_score` | `45.06 / 100` |
| score components | `9 / 9` |
| score coverage weight | `100 / 100` |
| formula | `career-opportunity-v3-foundation` |
| user-facing confidence | `Estimated` |

`score_ready=true` now means that every required component has been evaluated under the frozen CampCareer v1 methodology. It does not mean every component is based on a complete direct national statistical series.

The score is marked `Estimated` because deterministic proxy/fallback rules remain in shortage, vacancy, industry diversity, visa accessibility and entry burden. Those states are explicit and provenance-backed.

## Score model

The Opportunity Score remains a 100-point base model:

| Component | Max | US Carpenter | Evidence status |
| --- | ---: | ---: | --- |
| Shortage Signal | 20 | 0.00 | `no_evidence_found` |
| Vacancy Intensity | 15 | 4.00 | `fallback` |
| Industry Diversity | 5 | 0.00 | `insufficient_industry_coverage` |
| Employment Momentum | 10 | 3.48 | `derived` |
| Entry Accessibility | 15 | 14.00 | `proxy` |
| Relative Salary | 10 | 6.88 | `derived` |
| Projected Growth | 10 | 5.70 | `derived` |
| Visa Accessibility | 10 | 6.00 | `proxy` |
| Entry Burden / Licensing | 5 | 5.00 | `proxy` |
| Total | 100 | 45.06 | `Estimated` |

The final score is not manually entered. Component scores are generated from normalized values, and the final score is calculated by the foundation score view.

## Important zero semantics

A score of zero is not always the same factual claim.

Shortage is `0 + no_evidence_found`, meaning the official-source review did not validate a comparable official Carpenter shortage designation. It does not assert that an authority explicitly classified Carpenter as not in shortage.

Industry Diversity is `0 + insufficient_industry_coverage`, meaning the available categories cannot yet support the agreed cross-country HHI normalization. It does not assert proven maximum concentration.

Raw missing observations continue to obey the original foundation rule: unavailable raw data remains `raw_value=null`, `availability=unavailable`, with a required reason. The conservative score occurs only in the normalized/component layer after the methodology-defined research completion rule is applied.

## Shortage methodology v1

Shortage is separate from growth, annual openings and vacancy.

CampCareer normalized severity:

- `not_shortage` = 0
- `pressure` = 5
- `shortage` = 12
- `severe` = 18
- `critical` = 20

Geographic multipliers:

- `national` = 1.00
- `broad_subnational` = 0.75
- `regional` = 0.50
- `local` = 0.25

Formula: severity points × geographic multiplier.

For US Carpenter no validated official shortage designation was found under the v1 source standard, so the component is 0 with `no_evidence_found`. BLS growth and annual openings are not relabeled as shortage.

## Vacancy methodology v1

Primary definition: distinct job postings over a 90-day period divided by occupation employment stock, expressed per 1,000 workers when a clean numerator and denominator exist.

Intensity bases:

- no evidence = 0
- low = 3
- moderate = 6
- high = 9
- very high = 12

Persistence adds 0 to 3 points.

Source-quality caps:

- official comprehensive = 15
- official partial / validated major source = 12
- government job portal / large job board = 9
- limited or unknown coverage = 6

For US Carpenter, CareerOneStop/NLx supplied broad current listing evidence across multiple states, but not a clean nationally comprehensive distinct 90-day numerator. The v1 fallback therefore applies:

- intensity = low = 3
- repeated-period persistence = +1
- result = 4 / 15

The current listing inventory is explicitly stored with `clean_distinct_90_day_numerator=false` and is not divided by employment as though it were a clean 90-day statistic.

## Live job opportunities

Scoring evidence and user-facing live examples are separate data products.

Two official live examples were stored for the reference implementation:

- New York State Office of Mental Health, `Trades Specialist - Carpenter`, Albany, NY.
- State of Hawaii, `Carpenter I - Oahu`, Oahu, HI.

Each stored opportunity includes title, employer, location, posted date when available, source, listing/apply URL, last checked date, status and occupation relation quality.

The existing foundation entry-point compatibility path also includes these jobs so the current landing can surface practical apply links without treating individual listings as the Vacancy Score numerator.

## Industry Diversity methodology v1

Industry Diversity measures employment resilience rather than current hiring volume.

Country-specific industry categories must first be mapped to comparable broad sectors. HHI is then calculated from employment shares.

Score bands:

- HHI >= 0.60, or top industry >= 75% = 0
- 0.45 to <0.60 = 1
- 0.30 to <0.45 = 2
- 0.20 to <0.30 = 3
- 0.12 to <0.20 = 4
- <0.12 = 5

Normal HHI scoring requires roughly 80% or more usable coverage and comparable broad-sector categories.

The US BLS Carpenter major-share table has 84% published coverage, but the categories mix self-employment status with construction subindustries. CampCareer does not invent a residual/common-sector allocation. The v1 result is therefore 0 with `insufficient_industry_coverage`.

## Entry Accessibility methodology v1

Maximum 15 points:

- education = 0 to 7
- prior related experience = 0 to 3
- training burden before earning/employment = 0 to 5

Training duration alone is not the burden measure. Paid, employment-linked structured training receives materially more credit than multi-year unpaid pre-employment study.

US Carpenter:

- high school diploma or equivalent = 7
- no related work experience = 3
- paid, employment-linked apprenticeship = 4
- total = 14 / 15

This remains a CampCareer proxy. Official BLS inputs are direct, while the point conversion records `proxy_reason`, formula version and evidence quality.

## Visa Accessibility methodology v1

Maximum 10 points:

- occupation-applicable work path = 0 to 3
- employer dependency = 0 to 3
- eligibility burden = 0 to 2
- long-term pathway = 0 to 2

The representative route is the most realistic general overseas-worker route, not simply the most favorable visa.

US Carpenter uses:

- primary representative route: H-2B
- secondary long-term evidence: PERM

US component result:

- occupation applicability = 2
- employer dependency = 1
- eligibility burden = 2
- conditional long-term pathway evidence = 1
- total = 6 / 10

This is an occupation-level structural accessibility score, not a personal immigration eligibility or sponsorship determination.

## Subnational licensing model and Entry Burden

Licensing evidence is now stored by jurisdiction and separates employee requirements from contractor/business requirements.

Reference evidence includes:

- California C-5 Framing and Rough Carpentry Contractor classification.
- New York City Home Improvement Contractor licensing for covered contracting/business activity.
- Federal OSHA Outreach Training, which is retained as safety-training evidence rather than a Carpenter occupational license.

Entry Burden formula:

`5 - geographic scope burden - legal requirement burden - acquisition difficulty burden`

The general employee score is not reduced for contractor-only licensing rules.

No nationwide general employee Carpenter occupational-license requirement was identified in this reference review, so US Carpenter general employee Entry Burden is 5 / 5. Subnational contractor and safety requirements remain visible as evidence and blockers rather than being generalized nationally.

## Employment Momentum, Relative Salary and Projected Growth

These three pilot formulas are carried forward unchanged in v3 so the newly frozen components can be implemented without silently recalibrating the remaining 30 points.

Current formulas:

- Relative Salary: same-country occupation median hourly wage divided by all-occupations median hourly wage; score `clamp(5 + (ratio - 1) × 10, 0, 10)`.
- Projected Growth: occupation projected growth minus same-country all-occupations projected growth; score `clamp(5 + excess_percentage_points / 2, 0, 10)`.
- Employment Momentum: occupation annual-openings/employment intensity divided by the same-country all-occupations openings/employment benchmark; score `clamp(5 + (ratio - 1) × 5, 0, 10)`.

US results remain:

- Employment Momentum = 3.48 / 10
- Relative Salary = 6.88 / 10
- Projected Growth = 5.70 / 10

These formulas still need their separate cross-country methodology freeze before expanding beyond the US Carpenter reference implementation.

## Relational lineage

Relational lineage is promoted to the provenance source of truth. Existing array references remain compatibility/derived fields.

New lineage structures:

- `career_normalized_metric_inputs`
- `career_score_component_metric_inputs`
- `career_score_component_raw_inputs`

The chain is now explicitly queryable:

`official source -> raw observation -> occupation mapping -> normalized metric input -> normalized metric -> score component input -> score component -> score snapshot -> result/read model`

Each relation stores an `input_role`, such as `occupation_value`, `country_benchmark`, `primary_pathway`, `earning_structure` or `fallback_market_evidence`.

This allows both forward explanation and reverse impact analysis when an official observation changes.

## New evidence tables

The v1 methodology adds:

- `career_foundation_licensing_evidence`
- `career_foundation_visa_pathways`
- `career_foundation_job_opportunities`

All have RLS enabled, public read policies for the same foundation read use case, explicit Data API grants, and service-role write grants.

## Read model and landing behavior

Foundation remains authoritative whenever a foundation row exists. Legacy US Carpenter cannot override the foundation result.

The server foundation object now exposes:

- `scoreConfidence`
- component `evidenceStatus`
- normalized metric lineage
- component-to-metric lineage
- component-to-raw lineage
- subnational licensing evidence
- visa pathways
- live job opportunities

The compatibility profile still does not fabricate a clean vacancy count or a five-year employment-growth value. The fallback Vacancy Score remains separate from `vacanciesThreeMonthAvg`.

US Carpenter is now eligible for the foundation ranking path because `decision_ready`, `score_ready` and `publish_ready` are true and the calculated final score exists.

The intended minimal UI state is a numeric score plus evidence confidence, for example `45.06/100 · Estimated`, rather than hiding the score after the methodology review is complete.

## Legacy regression

Legacy data remains regression/reference only.

- US Carpenter legacy score must remain suppressed when foundation exists.
- Australia Registered Nurse has no new foundation row in this work and remains on its existing legacy/reference implementation.
- No second country or occupation was seeded.

## Database validation

Live Supabase validation after migration `career_data_foundation_methodology_v1`:

- latest foundation formula for `US:carpenter`: `career-opportunity-v3-foundation`
- `decision_ready=true`
- `score_ready=true`
- `publish_ready=true`
- `opportunity_score=45.06`
- scored components = 9 of 9
- coverage weight = 100 of 100

The v2 pilot snapshot remains preserved; v3 is a new versioned snapshot.

## Security and database hygiene

The new foundation tables use RLS and explicit read/write grants. The scoring function retains a fixed `search_path = pg_catalog`.

The Supabase security advisor does not report a new warning tied to these new foundation tables/functions. Project-wide pre-existing advisor notices remain outside this scoped implementation.

## Tests

The repository test suite now covers:

- 100-point maxima contract
- shortage severity/scope and no-evidence zero semantics
- vacancy intensity, persistence and source-quality caps
- denominator-free very-high protection
- HHI bands and insufficient-industry-coverage fallback
- deterministic visa rubric
- deterministic Entry Burden formula
- paid employment-linked Entry Accessibility rubric
- US Carpenter component reproduction
- US Carpenter total `45.06`
- raw missing data remains null
- conservative evaluated zero differs from unavailable
- required proxy/fallback explanations
- estimated vs verified score confidence
- relational lineage schema
- subnational licensing separation
- visa pathway model
- scoring-evidence vs live-job separation
- foundation precedence over legacy US Carpenter
- Australia Registered Nurse legacy fallback regression

## Remaining work before a second country or occupation

Do not start AU Carpenter or any other second profile yet.

Before cross-country expansion, finish and validate:

1. CI typecheck, lint, unit tests, build and secret scan for this v3 branch.
2. Minimal landing confidence label so the numeric score visibly communicates `Estimated` versus `Verified`.
3. Separate methodology freeze/review for Employment Momentum, Relative Salary and Projected Growth.
4. Final lineage integrity and reverse-impact DB queries.
5. Final PR/DB regression check confirming AU Registered Nurse remains unchanged.

Only after these pass should the Carpenter cross-country sequence begin.
